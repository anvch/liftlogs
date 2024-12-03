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

  // useEffect(() => {
  //   const fetchWorkouts = async () => {
  //     try {
  //       const workouts = await WorkoutService.getWorkouts();
  //       const dataByDate = workouts.reduce((acc, workout) => {
  //         const dateKey = workout.dateCreated;
  //         acc[dateKey] = (acc[dateKey] || 0) + 1;
  //         return acc;
  //       }, {});
  //       setWorkoutData(dataByDate);
  //       console.log(dataByDate);
  //     } catch (error) {
  //       console.error("Error fetching workouts:", error);
  //     }
  //   };

  //   fetchWorkouts();
  // }, []);

  // this function should have various shades of purple based on the count
  //   const getColor = (count) => {
  //     if (count >= 10) return "#9d14ff";
  //     if (count >= 5) return "#6e18a8";
  //     if (count > 0) return "#38035c";
  //     return "#1b1b38";
  //   };

  const [dateData, setDateData] = useState({}); // To store the data for each date
  const [loading, setLoading] = useState(true); // Loading state

  const fetchWorkoutForDate = async (year, month, date) => {
    try {
      const response = await WorkoutService.getWorkoutsByDate(
        year,
        month,
        date,
      );
      if (response && response.workouts.length > 0) {
        setDateData((prevData) => ({
          ...prevData,
          [`${year}-${month}-${date}`]: response, // Store the response for the date
        }));
      }
    } catch (error) {
      console.error("Error fetching workout data:", error);
    }

    console.log("before", dateData);

    setLoading(false); // Set loading to false after fetching data

    console.log("after", dateData);
  };

  const tileClassName = ({ date }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const dateString = `${year}-${month + 1}-${day}`; // Date string in YYYY-MM-DD format

    if (loading) return ""; // Prevent rendering before data is fetched

    console.log(loading);

    if (dateData[dateString]) {
      return (
        <div
          style={{
            backgroundColor: "#ffcc00",
            width: "100%",
            height: "100%",
            borderRadius: "4px",
          }}
        />
      ); // Custom class for highlighted dates
    }
    return ""; // Return empty string if no special logic applies
  };

  // To trigger fetching workout data when the calendar is loaded
  useEffect(() => {
    const fetchAllWorkouts = () => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Loop through all the days in the month and fetch data
      for (let day = 1; day <= 31; day++) {
        fetchWorkoutForDate(currentYear, currentMonth, day);
      }
    };

    fetchAllWorkouts(); // Fetch workouts when the component mounts
  }, []);

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    navigate(`/calendar/${formattedDate}`);
  };

  return (
    <div>
      <Calendar
        className={styles.calendar}
        // tileContent={({ date }) => {
        //   const formattedDate = date.toISOString().split("T")[0];
        //   const count = workoutData[formattedDate] || 0; // Default to 0 if no data for the date
        //   const color = getColor(count);
        //   return (
        //     <div
        //       style={{
        //         backgroundColor: color,
        //         width: "100%",
        //         height: "100%",
        //         borderRadius: "4px",
        //       }}
        //     />
        //   );
        // }}
        tileClassName={tileClassName}
        onChange={onChange}
        onClickDay={handleDateClick}
        calendarType="gregory"
        value={value}
      />
    </div>
  );
}

export default WorkoutCalendar;
