/**
 * Batch Processing Orchestrator
 * Coordinates parallel PDF processing with optimal resource utilization
 * Target: Process 100 PDFs in <45s average per document
 */

import { EventEmitter } from 'events';

export interface BatchJob {
  id: string;
  files: Array<{
    id: string;
    name: string;
    size: number;
    buffer?: Buffer;
    url?: string;
    priority?: number;
  }>;
  config?: {
    maxConcurrency?: number;
    timeout?: number;
    retries?: number;
    enableCaching?: boolean;
    compressionLevel?: number;
  };
  metadata?: Record<string, any>;
}

export interface BatchResult {
  jobId: string;
  startTime: number;
  endTime: number;
  duration: number;
  totalFiles: number;
  successful: number;
  failed: number;
  results: Array<{
    fileId: string;
    success: boolean;
    data?: any;
    error?: string;
    duration: number;
  }>;
  metrics: {
    avgProcessingTime: number;
    throughput: number;
    peakMemory: number;
    totalCost: number;
  };
}

export interface BatchProgress {
  jobId: string;
  completed: number;
  total: number;
  progress: number; // 0-100
  eta: number; // ms
  currentFile?: string;
}

type ProcessorFunction = (file: BatchJob['files'][0]) => Promise<any>;

export class BatchOrchestrator extends EventEmitter {
  private activeJobs = new Map<string, BatchJob>();
  private jobProgress = new Map<string, BatchProgress>();
  private jobResults = new Map<string, BatchResult>();
  private maxConcurrentJobs = 5;
  private processorFn?: ProcessorFunction;

  /**
   * Set processor function
   */
  public setProcessor(fn: ProcessorFunction): void {
    this.processorFn = fn;
  }

  /**
   * Submit batch job
   */
  public async submitJob(job: BatchJob): Promise<string> {
    if (!this.processorFn) {
      throw new Error('Processor function not set');
    }

    this.activeJobs.set(job.id, job);

    // Initialize progress
    this.jobProgress.set(job.id, {
      jobId: job.id,
      completed: 0,
      total: job.files.length,
      progress: 0,
      eta: 0,
    });

    this.emit('jobSubmitted', { jobId: job.id, fileCount: job.files.length });

    // Start processing (don't await to allow concurrent jobs)
    this.processJob(job).catch((error) => {
      this.emit('jobError', { jobId: job.id, error });
    });

    return job.id;
  }

  /**
   * Process batch job
   */
  private async processJob(job: BatchJob): Promise<BatchResult> {
    const startTime = Date.now();
    const config = job.config || {};
    const maxConcurrency = config.maxConcurrency || 5;
    const timeout = config.timeout || 120000; // 2 minutes per file
    const maxRetries = config.retries || 2;

    const results: BatchResult['results'] = [];
    let peakMemory = 0;
    let totalCost = 0;

    // Sort files by priority (higher first) and size (smaller first for better parallelization)
    const sortedFiles = [...job.files].sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return a.size - b.size; // Smaller files first
    });

    // Process in batches with concurrency control
    for (let i = 0; i < sortedFiles.length; i += maxConcurrency) {
      const batch = sortedFiles.slice(i, i + maxConcurrency);

      const batchResults = await Promise.all(
        batch.map(async (file) => {
          const fileStartTime = Date.now();
          let lastError: Error | undefined;

          // Update progress
          const progress = this.jobProgress.get(job.id);
          if (progress) {
            progress.currentFile = file.name;
            this.emit('progress', progress);
          }

          // Retry logic
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              const result = await Promise.race([
                this.processorFn!(file),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout')), timeout)
                ),
              ]);

              const duration = Date.now() - fileStartTime;

              // Update memory tracking
              const memUsage = process.memoryUsage().heapUsed;
              peakMemory = Math.max(peakMemory, memUsage);

              // Estimate cost (placeholder)
              const cost = this.estimateCost(file.size, duration);
              totalCost += cost;

              return {
                fileId: file.id,
                success: true,
                data: result,
                duration,
              };
            } catch (error) {
              lastError = error as Error;

              if (attempt < maxRetries) {
                // Exponential backoff
                await new Promise((resolve) =>
                  setTimeout(resolve, Math.pow(2, attempt) * 1000)
                );
              }
            }
          }

          // All retries failed
          return {
            fileId: file.id,
            success: false,
            error: lastError?.message || 'Unknown error',
            duration: Date.now() - fileStartTime,
          };
        })
      );

      results.push(...batchResults);

      // Update progress
      const progress = this.jobProgress.get(job.id);
      if (progress) {
        progress.completed = results.length;
        progress.progress = (results.length / sortedFiles.length) * 100;

        // Calculate ETA
        const elapsed = Date.now() - startTime;
        const avgTimePerFile = elapsed / results.length;
        const remaining = sortedFiles.length - results.length;
        progress.eta = avgTimePerFile * remaining;

        this.emit('progress', progress);
      }
    }

    // Compile final results
    const endTime = Date.now();
    const duration = endTime - startTime;
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    const avgProcessingTime =
      results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const throughput = (job.files.length / duration) * 1000; // files per second

    const finalResult: BatchResult = {
      jobId: job.id,
      startTime,
      endTime,
      duration,
      totalFiles: job.files.length,
      successful,
      failed,
      results,
      metrics: {
        avgProcessingTime,
        throughput,
        peakMemory,
        totalCost,
      },
    };

    this.jobResults.set(job.id, finalResult);
    this.activeJobs.delete(job.id);
    this.jobProgress.delete(job.id);

    this.emit('jobCompleted', finalResult);

    return finalResult;
  }

  /**
   * Estimate processing cost
   */
  private estimateCost(fileSize: number, duration: number): number {
    // Simple cost model:
    // - $0.01 per MB processed
    // - $0.001 per second of processing time
    const sizeCost = (fileSize / (1024 * 1024)) * 0.01;
    const timeCost = (duration / 1000) * 0.001;
    return sizeCost + timeCost;
  }

  /**
   * Get job progress
   */
  public getProgress(jobId: string): BatchProgress | null {
    return this.jobProgress.get(jobId) || null;
  }

  /**
   * Get job result
   */
  public getResult(jobId: string): BatchResult | null {
    return this.jobResults.get(jobId) || null;
  }

  /**
   * Get all active jobs
   */
  public getActiveJobs(): string[] {
    return Array.from(this.activeJobs.keys());
  }

  /**
   * Cancel job
   */
  public cancelJob(jobId: string): boolean {
    if (!this.activeJobs.has(jobId)) {
      return false;
    }

    this.activeJobs.delete(jobId);
    this.jobProgress.delete(jobId);

    this.emit('jobCancelled', { jobId });

    return true;
  }

  /**
   * Optimize batch processing order
   */
  public optimizeBatchOrder(files: BatchJob['files'][]): BatchJob['files'][] {
    // Group by size for better parallelization
    const small = files.filter((f) => f.size < 1024 * 1024); // < 1MB
    const medium = files.filter(
      (f) => f.size >= 1024 * 1024 && f.size < 10 * 1024 * 1024
    ); // 1-10MB
    const large = files.filter((f) => f.size >= 10 * 1024 * 1024); // > 10MB

    // Interleave for optimal worker utilization
    const optimized: BatchJob['files'][] = [];
    const maxLen = Math.max(small.length, medium.length, large.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < large.length) optimized.push(large[i]);
      if (i < medium.length) optimized.push(medium[i]);
      if (i < small.length) optimized.push(small[i]);
    }

    return optimized;
  }

  /**
   * Get batch statistics
   */
  public getStatistics(): {
    activeJobs: number;
    completedJobs: number;
    totalFilesProcessed: number;
    totalSuccessful: number;
    totalFailed: number;
    avgProcessingTime: number;
    avgThroughput: number;
    totalCost: number;
  } {
    const results = Array.from(this.jobResults.values());

    return {
      activeJobs: this.activeJobs.size,
      completedJobs: results.length,
      totalFilesProcessed: results.reduce((sum, r) => sum + r.totalFiles, 0),
      totalSuccessful: results.reduce((sum, r) => sum + r.successful, 0),
      totalFailed: results.reduce((sum, r) => sum + r.failed, 0),
      avgProcessingTime:
        results.length > 0
          ? results.reduce((sum, r) => sum + r.metrics.avgProcessingTime, 0) /
            results.length
          : 0,
      avgThroughput:
        results.length > 0
          ? results.reduce((sum, r) => sum + r.metrics.throughput, 0) /
            results.length
          : 0,
      totalCost: results.reduce((sum, r) => sum + r.metrics.totalCost, 0),
    };
  }

  /**
   * Clear completed jobs
   */
  public clearCompleted(): number {
    const count = this.jobResults.size;
    this.jobResults.clear();
    return count;
  }
}

// Singleton instance
let orchestrator: BatchOrchestrator | null = null;

export function getBatchOrchestrator(): BatchOrchestrator {
  if (!orchestrator) {
    orchestrator = new BatchOrchestrator();
  }
  return orchestrator;
}
