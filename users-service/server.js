import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import goalRoutes from "./routes/goalRoute.js";
import measurementRoutes from "./routes/measurementRoute.js";
import { loginUser } from "./controllers/userController.js";

dotenv.config();

const app = express();
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const router = express.Router();

app.use(express.json());
app.use(router);

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

router.post("/login", loginUser);

app.use("/users", userRoutes);

app.use("/goals", goalRoutes);

app.use("/measurements", measurementRoutes);

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

app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}/`);
});
