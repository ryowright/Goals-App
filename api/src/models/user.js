const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')
const Goal = require('./goal')
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {         // this is the username -- Add name fields later
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password is too short.']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String
    },
    resetToken: {
        type: String,
        default: null
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('goals', {
    ref: 'Goal',
    localField: '_id',
    foreignField: 'owner'
})

// Prevents password and tokens being returned upon get requests
userSchema.methods.toJSON = async function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Creates jwt when user is registered or logs in
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thesearemygoals', { expiresIn: '1 day'})

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// Sends verification email to new users
userSchema.methods.registerNewUser = async function() {
    const user = this
    const hostURL = process.env.HOST_URL

    sgMail.setApiKey(process.env.SENDGRID_TOKEN)

    const msg = {
        to: user.email,
        from: 'ryow.college@gmail.com',
        subject: 'Goals App - verify your email',
        text: `
            Hello ${user.name}, thank you for creating a Goals App account.
            Please copy and paste the address below to verify your account.
            ${hostURL}/api/user/verify-email?token=${user.emailToken}`,
        html: `
            <h1>Hello ${user.name},</h1>
            <p>thank you for creating a Goals App account.</p>
            <p>Please click the link below to verify your account.</p>
            <a href="${hostURL}/api/user/verify-email?token=${user.emailToken}">Verify your account</a>
            <h3>If you did not register this account, please ignore this email.</h3>
            `
    }

    try {
        await sgMail.send(msg);
    } catch(e) {

    }
}

userSchema.methods.sendPasswordReset = async function() {
    const user = this
    const hostURL = process.env.HOST_URL

    sgMail.setApiKey(process.env.SENDGRID_TOKEN)

    const msg = {
        to: user.email,
        from: 'ryow.college@gmail.com',
        subject: 'Goals App - password reset link',
        text: `
            A password reset was requested for your Goals App account.
            If you did not request a password reset, please ignore this
            email. Otherwise, the link below will reset your password.
            ${hostURL}/reset-password/${user.resetToken}`,
        html: `
            <h1>Hello ${user.name},</h1>
            <p>A password reset was requested for your Goals App account.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Otherwise, the link below will reset your password.</p>
            <a href="${hostURL}/reset-password/${user.resetToken}">Reset Password</a>
            `
    }

    sgMail.send(msg).then(() => {
    }).catch((error) => {

    })
}

// Use bcrypt to hash password after changing it
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Goal.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User