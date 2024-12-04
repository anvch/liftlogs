import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./workoutCalendar.module.css";
import { WorkoutService } from "../services/workout.service";

function WorkoutCalendar() {
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // controls what month the user views
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState({}); // counts of workouts by date
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch all the workouts for the month as a single API call for efficiency
  useEffect(() => {
    const fetchWorkoutsForMonth = async () => {
      try {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth() + 1; // JavaScript months are 0-indexed

        const workoutsForMonth = await WorkoutService.getWorkoutsForMonth(
          year,
          month,
        );

        // map the days to numbers of workouts
        const workourCounts = workoutsForMonth.reduce((acc, day) => {
          acc[day.date] = day.workouts.length;
          return acc;
        }, {});

        setWorkoutData(workourCounts);
      } catch (err) {
        console.error("error fetching workouts for calendar:", err);
        setError("Failed to load workouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutsForMonth();
  }, [activeStartDate]); // make sure to add dependency so that it refreshes when user changes month

  // this function should have various shades of purple based on the count
  const getTileColor = (count) => {
    if (count >= 4) return "#9d14ff";
    if (count >= 2) return "#6e18a8";
    if (count > 0) return "#38035c";
    return "#1b1b38";
  };

  const tileContent = ({ date, view }) => {
    // calendar has other views, only render for months
    if (view !== "month") return null;
    // dates are stored in ISO format in the database.
    const dateString = date.toISOString().split("T")[0];
    const count = workoutData[dateString] || 0;

    if (count > 0) {
      return (
        <div
          style={{
            backgroundColor: getTileColor(count),
            width: "100%",
            height: "100%",
            borderRadius: "4px",
          }}
        />
      ); // Custom class for highlighted dates
    }
    return null;
  };

  // here in case side effects are needed later or in case validation needs to happen
  // otherwise could use setter directly.
  const onActiveDateChange = ({ newActiveDate }) => {
    setActiveStartDate(newActiveDate);
  };

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    navigate(`/calendar/${formattedDate}`);
  };

  return (
    <div>
      {loading && <div className={styles.loading}>Loading workouts...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <Calendar
        className={styles.calendar}
        onActiveStartDateChange={onActiveDateChange}
        onClickDay={handleDateClick}
        tileContent={tileContent}
        calendarType="gregory"
        value={activeStartDate}
      />
    </div>
  );
}

export default WorkoutCalendar;
