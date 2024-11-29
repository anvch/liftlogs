import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { WorkoutService } from "../services/workout.service";
import MyWorkouts from "../components/MyWorkouts";
import homeIcon from "../assets/home.svg";
import styles from "./profile.module.css";
import Background from "../components/Background";

function Profile() {
  const { user, loading } = useContext(UserContext); // Use context to get the user and loading state
  const { logout } = useContext(UserContext); // Access logout from UserContext
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [workouts, setWorkouts] = useState([]);
  const [streak, setStreak] = useState(0); // State for workout streak
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  const calculateStreak = (workoutsData) => {
    console.log("Raw workoutsData:", workoutsData);

    const currentDate = new Date();
    const normalizedCurrentDate = normalizeDate(currentDate);

    // get dates with workouts
    const workoutDates = workoutsData
      .filter((workoutData) => {
        return workoutData.workouts.length > 0;
      })
      .map((workoutData) => {
        const parsedDate = new Date(`${workoutData.date}T00:00:00`);
        return normalizeDate(parsedDate);
      });

    // sort dates in descending order
    workoutDates.sort((a, b) => b - a);

    let streakCount = 0;
    let currentStreakDate = normalizedCurrentDate;

    for (let i = 0; i < workoutDates.length; i++) {
      if (isSameDay(workoutDates[i], currentStreakDate)) {
        streakCount++;
        currentStreakDate.setDate(currentStreakDate.getDate() - 1); // move back one day
      } else {
        break;
      }
    }

    return streakCount;
  };

  // normalize dates to midnight
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const isSameDay = (date1, date2) => {
    // to avoid considering time
    const d1 = normalizeDate(date1);
    const d2 = normalizeDate(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // +1 bc months are 0-indexed in JS

        const data = await WorkoutService.getWorkoutsForMonth(
          currentYear,
          currentMonth,
        );

        // calculate the streak using the days
        const streakCount = calculateStreak(data);
        setStreak(streakCount);

        // flatten workouts data to get array of just workouts
        const flattenedWorkouts = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .flatMap((day) => day.workouts)
          .slice(0, 5);

        setTotalWorkouts(flattenedWorkouts.length);

        setWorkouts(flattenedWorkouts);
      } catch (error) {
        console.error("Error fetching workouts for the month:", error);
      }
    };

    fetchWorkouts();
  }, []);

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
      <h1 className={styles.name}>
        {loading ? "Loading..." : `${user.username}'s Profile`}
      </h1>
      <div className={styles.achievements}>
        <div className={styles.streak}>
          <h3>Workout Streak</h3>
          <p>{streak}</p>
        </div>
        <div className={styles.monthlyWorkouts}>
          <h3>Workouts</h3>
          <p>{totalWorkouts}</p>
          <h3>This Month</h3>
        </div>
      </div>
      <MyWorkouts
        className={styles.myworkouts}
        presets={workouts || []}
      ></MyWorkouts>
      <br />
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
