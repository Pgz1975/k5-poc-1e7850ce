/**
 * K5 Platform API - Main Entry Point
 * Export all API components for easy access
 */

// ============================================================================
// Types
// ============================================================================

export * from './types';

// ============================================================================
// Validation Schemas
// ============================================================================

export * from './validation/schemas';

// ============================================================================
// Middleware
// ============================================================================

export * from './middleware/auth';
export * from './middleware/rate-limit';
export * from './utils/response';

// ============================================================================
// Routes (for server-side)
// ============================================================================

export { default as pdfRoutes } from './routes/pdf';
export { default as searchRoutes } from './routes/search';
export { default as assessmentRoutes } from './routes/assessment';
export { default as voiceRoutes } from './routes/voice';
export { default as webhookRoutes } from './routes/webhooks';

// ============================================================================
// GraphQL
// ============================================================================

export * from './graphql/schema';
export * from './graphql/resolvers';

// ============================================================================
// Real-time Subscriptions
// ============================================================================

export * from './realtime/subscriptions';

// ============================================================================
// Client SDK
// ============================================================================

export * from './client/k5-client';

// ============================================================================
// Documentation
// ============================================================================

export { openApiSpec } from './docs/openapi';

// ============================================================================
// Constants
// ============================================================================

export const API_VERSION = 'v1';
export const API_BASE_PATH = '/api/v1';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create full API URL
 */
export function createApiUrl(baseUrl: string, endpoint: string): string {
  return `${baseUrl}${API_BASE_PATH}${endpoint}`;
}

/**
 * Get API version info
 */
export function getApiVersionInfo() {
  return {
    version: API_VERSION,
    basePath: API_BASE_PATH,
    features: [
      'PDF Upload & Processing',
      'Full-text Search',
      'Assessment Management',
      'Voice Recognition',
      'Real-time Subscriptions',
      'Webhook Notifications',
      'GraphQL Support',
      'Rate Limiting',
      'Role-based Access Control',
    ],
  };
}
