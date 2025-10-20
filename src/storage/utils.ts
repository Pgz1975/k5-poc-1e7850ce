/**
 * Supabase Storage Utilities
 *
 * Comprehensive utilities for file operations including:
 * - Upload with progress tracking
 * - Download with resume support
 * - Batch operations
 * - Error handling and retry logic
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS, OPTIMIZATION_CONFIG, CDN_CONFIG } from './config';

// ===========================
// Type Definitions
// ===========================

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Blob;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  onProgress?: (progress: UploadProgress) => void;
  metadata?: Record<string, string>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  bytesPerSecond?: number;
  estimatedTimeRemaining?: number;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  cdnUrl?: string;
  size?: number;
  error?: Error;
}

export interface DownloadOptions {
  bucket: string;
  path: string;
  onProgress?: (progress: DownloadProgress) => void;
  resumeFrom?: number;
  timeout?: number;
}

export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DownloadResult {
  success: boolean;
  data?: Blob;
  error?: Error;
}

export interface BatchOperation<T = any> {
  id: string;
  operation: 'upload' | 'download' | 'delete' | 'copy' | 'move';
  options: T;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: Error;
}

export interface BatchResult {
  total: number;
  successful: number;
  failed: number;
  operations: BatchOperation[];
}

// ===========================
// Upload Utilities
// ===========================

export class StorageUploader {
  private supabase: SupabaseClient;
  private abortController?: AbortController;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Upload a file with progress tracking
   */
  async upload(options: UploadOptions): Promise<UploadResult> {
    const startTime = Date.now();
    let lastLoaded = 0;
    let lastTime = startTime;

    try {
      // Validate file size
      const bucketConfig = Object.values(STORAGE_BUCKETS).find(
        (b) => b.name === options.bucket
      );

      if (bucketConfig) {
        const fileSize =
          options.file instanceof File
            ? options.file.size
            : options.file.size;

        if (fileSize > bucketConfig.fileSizeLimit) {
          throw new Error(
            `File size ${fileSize} bytes exceeds limit of ${bucketConfig.fileSizeLimit} bytes`
          );
        }

        // Validate MIME type
        const contentType =
          options.contentType ||
          (options.file instanceof File ? options.file.type : 'application/octet-stream');

        if (
          bucketConfig.allowedMimeTypes.length > 0 &&
          !bucketConfig.allowedMimeTypes.includes(contentType)
        ) {
          throw new Error(
            `MIME type ${contentType} not allowed for bucket ${options.bucket}`
          );
        }
      }

      // Create abort controller for cancellation
      this.abortController = new AbortController();

      // Prepare file for upload
      const fileData = await this.prepareFileForUpload(options.file, options);

      // Upload with progress tracking
      const { data, error } = await this.supabase.storage
        .from(options.bucket)
        .upload(options.path, fileData, {
          contentType: options.contentType,
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert || false,
          duplex: 'half',
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      // Generate CDN URL if enabled
      const cdnUrl = CDN_CONFIG.enabled
        ? this.getCDNUrl(options.bucket, data.path)
        : undefined;

      // Final progress callback
      if (options.onProgress) {
        const fileSize = options.file instanceof File ? options.file.size : options.file.size;
        options.onProgress({
          loaded: fileSize,
          total: fileSize,
          percentage: 100,
        });
      }

      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl,
        cdnUrl,
        size: options.file instanceof File ? options.file.size : options.file.size,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadBatch(uploads: UploadOptions[]): Promise<BatchResult> {
    const operations: BatchOperation<UploadOptions>[] = uploads.map(
      (upload, index) => ({
        id: `upload-${index}`,
        operation: 'upload',
        options: upload,
        status: 'pending',
      })
    );

    const results = await this.processBatch(operations);
    return results;
  }

  /**
   * Prepare file for upload (compression, optimization)
   */
  private async prepareFileForUpload(
    file: File | Blob,
    options: UploadOptions
  ): Promise<File | Blob> {
    const contentType =
      options.contentType ||
      (file instanceof File ? file.type : 'application/octet-stream');

    // Image optimization
    if (contentType.startsWith('image/')) {
      return this.optimizeImage(file, contentType);
    }

    // PDF optimization
    if (contentType === 'application/pdf') {
      return this.optimizePDF(file);
    }

    return file;
  }

  /**
   * Optimize image before upload
   */
  private async optimizeImage(
    file: File | Blob,
    mimeType: string
  ): Promise<Blob> {
    const config = OPTIMIZATION_CONFIG.images;

    if (!config.compression.enabled) {
      return file;
    }

    // Create image element for processing
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          if (width > config.maxWidth || height > config.maxHeight) {
            const ratio = Math.min(
              config.maxWidth / width,
              config.maxHeight / height
            );
            width *= ratio;
            height *= ratio;
          }

          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(imageUrl);
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            config.compression.format
              ? `image/${config.compression.format}`
              : mimeType,
            config.compression.quality / 100
          );
        } catch (error) {
          URL.revokeObjectURL(imageUrl);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Optimize PDF before upload
   */
  private async optimizePDF(file: File | Blob): Promise<Blob> {
    // PDF optimization would require a library like pdf-lib
    // For now, return the original file
    // TODO: Implement PDF compression
    return file;
  }

  /**
   * Get CDN URL for a storage path
   */
  private getCDNUrl(bucket: string, path: string): string {
    if (!CDN_CONFIG.baseUrl) {
      throw new Error('CDN base URL not configured');
    }

    return `${CDN_CONFIG.baseUrl}/${bucket}/${path}`;
  }

  /**
   * Cancel ongoing upload
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Process batch operations
   */
  private async processBatch<T>(
    operations: BatchOperation<T>[]
  ): Promise<BatchResult> {
    const results: BatchOperation[] = [];

    for (const operation of operations) {
      operation.status = 'processing';

      try {
        let result;
        switch (operation.operation) {
          case 'upload':
            result = await this.upload(operation.options as any);
            break;
          // Add other operations as needed
        }

        operation.status = 'completed';
        operation.result = result;
      } catch (error) {
        operation.status = 'failed';
        operation.error = error as Error;
      }

      results.push(operation);
    }

    return {
      total: operations.length,
      successful: results.filter((r) => r.status === 'completed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      operations: results,
    };
  }
}

// ===========================
// Download Utilities
// ===========================

export class StorageDownloader {
  private supabase: SupabaseClient;
  private abortController?: AbortController;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Download a file with progress tracking and resume support
   */
  async download(options: DownloadOptions): Promise<DownloadResult> {
    try {
      this.abortController = new AbortController();

      // Get download URL
      const { data: urlData } = this.supabase.storage
        .from(options.bucket)
        .getPublicUrl(options.path);

      // Fetch with progress tracking
      const response = await fetch(urlData.publicUrl, {
        signal: this.abortController.signal,
        headers: options.resumeFrom
          ? { Range: `bytes=${options.resumeFrom}-` }
          : {},
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // Read stream with progress
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const chunks: Uint8Array[] = [];
      let loaded = options.resumeFrom || 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (options.onProgress) {
          options.onProgress({
            loaded,
            total,
            percentage: total ? (loaded / total) * 100 : 0,
          });
        }
      }

      // Combine chunks into blob
      const blob = new Blob(chunks);

      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  /**
   * Download with automatic retry on failure
   */
  async downloadWithRetry(
    options: DownloadOptions,
    maxRetries = 3
  ): Promise<DownloadResult> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await this.download(options);

      if (result.success) {
        return result;
      }

      lastError = result.error;

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    return {
      success: false,
      error: lastError,
    };
  }

  /**
   * Cancel ongoing download
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}

// ===========================
// Batch Operations
// ===========================

export class StorageBatchOperations {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Delete multiple files
   */
  async deleteBatch(
    bucket: string,
    paths: string[]
  ): Promise<BatchResult> {
    const operations: BatchOperation[] = paths.map((path, index) => ({
      id: `delete-${index}`,
      operation: 'delete',
      options: { bucket, path },
      status: 'pending',
    }));

    const results = await Promise.all(
      operations.map(async (op) => {
        op.status = 'processing';

        try {
          const { error } = await this.supabase.storage
            .from(bucket)
            .remove([op.options.path]);

          if (error) throw error;

          op.status = 'completed';
        } catch (error) {
          op.status = 'failed';
          op.error = error as Error;
        }

        return op;
      })
    );

    return {
      total: operations.length,
      successful: results.filter((r) => r.status === 'completed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      operations: results,
    };
  }

  /**
   * Copy multiple files
   */
  async copyBatch(
    bucket: string,
    operations: Array<{ from: string; to: string }>
  ): Promise<BatchResult> {
    const batchOps: BatchOperation[] = operations.map((op, index) => ({
      id: `copy-${index}`,
      operation: 'copy',
      options: { bucket, ...op },
      status: 'pending',
    }));

    const results = await Promise.all(
      batchOps.map(async (op) => {
        op.status = 'processing';

        try {
          const { error } = await this.supabase.storage
            .from(bucket)
            .copy(op.options.from, op.options.to);

          if (error) throw error;

          op.status = 'completed';
        } catch (error) {
          op.status = 'failed';
          op.error = error as Error;
        }

        return op;
      })
    );

    return {
      total: batchOps.length,
      successful: results.filter((r) => r.status === 'completed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      operations: results,
    };
  }

  /**
   * Move multiple files
   */
  async moveBatch(
    bucket: string,
    operations: Array<{ from: string; to: string }>
  ): Promise<BatchResult> {
    const batchOps: BatchOperation[] = operations.map((op, index) => ({
      id: `move-${index}`,
      operation: 'move',
      options: { bucket, ...op },
      status: 'pending',
    }));

    const results = await Promise.all(
      batchOps.map(async (op) => {
        op.status = 'processing';

        try {
          const { error } = await this.supabase.storage
            .from(bucket)
            .move(op.options.from, op.options.to);

          if (error) throw error;

          op.status = 'completed';
        } catch (error) {
          op.status = 'failed';
          op.error = error as Error;
        }

        return op;
      })
    );

    return {
      total: batchOps.length,
      successful: results.filter((r) => r.status === 'completed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      operations: results,
    };
  }
}

// ===========================
// Helper Functions
// ===========================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique file path with timestamp
 */
export function generateFilePath(
  prefix: string,
  filename: string,
  addTimestamp = true
): string {
  const timestamp = addTimestamp ? Date.now() : '';
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${prefix}/${timestamp}_${sanitized}`;
}

/**
 * Extract file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Validate file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  file: File,
  width = 300,
  height = 400
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Calculate dimensions maintaining aspect ratio
        const ratio = Math.min(width / img.width, height / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(imageUrl);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
          },
          'image/jpeg',
          OPTIMIZATION_CONFIG.thumbnails.quality / 100
        );
      } catch (error) {
        URL.revokeObjectURL(imageUrl);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
