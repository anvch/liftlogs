/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import editIcon from "../assets/edit.svg";
import checkIcon from "../assets/check.svg";
import trashIcon from "../assets/trash.svg";
import { WorkoutService } from "../services/workout.service.js";
import styles from "./workoutdetail.module.css";

const WorkoutDetail = ({ workout }) => {
  const [editMode, setEditMode] = useState(false);
  const [workoutData, setWorkoutData] = useState(workout);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {}, [visible]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleCheck = async () => {
    const newWorkoutData = {
      name: workoutData.name || "Unnamed Workout",
      workoutType: workoutData.workoutType.toLowerCase(),
      dateCreated: new Date().toISOString().split("T")[0],
      isPreset: workoutData.isPreset,
    };

    if (workoutData.workoutType === "weights") {
      newWorkoutData.sets = workoutData.sets;
    } else if (workoutData.workoutType === "cardio") {
      newWorkoutData.distance = parseFloat(workoutData.distance);
      newWorkoutData.time = parseFloat(workoutData.time);
    }

    try {
      await WorkoutService.updateWorkout(workoutData.workoutId, newWorkoutData);
    } catch (error) {
      console.error(error);
    }
    setEditMode(!editMode);
  };

  const handleTrash = async () => {
    const result = await WorkoutService.deleteWorkout(workoutData.workoutId);
    setVisible(false);
    console.log(result);
  };

  const handleAddSet = () => {
    if (reps > 0 && weight > 0) {
      setWorkoutData({
        ...workoutData,
        sets: [...workoutData.sets, { reps, weight }],
      });
      setReps("");
      setWeight("");
    }
  };

  const handleRemoveSet = (index) => {
    const updatedSets = workoutData.sets.filter((_, i) => i !== index);
    setWorkoutData({ ...workoutData, sets: updatedSets });
  };

  return (
    <div className={`${styles.workout} ${!visible ? styles.hide : ""}`}>
      <h3>{workoutData.name}</h3>
      <p>
        Type: {workoutData.workoutType === "weights" ? "Weights" : "Cardio"}
      </p>
      {!editMode && (
        <div>
          <img
            className={`${styles.icon} ${styles.top}`}
            src={editIcon}
            onClick={handleEdit}
            alt="Edit Icon"
          />
          {workoutData.workoutType === "weights" ? (
            <div>
              <p>
                Sets:
                {workoutData.sets.map((set, index) => (
                  <li key={index}>
                    Reps: {set.reps}, Weight: {set.weight} lbs
                  </li>
                ))}
              </p>
            </div>
          ) : (
            <div>
              <p>
                Distance: {workoutData.distance}{" "}
                {workoutData.distance > 1 ? "miles" : "mile"}
              </p>
              <p>
                Time: {workoutData.time}{" "}
                {workoutData.time > 1 ? "minutes" : "minute"}
              </p>
            </div>
          )}
        </div>
      )}
      {editMode && (
        <div>
          {workoutData.workoutType == "weights" && (
            <div>
              <img
                className={`${styles.icon} ${styles.top}`}
                src={checkIcon}
                onClick={handleCheck}
                alt="Check Icon"
              />
              <h4>Sets</h4>
              <label className={styles.label} htmlFor="reps-input">
                Reps:
              </label>
              <input
                id="reps-input"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={styles.input}
              />
              <label className={styles.label} htmlFor="weight-input">
                Weight:
              </label>
              <input
                id="weight-input"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleAddSet} className={styles.button}>
                Add Set
              </button>
              <ul className={styles.setList}>
                {workoutData.sets.map((set, index) => (
                  <li key={index} className={styles.listItem}>
                    <div className={styles.setItem}>
                      <div>
                        Reps: {set.reps}, Weight: {set.weight}
                      </div>
                      <button
                        onClick={() => handleRemoveSet(index)}
                        className={styles.removeButton}
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {workoutData.workoutType == "cardio" && (
            <div>
              <label className={styles.label} htmlFor="distance-input">
                Distance (miles):
              </label>
              <input
                id="distance-input"
                type="number"
                value={workoutData.distance}
                onChange={(e) =>
                  setWorkoutData({
                    ...workoutData,
                    distance: e.target.value,
                  })
                }
                className={styles.input}
              />
              <label className={styles.label} htmlFor="time-input">
                Time (min):
              </label>
              <input
                id="time-input"
                type="number"
                value={workoutData.time}
                onChange={(e) =>
                  setWorkoutData({ ...workoutData, time: e.target.value })
                }
                className={styles.input}
              />
            </div>
          )}
          <img
            className={`${styles.icon} ${styles.bottom}`}
            src={trashIcon}
            alt="Trash Icon"
            onClick={handleTrash}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
