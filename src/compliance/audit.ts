/**
 * Audit Logging System
 * Comprehensive audit trail for compliance and security monitoring
 * Tracks all system operations, data access, and user actions
 */

import { createClient } from '@supabase/supabase-js';

// Audit event categories
export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  DATA_DELETION = 'data_deletion',
  FILE_UPLOAD = 'file_upload',
  FILE_DOWNLOAD = 'file_download',
  USER_MANAGEMENT = 'user_management',
  SYSTEM_CONFIGURATION = 'system_configuration',
  SECURITY_EVENT = 'security_event',
  COMPLIANCE_EVENT = 'compliance_event',
  API_REQUEST = 'api_request',
  ERROR = 'error'
}

// Event severity levels
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Audit event status
export enum AuditStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PARTIAL = 'partial',
  DENIED = 'denied'
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  category: AuditCategory;
  severity: AuditSeverity;
  status: AuditStatus;

  // Actor information
  userId?: string;
  userName?: string;
  userRole?: string;
  userEmail?: string;
  sessionId?: string;

  // Action details
  action: string;
  resource: string;
  resourceId?: string;
  description: string;

  // Context
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceId?: string;

  // Request details
  method?: string;
  endpoint?: string;
  requestId?: string;

  // Changes (for data modifications)
  beforeState?: any;
  afterState?: any;
  changedFields?: string[];

  // Security context
  authMethod?: string;
  permissions?: string[];
  accessLevel?: string;

  // Compliance tags
  ferpaRelevant?: boolean;
  coppaRelevant?: boolean;
  piiAccessed?: boolean;

  // Additional metadata
  metadata?: Record<string, any>;
  tags?: string[];

  // Error information (if applicable)
  errorMessage?: string;
  errorStack?: string;
  errorCode?: string;
}

export interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  category?: AuditCategory;
  severity?: AuditSeverity;
  status?: AuditStatus;
  resource?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AuditStatistics {
  period: { start: Date; end: Date };
  totalEvents: number;
  eventsByCategory: Record<AuditCategory, number>;
  eventsBySeverity: Record<AuditSeverity, number>;
  eventsByStatus: Record<AuditStatus, number>;
  topUsers: Array<{ userId: string; userName: string; eventCount: number }>;
  topResources: Array<{ resource: string; accessCount: number }>;
  failureRate: number;
  complianceEvents: {
    ferpa: number;
    coppa: number;
    pii: number;
  };
  securityEvents: {
    failedLogins: number;
    unauthorizedAccess: number;
    suspiciousActivity: number;
  };
}

/**
 * Audit Logging Service
 */
export class AuditService {
  private supabase: any;
  private bufferSize: number = 100;
  private flushInterval: number = 5000; // 5 seconds
  private eventBuffer: AuditEvent[] = [];
  private flushTimer?: number;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Start buffer flush timer
    this.startBufferFlush();
  }

  /**
   * Log audit event
   */
  async log(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<string> {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event
    };

    // Add to buffer
    this.eventBuffer.push(auditEvent);

    // Flush if buffer is full or if critical event
    if (this.eventBuffer.length >= this.bufferSize || event.severity === AuditSeverity.CRITICAL) {
      await this.flushBuffer();
    }

    return auditEvent.id;
  }

  /**
   * Log authentication event
   */
  async logAuthentication(
    userId: string,
    action: 'login' | 'logout' | 'password_reset' | 'mfa_challenge',
    status: AuditStatus,
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.AUTHENTICATION,
      severity: status === AuditStatus.FAILURE ? AuditSeverity.WARNING : AuditSeverity.INFO,
      status,
      userId,
      action,
      resource: 'authentication',
      description: `User ${action} ${status}`,
      metadata
    });
  }

  /**
   * Log data access event
   */
  async logDataAccess(
    userId: string,
    resource: string,
    resourceId: string,
    action: 'view' | 'export' | 'download',
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.DATA_ACCESS,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId,
      action,
      resource,
      resourceId,
      description: `User accessed ${resource}: ${resourceId}`,
      ferpaRelevant: resource.includes('student') || resource.includes('assessment'),
      metadata
    });
  }

  /**
   * Log data modification event
   */
  async logDataModification(
    userId: string,
    resource: string,
    resourceId: string,
    beforeState: any,
    afterState: any,
    metadata?: Record<string, any>
  ): Promise<string> {
    const changedFields = this.detectChangedFields(beforeState, afterState);

    return await this.log({
      category: AuditCategory.DATA_MODIFICATION,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId,
      action: 'modify',
      resource,
      resourceId,
      description: `Modified ${resource}: ${changedFields.join(', ')}`,
      beforeState,
      afterState,
      changedFields,
      ferpaRelevant: resource.includes('student') || resource.includes('assessment'),
      metadata
    });
  }

  /**
   * Log data deletion event
   */
  async logDataDeletion(
    userId: string,
    resource: string,
    resourceId: string,
    deletedData: any,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.DATA_DELETION,
      severity: AuditSeverity.WARNING,
      status: AuditStatus.SUCCESS,
      userId,
      action: 'delete',
      resource,
      resourceId,
      description: `Deleted ${resource}: ${reason}`,
      beforeState: deletedData,
      ferpaRelevant: resource.includes('student'),
      coppaRelevant: resource.includes('child') || resource.includes('student'),
      metadata
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    event: 'unauthorized_access' | 'suspicious_activity' | 'brute_force' | 'data_breach',
    description: string,
    severity: AuditSeverity = AuditSeverity.CRITICAL,
    metadata?: Record<string, any>
  ): Promise<string> {
    const eventId = await this.log({
      category: AuditCategory.SECURITY_EVENT,
      severity,
      status: AuditStatus.FAILURE,
      action: event,
      resource: 'security',
      description,
      metadata
    });

    // Alert security team for critical events
    if (severity === AuditSeverity.CRITICAL) {
      await this.alertSecurityTeam(event, description, metadata);
    }

    return eventId;
  }

  /**
   * Log API request
   */
  async logAPIRequest(
    method: string,
    endpoint: string,
    status: number,
    userId?: string,
    duration?: number,
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.API_REQUEST,
      severity: status >= 500 ? AuditSeverity.ERROR : AuditSeverity.INFO,
      status: status < 400 ? AuditStatus.SUCCESS : AuditStatus.FAILURE,
      userId,
      action: method,
      resource: endpoint,
      description: `${method} ${endpoint} - ${status}`,
      method,
      endpoint,
      metadata: {
        ...metadata,
        statusCode: status,
        duration
      }
    });
  }

  /**
   * Log FERPA-relevant event
   */
  async logFERPAEvent(
    userId: string,
    studentId: string,
    action: string,
    authorized: boolean,
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.COMPLIANCE_EVENT,
      severity: authorized ? AuditSeverity.INFO : AuditSeverity.WARNING,
      status: authorized ? AuditStatus.SUCCESS : AuditStatus.DENIED,
      userId,
      action,
      resource: 'student_record',
      resourceId: studentId,
      description: `FERPA: ${action} student record (${authorized ? 'authorized' : 'denied'})`,
      ferpaRelevant: true,
      metadata
    });
  }

  /**
   * Log COPPA-relevant event
   */
  async logCOPPAEvent(
    childId: string,
    action: string,
    consentStatus: 'granted' | 'denied' | 'revoked' | 'pending',
    metadata?: Record<string, any>
  ): Promise<string> {
    return await this.log({
      category: AuditCategory.COMPLIANCE_EVENT,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      action,
      resource: 'child_consent',
      resourceId: childId,
      description: `COPPA: ${action} (${consentStatus})`,
      coppaRelevant: true,
      metadata: {
        ...metadata,
        consentStatus
      }
    });
  }

  /**
   * Query audit logs
   */
  async query(query: AuditQuery): Promise<{ events: AuditEvent[]; total: number }> {
    let queryBuilder = this.supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (query.startDate) {
      queryBuilder = queryBuilder.gte('timestamp', query.startDate.toISOString());
    }

    if (query.endDate) {
      queryBuilder = queryBuilder.lte('timestamp', query.endDate.toISOString());
    }

    if (query.userId) {
      queryBuilder = queryBuilder.eq('user_id', query.userId);
    }

    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }

    if (query.severity) {
      queryBuilder = queryBuilder.eq('severity', query.severity);
    }

    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.resource) {
      queryBuilder = queryBuilder.eq('resource', query.resource);
    }

    if (query.search) {
      queryBuilder = queryBuilder.or(
        `description.ilike.%${query.search}%,action.ilike.%${query.search}%`
      );
    }

    queryBuilder = queryBuilder
      .order('timestamp', { ascending: false })
      .range(query.offset || 0, (query.offset || 0) + (query.limit || 100) - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to query audit logs: ${error.message}`);
    }

    return {
      events: data || [],
      total: count || 0
    };
  }

  /**
   * Generate audit statistics
   */
  async getStatistics(startDate: Date, endDate: Date): Promise<AuditStatistics> {
    const { events } = await this.query({ startDate, endDate, limit: 100000 });

    const stats: AuditStatistics = {
      period: { start: startDate, end: endDate },
      totalEvents: events.length,
      eventsByCategory: this.groupBy(events, 'category') as any,
      eventsBySeverity: this.groupBy(events, 'severity') as any,
      eventsByStatus: this.groupBy(events, 'status') as any,
      topUsers: this.getTopUsers(events),
      topResources: this.getTopResources(events),
      failureRate: this.calculateFailureRate(events),
      complianceEvents: {
        ferpa: events.filter(e => e.ferpaRelevant).length,
        coppa: events.filter(e => e.coppaRelevant).length,
        pii: events.filter(e => e.piiAccessed).length
      },
      securityEvents: {
        failedLogins: events.filter(e =>
          e.category === AuditCategory.AUTHENTICATION && e.status === AuditStatus.FAILURE
        ).length,
        unauthorizedAccess: events.filter(e =>
          e.category === AuditCategory.AUTHORIZATION && e.status === AuditStatus.DENIED
        ).length,
        suspiciousActivity: events.filter(e =>
          e.category === AuditCategory.SECURITY_EVENT
        ).length
      }
    };

    return stats;
  }

  /**
   * Export audit logs for compliance reporting
   */
  async exportLogs(
    startDate: Date,
    endDate: Date,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const { events } = await this.query({ startDate, endDate, limit: 1000000 });

    if (format === 'csv') {
      return this.convertToCSV(events);
    }

    return JSON.stringify(events, null, 2);
  }

  /**
   * Detect tampered audit logs
   */
  async detectTampering(): Promise<{ tampered: boolean; suspiciousLogs: string[] }> {
    // Check for gaps in sequence, deleted records, or modified timestamps
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('id, timestamp, created_at')
      .order('created_at', { ascending: true })
      .limit(10000);

    const suspiciousLogs: string[] = [];

    if (logs) {
      for (let i = 1; i < logs.length; i++) {
        const prevLog = logs[i - 1];
        const currentLog = logs[i];

        // Check if timestamp is before previous log (out of order)
        if (new Date(currentLog.timestamp) < new Date(prevLog.timestamp)) {
          suspiciousLogs.push(currentLog.id);
        }

        // Check if created_at is significantly different from timestamp
        const timestampDiff = Math.abs(
          new Date(currentLog.timestamp).getTime() - new Date(currentLog.created_at).getTime()
        );
        if (timestampDiff > 60000) { // More than 1 minute difference
          suspiciousLogs.push(currentLog.id);
        }
      }
    }

    return {
      tampered: suspiciousLogs.length > 0,
      suspiciousLogs
    };
  }

  // Private helper methods

  private startBufferFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventBuffer.length > 0) {
        this.flushBuffer();
      }
    }, this.flushInterval) as any;
  }

  private async flushBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.supabase.from('audit_logs').insert(
        events.map(e => ({
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          category: e.category,
          severity: e.severity,
          status: e.status,
          user_id: e.userId,
          user_name: e.userName,
          user_role: e.userRole,
          user_email: e.userEmail,
          session_id: e.sessionId,
          action: e.action,
          resource: e.resource,
          resource_id: e.resourceId,
          description: e.description,
          ip_address: e.ipAddress,
          user_agent: e.userAgent,
          location: e.location,
          device_id: e.deviceId,
          method: e.method,
          endpoint: e.endpoint,
          request_id: e.requestId,
          before_state: e.beforeState,
          after_state: e.afterState,
          changed_fields: e.changedFields,
          auth_method: e.authMethod,
          permissions: e.permissions,
          access_level: e.accessLevel,
          ferpa_relevant: e.ferpaRelevant,
          coppa_relevant: e.coppaRelevant,
          pii_accessed: e.piiAccessed,
          metadata: e.metadata,
          tags: e.tags,
          error_message: e.errorMessage,
          error_stack: e.errorStack,
          error_code: e.errorCode
        }))
      );
    } catch (error) {
      console.error('Failed to flush audit buffer:', error);
      // Re-add events to buffer for retry
      this.eventBuffer.unshift(...events);
    }
  }

  private detectChangedFields(before: any, after: any): string[] {
    const changed: string[] = [];

    if (!before || !after) return changed;

    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changed.push(key);
      }
    }

    return changed;
  }

  private groupBy(items: any[], field: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = item[field] || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  private getTopUsers(events: AuditEvent[]): Array<{ userId: string; userName: string; eventCount: number }> {
    const userCounts: Record<string, { name: string; count: number }> = {};

    for (const event of events) {
      if (event.userId) {
        if (!userCounts[event.userId]) {
          userCounts[event.userId] = { name: event.userName || 'Unknown', count: 0 };
        }
        userCounts[event.userId].count++;
      }
    }

    return Object.entries(userCounts)
      .map(([userId, data]) => ({ userId, userName: data.name, eventCount: data.count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);
  }

  private getTopResources(events: AuditEvent[]): Array<{ resource: string; accessCount: number }> {
    const resourceCounts = this.groupBy(events, 'resource');

    return Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, accessCount: count }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);
  }

  private calculateFailureRate(events: AuditEvent[]): number {
    const failures = events.filter(e => e.status === AuditStatus.FAILURE).length;
    return events.length > 0 ? (failures / events.length) * 100 : 0;
  }

  private convertToCSV(events: AuditEvent[]): string {
    if (events.length === 0) return '';

    const headers = [
      'id', 'timestamp', 'category', 'severity', 'status', 'userId', 'userName',
      'action', 'resource', 'description', 'ipAddress'
    ];

    const rows = events.map(e => [
      e.id,
      e.timestamp.toISOString(),
      e.category,
      e.severity,
      e.status,
      e.userId || '',
      e.userName || '',
      e.action,
      e.resource,
      e.description,
      e.ipAddress || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  private async alertSecurityTeam(
    event: string,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // In production, integrate with alerting system (PagerDuty, Slack, email, etc.)
    console.error('🚨 SECURITY ALERT:', {
      event,
      description,
      metadata,
      timestamp: new Date()
    });

    // Store alert
    await this.supabase.from('security_alerts').insert({
      event_type: event,
      description,
      metadata,
      created_at: new Date().toISOString(),
      acknowledged: false
    });
  }

  /**
   * Cleanup on service shutdown
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flushBuffer();
  }
}
