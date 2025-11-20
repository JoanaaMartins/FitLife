import express from "express";
import {
  createMeasurement,
  getAllMeasurements,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
} from "../controllers/measurementController.js";
import { authProtect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.use(authProtect);

router.post("/", createMeasurement);

router.get("/", getAllMeasurements);

router.get("/:id", getMeasurementById);

router.put("/:id", updateMeasurement);

router.delete("/:id", deleteMeasurement);

export default router;
