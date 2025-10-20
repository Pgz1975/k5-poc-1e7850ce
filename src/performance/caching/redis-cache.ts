/**
 * Redis Caching Layer
 * High-performance caching with intelligent invalidation strategies
 */

import Redis, { RedisOptions } from 'ioredis';
import { EventEmitter } from 'events';

export interface CacheConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // Default TTL in seconds
  maxRetries?: number;
  enableCompression?: boolean;
  compressionThreshold?: number; // bytes
}

export interface CacheEntry<T = any> {
  value: T;
  metadata?: {
    createdAt: number;
    hits: number;
    size: number;
    tags?: string[];
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  memoryUsage: number;
  keyCount: number;
}

export class RedisCacheManager extends EventEmitter {
  private client: Redis;
  private config: Required<CacheConfig>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    memoryUsage: 0,
    keyCount: 0,
  };

  constructor(config: CacheConfig = {}) {
    super();

    this.config = {
      host: config.host ?? 'localhost',
      port: config.port ?? 6379,
      password: config.password ?? '',
      db: config.db ?? 0,
      keyPrefix: config.keyPrefix ?? 'pdf:',
      ttl: config.ttl ?? 3600, // 1 hour default
      maxRetries: config.maxRetries ?? 3,
      enableCompression: config.enableCompression ?? true,
      compressionThreshold: config.compressionThreshold ?? 1024, // 1KB
    };

    this.initialize();
  }

  private initialize(): void {
    const redisOptions: RedisOptions = {
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix,
      retryStrategy: (times) => {
        if (times > this.config.maxRetries) {
          return null; // Stop retrying
        }
        return Math.min(times * 100, 3000); // Exponential backoff
      },
      enableReadyCheck: true,
      maxRetriesPerRequest: this.config.maxRetries,
    };

    this.client = new Redis(redisOptions);

    this.client.on('connect', () => {
      this.emit('connected');
    });

    this.client.on('error', (error) => {
      this.emit('error', error);
    });

    this.client.on('ready', () => {
      this.emit('ready');
    });

    // Start stats collection
    this.startStatsCollection();
  }

  private async compress(data: any): Promise<Buffer> {
    if (!this.config.enableCompression) {
      return Buffer.from(JSON.stringify(data));
    }

    const json = JSON.stringify(data);
    const buffer = Buffer.from(json);

    if (buffer.length < this.config.compressionThreshold) {
      return buffer;
    }

    // Use zlib compression
    const zlib = await import('zlib');
    return new Promise((resolve, reject) => {
      zlib.gzip(buffer, (error, compressed) => {
        if (error) reject(error);
        else resolve(compressed);
      });
    });
  }

  private async decompress(buffer: Buffer): Promise<any> {
    if (!this.config.enableCompression) {
      return JSON.parse(buffer.toString());
    }

    // Try to decompress, fallback to direct parse
    try {
      const zlib = await import('zlib');
      return new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (error, decompressed) => {
          if (error) {
            // Not compressed, parse directly
            resolve(JSON.parse(buffer.toString()));
          } else {
            resolve(JSON.parse(decompressed.toString()));
          }
        });
      });
    } catch {
      return JSON.parse(buffer.toString());
    }
  }

  public async get<T = any>(key: string): Promise<T | null> {
    try {
      const buffer = await this.client.getBuffer(key);

      if (!buffer) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      this.stats.hits++;
      this.updateHitRate();

      // Update hit counter
      await this.client.hincrby(`${key}:meta`, 'hits', 1);

      const data = await this.decompress(buffer);
      return data as T;
    } catch (error) {
      this.emit('error', { operation: 'get', key, error });
      return null;
    }
  }

  public async set<T = any>(
    key: string,
    value: T,
    ttl?: number,
    tags?: string[]
  ): Promise<boolean> {
    try {
      const compressed = await this.compress(value);
      const finalTTL = ttl ?? this.config.ttl;

      // Store data with TTL
      await this.client.setex(key, finalTTL, compressed);

      // Store metadata
      const metadata = {
        createdAt: Date.now(),
        hits: 0,
        size: compressed.length,
        tags: tags?.join(',') || '',
      };

      await this.client.hmset(`${key}:meta`, metadata);
      await this.client.expire(`${key}:meta`, finalTTL);

      // Add to tag sets if provided
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          await this.client.sadd(`tag:${tag}`, key);
          await this.client.expire(`tag:${tag}`, finalTTL);
        }
      }

      this.stats.sets++;
      return true;
    } catch (error) {
      this.emit('error', { operation: 'set', key, error });
      return false;
    }
  }

  public async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    try {
      const buffers = await this.client.mgetBuffer(...keys);

      const results = await Promise.all(
        buffers.map(async (buffer) => {
          if (!buffer) {
            this.stats.misses++;
            return null;
          }
          this.stats.hits++;
          return this.decompress(buffer) as Promise<T>;
        })
      );

      this.updateHitRate();
      return results;
    } catch (error) {
      this.emit('error', { operation: 'mget', keys, error });
      return keys.map(() => null);
    }
  }

  public async mset<T = any>(
    entries: Array<{ key: string; value: T; ttl?: number; tags?: string[] }>
  ): Promise<boolean> {
    try {
      const pipeline = this.client.pipeline();

      for (const entry of entries) {
        const compressed = await this.compress(entry.value);
        const finalTTL = entry.ttl ?? this.config.ttl;

        pipeline.setex(entry.key, finalTTL, compressed);

        const metadata = {
          createdAt: Date.now(),
          hits: 0,
          size: compressed.length,
          tags: entry.tags?.join(',') || '',
        };

        pipeline.hmset(`${entry.key}:meta`, metadata);
        pipeline.expire(`${entry.key}:meta`, finalTTL);

        if (entry.tags && entry.tags.length > 0) {
          for (const tag of entry.tags) {
            pipeline.sadd(`tag:${tag}`, entry.key);
            pipeline.expire(`tag:${tag}`, finalTTL);
          }
        }
      }

      await pipeline.exec();
      this.stats.sets += entries.length;
      return true;
    } catch (error) {
      this.emit('error', { operation: 'mset', error });
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      await this.client.del(key, `${key}:meta`);
      this.stats.deletes++;
      return true;
    } catch (error) {
      this.emit('error', { operation: 'delete', key, error });
      return false;
    }
  }

  public async deleteByTag(tag: string): Promise<number> {
    try {
      const keys = await this.client.smembers(`tag:${tag}`);

      if (keys.length === 0) return 0;

      const pipeline = this.client.pipeline();
      for (const key of keys) {
        pipeline.del(key, `${key}:meta`);
      }
      pipeline.del(`tag:${tag}`);

      await pipeline.exec();
      this.stats.deletes += keys.length;
      return keys.length;
    } catch (error) {
      this.emit('error', { operation: 'deleteByTag', tag, error });
      return 0;
    }
  }

  public async clear(): Promise<boolean> {
    try {
      await this.client.flushdb();
      return true;
    } catch (error) {
      this.emit('error', { operation: 'clear', error });
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.emit('error', { operation: 'exists', key, error });
      return false;
    }
  }

  public async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.emit('error', { operation: 'ttl', key, error });
      return -1;
    }
  }

  public async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, ttl);
      return result === 1;
    } catch (error) {
      this.emit('error', { operation: 'expire', key, error });
      return false;
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private startStatsCollection(): void {
    setInterval(async () => {
      try {
        const info = await this.client.info('memory');
        const memoryMatch = info.match(/used_memory:(\d+)/);
        if (memoryMatch) {
          this.stats.memoryUsage = parseInt(memoryMatch[1], 10);
        }

        const dbSize = await this.client.dbsize();
        this.stats.keyCount = dbSize;

        this.emit('stats', this.stats);
      } catch (error) {
        this.emit('error', { operation: 'stats', error });
      }
    }, 10000); // Every 10 seconds
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
    this.emit('disconnected');
  }
}

// Cache strategies
export class CacheStrategy {
  static async getOrSet<T>(
    cache: RedisCacheManager,
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    const cached = await cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await cache.set(key, value, ttl, tags);
    return value;
  }

  static async refresh<T>(
    cache: RedisCacheManager,
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    const value = await factory();
    await cache.set(key, value, ttl, tags);
    return value;
  }

  static async warmup<T>(
    cache: RedisCacheManager,
    entries: Array<{
      key: string;
      factory: () => Promise<T>;
      ttl?: number;
      tags?: string[];
    }>
  ): Promise<void> {
    const results = await Promise.all(
      entries.map(async (entry) => ({
        key: entry.key,
        value: await entry.factory(),
        ttl: entry.ttl,
        tags: entry.tags,
      }))
    );

    await cache.mset(results);
  }
}

// Singleton instance
let cacheInstance: RedisCacheManager | null = null;

export function getCacheManager(config?: CacheConfig): RedisCacheManager {
  if (!cacheInstance) {
    cacheInstance = new RedisCacheManager(config);
  }
  return cacheInstance;
}

export async function disconnectCache(): Promise<void> {
  if (cacheInstance) {
    await cacheInstance.disconnect();
    cacheInstance = null;
  }
}
