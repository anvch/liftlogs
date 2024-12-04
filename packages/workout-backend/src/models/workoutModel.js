import dynamoDB from "../config/dynamodb.js";

const TABLE_NAME = "Workouts";

// Create a new workout (supports presets)
export async function createWorkout(username, workoutData) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const timestamp = Math.floor(now.getTime() / 1000);

  const isPreset = workoutData.isPreset || false; // Default to false

  let formattedWorkout;
  if (workoutData.workoutType === "weights") {
    formattedWorkout = {
      name: workoutData.name,
      workoutType: "weights",
      sets: workoutData.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
      isPreset,
    };
  } else if (workoutData.workoutType === "cardio") {
    formattedWorkout = {
      name: workoutData.name,
      workoutType: "cardio",
      distance: workoutData.distance,
      time: workoutData.time,
      isPreset,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      username: username,
      workoutId: `${date}_${timestamp}`,
      dateCreated: date,
      ...formattedWorkout,
    },
  };

  await dynamoDB.put(params).promise();
  return params.Item;
}

// Get all preset workouts
export async function getPresets(username) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "username = :username",
    FilterExpression: "#isPreset = :trueValue",
    ExpressionAttributeValues: {
      ":username": username,
      ":trueValue": true,
    },
    ExpressionAttributeNames: {
      "#isPreset": "isPreset",
    },
  };

  const result = await dynamoDB.query(params).promise();
  return result.Items;
}

// Add or update a calendar entry for a specific date
export async function addToCalendar(username, date, workoutIds) {
  const calendarId = `CALENDAR_${date}`;

  const existingEntryParams = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: calendarId,
    },
  };

  const existingEntryResult = await dynamoDB.get(existingEntryParams).promise();
  const existingEntry = existingEntryResult.Item;
  if (existingEntry) {
    const updatedWorkouts = [...existingEntry.workouts, ...workoutIds];

    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        username: username,
        workoutId: calendarId,
      },
      UpdateExpression: "SET workouts = :workouts",
      ExpressionAttributeValues: {
        ":workouts": updatedWorkouts,
      },
    };

    await dynamoDB.update(updateParams).promise();
    return { ...existingEntry, workouts: updatedWorkouts };
  }

  const newEntryParams = {
    TableName: TABLE_NAME,
    Item: {
      username: username,
      workoutId: calendarId,
      workoutType: "calendar",
      dateScheduled: date,
      workouts: workoutIds,
    },
  };

  await dynamoDB.put(newEntryParams).promise();
  return newEntryParams.Item;
}

// Get all workouts for a user (excludes calendar entries)
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

// Get a specific workout by ID
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

// Get workouts scheduled for a specific date
// includes the full information
export async function getWorkoutsByDate(username, date) {
  const calendarParams = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
      workoutId: `CALENDAR_${date}`,
    },
  };

  const calendarResult = await dynamoDB.get(calendarParams).promise();
  const calendarEntry = calendarResult.Item;
  if (!calendarEntry || !calendarEntry.workouts) {
    return { date, workouts: [] };
  }

  const workoutDetails = await Promise.all(
    calendarEntry.workouts.map((workoutId) => getWorkout(username, workoutId)),
  );

  return {
    date,
    workouts: workoutDetails.filter(Boolean),
  };
}

// Get workouts for a specific month and year
// Combines some useful things, returns a list of objects with date and workouts field
// the workouts have the full info, not just the ID's
export async function getWorkoutsForMonth(username, year, month) {
  const monthPrefix = `${year}-${month.toString().padStart(2, "0")}`; // e.g., "2024-11"

  // Step 1: Query calendar entries for the month
  const calendarParams = {
    TableName: TABLE_NAME,
    KeyConditionExpression:
      "username = :username AND begins_with(workoutId, :monthPrefix)",
    ExpressionAttributeValues: {
      ":username": username,
      ":monthPrefix": `CALENDAR_${monthPrefix}`,
    },
  };

  const calendarResults = await dynamoDB.query(calendarParams).promise();
  const calendarEntries = calendarResults.Items;
  if (!calendarEntries || calendarEntries.length === 0) {
    return []; // No workouts for the month
  }

  // Step 2: Fetch full workout details for all workouts in the month
  const workoutIds = calendarEntries.flatMap((entry) => entry.workouts);
  const uniqueWorkoutIds = [...new Set(workoutIds)]; // Avoid duplicate queries

  const workoutDetails = await Promise.all(
    uniqueWorkoutIds.map((workoutId) => getWorkout(username, workoutId)),
  );

  // Step 3: Combine calendar entries with full workout details
  const workoutsByDate = calendarEntries.map((entry) => {
    const workouts = entry.workouts
      .map((workoutId) =>
        workoutDetails.find((w) => w && w.workoutId === workoutId),
      )
      .filter(Boolean);

    return {
      date: entry.dateScheduled,
      workouts,
    };
  });

  return workoutsByDate;
}

// Delete a workout and clean up calendar references
export async function deleteWorkout(username, workoutId) {
  // Step 1: Clean calendar entries referencing this workout
  const calendarEntries = await dynamoDB
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression:
        "username = :username AND begins_with(workoutId, :prefix)",
      ExpressionAttributeValues: {
        ":username": username,
        ":prefix": "CALENDAR",
      },
    })
    .promise();

  for (const entry of calendarEntries.Items) {
    const updatedWorkouts = entry.workouts.filter((id) => id !== workoutId);

    if (updatedWorkouts.length < entry.workouts.length) {
      await dynamoDB
        .update({
          TableName: TABLE_NAME,
          Key: { username: entry.username, workoutId: entry.workoutId },
          UpdateExpression: "SET workouts = :workouts",
          ExpressionAttributeValues: { ":workouts": updatedWorkouts },
        })
        .promise();
    }
  }

  // Step 2: Delete the workout
  const params = {
    TableName: TABLE_NAME,
    Key: { username: username, workoutId: workoutId },
  };

  await dynamoDB.delete(params).promise();
  return { message: "Workout and calendar references deleted successfully" };
}

// Update a workout by ID
// this updates the "preset" or workout itself, but because the calendar is
// based on workoutId's this updates everywhere that this workout is referenced
export async function updateWorkout(username, workoutId, updateData) {
  const workout = await getWorkout(username, workoutId);
  if (!workout) throw new Error("Workout not found");

  const updateParams = {
    TableName: TABLE_NAME,
    Key: { username: username, workoutId: workoutId },
    UpdateExpression: "SET",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  const updateExpression = [];
  Object.entries(updateData).forEach(([key, value], index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateParams.ExpressionAttributeNames[attrName] = key;
    updateParams.ExpressionAttributeValues[attrValue] = value;
    updateExpression.push(`${attrName} = ${attrValue}`);
  });

  updateParams.UpdateExpression = "SET " + updateExpression.join(", ");

  await dynamoDB.update(updateParams).promise();
  return getWorkout(username, workoutId);
}
