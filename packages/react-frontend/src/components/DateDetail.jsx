import { useParams, useNavigate, Link } from "react-router-dom";
import WorkoutDetail from "./WorkoutDetail";
import Background from "./Background";
import homeIcon from "../assets/home.svg";
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
    navigate(`/`);
  };

  return (
    <div>
      <Background />
      <h2 className={styles.title}>Workout: {date}</h2>
      <Link to="/">
        <img className={styles.homeicon} src={homeIcon} alt="Home" />
      </Link>
      {tempToday.exercise.map((workout, index) => {
        return <WorkoutDetail key={index} workout={workout} />;
      })}
      <button className={`container ${styles.editButton}`}>Edit</button>
    </div>
  );
}

export default DateDetail;
