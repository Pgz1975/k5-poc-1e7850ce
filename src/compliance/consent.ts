/**
 * User Consent Management System
 * Manages parental consent, data usage permissions, and privacy preferences
 * Supports FERPA, COPPA, and GDPR-style consent requirements
 */

import { createClient } from '@supabase/supabase-js';

// Consent types
export enum ConsentType {
  PARENTAL_CONSENT = 'parental_consent',
  DATA_COLLECTION = 'data_collection',
  DIRECTORY_INFORMATION = 'directory_information',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  MARKETING_COMMUNICATIONS = 'marketing_communications',
  RESEARCH_PARTICIPATION = 'research_participation',
  PHOTO_VIDEO_RELEASE = 'photo_video_release',
  ACCESSIBILITY_DATA = 'accessibility_data',
  BEHAVIORAL_TRACKING = 'behavioral_tracking'
}

// Consent status
export enum ConsentStatus {
  PENDING = 'pending',
  GRANTED = 'granted',
  DENIED = 'denied',
  REVOKED = 'revoked',
  EXPIRED = 'expired'
}

// Consent scope
export enum ConsentScope {
  MINIMAL = 'minimal',           // Only essential data
  STANDARD = 'standard',         // Standard educational features
  ENHANCED = 'enhanced',         // Enhanced features with more data
  FULL = 'full'                  // All features and data collection
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  scope: ConsentScope;

  // Parent/Guardian information (for COPPA)
  parentId?: string;
  parentName?: string;
  parentEmail?: string;
  parentVerified: boolean;

  // Consent details
  grantedDate?: Date;
  deniedDate?: Date;
  revokedDate?: Date;
  expirationDate?: Date;

  // Legal basis
  legalBasis: 'consent' | 'legitimate_interest' | 'legal_obligation' | 'vital_interest';
  purpose: string;
  dataCategories: string[];

  // Verification
  verificationMethod: 'email' | 'sms' | 'government_id' | 'credit_card' | 'video_conference';
  digitalSignature?: string;
  ipAddress?: string;
  userAgent?: string;

  // Metadata
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface ConsentForm {
  id: string;
  type: ConsentType;
  version: string;
  language: 'en' | 'es';
  title: string;
  description: string;
  legalText: string;
  requiredFields: string[];
  optionalFields: string[];
  expirationMonths?: number;
  renewalRequired: boolean;
}

export interface ConsentPreferences {
  userId: string;
  dataMinimization: boolean;         // Collect minimum data only
  analyticsEnabled: boolean;         // Allow analytics tracking
  personalizationEnabled: boolean;   // Allow personalized content
  thirdPartySharing: boolean;        // Allow third-party data sharing
  marketingEmails: boolean;          // Receive marketing emails
  researchParticipation: boolean;    // Participate in research
  photoVideoRelease: boolean;        // Allow photos/videos
  locationTracking: boolean;         // Allow location tracking
  updatedAt: Date;
}

/**
 * Consent Management Service
 */
export class ConsentManagementService {
  private supabase: any;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  /**
   * Request consent from parent/guardian
   */
  async requestConsent(
    userId: string,
    parentEmail: string,
    consentType: ConsentType,
    purpose: string,
    dataCategories: string[],
    expirationMonths?: number
  ): Promise<ConsentRecord> {
    const consentId = crypto.randomUUID();
    const expirationDate = expirationMonths
      ? new Date(Date.now() + expirationMonths * 30 * 24 * 60 * 60 * 1000)
      : undefined;

    const consent: ConsentRecord = {
      id: consentId,
      userId,
      consentType,
      status: ConsentStatus.PENDING,
      scope: ConsentScope.STANDARD,
      parentEmail,
      parentVerified: false,
      expirationDate,
      legalBasis: 'consent',
      purpose,
      dataCategories,
      verificationMethod: 'email'
    };

    // Store consent request
    await this.supabase.from('consent_records').insert({
      id: consent.id,
      user_id: consent.userId,
      consent_type: consent.consentType,
      status: consent.status,
      scope: consent.scope,
      parent_email: consent.parentEmail,
      parent_verified: consent.parentVerified,
      expiration_date: consent.expirationDate?.toISOString(),
      legal_basis: consent.legalBasis,
      purpose: consent.purpose,
      data_categories: consent.dataCategories,
      verification_method: consent.verificationMethod,
      created_at: new Date().toISOString()
    });

    // Send consent request email
    await this.sendConsentRequestEmail(consent);

    return consent;
  }

  /**
   * Grant consent
   */
  async grantConsent(
    consentId: string,
    parentId: string,
    parentName: string,
    scope: ConsentScope = ConsentScope.STANDARD,
    digitalSignature?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ConsentRecord> {
    const now = new Date();

    // Update consent record
    await this.supabase
      .from('consent_records')
      .update({
        status: ConsentStatus.GRANTED,
        scope,
        parent_id: parentId,
        parent_name: parentName,
        parent_verified: true,
        granted_date: now.toISOString(),
        digital_signature: digitalSignature,
        ip_address: ipAddress,
        user_agent: userAgent,
        updated_at: now.toISOString()
      })
      .eq('id', consentId);

    // Get updated record
    const { data: consent } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('id', consentId)
      .single();

    // Enable features based on scope
    await this.applyConsentScope(consent.user_id, scope);

    return consent;
  }

  /**
   * Deny consent
   */
  async denyConsent(consentId: string, reason?: string): Promise<void> {
    const now = new Date();

    await this.supabase
      .from('consent_records')
      .update({
        status: ConsentStatus.DENIED,
        denied_date: now.toISOString(),
        metadata: { denialReason: reason },
        updated_at: now.toISOString()
      })
      .eq('id', consentId);

    // Get consent record
    const { data: consent } = await this.supabase
      .from('consent_records')
      .select('user_id')
      .eq('id', consentId)
      .single();

    // Disable data collection for user
    if (consent) {
      await this.disableDataCollection(consent.user_id);
    }
  }

  /**
   * Revoke consent
   */
  async revokeConsent(
    consentId: string,
    revokedBy: string,
    reason: string
  ): Promise<void> {
    const now = new Date();

    await this.supabase
      .from('consent_records')
      .update({
        status: ConsentStatus.REVOKED,
        revoked_date: now.toISOString(),
        metadata: { revokedBy, revocationReason: reason },
        updated_at: now.toISOString()
      })
      .eq('id', consentId);

    // Get consent record
    const { data: consent } = await this.supabase
      .from('consent_records')
      .select('user_id, consent_type')
      .eq('id', consentId)
      .single();

    if (consent) {
      // Schedule data deletion
      await this.scheduleDataDeletion(consent.user_id, consent.consent_type);
    }
  }

  /**
   * Check if valid consent exists
   */
  async hasValidConsent(
    userId: string,
    consentType: ConsentType
  ): Promise<boolean> {
    const { data: consent } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .eq('status', ConsentStatus.GRANTED)
      .single();

    if (!consent) return false;

    // Check expiration
    if (consent.expiration_date) {
      const expirationDate = new Date(consent.expiration_date);
      if (expirationDate < new Date()) {
        // Mark as expired
        await this.supabase
          .from('consent_records')
          .update({ status: ConsentStatus.EXPIRED })
          .eq('id', consent.id);
        return false;
      }
    }

    return true;
  }

  /**
   * Get all consents for user
   */
  async getUserConsents(userId: string): Promise<ConsentRecord[]> {
    const { data: consents } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return consents || [];
  }

  /**
   * Update consent preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<ConsentPreferences>
  ): Promise<ConsentPreferences> {
    const updatedPreferences: ConsentPreferences = {
      userId,
      dataMinimization: preferences.dataMinimization ?? false,
      analyticsEnabled: preferences.analyticsEnabled ?? true,
      personalizationEnabled: preferences.personalizationEnabled ?? true,
      thirdPartySharing: preferences.thirdPartySharing ?? false,
      marketingEmails: preferences.marketingEmails ?? false,
      researchParticipation: preferences.researchParticipation ?? false,
      photoVideoRelease: preferences.photoVideoRelease ?? false,
      locationTracking: preferences.locationTracking ?? false,
      updatedAt: new Date()
    };

    await this.supabase
      .from('consent_preferences')
      .upsert({
        user_id: userId,
        data_minimization: updatedPreferences.dataMinimization,
        analytics_enabled: updatedPreferences.analyticsEnabled,
        personalization_enabled: updatedPreferences.personalizationEnabled,
        third_party_sharing: updatedPreferences.thirdPartySharing,
        marketing_emails: updatedPreferences.marketingEmails,
        research_participation: updatedPreferences.researchParticipation,
        photo_video_release: updatedPreferences.photoVideoRelease,
        location_tracking: updatedPreferences.locationTracking,
        updated_at: updatedPreferences.updatedAt.toISOString()
      });

    return updatedPreferences;
  }

  /**
   * Get consent preferences
   */
  async getPreferences(userId: string): Promise<ConsentPreferences> {
    const { data: prefs } = await this.supabase
      .from('consent_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!prefs) {
      // Return default preferences
      return {
        userId,
        dataMinimization: false,
        analyticsEnabled: true,
        personalizationEnabled: true,
        thirdPartySharing: false,
        marketingEmails: false,
        researchParticipation: false,
        photoVideoRelease: false,
        locationTracking: false,
        updatedAt: new Date()
      };
    }

    return {
      userId,
      dataMinimization: prefs.data_minimization,
      analyticsEnabled: prefs.analytics_enabled,
      personalizationEnabled: prefs.personalization_enabled,
      thirdPartySharing: prefs.third_party_sharing,
      marketingEmails: prefs.marketing_emails,
      researchParticipation: prefs.research_participation,
      photoVideoRelease: prefs.photo_video_release,
      locationTracking: prefs.location_tracking,
      updatedAt: new Date(prefs.updated_at)
    };
  }

  /**
   * Check consent expiration and send renewal notices
   */
  async checkExpirations(): Promise<{ expired: number; renewalsSent: number }> {
    const now = new Date();
    const renewalThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Find expired consents
    const { data: expiredConsents } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('status', ConsentStatus.GRANTED)
      .lte('expiration_date', now.toISOString());

    let expired = 0;
    if (expiredConsents) {
      for (const consent of expiredConsents) {
        await this.supabase
          .from('consent_records')
          .update({ status: ConsentStatus.EXPIRED })
          .eq('id', consent.id);
        expired++;
      }
    }

    // Find consents approaching expiration
    const { data: approachingConsents } = await this.supabase
      .from('consent_records')
      .select('*')
      .eq('status', ConsentStatus.GRANTED)
      .lte('expiration_date', renewalThreshold.toISOString())
      .is('renewal_notice_sent', null);

    let renewalsSent = 0;
    if (approachingConsents) {
      for (const consent of approachingConsents) {
        await this.sendRenewalNotice(consent);
        await this.supabase
          .from('consent_records')
          .update({ renewal_notice_sent: now.toISOString() })
          .eq('id', consent.id);
        renewalsSent++;
      }
    }

    return { expired, renewalsSent };
  }

  /**
   * Generate consent form
   */
  async getConsentForm(
    consentType: ConsentType,
    language: 'en' | 'es' = 'es'
  ): Promise<ConsentForm> {
    const forms: Record<ConsentType, Record<'en' | 'es', ConsentForm>> = {
      [ConsentType.PARENTAL_CONSENT]: {
        en: {
          id: 'parental-consent-en',
          type: ConsentType.PARENTAL_CONSENT,
          version: '1.0',
          language: 'en',
          title: 'Parental Consent for Educational Platform',
          description: 'Permission for your child to use the K5 Bilingual Reading Platform',
          legalText: this.getParentalConsentText('en'),
          requiredFields: ['parentName', 'parentEmail', 'childName', 'signature'],
          optionalFields: ['parentPhone'],
          expirationMonths: 12,
          renewalRequired: true
        },
        es: {
          id: 'parental-consent-es',
          type: ConsentType.PARENTAL_CONSENT,
          version: '1.0',
          language: 'es',
          title: 'Consentimiento Parental para la Plataforma Educativa',
          description: 'Permiso para que su hijo/a use la Plataforma de Lectura Bilingüe K5',
          legalText: this.getParentalConsentText('es'),
          requiredFields: ['parentName', 'parentEmail', 'childName', 'signature'],
          optionalFields: ['parentPhone'],
          expirationMonths: 12,
          renewalRequired: true
        }
      },
      [ConsentType.DATA_COLLECTION]: {
        en: {
          id: 'data-collection-en',
          type: ConsentType.DATA_COLLECTION,
          version: '1.0',
          language: 'en',
          title: 'Data Collection Consent',
          description: 'Permission to collect and process educational data',
          legalText: this.getDataCollectionText('en'),
          requiredFields: ['agree'],
          optionalFields: [],
          renewalRequired: false
        },
        es: {
          id: 'data-collection-es',
          type: ConsentType.DATA_COLLECTION,
          version: '1.0',
          language: 'es',
          title: 'Consentimiento para Recopilación de Datos',
          description: 'Permiso para recopilar y procesar datos educativos',
          legalText: this.getDataCollectionText('es'),
          requiredFields: ['agree'],
          optionalFields: [],
          renewalRequired: false
        }
      }
      // Add other consent types...
    } as any;

    return forms[consentType]?.[language] || forms[consentType]['es'];
  }

  // Private helper methods

  private async sendConsentRequestEmail(consent: ConsentRecord): Promise<void> {
    // Implementation would integrate with email service
    console.log('Consent request email sent to:', consent.parentEmail);
  }

  private async sendRenewalNotice(consent: any): Promise<void> {
    console.log('Renewal notice sent for consent:', consent.id);
  }

  private async applyConsentScope(userId: string, scope: ConsentScope): Promise<void> {
    const features = {
      [ConsentScope.MINIMAL]: ['reading_only'],
      [ConsentScope.STANDARD]: ['reading', 'assessments', 'progress_tracking'],
      [ConsentScope.ENHANCED]: ['reading', 'assessments', 'progress_tracking', 'personalization', 'analytics'],
      [ConsentScope.FULL]: ['reading', 'assessments', 'progress_tracking', 'personalization', 'analytics', 'research']
    };

    await this.supabase
      .from('users')
      .update({ enabled_features: features[scope] })
      .eq('id', userId);
  }

  private async disableDataCollection(userId: string): Promise<void> {
    await this.supabase
      .from('users')
      .update({ data_collection_enabled: false })
      .eq('id', userId);
  }

  private async scheduleDataDeletion(userId: string, consentType: ConsentType): Promise<void> {
    const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days grace period

    await this.supabase.from('data_deletion_schedule').insert({
      user_id: userId,
      consent_type: consentType,
      scheduled_date: deletionDate.toISOString(),
      status: 'scheduled',
      reason: 'consent_revoked'
    });
  }

  private getParentalConsentText(language: 'en' | 'es'): string {
    if (language === 'en') {
      return `
PARENTAL CONSENT FOR EDUCATIONAL PLATFORM USE

I, the undersigned parent/legal guardian, hereby grant permission for my child to use the K5 Bilingual Reading Platform ("Platform") provided by the Puerto Rico Department of Education.

I understand that:
1. The Platform will collect my child's educational data including reading progress, assessment results, and usage patterns
2. All data is protected under FERPA and COPPA regulations
3. Data will be used solely for educational purposes
4. I can review, modify, or request deletion of my child's data at any time
5. I can revoke this consent at any time

This consent is valid for 12 months from the date of signing and may be renewed.
      `.trim();
    } else {
      return `
CONSENTIMIENTO PARENTAL PARA USO DE PLATAFORMA EDUCATIVA

Yo, el padre/tutor legal abajo firmante, otorgo permiso para que mi hijo/a utilice la Plataforma de Lectura Bilingüe K5 ("Plataforma") proporcionada por el Departamento de Educación de Puerto Rico.

Entiendo que:
1. La Plataforma recopilará datos educativos de mi hijo/a incluyendo progreso de lectura, resultados de evaluaciones y patrones de uso
2. Todos los datos están protegidos bajo las regulaciones FERPA y COPPA
3. Los datos se utilizarán únicamente con fines educativos
4. Puedo revisar, modificar o solicitar la eliminación de los datos de mi hijo/a en cualquier momento
5. Puedo revocar este consentimiento en cualquier momento

Este consentimiento es válido por 12 meses desde la fecha de firma y puede ser renovado.
      `.trim();
    }
  }

  private getDataCollectionText(language: 'en' | 'es'): string {
    if (language === 'en') {
      return 'We collect educational data to personalize learning and track progress. Data includes reading activity, assessment results, and usage patterns.';
    } else {
      return 'Recopilamos datos educativos para personalizar el aprendizaje y hacer seguimiento del progreso. Los datos incluyen actividad de lectura, resultados de evaluaciones y patrones de uso.';
    }
  }
}
