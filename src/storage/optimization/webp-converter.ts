/**
 * WebP Image Converter
 *
 * Converts images to WebP format for optimal storage and delivery performance.
 * Supports batch conversion, quality optimization, and responsive image generation.
 */

import { OPTIMIZATION_CONFIG } from '../config';

// ===========================
// Type Definitions
// ===========================

export interface WebPConversionOptions {
  quality: number; // 0-100
  lossless?: boolean;
  method?: number; // 0-6, higher = slower but better compression
  autoFilter?: boolean;
  sharpness?: number; // 0-7
  targetSize?: number; // Target file size in bytes
  generateResponsive?: boolean;
  responsiveSizes?: number[]; // Widths for responsive images
}

export interface WebPConversionResult {
  success: boolean;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
  quality: number;
  width: number;
  height: number;
  format: string;
  blob: Blob;
  responsiveImages?: ResponsiveImage[];
  error?: string;
}

export interface ResponsiveImage {
  width: number;
  height: number;
  size: number;
  blob: Blob;
  srcset: string;
}

export interface BatchConversionResult {
  total: number;
  successful: number;
  failed: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
  results: Array<{
    filename: string;
    result: WebPConversionResult;
  }>;
}

// ===========================
// WebP Converter Service
// ===========================

export class WebPConverter {
  private defaultOptions: WebPConversionOptions = {
    quality: OPTIMIZATION_CONFIG.images.compression.quality,
    lossless: false,
    method: 4,
    autoFilter: true,
    sharpness: 0,
    generateResponsive: false,
    responsiveSizes: [320, 640, 768, 1024, 1280, 1920],
  };

  /**
   * Convert a single image to WebP
   */
  async convertToWebP(
    image: File | Blob,
    options: Partial<WebPConversionOptions> = {}
  ): Promise<WebPConversionResult> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      // Load image
      const img = await this.loadImage(image);

      // Create canvas for conversion
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Convert to WebP
      const webpBlob = await this.canvasToWebP(canvas, opts);

      if (!webpBlob) {
        throw new Error('Failed to convert to WebP');
      }

      const result: WebPConversionResult = {
        success: true,
        originalSize: image.size,
        webpSize: webpBlob.size,
        compressionRatio: (1 - webpBlob.size / image.size) * 100,
        quality: opts.quality,
        width: img.width,
        height: img.height,
        format: 'image/webp',
        blob: webpBlob,
      };

      // Generate responsive images if requested
      if (opts.generateResponsive && opts.responsiveSizes) {
        result.responsiveImages = await this.generateResponsiveImages(
          img,
          opts
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        originalSize: image.size,
        webpSize: 0,
        compressionRatio: 0,
        quality: opts.quality,
        width: 0,
        height: 0,
        format: 'image/webp',
        blob: new Blob(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convert multiple images to WebP
   */
  async convertBatch(
    images: Array<{ file: File | Blob; filename: string }>,
    options: Partial<WebPConversionOptions> = {}
  ): Promise<BatchConversionResult> {
    const results: Array<{ filename: string; result: WebPConversionResult }> =
      [];
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;
    let successful = 0;
    let failed = 0;

    for (const { file, filename } of images) {
      const result = await this.convertToWebP(file, options);

      results.push({ filename, result });

      totalSizeBefore += result.originalSize;

      if (result.success) {
        totalSizeAfter += result.webpSize;
        successful++;
      } else {
        totalSizeAfter += result.originalSize; // Count original size if conversion failed
        failed++;
      }
    }

    return {
      total: images.length,
      successful,
      failed,
      totalSizeBefore,
      totalSizeAfter,
      results,
    };
  }

  /**
   * Optimize quality based on target file size
   */
  async optimizeForSize(
    image: File | Blob,
    targetSize: number,
    tolerance = 0.1 // 10% tolerance
  ): Promise<WebPConversionResult> {
    let minQuality = 0;
    let maxQuality = 100;
    let bestResult: WebPConversionResult | null = null;

    // Binary search for optimal quality
    while (maxQuality - minQuality > 5) {
      const quality = Math.floor((minQuality + maxQuality) / 2);

      const result = await this.convertToWebP(image, { quality });

      if (!result.success) break;

      const sizeDiff = Math.abs(result.webpSize - targetSize) / targetSize;

      if (sizeDiff <= tolerance) {
        bestResult = result;
        break;
      }

      if (result.webpSize > targetSize) {
        maxQuality = quality;
      } else {
        minQuality = quality;
      }

      if (!bestResult || Math.abs(result.webpSize - targetSize) < Math.abs(bestResult.webpSize - targetSize)) {
        bestResult = result;
      }
    }

    return (
      bestResult ||
      (await this.convertToWebP(image, { quality: minQuality }))
    );
  }

  /**
   * Convert with progressive quality reduction until target size is met
   */
  async convertWithTargetSize(
    image: File | Blob,
    maxSize: number
  ): Promise<WebPConversionResult> {
    let quality = 90;
    let result: WebPConversionResult;

    do {
      result = await this.convertToWebP(image, { quality });

      if (!result.success) break;

      if (result.webpSize <= maxSize) {
        return result;
      }

      quality -= 10;
    } while (quality >= 10);

    return result;
  }

  /**
   * Generate responsive image sizes
   */
  async generateResponsiveImages(
    img: HTMLImageElement,
    options: WebPConversionOptions
  ): Promise<ResponsiveImage[]> {
    const responsiveImages: ResponsiveImage[] = [];
    const sizes = options.responsiveSizes || this.defaultOptions.responsiveSizes!;

    for (const targetWidth of sizes) {
      // Skip if target width is larger than original
      if (targetWidth >= img.width) continue;

      const canvas = document.createElement('canvas');
      const ratio = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = Math.floor(img.height * ratio);

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      // Use high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await this.canvasToWebP(canvas, options);

      if (blob) {
        responsiveImages.push({
          width: canvas.width,
          height: canvas.height,
          size: blob.size,
          blob,
          srcset: `${targetWidth}w`,
        });
      }
    }

    return responsiveImages;
  }

  /**
   * Check if browser supports WebP
   */
  static async supportsWebP(): Promise<boolean> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      canvas.toBlob(
        (blob) => {
          resolve(blob !== null);
        },
        'image/webp',
        0.5
      );
    });
  }

  /**
   * Get WebP metadata
   */
  async getWebPMetadata(webpBlob: Blob): Promise<{
    width: number;
    height: number;
    size: number;
    format: string;
  }> {
    const img = await this.loadImage(webpBlob);

    return {
      width: img.width,
      height: img.height,
      size: webpBlob.size,
      format: 'image/webp',
    };
  }

  /**
   * Compare original vs WebP file sizes
   */
  async compareFormats(
    image: File | Blob
  ): Promise<{
    original: { size: number; format: string };
    webp: { size: number; format: string };
    savings: number;
    savingsPercent: number;
  }> {
    const result = await this.convertToWebP(image);

    return {
      original: {
        size: result.originalSize,
        format: image.type,
      },
      webp: {
        size: result.webpSize,
        format: 'image/webp',
      },
      savings: result.originalSize - result.webpSize,
      savingsPercent: result.compressionRatio,
    };
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private async loadImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  private async canvasToWebP(
    canvas: HTMLCanvasElement,
    options: WebPConversionOptions
  ): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/webp',
        options.quality / 100
      );
    });
  }
}

// ===========================
// Utility Functions
// ===========================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate compression savings
 */
export function calculateSavings(
  originalSize: number,
  compressedSize: number
): {
  bytes: number;
  percent: number;
  formatted: string;
} {
  const bytes = originalSize - compressedSize;
  const percent = (bytes / originalSize) * 100;

  return {
    bytes,
    percent,
    formatted: `${formatFileSize(bytes)} (${percent.toFixed(1)}%)`,
  };
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(images: ResponsiveImage[]): string {
  return images.map((img) => `${img.srcset}`).join(', ');
}

/**
 * Get optimal image size based on viewport
 */
export function getOptimalImageSize(
  viewportWidth: number,
  availableSizes: number[]
): number {
  // Find the smallest size that's larger than the viewport
  const optimal = availableSizes
    .sort((a, b) => a - b)
    .find((size) => size >= viewportWidth);

  return optimal || availableSizes[availableSizes.length - 1];
}

/**
 * Batch convert images in a directory
 */
export async function batchConvertDirectory(
  files: File[],
  options: Partial<WebPConversionOptions> = {}
): Promise<BatchConversionResult> {
  const converter = new WebPConverter();

  const images = files
    .filter((file) => file.type.startsWith('image/'))
    .map((file) => ({
      file,
      filename: file.name,
    }));

  return converter.convertBatch(images, options);
}

// ===========================
// WebP Conversion Worker
// ===========================

export class WebPConversionWorker {
  private queue: Array<{
    id: string;
    file: File | Blob;
    options: Partial<WebPConversionOptions>;
    resolve: (result: WebPConversionResult) => void;
    reject: (error: Error) => void;
  }> = [];

  private processing = false;
  private converter = new WebPConverter();
  private maxConcurrent = 3;

  /**
   * Add conversion job to queue
   */
  async addJob(
    file: File | Blob,
    options: Partial<WebPConversionOptions> = {}
  ): Promise<WebPConversionResult> {
    return new Promise((resolve, reject) => {
      const id = `job-${Date.now()}-${Math.random()}`;

      this.queue.push({
        id,
        file,
        options,
        resolve,
        reject,
      });

      this.processQueue();
    });
  }

  /**
   * Process conversion queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrent);

      await Promise.all(
        batch.map(async (job) => {
          try {
            const result = await this.converter.convertToWebP(
              job.file,
              job.options
            );
            job.resolve(result);
          } catch (error) {
            job.reject(
              error instanceof Error ? error : new Error('Conversion failed')
            );
          }
        })
      );
    }

    this.processing = false;
  }

  /**
   * Get queue status
   */
  getStatus(): {
    queueLength: number;
    processing: boolean;
  } {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
    };
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.queue.forEach((job) => {
      job.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}
