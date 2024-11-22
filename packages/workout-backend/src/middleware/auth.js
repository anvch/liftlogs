import { verifyToken } from "../models/authModel.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Add user info to request
    req.user = { username: decoded.username };

    // Debug log
    console.log("Authenticated user:", req.user);

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticateUser;