const express = require('express');
const router = express.Router();
const workoutSessionController = require('../controllers/workoutSessionController');
const { authProtect } = require('../middlewares/authMiddleware');

// Get user's workout history
router.get('/workoutSessions', authProtect, workoutSessionController.getAllUserWorkouts);

// Create a new workout session
router.post('/workoutSessions', authProtect, workoutSessionController.createWorkoutSession);

// Get workout session by ID
router.get('/workoutSessions/:id', authProtect, workoutSessionController.getWorkoutSessionById);

// Delete workout session by ID
router.delete('/workoutSessions/:id', authProtect, workoutSessionController.deleteWorkoutSessionById);

// Delete all workout sessions for the user
router.delete('/workoutSessions', authProtect, workoutSessionController.deleteUserWorkout);

module.exports = router;