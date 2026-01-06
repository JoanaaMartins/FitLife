const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');
const { authProtect, instructorOnly } = require('../middlewares/authMiddleware');

// get all exercises
router.get('/exercises', exercisesController.getAllExercises); // Get /exercises

// Post a new exercise
router.post('/exercises', authProtect, instructorOnly, exercisesController.createExercise); // Post /exercises

// get exercise by ID
router.get('/exercises/:id', exercisesController.getExerciseById); // Get /exercises/:id

// patch exercise by ID
router.patch('/exercises/:id', authProtect, instructorOnly, exercisesController.updateExerciseById); // Patch /exercises/:id

// delete exercise by ID
router.delete('/exercises/:id', authProtect, instructorOnly, exercisesController.deleteExerciseById); // Delete /exercises/:id

module.exports = router;
