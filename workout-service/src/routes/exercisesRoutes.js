const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// get all exercises
router.get('/exercises', exercisesController.getAllExercises); // Get /exercises
// Post a new exercise
router.post('/exercises', exercisesController.createExercise); // Post /exercises
// get exercise by ID
router.get('/exercises/:id', exercisesController.getExerciseById); // Get /exercises/:id
// delete exercise by ID
router.delete('/exercises/:id', exercisesController.deleteExerciseById); // Delete /exercises/:id

module.exports = router;