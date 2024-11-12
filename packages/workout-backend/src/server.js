const express = require('express');
const { registerUser, loginUser, authenticateUser } = require('./models/authModel');

const app = express();

// Middleware
app.use(express.json());

// Auth routes (unprotected)
app.post("/signup", registerUser);
app.post("/login", loginUser);

// Protected route example from lab
app.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  // In lab example, this just returns success
  res.status(201).send(userToAdd);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;