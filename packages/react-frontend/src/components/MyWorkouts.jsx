/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";
import styles from "./my-workouts.module.css";

function MyWorkouts({ presets }) {
  // format description based on workout type/fields
  const getDescription = (workout) => {
    if (workout.distance && workout.time) {
      return `Distance: ${workout.distance}, Time: ${workout.time} mins`;
    } else if (workout.sets) {
      return `Sets: ${workout.sets}`;
    } else {
      return "No additional details available";
    }
  };

  return (
    <div className="container">
      <div className={styles.myworkouts}>
        <h2>My Workouts</h2>
        <Link to="/workout-entry">
          <button> + Add Workout</button>
        </Link>
        <div className={styles.workoutList}>
          {presets.length > 0 ? (
            presets.map((workout, index) => (
              <WorkoutCard
                key={index}
                name={workout.name}
                type={workout.workoutType}
                description={getDescription(workout)}
              />
            ))
          ) : (
            <p>No workouts available</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default MyWorkouts;
