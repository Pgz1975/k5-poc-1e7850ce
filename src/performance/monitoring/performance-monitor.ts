/**
 * Performance Monitoring and Metrics Collection
 * Real-time tracking of PDF processing performance
 * Target: <3s single page, <45s for 100 pages, <$0.05 per PDF
 */

import { EventEmitter } from 'events';

export interface PerformanceMetrics {
  // Processing metrics
  avgProcessingTime: number;
  p50ProcessingTime: number;
  p95ProcessingTime: number;
  p99ProcessingTime: number;
  maxProcessingTime: number;
  minProcessingTime: number;

  // Throughput metrics
  documentsProcessed: number;
  pagesProcessed: number;
  bytesProcessed: number;
  throughputMBps: number;
  documentsPerHour: number;

  // Resource utilization
  avgCPUUsage: number;
  avgMemoryUsage: number;
  peakMemoryUsage: number;
  activeWorkers: number;
  queueDepth: number;

  // Quality metrics
  successRate: number;
  errorRate: number;
  retryRate: number;
  avgAccuracy: number;

  // Cost metrics
  totalCost: number;
  avgCostPerDocument: number;
  apiCallCount: number;
  storageUsed: number;

  // Cache metrics
  cacheHitRate: number;
  cacheMissRate: number;
  cacheSize: number;
}

export interface ProcessingEvent {
  id: string;
  type: 'pdf_upload' | 'pdf_parse' | 'text_extract' | 'image_extract' | 'metadata';
  startTime: number;
  endTime: number;
  duration: number;
  pageCount?: number;
  fileSize?: number;
  success: boolean;
  error?: string;
  cost?: number;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: string;
  message: string;
  timestamp: number;
  metrics?: Record<string, any>;
  resolved?: boolean;
}

export interface PerformanceThresholds {
  maxProcessingTime: number; // ms
  maxMemoryUsage: number; // bytes
  maxErrorRate: number; // 0-1
  minSuccessRate: number; // 0-1
  maxCostPerDocument: number; // dollars
  maxQueueDepth: number;
}

export class PerformanceMonitor extends EventEmitter {
  private events: ProcessingEvent[] = [];
  private alerts: Alert[] = [];
  private metrics: PerformanceMetrics;
  private thresholds: PerformanceThresholds;
  private startTime: number;

  // Processing time buckets for percentile calculation
  private processingTimes: number[] = [];
  private maxStoredEvents = 10000;
  private maxStoredTimes = 1000;

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    super();

    this.startTime = Date.now();

    this.thresholds = {
      maxProcessingTime: thresholds?.maxProcessingTime ?? 45000, // 45s for 100 pages
      maxMemoryUsage: thresholds?.maxMemoryUsage ?? 1024 * 1024 * 1024, // 1GB
      maxErrorRate: thresholds?.maxErrorRate ?? 0.05, // 5%
      minSuccessRate: thresholds?.minSuccessRate ?? 0.95, // 95%
      maxCostPerDocument: thresholds?.maxCostPerDocument ?? 0.05, // $0.05
      maxQueueDepth: thresholds?.maxQueueDepth ?? 100,
    };

    this.metrics = this.initializeMetrics();
    this.startMetricsCollection();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      avgProcessingTime: 0,
      p50ProcessingTime: 0,
      p95ProcessingTime: 0,
      p99ProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: Infinity,
      documentsProcessed: 0,
      pagesProcessed: 0,
      bytesProcessed: 0,
      throughputMBps: 0,
      documentsPerHour: 0,
      avgCPUUsage: 0,
      avgMemoryUsage: 0,
      peakMemoryUsage: 0,
      activeWorkers: 0,
      queueDepth: 0,
      successRate: 1,
      errorRate: 0,
      retryRate: 0,
      avgAccuracy: 0,
      totalCost: 0,
      avgCostPerDocument: 0,
      apiCallCount: 0,
      storageUsed: 0,
      cacheHitRate: 0,
      cacheMissRate: 0,
      cacheSize: 0,
    };
  }

  /**
   * Record a processing event
   */
  public recordEvent(event: Omit<ProcessingEvent, 'duration'>): void {
    const fullEvent: ProcessingEvent = {
      ...event,
      duration: event.endTime - event.startTime,
    };

    this.events.push(fullEvent);
    this.processingTimes.push(fullEvent.duration);

    // Maintain max stored events
    if (this.events.length > this.maxStoredEvents) {
      this.events.shift();
    }
    if (this.processingTimes.length > this.maxStoredTimes) {
      this.processingTimes.shift();
    }

    // Update metrics
    this.updateMetrics(fullEvent);

    // Check thresholds
    this.checkThresholds(fullEvent);

    this.emit('event', fullEvent);
  }

  /**
   * Update metrics based on new event
   */
  private updateMetrics(event: ProcessingEvent): void {
    const { metrics } = this;

    // Update document/page counts
    metrics.documentsProcessed++;
    if (event.pageCount) {
      metrics.pagesProcessed += event.pageCount;
    }
    if (event.fileSize) {
      metrics.bytesProcessed += event.fileSize;
    }

    // Update processing times
    const times = this.processingTimes.slice().sort((a, b) => a - b);
    metrics.avgProcessingTime = times.reduce((a, b) => a + b, 0) / times.length;
    metrics.p50ProcessingTime = this.percentile(times, 0.5);
    metrics.p95ProcessingTime = this.percentile(times, 0.95);
    metrics.p99ProcessingTime = this.percentile(times, 0.99);
    metrics.maxProcessingTime = Math.max(metrics.maxProcessingTime, event.duration);
    metrics.minProcessingTime = Math.min(metrics.minProcessingTime, event.duration);

    // Update success/error rates
    const totalEvents = this.events.length;
    const successfulEvents = this.events.filter(e => e.success).length;
    metrics.successRate = successfulEvents / totalEvents;
    metrics.errorRate = 1 - metrics.successRate;

    // Update throughput
    const runtimeSeconds = (Date.now() - this.startTime) / 1000;
    metrics.throughputMBps = (metrics.bytesProcessed / (1024 * 1024)) / runtimeSeconds;
    metrics.documentsPerHour = (metrics.documentsProcessed / runtimeSeconds) * 3600;

    // Update cost metrics
    if (event.cost) {
      metrics.totalCost += event.cost;
      metrics.avgCostPerDocument = metrics.totalCost / metrics.documentsProcessed;
    }

    this.emit('metricsUpdated', metrics);
  }

  /**
   * Calculate percentile
   */
  private percentile(sortedArray: number[], p: number): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil(sortedArray.length * p) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Check performance thresholds and create alerts
   */
  private checkThresholds(event: ProcessingEvent): void {
    const alerts: Alert[] = [];

    // Check processing time
    if (event.duration > this.thresholds.maxProcessingTime) {
      alerts.push({
        id: `slow-processing-${Date.now()}`,
        severity: 'warning',
        type: 'slow_processing',
        message: `Processing took ${event.duration}ms, exceeds threshold of ${this.thresholds.maxProcessingTime}ms`,
        timestamp: Date.now(),
        metrics: { duration: event.duration, eventId: event.id },
      });
    }

    // Check error rate
    if (this.metrics.errorRate > this.thresholds.maxErrorRate) {
      alerts.push({
        id: `high-error-rate-${Date.now()}`,
        severity: 'error',
        type: 'high_error_rate',
        message: `Error rate ${(this.metrics.errorRate * 100).toFixed(2)}% exceeds threshold of ${(this.thresholds.maxErrorRate * 100).toFixed(2)}%`,
        timestamp: Date.now(),
        metrics: { errorRate: this.metrics.errorRate },
      });
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    if (memUsage.heapUsed > this.thresholds.maxMemoryUsage) {
      alerts.push({
        id: `high-memory-${Date.now()}`,
        severity: 'critical',
        type: 'high_memory',
        message: `Memory usage ${(memUsage.heapUsed / (1024 * 1024)).toFixed(2)}MB exceeds threshold`,
        timestamp: Date.now(),
        metrics: { memoryUsage: memUsage.heapUsed },
      });
    }

    // Check cost per document
    if (event.cost && event.cost > this.thresholds.maxCostPerDocument) {
      alerts.push({
        id: `high-cost-${Date.now()}`,
        severity: 'warning',
        type: 'high_cost',
        message: `Document cost $${event.cost.toFixed(4)} exceeds threshold of $${this.thresholds.maxCostPerDocument}`,
        timestamp: Date.now(),
        metrics: { cost: event.cost, eventId: event.id },
      });
    }

    // Emit and store alerts
    alerts.forEach(alert => {
      this.alerts.push(alert);
      this.emit('alert', alert);
    });

    // Maintain max alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
  }

  /**
   * Start periodic metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      const memUsage = process.memoryUsage();

      this.metrics.avgMemoryUsage = memUsage.heapUsed;
      this.metrics.peakMemoryUsage = Math.max(
        this.metrics.peakMemoryUsage,
        memUsage.heapUsed
      );

      this.emit('metricsSnapshot', this.metrics);
    }, 10000); // Every 10 seconds
  }

  /**
   * Update worker metrics
   */
  public updateWorkerMetrics(active: number, queueDepth: number): void {
    this.metrics.activeWorkers = active;
    this.metrics.queueDepth = queueDepth;

    if (queueDepth > this.thresholds.maxQueueDepth) {
      const alert: Alert = {
        id: `queue-depth-${Date.now()}`,
        severity: 'warning',
        type: 'queue_depth',
        message: `Queue depth ${queueDepth} exceeds threshold of ${this.thresholds.maxQueueDepth}`,
        timestamp: Date.now(),
        metrics: { queueDepth },
      };
      this.alerts.push(alert);
      this.emit('alert', alert);
    }
  }

  /**
   * Update cache metrics
   */
  public updateCacheMetrics(
    hitRate: number,
    missRate: number,
    size: number
  ): void {
    this.metrics.cacheHitRate = hitRate;
    this.metrics.cacheMissRate = missRate;
    this.metrics.cacheSize = size;
  }

  /**
   * Get current metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent events
   */
  public getRecentEvents(count: number = 100): ProcessingEvent[] {
    return this.events.slice(-count);
  }

  /**
   * Get events by type
   */
  public getEventsByType(type: string): ProcessingEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.emit('alertResolved', alert);
    }
  }

  /**
   * Get performance report
   */
  public getPerformanceReport(): {
    metrics: PerformanceMetrics;
    summary: string;
    recommendations: string[];
  } {
    const { metrics } = this;
    const recommendations: string[] = [];

    // Generate recommendations based on metrics
    if (metrics.avgProcessingTime > 5000) {
      recommendations.push('Consider increasing worker pool size for better parallelization');
    }

    if (metrics.cacheHitRate < 0.5) {
      recommendations.push('Cache hit rate is low - consider increasing cache TTL or size');
    }

    if (metrics.errorRate > 0.02) {
      recommendations.push('Error rate is elevated - review error logs and implement retry logic');
    }

    if (metrics.avgCostPerDocument > 0.03) {
      recommendations.push('Cost per document is high - optimize API usage and implement caching');
    }

    if (metrics.queueDepth > 50) {
      recommendations.push('Queue depth is high - consider auto-scaling workers');
    }

    const summary = `
Processed ${metrics.documentsProcessed} documents (${metrics.pagesProcessed} pages)
Avg processing time: ${metrics.avgProcessingTime.toFixed(0)}ms
P95 processing time: ${metrics.p95ProcessingTime.toFixed(0)}ms
Success rate: ${(metrics.successRate * 100).toFixed(2)}%
Throughput: ${metrics.throughputMBps.toFixed(2)} MB/s
Avg cost per document: $${metrics.avgCostPerDocument.toFixed(4)}
Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%
    `.trim();

    return {
      metrics,
      summary,
      recommendations,
    };
  }

  /**
   * Export metrics for external monitoring
   */
  public exportMetrics(): string {
    // Export in Prometheus format
    const lines: string[] = [];

    lines.push(`# HELP pdf_processing_time_seconds PDF processing time in seconds`);
    lines.push(`# TYPE pdf_processing_time_seconds histogram`);
    lines.push(`pdf_processing_time_avg ${(this.metrics.avgProcessingTime / 1000).toFixed(3)}`);
    lines.push(`pdf_processing_time_p95 ${(this.metrics.p95ProcessingTime / 1000).toFixed(3)}`);
    lines.push(`pdf_processing_time_p99 ${(this.metrics.p99ProcessingTime / 1000).toFixed(3)}`);

    lines.push(`# HELP pdf_documents_processed_total Total documents processed`);
    lines.push(`# TYPE pdf_documents_processed_total counter`);
    lines.push(`pdf_documents_processed_total ${this.metrics.documentsProcessed}`);

    lines.push(`# HELP pdf_success_rate Success rate`);
    lines.push(`# TYPE pdf_success_rate gauge`);
    lines.push(`pdf_success_rate ${this.metrics.successRate.toFixed(4)}`);

    lines.push(`# HELP pdf_cost_per_document Average cost per document`);
    lines.push(`# TYPE pdf_cost_per_document gauge`);
    lines.push(`pdf_cost_per_document ${this.metrics.avgCostPerDocument.toFixed(6)}`);

    return lines.join('\n');
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.events = [];
    this.alerts = [];
    this.processingTimes = [];
    this.metrics = this.initializeMetrics();
    this.startTime = Date.now();
    this.emit('reset');
  }
}

// Singleton instance
let monitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(
  thresholds?: Partial<PerformanceThresholds>
): PerformanceMonitor {
  if (!monitor) {
    monitor = new PerformanceMonitor(thresholds);
  }
  return monitor;
}
