// src/main.jsx
import ReactDOMClient from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./home/Home";
import DateDetail from "./components/DateDetail";
import "./styles/global.css";
import WorkoutEntryPage from "./workout-entry/WorkoutEntryPage";
import Profile from "./profile/Profile";
import LoginPage from "./login/LoginPage";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar/:date"
          element={
            <ProtectedRoute>
              <DateDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout-entry"
          element={
            <ProtectedRoute>
              <WorkoutEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </UserProvider>,
);
