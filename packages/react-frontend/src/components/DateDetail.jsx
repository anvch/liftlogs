import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WorkoutDetail from "./WorkoutDetail";
import Background from "./Background";
import homeIcon from "../assets/home.svg";
import styles from "./datedetail.module.css";
import { WorkoutService } from "../services/workout.service";

function DateDetail() {
  const { date } = useParams();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const parsedDate = date.split("-");
        const data = await WorkoutService.getWorkoutsByDate(parsedDate[0], parsedDate[1], parsedDate[2]);
        setWorkouts(data.workouts);
        console.log("Workouts fetched:", workouts);
      } catch (error) {
        console.error("Error fetching presets:", error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className={styles.date}>
      <Background />
      <h2 className={styles.title}>Workout: {date}</h2>
      <Link to="/home">
        <img className={styles.homeicon} src={homeIcon} alt="Home" />
      </Link>
      {workouts.map((workout, index) => {
        return <WorkoutDetail key={index} workout={workout} />;
      })}
      <button className={`container ${styles.editButton}`}>Edit</button>
    </div>
  );
}

export default DateDetail;
