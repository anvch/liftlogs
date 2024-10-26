// src/config/dynamodb.js
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
module.exports = dynamoDB;

// src/models/workoutModel.js
const dynamoDB = require('../config/dynamodb.js');
const TABLE_NAME = 'Workouts';

const WorkoutModel = {
  // Create a new workout (works for both types)
  async createWorkout(username, workoutData) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const timestamp = Math.floor(now.getTime() / 1000);
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        username: username,
        workoutId: `${date}#${timestamp}`,
        ...workoutData
      }
    };

    await dynamoDB.put(params).promise();
    return params.Item;
  },

  // Get all workouts for a user
  async getWorkouts(username) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items;
  },

  // Get a specific workout
  async getWorkout(username, workoutId) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        username: username,
        workoutId: workoutId
      }
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item;
  },

  // Get workouts by date
  async getWorkoutsByDate(username, date) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'username = :username and begins_with(workoutId, :date)',
      ExpressionAttributeValues: {
        ':username': username,
        ':date': date
      }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items;
  }
};

module.exports = WorkoutModel;

// src/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const WorkoutModel = require('../models/workoutModel');

// Create a strength workout
router.post('/strength', async (req, res) => {
  try {
    const workoutData = {
      type: 'strength',
      exercises: req.body.exercises,
      notes: req.body.notes
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
      activity: req.body.activity,
      duration: req.body.duration,
      distance: req.body.distance,
      notes: req.body.notes
    };

    const workout = await WorkoutModel.createWorkout(req.body.username, workoutData);
    res.json(workout);
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

// src/server.js
const express = require('express');
const cors = require('cors');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});