/**
 * Auto-Scaling Configuration for Edge Functions
 * Dynamic scaling based on load and performance metrics
 */

import { EventEmitter } from 'events';

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetUtilization: number; // 0-1
  scaleUpThreshold: number; // 0-1
  scaleDownThreshold: number; // 0-1
  cooldownPeriod: number; // ms
  warmupTime: number; // ms
  metricsWindow: number; // ms
}

export interface ScalingMetrics {
  currentInstances: number;
  targetInstances: number;
  utilization: number;
  queueDepth: number;
  avgResponseTime: number;
  requestRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface ScalingEvent {
  timestamp: number;
  action: 'scale_up' | 'scale_down' | 'no_action';
  reason: string;
  fromInstances: number;
  toInstances: number;
  metrics: ScalingMetrics;
}

export class AutoScaler extends EventEmitter {
  private config: Required<ScalingConfig>;
  private currentInstances: number;
  private lastScaleTime: number = 0;
  private metricsHistory: ScalingMetrics[] = [];
  private scalingHistory: ScalingEvent[] = [];
  private scalingInterval?: NodeJS.Timeout;

  constructor(config: Partial<ScalingConfig> = {}) {
    super();

    this.config = {
      minInstances: config.minInstances ?? 2,
      maxInstances: config.maxInstances ?? 20,
      targetUtilization: config.targetUtilization ?? 0.7,
      scaleUpThreshold: config.scaleUpThreshold ?? 0.8,
      scaleDownThreshold: config.scaleDownThreshold ?? 0.4,
      cooldownPeriod: config.cooldownPeriod ?? 60000, // 1 minute
      warmupTime: config.warmupTime ?? 10000, // 10 seconds
      metricsWindow: config.metricsWindow ?? 300000, // 5 minutes
    };

    this.currentInstances = this.config.minInstances;
    this.startAutoScaling();
  }

  /**
   * Start automatic scaling loop
   */
  private startAutoScaling(): void {
    this.scalingInterval = setInterval(() => {
      this.evaluateScaling();
    }, 10000); // Evaluate every 10 seconds

    this.emit('started', { config: this.config });
  }

  /**
   * Update metrics for scaling decisions
   */
  public updateMetrics(metrics: Partial<ScalingMetrics>): void {
    const fullMetrics: ScalingMetrics = {
      currentInstances: this.currentInstances,
      targetInstances: this.currentInstances,
      utilization: metrics.utilization ?? 0,
      queueDepth: metrics.queueDepth ?? 0,
      avgResponseTime: metrics.avgResponseTime ?? 0,
      requestRate: metrics.requestRate ?? 0,
      cpuUsage: metrics.cpuUsage ?? 0,
      memoryUsage: metrics.memoryUsage ?? 0,
    };

    this.metricsHistory.push(fullMetrics);

    // Maintain metrics window
    const cutoff = Date.now() - this.config.metricsWindow;
    this.metricsHistory = this.metricsHistory.filter(
      (m) => Date.now() - this.config.metricsWindow < cutoff
    );

    this.emit('metricsUpdated', fullMetrics);
  }

  /**
   * Evaluate and perform scaling if needed
   */
  private evaluateScaling(): void {
    // Check cooldown period
    const timeSinceLastScale = Date.now() - this.lastScaleTime;
    if (timeSinceLastScale < this.config.cooldownPeriod) {
      return;
    }

    // Get average metrics from recent history
    const avgMetrics = this.getAverageMetrics();
    if (!avgMetrics) return;

    // Calculate target instances based on multiple factors
    const utilizationTarget = this.calculateUtilizationTarget(avgMetrics);
    const queueTarget = this.calculateQueueTarget(avgMetrics);
    const responseTimeTarget = this.calculateResponseTimeTarget(avgMetrics);

    // Use the highest target (most conservative)
    const targetInstances = Math.max(
      utilizationTarget,
      queueTarget,
      responseTimeTarget
    );

    // Clamp to min/max
    const clampedTarget = Math.max(
      this.config.minInstances,
      Math.min(this.config.maxInstances, targetInstances)
    );

    // Determine action
    let action: 'scale_up' | 'scale_down' | 'no_action' = 'no_action';
    let reason = 'Within acceptable parameters';

    if (clampedTarget > this.currentInstances) {
      action = 'scale_up';
      reason = this.getScaleUpReason(avgMetrics);
    } else if (clampedTarget < this.currentInstances) {
      action = 'scale_down';
      reason = this.getScaleDownReason(avgMetrics);
    }

    // Record scaling event
    const event: ScalingEvent = {
      timestamp: Date.now(),
      action,
      reason,
      fromInstances: this.currentInstances,
      toInstances: clampedTarget,
      metrics: avgMetrics,
    };

    this.scalingHistory.push(event);
    if (this.scalingHistory.length > 1000) {
      this.scalingHistory.shift();
    }

    // Perform scaling if needed
    if (action !== 'no_action') {
      this.performScaling(action, clampedTarget, reason);
    }

    this.emit('evaluated', event);
  }

  /**
   * Calculate target instances based on utilization
   */
  private calculateUtilizationTarget(metrics: ScalingMetrics): number {
    if (metrics.utilization === 0) return this.currentInstances;

    const targetUtil = this.config.targetUtilization;
    const currentUtil = metrics.utilization;

    // Scale linearly based on utilization
    const ratio = currentUtil / targetUtil;
    return Math.ceil(this.currentInstances * ratio);
  }

  /**
   * Calculate target instances based on queue depth
   */
  private calculateQueueTarget(metrics: ScalingMetrics): number {
    const queuePerInstance = metrics.queueDepth / this.currentInstances;

    // Scale if queue per instance exceeds 10
    if (queuePerInstance > 10) {
      return Math.ceil(metrics.queueDepth / 10);
    }

    // Scale down if queue is very low
    if (queuePerInstance < 2 && this.currentInstances > this.config.minInstances) {
      return Math.max(
        this.config.minInstances,
        Math.ceil(metrics.queueDepth / 5)
      );
    }

    return this.currentInstances;
  }

  /**
   * Calculate target instances based on response time
   */
  private calculateResponseTimeTarget(metrics: ScalingMetrics): number {
    // Target: <3s for single page processing
    const targetResponseTime = 3000; // ms

    if (metrics.avgResponseTime > targetResponseTime * 1.5) {
      // Response time too high, scale up aggressively
      return Math.ceil(this.currentInstances * 1.5);
    }

    if (metrics.avgResponseTime < targetResponseTime * 0.5) {
      // Response time very low, can scale down
      return Math.max(
        this.config.minInstances,
        Math.floor(this.currentInstances * 0.8)
      );
    }

    return this.currentInstances;
  }

  /**
   * Get average metrics from history
   */
  private getAverageMetrics(): ScalingMetrics | null {
    if (this.metricsHistory.length === 0) return null;

    const sum = this.metricsHistory.reduce(
      (acc, m) => ({
        currentInstances: m.currentInstances,
        targetInstances: m.targetInstances,
        utilization: acc.utilization + m.utilization,
        queueDepth: acc.queueDepth + m.queueDepth,
        avgResponseTime: acc.avgResponseTime + m.avgResponseTime,
        requestRate: acc.requestRate + m.requestRate,
        cpuUsage: acc.cpuUsage + m.cpuUsage,
        memoryUsage: acc.memoryUsage + m.memoryUsage,
      }),
      {
        currentInstances: this.currentInstances,
        targetInstances: this.currentInstances,
        utilization: 0,
        queueDepth: 0,
        avgResponseTime: 0,
        requestRate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
      }
    );

    const count = this.metricsHistory.length;

    return {
      currentInstances: this.currentInstances,
      targetInstances: this.currentInstances,
      utilization: sum.utilization / count,
      queueDepth: sum.queueDepth / count,
      avgResponseTime: sum.avgResponseTime / count,
      requestRate: sum.requestRate / count,
      cpuUsage: sum.cpuUsage / count,
      memoryUsage: sum.memoryUsage / count,
    };
  }

  /**
   * Get reason for scaling up
   */
  private getScaleUpReason(metrics: ScalingMetrics): string {
    const reasons: string[] = [];

    if (metrics.utilization > this.config.scaleUpThreshold) {
      reasons.push(
        `High utilization: ${(metrics.utilization * 100).toFixed(1)}%`
      );
    }

    if (metrics.queueDepth / this.currentInstances > 10) {
      reasons.push(`High queue depth: ${metrics.queueDepth} items`);
    }

    if (metrics.avgResponseTime > 3000) {
      reasons.push(
        `Slow response time: ${metrics.avgResponseTime.toFixed(0)}ms`
      );
    }

    if (metrics.cpuUsage > 0.8) {
      reasons.push(`High CPU usage: ${(metrics.cpuUsage * 100).toFixed(1)}%`);
    }

    return reasons.join(', ') || 'Preventive scaling';
  }

  /**
   * Get reason for scaling down
   */
  private getScaleDownReason(metrics: ScalingMetrics): string {
    const reasons: string[] = [];

    if (metrics.utilization < this.config.scaleDownThreshold) {
      reasons.push(
        `Low utilization: ${(metrics.utilization * 100).toFixed(1)}%`
      );
    }

    if (metrics.queueDepth === 0) {
      reasons.push('Empty queue');
    }

    if (metrics.avgResponseTime < 1500) {
      reasons.push('Fast response times');
    }

    return reasons.join(', ') || 'Cost optimization';
  }

  /**
   * Perform scaling action
   */
  private async performScaling(
    action: 'scale_up' | 'scale_down',
    targetInstances: number,
    reason: string
  ): Promise<void> {
    const fromInstances = this.currentInstances;

    try {
      // Emit scaling event for external handlers
      this.emit('scaling', { action, fromInstances, targetInstances, reason });

      // Update instance count
      this.currentInstances = targetInstances;
      this.lastScaleTime = Date.now();

      // Emit completion
      this.emit('scaled', {
        action,
        fromInstances,
        toInstances: targetInstances,
        reason,
      });
    } catch (error) {
      this.emit('error', { operation: 'performScaling', action, error });
      // Revert on failure
      this.currentInstances = fromInstances;
    }
  }

  /**
   * Manual scale
   */
  public async manualScale(targetInstances: number): Promise<boolean> {
    if (
      targetInstances < this.config.minInstances ||
      targetInstances > this.config.maxInstances
    ) {
      throw new Error(
        `Target instances must be between ${this.config.minInstances} and ${this.config.maxInstances}`
      );
    }

    const action = targetInstances > this.currentInstances ? 'scale_up' : 'scale_down';

    await this.performScaling(action, targetInstances, 'Manual scaling');
    return true;
  }

  /**
   * Get current configuration
   */
  public getConfig(): ScalingConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ScalingConfig>): void {
    Object.assign(this.config, config);
    this.emit('configUpdated', this.config);
  }

  /**
   * Get current state
   */
  public getState(): {
    currentInstances: number;
    config: ScalingConfig;
    recentMetrics: ScalingMetrics | null;
    scalingHistory: ScalingEvent[];
  } {
    return {
      currentInstances: this.currentInstances,
      config: this.config,
      recentMetrics: this.getAverageMetrics(),
      scalingHistory: this.scalingHistory.slice(-50),
    };
  }

  /**
   * Stop auto-scaling
   */
  public stop(): void {
    if (this.scalingInterval) {
      clearInterval(this.scalingInterval);
      this.scalingInterval = undefined;
    }
    this.emit('stopped');
  }
}

// Singleton instance
let autoScaler: AutoScaler | null = null;

export function getAutoScaler(config?: Partial<ScalingConfig>): AutoScaler {
  if (!autoScaler) {
    autoScaler = new AutoScaler(config);
  }
  return autoScaler;
}

export function stopAutoScaler(): void {
  if (autoScaler) {
    autoScaler.stop();
    autoScaler = null;
  }
}
