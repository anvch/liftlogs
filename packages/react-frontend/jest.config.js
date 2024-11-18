export default {
  testEnvironment: "jsdom", // Required for testing DOM elements
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Use Babel to transpile JavaScript files
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // For setting up testing library
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore unnecessary paths
};
