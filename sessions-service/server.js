import express from "express";
import dotenv from "dotenv";
import classRoutes from "./routes/classRoute.js";
import instructorRoutes from "./routes/instructorRoute.js";
import reservationRoutes from "./routes/reservationRoute.js";
import { connectRabbitMQ } from "./rabbitmq/producer.js"; 
import db from "./models/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST || "0.0.0.0";

app.use(express.json());

// Swagger setup
import * as swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile)); 

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const diffSeconds = (Date.now() - start) / 1000;
    console.log(
      `Request: ${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`
    );
  });
  next();
});

app.use("/classes", classRoutes);

app.use("/instructors", instructorRoutes);

app.use("/reservations", reservationRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: `The requested resource was not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.type === "entity.parse.failed")
    return res.status(400).json({
      error: "Invalid JSON payload! Check if your body data is a valid JSON.",
    });

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "SequelizeDatabaseError") {
    if (err.original.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
      return res.status(400).json({
        error: "Invalid value for enumerated field",
        message: err.message,
      });
    }
    if (err.original.code === "ER_BAD_NULL_ERROR") {
      return res.status(400).json({
        error: "Missing mandatory field",
        message: err.message,
      });
    }
    if (err.original.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Duplicate entry",
        message: err.message,
      });
    }
  }

  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const startServer = async () => {
  try {
    await connectRabbitMQ();

    
    await db.sequelize.sync({force:true}); //cria todas as tabelas automaticamente
    console.log("Database synced successfully");

    app.listen(port, host, () => {
      console.log(`App listening at http://${host}:${port}/`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


