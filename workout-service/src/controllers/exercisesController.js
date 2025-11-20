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
    res.status(201).json(savedExercise);
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