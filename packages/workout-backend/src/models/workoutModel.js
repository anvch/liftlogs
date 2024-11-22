import dynamoDB from "../config/dynamodb.js";

const TABLE_NAME = "Workouts";

// Create a new workout (works for both strength and cardio)
export async function createWorkout(username, workoutData) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const timestamp = Math.floor(now.getTime() / 1000);

  let formattedWorkout;
  if (workoutData.type === "strength") {
    formattedWorkout = {
      name: workoutData.name,
      workoutType: "weights",
      sets: workoutData.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
    };
  } else if (workoutData.type === "cardio") {
    formattedWorkout = {
      name: workoutData.name,
      workoutType: "cardio",
      distance: workoutData.distance,
      time: workoutData.time,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      username: username,
      workoutId: `${date}#${timestamp}`,
      dateCreated: date,
      ...formattedWorkout,
    },
  };

  await dynamoDB.put(params).promise();
  return params.Item;
}

// Add workout to calendar
export async function addToCalendar(username, date, exercises) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      username: username,
      workoutId: `CALENDAR#${date}`,
      workoutType: "calendar",
      exercises: exercises,
      dateScheduled: date,
    },
  };

  await dynamoDB.put(params).promise();
  return params.Item;
}

// Get all workouts for a user (excluding calendar entries)
export async function getWorkouts(username) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "username = :username",
    FilterExpression: "attribute_not_exists(#wtype) OR #wtype <> :calendarType",
    ExpressionAttributeValues: {
      ":username": username,
      ":calendarType": "calendar",
    },
    ExpressionAttributeNames: {
      "#wtype": "workoutType",
    },
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items;
}

// Get a specific workout
export async function getWorkout(username, workoutId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: workoutId,
    },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

// Get workouts by date
export async function getWorkoutsByDate(username, date) {
  // First get the calendar entry for this date
  const calendarParams = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: `CALENDAR#${date}`,
    },
  };

  const calendarResult = await dynamoDB.get(calendarParams).promise();
  const calendarEntry = calendarResult.Item;

  if (!calendarEntry || !calendarEntry.exercises) {
    return {
      date,
      workouts: [],
    };
  }

  // Then get all workouts
  const workouts = await getWorkouts(username);

  // Match calendar exercises with workout details
  const workoutDetails = calendarEntry.exercises
    .map((exerciseName) => workouts.find((w) => w.name === exerciseName))
    .filter((w) => w !== undefined);

  return {
    date,
    workouts: workoutDetails,
  };
}

// Delete a workout
export async function deleteWorkout(username, workoutId) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: workoutId,
    },
  };

  await dynamoDB.delete(params).promise();
  return { message: "Workout deleted successfully" };
}

// Update a workout
export async function updateWorkout(username, workoutId, updateData) {
  const workout = await getWorkout(username, workoutId);
  if (!workout) {
    throw new Error("Workout not found");
  }

  const updateParams = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: workoutId,
    },
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  let updateExpression = [];
  Object.entries(updateData).forEach(([key, value], index) => {
    const attributeName = `#attr${index}`;
    const attributeValue = `:val${index}`;
    updateParams.ExpressionAttributeNames[attributeName] = key;
    updateParams.ExpressionAttributeValues[attributeValue] = value;
    updateExpression.push(`${attributeName} = ${attributeValue}`);
  });

  updateParams.UpdateExpression = "set " + updateExpression.join(", ");

  await dynamoDB.update(updateParams).promise();
  return await getWorkout(username, workoutId);
}
