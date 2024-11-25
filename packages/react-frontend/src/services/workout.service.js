import { ApiService } from "./api.service";

export const WorkoutService = {
  /**
   * Fetch all workouts for the authenticated user.
   */
  async getWorkouts() {
    return ApiService.get("/workouts");
  },

  /**
   * Fetch a specific workout by ID.
   * @param {string} id - The unique ID of the workout.
   */
  async getWorkoutById(id) {
    return ApiService.get(`/workouts/${id}`);
  },

  /**
   * Create a new workout.
   * @param {Object} workoutData - Data for the new workout.
   */
  async createWorkout(workoutData) {
    return ApiService.post("/workouts", workoutData);
  },

  /**
   * Update an existing workout by ID.
   * @param {string} id - The unique ID of the workout.
   * @param {Object} workoutData - Updated data for the workout.
   */
  async updateWorkout(id, workoutData) {
    return ApiService.put(`/workouts/${id}`, workoutData);
  },

  /**
   * Delete a workout by ID.
   * @param {string} id - The unique ID of the workout.
   */
  async deleteWorkout(id) {
    return ApiService.delete(`/workouts/${id}`);
  },

  /**
   * Fetch all preset workouts.
   */
  async getPresets() {
    return ApiService.get("/workouts/presets");
  },

  /**
   * Fetch workouts for a specific month and year.
   * @param {number} year - The year to fetch workouts for.
   * @param {number} month - The month to fetch workouts for.
   */
  async getWorkoutsForMonth(year, month) {
    return ApiService.get(
      `/calendar/${year}/${month.toString().padStart(2, "0")}`,
    );
  },

  /**
   * Fetch workouts for a specific date.
   * @param {number} year - The year to fetch workouts for.
   * @param {number} month - The month to fetch workouts for.
   * @param {number} day - The day to fetch workouts for.
   */
  async getWorkoutsByDate(year, month, day) {
    return ApiService.get(
      `/calendar/${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`,
    );
  },

  /**
   * Add workouts to a specific date in the calendar.
   * @param {number} year - The year of the calendar entry.
   * @param {number} month - The month of the calendar entry.
   * @param {number} day - The day of the calendar entry.
   * @param {Array<string>} workoutIds - The IDs of the workouts to add.
   */
  async addWorkoutsToCalendar(year, month, day, workoutIds) {
    return ApiService.post(
      `/calendar/${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`,
      { exercises: workoutIds },
    );
  },
};
