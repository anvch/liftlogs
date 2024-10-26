const dynamoDB = require('../config/dynamodb.js');
const TABLE_NAME = 'Workouts';

const WorkoutModel = {
  async createWorkout(workout) {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        workoutId: Date.now().toString(), // Simple ID generation
        userId: workout.userId,
        name: workout.name,
        exercises: workout.exercises,
        duration: workout.duration,
        date: workout.date,
        createdAt: new Date().toISOString()
      }
    };
    
    await dynamoDB.put(params).promise();
    return params.Item;
  },

  async getWorkoutsByUser(userId) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  }
};

module.exports = WorkoutModel;