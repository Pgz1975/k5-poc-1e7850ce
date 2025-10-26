# K5 POC Demo Readiness Plan (October 2025)

## 1. Objective for the Simplified Demo
- Deliver a stable, bilingual Grade **1** reading journey (where the JSONB schema is uniform) that exposes one curated lesson → exercise flow in Spanish **and** English while showcasing adaptive guidance, progress tracking, and differentiated dashboards for at least four user types (student, teacher, family, regional/admin) to satisfy the high-priority requirements in `docs/requirements/K5 PRD.md:5-66` and the functional demo criteria in `docs/requirements/Compliance_Summary.md:23-80`.
- The demo must rely on live Supabase data, Supabase auth, and a **selectively enabled** voice mentor. Interactions will be constrained to a scripted Grade‑1 scenario to minimize risk while still demonstrating the AI coaching, dashboard, and reporting capabilities DEPR expects.

## 2. Current Blockers (Evidence-Based)
| Area | Impact | Evidence |
| --- | --- | --- |
| **Role coverage & navigation** | Only students, teachers, and families can reach dashboards; regional directors, principals, and central-office roles required by the compliance brief cannot log in or change views. | `docs/requirements/Compliance_Summary.md:23-49`; `docs/roles/ROLE_DESCRIPTION.md:11-188`; `src/pages/Dashboard.tsx:14-42` hard-codes three portals; `src/components/Header.tsx:76-121` only renders nav items for student/teacher/family, while admins are gated by the literal `admin@demo.com` email. |
| **Demo credential handling** | The client creates or updates 15 demo users on every `/auth` visit, which will fail in production (RLS, rate limits) and can unintentionally overwrite seeded data. | `src/pages/Auth.tsx:28-45`; `src/utils/createDemoUsers.ts:3-168`. |
| **Student dashboard metrics are static** | Kids always see 24 activities, 7-day streaks, etc., so the experience does not reflect Supabase progress data or any adaptive behavior. | `src/pages/StudentDashboard.tsx:106-191`. |
| **Teacher & family dashboards show mock data** | Placeholder arrays prevent us from demonstrating the monitoring requirements (class, school, region). | `src/pages/TeacherDashboard.tsx:16-37`; `src/pages/FamilyDashboard.tsx:13-44`. |
| **Reading exercise is simulated, not adaptive** | Pronunciation scores are random numbers after a 3-second timer; there is no AI evaluation, no Supabase persistence, and no bilingual branching. This fails the AI reading/voice expectations. | `docs/requirements/K5 PRD.md:27-38`; `src/hooks/useReadingExercise.ts:31-164`. |
| **Voice mentor ignores authored prompts** | The UI never loads `voice_guidance` or `coqui_dialogue` from Supabase. Instead, `CoquiLessonAssistant` injects a generic template (`src/pages/ViewLesson.tsx:274-295`, `src/pages/LessonExerciseFlow.tsx:303-310`). The relay treats any provided `voice_guidance` as a full override (`supabase/functions/realtime-voice-relay/index.ts:203-233`), so OpenAI never sees the per-activity instructions that writers entered. `coqui_dialogue` is captured in the creation form (`src/pages/CreateAssessment.tsx:240-276`) but never consumed. |
| **Voice mentor contextual data is dropped** | `CoquiLessonAssistant` passes `activityId`/`activityType` into `useCoquiSession`, but `useRealtimeVoice` ignores them when building the WebSocket URL (`src/hooks/useRealtimeVoice.ts:25-117`), so the relay cannot reference the current lesson/exercise. |
| **Voice mentor lacks guardrails** | `CoquiVoiceChat` still pipes every utterance to `useRealtimeVoice` without prompt filtering or context limits, so students can have open conversations unrelated to reading, triggering the safety concern raised by stakeholders. | `src/components/StudentDashboard/CoquiVoiceChat.tsx:19-190`; `src/hooks/useRealtimeVoice.ts:16-132`. |
| **Content/data gaps** | Supabase holds 308 manual assessments but 40% of parent lessons have no exercises, 65% of exercises lack ordering, and 99% of the catalog is Spanish-only. We cannot tell a bilingual Grade K-5 story without curating this data. | `docs/COMPLETE_DATABASE_ANALYSIS_2025-10-26.md:11-195`. |
| **Parent/child linking confusion** | Content generation scripts still write `parent_assessment_id`, but the app reads `parent_lesson_id`, leaving new lessons orphaned. | `docs/PARENT_CHILD_RELATIONSHIP_DISCOVERY.md:8-150`. |
| **Profile experience mixes audiences** | The profile page renders teacher/family stats even for students, which feels adult-centric and distracts from K-5 goals; financial or operational stats must be hidden for learners. | `src/pages/Profile.tsx:164-189`; `docs/requirements/K5 PRD.md:5-14`. |

## 3. Proposed Simplified Demo Scope
1. **Hero scenario**: “Grade 1 Biliteracy Boost” — one Spanish lesson with 3 linked exercises + the same lesson translated to English. Students complete it, the voice mentor (enabled only for this curated path) coaches them safely, and their progress updates dashboards.
2. **Personas to showcase**: student, English or Spanish teacher, family, regional director (aggregated view), and admin (content governance).
3. **Data story**: measured via `manual_assessments`, `completed_activity`, and lightweight aggregates (Supabase SQL views or RPCs) so charts reflect real Supabase rows.
4. **Safety**: AI mentor limited to reading prompts; voice session time-boxed and logged; no open chat.
5. **Collateral**: 2-page user guide + login table + short troubleshooting list to meet `docs/requirements/Compliance_Summary.md:67-80`.

## 4. Action Plan by Workstream

### 4.1 Stabilize Roles & Navigation
1. **Seeded account strategy**: Move the demo-user creation into an admin-only script/edge function; remove `createDemoUsers` from the `/auth` page so logins stop making privileged `signUp` calls from the browser (`src/pages/Auth.tsx:28-45`, `src/utils/createDemoUsers.ts:3-168`).  
2. **Role switcher UI**: Add a simple selector for authenticated internal testers (behind a feature flag) to swap between student/teacher/family/regional accounts without re-authenticating, satisfying the “smooth role changes” concern.  
3. **Navigation matrix**: Extend `Header` and `/dashboard` routing to include principals, regional directors, program admins, and DEPR executives per `docs/roles/ROLE_DESCRIPTION.md:11-188`, even if their dashboards initially share components with admin/teacher views.  
4. **Protected routes**: Replace the email check in `Header` with role-based gating and add Supabase RLS policies for the new roles (align with compliance lines `docs/requirements/Compliance_Summary.md:23-35`).  

### 4.2 Curate Content & Ordering
1. **Manual curation**: Use the `manual_assessments` dataset to identify one high-quality Grade 2 Spanish lesson with ≥3 exercises; duplicate it in English to address the 99% Spanish skew (`docs/COMPLETE_DATABASE_ANALYSIS_2025-10-26.md:172-178`).  
2. **Fix relationships**: Update generation scripts and any admin tools to write `parent_lesson_id` and `order_in_lesson` so new exercises land correctly (`docs/PARENT_CHILD_RELATIONSHIP_DISCOVERY.md:8-150`).  
3. **Lesson ordering table**: Seed `lesson_ordering` for the curated grade so `useStudentProgress` (student cards) and locking logic in `ViewLesson`/`LessonExerciseFlow` actually function.  
4. **Demo fixture**: Create a Supabase SQL view or RPC that returns the curated lesson bundle with bilingual metadata, enabling us to preload the hero scenario without rummaging through 308 records during the demo.  

### 4.3 Kid-Friendly Grade‑1 Experience & Safe Voice
1. **Replace simulated scoring**: Wire `ReadingExercise` to use real exercise data + Supabase writes to `completed_activity` instead of the random scoring block in `src/hooks/useReadingExercise.ts:117-164`.  
2. **Author-driven voice guidance** *(critical blocker)*:  
   - Fetch `voice_guidance` (and later `coqui_dialogue`) from `manual_assessments` for the current Grade‑1 lesson/exercise and pass it through `CoquiLessonAssistant` instead of the component-level template.  
   - Include `activity_id` + `activity_type` when initializing the realtime session so the relay can append context without overriding the author’s script (`supabase/functions/realtime-voice-relay/index.ts:203-233`).  
   - Fallback to the generic prompt only if the Supabase fields are empty.  
3. **Selective enablement**: Expose the voice mentor only on the curated Grade‑1 journey until reliability improves. Gate the mascot elsewhere with a feature flag and show a friendly “Voice helper coming soon” badge.  
4. **Guided script & safety**: Keep the constrained system prompt (reading support only), auto-end sessions after a handful of exchanges, and log each session for compliance.  
5. **Visual polish**: Swap the tiny text-heavy cards on the student dashboard for bigger buttons with iconography and short bilingual instructions, matching the child-friendly requirement in `docs/requirements/K5 PRD.md:5-14`.  
6. **Accessibility**: Ensure the voice permission modal and welcome speaker have fallback captions so the experience remains usable if audio fails.  

### 4.4 Data-Backed Dashboards per Persona
1. **Student progress cards**: Hook the existing `useStudentProgress` queries to the curated lesson data so counts update live instead of staying at `24/30` (`src/components/StudentDashboard/ActivityCards.tsx:24-63`).  
2. **Teacher dashboard**: Replace the static arrays in `src/pages/TeacherDashboard.tsx:16-37` with Supabase aggregations (e.g., total active students, average score, risk list) filtered by the logged-in teacher’s classroom.  
3. **Family portal**: Read the same aggregates but scoped to a child’s ID; surface bilingual recommendations pulled from manual assessments’ metadata rather than the hard-coded “María González” sample (`src/pages/FamilyDashboard.tsx:13-45`).  
4. **Regional/admin view**: Reuse the Admin Dashboard shell to show region-wide KPIs (students active, lessons completed, voice sessions) using SQL views that aggregate by `school_id`/`region`.  
5. **Profile cleanup**: For student logins, hide the multi-role stat grid (`src/pages/Profile.tsx:164-189`) and instead show progress badges / recent lessons; teacher/family/admin can keep their respective tiles.  

### 4.5 Demo Operations & Compliance
1. **Role matrix + instructions**: Produce a one-pager that lists each demo credential, the path to reach its dashboard, and expected talking points (per `docs/requirements/Compliance_Summary.md:67-80`).  
2. **Smoke-test checklist**: Script a daily Supabase reset that (a) clears `completed_activity` for demo students, (b) replays the curated lesson to seed fresh data, and (c) verifies voice connectivity.  
3. **Risk controls**: Log every AI session (start/end, reason codes) so we can prove conversations stay on-script if asked during compliance review.  
4. **Success criteria**: Define “demo-ready” as (a) all dashboards load in <3s with real data, (b) curated lesson flow works end-to-end in both languages, (c) voice mentor enforces the constrained prompt, and (d) documentation is shared with reviewers at least 20 days before evaluation to satisfy the access-period requirement (`docs/requirements/Compliance_Summary.md:19-22`).  

## 5. Suggested Timeline (Fast-Track: ~2 Weeks)
| Week | Focus | Outcomes |
| --- | --- | --- |
| **Week 1** | Roles/nav refactor, disable client-side user seeding, curate bilingual Grade‑1 lesson, fix `parent_lesson_id`, seed ordering | Stable logins, curated Grade‑1 bundle available, hero lesson playable with manual completion. |
| **Week 2** | Wire real progress data into dashboards, pipe authored `voice_guidance` + activity context through the realtime stack, guard/limit the voice mentor to Grade‑1, polish profile/student UI, publish demo instructions | Live data visuals, AI mentor aligned with curriculum prompts, child-friendly UI, documentation ready for reviewers. |

## 6. Definition of Done for the Demo
- ✅ Students can log in, complete the curated Grade‑1 bilingual lesson, see their progress update instantly, and interact with the voice mentor (fed by per-activity `voice_guidance`/`coqui_dialogue`) without going off-topic.  
- ✅ Teachers, families, and regional/admin roles each have at least one dashboard section powered by Supabase aggregates (no hard-coded numbers).  
- ✅ Documentation and credential list delivered, covering setup, navigation, and safety notes.  
- ✅ Supabase tables (`manual_assessments`, `completed_activity`, `lesson_ordering`) remain the single source of truth so future pilots can expand the same flow.  

Following this plan keeps scope tight (one grade, one narrative) while hitting the non-negotiable bilingual, AI, and dashboard requirements, giving us a reliable story to share with DEPR reviewers.
