/**
 * PDF Worker Pool Implementation
 * High-performance parallel PDF processing with worker threads
 * Target: <3s for single-page PDFs, <45s for 100-page documents
 */

import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import os from 'os';
import path from 'path';

export interface WorkerTask {
  id: string;
  type: 'parse' | 'extract' | 'compress' | 'analyze';
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeout?: number;
  retries?: number;
}

export interface WorkerResult {
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  workerId: number;
}

export interface WorkerPoolConfig {
  minWorkers?: number;
  maxWorkers?: number;
  idleTimeout?: number; // ms
  taskTimeout?: number; // ms
  maxRetries?: number;
  autoScale?: boolean;
  workerScript?: string;
}

interface WorkerInfo {
  id: number;
  worker: Worker;
  busy: boolean;
  tasksCompleted: number;
  currentTask?: WorkerTask;
  lastActive: number;
}

export class PDFWorkerPool extends EventEmitter {
  private workers: Map<number, WorkerInfo> = new Map();
  private taskQueue: WorkerTask[] = [];
  private pendingTasks: Map<string, {
    resolve: (result: WorkerResult) => void;
    reject: (error: Error) => void;
    startTime: number;
    retries: number;
  }> = new Map();

  private nextWorkerId = 0;
  private config: Required<WorkerPoolConfig>;
  private scaleInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;
  private shuttingDown = false;

  // Performance metrics
  private metrics = {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    totalDuration: 0,
    queueTime: 0,
    avgWorkerUtilization: 0,
  };

  constructor(config: WorkerPoolConfig = {}) {
    super();

    const cpuCount = os.cpus().length;
    this.config = {
      minWorkers: config.minWorkers ?? Math.max(2, Math.floor(cpuCount / 2)),
      maxWorkers: config.maxWorkers ?? cpuCount,
      idleTimeout: config.idleTimeout ?? 60000, // 1 minute
      taskTimeout: config.taskTimeout ?? 120000, // 2 minutes
      maxRetries: config.maxRetries ?? 2,
      autoScale: config.autoScale ?? true,
      workerScript: config.workerScript ?? path.join(__dirname, 'pdf-worker.js'),
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Spawn minimum workers
    for (let i = 0; i < this.config.minWorkers; i++) {
      await this.spawnWorker();
    }

    // Start auto-scaling if enabled
    if (this.config.autoScale) {
      this.startAutoScaling();
    }

    // Start metrics collection
    this.startMetricsCollection();

    this.emit('initialized', {
      workers: this.workers.size,
      config: this.config,
    });
  }

  private async spawnWorker(): Promise<number> {
    if (this.shuttingDown || this.workers.size >= this.config.maxWorkers) {
      return -1;
    }

    const workerId = this.nextWorkerId++;
    const worker = new Worker(this.config.workerScript, {
      workerData: { workerId },
    });

    const workerInfo: WorkerInfo = {
      id: workerId,
      worker,
      busy: false,
      tasksCompleted: 0,
      lastActive: Date.now(),
    };

    // Handle worker messages
    worker.on('message', (result: WorkerResult) => {
      this.handleWorkerResult(workerId, result);
    });

    // Handle worker errors
    worker.on('error', (error) => {
      this.handleWorkerError(workerId, error);
    });

    // Handle worker exit
    worker.on('exit', (code) => {
      this.handleWorkerExit(workerId, code);
    });

    this.workers.set(workerId, workerInfo);
    this.emit('workerSpawned', { workerId, totalWorkers: this.workers.size });

    return workerId;
  }

  private async terminateWorker(workerId: number): Promise<void> {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;

    await workerInfo.worker.terminate();
    this.workers.delete(workerId);
    this.emit('workerTerminated', { workerId, totalWorkers: this.workers.size });
  }

  private handleWorkerResult(workerId: number, result: WorkerResult): void {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;

    workerInfo.busy = false;
    workerInfo.tasksCompleted++;
    workerInfo.lastActive = Date.now();
    workerInfo.currentTask = undefined;

    const pending = this.pendingTasks.get(result.taskId);
    if (pending) {
      this.metrics.completedTasks++;
      this.metrics.totalDuration += result.duration;

      if (result.success) {
        pending.resolve(result);
      } else {
        // Retry logic
        const task = this.taskQueue.find(t => t.id === result.taskId);
        if (task && pending.retries < this.config.maxRetries) {
          pending.retries++;
          this.taskQueue.unshift(task); // Priority retry
        } else {
          this.metrics.failedTasks++;
          pending.reject(new Error(result.error || 'Task failed'));
        }
      }

      this.pendingTasks.delete(result.taskId);
    }

    // Process next task in queue
    this.processQueue();
  }

  private handleWorkerError(workerId: number, error: Error): void {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;

    this.emit('workerError', { workerId, error: error.message });

    // Mark current task as failed and retry
    if (workerInfo.currentTask) {
      const pending = this.pendingTasks.get(workerInfo.currentTask.id);
      if (pending && pending.retries < this.config.maxRetries) {
        pending.retries++;
        this.taskQueue.unshift(workerInfo.currentTask);
      }
    }

    // Respawn worker
    this.terminateWorker(workerId).then(() => {
      if (!this.shuttingDown) {
        this.spawnWorker();
      }
    });
  }

  private handleWorkerExit(workerId: number, code: number): void {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;

    this.emit('workerExit', { workerId, code });

    // Respawn if unexpected exit
    if (code !== 0 && !this.shuttingDown) {
      this.spawnWorker();
    }
  }

  private processQueue(): void {
    if (this.taskQueue.length === 0) return;

    // Find available worker
    const availableWorker = Array.from(this.workers.values()).find(w => !w.busy);
    if (!availableWorker) {
      // All workers busy, try to scale up
      if (this.config.autoScale && this.workers.size < this.config.maxWorkers) {
        this.spawnWorker().then(() => this.processQueue());
      }
      return;
    }

    // Sort queue by priority
    this.taskQueue.sort((a, b) => {
      const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    const task = this.taskQueue.shift();
    if (!task) return;

    // Assign task to worker
    availableWorker.busy = true;
    availableWorker.currentTask = task;
    availableWorker.lastActive = Date.now();

    const pending = this.pendingTasks.get(task.id);
    if (pending) {
      this.metrics.queueTime += Date.now() - pending.startTime;
    }

    // Set timeout for task
    const timeout = task.timeout || this.config.taskTimeout;
    const timeoutId = setTimeout(() => {
      this.handleTaskTimeout(task.id, availableWorker.id);
    }, timeout);

    // Send task to worker
    availableWorker.worker.postMessage({
      task,
      timeoutId,
    });

    // Process next task if more available
    if (this.taskQueue.length > 0) {
      setImmediate(() => this.processQueue());
    }
  }

  private handleTaskTimeout(taskId: string, workerId: number): void {
    const pending = this.pendingTasks.get(taskId);
    if (!pending) return;

    this.metrics.failedTasks++;
    pending.reject(new Error(`Task timeout after ${this.config.taskTimeout}ms`));
    this.pendingTasks.delete(taskId);

    // Terminate and respawn worker
    this.terminateWorker(workerId).then(() => {
      if (!this.shuttingDown) {
        this.spawnWorker();
      }
    });
  }

  private startAutoScaling(): void {
    this.scaleInterval = setInterval(() => {
      const busyWorkers = Array.from(this.workers.values()).filter(w => w.busy).length;
      const utilizationRate = busyWorkers / this.workers.size;

      // Scale up if utilization > 80% and queue has tasks
      if (utilizationRate > 0.8 && this.taskQueue.length > 0) {
        if (this.workers.size < this.config.maxWorkers) {
          this.spawnWorker();
        }
      }

      // Scale down if utilization < 30% and above minimum
      if (utilizationRate < 0.3 && this.workers.size > this.config.minWorkers) {
        const idleWorker = Array.from(this.workers.values()).find(
          w => !w.busy && Date.now() - w.lastActive > this.config.idleTimeout
        );
        if (idleWorker) {
          this.terminateWorker(idleWorker.id);
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      const busyWorkers = Array.from(this.workers.values()).filter(w => w.busy).length;
      this.metrics.avgWorkerUtilization = busyWorkers / this.workers.size;

      this.emit('metrics', {
        ...this.metrics,
        activeWorkers: this.workers.size,
        busyWorkers,
        queueSize: this.taskQueue.length,
        avgTaskDuration: this.metrics.completedTasks > 0
          ? this.metrics.totalDuration / this.metrics.completedTasks
          : 0,
        avgQueueTime: this.metrics.completedTasks > 0
          ? this.metrics.queueTime / this.metrics.completedTasks
          : 0,
      });
    }, 10000); // Every 10 seconds
  }

  public async execute(task: WorkerTask): Promise<WorkerResult> {
    if (this.shuttingDown) {
      throw new Error('Worker pool is shutting down');
    }

    this.metrics.totalTasks++;

    return new Promise((resolve, reject) => {
      this.pendingTasks.set(task.id, {
        resolve,
        reject,
        startTime: Date.now(),
        retries: 0,
      });

      this.taskQueue.push(task);
      this.processQueue();
    });
  }

  public async executeBatch(tasks: WorkerTask[]): Promise<WorkerResult[]> {
    return Promise.all(tasks.map(task => this.execute(task)));
  }

  public getMetrics() {
    const busyWorkers = Array.from(this.workers.values()).filter(w => w.busy).length;
    return {
      ...this.metrics,
      activeWorkers: this.workers.size,
      busyWorkers,
      queueSize: this.taskQueue.length,
      avgTaskDuration: this.metrics.completedTasks > 0
        ? this.metrics.totalDuration / this.metrics.completedTasks
        : 0,
      avgQueueTime: this.metrics.completedTasks > 0
        ? this.metrics.queueTime / this.metrics.completedTasks
        : 0,
    };
  }

  public async shutdown(): Promise<void> {
    this.shuttingDown = true;

    // Clear intervals
    if (this.scaleInterval) clearInterval(this.scaleInterval);
    if (this.metricsInterval) clearInterval(this.metricsInterval);

    // Wait for pending tasks (with timeout)
    const shutdownTimeout = setTimeout(() => {
      this.emit('forcedShutdown', { pendingTasks: this.pendingTasks.size });
    }, 30000); // 30 second timeout

    // Terminate all workers
    await Promise.all(
      Array.from(this.workers.keys()).map(id => this.terminateWorker(id))
    );

    clearTimeout(shutdownTimeout);
    this.emit('shutdown', { metrics: this.metrics });
  }
}

// Singleton instance
let poolInstance: PDFWorkerPool | null = null;

export function getWorkerPool(config?: WorkerPoolConfig): PDFWorkerPool {
  if (!poolInstance) {
    poolInstance = new PDFWorkerPool(config);
  }
  return poolInstance;
}

export async function shutdownWorkerPool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.shutdown();
    poolInstance = null;
  }
}
