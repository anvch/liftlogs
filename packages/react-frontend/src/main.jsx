// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import DateDetail from "./components/DateDetail";
import "./styles/global.css";
import WorkoutEntryPage from "./workout-entry/WorkoutEntryPage";
import Profile from "./profile/Profile";
import LoginPage from "./login/LoginPage";

const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render:
root.render(
  <Router>
    <Routes>
      {/* Define routes here */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/calendar/:date" element={<DateDetail />} />
      <Route path="/workout-entry" element={<WorkoutEntryPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </Router>,
);
