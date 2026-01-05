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

router.get("/", getAllReservations);
router.get("/:id", getReservationById);


router.post("/", authProtect, createReservation);
router.get("/me", authProtect, getUserReservations);
router.patch("/:id", authProtect, cancelReservation);


router.put("/:id", authProtect, updateReservation);
router.delete("/:id", authProtect, deleteReservation);




export default router;
