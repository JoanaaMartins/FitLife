require('dotenv').config(); 
console.log("DEBUG >>> MONGO_URI carregado:", process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// Todas as rotas
app.use('/api/nutrition', require('./routes/foodsRoutes'));
app.use('/api/nutrition', require('./routes/mealsRoutes'));
app.use('/api/nutrition', require('./routes/mealsTemplateRoutes'));
app.use('/api/nutrition', require('./routes/reportsRoutes'));
app.use('/api/nutrition', require('./routes/mealsPlansRoutes')); 

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'nutrition-service' });
});

app.listen(PORT, () => {
  console.log(`Nutrition service running on port ${PORT}`);
});