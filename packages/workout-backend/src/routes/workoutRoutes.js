// src/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const WorkoutModel = require('../models/workoutModel');

// Create a strength workout
router.post('/strength', async (req, res) => {
  try {
    const workoutData = {
      type: 'strength',
      name: req.body.name,
      sets: req.body.sets
    };

    const workout = await WorkoutModel.createWorkout(req.body.username, workoutData);
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a time-based workout
router.post('/timebased', async (req, res) => {
  try {
    const workoutData = {
      type: 'time-based',
      name: req.body.name,
      time: req.body.time,
      distance: req.body.distance
    };

    const workout = await WorkoutModel.createWorkout(req.body.username, workoutData);
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to calendar
router.post('/calendar', async (req, res) => {
  try {
    const result = await WorkoutModel.addToCalendar(
      req.body.username,
      req.body.date,
      req.body.exercises
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all workouts for a user
router.get('/:username', async (req, res) => {
  try {
    const workouts = await WorkoutModel.getWorkouts(req.params.username);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific workout
router.get('/:username/:workoutId', async (req, res) => {
  try {
    const workout = await WorkoutModel.getWorkout(
      req.params.username,
      req.params.workoutId
    );
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workouts by date
router.get('/:username/date/:date', async (req, res) => {
  try {
    const workouts = await WorkoutModel.getWorkoutsByDate(
      req.params.username,
      req.params.date
    );
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;