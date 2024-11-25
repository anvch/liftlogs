import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { registerUser, loginUser } from "./models/authModel.js";
import workoutRoutes from "./routes/workoutRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes (unprotected)
app.post("/signup", registerUser);
app.post("/login", loginUser);

// Workout routes (protected)
app.use("/api", workoutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
