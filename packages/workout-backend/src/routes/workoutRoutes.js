import express from "express";
import * as WorkoutModel from "../models/workoutModel.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

/**
 * Fetch all workouts (excluding calendar entries).
 */
router.get("/workouts", async (req, res) => {
  try {
    const workouts = await WorkoutModel.getWorkouts(req.user.username);
    res.status(200).json(workouts || []);
  } catch (error) {
    console.error(
      `Error fetching workouts for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while fetching workouts. Please try again later.",
    });
  }
});

/**
 * Fetch a specific workout by ID.
 */
router.get("/workouts/:id", async (req, res) => {
  try {
    const workout = await WorkoutModel.getWorkout(
      req.user.username,
      req.params.id,
    );
    if (!workout) {
      console.warn(
        `Workout ID ${req.params.id} not found for user ${req.user.username}.`,
      );
      return res.status(404).json({ error: "Workout not found." });
    }
    res.status(200).json(workout);
  } catch (error) {
    console.error(
      `Error fetching workout ID ${req.params.id} for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while fetching the workout. Please try again later.",
    });
  }
});

/**
 * Create a new workout (strength or cardio).
 */
router.post("/workouts", async (req, res) => {
  try {
    const { workoutType, name, sets, distance, time, isPreset } = req.body;

    if (!workoutType || !name) {
      console.warn(
        "Workout creation failed due to missing type or name in request body.",
      );
      return res
        .status(400)
        .json({ error: "Workout type and name are required." });
    }

    const workoutData = { workoutType, name, sets, distance, time, isPreset };
    const newWorkout = await WorkoutModel.createWorkout(
      req.user.username,
      workoutData,
    );

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error(
      `Error creating workout for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while creating the workout. Please try again later.",
    });
  }
});

/**
 * Update a specific workout by ID.
 */
router.put("/workouts/:id", async (req, res) => {
  try {
    const updatedWorkout = await WorkoutModel.updateWorkout(
      req.user.username,
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedWorkout);
  } catch (error) {
    if (error.message === "Workout not found") {
      console.warn(
        `Update failed: Workout ID ${req.params.id} not found for user ${req.user.username}.`,
      );
      return res.status(404).json({ error: "Workout not found." });
    }
    console.error(
      `Error updating workout ID ${req.params.id} for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while updating the workout. Please try again later.",
    });
  }
});

/**
 * Delete a specific workout by ID.
 */
router.delete("/workouts/:id", async (req, res) => {
  try {
    await WorkoutModel.deleteWorkout(req.user.username, req.params.id);
    res.status(200).json({ message: "Workout deleted successfully." });
  } catch (error) {
    console.error(
      `Error deleting workout ID ${req.params.id} for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while deleting the workout. Please try again later.",
    });
  }
});

/**
 * Fetch preset workouts.
 */
router.get("/presets", async (req, res) => {
  try {
    const presets = await WorkoutModel.getPresets(req.user.username);
    res.status(200).json(presets || []);
  } catch (error) {
    console.error(
      `Error fetching presets for user ${req.user.username}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while fetching presets. Please try again later.",
    });
  }
});

/**
 * Fetch workouts for a specific month.
 */
router.get("/calendar/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    const workouts = await WorkoutModel.getWorkoutsForMonth(
      req.user.username,
      parseInt(year),
      parseInt(month),
    );
    res.status(200).json(workouts);
  } catch (error) {
    console.error(
      `Error fetching workouts for user ${req.user.username} for ${req.params.year}-${req.params.month}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while fetching monthly workouts. Please try again later.",
    });
  }
});

/**
 * Fetch workouts for a specific date.
 */
router.get("/calendar/:year/:month/:day", async (req, res) => {
  try {
    const { year, month, day } = req.params;

    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const workouts = await WorkoutModel.getWorkoutsByDate(
      req.user.username,
      date,
    );

    res.status(200).json(workouts);
  } catch (error) {
    console.error(
      `Error fetching workouts for user ${req.user.username} for date ${req.params.year}-${req.params.month}-${req.params.day}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while fetching daily workouts. Please try again later.",
    });
  }
});

/**
 * Add workouts to a specific date in the calendar.
 */
router.post("/calendar/:year/:month/:day", async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const { workouts } = req.body;
    if (!Array.isArray(workouts) || workouts.length === 0) {
      console.warn(
        "Failed to add workouts to calendar: Workouts array is missing or empty.",
      );
      return res.status(400).json({ error: "Workouts array is required." });
    }

    const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const result = await WorkoutModel.addToCalendar(
      req.user.username,
      date,
      workouts,
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(
      `Error adding workouts to calendar for user ${req.user.username} on ${req.params.year}-${req.params.month}-${req.params.day}:`,
      error.message,
    );
    res.status(500).json({
      error:
        "An error occurred while adding workouts to the calendar. Please try again later.",
    });
  }
});

export default router;
