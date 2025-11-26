const express = require('express');
const router = express.Router();
const userWorkoutController = require('../controllers/userWorkoutController');

// Get user's workout history
// Route to create a new user workout
router.get('/users/:user_id/workouts', userWorkoutController.getAllUserWorkouts); // Get /users/:user_id/workouts
router.post('/users/:user_id/workouts', userWorkoutController.createUserWorkout); // Post /users/:user_id/workouts
router.get('/users/:user_id/workouts/:id', userWorkoutController.getUserWorkoutById); // Get /users/:user_id/workouts/:id
router.delete('/users/:user_id/workouts/:id', userWorkoutController.deleteUserWorkoutById); // Delete /users/:user_id/workouts/:id 

module.exports = router;