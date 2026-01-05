import axios from "axios";

export const authProtect = async (req, res, next) => {

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("Token recebido pelo middleware:", token);

    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }

    const response = await axios.get(`http://localhost:3002/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });


    req.user = response.data;

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Authentication service unavailable",
      });
    }

    return res.status(401).json({ error: "Authentication failed" });
  }
};
