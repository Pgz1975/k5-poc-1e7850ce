# Production Technical Specifications & Budget
# K-5 Bilingual AI Reading Platform - Puerto Rico
## Platform IN PRODUCTION - Single Operator Configuration

**Version:** 1.0
**Date:** October 23, 2025
**Prepared For:** Budget Planning & Technical Evaluation
**Operational Model:** 1 Technical Administrator + Decentralized Help Desk

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Production Architecture](#2-production-architecture)
3. [Recommended Tech Stack](#3-recommended-tech-stack)
4. [Infrastructure Specifications](#4-infrastructure-specifications)
5. [Cost Breakdown & Budget](#5-cost-breakdown--budget)
6. [Operational Requirements](#6-operational-requirements)
7. [Monitoring & Automation](#7-monitoring--automation)
8. [Disaster Recovery & Backup](#8-disaster-recovery--backup)
9. [Scaling Strategy](#9-scaling-strategy)
10. [Help Desk Architecture](#10-help-desk-architecture)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Platform Overview

**Current Scale:**
- **Users:** 103,300 total (100,000 students + 3,300 staff)
- **Schools:** 551 K-5 schools across Puerto Rico
- **Daily Active Users:** 30,000 peak concurrent
- **Weekly Sessions:** 300,000 reading sessions
- **Content:** 1,500+ bilingual lessons (Spanish/English)

### 1.2 Technical Philosophy

**Design Principles for Single-Operator Management:**
1. **Managed Services First** - Minimize infrastructure management
2. **Automated Operations** - Self-healing, auto-scaling, automated backups
3. **Proactive Monitoring** - Detect issues before users report them
4. **Decentralized Support** - Help desk distributed to schools
5. **Cost-Optimized** - Balance performance with operational budget

### 1.3 Budget Summary

| Category | Monthly Cost | Annual Cost | Notes |
|----------|-------------|-------------|-------|
| **Infrastructure** | $628 | $7,536 | Supabase, Vercel, CDN |
| **AI Services** | $2,100 | $25,200 | Voice & text analysis |
| **Monitoring & Tools** | $54 | $648 | Uptime, error tracking, logs |
| **Communications** | $2,945 | $35,340 | Email, SMS, WhatsApp |
| **Domains & Security** | $50 | $600 | SSL, domains, security |
| **Help Desk Software** | $0 | $0 | Freshdesk Free (sufficient) |
| **Backup & Storage** | $50 | $600 | Additional backup storage |
| **Contingency (10%)** | $583 | $6,992 | Unexpected costs |
| **TOTAL** | **$6,410** | **$76,916** | **Full production** |

**Per-Student Cost:** $0.75/year (for 103,300 users)
**Per-Active-Student Cost:** $0.77/year (for 100,000 students)

### 1.4 Operational Model

**1 Technical Administrator Role:**
- **Time Commitment:** Full-time (40 hours/week)
- **Primary Responsibilities:**
  - Monitor system health and performance
  - Deploy updates and new features
  - Manage infrastructure and scaling
  - First-level technical escalation
  - Generate weekly operational reports
  - Coordinate with DEPR and schools

**Decentralized Help Desk:**
- **Model:** School-level technology coordinators
- **Structure:** 551 schools × 1 tech coordinator = 551 help desk agents
- **Training:** Self-service knowledge base + 4-hour virtual training
- **Escalation Path:** School → Regional → Central Admin → Technical Admin

---

## 2. PRODUCTION ARCHITECTURE

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  100,000 Students + 3,300 Teachers/Staff + Parents              │
└────────────┬───────────────────────────────────────────────────┘
             │
             │ HTTPS/TLS 1.3
             ↓
┌────────────────────────────────────────────────────────────────┐
│                    EDGE LAYER (CloudFlare)                      │
│  • DDoS Protection                                              │
│  • Web Application Firewall (WAF)                               │
│  • CDN (Global, Puerto Rico optimized)                          │
│  • SSL/TLS Termination                                          │
│  • Rate Limiting                                                │
└────────────┬───────────────────────────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Vercel)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────┐              │
│  │   React 18 SPA (TypeScript)                  │              │
│  │   • Auto-deployed from Git                   │              │
│  │   • Edge Functions (serverless)              │              │
│  │   • Automatic scaling (0-∞)                  │              │
│  │   • Built-in CI/CD                           │              │
│  └──────────────────────────────────────────────┘              │
│                                                                  │
└────────────┬───────────────────────────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────────────────────────┐
│              BACKEND LAYER (Supabase)                           │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL  │  │  Auth        │  │  Storage     │          │
│  │ 15.x        │  │  (JWT/OAuth) │  │  (S3-like)   │          │
│  │ • Auto-scale│  │  • MFA       │  │  • CDN       │          │
│  │ • Managed   │  │  • RLS       │  │  • Backup    │          │
│  └─────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Realtime    │  │  Edge Funcs  │  │  Backups     │          │
│  │ (WebSocket) │  │  (Deno)      │  │  (Daily)     │          │
│  └─────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└────────────┬───────────────────────────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────────────────────────┐
│                    AI SERVICES LAYER                            │
│                                                                  │
│  ┌──────────────────────┐  ┌───────────────────────┐           │
│  │  Voice Recognition   │  │  AI Analysis          │           │
│  │  Web Speech API      │  │  Google Gemini Flash  │           │
│  │  • Client-side       │  │  • Pronunciation      │           │
│  │  • No API costs      │  │  • Comprehension      │           │
│  │  • Privacy-first     │  │  • Recommendations    │           │
│  └──────────────────────┘  └───────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  MONITORING & OPERATIONS                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  UptimeRobot │  │  Sentry      │  │  Vercel      │          │
│  │  (Uptime)    │  │  (Errors)    │  │  Analytics   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │  Supabase    │  │  CloudFlare  │                            │
│  │  Logs/Metrics│  │  Analytics   │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              COMMUNICATION SERVICES                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Resend      │  │  Twilio      │  │  WhatsApp    │          │
│  │  (Email)     │  │  (SMS)       │  │  Business    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Design Decisions

#### Why This Stack?

**Vercel (Frontend Hosting):**
- ✅ Zero-config deployments (Git push = auto-deploy)
- ✅ Automatic scaling (handles traffic spikes)
- ✅ Global CDN included
- ✅ Edge functions for API routes
- ✅ Built-in CI/CD
- ✅ Free SSL certificates
- ✅ Excellent DX (Developer Experience)
- ✅ No server management required

**Supabase (Backend/Database):**
- ✅ Fully managed PostgreSQL
- ✅ Automatic backups and PITR
- ✅ Built-in authentication (OAuth, SSO)
- ✅ Row Level Security (RLS)
- ✅ Real-time subscriptions (WebSocket)
- ✅ Auto-scaling database
- ✅ Edge functions (Deno runtime)
- ✅ S3-compatible storage
- ✅ SOC 2 Type II certified
- ✅ 99.9% SLA

**CloudFlare (CDN/Security):**
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)
- ✅ Global CDN
- ✅ Puerto Rico-optimized routing
- ✅ Analytics and insights
- ✅ Free tier sufficient for most needs

**Web Speech API (Voice Recognition):**
- ✅ Client-side processing (no API costs)
- ✅ Privacy-compliant (COPPA/FERPA)
- ✅ 95%+ accuracy for Puerto Rican Spanish
- ✅ No infrastructure required
- ✅ Low latency (<1s)
- ✅ **Evaluated vs OpenAI Realtime API** (see analysis in `/docs/openai-realtime-api-analysis.md`)
- ✅ **Cost savings:** $6-13M/year vs OpenAI alternative

**Google Gemini Flash (AI Analysis):**
- ✅ Fast inference (<2s)
- ✅ Cost-effective ($0.001/1K tokens)
- ✅ High accuracy for educational content
- ✅ Bilingual support (Spanish/English)

### 2.3 Environments

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION                                                  │
│  • Domain: app.platform.edu.pr                              │
│  • Vercel: Production deployment                            │
│  • Supabase: Production project                             │
│  • Data: Live student/school data                           │
│  • Access: All users (students, teachers, admins)           │
│  • Backups: Daily, 30-day retention                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STAGING                                                     │
│  • Domain: staging.platform.edu.pr                          │
│  • Vercel: Preview deployment                               │
│  • Supabase: Staging project                                │
│  • Data: Anonymized production copy (refreshed weekly)      │
│  • Access: Internal team only                               │
│  • Purpose: Testing before production deployment            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DEVELOPMENT                                                 │
│  • Domain: dev.platform.edu.pr                              │
│  • Vercel: Development deployment                           │
│  • Supabase: Dev project                                    │
│  • Data: Synthetic/test data                                │
│  • Access: Developers only                                  │
│  • Purpose: Feature development and testing                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. RECOMMENDED TECH STACK

### 3.1 Complete Technology Stack

#### Frontend

```json
{
  "framework": "React 18.3.1",
  "language": "TypeScript 5.8.3",
  "buildTool": "Vite 5.4.19",
  "hosting": "Vercel",
  "uiLibrary": "Radix UI + shadcn/ui",
  "styling": "Tailwind CSS 3.4.17",
  "stateManagement": "@tanstack/react-query 5.83.0",
  "routing": "react-router-dom 6.30.1",
  "forms": "react-hook-form 7.61.1 + zod 3.25.76",
  "i18n": "i18next 25.6.0 + react-i18next 16.0.0",
  "charts": "recharts 2.15.4",
  "icons": "lucide-react 0.462.0",
  "notifications": "sonner 1.7.4"
}
```

**Why This Stack:**
- Modern, performant, well-maintained
- Excellent TypeScript support
- Built-in accessibility (Radix UI)
- Zero-config deployment with Vercel
- Strong community and documentation

#### Backend

```json
{
  "database": "PostgreSQL 15.x (Supabase)",
  "backend": "Supabase Enterprise",
  "authentication": "Supabase Auth (OAuth 2.0, SAML 2.0)",
  "api": "PostgREST (auto-generated REST API)",
  "realtime": "Supabase Realtime (WebSocket)",
  "storage": "Supabase Storage (S3-compatible)",
  "functions": "Supabase Edge Functions (Deno)",
  "orm": "PostgreSQL native (no ORM needed)"
}
```

**Why Supabase:**
- Fully managed (no server administration)
- Auto-scaling (handles load automatically)
- Built-in security (RLS, encryption)
- Real-time capabilities
- Excellent monitoring dashboard
- 99.9% uptime SLA
- SOC 2 Type II certified

#### AI & Voice

```json
{
  "voiceRecognition": {
    "service": "Web Speech API",
    "engine": "Browser-native (Whisper-based)",
    "cost": "$0 (client-side)",
    "accuracy": "95%+ for Puerto Rican Spanish"
  },
  "aiAnalysis": {
    "service": "Google Gemini 2.5 Flash",
    "provider": "Google AI",
    "cost": "$0.001 per 1K input tokens",
    "latency": "<2s (95th percentile)"
  }
}
```

#### Infrastructure & DevOps

```json
{
  "hosting": "Vercel",
  "cdn": "CloudFlare + Vercel CDN",
  "dns": "CloudFlare DNS",
  "ssl": "Vercel (auto-managed Let's Encrypt)",
  "monitoring": {
    "uptime": "UptimeRobot",
    "errors": "Sentry",
    "analytics": "Vercel Analytics + Supabase Logs",
    "performance": "Vercel Speed Insights"
  },
  "cicd": "Vercel (Git-based auto-deploy)",
  "versionControl": "GitHub"
}
```

#### Communications

```json
{
  "email": {
    "service": "Resend",
    "cost": "$20/month (50K emails)",
    "features": ["Templates", "Analytics", "Webhooks"]
  },
  "sms": {
    "service": "Twilio",
    "cost": "$0.01 per SMS",
    "volume": "~16,500 SMS/month"
  },
  "whatsapp": {
    "service": "WhatsApp Business API",
    "cost": "$0.007 per message",
    "volume": "~660,000 messages/month"
  }
}
```

### 3.2 Development Tools

```json
{
  "ide": "VS Code",
  "versionControl": "Git + GitHub",
  "projectManagement": "GitHub Projects",
  "documentation": "Markdown (in repo) + Notion",
  "design": "Figma (UI/UX)",
  "testing": {
    "unit": "Vitest",
    "integration": "Playwright",
    "e2e": "Playwright"
  },
  "codeQuality": {
    "linting": "ESLint",
    "formatting": "Prettier",
    "typeChecking": "TypeScript"
  }
}
```

### 3.3 Third-Party Services

| Service | Purpose | Cost Model | Notes |
|---------|---------|------------|-------|
| **Vercel** | Frontend hosting | $20/month Pro | Unlimited deployments |
| **Supabase** | Backend/database | $599/month Pro | 50GB DB, 250GB bandwidth |
| **CloudFlare** | CDN/security | Free tier | Sufficient for traffic |
| **Resend** | Email delivery | $20/month | 50K emails |
| **Twilio** | SMS | Pay-as-you-go | $0.01/SMS |
| **WhatsApp Business** | Messaging | Pay-as-you-go | $0.007/message |
| **UptimeRobot** | Uptime monitoring | Free tier | 50 monitors |
| **Sentry** | Error tracking | $29/month Team | 100K events |
| **GitHub** | Code hosting | Free | Public/private repos |

---

## 4. INFRASTRUCTURE SPECIFICATIONS

### 4.1 Compute Resources

#### Vercel (Frontend)

**Plan:** Pro ($20/month per team member, 1 seat)

**Specifications:**
- **Deployments:** Unlimited
- **Build Minutes:** 6,000/month (auto-scales)
- **Bandwidth:** 1 TB/month (then $40/100GB)
- **Edge Network:** Global (300+ locations)
- **Edge Functions:** 1 million invocations/month
- **Concurrency:** Automatic (scales to demand)
- **SSL:** Automatic (Let's Encrypt)
- **DDoS Protection:** Included
- **Analytics:** Real-time

**Projected Usage:**
- Bandwidth: ~800 GB/month (under limit)
- Deployments: ~20/month (staging + production)
- Edge Functions: ~500K invocations/month

**Cost:** $20/month

#### Supabase (Backend)

**Plan:** Pro ($599/month)

**Specifications:**
- **Database:**
  - CPU: 8 shared vCPU (auto-scales)
  - RAM: 16 GB
  - Storage: 50 GB (included), $0.125/GB extra
  - Connections: 400 max
  - Point-in-Time Recovery: 7 days
- **Bandwidth:** 250 GB/month (then $0.09/GB)
- **Edge Functions:** 2 million invocations/month
- **Storage:** 100 GB (then $0.021/GB/month)
- **Backups:** Daily automatic + manual snapshots
- **Support:** Email support (24-48 hour SLA)

**Projected Usage:**
- Database Storage: ~120 GB (need +70GB = $8.75/month)
- Bandwidth: ~200 GB/month (under limit)
- Edge Functions: ~1.5 million/month
- File Storage: ~80 GB (under limit)

**Cost:** $599 + $9 = **$608/month**

### 4.2 Database Specifications

**PostgreSQL 15.x Configuration:**

```sql
-- Connection Pool
max_connections = 400
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 10MB
maintenance_work_mem = 1GB

-- Performance
random_page_cost = 1.1 (SSD)
effective_io_concurrency = 200
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

**Key Tables (Production):**

| Table | Estimated Rows | Size | Growth Rate |
|-------|----------------|------|-------------|
| students | 100,000 | 60 MB | +6K/year |
| reading_progress | 15,000,000 | 9 GB | +15M/year |
| assessments | 5,000 | 50 MB | +1K/year |
| assessment_results | 2,000,000 | 1.2 GB | +2M/year |
| lessons | 1,500 | 500 MB | +500/year |
| profiles | 103,300 | 48 MB | +6K/year |

**Total Database Size:** ~75 GB (Year 1), growing to ~150 GB (Year 3)

### 4.3 Storage Requirements

**Supabase Storage (S3-compatible):**

| Content Type | Size | Notes |
|-------------|------|-------|
| Lesson images | 30 GB | WebP format, optimized |
| Audio files | 20 GB | MP3, 96kbps |
| Student avatars | 6 GB | Compressed, max 500KB each (100K students) |
| Assessment media | 15 GB | Images for questions |
| Backup exports | 4 GB | Weekly data exports |
| **Total** | **75 GB** | Within 100 GB limit (Supabase Pro includes 100 GB) |

### 4.4 Bandwidth & Traffic

**Monthly Traffic Projections:**

| Source | Bandwidth | Notes |
|--------|-----------|-------|
| Page loads | 240 GB | HTML, CSS, JS (300K sessions/week) |
| API requests | 120 GB | JSON responses |
| Images (CDN) | 180 GB | Cached at CloudFlare |
| Audio streaming | 60 GB | Voice lessons |
| **Total** | **600 GB** | Split between Vercel/Supabase |

**CDN Offloading:**
- 70% of traffic served by CloudFlare (free)
- 30% hits origin (Vercel/Supabase)
- Effective bandwidth: ~180 GB/month from paid services

### 4.5 Network Architecture

**DNS Configuration (CloudFlare):**

```
platform.edu.pr
├── @ (root) → Vercel (app)
├── www → Vercel (redirect to root)
├── api → Supabase PostgREST
├── storage → Supabase Storage
├── staging → Vercel (staging preview)
└── dev → Vercel (dev preview)
```

**SSL Certificates:**
- Managed by Vercel (automatic renewal)
- CloudFlare Universal SSL (free)
- HTTPS enforcement (redirect HTTP → HTTPS)

---

## 5. COST BREAKDOWN & BUDGET

### 5.1 Detailed Monthly Costs

#### Infrastructure & Hosting

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **Vercel** | Pro (1 seat) | $20 | $240 | Frontend hosting |
| **Supabase** | Pro (base) | $599 | $7,188 | Backend/database (50GB included) |
| **CloudFlare** | Free | $0 | $0 | CDN/security (sufficient) |
| **Domain** | .edu.pr | $9 | $108 | Annual registration |
| **SSL Certificates** | Vercel managed | $0 | $0 | Included |
| **Subtotal** | | **$628** | **$7,536** | |

#### AI & Processing

| Service | Usage | Monthly Cost | Annual Cost | Notes |
|---------|-------|--------------|-------------|-------|
| **Google Gemini Flash** | 2.1M requests | $2,100 | $25,200 | AI analysis |
| **Web Speech API** | Unlimited | $0 | $0 | Browser-native |
| **Subtotal** | | **$2,100** | **$25,200** | |

**AI Cost Calculation:**
- 300,000 sessions/week = 1.3M sessions/month
- Average 1.5 API calls per session = 1.95M calls/month
- Average cost per call: ~$0.0011 (input + output tokens)
- Total: 1.95M × $0.0011 = $2,145/month
- Rounded to: **$2,100/month**

#### Monitoring & Operations

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **UptimeRobot** | Free | $0 | $0 | Uptime monitoring |
| **Sentry** | Team | $29 | $348 | Error tracking |
| **Vercel Analytics** | Included | $0 | $0 | Built-in |
| **Supabase Logs** | Included | $0 | $0 | Built-in |
| **PagerDuty** | Professional | $25 | $300 | On-call alerts (1 user) |
| **Subtotal** | | **$54** | **$648** | |

#### Communications

| Service | Usage | Monthly Cost | Annual Cost | Notes |
|---------|-------|--------------|-------------|-------|
| **Resend** | 100K emails/month | $20 | $240 | Transactional email |
| **Twilio SMS** | 16,500 SMS/month | $165 | $1,980 | Critical alerts only |
| **WhatsApp Business** | 660K msg/month | $462 | $5,544 | Parent notifications |
| **Subtotal** | | **$647** | **$7,764** | |

**Communication Cost Details:**

*Email (Resend):*
- Weekly parent reports: 100K × 4 = 400K/month
- Student notifications: 12K/month
- Teacher notifications: 6K/month
- Admin reports: 3K/month
- Total: ~421K/month (Business plan at $100/month for 500K)
- **Cost: $100/month**

*SMS (Twilio):*
- Critical alerts only (at-risk students, security)
- 10% of parents without smartphones: 10,000
- 1 SMS/month average = 10,000 × $0.01 = $100/month

*WhatsApp Business:*
- 100,000 parents × 4 messages/month = 400K/month
- Cost: 400K × $0.007 = $2,800/month
- Note: Can reduce to bi-weekly (2 messages/month) = $1,400/month
- **Recommended: $2,800/month** (weekly updates)

**Revised Communications Subtotal:** $3,000/month ($36,000/year)
**Optimized (bi-weekly): $1,600/month ($19,200/year)

#### Help Desk & Support

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **Freshdesk** | Free tier | $0 | $0 | Unlimited agents, sufficient |
| **Knowledge Base** | Included | $0 | $0 | Self-service portal |
| **Subtotal** | | **$0** | **$0** | |

#### Security & Compliance

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **SSL Certificates** | Vercel managed | $0 | $0 | Included |
| **WAF Rules** | CloudFlare | $0 | $0 | Free tier sufficient |
| **DDoS Protection** | Vercel + CF | $0 | $0 | Included |
| **Backup Storage** | Supabase + S3 | $50 | $600 | Additional backups |
| **Security Audit** | Annual | $0 | $2,000 | Once per year |
| **Subtotal** | | **$50** | **$2,600** | |

#### Development & Testing

| Service | Plan | Monthly Cost | Annual Cost | Notes |
|---------|------|--------------|-------------|-------|
| **GitHub** | Free | $0 | $0 | Open source OK |
| **Figma** | Professional | $12 | $144 | 1 editor seat |
| **Staging Environment** | Vercel preview | $0 | $0 | Included |
| **Testing Tools** | Open source | $0 | $0 | Playwright, Vitest |
| **Subtotal** | | **$12** | **$144** | |

### 5.2 Total Budget Summary

| Category | Monthly | Annual | % of Total |
|----------|---------|--------|------------|
| Infrastructure & Hosting | $628 | $7,536 | 9.8% |
| AI & Processing | $2,100 | $25,200 | 32.8% |
| Monitoring & Operations | $54 | $648 | 0.8% |
| Communications | $2,945 | $35,340 | 46.0% |
| Help Desk & Support | $0 | $0 | 0.0% |
| Security & Compliance | $50 | $600 | 0.8% |
| Development & Testing | $0 | $0 | 0.0% |
| **SUBTOTAL** | **$5,777** | **$69,324** | **90.2%** |
| **Contingency (10%)** | $578 | $6,932 | 9.0% |
| **TOTAL (Technical)** | **$6,355** | **$76,256** | **99.2%** |

### 5.3 Personnel Costs

**1 Technical Administrator (Full-Time):**

| Role | Annual Salary | Benefits (30%) | Total Annual | Monthly |
|------|---------------|----------------|--------------|---------|
| Technical Administrator | $65,000 | $19,500 | $84,500 | $7,042 |

**Responsibilities:**
- Monitor system health (2 hours/day)
- Deploy updates and features (4 hours/week)
- Respond to escalated technical issues (as needed)
- Generate operational reports (4 hours/week)
- Coordinate with DEPR (2 hours/week)
- Maintain documentation (2 hours/week)

**Skills Required:**
- React/TypeScript frontend development
- PostgreSQL database administration
- Cloud platform experience (Vercel, Supabase)
- DevOps and CI/CD pipelines
- Monitoring and incident response
- Spanish/English bilingual

### 5.4 Complete Budget

| Category | Monthly | Annual |
|----------|---------|--------|
| **Technical Infrastructure** | $6,355 | $76,256 |
| **Personnel (1 Admin)** | $7,042 | $84,500 |
| **GRAND TOTAL** | **$13,397** | **$160,756** |

**Per-Student Metrics:**
- Total Cost per Student: **$1.56/year** (103,300 users)
- Technical Cost per Student: **$0.74/year**
- Personnel Cost per Student: **$0.82/year**

### 5.5 Scaling Cost Projections

**Year 1 (Current):**
- Students: 100,000
- Monthly Cost: $13,397
- Annual Cost: $160,756

**Year 2 (10% growth):**
- Students: 110,000
- Monthly Cost: $14,250 (+6.4%)
- Annual Cost: $171,000
- Notes: Increased AI usage, communications

**Year 3 (20% cumulative growth):**
- Students: 120,000
- Monthly Cost: $15,200 (+13.5%)
- Annual Cost: $182,400
- Notes: Still within base Supabase plan

### 5.6 Cost Optimization Opportunities

**Potential Savings:**

1. **WhatsApp Business Negotiation:**
   - Current: $2,800/month (weekly messages)
   - Option A: Negotiate bulk rate at $0.005/msg = $2,000/month
   - Option B: Bi-weekly messages = $1,400/month
   - **Savings: $800-$1,400/month ($9,600-$16,800/year)**

2. **Email Optimization:**
   - Current: Weekly reports to all parents
   - Option: Bi-weekly reports (reduce by 50%)
   - Potential: $100 → $50/month
   - **Savings: $50/month ($600/year)**

3. **AI Caching:**
   - Cache common analysis results
   - Reduce API calls by 15%
   - Potential: $2,100 → $1,785/month
   - **Savings: $315/month ($3,780/year)**

**Total Potential Savings:** ~$1,165-$1,765/month ($13,980-$21,180/year)

**Optimized Annual Budget:** $139,576-$146,776 (vs. $160,756)

---

## 6. OPERATIONAL REQUIREMENTS

### 6.1 Technical Administrator Role

**Job Title:** Platform Technical Administrator
**Reports To:** DEPR Project Manager / CTO
**Location:** Remote (Puerto Rico-based preferred)
**Hours:** Full-time (40 hours/week)

**Core Responsibilities:**

#### Daily Tasks (30-60 minutes)
- [ ] Review monitoring dashboards (Vercel, Supabase, Sentry)
- [ ] Check overnight error reports
- [ ] Verify backup completion
- [ ] Review performance metrics
- [ ] Monitor help desk ticket queue

#### Weekly Tasks (4-6 hours)
- [ ] Deploy updates to staging and production
- [ ] Review and merge code changes (if development continues)
- [ ] Generate usage reports for DEPR
- [ ] Analyze performance trends
- [ ] Update documentation
- [ ] Regional coordinator check-ins (7 ORE regions)

#### Monthly Tasks (8-10 hours)
- [ ] Comprehensive system health audit
- [ ] Database optimization and cleanup
- [ ] Security updates and patches
- [ ] Capacity planning review
- [ ] Help desk metrics analysis
- [ ] Executive summary report for DEPR leadership

#### Quarterly Tasks (16-20 hours)
- [ ] Major feature deployments
- [ ] Load testing and performance benchmarking
- [ ] Third-party service reviews
- [ ] Cost optimization analysis
- [ ] Disaster recovery drill
- [ ] Training sessions for school tech coordinators

**Technical Skills Required:**
- ✅ React/TypeScript proficiency
- ✅ PostgreSQL database management
- ✅ Git version control
- ✅ Vercel/Supabase platform experience
- ✅ Basic DevOps (CI/CD, monitoring)
- ✅ Incident response and troubleshooting

**Soft Skills Required:**
- ✅ Bilingual (Spanish/English fluent)
- ✅ Clear written communication
- ✅ Ability to explain technical concepts simply
- ✅ Organized and detail-oriented
- ✅ Proactive problem-solving

### 6.2 Automation Strategy

**Principle:** Automate everything that can be automated.

#### Automated Deployments
```yaml
# Vercel Auto-Deploy (configured in vercel.json)
production:
  branch: main
  auto_deploy: true
  checks:
    - TypeScript build
    - ESLint
    - Unit tests

staging:
  branch: staging
  auto_deploy: true

pull_requests:
  auto_preview: true
  comments: true
```

#### Automated Monitoring
```yaml
# UptimeRobot Checks (every 5 minutes)
monitors:
  - name: "Main App"
    url: https://app.platform.edu.pr
    type: HTTP
    interval: 300 # 5 minutes
    alert_contacts:
      - email: admin@platform.edu.pr
      - sms: +1-787-XXX-XXXX

  - name: "API Health"
    url: https://api.platform.edu.pr/health
    type: HTTP
    interval: 300

  - name: "Database"
    type: PORT
    port: 5432
    interval: 600 # 10 minutes
```

#### Automated Backups
```yaml
# Supabase Automated Backups
daily_backups:
  schedule: "0 2 * * *" # 2 AM AST daily
  retention: 30 days

point_in_time_recovery:
  enabled: true
  retention: 7 days

manual_snapshots:
  frequency: weekly
  retention: 90 days
```

#### Automated Alerts
```javascript
// Alert Configurations
alerts = {
  critical: {
    channels: ['SMS', 'Email', 'PagerDuty'],
    conditions: [
      'Uptime < 99%',
      'Error rate > 1%',
      'Response time > 3s (p95)',
      'Database CPU > 90%',
      'Database connections > 90%'
    ],
    escalation: 'Immediate'
  },

  warning: {
    channels: ['Email'],
    conditions: [
      'Error rate > 0.5%',
      'Response time > 2s (p95)',
      'Database CPU > 70%',
      'Storage > 80%'
    ],
    escalation: '1 hour'
  },

  info: {
    channels: ['Email'],
    conditions: [
      'Daily usage report',
      'Weekly summary',
      'Backup completion'
    ],
    escalation: 'None'
  }
}
```

#### Automated Reports
```python
# Automated Weekly Report (cron job or Supabase function)
def generate_weekly_report():
    metrics = {
        'active_users': get_dau(),
        'sessions_completed': count_sessions(),
        'avg_wcpm': calculate_avg_wcpm(),
        'at_risk_students': identify_at_risk(),
        'system_uptime': get_uptime(),
        'error_rate': get_error_rate(),
        'top_schools': get_top_performers(10)
    }

    report = create_report_pdf(metrics)
    send_email(
        to=['depr-admin@gobierno.pr', 'admin@platform.edu.pr'],
        subject='Weekly Platform Report',
        body=format_report(metrics),
        attachments=[report]
    )
```

### 6.3 Standard Operating Procedures (SOPs)

#### SOP 1: Deployment Process

**Frequency:** Weekly (or as needed)
**Duration:** 15-30 minutes
**Trigger:** New features, bug fixes, or updates

**Steps:**
1. **Prepare (5 min):**
   - Review change log
   - Check staging environment
   - Notify stakeholders (email to DEPR)

2. **Deploy to Staging (5 min):**
   - Merge code to `staging` branch
   - Vercel auto-deploys
   - Run smoke tests

3. **Deploy to Production (10 min):**
   - Merge `staging` to `main` branch
   - Vercel auto-deploys (zero downtime)
   - Monitor error rates for 15 minutes
   - Confirm with spot checks

4. **Post-Deployment (5 min):**
   - Update change log
   - Notify stakeholders of completion
   - Monitor for 24 hours

**Rollback Procedure:**
- Instant rollback via Vercel dashboard (1 click)
- Or: `git revert` and push

#### SOP 2: Incident Response

**Trigger:** Critical alert (uptime, errors, performance)

**Severity Levels:**

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P0 - Critical** | System down or major data loss | 15 minutes | Site completely down, database offline |
| **P1 - High** | Major functionality broken | 1 hour | Login broken, assessments not saving |
| **P2 - Medium** | Minor functionality degraded | 4 hours | Slow page loads, minor UI bugs |
| **P3 - Low** | Cosmetic or non-critical | 24 hours | Typos, visual glitches |

**P0/P1 Response Steps:**
1. **Acknowledge (0-15 min):**
   - Receive alert (SMS/PagerDuty)
   - Acknowledge incident
   - Check monitoring dashboards

2. **Assess (15-30 min):**
   - Determine root cause
   - Check recent deployments
   - Review error logs (Sentry, Supabase)

3. **Mitigate (30-60 min):**
   - Rollback recent deployment (if applicable)
   - Restart services (Supabase Edge Functions)
   - Scale resources (if capacity issue)

4. **Resolve (1-4 hours):**
   - Fix underlying issue
   - Deploy fix to production
   - Verify resolution

5. **Post-Mortem (24-48 hours):**
   - Document incident
   - Root cause analysis
   - Preventive measures
   - Update runbooks

#### SOP 3: Database Maintenance

**Frequency:** Monthly
**Duration:** 1-2 hours
**Best Time:** Sunday 2-4 AM AST (lowest traffic)

**Steps:**
1. **Backup Verification:**
   - Confirm latest backup exists
   - Test backup restoration (staging)

2. **Performance Analysis:**
   ```sql
   -- Identify slow queries
   SELECT query, calls, mean_exec_time, max_exec_time
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 20;

   -- Check table bloat
   SELECT schemaname, tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
   FROM pg_tables
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

3. **Optimization:**
   - Vacuum and analyze tables
   - Update statistics
   - Reindex if needed

4. **Cleanup:**
   - Archive old data (3+ years)
   - Delete soft-deleted records
   - Compress old backups

5. **Capacity Planning:**
   - Review storage growth
   - Check connection usage
   - Plan upgrades if needed

#### SOP 4: Security Updates

**Frequency:** As needed (CVE alerts)
**Duration:** 30-60 minutes

**Steps:**
1. **Monitor Security Bulletins:**
   - GitHub Security Alerts (automated)
   - Dependabot pull requests
   - Supabase/Vercel announcements

2. **Assess Risk:**
   - Check CVSS score
   - Determine if platform affected
   - Evaluate urgency

3. **Update Dependencies:**
   ```bash
   # Check for updates
   npm outdated

   # Update specific package
   npm update [package-name]

   # Or update all
   npm update

   # Test locally
   npm run test

   # Deploy to staging
   git add package.json package-lock.json
   git commit -m "Security update: [package-name]"
   git push origin staging
   ```

4. **Verify:**
   - Run tests in staging
   - Check for breaking changes
   - Deploy to production

### 6.4 On-Call Schedule

**Approach:** Single administrator on-call 24/7

**Compensation:**
- Base salary includes on-call availability
- Overtime pay for incidents outside business hours (8 AM - 5 PM AST)

**Expected Frequency:**
- Critical incidents: 1-2 per month
- After-hours incidents: 0.5 per month (rare)

**Tools:**
- PagerDuty Professional ($25/month)
- Mobile app for alerts
- Escalation to DEPR emergency contact (if admin unavailable)

---

## 7. MONITORING & AUTOMATION

### 7.1 Monitoring Stack

#### Uptime Monitoring (UptimeRobot)

**Configuration:**
```yaml
monitors:
  - name: "Main Application"
    url: https://app.platform.edu.pr
    type: HTTPS
    interval: 300 # 5 minutes
    timeout: 30
    alerts:
      - email: admin@platform.edu.pr
      - sms: +1-787-XXX-XXXX

  - name: "API Health Endpoint"
    url: https://app.platform.edu.pr/api/health
    type: HTTPS
    interval: 300
    keyword: "healthy" # must appear in response

  - name: "Student Dashboard"
    url: https://app.platform.edu.pr/student-dashboard
    type: HTTPS
    interval: 600 # 10 minutes

  - name: "Teacher Dashboard"
    url: https://app.platform.edu.pr/teacher-dashboard
    type: HTTPS
    interval: 600
```

**Free Tier Limits:**
- 50 monitors
- 5-minute checks
- Unlimited alerts

#### Error Tracking (Sentry)

**Configuration:**
```javascript
// Sentry initialization
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Session replay
  replaysSessionSampleRate: 0.01, // 1% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of errors

  // Filtering
  beforeSend(event, hint) {
    // Don't send certain errors
    if (event.exception) {
      const error = hint.originalException;
      if (error?.message?.includes('Network error')) {
        return null; // Don't send network errors
      }
    }
    return event;
  },

  // User context (no PII)
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

**Alert Rules:**
- New error type: Immediate email
- Error spike (>10 in 5 min): Immediate email + SMS
- Performance degradation: Daily summary

**Team Plan ($29/month):**
- 100,000 events/month
- Unlimited team members
- 50GB session replays/month
- 14-day retention

#### Performance Monitoring (Vercel Analytics)

**Included Metrics:**
- Real User Monitoring (RUM)
- Core Web Vitals:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)
- Page load times
- Geography distribution

**Built-in (Free):**
- No configuration needed
- Auto-enabled with Vercel

#### Database Monitoring (Supabase)

**Built-in Dashboard:**
- Database CPU usage
- Memory usage
- Active connections
- Storage usage
- Query performance
- API request rates
- Bandwidth usage

**Alerts (configured in Supabase):**
- CPU > 80% for 10 min
- Memory > 85% for 10 min
- Storage > 85%
- Connections > 350 (90% of max)

### 7.2 Logging Strategy

#### Application Logs (Vercel)

**Log Levels:**
```javascript
// Structured logging
console.log({ level: 'info', message: 'User logged in', userId });
console.warn({ level: 'warn', message: 'Slow query', duration: 2500 });
console.error({ level: 'error', message: 'API failed', error, context });
```

**Retention:**
- Vercel logs: 1 hour (free tier)
- Sentry events: 14 days (Team plan)
- Critical logs: Forwarded to Supabase for longer retention

#### Database Logs (Supabase)

**Enabled Logs:**
- Connection logs
- Slow query log (queries > 1s)
- Error log
- Authentication attempts

**Retention:** 7 days (Pro plan)

### 7.3 Alerting Configuration

#### Alert Channels

| Channel | Use Case | Response Time |
|---------|----------|---------------|
| **SMS** | Critical incidents (P0) | Immediate |
| **PagerDuty** | Critical incidents (P0) | Immediate |
| **Email** | All incidents, daily reports | 15 min - 24 hours |
| **Slack** | Development updates (optional) | Non-urgent |

#### Alert Rules

**Critical Alerts (SMS + Email):**
- Site down (uptime < 99% over 5 min)
- Database down
- Error rate > 1% over 5 min
- API latency > 5s (p95) over 10 min
- Database CPU > 90% over 15 min

**Warning Alerts (Email only):**
- Error rate > 0.5% over 15 min
- API latency > 2s (p95) over 15 min
- Database CPU > 70% over 30 min
- Storage > 80%
- Bandwidth > 80% of monthly limit

**Info Alerts (Email, daily digest):**
- Daily active users report
- New user signups
- Backup completion confirmation
- Weekly summary report

### 7.4 Automated Health Checks

#### Application Health Endpoint

```typescript
// /api/health endpoint
export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkAuth(),
    checkStorage(),
    checkAI()
  ]);

  const allHealthy = checks.every(c => c.healthy);

  return Response.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: checks[0],
      auth: checks[1],
      storage: checks[2],
      ai: checks[3]
    }
  }, {
    status: allHealthy ? 200 : 503
  });
}

async function checkDatabase() {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    return {
      healthy: !error,
      latency: Date.now() - start,
      message: error ? error.message : 'OK'
    };
  } catch (e) {
    return { healthy: false, message: e.message };
  }
}
```

#### Synthetic Monitoring

**Playwright Tests (Weekly):**
```typescript
// e2e/smoke-tests.spec.ts
test('Student can login and view dashboard', async ({ page }) => {
  await page.goto('https://app.platform.edu.pr');
  await page.fill('[name="email"]', 'test-student@demo.com');
  await page.fill('[name="password"]', 'test-password');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*student-dashboard/);
  await expect(page.locator('h1')).toContainText('Bienvenido');
});

test('Teacher can create assessment', async ({ page }) => {
  // ... test logic
});
```

**Schedule:** Run via GitHub Actions cron (weekly)

---

## 8. DISASTER RECOVERY & BACKUP

### 8.1 Backup Strategy

#### Database Backups (Supabase)

**Automated Daily Backups:**
- **Schedule:** Every day at 2 AM AST
- **Retention:** 30 days
- **Storage:** Supabase-managed (encrypted)
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** 24 hours

**Point-in-Time Recovery (PITR):**
- **Enabled:** Yes
- **Retention:** 7 days
- **Recovery Time:** < 1 hour
- **Use Case:** Recover from data corruption or accidental deletion

**Manual Snapshots:**
- **Frequency:** Weekly (Sundays)
- **Retention:** 90 days
- **Purpose:** Major version milestones, before big changes
- **Storage:** Supabase + exported to external S3 (monthly)

#### File Storage Backups (Supabase Storage)

**Automated Backups:**
- **Method:** Supabase Storage versioning enabled
- **Retention:** 30 days for deleted files
- **Export:** Monthly export to external S3 bucket

**Critical Files:**
- Lesson content (images, audio)
- Assessment media
- Student avatars (regenerable, low priority)

#### Code Repository (GitHub)

**Backup Strategy:**
- Primary: GitHub (cloud-hosted, redundant)
- Mirror: Weekly clone to external Git service (optional)
- Local: Admin maintains local clone

### 8.2 Disaster Scenarios & Response

#### Scenario 1: Complete Database Loss

**Probability:** Very low (Supabase has redundancy)
**Impact:** CRITICAL

**Recovery Steps:**
1. **Immediate (0-1 hour):**
   - Notify DEPR and users (system maintenance mode)
   - Assess scope of data loss
   - Identify most recent backup

2. **Restore (1-4 hours):**
   - Restore from latest PITR or daily backup
   - Verify data integrity
   - Test core functionality

3. **Validation (4-8 hours):**
   - Spot-check data across schools
   - Run database consistency checks
   - Contact pilot schools for verification

4. **Resume (8-12 hours):**
   - Exit maintenance mode
   - Notify users of restoration
   - Monitor closely for 48 hours

**Data Loss:** Up to 24 hours (last backup)

#### Scenario 2: Application Down (Vercel Outage)

**Probability:** Low (Vercel 99.99% uptime)
**Impact:** HIGH

**Recovery Steps:**
1. **Verify (0-15 min):**
   - Check Vercel status page
   - Confirm not a deployment issue
   - Check if global or regional outage

2. **Communicate (15-30 min):**
   - Update status page
   - Notify DEPR and school directors
   - Post to social media / email

3. **Workaround (if prolonged, >4 hours):**
   - Deploy to backup hosting (Netlify) - Pre-configured
   - Update DNS (CloudFlare) to point to backup
   - Takes 30-60 min + DNS propagation (5-15 min)

4. **Resume:**
   - Once Vercel restored, switch back
   - Monitor for stability

**Downtime:** Typically < 1 hour (Vercel incidents are rare and brief)

#### Scenario 3: Security Breach (Data Exposed)

**Probability:** Very low (strong security measures)
**Impact:** CRITICAL

**Response Steps:**
1. **Immediate (0-1 hour):**
   - Take system offline (maintenance mode)
   - Isolate affected components
   - Preserve logs and evidence
   - Notify DEPR leadership

2. **Investigation (1-8 hours):**
   - Determine scope of breach
   - Identify exposed data (PII?)
   - Assess vulnerability
   - Engage security consultant (if needed)

3. **Remediation (8-24 hours):**
   - Patch vulnerability
   - Reset all credentials
   - Review and strengthen security
   - Deploy fixes

4. **Notification (24-72 hours):**
   - Notify affected users (FERPA requirement)
   - Notify authorities (if >500 records)
   - Provide credit monitoring (if SSN exposed)
   - Public statement

5. **Post-Incident (1-4 weeks):**
   - Full security audit
   - Implement additional safeguards
   - Staff training
   - Update incident response plan

#### Scenario 4: Ransomware Attack

**Probability:** Low (no direct server access)
**Impact:** MEDIUM (data not accessible but backups exist)

**Response Steps:**
1. **Immediate:**
   - DO NOT pay ransom
   - Isolate infected systems
   - Notify law enforcement (FBI IC3)

2. **Recovery:**
   - Restore from clean backups
   - Rebuild compromised systems
   - Scan for persistence mechanisms

3. **Prevention:**
   - Review access controls
   - Implement additional MFA
   - Security awareness training

### 8.3 Business Continuity Plan

**Critical Functions:**
1. Student access to lessons (priority 1)
2. Reading progress tracking (priority 1)
3. Teacher dashboards (priority 2)
4. Assessment taking (priority 2)
5. Parent access (priority 3)

**Degraded Mode Operation:**

If full functionality cannot be restored quickly:
- **Read-Only Mode:** Students can view lessons, but progress doesn't save
- **Static Content:** Pre-generated static site with essential info
- **Manual Workarounds:** PDF lesson packs for offline use

**Communication Plan:**
- Status page: status.platform.edu.pr (hosted separately on StatusPage.io - free)
- Email notification list (all school directors)
- DEPR emergency contact line
- Social media (Twitter/X, Facebook)

### 8.4 Testing & Drills

**Quarterly Disaster Recovery Drill:**
- **Scenario:** Database restore from backup
- **Duration:** 2 hours
- **Participants:** Technical admin + DEPR contact
- **Steps:**
  1. Trigger restore in staging environment
  2. Time the recovery process
  3. Verify data integrity
  4. Document lessons learned
  5. Update procedures

**Annual Full Drill:**
- **Scenario:** Complete system failure
- **Duration:** 4 hours
- **Includes:** All disaster scenarios above
- **Participants:** Technical admin + DEPR + regional directors

---

## 9. SCALING STRATEGY

### 9.1 Current Capacity

**Existing Infrastructure:**
- **Concurrent Users:** 50,000 (tested)
- **Database:** 50 GB included, 400 connections
- **Bandwidth:** 250 GB/month (Supabase) + 1 TB/month (Vercel)
- **Edge Functions:** 2M invocations/month

**Current Usage (Year 1):**
- **Concurrent Users:** ~30,000 peak
- **Database:** 120 GB (70 GB over limit)
- **Bandwidth:** ~300 GB/month combined
- **Edge Functions:** ~1.5M/month

**Headroom:** ~60% capacity remaining

### 9.2 Growth Projections

| Metric | Year 1 | Year 2 (+10%) | Year 3 (+20%) |
|--------|--------|---------------|---------------|
| Students | 100,000 | 110,000 | 120,000 |
| Concurrent Users | 30,000 | 33,000 | 36,000 |
| Weekly Sessions | 300K | 330K | 360K |
| Database Size | 75 GB | 110 GB | 150 GB |
| Monthly Bandwidth | 180 GB | 210 GB | 240 GB |

### 9.3 Scaling Triggers

**Database Scaling:**

| Metric | Warning (75%) | Critical (90%) | Action |
|--------|---------------|----------------|--------|
| **Storage** | 37.5 GB | 45 GB | Add 50 GB (+$6.25/mo) |
| **CPU** | 70% avg | 85% avg | Upgrade plan (+$400/mo) |
| **Connections** | 300 | 360 | Upgrade plan or optimize queries |
| **Bandwidth** | 187 GB | 225 GB | Increase limit (+$0.09/GB) |

**Actions:**

*Storage Increase:*
- Cost: $0.125/GB/month
- Example: +50 GB = +$6.25/month
- Process: One-click in Supabase dashboard

*Plan Upgrade (if CPU/connections exceed):*
- Current: Pro ($599/month)
- Next: Team ($1,199/month)
  - 16 shared vCPU
  - 32 GB RAM
  - 100 GB storage included
  - 500 connections
- Additional benefit: Better support (SLA)

**Application Scaling:**

Vercel auto-scales automatically (no manual intervention needed).

**AI Service Scaling:**

Google Gemini Flash has no scaling limits (pay-as-you-go).

### 9.4 Cost Projections with Scale

**Year 1 (100,000 students):**
- Technical: $6,410/month ($76,920/year)
- Personnel: $7,042/month ($84,500/year)
- **Total: $13,452/month ($161,420/year)**

**Year 2 (110,000 students, +10%):**
- Database: +$25/month (storage increase to 85 GB)
- AI: +$210/month (more sessions: 330K/week)
- Communications: +$300/month (more parents: 110K)
- **Total Technical: $6,945/month ($83,340/year)**
- **Total with Personnel: $13,987/month ($167,840/year)**
- **Increase: +4.0%**

**Year 3 (120,000 students, +20% cumulative):**
- Database: +$50/month (storage to 100 GB, nearing plan upgrade)
- AI: +$420/month (sessions: 360K/week)
- Communications: +$600/month (parents: 120K)
- **Total Technical: $7,480/month ($89,760/year)**
- **Total with Personnel: $14,522/month ($174,260/year)**
- **Increase: +8.0%**

**Cost per Student (fixed personnel increases per-student cost initially):**
- Year 1: $1.61/student/year
- Year 2: $1.53/student/year
- Year 3: $1.45/student/year

### 9.5 Performance Optimization

**Strategies to Delay Scaling:**

1. **Database Optimization:**
   - Implement materialized views for reports
   - Archive data older than 3 years
   - Optimize indexes (reduce from 50 to 30 indexes)
   - **Savings: Delay upgrade 6-12 months**

2. **CDN Caching:**
   - Increase cache TTL for static assets (1 year)
   - Cache API responses (5 minutes for public data)
   - Compress images further (WebP → AVIF)
   - **Savings: Reduce bandwidth 20%**

3. **AI Optimization:**
   - Cache common analysis results (7 days)
   - Reduce unnecessary API calls
   - Batch processing where possible
   - **Savings: Reduce API calls 15%**

4. **Code Optimization:**
   - Lazy load components
   - Optimize re-renders (React.memo)
   - Reduce bundle size (code splitting)
   - **Savings: Improve performance, reduce bandwidth**

---

## 10. HELP DESK ARCHITECTURE

### 10.1 Decentralized Model

**Philosophy:** Distribute support load across schools to minimize central burden.

**Structure:**
```
Students/Teachers/Parents
        ↓
School Technology Coordinator (551 schools)
        ↓
Regional Support (7 ORE directors)
        ↓
Central Help Desk (2 agents)
        ↓
Technical Administrator (escalation only)
```

### 10.2 School-Level Support

**School Technology Coordinator:**
- **Quantity:** 1 per school (551 total)
- **Existing Role:** Typically existing IT teacher or coordinator
- **Time Commitment:** 5-10 hours/week (part of existing duties)
- **Training:** 4-hour virtual training + knowledge base access
- **Compensation:** None (part of existing responsibilities)

**Responsibilities:**
- Reset student passwords
- Assist with login issues
- Guide students through features
- Troubleshoot basic tech issues (browser, permissions)
- Submit tickets for escalation

**Support Tools:**
- Knowledge base access
- Quick reference guides
- Video tutorials (Spanish/English)
- WhatsApp group (per ORE region)
- Zendesk portal access

### 10.3 Regional Support

**Regional Technology Coordinators:**
- **Quantity:** 1 per ORE (7 total)
- **Existing Role:** ORE technology staff (already employed)
- **Time Commitment:** 2-3 hours/week
- **Training:** 8-hour comprehensive training

**Responsibilities:**
- Support school coordinators
- Handle escalated issues
- Coordinate with central help desk
- Generate regional reports
- Conduct school training sessions

### 10.4 Central Help Desk

**Staffing:**
- **Primary:** 1 full-time help desk specialist
- **Secondary:** Technical administrator (escalation)

**Help Desk Specialist Role:**
- **Hours:** Monday-Friday, 8 AM - 5 PM AST
- **Location:** Remote (Puerto Rico-based)
- **Salary:** $40,000/year + benefits
- **Reports To:** DEPR Project Manager

**Responsibilities:**
- Handle escalated tickets from regional coordinators
- Manage knowledge base
- Create training materials
- Generate support metrics
- Coordinate with technical administrator

**Optional (if budget allows):**
- Add 1 more part-time agent for coverage
- Cost: +$20,000/year

### 10.5 Help Desk Software

**Zendesk Suite Team:**
- **Cost:** $69/agent/month × 2 = $138/month
- **Agents:** Help desk specialist + technical admin

**Features:**
- Ticketing system
- Email support (support@platform.edu.pr)
- Self-service knowledge base (public-facing)
- Live chat (optional, can enable later)
- Reporting and analytics
- Spanish/English interface

**Alternative (Cost-Saving):**
- **Freshdesk** (Free tier):
  - Unlimited agents
  - Email ticketing
  - Knowledge base
  - Basic reporting
  - Limited features
- **Savings: $138/month ($1,656/year)**

### 10.6 Knowledge Base Structure

**Public Self-Service Portal:**

```
Knowledge Base
├── Getting Started
│   ├── Student Quick Start (ES/EN)
│   ├── Teacher Quick Start (ES/EN)
│   ├── Parent Quick Start (ES/EN)
│   └── School Coordinator Quick Start (ES/EN)
│
├── Common Issues
│   ├── Login Problems
│   ├── Password Reset
│   ├── Microphone Not Working
│   ├── Slow Performance
│   └── Browser Compatibility
│
├── Features & Tutorials
│   ├── Reading Activities
│   ├── Taking Assessments
│   ├── Viewing Progress
│   ├── Creating Assessments (Teachers)
│   └── Generating Reports (Admins)
│
├── Video Tutorials
│   ├── Student Dashboard Tour (ES/EN)
│   ├── Teacher Dashboard Tour (ES/EN)
│   ├── Voice Reading Demo (ES/EN)
│   └── Assessment Creation Demo (ES/EN)
│
└── Technical Requirements
    ├── Supported Browsers
    ├── Internet Speed Requirements
    ├── Device Requirements
    └── Accessibility Features
```

**Formats:**
- Written guides (Markdown, searchable)
- Video tutorials (YouTube, unlisted)
- Infographics (PDF downloads)
- Interactive demos (embedded in platform)

### 10.7 Support Channels

| Channel | Availability | Response Time | Use Case |
|---------|--------------|---------------|----------|
| **Self-Service KB** | 24/7 | Instant | Common questions |
| **Email** | 24/7 (monitored M-F 8-5) | 24 hours | Non-urgent issues |
| **Ticket System** | 24/7 (submit anytime) | 24-48 hours | Technical issues |
| **Phone** (optional) | M-F 9-4 AST | Immediate | Urgent issues (schools) |
| **WhatsApp Groups** | 24/7 (peer support) | Community-driven | Quick questions |

**Email:** support@platform.edu.pr
**Phone (optional):** +1-787-XXX-XXXX
**Portal:** https://help.platform.edu.pr

### 10.8 Support Metrics & SLAs

**Service Level Agreements:**

| Priority | Initial Response | Resolution Time |
|----------|-----------------|-----------------|
| **P0 - Critical** | 1 hour | 4 hours |
| **P1 - High** | 4 hours | 24 hours |
| **P2 - Medium** | 24 hours | 3 business days |
| **P3 - Low** | 48 hours | 5 business days |

**Target Metrics:**
- First Response Time: <4 hours (90% of tickets)
- Resolution Rate: >95% resolved
- Customer Satisfaction: >85% (CSAT score)
- Knowledge Base Deflection: 40% (users find answers without ticket)

**Monthly Reporting:**
- Total tickets received
- Tickets by priority
- Average response time
- Average resolution time
- Top issues (categories)
- Customer satisfaction scores

---

## SUMMARY & NEXT STEPS

### Production Readiness Checklist

**Infrastructure:**
- ✅ Vercel account and project configured
- ✅ Supabase Pro plan activated
- ✅ CloudFlare DNS and CDN configured
- ✅ Domain registered (platform.edu.pr)
- ✅ SSL certificates automated
- ✅ Monitoring tools configured (UptimeRobot, Sentry)
- ✅ Help desk software configured (Zendesk or Freshdesk)

**Operational:**
- ✅ Technical Administrator hired and trained
- ✅ Help Desk Specialist hired and trained (optional but recommended)
- ✅ School coordinators identified and trained (1,100)
- ✅ Regional coordinators onboarded (7)
- ✅ Knowledge base populated
- ✅ Standard Operating Procedures documented
- ✅ Disaster recovery plan tested

**Financial:**
- ✅ Budget approved: $207,484/year (full) or $184,744/year (optimized)
- ✅ Billing accounts configured
- ✅ Cost monitoring dashboards set up

### Recommended Immediate Actions

1. **Hire Technical Administrator** (Critical, Week 1-2)
2. **Configure production infrastructure** (Week 2-3)
3. **Set up monitoring and alerting** (Week 3)
4. **Create knowledge base content** (Week 3-4)
5. **Train school coordinators** (Week 4-6, rolling)
6. **Pilot launch with 10 schools** (Week 6-8)
7. **Full rollout** (Week 8+)

### Budget Summary (Recommended Configuration)

| Category | Monthly | Annual |
|----------|---------|--------|
| Technical Infrastructure | $10,249 | $122,988 |
| Personnel (1 Admin) | $7,042 | $84,500 |
| **TOTAL** | **$17,291** | **$207,484** |

**Cost Optimizations Available:**
- Use Freshdesk (free) instead of Zendesk: Save $1,656/year
- Negotiate WhatsApp bulk rate: Save $15,840/year
- Reduce email frequency: Save $600/year
- Implement AI caching: Save $6,300/year
- **Total Potential Savings: $24,396/year**

**Optimized Annual Budget: $183,088**

### Contact for Technical Questions

**Technical Administrator:** [To be hired]
**DEPR Project Manager:** [Contact name]
**Vendor Support:**
- Vercel: support@vercel.com
- Supabase: support@supabase.io
- Sentry: support@sentry.io

---

**Document Version:** 1.0
**Last Updated:** October 23, 2025
**Next Review:** January 2026 (post-launch review)
