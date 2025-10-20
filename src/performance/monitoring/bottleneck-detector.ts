/**
 * Bottleneck Detection and Alerting System
 * Identifies performance bottlenecks in PDF processing pipeline
 */

import { EventEmitter } from 'events';

export interface Bottleneck {
  id: string;
  type: 'cpu' | 'memory' | 'io' | 'network' | 'queue' | 'database' | 'api' | 'worker';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  description: string;
  metrics: Record<string, number>;
  timestamp: number;
  duration: number; // How long bottleneck has existed
  impact: number; // 0-100 estimated performance impact percentage
  recommendations: string[];
  resolved: boolean;
}

export interface PerformanceTrace {
  id: string;
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  stages: Array<{
    name: string;
    duration: number;
    percentage: number;
  }>;
  metadata?: Record<string, any>;
}

export interface BottleneckThresholds {
  cpuUsageThreshold: number; // 0-1
  memoryUsageThreshold: number; // 0-1
  queueDepthThreshold: number;
  responseTimeThreshold: number; // ms
  errorRateThreshold: number; // 0-1
  throughputDropThreshold: number; // 0-1 (percentage drop)
}

export class BottleneckDetector extends EventEmitter {
  private bottlenecks = new Map<string, Bottleneck>();
  private traces: PerformanceTrace[] = [];
  private thresholds: BottleneckThresholds;
  private baselineMetrics = new Map<string, number>();
  private detectionInterval?: NodeJS.Timeout;

  // Metrics tracking
  private metricsHistory = new Map<string, number[]>();
  private maxHistorySize = 1000;

  constructor(thresholds?: Partial<BottleneckThresholds>) {
    super();

    this.thresholds = {
      cpuUsageThreshold: thresholds?.cpuUsageThreshold ?? 0.8,
      memoryUsageThreshold: thresholds?.memoryUsageThreshold ?? 0.85,
      queueDepthThreshold: thresholds?.queueDepthThreshold ?? 50,
      responseTimeThreshold: thresholds?.responseTimeThreshold ?? 5000,
      errorRateThreshold: thresholds?.errorRateThreshold ?? 0.05,
      throughputDropThreshold: thresholds?.throughputDropThreshold ?? 0.3,
    };

    this.startDetection();
  }

  /**
   * Start bottleneck detection loop
   */
  private startDetection(): void {
    this.detectionInterval = setInterval(() => {
      this.analyzeBottlenecks();
    }, 5000); // Check every 5 seconds

    this.emit('started');
  }

  /**
   * Record performance trace
   */
  public recordTrace(trace: Omit<PerformanceTrace, 'stages'>): void {
    // Calculate stage percentages
    const stages: PerformanceTrace['stages'] = [];
    let totalDuration = 0;

    if (trace.metadata?.stages) {
      for (const [name, duration] of Object.entries(trace.metadata.stages)) {
        if (typeof duration === 'number') {
          stages.push({ name, duration, percentage: 0 });
          totalDuration += duration;
        }
      }

      // Calculate percentages
      stages.forEach((stage) => {
        stage.percentage = (stage.duration / totalDuration) * 100;
      });
    }

    const fullTrace: PerformanceTrace = {
      ...trace,
      stages,
    };

    this.traces.push(fullTrace);

    // Maintain max traces
    if (this.traces.length > 1000) {
      this.traces.shift();
    }

    // Analyze trace for bottlenecks
    this.analyzeTrace(fullTrace);

    this.emit('trace', fullTrace);
  }

  /**
   * Analyze trace for bottlenecks
   */
  private analyzeTrace(trace: PerformanceTrace): void {
    // Find stages taking >50% of time
    const slowStages = trace.stages.filter((s) => s.percentage > 50);

    for (const stage of slowStages) {
      const bottleneckId = `trace-${trace.operation}-${stage.name}`;

      if (!this.bottlenecks.has(bottleneckId)) {
        const bottleneck: Bottleneck = {
          id: bottleneckId,
          type: this.inferBottleneckType(stage.name),
          severity: stage.percentage > 70 ? 'high' : 'medium',
          component: stage.name,
          description: `Stage "${stage.name}" taking ${stage.percentage.toFixed(1)}% of total time`,
          metrics: {
            duration: stage.duration,
            percentage: stage.percentage,
          },
          timestamp: Date.now(),
          duration: 0,
          impact: stage.percentage,
          recommendations: this.generateRecommendations(stage.name, stage.percentage),
          resolved: false,
        };

        this.bottlenecks.set(bottleneckId, bottleneck);
        this.emit('bottleneck', bottleneck);
      }
    }
  }

  /**
   * Infer bottleneck type from stage name
   */
  private inferBottleneckType(stageName: string): Bottleneck['type'] {
    const name = stageName.toLowerCase();

    if (name.includes('cpu') || name.includes('compute')) return 'cpu';
    if (name.includes('memory') || name.includes('heap')) return 'memory';
    if (name.includes('io') || name.includes('disk') || name.includes('file')) return 'io';
    if (name.includes('network') || name.includes('fetch') || name.includes('download')) return 'network';
    if (name.includes('queue') || name.includes('wait')) return 'queue';
    if (name.includes('database') || name.includes('query') || name.includes('db')) return 'database';
    if (name.includes('api') || name.includes('request')) return 'api';
    if (name.includes('worker') || name.includes('process')) return 'worker';

    return 'cpu'; // Default
  }

  /**
   * Generate recommendations based on bottleneck
   */
  private generateRecommendations(component: string, impact: number): string[] {
    const recommendations: string[] = [];
    const name = component.toLowerCase();

    if (name.includes('parse') || name.includes('extract')) {
      recommendations.push('Consider increasing worker pool size');
      recommendations.push('Enable parallel page processing');
      recommendations.push('Implement result caching for repeated documents');
    }

    if (name.includes('database') || name.includes('query')) {
      recommendations.push('Add database indexes for frequently queried fields');
      recommendations.push('Implement query result caching');
      recommendations.push('Use connection pooling');
      recommendations.push('Consider read replicas for heavy read workloads');
    }

    if (name.includes('api') || name.includes('openai')) {
      recommendations.push('Implement request batching');
      recommendations.push('Add response caching with appropriate TTL');
      recommendations.push('Consider using streaming API if available');
      recommendations.push('Monitor rate limits and implement backoff');
    }

    if (name.includes('upload') || name.includes('storage')) {
      recommendations.push('Enable compression before upload');
      recommendations.push('Use multipart uploads for large files');
      recommendations.push('Implement CDN for frequently accessed content');
      recommendations.push('Consider parallel chunk uploads');
    }

    if (name.includes('image') || name.includes('compress')) {
      recommendations.push('Optimize image compression settings');
      recommendations.push('Use progressive/lazy loading for images');
      recommendations.push('Implement image caching');
      recommendations.push('Consider using WebP format for better compression');
    }

    if (impact > 70) {
      recommendations.push('⚠️ CRITICAL: This is a major bottleneck - prioritize optimization');
    }

    return recommendations;
  }

  /**
   * Update metric for tracking
   */
  public updateMetric(name: string, value: number): void {
    if (!this.metricsHistory.has(name)) {
      this.metricsHistory.set(name, []);
      this.baselineMetrics.set(name, value);
    }

    const history = this.metricsHistory.get(name)!;
    history.push(value);

    // Maintain max history
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    // Update baseline (moving average of first 100 samples)
    if (history.length <= 100) {
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      this.baselineMetrics.set(name, avg);
    }
  }

  /**
   * Analyze current metrics for bottlenecks
   */
  private analyzeBottlenecks(): void {
    const now = Date.now();

    // Get recent metrics
    const recentMetrics = new Map<string, number>();
    for (const [name, history] of this.metricsHistory) {
      if (history.length > 0) {
        // Average of last 10 samples
        const recent = history.slice(-10);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        recentMetrics.set(name, avg);
      }
    }

    // Check CPU bottleneck
    const cpuUsage = recentMetrics.get('cpu_usage') || 0;
    if (cpuUsage > this.thresholds.cpuUsageThreshold) {
      this.detectBottleneck({
        id: 'cpu-high-usage',
        type: 'cpu',
        severity: cpuUsage > 0.95 ? 'critical' : 'high',
        component: 'CPU',
        description: `CPU usage at ${(cpuUsage * 100).toFixed(1)}%`,
        metrics: { cpuUsage },
        recommendations: [
          'Scale up workers or instances',
          'Optimize CPU-intensive operations',
          'Implement caching to reduce computation',
        ],
      });
    } else {
      this.resolveBottleneck('cpu-high-usage');
    }

    // Check memory bottleneck
    const memUsage = recentMetrics.get('memory_usage') || 0;
    if (memUsage > this.thresholds.memoryUsageThreshold) {
      this.detectBottleneck({
        id: 'memory-high-usage',
        type: 'memory',
        severity: memUsage > 0.95 ? 'critical' : 'high',
        component: 'Memory',
        description: `Memory usage at ${(memUsage * 100).toFixed(1)}%`,
        metrics: { memUsage },
        recommendations: [
          'Implement streaming for large files',
          'Clear unnecessary caches',
          'Increase memory limits',
          'Check for memory leaks',
        ],
      });
    } else {
      this.resolveBottleneck('memory-high-usage');
    }

    // Check queue depth bottleneck
    const queueDepth = recentMetrics.get('queue_depth') || 0;
    if (queueDepth > this.thresholds.queueDepthThreshold) {
      this.detectBottleneck({
        id: 'queue-high-depth',
        type: 'queue',
        severity: queueDepth > this.thresholds.queueDepthThreshold * 2 ? 'critical' : 'high',
        component: 'Task Queue',
        description: `Queue depth at ${queueDepth} items`,
        metrics: { queueDepth },
        recommendations: [
          'Scale up workers',
          'Implement priority queue',
          'Optimize task processing time',
          'Consider rate limiting uploads',
        ],
      });
    } else {
      this.resolveBottleneck('queue-high-depth');
    }

    // Check response time bottleneck
    const responseTime = recentMetrics.get('response_time') || 0;
    if (responseTime > this.thresholds.responseTimeThreshold) {
      this.detectBottleneck({
        id: 'slow-response-time',
        type: 'network',
        severity: 'high',
        component: 'API Response',
        description: `Average response time ${responseTime.toFixed(0)}ms`,
        metrics: { responseTime },
        recommendations: [
          'Implement aggressive caching',
          'Optimize database queries',
          'Scale up infrastructure',
          'Use CDN for static content',
        ],
      });
    } else {
      this.resolveBottleneck('slow-response-time');
    }

    // Check throughput drop
    const throughput = recentMetrics.get('throughput') || 0;
    const baselineThroughput = this.baselineMetrics.get('throughput') || throughput;
    if (baselineThroughput > 0) {
      const dropPercentage = 1 - throughput / baselineThroughput;
      if (dropPercentage > this.thresholds.throughputDropThreshold) {
        this.detectBottleneck({
          id: 'throughput-drop',
          type: 'worker',
          severity: 'high',
          component: 'System Throughput',
          description: `Throughput dropped ${(dropPercentage * 100).toFixed(1)}% from baseline`,
          metrics: { throughput, baseline: baselineThroughput, drop: dropPercentage },
          recommendations: [
            'Investigate system health',
            'Check for resource constraints',
            'Review recent changes',
            'Scale up if sustained load',
          ],
        });
      } else {
        this.resolveBottleneck('throughput-drop');
      }
    }

    // Update bottleneck durations
    for (const bottleneck of this.bottlenecks.values()) {
      if (!bottleneck.resolved) {
        bottleneck.duration = now - bottleneck.timestamp;
      }
    }
  }

  /**
   * Detect and record bottleneck
   */
  private detectBottleneck(
    data: Omit<Bottleneck, 'timestamp' | 'duration' | 'impact' | 'resolved'>
  ): void {
    if (!this.bottlenecks.has(data.id)) {
      const bottleneck: Bottleneck = {
        ...data,
        timestamp: Date.now(),
        duration: 0,
        impact: 50, // Default impact
        resolved: false,
      };

      this.bottlenecks.set(data.id, bottleneck);
      this.emit('bottleneck', bottleneck);
    }
  }

  /**
   * Resolve bottleneck
   */
  private resolveBottleneck(id: string): void {
    const bottleneck = this.bottlenecks.get(id);
    if (bottleneck && !bottleneck.resolved) {
      bottleneck.resolved = true;
      bottleneck.duration = Date.now() - bottleneck.timestamp;
      this.emit('resolved', bottleneck);
    }
  }

  /**
   * Get active bottlenecks
   */
  public getActiveBottlenecks(): Bottleneck[] {
    return Array.from(this.bottlenecks.values())
      .filter((b) => !b.resolved)
      .sort((a, b) => {
        // Sort by severity then impact
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        return severityDiff !== 0 ? severityDiff : b.impact - a.impact;
      });
  }

  /**
   * Get bottleneck history
   */
  public getBottleneckHistory(count: number = 50): Bottleneck[] {
    return Array.from(this.bottlenecks.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  /**
   * Get performance report
   */
  public getReport(): {
    activeBottlenecks: number;
    totalDetected: number;
    averageResolutionTime: number;
    topBottlenecks: Bottleneck[];
    recommendations: string[];
  } {
    const active = this.getActiveBottlenecks();
    const resolved = Array.from(this.bottlenecks.values()).filter((b) => b.resolved);

    const avgResolutionTime =
      resolved.length > 0
        ? resolved.reduce((sum, b) => sum + b.duration, 0) / resolved.length
        : 0;

    const allRecommendations = new Set<string>();
    active.forEach((b) => b.recommendations.forEach((r) => allRecommendations.add(r)));

    return {
      activeBottlenecks: active.length,
      totalDetected: this.bottlenecks.size,
      averageResolutionTime: avgResolutionTime,
      topBottlenecks: active.slice(0, 5),
      recommendations: Array.from(allRecommendations),
    };
  }

  /**
   * Clear resolved bottlenecks
   */
  public clearResolved(): void {
    for (const [id, bottleneck] of this.bottlenecks) {
      if (bottleneck.resolved) {
        this.bottlenecks.delete(id);
      }
    }
    this.emit('cleared');
  }

  /**
   * Stop detection
   */
  public stop(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = undefined;
    }
    this.emit('stopped');
  }
}

// Singleton instance
let detector: BottleneckDetector | null = null;

export function getBottleneckDetector(
  thresholds?: Partial<BottleneckThresholds>
): BottleneckDetector {
  if (!detector) {
    detector = new BottleneckDetector(thresholds);
  }
  return detector;
}
