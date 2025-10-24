# PLAN VERIFICATION – OCT 23, 2024

## Context & Constraints
- Client blockers span stability, voice guidance tone, activity formats, error recovery, manual assessment oversight, and kindergarten image workflows.
- Per stakeholder direction: update existing code paths rather than introducing brand-new components or modules.
- Goal: ship a reliable, child-safe demo experience by October 27 while keeping scope realistic for the current team.

## Findings From Repository Review
- `src/pages/ViewAssessment.tsx:55-105` starts the voice session without a timeout, never clears loading state on failures, and cleanup does not reset `isConnected`/`clientRef`, so sessions linger after exit.
- Answer buttons disable on first attempt (`disabled={showFeedback}` at `ViewAssessment.tsx:205`), forcing users to leave the screen to retry.
- `src/pages/CreateAssessment.tsx:389-391` requires the correct answer to include text, blocking image-only responses. The question media picker (`ImagePasteZone`) is single-image only.
- `src/components/ManualAssessment/ImagePasteZone.tsx:21-129` persists only one preview and lacks multi-image support or alt text input.
- Assessment listings in `src/pages/AdminDashboard.tsx:55-120` hard-limit Supabase queries to 10 items, so older lessons/exercises are hidden and uneditable.
- Voice instructions in `supabase/functions/realtime-voice-relay/index.ts:103-170` set a friendly tone but do not enforce gender-inclusive language or multi-step guidance rules, allowing adult terms and answer reveals.
- Exercise subtype handling falls back to `multiple_choice` during save (`CreateAssessment.tsx:414`), and `ViewAssessment.tsx` renders only multiple-choice style layouts—no true/false, fill-in, or matching flows exist yet.

## Adjusted Remediation Plan

### 🔴 P0 – Demo Blockers
1. **System stability & session cleanup**
   - Extend `ViewAssessment.tsx` to wrap `client.connect()` with a timeout/`finally`, cancel retries when unmounted, clear `clientRef`, and reset `isConnected`, `isAIPlaying`, and transcripts during cleanup.
   - Add disconnect listeners in `EnhancedRealtimeClient.ts` so the page can react when the server closes the stream, and ensure `disconnect()` tears down media tracks and metrics completely.
   - In `useRealtimeVoice.ts`, add a connection timeout, clear it on success, and throttle repeated error toasts to eliminate the persistent red banner.

2. **Child-appropriate, inclusive AI language**
   - Replace adult terms in the assessment templates (`CreateAssessment.tsx:200-320`) with inclusive, gender-neutral phrases and adjust pronunciation lists (remove “amor”, etc.).
   - Update `supabase/functions/realtime-voice-relay/index.ts` base instructions to explicitly forbid romantic terms, require dual-form greetings (“amiguito y amiguita”), and describe a praise → hint → scaffold → reveal progression tied to `max_attempts`.
   - When launching a session from `ViewAssessment.tsx`, merge the stored `voice_guidance` with a standard child-safety preamble so legacy records inherit the new guardrails.

3. **Exercise subtype fidelity**
   - Persist the chosen subtype during save by trusting `data.subtype` and only falling back to sensible defaults (`CreateAssessment.tsx:414`), and ensure `SubtypeSelector.tsx` lists the required formats (add Write Answer, Matching).
   - Adapt the content editor in `CreateAssessment.tsx` to show context-sensitive helpers using existing UI elements (e.g., lock True/False options, provide fill-in blank hint inputs, enable pair entry for matching).
   - Rework `ViewAssessment.tsx` to branch on `assessment.subtype` and reuse current UI primitives (`Card`, `Button`, `Input`) to implement true/false toggles, free-response inputs, fill-in blanks, and a simple matching workflow.

4. **Error handling and retry UX**
   - Track attempt counts per question, show a `Try again` action that resets `selectedAnswer`/`showFeedback` without navigating away, and only disable answers after the final allowed attempt.
   - Centralize feedback banners so the red error toast is reserved for unrecoverable failures; use inline status messaging for common retries.

5. **Manual assessment management**
   - Replace `.limit(10)` queries with paginated `.range()` calls in `AdminDashboard.tsx`, request counts, and surface page controls so teachers can browse, edit, and reopen older content.
   - Keep the existing edit pathway (`handleEditAssessment`) but expose it more clearly (labelled button/tooltip) and add a detail drawer or quick preview using the same component tree instead of a new one.

### 🟡 P1 – High Priority Completers
6. **Image authoring & display**
   - Update `ImagePasteZone.tsx` to optionally accept multiple files/pastes, maintain an ordered preview array, and allow authors to set brief captions for accessibility. Reuse it in lesson authoring so teachers can drop images into lesson bodies.
   - Change validation in `CreateAssessment.tsx` so an answer is considered valid when it has text *or* an image (`a.isCorrect && (a.text.trim() || a.imageUrl)`), enabling image-only Kindergarten drills.
   - Render multiple question images in `ViewAssessment.tsx` using a responsive grid with `object-contain` to prevent cropping, and treat answer thumbnails similarly.

7. **Template coverage for Kindergarten**
   - Extend the existing subtype selector with `write_answer` and `matching` options while keeping the same component.
   - Store template-specific data in `content` (e.g., `content.correctAnswer`, `content.blanks`, `content.pairs`) and expose corresponding editors within `CreateAssessment.tsx` using current inputs and buttons.
   - Update Supabase enum definitions and seed data so the backend accepts the new subtype values without adding separate services.

8. **AI response scaffolding**
   - Pass attempt context and any teacher-provided hints to the voice relay (append to `voice_guidance` payload) so Coquí follows the “praise → hint → scaffold → reveal” contract.
   - In `ViewAssessment.tsx`, on wrong answers trigger a hint request rather than immediate answer reveal, and only allow the reveal once attempts exceed `assessment.max_attempts`.

## Validation Strategy
- Smoke-test each subtype path (MC, True/False, Fill Blank, Write Answer, Matching) end-to-end in the browser.
- Regression test voice sessions for both Spanish and English to confirm inclusive phrasing and no lingering toasts.
- Upload single and multiple images (question + answer) and verify they persist and render correctly.
- Exercise pagination and edit flows in `AdminDashboard` with >10 manual assessments.
- Run `npm run test`, `npm run build`, and a Supabase type check after updating enum definitions.

## Suggested Timeline (Oct 24–27)
- **Day 1:** Stabilize voice session lifecycle, throttle error toasts, update AI instructions.
- **Day 2:** Finish subtype persistence, implement alternate exercise renderings, add retry UX.
- **Day 3:** Ship pagination, image authoring updates, and validation changes.
- **Day 4:** Polish hints/attempt logic, verify inclusive language output, full regression with client content.

## Risks & Mitigations
- **Data integrity:** updating `content` structure requires migration/backfill; mitigate with scripts to default missing fields and backward-compatible rendering.
- **Voice guidance drift:** legacy lessons lacking new guidance may still respond poorly—append the safety preamble on the fly until all records are updated.
- **Timeline pressure:** prioritize P0 items before deeper template UX; matching can fall back to simple two-column selection if drag/drop proves risky within schedule.
