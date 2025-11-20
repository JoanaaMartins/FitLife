const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// Route to get all exercises
router.get('/exercises', exercisesController.getAllExercises); // Get /exercises

// Post a new exercise
router.post('/exercises', exercisesController.createExercise); // Post /exercises

module.exports = router;