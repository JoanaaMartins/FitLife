import express from "express";
import {
  getCurrentUser,
  createUser,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { hashPassword } from "../middlewares/authMiddleware.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// rotas públicas
router.post("/", hashPassword, createUser); //✅
router.get("/", getAllUsers); //apenas tem acesso os instrutores


// rotas protegidas
router.use(authProtect);


router.get("/me", getCurrentUser); //apenas tem acesso o proprio user

router.get("/:id", getUserDetails); // acesso as measurements e goals dos alunos

router.put("/:id", updateUser); // apenas o proprio user e instrutor tem acesso

router.delete("/:id", deleteUser); //apenas o proprio user e instrutor tem acesso

export default router;
