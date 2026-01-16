const Exercise = require('../models/exercises');

// Get all exercises
exports.getAllExercises = async (req, res) => {
  /*  
    #swagger.tags = ['Exercises'] 
    #swagger.responses[200] = { 
      description: 'Exercises found successfully',
      schema: {
        type: "array",
        items: { $ref: "#/definitions/GetExercise" }
      }
    }
  */
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

// Create a new exercise
exports.createExercise = async (req, res) => {
  /*  
    #swagger.tags = ['Exercises'] 
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'New exercise object',
    required: true,
    schema: { $ref: '#/definitions/CreateExercise' } 
    }
    #swagger.responses[201] = { description: 'Exercise created successfully', schema: {
    $ref: '#/definitions/GetExercise'} }
  */
  try {
    const { name, muscles, equipment, kcal } = req.body;
    const newExercise = new Exercise({
      name,
      muscles,
      equipment,
      kcal
    });
    const savedExercise = await newExercise.save();

    const result = await Exercise.findById(savedExercise._id).select('-__v');
    res.status(201).json(result);
  }
  catch (err) {
    res.status(500).json({ error: err.message });

  }
};

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  /*  
    #swagger.tags = ['Exercises'] 
    #swagger.responses[200] = { description: 'Exercise found successfully', schema: {
    $ref: '#/definitions/GetExercise'} } 
    #swagger.responses[404] = { description: 'Exercise not found' } 
  */
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update exercise by ID
exports.updateExerciseById = async (req, res) => {
  /*
    #swagger.tags = ['Exercises']
    #swagger.parameters['body'] = { 
    in: 'body',
    description: 'Update an Exercise',
    required: true,
    schema: { $ref: '#/definitions/CreateExercise' }
    }
    #swagger.responses[200] = { description: 'Exercise updated successfully', schema: {
    $ref: '#/definitions/GetExercise'} }
    #swagger.responses[404] = { description: 'Exercise not found' }
  */
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(updatedExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// Delete exercise by ID
exports.deleteExerciseById = async (req, res) => {
  /*  
    #swagger.tags = ['Exercises'] 
    #swagger.responses[200] = { description: 'Exercise deleted successfully' } 
    #swagger.responses[404] = { description: 'Exercise not found' } 
  */
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};