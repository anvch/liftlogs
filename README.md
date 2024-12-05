# liftlogs

## **Project Vision**

The initial concept for LiftLogs was to create a mobile application that gamifies fitness tracking by visually representing workout consistency through an intuitive calendar interface, similar to GitHub’s contribution graph. This approach aimed to provide fitness enthusiasts with a more engaging and motivating way to track and monitor their progress.

## **Development Environment Setup**

1. Clone this git repository
2. Run 'npm install'
3. To run the frontend, run 'npm run dev' in terminal, inside directory 'packages/react-frontend'
4. If you would like to test the backend locally:
   a. Create a .env.local file in packages/react-frontend
   b. put 'VITE_BACKEND_HOST=http://localhost:3001' inside the file
   c. run 'npm run start' in terminal, inside directory 'packages/workout-backend'
5. Before you push any code, make sure it uses our formatting (can find out how to set up in [CONTRIBUTING.md](./docs/CONTRIBUTING.md) or just run 'npm run format' before committing)
   a. Our formatting uses default Prettier and default ESLint settings.

## Documentation

- [API Documentation](./docs/api.md)

---

![Flow diagram for authentication](https://github.com/user-attachments/assets/727acdcc-3786-4ea6-964b-c8e46aebb24f)
