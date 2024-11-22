import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import styles from "./login.module.css";
import Background from "../components/Background";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.login(username, password);
      navigate("/home"); // Redirect to dashboard or home page after login
    } catch (err) {
      console.error("Login Error:", {
        message: err.message,
        stack: err.stack,
      });
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await AuthService.register(username, password);
      navigate("/home"); // Redirect to dashboard or home page after registration
    } catch (err) {
      console.error("Registration Error:", {
        message: err.message,
        stack: err.stack,
      });
      setError("Registration failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Background />
      <h2 className={styles.header}>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
