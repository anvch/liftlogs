export const AuthService = {
  async login(username, pwd) {
    try {
      const response = await fetch("http://localhost:3001/login", {
        // Full backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Login Error:", {
          endpoint: "/login",
          status: response.status,
          body: errorBody,
        });
        throw new Error(errorBody || "Login failed. Please try again.");
      }

      const { token } = await response.json();
      this.setToken(token);
      return token;
    } catch (error) {
      console.error("Unexpected Login Error:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  async register(username, pwd) {
    try {
      const response = await fetch("http://localhost:3001/signup", {
        // Full backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Registration Error:", {
          endpoint: "/signup",
          status: response.status,
          body: errorBody,
        });
        throw new Error(errorBody || "Registration failed. Please try again.");
      }

      const { token } = await response.json();
      this.setToken(token);
      return token;
    } catch (error) {
      console.error("Unexpected Registration Error:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  setToken(token) {
    localStorage.setItem("auth_token", token);
  },

  getToken() {
    return localStorage.getItem("auth_token");
  },

  removeToken() {
    localStorage.removeItem("auth_token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    this.removeToken();
  },
};
