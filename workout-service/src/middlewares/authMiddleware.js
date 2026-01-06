const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Middleware to protect routes
exports.authProtect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Not authorized, invalid token" });
    }
};

// Middleware to allow only instructors
exports.instructorOnly = (req, res, next) => {
  if (!req.user || req.user.role.toLowerCase() !== 'instructor') {
    return res.status(403).json({ error: 'Instructor access only' });
  }
  next();
};
