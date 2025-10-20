/**
 * Privacy Management
 *
 * User data privacy, anonymization, export, and deletion
 */

import {
  PrivacySettings,
  DataExportRequest,
  DataDeletionRequest,
  AnonymizationConfig
} from '../types';

// ============================================================================
// Privacy Manager
// ============================================================================

export class PrivacyManager {
  private settings: Map<string, PrivacySettings> = new Map();
  private exportRequests: Map<string, DataExportRequest> = new Map();
  private deletionRequests: Map<string, DataDeletionRequest> = new Map();

  /**
   * Get or create privacy settings
   */
  getSettings(userId: string): PrivacySettings {
    let settings = this.settings.get(userId);

    if (!settings) {
      settings = this.getDefaultSettings(userId);
      this.settings.set(userId, settings);
    }

    return settings;
  }

  /**
   * Update privacy settings
   */
  updateSettings(
    userId: string,
    updates: Partial<PrivacySettings>
  ): PrivacySettings {
    const current = this.getSettings(userId);
    const updated: PrivacySettings = {
      ...current,
      ...updates,
      dataSharing: { ...current.dataSharing, ...updates.dataSharing },
      anonymization: { ...current.anonymization, ...updates.anonymization },
      dataRetention: { ...current.dataRetention, ...updates.dataRetention },
      marketing: { ...current.marketing, ...updates.marketing }
    };

    this.settings.set(userId, updated);
    return updated;
  }

  /**
   * Default privacy settings
   */
  private getDefaultSettings(userId: string): PrivacySettings {
    return {
      userId,
      dataSharing: {
        withTeachers: true,
        withParents: true,
        withSchool: true,
        withThirdParty: false
      },
      anonymization: {
        enabled: false,
        level: 'standard'
      },
      dataRetention: {
        autoDelete: false,
        retentionDays: 365
      },
      marketing: {
        emailOptIn: false,
        smsOptIn: false
      }
    };
  }

  /**
   * Request data export
   */
  requestDataExport(
    userId: string,
    format: 'json' | 'csv' | 'pdf',
    dataTypes: string[]
  ): DataExportRequest {
    const request: DataExportRequest = {
      id: this.generateRequestId('export'),
      userId,
      requestedAt: new Date(),
      status: 'pending',
      format,
      dataTypes
    };

    this.exportRequests.set(request.id, request);

    // Process asynchronously
    this.processExportRequest(request);

    return request;
  }

  /**
   * Process data export request
   */
  private async processExportRequest(request: DataExportRequest): Promise<void> {
    try {
      request.status = 'processing';
      this.exportRequests.set(request.id, request);

      // Simulate data collection and export
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate download URL
      const downloadUrl = `https://example.com/exports/${request.id}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      request.status = 'completed';
      request.completedAt = new Date();
      request.downloadUrl = downloadUrl;
      request.expiresAt = expiresAt;

      this.exportRequests.set(request.id, request);
    } catch (error) {
      request.status = 'failed';
      this.exportRequests.set(request.id, request);
    }
  }

  /**
   * Get export request status
   */
  getExportRequest(requestId: string): DataExportRequest | undefined {
    return this.exportRequests.get(requestId);
  }

  /**
   * Request data deletion
   */
  requestDataDeletion(
    userId: string,
    dataTypes: string[],
    retainLegal: boolean = true,
    scheduleDays: number = 30
  ): DataDeletionRequest {
    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + scheduleDays);

    const request: DataDeletionRequest = {
      id: this.generateRequestId('delete'),
      userId,
      requestedAt: new Date(),
      scheduledFor,
      status: 'scheduled',
      dataTypes,
      retainLegal,
      confirmation: {
        required: true
      }
    };

    this.deletionRequests.set(request.id, request);
    return request;
  }

  /**
   * Confirm data deletion
   */
  confirmDataDeletion(
    requestId: string,
    confirmationMethod: string
  ): DataDeletionRequest | null {
    const request = this.deletionRequests.get(requestId);
    if (!request) return null;

    request.confirmation.confirmedAt = new Date();
    request.confirmation.confirmationMethod = confirmationMethod;
    this.deletionRequests.set(requestId, request);

    return request;
  }

  /**
   * Cancel data deletion
   */
  cancelDataDeletion(requestId: string): boolean {
    const request = this.deletionRequests.get(requestId);
    if (!request || request.status === 'completed') return false;

    request.status = 'cancelled';
    this.deletionRequests.set(requestId, request);
    return true;
  }

  /**
   * Process scheduled deletions
   */
  processScheduledDeletions(): number {
    let processed = 0;
    const now = new Date();

    for (const [id, request] of this.deletionRequests.entries()) {
      if (request.status === 'scheduled' &&
          request.scheduledFor <= now &&
          request.confirmation.confirmedAt) {
        this.executeDeletion(request);
        processed++;
      }
    }

    return processed;
  }

  /**
   * Execute data deletion
   */
  private executeDeletion(request: DataDeletionRequest): void {
    request.status = 'processing';
    this.deletionRequests.set(request.id, request);

    // Simulate deletion
    setTimeout(() => {
      request.status = 'completed';
      request.completedAt = new Date();
      this.deletionRequests.set(request.id, request);
    }, 1000);
  }

  /**
   * Get deletion request
   */
  getDeletionRequest(requestId: string): DataDeletionRequest | undefined {
    return this.deletionRequests.get(requestId);
  }

  /**
   * Anonymize user data
   */
  anonymizeData<T extends Record<string, any>>(
    data: T,
    config: AnonymizationConfig
  ): T {
    const anonymized = { ...data };

    for (const field of config.fields) {
      if (field in anonymized) {
        anonymized[field] = this.anonymizeField(
          anonymized[field],
          config.method,
          config.preserveFormat,
          config.customRules?.[field]
        );
      }
    }

    return anonymized;
  }

  /**
   * Anonymize individual field
   */
  private anonymizeField(
    value: any,
    method: AnonymizationConfig['method'],
    preserveFormat?: boolean,
    customRule?: (value: any) => any
  ): any {
    if (customRule) {
      return customRule(value);
    }

    const str = String(value);

    switch (method) {
      case 'hash':
        return this.hashValue(str);

      case 'mask':
        return this.maskValue(str, preserveFormat);

      case 'remove':
        return '[REDACTED]';

      case 'generalize':
        return this.generalizeValue(str);

      default:
        return value;
    }
  }

  /**
   * Hash value
   */
  private hashValue(value: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(value).digest('hex').substr(0, 16);
  }

  /**
   * Mask value
   */
  private maskValue(value: string, preserveFormat?: boolean): string {
    if (!preserveFormat) {
      return '*'.repeat(Math.min(value.length, 10));
    }

    // Preserve format (e.g., email, phone)
    if (value.includes('@')) {
      // Email: show first char and domain
      const [local, domain] = value.split('@');
      return `${local[0]}${'*'.repeat(local.length - 1)}@${domain}`;
    }

    // Default: show first and last char
    if (value.length <= 2) return '*'.repeat(value.length);
    return `${value[0]}${'*'.repeat(value.length - 2)}${value[value.length - 1]}`;
  }

  /**
   * Generalize value (reduce specificity)
   */
  private generalizeValue(value: string): string {
    // For dates, return year only
    if (/\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.substr(0, 4);
    }

    // For numbers, round to nearest 10
    if (!isNaN(Number(value))) {
      return String(Math.round(Number(value) / 10) * 10);
    }

    return value;
  }

  /**
   * Check if data can be shared
   */
  canShareData(
    userId: string,
    recipient: 'teachers' | 'parents' | 'school' | 'thirdParty'
  ): boolean {
    const settings = this.getSettings(userId);
    const mapping = {
      teachers: settings.dataSharing.withTeachers,
      parents: settings.dataSharing.withParents,
      school: settings.dataSharing.withSchool,
      thirdParty: settings.dataSharing.withThirdParty
    };

    return mapping[recipient];
  }

  /**
   * Generate privacy report
   */
  generateReport(userId: string): {
    settings: PrivacySettings;
    exportRequests: DataExportRequest[];
    deletionRequests: DataDeletionRequest[];
    complianceScore: number;
    recommendations: string[];
  } {
    const settings = this.getSettings(userId);
    const recommendations: string[] = [];

    // Get user requests
    const exportRequests = Array.from(this.exportRequests.values())
      .filter(r => r.userId === userId);

    const deletionRequests = Array.from(this.deletionRequests.values())
      .filter(r => r.userId === userId);

    // Calculate compliance score
    let score = 100;

    if (settings.dataSharing.withThirdParty) {
      score -= 20;
      recommendations.push('Consider disabling third-party data sharing');
    }

    if (!settings.anonymization.enabled) {
      score -= 10;
      recommendations.push('Enable data anonymization for better privacy');
    }

    if (!settings.dataRetention.autoDelete) {
      recommendations.push('Enable automatic data deletion');
    }

    if (settings.marketing.emailOptIn || settings.marketing.smsOptIn) {
      recommendations.push('Review marketing preferences');
    }

    return {
      settings,
      exportRequests,
      deletionRequests,
      complianceScore: score,
      recommendations
    };
  }

  /**
   * Generate request ID
   */
  private generateRequestId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const privacyManager = new PrivacyManager();
