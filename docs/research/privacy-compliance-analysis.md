# Data Privacy and Compliance Analysis for K5 Educational Platform
## Voice Recordings, Transcriptions, and AI Interactions

**Research Date**: October 25, 2025
**Researcher**: Research Agent
**Sources Analyzed**:
- /workspaces/k5-poc-1e7850ce/docs/requirements/Compliance_Summary.md
- /workspaces/k5-poc-1e7850ce/docs/requirements/Executive_Summary_Bilingual_Platform_Requirements.md
- /workspaces/k5-poc-1e7850ce/docs/requirements/Factores_Diferenciadores_para_la_Nueva_Plataforma.md
- /workspaces/k5-poc-1e7850ce/docs/technical/COMPLIANCE-IMPLEMENTATION-SUMMARY.md
- /workspaces/k5-poc-1e7850ce/docs/plan/08-webrtc-voice-chat-future/04-backend-security.md

---

## Executive Summary

The K5 educational platform for Puerto Rico Department of Education (DEPR) must comply with **FERPA, COPPA, and ADA** regulations for handling student data, including voice recordings and transcriptions. While **no Puerto Rico-specific privacy regulations** were identified in the requirements, the platform must align with **DEPR's data privacy policies** and federal U.S. educational privacy laws.

### Key Findings:
1. ✅ **COPPA compliance required** for students under 13 (verifiable parental consent)
2. ✅ **FERPA compliance required** for all student educational records
3. ✅ **Voice recordings are educational records** under FERPA
4. ✅ **Third-party data sharing with OpenAI** requires specific consent
5. ⚠️ **No explicit data retention periods** specified for voice/transcription data in requirements
6. ⚠️ **PPRA not mentioned** in requirements documents
7. ⚠️ **No Puerto Rico-specific regulations** documented

---

## 1. Applicable Federal Regulations

### 1.1 FERPA (Family Educational Rights and Privacy Act)

**Status**: ✅ **Explicitly Required**

**Source**: Executive_Summary_Bilingual_Platform_Requirements.md, Line 88
> "Comply with privacy and accessibility (federal regulations: FERPA, ADA, COPPA)"

**Applicability to Voice Data**:
- Voice recordings of students reading = educational records
- Pronunciation assessments = educational records
- Reading fluency metrics = educational records
- AI-generated feedback = educational records

**Implementation Requirements**:
- **Access Control**: Role-based access (Parent, Teacher, Administrator)
- **Parental Rights**: Right to review, amend, and delete child's records
- **Consent Required**: For disclosure to third parties (including OpenAI API)
- **Audit Trail**: All access must be logged
- **Retention**: 7-year retention for student records (per implementation)
- **Encryption**: AES-256-GCM for data at rest

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 13-40)**:
```
FERPA Compliance Module Features:
- Role-based access control (Parent, Teacher, Administrator, District Admin)
- Comprehensive access logging with audit trail
- Parental consent management and tracking
- Data disclosure documentation and tracking
- AES-256-GCM encryption for sensitive student data
- Retention policy enforcement (7-year retention for student records)
- Right to review and amend records
- Data breach notification system
```

---

### 1.2 COPPA (Children's Online Privacy Protection Act)

**Status**: ✅ **Explicitly Required**

**Source**: Executive_Summary_Bilingual_Platform_Requirements.md, Line 88

**Applicability**:
- **ALL K-5 students** (ages 5-11) are under COPPA's 13-year threshold
- Voice recordings = personal information under COPPA
- Audio files = covered by COPPA

**Key Requirements**:

#### A. Verifiable Parental Consent (MANDATORY)
**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 42-70)**:
```
COPPA Compliance Features:
- Age verification (threshold: 13 years)
- Parental consent request and verification system
- Multiple consent methods (email, SMS, government ID, credit card, video conference)
- Data minimization principles
- Consent expiration and renewal (annual)
- Immediate deletion upon consent revocation
- Bilingual consent forms (English/Spanish)
- Digital signature support
- Data collection logging per consent
```

#### B. Consent Methods Available:
1. Email verification
2. SMS verification
3. Government ID check
4. Credit card verification
5. Video conference with staff
6. Knowledge-based authentication

#### C. COPPA Data Categories Protected:
- ✅ Photos, videos, **audio recordings**
- ✅ Persistent identifiers (cookies, device IDs)
- ✅ Behavioral data (reading patterns, clicks)
- ✅ Assessment responses
- ✅ Geolocation data

#### D. Data Minimization Principle:
**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 434-440)**:
```
COPPA Requirements:
- Verifiable parental consent
- Data minimization
- Clear privacy policy
- Data security requirements
- Right to review child's data
- Right to delete child's data
- No conditioning services on excess data collection
```

---

### 1.3 ADA (Americans with Disabilities Act) & Section 508

**Status**: ✅ **Explicitly Required**

**Source**: Executive_Summary_Bilingual_Platform_Requirements.md, Line 88

**Relevance to Voice Data**:
- Voice recordings must have **text transcriptions** for deaf/hard-of-hearing students
- Alternative assessment methods must be available
- Accommodations for students with speech disabilities

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 72-102)**:
```
ADA Accessibility Features:
- WCAG 2.1 Level AA validation
- Screen reader compatibility checks
- Alternative text for images (applies to visual feedback from voice assessments)
- Text resizing support validation
- Semantic structure (headings, lists)
```

---

### 1.4 PPRA (Protection of Pupil Rights Amendment)

**Status**: ❌ **NOT MENTIONED** in requirements

**Note**: PPRA typically applies to surveys and certain psychological assessments. If the AI voice mentor asks students personal questions beyond reading assessment, PPRA may apply. **Recommendation: Consult legal counsel.**

---

## 2. Puerto Rico-Specific Regulations

### 2.1 Local Privacy Laws

**Status**: ⚠️ **NOT EXPLICITLY DOCUMENTED**

**From Compliance_Summary.md (Line 222)**:
> "Comply with student and staff data-privacy and protection laws aligned with current DEPR policies."

**Analysis**:
- Requirements reference **DEPR policies** but don't specify Puerto Rico statutes
- Platform must align with **PowerSchool data system** (DEPR's existing system)
- No specific Puerto Rico privacy laws cited
- FERPA applies to Puerto Rico as U.S. territory

### 2.2 Cultural/Technical Considerations

**From Factores_Diferenciadores_para_la_Nueva_Plataforma.md (Lines 9-10)**:
- Voice recognition must be **trained on Puerto Rican Spanish** (local accents)
- Content must include **culturally relevant vocabulary** (coquí, huracán, plena)
- Must work with **limited connectivity** (offline mode for schools)

---

## 3. Voice Recordings: What Can/Cannot Be Stored

### 3.1 Data Collection Permissions

| Data Type | Collection Allowed? | Conditions |
|-----------|-------------------|------------|
| **Voice recordings (audio files)** | ✅ YES | Parental consent (COPPA) + FERPA notice |
| **Transcriptions (text)** | ✅ YES | Same as audio - requires consent |
| **Pronunciation analysis** | ✅ YES | Educational purpose + consent |
| **Reading fluency metrics** | ✅ YES | Educational record + consent |
| **AI interaction logs** | ✅ YES | Must be disclosed in privacy policy |
| **Student name in audio** | ✅ YES | PII - requires extra protection |
| **Student personal info shared verbally** | ⚠️ MINIMIZE | Discourage students from sharing personal details |

### 3.2 Third-Party Data Sharing (OpenAI API)

**Critical Finding**: Platform uses **OpenAI Realtime API** for voice processing.

**From 04-backend-security.md (Lines 127-129)**:
```typescript
// Get OpenAI API key
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
```

**Compliance Requirements**:

#### A. FERPA Compliance for Third-Party Vendors:
- ✅ OpenAI must sign **Data Processing Agreement (DPA)**
- ✅ OpenAI must be designated as **"School Official"** under FERPA
- ✅ Must specify legitimate educational interest
- ✅ OpenAI cannot use student data for other purposes

#### B. OpenAI Data Usage Policy:
**Per OpenAI API Terms (as of 2024)**:
- API data is **NOT used for training models** (if using API, not free tier)
- Data retention: **30 days** for abuse monitoring, then deleted
- Zero Data Retention (ZDR) available for enterprise customers

#### C. Required Disclosures:
**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 178-189)**:
```
Consent Types Required:
- Parental consent (COPPA requirement)
- Data collection consent
- Third-party data sharing consent  ← CRITICAL FOR OPENAI
- Research participation
- Behavioral tracking
```

**Recommendation**:
1. ✅ Obtain **explicit parental consent** for OpenAI API usage
2. ✅ Negotiate **Zero Data Retention** agreement with OpenAI
3. ✅ Include in privacy policy: "Voice recordings are processed by OpenAI API for speech recognition"

---

## 4. Data Retention Periods

### 4.1 Implemented Retention Policies

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 218-229)**:

| Data Type | Retention Period | Legal Basis |
|-----------|-----------------|-------------|
| **Student Records** | **7 years** | FERPA requirement |
| **Assessment Data** | **5 years** | Educational records |
| **Reading Progress** | **3 years** | Educational records |
| **Audit Logs** | **7 years** | Compliance requirement |
| **Session Data** | **30 days** | Operational data |
| **Temporary Files** | **7 days** | Operational data |
| **Deleted User Data** | **90 days** | Recovery period (soft delete) |
| **Consent Records** | **10 years** | Legal requirement |
| **COPPA Child Data** | **0 days** | Immediate deletion when consent revoked |
| **Anonymized Research Data** | **Indefinite** | No PII |

### 4.2 Voice Recording Retention (Interpretation)

**Analysis**: Requirements do **NOT explicitly specify** retention periods for voice recordings.

**Recommended Classification**:
- **Voice recordings of reading assessments** = Assessment Data = **5 years**
- **Voice recordings for practice** = Session Data = **30 days** (unless saved by teacher)
- **Transcriptions** = Same as voice recordings

**Legal Reasoning**:
- Voice recordings are **educational records** under FERPA
- Should follow **assessment data retention** policy (5 years)
- May be shorter if only used for real-time feedback (30 days)

**Recommendation**:
1. ✅ Classify voice recordings as **assessment data** (5-year retention)
2. ✅ Allow parents to request **early deletion** (FERPA right)
3. ✅ Implement **automatic deletion** after retention period
4. ✅ Provide **data export** option before deletion (portability)

---

## 5. Parent/Guardian Access Rights

### 5.1 FERPA Rights

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 423-431)**:
```
FERPA Compliance:
- Access control by relationship
- Parental rights to review/amend
- Consent for disclosure to third parties
- Annual notification of rights
- Audit of disclosures
- Right to challenge records
- Secure destruction of records
```

### 5.2 Specific Rights for Voice Interaction Data

#### A. Right to Access:
- ✅ View all voice recordings of their child
- ✅ Read all transcriptions
- ✅ See AI feedback and assessments
- ✅ Access audit logs (who accessed data, when)

#### B. Right to Amend:
- ✅ Request correction of inaccurate transcriptions
- ✅ Add explanatory notes to records
- ✅ Challenge AI assessment results

#### C. Right to Delete:
- ✅ Request deletion of voice recordings
- ✅ Revoke consent for future recordings (COPPA)
- ✅ Export data before deletion (portability)

#### D. Right to Control Disclosure:
- ✅ Control sharing with third parties (OpenAI)
- ✅ Limit sharing with teachers/administrators
- ✅ Opt-out of research participation

**From Compliance_Summary.md (Lines 196-203)**:
```
L. Daily Family Access
Provide daily family access, where families:
- Can quickly and clearly view student progress, including visual information
  on practiced skills, levels achieved, and areas needing reinforcement
- Receive suggestions to support reading at home
- See information presented clearly and in an easy-to-understand way
```

---

## 6. Data Minimization Principles

### 6.1 COPPA Data Minimization Requirements

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 172-175)**:
```
Consent Scopes:
- Minimal: Essential data only
- Standard: Standard educational features
- Enhanced: Enhanced features with more data
- Full: All features and data collection
```

### 6.2 Voice Recording Best Practices

#### What to Collect (Minimal Scope):
- ✅ Audio recording of reading passage
- ✅ Timestamp and duration
- ✅ Associated lesson/assessment ID
- ✅ Reading fluency metrics (WPM, accuracy)

#### What to AVOID Collecting:
- ❌ Background conversations
- ❌ Student personal information shared verbally
- ❌ Classroom noise beyond student voice
- ❌ Location data (unless essential)
- ❌ Device information beyond necessary for playback

#### Implementation Recommendations:
1. ✅ Implement **voice activity detection** (VAD) to record only speech
2. ✅ Use **noise cancellation** to filter background noise
3. ✅ Set **maximum recording duration** (e.g., 5 minutes per session)
4. ✅ Prompt students: "Only read the passage aloud - don't share personal information"

---

## 7. Consent Requirements for Minors

### 7.1 Age-Based Consent Rules

| Age Group | Consent Requirements |
|-----------|---------------------|
| **Under 13** (ALL K-5 students) | ✅ **Verifiable parental consent required** (COPPA) |
| **13-17** (NOT APPLICABLE) | Parent consent or student assent (FERPA) |
| **18+** (NOT APPLICABLE) | Student self-consent |

### 7.2 COPPA Consent Workflow

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 165-178)**:

#### Step 1: Age Verification
- System detects student is under 13 (ALL K-5 students)
- Platform blocks data collection until consent obtained

#### Step 2: Consent Request
- **Bilingual consent form** (English/Spanish) sent to parent
- Form explains:
  - What data is collected (voice recordings, transcriptions)
  - Why it's collected (reading assessment, AI feedback)
  - Who has access (teacher, AI system, third parties)
  - How long it's stored (5 years for assessments)
  - How to revoke consent

#### Step 3: Verification Methods
- Email verification (link clicked)
- SMS code verification
- Government ID upload
- Credit card verification ($0.50 charge)
- Video conference with school staff

#### Step 4: Consent Documentation
- Digital signature captured
- Timestamp recorded
- Consent stored for **10 years**
- Annual renewal required

#### Step 5: Ongoing Management
- Parent can **revoke consent** anytime
- **Immediate deletion** of child's data upon revocation
- Parent can **review/download** data anytime

### 7.3 FERPA Annual Notice

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Line 427)**:
- Schools must provide **annual notification** of FERPA rights to parents
- Notice must explain rights to access, amend, and control disclosure

---

## 8. Data Access, Deletion, and Portability

### 8.1 Access Controls (RBAC)

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 280-321)**:

| Role | Voice Recording Access | Restrictions |
|------|----------------------|-------------|
| **Parent** | ✅ Full access to own child's recordings | Cannot access other students |
| **Teacher** | ✅ Access to assigned students only | Must have legitimate educational interest |
| **School Admin** | ✅ School-wide access with logging | All access logged for audit |
| **District Admin** | ✅ District-wide access with restrictions | Limited by data type (basic vs. sensitive) |
| **Student** | ✅ Can listen to own recordings | Cannot delete without parent consent |
| **Researcher** | ⚠️ De-identified data only | NO access to voice recordings with PII |
| **Support Staff** | ❌ Limited operational access | NO access to student recordings |

### 8.2 Deletion Procedures

#### A. Soft Delete (Default):
- Recordings marked as "deleted"
- **90-day grace period** for recovery
- Not accessible to users during grace period
- Permanently deleted after 90 days

#### B. Hard Delete (Immediate):
- COPPA consent revocation = **immediate deletion**
- Parent request for immediate deletion
- No recovery possible

#### C. Anonymization (Alternative):
- Remove all PII from recordings
- Keep anonymous data for research
- Voice characteristics may still identify individual ⚠️

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 207-217)**:
```
Data Retention Module Features:
- Automated retention policy enforcement
- Scheduled deletion with grace periods (default 30 days)
- Soft delete support (mark as deleted, keep for recovery)
- Hard delete for permanent removal
- Data anonymization as alternative to deletion
- Data export before deletion (right to data portability)
- User data inventory and reports
- Deletion cancellation within grace period
```

### 8.3 Data Portability (Export)

**Parents can export**:
- ✅ All voice recordings (MP3/WAV format)
- ✅ All transcriptions (TXT/PDF format)
- ✅ Reading assessment results (PDF/Excel)
- ✅ AI feedback and recommendations (PDF)
- ✅ Access audit logs (CSV)

**Export formats supported**:
- JSON (machine-readable)
- CSV (Excel-compatible)
- PDF (human-readable reports)
- Audio files (MP3, WAV)

---

## 9. Security Requirements for Voice Data

### 9.1 Encryption Standards

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 103-130)**:

#### Data at Rest:
- **AES-256-GCM** encryption for voice files in storage
- **RSA-OAEP (4096-bit)** for asymmetric encryption
- **PBKDF2** key derivation (100,000 iterations)
- File encryption with chunking (1MB chunks for large files)

#### Data in Transit:
- **TLS 1.3** for all network communications
- **Hybrid encryption** for OpenAI API calls
- **WebRTC DTLS** for real-time voice streaming

### 9.2 Access Logging and Audit Trail

**From COMPLIANCE-IMPLEMENTATION-SUMMARY.md (Lines 131-164)**:

**Every access to voice recordings logs**:
- ✅ Timestamp (UTC)
- ✅ User ID, name, role, email
- ✅ Action performed (view, download, delete)
- ✅ Resource accessed (specific recording ID)
- ✅ IP address, user agent, location
- ✅ Success/failure status

**Audit logs retained for**: **7 years** (compliance requirement)

**Tamper detection**:
- Sequence verification (logs numbered sequentially)
- Timestamp validation (chronological order)
- Checksum verification

### 9.3 Backend Security (OpenAI Integration)

**From 04-backend-security.md (Lines 1-10)**:

**Security Principles**:
1. ✅ **Never expose API keys in frontend**
2. ✅ **Use ephemeral tokens** with short expiration (60 seconds)
3. ✅ **Validate authentication** before issuing tokens
4. ✅ **Rate limit** token generation (10 tokens/hour per user)
5. ✅ **Log usage** for monitoring and cost control

**Rate Limiting** (Lines 232-249):
- 10 tokens per hour per user
- Prevents abuse and controls costs
- Tracks usage in database

**Token Usage Tracking**:
- All token generations logged
- User ID, role, timestamp recorded
- Used for auditing and cost analysis

---

## 10. Gap Analysis & Recommendations

### 10.1 Explicit Requirements Missing from Documentation

| Area | Status | Recommendation |
|------|--------|---------------|
| **Voice recording retention period** | ❌ Not specified | Define as "5 years" (assessment data) or "30 days" (practice) |
| **Transcription data classification** | ❌ Not specified | Classify as educational record (same as audio) |
| **OpenAI Data Processing Agreement** | ❌ Not mentioned | **CRITICAL**: Execute DPA with OpenAI before launch |
| **Puerto Rico privacy laws** | ❌ Not documented | Research PR-specific statutes, consult DEPR legal |
| **PPRA applicability** | ❌ Not addressed | Determine if AI questions trigger PPRA survey provisions |
| **Biometric data classification** | ⚠️ Unclear | Voice prints may be biometric - check state laws |
| **Student voice characteristics** | ⚠️ Not addressed | Voice analysis = sensitive data - extra protection needed |
| **Anonymous voice identification** | ⚠️ Risk | Voice characteristics can identify individuals even without name |

### 10.2 Critical Action Items

#### Immediate (Before Demo Launch):
1. ✅ **Execute Data Processing Agreement with OpenAI**
   - Designate OpenAI as "School Official" under FERPA
   - Require Zero Data Retention (ZDR) for student voice data
   - Specify: "No data used for AI training"

2. ✅ **Draft Comprehensive Privacy Policy**
   - Bilingual (English/Spanish)
   - Plain language for parents
   - Specific section on voice recordings
   - Explain OpenAI third-party processing

3. ✅ **Implement COPPA Consent Workflow**
   - Parental consent form (bilingual)
   - Multiple verification methods
   - Annual renewal reminders
   - Easy revocation process

4. ✅ **Configure Data Retention Policies**
   - Set voice recording retention: **5 years** (assessment) or **30 days** (practice)
   - Implement automatic deletion after retention period
   - Enable soft delete with 90-day grace period

5. ✅ **Deploy Access Control System**
   - Role-based permissions (already implemented)
   - Parent portal for viewing child's recordings
   - Teacher dashboard with audit logging
   - Admin tools for compliance reporting

#### Short-Term (First 3 Months):
6. ✅ **Conduct Privacy Impact Assessment (PIA)**
   - Identify all data flows involving voice recordings
   - Document third-party data sharing (OpenAI)
   - Assess risks and mitigation strategies

7. ✅ **Train DEPR Staff on Compliance**
   - FERPA requirements for voice data
   - COPPA consent procedures
   - Parent access request handling
   - Data breach response protocol

8. ✅ **Establish Data Breach Response Plan**
   - Notification timeline (72 hours for GDPR-equivalent)
   - Parent notification procedures
   - Regulatory reporting (to DEPR, FTC for COPPA)

9. ✅ **Implement Monitoring and Alerting**
   - Track consent renewal rates (target ≥90%)
   - Monitor unauthorized access attempts
   - Alert on suspicious data access patterns
   - Weekly compliance reports to DEPR

#### Ongoing (Continuous):
10. ✅ **Annual Compliance Audits**
    - FERPA compliance review
    - COPPA consent verification
    - Security vulnerability scanning
    - Third-party vendor audits (OpenAI)

11. ✅ **Parent Education Campaign**
    - Webinars explaining voice recording privacy
    - FAQ in English and Spanish
    - Video tutorials on accessing child's data
    - Annual FERPA rights notice

---

## 11. Compliance Summary Table

| Requirement | Applicable? | Implementation Status | Risk Level |
|-------------|------------|---------------------|-----------|
| **FERPA** | ✅ YES | ✅ Implemented (7 modules, 7,381 lines) | 🟢 LOW |
| **COPPA** | ✅ YES | ✅ Implemented (consent workflow, deletion) | 🟡 MEDIUM |
| **ADA** | ✅ YES | ✅ Implemented (WCAG 2.1 AA, transcriptions) | 🟢 LOW |
| **PPRA** | ⚠️ UNCLEAR | ❌ Not addressed | 🟡 MEDIUM |
| **Puerto Rico Laws** | ⚠️ UNCLEAR | ❌ Not researched | 🟡 MEDIUM |
| **OpenAI DPA** | ✅ YES | ⚠️ NOT DOCUMENTED | 🔴 HIGH |
| **Voice Retention** | ✅ YES | ⚠️ Period not specified | 🟡 MEDIUM |
| **Parental Consent** | ✅ YES | ✅ Implemented (COPPA workflow) | 🟢 LOW |
| **Data Export** | ✅ YES | ✅ Implemented (JSON, CSV, PDF) | 🟢 LOW |
| **Encryption** | ✅ YES | ✅ Implemented (AES-256-GCM) | 🟢 LOW |
| **Audit Logging** | ✅ YES | ✅ Implemented (7-year retention) | 🟢 LOW |

---

## 12. Key Stakeholder Communication

### 12.1 For Parents/Guardians:

**"Your child's voice recordings are protected by federal law (FERPA and COPPA). You have the right to:**
- ✅ Access all recordings and transcriptions
- ✅ Request deletion at any time
- ✅ Download copies for your records
- ✅ Know who accessed your child's data
- ✅ Revoke consent for future recordings
- ✅ Ask questions about how data is used

**We use OpenAI technology to provide instant feedback on reading. Voice data is:**
- 🔒 Encrypted during transmission and storage
- ⏱️ Stored for 5 years (assessments) or 30 days (practice)
- 🚫 NOT used to train AI models (per OpenAI agreement)
- 🔍 Accessible only to authorized teachers and admins
- 🗑️ Deleted immediately if you revoke consent"

### 12.2 For Teachers:

**"When working with student voice recordings:**
- ✅ Access only assigned students (system enforces this)
- ✅ All your access is logged for compliance
- ✅ Use data for educational purposes only
- ✅ Do not share recordings outside platform
- ✅ Report technical issues to avoid compliance gaps
- ✅ Complete annual FERPA training"

### 12.3 For DEPR Administrators:

**"Platform compliance status:**
- ✅ FERPA: Fully compliant (role-based access, audit logging)
- ✅ COPPA: Parental consent workflow operational
- ✅ ADA: WCAG 2.1 AA compliant (transcriptions available)
- ⚠️ OpenAI DPA: Requires execution before production launch
- ⚠️ Data retention: Specify exact periods for voice recordings
- 📊 Compliance reports: Available daily/weekly/monthly"

---

## 13. Technical Implementation Notes

### 13.1 Database Schema for Voice Recordings

**Recommendation**: Extend existing schema with voice-specific tables:

```sql
CREATE TABLE voice_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  assessment_id UUID REFERENCES assessments(id),

  -- File Storage
  storage_bucket TEXT NOT NULL DEFAULT 'student-voice-recordings',
  storage_path TEXT NOT NULL,
  file_format TEXT NOT NULL CHECK (file_format IN ('mp3', 'wav', 'webm')),
  file_size_bytes BIGINT NOT NULL,
  duration_seconds DECIMAL(10,2) NOT NULL,

  -- Content Classification
  recording_type TEXT NOT NULL CHECK (recording_type IN (
    'reading_assessment',
    'practice_reading',
    'voice_chat_ai',
    'pronunciation_drill'
  )),

  -- Consent and Privacy
  coppa_consent_id UUID NOT NULL REFERENCES coppa_consents(id),
  ferpa_disclosed_to JSONB,  -- Track third-party disclosures

  -- Processing Metadata
  transcription_text TEXT,
  transcription_confidence DECIMAL(3,2),
  language_detected TEXT NOT NULL CHECK (language_detected IN ('spanish', 'english')),

  -- Reading Metrics
  words_per_minute DECIMAL(6,2),
  accuracy_percentage DECIMAL(5,2),
  fluency_score DECIMAL(5,2),

  -- AI Analysis
  ai_feedback_text TEXT,
  ai_model_used TEXT,  -- 'gpt-realtime', 'whisper-1'
  openai_request_id TEXT,  -- For audit trail

  -- Retention and Deletion
  retention_period_days INTEGER NOT NULL DEFAULT 1825,  -- 5 years for assessments
  scheduled_deletion_date TIMESTAMPTZ,
  soft_deleted_at TIMESTAMPTZ,
  permanently_deleted_at TIMESTAMPTZ,
  deletion_reason TEXT,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,

  CONSTRAINT valid_retention CHECK (retention_period_days > 0)
);

-- Indexes for performance
CREATE INDEX idx_voice_recordings_student ON voice_recordings(student_id);
CREATE INDEX idx_voice_recordings_type ON voice_recordings(recording_type);
CREATE INDEX idx_voice_recordings_deletion ON voice_recordings(scheduled_deletion_date)
  WHERE permanently_deleted_at IS NULL;
CREATE INDEX idx_voice_recordings_consent ON voice_recordings(coppa_consent_id);

-- RLS Policies
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;

-- Parents can access their child's recordings
CREATE POLICY "parents_access_child_recordings"
ON voice_recordings FOR SELECT
USING (
  student_id IN (
    SELECT child_id FROM parent_child_relationships
    WHERE parent_id = auth.uid()
  )
);

-- Teachers can access assigned students
CREATE POLICY "teachers_access_assigned_recordings"
ON voice_recordings FOR SELECT
USING (
  student_id IN (
    SELECT student_id FROM teacher_student_assignments
    WHERE teacher_id = auth.uid()
  )
);
```

### 13.2 Automated Retention Enforcement

```typescript
// Daily cron job to enforce retention policies
async function enforceVoiceRecordingRetention() {
  // Find recordings past retention period
  const { data: expiredRecordings } = await supabase
    .from('voice_recordings')
    .select('id, storage_path, student_id')
    .lt('scheduled_deletion_date', new Date())
    .is('permanently_deleted_at', null);

  for (const recording of expiredRecordings) {
    // Soft delete first (90-day grace period)
    if (!recording.soft_deleted_at) {
      await supabase
        .from('voice_recordings')
        .update({
          soft_deleted_at: new Date(),
          scheduled_deletion_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        })
        .eq('id', recording.id);

      // Notify parent of pending deletion
      await sendParentNotification(recording.student_id,
        'Voice recording will be permanently deleted in 90 days. Export now if needed.');
    }
    // Hard delete after grace period
    else {
      // Delete from storage
      await supabase.storage
        .from('student-voice-recordings')
        .remove([recording.storage_path]);

      // Mark as permanently deleted
      await supabase
        .from('voice_recordings')
        .update({ permanently_deleted_at: new Date() })
        .eq('id', recording.id);

      // Log deletion for audit
      await auditLog('voice_recording_deleted', {
        recordingId: recording.id,
        reason: 'retention_period_expired'
      });
    }
  }
}
```

---

## 14. Conclusion and Final Recommendations

### 14.1 Summary of Compliance Status

The K5 platform has **strong foundational compliance implementation** for FERPA, COPPA, and ADA with comprehensive modules covering encryption, access control, consent management, and audit logging.

**Strengths**:
- ✅ 7,381 lines of compliance code implemented
- ✅ AES-256-GCM encryption for data at rest
- ✅ RBAC with 10 roles and fine-grained permissions
- ✅ COPPA parental consent workflow with multiple verification methods
- ✅ Comprehensive audit logging (7-year retention)
- ✅ Automated data retention and deletion
- ✅ Bilingual consent forms (English/Spanish)

**Critical Gaps**:
- 🔴 **OpenAI Data Processing Agreement not documented** (HIGH RISK)
- 🟡 **Voice recording retention periods not explicitly specified** (MEDIUM RISK)
- 🟡 **Puerto Rico-specific privacy laws not researched** (MEDIUM RISK)
- 🟡 **PPRA applicability not assessed** (MEDIUM RISK)

### 14.2 Top 5 Action Items Before Production Launch

1. **Execute OpenAI Data Processing Agreement**
   - Timeline: **IMMEDIATE (before demo)**
   - Owner: DEPR Legal + Vendor Management
   - Deliverable: Signed DPA with Zero Data Retention clause

2. **Define Voice Recording Retention Policy**
   - Timeline: **1 week**
   - Owner: DEPR Compliance Officer
   - Decision: 5 years (assessments) vs. 30 days (practice)

3. **Conduct Privacy Impact Assessment (PIA)**
   - Timeline: **2 weeks**
   - Owner: DEPR IT + Legal
   - Deliverable: Formal PIA document filed with DEPR

4. **Deploy Parent Portal with Voice Access**
   - Timeline: **3 weeks**
   - Owner: Development Team
   - Features: View/download recordings, revoke consent, export data

5. **Create Compliance Training Program**
   - Timeline: **4 weeks**
   - Owner: DEPR Professional Development
   - Audience: All 551 K-5 schools (teachers, admins)

### 14.3 Ongoing Monitoring (Post-Launch)

- **Weekly**: Consent renewal tracking (target ≥90%)
- **Monthly**: Compliance reports to DEPR leadership
- **Quarterly**: Security vulnerability scans
- **Annually**: Third-party compliance audit (FERPA, COPPA, ADA)

---

## 15. References

1. **FERPA Regulations**: 20 U.S.C. § 1232g; 34 CFR Part 99
2. **COPPA Regulations**: 15 U.S.C. §§ 6501–6506; 16 CFR Part 312
3. **ADA/Section 508**: 29 U.S.C. § 794d; WCAG 2.1
4. **DEPR Requirements**: Compliance_Summary.md (RFP VII)
5. **OpenAI API Terms**: https://openai.com/policies/terms-of-use
6. **Platform Implementation**: COMPLIANCE-IMPLEMENTATION-SUMMARY.md

---

**Document Control**:
- **Version**: 1.0
- **Date**: October 25, 2025
- **Next Review**: Before production launch
- **Distribution**: DEPR Legal, IT, Compliance, Development Team

**Confidentiality**: This document contains sensitive compliance information. Distribution restricted to authorized DEPR personnel and platform vendors under NDA.
