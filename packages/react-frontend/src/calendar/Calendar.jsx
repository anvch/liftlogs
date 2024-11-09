import React, { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

import 'react-calendar/dist/Calendar.css';

// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];

function Calendar1() {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <h1>Hello, Calendar!</h1>
      <p>Click the link to view Home:</p>
      <Link to="/">Go to Home</Link>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}
export default Calendar1;
