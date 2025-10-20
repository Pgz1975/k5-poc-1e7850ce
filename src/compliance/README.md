# K5 POC Compliance Module

Comprehensive compliance and security framework for the K-5 Bilingual Reading Platform, ensuring adherence to federal and Puerto Rico educational regulations.

## 📋 Overview

This module implements critical compliance requirements for handling sensitive student data in an educational environment serving K-5 students in Puerto Rico.

### Compliance Standards

- **FERPA** (Family Educational Rights and Privacy Act) - Student educational record protection
- **COPPA** (Children's Online Privacy Protection Act) - Protection for children under 13
- **ADA/Section 508** - Accessibility for students with disabilities
- **Security Standards** - Industry best practices for data protection

## 🏗️ Architecture

```
src/compliance/
├── ferpa.ts              # FERPA compliance (student data protection)
├── coppa.ts              # COPPA compliance (children's privacy)
├── ada.ts                # ADA/Section 508 accessibility compliance
├── encryption.ts         # Data encryption (at rest & in transit)
├── audit.ts              # Comprehensive audit logging
├── consent.ts            # User consent management
├── retention.ts          # Data retention & deletion policies
├── security.ts           # Security scanning & vulnerability detection
├── access-control.ts     # RBAC and permission management
├── reporting.ts          # Compliance reporting utilities
└── index.ts              # Main exports and utilities
```

## 🚀 Features

### 1. FERPA Compliance (`ferpa.ts`)

**Purpose**: Protect student educational records per federal law

**Key Features**:
- Access control based on relationship (parent, teacher, administrator)
- Audit logging for all data access
- Parental consent management
- Data disclosure tracking
- Encryption for sensitive data
- Retention policy enforcement

**Usage**:
```typescript
import { FERPAComplianceService } from './compliance/ferpa.ts';

const ferpa = new FERPAComplianceService();

// Check access authorization
const access = await ferpa.checkAccess(userId, studentId, 'view');
if (access.authorized) {
  // Proceed with data access
  await ferpa.logAccess(userId, studentId, 'view', access.accessLevel, true);
}

// Record data disclosure
await ferpa.recordDisclosure({
  studentId,
  recordId,
  recipientName: 'Research Institution',
  purpose: 'Educational research',
  legalBasis: 'consent',
  authorizedBy: adminId
});
```

### 2. COPPA Compliance (`coppa.ts`)

**Purpose**: Protect children under 13 years old

**Key Features**:
- Parental consent verification
- Age verification
- Data minimization
- Consent expiration and renewal
- Immediate deletion upon consent revocation
- Consent audit trail

**Usage**:
```typescript
import { COPPAComplianceService } from './compliance/coppa.ts';

const coppa = new COPPAComplianceService();

// Check if user is under 13
const isChild = await coppa.isChildUnder13(userId);

// Request parental consent
if (isChild) {
  const { consentId } = await coppa.requestParentalConsent(
    childId,
    parentEmail,
    [COPPADataCategory.PERSONAL_INFORMATION, COPPADataCategory.BEHAVIORAL_DATA],
    ['Educational progress tracking', 'Personalized learning']
  );
}

// Verify consent before data collection
const hasConsent = await coppa.hasValidConsent(childId, COPPADataCategory.BEHAVIORAL_DATA);
if (hasConsent) {
  await coppa.logDataCollection(childId, dataCategory, data, purpose);
}
```

### 3. ADA Accessibility (`ada.ts`)

**Purpose**: Ensure content is accessible to students with disabilities

**Key Features**:
- WCAG 2.1 Level AA compliance
- PDF accessibility validation
- Image alt text checking
- Color contrast validation
- Reading level assessment
- Screen reader compatibility
- Automatic enhancement suggestions

**Usage**:
```typescript
import { ADAComplianceService } from './compliance/ada.ts';

const ada = new ADAComplianceService();

// Validate PDF accessibility
const report = await ada.validatePDFAccessibility(documentId, pdfBuffer);
if (report.overallScore < 80) {
  console.log('Accessibility issues:', report.issues);
}

// Validate image accessibility
const imageCheck = await ada.validateImageAccessibility(
  imageId,
  imageUrl,
  altText,
  'Diagram showing water cycle'
);

// Check color contrast
const contrast = ada.validateColorContrast('#000000', '#FFFFFF', 14, false);
console.log(`Contrast ratio: ${contrast.ratio}:1 (${contrast.compliant ? 'Pass' : 'Fail'})`);
```

### 4. Data Encryption (`encryption.ts`)

**Purpose**: Protect data at rest and in transit

**Key Features**:
- AES-256-GCM encryption for data at rest
- RSA-OAEP for asymmetric encryption
- Key wrapping and rotation
- Field-level encryption
- File encryption for large documents
- Secure key management

**Usage**:
```typescript
import { EncryptionService, FieldEncryption } from './compliance/encryption.ts';

const encryption = new EncryptionService();
await encryption.initialize();

// Encrypt sensitive data
const encrypted = await encryption.encryptDataAtRest(studentData, 'student-records');

// Decrypt when authorized
const decrypted = await encryption.decryptDataAtRest(encrypted);

// Field-level encryption for database
const fieldEncryption = new FieldEncryption();
await fieldEncryption.initialize();

const encryptedRecord = await fieldEncryption.encryptFields(
  student,
  ['ssn', 'address', 'parentPhone']
);
```

### 5. Audit Logging (`audit.ts`)

**Purpose**: Comprehensive audit trail for compliance

**Key Features**:
- All system operations logged
- FERPA/COPPA event tracking
- Buffered writes for performance
- Tamper detection
- Queryable audit logs
- Export for compliance reporting

**Usage**:
```typescript
import { AuditService, AuditCategory } from './compliance/audit.ts';

const audit = new AuditService();

// Log data access
await audit.logDataAccess(userId, 'student_record', studentId, 'view', {
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

// Log data modification
await audit.logDataModification(
  userId,
  'assessment_result',
  assessmentId,
  beforeState,
  afterState
);

// Log security event
await audit.logSecurityEvent(
  'unauthorized_access',
  'Failed login attempt from suspicious IP',
  AuditSeverity.WARNING,
  { ipAddress, attempts: 5 }
);

// Query audit logs
const { events } = await audit.query({
  startDate: new Date('2025-01-01'),
  endDate: new Date(),
  category: AuditCategory.DATA_ACCESS,
  userId: teacherId
});
```

### 6. Consent Management (`consent.ts`)

**Purpose**: Manage user consent and privacy preferences

**Key Features**:
- Parental consent tracking
- Multi-language consent forms
- Digital signatures
- Consent expiration and renewal
- Preference management
- Consent revocation

**Usage**:
```typescript
import { ConsentManagementService, ConsentType } from './compliance/consent.ts';

const consent = new ConsentManagementService();

// Request parental consent
const consentRecord = await consent.requestConsent(
  studentId,
  parentEmail,
  ConsentType.DATA_COLLECTION,
  'Track reading progress and personalize content',
  ['reading_activity', 'assessment_results'],
  12 // expires in 12 months
);

// Grant consent
await consent.grantConsent(
  consentId,
  parentId,
  'John Doe',
  ConsentScope.STANDARD,
  digitalSignature
);

// Check consent status
const hasConsent = await consent.hasValidConsent(studentId, ConsentType.DATA_COLLECTION);

// Update privacy preferences
await consent.updatePreferences(userId, {
  analyticsEnabled: true,
  personalizationEnabled: true,
  thirdPartySharing: false
});
```

### 7. Data Retention (`retention.ts`)

**Purpose**: Enforce data lifecycle policies

**Key Features**:
- Automated retention enforcement
- Scheduled deletion
- Grace periods for recovery
- Data export before deletion
- Soft delete support
- Anonymization option

**Retention Periods**:
- Student Records: 7 years
- Assessment Data: 5 years
- Reading Progress: 3 years
- Audit Logs: 7 years
- Session Data: 30 days
- COPPA Child Data: Immediate upon consent revocation

**Usage**:
```typescript
import { RetentionService, DeletionReason } from './compliance/retention.ts';

const retention = new RetentionService();

// Schedule data deletion
await retention.scheduleDeletion(
  'assessment_data',
  studentId,
  DeletionReason.RETENTION_EXPIRED,
  'system',
  30 // 30-day grace period
);

// Execute scheduled deletions
const results = await retention.executeScheduledDeletions();

// Get user data inventory
const inventory = await retention.getUserDataInventory(userId);

// Export user data (right to data portability)
const exportData = await retention.exportUserData(userId);

// Anonymize instead of delete (for research)
await retention.anonymizeUserData(userId);
```

### 8. Security Scanning (`security.ts`)

**Purpose**: Automated vulnerability detection

**Key Features**:
- SQL injection detection
- XSS vulnerability scanning
- Authentication weakness checks
- Configuration security audit
- API security validation
- Database security checks
- Vulnerability tracking
- Security scoring

**Usage**:
```typescript
import { SecurityService, ScanType } from './compliance/security.ts';

const security = new SecurityService();

// Run comprehensive security scan
const scan = await security.runSecurityScan([
  ScanType.SQL_INJECTION,
  ScanType.XSS,
  ScanType.AUTHENTICATION_SCAN,
  ScanType.API_SCAN
]);

console.log(`Found ${scan.vulnerabilitiesFound} vulnerabilities`);
console.log(`Critical: ${scan.criticalCount}, High: ${scan.highCount}`);

// Get open vulnerabilities
const openVulns = await security.getOpenVulnerabilities(VulnerabilitySeverity.HIGH);

// Calculate security score
const score = await security.calculateSecurityScore();
console.log(`Security score: ${score}/100`);

// Mark vulnerability as resolved
await security.resolveVulnerability(vulnId);
```

### 9. Access Control (`access-control.ts`)

**Purpose**: Role-based access control (RBAC)

**Roles**:
- Super Admin - Full system access
- District Admin - District-wide access
- School Admin - School-wide access
- Teacher - Assigned students only
- Parent - Own children only
- Student - Own data only
- Content Manager - Content management
- Auditor - Read-only audit access
- Researcher - Anonymized data only

**Usage**:
```typescript
import { AccessControlService, Permission, Role } from './compliance/access-control.ts';

const accessControl = new AccessControlService();

// Check single permission
const canView = await accessControl.hasPermission(
  userId,
  Permission.READ_STUDENT_RECORD,
  studentId
);

if (canView.granted) {
  // Proceed with operation
}

// Check multiple permissions
const canEdit = await accessControl.hasAllPermissions(
  userId,
  [Permission.READ_STUDENT_RECORD, Permission.UPDATE_STUDENT_RECORD],
  studentId
);

// Check student data access (FERPA-compliant)
const access = await accessControl.checkStudentDataAccess(
  userId,
  studentId,
  'grades'
);

// Assign role to user
await accessControl.assignRole(userId, Role.TEACHER, adminId);

// Grant custom permission
await accessControl.grantCustomPermission(
  userId,
  Permission.EXPORT_ASSESSMENT_DATA,
  adminId,
  new Date('2025-12-31') // expires
);
```

### 10. Compliance Reporting (`reporting.ts`)

**Purpose**: Generate compliance reports

**Key Features**:
- Comprehensive compliance reports
- FERPA-specific reports
- COPPA-specific reports
- Security audit reports
- Executive summaries
- Multiple export formats (JSON, CSV, HTML, PDF)
- Scheduled automated reports

**Usage**:
```typescript
import { ComplianceReportingService, ReportType } from './compliance/reporting.ts';

const reporting = new ComplianceReportingService();

// Generate comprehensive report
const report = await reporting.generateComprehensiveReport(
  new Date('2025-01-01'),
  new Date('2025-03-31'),
  adminId
);

// Generate executive summary
const summary = await reporting.generateExecutiveSummary(
  new Date('2025-01-01'),
  new Date(),
  adminId
);

console.log(`Compliance Score: ${summary.keyMetrics.complianceScore}/100`);
console.log(`Critical Issues: ${summary.keyMetrics.criticalIssues}`);

// Export report
const exported = await reporting.exportReport(reportId, ReportFormat.PDF);

// Schedule automated reports
await reporting.scheduleReport(
  ReportType.COMPREHENSIVE,
  'monthly',
  ['compliance@school.pr', 'admin@school.pr']
);
```

## 🔧 Quick Start

### Initialize All Services

```typescript
import { initializeCompliance } from './compliance/index.ts';

const compliance = await initializeCompliance(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Use individual services
await compliance.ferpa.checkAccess(userId, studentId, 'view');
await compliance.coppa.hasValidConsent(childId, dataCategory);
await compliance.audit.logDataAccess(userId, 'student_record', studentId, 'view');
```

### Quick Compliance Check

```typescript
import { checkStudentDataAccess } from './compliance/index.ts';

const access = await checkStudentDataAccess(
  userId,
  studentId,
  'view',
  supabaseUrl,
  supabaseKey
);

if (access.allowed) {
  // Access granted, proceed with operation
  // Log to audit trail since requiresAudit is true
}
```

### Content Validation

```typescript
import { validateContentCompliance } from './compliance/index.ts';

const validation = await validateContentCompliance(content, 'pdf');

if (!validation.compliant) {
  console.log('Accessibility issues:', validation.issues);
  console.log(`Compliance score: ${validation.score}/100`);
}
```

## 📊 Database Schema

### Required Tables

```sql
-- FERPA
CREATE TABLE ferpa_access_logs (...);
CREATE TABLE ferpa_disclosures (...);
CREATE TABLE ferpa_consents (...);

-- COPPA
CREATE TABLE coppa_consents (...);
CREATE TABLE coppa_consent_requests (...);
CREATE TABLE coppa_data_collection_logs (...);

-- Audit
CREATE TABLE audit_logs (...);
CREATE TABLE security_alerts (...);

-- Consent
CREATE TABLE consent_records (...);
CREATE TABLE consent_preferences (...);

-- Retention
CREATE TABLE deletion_schedule (...);
CREATE TABLE retention_policies (...);

-- Security
CREATE TABLE security_scans (...);
CREATE TABLE vulnerabilities (...);

-- Access Control
CREATE TABLE custom_permissions (...);
CREATE TABLE role_assignments (...);
CREATE TABLE data_access_requests (...);

-- Reporting
CREATE TABLE compliance_reports (...);
CREATE TABLE report_schedules (...);
```

## 🔐 Environment Variables

```bash
# Required
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Encryption (generate strong keys in production)
MASTER_ENCRYPTION_KEY=your-master-key-here
FERPA_ENCRYPTION_KEY=your-ferpa-key-here

# Optional
APP_URL=https://k5-reading.example.com
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

## ✅ Best Practices

1. **Always log data access** - FERPA requires comprehensive audit trails
2. **Verify consent before data collection** - COPPA requirement for children under 13
3. **Encrypt sensitive data** - Both at rest and in transit
4. **Implement principle of least privilege** - Users should only have necessary permissions
5. **Regular security scans** - Run automated scans weekly
6. **Review access logs** - Monitor for suspicious activity
7. **Test accessibility** - Validate all content meets WCAG 2.1 AA
8. **Honor deletion requests** - Comply with data retention policies
9. **Document everything** - Maintain compliance documentation
10. **Train staff** - Ensure all users understand compliance requirements

## 📈 Monitoring & Alerts

Set up automated monitoring for:
- Failed access attempts
- Consent expirations
- Security vulnerabilities
- Data retention deadlines
- Accessibility issues
- Compliance score drops

## 🚨 Incident Response

If a compliance violation is detected:

1. **Document** - Log the incident in audit system
2. **Contain** - Prevent further violations
3. **Assess** - Determine scope and impact
4. **Notify** - Alert appropriate parties (parents, administrators)
5. **Remediate** - Fix the issue and prevent recurrence
6. **Report** - File required compliance reports

## 📚 Additional Resources

- [FERPA Regulations](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
- [COPPA Requirements](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

## 📄 License

This compliance module is part of the K5 POC project for the Puerto Rico Department of Education.

---

**Important**: This module handles sensitive student data. Always consult legal counsel for compliance questions specific to your jurisdiction.
