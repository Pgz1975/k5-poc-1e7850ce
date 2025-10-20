/**
 * COPPA Compliance - Age Verification
 *
 * Age verification and parental consent management
 */

import {
  AgeVerification,
  ParentalConsent,
  ConsentType,
  ConsentStatus
} from '../types';
import { encryptionManager } from '../ferpa/encryption';

// ============================================================================
// Age Verification Manager
// ============================================================================

export class AgeVerificationManager {
  private verifications: Map<string, AgeVerification> = new Map();
  private consents: Map<string, ParentalConsent[]> = new Map();

  /**
   * Verify user age
   */
  verifyAge(
    userId: string,
    dateOfBirth: Date,
    method: AgeVerification['verificationMethod'],
    verifiedBy?: string
  ): AgeVerification {
    const age = this.calculateAge(dateOfBirth);
    const isUnder13 = age < 13;

    const verification: AgeVerification = {
      userId,
      dateOfBirth,
      verificationMethod: method,
      verifiedAt: new Date(),
      verifiedBy,
      isUnder13
    };

    this.verifications.set(userId, verification);
    return verification;
  }

  /**
   * Check if user is under 13
   */
  isUnder13(userId: string): boolean {
    const verification = this.verifications.get(userId);
    return verification?.isUnder13 || false;
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Request parental consent
   */
  async requestParentalConsent(
    childUserId: string,
    parentEmail: string,
    parentName: string,
    consentType: ConsentType,
    ipAddress: string
  ): Promise<ParentalConsent> {
    const verificationToken = encryptionManager.generateToken(32);

    const consent: ParentalConsent = {
      id: this.generateConsentId(),
      childUserId,
      parentEmail,
      parentName,
      consentType,
      status: ConsentStatus.PENDING,
      requestedAt: new Date(),
      verificationToken,
      ipAddress
    };

    const userConsents = this.consents.get(childUserId) || [];
    userConsents.push(consent);
    this.consents.set(childUserId, userConsents);

    // Send verification email
    await this.sendConsentEmail(consent);

    return consent;
  }

  /**
   * Verify parental consent
   */
  verifyConsent(
    consentId: string,
    token: string,
    ipAddress: string,
    signature?: string
  ): ParentalConsent | null {
    for (const [userId, userConsents] of this.consents.entries()) {
      const consent = userConsents.find(c => c.id === consentId);

      if (consent && consent.verificationToken === token) {
        consent.status = ConsentStatus.GRANTED;
        consent.respondedAt = new Date();
        consent.signature = signature;

        this.consents.set(userId, userConsents);
        return consent;
      }
    }

    return null;
  }

  /**
   * Deny parental consent
   */
  denyConsent(consentId: string, token: string): boolean {
    for (const [userId, userConsents] of this.consents.entries()) {
      const consent = userConsents.find(c => c.id === consentId);

      if (consent && consent.verificationToken === token) {
        consent.status = ConsentStatus.DENIED;
        consent.respondedAt = new Date();
        this.consents.set(userId, userConsents);
        return true;
      }
    }

    return false;
  }

  /**
   * Revoke parental consent
   */
  revokeConsent(childUserId: string, consentType: ConsentType): boolean {
    const userConsents = this.consents.get(childUserId);
    if (!userConsents) return false;

    const consent = userConsents.find(
      c => c.consentType === consentType && c.status === ConsentStatus.GRANTED
    );

    if (consent) {
      consent.status = ConsentStatus.REVOKED;
      consent.respondedAt = new Date();
      this.consents.set(childUserId, userConsents);
      return true;
    }

    return false;
  }

  /**
   * Check if consent is granted
   */
  hasConsent(childUserId: string, consentType: ConsentType): boolean {
    const userConsents = this.consents.get(childUserId) || [];
    return userConsents.some(
      c => c.consentType === consentType &&
           c.status === ConsentStatus.GRANTED &&
           (!c.expiresAt || c.expiresAt > new Date())
    );
  }

  /**
   * Get all consents for user
   */
  getUserConsents(childUserId: string): ParentalConsent[] {
    return this.consents.get(childUserId) || [];
  }

  /**
   * Get pending consents
   */
  getPendingConsents(childUserId?: string): ParentalConsent[] {
    if (childUserId) {
      const userConsents = this.consents.get(childUserId) || [];
      return userConsents.filter(c => c.status === ConsentStatus.PENDING);
    }

    const allPending: ParentalConsent[] = [];
    for (const userConsents of this.consents.values()) {
      allPending.push(...userConsents.filter(c => c.status === ConsentStatus.PENDING));
    }
    return allPending;
  }

  /**
   * Check expired consents
   */
  checkExpiredConsents(): number {
    let expiredCount = 0;
    const now = new Date();

    for (const [userId, userConsents] of this.consents.entries()) {
      for (const consent of userConsents) {
        if (consent.expiresAt &&
            consent.expiresAt < now &&
            consent.status === ConsentStatus.GRANTED) {
          consent.status = ConsentStatus.EXPIRED;
          expiredCount++;
        }
      }
      this.consents.set(userId, userConsents);
    }

    return expiredCount;
  }

  /**
   * Require consent for action
   */
  requireConsent(
    childUserId: string,
    consentType: ConsentType,
    action: () => Promise<any>
  ): Promise<any> {
    if (!this.isUnder13(childUserId)) {
      // Not under 13, no consent required
      return action();
    }

    if (!this.hasConsent(childUserId, consentType)) {
      throw new Error(`Parental consent required for ${consentType}`);
    }

    return action();
  }

  /**
   * Send consent email (mock implementation)
   */
  private async sendConsentEmail(consent: ParentalConsent): Promise<void> {
    // In production, use email service
    console.log(`[COPPA] Consent email sent to ${consent.parentEmail}`, {
      consentId: consent.id,
      token: consent.verificationToken,
      verifyUrl: `https://example.com/verify-consent?id=${consent.id}&token=${consent.verificationToken}`
    });
  }

  /**
   * Generate consent ID
   */
  private generateConsentId(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate consent report
   */
  generateReport(): {
    totalUsers: number;
    usersUnder13: number;
    pendingConsents: number;
    grantedConsents: number;
    deniedConsents: number;
    revokedConsents: number;
    expiredConsents: number;
    complianceRate: number;
  } {
    const totalUsers = this.verifications.size;
    const usersUnder13 = Array.from(this.verifications.values())
      .filter(v => v.isUnder13).length;

    let pending = 0, granted = 0, denied = 0, revoked = 0, expired = 0;

    for (const userConsents of this.consents.values()) {
      for (const consent of userConsents) {
        switch (consent.status) {
          case ConsentStatus.PENDING: pending++; break;
          case ConsentStatus.GRANTED: granted++; break;
          case ConsentStatus.DENIED: denied++; break;
          case ConsentStatus.REVOKED: revoked++; break;
          case ConsentStatus.EXPIRED: expired++; break;
        }
      }
    }

    const complianceRate = usersUnder13 > 0
      ? (granted / (pending + granted + denied)) * 100
      : 100;

    return {
      totalUsers,
      usersUnder13,
      pendingConsents: pending,
      grantedConsents: granted,
      deniedConsents: denied,
      revokedConsents: revoked,
      expiredConsents: expired,
      complianceRate
    };
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const ageVerificationManager = new AgeVerificationManager();
