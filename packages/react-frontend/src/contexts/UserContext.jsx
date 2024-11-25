/* eslint-disable react/prop-types */
// src/contexts/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthService.getToken();
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    await AuthService.login(username, password);
    setIsAuthenticated(true);
  };

  const register = async (username, password) => {
    await AuthService.register(username, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{ isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
