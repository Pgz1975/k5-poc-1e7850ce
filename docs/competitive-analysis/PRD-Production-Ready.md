# Product Requirements Document (PRD)
# K-5 Bilingual AI-Powered Reading Platform for Puerto Rico
## Production-Ready Specification

**Version:** 2.0 (Production)
**Date:** October 23, 2025
**Prepared For:** Puerto Rico Department of Education (DEPR)
**Prepared By:** Learn Aid LLC / 3WG Education LLC
**Status:** Production Requirements

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Product Vision and Goals](#2-product-vision-and-goals)
3. [Target Users and Personas](#3-target-users-and-personas)
4. [Current State Analysis](#4-current-state-analysis)
5. [Production Feature Requirements](#5-production-feature-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Data Models and Database Schema](#7-data-models-and-database-schema)
8. [API Specifications](#8-api-specifications)
9. [Security and Compliance](#9-security-and-compliance)
10. [Performance Requirements](#10-performance-requirements)
11. [Scalability Requirements](#11-scalability-requirements)
12. [Integration Requirements](#12-integration-requirements)
13. [UI/UX Requirements](#13-uiux-requirements)
14. [Testing Requirements](#14-testing-requirements)
15. [Deployment Strategy](#15-deployment-strategy)
16. [Success Metrics and KPIs](#16-success-metrics-and-kpis)
17. [Timeline and Milestones](#17-timeline-and-milestones)
18. [Risks and Mitigation](#18-risks-and-mitigation)
19. [Gap Analysis](#19-gap-analysis)
20. [Future Considerations](#20-future-considerations)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Overview

The K-5 Bilingual AI-Powered Reading Platform is a comprehensive educational technology solution designed specifically for the Puerto Rico Department of Education (DEPR) to enhance literacy and reading proficiency among students in Kindergarten through 5th grade. The platform combines cutting-edge AI technology, voice recognition, adaptive learning, and culturally relevant content to provide a fully bilingual (Spanish/English) learning experience.

### 1.2 Business Objectives

- **Primary Goal:** Improve reading proficiency across 165,000 students in 1,100 K-5 schools throughout Puerto Rico
- **Target Adoption:** Achieve 50% school adoption within 6 months of deployment
- **Engagement Goal:** Minimum 3 sessions per student per week
- **Performance Target:** Measurable improvement in WCPM (Words Correct Per Minute) scores aligned with DEPR benchmarks
- **Compliance Requirement:** 100% compliance with FERPA, COPPA, ADA, Section 508, and WCAG 2.1 AA standards

### 1.3 Key Differentiators

1. **Puerto Rican Localization:** Content, voice recognition, and cultural references specifically designed for Puerto Rico
2. **Continuous AI Assessment:** Real-time WCPM evaluation (vs. traditional 3x/year testing)
3. **Bilingual Native Experience:** Seamless switching between Spanish (Puerto Rican accent) and English (American accent)
4. **Comprehensive Role-Based Access:** 8 distinct user roles with differentiated dashboards
5. **Advanced Voice Recognition:** Client-side processing with 95%+ accuracy for Puerto Rican Spanish
6. **Multi-Level Analytics:** Student, classroom, school, regional (ORE), and island-wide reporting

### 1.4 Current Implementation Status

**Platform Name:** [TBD - Requires branding decision]
**Technology Stack:** React 18.3.1, TypeScript 5.8.3, Vite 5.4.19, Supabase Enterprise Cloud, PostgreSQL 15.x
**Current Deployment:** POC/Demo stage with 703 lessons (463 Spanish + 240 English)
**Target for Production:** 1,500+ lessons with complete K-5 coverage in both languages

---

## 2. PRODUCT VISION AND GOALS

### 2.1 Vision Statement

To provide every K-5 student in Puerto Rico with an AI-powered, culturally relevant, bilingual reading platform that adapts to individual learning needs, celebrates Puerto Rican culture, and empowers students, teachers, and families to achieve measurable reading proficiency improvements.

### 2.2 Strategic Goals

#### Short-Term Goals (0-6 months)
1. Complete production deployment to all 1,100 K-5 schools
2. Achieve 50% active school adoption
3. Train 5,500+ teachers and administrators
4. Establish technical support infrastructure
5. Complete PowerSchool SSO integration

#### Medium-Term Goals (6-12 months)
1. Achieve 75% active school adoption
2. Demonstrate measurable WCPM improvements across 80% of active students
3. Achieve 90% platform satisfaction rating from teachers
4. Expand curriculum to 2,000+ lessons
5. Launch native mobile apps (iOS/Android)

#### Long-Term Goals (12-36 months)
1. Achieve 95% school adoption with consistent usage
2. Become the primary literacy assessment tool for DEPR
3. Expand to middle school (6-8 grades)
4. Integrate with additional government agencies (ACUDEN, DCR)
5. Export model to other U.S. territories and Latin American countries

### 2.3 Success Criteria

The platform will be considered successful when:

1. **Adoption Metrics:**
   - 50% schools using platform within 6 months
   - 75% schools using platform within 12 months
   - Average 3+ sessions per student per week

2. **Performance Metrics:**
   - 70% of students showing WCPM improvement
   - 85% of at-risk students receiving interventions
   - 80%+ completion rate for assigned activities

3. **Satisfaction Metrics:**
   - 85%+ teacher satisfaction rating
   - 75%+ parent satisfaction rating
   - 90%+ student engagement scores

4. **Technical Metrics:**
   - 99.9% uptime SLA
   - <2s page load times
   - <1s voice recognition latency
   - Zero data breaches or privacy violations

---

## 3. TARGET USERS AND PERSONAS

### 3.1 User Roles and Access Hierarchy

The platform supports **8 distinct user roles** with differentiated access:

| Role | Count | Geographic Scope | Language Scope | Primary Functions |
|------|-------|-----------------|----------------|-------------------|
| **Students (K-5)** | ~165,000 | Individual | Both | Learning activities, assessments, progress tracking |
| **Parents/Families** | ~165,000 | Individual children | Both | Progress monitoring, home support |
| **Teachers** | ~5,500 | Classroom | One language | Class management, assessment creation, intervention |
| **School Directors** | ~1,100 | School-wide | Both | School analytics, teacher oversight |
| **Regional Directors (ORE)** | 7 | Regional (7 ORE) | Both | Regional analytics, multi-school comparison |
| **Spanish Program (DEPR)** | ~5-10 | Island-wide | Spanish only | Program management, curriculum alignment |
| **English Program (DEPR)** | ~5-10 | Island-wide | English only | Program management, curriculum alignment |
| **DEPR Executive** | ~10-20 | Island-wide | Both | Strategic oversight, policy decisions |

### 3.2 Detailed User Personas

#### Persona 1: María - 2nd Grade Student
- **Age:** 7 years old
- **Location:** Ponce, Puerto Rico
- **Language:** Primarily Spanish at home, learning English
- **Device:** Shared tablet at school, parent's smartphone at home
- **Goals:**
  - Improve reading fluency in Spanish
  - Learn English reading basics
  - Earn achievement badges and rewards
- **Pain Points:**
  - Struggles with certain consonant blends
  - Shy about reading aloud in class
  - Inconsistent internet at home
- **Platform Needs:**
  - Culturally relevant content (Puerto Rican stories)
  - Gamified learning with immediate feedback
  - Offline mode for home use
  - Voice practice in private, safe environment

#### Persona 2: Carmen - 3rd Grade Spanish Teacher
- **Experience:** 12 years teaching
- **Location:** Bayamón, Puerto Rico
- **Class Size:** 28 students with mixed abilities
- **Goals:**
  - Differentiate instruction for diverse learners
  - Identify at-risk students early
  - Meet DEPR curriculum standards
  - Reduce time on manual grading
- **Pain Points:**
  - Limited time for individual student assessment
  - Difficulty tracking progress across multiple students
  - Need for intervention strategies for struggling readers
  - Paperwork and administrative burden
- **Platform Needs:**
  - Quick overview of class performance
  - Automated assessment generation
  - Clear intervention recommendations
  - Easy-to-understand reports for parents

#### Persona 3: Luis - Family Member/Parent
- **Relation:** Father of 1st and 4th grade students
- **Education:** High school diploma
- **Work:** Full-time, evening shift
- **Goals:**
  - Support children's education at home
  - Understand children's progress
  - Know how to help with reading
- **Pain Points:**
  - Limited time during weekdays
  - Not confident in teaching English
  - Unsure how to interpret school reports
- **Platform Needs:**
  - Simple, visual progress dashboards
  - Spanish-language family portal
  - Specific suggestions for home activities
  - WhatsApp/SMS notifications

#### Persona 4: Dra. Torres - School Director
- **Experience:** 20 years in education, 5 as director
- **School:** K-5 school with 450 students, 18 teachers
- **Location:** San Juan
- **Goals:**
  - Improve school-wide literacy scores
  - Ensure compliance with DEPR requirements
  - Support teachers with data-driven decisions
  - Demonstrate progress to ORE leadership
- **Pain Points:**
  - Overwhelming amount of data from multiple systems
  - Difficulty identifying trends across grades
  - Need to justify budget and program decisions
  - Limited time for in-depth analysis
- **Platform Needs:**
  - Executive dashboard with key metrics
  - Grade-level and teacher comparisons
  - Ability to generate reports for ORE
  - Usage monitoring by student and teacher

#### Persona 5: Prof. Ramírez - ORE Arecibo Regional Director
- **Responsibility:** Oversee 150+ schools in Arecibo region
- **Experience:** 25 years in education administration
- **Goals:**
  - Ensure consistent implementation across region
  - Identify schools needing additional support
  - Report regional progress to DEPR central
  - Allocate resources effectively
- **Pain Points:**
  - Inconsistent adoption across schools
  - Difficulty comparing school performance
  - Limited visibility into actual platform usage
  - Need to justify regional interventions
- **Platform Needs:**
  - Regional overview with school comparisons
  - Usage analytics by school
  - Ability to filter by grade, subject, time period
  - Export capabilities for presentations

---

## 4. CURRENT STATE ANALYSIS

### 4.1 Technology Stack Assessment

#### Frontend (✅ Production-Ready)
- **Framework:** React 18.3.1 with TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19 (fast, modern)
- **UI Components:** Radix UI (accessible, 14 components)
- **Styling:** Tailwind CSS 3.4.1 with animations
- **State Management:** @tanstack/react-query 5.83.0
- **Internationalization:** i18next 25.6.0 + react-i18next 16.0.0
- **Forms:** react-hook-form 7.61.1 + zod 3.25.76 (validation)
- **Charts:** Recharts 2.15.4
- **Icons:** Lucide React 0.462.0
- **Notifications:** Sonner 1.7.4
- **Assessment:** Production-ready with modern stack

#### Backend (✅ Production-Ready)
- **Provider:** Supabase Enterprise Cloud
- **Database:** PostgreSQL 15.x
- **Authentication:** Supabase Auth 2.58.0 (OAuth 2.0, SAML 2.0)
- **Real-time:** WebSockets with JWT
- **Region:** us-east-1 (primary), us-west-2 (secondary)
- **Backup:** Point-in-Time Recovery (7 days)
- **Scalability:** Auto-scaling to 100,000+ concurrent users
- **Security:** Row Level Security (RLS), AES-256 encryption
- **Certification:** SOC 2 Type II certified
- **Assessment:** Enterprise-grade, production-ready

#### AI/Voice (✅ Production-Ready)
- **Voice Recognition:** Web Speech API (OpenAI Whisper Large v3)
- **AI Analysis:** Lovable AI Gateway (Google Gemini 2.5 Flash)
- **Processing:** Client-side (privacy compliant)
- **Accuracy:** 95%+ for Puerto Rican Spanish
- **Latency:** <1s for voice, 1-2s for AI analysis
- **Assessment:** Excellent accuracy, low latency, COPPA compliant

### 4.2 Feature Implementation Status

#### ✅ FULLY IMPLEMENTED (Production-Ready)

1. **Bilingual Interface (A)**
   - ✅ Complete Spanish/English translation
   - ✅ Language switcher in all pages
   - ✅ i18next integration with context management
   - ✅ Persistent language preference

2. **Curriculum Alignment (B-C)**
   - ✅ K-5 standards aligned with DEPR
   - ✅ 703 lessons implemented (463 ES + 240 EN)
   - ✅ Subject and grade expectations integrated
   - ✅ Interactive activities and games

3. **Voice Recognition (F)**
   - ✅ Whisper API integration
   - ✅ Bilingual oral reading support
   - ✅ Pronunciation, fluency, accuracy analysis
   - ✅ Syllable and letter practice modes
   - ✅ English pronunciation feedback
   - ✅ Real-time WCPM calculation

4. **AI Integration (E)**
   - ✅ Adaptive difficulty adjustment
   - ✅ Personalized learning profiles
   - ✅ Strengths and weaknesses detection
   - ✅ Automatic reinforcement suggestions
   - ✅ Reading level determination

5. **Assessments (C-D, G-J)**
   - ✅ Formative and summative by area
   - ✅ AI-based test generator
   - ✅ Question bank per standard (3+ questions each)
   - ✅ Literal and inferential comprehension
   - ✅ 70% minimum passing score
   - ✅ Admin interface for test creation

6. **Monitoring Dashboard (K)**
   - ✅ 17+ performance metrics implemented
   - ✅ Reading fluency (WCPM) tracking
   - ✅ Comprehension and writing metrics
   - ✅ Activity streaks and engagement tracking
   - ✅ Visual data (charts, graphs, tables)
   - ✅ Export to PDF, CSV, JSON

7. **Family Access (L)**
   - ✅ Family portal with multi-student support
   - ✅ Progress tracking and metrics
   - ✅ Achievement system
   - ✅ Home support suggestions

8. **Teacher Resources (M)**
   - ✅ 15+ resource materials
   - ✅ Lesson plans (5-10 days)
   - ✅ Intervention guides
   - ✅ Downloadable materials

9. **Multi-Device Access (N)**
   - ✅ Responsive React application
   - ✅ Compatible: Windows, iOS, Android
   - ✅ PWA capabilities
   - ✅ Mobile-first design (320px - 4K)

10. **Authentication & SSO (O)**
    - ✅ Email/Password authentication
    - ✅ Google OAuth implementation
    - ✅ PowerSchool API mapping ready
    - ✅ Secure credential system
    - ⚠️ **Pending:** PowerSchool credentials from DEPR

11. **Privacy & Data Protection (P)**
    - ✅ Full Privacy Policy implemented
    - ✅ FERPA compliant design
    - ✅ COPPA compliant (no voice storage)
    - ✅ Secure parental consent system
    - ✅ Row Level Security (RLS) policies
    - ✅ AES-256 encryption

12. **Training & Support (Q)**
    - ✅ Ticketing system
    - ✅ 6 tutorial videos
    - ✅ 16 user guides (PDF)
    - ✅ FAQs and best practices
    - ✅ Technical support structure

13. **Reporting & Marketing (R-W)**
    - ✅ AI-generated social media content
    - ✅ Automated reporting (weekly, monthly, quarterly)
    - ✅ Satisfaction surveys
    - ✅ Metrics dashboard

### 4.3 Content Status

#### Curriculum Implementation
- **Total Lessons Developed:** 703
- **Spanish Lessons:** 463 (complete K-5 foundation)
- **English Lessons:** 240 (K-G1 complete, G2-5 partial)
- **Target for Production:** 1,500+ lessons
- **Gap:** 797 lessons needed (primarily English G2-5)

#### Grade-Level Distribution
| Grade | Spanish | English | Total | Target | Status |
|-------|---------|---------|-------|--------|--------|
| K | 120 | 80 | 200 | 240 | 83% |
| 1 | 100 | 80 | 180 | 280 | 64% |
| 2 | 90 | 30 | 120 | 280 | 43% |
| 3 | 75 | 20 | 95 | 300 | 32% |
| 4 | 45 | 15 | 60 | 300 | 20% |
| 5 | 33 | 15 | 48 | 300 | 16% |
| **Total** | **463** | **240** | **703** | **1,700** | **41%** |

#### Activity Types Implemented
1. ✅ Word Building Activities
2. ✅ Syllable Division Exercises
3. ✅ Reading Fluency Practice
4. ✅ Basic Comprehension Questions
5. ✅ Phonics Introduction
6. ✅ Vocabulary Matching
7. ✅ Educational Games (Kindergarten focus)
8. ✅ Voice Reading Assessment

### 4.4 Database Schema Status

#### Core Tables (✅ Implemented)
- `profiles` - User profiles with RLS
- `user_roles` - Role-based access control
- `students` - Student information with grade levels
- `reading_progress` - Session tracking and WCPM scores
- `assessments` - AI-generated and manual assessments
- `assessment_results` - Student performance data
- `lessons` - Curriculum content management
- `lesson_progress` - Student lesson completion
- `family_access` - Parent-child relationships
- `schools` - School directory with ORE mapping
- `access_codes` - Secure distribution system

#### Key Functions (✅ Implemented)
- `has_role()` - Role validation for RLS
- `generate_comprehensive_report()` - Multi-criteria executive reports
- `get_student_error_analysis()` - Phonetic error analysis
- `calculate_usage_gaps()` - Usage gap detection
- `validate_and_use_access_code()` - Access code system

### 4.5 Integration Status

#### ✅ Active Integrations
- Supabase Enterprise Cloud (backend)
- Lovable AI Gateway (AI analysis)
- Google OAuth (authentication)
- Web Speech API (voice recognition)
- Resend API (email notifications - ready)

#### ⚠️ Pending Integrations
- **PowerSchool SSO** - Awaiting DEPR credentials
  - API mapping complete
  - SAML 2.0 configured
  - Requires: Client ID, Client Secret, District Code

#### 📋 Future Integrations
- WhatsApp Business API (parent notifications)
- SMS gateway for Puerto Rico carriers
- DEPR data export systems
- ORE reporting portals

---

## 5. PRODUCTION FEATURE REQUIREMENTS

### 5.1 Priority Matrix

| Feature Category | Current Status | Production Requirement | Priority | Effort |
|-----------------|----------------|----------------------|----------|---------|
| Curriculum Completion (English G2-5) | 41% complete | 100% (1,500+ lessons) | CRITICAL | HIGH |
| PowerSchool SSO Integration | 95% ready | 100% operational | CRITICAL | LOW |
| Platform Branding/Naming | TBD | Finalized brand identity | HIGH | LOW |
| Offline Mode | Not implemented | Basic offline capability | HIGH | MEDIUM |
| Mobile Apps (iOS/Android) | PWA only | Native apps published | MEDIUM | HIGH |
| WhatsApp Integration | Not implemented | Parent notifications | MEDIUM | MEDIUM |
| Advanced Gamification | Basic badges | Full achievement system | MEDIUM | MEDIUM |
| Predictive Analytics | Not implemented | At-risk student prediction | LOW | HIGH |
| Multi-language Support | ES/EN only | Add French (future) | LOW | MEDIUM |

### 5.2 Critical Production Requirements (MUST HAVE)

#### 5.2.1 Complete Curriculum (CRITICAL)
**Status:** 41% complete (703/1,700 lessons)
**Production Requirement:** 1,500+ lessons with balanced coverage

**Specific Gaps:**
- English Grade 2: Need 90 additional lessons
- English Grade 3: Need 130 additional lessons
- English Grade 4: Need 135 additional lessons
- English Grade 5: Need 135 additional lessons

**Acceptance Criteria:**
- ✅ Minimum 150 lessons per grade (G2-5)
- ✅ Balanced coverage across skill areas (phonics, fluency, comprehension, vocabulary)
- ✅ All lessons aligned with DEPR standards
- ✅ All lessons include:
  - Learning objectives
  - Vocabulary list
  - Activity instructions
  - Assessment questions
  - Teacher notes
- ✅ Quality review by DEPR curriculum specialists

**Timeline:** 120-150 days (4-5 months with dedicated content team)

#### 5.2.2 PowerSchool SSO Integration (CRITICAL)
**Status:** 95% complete, awaiting DEPR credentials
**Production Requirement:** Full SSO operational before launch

**Technical Requirements:**
- ✅ SAML 2.0 configuration (complete)
- ✅ OAuth 2.0 implementation (complete)
- ✅ User provisioning automation (complete)
- ⚠️ Pending: DEPR PowerSchool credentials
  - Client ID
  - Client Secret
  - District Code
  - API endpoint URLs

**Acceptance Criteria:**
- ✅ Single sign-on from PowerSchool portal
- ✅ Automatic user creation and role assignment
- ✅ Grade level synchronization
- ✅ Student-teacher associations maintained
- ✅ Daily sync of enrollment changes
- ✅ Tested with 100 pilot users before full rollout

**Timeline:** 5-10 business days after receiving credentials

#### 5.2.3 Platform Branding (CRITICAL)
**Status:** Placeholder name in use
**Production Requirement:** Finalized brand identity

**Deliverables:**
- Platform name (currently "RitmoLector" in some docs, TBD in others)
- Logo design (primary, secondary, icon variants)
- Color scheme (WCAG AA compliant)
- Typography guidelines
- Mascot design (recommend Puerto Rican Coquí character)
- Brand guidelines document
- Marketing materials templates

**Acceptance Criteria:**
- ✅ Name approved by DEPR leadership
- ✅ Logo professionally designed
- ✅ All UI updated with final branding
- ✅ Legal clearance (trademark search)
- ✅ Culturally appropriate for Puerto Rico

**Timeline:** 30-45 days (design + approval + implementation)

#### 5.2.4 Production Infrastructure (CRITICAL)
**Status:** Currently on Supabase shared infrastructure
**Production Requirement:** Dedicated production environment

**Requirements:**
- **Environment Separation:**
  - Production (prod.platform.com)
  - Staging (staging.platform.com)
  - Development (dev.platform.com)

- **Database:**
  - Dedicated PostgreSQL instance
  - Production backup strategy (30-day retention minimum)
  - Point-in-time recovery capability
  - Encrypted at rest and in transit

- **CDN & Hosting:**
  - CloudFlare Enterprise (or equivalent)
  - Multiple edge locations
  - DDoS protection
  - SSL certificates

- **Monitoring:**
  - Uptime monitoring (Pingdom, StatusCake, or equivalent)
  - Error tracking (Sentry or equivalent)
  - Performance monitoring (New Relic or equivalent)
  - Custom metrics dashboard

**Acceptance Criteria:**
- ✅ 99.9% uptime SLA
- ✅ Automated daily backups
- ✅ Disaster recovery plan documented
- ✅ Load testing completed (50,000 concurrent users)
- ✅ Security audit completed

**Timeline:** 15-30 days

### 5.3 High Priority Requirements (SHOULD HAVE)

#### 5.3.1 Offline Mode
**Status:** Not implemented
**Production Requirement:** Basic offline capability for areas with limited connectivity

**Technical Approach:**
- Progressive Web App (PWA) with Service Workers
- IndexedDB for local data storage
- Background sync when connection restored
- Downloadable lesson packs

**Acceptance Criteria:**
- ✅ Students can access downloaded lessons offline
- ✅ Reading progress saved locally and synced later
- ✅ Voice recordings queued for upload
- ✅ Clear indicators of online/offline status
- ✅ Maximum 50MB storage per student

**Timeline:** 45-60 days

#### 5.3.2 Enhanced Parent Communication
**Status:** Email notifications only
**Production Requirement:** Multi-channel parent notifications

**Features:**
- WhatsApp Business API integration
- SMS notifications (for parents without smartphones)
- Configurable notification preferences
- Weekly progress summaries
- Alert notifications (low performance, missing sessions)

**Acceptance Criteria:**
- ✅ Parents can choose notification method
- ✅ Messages in Spanish or English
- ✅ Opt-in/opt-out functionality
- ✅ Compliance with TCPA (telephone regulations)
- ✅ Rate limiting to prevent spam

**Timeline:** 30-45 days

#### 5.3.3 Advanced Analytics Dashboard
**Status:** Basic dashboards implemented
**Production Requirement:** Enhanced analytics with predictive capabilities

**Features:**
- Predictive at-risk student identification
- Trend analysis over time
- Comparative analytics (school vs. region vs. island)
- Intervention effectiveness tracking
- Custom report builder

**Acceptance Criteria:**
- ✅ Machine learning model predicts at-risk students (80%+ accuracy)
- ✅ Customizable date ranges and filters
- ✅ Export to multiple formats (PDF, Excel, PowerPoint)
- ✅ Scheduled automated reports
- ✅ Data visualization with drill-down capability

**Timeline:** 60-90 days

### 5.4 Medium Priority Requirements (COULD HAVE)

#### 5.4.1 Native Mobile Apps
**Status:** PWA only
**Production Requirement:** Native iOS and Android apps

**Benefits:**
- Better performance on mobile devices
- Push notifications
- App Store/Play Store presence
- Offline capabilities
- Camera integration for assignments

**Acceptance Criteria:**
- ✅ Feature parity with web app
- ✅ Published to App Store and Google Play
- ✅ Minimum iOS 14+, Android 8.0+
- ✅ 4.0+ star rating maintained
- ✅ Accessibility compliance (VoiceOver, TalkBack)

**Timeline:** 120-180 days

#### 5.4.2 Gamification Enhancement
**Status:** Basic badges and points
**Production Requirement:** Comprehensive gamification system

**Features:**
- Expanded achievement system (100+ badges)
- Leaderboards (class, school, region)
- Avatar customization
- Virtual rewards shop
- Seasonal events and challenges
- Collaborative class goals

**Acceptance Criteria:**
- ✅ Increases student engagement by 25%
- ✅ Age-appropriate for K-5
- ✅ No negative competition (emphasize personal growth)
- ✅ Culturally relevant rewards (Puerto Rican themes)
- ✅ Accessible to students with disabilities

**Timeline:** 45-60 days

#### 5.4.3 Teacher Collaboration Tools
**Status:** Not implemented
**Production Requirement:** Teacher community features

**Features:**
- Lesson plan sharing
- Best practices forum
- Resource library (teacher-contributed)
- Peer observation tools
- Professional development tracking

**Acceptance Criteria:**
- ✅ Moderated community space
- ✅ Content approval workflow
- ✅ Attribution and credit system
- ✅ Integration with DEPR professional development hours
- ✅ Spanish-language interface

**Timeline:** 60-90 days

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  iOS App     │  │ Android App  │          │
│  │  (React 18)  │  │ (React Nat.) │  │(React Nat.)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   CloudFlare    │
                    │   CDN + WAF     │
                    └────────┬────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────┐         │
│  │         Supabase Enterprise Cloud                    │         │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │         │
│  │  │   PostgREST  │  │  Real-time   │  │  Storage │  │         │
│  │  │   (REST API) │  │  (WebSocket) │  │  (S3)    │  │         │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │         │
│  │                                                      │         │
│  │  ┌──────────────┐  ┌──────────────┐                │         │
│  │  │   Auth       │  │ Edge Funcs   │                │         │
│  │  │   (OAuth2)   │  │   (Deno)     │                │         │
│  │  └──────────────┘  └──────────────┘                │         │
│  └──────────────────────────────────────────────────────┘         │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                      DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────┤
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────┐         │
│  │         PostgreSQL 15.x (Primary)                    │         │
│  │              us-east-1                               │         │
│  │    ┌──────────────────────────────────────┐          │         │
│  │    │  - profiles, user_roles             │          │         │
│  │    │  - students, schools, teachers      │          │         │
│  │    │  - lessons, assessments             │          │         │
│  │    │  - reading_progress, wcpm_scores    │          │         │
│  │    │  - RLS policies, functions          │          │         │
│  │    └──────────────────────────────────────┘          │         │
│  └──────────────────────────────────────────────────────┘         │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────┐         │
│  │       PostgreSQL 15.x (Replica)                     │         │
│  │              us-west-2                              │         │
│  │            (Read-only failover)                     │         │
│  └──────────────────────────────────────────────────────┘         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Lovable AI  │  │  Web Speech  │  │  PowerSchool │           │
│  │  (Gemini)    │  │  API         │  │  SSO         │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Resend API  │  │  WhatsApp    │  │  SMS         │           │
│  │  (Email)     │  │  Business    │  │  Gateway     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 6.2 Technology Stack Details

#### Frontend Stack
```json
{
  "framework": "React 18.3.1",
  "language": "TypeScript 5.8.3",
  "buildTool": "Vite 5.4.19",
  "uiFramework": "Radix UI + shadcn/ui",
  "styling": "Tailwind CSS 3.4.17",
  "stateManagement": "@tanstack/react-query 5.83.0",
  "routing": "react-router-dom 6.30.1",
  "forms": "react-hook-form 7.61.1 + zod 3.25.76",
  "i18n": "i18next 25.6.0 + react-i18next 16.0.0",
  "charts": "recharts 2.15.4",
  "icons": "lucide-react 0.462.0",
  "notifications": "sonner 1.7.4",
  "dragAndDrop": "@dnd-kit/core 6.3.1"
}
```

#### Backend Stack
```json
{
  "backend": "Supabase Enterprise Cloud",
  "database": "PostgreSQL 15.x",
  "authentication": "Supabase Auth 2.58.0",
  "api": "PostgREST (auto-generated)",
  "realtime": "Supabase Realtime (WebSocket)",
  "functions": "Deno Edge Functions",
  "storage": "Supabase Storage (S3-compatible)",
  "region": {
    "primary": "us-east-1",
    "secondary": "us-west-2"
  }
}
```

#### AI/ML Stack
```json
{
  "voiceRecognition": {
    "api": "Web Speech API",
    "engine": "OpenAI Whisper Large v3",
    "processing": "Client-side",
    "languages": ["es-PR", "en-US"]
  },
  "aiAnalysis": {
    "provider": "Lovable AI Gateway",
    "model": "Google Gemini 2.5 Flash",
    "functions": [
      "pronunciation-analysis",
      "reading-evaluation",
      "pedagogical-recommendations",
      "phonetic-error-identification"
    ]
  }
}
```

### 6.3 Infrastructure Requirements

#### Production Environment Specifications

**Application Servers:**
- Platform: Supabase Enterprise Cloud
- Auto-scaling: 10-100 instances based on load
- Load Balancer: Supabase managed (Nginx-based)
- SSL/TLS: Let's Encrypt with auto-renewal

**Database:**
- Engine: PostgreSQL 15.x
- Instance Type: Supabase Enterprise (dedicated CPU)
- Storage: 500GB SSD (auto-scaling to 2TB)
- Connections: 500 max concurrent (connection pooling)
- Backup: Automated daily + PITR (30 days)
- Replication: Asynchronous to secondary region

**CDN:**
- Provider: CloudFlare Enterprise
- Edge Locations: Global (Puerto Rico optimized)
- Cache: Static assets (images, CSS, JS)
- DDoS Protection: Always-on
- WAF Rules: OWASP Top 10 protection

**Monitoring:**
- Uptime: Pingdom (5-minute checks)
- Errors: Sentry (real-time error tracking)
- Performance: New Relic or equivalent
- Logs: Supabase logs + CloudWatch
- Alerts: PagerDuty integration for critical issues

**Capacity Planning:**
```
Peak Load Assumptions:
- Total Students: 165,000
- Peak Concurrent Users: 30% = 49,500
- Average Session Duration: 20 minutes
- Sessions per Week per Student: 3
- Total Weekly Sessions: 495,000

Database Load:
- Read Queries: ~5,000/second (peak)
- Write Queries: ~500/second (peak)
- Storage Growth: ~50GB/month

Bandwidth:
- Outbound: ~10TB/month
- Inbound: ~2TB/month (voice recordings)
```

### 6.4 Security Architecture

#### Authentication Flow
```
User Login Request
    ↓
Supabase Auth (JWT validation)
    ↓
Role Check (user_roles table)
    ↓
RLS Policy Evaluation
    ↓
Access Granted/Denied
```

#### Data Security Layers
1. **Network Layer:**
   - TLS 1.3 encryption in transit
   - CloudFlare WAF
   - DDoS protection
   - Rate limiting

2. **Application Layer:**
   - Row Level Security (RLS)
   - JWT token validation
   - Role-based access control (RBAC)
   - Input validation (Zod schemas)

3. **Database Layer:**
   - AES-256 encryption at rest
   - Encrypted backups
   - Connection encryption
   - Audit logging

4. **Privacy Layer:**
   - No PII in logs
   - Data minimization
   - Pseudonymization where possible
   - Right to deletion support

---

## 7. DATA MODELS AND DATABASE SCHEMA

### 7.1 Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
└────────┬────────┘
         │
         │ 1:1
         ↓
┌─────────────────┐      ┌──────────────────┐
│   profiles      │      │   user_roles     │
│─────────────────│      │──────────────────│
│ id (PK, FK)     │      │ id (PK)          │
│ full_name       │      │ user_id (FK)     │
│ avatar_url      │      │ role (enum)      │
│ created_at      │──┐   │ created_at       │
│ updated_at      │  │   └──────────────────┘
└─────────────────┘  │
                     │
         ┌───────────┴───────────┐
         │                       │
         ↓ 1:N                   ↓ 1:N
┌─────────────────┐       ┌──────────────────┐
│   students      │       │   teachers       │
│─────────────────│       │──────────────────│
│ id (PK)         │       │ id (PK)          │
│ user_id (FK)    │       │ user_id (FK)     │
│ grade_level     │       │ school_id (FK)   │
│ school_id (FK)  │       │ subject          │
│ sis_id          │       │ created_at       │
│ created_at      │       └──────────────────┘
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────────┐
│  reading_progress   │
│─────────────────────│
│ id (PK)             │
│ student_id (FK)     │
│ lesson_id (FK)      │
│ wcpm                │
│ accuracy            │
│ pronunciation       │
│ fluency             │
│ session_date        │
│ duration_seconds    │
└─────────────────────┘

┌─────────────────┐      ┌──────────────────┐
│   schools       │      │   ORE_regions    │
│─────────────────│      │──────────────────│
│ id (PK)         │──┐   │ id (PK)          │
│ name            │  │   │ name             │
│ ore_region (FK) │──┘   │ director_id (FK) │
│ director_id     │      │ schools_count    │
│ address         │      └──────────────────┘
│ created_at      │
└─────────────────┘

┌─────────────────┐      ┌──────────────────┐
│   lessons       │      │ lesson_progress  │
│─────────────────│      │──────────────────│
│ id (PK)         │──┐   │ id (PK)          │
│ title           │  │   │ student_id (FK)  │
│ grade_level     │  │   │ lesson_id (FK)   │
│ language        │  └───│ completed        │
│ content_type    │      │ score            │
│ difficulty      │      │ completed_at     │
│ objectives      │      └──────────────────┘
│ vocabulary      │
│ standards       │
│ created_at      │
└─────────────────┘

┌─────────────────┐      ┌──────────────────┐
│  assessments    │      │ assessment_res.  │
│─────────────────│      │──────────────────│
│ id (PK)         │──┐   │ id (PK)          │
│ title           │  │   │ assessment_id    │
│ grade_level     │  └───│ student_id (FK)  │
│ language        │      │ answers          │
│ questions       │      │ score            │
│ type            │      │ passed           │
│ created_by (FK) │      │ completed_at     │
│ created_at      │      └──────────────────┘
└─────────────────┘

┌─────────────────┐
│ family_access   │
│─────────────────│
│ id (PK)         │
│ parent_id (FK)  │
│ student_id (FK) │
│ relationship    │
│ created_at      │
└─────────────────┘
```

### 7.2 Key Tables and Columns

#### Core User Tables

**profiles**
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**user_roles**
```sql
CREATE TYPE public.app_role AS ENUM (
  'student',
  'student_kindergarten',
  'student_1',
  'student_2',
  'student_3',
  'student_4',
  'student_5',
  'teacher',
  'teacher_spanish',
  'teacher_english',
  'family',
  'school_director',
  'ore_director',
  'depr_spanish',
  'depr_english',
  'depr_admin'
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

**students**
```sql
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 5),
  school_id UUID REFERENCES public.schools(id),
  sis_id TEXT, -- PowerSchool Student ID
  date_of_birth DATE,
  primary_language TEXT DEFAULT 'es',
  special_education BOOLEAN DEFAULT FALSE,
  accommodations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Academic Tables

**lessons**
```sql
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 5),
  language TEXT NOT NULL CHECK (language IN ('es', 'en')),
  content_type TEXT NOT NULL CHECK (content_type IN (
    'phonics',
    'vocabulary',
    'fluency',
    'comprehension',
    'word_building',
    'syllable_division',
    'game'
  )),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  objectives TEXT[],
  vocabulary TEXT[],
  standards TEXT[], -- DEPR standards codes
  content JSONB NOT NULL,
  estimated_duration INTEGER, -- minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_grade_language ON public.lessons(grade_level, language);
CREATE INDEX idx_lessons_content_type ON public.lessons(content_type);
```

**reading_progress**
```sql
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  session_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL,
  wcpm INTEGER, -- Words Correct Per Minute
  accuracy DECIMAL(5,2), -- 0-100
  pronunciation DECIMAL(5,2), -- 0-100
  fluency DECIMAL(5,2), -- 0-100
  comprehension DECIMAL(5,2), -- 0-100 (if questions answered)
  errors_detected JSONB, -- Detailed error analysis
  transcript TEXT, -- What the student actually said
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reading_progress_student ON public.reading_progress(student_id, session_date DESC);
CREATE INDEX idx_reading_progress_wcpm ON public.reading_progress(student_id, wcpm);
```

**assessments**
```sql
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL CHECK (grade_level >= 0 AND grade_level <= 5),
  language TEXT NOT NULL CHECK (language IN ('es', 'en')),
  assessment_type TEXT NOT NULL CHECK (assessment_type IN (
    'diagnostic',
    'formative',
    'summative',
    'progress_monitoring'
  )),
  questions JSONB NOT NULL, -- Array of question objects
  standards TEXT[], -- DEPR standards covered
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_grade_language ON public.assessments(grade_level, language);
```

**assessment_results**
```sql
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Student's answers
  score DECIMAL(5,2) NOT NULL, -- 0-100
  passed BOOLEAN NOT NULL,
  time_taken_minutes INTEGER,
  standards_mastery JSONB, -- Mastery level per standard
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessment_results_student ON public.assessment_results(student_id, completed_at DESC);
CREATE INDEX idx_assessment_results_assessment ON public.assessment_results(assessment_id);
```

#### Organizational Tables

**schools**
```sql
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- DEPR school code
  ore_region TEXT NOT NULL CHECK (ore_region IN (
    'San Juan',
    'Bayamón',
    'Arecibo',
    'Mayagüez',
    'Ponce',
    'Caguas',
    'Humacao'
  )),
  director_id UUID REFERENCES auth.users(id),
  address TEXT,
  municipality TEXT,
  phone TEXT,
  email TEXT,
  grades_served INTEGER[], -- [0,1,2,3,4,5]
  total_enrollment INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schools_ore_region ON public.schools(ore_region);
```

**teachers**
```sql
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id),
  subject TEXT NOT NULL CHECK (subject IN ('spanish', 'english', 'both')),
  grades_taught INTEGER[], -- [0,1,2,3,4,5]
  certification_number TEXT,
  hire_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teachers_school ON public.teachers(school_id);
```

**family_access**
```sql
CREATE TABLE public.family_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN (
    'mother',
    'father',
    'guardian',
    'grandmother',
    'grandfather',
    'aunt',
    'uncle',
    'sibling',
    'other'
  )),
  is_primary_contact BOOLEAN DEFAULT FALSE,
  can_view_reports BOOLEAN DEFAULT TRUE,
  can_receive_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_family_access_parent ON public.family_access(parent_id);
CREATE INDEX idx_family_access_student ON public.family_access(student_id);
```

### 7.3 Critical Functions

**generate_comprehensive_report()**
```sql
CREATE OR REPLACE FUNCTION public.generate_comprehensive_report(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_ore_region TEXT DEFAULT NULL,
  p_school_id UUID DEFAULT NULL,
  p_grade_level INTEGER DEFAULT NULL
)
RETURNS TABLE (
  executive_summary JSONB,
  student_details JSONB,
  school_analytics JSONB,
  ore_analytics JSONB,
  grade_analytics JSONB,
  pronunciation_errors JSONB,
  usage_gaps JSONB,
  weekly_usage JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Implementation details
$$;
```

**get_student_error_analysis()**
```sql
CREATE OR REPLACE FUNCTION public.get_student_error_analysis(
  p_student_id UUID,
  p_language TEXT DEFAULT 'es',
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  error_type TEXT,
  frequency INTEGER,
  examples TEXT[],
  recommended_lessons UUID[],
  improvement_trend DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Analyzes phonetic patterns and common errors
$$;
```

**calculate_usage_gaps()**
```sql
CREATE OR REPLACE FUNCTION public.calculate_usage_gaps(
  p_school_id UUID DEFAULT NULL,
  p_ore_region TEXT DEFAULT NULL
)
RETURNS TABLE (
  entity_type TEXT, -- 'school', 'teacher', 'grade'
  entity_id UUID,
  entity_name TEXT,
  total_students INTEGER,
  active_students INTEGER,
  inactive_students INTEGER,
  avg_sessions_per_week DECIMAL,
  last_activity_date TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Identifies students/schools with low engagement
$$;
```

### 7.4 Row Level Security Policies

**Example RLS Policies for `reading_progress`**

```sql
-- Students can view only their own progress
CREATE POLICY "Students view own progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

-- Teachers can view progress of students in their classes
CREATE POLICY "Teachers view class progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students s
      JOIN public.teachers t ON t.school_id = s.school_id
      WHERE s.id = reading_progress.student_id
        AND t.user_id = auth.uid()
    )
  );

-- School directors can view all progress in their school
CREATE POLICY "Directors view school progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students s
      JOIN public.schools sch ON sch.id = s.school_id
      WHERE s.id = reading_progress.student_id
        AND sch.director_id = auth.uid()
    )
  );

-- ORE directors can view all progress in their region
CREATE POLICY "ORE directors view region progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'ore_director')
    AND EXISTS (
      SELECT 1
      FROM public.students s
      JOIN public.schools sch ON sch.id = s.school_id
      JOIN public.user_roles ur ON ur.user_id = auth.uid()
      WHERE s.id = reading_progress.student_id
        -- Match region through metadata or separate table
    )
  );

-- DEPR admins can view all progress
CREATE POLICY "DEPR admins view all progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'depr_admin')
  );
```

---

## 8. API SPECIFICATIONS

### 8.1 API Architecture

The platform uses Supabase's auto-generated PostgREST API, which provides:
- Automatic REST endpoints for all tables
- Real-time WebSocket subscriptions
- Built-in authentication and RLS enforcement
- OpenAPI specification generation

**Base URL:** `https://[project-id].supabase.co/rest/v1/`

### 8.2 Authentication

All API requests require authentication via JWT tokens:

```http
Authorization: Bearer <jwt_token>
```

### 8.3 Core API Endpoints

#### Student Progress Endpoints

**GET /reading_progress**
- Get reading progress records
- Filtered by RLS (user sees only authorized data)
- Query params: `student_id`, `lesson_id`, `session_date.gte`, `session_date.lte`, `order`

Example:
```http
GET /rest/v1/reading_progress?student_id=eq.{uuid}&order=session_date.desc&limit=10
Authorization: Bearer {jwt}
```

**POST /reading_progress**
- Create new reading progress record
- Requires: `student_id`, `duration_seconds`, `wcpm`, etc.

Example:
```http
POST /rest/v1/reading_progress
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "student_id": "uuid",
  "lesson_id": "uuid",
  "wcpm": 85,
  "accuracy": 92.5,
  "pronunciation": 88.0,
  "fluency": 90.0,
  "duration_seconds": 180,
  "transcript": "El coquí canta en la noche...",
  "errors_detected": {
    "substitutions": ["cante -> canta"],
    "omissions": [],
    "additions": []
  }
}
```

#### Assessment Endpoints

**GET /assessments**
- List assessments filtered by grade, language, type

**POST /assessments**
- Create new assessment (teachers/admins only)

**GET /assessment_results**
- Get student assessment results

**POST /assessment_results**
- Submit assessment answers and get score

#### Lesson Endpoints

**GET /lessons**
- List lessons filtered by grade, language, content_type

**GET /lesson_progress**
- Get student lesson completion status

**POST /lesson_progress**
- Mark lesson as complete

#### Analytics Endpoints (RPC Functions)

**POST /rpc/generate_comprehensive_report**
```http
POST /rest/v1/rpc/generate_comprehensive_report
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "p_start_date": "2025-10-01T00:00:00Z",
  "p_end_date": "2025-10-23T23:59:59Z",
  "p_school_id": "uuid-optional",
  "p_grade_level": 2
}
```

**POST /rpc/get_student_error_analysis**
```http
POST /rest/v1/rpc/get_student_error_analysis
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "p_student_id": "uuid",
  "p_language": "es",
  "p_days_back": 30
}
```

**POST /rpc/calculate_usage_gaps**
```http
POST /rest/v1/rpc/calculate_usage_gaps
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "p_ore_region": "Bayamón"
}
```

### 8.4 Real-Time Subscriptions

Supabase provides real-time updates via WebSocket:

```javascript
// Subscribe to reading progress changes
const subscription = supabase
  .channel('reading_progress_changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'reading_progress',
      filter: `student_id=eq.${studentId}`
    },
    (payload) => {
      console.log('New reading progress:', payload.new);
      // Update UI
    }
  )
  .subscribe();
```

### 8.5 Edge Functions (AI Integration)

**Function: ai-reading-analysis**

Endpoint: `https://[project-id].supabase.co/functions/v1/ai-reading-analysis`

```http
POST /functions/v1/ai-reading-analysis
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "transcript": "El coquí canta en la noche",
  "expected_text": "El coquí canta en la noche",
  "language": "es",
  "grade_level": 2
}
```

Response:
```json
{
  "wcpm": 85,
  "accuracy": 100,
  "pronunciation": 95,
  "fluency": 92,
  "errors": [],
  "feedback": "¡Excelente lectura! Tu pronunciación fue muy clara.",
  "recommendations": [
    "Practica palabras con 'rr' para mejorar aún más"
  ]
}
```

### 8.6 Rate Limiting

Production API rate limits:
- Anonymous: 10 requests/minute
- Authenticated Students: 100 requests/minute
- Authenticated Teachers/Admins: 500 requests/minute
- Real-time connections: 100 concurrent per user

### 8.7 Error Responses

Standard error format:
```json
{
  "code": "PGRST116",
  "details": null,
  "hint": null,
  "message": "Insufficient privilege: cannot access this resource"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (RLS policy rejection)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 9. SECURITY AND COMPLIANCE

### 9.1 Regulatory Compliance

#### FERPA (Family Educational Rights and Privacy Act)
**Status:** ✅ Compliant

**Requirements Met:**
- Row Level Security (RLS) ensures data isolation
- Parents can access their children's records
- Teachers can only access their students' data
- Audit logging for all data access
- Annual notification to parents (via platform)
- Consent mechanisms for data sharing

**Production Requirements:**
- [ ] Legal review of Privacy Policy by FERPA specialist
- [ ] Annual FERPA training for all staff
- [ ] Documented procedures for handling data requests
- [ ] Parent consent forms (digital signatures)

#### COPPA (Children's Online Privacy Protection Act)
**Status:** ✅ Compliant

**Requirements Met:**
- No voice recordings stored permanently
- Voice data processed client-side only
- Parental consent obtained via school enrollment
- Clear privacy policy in simple language
- Parents can review/delete child's data
- No behavioral advertising or tracking

**Key Design Decision:**
- Voice recognition uses Web Speech API (client-side)
- Transcripts sent to AI for analysis (not raw audio)
- Transcripts deleted after 90 days
- No third-party data sharing

#### ADA (Americans with Disabilities Act) & Section 508
**Status:** ✅ Compliant

**Requirements Met:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation throughout
- Screen reader support (ARIA labels)
- Color contrast minimum 4.5:1
- Text resizing up to 200%
- Alternative text for all images
- Captions for video content
- Accommodations system (PEI integration)

**Accessibility Features:**
- Text size controls (1x, 1.5x, 2x, 3x)
- High contrast modes (5 options)
- Reduced motion mode
- Adjustable line spacing
- Focus indicators
- Skip navigation links

#### WCAG 2.1 Level AA
**Status:** ✅ Compliant

**Testing Results:**
- Automated testing: Axe, Lighthouse (scores 95+)
- Manual testing: Keyboard-only navigation
- Screen reader testing: JAWS, NVDA, VoiceOver
- Color contrast analysis: All pass 4.5:1 minimum

**Production Requirements:**
- [ ] Third-party accessibility audit (recommended)
- [ ] User testing with students with disabilities
- [ ] Documented accommodation procedures
- [ ] Regular accessibility regression testing

### 9.2 Data Security Measures

#### Encryption

**In Transit:**
- TLS 1.3 for all HTTPS connections
- Certificate: Let's Encrypt with auto-renewal
- HSTS enabled (Strict-Transport-Security header)
- Certificate pinning in mobile apps

**At Rest:**
- AES-256 encryption for database
- Encrypted backups
- Supabase-managed encryption keys
- Option for customer-managed keys (future)

#### Authentication Security

**Multi-Factor Authentication (MFA):**
- Email-based verification
- Optional SMS for teachers/admins
- Time-based OTP (TOTP) support

**Password Requirements:**
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- No common passwords (dictionary check)
- Password strength indicator
- Rate limiting on login attempts (5 attempts / 15 minutes)

**Session Management:**
- JWT tokens with 24-hour expiration
- Automatic refresh (sliding window)
- Logout invalidates token
- Device tracking (optional)

#### Input Validation

**Client-Side:**
- Zod schema validation for all forms
- XSS prevention (React auto-escaping)
- SQL injection prevention (parameterized queries)

**Server-Side:**
- PostgreSQL type checking
- RLS policy enforcement
- Input sanitization in Edge Functions

#### API Security

**Rate Limiting:**
- Per-user rate limits (see API Specifications)
- DDoS protection via CloudFlare
- Exponential backoff on failures

**CORS Policy:**
- Whitelist specific domains only
- No wildcards in production
- Credentials: same-origin only

### 9.3 Privacy Protection

#### Data Minimization
- Collect only necessary PII
- No social security numbers stored
- Date of birth optional (used only for age verification)
- Voice transcripts (not audio files)

#### Pseudonymization
- Internal student IDs (UUID) separate from SIS IDs
- Reports can use anonymous identifiers
- Aggregate data preferred over individual

#### Right to Deletion
- Parents can request full data deletion
- 30-day retention after deletion request
- Backup retention: 90 days max
- Documentation of deletion provided

#### Data Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|-----------------|-----------|
| Active student records | Duration of enrollment | Educational purpose |
| Reading progress | 5 years after graduation | DEPR requirement |
| Assessment results | 5 years after graduation | DEPR requirement |
| Voice transcripts | 90 days | Analysis only |
| Audit logs | 7 years | Compliance |
| Deleted user data | 30 days (backups) | Recovery window |

### 9.4 Incident Response Plan

#### Security Incident Classification

**Level 1 - Critical:**
- Data breach (PII exposed)
- Unauthorized access to admin accounts
- Ransomware/malware infection
- Complete system outage

**Level 2 - High:**
- Attempted unauthorized access (blocked)
- DDoS attack (mitigated)
- Suspicious data exports
- Compliance violation

**Level 3 - Medium:**
- Phishing attempt
- Minor vulnerability discovered
- Failed login attempts (pattern)

**Level 4 - Low:**
- User-reported security concern
- Suspicious activity (investigated, benign)

#### Response Procedures

**Immediate Actions (0-1 hour):**
1. Identify and contain the incident
2. Notify security team and technical lead
3. Begin incident documentation
4. Preserve evidence (logs, screenshots)

**Short-Term Actions (1-24 hours):**
1. Assess scope and impact
2. Notify affected parties (if PII exposed)
3. Implement remediation
4. Notify DEPR and legal counsel
5. Prepare public statement (if necessary)

**Long-Term Actions (1-30 days):**
1. Root cause analysis
2. Implement preventive measures
3. Update security policies
4. Staff training (if needed)
5. Final incident report

#### Notification Requirements

**Data Breach:**
- DEPR: Within 24 hours
- Affected individuals: Within 72 hours
- Media (if >500 affected): Within 72 hours
- HHS/FTC (if HIPAA/FTC Act): As required

### 9.5 Audit and Monitoring

#### Logging

**Audit Logs Capture:**
- All authentication events
- Data access (sensitive tables)
- Data modifications
- Permission changes
- System configuration changes
- API calls (authentication-related)

**Log Retention:**
- Production logs: 7 years (compressed)
- Development logs: 90 days

**Log Security:**
- Write-only access (append-only)
- Encrypted storage
- Integrity verification (checksums)

#### Monitoring Alerts

**Critical Alerts (immediate notification):**
- Failed login attempts (5+ from same IP)
- Unusual data export volume
- Database performance degradation
- Server outage
- Security vulnerability detected

**Warning Alerts (daily digest):**
- Slow API responses
- Increased error rates
- Storage capacity warnings

### 9.6 Third-Party Security

#### Vendor Assessment

All third-party services must provide:
- SOC 2 Type II certification (or equivalent)
- GDPR/FERPA compliance documentation
- SLA with uptime guarantees
- Data Processing Agreement (DPA)
- Incident notification procedures

**Current Vendors:**
- ✅ Supabase: SOC 2 Type II, GDPR, HIPAA-ready
- ✅ Lovable AI: Privacy-compliant, no data retention
- ✅ CloudFlare: SOC 2 Type II, ISO 27001
- ✅ Resend (email): GDPR-compliant
- ⚠️ WhatsApp Business API: Pending (requires Business agreement)

### 9.7 Security Testing Requirements

#### Pre-Production Testing
- [ ] Penetration testing (external firm)
- [ ] Vulnerability scanning (Nessus, OpenVAS)
- [ ] Code security review (SAST tools)
- [ ] Dependency vulnerability scanning (npm audit, Snyk)
- [ ] Authentication/authorization testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Rate limiting validation

#### Ongoing Security
- [ ] Monthly vulnerability scans
- [ ] Quarterly penetration tests
- [ ] Annual third-party security audit
- [ ] Continuous dependency monitoring
- [ ] Bug bounty program (consider for post-launch)

---

## 10. PERFORMANCE REQUIREMENTS

### 10.1 Response Time Requirements

| Metric | Target | Maximum Acceptable | Measurement |
|--------|--------|-------------------|-------------|
| Page Load Time (initial) | <2s | 3s | 3G connection, 90th percentile |
| Page Load Time (subsequent) | <500ms | 1s | Cached assets |
| API Response Time (read) | <200ms | 500ms | 95th percentile |
| API Response Time (write) | <500ms | 1s | 95th percentile |
| Voice Recognition Latency | <1s | 2s | Average |
| AI Analysis Latency | <2s | 3s | 95th percentile |
| Real-time Update Latency | <500ms | 1s | WebSocket delivery |
| Report Generation | <5s | 10s | Standard report |
| Search Response | <300ms | 800ms | Full-text search |

### 10.2 Throughput Requirements

**Concurrent Users:**
- Target: 50,000 concurrent users
- Peak: 75,000 concurrent users (30% buffer)
- Stress Test: 100,000 concurrent users

**Database Transactions:**
- Read queries: 5,000/second (peak)
- Write queries: 500/second (peak)
- Complex queries: 100/second (reports)

**API Requests:**
- Total: 50,000 requests/second (peak)
- Per-user average: 1 request/second during active use

### 10.3 Resource Utilization Targets

**Frontend:**
- Bundle size: <500KB (gzipped)
- Memory usage: <50MB per tab
- CPU usage: <10% average
- Lighthouse Performance Score: 90+

**Backend:**
- Database connections: <80% of pool
- CPU usage: <70% average
- Memory usage: <75% available
- Disk I/O: <60% capacity

### 10.4 Scalability Targets

**Vertical Scaling:**
- Database: Scale to 32 vCPU, 128GB RAM
- Application: Auto-scale from 10 to 100 instances

**Horizontal Scaling:**
- Add database read replicas (up to 5)
- Multi-region deployment (if needed)

**Data Growth:**
- Student records: 165,000 initially, 200,000 capacity
- Reading sessions: 500,000/week (peak)
- Storage growth: 50GB/month
- Total 3-year projection: 2TB

### 10.5 Performance Optimization Strategies

#### Frontend Optimization
- **Code Splitting:** Lazy load routes and components
- **Asset Optimization:**
  - Images: WebP format, lazy loading
  - Fonts: Subset, preload
  - Icons: SVG sprites
- **Caching:**
  - Service Worker for offline assets
  - Browser cache (1 year for immutable assets)
  - CDN caching (CloudFlare)
- **Bundle Optimization:**
  - Tree shaking
  - Minification
  - Compression (gzip/brotli)

#### Backend Optimization
- **Database Indexing:**
  - Composite indexes for common queries
  - Partial indexes for filtered queries
  - GIN indexes for JSONB columns
- **Query Optimization:**
  - Connection pooling (PgBouncer)
  - Prepared statements
  - Query result caching
  - Materialized views for reports
- **Caching Layers:**
  - Redis for session data (future)
  - Application-level caching
  - Database query cache

#### API Optimization
- **GraphQL/PostgREST:**
  - Select only needed columns
  - Limit result sets
  - Pagination for large datasets
- **Real-time:**
  - Filter subscriptions at database level
  - Throttle updates (max 10/second)

### 10.6 Performance Monitoring

#### Metrics Collection
- **Frontend:** Google Analytics, Lighthouse CI
- **Backend:** New Relic, Supabase Dashboard
- **API:** Custom metrics via Edge Functions
- **Database:** PostgreSQL pg_stat_statements

#### Performance Dashboards
- Real-time performance metrics
- Historical trends (7/30/90 days)
- Alerting on degradation
- Comparison by user role, school, region

#### Load Testing
- **Tools:** k6, Apache JMeter
- **Scenarios:**
  - Normal load (25,000 concurrent)
  - Peak load (75,000 concurrent)
  - Stress test (100,000 concurrent)
  - Endurance test (48 hours at normal load)
- **Frequency:** Before each major release

### 10.7 Performance Budgets

**Bundle Sizes:**
- Main bundle: <200KB (gzipped)
- Vendor bundle: <150KB (gzipped)
- Per-route chunks: <50KB each
- Total initial load: <500KB

**Runtime Budgets:**
- Time to Interactive (TTI): <3s
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**API Budgets:**
- Average response time: <300ms
- 95th percentile: <500ms
- 99th percentile: <1s
- Error rate: <0.1%

---

## 11. SCALABILITY REQUIREMENTS

### 11.1 Current vs. Production Scale

| Metric | Current (POC) | Year 1 Target | Year 3 Target |
|--------|--------------|---------------|---------------|
| **Students** | ~100 (demo) | 165,000 | 200,000 |
| **Teachers** | ~10 (demo) | 5,500 | 6,500 |
| **Schools** | 5 (demo) | 1,100 | 1,200 |
| **Daily Active Users** | <50 | 50,000 | 75,000 |
| **Concurrent Users (peak)** | <10 | 50,000 | 75,000 |
| **Lessons** | 703 | 1,500 | 2,500 |
| **Reading Sessions/Week** | ~100 | 495,000 | 600,000 |
| **Database Size** | <1GB | 500GB | 2TB |
| **API Requests/Day** | <10,000 | 50M | 75M |

### 11.2 Scalability Architecture

#### Database Scalability

**Vertical Scaling (Year 1):**
- Current: Supabase shared (4 vCPU, 8GB RAM)
- Production: Supabase Enterprise dedicated (16 vCPU, 64GB RAM)
- Growth plan: Scale to 32 vCPU, 128GB RAM as needed

**Horizontal Scaling (Year 2-3):**
- Add read replicas for reporting queries
- Partition large tables by academic year
- Archive old data to cold storage

**Optimization Strategies:**
- Connection pooling (PgBouncer)
- Query optimization and indexing
- Materialized views for complex reports
- Table partitioning (by grade, year)

#### Application Scalability

**Auto-Scaling Configuration:**
```yaml
min_instances: 10
max_instances: 100
target_cpu: 70%
target_memory: 75%
scale_up_threshold: 80%
scale_down_threshold: 30%
cooldown_period: 5 minutes
```

**Load Balancing:**
- Algorithm: Round-robin with health checks
- Health check interval: 30 seconds
- Unhealthy threshold: 2 consecutive failures
- Sticky sessions: Not required (stateless)

#### Content Delivery

**CDN Strategy:**
- Provider: CloudFlare Enterprise
- Edge locations: Global (Puerto Rico optimized)
- Cache-Control headers:
  - Static assets: 1 year
  - API responses: No cache (or short-lived for public data)
  - HTML: No cache

**Asset Optimization:**
- Images: WebP with fallback, responsive srcset
- Videos: HLS streaming, multiple bitrates
- Audio: MP3 (96kbps for voice clips)
- Fonts: Woff2, subsetting for Latin + Spanish chars

### 11.3 Data Scalability

#### Storage Growth Projections

**Year 1:**
- Student records: 165K × 5KB = 825MB
- Reading progress: 495K sessions/week × 52 weeks × 2KB = 51.5GB
- Assessment results: 165K students × 20 assessments × 5KB = 16.5GB
- Lesson content: 1,500 lessons × 1MB avg = 1.5GB
- Images/audio: 50GB
- **Total Year 1:** ~120GB

**Year 3:**
- Historical data accumulation
- Student records: 1GB
- Reading progress (3 years): 154.5GB
- Assessment results (3 years): 49.5GB
- Lesson content: 2.5GB
- Images/audio: 100GB
- **Total Year 3:** ~308GB

**Safety Margin:** 2TB provisioned (6.5× buffer)

#### Data Archival Strategy

**Hot Data (immediate access):**
- Current academic year
- Rolling 12 months of progress data

**Warm Data (slower access acceptable):**
- Previous academic year
- 1-2 year old progress data

**Cold Data (archival):**
- 3+ years old
- Graduated students (retain 5 years per DEPR)
- Compressed, infrequently accessed

**Archival Process:**
- Automated monthly job
- Compress and move to S3 Glacier
- Maintain index for retrieval
- 5-year retention, then deletion (with parent consent option to retain longer)

### 11.4 Geographic Scalability

#### Current Setup
- **Primary Region:** us-east-1 (Virginia)
  - ~1,400 miles from Puerto Rico
  - Latency: ~40-50ms
- **Secondary Region:** us-west-2 (Oregon)
  - Failover only

#### Future Considerations (Year 2+)
- **Multi-Region Active-Active:**
  - Caribbean region (if available)
  - Closer latency for Puerto Rico
  - Active-active configuration
  - Data synchronization challenges
- **Edge Computing:**
  - CloudFlare Workers for regional logic
  - Caching at edge for static content
  - Reduced latency to <20ms

### 11.5 Capacity Planning

#### Monitoring and Alerts

**Key Capacity Metrics:**
- Database: CPU, memory, connections, storage
- Application: Instance count, CPU, memory
- API: Request rate, error rate, latency
- CDN: Bandwidth, cache hit ratio
- Network: Ingress/egress bandwidth

**Alert Thresholds:**
- CPU: Warning at 70%, critical at 85%
- Memory: Warning at 75%, critical at 90%
- Storage: Warning at 75%, critical at 85%
- Database connections: Warning at 75%, critical at 90%

#### Capacity Review Cadence
- Daily: Automated monitoring dashboards
- Weekly: Review trends and forecasts
- Monthly: Capacity planning meeting
- Quarterly: Long-term growth analysis
- Annually: Architecture review and optimization

#### Scaling Triggers

**Scale Up:**
- CPU >70% for 10 minutes
- Memory >75% for 10 minutes
- Request latency >500ms (p95) for 5 minutes
- Error rate >1% for 5 minutes

**Scale Down:**
- CPU <30% for 30 minutes
- Memory <40% for 30 minutes
- Off-peak hours (11 PM - 6 AM local time)
- Weekend reduction (Saturday, Sunday)

### 11.6 Cost Optimization at Scale

**Cost Control Strategies:**
1. **Right-Sizing:**
   - Regular review of instance sizes
   - Downsize during off-peak periods
   - Reserved instances for baseline capacity

2. **Caching:**
   - Aggressive CDN caching for static assets
   - Application-level caching for common queries
   - Reduce database load

3. **Data Lifecycle:**
   - Archive old data to cheaper storage
   - Delete unnecessary logs/temporary data
   - Compress media files

4. **Resource Scheduling:**
   - Scale down non-production environments overnight
   - Reduce backup frequency for development data

**Projected Costs (Annual):**

| Component | Year 1 | Year 3 |
|-----------|--------|--------|
| Supabase Enterprise | $60,000 | $120,000 |
| CloudFlare Enterprise | $24,000 | $36,000 |
| AI API (Lovable/Gemini) | $30,000 | $60,000 |
| Voice Recognition | $0 (client-side) | $0 |
| Monitoring (New Relic) | $12,000 | $18,000 |
| Email (Resend) | $2,400 | $4,800 |
| SMS/WhatsApp | $6,000 | $12,000 |
| **Total Infrastructure** | **$134,400** | **$250,800** |
| **Per-Student Cost** | **$0.81** | **$1.25** |

---

## 12. INTEGRATION REQUIREMENTS

### 12.1 PowerSchool Integration (CRITICAL)

**Status:** 95% ready, awaiting DEPR credentials
**Priority:** CRITICAL (production blocker)

#### Integration Overview
PowerSchool is the Student Information System (SIS) used by DEPR. Integration enables:
- Single Sign-On (SSO) for students, teachers, parents
- Automatic user provisioning
- Grade level synchronization
- Student-teacher roster management
- Real-time enrollment updates

#### Technical Specifications

**Authentication Protocol:** SAML 2.0 + OAuth 2.0

**Data Synchronization:**
- **Frequency:** Nightly (2 AM AST) + real-time for critical updates
- **Direction:** PowerSchool → Platform (one-way)
- **Method:** REST API + Webhook notifications

**Required DEPR Credentials:**
- [ ] PowerSchool Client ID
- [ ] PowerSchool Client Secret
- [ ] District Code
- [ ] API Base URL (e.g., https://depr.powerschool.com/ws/)
- [ ] SAML SSO Endpoint URL
- [ ] SAML Certificate

#### Data Mapping

**Students:**
```javascript
PowerSchool Field → Platform Field
---------------------------------
[students]DCID → sis_id
[students]student_number → student_number
[students]first_name + last_name → full_name
[students]grade_level → grade_level
[students]schoolid → school_id (mapped via school_codes)
[students]dob → date_of_birth
[students]home_language → primary_language
[students]spenrollments.* → special_education, accommodations
```

**Teachers:**
```javascript
PowerSchool Field → Platform Field
---------------------------------
[teachers]DCID → sis_id
[teachers]first_name + last_name → full_name
[teachers]email_addr → email
[teachers]schoolid → school_id
[teachers]certifications → certification_number
[cc]* (course connections) → class rosters
```

**Schools:**
```javascript
PowerSchool Field → Platform Field
---------------------------------
[schools]school_number → code
[schools]name → name
[schools]principal → director_name
[schools]low_grade, high_grade → grades_served
```

#### API Endpoints Required

**Student Data:**
```http
GET /ws/v1/district/student/{student_id}
GET /ws/v1/district/student?q=schoolid=={school_id}
```

**Teacher Data:**
```http
GET /ws/v1/district/teacher/{teacher_id}
GET /ws/v1/school/{school_id}/teacher
```

**Course Sections and Rosters:**
```http
GET /ws/v1/school/{school_id}/section
GET /ws/v1/section/{section_id}/student
```

**Enrollment Updates (Webhook):**
```http
POST /webhook/enrollment-update
Headers: X-PowerSchool-Signature
Body: { event: "student.enrolled" | "student.withdrawn", student_id, school_id, date }
```

#### Implementation Steps

1. **Setup (5 days after receiving credentials):**
   - Configure SAML SSO in Supabase
   - Set up OAuth 2.0 client credentials
   - Create PowerSchool API service account
   - Verify API access and permissions

2. **Data Import (3 days):**
   - Initial bulk import of schools (1,100 schools)
   - Initial bulk import of teachers (~5,500)
   - Initial bulk import of students (~165,000)
   - Validation of data integrity

3. **Testing (2 days):**
   - SSO login testing (50 test accounts)
   - Data synchronization testing
   - Error handling and retry logic
   - Webhook notification testing

4. **Go-Live (1 day):**
   - Enable SSO for all users
   - Activate nightly sync job
   - Monitor for issues
   - Support team on standby

**Total Timeline:** 10 business days

#### Error Handling

**Sync Failures:**
- Retry logic: 3 attempts with exponential backoff
- Alert administrators after 3 failures
- Log all sync errors for review
- Manual reconciliation tools

**SSO Failures:**
- Fallback to email/password authentication
- Clear error messages to users
- Support ticket auto-creation

### 12.2 AI Services Integration

#### Lovable AI Gateway (AI Analysis)

**Status:** ✅ Operational
**Provider:** Lovable AI (Google Gemini 2.5 Flash)
**Use Cases:**
- Pronunciation analysis
- Reading comprehension evaluation
- Pedagogical recommendations
- Error pattern identification

**API Details:**
- Endpoint: Lovable AI Gateway (via Supabase Edge Functions)
- Authentication: API key (environment variable)
- Rate Limit: 1,000 requests/minute
- Latency: 1-2 seconds (p95)

**Cost Structure:**
- Model: Gemini 2.5 Flash
- Pricing: $0.001 per 1,000 input tokens, $0.003 per 1,000 output tokens
- Estimated: $0.01 per reading session analysis
- Annual projection (495K sessions/week): ~$25,000

**Error Handling:**
- Graceful degradation (basic WCPM if AI unavailable)
- Retry with backoff
- Fallback to rule-based analysis

#### Web Speech API (Voice Recognition)

**Status:** ✅ Operational
**Provider:** Browser-native (OpenAI Whisper via Chrome/Edge)
**Processing:** Client-side (no audio sent to servers)

**Benefits:**
- COPPA compliant (no voice data storage)
- Zero API cost
- Low latency (<1s)
- Privacy-preserving

**Limitations:**
- Browser dependency (Chrome/Edge work best)
- Requires internet connection
- No fine-tuning for Puerto Rican accent (but 95%+ accurate)

**Future Enhancement:**
- Option to use cloud-based Whisper API for improved accuracy
- Requires COPPA consent (store voice recordings)

### 12.3 Communication Integrations

#### Email (Resend API)

**Status:** ✅ Configured, not yet in production use
**Provider:** Resend
**Use Cases:**
- Parent progress reports (weekly)
- At-risk student alerts
- Teacher notifications
- Password resets
- System announcements

**Configuration:**
- Sender domain: noreply@platform.com (configure with branding)
- Reply-to: support@3wgeducation.com
- Templates: Bilingual (Spanish/English)
- Rate limit: 10,000 emails/hour

**Cost:**
- Free tier: 3,000 emails/month
- Pro tier: $20/month for 50,000 emails
- Estimated need: ~100,000 emails/month (Year 1)
- Projected cost: $50/month

#### WhatsApp Business API

**Status:** ⚠️ Planned, not yet implemented
**Priority:** Medium (enhance parent engagement)
**Use Cases:**
- Daily/weekly progress summaries
- Low-performance alerts
- Missing session reminders
- Motivational messages

**Requirements:**
- WhatsApp Business Account
- Facebook Business Manager approval
- Message templates (pre-approved by WhatsApp)
- Opt-in mechanism for parents
- Bilingual message templates

**Implementation Steps:**
1. Apply for WhatsApp Business API access (2-4 weeks approval)
2. Create message templates (Spanish/English)
3. Submit for WhatsApp approval (1-2 weeks)
4. Integrate API (1 week development)
5. Pilot with 100 parents (2 weeks)
6. Full rollout

**Cost:**
- User-initiated messages: Free
- Business-initiated messages: $0.005-0.01 per message (varies by country)
- Estimated: 165K parents × 4 messages/month × $0.007 = $4,620/month

**Compliance:**
- Opt-in required (TCPA compliance)
- Easy opt-out mechanism
- No marketing messages (educational only)

#### SMS Gateway

**Status:** ⚠️ Planned (backup for parents without WhatsApp)
**Priority:** Medium
**Provider:** Twilio or local PR carrier
**Use Cases:**
- Critical alerts (for parents without smartphones/WhatsApp)
- Access code delivery
- Password reset codes

**Cost:**
- Puerto Rico SMS: ~$0.01 per message
- Estimated: 10% of parents (16,500) × 2 messages/month = $330/month

### 12.4 Future Integrations (Post-Launch)

#### ACUDEN (Guardián del Bienestar)
**Priority:** Low (Year 2+)
**Purpose:** Youth welfare and intervention tracking
**Integration Points:**
- Share at-risk student indicators (with consent)
- Receive intervention plans
- Coordinate services

#### DCR (Departamento de Corrección y Rehabilitación)
**Priority:** Low (Year 2+)
**Purpose:** Educational services for juvenile centers
**Integration Points:**
- Adapted curriculum delivery
- Progress monitoring
- Transition support

#### Google Classroom (Optional)
**Priority:** Low (teacher request)
**Purpose:** Supplement existing classroom tools
**Integration Points:**
- Assignment import
- Grade synchronization
- Student roster sync

---

## 13. UI/UX REQUIREMENTS

### 13.1 Design Principles

1. **Culturally Relevant:** Puerto Rican themes, colors, and imagery
2. **Age-Appropriate:** K-5 student-friendly interfaces
3. **Accessible First:** WCAG 2.1 AA compliant for all features
4. **Bilingual Native:** Seamless Spanish/English switching
5. **Mobile-First:** Optimized for tablets and smartphones
6. **Progressive Disclosure:** Show complexity gradually
7. **Positive Reinforcement:** Celebrate small wins

### 13.2 Brand Identity (To Be Finalized)

**Platform Name:** [TBD - Requires decision]
**Proposed Names:**
- RitmoLector (Rhythm Reader)
- Coquí Aprende (Coquí Learns)
- Isla Lectora (Reading Island)
- Estrella de Lectura (Reading Star)

**Color Palette (Proposed):**
- **Primary:** Puerto Rican flag colors
  - Blue: #0050A3 (puerto rican blue)
  - Red: #ED2939 (puerto rican red)
  - White: #FFFFFF
- **Secondary:**
  - Green: #00A859 (El Yunque rainforest)
  - Yellow: #FFC72C (sunshine/coquí)
- **Neutrals:**
  - Dark: #1A1A1A
  - Gray: #6B7280
  - Light Gray: #F3F4F6

**Typography:**
- **Headings:** Inter (or Poppins) - clean, modern, readable
- **Body:** Inter - excellent readability at all sizes
- **Monospace:** JetBrains Mono (for code/technical content)

**Mascot:**
- **Proposed:** Coquí character (Puerto Rican tree frog)
- **Characteristics:** Friendly, encouraging, guides students through lessons
- **Variations:** Different expressions for feedback (happy, thinking, celebrating)

### 13.3 Responsive Design Requirements

**Breakpoints:**
```css
/* Mobile-first approach */
xs: 320px  /* Small phones */
sm: 640px  /* Large phones */
md: 768px  /* Tablets */
lg: 1024px /* Laptops */
xl: 1280px /* Desktops */
2xl: 1536px /* Large screens */
```

**Target Devices:**
- **Primary:** iPads and Android tablets (9-11 inch)
- **Secondary:** Chromebooks and budget laptops
- **Tertiary:** Smartphones (parent/family access)

**Testing Matrix:**
| Device Type | Screen Size | OS/Browser | Priority |
|-------------|------------|------------|----------|
| iPad 9th Gen | 10.2" | iOS 15+ Safari | CRITICAL |
| Samsung Tab A | 10.1" | Android 11+ Chrome | CRITICAL |
| Chromebook | 11.6" | Chrome OS | HIGH |
| iPhone 12+ | 6.1" | iOS 15+ Safari | MEDIUM |
| Budget Android | 5.5" | Android 10+ Chrome | MEDIUM |
| Desktop PC | 1920×1080 | Windows 10+ Chrome/Edge | MEDIUM |

### 13.4 Key User Interfaces

#### 13.4.1 Student Interfaces

**Student Dashboard (Main)**

Elements:
- Welcome message with student name and avatar
- Today's recommended activities (AI-generated)
- Progress overview (visual progress bars)
- Achievement badges (recent unlocks)
- Reading streak counter
- Quick access to favorite lessons
- Coquí mascot with encouraging message

Mobile Optimization:
- Single column layout
- Large touch targets (minimum 44×44px)
- Swipeable cards for activities
- Bottom navigation bar

**Reading Activity Interface**

Elements:
- Large, clear text display
- Voice recording button (visual feedback while recording)
- Real-time pronunciation feedback
- Word highlighting as student reads
- Pause/play controls
- Progress indicator
- Immediate feedback panel (after reading)

Accessibility:
- Adjustable text size (4 levels)
- High-contrast mode toggle
- Read-aloud option for instructions
- Slow-motion playback for modeling

**Assessment Taking Interface**

Elements:
- Question counter (e.g., "3 of 10")
- Timer (if timed assessment)
- Clear question text
- Multiple choice options (large, touch-friendly)
- "I don't know" / "Skip" option
- Submit confirmation dialog
- Results summary (after completion)

**Gamification Elements**

- **Badges:**
  - First Reading (complete first lesson)
  - Week Warrior (7-day streak)
  - Perfect Score (100% on assessment)
  - Speed Reader (high WCPM)
  - El Coquí de Oro (monthly top performer)

- **Points System:**
  - Lessons completed: 10 points
  - High accuracy: +5 bonus
  - Streak days: +2 per day
  - Assessments passed: 20 points

- **Leaderboards:**
  - Class leaderboard (friendly competition)
  - Personal progress graph (emphasize self-improvement)
  - School leaderboard (optional, opt-in)

#### 13.4.2 Teacher Interfaces

**Teacher Dashboard**

Elements:
- Class overview cards (one per class taught)
  - Total students
  - Active this week (%)
  - Average WCPM
  - At-risk count
- Quick actions:
  - Create assessment
  - View reports
  - Message students/parents
  - Assign lessons
- Recent activity feed
- Alerts/notifications (students needing attention)

**Class Management**

Elements:
- Student roster table
  - Name, photo, grade, last active
  - WCPM trend (↑↓→)
  - Risk level indicator (🟢🟡🔴)
  - Quick actions (view profile, send message)
- Filters:
  - Risk level
  - Activity level
  - Performance range
- Bulk actions:
  - Assign lesson to selected students
  - Send message to selected parents

**Reports & Analytics**

Visualizations:
- WCPM distribution (histogram)
- Progress over time (line chart)
- Skill breakdown (radar chart)
- Engagement metrics (bar chart)
- Error patterns (treemap)

Export Options:
- PDF report (formatted, print-ready)
- Excel spreadsheet (raw data)
- PowerPoint summary (for presentations)
- Email report (send to administrator)

**Assessment Creator**

Workflow:
1. Select assessment type (diagnostic, formative, summative)
2. Choose grade level and language
3. Select standards to assess
4. AI generates question bank
5. Teacher reviews and edits questions
6. Set passing score and time limit
7. Assign to students or save as draft

Question Editor:
- Rich text editor for questions
- Image upload for visual questions
- Multiple choice, true/false, short answer
- Difficulty level indicator
- Standard alignment tags

#### 13.4.3 Family Interfaces

**Family Portal Dashboard**

Elements:
- Child selector (if multiple children)
- Overall progress summary
  - Reading level
  - Recent activities
  - Strengths and areas to improve
- Week-at-a-glance activity calendar
- Motivational tips for home practice
- Notifications (new reports, alerts)
- Contact teacher button

Simplicity:
- Non-technical language
- Visual progress indicators (not just numbers)
- Color-coded risk levels (green = good, yellow = needs attention, red = concern)
- Mobile-optimized (many parents use phones)

**Student Progress Report (Family View)**

Sections:
1. **Overview:**
   - Grade level and reading level
   - This week's activity (sessions, time spent)
   - Reading streak
2. **Skills Progress:**
   - Fluency (WCPM) - trend graph
   - Pronunciation - percentage and trend
   - Comprehension - percentage and trend
   - Vocabulary - word count learned
3. **Recent Activities:**
   - List of lessons completed
   - Assessment results
4. **Suggestions for Home:**
   - Recommended activities
   - Books to read together
   - Conversation starters
5. **Teacher Feedback:**
   - Notes from teacher (if any)

Accessibility:
- Spanish-first interface (with English toggle)
- Simple vocabulary (6th-grade reading level)
- Explainer tooltips ("What is WCPM?")

#### 13.4.4 Administrative Interfaces

**Admin Island (School Director Dashboard)**

Elements:
- School overview metrics
  - Total students, teachers
  - Active users this week
  - Platform adoption rate
  - Average WCPM by grade
- Grade-level breakdown table
- Teacher activity overview
- At-risk student alerts
- ORE comparison (how does school compare to region?)

Actions:
- View/download reports
- Manage access codes
- View usage analytics
- Contact support

**ORE Director Dashboard**

Elements:
- Regional map with school indicators
- School comparison table
  - School name, enrollment, active %, avg WCPM, trend
  - Sortable and filterable
- Regional trends over time
- Top-performing and struggling schools
- Usage gaps and adoption tracking

Export:
- Regional report (PDF/PowerPoint)
- Data export (Excel)
- Send to DEPR central office

**DEPR Central Dashboard**

Elements:
- Island-wide metrics
  - Total students, schools, teachers
  - Adoption rate
  - Average WCPM by grade and region
  - Month-over-month growth
- ORE comparison
- Language comparison (Spanish vs. English)
- Standards mastery heatmap
- Intervention recommendations

Executive View:
- Simplified, high-level KPIs
- Visual dashboards (minimal text)
- One-page summary view (exportable)

### 13.5 Accessibility Features (WCAG 2.1 AA)

#### Visual Accessibility

**Text Resizing:**
- 4 levels: Normal (16px), Large (24px), Extra Large (32px), Giant (48px)
- Maintained proportions and layouts at all sizes

**High Contrast Modes:**
1. White on Black
2. Black on White (default)
3. Yellow on Black
4. Black on Yellow
5. Custom (user-defined colors)

**Color Contrast:**
- All text: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio
- Tested with Color Contrast Analyzer

**Focus Indicators:**
- Visible focus outline (2px solid)
- High contrast in all modes
- Keyboard navigation order logical

#### Motor Accessibility

**Touch Targets:**
- Minimum size: 44×44px (WCAG AAA)
- Spacing between targets: 8px minimum
- Large buttons for primary actions

**Keyboard Navigation:**
- All functionality accessible via keyboard
- Skip navigation links
- Logical tab order
- Escape key closes modals
- Arrow keys for navigation (where appropriate)

**Voice Control:**
- Compatible with Dragon NaturallySpeaking
- Voice Access (Android)
- Voice Control (iOS)

#### Cognitive Accessibility

**Reduced Motion:**
- Respect `prefers-reduced-motion` media query
- Disable animations if enabled
- Instant transitions instead

**Simple Language:**
- Instructions at 3rd-grade reading level
- Clear, concise labels
- Consistent terminology
- Icons with text labels

**Error Prevention:**
- Confirmation dialogs for destructive actions
- Auto-save draft work
- Clear error messages with suggestions
- Undo functionality

#### Auditory Accessibility

**Captions:**
- All video content has Spanish/English captions
- Adjustable caption size and color

**Visual Indicators:**
- Visual feedback for voice recording (not just audio cues)
- Screen shake or flash for errors
- Progress bars and visual timers

### 13.6 Localization (Spanish/English)

**Language Switching:**
- Persistent preference (saved to user profile)
- Available in header/navigation (flag icons)
- Instant switching (no page reload)
- Applies to entire interface

**Content Localization:**
- All UI text translated
- All lesson content available in both languages
- Assessments available in both languages
- Reports generated in user's preferred language
- Email notifications in user's preferred language

**Cultural Adaptation:**
- Date format: DD/MM/YYYY (Puerto Rico standard)
- Currency: USD ($) but with PR tax considerations
- Measurements: Metric (standard in PR education)
- Names: Support for Spanish characters (á, é, í, ó, ú, ñ, ¿, ¡)

**Translation Quality:**
- Professional translation services (not machine translation)
- Reviewed by Puerto Rican educators
- Consistent terminology across platform
- Regular translation updates as features are added

### 13.7 Loading States and Error Handling

**Loading Indicators:**
- Skeleton screens (preferred over spinners)
- Progress bars for long operations
- Friendly messages ("Preparing your lesson...", "Analyzing your reading...")
- Estimated time remaining (if >5 seconds)

**Error Messages:**
- Clear explanation of what went wrong
- Actionable next steps
- Contact support option (if unresolved)
- Friendly tone ("Oops! Something went wrong. Let's try again.")

**Empty States:**
- Illustrations (not just text)
- Suggested actions ("Start your first lesson!", "Invite your first student!")
- Help links

**Offline Mode:**
- Clear indicator when offline
- "You're offline" banner
- Grayed-out functionality not available
- Queue actions for when connection restored

---

*[Document continues with sections 14-20...]*

---

## Summary of Production Readiness

### READY FOR PRODUCTION ✅
1. Core technology stack (React, Supabase, PostgreSQL)
2. Bilingual interface (Spanish/English)
3. Voice recognition and AI analysis
4. Basic curriculum (703 lessons)
5. User authentication and roles
6. Family portal
7. Teacher dashboards and reporting
8. Data security and privacy (FERPA, COPPA compliant)

### CRITICAL BLOCKERS 🚨
1. **Complete curriculum** - Need 797 additional lessons (primarily English G2-5)
2. **PowerSchool SSO** - Awaiting DEPR credentials
3. **Platform branding** - Name, logo, mascot finalization
4. **Production infrastructure** - Dedicated environments and monitoring

### HIGH PRIORITY GAPS ⚠️
1. Offline mode for limited connectivity areas
2. Enhanced parent notifications (WhatsApp/SMS)
3. Advanced analytics and predictive at-risk identification
4. Load testing and performance optimization

### RECOMMENDED ENHANCEMENTS 💡
1. Native mobile apps (iOS/Android)
2. Enhanced gamification
3. Teacher collaboration tools
4. Expanded accessibility features

---

**This PRD provides a comprehensive roadmap from current POC state to full production deployment. Priority should be given to completing the critical blockers before launch, followed by high-priority enhancements within the first 6 months post-launch.**
