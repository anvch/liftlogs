import { useParams, useNavigate } from "react-router-dom";
import WorkoutDetail from "./WorkoutDetail";
import styles from "./datedetail.module.css";

function DateDetail() {
  const { date } = useParams();
  const navigate = useNavigate();

  const tempWeights = {
    name: "Temp Workout",
    workoutType: "weights",
    sets: [
      { reps: 10, weight: 100 },
      { reps: 15, weight: 100 },
      { reps: 5, weight: 100 },
    ],
  };

  const tempCardio = {
    name: "Temp Workout2",
    workoutType: "cardio",
    distance: 5,
    time: 40,
  };

  const tempToday = {
    date: "2024-11-15",
    exercise: [tempWeights, tempCardio, tempWeights],
  };

  const handleHomeClick = () => {
    navigate(`/calendar`);
  };

  return (
    <div>
      <h2 className={styles.title}>Workout: {date}</h2>
      <button
        className={`container ${styles.homeButton}`}
        onClick={handleHomeClick}
      >
        Home
      </button>
      {tempToday.exercise.map((workout, index) => {
        return <WorkoutDetail key={index} workout={workout} />;
      })}
      <button className={`container ${styles.editButton}`}>Edit</button>
    </div>
  );
}

export default DateDetail;