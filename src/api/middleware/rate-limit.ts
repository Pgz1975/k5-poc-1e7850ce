/**
 * K5 Platform Rate Limiting & Quota Management
 * Implements token bucket algorithm with Redis backend
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface QuotaConfig {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  limits: {
    uploads: {
      daily: number;
      monthly: number;
    };
    storage: {
      total: number; // in GB
    };
    apiCalls: {
      perMinute: number;
      perHour: number;
      perDay: number;
    };
    voiceRecognition: {
      perDay: number;
      perMonth: number;
    };
  };
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// ============================================================================
// Plan Configurations
// ============================================================================

export const QUOTA_PLANS: Record<string, QuotaConfig> = {
  free: {
    plan: 'free',
    limits: {
      uploads: { daily: 10, monthly: 100 },
      storage: { total: 1 }, // 1GB
      apiCalls: { perMinute: 10, perHour: 100, perDay: 1000 },
      voiceRecognition: { perDay: 50, perMonth: 500 },
    },
  },
  basic: {
    plan: 'basic',
    limits: {
      uploads: { daily: 50, monthly: 1000 },
      storage: { total: 10 }, // 10GB
      apiCalls: { perMinute: 60, perHour: 1000, perDay: 10000 },
      voiceRecognition: { perDay: 200, perMonth: 5000 },
    },
  },
  premium: {
    plan: 'premium',
    limits: {
      uploads: { daily: 200, monthly: 5000 },
      storage: { total: 100 }, // 100GB
      apiCalls: { perMinute: 300, perHour: 5000, perDay: 50000 },
      voiceRecognition: { perDay: 1000, perMonth: 25000 },
    },
  },
  enterprise: {
    plan: 'enterprise',
    limits: {
      uploads: { daily: Infinity, monthly: Infinity },
      storage: { total: Infinity },
      apiCalls: { perMinute: 1000, perHour: 20000, perDay: Infinity },
      voiceRecognition: { perDay: Infinity, perMonth: Infinity },
    },
  },
};

// ============================================================================
// Rate Limiter Class
// ============================================================================

export class RateLimiter {
  private supabase: ReturnType<typeof createClient>;
  private config: RateLimitConfig;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    config: RateLimitConfig
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.config = {
      keyPrefix: 'ratelimit',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  /**
   * Check if request is within rate limit
   */
  async checkLimit(
    identifier: string,
    cost: number = 1
  ): Promise<RateLimitResult> {
    const key = `${this.config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get current request count from database
      const { data: limitData, error } = await this.supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .gte('window_start', new Date(windowStart).toISOString())
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is ok
        throw error;
      }

      let currentCount = 0;
      let windowStartTime = now;

      if (limitData) {
        currentCount = limitData.request_count;
        windowStartTime = new Date(limitData.window_start).getTime();
      }

      const remaining = Math.max(0, this.config.maxRequests - currentCount - cost);
      const allowed = currentCount + cost <= this.config.maxRequests;
      const resetTime = windowStartTime + this.config.windowMs;

      if (allowed) {
        // Increment counter
        await this.incrementCounter(key, windowStart, cost);
      }

      return {
        allowed,
        limit: this.config.maxRequests,
        remaining,
        resetTime,
        retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow request if rate limit check fails
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
      };
    }
  }

  /**
   * Increment request counter
   */
  private async incrementCounter(
    key: string,
    windowStart: number,
    cost: number
  ): Promise<void> {
    const windowStartDate = new Date(windowStart).toISOString();

    await this.supabase.rpc('increment_rate_limit', {
      p_key: key,
      p_window_start: windowStartDate,
      p_increment: cost,
      p_window_ms: this.config.windowMs,
    });
  }

  /**
   * Reset rate limit for a key
   */
  async resetLimit(identifier: string): Promise<void> {
    const key = `${this.config.keyPrefix}:${identifier}`;
    await this.supabase
      .from('rate_limits')
      .delete()
      .eq('key', key);
  }
}

// ============================================================================
// Quota Manager Class
// ============================================================================

export class QuotaManager {
  private supabase: ReturnType<typeof createClient>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Check if user is within quota limits
   */
  async checkQuota(
    userId: string,
    quotaType: 'uploads' | 'storage' | 'apiCalls' | 'voiceRecognition',
    amount: number = 1
  ): Promise<{ allowed: boolean; current: number; limit: number; resetDate?: string }> {
    try {
      // Get user's plan
      const { data: profile } = await this.supabase
        .from('user_profiles')
        .select('plan')
        .eq('user_id', userId)
        .single();

      const plan = profile?.plan || 'free';
      const quotaConfig = QUOTA_PLANS[plan];

      // Get current usage
      const usage = await this.getUsage(userId, quotaType);
      const limit = this.getLimit(quotaConfig, quotaType);

      const allowed = usage + amount <= limit;

      return {
        allowed,
        current: usage,
        limit,
        resetDate: this.getResetDate(quotaType),
      };
    } catch (error) {
      console.error('Quota check failed:', error);
      // Fail open
      return {
        allowed: true,
        current: 0,
        limit: Infinity,
      };
    }
  }

  /**
   * Increment quota usage
   */
  async incrementUsage(
    userId: string,
    quotaType: 'uploads' | 'storage' | 'apiCalls' | 'voiceRecognition',
    amount: number = 1
  ): Promise<void> {
    const period = this.getPeriod(quotaType);
    const key = `${userId}:${quotaType}:${period}`;

    await this.supabase.rpc('increment_quota_usage', {
      p_user_id: userId,
      p_quota_type: quotaType,
      p_period: period,
      p_amount: amount,
    });
  }

  /**
   * Get current usage for a quota type
   */
  private async getUsage(
    userId: string,
    quotaType: string
  ): Promise<number> {
    const period = this.getPeriod(quotaType);

    const { data, error } = await this.supabase
      .from('quota_usage')
      .select('amount')
      .eq('user_id', userId)
      .eq('quota_type', quotaType)
      .eq('period', period)
      .single();

    if (error) return 0;
    return data?.amount || 0;
  }

  /**
   * Get limit for a quota type
   */
  private getLimit(config: QuotaConfig, quotaType: string): number {
    switch (quotaType) {
      case 'uploads':
        return config.limits.uploads.daily;
      case 'storage':
        return config.limits.storage.total * 1024 * 1024 * 1024; // Convert GB to bytes
      case 'apiCalls':
        return config.limits.apiCalls.perDay;
      case 'voiceRecognition':
        return config.limits.voiceRecognition.perDay;
      default:
        return Infinity;
    }
  }

  /**
   * Get period key for quota type
   */
  private getPeriod(quotaType: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    if (quotaType === 'storage') {
      return 'total';
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Get reset date for quota type
   */
  private getResetDate(quotaType: string): string {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }

  /**
   * Get user's quota information
   */
  async getQuotaInfo(userId: string): Promise<any> {
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('plan')
      .eq('user_id', userId)
      .single();

    const plan = profile?.plan || 'free';
    const quotaConfig = QUOTA_PLANS[plan];

    const [uploads, storage, apiCalls, voiceRecognition] = await Promise.all([
      this.getUsage(userId, 'uploads'),
      this.getUsage(userId, 'storage'),
      this.getUsage(userId, 'apiCalls'),
      this.getUsage(userId, 'voiceRecognition'),
    ]);

    return {
      plan,
      uploads: {
        used: uploads,
        limit: quotaConfig.limits.uploads.daily,
        resetDate: this.getResetDate('uploads'),
      },
      storage: {
        used: storage,
        limit: quotaConfig.limits.storage.total * 1024 * 1024 * 1024,
        unit: 'GB',
      },
      apiCalls: {
        used: apiCalls,
        limit: quotaConfig.limits.apiCalls.perDay,
        resetDate: this.getResetDate('apiCalls'),
      },
      voiceRecognition: {
        used: voiceRecognition,
        limit: quotaConfig.limits.voiceRecognition.perDay,
        resetDate: this.getResetDate('voiceRecognition'),
      },
    };
  }
}

// ============================================================================
// Middleware Factory
// ============================================================================

export function createRateLimitMiddleware(
  supabaseUrl: string,
  supabaseKey: string,
  config: RateLimitConfig
) {
  const limiter = new RateLimiter(supabaseUrl, supabaseKey, config);

  return async (req: any, res: any, next: any) => {
    const identifier = req.auth?.userId || req.ip || 'anonymous';
    const result = await limiter.checkLimit(identifier);

    // Set rate limit headers
    if (res.setHeader) {
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.resetTime);
    }

    if (!result.allowed) {
      if (res.status) {
        res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            retryAfter: result.retryAfter,
          },
        });
      }
      return {
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: result.retryAfter,
      };
    }

    next?.();
  };
}

export function createQuotaMiddleware(
  supabaseUrl: string,
  supabaseKey: string,
  quotaType: 'uploads' | 'storage' | 'apiCalls' | 'voiceRecognition'
) {
  const quotaManager = new QuotaManager(supabaseUrl, supabaseKey);

  return async (req: any, res: any, next: any) => {
    if (!req.auth?.userId) {
      next?.();
      return;
    }

    const result = await quotaManager.checkQuota(req.auth.userId, quotaType);

    if (!result.allowed) {
      if (res.status) {
        res.status(429).json({
          error: {
            code: 'QUOTA_EXCEEDED',
            message: `${quotaType} quota exceeded`,
            current: result.current,
            limit: result.limit,
            resetDate: result.resetDate,
          },
        });
      }
      return {
        error: 'QUOTA_EXCEEDED',
        quotaType,
      };
    }

    next?.();
  };
}
