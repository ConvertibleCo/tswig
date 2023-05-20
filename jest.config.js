const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// Generate temporary tsconfig.json to bypass ts-node issue with TypeScript 4.5+
// More info: https://github.com/TypeStrong/ts-node/issues/2000
function generateTemporaryTsConfig() {

  const tmpTsConfigPath = path.join(__dirname, "tmp.tsconfig.json");

  if(!fs.existsSync(tmpTsConfigPath)) {
    // Generate temporary tsconfig.json using tsc --showConfig
    execSync(`tsc --showConfig > ${tmpTsConfigPath}`);
  }

  return tmpTsConfigPath;
}

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/unit/**/*.unit.test.(ts|tsx)",
    "**/__tests__/integration/**/*.integration.test.(ts|tsx)",
    "**/__tests__/e2e/**/*.e2e.test.(ts|tsx)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: generateTemporaryTsConfig(),
    }],
  },
  collectCoverage: false,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.d.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  testTimeout: 10000,
  coverageReporters: ["lcov", "text-summary"],
};
