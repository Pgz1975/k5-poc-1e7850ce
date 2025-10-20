/**
 * Health Check Service
 * Monitors health of all system services and dependencies
 */

import { EventEmitter } from 'events';
import { ServiceHealth, SystemHealth, HealthStatus } from '../types';
import { healthCheckConfig } from '../config/monitoring.config';
import { metrics } from '../metrics/prometheus-client';

interface HealthCheckResult {
  service: string;
  healthy: boolean;
  responseTime: number;
  error?: string;
  timestamp: Date;
}

class HealthCheckService extends EventEmitter {
  private serviceHealthMap: Map<string, ServiceHealth> = new Map();
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  /**
   * Start health checks for all configured services
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('Health check service is already running');
      return;
    }

    console.log('Starting health check service...');
    this.isRunning = true;

    for (const serviceConfig of healthCheckConfig.services) {
      this.startServiceCheck(serviceConfig);
    }

    this.emit('started');
  }

  /**
   * Stop all health checks
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping health check service...');

    for (const [serviceName, interval] of this.checkIntervals.entries()) {
      clearInterval(interval);
      this.checkIntervals.delete(serviceName);
    }

    this.isRunning = false;
    this.emit('stopped');
  }

  /**
   * Start health check for a specific service
   */
  private startServiceCheck(config: { name: string; url: string; critical: boolean }): void {
    const checkInterval = setInterval(async () => {
      try {
        const result = await this.performHealthCheck(config.name, config.url);
        this.updateServiceHealth(config.name, result, config.critical);
      } catch (error) {
        console.error(`Health check failed for ${config.name}:`, error);
        this.updateServiceHealth(config.name, {
          service: config.name,
          healthy: false,
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }, config.critical);
      }
    }, healthCheckConfig.interval);

    this.checkIntervals.set(config.name, checkInterval);

    // Perform initial check immediately
    this.performHealthCheck(config.name, config.url)
      .then(result => this.updateServiceHealth(config.name, result, config.critical))
      .catch(error => console.error(`Initial health check failed for ${config.name}:`, error));
  }

  /**
   * Perform a health check against a service
   */
  private async performHealthCheck(serviceName: string, url: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let retries = 0;

    while (retries < healthCheckConfig.retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), healthCheckConfig.timeout);

        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'K5-Health-Check/1.0'
          }
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        const healthy = response.ok;

        return {
          service: serviceName,
          healthy,
          responseTime,
          error: healthy ? undefined : `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date()
        };
      } catch (error) {
        retries++;
        if (retries >= healthCheckConfig.retries) {
          return {
            service: serviceName,
            healthy: false,
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Health check failed',
            timestamp: new Date()
          };
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Health check failed after all retries');
  }

  /**
   * Update service health status
   */
  private updateServiceHealth(serviceName: string, result: HealthCheckResult, critical: boolean): void {
    const previousHealth = this.serviceHealthMap.get(serviceName);
    const status = this.determineHealthStatus(result.healthy, result.responseTime);

    const serviceHealth: ServiceHealth = {
      serviceName,
      status,
      lastCheck: result.timestamp,
      responseTime: result.responseTime,
      components: [
        {
          name: 'endpoint',
          status: result.healthy ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
          message: result.error
        }
      ],
      dependencies: [],
      version: 'unknown',
      uptime: this.calculateUptime(serviceName),
      environment: process.env.NODE_ENV || 'development'
    };

    this.serviceHealthMap.set(serviceName, serviceHealth);

    // Record metrics
    metrics.setServiceHealth(serviceName, result.healthy);
    metrics.recordHealthCheck(serviceName, result.responseTime, result.healthy, result.error);

    // Emit events
    if (previousHealth?.status !== status) {
      this.emit('health:changed', { serviceName, previousStatus: previousHealth?.status, newStatus: status });

      if (status === HealthStatus.UNHEALTHY && critical) {
        this.emit('health:critical', { serviceName, error: result.error });
      }
    }

    this.emit('health:checked', serviceHealth);
  }

  /**
   * Determine health status based on check result
   */
  private determineHealthStatus(healthy: boolean, responseTime: number): HealthStatus {
    if (!healthy) {
      return HealthStatus.UNHEALTHY;
    }

    if (responseTime > 5000) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }

  /**
   * Calculate service uptime (simplified)
   */
  private calculateUptime(serviceName: string): number {
    // In a real implementation, this would track actual uptime
    // For now, return process uptime
    return process.uptime();
  }

  /**
   * Get health status for a specific service
   */
  public getServiceHealth(serviceName: string): ServiceHealth | undefined {
    return this.serviceHealthMap.get(serviceName);
  }

  /**
   * Get overall system health
   */
  public getSystemHealth(): SystemHealth {
    const services = Array.from(this.serviceHealthMap.values());
    const healthyCount = services.filter(s => s.status === HealthStatus.HEALTHY).length;
    const degradedCount = services.filter(s => s.status === HealthStatus.DEGRADED).length;
    const unhealthyCount = services.filter(s => s.status === HealthStatus.UNHEALTHY).length;

    let overallStatus: HealthStatus;
    if (unhealthyCount > 0) {
      // Check if any critical services are unhealthy
      const criticalUnhealthy = services.some(s =>
        s.status === HealthStatus.UNHEALTHY &&
        healthCheckConfig.services.find(c => c.name === s.serviceName)?.critical
      );
      overallStatus = criticalUnhealthy ? HealthStatus.UNHEALTHY : HealthStatus.DEGRADED;
    } else if (degradedCount > 0) {
      overallStatus = HealthStatus.DEGRADED;
    } else if (healthyCount > 0) {
      overallStatus = HealthStatus.HEALTHY;
    } else {
      overallStatus = HealthStatus.UNKNOWN;
    }

    return {
      overall: overallStatus,
      services,
      timestamp: new Date(),
      aggregatedMetrics: {
        totalServices: services.length,
        healthyServices: healthyCount,
        degradedServices: degradedCount,
        unhealthyServices: unhealthyCount
      }
    };
  }

  /**
   * Get health check for HTTP endpoint
   */
  public getHealthEndpoint(): (req: any, res: any) => void {
    return (req, res) => {
      const systemHealth = this.getSystemHealth();
      const statusCode = systemHealth.overall === HealthStatus.HEALTHY ? 200 :
                        systemHealth.overall === HealthStatus.DEGRADED ? 200 :
                        503;

      res.status(statusCode).json({
        status: systemHealth.overall,
        timestamp: systemHealth.timestamp,
        services: systemHealth.services.map(s => ({
          name: s.serviceName,
          status: s.status,
          responseTime: s.responseTime,
          lastCheck: s.lastCheck
        })),
        metrics: systemHealth.aggregatedMetrics
      });
    };
  }

  /**
   * Get readiness check for HTTP endpoint
   */
  public getReadinessEndpoint(): (req: any, res: any) => void {
    return (req, res) => {
      const systemHealth = this.getSystemHealth();

      // System is ready if all critical services are healthy or degraded (not unhealthy)
      const criticalServices = healthCheckConfig.services.filter(s => s.critical);
      const criticalHealthy = criticalServices.every(cs => {
        const health = this.serviceHealthMap.get(cs.name);
        return health && health.status !== HealthStatus.UNHEALTHY;
      });

      const statusCode = criticalHealthy ? 200 : 503;

      res.status(statusCode).json({
        ready: criticalHealthy,
        timestamp: new Date(),
        critical_services: criticalServices.map(cs => ({
          name: cs.name,
          status: this.serviceHealthMap.get(cs.name)?.status || HealthStatus.UNKNOWN
        }))
      });
    };
  }

  /**
   * Get liveness check for HTTP endpoint
   */
  public getLivenessEndpoint(): (req: any, res: any) => void {
    return (req, res) => {
      // Liveness just checks if the service itself is running
      res.status(200).json({
        alive: true,
        timestamp: new Date(),
        uptime: process.uptime()
      });
    };
  }

  /**
   * Check if service is running
   */
  public isServiceRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get all service names
   */
  public getServiceNames(): string[] {
    return healthCheckConfig.services.map(s => s.name);
  }
}

// Singleton instance
export const healthCheckService = new HealthCheckService();

export default HealthCheckService;
