import { validateUser, generateToken } from "../middlewares/authMiddleware.js";
import db from "../models/db.js";


export const getCurrentUser = async (req, res) => {
  try {

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await validateUser(email, password);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, gender, birth_date, role } = req.body;
    const user = await db.User.create({
      name,
      email,
      password,
      gender,
      birth_date,
      role,
    });

    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
  
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.id !== user.id && req.user.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.id !== user.id && req.user.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.id !== user.id && req.user.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
