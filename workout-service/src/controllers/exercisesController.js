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