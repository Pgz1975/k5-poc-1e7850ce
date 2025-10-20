/**
 * Storage utilities for Supabase Storage integration
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { AppError, Logger, sanitizeFilename } from './utils.ts';

const logger = new Logger('Storage');

export class StorageService {
  private supabase;

  constructor(
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: {
      contentType?: string;
      cacheControl?: string;
      upsert?: boolean;
    }
  ): Promise<string> {
    const sanitizedPath = sanitizeFilename(path);

    logger.info('Uploading file', { bucket, path: sanitizedPath });

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(sanitizedPath, file, {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) {
      logger.error('Upload failed', error, { bucket, path: sanitizedPath });
      throw new AppError('UPLOAD_FAILED', `Failed to upload file: ${error.message}`, 500);
    }

    logger.info('Upload successful', { bucket, path: data.path });
    return data.path;
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new AppError('SIGNED_URL_FAILED', `Failed to create signed URL: ${error.message}`, 500);
    }

    return data.signedUrl;
  }

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    logger.info('Downloading file', { bucket, path });

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      logger.error('Download failed', error, { bucket, path });
      throw new AppError('DOWNLOAD_FAILED', `Failed to download file: ${error.message}`, 500);
    }

    return data;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    logger.info('Deleting file', { bucket, path });

    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      logger.error('Delete failed', error, { bucket, path });
      throw new AppError('DELETE_FAILED', `Failed to delete file: ${error.message}`, 500);
    }
  }

  async listFiles(bucket: string, path?: string): Promise<Array<{
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, unknown>;
  }>> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      throw new AppError('LIST_FAILED', `Failed to list files: ${error.message}`, 500);
    }

    return data;
  }
}

export class DatabaseService {
  private supabase;

  constructor(
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async insertProcessingJob(jobData: {
    id: string;
    status: string;
    created_at: Date;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const { error } = await this.supabase
      .from('processing_jobs')
      .insert(jobData);

    if (error) {
      throw new AppError('DB_INSERT_FAILED', `Failed to insert job: ${error.message}`, 500);
    }
  }

  async updateProcessingJob(
    jobId: string,
    updates: {
      status?: string;
      progress?: number;
      completed_at?: Date;
      error?: string;
      results?: Record<string, unknown>;
    }
  ): Promise<void> {
    const { error } = await this.supabase
      .from('processing_jobs')
      .update(updates)
      .eq('id', jobId);

    if (error) {
      throw new AppError('DB_UPDATE_FAILED', `Failed to update job: ${error.message}`, 500);
    }
  }

  async getProcessingJob(jobId: string): Promise<unknown> {
    const { data, error } = await this.supabase
      .from('processing_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      throw new AppError('DB_SELECT_FAILED', `Failed to get job: ${error.message}`, 404);
    }

    return data;
  }

  async insertCorrelations(correlations: Array<{
    image_id: string;
    text_content: string;
    page_number: number;
    proximity: number;
    confidence: number;
    context_before?: string;
    context_after?: string;
  }>): Promise<void> {
    const { error } = await this.supabase
      .from('image_text_correlations')
      .insert(correlations);

    if (error) {
      throw new AppError('DB_INSERT_FAILED', `Failed to insert correlations: ${error.message}`, 500);
    }
  }

  async insertAssessments(assessments: Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    correct_answer?: string;
    page_number: number;
    standard_code?: string;
    difficulty?: number;
  }>): Promise<void> {
    const { error } = await this.supabase
      .from('assessments')
      .insert(assessments);

    if (error) {
      throw new AppError('DB_INSERT_FAILED', `Failed to insert assessments: ${error.message}`, 500);
    }
  }
}
