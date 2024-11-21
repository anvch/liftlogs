const express = require("express");
const router = express.Router();
const WorkoutModel = require("../models/workoutModel");

// Get all workouts for a user
router.get("/:username", async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const workouts = await WorkoutModel.getWorkouts(req.params.username);
    res.status(200).json(workouts || []);
  } catch (error) {
    console.error("Get workouts error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific workout
router.get("/:username/:workoutId", async (req, res) => {
  try {
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    const workout = await WorkoutModel.getWorkout(
      req.params.username, 
      req.params.workoutId
    );
    
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    console.error("Get workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get workouts by date
router.get("/:username/date/:date", async (req, res) => {
  try {
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    const workouts = await WorkoutModel.getWorkoutsByDate(
      req.params.username, 
      req.params.date
    );
    
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Get workouts by date error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a strength workout
router.post("/strength", async (req, res) => {
  try {
    const username = req.user.username;
    const workoutData = {
      type: "strength",
      name: req.body.name,
      sets: req.body.sets,
    };

    const newWorkout = await WorkoutModel.createWorkout(username, workoutData);
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error("Create strength workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a cardio workout
router.post("/cardio", async (req, res) => {
  try {
    const username = req.user.username;
    const workoutData = {
      type: "cardio",
      name: req.body.name,
      distance: req.body.distance,
      time: req.body.time,
    };

    const newWorkout = await WorkoutModel.createWorkout(username, workoutData);
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error("Create cardio workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add workout to calendar
router.post("/calendar/:date", async (req, res) => {
  try {
    const { exercises } = req.body;
    const result = await WorkoutModel.addToCalendar(
      req.user.username, 
      req.params.date, 
      exercises
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Add to calendar error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a workout
router.put("/:username/:workoutId", async (req, res) => {
  try {
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updatedWorkout = await WorkoutModel.updateWorkout(
      req.params.username,
      req.params.workoutId,
      req.body
    );
    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error("Update workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a workout
router.delete("/:username/:workoutId", async (req, res) => {
  try {
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await WorkoutModel.deleteWorkout(req.params.username, req.params.workoutId);
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Delete workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;