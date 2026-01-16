const WorkoutPlan = require('../models/workoutPlan');

// Get all workout plans and filter by sessions_per_week and duration_min
exports.getAllWorkoutPlans = async (req, res) => {
  /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.responses[200] = { 
      description: 'Workout Plans found successfully',
      schema: {
        type: "array",
        items: { $ref: "#/definitions/GetWorkoutPlan" }
      }
    }
  */ 
    try {
        const user_id = req.user.id.toString(); // Get user_id from authenticated user
        const { sessions_per_week, duration_min } = req.query;  // Get filters from query parameters
        let filter = { user_id };
        
        // Apply filters if provided
        if (sessions_per_week) {
            filter.sessions_per_week = Number(sessions_per_week);
        }
        if (duration_min) {
            filter.duration_min =  Number(duration_min); // equal to the specified duration_min
        }        

        const workoutPlans = await WorkoutPlan.find(filter).populate('exercises').select('-__v');
        res.json(workoutPlans); // Send the filtered workout plans as response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// Create a new workout plan
exports.createWorkoutPlan = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'New workout plan object',
    required: true,
    schema: { $ref: '#/definitions/CreateWorkoutPlan' }
    }
    #swagger.responses[201] = { description: 'Workout Plan created successfully', schema: {
    $ref: '#/definitions/GetWorkoutPlan'} }
    */
    try {
        const user_id = req.user.id.toString(); // Get user_id from authenticated user
        const { name, goal_type, difficulty, duration_min, sessions_per_week, exercises } = req.body;

        // Create a new workout plan
        const newWorkoutPlan = new WorkoutPlan({
            user_id,
            name,
            goal_type,
            difficulty,
            duration_min,
            sessions_per_week,
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
    /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.responses[200] = { description: 'Workout Plan found successfully', schema: {
    $ref: '#/definitions/GetWorkoutPlan'} } 
    #swagger.responses[404] = { description: 'Workout Plan not found' } 
    */
    try {
        const workoutPlan = await WorkoutPlan.findOne({ _id: req.params.id, user_id: req.user.id }).populate('exercises').select('-__v');
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
    /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'Updated workout plan object',
    required: true,
    schema: { $ref: '#/definitions/CreateWorkoutPlan' }
    }
    #swagger.responses[200] = { description: 'Workout Plan updated successfully', schema: {
    $ref: '#/definitions/GetWorkoutPlan'} } 
    #swagger.responses[404] = { description: 'Workout Plan not found' } 
    */
    try {
        const { name, goal_type, difficulty, duration_min, sessions_per_week, exercises } = req.body;
        const updatedWorkoutPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id }, // Ensure only the owner can update
            { name, goal_type, difficulty, duration_min, sessions_per_week, exercises },
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
    /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.responses[200] = { description: 'Workout Plan deleted successfully' } 
    #swagger.responses[404] = { description: 'Workout Plan not found' } 
    */
    try {
        const deletedWorkoutPlan = await WorkoutPlan.findOneAndDelete({ _id: req.params.id, user_id: req.user.id }); // Only owner can delete
        if (!deletedWorkoutPlan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        res.json({ message: 'Workout plan deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all workout plans for the authenticated user
exports.deleteUserWorkoutPlans = async (req, res) => {
    /*  
    #swagger.tags = ['Workout Plans'] 
    #swagger.responses[200] = { description: 'All Workout Plans deleted successfully' } 
    #swagger.responses[500] = { description: 'Internal server error' }
    */
    try {
        const user_id = req.user.id.toString(); // Use authenticated user
        const result = await WorkoutPlan.deleteMany({ user_id });
        res.json({ message: `${result.deletedCount} workout plans deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};