/**
 * Prometheus Metrics Client
 * Collects and exports metrics in Prometheus format
 */

import { Registry, Counter, Gauge, Histogram, Summary, collectDefaultMetrics } from 'prom-client';
import { MetricCategory } from '../types';

class PrometheusMetricsClient {
  private registry: Registry;
  private counters: Map<string, Counter>;
  private gauges: Map<string, Gauge>;
  private histograms: Map<string, Histogram>;
  private summaries: Map<string, Summary>;

  constructor() {
    this.registry = new Registry();
    this.counters = new Map();
    this.gauges = new Map();
    this.histograms = new Map();
    this.summaries = new Map();

    // Collect default Node.js metrics
    collectDefaultMetrics({ register: this.registry, prefix: 'k5_' });

    this.initializeMetrics();
  }

  /**
   * Initialize all custom metrics
   */
  private initializeMetrics(): void {
    // ========================================
    // API Metrics
    // ========================================
    this.createCounter('api_requests_total', 'Total API requests', ['method', 'endpoint', 'status']);
    this.createCounter('api_errors_total', 'Total API errors', ['method', 'endpoint', 'error_type']);
    this.createHistogram('api_request_duration_seconds', 'API request duration', ['method', 'endpoint'], {
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
    });
    this.createGauge('api_active_requests', 'Currently active API requests', ['endpoint']);

    // ========================================
    // PDF Processing Metrics
    // ========================================
    this.createCounter('pdf_processed_total', 'Total PDFs processed', ['status', 'grade_level']);
    this.createCounter('pdf_processing_errors_total', 'PDF processing errors', ['error_type', 'stage']);
    this.createHistogram('pdf_processing_duration_seconds', 'PDF processing time', ['grade_level', 'page_count'], {
      buckets: [1, 5, 10, 30, 60, 120, 300, 600]
    });
    this.createGauge('pdf_queue_size', 'PDF processing queue size', ['priority']);
    this.createCounter('pdf_pages_processed_total', 'Total PDF pages processed', ['grade_level']);

    // ========================================
    // LLM Metrics
    // ========================================
    this.createCounter('llm_requests_total', 'Total LLM requests', ['model', 'operation']);
    this.createCounter('llm_tokens_total', 'Total tokens used', ['model', 'type']); // type: input/output
    this.createHistogram('llm_request_duration_seconds', 'LLM request duration', ['model', 'operation'], {
      buckets: [0.5, 1, 2, 5, 10, 20, 30, 60]
    });
    this.createGauge('llm_token_cost_dollars', 'LLM token cost', ['model']);
    this.createCounter('llm_rate_limit_hits_total', 'LLM rate limit hits', ['model']);

    // ========================================
    // Database Metrics
    // ========================================
    this.createCounter('db_queries_total', 'Total database queries', ['operation', 'table']);
    this.createHistogram('db_query_duration_seconds', 'Database query duration', ['operation', 'table'], {
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
    });
    this.createGauge('db_connections_active', 'Active database connections', ['pool']);
    this.createGauge('db_connections_idle', 'Idle database connections', ['pool']);
    this.createCounter('db_connection_errors_total', 'Database connection errors', ['error_type']);

    // ========================================
    // Cache Metrics
    // ========================================
    this.createCounter('cache_operations_total', 'Total cache operations', ['operation', 'cache_type']);
    this.createCounter('cache_hits_total', 'Cache hits', ['cache_type', 'key_pattern']);
    this.createCounter('cache_misses_total', 'Cache misses', ['cache_type', 'key_pattern']);
    this.createGauge('cache_size_bytes', 'Cache size in bytes', ['cache_type']);
    this.createGauge('cache_items_count', 'Number of items in cache', ['cache_type']);
    this.createCounter('cache_evictions_total', 'Cache evictions', ['cache_type', 'reason']);

    // ========================================
    // Quality Metrics
    // ========================================
    this.createGauge('content_readability_score', 'Content readability score', ['grade_level', 'content_type']);
    this.createGauge('content_accuracy_score', 'Content accuracy score', ['subject', 'grade_level']);
    this.createGauge('vocabulary_level', 'Vocabulary level', ['grade_level']);
    this.createGauge('pedagogical_quality_score', 'Pedagogical quality score', ['content_type']);
    this.createGauge('engagement_score', 'Student engagement score', ['content_type', 'age_range']);

    // ========================================
    // User Activity Metrics (COPPA Compliant)
    // ========================================
    this.createCounter('user_sessions_total', 'Total user sessions', ['age_range', 'consent_type']);
    this.createHistogram('user_session_duration_seconds', 'User session duration', ['age_range'], {
      buckets: [60, 300, 600, 1800, 3600, 7200]
    });
    this.createCounter('user_interactions_total', 'User interactions', ['feature', 'age_range']);
    this.createGauge('active_users', 'Currently active users', ['age_range']);
    this.createCounter('content_views_total', 'Content views', ['content_type', 'grade_level']);

    // ========================================
    // Cost Metrics
    // ========================================
    this.createGauge('infrastructure_cost_dollars', 'Infrastructure cost', ['service', 'resource_type']);
    this.createGauge('llm_cost_dollars', 'LLM usage cost', ['model']);
    this.createGauge('storage_cost_dollars', 'Storage cost', ['storage_type']);
    this.createGauge('network_cost_dollars', 'Network transfer cost', ['direction']);
    this.createGauge('daily_budget_utilization', 'Daily budget utilization percentage', ['category']);

    // ========================================
    // System Health Metrics
    // ========================================
    this.createGauge('service_health_status', 'Service health status (1=healthy, 0=unhealthy)', ['service']);
    this.createHistogram('health_check_duration_seconds', 'Health check duration', ['service'], {
      buckets: [0.1, 0.5, 1, 2, 5]
    });
    this.createCounter('health_check_failures_total', 'Health check failures', ['service', 'reason']);
    this.createGauge('system_uptime_seconds', 'System uptime', ['service']);

    // ========================================
    // Resource Usage Metrics
    // ========================================
    this.createGauge('cpu_usage_percent', 'CPU usage percentage', ['service']);
    this.createGauge('memory_usage_bytes', 'Memory usage in bytes', ['service', 'type']);
    this.createGauge('disk_usage_bytes', 'Disk usage in bytes', ['service', 'mount_point']);
    this.createGauge('network_bandwidth_bytes', 'Network bandwidth usage', ['service', 'interface', 'direction']);

    // ========================================
    // Alert Metrics
    // ========================================
    this.createCounter('alerts_triggered_total', 'Total alerts triggered', ['severity', 'rule']);
    this.createGauge('alerts_active', 'Currently active alerts', ['severity']);
    this.createHistogram('alert_resolution_time_seconds', 'Alert resolution time', ['severity'], {
      buckets: [60, 300, 900, 1800, 3600, 7200, 14400]
    });

    // ========================================
    // Incident Metrics
    // ========================================
    this.createCounter('incidents_total', 'Total incidents', ['severity', 'service']);
    this.createGauge('incidents_active', 'Currently active incidents', ['severity']);
    this.createHistogram('incident_mttr_seconds', 'Mean time to resolution', ['severity'], {
      buckets: [300, 900, 1800, 3600, 7200, 14400, 28800, 86400]
    });
  }

  /**
   * Create a counter metric
   */
  private createCounter(name: string, help: string, labelNames: string[] = []): Counter {
    const counter = new Counter({
      name: `k5_${name}`,
      help,
      labelNames,
      registers: [this.registry]
    });
    this.counters.set(name, counter);
    return counter;
  }

  /**
   * Create a gauge metric
   */
  private createGauge(name: string, help: string, labelNames: string[] = []): Gauge {
    const gauge = new Gauge({
      name: `k5_${name}`,
      help,
      labelNames,
      registers: [this.registry]
    });
    this.gauges.set(name, gauge);
    return gauge;
  }

  /**
   * Create a histogram metric
   */
  private createHistogram(
    name: string,
    help: string,
    labelNames: string[] = [],
    options: { buckets?: number[] } = {}
  ): Histogram {
    const histogram = new Histogram({
      name: `k5_${name}`,
      help,
      labelNames,
      buckets: options.buckets,
      registers: [this.registry]
    });
    this.histograms.set(name, histogram);
    return histogram;
  }

  /**
   * Create a summary metric
   */
  private createSummary(name: string, help: string, labelNames: string[] = []): Summary {
    const summary = new Summary({
      name: `k5_${name}`,
      help,
      labelNames,
      registers: [this.registry]
    });
    this.summaries.set(name, summary);
    return summary;
  }

  /**
   * Get a counter metric
   */
  public getCounter(name: string): Counter | undefined {
    return this.counters.get(name);
  }

  /**
   * Get a gauge metric
   */
  public getGauge(name: string): Gauge | undefined {
    return this.gauges.get(name);
  }

  /**
   * Get a histogram metric
   */
  public getHistogram(name: string): Histogram | undefined {
    return this.histograms.get(name);
  }

  /**
   * Get metrics in Prometheus format
   */
  public async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Get metrics as JSON
   */
  public async getMetricsJSON(): Promise<any> {
    return this.registry.getMetricsAsJSON();
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.registry.clear();
  }

  /**
   * Get the registry
   */
  public getRegistry(): Registry {
    return this.registry;
  }
}

// Singleton instance
export const prometheusClient = new PrometheusMetricsClient();

// Helper functions for easy metric recording
export const metrics = {
  // API metrics
  recordApiRequest: (method: string, endpoint: string, status: number, duration: number) => {
    prometheusClient.getCounter('api_requests_total')?.inc({ method, endpoint, status: status.toString() });
    prometheusClient.getHistogram('api_request_duration_seconds')?.observe({ method, endpoint }, duration / 1000);
  },

  recordApiError: (method: string, endpoint: string, errorType: string) => {
    prometheusClient.getCounter('api_errors_total')?.inc({ method, endpoint, error_type: errorType });
  },

  setActiveRequests: (endpoint: string, count: number) => {
    prometheusClient.getGauge('api_active_requests')?.set({ endpoint }, count);
  },

  // PDF processing metrics
  recordPdfProcessed: (status: string, gradeLevel: string, duration: number, pageCount: number) => {
    prometheusClient.getCounter('pdf_processed_total')?.inc({ status, grade_level: gradeLevel });
    prometheusClient.getHistogram('pdf_processing_duration_seconds')?.observe(
      { grade_level: gradeLevel, page_count: pageCount.toString() },
      duration / 1000
    );
    prometheusClient.getCounter('pdf_pages_processed_total')?.inc({ grade_level: gradeLevel }, pageCount);
  },

  recordPdfError: (errorType: string, stage: string) => {
    prometheusClient.getCounter('pdf_processing_errors_total')?.inc({ error_type: errorType, stage });
  },

  setPdfQueueSize: (priority: string, size: number) => {
    prometheusClient.getGauge('pdf_queue_size')?.set({ priority }, size);
  },

  // LLM metrics
  recordLlmRequest: (model: string, operation: string, duration: number, inputTokens: number, outputTokens: number) => {
    prometheusClient.getCounter('llm_requests_total')?.inc({ model, operation });
    prometheusClient.getHistogram('llm_request_duration_seconds')?.observe({ model, operation }, duration / 1000);
    prometheusClient.getCounter('llm_tokens_total')?.inc({ model, type: 'input' }, inputTokens);
    prometheusClient.getCounter('llm_tokens_total')?.inc({ model, type: 'output' }, outputTokens);
  },

  setLlmCost: (model: string, cost: number) => {
    prometheusClient.getGauge('llm_token_cost_dollars')?.set({ model }, cost);
  },

  // Database metrics
  recordDbQuery: (operation: string, table: string, duration: number) => {
    prometheusClient.getCounter('db_queries_total')?.inc({ operation, table });
    prometheusClient.getHistogram('db_query_duration_seconds')?.observe({ operation, table }, duration / 1000);
  },

  setDbConnections: (pool: string, active: number, idle: number) => {
    prometheusClient.getGauge('db_connections_active')?.set({ pool }, active);
    prometheusClient.getGauge('db_connections_idle')?.set({ pool }, idle);
  },

  // Cache metrics
  recordCacheOperation: (operation: string, cacheType: string, hit: boolean, keyPattern: string) => {
    prometheusClient.getCounter('cache_operations_total')?.inc({ operation, cache_type: cacheType });
    if (hit) {
      prometheusClient.getCounter('cache_hits_total')?.inc({ cache_type: cacheType, key_pattern: keyPattern });
    } else {
      prometheusClient.getCounter('cache_misses_total')?.inc({ cache_type: cacheType, key_pattern: keyPattern });
    }
  },

  setCacheMetrics: (cacheType: string, sizeBytes: number, itemCount: number) => {
    prometheusClient.getGauge('cache_size_bytes')?.set({ cache_type: cacheType }, sizeBytes);
    prometheusClient.getGauge('cache_items_count')?.set({ cache_type: cacheType }, itemCount);
  },

  // Quality metrics
  setQualityMetrics: (gradeLevel: string, contentType: string, readability: number, accuracy: number) => {
    prometheusClient.getGauge('content_readability_score')?.set({ grade_level: gradeLevel, content_type: contentType }, readability);
    prometheusClient.getGauge('content_accuracy_score')?.set({ subject: contentType, grade_level: gradeLevel }, accuracy);
  },

  // User activity metrics (COPPA compliant)
  recordUserSession: (ageRange: string, consentType: string, duration: number) => {
    prometheusClient.getCounter('user_sessions_total')?.inc({ age_range: ageRange, consent_type: consentType });
    prometheusClient.getHistogram('user_session_duration_seconds')?.observe({ age_range: ageRange }, duration);
  },

  recordUserInteraction: (feature: string, ageRange: string) => {
    prometheusClient.getCounter('user_interactions_total')?.inc({ feature, age_range: ageRange });
  },

  setActiveUsers: (ageRange: string, count: number) => {
    prometheusClient.getGauge('active_users')?.set({ age_range: ageRange }, count);
  },

  // Cost metrics
  setCost: (service: string, resourceType: string, cost: number) => {
    prometheusClient.getGauge('infrastructure_cost_dollars')?.set({ service, resource_type: resourceType }, cost);
  },

  setBudgetUtilization: (category: string, percentage: number) => {
    prometheusClient.getGauge('daily_budget_utilization')?.set({ category }, percentage);
  },

  // Health metrics
  setServiceHealth: (service: string, isHealthy: boolean) => {
    prometheusClient.getGauge('service_health_status')?.set({ service }, isHealthy ? 1 : 0);
  },

  recordHealthCheck: (service: string, duration: number, success: boolean, reason?: string) => {
    prometheusClient.getHistogram('health_check_duration_seconds')?.observe({ service }, duration / 1000);
    if (!success && reason) {
      prometheusClient.getCounter('health_check_failures_total')?.inc({ service, reason });
    }
  },

  // Alert metrics
  recordAlert: (severity: string, rule: string) => {
    prometheusClient.getCounter('alerts_triggered_total')?.inc({ severity, rule });
  },

  setActiveAlerts: (severity: string, count: number) => {
    prometheusClient.getGauge('alerts_active')?.set({ severity }, count);
  },

  recordAlertResolution: (severity: string, duration: number) => {
    prometheusClient.getHistogram('alert_resolution_time_seconds')?.observe({ severity }, duration);
  },

  // Incident metrics
  recordIncident: (severity: string, service: string) => {
    prometheusClient.getCounter('incidents_total')?.inc({ severity, service });
  },

  setActiveIncidents: (severity: string, count: number) => {
    prometheusClient.getGauge('incidents_active')?.set({ severity }, count);
  },

  recordIncidentMTTR: (severity: string, duration: number) => {
    prometheusClient.getHistogram('incident_mttr_seconds')?.observe({ severity }, duration);
  }
};

export default prometheusClient;
