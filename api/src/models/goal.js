const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Goal is too long.']
    },
    renewType: {
        type: String,
        required: [
            function() { return this.renewable === true },
            'renewType must be set.'
        ],
        enum: [
            'Daily', 'Weekly',
            'Monthly', 'Annually', null
            // 'Other'
        ]
    },
    renewable: {
        type: Boolean,
        required: true,
        default: false,
    },
    // renewEvery: {
    //     type: Number,
    //     required: [
    //         function() { return (this.renewType === 'Other' && this.renewable === true)},
    //         'renewEvery must be set'
    //     ]
    // },
    // renewMetric: {
    //     type: String,
    //     required: [
    //         function() { return (this.renewType === 'Other' && this.renewable === true)},
    //         'renewMetric must be set'
    //     ],
    //     enum: [
    //         'days', 'weeks',
    //         'months', 'years'
    //     ]
    // },
    deadline: {
        type: Date,
        required: false
    },
    progress: {     // current progress
        type: Number,
        required: [
            function() { return this.setNumericGoal === true },
            'progress must be set'
        ],
    },
    numericGoal: {  // number to hit
        type: Number,
        required: [
            function() { return this.setNumericGoal === true },
            'numericGoal must be set'
        ],
    },
    setNumericGoal: {
        type: Boolean,
        required: true,
        default: false,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    reward: {
        type: String,
        required: false,
        trim: true,
        maxlength: [300, 'Reward is too long.']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tags: {
        type: [String],
        validate(values) {
            isValid = values.every((value) => value.length < 25)
            if(!isValid) {
                throw new Error('Tags cannot be longer than 25 characters.')
            }
        }
    },
}, {
    timestamps: true
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal