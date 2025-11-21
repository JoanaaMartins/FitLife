import { validateUser, generateToken } from "../middlewares/authMiddleware.js";
import db from "../models/db.js";


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.User.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email", "role"],
      include: req.user.role === "user" ? [
        {
          model: db.Measurement,
          attributes: ["date", "weight_kg", "height_cm", "body_fat_pct"],
        },
        {
          model: db.Goal,
          attributes: ["type", "target_value", "unit", "target_date", "status"],
        },
      ] : [], // instrutores não têm medidas/goals
    });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({
      name: user.name,
      email: user.email,
      measurements: user.Measurements || [],
      goals: user.Goals || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Rota para instrutores verem medidas e metas de um aluno pelo ID
export const getUserDetails = async (req, res) => {
  try {
    // Só instrutores podem acessar
    if (req.user.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id } = req.params;

    // Buscar aluno pelo ID
    const student = await db.User.findOne({
      where: { id, role: "user" },
      attributes: ["id", "name", "email"], // apenas esses campos do usuário
      include: [
        {
          model: db.Measurement,
          attributes: ["date", "weight_kg", "height_cm", "body_fat_pct"],
        },
        {
          model: db.Goal,
          attributes: ["type", "target_value", "unit", "target_date", "status"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    // Montar JSON final com apenas os campos desejados
    res.json({
      id: student.id,
      name: student.name,
      email: student.email,
      measurements: student.Measurements,
      goals: student.Goals,
    });
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
