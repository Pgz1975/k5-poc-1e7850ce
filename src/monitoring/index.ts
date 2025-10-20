/**
 * K5 POC Monitoring System - Main Export
 * Comprehensive monitoring, alerting, and observability platform
 */

// Configuration
export { monitoringConfig, alertThresholds, healthCheckConfig, metricIntervals } from './config/monitoring.config';

// Types
export * from './types';

// Metrics
export { prometheusClient, metrics } from './metrics/prometheus-client';
export { metricsCollector, recordMetric } from './metrics/collector';

// Error Tracking
export { sentryClient, errorTracking, sentryMiddleware } from './errors/sentry-client';

// Alerting
export { alertManager } from './alerts/alert-manager';

// Health Checks
export { healthCheckService } from './health/health-check';

// Logging
export { logger, createLogger } from './logging/log-aggregator';

// Uptime Monitoring
export { uptimeMonitor } from './uptime/uptime-monitor';

// Incident Management
export { incidentManager } from './incidents/incident-manager';

// Cost Tracking
export { costTracker } from './cost/cost-tracker';

/**
 * Initialize the complete monitoring system
 */
export async function initializeMonitoring(options: {
  enableMetrics?: boolean;
  enableHealthChecks?: boolean;
  enableUptime?: boolean;
  enableCostTracking?: boolean;
} = {}): Promise<void> {
  const {
    enableMetrics = true,
    enableHealthChecks = true,
    enableUptime = true,
    enableCostTracking = true
  } = options;

  console.log('Initializing K5 Monitoring System...');

  try {
    // Start metrics collection
    if (enableMetrics) {
      metricsCollector.start();
      console.log('✓ Metrics collection started');
    }

    // Start health checks
    if (enableHealthChecks) {
      healthCheckService.start();
      console.log('✓ Health check service started');
    }

    // Start uptime monitoring
    if (enableUptime) {
      uptimeMonitor.start();
      console.log('✓ Uptime monitoring started');
    }

    // Cost tracking is always running, no need to start

    console.log('✓ K5 Monitoring System initialized successfully');
  } catch (error) {
    console.error('Failed to initialize monitoring system:', error);
    throw error;
  }
}

/**
 * Shutdown the monitoring system gracefully
 */
export async function shutdownMonitoring(): Promise<void> {
  console.log('Shutting down K5 Monitoring System...');

  try {
    // Stop metrics collection
    metricsCollector.stop();

    // Stop health checks
    healthCheckService.stop();

    // Stop uptime monitoring
    uptimeMonitor.stop();

    // Stop cost tracking
    costTracker.stop();

    // Stop logging
    logger.stop();

    // Flush Sentry
    await sentryClient.flush(5000);

    console.log('✓ K5 Monitoring System shut down successfully');
  } catch (error) {
    console.error('Error during monitoring shutdown:', error);
    throw error;
  }
}

/**
 * Get system status summary
 */
export function getSystemStatus(): {
  healthy: boolean;
  services: any;
  activeAlerts: number;
  activeIncidents: number;
  uptime: any;
  costs: any;
} {
  const systemHealth = healthCheckService.getSystemHealth();
  const activeAlerts = alertManager.getActiveAlerts();
  const activeIncidents = incidentManager.getActiveIncidents();
  const uptimeStats = uptimeMonitor.getOverallStats();
  const currentCosts = costTracker.getCurrentCosts();

  return {
    healthy: systemHealth.overall === 'healthy',
    services: systemHealth.aggregatedMetrics,
    activeAlerts: activeAlerts.length,
    activeIncidents: activeIncidents.length,
    uptime: {
      average: uptimeStats.averageUptime,
      checks: uptimeStats.checkStats
    },
    costs: currentCosts ? {
      current: currentCosts.currentSpend,
      projected: currentCosts.projectedSpend,
      budget: currentCosts.dailyBudget,
      utilization: (currentCosts.projectedSpend / currentCosts.dailyBudget) * 100
    } : null
  };
}

/**
 * Express middleware for monitoring endpoints
 */
export function createMonitoringRoutes() {
  return {
    // Health check endpoint
    health: healthCheckService.getHealthEndpoint(),

    // Readiness check endpoint
    ready: healthCheckService.getReadinessEndpoint(),

    // Liveness check endpoint
    alive: healthCheckService.getLivenessEndpoint(),

    // Metrics endpoint (Prometheus format)
    metrics: async (req: any, res: any) => {
      try {
        const metrics = await prometheusClient.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
      } catch (error) {
        res.status(500).json({ error: 'Failed to collect metrics' });
      }
    },

    // System status endpoint
    status: (req: any, res: any) => {
      const status = getSystemStatus();
      res.json(status);
    },

    // Alerts endpoint
    alerts: (req: any, res: any) => {
      const severity = req.query.severity;
      const alerts = alertManager.getActiveAlerts(severity);
      res.json({ alerts, count: alerts.length });
    },

    // Incidents endpoint
    incidents: (req: any, res: any) => {
      const severity = req.query.severity;
      const incidents = incidentManager.getActiveIncidents(severity);
      res.json({ incidents, count: incidents.length });
    },

    // Cost report endpoint
    costs: (req: any, res: any) => {
      const costs = costTracker.getCurrentCosts();
      const breakdown = costTracker.getCostBreakdown();
      res.json({ current: costs, breakdown });
    }
  };
}

// Default export
export default {
  initializeMonitoring,
  shutdownMonitoring,
  getSystemStatus,
  createMonitoringRoutes,
  // Re-export key services
  metrics,
  logger,
  healthCheckService,
  alertManager,
  incidentManager,
  uptimeMonitor,
  costTracker,
  sentryClient
};
