const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const workoutRoutes = require('./routes/workoutRoutes');

app.use(cors());
app.use(express.json());
app.use('/api', workoutRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});