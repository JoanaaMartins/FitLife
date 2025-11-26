const UserWorkout = require('../models/userWorkout');
const WorkoutPlan = require('../models/workoutPlan');

// Get all workouts (history) for a specific user
exports.getAllUserWorkouts = async (req, res) => {
    try {
        const { user_id } = req.params;
        const workouts = await UserWorkout.find({ user_id }).select('user_id workout_plan_id date duration kcal_lost_sum progress')
            .populate({
                path: 'workout_plan_id',
                select: 'name goal_type difficulty duration_min exercises',
                populate: {
                    path: 'exercises',
                    select: 'name kcal muscles equipment'
                }
            }).sort({ date: -1 });
        res.json(workouts);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Workout for a specific user
exports.createUserWorkout = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { workout_plan_id, date, duration } = req.body;

        // Fetch the workout plan to calculate total kcal lost
        const workoutPlan = await WorkoutPlan.findById(workout_plan_id).populate('exercises'); // Populate exercises to access their kcal values

        // Check if workout plan exists
        if (!workoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }

        // Calculate Sum of calories per exercise
        let kcal_lost_sum = 0;
        workoutPlan.exercises.forEach(exercise => {
            kcal_lost_sum += exercise.kcal; // kcal per exercise (total sum of calories)
        });

        // Create new UserWorkout
        const newUserWorkout = new UserWorkout({
            user_id,
            workout_plan_id,
            date,
            duration, 
            kcal_lost_sum
        });
        const savedUserWorkout = await newUserWorkout.save(); // Save the new UserWorkout

        const result = await UserWorkout.findById(savedUserWorkout._id).select('user_id workout_plan_id date progress duration kcal_lost_sum'); // Exclude '__v' field and keeps the other including kcal_lost_sum

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get UserWorkout by ID
exports.getUserWorkoutById = async (req, res) => {
    try {
        const userWorkout = await UserWorkout.findById(req.params.id).select('user_id workout_plan_id date duration kcal_lost_sum progress');

        if (!userWorkout) {
            return res.status(404).json({ error: 'User workout not found' });
        }
        res.json(userWorkout);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete UserWorkout by ID
exports.deleteUserWorkoutById = async (req, res) => {
    try {
        const userWorkout = await UserWorkout.findByIdAndDelete(req.params.id);

        if (!userWorkout) {
            return res.status(404).json({ error: 'User workout not found' });
        }
        res.json({ message: 'User workout deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};