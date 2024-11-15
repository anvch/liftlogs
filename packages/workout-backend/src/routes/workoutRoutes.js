const express = require("express");
const router = express.Router();
const WorkoutModel = require("../models/workoutModel");
const dynamoDB = require("../config/dynamodb");

// Get all workouts for a user
router.get("/:username", async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const params = {
      TableName: "Workouts",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": req.params.username,
      },
    };

    const result = await dynamoDB.query(params).promise();
    res.status(200).json(result.Items || []);
  } catch (error) {
    console.error("Get workouts error:", error);
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

    const now = new Date();
    const params = {
      TableName: "Workouts",
      Item: {
        username: username,
        workoutId: `${now.toISOString().split("T")[0]}#${now.getTime()}`,
        ...workoutData,
      },
    };

    await dynamoDB.put(params).promise();
    res.status(200).json(params.Item);
  } catch (error) {
    console.error("Create workout error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
