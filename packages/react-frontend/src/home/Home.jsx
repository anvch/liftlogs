import React, { useState, useEffect } from "react"; // eslint-disable-line no-unused-vars
import { Link } from "react-router-dom";
import Background from "../components/Background";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MyWorkouts from "../components/MyWorkouts";
import styles from "./home.module.css";
import profileIcon from "../assets/profile.svg";
import { WorkoutService } from "../services/workout.service";

function Home() {
  const [username, setUsername] = useState("");
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await WorkoutService.getPresets();

        // Assuming 'data' is an array of workouts and each workout contains a 'username' field
        // therefore, can only get username if they have one workout?
        // TODO: debug this
        if (data.length > 0) {
          const firstWorkout = data[0]; // use the first workout's username
          setUsername(firstWorkout.username || "Unknown User");
        }
        setPresets(data);
      } catch (error) {
        console.error("Error fetching presets:", error);
      }
    };

    fetchPresets();
  }, []);

  return (
    <div className="container">
      <Background></Background>
      <br></br>
      <div className={styles.navbar}>
        <Link to="/profile">
          <img className={styles.profileicon} src={profileIcon} alt="Profile" />
        </Link>
      </div>
      <br></br>
      <br></br>
      <h1 className={styles.title}>Welcome, {username}!</h1>
      <WorkoutCalendar />
      <br></br>
      <div className={styles.navbar}>
        <Link to="/addworkout">
          <button> + Add Workout</button>
        </Link>
      </div>
      <br></br>
      <br></br>
      <MyWorkouts presets={presets}></MyWorkouts>
    </div>
  );
}
export default Home;
