/**
 * K5 POC Monitoring Configuration
 * Central configuration for all monitoring systems
 */

import { MonitoringConfig, LogLevel } from '../types';

export const monitoringConfig: MonitoringConfig = {
  // Prometheus Configuration
  prometheus: {
    enabled: true,
    endpoint: process.env.PROMETHEUS_ENDPOINT || 'http://localhost:9090',
    scrapeInterval: 15, // seconds
    retention: '30d'
  },

  // Grafana Configuration
  grafana: {
    enabled: true,
    url: process.env.GRAFANA_URL || 'http://localhost:3000',
    apiKey: process.env.GRAFANA_API_KEY || '',
    defaultDashboard: 'k5-overview'
  },

  // Sentry Error Tracking
  sentry: {
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1, // 10% of transactions
    profilesSampleRate: 0.1 // 10% profiling
  },

  // Logging Configuration
  logging: {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    destinations: ['console', 'file', 'cloudwatch'],
    retentionDays: 90,
    samplingRate: process.env.NODE_ENV === 'production' ? 0.01 : 1.0
  },

  // Alerting Configuration
  alerting: {
    enabled: true,
    channels: [
      {
        type: 'email',
        config: {
          recipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
          smtpHost: process.env.SMTP_HOST,
          smtpPort: parseInt(process.env.SMTP_PORT || '587'),
          from: process.env.ALERT_FROM_EMAIL
        }
      },
      {
        type: 'slack',
        config: {
          webhookUrl: process.env.SLACK_WEBHOOK_URL,
          channel: process.env.SLACK_ALERT_CHANNEL || '#k5-alerts',
          username: 'K5 Monitoring',
          iconEmoji: ':warning:'
        }
      },
      {
        type: 'pagerduty',
        config: {
          apiKey: process.env.PAGERDUTY_API_KEY,
          serviceId: process.env.PAGERDUTY_SERVICE_ID
        }
      }
    ],
    suppressionRules: [
      {
        pattern: 'high_cpu_usage',
        duration: 300 // 5 minutes
      },
      {
        pattern: 'cache_miss_rate',
        duration: 600 // 10 minutes
      }
    ]
  },

  // Privacy & Compliance (COPPA, GDPR)
  privacy: {
    coppaCompliant: true,
    dataRetentionDays: 90, // Comply with COPPA minimum
    anonymizeUserData: true,
    gdprCompliant: true
  }
};

// Metric Collection Intervals
export const metricIntervals = {
  performance: 10000, // 10 seconds
  business: 60000, // 1 minute
  cost: 300000, // 5 minutes
  quality: 60000, // 1 minute
  uptime: 30000 // 30 seconds
};

// Alert Thresholds
export const alertThresholds = {
  // Performance thresholds
  apiLatency: {
    warning: 500, // ms
    critical: 2000 // ms
  },
  apiErrorRate: {
    warning: 0.01, // 1%
    critical: 0.05 // 5%
  },
  cpuUsage: {
    warning: 70, // %
    critical: 90 // %
  },
  memoryUsage: {
    warning: 80, // %
    critical: 95 // %
  },
  diskUsage: {
    warning: 75, // %
    critical: 90 // %
  },

  // Database thresholds
  dbQueryTime: {
    warning: 100, // ms
    critical: 500 // ms
  },
  dbConnectionPool: {
    warning: 80, // % utilization
    critical: 95 // % utilization
  },

  // Cache thresholds
  cacheHitRate: {
    warning: 0.7, // 70%
    critical: 0.5 // 50%
  },

  // Cost thresholds
  dailyBudget: {
    warning: 0.8, // 80% of budget
    critical: 0.95 // 95% of budget
  },

  // Quality thresholds
  readabilityScore: {
    warning: 60,
    critical: 40
  },
  contentAccuracy: {
    warning: 0.8,
    critical: 0.6
  },

  // Uptime thresholds
  uptime: {
    warning: 0.999, // 99.9%
    critical: 0.99 // 99%
  },
  responseTime: {
    warning: 1000, // ms
    critical: 3000 // ms
  }
};

// Service Health Check Configuration
export const healthCheckConfig = {
  interval: 30000, // 30 seconds
  timeout: 5000, // 5 seconds
  retries: 3,
  services: [
    {
      name: 'api',
      url: process.env.API_URL || 'http://localhost:3001/health',
      critical: true
    },
    {
      name: 'database',
      url: process.env.DB_HEALTH_URL || 'http://localhost:5432/health',
      critical: true
    },
    {
      name: 'redis',
      url: process.env.REDIS_HEALTH_URL || 'http://localhost:6379/health',
      critical: true
    },
    {
      name: 'pdf-processor',
      url: process.env.PDF_PROCESSOR_URL || 'http://localhost:3002/health',
      critical: true
    },
    {
      name: 'llm-service',
      url: process.env.LLM_SERVICE_URL || 'http://localhost:3003/health',
      critical: true
    },
    {
      name: 'storage',
      url: process.env.STORAGE_HEALTH_URL || 'http://localhost:3004/health',
      critical: false
    }
  ]
};

// Dashboard Refresh Rates
export const dashboardRefreshRates = {
  realtime: 5000, // 5 seconds
  fast: 15000, // 15 seconds
  normal: 30000, // 30 seconds
  slow: 60000 // 1 minute
};

// Data Retention Policies
export const dataRetention = {
  rawMetrics: 7, // days
  aggregated1m: 30, // days
  aggregated5m: 90, // days
  aggregated1h: 365, // days
  logs: 90, // days
  traces: 7, // days
  incidents: 730 // days (2 years)
};

// Cost Optimization Settings
export const costOptimization = {
  autoScaling: {
    enabled: true,
    minInstances: 1,
    maxInstances: 10,
    targetCpuUtilization: 70,
    scaleUpThreshold: 80,
    scaleDownThreshold: 30
  },
  resourceLimits: {
    maxConcurrentRequests: 1000,
    maxQueueSize: 10000,
    requestTimeout: 30000,
    idleTimeout: 300000
  },
  budgetAlerts: [
    {
      threshold: 50, // % of budget
      severity: 'info'
    },
    {
      threshold: 80, // % of budget
      severity: 'warning'
    },
    {
      threshold: 95, // % of budget
      severity: 'critical'
    }
  ]
};

export default monitoringConfig;
