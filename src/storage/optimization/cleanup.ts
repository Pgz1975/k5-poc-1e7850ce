/**
 * Storage Cleanup and Archival System
 *
 * Automated cleanup of temporary files, archival of old content,
 * and orphaned file detection.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { CLEANUP_CONFIG, ARCHIVAL_POLICIES } from '../config';

// ===========================
// Type Definitions
// ===========================

export interface CleanupReport {
  bucket: string;
  filesScanned: number;
  filesDeleted: number;
  filesArchived: number;
  bytesFreed: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface OrphanedFile {
  bucket: string;
  path: string;
  size: number;
  created: Date;
  reason: string;
}

export interface ArchivalResult {
  success: boolean;
  bucket: string;
  path: string;
  archiveLocation: string;
  error?: string;
}

// ===========================
// Cleanup Service
// ===========================

export class StorageCleanupService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Run scheduled cleanup based on configuration
   */
  async runScheduledCleanup(): Promise<CleanupReport[]> {
    console.log('Starting scheduled cleanup...');

    const reports: CleanupReport[] = [];

    for (const rule of CLEANUP_CONFIG.rules) {
      const report = await this.cleanupBucket(
        rule.bucket,
        rule.condition,
        rule.threshold,
        rule.action
      );
      reports.push(report);
    }

    console.log('Scheduled cleanup completed.');
    return reports;
  }

  /**
   * Clean up a specific bucket based on rules
   */
  async cleanupBucket(
    bucket: string,
    condition: 'age' | 'size' | 'orphaned',
    threshold: number,
    action: 'delete' | 'archive'
  ): Promise<CleanupReport> {
    const startTime = new Date();
    const report: CleanupReport = {
      bucket,
      filesScanned: 0,
      filesDeleted: 0,
      filesArchived: 0,
      bytesFreed: 0,
      errors: [],
      startTime,
      endTime: new Date(),
      duration: 0,
    };

    try {
      // List all files in bucket
      const { data: files, error } = await this.supabase.storage
        .from(bucket)
        .list();

      if (error) throw error;
      if (!files) return report;

      report.filesScanned = files.length;

      // Filter files based on condition
      const filesToProcess = this.filterFilesByCondition(
        files,
        condition,
        threshold
      );

      // Process files
      for (const file of filesToProcess) {
        try {
          if (action === 'delete') {
            await this.deleteFile(bucket, file.name);
            report.filesDeleted++;
          } else {
            const archived = await this.archiveFile(bucket, file.name);
            if (archived.success) {
              report.filesArchived++;
            } else {
              report.errors.push(
                archived.error || `Failed to archive ${file.name}`
              );
            }
          }

          report.bytesFreed += file.metadata?.size || 0;
        } catch (error) {
          report.errors.push(
            `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    } catch (error) {
      report.errors.push(
        `Bucket cleanup error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    report.endTime = new Date();
    report.duration = report.endTime.getTime() - report.startTime.getTime();

    return report;
  }

  /**
   * Find and remove orphaned files
   */
  async findOrphanedFiles(bucket: string): Promise<OrphanedFile[]> {
    const orphaned: OrphanedFile[] = [];

    try {
      // List all files
      const { data: files, error } = await this.supabase.storage
        .from(bucket)
        .list();

      if (error) throw error;
      if (!files) return orphaned;

      // Check each file for references in database
      for (const file of files) {
        const isOrphaned = await this.checkIfOrphaned(bucket, file.name);

        if (isOrphaned) {
          orphaned.push({
            bucket,
            path: file.name,
            size: file.metadata?.size || 0,
            created: new Date(file.created_at),
            reason: 'No database reference found',
          });
        }
      }
    } catch (error) {
      console.error('Error finding orphaned files:', error);
    }

    return orphaned;
  }

  /**
   * Delete orphaned files
   */
  async deleteOrphanedFiles(
    orphaned: OrphanedFile[]
  ): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const file of orphaned) {
      try {
        await this.deleteFile(file.bucket, file.path);
        deleted++;
      } catch (error) {
        failed++;
        console.error(`Failed to delete orphaned file ${file.path}:`, error);
      }
    }

    return { deleted, failed };
  }

  /**
   * Clean up temporary files older than specified days
   */
  async cleanupTemporaryFiles(days: number): Promise<CleanupReport> {
    return this.cleanupBucket('pdf-thumbnails', 'age', days, 'delete');
  }

  /**
   * Archive old files based on archival policies
   */
  async archiveOldFiles(): Promise<ArchivalResult[]> {
    const results: ArchivalResult[] = [];

    for (const policy of ARCHIVAL_POLICIES) {
      try {
        const { data: files, error } = await this.supabase.storage
          .from(policy.bucket)
          .list();

        if (error) throw error;
        if (!files) continue;

        // Filter files older than archival threshold
        const oldFiles = files.filter((file) => {
          const age = this.getFileAgeDays(file.created_at);
          return age >= policy.daysUntilArchive;
        });

        // Archive each file
        for (const file of oldFiles) {
          const result = await this.archiveFile(
            policy.bucket,
            file.name,
            policy.archiveLocation
          );

          results.push(result);

          // Delete after archive if policy requires it
          if (result.success && policy.deleteAfterArchive) {
            await this.deleteFile(policy.bucket, file.name);
          }
        }
      } catch (error) {
        results.push({
          success: false,
          bucket: policy.bucket,
          path: '',
          archiveLocation: policy.archiveLocation,
          error:
            error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(bucket?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    oldestFile: Date | null;
    newestFile: Date | null;
  }> {
    let totalFiles = 0;
    let totalSize = 0;
    let oldestFile: Date | null = null;
    let newestFile: Date | null = null;

    try {
      const bucketsToCheck = bucket
        ? [bucket]
        : ['pdf-originals', 'pdf-images', 'pdf-thumbnails', 'pdf-processed', 'assessment-assets'];

      for (const bucketName of bucketsToCheck) {
        const { data: files, error } = await this.supabase.storage
          .from(bucketName)
          .list();

        if (error || !files) continue;

        totalFiles += files.length;

        for (const file of files) {
          totalSize += file.metadata?.size || 0;

          const created = new Date(file.created_at);
          if (!oldestFile || created < oldestFile) {
            oldestFile = created;
          }
          if (!newestFile || created > newestFile) {
            newestFile = created;
          }
        }
      }
    } catch (error) {
      console.error('Error getting storage stats:', error);
    }

    return { totalFiles, totalSize, oldestFile, newestFile };
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private filterFilesByCondition(
    files: any[],
    condition: 'age' | 'size' | 'orphaned',
    threshold: number
  ): any[] {
    switch (condition) {
      case 'age':
        return files.filter((file) => {
          const age = this.getFileAgeDays(file.created_at);
          return age >= threshold;
        });

      case 'size':
        return files.filter((file) => {
          return (file.metadata?.size || 0) >= threshold;
        });

      case 'orphaned':
        // Orphaned check requires database queries
        // This is a placeholder - implement based on your schema
        return [];

      default:
        return [];
    }
  }

  private getFileAgeDays(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  private async archiveFile(
    bucket: string,
    path: string,
    archiveLocation?: string
  ): Promise<ArchivalResult> {
    try {
      // Copy to archive location
      const archivePath = `${archiveLocation || 'archive'}/${Date.now()}_${path}`;

      const { error } = await this.supabase.storage
        .from(bucket)
        .copy(path, archivePath);

      if (error) throw error;

      return {
        success: true,
        bucket,
        path,
        archiveLocation: archivePath,
      };
    } catch (error) {
      return {
        success: false,
        bucket,
        path,
        archiveLocation: archiveLocation || 'archive',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkIfOrphaned(
    bucket: string,
    path: string
  ): Promise<boolean> {
    // This should check your database tables for references
    // Example implementation:
    try {
      // Check pdf_documents table
      const { data, error } = await this.supabase
        .from('pdf_documents')
        .select('id')
        .or(`original_path.eq.${path},processed_path.eq.${path}`)
        .limit(1);

      if (error) throw error;

      return !data || data.length === 0;
    } catch (error) {
      console.error(`Error checking if file is orphaned: ${path}`, error);
      return false;
    }
  }
}

// ===========================
// Scheduled Cleanup Runner
// ===========================

export class CleanupScheduler {
  private cleanupService: StorageCleanupService;
  private intervalId?: NodeJS.Timeout;

  constructor(supabase: SupabaseClient) {
    this.cleanupService = new StorageCleanupService(supabase);
  }

  /**
   * Start scheduled cleanup based on cron expression
   */
  start(): void {
    if (!CLEANUP_CONFIG.enabled) {
      console.log('Cleanup scheduler is disabled');
      return;
    }

    console.log(`Starting cleanup scheduler: ${CLEANUP_CONFIG.schedule}`);

    // For simplicity, run daily at 2 AM (adjust based on your needs)
    this.scheduleDaily(2, 0); // 2:00 AM
  }

  /**
   * Stop scheduled cleanup
   */
  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = undefined;
      console.log('Cleanup scheduler stopped');
    }
  }

  /**
   * Run cleanup immediately
   */
  async runNow(): Promise<CleanupReport[]> {
    console.log('Running cleanup now...');
    return this.cleanupService.runScheduledCleanup();
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private scheduleDaily(hour: number, minute: number): void {
    const now = new Date();
    const scheduled = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0
    );

    // If time has passed today, schedule for tomorrow
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled.getTime() - now.getTime();

    this.intervalId = setTimeout(() => {
      this.runScheduledCleanup();
      // Reschedule for next day
      this.scheduleDaily(hour, minute);
    }, delay);

    console.log(`Next cleanup scheduled for: ${scheduled.toISOString()}`);
  }

  private async runScheduledCleanup(): Promise<void> {
    try {
      const reports = await this.cleanupService.runScheduledCleanup();

      // Log results
      for (const report of reports) {
        console.log(`Cleanup report for ${report.bucket}:`, {
          scanned: report.filesScanned,
          deleted: report.filesDeleted,
          archived: report.filesArchived,
          bytesFreed: report.bytesFreed,
          errors: report.errors.length,
        });
      }
    } catch (error) {
      console.error('Scheduled cleanup failed:', error);
    }
  }
}

// ===========================
// Export Helper Functions
// ===========================

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
