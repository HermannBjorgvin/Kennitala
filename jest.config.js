// jest.config.js

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
};
