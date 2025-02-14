/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  rootDir: "./",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@chesstypes/(.*)$": "<rootDir>/src/shared/types/$1",
  },
}
