// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Calendar from "./calendar/Calendar";
import DateDetail from "./components/DateDetail";
import "./styles/global.css";

const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render:
root.render(
  <Router>
    <Routes>
      {/* Define routes here */}
      <Route path="/" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/calendar/:date" element={<DateDetail />} />
    </Routes>
  </Router>,
);
