# K5 POC - Comprehensive Monitoring System

A production-ready monitoring, alerting, and observability platform for the K5 educational content system.

## 🎯 Features

### 1. Real-Time Metrics Collection (Prometheus)
- **System Metrics**: CPU, memory, disk, network
- **API Metrics**: Request rates, latency, error rates
- **PDF Processing**: Processing time, queue depth, quality scores
- **LLM Usage**: Token consumption, API latency, costs
- **Database**: Query performance, connection pools
- **Cache**: Hit rates, evictions, size
- **User Activity**: COPPA-compliant engagement metrics

### 2. Error Tracking (Sentry)
- Automatic error capture and grouping
- Performance profiling
- Distributed tracing
- COPPA-compliant user context (no PII)
- Custom error categorization
- Source map support

### 3. Alert Management
- Rule-based alerting with customizable thresholds
- Multi-channel notifications (Email, Slack, PagerDuty, Webhook)
- Alert suppression and escalation
- Automatic alert resolution
- Alert history and statistics

### 4. Health Monitoring
- Service health checks
- Dependency health tracking
- Readiness/liveness probes
- Automated health status updates
- Critical service monitoring

### 5. Log Aggregation
- Centralized log collection
- Structured logging
- Log querying and analysis
- Error pattern detection
- Log retention policies
- Export to CloudWatch/Elasticsearch

### 6. Uptime Monitoring
- HTTP endpoint monitoring
- Response time tracking
- SLA calculation
- Incident detection
- Historical uptime statistics
- Multi-region checks

### 7. Incident Management
- Automated incident detection
- Incident response workflows
- Status page integration
- Root cause analysis
- Post-mortem tracking
- MTTR calculation

### 8. Cost Tracking & Optimization
- Real-time cost monitoring
- Budget alerts
- Cost breakdown by service
- Optimization recommendations
- Cost forecasting
- Resource utilization tracking

### 9. Grafana Dashboards
- System overview dashboard
- PDF processing dashboard
- LLM usage & costs dashboard
- Database performance dashboard
- Cache performance dashboard
- User activity dashboard (COPPA compliant)

## 📦 Installation

```bash
npm install prom-client @sentry/node @sentry/profiling-node uuid
```

## 🚀 Quick Start

### Initialize Monitoring

```typescript
import { initializeMonitoring, shutdownMonitoring } from './monitoring';

// Initialize on startup
await initializeMonitoring({
  enableMetrics: true,
  enableHealthChecks: true,
  enableUptime: true,
  enableCostTracking: true
});

// Shutdown gracefully
process.on('SIGTERM', async () => {
  await shutdownMonitoring();
  process.exit(0);
});
```

### Express Integration

```typescript
import express from 'express';
import monitoring, { createMonitoringRoutes, sentryMiddleware } from './monitoring';

const app = express();

// Add Sentry request handler (must be first)
app.use(sentryMiddleware.requestHandler());
app.use(sentryMiddleware.tracingHandler());

// Monitoring endpoints
const routes = createMonitoringRoutes();
app.get('/health', routes.health);
app.get('/ready', routes.ready);
app.get('/alive', routes.alive);
app.get('/metrics', routes.metrics);
app.get('/api/monitoring/status', routes.status);
app.get('/api/monitoring/alerts', routes.alerts);
app.get('/api/monitoring/incidents', routes.incidents);
app.get('/api/monitoring/costs', routes.costs);

// Add Sentry error handler (must be last)
app.use(sentryMiddleware.errorHandler());
```

### Record Metrics

```typescript
import { metrics } from './monitoring';

// API request
metrics.recordApiRequest('GET', '/api/content', 200, 150);

// PDF processing
metrics.recordPdfProcessed('success', 'K-2', 5000, 10);

// LLM request
metrics.recordLlmRequest('gpt-4', 'completion', 2000, 500, 150);

// Database query
metrics.recordDbQuery('SELECT', 'content', 50);

// Cache operation
metrics.recordCacheOperation('get', 'redis', true, 'content:*');

// Quality metrics
metrics.setQualityMetrics('K-2', 'reading', 85, 0.92);

// User activity (COPPA compliant)
metrics.recordUserSession('under13', 'parental', 1800);
```

### Error Tracking

```typescript
import { errorTracking, logger } from './monitoring';

// Track API error
try {
  // ... API call
} catch (error) {
  errorTracking.trackApiError(error, {
    method: 'GET',
    url: '/api/content',
    statusCode: 500
  });
}

// Track processing error
try {
  // ... PDF processing
} catch (error) {
  errorTracking.trackProcessingError(error, {
    stage: 'extraction',
    contentType: 'pdf',
    gradeLevel: 'K-2'
  });
}

// Structured logging
logger.info('PDF processing started', {
  pdfId: '123',
  gradeLevel: 'K-2',
  pageCount: 10
});

logger.error('PDF processing failed', error, {
  pdfId: '123',
  stage: 'extraction'
});
```

### Alert Management

```typescript
import { alertManager } from './monitoring';

// Add custom alert rule
alertManager.addRule({
  id: 'custom-alert',
  name: 'Custom Alert',
  description: 'Custom alert condition',
  severity: 'warning',
  metric: 'custom_metric',
  operator: 'gt',
  threshold: 100,
  duration: 60,
  notificationChannels: ['slack'],
  autoResolve: true,
  enabled: true,
  tags: ['custom'],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Evaluate metric
await alertManager.evaluateMetric('custom_metric', 150);

// Get active alerts
const alerts = alertManager.getActiveAlerts('critical');

// Acknowledge alert
alertManager.acknowledgeAlert('alert-id', 'user@example.com');

// Manually resolve alert
alertManager.manuallyResolveAlert('alert-id', 'user@example.com', 'Fixed by restarting service');
```

### Incident Management

```typescript
import { incidentManager } from './monitoring';

// Create incident
const incident = await incidentManager.createIncident({
  title: 'API Gateway Down',
  description: 'API gateway returning 503 errors',
  severity: 'sev1',
  affectedServices: ['api-gateway', 'pdf-processor'],
  affectedUsers: 1000,
  tags: ['api', 'outage']
});

// Update status
incidentManager.updateIncidentStatus(
  incident.id,
  'investigating',
  'Engineering team investigating root cause',
  'oncall@example.com'
});

// Set root cause
incidentManager.setRootCause(
  incident.id,
  'Database connection pool exhausted',
  'oncall@example.com'
);

// Resolve incident
incidentManager.setResolution(
  incident.id,
  'Increased connection pool size from 10 to 50',
  'oncall@example.com'
);

// Add action item
incidentManager.addActionItem(
  incident.id,
  'Set up connection pool monitoring',
  'sre@example.com',
  new Date('2025-11-01')
);
```

### Cost Tracking

```typescript
import { costTracker } from './monitoring';

// Get current costs
const costs = costTracker.getCurrentCosts();
console.log('Current spend:', costs?.currentSpend);
console.log('Projected spend:', costs?.projectedSpend);

// Get cost breakdown
const breakdown = costTracker.getCostBreakdown();
breakdown.forEach(item => {
  console.log(`${item.category}: $${item.amount.toFixed(2)} (${item.percentage.toFixed(1)}%)`);
});

// Get cost forecast
const forecast = costTracker.getCostForecast(7);
forecast.forEach(day => {
  console.log(`${day.date.toISOString()}: $${day.projected.toFixed(2)}`);
});

// Get cost report
const report = costTracker.getCostReport(
  new Date('2025-10-01'),
  new Date('2025-10-31')
);
console.log('Total cost:', report.totalCost);
console.log('Optimization recommendations:', report.recommendations);
```

## 📊 Grafana Dashboards

### Setup

1. **Import Dashboards**:
```bash
# Import dashboard JSON
cat src/monitoring/dashboards/grafana-dashboards.json | \
  curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GRAFANA_API_KEY}" \
  ${GRAFANA_URL}/api/dashboards/db \
  -d @-
```

2. **Configure Data Source**:
```json
{
  "name": "Prometheus",
  "type": "prometheus",
  "url": "http://prometheus:9090",
  "access": "proxy",
  "isDefault": true
}
```

### Available Dashboards

1. **K5 System Overview**: High-level system health and performance
2. **PDF Processing**: PDF pipeline metrics and quality
3. **LLM Usage & Costs**: AI API usage and cost tracking
4. **Database Performance**: Query performance and connections
5. **Cache Performance**: Hit rates and efficiency
6. **User Activity**: COPPA-compliant engagement metrics

## 🔒 COPPA Compliance

All user activity tracking is COPPA compliant:

- **No PII Collection**: User IDs are anonymized (hashed)
- **Age Ranges Only**: No birth dates stored (under13, 13-17, 18plus)
- **Consent Tracking**: Parental consent flags
- **Data Retention**: Configurable retention periods
- **Minimal Data**: Only essential engagement metrics

### User Activity Tracking

```typescript
import { metrics } from './monitoring';

// Correct: COPPA compliant
metrics.recordUserSession('under13', 'parental', 1800);
metrics.recordUserInteraction('reading-tool', 'under13');
metrics.setActiveUsers('under13', 25);

// NEVER do this (COPPA violation):
// - Store email addresses
// - Store names
// - Store birth dates
// - Track users under 13 without parental consent
```

## 🔧 Configuration

### Environment Variables

```bash
# Prometheus
PROMETHEUS_ENDPOINT=http://prometheus:9090

# Grafana
GRAFANA_URL=http://grafana:3000
GRAFANA_API_KEY=your_api_key

# Sentry
SENTRY_DSN=https://your_sentry_dsn
SENTRY_ENVIRONMENT=production

# Logging
LOG_LEVEL=info

# Alerting
ALERT_EMAIL_RECIPIENTS=oncall@example.com,sre@example.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_ALERT_CHANNEL=#k5-alerts
PAGERDUTY_API_KEY=your_api_key
PAGERDUTY_SERVICE_ID=your_service_id

# Budgets
DAILY_BUDGET=100
MONTHLY_BUDGET=3000

# Health Checks
API_URL=http://api:3001
DB_HEALTH_URL=http://db:5432/health
```

## 📈 Metrics Reference

### API Metrics
- `k5_api_requests_total`: Total API requests
- `k5_api_errors_total`: Total API errors
- `k5_api_request_duration_seconds`: API request duration histogram
- `k5_api_active_requests`: Currently active API requests

### PDF Processing Metrics
- `k5_pdf_processed_total`: Total PDFs processed
- `k5_pdf_processing_errors_total`: PDF processing errors
- `k5_pdf_processing_duration_seconds`: Processing duration histogram
- `k5_pdf_queue_size`: PDF processing queue size
- `k5_pdf_pages_processed_total`: Total PDF pages processed

### LLM Metrics
- `k5_llm_requests_total`: Total LLM requests
- `k5_llm_tokens_total`: Total tokens used
- `k5_llm_request_duration_seconds`: LLM request duration
- `k5_llm_token_cost_dollars`: LLM token cost
- `k5_llm_rate_limit_hits_total`: Rate limit hits

### Quality Metrics
- `k5_content_readability_score`: Content readability score
- `k5_content_accuracy_score`: Content accuracy score
- `k5_vocabulary_level`: Vocabulary level
- `k5_pedagogical_quality_score`: Pedagogical quality
- `k5_engagement_score`: Student engagement score

### Cost Metrics
- `k5_infrastructure_cost_dollars`: Infrastructure cost
- `k5_llm_cost_dollars`: LLM usage cost
- `k5_storage_cost_dollars`: Storage cost
- `k5_daily_budget_utilization`: Budget utilization percentage

## 🚨 Alert Rules

### Default Alert Rules

1. **High API Latency**: API response > 500ms for 60s
2. **Critical API Latency**: API response > 2000ms for 30s
3. **High API Error Rate**: Error rate > 1% for 120s
4. **High CPU Usage**: CPU > 70% for 300s
5. **Critical Memory Usage**: Memory > 95% for 60s
6. **Slow Database Queries**: Query time > 100ms for 180s
7. **Low Cache Hit Rate**: Hit rate < 70% for 300s
8. **Budget Warning**: Budget utilization > 80%
9. **Low Content Quality**: Readability < 60
10. **Service Unhealthy**: Health check failing for 30s

## 📝 Best Practices

### 1. Metrics
- Use appropriate metric types (counter, gauge, histogram)
- Add meaningful labels
- Keep cardinality low
- Use consistent naming

### 2. Logging
- Use structured logging
- Include context in logs
- Set appropriate log levels
- Don't log sensitive data

### 3. Alerts
- Set realistic thresholds
- Avoid alert fatigue
- Document alert runbooks
- Test alert workflows

### 4. Incidents
- Document thoroughly
- Track action items
- Conduct post-mortems
- Learn from incidents

### 5. Costs
- Review cost reports regularly
- Implement recommendations
- Set budget alerts
- Track cost trends

## 🔍 Troubleshooting

### High Memory Usage
```typescript
// Check metrics collector
const status = metricsCollector.getStatus();
console.log('Collector status:', status);

// Clear old metrics
prometheusClient.clear();
```

### Missing Metrics
```typescript
// Verify metrics are being recorded
const metricsJSON = await prometheusClient.getMetricsJSON();
console.log('Available metrics:', metricsJSON);
```

### Alert Not Triggering
```typescript
// Check alert rules
const rule = alertManager.getRule('rule-id');
console.log('Rule config:', rule);

// Check metric value
await alertManager.evaluateMetric('metric_name', value);
```

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [COPPA Compliance Guide](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review metric definitions
3. Examine alert configurations
4. Check logs for error messages

## 📄 License

Part of the K5 POC project.
