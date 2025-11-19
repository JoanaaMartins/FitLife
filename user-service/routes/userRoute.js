import express from "express";
import {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { hashPassword } from "../middleware/authMiddleware.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", hashPassword, createUser);
router.post("/login", loginUser);

router.use(authProtect);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
