const express = require('express');
const Goal = require('../models/goal');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = new express.Router();


// CREATE GOAL
router.post('/create', auth, async (req, res) => {
    const renewType = req.body.renewType;
    const renewable = req.body.renewable;
    const numericGoal = req.body.numericGoal;
    const progress = req.body.progress;
    const setNumericGoal = req.body.setNumericGoal;
    const reqGoal = req.body.goal;

    if ((!renewType && renewable) || (renewType && !renewable) || reqGoal.trim().length === 0) {
        return res.status(400).send({ error: "Required fields must be filled out." });
    }

    if ((!numericGoal && setNumericGoal) ||
        (progress == null && setNumericGoal) || 
        (numericGoal && !setNumericGoal) ||
        (progress && !setNumericGoal)) {
        return res.status(400).send({ error: "Required fields must be filled out." });
    }

    if (req.body.numericGoal && req.body.progress) {
        if (req.body.numericGoal <= req.body.progress) {
            return res.status(400).send({ error: "Current progress cannot be greater than or equal to goal." });
        }
    }

    const goal = new Goal({
        ...req.body,
        owner: req.user._id
    });

    try {
        await goal.save();
        res.status(201).send(goal);
    } catch(e) {
        res.status(400).send({ error: "Error." });
    }
});

// GET ALL GOALS FOR LOGGED IN USER
router.get('/get-all', auth, async (req, res) => {
    const match = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    try {
        await req.user.populate({
            path: 'goals',
            match,
            options: {
                limit: parseInt(req.query.limit)
            }
        }).execPopulate();
        const goals = req.user.goals;

        if (!goals || goals.length === 0) {
             return res.status(400).send({ error: 'No goals have been created yet.' });
        }
          
        res.status(200).send(goals);
    } catch(e) {
        res.status(400).send(e);
    }
});

// UPDATE A GOAL and/or TAGS
// Currently allows deadline to be updated an unlimited amount of times -- might change later
router.patch('/update-one/:id', auth, async (req, res) => {
    const renewType = req.body.renewType;
    const renewable = req.body.renewable;
    const numericGoal = req.body.numericGoal;
    const progress = req.body.progress;
    const setNumericGoal = req.body.setNumericGoal;
    const reqGoal = req.body.goal;
    const updates = Object.keys(req.body);
    const fields = [
        'goal', 'deadline', 'renewType', 'renewable',
        'progress', 'numericGoal', 'setNumericGoal',
        'completed', 'favorite', 'reward', 'tags'
    ];
    const isValid = updates.every((update) => fields.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates.' });
    }

    if ((!renewType && renewable) || (renewType && !renewable) || reqGoal.trim().length === 0) {
        return res.status(400).send({ error: "Required fields must be filled out." });
    }

    if ((!numericGoal && setNumericGoal) ||
        (progress == null && setNumericGoal) || 
        (numericGoal && !setNumericGoal) ||
        (progress && !setNumericGoal)) {
        return res.status(400).send({ error: "Required fields must be filled out." });
    }

    if (req.body.numericGoal && req.body.progress) {
        if (req.body.numericGoal <= req.body.progress) {
            return res.status(400).send({ error: "Current progress cannot be greater than or equal to goal." });
        }
    }

    try {
        const goal = await Goal.findOne({ _id: req.params.id, owner: req.user._id });

        if (!goal) {
            return res.status(404).send({ error: 'Task to be updated not found.' });
        }

        updates.forEach((update) => goal[update] = req.body[update]);
        await goal.save();
        res.status(200).send({ message: 'Updated goal successfully.', updatedGoal: goal });
    } catch(e) {
        res.status(400).send({ error: 'Failed to update.' });
    }
});

// DELETE A GOAL
router.delete('/delete-one/:id', auth, async (req, res) => {
    try {
        const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!deletedGoal) {
            return res.status(404).send();
        }

        res.status(200).send({ message: 'Goal succesfully deleted.', deletedGoal: deletedGoal });
    } catch(e) {
        res.status(500).send({ error: 'Failed to delete goal.' });
    }
});

// DELETE ALL GOALS
router.delete('/delete-all', auth, async (req, res) => {
    try {
        const isMatch = await bcrypt.compare(req.body.password, req.user.password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Incorrect Password.' });
        }

        await Goal.deleteMany({ owner: req.user._id });
        res.status(200).send({ message: 'Deleted all goals successfully.' });
    } catch(e) {
        res.status(400).send({ error: 'Delete all goals failed.' });
    }
});


module.exports = router