import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        resolveJsonModule: true
      }
    }]
  },
  collectCoverageFrom: [
    'unit/**/*.{js,ts}',
    'integration/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^@tests/(.*)$': '<rootDir>/$1'
  },
  testTimeout: 30000,
  maxWorkers: '50%',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

export default config;
