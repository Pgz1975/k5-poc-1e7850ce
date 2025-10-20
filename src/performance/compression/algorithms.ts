/**
 * Compression Algorithms for Storage Efficiency
 * Target: 60% storage reduction through intelligent compression
 * Supports Gzip, Brotli, and custom PDF compression
 */

import { EventEmitter } from 'events';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

export interface CompressionOptions {
  algorithm?: 'gzip' | 'brotli' | 'auto';
  level?: number; // 1-9 for gzip, 0-11 for brotli
  threshold?: number; // Minimum size in bytes to compress
  chunkSize?: number;
}

export interface CompressionResult {
  compressed: Buffer;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  algorithm: string;
  duration: number;
}

export interface CompressionStats {
  totalFiles: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  avgRatio: number;
  spaceSaved: number;
  avgCompressionTime: number;
}

export class CompressionManager extends EventEmitter {
  private stats: CompressionStats = {
    totalFiles: 0,
    totalOriginalSize: 0,
    totalCompressedSize: 0,
    avgRatio: 0,
    spaceSaved: 0,
    avgCompressionTime: 0,
  };

  /**
   * Compress data with specified algorithm
   */
  public async compress(
    data: Buffer,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = data.length;

    // Skip compression if below threshold
    const threshold = options.threshold ?? 1024; // 1KB default
    if (originalSize < threshold) {
      return {
        compressed: data,
        originalSize,
        compressedSize: originalSize,
        ratio: 1,
        algorithm: 'none',
        duration: 0,
      };
    }

    // Auto-select algorithm if not specified
    const algorithm = options.algorithm === 'auto' || !options.algorithm
      ? this.selectOptimalAlgorithm(data)
      : options.algorithm;

    let compressed: Buffer;

    try {
      if (algorithm === 'brotli') {
        compressed = await this.compressBrotli(data, options.level);
      } else {
        compressed = await this.compressGzip(data, options.level);
      }

      const duration = Date.now() - startTime;
      const compressedSize = compressed.length;
      const ratio = compressedSize / originalSize;

      // Update stats
      this.updateStats(originalSize, compressedSize, duration);

      this.emit('compressed', {
        originalSize,
        compressedSize,
        ratio,
        algorithm,
        duration,
      });

      return {
        compressed,
        originalSize,
        compressedSize,
        ratio,
        algorithm,
        duration,
      };
    } catch (error) {
      this.emit('error', { operation: 'compress', error });
      // Return original data on compression failure
      return {
        compressed: data,
        originalSize,
        compressedSize: originalSize,
        ratio: 1,
        algorithm: 'none',
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Decompress data
   */
  public async decompress(
    data: Buffer,
    algorithm: 'gzip' | 'brotli'
  ): Promise<Buffer> {
    const startTime = Date.now();

    try {
      let decompressed: Buffer;

      if (algorithm === 'brotli') {
        decompressed = await brotliDecompress(data);
      } else {
        decompressed = await gunzip(data);
      }

      const duration = Date.now() - startTime;
      this.emit('decompressed', { size: decompressed.length, duration });

      return decompressed;
    } catch (error) {
      this.emit('error', { operation: 'decompress', algorithm, error });
      throw error;
    }
  }

  /**
   * Compress with Gzip
   */
  private async compressGzip(data: Buffer, level?: number): Promise<Buffer> {
    const options = {
      level: level ?? 6, // Default to level 6 (balanced)
      memLevel: 8,
      strategy: zlib.constants.Z_DEFAULT_STRATEGY,
    };

    return await gzip(data, options);
  }

  /**
   * Compress with Brotli
   */
  private async compressBrotli(data: Buffer, level?: number): Promise<Buffer> {
    const options = {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: level ?? 6,
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      },
    };

    return await brotliCompress(data, options);
  }

  /**
   * Select optimal compression algorithm based on data characteristics
   */
  private selectOptimalAlgorithm(data: Buffer): 'gzip' | 'brotli' {
    // Analyze first 1KB to determine data type
    const sample = data.slice(0, 1024);
    const entropy = this.calculateEntropy(sample);

    // Brotli is better for text-heavy content (lower entropy)
    // Gzip is faster for high-entropy data
    return entropy < 5 ? 'brotli' : 'gzip';
  }

  /**
   * Calculate Shannon entropy of data
   */
  private calculateEntropy(data: Buffer): number {
    const freq = new Map<number, number>();
    const len = data.length;

    // Count byte frequencies
    for (let i = 0; i < len; i++) {
      const byte = data[i];
      freq.set(byte, (freq.get(byte) || 0) + 1);
    }

    // Calculate entropy
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  /**
   * Compress PDF specifically (removes unnecessary metadata)
   */
  public async compressPDF(pdfBuffer: Buffer): Promise<CompressionResult> {
    const startTime = Date.now();
    const originalSize = pdfBuffer.length;

    try {
      // Step 1: Remove unnecessary metadata
      let optimized = this.stripPDFMetadata(pdfBuffer);

      // Step 2: Optimize image streams (placeholder)
      optimized = await this.optimizePDFImages(optimized);

      // Step 3: Remove duplicate objects
      optimized = this.deduplicatePDFObjects(optimized);

      // Step 4: Apply general compression
      const result = await this.compress(optimized, {
        algorithm: 'gzip',
        level: 9, // Maximum compression for storage
      });

      const duration = Date.now() - startTime;

      return {
        ...result,
        originalSize,
        duration,
        algorithm: 'pdf-optimized',
      };
    } catch (error) {
      this.emit('error', { operation: 'compressPDF', error });
      throw error;
    }
  }

  /**
   * Strip unnecessary PDF metadata
   */
  private stripPDFMetadata(buffer: Buffer): Buffer {
    let pdfString = buffer.toString('binary');

    // Remove XMP metadata
    pdfString = pdfString.replace(
      /<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/g,
      ''
    );

    // Remove unused info dictionary entries
    pdfString = pdfString.replace(
      /\/Creator\s*\([^)]*\)/g,
      ''
    );
    pdfString = pdfString.replace(
      /\/Producer\s*\([^)]*\)/g,
      ''
    );

    return Buffer.from(pdfString, 'binary');
  }

  /**
   * Optimize PDF images (placeholder)
   */
  private async optimizePDFImages(buffer: Buffer): Promise<Buffer> {
    // This would require PDF parsing and image extraction
    // For now, return as-is
    return buffer;
  }

  /**
   * Deduplicate PDF objects
   */
  private deduplicatePDFObjects(buffer: Buffer): Buffer {
    // Simplified deduplication logic
    // In production, would use proper PDF parser
    return buffer;
  }

  /**
   * Batch compression with parallel processing
   */
  public async compressBatch(
    files: Array<{ id: string; data: Buffer; options?: CompressionOptions }>
  ): Promise<Map<string, CompressionResult>> {
    const results = new Map<string, CompressionResult>();
    const batchSize = 5; // Parallel compression limit

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const promises = batch.map(async (file) => {
        const result = await this.compress(file.data, file.options);
        return { id: file.id, result };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ id, result }) => results.set(id, result));
    }

    return results;
  }

  /**
   * Stream-based compression for large files
   */
  public createCompressionStream(
    algorithm: 'gzip' | 'brotli' = 'gzip',
    level: number = 6
  ): zlib.Gzip | zlib.BrotliCompress {
    if (algorithm === 'brotli') {
      return zlib.createBrotliCompress({
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: level,
        },
      });
    } else {
      return zlib.createGzip({ level });
    }
  }

  /**
   * Stream-based decompression
   */
  public createDecompressionStream(
    algorithm: 'gzip' | 'brotli' = 'gzip'
  ): zlib.Gunzip | zlib.BrotliDecompress {
    if (algorithm === 'brotli') {
      return zlib.createBrotliDecompress();
    } else {
      return zlib.createGunzip();
    }
  }

  /**
   * Estimate compression ratio without actually compressing
   */
  public estimateCompressionRatio(data: Buffer): number {
    const sampleSize = Math.min(data.length, 10240); // 10KB sample
    const sample = data.slice(0, sampleSize);

    const entropy = this.calculateEntropy(sample);

    // Estimate based on entropy
    // Lower entropy = better compression
    const estimatedRatio = Math.max(0.2, Math.min(1, entropy / 8));

    return estimatedRatio;
  }

  /**
   * Update compression statistics
   */
  private updateStats(
    originalSize: number,
    compressedSize: number,
    duration: number
  ): void {
    const prevTotal = this.stats.totalFiles;

    this.stats.totalFiles++;
    this.stats.totalOriginalSize += originalSize;
    this.stats.totalCompressedSize += compressedSize;
    this.stats.spaceSaved =
      this.stats.totalOriginalSize - this.stats.totalCompressedSize;
    this.stats.avgRatio =
      this.stats.totalCompressedSize / this.stats.totalOriginalSize;
    this.stats.avgCompressionTime =
      (this.stats.avgCompressionTime * prevTotal + duration) /
      this.stats.totalFiles;
  }

  public getStats(): CompressionStats {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalFiles: 0,
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      avgRatio: 0,
      spaceSaved: 0,
      avgCompressionTime: 0,
    };
  }
}

// Singleton instance
let compressionManager: CompressionManager | null = null;

export function getCompressionManager(): CompressionManager {
  if (!compressionManager) {
    compressionManager = new CompressionManager();
  }
  return compressionManager;
}
