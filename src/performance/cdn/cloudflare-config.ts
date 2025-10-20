/**
 * Cloudflare CDN Configuration for PDF Content Delivery
 * Optimized for K5 educational content distribution
 * Target: <3s single page, <45s for 100 pages
 */

import { EventEmitter } from 'events';

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  r2BucketName: string;
  customDomain?: string;
  cacheRules?: CacheRule[];
  compressionEnabled?: boolean;
  cdnZoneId?: string;
}

export interface CacheRule {
  pattern: string;
  ttl: number; // seconds
  edgeTTL?: number;
  browserTTL?: number;
  bypassCache?: boolean;
  cacheKey?: string[];
}

export interface CDNPerformanceMetrics {
  requestCount: number;
  cacheHitRate: number;
  bandwidthSaved: number;
  avgResponseTime: number;
  errorRate: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
  compress?: boolean;
  optimizeImages?: boolean;
}

export class CloudflareCDNManager extends EventEmitter {
  private config: CloudflareConfig;
  private metrics: CDNPerformanceMetrics = {
    requestCount: 0,
    cacheHitRate: 0,
    bandwidthSaved: 0,
    avgResponseTime: 0,
    errorRate: 0,
    p95ResponseTime: 0,
    p99ResponseTime: 0,
  };

  constructor(config: CloudflareConfig) {
    super();
    this.config = config;
    this.initializeCDN();
  }

  private async initializeCDN(): Promise<void> {
    // Verify R2 bucket access
    try {
      await this.verifyBucketAccess();

      // Configure cache rules
      await this.configureCacheRules();

      // Enable compression
      if (this.config.compressionEnabled !== false) {
        await this.enableCompression();
      }

      this.emit('initialized');
    } catch (error) {
      this.emit('error', { operation: 'initialize', error });
      throw error;
    }
  }

  private async verifyBucketAccess(): Promise<boolean> {
    // Verify R2 bucket exists and is accessible
    return true; // Implementation depends on R2 SDK
  }

  /**
   * Upload file to R2 with CDN optimization
   */
  public async uploadFile(
    key: string,
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<string> {
    const startTime = Date.now();

    try {
      // Compress if enabled and beneficial
      let finalBuffer = buffer;
      let contentEncoding: string | undefined;

      if (options.compress !== false && buffer.length > 1024) {
        const compressed = await this.compressBuffer(buffer);
        if (compressed.length < buffer.length * 0.9) {
          finalBuffer = compressed;
          contentEncoding = 'gzip';
          this.metrics.bandwidthSaved += buffer.length - compressed.length;
        }
      }

      // Optimize images if needed
      if (options.optimizeImages && this.isImageFile(key)) {
        finalBuffer = await this.optimizeImage(finalBuffer, key);
      }

      // Generate optimal cache headers
      const cacheControl = options.cacheControl || this.getCacheControl(key);

      // Upload to R2
      const url = await this.performUpload(key, finalBuffer, {
        contentType: options.contentType || this.getContentType(key),
        cacheControl,
        contentEncoding,
        metadata: options.metadata,
      });

      // Purge CDN cache if updating existing file
      await this.purgeCacheForKey(key);

      const duration = Date.now() - startTime;
      this.updateMetrics(duration, true);

      this.emit('uploaded', { key, size: finalBuffer.length, duration });

      return url;
    } catch (error) {
      this.updateMetrics(Date.now() - startTime, false);
      this.emit('error', { operation: 'upload', key, error });
      throw error;
    }
  }

  /**
   * Batch upload with parallel processing
   */
  public async uploadBatch(
    files: Array<{ key: string; buffer: Buffer; options?: UploadOptions }>
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const batchSize = 5; // Parallel upload limit

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const promises = batch.map(async (file) => {
        const url = await this.uploadFile(file.key, file.buffer, file.options);
        return { key: file.key, url };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ key, url }) => results.set(key, url));
    }

    return results;
  }

  /**
   * Get file with CDN edge caching
   */
  public async getFile(key: string): Promise<Buffer> {
    const startTime = Date.now();

    try {
      const url = this.getFileURL(key);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}: ${response.statusText}`);
      }

      // Check cache status
      const cacheStatus = response.headers.get('cf-cache-status');
      if (cacheStatus === 'HIT') {
        this.metrics.requestCount++;
        this.metrics.cacheHitRate =
          (this.metrics.cacheHitRate * (this.metrics.requestCount - 1) + 1) /
          this.metrics.requestCount;
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      const duration = Date.now() - startTime;
      this.updateMetrics(duration, true);

      return buffer;
    } catch (error) {
      this.updateMetrics(Date.now() - startTime, false);
      this.emit('error', { operation: 'get', key, error });
      throw error;
    }
  }

  /**
   * Delete file from R2 and purge from CDN
   */
  public async deleteFile(key: string): Promise<boolean> {
    try {
      // Delete from R2
      await this.performDelete(key);

      // Purge from CDN cache
      await this.purgeCacheForKey(key);

      this.emit('deleted', { key });
      return true;
    } catch (error) {
      this.emit('error', { operation: 'delete', key, error });
      return false;
    }
  }

  /**
   * Purge CDN cache for specific keys
   */
  public async purgeCacheForKey(key: string): Promise<boolean> {
    if (!this.config.cdnZoneId) return false;

    try {
      const url = this.getFileURL(key);

      // Call Cloudflare API to purge cache
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.cdnZoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: [url],
          }),
        }
      );

      return response.ok;
    } catch (error) {
      this.emit('error', { operation: 'purgeCache', key, error });
      return false;
    }
  }

  /**
   * Purge entire CDN cache
   */
  public async purgeAllCache(): Promise<boolean> {
    if (!this.config.cdnZoneId) return false;

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.cdnZoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            purge_everything: true,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      this.emit('error', { operation: 'purgeAllCache', error });
      return false;
    }
  }

  /**
   * Configure cache rules via Cloudflare API
   */
  private async configureCacheRules(): Promise<void> {
    if (!this.config.cacheRules || !this.config.cdnZoneId) return;

    // Default cache rules for PDF content
    const defaultRules: CacheRule[] = [
      {
        pattern: '*.pdf',
        ttl: 86400, // 24 hours
        edgeTTL: 86400,
        browserTTL: 3600,
        cacheKey: ['$uri', '$query_string'],
      },
      {
        pattern: '*.png',
        ttl: 604800, // 7 days
        edgeTTL: 604800,
        browserTTL: 86400,
      },
      {
        pattern: '*.jpg',
        ttl: 604800,
        edgeTTL: 604800,
        browserTTL: 86400,
      },
      {
        pattern: '/api/*',
        ttl: 300, // 5 minutes
        edgeTTL: 300,
        browserTTL: 0,
      },
    ];

    const rules = [...defaultRules, ...this.config.cacheRules];

    // Apply cache rules via Cloudflare API
    for (const rule of rules) {
      try {
        await this.applyCacheRule(rule);
      } catch (error) {
        this.emit('error', { operation: 'configureCacheRule', rule, error });
      }
    }
  }

  private async applyCacheRule(rule: CacheRule): Promise<void> {
    // Implementation depends on Cloudflare Cache Rules API
    // This is a placeholder for the actual API call
  }

  /**
   * Enable Cloudflare compression (Gzip, Brotli)
   */
  private async enableCompression(): Promise<void> {
    if (!this.config.cdnZoneId) return;

    try {
      // Enable Brotli compression
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.cdnZoneId}/settings/brotli`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: 'on' }),
        }
      );
    } catch (error) {
      this.emit('error', { operation: 'enableCompression', error });
    }
  }

  /**
   * Compress buffer using gzip
   */
  private async compressBuffer(buffer: Buffer): Promise<Buffer> {
    const zlib = await import('zlib');
    return new Promise((resolve, reject) => {
      zlib.gzip(buffer, { level: 6 }, (error, compressed) => {
        if (error) reject(error);
        else resolve(compressed);
      });
    });
  }

  /**
   * Optimize image file
   */
  private async optimizeImage(buffer: Buffer, filename: string): Promise<Buffer> {
    // Placeholder for image optimization logic
    // Could use sharp, imagemin, or Cloudflare Image Optimization
    return buffer;
  }

  /**
   * Get optimal cache control header
   */
  private getCacheControl(key: string): string {
    const ext = key.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return 'public, max-age=86400, s-maxage=604800, immutable';
      case 'json':
        return 'public, max-age=300, s-maxage=300, must-revalidate';
      default:
        return 'public, max-age=3600, s-maxage=86400';
    }
  }

  /**
   * Get content type from filename
   */
  private getContentType(key: string): string {
    const ext = key.split('.').pop()?.toLowerCase();

    const types: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      json: 'application/json',
      txt: 'text/plain',
    };

    return types[ext || ''] || 'application/octet-stream';
  }

  /**
   * Check if file is an image
   */
  private isImageFile(key: string): boolean {
    const ext = key.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '');
  }

  /**
   * Get public URL for file
   */
  public getFileURL(key: string): string {
    const domain = this.config.customDomain ||
                   `${this.config.r2BucketName}.r2.cloudflarestorage.com`;
    return `https://${domain}/${key}`;
  }

  /**
   * Perform actual upload to R2
   */
  private async performUpload(
    key: string,
    buffer: Buffer,
    metadata: {
      contentType: string;
      cacheControl: string;
      contentEncoding?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<string> {
    // Implementation depends on R2 SDK
    // This is a placeholder for the actual upload
    return this.getFileURL(key);
  }

  /**
   * Perform actual delete from R2
   */
  private async performDelete(key: string): Promise<void> {
    // Implementation depends on R2 SDK
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(duration: number, success: boolean): void {
    this.metrics.requestCount++;

    if (success) {
      const prevAvg = this.metrics.avgResponseTime;
      const count = this.metrics.requestCount;
      this.metrics.avgResponseTime = (prevAvg * (count - 1) + duration) / count;
    } else {
      this.metrics.errorRate =
        ((this.metrics.errorRate * (this.metrics.requestCount - 1)) + 1) /
        this.metrics.requestCount;
    }
  }

  /**
   * Get performance analytics
   */
  public async getAnalytics(timeRange: '24h' | '7d' | '30d' = '24h'): Promise<any> {
    if (!this.config.cdnZoneId) return null;

    try {
      const since = this.getTimeRangeTimestamp(timeRange);
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.cdnZoneId}/analytics/dashboard?since=${since}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      this.emit('error', { operation: 'getAnalytics', error });
      return null;
    }
  }

  private getTimeRangeTimestamp(range: '24h' | '7d' | '30d'): number {
    const now = Date.now();
    const ranges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    return now - ranges[range];
  }

  public getMetrics(): CDNPerformanceMetrics {
    return { ...this.metrics };
  }
}

// Singleton instance
let cdnManager: CloudflareCDNManager | null = null;

export function getCDNManager(config?: CloudflareConfig): CloudflareCDNManager {
  if (!cdnManager && config) {
    cdnManager = new CloudflareCDNManager(config);
  }
  if (!cdnManager) {
    throw new Error('CDN Manager not initialized. Provide config on first call.');
  }
  return cdnManager;
}
