/**
 * Image Optimization System
 * Compression, format conversion, and CDN optimization
 */

import sharp from 'sharp';
import { EventEmitter } from 'events';

export interface ImageOptimizationOptions {
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  quality?: number; // 1-100
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  progressive?: boolean;
  lossless?: boolean;
  effort?: number; // 0-9 for AVIF/WebP
  chromaSubsampling?: '4:4:4' | '4:2:0';
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
  width: number;
  height: number;
  duration: number;
}

export interface BatchOptimizationProgress {
  total: number;
  completed: number;
  failed: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
  avgCompressionRatio: number;
}

export class ImageOptimizer extends EventEmitter {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    format: 'webp',
    quality: 85,
    progressive: true,
    effort: 4,
  };

  public async optimize(
    input: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<{ buffer: Buffer; result: OptimizationResult }> {
    const startTime = Date.now();
    const mergedOptions = { ...ImageOptimizer.DEFAULT_OPTIONS, ...options };

    try {
      const image = sharp(input);
      const metadata = await image.metadata();

      // Apply transformations
      let pipeline = image;

      // Resize if specified
      if (mergedOptions.width || mergedOptions.height) {
        pipeline = pipeline.resize(mergedOptions.width, mergedOptions.height, {
          fit: mergedOptions.fit || 'inside',
          withoutEnlargement: true,
        });
      }

      // Apply format-specific optimizations
      switch (mergedOptions.format) {
        case 'webp':
          pipeline = pipeline.webp({
            quality: mergedOptions.quality,
            lossless: mergedOptions.lossless || false,
            effort: mergedOptions.effort || 4,
          });
          break;

        case 'avif':
          pipeline = pipeline.avif({
            quality: mergedOptions.quality,
            lossless: mergedOptions.lossless || false,
            effort: mergedOptions.effort || 4,
            chromaSubsampling: mergedOptions.chromaSubsampling || '4:2:0',
          });
          break;

        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality: mergedOptions.quality,
            progressive: mergedOptions.progressive,
            chromaSubsampling: mergedOptions.chromaSubsampling || '4:2:0',
          });
          break;

        case 'png':
          pipeline = pipeline.png({
            quality: mergedOptions.quality,
            progressive: mergedOptions.progressive,
            compressionLevel: 9,
          });
          break;
      }

      const buffer = await pipeline.toBuffer();
      const finalMetadata = await sharp(buffer).metadata();

      const result: OptimizationResult = {
        originalSize: input.length,
        optimizedSize: buffer.length,
        compressionRatio: 1 - buffer.length / input.length,
        format: mergedOptions.format || 'webp',
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0,
        duration: Date.now() - startTime,
      };

      this.emit('optimized', result);

      return { buffer, result };
    } catch (error) {
      this.emit('error', { error, options: mergedOptions });
      throw error;
    }
  }

  public async optimizeBatch(
    images: Array<{ id: string; buffer: Buffer; options?: ImageOptimizationOptions }>,
    concurrency: number = 4
  ): Promise<Map<string, { buffer: Buffer; result: OptimizationResult }>> {
    const results = new Map<string, { buffer: Buffer; result: OptimizationResult }>();
    const progress: BatchOptimizationProgress = {
      total: images.length,
      completed: 0,
      failed: 0,
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      avgCompressionRatio: 0,
    };

    const chunks = this.chunkArray(images, concurrency);

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(async (image) => {
          try {
            const optimized = await this.optimize(image.buffer, image.options);
            return { id: image.id, ...optimized };
          } catch (error) {
            progress.failed++;
            this.emit('batchProgress', progress);
            throw error;
          }
        })
      );

      for (const result of chunkResults) {
        if (result.status === 'fulfilled') {
          const { id, buffer, result: optResult } = result.value;
          results.set(id, { buffer, result: optResult });
          progress.completed++;
          progress.totalOriginalSize += optResult.originalSize;
          progress.totalOptimizedSize += optResult.optimizedSize;
        } else {
          progress.failed++;
        }
      }

      progress.avgCompressionRatio =
        1 - progress.totalOptimizedSize / progress.totalOriginalSize;
      this.emit('batchProgress', progress);
    }

    this.emit('batchComplete', progress);
    return results;
  }

  public async generateResponsiveSizes(
    input: Buffer,
    sizes: number[] = [320, 640, 1024, 1920],
    options: ImageOptimizationOptions = {}
  ): Promise<Map<number, { buffer: Buffer; result: OptimizationResult }>> {
    const results = new Map<number, { buffer: Buffer; result: OptimizationResult }>();

    for (const width of sizes) {
      const optimized = await this.optimize(input, {
        ...options,
        width,
      });
      results.set(width, optimized);
    }

    return results;
  }

  public async createThumbnail(
    input: Buffer,
    size: number = 200,
    options: ImageOptimizationOptions = {}
  ): Promise<{ buffer: Buffer; result: OptimizationResult }> {
    return this.optimize(input, {
      ...options,
      width: size,
      height: size,
      fit: 'cover',
      quality: options.quality || 80,
    });
  }

  public async extractMetadata(input: Buffer): Promise<sharp.Metadata> {
    const image = sharp(input);
    return image.metadata();
  }

  public async estimateOptimizationGain(
    input: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<{
    estimatedSize: number;
    estimatedRatio: number;
    recommendation: string;
  }> {
    const metadata = await this.extractMetadata(input);
    const baseSize = input.length;

    // Estimate based on format and quality
    let estimatedRatio = 0.5; // 50% default

    switch (options.format) {
      case 'avif':
        estimatedRatio = 0.35; // ~65% reduction
        break;
      case 'webp':
        estimatedRatio = 0.45; // ~55% reduction
        break;
      case 'jpeg':
        estimatedRatio = 0.6; // ~40% reduction
        break;
      case 'png':
        estimatedRatio = 0.7; // ~30% reduction
        break;
    }

    // Adjust for quality
    if (options.quality) {
      estimatedRatio *= options.quality / 100;
    }

    const estimatedSize = Math.floor(baseSize * estimatedRatio);

    let recommendation = 'Use WebP for best balance of quality and size';
    if (metadata.hasAlpha) {
      recommendation = 'Use PNG or WebP to preserve transparency';
    } else if (baseSize > 1024 * 1024) {
      recommendation = 'Use AVIF for maximum compression on large images';
    }

    return {
      estimatedSize,
      estimatedRatio: 1 - estimatedRatio,
      recommendation,
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Progressive loading support
export class ProgressiveImageLoader {
  public static async generateProgressiveVariants(
    input: Buffer,
    stages: Array<{ quality: number; width?: number }> = [
      { quality: 20, width: 100 },
      { quality: 50, width: 400 },
      { quality: 85 },
    ]
  ): Promise<Map<string, Buffer>> {
    const optimizer = new ImageOptimizer();
    const variants = new Map<string, Buffer>();

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const { buffer } = await optimizer.optimize(input, {
        format: 'webp',
        quality: stage.quality,
        width: stage.width,
      });

      variants.set(`stage-${i}`, buffer);
    }

    return variants;
  }

  public static generateLoadingStrategy(fileSize: number): Array<{
    quality: number;
    width?: number;
  }> {
    if (fileSize < 100 * 1024) {
      // < 100KB
      return [{ quality: 85 }];
    } else if (fileSize < 500 * 1024) {
      // < 500KB
      return [{ quality: 30, width: 200 }, { quality: 85 }];
    } else {
      // > 500KB
      return [
        { quality: 20, width: 100 },
        { quality: 50, width: 400 },
        { quality: 85 },
      ];
    }
  }
}

// CDN optimization helpers
export class CDNOptimizer {
  public static generateCDNUrls(
    baseUrl: string,
    filename: string,
    variants: Array<{ size: number; format: string }>
  ): Map<string, string> {
    const urls = new Map<string, string>();

    for (const variant of variants) {
      const key = `${variant.size}w-${variant.format}`;
      const url = `${baseUrl}/${filename}?w=${variant.size}&fm=${variant.format}`;
      urls.set(key, url);
    }

    return urls;
  }

  public static generateSrcSet(
    baseUrl: string,
    filename: string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): string {
    return sizes.map((size) => `${baseUrl}/${filename}?w=${size} ${size}w`).join(', ');
  }

  public static async prefetchCriticalImages(
    urls: string[],
    priority: 'high' | 'low' = 'high'
  ): Promise<void> {
    if (typeof document === 'undefined') return;

    for (const url of urls) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      if (priority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
      document.head.appendChild(link);
    }
  }
}

// Singleton instance
let optimizerInstance: ImageOptimizer | null = null;

export function getImageOptimizer(): ImageOptimizer {
  if (!optimizerInstance) {
    optimizerInstance = new ImageOptimizer();
  }
  return optimizerInstance;
}
