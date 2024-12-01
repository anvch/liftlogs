/* eslint-disable react/prop-types */
import { useState } from "react";
import editIcon from "../assets/edit.svg";
import styles from "./workoutdetail.module.css";

const WorkoutDetail = ({ workout }) => {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      {!editMode && (
        <div className={styles.workout}>
          <h3>{workout.name}</h3>
          <img
            className={styles.editicon}
            src={editIcon}
            onClick={handleEdit}
            alt="Edit Icon"
          />
          <p>
            Type: {workout.workoutType === "weights" ? "Weights" : "Cardio"}
          </p>
          {workout.workoutType === "weights" ? (
            <div>
              <p>
                Sets:
                {workout.sets.map((set, index) => (
                  <li key={index}>
                    Reps: {set.reps}, Weight: {set.weight} lbs
                  </li>
                ))}
              </p>
            </div>
          ) : (
            <div>
              <p>
                Distance: {workout.distance}{" "}
                {workout.distance > 1 ? "miles" : "mile"}
              </p>
              <p>
                Time: {workout.time} {workout.time > 1 ? "minutes" : "minute"}
              </p>
            </div>
          )}
        </div>
      )}
      {editMode && <div></div>}
    </div>
  );
};

export default WorkoutDetail;
