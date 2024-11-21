import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./workoutCalendar.module.css";

function WorkoutCalendar() {
  const [value, onChange] = useState(new Date());
  const navigate = useNavigate();

  // this function should be replaced with the logic we want to use to determine "green-ness"
  const getEventCount = (date) => date.getDate();

  // this function should have various shades of green based on the count
  const getColor = (count) => {
    if (count > 20) return "#9d14ff";
    if (count > 10) return "#6e18a8";
    if (count > 5) return "#38035c";
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
          const count = getEventCount(date);
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
