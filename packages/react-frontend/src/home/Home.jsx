import { Link } from "react-router-dom";
import Background from "../components/Background";
import Calendar from "../calendar/Calendar";
import MyWorkouts from "../components/MyWorkouts";
import styles from "./home.module.css";
import profileIcon from "../assets/profile.svg";

function Home() {
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
      <h1 className={styles.title}>Welcome, username!</h1>
      <Link to="/calendar">
        <Calendar></Calendar>
      </Link>
      <br></br>
      <div className={styles.navbar}>
        <Link to="/addworkout">
          <button> + Add Workout</button>
        </Link>
      </div>
      <br></br>
      <br></br>
      <MyWorkouts></MyWorkouts>
    </div>
  );
}
export default Home;
