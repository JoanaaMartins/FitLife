const WorkoutPlan = require('../models/workoutPlan');

// Get all workout plans
exports.getAllWorkoutPlans = async (req, res) => {
    try {
        const { user_id } = req.params;
        const workoutPlans = await WorkoutPlan.find({ user_id: user_id }).populate('exercises').select('-__v');
                    
        res.json(workoutPlans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new workout plan
exports.createWorkoutPlan = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, goal_type, difficulty, duration_min, exercises } = req.body;

        // Create a new workout plan
        const newWorkoutPlan = new WorkoutPlan({
            user_id,
            name,
            goal_type,
            difficulty,
            duration_min,
            exercises
        });

        // Save the new workout plan
        const savedWorkoutPlan = (await newWorkoutPlan.save());

        // Populate exercises and removes '__v' before sending response
        const result = await WorkoutPlan.findById(savedWorkoutPlan._id).select('-__v').populate('exercises', '-__v');

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};