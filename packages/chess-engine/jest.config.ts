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
    "^@modules/(.*)$": "<rootDir>/src/$1",
    "^@shared/types/(.*)$": "<rootDir>/src/shared/types/$1",
  },
}
