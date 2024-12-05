# Architecture

## Stack
Frontend: React/Vite (Javascript)
Backend: Express (Javascript)
Database: DynamoDB

## Frontend Framework and Libraries
- React/Vite
- react-calendar

## Code structure
We have separated our frontend and backend (and the related dependencies) within two packages. The frontend is in 'packages/react-frontend' and the backend is in 'packages/workout-backend'

## 3rd Party APIs
We are using bcrypt and jsonwebtoken for our authentication. We are also basing off our calendar off of react-calendar.
  
## Flow diagram for authentication
![Flow diagram for authentication](https://github.com/user-attachments/assets/727acdcc-3786-4ea6-964b-c8e46aebb24f)
