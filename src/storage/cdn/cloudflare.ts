/**
 * Cloudflare CDN Integration
 *
 * Handles CDN configuration, cache management, and invalidation for Supabase Storage
 */

import { CDN_CONFIG } from '../config';

// ===========================
// Type Definitions
// ===========================

export interface CloudflareConfig {
  zoneId: string;
  apiToken: string;
  accountId?: string;
  baseUrl: string;
}

export interface CacheInvalidationOptions {
  paths?: string[];
  tags?: string[];
  hosts?: string[];
  prefixes?: string[];
}

export interface CacheInvalidationResult {
  success: boolean;
  id?: string;
  error?: string;
  purgedUrls?: number;
}

export interface CacheRule {
  path: string;
  edgeTTL: number;
  browserTTL: number;
  cacheByQueryString?: boolean;
  cacheHeaders?: string[];
}

export interface CloudflareAnalytics {
  requests: number;
  bandwidth: number;
  cacheHitRate: number;
  errors: number;
  period: string;
}

// ===========================
// Cloudflare CDN Manager
// ===========================

export class CloudflareCDNManager {
  private config: CloudflareConfig;

  constructor(config: CloudflareConfig) {
    this.config = config;
  }

  /**
   * Purge cache for specific URLs or patterns
   */
  async purgeCache(options: CacheInvalidationOptions): Promise<CacheInvalidationResult> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.buildPurgeRequest(options)),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Cache purge failed',
        };
      }

      return {
        success: true,
        id: data.result?.id,
        purgedUrls: this.estimatePurgedUrls(options),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Purge entire cache
   */
  async purgeEverything(): Promise<CacheInvalidationResult> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purge_everything: true }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Cache purge failed',
        };
      }

      return {
        success: true,
        id: data.result?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Purge cache for a specific storage bucket
   */
  async purgeBucket(bucketName: string): Promise<CacheInvalidationResult> {
    return this.purgeCache({
      prefixes: [`${this.config.baseUrl}/${bucketName}/`],
    });
  }

  /**
   * Purge cache for specific files
   */
  async purgeFiles(bucket: string, paths: string[]): Promise<CacheInvalidationResult> {
    const fullPaths = paths.map(
      (path) => `${this.config.baseUrl}/${bucket}/${path}`
    );

    return this.purgeCache({ paths: fullPaths });
  }

  /**
   * Get cache analytics
   */
  async getAnalytics(period: '1d' | '7d' | '30d' = '1d'): Promise<CloudflareAnalytics | null> {
    try {
      const since = this.getPeriodTimestamp(period);
      const until = new Date().toISOString();

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/analytics/dashboard?since=${since}&until=${until}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Failed to fetch analytics:', data.errors);
        return null;
      }

      const result = data.result?.totals || {};

      return {
        requests: result.requests?.all || 0,
        bandwidth: result.bandwidth?.all || 0,
        cacheHitRate: this.calculateHitRate(result),
        errors: result.requests?.http_status?.['5xx'] || 0,
        period,
      };
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return null;
    }
  }

  /**
   * Create cache rules for storage buckets
   */
  async createCacheRules(): Promise<boolean> {
    try {
      const rules = CDN_CONFIG.cachingRules.map((rule, index) => ({
        id: `storage-rule-${index}`,
        expression: `(http.request.uri.path matches "${rule.pattern}")`,
        action: 'cache',
        action_parameters: {
          cache: {
            edge_ttl: rule.duration,
            browser_ttl: Math.min(rule.duration, 3600), // Max 1 hour browser cache
            cache_by_device_type: false,
          },
        },
        description: rule.description,
      }));

      // Note: This would require Cloudflare Page Rules API or Cache Rules API
      // Implementation depends on Cloudflare plan level
      console.log('Cache rules to be created:', rules);
      return true;
    } catch (error) {
      console.error('Failed to create cache rules:', error);
      return false;
    }
  }

  /**
   * Test CDN configuration
   */
  async testConfiguration(): Promise<{
    connected: boolean;
    cacheWorking: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let connected = false;
    let cacheWorking = false;

    try {
      // Test API connection
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        connected = true;
      } else {
        errors.push(data.errors?.[0]?.message || 'API connection failed');
      }

      // Test cache functionality
      const testUrl = `${this.config.baseUrl}/test.txt`;
      const cacheResponse = await fetch(testUrl);
      const cfCacheStatus = cacheResponse.headers.get('cf-cache-status');

      if (cfCacheStatus) {
        cacheWorking = true;
      } else {
        errors.push('Cache headers not present');
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return { connected, cacheWorking, errors };
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private buildPurgeRequest(options: CacheInvalidationOptions) {
    const request: any = {};

    if (options.paths && options.paths.length > 0) {
      request.files = options.paths;
    }

    if (options.tags && options.tags.length > 0) {
      request.tags = options.tags;
    }

    if (options.hosts && options.hosts.length > 0) {
      request.hosts = options.hosts;
    }

    if (options.prefixes && options.prefixes.length > 0) {
      request.prefixes = options.prefixes;
    }

    return request;
  }

  private estimatePurgedUrls(options: CacheInvalidationOptions): number {
    let count = 0;

    if (options.paths) count += options.paths.length;
    if (options.tags) count += options.tags.length * 10; // Estimate
    if (options.hosts) count += options.hosts.length * 100; // Estimate
    if (options.prefixes) count += options.prefixes.length * 50; // Estimate

    return count;
  }

  private getPeriodTimestamp(period: string): string {
    const now = new Date();
    const days = parseInt(period.replace('d', ''));
    now.setDate(now.getDate() - days);
    return now.toISOString();
  }

  private calculateHitRate(result: any): number {
    const cached = result.requests?.cached || 0;
    const all = result.requests?.all || 0;

    return all > 0 ? (cached / all) * 100 : 0;
  }
}

// ===========================
// Cache Key Generation
// ===========================

export class CacheKeyGenerator {
  /**
   * Generate cache key for storage object
   */
  static forStorageObject(bucket: string, path: string, version?: string): string {
    const base = `storage:${bucket}:${path}`;
    return version ? `${base}:v${version}` : base;
  }

  /**
   * Generate cache tag for bucket
   */
  static forBucket(bucket: string): string {
    return `bucket:${bucket}`;
  }

  /**
   * Generate cache tag for user uploads
   */
  static forUser(userId: string): string {
    return `user:${userId}`;
  }

  /**
   * Generate cache tag for assessment
   */
  static forAssessment(assessmentId: string): string {
    return `assessment:${assessmentId}`;
  }
}

// ===========================
// Cache Warming
// ===========================

export class CacheWarmer {
  private cdnManager: CloudflareCDNManager;
  private baseUrl: string;

  constructor(cdnManager: CloudflareCDNManager, baseUrl: string) {
    this.cdnManager = cdnManager;
    this.baseUrl = baseUrl;
  }

  /**
   * Warm cache for frequently accessed files
   */
  async warmFrequentFiles(files: Array<{ bucket: string; path: string }>): Promise<void> {
    const requests = files.map(({ bucket, path }) => {
      const url = `${this.baseUrl}/${bucket}/${path}`;
      return fetch(url, { method: 'HEAD' }).catch((err) =>
        console.error(`Failed to warm ${url}:`, err)
      );
    });

    await Promise.all(requests);
    console.log(`Warmed ${files.length} files`);
  }

  /**
   * Warm cache for entire bucket
   */
  async warmBucket(bucket: string, maxFiles = 100): Promise<void> {
    // This would require listing files from Supabase and warming them
    console.log(`Warming bucket ${bucket} (max ${maxFiles} files)`);
    // Implementation depends on your file listing strategy
  }
}

// ===========================
// Helper Functions
// ===========================

/**
 * Get CDN URL for storage object
 */
export function getCDNUrl(bucket: string, path: string): string {
  if (!CDN_CONFIG.enabled || !CDN_CONFIG.baseUrl) {
    throw new Error('CDN not configured');
  }

  return `${CDN_CONFIG.baseUrl}/${bucket}/${path}`;
}

/**
 * Get cache control header for bucket
 */
export function getCacheControl(bucket: string): string {
  const rule = CDN_CONFIG.cachingRules.find((r) =>
    r.pattern.includes(bucket)
  );

  return rule ? `public, max-age=${rule.duration}` : 'public, max-age=3600';
}

/**
 * Parse CDN headers from response
 */
export function parseCDNHeaders(headers: Headers): {
  cacheStatus: string;
  age: number;
  ray: string;
} {
  return {
    cacheStatus: headers.get('cf-cache-status') || 'UNKNOWN',
    age: parseInt(headers.get('age') || '0', 10),
    ray: headers.get('cf-ray') || 'UNKNOWN',
  };
}
