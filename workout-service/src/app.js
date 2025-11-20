const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/database');
const exercisesRoutes = require('./routes/exercisesRoutes');
const workoutPlanRoutes = require('./routes/workoutPlanRoutes');
const userWorkoutRoutes = require('./routes/userWorkoutRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/', exercisesRoutes);
app.use('/', workoutPlanRoutes);
app.use('/', userWorkoutRoutes);


// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Workouts service running on port ${PORT}`));