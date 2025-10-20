/**
 * Alert Manager
 * Manages alert rules, triggers, and notifications
 */

import { EventEmitter } from 'events';
import { Alert, AlertRule, AlertSeverity, AlertStatus, MetricLabel } from '../types';
import { alertThresholds } from '../config/monitoring.config';
import { v4 as uuidv4 } from 'uuid';

interface NotificationChannel {
  type: 'email' | 'slack' | 'pagerduty' | 'webhook';
  config: Record<string, any>;
  send: (alert: Alert) => Promise<void>;
}

class AlertManager extends EventEmitter {
  private rules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private alertHistory: Alert[] = [];
  private suppressedAlerts: Set<string> = new Set();

  constructor() {
    super();
    this.initializeDefaultRules();
    this.initializeChannels();
  }

  /**
   * Initialize default alert rules based on thresholds
   */
  private initializeDefaultRules(): void {
    // API Performance Alerts
    this.addRule({
      id: 'api_latency_high',
      name: 'High API Latency',
      description: 'API response time exceeds threshold',
      severity: AlertSeverity.WARNING,
      metric: 'api_request_duration_seconds',
      operator: 'gt',
      threshold: alertThresholds.apiLatency.warning / 1000,
      duration: 60,
      notificationChannels: ['slack', 'email'],
      autoResolve: true,
      enabled: true,
      tags: ['performance', 'api'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.addRule({
      id: 'api_latency_critical',
      name: 'Critical API Latency',
      description: 'API response time critically high',
      severity: AlertSeverity.CRITICAL,
      metric: 'api_request_duration_seconds',
      operator: 'gt',
      threshold: alertThresholds.apiLatency.critical / 1000,
      duration: 30,
      notificationChannels: ['pagerduty', 'slack', 'email'],
      autoResolve: true,
      escalationPolicy: 'engineering-oncall',
      enabled: true,
      tags: ['performance', 'api', 'critical'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Error Rate Alerts
    this.addRule({
      id: 'api_error_rate_high',
      name: 'High API Error Rate',
      description: 'API error rate exceeds acceptable threshold',
      severity: AlertSeverity.ERROR,
      metric: 'api_error_rate',
      operator: 'gt',
      threshold: alertThresholds.apiErrorRate.warning,
      duration: 120,
      notificationChannels: ['slack', 'email'],
      autoResolve: true,
      enabled: true,
      tags: ['reliability', 'api'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Resource Usage Alerts
    this.addRule({
      id: 'cpu_usage_high',
      name: 'High CPU Usage',
      description: 'CPU usage exceeds threshold',
      severity: AlertSeverity.WARNING,
      metric: 'cpu_usage_percent',
      operator: 'gt',
      threshold: alertThresholds.cpuUsage.warning,
      duration: 300,
      notificationChannels: ['slack'],
      autoResolve: true,
      enabled: true,
      tags: ['resource', 'infrastructure'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.addRule({
      id: 'memory_usage_critical',
      name: 'Critical Memory Usage',
      description: 'Memory usage critically high',
      severity: AlertSeverity.CRITICAL,
      metric: 'memory_usage_percent',
      operator: 'gt',
      threshold: alertThresholds.memoryUsage.critical,
      duration: 60,
      notificationChannels: ['pagerduty', 'slack'],
      autoResolve: true,
      escalationPolicy: 'sre-oncall',
      enabled: true,
      tags: ['resource', 'infrastructure', 'critical'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Database Alerts
    this.addRule({
      id: 'db_query_slow',
      name: 'Slow Database Queries',
      description: 'Database query time exceeds threshold',
      severity: AlertSeverity.WARNING,
      metric: 'db_query_duration_seconds',
      operator: 'gt',
      threshold: alertThresholds.dbQueryTime.warning / 1000,
      duration: 180,
      notificationChannels: ['slack'],
      autoResolve: true,
      enabled: true,
      tags: ['performance', 'database'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Cache Alerts
    this.addRule({
      id: 'cache_hit_rate_low',
      name: 'Low Cache Hit Rate',
      description: 'Cache hit rate below optimal threshold',
      severity: AlertSeverity.WARNING,
      metric: 'cache_hit_rate',
      operator: 'lt',
      threshold: alertThresholds.cacheHitRate.warning,
      duration: 300,
      notificationChannels: ['slack'],
      autoResolve: true,
      enabled: true,
      tags: ['performance', 'cache'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Cost Alerts
    this.addRule({
      id: 'budget_warning',
      name: 'Budget Usage Warning',
      description: 'Daily budget utilization approaching limit',
      severity: AlertSeverity.WARNING,
      metric: 'daily_budget_utilization',
      operator: 'gt',
      threshold: alertThresholds.dailyBudget.warning,
      duration: 0,
      notificationChannels: ['email', 'slack'],
      autoResolve: false,
      enabled: true,
      tags: ['cost', 'budget'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Quality Alerts
    this.addRule({
      id: 'content_quality_low',
      name: 'Low Content Quality',
      description: 'Content readability score below acceptable threshold',
      severity: AlertSeverity.WARNING,
      metric: 'content_readability_score',
      operator: 'lt',
      threshold: alertThresholds.readabilityScore.warning,
      duration: 0,
      notificationChannels: ['slack'],
      autoResolve: false,
      enabled: true,
      tags: ['quality', 'content'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Service Health Alerts
    this.addRule({
      id: 'service_unhealthy',
      name: 'Service Unhealthy',
      description: 'Critical service health check failing',
      severity: AlertSeverity.CRITICAL,
      metric: 'service_health_status',
      operator: 'eq',
      threshold: 0,
      duration: 30,
      notificationChannels: ['pagerduty', 'slack', 'email'],
      autoResolve: true,
      escalationPolicy: 'sre-oncall',
      enabled: true,
      tags: ['availability', 'service', 'critical'],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Initialize notification channels
   */
  private initializeChannels(): void {
    // Email channel
    this.channels.set('email', {
      type: 'email',
      config: {},
      send: async (alert: Alert) => {
        console.log(`[EMAIL] Sending alert: ${alert.title}`);
        // Implementation would integrate with email service
      }
    });

    // Slack channel
    this.channels.set('slack', {
      type: 'slack',
      config: {},
      send: async (alert: Alert) => {
        console.log(`[SLACK] Sending alert: ${alert.title}`);
        // Implementation would integrate with Slack API
      }
    });

    // PagerDuty channel
    this.channels.set('pagerduty', {
      type: 'pagerduty',
      config: {},
      send: async (alert: Alert) => {
        console.log(`[PAGERDUTY] Sending alert: ${alert.title}`);
        // Implementation would integrate with PagerDuty API
      }
    });

    // Webhook channel
    this.channels.set('webhook', {
      type: 'webhook',
      config: {},
      send: async (alert: Alert) => {
        console.log(`[WEBHOOK] Sending alert: ${alert.title}`);
        // Implementation would send HTTP POST to webhook URL
      }
    });
  }

  /**
   * Add an alert rule
   */
  public addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    this.emit('rule:added', rule);
  }

  /**
   * Remove an alert rule
   */
  public removeRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      this.rules.delete(ruleId);
      this.emit('rule:removed', rule);
    }
  }

  /**
   * Update an alert rule
   */
  public updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      const updatedRule = { ...rule, ...updates, updatedAt: new Date() };
      this.rules.set(ruleId, updatedRule);
      this.emit('rule:updated', updatedRule);
    }
  }

  /**
   * Get all alert rules
   */
  public getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get a specific rule
   */
  public getRule(ruleId: string): AlertRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Evaluate a metric value against all applicable rules
   */
  public async evaluateMetric(
    metricName: string,
    value: number,
    labels?: MetricLabel[]
  ): Promise<void> {
    const applicableRules = Array.from(this.rules.values()).filter(
      rule => rule.enabled && rule.metric === metricName
    );

    for (const rule of applicableRules) {
      const triggered = this.evaluateRule(rule, value);

      if (triggered) {
        await this.triggerAlert(rule, value, labels);
      } else {
        await this.resolveAlert(rule.id);
      }
    }
  }

  /**
   * Evaluate a single rule against a value
   */
  private evaluateRule(rule: AlertRule, value: number): boolean {
    switch (rule.operator) {
      case 'gt':
        return value > rule.threshold;
      case 'gte':
        return value >= rule.threshold;
      case 'lt':
        return value < rule.threshold;
      case 'lte':
        return value <= rule.threshold;
      case 'eq':
        return value === rule.threshold;
      case 'ne':
        return value !== rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Trigger an alert
   */
  private async triggerAlert(
    rule: AlertRule,
    currentValue: number,
    labels?: MetricLabel[]
  ): Promise<void> {
    // Check if alert is suppressed
    if (this.suppressedAlerts.has(rule.id)) {
      return;
    }

    // Check if alert already exists
    const existingAlert = this.activeAlerts.get(rule.id);
    if (existingAlert && existingAlert.status === AlertStatus.ACTIVE) {
      return; // Alert already active
    }

    // Create new alert
    const alert: Alert = {
      id: uuidv4(),
      ruleId: rule.id,
      severity: rule.severity,
      status: AlertStatus.ACTIVE,
      title: rule.name,
      description: rule.description,
      metric: rule.metric,
      currentValue,
      threshold: rule.threshold,
      triggeredAt: new Date(),
      labels: labels || [],
      annotations: {
        runbookUrl: this.getRunbookUrl(rule.id)
      }
    };

    // Store alert
    this.activeAlerts.set(rule.id, alert);
    this.alertHistory.push(alert);

    // Emit event
    this.emit('alert:triggered', alert);

    // Send notifications
    await this.sendNotifications(alert, rule.notificationChannels);
  }

  /**
   * Resolve an alert
   */
  private async resolveAlert(ruleId: string): Promise<void> {
    const alert = this.activeAlerts.get(ruleId);

    if (!alert || alert.status !== AlertStatus.ACTIVE) {
      return;
    }

    const rule = this.rules.get(ruleId);
    if (!rule || !rule.autoResolve) {
      return;
    }

    // Update alert status
    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();
    alert.duration = alert.resolvedAt.getTime() - alert.triggeredAt.getTime();

    // Remove from active alerts
    this.activeAlerts.delete(ruleId);

    // Emit event
    this.emit('alert:resolved', alert);

    // Send resolution notification
    await this.sendResolutionNotification(alert);
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    for (const [ruleId, alert] of this.activeAlerts.entries()) {
      if (alert.id === alertId) {
        alert.status = AlertStatus.ACKNOWLEDGED;
        alert.acknowledgedAt = new Date();
        alert.acknowledgedBy = acknowledgedBy;
        this.emit('alert:acknowledged', alert);
        break;
      }
    }
  }

  /**
   * Manually resolve an alert
   */
  public manuallyResolveAlert(alertId: string, resolvedBy: string, resolution: string): void {
    for (const [ruleId, alert] of this.activeAlerts.entries()) {
      if (alert.id === alertId) {
        alert.status = AlertStatus.RESOLVED;
        alert.resolvedAt = new Date();
        alert.resolvedBy = resolvedBy;
        alert.duration = alert.resolvedAt.getTime() - alert.triggeredAt.getTime();
        alert.annotations.resolution = resolution;
        this.activeAlerts.delete(ruleId);
        this.emit('alert:resolved', alert);
        break;
      }
    }
  }

  /**
   * Suppress an alert for a duration
   */
  public suppressAlert(ruleId: string, durationMs: number): void {
    this.suppressedAlerts.add(ruleId);
    setTimeout(() => {
      this.suppressedAlerts.delete(ruleId);
      this.emit('alert:unsuppressed', ruleId);
    }, durationMs);
    this.emit('alert:suppressed', ruleId);
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(severity?: AlertSeverity): Alert[] {
    const alerts = Array.from(this.activeAlerts.values());
    if (severity) {
      return alerts.filter(alert => alert.severity === severity);
    }
    return alerts;
  }

  /**
   * Get alert history
   */
  public getAlertHistory(limit: number = 100): Alert[] {
    return this.alertHistory.slice(-limit);
  }

  /**
   * Send notifications through configured channels
   */
  private async sendNotifications(alert: Alert, channelNames: string[]): Promise<void> {
    const promises = channelNames.map(async (channelName) => {
      const channel = this.channels.get(channelName);
      if (channel) {
        try {
          await channel.send(alert);
          this.emit('notification:sent', { alert, channel: channelName });
        } catch (error) {
          this.emit('notification:failed', { alert, channel: channelName, error });
        }
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Send resolution notification
   */
  private async sendResolutionNotification(alert: Alert): Promise<void> {
    console.log(`Alert resolved: ${alert.title} (duration: ${alert.duration}ms)`);
    // Implementation would send notifications through configured channels
  }

  /**
   * Get runbook URL for a rule
   */
  private getRunbookUrl(ruleId: string): string {
    return `https://docs.k5.example.com/runbooks/${ruleId}`;
  }

  /**
   * Get alert statistics
   */
  public getStatistics(timeRange: { from: Date; to: Date }): {
    total: number;
    bySeverity: Record<string, number>;
    avgResolutionTime: number;
    activeCount: number;
  } {
    const alerts = this.alertHistory.filter(
      alert => alert.triggeredAt >= timeRange.from && alert.triggeredAt <= timeRange.to
    );

    const bySeverity: Record<string, number> = {};
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    for (const alert of alerts) {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      if (alert.duration) {
        totalResolutionTime += alert.duration;
        resolvedCount++;
      }
    }

    return {
      total: alerts.length,
      bySeverity,
      avgResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
      activeCount: this.activeAlerts.size
    };
  }
}

// Singleton instance
export const alertManager = new AlertManager();

export default AlertManager;
