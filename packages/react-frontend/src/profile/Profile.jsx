import { Link } from "react-router-dom";
import MyWorkouts from "../components/MyWorkouts";
import homeIcon from "../assets/home.svg";
import styles from "./profile.module.css";
import Background from "../components/Background";

function Profile() {
  const testUser = {
    name: "John Doe",
    bio: "Description of John Doe",
  };

  return (
    <div className="container">
      <Background />
      <br />
      <div className="navbar">
        <Link to="/">
          <img className={styles.homeicon} src={homeIcon} alt="Home" />
        </Link>
      </div>
      <br />
      <br />
      <h1 className={styles.name}>{testUser.name}</h1>
      <h2 className={styles.bio}>{testUser.bio}</h2>
      <div className={styles.achievements}>
        <div className={styles.streak}>
          <h3>Workout Streak</h3>
          <p>3</p>
        </div>
        <div className={styles.monthlyWorkouts}>
          <h3>Workouts</h3>
          <p>3</p>
          <h3>This Month</h3>
        </div>
      </div>
      <MyWorkouts className={styles.myworkouts}></MyWorkouts>
    </div>
  );
}

export default Profile;
