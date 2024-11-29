/* eslint-disable react/prop-types */
import styles from "./workoutdetail.module.css";

const WorkoutDetail = ({ workout }) => {
  return (
    <div className={styles.workout}>
      <h3>{workout.name}</h3>
      <p>Type: {workout.workoutType === "weights" ? "Weights" : "Cardio"}</p>
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
  );
};

export default WorkoutDetail;
