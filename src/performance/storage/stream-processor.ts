/**
 * Stream Processing for Memory-Efficient PDF Handling
 * Lazy loading and streaming support for large documents
 */

import { Readable, Transform, Writable } from 'stream';
import { EventEmitter } from 'events';

export interface StreamConfig {
  highWaterMark?: number; // Buffer size in bytes
  chunkSize?: number;
  enableBackpressure?: boolean;
  maxConcurrency?: number;
}

export interface ChunkMetadata {
  index: number;
  size: number;
  offset: number;
  checksum?: string;
  timestamp: number;
}

export class PDFStreamProcessor extends EventEmitter {
  private config: Required<StreamConfig>;

  constructor(config: StreamConfig = {}) {
    super();

    this.config = {
      highWaterMark: config.highWaterMark ?? 64 * 1024, // 64KB default
      chunkSize: config.chunkSize ?? 16 * 1024, // 16KB chunks
      enableBackpressure: config.enableBackpressure ?? true,
      maxConcurrency: config.maxConcurrency ?? 4,
    };
  }

  /**
   * Create a chunked stream from a buffer
   */
  public createChunkedStream(buffer: Buffer): Readable {
    let offset = 0;
    const { chunkSize } = this.config;

    return new Readable({
      highWaterMark: this.config.highWaterMark,
      read() {
        if (offset >= buffer.length) {
          this.push(null); // End of stream
          return;
        }

        const chunk = buffer.slice(offset, offset + chunkSize);
        offset += chunkSize;

        this.push(chunk);
      },
    });
  }

  /**
   * Create a lazy-loading page stream
   */
  public createLazyPageStream(
    pageCount: number,
    pageLoader: (pageIndex: number) => Promise<Buffer>
  ): Readable {
    let currentPage = 0;
    let loading = false;

    return new Readable({
      highWaterMark: this.config.highWaterMark,
      async read() {
        if (loading || currentPage >= pageCount) {
          if (currentPage >= pageCount && !loading) {
            this.push(null); // End of stream
          }
          return;
        }

        loading = true;

        try {
          const pageData = await pageLoader(currentPage);
          this.push(pageData);
          currentPage++;
        } catch (error) {
          this.destroy(error as Error);
        } finally {
          loading = false;
        }
      },
    });
  }

  /**
   * Transform stream for processing chunks in parallel
   */
  public createParallelProcessor<T>(
    processor: (chunk: Buffer) => Promise<T>
  ): Transform {
    const concurrency = this.config.maxConcurrency;
    const pending: Array<Promise<T>> = [];
    let processing = false;

    return new Transform({
      highWaterMark: this.config.highWaterMark,
      async transform(chunk: Buffer, encoding, callback) {
        try {
          const promise = processor(chunk);
          pending.push(promise);

          // Process in parallel up to maxConcurrency
          if (pending.length >= concurrency && !processing) {
            processing = true;
            const results = await Promise.all(pending.splice(0, concurrency));
            results.forEach((result) => this.push(JSON.stringify(result) + '\n'));
            processing = false;
          }

          callback();
        } catch (error) {
          callback(error as Error);
        }
      },

      async flush(callback) {
        try {
          // Process remaining chunks
          if (pending.length > 0) {
            const results = await Promise.all(pending);
            results.forEach((result) => this.push(JSON.stringify(result) + '\n'));
          }
          callback();
        } catch (error) {
          callback(error as Error);
        }
      },
    });
  }

  /**
   * Create backpressure-aware writer
   */
  public createBackpressureWriter(
    writer: (data: any) => Promise<void>
  ): Writable {
    return new Writable({
      highWaterMark: this.config.highWaterMark,
      async write(chunk, encoding, callback) {
        try {
          await writer(chunk);
          callback();
        } catch (error) {
          callback(error as Error);
        }
      },
    });
  }

  /**
   * Create a progress tracking stream
   */
  public createProgressStream(totalSize: number): Transform {
    let processed = 0;
    const startTime = Date.now();

    return new Transform({
      transform(chunk: Buffer, encoding, callback) {
        processed += chunk.length;
        const progress = (processed / totalSize) * 100;
        const elapsed = Date.now() - startTime;
        const rate = processed / (elapsed / 1000); // bytes per second
        const eta = totalSize > processed ? ((totalSize - processed) / rate) * 1000 : 0;

        this.emit('progress', {
          processed,
          total: totalSize,
          progress,
          rate,
          eta,
        });

        this.push(chunk);
        callback();
      },
    });
  }

  /**
   * Stream-based page extractor
   */
  public async extractPages(
    pageStream: Readable,
    pageIndices: number[]
  ): Promise<Map<number, Buffer>> {
    return new Promise((resolve, reject) => {
      const pages = new Map<number, Buffer>();
      const pageSet = new Set(pageIndices);
      let currentPage = 0;
      const chunks: Buffer[] = [];

      pageStream.on('data', (chunk: Buffer) => {
        if (pageSet.has(currentPage)) {
          chunks.push(chunk);
        }

        // Check if we've completed a page (simplified logic)
        if (chunk.includes(Buffer.from('endobj'))) {
          if (pageSet.has(currentPage)) {
            pages.set(currentPage, Buffer.concat(chunks.splice(0)));
          }
          currentPage++;

          // Stop early if we've extracted all requested pages
          if (pages.size === pageIndices.length) {
            pageStream.destroy();
          }
        }
      });

      pageStream.on('end', () => {
        resolve(pages);
      });

      pageStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Memory-efficient buffer concatenation
   */
  public async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      let totalLength = 0;

      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
        totalLength += chunk.length;
      });

      stream.on('end', () => {
        resolve(Buffer.concat(chunks, totalLength));
      });

      stream.on('error', reject);
    });
  }

  /**
   * Create a rate-limited stream
   */
  public createRateLimitedStream(bytesPerSecond: number): Transform {
    let lastTime = Date.now();
    let allowance = bytesPerSecond;

    return new Transform({
      async transform(chunk: Buffer, encoding, callback) {
        const now = Date.now();
        const elapsed = (now - lastTime) / 1000;
        lastTime = now;

        allowance += elapsed * bytesPerSecond;
        allowance = Math.min(allowance, bytesPerSecond * 2); // Max burst

        if (allowance < chunk.length) {
          // Need to wait
          const waitTime = ((chunk.length - allowance) / bytesPerSecond) * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          allowance = 0;
        } else {
          allowance -= chunk.length;
        }

        this.push(chunk);
        callback();
      },
    });
  }

  /**
   * Create a checksum stream for integrity verification
   */
  public createChecksumStream(): Transform {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    return new Transform({
      transform(chunk: Buffer, encoding, callback) {
        hash.update(chunk);
        this.push(chunk);
        callback();
      },

      flush(callback) {
        const checksum = hash.digest('hex');
        this.emit('checksum', checksum);
        callback();
      },
    });
  }
}

/**
 * Lazy Loading Manager for On-Demand Content
 */
export class LazyLoadManager extends EventEmitter {
  private cache = new Map<string, Buffer>();
  private loading = new Set<string>();
  private config: {
    cacheSize: number;
    preloadCount: number;
    evictionPolicy: 'lru' | 'lfu' | 'fifo';
  };

  private accessOrder: string[] = [];
  private accessFrequency = new Map<string, number>();

  constructor(
    config: {
      cacheSize?: number;
      preloadCount?: number;
      evictionPolicy?: 'lru' | 'lfu' | 'fifo';
    } = {}
  ) {
    super();

    this.config = {
      cacheSize: config.cacheSize ?? 50 * 1024 * 1024, // 50MB
      preloadCount: config.preloadCount ?? 3,
      evictionPolicy: config.evictionPolicy ?? 'lru',
    };
  }

  public async load(
    key: string,
    loader: () => Promise<Buffer>
  ): Promise<Buffer> {
    // Check cache
    if (this.cache.has(key)) {
      this.updateAccess(key);
      return this.cache.get(key)!;
    }

    // Prevent duplicate loading
    if (this.loading.has(key)) {
      return new Promise((resolve, reject) => {
        const handler = (loadedKey: string, data: Buffer) => {
          if (loadedKey === key) {
            this.off('loaded', handler);
            resolve(data);
          }
        };
        this.on('loaded', handler);

        setTimeout(() => {
          this.off('loaded', handler);
          reject(new Error('Load timeout'));
        }, 30000);
      });
    }

    // Load data
    this.loading.add(key);

    try {
      const data = await loader();

      // Evict if necessary
      while (this.getCacheSize() + data.length > this.config.cacheSize) {
        this.evict();
      }

      this.cache.set(key, data);
      this.updateAccess(key);
      this.emit('loaded', key, data);

      return data;
    } finally {
      this.loading.delete(key);
    }
  }

  public async preload(
    keys: string[],
    loader: (key: string) => Promise<Buffer>
  ): Promise<void> {
    const preloadKeys = keys.slice(0, this.config.preloadCount);

    await Promise.all(
      preloadKeys.map((key) =>
        this.load(key, () => loader(key)).catch((error) => {
          this.emit('preloadError', { key, error });
        })
      )
    );
  }

  private updateAccess(key: string): void {
    if (this.config.evictionPolicy === 'lru') {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
    } else if (this.config.evictionPolicy === 'lfu') {
      const freq = this.accessFrequency.get(key) || 0;
      this.accessFrequency.set(key, freq + 1);
    }
  }

  private evict(): void {
    let keyToEvict: string | undefined;

    switch (this.config.evictionPolicy) {
      case 'lru':
        keyToEvict = this.accessOrder.shift();
        break;

      case 'lfu':
        let minFreq = Infinity;
        for (const [key, freq] of this.accessFrequency) {
          if (freq < minFreq) {
            minFreq = freq;
            keyToEvict = key;
          }
        }
        if (keyToEvict) {
          this.accessFrequency.delete(keyToEvict);
        }
        break;

      case 'fifo':
        keyToEvict = this.cache.keys().next().value;
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.emit('evicted', keyToEvict);
    }
  }

  private getCacheSize(): number {
    let size = 0;
    for (const buffer of this.cache.values()) {
      size += buffer.length;
    }
    return size;
  }

  public clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.accessFrequency.clear();
    this.emit('cleared');
  }

  public getStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      cacheSize: this.getCacheSize(),
      maxSize: this.config.cacheSize,
      utilization: (this.getCacheSize() / this.config.cacheSize) * 100,
    };
  }
}

// Singleton instances
let streamProcessor: PDFStreamProcessor | null = null;
let lazyLoader: LazyLoadManager | null = null;

export function getStreamProcessor(config?: StreamConfig): PDFStreamProcessor {
  if (!streamProcessor) {
    streamProcessor = new PDFStreamProcessor(config);
  }
  return streamProcessor;
}

export function getLazyLoader(config?: {
  cacheSize?: number;
  preloadCount?: number;
  evictionPolicy?: 'lru' | 'lfu' | 'fifo';
}): LazyLoadManager {
  if (!lazyLoader) {
    lazyLoader = new LazyLoadManager(config);
  }
  return lazyLoader;
}
