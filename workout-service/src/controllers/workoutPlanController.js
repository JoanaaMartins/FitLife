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

// Get workout plan by ID
exports.getWorkoutPlanById = async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id).populate('exercises').select('-__v');
        if (!workoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        res.json(workoutPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update workout plan by ID
exports.updateWorkoutPlanById = async (req, res) => {
    try {
        const { name, goal_type, difficulty, duration_min, exercises } = req.body;
        const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            { name, goal_type, difficulty, duration_min, exercises },
            { new: true }
        ).populate('exercises').select('-__v');
        if (!updatedWorkoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        res.json(updatedWorkoutPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete workout plan by ID
exports.deleteWorkoutPlanById = async (req, res) => {
    try {
        const deletedWorkoutPlan = await WorkoutPlan.findByIdAndDelete(req.params.id);
        if (!deletedWorkoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        res.json({ message: 'Workout plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
