/**
 * Incident Management System
 * Automated incident detection, response, and resolution workflows
 */

import { EventEmitter } from 'events';
import { Incident, IncidentSeverity, IncidentStatus, Alert } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { alertManager } from '../alerts/alert-manager';
import { logger } from '../logging/log-aggregator';
import { metrics } from '../metrics/prometheus-client';

interface IncidentWorkflow {
  severity: IncidentSeverity;
  actions: Array<{
    type: 'notify' | 'escalate' | 'runbook' | 'scale' | 'rollback';
    config: Record<string, any>;
    delay?: number;
  }>;
}

class IncidentManager extends EventEmitter {
  private incidents: Map<string, Incident> = new Map();
  private workflows: Map<IncidentSeverity, IncidentWorkflow> = new Map();
  private incidentHistory: Incident[] = [];

  constructor() {
    super();
    this.initializeWorkflows();
    this.setupAlertListeners();
  }

  /**
   * Initialize automated incident response workflows
   */
  private initializeWorkflows(): void {
    // SEV1 - Critical workflow
    this.workflows.set(IncidentSeverity.SEV1, {
      severity: IncidentSeverity.SEV1,
      actions: [
        {
          type: 'notify',
          config: {
            channels: ['pagerduty', 'slack', 'email'],
            message: 'CRITICAL: System outage detected',
            priority: 'critical'
          }
        },
        {
          type: 'escalate',
          config: {
            escalateTo: 'sre-oncall',
            timeout: 300 // 5 minutes
          },
          delay: 300000
        },
        {
          type: 'runbook',
          config: {
            runbookId: 'sev1-response',
            autoExecute: false
          }
        }
      ]
    });

    // SEV2 - High severity workflow
    this.workflows.set(IncidentSeverity.SEV2, {
      severity: IncidentSeverity.SEV2,
      actions: [
        {
          type: 'notify',
          config: {
            channels: ['slack', 'email'],
            message: 'HIGH: Major functionality affected'
          }
        },
        {
          type: 'runbook',
          config: {
            runbookId: 'sev2-response',
            autoExecute: false
          }
        },
        {
          type: 'escalate',
          config: {
            escalateTo: 'engineering-oncall',
            timeout: 900 // 15 minutes
          },
          delay: 900000
        }
      ]
    });

    // SEV3 - Medium severity workflow
    this.workflows.set(IncidentSeverity.SEV3, {
      severity: IncidentSeverity.SEV3,
      actions: [
        {
          type: 'notify',
          config: {
            channels: ['slack'],
            message: 'MEDIUM: Minor functionality affected'
          }
        },
        {
          type: 'runbook',
          config: {
            runbookId: 'sev3-response',
            autoExecute: false
          }
        }
      ]
    });

    // SEV4 - Low severity workflow
    this.workflows.set(IncidentSeverity.SEV4, {
      severity: IncidentSeverity.SEV4,
      actions: [
        {
          type: 'notify',
          config: {
            channels: ['slack'],
            message: 'LOW: Minimal impact detected'
          }
        }
      ]
    });
  }

  /**
   * Setup listeners for alerts to create incidents
   */
  private setupAlertListeners(): void {
    alertManager.on('alert:triggered', (alert: Alert) => {
      this.handleAlert(alert);
    });

    alertManager.on('alert:resolved', (alert: Alert) => {
      this.resolveIncidentByAlert(alert.id);
    });
  }

  /**
   * Handle an alert and potentially create an incident
   */
  private async handleAlert(alert: Alert): Promise<void> {
    // Determine if alert should create incident
    const shouldCreateIncident = this.shouldCreateIncident(alert);

    if (shouldCreateIncident) {
      const severity = this.mapAlertSeverityToIncidentSeverity(alert.severity);
      await this.createIncident({
        title: alert.title,
        description: alert.description,
        severity,
        affectedServices: [alert.metric],
        alertIds: [alert.id],
        tags: alert.labels.map(l => `${l.name}:${l.value}`)
      });
    }
  }

  /**
   * Determine if alert should create an incident
   */
  private shouldCreateIncident(alert: Alert): boolean {
    // Create incident for critical and error alerts
    if (alert.severity === 'critical' || alert.severity === 'error') {
      return true;
    }

    // Check if multiple related warnings exist
    const activeAlerts = alertManager.getActiveAlerts();
    const relatedWarnings = activeAlerts.filter(
      a => a.metric === alert.metric && a.severity === 'warning'
    );

    return relatedWarnings.length >= 3;
  }

  /**
   * Map alert severity to incident severity
   */
  private mapAlertSeverityToIncidentSeverity(alertSeverity: string): IncidentSeverity {
    switch (alertSeverity) {
      case 'critical':
        return IncidentSeverity.SEV1;
      case 'error':
        return IncidentSeverity.SEV2;
      case 'warning':
        return IncidentSeverity.SEV3;
      default:
        return IncidentSeverity.SEV4;
    }
  }

  /**
   * Create a new incident
   */
  public async createIncident(config: {
    title: string;
    description: string;
    severity: IncidentSeverity;
    affectedServices: string[];
    affectedUsers?: number;
    alertIds?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
  }): Promise<Incident> {
    const incident: Incident = {
      id: uuidv4(),
      title: config.title,
      description: config.description,
      severity: config.severity,
      status: IncidentStatus.DETECTED,
      detectedAt: new Date(),
      affectedServices: config.affectedServices,
      affectedUsers: config.affectedUsers,
      impactDescription: this.generateImpactDescription(config.severity, config.affectedServices),
      alerts: config.alertIds || [],
      statusUpdates: [
        {
          timestamp: new Date(),
          status: IncidentStatus.DETECTED,
          message: 'Incident detected automatically',
          author: 'system'
        }
      ],
      tags: config.tags || [],
      metadata: config.metadata || {}
    };

    this.incidents.set(incident.id, incident);
    this.incidentHistory.push(incident);

    // Record metrics
    metrics.recordIncident(incident.severity, incident.affectedServices.join(','));
    metrics.setActiveIncidents(incident.severity, this.getActiveIncidentsBySeverity(incident.severity).length);

    // Log incident
    logger.error(`Incident created: ${incident.title}`, undefined, {
      incidentId: incident.id,
      severity: incident.severity,
      services: incident.affectedServices
    });

    // Emit event
    this.emit('incident:created', incident);

    // Execute automated response workflow
    await this.executeWorkflow(incident);

    return incident;
  }

  /**
   * Execute automated incident response workflow
   */
  private async executeWorkflow(incident: Incident): Promise<void> {
    const workflow = this.workflows.get(incident.severity);
    if (!workflow) {
      return;
    }

    logger.info(`Executing incident response workflow for ${incident.id}`, {
      incidentId: incident.id,
      severity: incident.severity
    });

    for (const action of workflow.actions) {
      // Apply delay if specified
      if (action.delay) {
        setTimeout(async () => {
          await this.executeAction(incident, action);
        }, action.delay);
      } else {
        await this.executeAction(incident, action);
      }
    }
  }

  /**
   * Execute a specific incident response action
   */
  private async executeAction(
    incident: Incident,
    action: { type: string; config: Record<string, any> }
  ): Promise<void> {
    try {
      switch (action.type) {
        case 'notify':
          await this.sendNotification(incident, action.config);
          break;
        case 'escalate':
          await this.escalateIncident(incident, action.config);
          break;
        case 'runbook':
          await this.executeRunbook(incident, action.config);
          break;
        case 'scale':
          await this.autoScale(incident, action.config);
          break;
        case 'rollback':
          await this.autoRollback(incident, action.config);
          break;
        default:
          logger.warn(`Unknown action type: ${action.type}`, { incidentId: incident.id });
      }
    } catch (error) {
      logger.error(`Failed to execute action ${action.type}`, error as Error, {
        incidentId: incident.id
      });
    }
  }

  /**
   * Send incident notification
   */
  private async sendNotification(incident: Incident, config: { channels: string[]; message: string }): Promise<void> {
    logger.info(`Sending incident notification: ${config.message}`, {
      incidentId: incident.id,
      channels: config.channels
    });

    // Implementation would send actual notifications
    this.emit('incident:notification', { incident, config });
  }

  /**
   * Escalate incident to on-call team
   */
  private async escalateIncident(incident: Incident, config: { escalateTo: string; timeout: number }): Promise<void> {
    logger.info(`Escalating incident to ${config.escalateTo}`, {
      incidentId: incident.id
    });

    this.addStatusUpdate(incident.id, {
      timestamp: new Date(),
      status: incident.status,
      message: `Escalated to ${config.escalateTo}`,
      author: 'system'
    });

    this.emit('incident:escalated', { incident, escalateTo: config.escalateTo });
  }

  /**
   * Execute incident runbook
   */
  private async executeRunbook(incident: Incident, config: { runbookId: string; autoExecute: boolean }): Promise<void> {
    const runbookUrl = `https://docs.k5.example.com/runbooks/${config.runbookId}`;
    incident.runbookUrl = runbookUrl;

    logger.info(`Runbook referenced: ${runbookUrl}`, {
      incidentId: incident.id,
      autoExecute: config.autoExecute
    });

    if (config.autoExecute) {
      // Implementation would execute automated runbook steps
      logger.info('Executing automated runbook steps', { incidentId: incident.id });
    }

    this.emit('incident:runbook', { incident, runbookUrl });
  }

  /**
   * Auto-scale resources in response to incident
   */
  private async autoScale(incident: Incident, config: { service: string; targetInstances: number }): Promise<void> {
    logger.info(`Auto-scaling ${config.service} to ${config.targetInstances} instances`, {
      incidentId: incident.id
    });

    this.addStatusUpdate(incident.id, {
      timestamp: new Date(),
      status: incident.status,
      message: `Auto-scaled ${config.service} to ${config.targetInstances} instances`,
      author: 'system'
    });

    this.emit('incident:autoscale', { incident, config });
  }

  /**
   * Auto-rollback deployment in response to incident
   */
  private async autoRollback(incident: Incident, config: { service: string; version: string }): Promise<void> {
    logger.info(`Rolling back ${config.service} to version ${config.version}`, {
      incidentId: incident.id
    });

    this.addStatusUpdate(incident.id, {
      timestamp: new Date(),
      status: incident.status,
      message: `Rolled back ${config.service} to ${config.version}`,
      author: 'system'
    });

    this.emit('incident:rollback', { incident, config });
  }

  /**
   * Update incident status
   */
  public updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    message: string,
    author: string
  ): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      return;
    }

    incident.status = status;

    if (status === IncidentStatus.INVESTIGATING) {
      incident.acknowledgedAt = new Date();
    } else if (status === IncidentStatus.RESOLVED) {
      incident.resolvedAt = new Date();
      incident.duration = incident.resolvedAt.getTime() - incident.detectedAt.getTime();
      incident.mttr = incident.duration;

      // Remove from active incidents
      this.incidents.delete(incidentId);

      // Record metrics
      metrics.recordIncidentMTTR(incident.severity, incident.duration);
      metrics.setActiveIncidents(incident.severity, this.getActiveIncidentsBySeverity(incident.severity).length);
    }

    this.addStatusUpdate(incidentId, {
      timestamp: new Date(),
      status,
      message,
      author
    });

    this.emit('incident:status_changed', incident);
  }

  /**
   * Add status update to incident
   */
  private addStatusUpdate(
    incidentId: string,
    update: { timestamp: Date; status: IncidentStatus; message: string; author: string }
  ): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      const historicalIncident = this.incidentHistory.find(i => i.id === incidentId);
      if (historicalIncident) {
        historicalIncident.statusUpdates.push(update);
      }
      return;
    }

    incident.statusUpdates.push(update);
  }

  /**
   * Set root cause for incident
   */
  public setRootCause(incidentId: string, rootCause: string, author: string): void {
    const incident = this.incidents.get(incidentId) || this.incidentHistory.find(i => i.id === incidentId);
    if (!incident) {
      return;
    }

    incident.rootCause = rootCause;
    this.addStatusUpdate(incidentId, {
      timestamp: new Date(),
      status: IncidentStatus.IDENTIFIED,
      message: `Root cause identified: ${rootCause}`,
      author
    });

    this.emit('incident:root_cause', incident);
  }

  /**
   * Set resolution for incident
   */
  public setResolution(incidentId: string, resolution: string, author: string): void {
    const incident = this.incidents.get(incidentId) || this.incidentHistory.find(i => i.id === incidentId);
    if (!incident) {
      return;
    }

    incident.resolution = resolution;
    this.updateIncidentStatus(incidentId, IncidentStatus.RESOLVED, `Resolved: ${resolution}`, author);
  }

  /**
   * Assign incident to team member
   */
  public assignIncident(incidentId: string, assignees: string[]): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      return;
    }

    incident.assignedTo = assignees;
    this.emit('incident:assigned', { incident, assignees });
  }

  /**
   * Add action item to incident
   */
  public addActionItem(
    incidentId: string,
    description: string,
    assignee: string,
    dueDate: Date
  ): void {
    const incident = this.incidents.get(incidentId) || this.incidentHistory.find(i => i.id === incidentId);
    if (!incident) {
      return;
    }

    if (!incident.actionItems) {
      incident.actionItems = [];
    }

    incident.actionItems.push({
      description,
      assignee,
      dueDate,
      completed: false
    });

    this.emit('incident:action_item', incident);
  }

  /**
   * Resolve incident by alert ID
   */
  private resolveIncidentByAlert(alertId: string): void {
    for (const [incidentId, incident] of this.incidents.entries()) {
      if (incident.alerts.includes(alertId)) {
        const allAlertsResolved = incident.alerts.every(
          id => !alertManager.getActiveAlerts().some(a => a.id === id)
        );

        if (allAlertsResolved) {
          this.updateIncidentStatus(
            incidentId,
            IncidentStatus.RESOLVED,
            'All related alerts resolved',
            'system'
          );
        }
      }
    }
  }

  /**
   * Get active incidents
   */
  public getActiveIncidents(severity?: IncidentSeverity): Incident[] {
    const incidents = Array.from(this.incidents.values());
    if (severity) {
      return incidents.filter(i => i.severity === severity);
    }
    return incidents;
  }

  /**
   * Get active incidents by severity
   */
  private getActiveIncidentsBySeverity(severity: IncidentSeverity): Incident[] {
    return Array.from(this.incidents.values()).filter(i => i.severity === severity);
  }

  /**
   * Get incident history
   */
  public getIncidentHistory(limit: number = 100): Incident[] {
    return this.incidentHistory.slice(-limit);
  }

  /**
   * Get a specific incident
   */
  public getIncident(incidentId: string): Incident | undefined {
    return this.incidents.get(incidentId) || this.incidentHistory.find(i => i.id === incidentId);
  }

  /**
   * Generate impact description
   */
  private generateImpactDescription(severity: IncidentSeverity, services: string[]): string {
    const serviceList = services.join(', ');

    switch (severity) {
      case IncidentSeverity.SEV1:
        return `Critical outage affecting ${serviceList}. System unavailable to users.`;
      case IncidentSeverity.SEV2:
        return `Major functionality affected in ${serviceList}. Degraded user experience.`;
      case IncidentSeverity.SEV3:
        return `Minor functionality affected in ${serviceList}. Minimal user impact.`;
      case IncidentSeverity.SEV4:
        return `Low impact issue in ${serviceList}. No significant user impact.`;
    }
  }

  /**
   * Get incident statistics
   */
  public getStatistics(timeRange: { from: Date; to: Date }): {
    total: number;
    bySeverity: Record<string, number>;
    avgMTTR: number;
    activeCount: number;
    topServices: Array<{ service: string; count: number }>;
  } {
    const incidents = this.incidentHistory.filter(
      i => i.detectedAt >= timeRange.from && i.detectedAt <= timeRange.to
    );

    const bySeverity: Record<string, number> = {};
    let totalMTTR = 0;
    let resolvedCount = 0;
    const serviceCount = new Map<string, number>();

    for (const incident of incidents) {
      bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1;

      if (incident.mttr) {
        totalMTTR += incident.mttr;
        resolvedCount++;
      }

      for (const service of incident.affectedServices) {
        serviceCount.set(service, (serviceCount.get(service) || 0) + 1);
      }
    }

    const topServices = Array.from(serviceCount.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: incidents.length,
      bySeverity,
      avgMTTR: resolvedCount > 0 ? totalMTTR / resolvedCount : 0,
      activeCount: this.incidents.size,
      topServices
    };
  }
}

// Singleton instance
export const incidentManager = new IncidentManager();

export default IncidentManager;
