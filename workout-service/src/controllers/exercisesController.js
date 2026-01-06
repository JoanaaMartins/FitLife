const Exercise = require('../models/exercises');

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

// Create a new exercise
exports.createExercise = async (req, res) => {
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