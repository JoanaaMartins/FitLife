const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    muscles: [{ 
        type: String,
        enum : {
            values: ['chest', 'back', 'legs', 'arms', 'shoulders', 'core'],
            message: '{VALUE} is not supported'
        }
    }],
    equipment: [{ 
        type: String,
        enum : {
            values: ['none', 'dumbbell', 'barbell', 'machine', 'bodyweight', 'kettlebell', 'resistance band'],
            message: '{VALUE} is not supported'
        }
    }],
    difficulty: [{ 
        type: String,
        enum : {
            values: ['beginner', 'intermediate', 'advanced'],
            messsage: '{VALUE} is not supported'
        } 
    }], 
    video_url: { 
        type: String 
    },
    kcal: {
        type: Number,
        required: true,
        min: 0
    }
}, 
{ timestamps: false });

module.exports = mongoose.model('Exercise', exerciseSchema);