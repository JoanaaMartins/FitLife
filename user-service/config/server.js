import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoute.js";
import goalRoutes from "../routes/goalRoute.js";
import measurementRoutes from "../routes/measurementRoute.js";
import sequelize from "./connect.js"; 

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/goals", goalRoutes);
app.use("/measurements", measurementRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});


sequelize.sync({ alter: true }) 
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Erro ao sincronizar o banco de dados:", err);
  });
