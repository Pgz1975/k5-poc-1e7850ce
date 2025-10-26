# Phase Plan – Grade‑1 Demo Simplification & Voice Reliability

This plan breaks the work into four phases so Lovable (or any dev) can implement it incrementally while keeping the demo functional. Each phase lists goals, detailed tasks, owners, and success criteria. References point to the exact files/lines already identified (_see `docs/demo-readiness-plan.md` for broader context_).

---

## Phase 0 – Kickoff & Safeguards (1–2 days)
**Goal:** Freeze risky features, capture current Grade‑1 content, and ensure we can iterate without impacting the rest of the catalog.

1. **Feature flag for Coquí mentor**
   - Add an env-driven flag (e.g., `VITE_ENABLE_COQUI_VOICE`) and wrap `CoquiLessonAssistant` + `CoquiVoiceChat` in that condition so we can disable voice platform-wide instantly.
   - Default: OFF.

2. **Grade‑1 content snapshot**
   - Export the Grade‑1 lessons/exercises that use the uniform `{question, answers, questionImage}` structure (see `docs/extracted-assessments.json`).
   - Store metadata (IDs, titles, language pairs) in a simple Supabase table or JSON so the demo can load that curated list deterministically.

3. **Communication**
   - Document in `README` and demo script which pages still show the frog UI when the flag is off (“Voice helper coming soon” badge).
   - Notify content authors that voice prompts won’t change until Phase 2.

**Exit criteria**
   - Toggle kills all voice components instantly.
   - Grade‑1 curated data set exists (IDs listed) for later steps.

---

## Phase 1 – Grade‑1 Experience & UI Simplification (3–4 days)
**Goal:** Deliver a polished, non-voice Grade‑1 journey with consistent UI/UX and live Supabase progress.

1. **Student dashboard cards**
   - Replace static numbers with `useStudentProgress` data; show large K‑friendly buttons for “Lessons”, “Exercises”, “Assessments”.
   - Confirm cards filter to Grade‑1 and bilingual toggle works.

2. **Lesson ordering & locking**
   - Seed `lesson_ordering` with the curated Grade‑1 sequence so `ViewLesson` locking works.
   - Ensure `LessonExerciseFlow` loads the curated exercises in order.

3. **ReadingExercise hook**
   - Swap random scoring for actual Supabase writes to `completed_activity`.
   - Show a “Next step” CTA after completion that routes back to the curated list.

4. **Dashboards**
   - Wire teacher/family dashboards to Supabase aggregates (real metrics for the curated cohort) instead of mock arrays.
   - Provide at least one regional/admin chart using SQL views (even if simulated data).

5. **Profile cleanup**
   - Students see badges/progress only; hide teacher/family tiles unless the logged-in role matches.

6. **QA checklist**
   - Manual pass of Grade‑1 path in Spanish and English, with voice flag OFF.

**Exit criteria**
   - Grade‑1 flow works end-to-end without voice.
   - Dashboards display real Supabase numbers for the curated students.

---

## Phase 2 – Voice Guidance Plumbing (4–5 days)
**Goal:** Feed authored prompts + activity context into the realtime API and limit voice to the curated Grade‑1 path.

1. **Surface `voice_guidance` & `coqui_dialogue`**
   - Extend lesson/exercise fetch queries to return these fields.
   - In `CoquiLessonAssistant`, default to Supabase-provided guidance; fallback to the generic string only if null.

2. **Pass activity context**
   - Update `useCoquiSession`/`useRealtimeVoice` to include `activity_id` + `activity_type` in the relay URL.
   - Update `supabase/functions/realtime-voice-relay/index.ts` to append that context when building instructions (without overriding the author prompt).

3. **Selective enablement**
   - Only render `CoquiLessonAssistant` on the curated Grade‑1 lesson/exercise pages (others show “Voice helper coming soon”).
   - Keep the global feature flag ON for QA, but guard every component with “is this a curated Grade‑1 ID?”.

4. **Session guardrails**
   - Add a per-session timer (e.g., end after 2 minutes or 3 exchanges); show a friendly toast when the session auto-ends.
   - Disable reconnection loops after `endSession` so mic permissions clear cleanly.

5. **Logging & analytics**
   - Log each voice session (student ID, activity ID, start/end time) to Supabase for troubleshooting.

6. **Tests/Manual QA**
   - Verify the voice instructions in OpenAI logs match the Supabase fields for each curated activity.
   - Run on flaky network to ensure heartbeat/reconnect logic doesn’t hang.

**Exit criteria**
   - Voice prompts match authored guidance for all curated Grade‑1 activities.
   - Voice components hidden elsewhere.
   - Session timeout + logging in place.

---

## Phase 3 – Demo Hardening & Documentation (2–3 days)
**Goal:** Finalize demo collateral, ensure toggles/flags are documented, and prep Lovable handoff.

1. **Toggle matrix**
   - Document all feature flags/env vars in `docs/demo-readiness-plan.md` and the runbook.

2. **Demo script**
   - Provide a slide or one-pager describing the curated Grade‑1 storyline, login credentials, and when to enable the voice flag.

3. **Monitoring**
   - Add simple dashboards/log queries for voice sessions, so presenters can confirm the feature is behaving before a live demo.

4. **Lovable handoff**
   - Package this plan + acceptance criteria for each phase, plus links to the relevant files (`src/pages/...`, `src/hooks/...`, `supabase/functions/...`).

**Exit criteria**
   - Documentation clearly states how to run the Grade‑1 demo, how to disable/enable voice, and how to recover from issues.
   - Lovable (or any dev) has everything needed to implement the tasks.

---

## Sequence Recap
1. **Phase 0** – Safety net + content snapshot.  
2. **Phase 1** – Grade‑1 UX polish (no voice).  
3. **Phase 2** – Voice plumbing + selective enablement.  
4. **Phase 3** – Hardening & documentation.

Each phase builds on the previous one, so if time runs out you still have a functional non-voice Grade‑1 demo to show. Once Grade‑1 is bulletproof, we can revisit additional grades with the same pattern.
