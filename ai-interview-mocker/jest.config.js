const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
  },
  // ✅ Add this to ignore specific folders/files from coverage
  coveragePathIgnorePatterns: [
    "<rootDir>/components/ui/",
    "<rootDir>/app/dashboard/interview/[interviewId]/start/_components/",
  ],
};

module.exports = createJestConfig(customJestConfig);
