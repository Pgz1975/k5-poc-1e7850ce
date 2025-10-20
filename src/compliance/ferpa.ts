/**
 * FERPA Compliance Module
 * Family Educational Rights and Privacy Act (20 U.S.C. § 1232g)
 *
 * Ensures protection of student educational records and personally identifiable information (PII)
 * Implements data privacy controls, encryption, and access restrictions for K-5 student data
 */

import { createClient } from '@supabase/supabase-js';

// FERPA-protected data categories
export enum FERPADataCategory {
  STUDENT_RECORDS = 'student_records',           // Academic records, grades
  PERSONALLY_IDENTIFIABLE = 'pii',               // Name, address, SSN, student ID
  DIRECTORY_INFORMATION = 'directory_info',      // Name, dates of attendance (requires opt-out)
  ASSESSMENT_DATA = 'assessment_data',           // Test scores, diagnostic results
  BEHAVIORAL_RECORDS = 'behavioral_records',     // Disciplinary records
  HEALTH_RECORDS = 'health_records',             // Medical information
  ATTENDANCE_RECORDS = 'attendance_records'      // Attendance patterns
}

// Access authorization levels
export enum FERPAAccessLevel {
  PARENT = 'parent',                             // Full access to own child's records
  STUDENT = 'student',                           // Limited access (18+ or eligible)
  TEACHER = 'teacher',                           // Access to assigned students only
  ADMINISTRATOR = 'administrator',               // School-wide access
  DISTRICT_ADMIN = 'district_admin',            // District-wide access
  AUTHORIZED_RESEARCHER = 'researcher',          // De-identified data only
  NONE = 'none'                                  // No access
}

// FERPA violation types
export enum FERPAViolationType {
  UNAUTHORIZED_DISCLOSURE = 'unauthorized_disclosure',
  IMPROPER_ACCESS = 'improper_access',
  MISSING_CONSENT = 'missing_consent',
  INADEQUATE_SECURITY = 'inadequate_security',
  RETENTION_VIOLATION = 'retention_violation',
  DIRECTORY_INFO_MISUSE = 'directory_info_misuse'
}

export interface FERPARecord {
  id: string;
  studentId: string;
  dataCategory: FERPADataCategory;
  data: any;
  encryptedData?: string;
  createdAt: Date;
  createdBy: string;
  accessLog: FERPAAccessLog[];
  consentRequired: boolean;
  consentObtained: boolean;
  consentDate?: Date;
  retentionPeriod: number; // Days
  deletionDate?: Date;
}

export interface FERPAAccessLog {
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  accessLevel: FERPAAccessLevel;
  action: 'view' | 'edit' | 'delete' | 'export' | 'share';
  recordId: string;
  purpose: string;
  ipAddress: string;
  authorized: boolean;
  denialReason?: string;
}

export interface FERPAConsent {
  id: string;
  studentId: string;
  parentId: string;
  consentType: 'directory_info' | 'third_party_disclosure' | 'research_participation';
  granted: boolean;
  grantedDate: Date;
  expirationDate?: Date;
  revokedDate?: Date;
  scope: string[];
  digitalSignature?: string;
}

export interface FERPADisclosure {
  id: string;
  studentId: string;
  recordId: string;
  recipientName: string;
  recipientOrganization: string;
  purpose: string;
  disclosureDate: Date;
  authorizedBy: string;
  consentId?: string;
  legalBasis: 'consent' | 'school_official' | 'court_order' | 'health_emergency' | 'research';
  dataShared: string[];
  expirationDate?: Date;
}

export class FERPAComplianceService {
  private supabase: any;
  private encryptionKey: CryptoKey | null = null;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    this.initializeEncryption();
  }

  /**
   * Initialize encryption for FERPA-protected data
   */
  private async initializeEncryption(): Promise<void> {
    try {
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(Deno.env.get('FERPA_ENCRYPTION_KEY') || 'default-key-replace-in-production'),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      this.encryptionKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('ferpa-salt-v1'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('FERPA encryption initialization failed:', error);
      throw new Error('Cannot initialize FERPA encryption');
    }
  }

  /**
   * Encrypt FERPA-protected data
   */
  async encryptData(data: any): Promise<string> {
    if (!this.encryptionKey) {
      await this.initializeEncryption();
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey!,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  /**
   * Decrypt FERPA-protected data
   */
  async decryptData(encryptedString: string): Promise<any> {
    if (!this.encryptionKey) {
      await this.initializeEncryption();
    }

    const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey!,
      encryptedData
    );

    return JSON.parse(new TextDecoder().decode(decryptedData));
  }

  /**
   * Check if user has FERPA-compliant access to student record
   */
  async checkAccess(
    userId: string,
    studentId: string,
    action: 'view' | 'edit' | 'delete' | 'export' | 'share'
  ): Promise<{ authorized: boolean; accessLevel: FERPAAccessLevel; reason?: string }> {
    // Get user role and relationship to student
    const { data: user } = await this.supabase
      .from('users')
      .select('role, id')
      .eq('id', userId)
      .single();

    if (!user) {
      return { authorized: false, accessLevel: FERPAAccessLevel.NONE, reason: 'User not found' };
    }

    // Check parent relationship
    const { data: parentRelationship } = await this.supabase
      .from('parent_student_relationships')
      .select('*')
      .eq('parent_id', userId)
      .eq('student_id', studentId)
      .eq('verified', true)
      .single();

    if (parentRelationship) {
      // Parents have full access to their child's records
      await this.logAccess(userId, studentId, action, FERPAAccessLevel.PARENT, true);
      return { authorized: true, accessLevel: FERPAAccessLevel.PARENT };
    }

    // Check teacher assignment
    if (user.role === 'teacher') {
      const { data: teacherAssignment } = await this.supabase
        .from('teacher_student_assignments')
        .select('*')
        .eq('teacher_id', userId)
        .eq('student_id', studentId)
        .gte('end_date', new Date().toISOString())
        .single();

      if (teacherAssignment) {
        // Teachers can view and edit assigned students
        const authorized = ['view', 'edit'].includes(action);
        await this.logAccess(userId, studentId, action, FERPAAccessLevel.TEACHER, authorized);
        return {
          authorized,
          accessLevel: FERPAAccessLevel.TEACHER,
          reason: authorized ? undefined : 'Teachers cannot delete or export student records'
        };
      }
    }

    // Check administrator access
    if (user.role === 'administrator' || user.role === 'district_admin') {
      const accessLevel = user.role === 'district_admin'
        ? FERPAAccessLevel.DISTRICT_ADMIN
        : FERPAAccessLevel.ADMINISTRATOR;

      // Administrators have broader access
      await this.logAccess(userId, studentId, action, accessLevel, true);
      return { authorized: true, accessLevel };
    }

    // Default: No access
    await this.logAccess(userId, studentId, action, FERPAAccessLevel.NONE, false, 'No relationship to student');
    return {
      authorized: false,
      accessLevel: FERPAAccessLevel.NONE,
      reason: 'No authorized relationship to student'
    };
  }

  /**
   * Log FERPA access attempt
   */
  private async logAccess(
    userId: string,
    studentId: string,
    action: string,
    accessLevel: FERPAAccessLevel,
    authorized: boolean,
    denialReason?: string
  ): Promise<void> {
    const { data: user } = await this.supabase
      .from('users')
      .select('full_name, role')
      .eq('id', userId)
      .single();

    await this.supabase.from('ferpa_access_logs').insert({
      timestamp: new Date().toISOString(),
      user_id: userId,
      user_name: user?.full_name || 'Unknown',
      user_role: user?.role || 'unknown',
      access_level: accessLevel,
      action,
      student_id: studentId,
      authorized,
      denial_reason: denialReason,
      ip_address: 'server-side', // In edge function, get from request
    });
  }

  /**
   * Record FERPA disclosure (data sharing)
   */
  async recordDisclosure(disclosure: Omit<FERPADisclosure, 'id' | 'disclosureDate'>): Promise<FERPADisclosure> {
    const disclosureRecord: FERPADisclosure = {
      id: crypto.randomUUID(),
      disclosureDate: new Date(),
      ...disclosure
    };

    await this.supabase.from('ferpa_disclosures').insert({
      id: disclosureRecord.id,
      student_id: disclosureRecord.studentId,
      record_id: disclosureRecord.recordId,
      recipient_name: disclosureRecord.recipientName,
      recipient_organization: disclosureRecord.recipientOrganization,
      purpose: disclosureRecord.purpose,
      disclosure_date: disclosureRecord.disclosureDate.toISOString(),
      authorized_by: disclosureRecord.authorizedBy,
      consent_id: disclosureRecord.consentId,
      legal_basis: disclosureRecord.legalBasis,
      data_shared: disclosureRecord.dataShared,
      expiration_date: disclosureRecord.expirationDate?.toISOString()
    });

    return disclosureRecord;
  }

  /**
   * Manage parental consent
   */
  async recordConsent(consent: Omit<FERPAConsent, 'id' | 'grantedDate'>): Promise<FERPAConsent> {
    const consentRecord: FERPAConsent = {
      id: crypto.randomUUID(),
      grantedDate: new Date(),
      ...consent
    };

    await this.supabase.from('ferpa_consents').insert({
      id: consentRecord.id,
      student_id: consentRecord.studentId,
      parent_id: consentRecord.parentId,
      consent_type: consentRecord.consentType,
      granted: consentRecord.granted,
      granted_date: consentRecord.grantedDate.toISOString(),
      expiration_date: consentRecord.expirationDate?.toISOString(),
      revoked_date: consentRecord.revokedDate?.toISOString(),
      scope: consentRecord.scope,
      digital_signature: consentRecord.digitalSignature
    });

    return consentRecord;
  }

  /**
   * Check if consent is required and obtained
   */
  async verifyConsent(studentId: string, purpose: string): Promise<{ required: boolean; obtained: boolean }> {
    // Directory information requires opt-out consent
    if (purpose === 'directory_info') {
      const { data: optOut } = await this.supabase
        .from('ferpa_consents')
        .select('*')
        .eq('student_id', studentId)
        .eq('consent_type', 'directory_info')
        .eq('granted', false)
        .is('revoked_date', null)
        .single();

      return { required: true, obtained: !optOut };
    }

    // Third-party disclosure requires explicit consent
    if (purpose === 'third_party_disclosure' || purpose === 'research_participation') {
      const { data: consent } = await this.supabase
        .from('ferpa_consents')
        .select('*')
        .eq('student_id', studentId)
        .eq('consent_type', purpose)
        .eq('granted', true)
        .is('revoked_date', null)
        .gte('expiration_date', new Date().toISOString())
        .single();

      return { required: true, obtained: !!consent };
    }

    return { required: false, obtained: true };
  }

  /**
   * Generate FERPA compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const [accessLogs, disclosures, violations] = await Promise.all([
      this.supabase
        .from('ferpa_access_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString()),

      this.supabase
        .from('ferpa_disclosures')
        .select('*')
        .gte('disclosure_date', startDate.toISOString())
        .lte('disclosure_date', endDate.toISOString()),

      this.supabase
        .from('ferpa_access_logs')
        .select('*')
        .eq('authorized', false)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
    ]);

    return {
      period: {
        start: startDate,
        end: endDate
      },
      summary: {
        totalAccessAttempts: accessLogs.data?.length || 0,
        authorizedAccess: accessLogs.data?.filter((log: any) => log.authorized).length || 0,
        deniedAccess: violations.data?.length || 0,
        disclosures: disclosures.data?.length || 0
      },
      accessByRole: this.groupByRole(accessLogs.data || []),
      disclosuresByBasis: this.groupByLegalBasis(disclosures.data || []),
      violations: violations.data || [],
      recommendations: this.generateRecommendations(accessLogs.data, violations.data)
    };
  }

  private groupByRole(logs: any[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.user_role] = (acc[log.user_role] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByLegalBasis(disclosures: any[]): Record<string, number> {
    return disclosures.reduce((acc, disclosure) => {
      acc[disclosure.legal_basis] = (acc[disclosure.legal_basis] || 0) + 1;
      return acc;
    }, {});
  }

  private generateRecommendations(accessLogs: any[], violations: any[]): string[] {
    const recommendations: string[] = [];

    if (violations && violations.length > 10) {
      recommendations.push('High number of unauthorized access attempts detected. Review access control policies.');
    }

    const uniqueUsers = new Set(accessLogs?.map(log => log.user_id) || []);
    if (uniqueUsers.size < 5) {
      recommendations.push('Low user engagement. Ensure staff are properly trained on system access.');
    }

    return recommendations;
  }

  /**
   * Enforce data retention policies
   */
  async enforceRetentionPolicies(): Promise<{ deleted: number; marked: number }> {
    const now = new Date();
    let deleted = 0;
    let marked = 0;

    // Find records past retention period
    const { data: expiredRecords } = await this.supabase
      .from('ferpa_records')
      .select('*')
      .lte('deletion_date', now.toISOString())
      .is('deleted_at', null);

    if (expiredRecords) {
      for (const record of expiredRecords) {
        await this.supabase
          .from('ferpa_records')
          .update({ deleted_at: now.toISOString() })
          .eq('id', record.id);
        deleted++;
      }
    }

    // Mark records approaching deletion
    const warningDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const { data: approachingRecords } = await this.supabase
      .from('ferpa_records')
      .select('*')
      .lte('deletion_date', warningDate.toISOString())
      .is('deletion_warning_sent', null);

    if (approachingRecords) {
      for (const record of approachingRecords) {
        await this.supabase
          .from('ferpa_records')
          .update({ deletion_warning_sent: now.toISOString() })
          .eq('id', record.id);
        marked++;
      }
    }

    return { deleted, marked };
  }
}

/**
 * Validate FERPA compliance for content
 */
export async function validateFERPACompliance(content: any): Promise<{
  compliant: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for PII in content
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email
    /\b\d{10}\b/g, // Phone numbers
    /\b\d{5}(-\d{4})?\b/g // ZIP codes
  ];

  for (const pattern of piiPatterns) {
    if (pattern.test(JSON.stringify(content))) {
      issues.push(`Potential PII detected: ${pattern.source}`);
    }
  }

  // Check for student names (basic check)
  if (content.studentName || content.student_name) {
    recommendations.push('Student name detected. Ensure proper access controls are in place.');
  }

  // Check for assessment data
  if (content.scores || content.grades || content.assessment_results) {
    recommendations.push('Assessment data detected. Requires FERPA protection and access logging.');
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations
  };
}
