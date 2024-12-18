export const AuthService = {
  BASE_URL:
    import.meta.env.VITE_BACKEND_HOST ||
    "https://sweaty-e8f6brd2c0feb2bq.westus-01.azurewebsites.net",

  async login(username, pwd) {
    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
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
      const response = await fetch(`${this.BASE_URL}/signup`, {
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
