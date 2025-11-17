require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/nutrition', require('./routes/nutritionRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'nutrition-service' });
});

app.listen(PORT, () => {
  console.log(`Nutrition service running on port ${PORT}`);
});
