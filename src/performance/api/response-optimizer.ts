/**
 * API Response Optimization
 * Compression, caching, pagination, and rate limiting
 */

import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import zlib from 'zlib';

export interface CompressionConfig {
  threshold?: number; // Minimum size to compress (bytes)
  level?: number; // 0-9
  algorithms?: Array<'gzip' | 'deflate' | 'br'>;
  mimeTypes?: string[];
}

export interface PaginationConfig {
  defaultLimit?: number;
  maxLimit?: number;
  offsetBased?: boolean;
  cursorBased?: boolean;
}

export interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

/**
 * Response Compression Middleware
 */
export class ResponseCompressor extends EventEmitter {
  private config: Required<CompressionConfig>;

  constructor(config: CompressionConfig = {}) {
    super();

    this.config = {
      threshold: config.threshold ?? 1024, // 1KB
      level: config.level ?? 6, // Balanced compression
      algorithms: config.algorithms ?? ['br', 'gzip', 'deflate'],
      mimeTypes: config.mimeTypes ?? [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml',
        'application/javascript',
      ],
    };
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.send;
      const originalJson = res.json;
      const startTime = Date.now();

      // Intercept send
      res.send = (body: any) => {
        this.compressResponse(req, res, body, originalSend.bind(res));
        this.emit('response', {
          path: req.path,
          method: req.method,
          duration: Date.now() - startTime,
        });
        return res;
      };

      // Intercept json
      res.json = (body: any) => {
        this.compressResponse(req, res, JSON.stringify(body), originalSend.bind(res));
        this.emit('response', {
          path: req.path,
          method: req.method,
          duration: Date.now() - startTime,
        });
        return res;
      };

      next();
    };
  }

  private compressResponse(
    req: Request,
    res: Response,
    body: any,
    originalSend: (body: any) => Response
  ): void {
    // Check content type
    const contentType = res.getHeader('content-type') as string;
    if (!this.shouldCompress(contentType)) {
      originalSend(body);
      return;
    }

    // Check size threshold
    const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
    if (bodyBuffer.length < this.config.threshold) {
      originalSend(body);
      return;
    }

    // Determine best compression algorithm
    const acceptEncoding = req.headers['accept-encoding'] as string;
    const algorithm = this.selectAlgorithm(acceptEncoding);

    if (!algorithm) {
      originalSend(body);
      return;
    }

    // Compress
    this.compress(bodyBuffer, algorithm)
      .then((compressed) => {
        res.setHeader('Content-Encoding', algorithm);
        res.setHeader('Content-Length', compressed.length);
        res.setHeader('X-Original-Size', bodyBuffer.length);
        res.setHeader('X-Compression-Ratio', (1 - compressed.length / bodyBuffer.length).toFixed(3));

        this.emit('compressed', {
          algorithm,
          originalSize: bodyBuffer.length,
          compressedSize: compressed.length,
          ratio: 1 - compressed.length / bodyBuffer.length,
        });

        originalSend(compressed);
      })
      .catch((error) => {
        this.emit('error', { error, algorithm });
        originalSend(body);
      });
  }

  private shouldCompress(contentType: string): boolean {
    if (!contentType) return false;

    return this.config.mimeTypes.some((type) => contentType.includes(type));
  }

  private selectAlgorithm(acceptEncoding: string): string | null {
    if (!acceptEncoding) return null;

    for (const algorithm of this.config.algorithms) {
      if (acceptEncoding.includes(algorithm)) {
        return algorithm;
      }
    }

    return null;
  }

  private async compress(buffer: Buffer, algorithm: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const callback = (error: Error | null, result: Buffer) => {
        if (error) reject(error);
        else resolve(result);
      };

      switch (algorithm) {
        case 'br':
          zlib.brotliCompress(
            buffer,
            {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: this.config.level,
              },
            },
            callback
          );
          break;

        case 'gzip':
          zlib.gzip(buffer, { level: this.config.level }, callback);
          break;

        case 'deflate':
          zlib.deflate(buffer, { level: this.config.level }, callback);
          break;

        default:
          reject(new Error(`Unknown algorithm: ${algorithm}`));
      }
    });
  }
}

/**
 * Pagination Helper
 */
export class PaginationManager {
  private config: Required<PaginationConfig>;

  constructor(config: PaginationConfig = {}) {
    this.config = {
      defaultLimit: config.defaultLimit ?? 20,
      maxLimit: config.maxLimit ?? 100,
      offsetBased: config.offsetBased ?? true,
      cursorBased: config.cursorBased ?? false,
    };
  }

  public parsePaginationParams(req: Request): {
    limit: number;
    offset?: number;
    cursor?: string;
    page?: number;
  } {
    const limit = Math.min(
      parseInt(req.query.limit as string, 10) || this.config.defaultLimit,
      this.config.maxLimit
    );

    const result: any = { limit };

    if (this.config.offsetBased) {
      const page = parseInt(req.query.page as string, 10) || 1;
      result.page = page;
      result.offset = (page - 1) * limit;
    }

    if (this.config.cursorBased && req.query.cursor) {
      result.cursor = req.query.cursor as string;
    }

    return result;
  }

  public buildPaginatedResponse<T>(
    data: T[],
    total: number,
    params: { limit: number; offset?: number; page?: number; cursor?: string },
    req: Request
  ): {
    data: T[];
    pagination: {
      total: number;
      limit: number;
      offset?: number;
      page?: number;
      totalPages?: number;
      hasNext: boolean;
      hasPrev: boolean;
      nextCursor?: string;
      prevCursor?: string;
      links: {
        first?: string;
        prev?: string;
        next?: string;
        last?: string;
      };
    };
  } {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    const hasNext = params.offset !== undefined ? params.offset + params.limit < total : false;
    const hasPrev = params.offset !== undefined ? params.offset > 0 : false;

    const pagination: any = {
      total,
      limit: params.limit,
      hasNext,
      hasPrev,
      links: {},
    };

    if (params.page !== undefined) {
      const totalPages = Math.ceil(total / params.limit);
      pagination.page = params.page;
      pagination.totalPages = totalPages;
      pagination.offset = params.offset;

      // Build links
      pagination.links.first = `${baseUrl}?limit=${params.limit}&page=1`;
      pagination.links.last = `${baseUrl}?limit=${params.limit}&page=${totalPages}`;

      if (hasPrev) {
        pagination.links.prev = `${baseUrl}?limit=${params.limit}&page=${params.page - 1}`;
      }

      if (hasNext) {
        pagination.links.next = `${baseUrl}?limit=${params.limit}&page=${params.page + 1}`;
      }
    }

    if (params.cursor) {
      // Cursor-based pagination
      if (data.length > 0) {
        pagination.nextCursor = this.encodeCursor(data[data.length - 1]);
        pagination.prevCursor = this.encodeCursor(data[0]);
      }
    }

    return { data, pagination };
  }

  private encodeCursor(item: any): string {
    // Simple base64 encoding of ID or timestamp
    const cursorData = item.id || item._id || item.createdAt;
    return Buffer.from(String(cursorData)).toString('base64');
  }

  public decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('utf-8');
  }
}

/**
 * Rate Limiter with Token Bucket Algorithm
 */
export class RateLimiter extends EventEmitter {
  private config: Required<RateLimitConfig>;
  private buckets = new Map<
    string,
    {
      tokens: number;
      lastRefill: number;
      requests: number;
    }
  >();

  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: RateLimitConfig = {}) {
    super();

    this.config = {
      windowMs: config.windowMs ?? 60000, // 1 minute
      maxRequests: config.maxRequests ?? 100,
      skipSuccessfulRequests: config.skipSuccessfulRequests ?? false,
      skipFailedRequests: config.skipFailedRequests ?? false,
      keyGenerator: config.keyGenerator ?? ((req: Request) => req.ip || 'unknown'),
    };

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const key = this.config.keyGenerator(req);
      const allowed = this.consume(key);

      if (!allowed) {
        const resetTime = this.getResetTime(key);
        res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
        res.setHeader('Retry-After', Math.ceil((resetTime - Date.now()) / 1000));

        this.emit('limited', { key, path: req.path });

        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        });

        return;
      }

      const bucket = this.buckets.get(key)!;
      res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      res.setHeader('X-RateLimit-Reset', Math.ceil(this.getResetTime(key) / 1000));

      // Track response
      res.on('finish', () => {
        const skip =
          (this.config.skipSuccessfulRequests && res.statusCode < 400) ||
          (this.config.skipFailedRequests && res.statusCode >= 400);

        if (skip) {
          this.refund(key);
        }
      });

      next();
    };
  }

  private consume(key: string): boolean {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.config.maxRequests,
        lastRefill: Date.now(),
        requests: 0,
      };
      this.buckets.set(key, bucket);
    }

    // Refill tokens
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const refillAmount = (timePassed / this.config.windowMs) * this.config.maxRequests;

    bucket.tokens = Math.min(this.config.maxRequests, bucket.tokens + refillAmount);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      bucket.requests += 1;
      return true;
    }

    return false;
  }

  private refund(key: string): void {
    const bucket = this.buckets.get(key);
    if (bucket) {
      bucket.tokens = Math.min(this.config.maxRequests, bucket.tokens + 1);
    }
  }

  private getResetTime(key: string): number {
    const bucket = this.buckets.get(key);
    if (!bucket) return Date.now() + this.config.windowMs;

    return bucket.lastRefill + this.config.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    const expiry = this.config.windowMs * 2;

    for (const [key, bucket] of this.buckets) {
      if (now - bucket.lastRefill > expiry) {
        this.buckets.delete(key);
      }
    }
  }

  public shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.buckets.clear();
  }

  public getStats() {
    return {
      totalKeys: this.buckets.size,
      totalRequests: Array.from(this.buckets.values()).reduce(
        (sum, b) => sum + b.requests,
        0
      ),
    };
  }
}

/**
 * GraphQL Query Optimizer
 */
export class GraphQLOptimizer {
  private queryComplexityLimit = 1000;
  private depthLimit = 10;

  public calculateComplexity(query: string): number {
    // Simple complexity calculation based on query structure
    const selections = (query.match(/\{/g) || []).length;
    const fields = (query.match(/\w+(?=\s*[\{\(])/g) || []).length;
    return selections * 10 + fields;
  }

  public calculateDepth(query: string): number {
    let depth = 0;
    let maxDepth = 0;

    for (const char of query) {
      if (char === '{') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === '}') {
        depth--;
      }
    }

    return maxDepth;
  }

  public validateQuery(query: string): {
    valid: boolean;
    errors: string[];
    complexity: number;
    depth: number;
  } {
    const errors: string[] = [];
    const complexity = this.calculateComplexity(query);
    const depth = this.calculateDepth(query);

    if (complexity > this.queryComplexityLimit) {
      errors.push(`Query complexity ${complexity} exceeds limit ${this.queryComplexityLimit}`);
    }

    if (depth > this.depthLimit) {
      errors.push(`Query depth ${depth} exceeds limit ${this.depthLimit}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      complexity,
      depth,
    };
  }
}

// Export singleton instances
export const responseCompressor = new ResponseCompressor();
export const paginationManager = new PaginationManager();
export const rateLimiter = new RateLimiter();
export const graphqlOptimizer = new GraphQLOptimizer();
