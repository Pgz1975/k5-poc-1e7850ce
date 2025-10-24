# Mock WCPM Experience Plan

## 1. Goal & Constraints
- **Objective:** Demonstrate a believable reading fluency “analysis” flow using mock data only.
- **Constraints:** No real WCPM engine, no backend changes; all values must be simulated or hard-coded.
- **Success Signal:** Students, teachers, and families see age-appropriate visuals suggesting live analysis, including microphone/speaker activity and evolving WCPM numbers.

## 2. Reading Session UX (Student Experience)
1. **Audio Level Indicators**
   - Embed compact mic and speaker meters beside the voice controls (reuse bar visualization pattern from `src/pages/VoiceTest.tsx:150-216`).
   - Trigger animation whenever the mock session is “active” (tie into existing start/practice controls in `src/pages/ReadingExercise.tsx` or `ViewAssessment.tsx`).
2. **Simulated Live WCPM Banner**
   - Add a floating card showing: “📊 Analizando fluidez…”, current simulated WCPM, accuracy %, and a progress bar towards the grade benchmark.
   - Drive updates with a timer hook (e.g., increment WCPM every few seconds up to a target banded by level).
3. **Session Timeline**
   - Display simple chips: Listening → Reading → Analysis Complete, with the final state revealing a celebratory message and recommended next steps.
4. **Accessibility**
   - Keep labels bilingual via `useLanguage`.
   - Provide muted colors and playful icons for the child view.

## 3. Student Dashboard Additions
- **WCPM Status Card:** Friendly card with mascot, emotive copy (“¡Tu lectura va súper rápida!”) and a big number (e.g., 92 WCPM) plus a badge for “Nivel del grado”.
- **Progress Wheel:** Small radial progress comparing current mock WCPM vs. goal (`readingExercises` level to drive targets).
- **Trend Badges:** “🔺 5 WCPM más que ayer” using static comparisons to reinforce improvement.

## 4. Teacher Dashboard Additions
- **Class Fluency Snapshot:** Replace or enhance an existing stat card with “Promedio WCPM (Simulado)” and risk segmentation (Above/On/Below).
- **Distribution Chart:** Mock bar chart (using Recharts already imported) showing counts of students per risk band.
- **Student Table Columns:** Add “Último WCPM” and “Tendencia” chips to existing mock student rows.
- **Callouts:** Banner noting the data is a prototype analysis (“Modelo de demostración basado en sesiones simuladas”).

## 5. Family Dashboard Additions
- **Simple Dial:** Gauge showing child’s WCPM vs. grade benchmark with plain-language caption.
- **Weekly Story:** Timeline style list: “Lun – 85 WCPM (¡Mejoraste!)”.
- **Tips Section:** Tie recommendations to mock fluency (“Practiquen palabras con ‘r’ para subir la precisión”).
- **Tone:** Supportive, minimal jargon; emphasize encouragement over metrics.

## 6. Shared Simulation Strategy
- Create a small utility (e.g., `src/utils/mockWcpm.ts`) exporting helper functions:
  - `generateLiveWcpm(targetRange, duration)` → yields observable values for the session banner.
  - `getMockWcpmSummary(studentLevel)` → object with `current`, `trend`, `riskLabel`.
- Store seeded mock datasets for teacher/family dashboards to keep numbers consistent across refreshes.
- Ensure all mock values respect plausible grade-level ranges (use the benchmark table from existing docs as reference).

## 7. Implementation Sequence
1. Build the simulation utility and shared types.
2. Update reading session UI (audio meters, live banner, timeline).
3. Wire mock WCPM cards on Student Dashboard.
4. Extend Teacher Dashboard with aggregate mock metrics/charts.
5. Adapt Family Dashboard with supportive visuals and messaging.
6. QA pass to confirm bilingual copy, responsive layout, and that no backend calls are introduced.

## 8. Messaging & Disclosure
- Add subtle tooltips or footers stating “Datos simulados para demostración” across dashboards to avoid misrepresenting functionality.
- Prepare talking points for stakeholders clarifying that real WCPM development remains pending.

