const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { 
        type: String, 
        required: true 
    },
    goal_type: {
        type: String,
        enum: {
            values: ['strength', 'endurance', 'flexibility', 'weight loss'],
            message: '{VALUE} is not supported'
        }
    },
    difficulty: {
        type: String,
        enum: {
            values: ['beginner', 'intermediate', 'advanced'],
            message: '{VALUE} is not supported'
        }
    },
    duration_min: {
        type: Number
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise' // Reference to Exercise model
    }]
},  { timestamps: false });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);