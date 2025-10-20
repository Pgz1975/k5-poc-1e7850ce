/**
 * Compliance Types and Interfaces
 *
 * Core types for FERPA, ADA, COPPA compliance and security
 */

// ============================================================================
// FERPA Types
// ============================================================================

export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  GUARDIAN = 'guardian',
  TEACHER = 'teacher',
  ADMINISTRATOR = 'administrator',
  SCHOOL_OFFICIAL = 'school_official',
  COUNSELOR = 'counselor'
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
  EXPORT = 'export',
  AUDIT = 'audit'
}

export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}

export interface AccessControl {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  resources: string[];
  expiresAt?: Date;
  grantedBy: string;
  grantedAt: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  dataClassification: DataClassification;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'denied';
  details?: Record<string, any>;
  sessionId: string;
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriod: number; // in days
  archiveAfter?: number; // in days
  deleteAfter: number; // in days
  exceptions?: string[];
}

// ============================================================================
// ADA Types
// ============================================================================

export enum AccessibilityFeature {
  SCREEN_READER = 'screen_reader',
  HIGH_CONTRAST = 'high_contrast',
  LARGE_TEXT = 'large_text',
  KEYBOARD_NAVIGATION = 'keyboard_navigation',
  TEXT_TO_SPEECH = 'text_to_speech',
  CLOSED_CAPTIONS = 'closed_captions',
  ALTERNATIVE_TEXT = 'alternative_text'
}

export interface AccessibilityProfile {
  userId: string;
  enabledFeatures: AccessibilityFeature[];
  preferences: {
    fontSize?: number;
    contrast?: 'normal' | 'high' | 'maximum';
    colorScheme?: 'light' | 'dark' | 'custom';
    speechRate?: number;
    keyboardShortcuts?: Record<string, string>;
  };
  assistiveTechnology?: string[];
}

export interface AccessibleContent {
  content: string;
  alternativeText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  metadata: {
    isAccessible: boolean;
    features: AccessibilityFeature[];
    lastChecked: Date;
  };
}

// ============================================================================
// COPPA Types
// ============================================================================

export enum ConsentType {
  PARENTAL_CONSENT = 'parental_consent',
  DATA_COLLECTION = 'data_collection',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  MARKETING = 'marketing',
  RESEARCH = 'research'
}

export enum ConsentStatus {
  PENDING = 'pending',
  GRANTED = 'granted',
  DENIED = 'denied',
  REVOKED = 'revoked',
  EXPIRED = 'expired'
}

export interface AgeVerification {
  userId: string;
  dateOfBirth: Date;
  verificationMethod: 'self_reported' | 'parent_verified' | 'document_verified';
  verifiedAt: Date;
  verifiedBy?: string;
  isUnder13: boolean;
}

export interface ParentalConsent {
  id: string;
  childUserId: string;
  parentEmail: string;
  parentName: string;
  consentType: ConsentType;
  status: ConsentStatus;
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  verificationToken: string;
  ipAddress: string;
  signature?: string;
}

export interface DataMinimization {
  userId: string;
  collectedData: string[];
  purpose: string;
  minimumRequired: string[];
  optional: string[];
  justification: Record<string, string>;
}

// ============================================================================
// Security Types
// ============================================================================

export interface SecurityContext {
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  csrfToken: string;
  requestId: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (ctx: SecurityContext) => string;
}

export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  saltRounds: number;
  encoding: BufferEncoding;
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'date' | 'file' | 'custom';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  sanitizer?: (value: any) => any;
}

// ============================================================================
// Privacy Types
// ============================================================================

export interface PrivacySettings {
  userId: string;
  dataSharing: {
    withTeachers: boolean;
    withParents: boolean;
    withSchool: boolean;
    withThirdParty: boolean;
  };
  anonymization: {
    enabled: boolean;
    level: 'basic' | 'standard' | 'maximum';
  };
  dataRetention: {
    autoDelete: boolean;
    retentionDays: number;
  };
  marketing: {
    emailOptIn: boolean;
    smsOptIn: boolean;
  };
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'json' | 'csv' | 'pdf';
  dataTypes: string[];
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  scheduledFor: Date;
  completedAt?: Date;
  status: 'pending' | 'scheduled' | 'processing' | 'completed' | 'cancelled';
  dataTypes: string[];
  retainLegal: boolean;
  confirmation: {
    required: boolean;
    confirmedAt?: Date;
    confirmationMethod?: string;
  };
}

export interface AnonymizationConfig {
  fields: string[];
  method: 'hash' | 'mask' | 'remove' | 'generalize';
  preserveFormat?: boolean;
  customRules?: Record<string, (value: any) => any>;
}

// ============================================================================
// Compliance Reporting Types
// ============================================================================

export interface ComplianceReport {
  id: string;
  type: 'ferpa' | 'ada' | 'coppa' | 'security' | 'privacy';
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalUsers: number;
    dataAccesses: number;
    securityIncidents: number;
    consentRequests: number;
    accessibilityIssues: number;
  };
  violations?: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  recommendations: string[];
  generatedBy: string;
}

export interface ComplianceViolation {
  id: string;
  type: 'ferpa' | 'ada' | 'coppa' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  userId?: string;
  resource?: string;
  automaticAction?: string;
  requiresManualReview: boolean;
  resolvedAt?: Date;
  resolution?: string;
}
