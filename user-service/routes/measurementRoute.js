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
// CREATE
router.post("/", createMeasurement);

// READ
router.get("/", getAllMeasurements);
router.get("/:id", getMeasurementById);

// UPDATE
router.put("/:id", updateMeasurement);

// DELETE
router.delete("/:id", deleteMeasurement);

export default router;
