# Alternate Grade‑1 Voice Enablement Plan (Test Fixtures + Context Plumbing)

This plan provides a deterministic path for validating the Coquí realtime flow by cloning a single Grade‑1 lesson plus **one exercise per subtype** (multiple_choice, fill_blank, drag_drop, true_false, write_answer) with recognizable `TEST G1 ...` titles. Each duplicate carries curated `voice_guidance`, `coqui_dialogue`, `pronunciation_words`, and updated `content` so the OpenAI Realtime API can infer the expected interaction every time.

The plan builds on the parent/child rules documented in `docs/PARENT_CHILD_RELATIONSHIP_DISCOVERY.md:1-120` and the dataset health assessment in `docs/COMPLETE_DATABASE_ANALYSIS_2025-10-26.md:150-214`.

---

## Phase 1 – Deterministic Grade‑1 Test Content (0.5 day)
**Goal:** Create a self-contained lesson bundle that mirrors real data but is safe to mutate, so QA can repeatedly exercise the voice mentor.

1. **Select source records from backups**  
   - Parse `database_backups/supabase_COMPLETE_backup_2025-10-26T08-34-27.json` and list Grade‑1 lessons/exercises with non-null `voice_guidance`, `coqui_dialogue`, and `pronunciation_words`.  
   - Chosen anchors:  
     - Lesson `5f048380-5df3-4c4c-9136-387b5d7ee93f` (syllable lesson).  
     - Exercises covering subtypes: `025b161b-07e2-4801-be27-0473eb04a574` (MCQ), `0e830479-fc0e-4896-ae05-e2aaadbb0e70` (fill blank), `b8234b01-b004-47d9-b1b2-aaac2b9a5db8` (drag/drop), `0392086a-519f-4415-8e06-ed8b503489f4` (true/false), `8133e265-0047-43bd-8d12-00afb2dd3946` (write answer).

2. **Duplicate via migration (done here as `20251026143000_grade1_voice_test_duplications.sql`)**  
   - Inserts a new parent lesson `b8edf8f2-63ce-4479-832c-7801c6d9785f` titled **“TEST G1 Lesson – Biliteracy Syllable Coach.”**  
   - Inserts five exercises with titles like **“TEST G1 Exercise – Sound Hunt (MCQ)”** and orders them 1‑5 using `parent_lesson_id` + `order_in_lesson`, honoring the hierarchy rules from `docs/PARENT_CHILD_RELATIONSHIP_DISCOVERY.md:65-140`.  
   - Each duplicate rewrites `content->question` with a `[TEST]` prefix, injects tailored `voice_guidance`/`coqui_dialogue`, and seeds `pronunciation_words` arrays so the voice mentor always receives pronunciation targets.  
   - Adds a `lesson_ordering` row in Grade‑1 with domain_name `TEST_G1_FIXTURES` so internal testers can find the scenario without disturbing production ordering.

3. **Verification checklist**  
   - `SELECT title, subtype, parent_lesson_id, order_in_lesson FROM manual_assessments WHERE title LIKE 'TEST G1%'` → expect six rows; exercises must reference `b8edf8f2-...` with sequential orders.  
   - `SELECT * FROM lesson_ordering WHERE domain_name = 'TEST_G1_FIXTURES'` → confirms discoverability.  
   - Confirm metadata flag `is_test_fixture = true` for cleanup later.

---

## Phase 2 – Pass Full Activity Context to the Relay (1 day)
**Goal:** Ensure the realtime relay reads all authoring fields (`voice_guidance`, `coqui_dialogue`, `pronunciation_words`, JSON `content`) so OpenAI can infer whether to read aloud, wait for a response, or guide toward correctness.

1. **Extend UI data plumbing**  
   - `ViewLesson.tsx` and `LessonExerciseFlow.tsx` already load manual assessments via `select('*')`; pass the following props into `CoquiLessonAssistant`:  
     - `voiceGuidance`, `coquiDialogue`, `pronunciationWords`, `content`, `title`, `subtype`, `language`.  
     - Activity metadata (lesson vs. exercise, order) for logging.

2. **Update hooks**  
   - `useCoquiSession` → accept a `voiceContext` object (above).  
   - `useRealtimeVoice` / `RealtimeVoiceClientEnhanced` → accept `activityId`, `activityType`, and `contextPayload`.  
   - Encode the payload as Base64 JSON (e.g., `btoa(JSON.stringify({...}))`) and send via `context_payload` query param together with `activity_id`/`activity_type`. This keeps the GET/WebSocket upgrade simple while remaining under typical URL limits (<8 KB).  
   - Continue supporting the existing `voiceGuidance` string for components like `WelcomeSpeaker` (they can pass a minimal context object).

3. **Relay changes (`supabase/functions/realtime-voice-relay/index.ts`)**  
   - Decode `context_payload` → store on `SessionState`.  
   - Build instructions by layering:  
     - Base persona instructions (language-specific).  
     - Activity summary: title, type, subtype, `pronunciation_words`.  
     - Author blocks: `VOICE GUIDANCE`, `COQUI DIALOGUE SCRIPT`, `PRONUNCIATION TARGETS`, and serialized `content`.  
     - Explicit rule: “If any string contains `🔊`, read or paraphrase it aloud before soliciting the student’s response.”  
   - Never overwrite the base persona; instead append sections so the AI “thinks” about the expected behavior for each step.  
   - Log whether guidance was supplied for observability.

4. **Respect OpenAI realtime constraints**  
   - Keep encoded payloads light (<6 KB) to avoid WebSocket URL issues, per the guidance in [OpenAI Realtime WebSocket docs](https://platform.openai.com/docs/guides/realtime-websocket).  
   - Use `session.update` to push the combined instructions immediately after `session.created` so the model receives the full context before the first token.

5. **Testing**  
   - Load the new TEST lesson/exercises; start Coquí → inspect the relay logs for `contextPayload` decode success.  
   - Watch OpenAI transcripts to ensure the assistant reads `🔊` prompts, waits for student responses, and references `pronunciation_words` when coaching.  
   - If payload size ever exceeds the limit, fall back to splitting the context across multiple query params or migrate to a short-lived Supabase table lookup (future work).

---

## Phase 3 – QA Script & Reset Automation (0.5 day)
1. **Daily reset script**  
   - Clear `completed_activity` for the new fixture lesson/exercises.  
   - Optionally reinsert the duplicated rows if a tester edits them manually.  
   - Run a smoke test (connect voice mentor, ensure context_kb displayed).

2. **Manual QA flow**  
   - Student logs in → opens “TEST G1 Lesson – Biliteracy Syllable Coach”.  
   - Confirm Coquí reads the author text (with 🔊) and references syllable practice.  
   - Complete each exercise type; confirm prompts differ (MC vs. drag_drop vs. open response).  
   - Switch languages (if supported) to ensure fallback instructions still keep context.

3. **Exit criteria**  
   - AI responses visibly change when modifying `voice_guidance` or `pronunciation_words` in Supabase.  
   - Relay logs show every session capturing `activity_id`, `activity_type`, and `context_payload`.  
   - QA sign-off recorded in runbook with test timestamps.

---

## Deliverables Recap
- ✅ Migration file `20251026143000_grade1_voice_test_duplications.sql` checked in (creates lesson, exercises, ordering).  
- ✅ Updated UI + relay code paths to stream full context payloads.  
- ✅ Documentation (this file + updated Phase 20 plan) describing how `pronunciation_words` and JSON `content` drive voice expectations.  
- ✅ QA checklist to verify the OpenAI realtime session interprets authored fields correctly.

This alternate track keeps scope intentionally small—one Grade‑1 lesson with five exercise modes—while validating the richer context plumbing required for future Grade‑1/Grade‑2 voice demos.
