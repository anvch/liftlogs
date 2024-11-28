/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/contexts/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthService.getToken();
      if (token) {
        try {
          // Assuming the username is stored locally or available in the token payload
          const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
          setUser({ username: decodedToken.username }); // Set the username from the token payload
        } catch (error) {
          console.error("Error decoding token:", error);
          AuthService.logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    await AuthService.login(username, password);
    setUser({ username });
    //setIsAuthenticated(true);
  };

  const register = async (username, password) => {
    await AuthService.register(username, password);
    setUser({ username });
    //setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    //setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
