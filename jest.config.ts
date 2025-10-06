import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageReporters: ['text-summary', 'json-summary', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 69,
      branches: 52,
      functions: 58,
      lines: 71,
    },
  },
  workerIdleMemoryLimit: '1024MB',
};

export default createJestConfig(config);
