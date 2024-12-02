import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./workoutCalendar.module.css";
import { WorkoutService } from "../services/workout.service";

function WorkoutCalendar() {
  const [value, onChange] = useState(new Date());
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workouts = await WorkoutService.getWorkouts();
        const dataByDate = workouts.reduce((acc, workout) => {
          const dateKey = workout.dateCreated;
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {});
        setWorkoutData(dataByDate);
        console.log(dataByDate);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // this function should have various shades of purple based on the count
  const getColor = (count) => {
    if (count >= 10) return "#9d14ff";
    if (count >= 5) return "#6e18a8";
    if (count > 0) return "#38035c";
    return "#1b1b38";
  };

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    navigate(`/calendar/${formattedDate}`);
  };

  return (
    <div>
      <Calendar
        className={styles.calendar}
        tileContent={({ date }) => {
          const formattedDate = date.toISOString().split("T")[0];
          const count = workoutData[formattedDate] || 0; // Default to 0 if no data for the date
          const color = getColor(count);
          return (
            <div
              style={{
                backgroundColor: color,
                width: "100%",
                height: "100%",
                borderRadius: "4px",
              }}
            />
          );
        }}
        onChange={onChange}
        onClickDay={handleDateClick}
        calendarType="gregory"
        value={value}
      />
    </div>
  );
}

export default WorkoutCalendar;
