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

// Swagger setup
const swaggerUi = require("swagger-ui-express"); 
const swaggerFile = require("./swagger-output.json"); 
 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); 

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Workouts service running on port ${PORT}`));