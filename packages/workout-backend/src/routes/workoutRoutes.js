const express = require('express');
const router = express.Router();
const WorkoutModel = require('../models/workoutModel');

router.post('/workouts', async (req, res) => {
  try {
    const workout = await WorkoutModel.createWorkout(req.body);
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/workouts/:userId', async (req, res) => {
  try {
    const workouts = await WorkoutModel.getWorkoutsByUser(req.params.userId);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;