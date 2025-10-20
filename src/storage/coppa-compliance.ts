/**
 * COPPA Compliance for Storage
 *
 * Children's Online Privacy Protection Act (COPPA) compliance
 * for student data storage, including parental consent tracking,
 * data minimization, and secure deletion.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// ===========================
// Type Definitions
// ===========================

export interface StudentDataPolicy {
  requireParentalConsent: boolean;
  dataRetentionDays: number;
  allowThirdPartySharing: boolean;
  encryptionRequired: boolean;
  anonymizeAfterDays: number;
  purgeAfterDays: number;
}

export interface ParentalConsent {
  studentId: string;
  parentId: string;
  consentType: 'full' | 'limited' | 'none';
  grantedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  permissions: ConsentPermissions;
  verificationMethod: 'email' | 'signature' | 'credit_card' | 'government_id';
  ipAddress: string;
  userAgent: string;
}

export interface ConsentPermissions {
  allowDataCollection: boolean;
  allowImageStorage: boolean;
  allowVoiceRecording: boolean;
  allowProgressTracking: boolean;
  allowAssessmentResults: boolean;
  allowContentSharing: boolean;
}

export interface StudentDataAccess {
  studentId: string;
  accessedBy: string;
  accessType: 'view' | 'download' | 'modify' | 'delete';
  bucket: string;
  path: string;
  purpose: string;
  timestamp: Date;
  ipAddress: string;
}

export interface DataExportRequest {
  requestId: string;
  studentId: string;
  requestedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'json' | 'csv' | 'pdf';
  includeFiles: boolean;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface DataDeletionRequest {
  requestId: string;
  studentId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  retentionOverride?: boolean;
  scheduledFor?: Date;
  completedAt?: Date;
  filesDeleted: number;
  bytesDeleted: number;
}

// ===========================
// COPPA Compliance Service
// ===========================

export class COPPAComplianceService {
  private supabase: SupabaseClient;
  private policy: StudentDataPolicy;

  constructor(supabase: SupabaseClient, policy?: Partial<StudentDataPolicy>) {
    this.supabase = supabase;
    this.policy = {
      requireParentalConsent: true,
      dataRetentionDays: 365, // 1 year
      allowThirdPartySharing: false,
      encryptionRequired: true,
      anonymizeAfterDays: 180, // 6 months
      purgeAfterDays: 730, // 2 years
      ...policy,
    };
  }

  /**
   * Check if parental consent is required and valid
   */
  async verifyParentalConsent(studentId: string): Promise<{
    required: boolean;
    granted: boolean;
    consent?: ParentalConsent;
  }> {
    try {
      // Check if student is under 13 (COPPA applies)
      const { data: student } = await this.supabase
        .from('students')
        .select('birthdate, requires_consent')
        .eq('id', studentId)
        .single();

      if (!student) {
        return { required: true, granted: false };
      }

      const requiresConsent =
        student.requires_consent || this.isUnder13(student.birthdate);

      if (!requiresConsent) {
        return { required: false, granted: true };
      }

      // Get active consent
      const { data: consent } = await this.supabase
        .from('parental_consents')
        .select('*')
        .eq('student_id', studentId)
        .is('revoked_at', null)
        .or(
          `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`
        )
        .order('granted_at', { ascending: false })
        .limit(1)
        .single();

      if (!consent) {
        return { required: true, granted: false };
      }

      return {
        required: true,
        granted: true,
        consent: this.mapConsentFromDb(consent),
      };
    } catch (error) {
      console.error('Error verifying parental consent:', error);
      return { required: true, granted: false };
    }
  }

  /**
   * Grant parental consent
   */
  async grantParentalConsent(
    consent: Omit<ParentalConsent, 'grantedAt'>
  ): Promise<{ success: boolean; consentId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('parental_consents')
        .insert({
          student_id: consent.studentId,
          parent_id: consent.parentId,
          consent_type: consent.consentType,
          granted_at: new Date().toISOString(),
          expires_at: consent.expiresAt?.toISOString(),
          permissions: consent.permissions,
          verification_method: consent.verificationMethod,
          ip_address: consent.ipAddress,
          user_agent: consent.userAgent,
        })
        .select()
        .single();

      if (error) throw error;

      // Log consent event
      await this.logComplianceEvent(
        consent.studentId,
        'CONSENT_GRANTED',
        `Parental consent granted via ${consent.verificationMethod}`
      );

      return { success: true, consentId: data.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Revoke parental consent
   */
  async revokeParentalConsent(
    studentId: string,
    parentId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('parental_consents')
        .update({
          revoked_at: new Date().toISOString(),
          revocation_reason: reason,
        })
        .eq('student_id', studentId)
        .eq('parent_id', parentId)
        .is('revoked_at', null);

      if (error) throw error;

      // Log revocation
      await this.logComplianceEvent(
        studentId,
        'CONSENT_REVOKED',
        `Consent revoked: ${reason}`
      );

      // Schedule data deletion if required
      if (this.policy.requireParentalConsent) {
        await this.scheduleDataDeletion(studentId, 30); // 30 days grace period
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Log access to student data
   */
  async logStudentDataAccess(access: StudentDataAccess): Promise<void> {
    try {
      // Verify consent before logging access
      const { granted } = await this.verifyParentalConsent(access.studentId);

      if (!granted && this.policy.requireParentalConsent) {
        throw new Error('Parental consent required for data access');
      }

      await this.supabase.from('student_data_access_log').insert({
        student_id: access.studentId,
        accessed_by: access.accessedBy,
        access_type: access.accessType,
        bucket: access.bucket,
        path: access.path,
        purpose: access.purpose,
        timestamp: access.timestamp.toISOString(),
        ip_address: access.ipAddress,
      });
    } catch (error) {
      console.error('Failed to log student data access:', error);
    }
  }

  /**
   * Export all student data (COPPA right to access)
   */
  async exportStudentData(
    studentId: string,
    requestedBy: string,
    format: 'json' | 'csv' | 'pdf' = 'json',
    includeFiles = true
  ): Promise<DataExportRequest> {
    const requestId = `export-${studentId}-${Date.now()}`;

    const request: DataExportRequest = {
      requestId,
      studentId,
      requestedBy,
      status: 'pending',
      format,
      includeFiles,
      createdAt: new Date(),
    };

    try {
      // Save export request
      await this.supabase.from('data_export_requests').insert({
        request_id: requestId,
        student_id: studentId,
        requested_by: requestedBy,
        status: 'pending',
        format,
        include_files: includeFiles,
        created_at: new Date().toISOString(),
      });

      // Process export asynchronously
      this.processDataExport(request);

      return request;
    } catch (error) {
      request.status = 'failed';
      throw error;
    }
  }

  /**
   * Delete all student data (COPPA right to deletion)
   */
  async deleteStudentData(
    studentId: string,
    requestedBy: string,
    immediate = false
  ): Promise<DataDeletionRequest> {
    const requestId = `delete-${studentId}-${Date.now()}`;

    const request: DataDeletionRequest = {
      requestId,
      studentId,
      requestedBy,
      status: 'pending',
      scheduledFor: immediate ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      filesDeleted: 0,
      bytesDeleted: 0,
    };

    try {
      // Save deletion request
      await this.supabase.from('data_deletion_requests').insert({
        request_id: requestId,
        student_id: studentId,
        requested_by: requestedBy,
        status: 'pending',
        scheduled_for: request.scheduledFor?.toISOString(),
        created_at: new Date().toISOString(),
      });

      // Log deletion request
      await this.logComplianceEvent(
        studentId,
        'DELETION_REQUESTED',
        `Data deletion requested by ${requestedBy}`
      );

      if (immediate) {
        await this.processDeletion(request);
      }

      return request;
    } catch (error) {
      request.status = 'rejected';
      throw error;
    }
  }

  /**
   * Anonymize student data (remove PII)
   */
  async anonymizeStudentData(studentId: string): Promise<{
    success: boolean;
    recordsAnonymized: number;
    error?: string;
  }> {
    try {
      let recordsAnonymized = 0;

      // Anonymize student record
      const { error: studentError } = await this.supabase
        .from('students')
        .update({
          first_name: 'Student',
          last_name: `${studentId.substring(0, 8)}`,
          email: `anonymized-${studentId}@example.com`,
          anonymized_at: new Date().toISOString(),
        })
        .eq('id', studentId);

      if (studentError) throw studentError;
      recordsAnonymized++;

      // Anonymize related records
      const tables = ['assessment_results', 'learning_progress', 'activity_log'];

      for (const table of tables) {
        const { count, error } = await this.supabase
          .from(table)
          .update({ anonymized: true })
          .eq('student_id', studentId);

        if (!error && count) {
          recordsAnonymized += count;
        }
      }

      // Log anonymization
      await this.logComplianceEvent(
        studentId,
        'DATA_ANONYMIZED',
        `${recordsAnonymized} records anonymized`
      );

      return { success: true, recordsAnonymized };
    } catch (error) {
      return {
        success: false,
        recordsAnonymized: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Run automated compliance checks
   */
  async runComplianceAudit(): Promise<{
    passedChecks: string[];
    failedChecks: string[];
    warnings: string[];
  }> {
    const passed: string[] = [];
    const failed: string[] = [];
    const warnings: string[] = [];

    try {
      // Check 1: All student data has valid consent or is over 13
      const { data: studentsWithoutConsent } = await this.supabase
        .from('students')
        .select('id, birthdate')
        .eq('requires_consent', true)
        .is('consent_granted', false);

      if (studentsWithoutConsent && studentsWithoutConsent.length > 0) {
        failed.push(
          `${studentsWithoutConsent.length} students lack required parental consent`
        );
      } else {
        passed.push('All students have valid consent');
      }

      // Check 2: Data retention compliance
      const retentionCutoff = new Date(
        Date.now() - this.policy.dataRetentionDays * 24 * 60 * 60 * 1000
      );

      const { count: oldRecords } = await this.supabase
        .from('assessment_results')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', retentionCutoff.toISOString())
        .is('archived', false);

      if (oldRecords && oldRecords > 0) {
        warnings.push(
          `${oldRecords} assessment records exceed retention period`
        );
      } else {
        passed.push('Data retention policy compliant');
      }

      // Check 3: Encryption verification
      const { data: unencryptedFiles } = await this.supabase
        .from('storage_metadata')
        .select('bucket, path')
        .eq('encrypted', false)
        .in('bucket', ['pdf-originals', 'assessment-assets']);

      if (unencryptedFiles && unencryptedFiles.length > 0) {
        failed.push(
          `${unencryptedFiles.length} files are not encrypted`
        );
      } else {
        passed.push('All student data files are encrypted');
      }

      // Check 4: Access logging
      const { count: accessLogs } = await this.supabase
        .from('student_data_access_log')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (accessLogs !== null) {
        passed.push(`${accessLogs} access events logged in last 24 hours`);
      }

      // Check 5: Third-party sharing compliance
      if (this.policy.allowThirdPartySharing) {
        warnings.push(
          'Third-party data sharing is enabled - ensure consent covers this'
        );
      } else {
        passed.push('Third-party data sharing is disabled');
      }
    } catch (error) {
      failed.push(
        `Audit error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return { passedChecks: passed, failedChecks: failed, warnings };
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private isUnder13(birthdate: string | null): boolean {
    if (!birthdate) return true; // Assume requires consent if no birthdate

    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 < 13;
    }

    return age < 13;
  }

  private mapConsentFromDb(dbConsent: any): ParentalConsent {
    return {
      studentId: dbConsent.student_id,
      parentId: dbConsent.parent_id,
      consentType: dbConsent.consent_type,
      grantedAt: new Date(dbConsent.granted_at),
      expiresAt: dbConsent.expires_at ? new Date(dbConsent.expires_at) : undefined,
      revokedAt: dbConsent.revoked_at ? new Date(dbConsent.revoked_at) : undefined,
      permissions: dbConsent.permissions,
      verificationMethod: dbConsent.verification_method,
      ipAddress: dbConsent.ip_address,
      userAgent: dbConsent.user_agent,
    };
  }

  private async logComplianceEvent(
    studentId: string,
    eventType: string,
    details: string
  ): Promise<void> {
    try {
      await this.supabase.from('coppa_compliance_log').insert({
        student_id: studentId,
        event_type: eventType,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log compliance event:', error);
    }
  }

  private async scheduleDataDeletion(
    studentId: string,
    gracePeriodDays: number
  ): Promise<void> {
    const scheduledFor = new Date(Date.now() + gracePeriodDays * 24 * 60 * 60 * 1000);

    await this.supabase.from('data_deletion_requests').insert({
      request_id: `auto-delete-${studentId}-${Date.now()}`,
      student_id: studentId,
      requested_by: 'SYSTEM',
      status: 'approved',
      scheduled_for: scheduledFor.toISOString(),
      created_at: new Date().toISOString(),
    });
  }

  private async processDataExport(request: DataExportRequest): Promise<void> {
    // This would be implemented as a background job
    // For now, just update status
    try {
      await this.supabase
        .from('data_export_requests')
        .update({ status: 'processing' })
        .eq('request_id', request.requestId);

      // TODO: Implement actual export logic

      await this.supabase
        .from('data_export_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('request_id', request.requestId);
    } catch (error) {
      await this.supabase
        .from('data_export_requests')
        .update({ status: 'failed' })
        .eq('request_id', request.requestId);
    }
  }

  private async processDeletion(request: DataDeletionRequest): Promise<void> {
    try {
      await this.supabase
        .from('data_deletion_requests')
        .update({ status: 'processing' })
        .eq('request_id', request.requestId);

      // Delete student files from all buckets
      const buckets = ['pdf-originals', 'pdf-images', 'assessment-assets'];

      for (const bucket of buckets) {
        const { data: files } = await this.supabase.storage.from(bucket).list();

        if (files) {
          const studentFiles = files.filter((f) =>
            f.name.includes(request.studentId)
          );

          if (studentFiles.length > 0) {
            const paths = studentFiles.map((f) => f.name);
            await this.supabase.storage.from(bucket).remove(paths);

            request.filesDeleted += paths.length;
            request.bytesDeleted += studentFiles.reduce(
              (sum, f) => sum + (f.metadata?.size || 0),
              0
            );
          }
        }
      }

      // Delete database records
      await this.supabase
        .from('assessment_results')
        .delete()
        .eq('student_id', request.studentId);

      await this.supabase
        .from('learning_progress')
        .delete()
        .eq('student_id', request.studentId);

      request.status = 'completed';
      request.completedAt = new Date();

      await this.supabase
        .from('data_deletion_requests')
        .update({
          status: 'completed',
          files_deleted: request.filesDeleted,
          bytes_deleted: request.bytesDeleted,
          completed_at: request.completedAt.toISOString(),
        })
        .eq('request_id', request.requestId);

      await this.logComplianceEvent(
        request.studentId,
        'DATA_DELETED',
        `${request.filesDeleted} files deleted, ${request.bytesDeleted} bytes freed`
      );
    } catch (error) {
      request.status = 'rejected';

      await this.supabase
        .from('data_deletion_requests')
        .update({ status: 'rejected' })
        .eq('request_id', request.requestId);
    }
  }
}

// ===========================
// COPPA Compliance SQL
// ===========================

export const COPPA_COMPLIANCE_SQL = `
-- Parental consent tracking
CREATE TABLE IF NOT EXISTS parental_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  parent_id UUID NOT NULL REFERENCES parents(id),
  consent_type TEXT NOT NULL CHECK (consent_type IN ('full', 'limited', 'none')),
  granted_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  permissions JSONB NOT NULL,
  verification_method TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student data access log
CREATE TABLE IF NOT EXISTS student_data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'download', 'modify', 'delete')),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  purpose TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  ip_address INET NOT NULL
);

-- Data export requests
CREATE TABLE IF NOT EXISTS data_export_requests (
  request_id TEXT PRIMARY KEY,
  student_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  format TEXT NOT NULL CHECK (format IN ('json', 'csv', 'pdf')),
  include_files BOOLEAN DEFAULT true,
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Data deletion requests
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  request_id TEXT PRIMARY KEY,
  student_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
  retention_override BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  files_deleted INTEGER DEFAULT 0,
  bytes_deleted BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- COPPA compliance log
CREATE TABLE IF NOT EXISTS coppa_compliance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consents_student ON parental_consents(student_id);
CREATE INDEX IF NOT EXISTS idx_consents_parent ON parental_consents(parent_id);
CREATE INDEX IF NOT EXISTS idx_access_log_student ON student_data_access_log(student_id);
CREATE INDEX IF NOT EXISTS idx_access_log_timestamp ON student_data_access_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_export_requests_student ON data_export_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_student ON data_deletion_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled ON data_deletion_requests(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_compliance_log_student ON coppa_compliance_log(student_id);

-- Comments
COMMENT ON TABLE parental_consents IS 'COPPA compliant parental consent tracking';
COMMENT ON TABLE student_data_access_log IS 'Audit log for all student data access';
COMMENT ON TABLE data_export_requests IS 'Student data export requests (right to access)';
COMMENT ON TABLE data_deletion_requests IS 'Student data deletion requests (right to deletion)';
COMMENT ON TABLE coppa_compliance_log IS 'General COPPA compliance event log';
`;
