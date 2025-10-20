/**
 * Global Test Setup
 * Runs before all test suites
 */

import { config } from 'dotenv';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';

// Global test timeout
const GLOBAL_TIMEOUT = 30000;

// Mock console methods in test environment to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress expected error messages in tests
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (
      !message.includes('Warning:') &&
      !message.includes('act()') &&
      !message.includes('React')
    ) {
      originalConsoleError(...args);
    }
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (!message.includes('deprecated')) {
      originalConsoleWarn(...args);
    }
  };
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testTimeout = GLOBAL_TIMEOUT;

// Cleanup between tests
beforeEach(() => {
  // Clear any test-specific state
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks?.();
});

// Export test utilities
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTestId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const expectToThrowAsync = async (
  fn: () => Promise<any>,
  errorMessage?: string | RegExp
) => {
  let error: Error | null = null;
  try {
    await fn();
  } catch (e) {
    error = e as Error;
  }

  if (!error) {
    throw new Error('Expected function to throw but it did not');
  }

  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      expect(error.message).toContain(errorMessage);
    } else {
      expect(error.message).toMatch(errorMessage);
    }
  }

  return error;
};
