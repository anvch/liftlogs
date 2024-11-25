import { AuthService } from "./auth.service";

export const ApiService = {
  navigate: null, // Placeholder for the navigate function

  // Set the React Router navigate function
  setNavigate(navigateFn) {
    this.navigate = navigateFn;
  },

  // Redirect to login page on unauthorized access
  handleUnauthorized() {
    AuthService.logout();
    if (this.navigate) {
      this.navigate("/login");
    } else {
      console.error("Unauthorized access, navigate function is not set.");
    }
  },

  // General fetch method with token and error handling
  async fetch(url, options = {}) {
    const token = AuthService.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        return;
      }

      return await this.parseResponse(response);
    } catch (error) {
      console.error("API Error:", { url, options, message: error.message });
      throw error;
    }
  },

  // Parse response or throw errors
  async parseResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.message || "An error occurred.");
      } catch {
        throw new Error(errorText || "An error occurred.");
      }
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  get(url) {
    return this.fetch(url);
  },

  post(url, data) {
    return this.fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(url, data) {
    return this.fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(url) {
    return this.fetch(url, {
      method: "DELETE",
    });
  },
};
