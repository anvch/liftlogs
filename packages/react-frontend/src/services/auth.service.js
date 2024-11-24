export const AuthService = {
  async login(username, pwd) {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd }),
      });

      const responseData = await this.parseResponse(response);
      this.setToken(responseData.token);
      return responseData.token;
    } catch (error) {
      console.error("Login Error:", {
        endpoint: "/login",
        message: error.message,
      });
      throw error;
    }
  },

  async register(username, pwd) {
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pwd }),
      });

      const responseData = await this.parseResponse(response);
      this.setToken(responseData.token);
      return responseData.token;
    } catch (error) {
      console.error("Registration Error:", {
        endpoint: "/signup",
        message: error.message,
      });
      throw error;
    }
  },

  // Utility function to parse response and handle errors
  async parseResponse(response) {
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({
        error: "Unexpected Error",
        message: "Unable to parse server response.",
      }));
      throw new Error(errorBody.message || "An unknown error occurred.");
    }

    return response.json();
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
