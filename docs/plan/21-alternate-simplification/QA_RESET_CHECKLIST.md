# TEST G1 Voice QA & Reset Checklist

This doc operationalizes Phase 3 of `ALTERNATE_GRADE1_VOICE_PLAN.md` so the demo team can reset data and run the same Grade‑1 voice flow every day.

## 1. Data Reset Script (Supabase SQL)
Run the following SQL (e.g., Supabase SQL editor) before each QA pass:

```sql
-- Clear progress for all TEST G1 fixtures
DELETE FROM completed_activity
WHERE activity_id IN (
  SELECT id FROM manual_assessments
  WHERE title LIKE 'TEST G1%'
);

-- Optional: prune voice session logs for faster review
DELETE FROM voice_sessions
WHERE assessment_id IN (
  SELECT id FROM manual_assessments
  WHERE title LIKE 'TEST G1%'
);
```

⚠️ This does **not** remove the fixtures; it only wipes prior completions so the flow starts fresh for every demo account.

## 2. Manual Smoke Test
1. **Student login** → Navigate to “TEST G1 Lesson – Biliteracy Syllable Coach.”
2. Click the Coquí assistant; confirm it greets first, reads the 🔊 lines, and references the lesson content.
3. Complete the lesson, then walk through the five exercises in order:
   - Sound Hunt (MCQ)
   - Missing Vowel (Fill Blank)
   - Build the Word (Drag & Drop)
   - Life Cycle Facts (True/False)
   - Predict the Word (Write Answer)
4. For each exercise, verify the AI:
   - Reads or paraphrases the 🔊 text aloud
   - Uses the pronunciation words as coaching targets
   - Follows the hint → scaffold → reveal pattern (no direct answers)
5. Edit one exercise’s `voice_guidance` in Supabase (add a unique phrase), refresh, and confirm the AI now includes that phrase.
6. Switch the UI language toggle (es/en), reconnect voice, and confirm the persona instructions switch languages but still respect the scripted context.

## 3. Observability Checks
- Tail `supabase/functions/realtime-voice-relay` logs to ensure:
  - `🔊 markers present: true/false` appears per session
  - `🎯 pronunciation targets: N` matches the Supabase arrays
  - Instruction length stays below a few KB
- If a session deviates, capture the log snippet + the corresponding manual_assessment row for debugging.

## 4. Exit Criteria
- All five exercises complete with live voice guidance and context-aware behaviors.
- Changing `voice_guidance` or `pronunciation_words` in Supabase immediately alters the AI response.
- QA log sheet updated with date, tester, and any anomalies.

Following this checklist keeps the TEST G1 scenario deterministic and demonstrates that OpenAI receives the exact scripted context on every run.
