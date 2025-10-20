/**
 * COPPA Compliance - Data Minimization
 *
 * Minimize data collection for children under 13
 */

import { DataMinimization } from '../types';

// ============================================================================
// Data Minimization Manager
// ============================================================================

export class DataMinimizationManager {
  private policies: Map<string, DataMinimization> = new Map();

  // Fields that are always prohibited for children under 13
  private readonly PROHIBITED_FIELDS = [
    'phoneNumber',
    'address',
    'geolocation',
    'creditCard',
    'socialSecurityNumber',
    'photos',
    'videos'
  ];

  // Fields that require explicit parental consent
  private readonly CONSENT_REQUIRED_FIELDS = [
    'email',
    'fullName',
    'dateOfBirth',
    'schoolName',
    'gradeLevel'
  ];

  // Minimum fields required for basic functionality
  private readonly MINIMUM_REQUIRED_FIELDS = [
    'userId',
    'username',
    'parentEmail'
  ];

  /**
   * Define data collection policy for user
   */
  definePolicy(
    userId: string,
    purpose: string,
    collectedData: string[]
  ): DataMinimization {
    const minimumRequired = this.MINIMUM_REQUIRED_FIELDS;
    const optional = collectedData.filter(field =>
      !minimumRequired.includes(field)
    );

    const justification: Record<string, string> = {};
    for (const field of collectedData) {
      justification[field] = this.getFieldJustification(field, purpose);
    }

    const policy: DataMinimization = {
      userId,
      collectedData,
      purpose,
      minimumRequired,
      optional,
      justification
    };

    this.policies.set(userId, policy);
    return policy;
  }

  /**
   * Validate data collection request
   */
  validateCollection(
    userId: string,
    requestedFields: string[],
    purpose: string
  ): {
    allowed: string[];
    denied: string[];
    requiresConsent: string[];
    violations: string[];
  } {
    const allowed: string[] = [];
    const denied: string[] = [];
    const requiresConsent: string[] = [];
    const violations: string[] = [];

    for (const field of requestedFields) {
      if (this.PROHIBITED_FIELDS.includes(field)) {
        denied.push(field);
        violations.push(`Field '${field}' is prohibited for children under 13`);
      } else if (this.CONSENT_REQUIRED_FIELDS.includes(field)) {
        requiresConsent.push(field);
      } else if (this.MINIMUM_REQUIRED_FIELDS.includes(field)) {
        allowed.push(field);
      } else {
        // Additional validation based on purpose
        if (this.isJustified(field, purpose)) {
          allowed.push(field);
        } else {
          denied.push(field);
          violations.push(`Field '${field}' not justified for purpose '${purpose}'`);
        }
      }
    }

    return { allowed, denied, requiresConsent, violations };
  }

  /**
   * Filter data to minimum required
   */
  filterToMinimum<T extends Record<string, any>>(
    data: T,
    userId: string
  ): Partial<T> {
    const policy = this.policies.get(userId);
    const allowedFields = policy?.minimumRequired || this.MINIMUM_REQUIRED_FIELDS;

    const filtered: Partial<T> = {};
    for (const field of allowedFields) {
      if (field in data) {
        filtered[field as keyof T] = data[field];
      }
    }

    return filtered;
  }

  /**
   * Check if field is necessary for purpose
   */
  isNecessary(field: string, purpose: string): boolean {
    const necessaryMap: Record<string, string[]> = {
      'authentication': ['userId', 'username', 'parentEmail'],
      'education': ['userId', 'username', 'gradeLevel', 'schoolName'],
      'communication': ['userId', 'username', 'email'],
      'progress_tracking': ['userId', 'username']
    };

    return necessaryMap[purpose]?.includes(field) || false;
  }

  /**
   * Get justification for field
   */
  private getFieldJustification(field: string, purpose: string): string {
    const justifications: Record<string, Record<string, string>> = {
      'authentication': {
        'userId': 'Required for account identification',
        'username': 'Required for login',
        'parentEmail': 'Required for parental notifications'
      },
      'education': {
        'gradeLevel': 'Required for age-appropriate content',
        'schoolName': 'Required for school-specific features'
      },
      'communication': {
        'email': 'Required for important notifications (with parental consent)'
      }
    };

    return justifications[purpose]?.[field] || 'Not justified';
  }

  /**
   * Check if field collection is justified
   */
  private isJustified(field: string, purpose: string): boolean {
    return this.isNecessary(field, purpose);
  }

  /**
   * Anonymize data for children
   */
  anonymizeChildData<T extends Record<string, any>>(data: T): T {
    const anonymized = { ...data };

    // Remove or hash identifiable information
    const identifiableFields = [
      'fullName', 'firstName', 'lastName', 'email',
      'phoneNumber', 'address', 'city', 'zipCode'
    ];

    for (const field of identifiableFields) {
      if (field in anonymized) {
        anonymized[field] = this.hashField(String(anonymized[field]));
      }
    }

    return anonymized;
  }

  /**
   * Hash field value
   */
  private hashField(value: string): string {
    // Simple hash for anonymization
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(value).digest('hex').substr(0, 8);
  }

  /**
   * Generate data collection report
   */
  generateReport(userId: string): {
    policy: DataMinimization | undefined;
    compliance: {
      minimumDataOnly: boolean;
      noProhibitedFields: boolean;
      allFieldsJustified: boolean;
      score: number;
    };
    recommendations: string[];
  } {
    const policy = this.policies.get(userId);
    const recommendations: string[] = [];

    if (!policy) {
      return {
        policy: undefined,
        compliance: {
          minimumDataOnly: false,
          noProhibitedFields: false,
          allFieldsJustified: false,
          score: 0
        },
        recommendations: ['No data collection policy defined']
      };
    }

    const hasProhibited = policy.collectedData.some(field =>
      this.PROHIBITED_FIELDS.includes(field)
    );

    const allJustified = policy.collectedData.every(field =>
      this.isNecessary(field, policy.purpose)
    );

    const minimumDataOnly = policy.collectedData.length === policy.minimumRequired.length;

    if (hasProhibited) {
      recommendations.push('Remove prohibited fields from data collection');
    }

    if (!allJustified) {
      recommendations.push('Ensure all collected fields are necessary for the stated purpose');
    }

    if (!minimumDataOnly) {
      recommendations.push('Consider collecting only minimum required data');
    }

    const score =
      (!hasProhibited ? 40 : 0) +
      (allJustified ? 30 : 0) +
      (minimumDataOnly ? 30 : 0);

    return {
      policy,
      compliance: {
        minimumDataOnly,
        noProhibitedFields: !hasProhibited,
        allFieldsJustified: allJustified,
        score
      },
      recommendations
    };
  }

  /**
   * Get prohibited fields
   */
  getProhibitedFields(): string[] {
    return [...this.PROHIBITED_FIELDS];
  }

  /**
   * Get consent required fields
   */
  getConsentRequiredFields(): string[] {
    return [...this.CONSENT_REQUIRED_FIELDS];
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const dataMinimizationManager = new DataMinimizationManager();
