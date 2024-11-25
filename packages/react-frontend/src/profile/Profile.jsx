import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import MyWorkouts from "../components/MyWorkouts";
import homeIcon from "../assets/home.svg";
import styles from "./profile.module.css";
import Background from "../components/Background";

function Profile() {
  const testUser = {
    name: "John Doe",
    bio: "Description of John Doe",
  };

  const { logout } = useContext(UserContext); // Access logout from UserContext
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="container">
      <Background />
      <br />
      <div className="navbar">
        <Link to="/home">
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
      <br />
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
