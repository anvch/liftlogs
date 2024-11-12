import React, { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];

function Calendar1() {
  const [value, onChange] = useState(new Date());

  // this function should be replaced with the logic we want to use to determine "green-ness"
  const getEventCount = (date) => date.getDate();

  // this function should have various shades of green based on the count
  const getColor = (count) => {
    if (count > 20) return "darkgreen";
    if (count > 10) return "green";
    if (count > 5) return "lightgreen";
    return "lightgray";
  };

  return (
    <div>
      <h1>Hello, Calendar!</h1>
      <p>Click the link to view Home:</p>
      <Link to="/">Go to Home</Link>
      <Calendar
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
        value={value}
      />
    </div>
  );
}
export default Calendar1;
