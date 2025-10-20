/**
 * Performance Metrics Collection System
 * Comprehensive metrics for PDF processing and system performance
 */

import { EventEmitter } from 'events';
import os from 'os';

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  unit?: string;
}

export interface MetricBucket {
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
  values: number[];
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    loadAvg: number[];
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  process: {
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    cpu: number;
    uptime: number;
  };
}

export interface PerformanceMetrics {
  pdf: {
    processingTime: MetricBucket;
    pagesProcessed: number;
    bytesProcessed: number;
    successRate: number;
    failureRate: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
    memoryUsage: number;
  };
  database: {
    queries: number;
    avgQueryTime: number;
    slowQueries: number;
    connectionPoolSize: number;
    activeConnections: number;
  };
  api: {
    requests: number;
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  };
}

export class PerformanceCollector extends EventEmitter {
  private metrics = new Map<string, Metric[]>();
  private buckets = new Map<string, MetricBucket>();
  private startTime = Date.now();
  private collectionInterval?: NodeJS.Timeout;
  private retentionMs = 3600000; // 1 hour

  constructor() {
    super();
    this.startCollection();
  }

  private startCollection(): void {
    this.collectionInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.cleanupOldMetrics();
      this.emitAggregates();
    }, 10000); // Every 10 seconds
  }

  /**
   * Record a metric value
   */
  public record(name: string, value: number, tags?: Record<string, string>, unit?: string): void {
    const metric: Metric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
      unit,
    };

    // Store metric
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    // Update bucket
    this.updateBucket(name, value);

    this.emit('metric', metric);
  }

  /**
   * Record timing with automatic unit
   */
  public timing(name: string, duration: number, tags?: Record<string, string>): void {
    this.record(name, duration, tags, 'ms');
  }

  /**
   * Increment counter
   */
  public increment(name: string, tags?: Record<string, string>): void {
    this.record(name, 1, tags, 'count');
  }

  /**
   * Set gauge value
   */
  public gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.record(name, value, tags, 'gauge');
  }

  /**
   * Measure function execution time
   */
  public async measure<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.timing(name, Date.now() - start, { ...tags, status: 'success' });
      return result;
    } catch (error) {
      this.timing(name, Date.now() - start, { ...tags, status: 'error' });
      throw error;
    }
  }

  /**
   * Create a timer that can be stopped later
   */
  public startTimer(name: string, tags?: Record<string, string>): () => void {
    const start = Date.now();
    return () => {
      this.timing(name, Date.now() - start, tags);
    };
  }

  private updateBucket(name: string, value: number): void {
    let bucket = this.buckets.get(name);

    if (!bucket) {
      bucket = {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        avg: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        values: [],
      };
      this.buckets.set(name, bucket);
    }

    bucket.count++;
    bucket.sum += value;
    bucket.min = Math.min(bucket.min, value);
    bucket.max = Math.max(bucket.max, value);
    bucket.avg = bucket.sum / bucket.count;
    bucket.values.push(value);

    // Keep last 1000 values for percentile calculation
    if (bucket.values.length > 1000) {
      bucket.values.shift();
    }

    // Calculate percentiles
    const sorted = [...bucket.values].sort((a, b) => a - b);
    bucket.p50 = this.percentile(sorted, 0.5);
    bucket.p95 = this.percentile(sorted, 0.95);
    bucket.p99 = this.percentile(sorted, 0.99);
  }

  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)] || 0;
  }

  /**
   * Get bucket statistics
   */
  public getBucket(name: string): MetricBucket | null {
    return this.buckets.get(name) || null;
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // CPU metrics
    this.gauge('system.cpu.cores', cpus.length);
    this.gauge('system.cpu.load_avg_1m', os.loadavg()[0]);
    this.gauge('system.cpu.load_avg_5m', os.loadavg()[1]);
    this.gauge('system.cpu.load_avg_15m', os.loadavg()[2]);

    // Memory metrics
    this.gauge('system.memory.total', totalMem);
    this.gauge('system.memory.used', usedMem);
    this.gauge('system.memory.free', freeMem);
    this.gauge('system.memory.usage_percent', (usedMem / totalMem) * 100);

    // Process metrics
    const memUsage = process.memoryUsage();
    this.gauge('process.memory.rss', memUsage.rss);
    this.gauge('process.memory.heap_total', memUsage.heapTotal);
    this.gauge('process.memory.heap_used', memUsage.heapUsed);
    this.gauge('process.memory.external', memUsage.external);
    this.gauge('process.uptime', process.uptime());

    // CPU usage (requires tracking)
    const cpuUsage = process.cpuUsage();
    this.gauge('process.cpu.user', cpuUsage.user);
    this.gauge('process.cpu.system', cpuUsage.system);
  }

  /**
   * Get system metrics snapshot
   */
  public getSystemMetrics(): SystemMetrics {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = process.memoryUsage();

    return {
      cpu: {
        usage: this.calculateCPUUsage(cpus),
        loadAvg: os.loadavg(),
        cores: cpus.length,
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: (usedMem / totalMem) * 100,
      },
      process: {
        memory: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
        },
        cpu: 0, // Calculated separately
        uptime: process.uptime(),
      },
    };
  }

  private calculateCPUUsage(cpus: os.CpuInfo[]): number {
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof os.CpuInfo['times']];
      }
      totalIdle += cpu.times.idle;
    }

    return 100 - ~~((100 * totalIdle) / totalTick);
  }

  /**
   * Get performance metrics summary
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    const pdfProcessing = this.getBucket('pdf.processing_time');
    const cacheHits = this.getBucket('cache.hits');
    const cacheMisses = this.getBucket('cache.misses');
    const dbQueries = this.getBucket('database.query_time');
    const apiRequests = this.getBucket('api.response_time');

    return {
      pdf: {
        processingTime: pdfProcessing || this.emptyBucket(),
        pagesProcessed: this.getBucket('pdf.pages_processed')?.sum || 0,
        bytesProcessed: this.getBucket('pdf.bytes_processed')?.sum || 0,
        successRate: this.calculateRate('pdf.success', 'pdf.total'),
        failureRate: this.calculateRate('pdf.failure', 'pdf.total'),
      },
      cache: {
        hits: cacheHits?.sum || 0,
        misses: cacheMisses?.sum || 0,
        hitRate: this.calculateRate('cache.hits', 'cache.total'),
        evictions: this.getBucket('cache.evictions')?.sum || 0,
        memoryUsage: this.getBucket('cache.memory')?.avg || 0,
      },
      database: {
        queries: dbQueries?.count || 0,
        avgQueryTime: dbQueries?.avg || 0,
        slowQueries: this.getBucket('database.slow_queries')?.count || 0,
        connectionPoolSize: this.getBucket('database.pool_size')?.avg || 0,
        activeConnections: this.getBucket('database.active_connections')?.avg || 0,
      },
      api: {
        requests: apiRequests?.count || 0,
        avgResponseTime: apiRequests?.avg || 0,
        errorRate: this.calculateRate('api.errors', 'api.requests'),
        throughput: this.calculateThroughput('api.requests'),
      },
    };
  }

  private emptyBucket(): MetricBucket {
    return {
      count: 0,
      sum: 0,
      min: 0,
      max: 0,
      avg: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      values: [],
    };
  }

  private calculateRate(numerator: string, denominator: string): number {
    const num = this.getBucket(numerator)?.sum || 0;
    const den = this.getBucket(denominator)?.sum || 0;
    return den > 0 ? (num / den) * 100 : 0;
  }

  private calculateThroughput(name: string): number {
    const bucket = this.getBucket(name);
    if (!bucket) return 0;

    const uptime = (Date.now() - this.startTime) / 1000; // seconds
    return bucket.count / uptime;
  }

  /**
   * Clean up old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.retentionMs;

    for (const [name, metrics] of this.metrics) {
      const filtered = metrics.filter((m) => m.timestamp > cutoff);
      if (filtered.length === 0) {
        this.metrics.delete(name);
      } else {
        this.metrics.set(name, filtered);
      }
    }
  }

  /**
   * Emit aggregate metrics
   */
  private emitAggregates(): void {
    this.emit('aggregates', {
      system: this.getSystemMetrics(),
      performance: this.getPerformanceMetrics(),
      uptime: Date.now() - this.startTime,
    });
  }

  /**
   * Get all metrics for a time range
   */
  public getMetrics(
    name?: string,
    startTime?: number,
    endTime?: number
  ): Map<string, Metric[]> {
    const start = startTime || Date.now() - this.retentionMs;
    const end = endTime || Date.now();

    const filtered = new Map<string, Metric[]>();

    for (const [metricName, metrics] of this.metrics) {
      if (name && metricName !== name) continue;

      const inRange = metrics.filter((m) => m.timestamp >= start && m.timestamp <= end);
      if (inRange.length > 0) {
        filtered.set(metricName, inRange);
      }
    }

    return filtered;
  }

  /**
   * Export metrics in Prometheus format
   */
  public exportPrometheus(): string {
    let output = '';

    for (const [name, bucket] of this.buckets) {
      const metricName = name.replace(/\./g, '_');

      output += `# TYPE ${metricName} summary\n`;
      output += `${metricName}_count ${bucket.count}\n`;
      output += `${metricName}_sum ${bucket.sum}\n`;
      output += `${metricName}{quantile="0.5"} ${bucket.p50}\n`;
      output += `${metricName}{quantile="0.95"} ${bucket.p95}\n`;
      output += `${metricName}{quantile="0.99"} ${bucket.p99}\n`;
    }

    return output;
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.metrics.clear();
    this.buckets.clear();
    this.startTime = Date.now();
    this.emit('reset');
  }

  /**
   * Shutdown collector
   */
  public shutdown(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
    }
    this.emit('shutdown');
  }
}

// Singleton instance
let collector: PerformanceCollector | null = null;

export function getPerformanceCollector(): PerformanceCollector {
  if (!collector) {
    collector = new PerformanceCollector();
  }
  return collector;
}

export function shutdownCollector(): void {
  if (collector) {
    collector.shutdown();
    collector = null;
  }
}
