const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/database');
const exercisesRoutes = require('./src/routes/exercisesRoutes');
const workoutPlanRoutes = require('./src/routes/workoutPlanRoutes');
const workoutSessionRoutes = require('./src/routes/workoutSessionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/', exercisesRoutes);
app.use('/', workoutPlanRoutes);
app.use('/', workoutSessionRoutes);


// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Workouts service running on port ${PORT}`));