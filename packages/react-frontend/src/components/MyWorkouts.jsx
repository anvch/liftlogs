import { Link } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";
import styles from "./my-workouts.module.css";

function MyWorkouts() {
  const testWorkout = {
    name: "Test Workout",
    type: "Cardio",
    description: "test workout description",
  };

  return (
    <div className="container">
      <div className={styles.myworkouts}>
        <h2 className>My Workouts</h2>
        <Link to="/workout-entry">
          <button> + Add Workout</button>
        </Link>
        <WorkoutCard
          name={testWorkout.name}
          type={testWorkout.type}
          description={testWorkout.description}
        />
      </div>
    </div>
  );
}
export default MyWorkouts;
