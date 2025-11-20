const mongoose = require('mongoose');

const userWorkoutSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    workout_plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WorkoutPlan'
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    kcal_lost_sum: {
        type: Number,
        default: 0
    }

}, { timestamps: false });

module.exports = mongoose.model('UserWorkout', userWorkoutSchema);
