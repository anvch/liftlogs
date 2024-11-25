// src/main.jsx
import ReactDOMClient from "react-dom/client";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./home/Home";
import DateDetail from "./components/DateDetail";
import "./styles/global.css";
import WorkoutEntryPage from "./workout-entry/WorkoutEntryPage";
import Profile from "./profile/Profile";
import LoginPage from "./login/LoginPage";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ApiService } from "./services/api.service";

// Wrapper component to inject navigate into ApiService
const RouterWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.setNavigate(navigate);
  }, [navigate]);

  return children;
};

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(
  <UserProvider>
    <Router>
      <RouterWrapper>
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
      </RouterWrapper>
    </Router>
  </UserProvider>,
);
