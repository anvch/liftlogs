import React from "react";
import { Link } from "react-router-dom";
import WorkoutCalendar from "../components/WorkoutCalendar";

function Calendar() {
  return (
    <div>
      <h1>Hello, Calendar!</h1>
      <p>Click the link to view Home:</p>
      <Link to="/">Go to Home</Link>
      <WorkoutCalendar />
    </div>
  );
}
export default Calendar;