/* eslint-disable react/prop-types */
import { useState } from "react";
import editIcon from "../assets/edit.svg";
import checkIcon from "../assets/check.svg";
import trashIcon from "../assets/trash.svg";
import styles from "./workoutdetail.module.css";

const WorkoutDetail = ({ workout }) => {
  const [editMode, setEditMode] = useState(false);
  const [workoutData, setWorkoutData] = useState(workout);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const handleEdit = () => {
    setEditMode(!editMode);
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
    <div className={styles.workout}>
      <h3>{workoutData.name}</h3>
      <img
        className={`${styles.icon} ${styles.top}`}
        src={editMode ? checkIcon : editIcon}
        onClick={handleEdit}
        alt="Edit or Check Icon"
      />
      <p>
        Type: {workoutData.workoutType === "weights" ? "Weights" : "Cardio"}
      </p>
      {!editMode && (
        <div>
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
                  setWorkoutData({ ...workoutData, distance: e.target.value })
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
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
