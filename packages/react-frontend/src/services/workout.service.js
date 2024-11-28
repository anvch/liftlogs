import { ApiService } from "./api.service";

export const WorkoutService = {
  // Fetch all workouts for the authenticated user
  async getWorkouts() {
    return ApiService.get("/api/workouts");
  },

  // Fetch a specific workout by ID
  async getWorkoutById(id) {
    return ApiService.get(`/api/workouts/${id}`);
  },

  // Create a new workout
  async createWorkout(workoutData) {
    return ApiService.post("/api/workouts", workoutData);
  },

  // Update an existing workout by ID
  async updateWorkout(id, workoutData) {
    return ApiService.put(`/api/workouts/${id}`, workoutData);
  },

  // Delete a workout by ID
  async deleteWorkout(id) {
    return ApiService.delete(`/api/workouts/${id}`);
  },

  // Fetch all preset workouts
  async getPresets() {
    return ApiService.get("/api/presets");
  },

  // Fetch workouts for a specific month
  async getWorkoutsForMonth(year, month) {
    return ApiService.get(
      `/api/calendar/${year}/${month.toString().padStart(2, "0")}`,
    );
  },

  // Fetch workouts for a specific date
  async getWorkoutsByDate(year, month, day) {
    return ApiService.get(
      `/api/calendar/${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`,
    );
  },

  // Add workouts to a specific calendar date
  async addWorkoutsToCalendar(year, month, day, workoutIds) {
    return ApiService.post(
      `/api/calendar/${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`,
      { workouts: workoutIds },
    );
  },
};
