/**
 * Sentry Error Tracking Client
 * Comprehensive error tracking and monitoring with Sentry
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { monitoringConfig } from '../config/monitoring.config';
import { LogLevel } from '../types';

interface ErrorContext {
  user?: {
    id?: string;
    ageRange?: string;
    consentType?: string;
  };
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  };
  extra?: Record<string, any>;
  tags?: Record<string, string>;
  level?: Sentry.SeverityLevel;
}

class SentryClient {
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Sentry with configuration
   */
  private initialize(): void {
    if (!monitoringConfig.sentry.enabled || !monitoringConfig.sentry.dsn) {
      console.warn('Sentry is disabled or DSN is not configured');
      return;
    }

    try {
      Sentry.init({
        dsn: monitoringConfig.sentry.dsn,
        environment: monitoringConfig.sentry.environment,

        // Performance Monitoring
        tracesSampleRate: monitoringConfig.sentry.tracesSampleRate,
        profilesSampleRate: monitoringConfig.sentry.profilesSampleRate,

        // Integrations
        integrations: [
          new ProfilingIntegration(),
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Express({ app: undefined }),
          new Sentry.Integrations.Postgres(),
          new Sentry.Integrations.Redis()
        ],

        // Error filtering
        beforeSend(event, hint) {
          // Filter out sensitive data
          if (event.request) {
            delete event.request.cookies;
            if (event.request.headers) {
              delete event.request.headers.authorization;
              delete event.request.headers.cookie;
            }
          }

          // Don't send errors in development unless explicitly enabled
          if (monitoringConfig.sentry.environment === 'development' && !process.env.SENTRY_DEV_ENABLED) {
            return null;
          }

          return event;
        },

        // Breadcrumb filtering
        beforeBreadcrumb(breadcrumb, hint) {
          // Filter sensitive breadcrumb data
          if (breadcrumb.category === 'http' && breadcrumb.data) {
            delete breadcrumb.data.authorization;
            delete breadcrumb.data.cookie;
          }
          return breadcrumb;
        },

        // Release tracking
        release: process.env.SENTRY_RELEASE || `k5-poc@${process.env.npm_package_version || '1.0.0'}`,

        // Distribution
        dist: process.env.SENTRY_DIST,

        // Server name
        serverName: process.env.HOSTNAME || 'k5-server',

        // Maximum breadcrumbs
        maxBreadcrumbs: 50,

        // Attach stack trace
        attachStacktrace: true,

        // Enable automatic session tracking
        autoSessionTracking: true,

        // Enable tracing
        enableTracing: true
      });

      this.initialized = true;
      console.log('Sentry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Capture an exception
   */
  public captureException(error: Error, context?: ErrorContext): string | undefined {
    if (!this.initialized) {
      console.error('Sentry not initialized:', error);
      return undefined;
    }

    return Sentry.captureException(error, {
      level: context?.level || 'error',
      tags: this.sanitizeTags(context?.tags),
      user: this.sanitizeUser(context?.user),
      contexts: {
        request: context?.request
      },
      extra: context?.extra
    });
  }

  /**
   * Capture a message
   */
  public captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: ErrorContext): string | undefined {
    if (!this.initialized) {
      console.log('Sentry not initialized:', message);
      return undefined;
    }

    return Sentry.captureMessage(message, {
      level,
      tags: this.sanitizeTags(context?.tags),
      user: this.sanitizeUser(context?.user),
      extra: context?.extra
    });
  }

  /**
   * Add breadcrumb
   */
  public addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    if (!this.initialized) return;
    Sentry.addBreadcrumb(breadcrumb);
  }

  /**
   * Set user context (COPPA compliant - no PII)
   */
  public setUser(user: { id?: string; ageRange?: string; consentType?: string } | null): void {
    if (!this.initialized) return;

    if (user) {
      Sentry.setUser(this.sanitizeUser(user));
    } else {
      Sentry.setUser(null);
    }
  }

  /**
   * Set tags
   */
  public setTags(tags: Record<string, string>): void {
    if (!this.initialized) return;
    Sentry.setTags(this.sanitizeTags(tags));
  }

  /**
   * Set context
   */
  public setContext(name: string, context: Record<string, any>): void {
    if (!this.initialized) return;
    Sentry.setContext(name, context);
  }

  /**
   * Start a transaction for performance monitoring
   */
  public startTransaction(context: Sentry.TransactionContext): Sentry.Transaction {
    return Sentry.startTransaction(context);
  }

  /**
   * Create a span for detailed performance tracking
   */
  public startSpan(context: Sentry.SpanContext): Sentry.Span | undefined {
    const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
    return transaction?.startChild(context);
  }

  /**
   * Flush all pending events
   */
  public async flush(timeout: number = 2000): Promise<boolean> {
    if (!this.initialized) return true;
    return Sentry.flush(timeout);
  }

  /**
   * Close Sentry
   */
  public async close(timeout: number = 2000): Promise<boolean> {
    if (!this.initialized) return true;
    return Sentry.close(timeout);
  }

  /**
   * Sanitize user data to be COPPA compliant (no PII)
   */
  private sanitizeUser(user?: { id?: string; ageRange?: string; consentType?: string }): Sentry.User | undefined {
    if (!user) return undefined;

    // Only include anonymized data
    return {
      id: user.id ? this.hashUserId(user.id) : undefined, // Hash the user ID
      ageRange: user.ageRange,
      consentType: user.consentType
    };
  }

  /**
   * Sanitize tags to remove sensitive information
   */
  private sanitizeTags(tags?: Record<string, string>): Record<string, string> | undefined {
    if (!tags) return undefined;

    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(tags)) {
      // Skip sensitive keys
      if (this.isSensitiveKey(key)) continue;
      sanitized[key] = String(value).substring(0, 200); // Limit length
    }

    return sanitized;
  }

  /**
   * Check if a key is sensitive
   */
  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'apikey',
      'api_key',
      'authorization',
      'cookie',
      'session',
      'ssn',
      'birthdate',
      'email',
      'phone',
      'address'
    ];

    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  /**
   * Hash user ID for anonymization
   */
  private hashUserId(userId: string): string {
    // Simple hash for demonstration - use crypto in production
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `user_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Get Sentry instance
   */
  public getSentry(): typeof Sentry {
    return Sentry;
  }

  /**
   * Check if Sentry is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

// Singleton instance
export const sentryClient = new SentryClient();

// Helper functions for common error tracking patterns
export const errorTracking = {
  /**
   * Track API error
   */
  trackApiError: (error: Error, request: { method: string; url: string; statusCode?: number }) => {
    sentryClient.captureException(error, {
      tags: {
        errorType: 'api_error',
        method: request.method,
        statusCode: request.statusCode?.toString() || 'unknown'
      },
      request: {
        method: request.method,
        url: request.url
      }
    });
  },

  /**
   * Track processing error
   */
  trackProcessingError: (error: Error, context: { stage: string; contentType?: string; gradeLevel?: string }) => {
    sentryClient.captureException(error, {
      tags: {
        errorType: 'processing_error',
        stage: context.stage,
        contentType: context.contentType || 'unknown',
        gradeLevel: context.gradeLevel || 'unknown'
      },
      extra: context
    });
  },

  /**
   * Track database error
   */
  trackDatabaseError: (error: Error, query?: { operation: string; table?: string }) => {
    sentryClient.captureException(error, {
      tags: {
        errorType: 'database_error',
        operation: query?.operation || 'unknown',
        table: query?.table || 'unknown'
      }
    });
  },

  /**
   * Track LLM error
   */
  trackLLMError: (error: Error, context: { model: string; operation: string; tokens?: number }) => {
    sentryClient.captureException(error, {
      tags: {
        errorType: 'llm_error',
        model: context.model,
        operation: context.operation
      },
      extra: {
        tokens: context.tokens
      }
    });
  },

  /**
   * Track performance issue
   */
  trackPerformanceIssue: (message: string, metrics: { duration: number; threshold: number; operation: string }) => {
    sentryClient.captureMessage(message, 'warning', {
      tags: {
        issueType: 'performance',
        operation: metrics.operation
      },
      extra: metrics
    });
  },

  /**
   * Track user error (COPPA compliant)
   */
  trackUserError: (error: Error, user: { ageRange: string; consentType: string }) => {
    sentryClient.captureException(error, {
      tags: {
        errorType: 'user_error',
        ageRange: user.ageRange,
        consentType: user.consentType
      },
      user: {
        ageRange: user.ageRange,
        consentType: user.consentType
      }
    });
  }
};

// Express middleware for Sentry
export const sentryMiddleware = {
  requestHandler: () => Sentry.Handlers.requestHandler(),
  tracingHandler: () => Sentry.Handlers.tracingHandler(),
  errorHandler: () => Sentry.Handlers.errorHandler()
};

export default sentryClient;
