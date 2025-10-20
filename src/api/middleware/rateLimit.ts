import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

interface RateLimitConfig {
  points: number; // Number of requests
  duration: number; // Per duration in seconds
  blockDuration?: number; // Block duration in seconds if consumed more than points
}

// Different rate limit configurations for different endpoints
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: {
    points: 100,
    duration: 60, // 100 requests per minute
  },
  upload: {
    points: 10,
    duration: 60, // 10 uploads per minute
    blockDuration: 300 // Block for 5 minutes if exceeded
  },
  search: {
    points: 50,
    duration: 60, // 50 searches per minute
  },
  admin: {
    points: 200,
    duration: 60, // 200 requests per minute for admins
  }
};

// Create rate limiters
const rateLimiters = new Map<string, RateLimiterMemory>();

for (const [key, config] of Object.entries(rateLimitConfigs)) {
  rateLimiters.set(key, new RateLimiterMemory({
    points: config.points,
    duration: config.duration,
    blockDuration: config.blockDuration
  }));
}

/**
 * Get client identifier from request
 */
const getClientId = (req: Request): string => {
  // Use user ID if authenticated
  const userId = (req as any).user?.id;
  if (userId) {
    return `user:${userId}`;
  }

  // Otherwise use IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  return `ip:${ip}`;
};

/**
 * Rate limiting middleware factory
 */
export const rateLimit = (limiterKey: keyof typeof rateLimitConfigs = 'default') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rateLimiter = rateLimiters.get(limiterKey);

    if (!rateLimiter) {
      console.error(`Rate limiter not found: ${limiterKey}`);
      next();
      return;
    }

    const clientId = getClientId(req);

    try {
      const rateLimiterRes: RateLimiterRes = await rateLimiter.consume(clientId);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', rateLimitConfigs[limiterKey].points);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

      next();
    } catch (rateLimiterRes) {
      const error = rateLimiterRes as RateLimiterRes;

      // Calculate retry after time
      const retryAfter = Math.ceil(error.msBeforeNext / 1000);

      res.setHeader('X-RateLimit-Limit', rateLimitConfigs[limiterKey].points);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + error.msBeforeNext).toISOString());
      res.setHeader('Retry-After', retryAfter);

      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          details: {
            limit: rateLimitConfigs[limiterKey].points,
            window: rateLimitConfigs[limiterKey].duration,
            retryAfter
          }
        }
      });
    }
  };
};

/**
 * Advanced rate limiting with different tiers
 */
export const tieredRateLimit = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = (req as any).user;

    // Determine which rate limiter to use based on user role
    let limiterKey: keyof typeof rateLimitConfigs = 'default';

    if (user?.role === 'admin') {
      limiterKey = 'admin';
    } else if (req.path.includes('/upload')) {
      limiterKey = 'upload';
    } else if (req.path.includes('/search')) {
      limiterKey = 'search';
    }

    // Use the appropriate rate limiter
    const middleware = rateLimit(limiterKey);
    await middleware(req, res, next);
  };
};

/**
 * Dynamic rate limiting based on system load
 */
export class DynamicRateLimiter {
  private basePoints: number;
  private currentLoad: number = 0;
  private rateLimiter: RateLimiterMemory;

  constructor(basePoints: number = 100, duration: number = 60) {
    this.basePoints = basePoints;
    this.rateLimiter = new RateLimiterMemory({
      points: basePoints,
      duration
    });
  }

  updateLoad(load: number): void {
    this.currentLoad = load;

    // Reduce points when system load is high
    const adjustedPoints = Math.floor(this.basePoints * (1 - load));

    this.rateLimiter = new RateLimiterMemory({
      points: Math.max(adjustedPoints, 10), // Minimum 10 requests
      duration: 60
    });
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const clientId = getClientId(req);

      try {
        const rateLimiterRes = await this.rateLimiter.consume(clientId);

        res.setHeader('X-RateLimit-Limit', this.rateLimiter.points);
        res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
        res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
        res.setHeader('X-System-Load', this.currentLoad.toFixed(2));

        next();
      } catch (rateLimiterRes) {
        const error = rateLimiterRes as RateLimiterRes;
        const retryAfter = Math.ceil(error.msBeforeNext / 1000);

        res.setHeader('Retry-After', retryAfter);
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'System under heavy load. Please try again later.',
            details: {
              retryAfter,
              systemLoad: this.currentLoad
            }
          }
        });
      }
    };
  }
}
