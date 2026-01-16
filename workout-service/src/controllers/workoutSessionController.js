const WorkoutSession = require('../models/workoutSession');
const WorkoutPlan = require('../models/workoutPlan');

// Get all workouts (history) for the authenticated user
exports.getAllUserWorkouts = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Sessions'] 
    #swagger.responses[200] = { 
        description: 'User workout sessions retrieved successfully',
        schema: {
        type: "array",
        items: { $ref: "#/definitions/GetWorkoutSession" }
        }
    }
    */
    try {
        const user_id = req.user.id.toString(); // Get user_id from authenticated user

        const workouts = await WorkoutSession.find({ user_id })
            .select('user_id workout_plan_id date duration kcal_lost_sum')
            .populate({
                path: 'workout_plan_id',
                select: 'name goal_type difficulty duration_min exercises',
                populate: {
                    path: 'exercises',
                    select: 'name kcal muscles equipment'
                }
            })
            .sort({ date: -1 });

        res.json(workouts);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create Workout for the authenticated user
exports.createWorkoutSession = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Sessions'] 
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'New workout session object',
    required: true,
    schema: { $ref: '#/definitions/CreateWorkoutSession' }
    }
    #swagger.responses[201] = { description: 'Workout Session created successfully', schema: {
    $ref: '#/definitions/GetWorkoutSession'} }
    #swagger.responses[404] = { description: 'Workout plan not found' }
    */
    try {
        const user_id = req.user.id.toString(); // Get user_id from authenticated user
        const { workout_plan_id, date, duration } = req.body;

        // Fetch the workout plan to calculate total kcal lost
        const workoutPlan = await WorkoutPlan.findById(workout_plan_id).populate('exercises');

        // Check if workout plan exists
        if (!workoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }

        // Calculate Sum of calories per exercise
        let kcal_lost_sum = 0;
        workoutPlan.exercises.forEach(exercise => {
            kcal_lost_sum += exercise.kcal;
        });

        // Create new WorkoutSession
        const newWorkoutSession = new WorkoutSession({
            user_id,
            workout_plan_id,
            date,
            duration,
            kcal_lost_sum
        });

        const savedWorkoutSession = await newWorkoutSession.save();

        const result = await WorkoutSession.findById(savedWorkoutSession._id)
            .select('user_id workout_plan_id date duration kcal_lost_sum');

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get WorkoutSession by ID (only if it belongs to the user)
exports.getWorkoutSessionById = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Sessions'] 
    #swagger.responses[200] = { 
        description: 'Workout session deleted successfully' 
    } 
    #swagger.responses[404] = { description: 'Workout session not found' } 
    */ 
    try {
        const workoutSession = await WorkoutSession.findOne({
            _id: req.params.id,
            user_id: req.user.id
        }).select('user_id workout_plan_id date duration kcal_lost_sum');

        if (!workoutSession) {
            return res.status(404).json({ error: 'Workout session not found' });
        }

        res.json(workoutSession);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete WorkoutSession by ID (only if it belongs to the user)
exports.deleteWorkoutSessionById = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Sessions'] 
    #swagger.responses[200] = { description: 'Workout session deleted successfully' } 
    #swagger.responses[404] = { description: 'Workout session not found' } 
    */
    try {
        const workoutSession = await WorkoutSession.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.id
        });

        if (!workoutSession) {
            return res.status(404).json({ error: 'Workout session not found' });
        }

        res.json({ message: 'Workout session deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all WorkoutSessions for the authenticated user
exports.deleteUserWorkout = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Sessions'] 
    #swagger.responses[200] = { description: 'All workout sessions deleted successfully' } 
    #swagger.responses[500] = { description: 'Internal server error' }
    */
    try {
        const user_id = req.user.id.toString(); // Get user_id from authenticated user
        const result = await WorkoutSession.deleteMany({ user_id });

        res.json({ message: `${result.deletedCount} workout sessions deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};