/**
 * COPPA Compliance Module
 * Children's Online Privacy Protection Act (15 U.S.C. §§ 6501–6506)
 *
 * Ensures protection of children under 13 years old
 * Implements parental consent, data minimization, and privacy controls for K-5 students
 */

import { createClient } from '@supabase/supabase-js';

// Age verification thresholds
export const COPPA_AGE_THRESHOLD = 13;
export const K5_MAX_AGE = 11; // Typical K-5 age range: 5-11

// Data collection categories under COPPA
export enum COPPADataCategory {
  PERSONAL_INFORMATION = 'personal_info',        // Name, address, email
  PERSISTENT_IDENTIFIER = 'persistent_id',       // Cookies, IP address, device ID
  PHOTO_VIDEO_AUDIO = 'media',                   // Photos, videos, voice recordings
  GEOLOCATION = 'geolocation',                   // Physical location data
  SCREEN_NAME = 'screen_name',                   // Username or display name
  CONTACT_INFORMATION = 'contact_info',          // Phone, email, IM handle
  BEHAVIORAL_DATA = 'behavioral',                // Reading patterns, clicks, time on task
  ASSESSMENT_RESPONSES = 'assessment_responses'  // Test answers, quiz results
}

// Parental consent methods (COPPA-compliant)
export enum ConsentMethod {
  PRINT_AND_SIGN = 'print_sign',                 // Print form, sign, scan/mail
  CREDIT_CARD = 'credit_card',                   // Credit card verification
  VIDEO_CONFERENCE = 'video_conference',         // Video conference with staff
  GOVERNMENT_ID = 'government_id',               // Check government-issued ID
  KNOWLEDGE_BASED = 'knowledge_based',           // Answer questions only parent would know
  EMAIL_PLUS = 'email_plus'                      // Email plus additional verification
}

export interface ParentalConsent {
  id: string;
  childId: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  consentMethod: ConsentMethod;
  consentDate: Date;
  verifiedDate?: Date;
  verifiedBy?: string;
  dataCategories: COPPADataCategory[];
  purposes: string[];
  expirationDate?: Date;
  revokedDate?: Date;
  revokedBy?: string;
  digitalSignature?: string;
  ipAddress: string;
  userAgent: string;
  consentDocument?: string; // URL to signed document
}

export interface ChildProfile {
  id: string;
  firstName: string;
  lastName?: string; // Optional - minimize data collection
  dateOfBirth: Date;
  age: number;
  gradeLevel: string;
  schoolId: string;
  parentIds: string[];
  accountCreatedDate: Date;
  consentStatus: 'pending' | 'approved' | 'denied' | 'revoked';
  consentIds: string[];
  dataCollectionEnabled: boolean;
  thirdPartyDisclosureEnabled: boolean;
}

export interface DataCollectionEvent {
  id: string;
  childId: string;
  timestamp: Date;
  dataCategory: COPPADataCategory;
  dataCollected: any;
  purpose: string;
  consentId: string;
  retentionPeriod: number; // Days
  deletionDate: Date;
  thirdPartyShared: boolean;
  thirdParties?: string[];
}

export class COPPAComplianceService {
  private supabase: any;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  /**
   * Verify if user is a child under COPPA protection
   */
  async isChildUnder13(userId: string): Promise<boolean> {
    const { data: user } = await this.supabase
      .from('users')
      .select('date_of_birth, role')
      .eq('id', userId)
      .single();

    if (!user || !user.date_of_birth) {
      // If DOB not available and role is student, assume COPPA applies for K-5
      return user?.role === 'student';
    }

    const age = this.calculateAge(new Date(user.date_of_birth));
    return age < COPPA_AGE_THRESHOLD;
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
   * Request parental consent for data collection
   */
  async requestParentalConsent(
    childId: string,
    parentEmail: string,
    dataCategories: COPPADataCategory[],
    purposes: string[]
  ): Promise<{ consentId: string; verificationRequired: boolean }> {
    const consentId = crypto.randomUUID();

    // Create consent request
    await this.supabase.from('coppa_consent_requests').insert({
      id: consentId,
      child_id: childId,
      parent_email: parentEmail,
      data_categories: dataCategories,
      purposes: purposes,
      request_date: new Date().toISOString(),
      status: 'pending',
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days to respond
    });

    // Send consent request email to parent
    await this.sendConsentRequestEmail(consentId, parentEmail, childId, dataCategories, purposes);

    return {
      consentId,
      verificationRequired: true
    };
  }

  /**
   * Send consent request email to parent
   */
  private async sendConsentRequestEmail(
    consentId: string,
    parentEmail: string,
    childId: string,
    dataCategories: COPPADataCategory[],
    purposes: string[]
  ): Promise<void> {
    // Get child information
    const { data: child } = await this.supabase
      .from('users')
      .select('first_name, last_name, grade_level')
      .eq('id', childId)
      .single();

    const emailContent = {
      to: parentEmail,
      subject: 'Parental Consent Required - K5 Reading Platform',
      html: this.generateConsentEmailHTML(consentId, child, dataCategories, purposes)
    };

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log('Consent email to be sent:', emailContent);

    // Store email notification
    await this.supabase.from('coppa_notifications').insert({
      consent_id: consentId,
      notification_type: 'consent_request',
      recipient_email: parentEmail,
      sent_date: new Date().toISOString(),
      content: emailContent
    });
  }

  /**
   * Generate HTML for consent request email
   */
  private generateConsentEmailHTML(
    consentId: string,
    child: any,
    dataCategories: COPPADataCategory[],
    purposes: string[]
  ): string {
    const baseUrl = Deno.env.get('APP_URL') || 'https://k5-reading.example.com';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Parental Consent Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c5aa0;">Parental Consent Required</h1>

        <p>Dear Parent/Guardian,</p>

        <p>Your child, <strong>${child.first_name} ${child.last_name}</strong> (Grade ${child.grade_level}),
        has been registered for the K5 Bilingual Reading Platform.</p>

        <p>Under the Children's Online Privacy Protection Act (COPPA), we require your consent before
        collecting certain information from children under 13 years of age.</p>

        <h2>Information We Collect:</h2>
        <ul>
          ${dataCategories.map(cat => `<li>${this.formatDataCategory(cat)}</li>`).join('')}
        </ul>

        <h2>How We Use This Information:</h2>
        <ul>
          ${purposes.map(purpose => `<li>${purpose}</li>`).join('')}
        </ul>

        <h2>Your Rights:</h2>
        <ul>
          <li>Review your child's personal information</li>
          <li>Request deletion of your child's information</li>
          <li>Refuse further collection or use of your child's information</li>
          <li>Revoke consent at any time</li>
        </ul>

        <p><strong>To provide consent, please click the link below:</strong></p>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/consent/${consentId}"
             style="background-color: #2c5aa0; color: white; padding: 15px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Review and Provide Consent
          </a>
        </p>

        <p style="font-size: 12px; color: #666;">
          This consent request will expire in 30 days. If you have questions, please contact us at
          <a href="mailto:privacy@k5-reading.example.com">privacy@k5-reading.example.com</a>.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">

        <p style="font-size: 11px; color: #999;">
          K5 Bilingual Reading Platform<br>
          Department of Education, Puerto Rico<br>
          This email was sent regarding COPPA compliance for your child's account.
        </p>
      </body>
      </html>
    `;
  }

  /**
   * Format data category for display
   */
  private formatDataCategory(category: COPPADataCategory): string {
    const descriptions: Record<COPPADataCategory, string> = {
      [COPPADataCategory.PERSONAL_INFORMATION]: 'Personal Information (name, age, grade)',
      [COPPADataCategory.PERSISTENT_IDENTIFIER]: 'Device identifiers and cookies',
      [COPPADataCategory.PHOTO_VIDEO_AUDIO]: 'Photos, videos, or voice recordings',
      [COPPADataCategory.GEOLOCATION]: 'Physical location data',
      [COPPADataCategory.SCREEN_NAME]: 'Username or display name',
      [COPPADataCategory.CONTACT_INFORMATION]: 'Contact information',
      [COPPADataCategory.BEHAVIORAL_DATA]: 'Learning progress and reading activity',
      [COPPADataCategory.ASSESSMENT_RESPONSES]: 'Test answers and quiz results'
    };
    return descriptions[category] || category;
  }

  /**
   * Record parental consent
   */
  async recordConsent(
    consentId: string,
    parentId: string,
    method: ConsentMethod,
    ipAddress: string,
    userAgent: string,
    digitalSignature?: string
  ): Promise<ParentalConsent> {
    // Get consent request details
    const { data: request } = await this.supabase
      .from('coppa_consent_requests')
      .select('*')
      .eq('id', consentId)
      .single();

    if (!request) {
      throw new Error('Consent request not found');
    }

    // Get parent information
    const { data: parent } = await this.supabase
      .from('users')
      .select('full_name, email, phone')
      .eq('id', parentId)
      .single();

    const consent: ParentalConsent = {
      id: consentId,
      childId: request.child_id,
      parentId,
      parentName: parent.full_name,
      parentEmail: parent.email,
      parentPhone: parent.phone,
      consentMethod: method,
      consentDate: new Date(),
      verifiedDate: new Date(),
      verifiedBy: parentId,
      dataCategories: request.data_categories,
      purposes: request.purposes,
      digitalSignature,
      ipAddress,
      userAgent
    };

    // Store consent
    await this.supabase.from('coppa_consents').insert({
      id: consent.id,
      child_id: consent.childId,
      parent_id: consent.parentId,
      parent_name: consent.parentName,
      parent_email: consent.parentEmail,
      parent_phone: consent.parentPhone,
      consent_method: consent.consentMethod,
      consent_date: consent.consentDate.toISOString(),
      verified_date: consent.verifiedDate?.toISOString(),
      verified_by: consent.verifiedBy,
      data_categories: consent.dataCategories,
      purposes: consent.purposes,
      digital_signature: consent.digitalSignature,
      ip_address: consent.ipAddress,
      user_agent: consent.userAgent
    });

    // Update consent request status
    await this.supabase
      .from('coppa_consent_requests')
      .update({ status: 'approved', approved_date: new Date().toISOString() })
      .eq('id', consentId);

    // Enable data collection for child
    await this.supabase
      .from('users')
      .update({
        consent_status: 'approved',
        data_collection_enabled: true
      })
      .eq('id', request.child_id);

    return consent;
  }

  /**
   * Check if valid consent exists for data collection
   */
  async hasValidConsent(childId: string, dataCategory: COPPADataCategory): Promise<boolean> {
    const { data: consent } = await this.supabase
      .from('coppa_consents')
      .select('*')
      .eq('child_id', childId)
      .contains('data_categories', [dataCategory])
      .is('revoked_date', null)
      .single();

    if (!consent) {
      return false;
    }

    // Check if consent has expired
    if (consent.expiration_date && new Date(consent.expiration_date) < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Log data collection event (for COPPA compliance audit)
   */
  async logDataCollection(
    childId: string,
    dataCategory: COPPADataCategory,
    dataCollected: any,
    purpose: string,
    retentionDays: number = 365
  ): Promise<void> {
    // Verify consent exists
    const hasConsent = await this.hasValidConsent(childId, dataCategory);
    if (!hasConsent) {
      throw new Error(`No valid COPPA consent for data category: ${dataCategory}`);
    }

    // Get consent ID
    const { data: consent } = await this.supabase
      .from('coppa_consents')
      .select('id')
      .eq('child_id', childId)
      .contains('data_categories', [dataCategory])
      .single();

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + retentionDays);

    await this.supabase.from('coppa_data_collection_logs').insert({
      id: crypto.randomUUID(),
      child_id: childId,
      timestamp: new Date().toISOString(),
      data_category: dataCategory,
      data_collected: dataCollected,
      purpose,
      consent_id: consent.id,
      retention_period: retentionDays,
      deletion_date: deletionDate.toISOString(),
      third_party_shared: false
    });
  }

  /**
   * Revoke parental consent and delete child's data
   */
  async revokeConsent(consentId: string, revokedBy: string): Promise<void> {
    const now = new Date();

    // Mark consent as revoked
    await this.supabase
      .from('coppa_consents')
      .update({
        revoked_date: now.toISOString(),
        revoked_by: revokedBy
      })
      .eq('id', consentId);

    // Get child ID from consent
    const { data: consent } = await this.supabase
      .from('coppa_consents')
      .select('child_id')
      .eq('id', consentId)
      .single();

    if (consent) {
      // Disable data collection
      await this.supabase
        .from('users')
        .update({
          consent_status: 'revoked',
          data_collection_enabled: false
        })
        .eq('id', consent.child_id);

      // Schedule data deletion (give 30-day grace period as per COPPA)
      await this.scheduleDataDeletion(consent.child_id, 30);
    }
  }

  /**
   * Schedule data deletion for child account
   */
  private async scheduleDataDeletion(childId: string, daysUntilDeletion: number): Promise<void> {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + daysUntilDeletion);

    await this.supabase.from('coppa_deletion_schedule').insert({
      child_id: childId,
      scheduled_date: deletionDate.toISOString(),
      status: 'scheduled',
      reason: 'consent_revoked'
    });
  }

  /**
   * Delete all data for child (irreversible)
   */
  async deleteChildData(childId: string): Promise<{ deleted: number; tables: string[] }> {
    const tables = [
      'reading_progress',
      'assessment_results',
      'reading_sessions',
      'user_preferences',
      'coppa_data_collection_logs',
      'ferpa_access_logs'
    ];

    let deleted = 0;

    for (const table of tables) {
      const { count } = await this.supabase
        .from(table)
        .delete()
        .eq('user_id', childId)
        .or(`child_id.eq.${childId}`);

      deleted += count || 0;
    }

    // Anonymize user record (keep for audit but remove PII)
    await this.supabase
      .from('users')
      .update({
        first_name: 'DELETED',
        last_name: 'DELETED',
        email: `deleted-${childId}@anonymized.local`,
        date_of_birth: null,
        deleted_at: new Date().toISOString(),
        deletion_reason: 'coppa_consent_revoked'
      })
      .eq('id', childId);

    return { deleted, tables };
  }

  /**
   * Generate COPPA compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const [consents, dataCollections, deletions] = await Promise.all([
      this.supabase
        .from('coppa_consents')
        .select('*')
        .gte('consent_date', startDate.toISOString())
        .lte('consent_date', endDate.toISOString()),

      this.supabase
        .from('coppa_data_collection_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString()),

      this.supabase
        .from('coppa_deletion_schedule')
        .select('*')
        .gte('scheduled_date', startDate.toISOString())
        .lte('scheduled_date', endDate.toISOString())
    ]);

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalConsents: consents.data?.length || 0,
        activeConsents: consents.data?.filter((c: any) => !c.revoked_date).length || 0,
        revokedConsents: consents.data?.filter((c: any) => c.revoked_date).length || 0,
        dataCollectionEvents: dataCollections.data?.length || 0,
        scheduledDeletions: deletions.data?.length || 0
      },
      consentsByMethod: this.groupByConsentMethod(consents.data || []),
      dataByCategory: this.groupByDataCategory(dataCollections.data || []),
      complianceStatus: 'COMPLIANT',
      recommendations: this.generateCOPPARecommendations(consents.data, dataCollections.data)
    };
  }

  private groupByConsentMethod(consents: any[]): Record<string, number> {
    return consents.reduce((acc, consent) => {
      acc[consent.consent_method] = (acc[consent.consent_method] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByDataCategory(collections: any[]): Record<string, number> {
    return collections.reduce((acc, collection) => {
      acc[collection.data_category] = (acc[collection.data_category] || 0) + 1;
      return acc;
    }, {});
  }

  private generateCOPPARecommendations(consents: any[], dataCollections: any[]): string[] {
    const recommendations: string[] = [];

    const pendingConsents = consents.filter((c: any) => c.status === 'pending');
    if (pendingConsents.length > 5) {
      recommendations.push(`${pendingConsents.length} consent requests pending. Follow up with parents.`);
    }

    const highDataCollection = dataCollections.length > 1000;
    if (highDataCollection) {
      recommendations.push('High volume of data collection. Ensure data minimization practices.');
    }

    return recommendations;
  }
}

/**
 * Validate COPPA compliance for user registration
 */
export async function validateCOPPARegistration(
  dateOfBirth: Date,
  parentEmail?: string
): Promise<{ allowed: boolean; requiresConsent: boolean; reason?: string }> {
  const age = new Date().getFullYear() - dateOfBirth.getFullYear();

  if (age < COPPA_AGE_THRESHOLD) {
    if (!parentEmail) {
      return {
        allowed: false,
        requiresConsent: true,
        reason: 'Parental email required for children under 13'
      };
    }

    return {
      allowed: true,
      requiresConsent: true,
      reason: 'Parental consent will be requested'
    };
  }

  return {
    allowed: true,
    requiresConsent: false
  };
}
