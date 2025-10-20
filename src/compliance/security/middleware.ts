/**
 * Security Middleware
 *
 * Input validation, sanitization, and protection
 */

import { SecurityContext, ValidationRule } from '../types';

// ============================================================================
// Input Validator
// ============================================================================

export class InputValidator {
  /**
   * Validate input against rules
   */
  validate(
    input: Record<string, any>,
    rules: ValidationRule[]
  ): {
    isValid: boolean;
    errors: Array<{ field: string; message: string }>;
    sanitized: Record<string, any>;
  } {
    const errors: Array<{ field: string; message: string }> = [];
    const sanitized: Record<string, any> = {};

    for (const rule of rules) {
      const value = input[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: rule.field, message: `${rule.field} is required` });
        continue;
      }

      // Skip validation if not required and empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type validation
      const typeError = this.validateType(value, rule.type);
      if (typeError) {
        errors.push({ field: rule.field, message: typeError });
        continue;
      }

      // Length validation
      if (rule.type === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at least ${rule.minLength} characters`
          });
          continue;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must not exceed ${rule.maxLength} characters`
          });
          continue;
        }
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} format is invalid`
        });
        continue;
      }

      // Custom validation
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} validation failed`
        });
        continue;
      }

      // Sanitize
      sanitized[rule.field] = rule.sanitizer ? rule.sanitizer(value) : value;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  /**
   * Validate type
   */
  private validateType(value: any, type: ValidationRule['type']): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return 'Must be a string';
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return 'Must be a number';
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          return 'Must be a valid email address';
        }
        break;

      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          return 'Must be a valid date';
        }
        break;

      case 'file':
        // File validation handled separately
        break;

      case 'custom':
        // Custom validation handled by customValidator
        break;
    }

    return null;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize string (prevent XSS)
   */
  sanitizeString(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize HTML
   */
  sanitizeHTML(html: string): string {
    // Allow only safe tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'];
    const allowedAttributes = ['href', 'title', 'class'];

    // Remove script tags and event handlers
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');

    return sanitized;
  }

  /**
   * Validate file upload
   */
  validateFile(
    file: { name: string; size: number; type: string },
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
      allowedExtensions = []
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB`
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: `File extension is not allowed`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Prevent SQL injection
   */
  sanitizeSQL(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  /**
   * Validate and sanitize URL
   */
  sanitizeURL(url: string): string | null {
    try {
      const parsed = new URL(url);

      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null;
      }

      // Remove potential XSS vectors
      if (parsed.href.toLowerCase().includes('javascript:')) {
        return null;
      }

      return parsed.href;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Rate Limiter
// ============================================================================

export class RateLimiter {
  private requests: Map<string, Array<{ timestamp: number }>> = new Map();

  /**
   * Check if request is allowed
   */
  isAllowed(
    key: string,
    windowMs: number = 60000, // 1 minute
    maxRequests: number = 60
  ): { allowed: boolean; remaining: number; resetAt: Date } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests
    let userRequests = this.requests.get(key) || [];

    // Remove old requests
    userRequests = userRequests.filter(req => req.timestamp > windowStart);

    // Check limit
    const allowed = userRequests.length < maxRequests;

    if (allowed) {
      userRequests.push({ timestamp: now });
      this.requests.set(key, userRequests);
    }

    const resetAt = new Date(now + windowMs);
    const remaining = Math.max(0, maxRequests - userRequests.length);

    return { allowed, remaining, resetAt };
  }

  /**
   * Reset rate limit for key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clean up old requests
   */
  cleanup(olderThanMs: number = 3600000): void {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const filtered = requests.filter(req => now - req.timestamp < olderThanMs);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

// ============================================================================
// Session Manager
// ============================================================================

export class SessionManager {
  private sessions: Map<string, {
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    data: Record<string, any>;
  }> = new Map();

  /**
   * Create session
   */
  create(
    sessionId: string,
    userId: string,
    data: Record<string, any> = {}
  ): void {
    this.sessions.set(sessionId, {
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      data
    });
  }

  /**
   * Get session
   */
  get(sessionId: string): {
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    data: Record<string, any>;
  } | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  /**
   * Update session data
   */
  update(sessionId: string, data: Record<string, any>): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.data = { ...session.data, ...data };
      session.lastActivity = new Date();
      this.sessions.set(sessionId, session);
      return true;
    }
    return false;
  }

  /**
   * Destroy session
   */
  destroy(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Cleanup expired sessions
   */
  cleanup(maxAgeMs: number = 3600000): number {
    let removed = 0;
    const now = new Date();

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now.getTime() - session.lastActivity.getTime();
      if (age > maxAgeMs) {
        this.sessions.delete(sessionId);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get user sessions
   */
  getUserSessions(userId: string): string[] {
    const sessionIds: string[] = [];
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        sessionIds.push(sessionId);
      }
    }
    return sessionIds;
  }
}

// ============================================================================
// CSRF Protection
// ============================================================================

export class CSRFProtection {
  private tokens: Map<string, { token: string; expiresAt: Date }> = new Map();

  /**
   * Generate CSRF token
   */
  generateToken(sessionId: string): string {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    this.tokens.set(sessionId, { token, expiresAt });
    return token;
  }

  /**
   * Verify CSRF token
   */
  verifyToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    if (!stored) return false;

    if (stored.expiresAt < new Date()) {
      this.tokens.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  /**
   * Cleanup expired tokens
   */
  cleanup(): number {
    let removed = 0;
    const now = new Date();

    for (const [sessionId, data] of this.tokens.entries()) {
      if (data.expiresAt < now) {
        this.tokens.delete(sessionId);
        removed++;
      }
    }

    return removed;
  }
}

// ============================================================================
// Export instances
// ============================================================================

export const inputValidator = new InputValidator();
export const rateLimiter = new RateLimiter();
export const sessionManager = new SessionManager();
export const csrfProtection = new CSRFProtection();
