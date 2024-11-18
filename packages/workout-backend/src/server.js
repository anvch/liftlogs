const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  registerUser,
  loginUser,
  authenticateUser,
} = require("./models/authModel");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from frontend
app.use(express.json());

// Auth routes (unprotected)
app.post("/signup", registerUser);
app.post("/login", loginUser);

// Protected route example
app.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  // In lab example, this just returns success
  res.status(201).send(userToAdd);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong!";
  res.status(status).json({ error: message });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
