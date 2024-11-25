/* eslint-disable react/prop-types */
// src/contexts/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";

export const UserContext = createContext();

const mockUserData = {
  user: "id",
  workouts: [
    {
      name: "squats",
      type: "weights",
      sets: [
        { reps: 10, weight: 70 },
        { reps: 15, weight: 100 },
        { reps: 12, weight: 100 },
      ],
    },
    {
      name: "bench press",
      type: "weights",
      sets: [
        { reps: 10, weight: 70 },
        { reps: 15, weight: 100 },
        { reps: 12, weight: 100 },
      ],
    },
    {
      name: "running",
      type: "cardio",
      distance: 5,
      time: 30,
    },
  ],
  calendar: [
    {
      date: "2020-01-01",
      exercise: ["squats", "bench press"],
    },
    {
      date: "2020-01-02",
      exercise: ["squats", "running"],
    },
  ],
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated on app load
    const checkAuth = async () => {
      const token = AuthService.getToken();
      if (token) {
        try {
          // Use mock data for now
          const userData = await fetchUserInfo(token);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchUserInfo = async (token) => {
    // Return the mock user data for now
    console.log("Fetched user data for token:", token); // Debugging log
    return mockUserData;
  };

  const login = async (username, password) => {
    const token = await AuthService.login(username, password);
    const userData = await fetchUserInfo(token);
    setUser(userData);
  };

  const register = async (username, password) => {
    const token = await AuthService.register(username, password);
    const userData = await fetchUserInfo(token);
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
