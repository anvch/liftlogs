import React from "react";
import { Link } from "react-router-dom"

function Home() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Click the link to view calendar:</p>
      <Link to="/calendar">Go to Calendar</Link>
    </div>
  );
}
export default Home;
