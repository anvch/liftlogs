const dynamoDB = require("../config/dynamodb.js");
const TABLE_NAME = "Workouts";

const WorkoutModel = {
  // Create a new workout (works for both types)
  async createWorkout(username, workoutData) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const timestamp = Math.floor(now.getTime() / 1000);
    
    let formattedWorkout;
    if (workoutData.type === 'strength') {
      formattedWorkout = {
        name: workoutData.name,
        workoutType: 'weights',  // Changed from 'type' to 'workoutType'
        sets: workoutData.sets.map(set => ({
          reps: set.reps,
          weight: set.weight
        }))
      };
    } else if (workoutData.type === 'time-based') {
      formattedWorkout = {
        name: workoutData.name,
        workoutType: 'cardio',  // Changed from 'type' to 'workoutType'
        distance: workoutData.distance,
        time: workoutData.time
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Item: {
        username: username,
        workoutId: `${date}#${timestamp}`,
        ...formattedWorkout,
      }
    };

    await dynamoDB.put(params).promise();
    return params.Item;
  },

  // Add to calendar
  async addToCalendar(username, date, exercises) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        username: username,
        workoutId: `CALENDAR#${date}`,
        workoutType: 'calendar',  // Changed from 'type' to 'workoutType'
        exercise: exercises
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
      FilterExpression: 'attribute_not_exists(#wtype) OR #wtype <> :calendarType',
      ExpressionAttributeValues: {
        ':username': username,
        ':calendarType': 'calendar'
      },
      ExpressionAttributeNames: {
        '#wtype': 'workoutType'  // Use ExpressionAttributeNames to handle reserved word
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
    // First get the calendar entry for this date
    const calendarParams = {
      TableName: TABLE_NAME,
      Key: {
        username: username,
        workoutId: `CALENDAR#${date}`
      }
    };

    const calendarResult = await dynamoDB.get(calendarParams).promise();
    const calendarEntry = calendarResult.Item;

    if (!calendarEntry || !calendarEntry.exercise) {
      return [];
    }

    // Then get all workouts
    const workouts = await this.getWorkouts(username);
    
    // Match calendar exercises with workout details
    const workoutDetails = calendarEntry.exercise.map(exerciseName =>
      workouts.find(w => w.name === exerciseName)
    ).filter(w => w !== undefined);

    return {
      date,
      workouts: workoutDetails
    };
  }
};

module.exports = WorkoutModel;
