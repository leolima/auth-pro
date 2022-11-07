/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    address: "http://localhost:4001",
    auth: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.zIfkO4AsrofMXSXsJxu0fdGba8GDovxQG2eE9wpHJcc",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
