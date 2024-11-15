import { Link } from "react-router-dom";
import WorkoutCard from "../components/WorkoutCard";
import "./MyWorkouts.css";

function MyWorkouts() {
  const testWorkout = {
    name: "Test Workout",
    type: "Cardio",
    description: "test workout description",
  };

  return (
    <div className="my-workouts">
      <h2>My Workouts</h2>
      <Link to="/workout-entry">
        <button> + Add Workout</button>
      </Link>
      <WorkoutCard
        name={testWorkout.name}
        type={testWorkout.type}
        description={testWorkout.description}
      />
    </div>
  );
}
export default MyWorkouts;
