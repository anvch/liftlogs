import React, { useState, useEffect, useContext } from "react"; // eslint-disable-line no-unused-vars
import { Link } from "react-router-dom";
import Background from "../components/Background";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MyWorkouts from "../components/MyWorkouts";
import styles from "./home.module.css";
import profileIcon from "../assets/profile.svg";
import { WorkoutService } from "../services/workout.service";
import { UserContext } from "../contexts/UserContext";

function Home() {
  const { user, loading } = useContext(UserContext); // Use context to get the user and loading state
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await WorkoutService.getPresets();
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
      <h1 className={styles.title}>
        {loading ? "Loading..." : `Welcome, ${user.username}!`}
      </h1>
      <WorkoutCalendar />
      <br></br>
      <div className={styles.navbar}>
        <Link to="/workout-entry">
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
