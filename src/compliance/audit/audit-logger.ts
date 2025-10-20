/**
 * Audit Logging Implementation
 *
 * Comprehensive audit trail for FERPA compliance
 */

import { AuditLog, UserRole, DataClassification } from '../types';

// ============================================================================
// Audit Logger
// ============================================================================

export class AuditLogger {
  private logs: AuditLog[] = [];
  private listeners: Array<(log: AuditLog) => void> = [];

  /**
   * Log an action
   */
  log(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      ...log
    };

    this.logs.push(auditLog);
    this.notifyListeners(auditLog);

    // Alert on sensitive actions
    if (this.isSensitiveAction(auditLog)) {
      this.alertSensitiveAction(auditLog);
    }

    return auditLog;
  }

  /**
   * Log data access
   */
  logDataAccess(
    userId: string,
    userRole: UserRole,
    resource: string,
    resourceId: string,
    dataClassification: DataClassification,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole,
      action: 'data_access',
      resource,
      resourceId,
      dataClassification,
      status: 'success',
      ...context
    });
  }

  /**
   * Log data modification
   */
  logDataModification(
    userId: string,
    userRole: UserRole,
    resource: string,
    resourceId: string,
    dataClassification: DataClassification,
    changes: Record<string, any>,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole,
      action: 'data_modification',
      resource,
      resourceId,
      dataClassification,
      status: 'success',
      details: { changes },
      ...context
    });
  }

  /**
   * Log data deletion
   */
  logDataDeletion(
    userId: string,
    userRole: UserRole,
    resource: string,
    resourceId: string,
    dataClassification: DataClassification,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole,
      action: 'data_deletion',
      resource,
      resourceId,
      dataClassification,
      status: 'success',
      ...context
    });
  }

  /**
   * Log access denial
   */
  logAccessDenied(
    userId: string,
    userRole: UserRole,
    resource: string,
    resourceId: string,
    reason: string,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole,
      action: 'access_denied',
      resource,
      resourceId,
      dataClassification: DataClassification.RESTRICTED,
      status: 'denied',
      details: { reason },
      ...context
    });
  }

  /**
   * Log data export
   */
  logDataExport(
    userId: string,
    userRole: UserRole,
    resourceIds: string[],
    format: string,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole,
      action: 'data_export',
      resource: 'export',
      resourceId: resourceIds.join(','),
      dataClassification: DataClassification.CONFIDENTIAL,
      status: 'success',
      details: { format, resourceIds },
      ...context
    });
  }

  /**
   * Log consent action
   */
  logConsentAction(
    userId: string,
    action: 'granted' | 'denied' | 'revoked',
    consentType: string,
    context: {
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }
  ): AuditLog {
    return this.log({
      userId,
      userRole: UserRole.PARENT,
      action: `consent_${action}`,
      resource: 'consent',
      resourceId: consentType,
      dataClassification: DataClassification.CONFIDENTIAL,
      status: 'success',
      ...context
    });
  }

  /**
   * Query logs
   */
  queryLogs(filter: {
    userId?: string;
    userRole?: UserRole;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AuditLog['status'];
    dataClassification?: DataClassification;
  }): AuditLog[] {
    return this.logs.filter(log => {
      if (filter.userId && log.userId !== filter.userId) return false;
      if (filter.userRole && log.userRole !== filter.userRole) return false;
      if (filter.action && log.action !== filter.action) return false;
      if (filter.resource && log.resource !== filter.resource) return false;
      if (filter.status && log.status !== filter.status) return false;
      if (filter.dataClassification && log.dataClassification !== filter.dataClassification) return false;
      if (filter.startDate && log.timestamp < filter.startDate) return false;
      if (filter.endDate && log.timestamp > filter.endDate) return false;
      return true;
    });
  }

  /**
   * Get user activity
   */
  getUserActivity(userId: string, days: number = 30): AuditLog[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.queryLogs({ userId, startDate });
  }

  /**
   * Get resource access history
   */
  getResourceAccessHistory(resourceId: string, days: number = 90): AuditLog[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.logs.filter(log =>
      log.resourceId === resourceId &&
      log.timestamp >= startDate
    );
  }

  /**
   * Get failed access attempts
   */
  getFailedAttempts(userId?: string, hours: number = 24): AuditLog[] {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    return this.logs.filter(log =>
      log.status === 'denied' &&
      log.timestamp >= startDate &&
      (!userId || log.userId === userId)
    );
  }

  /**
   * Add listener for real-time monitoring
   */
  addListener(listener: (log: AuditLog) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (log: AuditLog) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Generate statistics
   */
  generateStatistics(startDate: Date, endDate: Date): {
    totalLogs: number;
    byAction: Record<string, number>;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    byClassification: Record<string, number>;
    topUsers: Array<{ userId: string; count: number }>;
    topResources: Array<{ resource: string; count: number }>;
  } {
    const logs = this.queryLogs({ startDate, endDate });

    const byAction: Record<string, number> = {};
    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byClassification: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    const resourceCounts: Record<string, number> = {};

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byRole[log.userRole] = (byRole[log.userRole] || 0) + 1;
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;
      byClassification[log.dataClassification] = (byClassification[log.dataClassification] || 0) + 1;
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
      resourceCounts[log.resource] = (resourceCounts[log.resource] || 0) + 1;
    }

    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topResources = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalLogs: logs.length,
      byAction,
      byRole,
      byStatus,
      byClassification,
      topUsers,
      topResources
    };
  }

  /**
   * Private helpers
   */

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private notifyListeners(log: AuditLog): void {
    for (const listener of this.listeners) {
      try {
        listener(log);
      } catch (error) {
        console.error('Audit listener error:', error);
      }
    }
  }

  private isSensitiveAction(log: AuditLog): boolean {
    const sensitiveActions = ['data_deletion', 'data_export', 'access_denied'];
    const sensitiveClassifications = [DataClassification.CONFIDENTIAL, DataClassification.RESTRICTED];

    return sensitiveActions.includes(log.action) ||
           sensitiveClassifications.includes(log.dataClassification);
  }

  private alertSensitiveAction(log: AuditLog): void {
    // In production, send to monitoring system
    console.warn('[SENSITIVE ACTION]', {
      action: log.action,
      userId: log.userId,
      resource: log.resource,
      classification: log.dataClassification
    });
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const auditLogger = new AuditLogger();
