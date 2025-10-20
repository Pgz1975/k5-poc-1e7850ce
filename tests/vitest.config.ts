import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/fixtures/',
        'tests/mocks/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**'
      ],
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90
    },
    include: ['**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 8,
        minThreads: 2
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@tests': path.resolve(__dirname, '.')
    }
  }
});
