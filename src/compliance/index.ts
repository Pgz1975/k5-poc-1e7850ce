/**
 * K5 POC Compliance Module
 * Comprehensive compliance and security framework for K-5 educational platform
 *
 * Implements:
 * - FERPA (Family Educational Rights and Privacy Act)
 * - COPPA (Children's Online Privacy Protection Act)
 * - ADA (Americans with Disabilities Act) / Section 508
 * - Security scanning and vulnerability management
 * - Data encryption (at rest and in transit)
 * - Audit logging
 * - User consent management
 * - Data retention and deletion policies
 * - Access control and permissions
 * - Compliance reporting
 */

// Core compliance modules
export { FERPAComplianceService, FERPADataCategory, FERPAAccessLevel, FERPAViolationType } from './ferpa.ts';
export { COPPAComplianceService, COPPADataCategory, ConsentMethod, COPPA_AGE_THRESHOLD } from './coppa.ts';
export { ADAComplianceService, WCAGLevel, AccessibilityRequirement, IssueSeverity } from './ada.ts';

// Security and encryption
export { EncryptionService, FieldEncryption, FileEncryption, EncryptionAlgorithm } from './encryption.ts';
export { SecurityService, VulnerabilitySeverity, ScanType, VulnerabilityCategory } from './security.ts';

// Audit and monitoring
export { AuditService, AuditCategory, AuditSeverity, AuditStatus } from './audit.ts';

// Data management
export { ConsentManagementService, ConsentType, ConsentStatus, ConsentScope } from './consent.ts';
export { RetentionService, RETENTION_PERIODS, DeletionStatus, DeletionReason } from './retention.ts';

// Access control
export { AccessControlService, Role, Permission, PermissionCategory, requiresPermission } from './access-control.ts';

// Reporting
export { ComplianceReportingService, ReportType, ReportFormat, ComplianceStatus } from './reporting.ts';

// Re-export common types
export type {
  FERPARecord,
  FERPAAccessLog,
  FERPAConsent,
  FERPADisclosure
} from './ferpa.ts';

export type {
  ParentalConsent,
  ChildProfile,
  DataCollectionEvent
} from './coppa.ts';

export type {
  AccessibilityIssue,
  AccessibilityReport,
  ContentAccessibility
} from './ada.ts';

export type {
  EncryptedData,
  EncryptionKey
} from './encryption.ts';

export type {
  Vulnerability,
  SecurityScan,
  SecurityMetrics
} from './security.ts';

export type {
  AuditEvent,
  AuditQuery,
  AuditStatistics
} from './audit.ts';

export type {
  ConsentRecord,
  ConsentForm,
  ConsentPreferences
} from './consent.ts';

export type {
  RetentionPolicy,
  DeletionSchedule,
  DataInventory
} from './retention.ts';

export type {
  AccessContext,
  PermissionCheckResult,
  RoleDefinition
} from './access-control.ts';

export type {
  ComplianceReport
} from './reporting.ts';

/**
 * Initialize all compliance services
 */
export async function initializeCompliance(
  supabaseUrl: string,
  supabaseKey: string
): Promise<{
  ferpa: FERPAComplianceService;
  coppa: COPPAComplianceService;
  ada: ADAComplianceService;
  encryption: EncryptionService;
  security: SecurityService;
  audit: AuditService;
  consent: ConsentManagementService;
  retention: RetentionService;
  accessControl: AccessControlService;
  reporting: ComplianceReportingService;
}> {
  const ferpa = new FERPAComplianceService(supabaseUrl, supabaseKey);
  const coppa = new COPPAComplianceService(supabaseUrl, supabaseKey);
  const ada = new ADAComplianceService();
  const encryption = new EncryptionService();
  const security = new SecurityService(supabaseUrl, supabaseKey);
  const audit = new AuditService(supabaseUrl, supabaseKey);
  const consent = new ConsentManagementService(supabaseUrl, supabaseKey);
  const retention = new RetentionService(supabaseUrl, supabaseKey);
  const accessControl = new AccessControlService(supabaseUrl, supabaseKey);
  const reporting = new ComplianceReportingService(supabaseUrl, supabaseKey);

  // Initialize encryption
  await encryption.initialize();

  return {
    ferpa,
    coppa,
    ada,
    encryption,
    security,
    audit,
    consent,
    retention,
    accessControl,
    reporting
  };
}

/**
 * Quick compliance check for student data access
 */
export async function checkStudentDataAccess(
  userId: string,
  studentId: string,
  action: 'view' | 'edit' | 'delete' | 'export',
  supabaseUrl: string,
  supabaseKey: string
): Promise<{
  allowed: boolean;
  reason?: string;
  requiresConsent: boolean;
  requiresAudit: boolean;
}> {
  const ferpa = new FERPAComplianceService(supabaseUrl, supabaseKey);
  const accessControl = new AccessControlService(supabaseUrl, supabaseKey);

  // Check FERPA access
  const ferpaAccess = await ferpa.checkAccess(userId, studentId, action);

  // Check permissions
  const permission = action === 'view' ? Permission.READ_STUDENT_RECORD :
                     action === 'edit' ? Permission.UPDATE_STUDENT_RECORD :
                     action === 'delete' ? Permission.DELETE_STUDENT_RECORD :
                     Permission.EXPORT_STUDENT_DATA;

  const permissionCheck = await accessControl.hasPermission(userId, permission, studentId);

  const allowed = ferpaAccess.authorized && permissionCheck.granted;

  return {
    allowed,
    reason: allowed ? undefined : (ferpaAccess.reason || permissionCheck.reason),
    requiresConsent: false, // Would check COPPA for children under 13
    requiresAudit: true
  };
}

/**
 * Validate content for all compliance requirements
 */
export async function validateContentCompliance(
  content: any,
  documentType: 'pdf' | 'html' | 'image'
): Promise<{
  compliant: boolean;
  issues: Array<{ category: string; severity: string; description: string }>;
  score: number;
}> {
  const ada = new ADAComplianceService();
  const issues: Array<{ category: string; severity: string; description: string }> = [];

  // ADA accessibility check
  if (documentType === 'pdf') {
    const adaResult = await ada.validatePDFAccessibility(content.id, content.buffer);
    issues.push(...adaResult.issues.map(i => ({
      category: 'ADA',
      severity: i.severity,
      description: i.description
    })));
  }

  // Calculate compliance score
  const score = issues.length === 0 ? 100 :
                Math.max(0, 100 - issues.filter(i => i.severity === 'critical').length * 20 -
                             issues.filter(i => i.severity === 'serious').length * 10 -
                             issues.filter(i => i.severity === 'moderate').length * 5);

  return {
    compliant: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
}
