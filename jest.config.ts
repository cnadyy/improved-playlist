import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@/api/(.*)$": "<rootDir>/src/api/$1",
        "^@/css/(.*)$": "<rootDir>/src/css$1",
        "^@/mock/(.*)$": "<rootDir>/mock-data/$1",
        "^@/fb/(.*)$": "<rootDir>/src/api/firebase/$1",
    },
};

export default config;
