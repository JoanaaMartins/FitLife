import express from "express";
import {
  getCurrentUser,
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { hashPassword } from "../middlewares/authMiddleware.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", hashPassword, createUser); //✅

router.post("/login", loginUser); //✅

router.get("/", getAllUsers); //✅

router.use(authProtect);

router.get("/me", getCurrentUser); //✅


router.get("/:id", getUserById); //✅

router.put("/:id", updateUser); //✅

router.delete("/:id", deleteUser); //✅

export default router;
