const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create a strength workout
router.post("/workouts/strength", async (req, res) => {
  try {
    const workoutData = {
      username: req.body.username,
      workoutId: `${new Date().toISOString().split("T")[0]}#${Date.now()}`,
      type: "strength",
      exercises: req.body.exercises,
      notes: req.body.notes,
    };

    await dynamoDB
      .put({
        TableName: "Workouts",
        Item: workoutData,
      })
      .promise();

    res.json(workoutData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a time-based workout
router.post("/workouts/timebased", async (req, res) => {
  try {
    const workoutData = {
      username: req.body.username,
      workoutId: `${new Date().toISOString().split("T")[0]}#${Date.now()}`,
      type: "time-based",
      activity: req.body.activity,
      duration: req.body.duration,
      distance: req.body.distance,
      notes: req.body.notes,
    };

    await dynamoDB
      .put({
        TableName: "Workouts",
        Item: workoutData,
      })
      .promise();

    res.json(workoutData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all workouts for a user
router.get("/workouts/:username", async (req, res) => {
  try {
    const params = {
      TableName: "Workouts",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": req.params.username,
      },
    };

    const result = await dynamoDB.query(params).promise();
    res.json(result.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
