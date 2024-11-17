/* eslint-disable react/prop-types */
import styles from "./workoutdetail.module.css";

const WorkoutDetail = ({ key, workout }) => {
  return (
    <div className={styles.workout}>
      <h3>Workout Detail</h3>
      <p>Name: {workout.name}</p>
      <p>Type: {workout.workoutType}</p>
      {workout.workoutType === "weights" ? (
        <div>
          <p>
            Sets:
            {workout.sets.map((set, index) => (
              <li key={index}>
                Reps: {set.reps}, Weight: {set.weight}
              </li>
            ))}
          </p>
        </div>
      ) : (
        <div>
          <p>Distance: {workout.distance}</p>
          <p>Time: {workout.time}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
