import express from "express";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getUserReservations,
  cancelReservation,
} from "../controllers/reservationController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rotas públicas (CRUD completo)
router.get("/", getAllReservations); //✅
router.get("/:id", getReservationById); //✅
router.put("/:id", updateReservation); //✅
router.delete("/:id", deleteReservation); //✅

router.use(authProtect);
router.get("/", getUserReservations); //✅
router.post("/", createReservation); //✅
router.patch("/:id", cancelReservation); //✅

export default router;
