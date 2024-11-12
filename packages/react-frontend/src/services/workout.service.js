import { ApiService } from "./api.service";
export const WorkoutService = {
    async getWorkouts() {
        return ApiService.get('/api/workouts');
    },

    async createWorkout(workoutData) {
        return ApiService.post('/api/workouts/strength', workoutData);
    },

    async getWorkoutById(id) {
        return ApiService.get(`/api/workouts/${id}`);
    },

    async updateWorkout(id, workoutData) {
        return ApiService.put(`/api/workouts/${id}`, workoutData);
    },

    async deleteWorkout(id) {
        return ApiService.delete(`/api/workouts/${id}`);
    }
};
