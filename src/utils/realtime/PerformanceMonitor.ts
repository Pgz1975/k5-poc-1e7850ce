/**
 * Performance Monitor for Realtime Voice System
 * Tracks latency, jitter, underruns, and connection health
 */

export interface PerformanceSummary {
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  underruns: number;
  reconnections: number;
  uptime: number;
  health: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;

  private metrics = {
    endToEndLatency: [] as number[],
    audioBufferUnderruns: 0,
    networkJitter: [] as number[],
    reconnectionCount: 0,
    sessionStartTime: 0,
    chunkLatencies: new Map<number, number>()
  };

  private constructor() {
    this.metrics.sessionStartTime = performance.now();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordVoiceInput(timestamp: number): number {
    const inputId = Math.random();
    this.metrics.chunkLatencies.set(inputId, timestamp);
    return inputId;
  }

  recordVoiceResponse(inputId: number): void {
    const startTime = this.metrics.chunkLatencies.get(inputId);
    if (startTime) {
      const latency = performance.now() - startTime;
      this.metrics.endToEndLatency.push(latency);
      this.metrics.chunkLatencies.delete(inputId);

      // Keep only recent measurements
      if (this.metrics.endToEndLatency.length > 100) {
        this.metrics.endToEndLatency.shift();
      }

      // Alert if latency exceeds threshold
      if (latency > 500) {
        console.warn(`[PerformanceMonitor] High latency: ${latency.toFixed(0)}ms`);
      }
    }
  }

  recordBufferUnderrun(): void {
    this.metrics.audioBufferUnderruns++;
    console.warn(`[PerformanceMonitor] Buffer underrun #${this.metrics.audioBufferUnderruns}`);
  }

  recordReconnection(): void {
    this.metrics.reconnectionCount++;
  }

  recordChunkReceived(chunkSize: number): void {
    // Track for potential jitter analysis
  }

  getAverageLatency(): number {
    if (this.metrics.endToEndLatency.length === 0) return 0;
    return this.metrics.endToEndLatency.reduce((a, b) => a + b, 0) / this.metrics.endToEndLatency.length;
  }

  getPercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  getMetricsSummary(): PerformanceSummary {
    const uptime = (performance.now() - this.metrics.sessionStartTime) / 1000; // seconds

    return {
      avgLatency: this.getAverageLatency(),
      p95Latency: this.getPercentile(this.metrics.endToEndLatency, 0.95),
      p99Latency: this.getPercentile(this.metrics.endToEndLatency, 0.99),
      underruns: this.metrics.audioBufferUnderruns,
      reconnections: this.metrics.reconnectionCount,
      uptime,
      health: this.calculateHealthScore()
    };
  }

  private calculateHealthScore(): number {
    // Score from 0-100 based on metrics
    let score = 100;

    // Deduct for high latency
    const avgLatency = this.getAverageLatency();
    if (avgLatency > 300) score -= 20;
    if (avgLatency > 500) score -= 30;

    // Deduct for underruns
    if (this.metrics.audioBufferUnderruns > 0) score -= 10;
    if (this.metrics.audioBufferUnderruns > 5) score -= 20;

    // Deduct for reconnections
    score -= this.metrics.reconnectionCount * 5;

    return Math.max(0, score);
  }

  reset(): void {
    this.metrics = {
      endToEndLatency: [],
      audioBufferUnderruns: 0,
      networkJitter: [],
      reconnectionCount: 0,
      sessionStartTime: performance.now(),
      chunkLatencies: new Map()
    };
  }

  logSummary(): void {
    const summary = this.getMetricsSummary();
    console.log('[PerformanceMonitor] Summary:', {
      avgLatency: `${summary.avgLatency.toFixed(0)}ms`,
      p95: `${summary.p95Latency.toFixed(0)}ms`,
      p99: `${summary.p99Latency.toFixed(0)}ms`,
      underruns: summary.underruns,
      reconnections: summary.reconnections,
      uptime: `${summary.uptime.toFixed(0)}s`,
      health: `${summary.health.toFixed(0)}%`
    });
  }
}
