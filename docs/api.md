Below is the description of the **DynamoDB schemas** used in the backend

---

### **Workouts Table**

- **Table Name**: `Workouts`
- This table stores both workouts (strength/cardio) and calendar entries. The `workoutType` attribute differentiates between workouts and calendar entries.

#### **Attributes**

| Attribute          | Type      | Description                                                                                   |
|--------------------|-----------|-----------------------------------------------------------------------------------------------|
| `username`         | `String`  | The user's unique username (partition key).                                                   |
| `workoutId`        | `String`  | The unique ID of the workout or calendar entry (sort key).                                    |
| `name`             | `String`  | Name of the workout (e.g., "Bench Press", "Running").                                         |
| `workoutType`      | `String`  | Type of the workout or calendar entry (`weights`, `cardio`, or `calendar`).                  |
| `sets`             | `List`    | (For strength workouts) List of sets containing `reps` and `weight`.                         |
| `distance`         | `Number`  | (For cardio workouts) Distance covered (e.g., in kilometers or miles).                       |
| `time`             | `Number`  | (For cardio workouts) Time spent (e.g., in minutes).                                         |
| `isPreset`         | `Boolean` | Indicates whether the workout is a preset.                                                   |
| `dateCreated`      | `String`  | Date the workout or calendar entry was created (in ISO format: `YYYY-MM-DD`).               |
| `dateScheduled`    | `String`  | (For calendar entries) Date the workouts were scheduled (in ISO format: `YYYY-MM-DD`).       |
| `exercises`        | `List`    | (For calendar entries) List of `workoutId`s associated with the calendar date.               |

---

### **Sample Items**

#### **1. Strength Workout**
```json
{
  "username": "johndoe",
  "workoutId": "2024-01-01#12345",
  "name": "Bench Press",
  "workoutType": "weights",
  "sets": [
    { "reps": 10, "weight": 100 },
    { "reps": 8, "weight": 110 }
  ],
  "isPreset": false,
  "dateCreated": "2024-01-01"
}
```

#### **2. Cardio Workout**
```json
{
  "username": "johndoe",
  "workoutId": "2024-01-02#67890",
  "name": "Running",
  "workoutType": "cardio",
  "distance": 5,
  "time": 30,
  "isPreset": false,
  "dateCreated": "2024-01-02"
}
```

#### **3. Preset Workout**
```json
{
  "username": "johndoe",
  "workoutId": "preset#squats",
  "name": "Squats",
  "workoutType": "weights",
  "sets": [
    { "reps": 12, "weight": 200 },
    { "reps": 10, "weight": 220 }
  ],
  "isPreset": true,
  "dateCreated": "2024-01-01"
}
```

#### **4. Calendar Entry**
```json
{
  "username": "johndoe",
  "workoutId": "CALENDAR#2024-01-01",
  "workoutType": "calendar",
  "dateScheduled": "2024-01-01",
  "exercises": [
    "2024-01-01#12345",
    "2024-01-02#67890"
  ]
}
```

---


# **WorkoutService API Documentation**

The `WorkoutService` provides methods to interact with workouts, presets, and calendar entries. Below are the methods with **example input and output**

---

## **Methods**

### **1. Fetch All Workouts**
Retrieve all workouts for the authenticated user (excluding calendar entries).

- **Method**: `getWorkouts()`
- **Expected Output**:
```
[
  {
    "workoutId": "2024-01-01#12345",
    "name": "Bench Press",
    "workoutType": "weights",
    "sets": [
      { "reps": 10, "weight": 100 },
      { "reps": 8, "weight": 110 }
    ],
    "dateCreated": "2024-01-01",
    "isPreset": false
  },
  {
    "workoutId": "2024-01-01#67890",
    "name": "Running",
    "workoutType": "cardio",
    "distance": 5,
    "time": 30,
    "dateCreated": "2024-01-01",
    "isPreset": false
  }
]
```
- **Example Usage**:
```javascript
const workouts = await WorkoutService.getWorkouts();
console.log(workouts);
```

---

### **2. Fetch Workout by ID**
Retrieve details of a specific workout by its ID.

- **Method**: `getWorkoutById(id)`
- **Input**: `id = "2024-01-01#12345"`
- **Expected Output**:
```
{
  "workoutId": "2024-01-01#12345",
  "name": "Bench Press",
  "workoutType": "weights",
  "sets": [
    { "reps": 10, "weight": 100 },
    { "reps": 8, "weight": 110 }
  ],
  "dateCreated": "2024-01-01",
  "isPreset": false
}
```
- **Example Usage**:
```javascript
const workout = await WorkoutService.getWorkoutById("2024-01-01#12345");
console.log(workout);
```

---

### **3. Create a New Workout**
Create a new strength or cardio workout.

- **Method**: `createWorkout(workoutData)`
- **Input**:
```
{
  "type": "strength",
  "name": "Squats",
  "sets": [
    { "reps": 12, "weight": 200 },
    { "reps": 10, "weight": 220 }
  ],
  "isPreset": true
}
```
- **Expected Output**:
```
{
  "workoutId": "2024-01-02#98765",
  "name": "Squats",
  "workoutType": "weights",
  "sets": [
    { "reps": 12, "weight": 200 },
    { "reps": 10, "weight": 220 }
  ],
  "dateCreated": "2024-01-02",
  "isPreset": true
}
```
- **Example Usage**:
```javascript
const newWorkout = await WorkoutService.createWorkout({
  type: "strength",
  name: "Squats",
  sets: [{ reps: 12, weight: 200 }, { reps: 10, weight: 220 }],
  isPreset: true,
});
console.log(newWorkout);
```

---

### **4. Update a Workout**
Update details of an existing workout by ID.

- **Method**: `updateWorkout(id, workoutData)`
- **Input**:
  - `id`: `"2024-01-01#12345"`
  - `workoutData`:
```
{
  "name": "Updated Bench Press",
  "sets": [
    { "reps": 12, "weight": 95 }
  ]
}
```
- **Expected Output**:
```
{
  "workoutId": "2024-01-01#12345",
  "name": "Updated Bench Press",
  "workoutType": "weights",
  "sets": [
    { "reps": 12, "weight": 95 }
  ],
  "dateCreated": "2024-01-01",
  "isPreset": false
}
```
- **Example Usage**:
```javascript
const updatedWorkout = await WorkoutService.updateWorkout("2024-01-01#12345", {
  name: "Updated Bench Press",
  sets: [{ reps: 12, weight: 95 }],
});
console.log(updatedWorkout);
```

---

### **5. Delete a Workout**
Delete a workout by its ID.

- **Method**: `deleteWorkout(id)`
- **Input**: `id = "2024-01-01#12345"`
- **Expected Output**:
```
{ "message": "Workout deleted successfully." }
```
- **Example Usage**:
```javascript
const response = await WorkoutService.deleteWorkout("2024-01-01#12345");
console.log(response.message);
```

---

### **6. Fetch Preset Workouts**
Retrieve all preset workouts for the user.

- **Method**: `getPresets()`
- **Expected Output**:
```
[
  {
    "workoutId": "2024-01-01#12345",
    "name": "Bench Press",
    "workoutType": "weights",
    "sets": [
      { "reps": 10, "weight": 100 },
      { "reps": 8, "weight": 110 }
    ],
    "isPreset": true
  },
  {
    "workoutId": "2024-01-01#67890",
    "name": "Running",
    "workoutType": "cardio",
    "distance": 5,
    "time": 30,
    "isPreset": true
  }
]
```
- **Example Usage**:
```javascript
const presets = await WorkoutService.getPresets();
console.log(presets);
```

---

### **7. Fetch Workouts for a Month**
Retrieve workouts grouped by date for a specific month.

- **Method**: `getWorkoutsForMonth(year, month)`
- **Input**:
  - `year`: `2024`
  - `month`: `1`
- **Expected Output**:
```
[
  {
    "date": "2024-01-01",
    "workouts": [
      {
        "workoutId": "2024-01-01#12345",
        "name": "Bench Press",
        "workoutType": "weights",
        "sets": [
          { "reps": 10, "weight": 100 },
          { "reps": 8, "weight": 110 }
        ],
        "isPreset": false
      }
    ]
  },
  {
    "date": "2024-01-02",
    "workouts": [
      {
        "workoutId": "2024-01-02#67890",
        "name": "Running",
        "workoutType": "cardio",
        "distance": 5,
        "time": 30,
        "isPreset": false
      }
    ]
  }
]
```
- **Example Usage**:
```javascript
const workouts = await WorkoutService.getWorkoutsForMonth(2024, 1);
console.log(workouts);
```

---

### **8. Fetch Workouts for a Date**
Retrieve workouts scheduled for a specific date.

- **Method**: `getWorkoutsByDate(year, month, day)`
- **Input**:
  - `year`: `2024`
  - `month`: `1`
  - `day`: `15`
- **Expected Output**:
```
{
  "date": "2024-01-15",
  "workouts": [
    {
      "workoutId": "2024-01-15#12345",
      "name": "Squats",
      "workoutType": "weights",
      "sets": [
        { "reps": 12, "weight": 200 },
        { "reps": 10, "weight": 220 }
      ],
      "isPreset": false
    }
  ]
}
```
- **Example Usage**:
```javascript
const workouts = await WorkoutService.getWorkoutsByDate(2024, 1, 15);
console.log(workouts);
```

---

### **9. Add Workouts to a Calendar Date**
Add specific workouts to a calendar date.

- **Method**: `addWorkoutsToCalendar(year, month, day, workoutIds)`
- **Input**:
  - `year`: `2024`
  - `month`: `1`
  - `day`: `15`
  - `workoutIds`:
```
["2024-01-01#12345", "2024-01-01#67890"]
```
- **Expected Output**:
```
{
  "dateScheduled": "2024-01-15",
  "exercises": ["2024-01-01#12345", "2024-01-01#67890"]
}
```
- **Example Usage**:
```javascript
const response = await WorkoutService.addWorkoutsToCalendar(2024, 1, 15, [
  "2024-01-01#12345",
 

 "2024-01-01#67890",
]);
console.log(response);
```

---
