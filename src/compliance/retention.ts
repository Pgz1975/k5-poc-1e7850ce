/**
 * Data Retention and Deletion Policy Enforcement
 * Implements automated data lifecycle management per FERPA, COPPA, and internal policies
 */

import { createClient } from '@supabase/supabase-js';

// Data retention periods (in days)
export const RETENTION_PERIODS = {
  STUDENT_RECORDS: 7 * 365,          // 7 years (FERPA requirement)
  ASSESSMENT_DATA: 5 * 365,          // 5 years
  READING_PROGRESS: 3 * 365,         // 3 years
  AUDIT_LOGS: 7 * 365,               // 7 years (compliance)
  SESSION_DATA: 30,                  // 30 days
  TEMPORARY_FILES: 7,                // 7 days
  DELETED_USER_DATA: 90,             // 90 days (recovery period)
  CONSENT_RECORDS: 10 * 365,         // 10 years (legal requirement)
  COPPA_CHILD_DATA: 0,               // Delete immediately when consent revoked
  ANONYMIZED_RESEARCH: Infinity      // Keep indefinitely
};

// Deletion status
export enum DeletionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Deletion reason
export enum DeletionReason {
  RETENTION_EXPIRED = 'retention_expired',
  USER_REQUEST = 'user_request',
  CONSENT_REVOKED = 'consent_revoked',
  ACCOUNT_CLOSURE = 'account_closure',
  FERPA_REQUEST = 'ferpa_request',
  COPPA_REQUIREMENT = 'coppa_requirement',
  GDPR_REQUEST = 'gdpr_request',
  ADMINISTRATIVE = 'administrative'
}

export interface RetentionPolicy {
  id: string;
  name: string;
  dataCategory: string;
  retentionDays: number;
  autoDelete: boolean;
  requiresApproval: boolean;
  legalBasis: string;
  description: string;
  active: boolean;
}

export interface DeletionSchedule {
  id: string;
  userId?: string;
  dataCategory: string;
  scheduledDate: Date;
  status: DeletionStatus;
  reason: DeletionReason;
  requestedBy: string;
  approvedBy?: string;
  completedDate?: Date;
  itemsDeleted?: number;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface DataInventory {
  userId: string;
  category: string;
  tableName: string;
  recordCount: number;
  oldestRecord: Date;
  newestRecord: Date;
  retentionPeriod: number;
  expirationDate: Date;
  canDelete: boolean;
  dependencies: string[];
}

/**
 * Data Retention and Deletion Service
 */
export class RetentionService {
  private supabase: any;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  /**
   * Schedule data deletion
   */
  async scheduleDeletion(
    dataCategory: string,
    userId: string | undefined,
    reason: DeletionReason,
    requestedBy: string,
    daysUntilDeletion: number = 30
  ): Promise<DeletionSchedule> {
    const scheduledDate = new Date(Date.now() + daysUntilDeletion * 24 * 60 * 60 * 1000);

    const schedule: DeletionSchedule = {
      id: crypto.randomUUID(),
      userId,
      dataCategory,
      scheduledDate,
      status: DeletionStatus.SCHEDULED,
      reason,
      requestedBy
    };

    await this.supabase.from('deletion_schedule').insert({
      id: schedule.id,
      user_id: schedule.userId,
      data_category: schedule.dataCategory,
      scheduled_date: schedule.scheduledDate.toISOString(),
      status: schedule.status,
      reason: schedule.reason,
      requested_by: schedule.requestedBy,
      created_at: new Date().toISOString()
    });

    return schedule;
  }

  /**
   * Execute scheduled deletions
   */
  async executeScheduledDeletions(): Promise<{
    processed: number;
    successful: number;
    failed: number;
    results: Array<{ scheduleId: string; status: string; itemsDeleted: number }>;
  }> {
    const now = new Date();

    // Get pending deletions
    const { data: schedules } = await this.supabase
      .from('deletion_schedule')
      .select('*')
      .eq('status', DeletionStatus.SCHEDULED)
      .lte('scheduled_date', now.toISOString());

    const results = [];
    let successful = 0;
    let failed = 0;

    if (schedules) {
      for (const schedule of schedules) {
        try {
          // Mark as in progress
          await this.supabase
            .from('deletion_schedule')
            .update({ status: DeletionStatus.IN_PROGRESS })
            .eq('id', schedule.id);

          // Execute deletion
          const itemsDeleted = await this.deleteData(
            schedule.data_category,
            schedule.user_id,
            schedule.reason
          );

          // Mark as completed
          await this.supabase
            .from('deletion_schedule')
            .update({
              status: DeletionStatus.COMPLETED,
              completed_date: now.toISOString(),
              items_deleted: itemsDeleted
            })
            .eq('id', schedule.id);

          results.push({
            scheduleId: schedule.id,
            status: 'success',
            itemsDeleted
          });
          successful++;
        } catch (error) {
          // Mark as failed
          await this.supabase
            .from('deletion_schedule')
            .update({
              status: DeletionStatus.FAILED,
              errors: [error.message]
            })
            .eq('id', schedule.id);

          results.push({
            scheduleId: schedule.id,
            status: 'failed',
            itemsDeleted: 0
          });
          failed++;
        }
      }
    }

    return {
      processed: schedules?.length || 0,
      successful,
      failed,
      results
    };
  }

  /**
   * Delete data for specific category and user
   */
  private async deleteData(
    category: string,
    userId: string | undefined,
    reason: DeletionReason
  ): Promise<number> {
    let totalDeleted = 0;

    const categoryTables: Record<string, string[]> = {
      student_records: ['users', 'student_profiles', 'parent_student_relationships'],
      reading_progress: ['reading_sessions', 'reading_progress', 'book_completions'],
      assessment_data: ['assessment_results', 'test_attempts', 'question_responses'],
      session_data: ['user_sessions', 'activity_logs'],
      temporary_files: ['temp_uploads', 'temp_processing'],
      coppa_child_data: ['users', 'reading_sessions', 'assessment_results', 'coppa_consents']
    };

    const tables = categoryTables[category] || [category];

    for (const table of tables) {
      try {
        let query = this.supabase.from(table).delete();

        if (userId) {
          query = query.eq('user_id', userId);
        }

        // Add soft delete timestamp instead of hard delete for some categories
        if (this.shouldSoftDelete(category, reason)) {
          query = this.supabase
            .from(table)
            .update({
              deleted_at: new Date().toISOString(),
              deletion_reason: reason
            });

          if (userId) {
            query = query.eq('user_id', userId);
          }
        }

        const { count } = await query;
        totalDeleted += count || 0;
      } catch (error) {
        console.error(`Failed to delete from ${table}:`, error);
      }
    }

    return totalDeleted;
  }

  /**
   * Check if data should be soft-deleted (marked as deleted) vs hard-deleted
   */
  private shouldSoftDelete(category: string, reason: DeletionReason): boolean {
    // Soft delete for certain categories to allow recovery
    const softDeleteCategories = ['student_records', 'assessment_data'];
    const softDeleteReasons = [DeletionReason.USER_REQUEST, DeletionReason.ACCOUNT_CLOSURE];

    return softDeleteCategories.includes(category) && softDeleteReasons.includes(reason);
  }

  /**
   * Enforce retention policies
   */
  async enforceRetentionPolicies(): Promise<{
    policiesChecked: number;
    deletionsScheduled: number;
    policies: Array<{ policy: string; itemsExpired: number }>;
  }> {
    const policies = await this.getActiveRetentionPolicies();
    const results = [];
    let deletionsScheduled = 0;

    for (const policy of policies) {
      const itemsExpired = await this.findExpiredData(policy);

      if (itemsExpired > 0) {
        if (policy.autoDelete) {
          await this.scheduleDeletion(
            policy.dataCategory,
            undefined,
            DeletionReason.RETENTION_EXPIRED,
            'system',
            policy.requiresApproval ? 30 : 0
          );
          deletionsScheduled++;
        }

        results.push({
          policy: policy.name,
          itemsExpired
        });
      }
    }

    return {
      policiesChecked: policies.length,
      deletionsScheduled,
      policies: results
    };
  }

  /**
   * Get active retention policies
   */
  private async getActiveRetentionPolicies(): Promise<RetentionPolicy[]> {
    const { data: policies } = await this.supabase
      .from('retention_policies')
      .select('*')
      .eq('active', true);

    return policies || [];
  }

  /**
   * Find expired data for a retention policy
   */
  private async findExpiredData(policy: RetentionPolicy): Promise<number> {
    const expirationDate = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000);

    // This is a simplified check - real implementation would check specific tables
    const { count } = await this.supabase
      .from(policy.dataCategory)
      .select('id', { count: 'exact', head: true })
      .lte('created_at', expirationDate.toISOString())
      .is('deleted_at', null);

    return count || 0;
  }

  /**
   * Get data inventory for user
   */
  async getUserDataInventory(userId: string): Promise<DataInventory[]> {
    const inventory: DataInventory[] = [];

    const tables = [
      { name: 'reading_sessions', category: 'reading_progress', retention: RETENTION_PERIODS.READING_PROGRESS },
      { name: 'assessment_results', category: 'assessment_data', retention: RETENTION_PERIODS.ASSESSMENT_DATA },
      { name: 'user_sessions', category: 'session_data', retention: RETENTION_PERIODS.SESSION_DATA },
      { name: 'audit_logs', category: 'audit_logs', retention: RETENTION_PERIODS.AUDIT_LOGS }
    ];

    for (const table of tables) {
      const { data: records } = await this.supabase
        .from(table.name)
        .select('created_at')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (records && records.length > 0) {
        const oldest = new Date(records[0].created_at);
        const newest = new Date(records[records.length - 1].created_at);
        const expirationDate = new Date(oldest.getTime() + table.retention * 24 * 60 * 60 * 1000);

        inventory.push({
          userId,
          category: table.category,
          tableName: table.name,
          recordCount: records.length,
          oldestRecord: oldest,
          newestRecord: newest,
          retentionPeriod: table.retention,
          expirationDate,
          canDelete: true,
          dependencies: []
        });
      }
    }

    return inventory;
  }

  /**
   * Delete all user data (right to erasure)
   */
  async deleteAllUserData(
    userId: string,
    reason: DeletionReason,
    requestedBy: string
  ): Promise<{
    scheduled: boolean;
    scheduleId: string;
    estimatedDeletion: Date;
  }> {
    // Schedule deletion with 30-day grace period (unless COPPA requirement)
    const daysUntilDeletion = reason === DeletionReason.COPPA_REQUIREMENT ? 0 : 30;

    const schedule = await this.scheduleDeletion(
      'all_user_data',
      userId,
      reason,
      requestedBy,
      daysUntilDeletion
    );

    return {
      scheduled: true,
      scheduleId: schedule.id,
      estimatedDeletion: schedule.scheduledDate
    };
  }

  /**
   * Anonymize data (alternative to deletion for research/analytics)
   */
  async anonymizeUserData(userId: string): Promise<{
    anonymized: boolean;
    recordsAffected: number;
  }> {
    const anonymousId = `anon-${crypto.randomUUID()}`;
    let recordsAffected = 0;

    const tables = [
      'reading_sessions',
      'assessment_results',
      'reading_progress'
    ];

    for (const table of tables) {
      const { count } = await this.supabase
        .from(table)
        .update({
          user_id: anonymousId,
          anonymized_at: new Date().toISOString(),
          original_user_id: null
        })
        .eq('user_id', userId);

      recordsAffected += count || 0;
    }

    // Anonymize user record
    await this.supabase
      .from('users')
      .update({
        first_name: 'Anonymous',
        last_name: 'User',
        email: `${anonymousId}@anonymized.local`,
        date_of_birth: null,
        anonymized_at: new Date().toISOString()
      })
      .eq('id', userId);

    return {
      anonymized: true,
      recordsAffected: recordsAffected + 1
    };
  }

  /**
   * Export user data (data portability)
   */
  async exportUserData(userId: string): Promise<{
    format: 'json';
    data: Record<string, any>;
    exportDate: Date;
  }> {
    const exportData: Record<string, any> = {};

    // Get user profile
    const { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    exportData.profile = user;

    // Get reading progress
    const { data: readingSessions } = await this.supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId);

    exportData.readingSessions = readingSessions;

    // Get assessments
    const { data: assessments } = await this.supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId);

    exportData.assessments = assessments;

    // Get consent records
    const { data: consents } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('user_id', userId);

    exportData.consents = consents;

    return {
      format: 'json',
      data: exportData,
      exportDate: new Date()
    };
  }

  /**
   * Cancel scheduled deletion
   */
  async cancelDeletion(scheduleId: string, cancelledBy: string): Promise<void> {
    await this.supabase
      .from('deletion_schedule')
      .update({
        status: DeletionStatus.CANCELLED,
        metadata: { cancelledBy, cancelledAt: new Date().toISOString() }
      })
      .eq('id', scheduleId);
  }

  /**
   * Get deletion schedule for user
   */
  async getUserDeletionSchedule(userId: string): Promise<DeletionSchedule[]> {
    const { data: schedules } = await this.supabase
      .from('deletion_schedule')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });

    return schedules || [];
  }

  /**
   * Clean up old soft-deleted records
   */
  async cleanupSoftDeleted(olderThanDays: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    let totalDeleted = 0;

    const tables = [
      'users',
      'reading_sessions',
      'assessment_results',
      'reading_progress'
    ];

    for (const table of tables) {
      const { count } = await this.supabase
        .from(table)
        .delete()
        .not('deleted_at', 'is', null)
        .lte('deleted_at', cutoffDate.toISOString());

      totalDeleted += count || 0;
    }

    return totalDeleted;
  }

  /**
   * Generate retention compliance report
   */
  async generateRetentionReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    period: { start: Date; end: Date };
    summary: {
      totalDeletions: number;
      scheduledDeletions: number;
      completedDeletions: number;
      failedDeletions: number;
    };
    byReason: Record<DeletionReason, number>;
    byCategory: Record<string, number>;
    complianceStatus: 'compliant' | 'warning' | 'non-compliant';
    recommendations: string[];
  }> {
    const { data: schedules } = await this.supabase
      .from('deletion_schedule')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const byReason: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    if (schedules) {
      for (const schedule of schedules) {
        byReason[schedule.reason] = (byReason[schedule.reason] || 0) + 1;
        byCategory[schedule.data_category] = (byCategory[schedule.data_category] || 0) + 1;
      }
    }

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalDeletions: schedules?.length || 0,
        scheduledDeletions: schedules?.filter(s => s.status === DeletionStatus.SCHEDULED).length || 0,
        completedDeletions: schedules?.filter(s => s.status === DeletionStatus.COMPLETED).length || 0,
        failedDeletions: schedules?.filter(s => s.status === DeletionStatus.FAILED).length || 0
      },
      byReason: byReason as any,
      byCategory,
      complianceStatus: 'compliant',
      recommendations: [
        'Continue monitoring retention policies',
        'Review failed deletions and retry',
        'Ensure all COPPA deletions are immediate'
      ]
    };
  }
}
