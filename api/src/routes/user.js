// USER ROUTES
const User = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const router = new express.Router();

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            return res.status(401).send({ error: 'Incorrect Username and/or Password.' });
        }

        if (!user.isVerified) {
            return res.status(400).send({ error: 'User is not yet verified. Please verify the email associated with this account before attempting to login.' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Incorrect Username and/or Password.' });
        }

        const token = await user.generateAuthToken();
        res.status(200).send({ message: 'Login successful!', user, token });
    } catch (e) {
        res.status(500).send({ message: 'Error fetching user from database.' });
    }
})

// LOGOUT
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = [];   // functionality of logout all
        // req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();

        res.status(200).send({ message: 'Logout successful.' });
    } catch(e) {
        res.status(500).send();
    }
})


// LOGOUT ALL INSTANCES OF A USER
router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ message: 'Logout all successful.' });
    } catch(e) {
        res.status(500).send();
    }
})

// REGISTER
router.post('/register', async (req, res) => {
    const user = new User({
        ...req.body,
        isVerified: false,
        emailToken: crypto.randomBytes(64).toString('hex')
    });

    try {
        const duplicateUsername = await User.findOne({ name: req.body.name });
        const duplicateEmail = await User.findOne({ email: req.body.email });

        if (duplicateUsername) {
            return res.status(400).send({ error: 'Username already taken.' });
        }
        
        if (duplicateEmail) {
            return res.status(400).send({ error: 'There is already an account registered with this email.' });
        }

        if (!validator.isEmail(req.body.email)) {
            return res.status(400).send({ error: 'Invalid email address.' });
        }

        if (req.body.password.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long.' });
        }

        await user.registerNewUser();
        await user.save();

        res.status(201).send({ message: 'Verification email has been sent.' }); // REMOVE LATER
    } catch (e) {
        res.status(400).send('register failed');
    }
})

// VERIFY EMAIL
router.get('/verify-email', async (req, res) => {
    try {
        const user = await User.findOne({ emailToken: req.query.token });
        if (!user) {
            return res.status(404).send();
        }

        user.emailToken = null;
        user.isVerified = true;
        await user.save();
        // res.status(201).send({ message: 'Successfully registered!', user, token })
        res.status(201).send('verify email success');
    } catch(e) {
        res.status(400).send('verify email failed');
    }
})

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const user = await User.findOne({ resetToken: req.body.resetToken });
        if (!user) {
            return res.status(404).send();
        }

        if (req.body.password.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long.' });
        }

        user.resetToken = null;
        user.password = req.body.password;

        await user.save();
        res.status(200).send();
    } catch (e) {
        res.status(400).send('Password reset failed.');
    }
})

// SEND RESET PASSWORD EMAIL
router.post('/reset-password-email', async (req, res) => {
    try {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).send({ error: 'Invalid email address.' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ error: 'This email address does not exist in our database.' });
        }

        user.resetToken = crypto.randomBytes(64).toString('hex');
        await user.save();
        await user.sendPasswordReset();
        res.status(200).send({ message: 'Password reset email has been sent.' });
    } catch(e) {
        res.status(400).send('Password reset email failed.');
    }
})

// GET MY PROFILE
router.get('/me', auth, async (req, res) => {  
    res.status(200).send({
        name: req.user.name,
        email: req.user.email,
    });
});

// UPDATE USER CREDENTIALS
router.patch('/update', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const fields = ['name', 'email', 'password', 'oldPassword'];
    const isValid = updates.every((update) => fields.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        if (updates.includes('password')) {
            if (!req.body.oldPassword) {
                return res.status(401).send({ error: 'The old password must be entered before updating to a new one.' })
            }

            const isMatch = await bcrypt.compare(req.body.oldPassword, req.user.password);

            if (!isMatch) {
                return res.status(401).send({ error: 'Incorrect Password.' });
            }
        }

        updates.forEach((update) => {
            if (update !== 'oldPassword') {
                req.user[update] = req.body[update]
            }});
        await req.user.save();
        res.status(200).send(req.user);
    } catch(e) {
        res.status(400).send();
    }
})

// DELETE MY ACCOUNT
router.delete('/me', auth, async (req, res) => {
    try {
        const isMatch = await bcrypt.compare(req.body.password, req.user.password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Incorrect Password.' });
        }

        await req.user.remove();
        res.send({ message: "Account successfully deleted." });
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router