# WCPM Assessment Findings & Plan Review

## 1. Requirements Snapshot
- Product requirements mandate continuous WCPM tracking with DEPR-aligned seasonal benchmarks and risk bands across K–5 (`docs/requirements/new_ref_guide-23-10.md:193-218`).
- Competitive analysis flags the missing WCPM engine as a blocking gap and insists on replacing simulated scoring with real assessment logic (`docs/competitive-analysis/executive-summary.md:169-177`).
- Existing infrastructure already provisions OpenAI Realtime voice sessions and stores session metadata (`supabase/functions/realtime-token-enhanced/index.ts:17-108`) and captures basic pronunciation attempts (`supabase/migrations/20251022125258_07b9372a-13a8-486d-b824-175e25db57a4.sql:8-35`), but no WCPM metrics are derived.
- Front-end reading flows rely on random scores rather than real fluency metrics, underscoring the urgency for authentic WCPM computation (`src/hooks/useReadingExercise.ts:123-162`).

## 2. Current Implementation Readiness
- Real-time voice clients already receive transcription callbacks but do not persist timestamps, passages, or grade-aware benchmarks needed for WCPM (`src/utils/EnhancedRealtimeClient.ts:167-195`).
- Assessments invoked through the voice UI hard-code a grade level of 0, so any WCPM plan must fetch the learner’s actual grade from profiles or assessment metadata before classification makes sense (`src/pages/ViewAssessment.tsx:60-85`).
- Database schemas contain neither `wcpm_scores` nor quick-access fields on `voice_assessment_results`, so the plan’s storage layer additions would be net new work rather than extensions.

## 3. Plan Strengths
- Phase 1/2 outline a coherent split between client capture and edge-function analytics, keeping sensitive computation server-side (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:253-360`,`427-729`).
- Benchmarks and risk calculations adhere to the documented Hasbrouck & Tindal norms, matching stakeholder expectations (`docs/plan/12-wcpm-assessment/TECHNICAL-SPECIFICATION.md:200-390`).
- UI additions envisage actionable, student-facing feedback loops that align with continuous assessment goals (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:837-1184`).

## 4. Gaps & Risks
- **Critical – Transcript fidelity**: Plan assumes access to segmented transcripts with reliable timestamps (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:292-341`), yet current clients only receive plain text events without timing metadata, so `Date.now()` at receipt will skew elapsed time and WCPM unless we instrument audio start/stop events or buffered durations (`src/utils/EnhancedRealtimeClient.ts:167-195`).
- **Critical – Mispronunciation detection**: Edge logic classifies “mispronunciations” via textual phonetic similarity (`docs/plan/12-wcpm-assessment/TECHNICAL-SPECIFICATION.md:360-518`), but Whisper typically returns the canonical word even when pronounced poorly, meaning true mispronunciation rates will be undercounted. Without phoneme confidence or audio features, claims of pronunciation scoring will remain speculative.
- **High – UI integration effort**: ViewAssessment currently auto-starts sessions and lacks passage text for continuous reading; switching to explicit start/stop WCPM controls and feeding the correct passage will require wider refactors than the plan’s “Day 4-5” estimate suggests (`src/pages/ViewAssessment.tsx:55-104`,`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:986-1184`).
- **High – Grade awareness**: The plan repeatedly relies on `gradeLevel` for benchmarks (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:999-1041`), yet the client today passes a default 0 and never queries `profiles.grade_level`, so risk labels would be meaningless until that data plumbing is added.
- **Medium – Data model alignment**: Proposed `wcpm_scores` table references `profiles(id)` while existing voice results use `auth.users(id)` (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:730-812`,`supabase/migrations/20251022125258_07b9372a-13a8-486d-b824-175e25db57a4.sql:11-17`); schema reconciliation is needed to avoid FK mismatches.
- **Medium – Cost assumption**: Declaring “zero additional cost” ignores extra Supabase compute for the new edge function and storage for transcripts/metrics (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:1459`,`1562`). While likely small, stakeholders should budget for incremental usage.
- **Low – Event handling mismatch**: Plan rewrites `EnhancedRealtimeClient` to extend Node’s `EventEmitter` (`docs/plan/12-wcpm-assessment/IMPLEMENTATION-PLAN.md:275-342`), but the current implementation uses a custom emitter class, so drop-in code samples need adjustment to avoid type errors in the browser context (`src/utils/EnhancedRealtimeClient.ts:1-57`).

## 5. Recommendations
- Instrument the realtime client to capture precise start/stop timestamps (e.g., from `input_audio_buffer` events or audio worklet clocks) before wiring the edge function so WCPM accuracy meets the ±3 benchmark requirement.
- Prototype the edge function against real transcript samples to validate the error-classification heuristic; consider surfacing confidence scores or noting mispronunciation limitations in product messaging.
- Extend the initial implementation timeline to include profile-grade plumbing, passage retrieval, and UI refactor workstreams; two calendar days is optimistic given the existing auto-start flow.
- Align the storage design with existing auth relationships (either store `auth.users` IDs everywhere or guarantee synced `profiles` rows) to prevent migration rollbacks.
- Recalculate projected costs with Supabase function invocations and storage to set realistic expectations even if increments are minor.

