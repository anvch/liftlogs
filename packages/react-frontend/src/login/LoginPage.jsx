import React, { useState, useContext, useEffect } from "react"; // eslint-disable-line no-unused-vars
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styles from "./login.module.css";
import Background from "../components/Background";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user,
    login,
    register,
    loading: userLoading,
  } = useContext(UserContext); // Use context functions
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userLoading && user) {
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    }
  }, [user, userLoading, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistering) {
        await register(username, password); // Use context's register function
      } else {
        await login(username, password); // Use context's login function
      }
      const from = location.state?.from?.pathname || "/home"; // Redirect to intended page or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error(`${isRegistering ? "Registration" : "Login"} Error:`, {
        message: err.message,
      });
      setError(err.message || "An unexpected error occurred."); // Use error message from context or a fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Background />
      <h2 className={styles.header}>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <label className={styles.label}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
        <label className={styles.label}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading
            ? isRegistering
              ? "Registering..."
              : "Logging in..."
            : isRegistering
              ? "Register"
              : "Login"}
        </button>
      </form>
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError(""); // Clear any existing errors
        }}
        className={styles.toggleButton}
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </div>
  );
}

export default LoginPage;
