/**
 * K5 POC Monitoring System - Type Definitions
 * Comprehensive monitoring types for metrics, alerts, and dashboards
 */

// ============================================================================
// Metric Types
// ============================================================================

export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary'
}

export enum MetricCategory {
  PERFORMANCE = 'performance',
  BUSINESS = 'business',
  TECHNICAL = 'technical',
  SECURITY = 'security',
  COST = 'cost',
  USER_ACTIVITY = 'user_activity',
  QUALITY = 'quality',
  AVAILABILITY = 'availability'
}

export interface MetricLabel {
  name: string;
  value: string;
}

export interface MetricValue {
  value: number;
  timestamp: Date;
  labels?: MetricLabel[];
}

export interface Metric {
  name: string;
  type: MetricType;
  category: MetricCategory;
  description: string;
  unit?: string;
  values: MetricValue[];
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

// ============================================================================
// Performance Metrics
// ============================================================================

export interface PerformanceMetrics {
  // Processing metrics
  processingTime: number;
  tokensProcessed: number;
  throughput: number;
  queueDepth: number;

  // API metrics
  apiLatency: number;
  apiErrorRate: number;
  apiRequestRate: number;
  apiSuccessRate: number;

  // Resource metrics
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkBandwidth: number;

  // Database metrics
  dbQueryTime: number;
  dbConnectionPool: number;
  dbActiveConnections: number;
  dbSlowQueries: number;

  // Cache metrics
  cacheHitRate: number;
  cacheMissRate: number;
  cacheSize: number;
  cacheEvictions: number;

  timestamp: Date;
}

// ============================================================================
// Educational & Quality Metrics
// ============================================================================

export interface QualityMetrics {
  readabilityScore: number;
  vocabularyLevel: number;
  gradeLevel: string;
  contentAccuracy: number;
  pedagogicalQuality: number;
  engagementScore: number;
  adaptationEffectiveness: number;
  assessmentId?: string;
  contentId?: string;
  timestamp: Date;
}

export interface EducationalMetrics {
  totalLearners: number;
  activeLearners: number;
  averageSessionDuration: number;
  completionRate: number;
  progressionRate: number;
  retentionRate: number;
  satisfactionScore: number;
  learningGains: number;
  timestamp: Date;
}

// ============================================================================
// User Activity Metrics (COPPA Compliant)
// ============================================================================

export interface UserActivityMetrics {
  // Anonymized user metrics
  sessionId: string; // No PII
  sessionDuration: number;
  pagesViewed: number;
  actionsPerformed: number;
  contentInteractions: number;

  // Behavioral metrics (aggregated)
  averageEngagementTime: number;
  featureUsage: Record<string, number>;
  errorEncounters: number;

  // Age-appropriate flags (no birth dates stored)
  ageRange: 'under13' | '13-17' | '18plus'; // COPPA compliance
  parentalConsentFlag?: boolean;

  // Content interaction (anonymized)
  contentCategories: string[];
  difficultyLevels: string[];

  timestamp: Date;

  // COPPA compliance metadata
  dataRetentionDate: Date;
  consentType: 'parental' | 'self' | 'none';
  privacyLevel: 'minimal' | 'standard' | 'enhanced';
}

// ============================================================================
// Cost Tracking
// ============================================================================

export interface CostMetrics {
  // Infrastructure costs
  computeCost: number;
  storageCost: number;
  networkCost: number;
  databaseCost: number;

  // AI/ML costs
  llmTokenCost: number;
  embeddingCost: number;
  inferenceTime: number;

  // Resource allocation
  resourceUtilization: number;
  wastedResources: number;
  optimizationPotential: number;

  // Budget tracking
  dailyBudget: number;
  currentSpend: number;
  projectedSpend: number;
  budgetVariance: number;

  timestamp: Date;
  billingPeriod: string;
}

// ============================================================================
// Alert Definitions
// ============================================================================

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SUPPRESSED = 'suppressed'
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;

  // Condition
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
  threshold: number;
  duration?: number; // Alert if condition persists for X seconds

  // Actions
  notificationChannels: string[];
  autoResolve: boolean;
  escalationPolicy?: string;

  // Metadata
  enabled: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: AlertSeverity;
  status: AlertStatus;

  title: string;
  description: string;
  metric: string;
  currentValue: number;
  threshold: number;

  // Timing
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  duration?: number;

  // Context
  labels: MetricLabel[];
  annotations: Record<string, string>;

  // Response tracking
  acknowledgedBy?: string;
  resolvedBy?: string;
  incidentId?: string;
  runbookUrl?: string;
}

// ============================================================================
// Health Check
// ============================================================================

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown'
}

export interface ServiceHealth {
  serviceName: string;
  status: HealthStatus;
  lastCheck: Date;
  responseTime: number;

  // Component health
  components: {
    name: string;
    status: HealthStatus;
    message?: string;
  }[];

  // Dependencies
  dependencies: {
    name: string;
    status: HealthStatus;
    latency: number;
  }[];

  // Metadata
  version: string;
  uptime: number;
  environment: string;
}

export interface SystemHealth {
  overall: HealthStatus;
  services: ServiceHealth[];
  timestamp: Date;
  aggregatedMetrics: {
    totalServices: number;
    healthyServices: number;
    degradedServices: number;
    unhealthyServices: number;
  };
}

// ============================================================================
// Log Aggregation
// ============================================================================

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  service: string;
  message: string;

  // Context
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  // Tracing
  traceId?: string;
  spanId?: string;
  userId?: string; // Anonymized
  sessionId?: string;

  // Metadata
  environment: string;
  version: string;
  host: string;
  labels?: Record<string, string>;
}

export interface LogQuery {
  startTime: Date;
  endTime: Date;
  levels?: LogLevel[];
  services?: string[];
  searchTerm?: string;
  traceId?: string;
  limit?: number;
  offset?: number;
}

export interface LogAnalysis {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  errorRate: number;
  topErrors: Array<{
    error: string;
    count: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    timestamp: Date;
    count: number;
    level: LogLevel;
  }>;
}

// ============================================================================
// Incident Management
// ============================================================================

export enum IncidentSeverity {
  SEV1 = 'sev1', // Critical - Complete outage
  SEV2 = 'sev2', // High - Major functionality affected
  SEV3 = 'sev3', // Medium - Minor functionality affected
  SEV4 = 'sev4'  // Low - Minimal impact
}

export enum IncidentStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  IDENTIFIED = 'identified',
  MONITORING = 'monitoring',
  RESOLVED = 'resolved',
  POSTMORTEM = 'postmortem'
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;

  // Timing
  detectedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  duration?: number;
  mttr?: number; // Mean Time To Resolution

  // Impact
  affectedServices: string[];
  affectedUsers?: number;
  impactDescription: string;

  // Response
  assignedTo?: string[];
  alerts: string[]; // Alert IDs
  rootCause?: string;
  resolution?: string;

  // Communication
  statusUpdates: Array<{
    timestamp: Date;
    status: IncidentStatus;
    message: string;
    author: string;
  }>;

  // Follow-up
  postmortemUrl?: string;
  actionItems?: Array<{
    description: string;
    assignee: string;
    dueDate: Date;
    completed: boolean;
  }>;

  tags: string[];
  metadata: Record<string, any>;
}

// ============================================================================
// Dashboard Configuration
// ============================================================================

export interface DashboardPanel {
  id: string;
  title: string;
  type: 'graph' | 'stat' | 'table' | 'heatmap' | 'gauge' | 'log';

  // Data source
  queries: Array<{
    metric: string;
    aggregation?: string;
    filters?: MetricLabel[];
    timeRange?: string;
  }>;

  // Visualization
  visualization: {
    yAxis?: string;
    xAxis?: string;
    legend?: boolean;
    colors?: string[];
    thresholds?: Array<{ value: number; color: string }>;
  };

  // Layout
  position: { x: number; y: number; w: number; h: number };

  // Alerts
  alertRules?: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];

  // Configuration
  panels: DashboardPanel[];
  variables?: Record<string, string>;
  timeRange: {
    from: string;
    to: string;
    refresh?: string;
  };

  // Access control
  public: boolean;
  ownerId: string;
  sharedWith?: string[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// ============================================================================
// Uptime Monitoring
// ============================================================================

export interface UptimeCheck {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'HEAD';
  interval: number; // seconds
  timeout: number;

  // Expected response
  expectedStatusCode?: number;
  expectedBody?: string;
  expectedHeaders?: Record<string, string>;

  // Retry configuration
  retryCount: number;
  retryInterval: number;

  // Alerting
  alertOnFailure: boolean;
  alertChannels: string[];

  enabled: boolean;
}

export interface UptimeResult {
  checkId: string;
  timestamp: Date;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;

  // Detailed metrics
  dnsLookup?: number;
  tcpConnection?: number;
  tlsHandshake?: number;
  serverProcessing?: number;
  contentTransfer?: number;
}

export interface UptimeStats {
  checkId: string;
  timeRange: { from: Date; to: Date };

  uptime: number; // percentage
  downtime: number; // seconds
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;

  // Performance
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;

  // Incidents
  incidents: Array<{
    startTime: Date;
    endTime?: Date;
    duration: number;
    reason: string;
  }>;
}

// ============================================================================
// Monitoring Configuration
// ============================================================================

export interface MonitoringConfig {
  // Prometheus
  prometheus: {
    enabled: boolean;
    endpoint: string;
    scrapeInterval: number;
    retention: string;
  };

  // Grafana
  grafana: {
    enabled: boolean;
    url: string;
    apiKey: string;
    defaultDashboard: string;
  };

  // Sentry
  sentry: {
    enabled: boolean;
    dsn: string;
    environment: string;
    tracesSampleRate: number;
    profilesSampleRate?: number;
  };

  // Log aggregation
  logging: {
    level: LogLevel;
    destinations: Array<'console' | 'file' | 'cloudwatch' | 'elasticsearch'>;
    retentionDays: number;
    samplingRate?: number;
  };

  // Alerting
  alerting: {
    enabled: boolean;
    channels: Array<{
      type: 'email' | 'slack' | 'pagerduty' | 'webhook';
      config: Record<string, any>;
    }>;
    suppressionRules?: Array<{
      pattern: string;
      duration: number;
    }>;
  };

  // Privacy & Compliance
  privacy: {
    coppaCompliant: boolean;
    dataRetentionDays: number;
    anonymizeUserData: boolean;
    gdprCompliant: boolean;
  };
}

// ============================================================================
// Export all types
// ============================================================================

export type {
  MetricLabel,
  MetricValue,
  Metric,
  PerformanceMetrics,
  QualityMetrics,
  EducationalMetrics,
  UserActivityMetrics,
  CostMetrics,
  AlertRule,
  Alert,
  ServiceHealth,
  SystemHealth,
  LogEntry,
  LogQuery,
  LogAnalysis,
  Incident,
  DashboardPanel,
  Dashboard,
  UptimeCheck,
  UptimeResult,
  UptimeStats,
  MonitoringConfig
};
