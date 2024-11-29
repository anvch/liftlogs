/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";
import styles from "./my-workouts.module.css";

function MyWorkouts({ title, presets }) {
  // format description based on workout type/fields
  const getDescription = (workout) => {
    if (workout.distance && workout.time) {
      return `Distance: ${workout.distance} mile(s), Time: ${workout.time} min(s)`;
    } else if (workout.sets && Array.isArray(workout.sets)) {
      return (
        <div>
          {workout.sets.map((set, index) => (
            <div key={index}>
              Set {index + 1}: {set.reps} reps @ {set.weight} lbs
            </div>
          ))}
        </div>
      );
    } else {
      return "No additional details available";
    }
  };

  return (
    <div className="container">
      <div className={styles.myworkouts}>
        <h2>{title}</h2>
        <Link to="/workout-entry">
          <button> + Add Workout</button>
        </Link>
        <br></br>
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
