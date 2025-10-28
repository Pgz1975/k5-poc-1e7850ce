# OpenAI Realtime API Demo Activities - Master Implementation Plan
## Mission Critical: Complete Isolation Architecture

**Generated:** October 28, 2025
**Updated:** October 28, 2025 - ISOLATION ARCHITECTURE
**Status:** READY FOR IMPLEMENTATION
**Priority:** MISSION CRITICAL
**Platform:** Lovable.dev
**Database:** Supabase (ID: meertwtenhlmnlpwxhyz)
**Version:** 2.0 - COMPLETE ISOLATION

---

## 🚨 ARCHITECTURAL PRINCIPLE: COMPLETE ISOLATION

### Two Parallel Systems That Never Interact

This plan implements **complete structural isolation** between demo and production:

**DEMO SYSTEM (Completely Separate):**
- Dedicated table: `demo_activities`
- Isolated Edge Function: `realtime-voice-demo-relay`
- Independent client: `ExperimentalVoiceClient` (standalone implementation)
- Dedicated routes: `/demo/**`
- Separate voice session table: `demo_voice_sessions`

**PRODUCTION SYSTEM (Untouched):**
- Existing table: `manual_assessments`
- Current Edge Function: `realtime-voice-relay`
- Production client: `RealtimeVoiceClientEnhanced`
- Regular routes: `/activities/**`
- Current voice session tables

**ONLY SHARED RESOURCE:** OpenAI API keys (environment variables)

### Why This Matters

✅ **Zero Production Risk**: Demos cannot break production voice features
✅ **Easy Removal**: Drop `demo_activities` table and delete demo routes - done
✅ **Independent Iteration**: Change demos without touching production code
✅ **Clear Ownership**: Demos are demonstrations, not production features

---

## 🎯 Executive Summary

This plan delivers **production-ready demo activities** showcasing OpenAI's Realtime API for EACH activity subtype in the platform, specifically designed for **Grade 1 (ages 6-7)** in both **Puerto Rican Spanish** and **American English**. Every demo will have unique, innovative features that demonstrate the API's capabilities beyond the current Coquí implementation.

**CRITICAL: All demos completely isolated from production manual assessments.**

### Key Differentiators
- **Current Implementation:** Voice guidance for lessons/exercises
- **Demo Implementation:** Interactive, real-time, specialized behaviors per activity subtype
- **Grade Level:** Grade 1 only (first demonstration phase)
- **Languages:** Puerto Rican Spanish (PR accent) + American English (US accent)
- **Special Feature:** "ReadFlow" - Interactive reading with live word highlighting and WCPM tracking
- **Activity Coverage:** ALL 6 database subtypes + ReadFlow = 7 total demos

---

## 🚨 CRITICAL REQUIREMENTS UPDATE

### Grade 1 Focus (Ages 6-7)
**ALL demos must be designed for Grade 1 students following:**
- **Curriculum:** docs/content/Bosquejo-de-Primer-grado.md guidelines
- **Vocabulary:** Simple words: sol, mesa, libro, coquí, luna, casa, etc.
- **Sentence Length:** Maximum 5-7 words per sentence
- **Phonemic Focus:** Initial, middle, and final sounds (Dominio 1)
- **Syllable Work:** 1-3 syllables only, clear pronunciation
- **Cultural Context:** Puerto Rican vocabulary and accent (coquí, plátano, playa)

### Bilingual Requirements
**EVERY demo in BOTH languages:**
- **Puerto Rican Spanish (es-PR):**
  - Authentic Puerto Rican accent
  - Local vocabulary (coquí, guineo, chinola)
  - Cultural context specific to Puerto Rico
  -
- **American English (en-US):**
  - Standard US accent
  - Age-appropriate vocabulary
  - Culturally sensitive content
  - Explains Puerto Rican context when needed

### Technical Constraints
- **Concurrent Users:** 5-10 maximum (demo limitation)
- **Connection:** Always requires internet (no offline mode)
- **Devices:** All devices supported (responsive already exists)
- **Access:** Grade 1 only - demo credentials: `student1@demo.com`
- **Database Flag:** `is_demo: true` + `demo_config` JSONB
- **Progress Tracking:** Same as regular activities
- **Audio Storage:** Stored in `voice_sessions` table for review

### New Demo Features
1. **Practice Mode:** In-activity practice for problematic words
2. **Adaptive Pausing:** AI pauses when student struggles (configurable)
3. **Microphone Permission:** Integrated with Coquí mascot UX
4. **Teacher Settings:**
   - Tolerance level (low/medium/high)
   - Feedback style (brief/detailed/encouraging)
   - Session length (5/10/15 minutes)
5. **Telemetry/Analytics:** Track demo usage, completion rates, effectiveness
6. **Phased Rollout:** Deploy one demo at a time for validation

### Compliance (COPPA)
**Per docs/requirements/Compliance_Summary.md:**
- Student data privacy aligned with DEPR policies
- Audio recordings: 30-day retention maximum
- Parent-accessible data (via `parent_accessible` flag)
- No personally identifiable information in logs
- Age-appropriate interactions (Grade 1 = 6-7 years old)

### Database Integration - ISOLATED TABLES
**NEW dedicated demo tables (NO shared tables with production):**
- `demo_activities` - Demo activity definitions (NOT in `manual_assessments`)
- `demo_voice_sessions` - Demo session tracking (separate from production)
- `demo_interactions` - Demo interaction logging (separate from production)

### Implementation Priority
**Phased Deployment (one at a time):**
1. ReadFlow (Week 2, Day 1) - Most critical
2. Multiple Choice (Week 2, Day 2) - Most common type
3. Lesson (Week 2, Day 3) - Core instructional
4. True/False (Week 2, Day 3) - Quick validation
5. Drag & Drop (Week 2, Day 4) - Voice innovation
6. Fill Blank (Week 2, Day 5) - Spelling support
7. Write Answer (Week 2, Day 5) - Creative expression

---

## 📊 Platform Analysis

### Current Architecture (Based on Research)

**Frontend:** React + TypeScript + Vite
**UI Framework:** Radix UI + shadcn/ui + TailwindCSS
**State Management:** React Query + Context API
**Database:** Supabase (PostgreSQL)
**Realtime Integration:** OpenAI Realtime API (WebSocket)
**Audio:** WebAudio API + AudioWorklet

### Existing Realtime Implementation

**Current Files:**
- `src/utils/realtime/RealtimeVoiceClientEnhanced.ts` - Production voice client
- `src/hooks/useCoquiSession.ts` - Session management
- `src/components/coqui/CoquiLessonAssistant.tsx` - Voice assistant UI
- `src/hooks/useRealtimeVoice.ts` - Voice connection hook

**Current Capabilities:**
- ✅ WebSocket connection to OpenAI Realtime API
- ✅ Audio streaming (24kHz PCM16)
- ✅ AudioWorklet for capture
- ✅ Adaptive jitter buffer
- ✅ Voice Activity Detection (VAD)
- ✅ Session management
- ✅ Connection state machine
- ✅ Heartbeat monitoring
- ✅ Auto-reconnection

**Current Use Cases:**
- Socratic teaching for lessons
- Pronunciation guidance for exercises
- General Q&A support

---

## 🎨 Activity Types Analysis

### From Database Analysis (October 26, 2025)
**Total Activities:** 308
**Activity Types:**
1. **lesson** (52, 16.9%) - Instructional content
2. **exercise** (255, 82.8%) - Practice activities
3. **assessment** (1, 0.3%) - Evaluation

### Exercise Subtypes (MUST COVER ALL 6):
1. **multiple_choice** - 168 activities (54.5%) ✅ DEMO REQUIRED
2. **lesson** - 68 activities (22.0%) ✅ DEMO REQUIRED
3. **drag_drop** - 31 activities (10.1%) ✅ DEMO REQUIRED
4. **true_false** - 18 activities (5.9%) ✅ DEMO REQUIRED
5. **fill_blank** - 18 activities (5.7%) ✅ DEMO REQUIRED
6. **write_answer** - 6 activities (1.8%) ✅ DEMO REQUIRED
7. **ReadFlow** - NEW interactive reading ✅ DEMO REQUIRED

**CRITICAL:** One demo for EACH subtype = 7 total demos

### Player Components Found:
- `MultipleChoicePlayer.tsx`
- `TrueFalsePlayer.tsx`
- `FillBlankPlayer.tsx`
- `WriteAnswerPlayer.tsx`
- `DragDropPlayer.tsx`
- `MatchModePlayer.tsx`

---

## 🚀 Demo Activities Strategy

### Differentiation from Current Implementation

| Aspect | Current (Coquí) | Demo (Realtime Showcase) |
|--------|----------------|--------------------------|
| **Purpose** | Educational assistance | API capability demonstration |
| **Interaction** | Socratic questioning | Specialized per activity type |
| **Audio Flow** | Guidance-based | Task-specific real-time |
| **Student Input** | Voice questions | Active task participation |
| **Feedback** | General hints | Immediate, specific feedback |
| **Visual** | Mascot indicator | Interactive UI elements |

### Demo Activity Requirements

Each demo MUST:
1. **Showcase unique Realtime API feature** not in current implementation
2. **Work on first implementation** (no iterations)
3. **Be production-ready** (error handling, fallbacks)
4. **Have clear visual distinction** (demo badge/styling)
5. **Include success criteria** (testable metrics)

---

## 📋 Demo Activities Specifications

### 1. LESSON Demo: "El Coquí Aventurero" (Interactive Story)
**Type:** `lesson` | **Subtype:** `lesson`
**Grade Level:** Grade 1 | **Languages:** Spanish (es-PR) + English (en-US)
**Unique Feature:** Real-time story adaptation with pronunciation coaching

**Grade 1 Curriculum Alignment:**
- Dominio 5: Leer y Comprender (Reading comprehension)
- Simple sentences: 5-7 words maximum
- Familiar vocabulary: sol, luna, bosque, amigo, casa
- Puerto Rican cultural elements: coquí, plátanos, playa

**Realtime API Features:**
- **Multi-turn conversation** with context preservation
- **Pronunciation feedback** on key vocabulary
- **Dynamic story pacing** based on student engagement
- **Bilingual code-switching** support (es-PR ↔ en-US)

**Content Structure (Spanish Version):**
```typescript
{
  title: "🎭 Demo: El Coquí Aventurero",
  demo_type: "story",
  language: "es-PR",
  grade_level: 1,
  content: {
    story_segments: [
      {
        id: "intro",
        text: "El coquí salta en la noche. Ve la luna brillar.",
        vocabulary: ["coquí", "salta", "noche", "luna"],
        pronunciation_practice: ["co-quí", "sal-ta"],
        question: "¿Qué ve el coquí?",
        expected_answer: "la luna"
      },
      {
        id: "adventure",
        text: "El coquí encuentra un amigo. Es un lagarto verde.",
        vocabulary: ["amigo", "lagarto", "verde"],
        question: "¿De qué color es el lagarto?",
        expected_answer: "verde"
      },
      // 4-5 total segments, Grade 1 appropriate
    ],
    learning_objectives: [
      "Comprensión literal",
      "Vocabulario básico",
      "Pronunciación correcta"
    ],
    cultural_elements: ["coquí", "Puerto Rico"],
    engagement_tracking: true
  },
  voice_guidance: "Narrate slowly and clearly with Puerto Rican accent. Ask simple comprehension questions. Model correct pronunciation. Praise effort. Keep sentences under 7 words. Use familiar Grade 1 vocabulary."
}
```

**English Version:**
```typescript
{
  title: "🎭 Demo: Coquí's Adventure",
  language: "en-US",
  content: {
    story_segments: [
      {
        text: "The coquí jumps at night. He sees the moon shine.",
        vocabulary: ["coquí", "jumps", "night", "moon"],
        // Parallel structure to Spanish version
      }
    ]
  },
  voice_guidance: "Narrate with clear American accent. Teach about Puerto Rico's coquí. Simple Grade 1 English vocabulary."
}
```

**Technical Implementation:**
- Use `response.create` with `conversation: "default"` for story continuity
- Monitor audio levels to detect engagement drops
- Use `metadata` in responses to track story branch choices
- Implement voice modulation for character differentiation

---

### 2. MULTIPLE CHOICE Demo: "¿Cuál es la mascota?" (Pronunciation Challenge)
**Type:** `exercise` | **Subtype:** `multiple_choice`
**Grade Level:** Grade 1 | **Languages:** Spanish (es-PR) + English (en-US)
**Unique Feature:** Voice-to-select with pronunciation coaching

**Grade 1 Curriculum Alignment:**
- Dominio 1: Conciencia Fonológica (Phonemic awareness)
- Simple vocabulary: coquí, perro, gato, pájaro
- Initial sound recognition
- Puerto Rican animals and context

**Realtime API Features:**
- **Voice-activated selection** (speak to choose)
- **Pronunciation assessment** with confidence scores
- **Real-time audio waveform** visualization
- **Phoneme-level feedback** for Grade 1

**Content Structure (Spanish Version):**
```typescript
{
  title: "🎤 Demo: ¿Cuál es la mascota de Puerto Rico?",
  demo_type: "pronunciation",
  language: "es-PR",
  grade_level: 1,
  content: {
    question: "¿Cuál es la mascota de Puerto Rico?",
    question_audio: true, // AI reads question
    target_pronunciation: "coquí",
    answers: [
      {
        text: "coquí",
        pronunciation: ["co-quí"],
        syllables: 2,
        initial_sound: "/k/",
        isCorrect: true,
        image_url: "/images/coqui.png"
      },
      {
        text: "perro",
        pronunciation: ["pe-rro"],
        syllables: 2,
        initial_sound: "/p/",
        isCorrect: false,
        image_url: "/images/perro.png"
      },
      {
        text: "gato",
        pronunciation: ["ga-to"],
        syllables: 2,
        initial_sound: "/g/",
        isCorrect: false,
        image_url: "/images/gato.png"
      },
      {
        text: "pájaro",
        pronunciation: ["pá-ja-ro"],
        syllables: 3,
        initial_sound: "/p/",
        isCorrect: false,
        image_url: "/images/pajaro.png"
      }
    ],
    pronunciation_challenge: {
      say_to_select: true,
      confidence_threshold: 0.70, // Lower for Grade 1
      feedback_levels: ["syllable", "word"], // Grade 1 appropriate
      practice_mode: true, // Allow repeated practice
      pause_on_struggle: true // Stop and help when needed
    },
    cultural_context: "El coquí es la mascota oficial de Puerto Rico."
  },
  pronunciation_words: ["coquí", "perro", "gato", "pájaro"],
  voice_guidance: "Read question slowly with Puerto Rican accent. Listen for student's spoken answer. Accept 'a', 'b', 'c', 'd' or full word. Provide gentle pronunciation help. Model correct pronunciation syllable by syllable. Celebrate correct answers enthusiastically."
}
```

**English Version:**
```typescript
{
  title: "🎤 Demo: What is Puerto Rico's mascot?",
  language: "en-US",
  grade_level: 1,
  content: {
    question: "What is Puerto Rico's special animal?",
    answers: [
      { text: "coquí", pronunciation: ["co-KEE"], isCorrect: true },
      { text: "dog", pronunciation: ["dawg"], isCorrect: false },
      { text: "cat", pronunciation: ["kat"], isCorrect: false },
      { text: "bird", pronunciation: ["burd"], isCorrect: false }
    ],
    cultural_context: "The coquí is a small frog found only in Puerto Rico!"
  }
}
```

**Technical Implementation:**
- Enable `audio.input.transcription` with `logprobs` for confidence
- Use `input_audio_buffer.speech_started/stopped` events
- Calculate pronunciation accuracy from transcription
- Display real-time audio waveform using AudioContext analyzer

---

### 3. TRUE/FALSE Demo: "¿Verdadero o Falso?" (Speed Challenge)
**Type:** `exercise` | **Subtype:** `true_false`
**Grade Level:** Grade 1 | **Languages:** Spanish (es-PR) + English (en-US)
**Unique Feature:** Voice-only responses with speed scoring

**Grade 1 Curriculum Alignment:**
- Simple factual statements
- Basic comprehension (literal understanding)
- Quick decision-making
- Familiar concepts: sun, animals, colors, numbers

**Content Examples (Spanish):**
```typescript
{
  title: "⚡ Demo: ¿Verdadero o Falso?",
  type: "exercise",
  subtype: "true_false",
  language: "es-PR",
  grade_level: 1,
  is_demo: true,
  content: {
    questions: [
      {
        statement: "El sol brilla en la noche.",
        correct: false,
        category: "nature",
        explanation: "El sol brilla en el día, no en la noche.",
        time_limit_ms: 5000 // 5 seconds for Grade 1
      },
      {
        statement: "El coquí vive en Puerto Rico.",
        correct: true,
        category: "culture",
        explanation: "¡Sí! El coquí es de Puerto Rico.",
        time_limit_ms: 5000
      },
      {
        statement: "Los perros tienen alas.",
        correct: false,
        category: "animals",
        explanation: "Los perros tienen patas, no alas.",
        time_limit_ms: 5000
      },
      {
        statement: "Hay siete días en una semana.",
        correct: true,
        category: "time",
        explanation: "¡Correcto! Una semana tiene siete días.",
        time_limit_ms: 5000
      }
      // 8-10 total questions, all Grade 1 appropriate
    ],
    scoring: {
      base_points: 10,
      speed_multiplier: true,
      max_multiplier: 2.0, // Lower for Grade 1
      celebration_threshold: 5 // Celebrate every 5 correct
    }
  },
  voice_guidance: "Read each statement clearly and slowly with Puerto Rican accent. Accept 'verdadero', 'falso', 'sí', 'no'. Give 5 seconds to answer. Celebrate correct answers immediately. Explain wrong answers gently. Keep energy high but not overwhelming for Grade 1."
}
```

### 3. TRUE/FALSE Demo: "Rapid-Fire Quiz"
**Type:** `exercise` | **Subtype:** `true_false`
**Unique Feature:** Speed-based scoring with instant audio feedback

**Realtime API Features:**
- **Low-latency responses** (< 500ms)
- **Interrupt handling** for rapid answers
- **Voice-only interaction** (no visual selection)
- **Performance metrics tracking**

**Content Structure:**
```typescript
{
  title: "⚡ Demo: Speed Quiz Championship",
  demo_type: "speed_quiz",
  language: "es-PR",
  content: {
    questions: [
      {
        statement: "El sol sale por el oeste",
        correct: false,
        category: "science",
        time_limit_ms: 3000
      },
      // 10 rapid-fire questions
    ],
    scoring: {
      base_points: 10,
      speed_multiplier: true,
      max_multiplier: 3.0,
      penalty_per_second: 0.5
    },
    leaderboard: true
  },
  voice_guidance: "Rapid-fire quiz mode. Read statement clearly. Accept 'verdadero/falso' or 'true/false'. Celebrate fast correct answers. Immediate feedback only."
}
```

**Technical Implementation:**
- Set `turn_detection.create_response: false` for manual control
- Use performance.now() for precise timing
- Send `response.create` immediately on answer detection
- Implement interrupt with `response.cancel`

---

### 4. DRAG & DROP Demo: "Voice-Directed Assembly"
**Type:** `exercise` | **Subtype:** `drag_drop`
**Unique Feature:** Hands-free assembly via voice commands

**Realtime API Features:**
- **Function calling** for drag/drop commands
- **Multi-step task guidance**
- **Spatial awareness** (left/right/top/bottom instructions)
- **Undo/redo via voice**

**Content Structure:**
```typescript
{
  title: "🎨 Demo: Build a Scene with Voice",
  demo_type: "voice_builder",
  language: "es-PR",
  content: {
    target_layout: {
      zones: [
        { id: "sky", accepts: ["cloud", "sun", "bird"], position: "top" },
        { id: "ground", accepts: ["tree", "flower", "grass"], position: "bottom" }
      ]
    },
    items: [
      { id: "sun", label: "sol", image_url: "...", zone: null },
      { id: "cloud", label: "nube", image_url: "...", zone: null },
      // 8-10 draggable items
    ],
    voice_commands: {
      place: ["coloca", "pon", "mueve"],
      undo: ["deshacer", "atrás", "quitar"],
      help: ["ayuda", "qué puedo hacer"]
    },
    function_tools: [
      {
        name: "move_item",
        description: "Move an item to a zone",
        parameters: {
          item: { type: "string", enum: ["sun", "cloud", ...] },
          zone: { type: "string", enum: ["sky", "ground"] }
        }
      },
      {
        name: "undo_move",
        description: "Undo the last move"
      }
    ]
  },
  voice_guidance: "Guide student to build scene using voice only. Parse commands like 'pon el sol arriba' or 'move cloud to sky'. Confirm each action. Provide spatial feedback."
}
```

**Technical Implementation:**
- Define tools in `session.tools` or `response.tools`
- Listen for `response.function_call_arguments.done`
- Execute drag/drop logic from function parameters
- Create `conversation.item.create` with function call results
- Send `response.create` to continue conversation

---

### 5. FILL BLANK Demo: "Spelling Coach"
**Type:** `exercise` | **Subtype:** `fill_blank`
**Unique Feature:** Letter-by-letter spelling guidance with phonetic hints

**Realtime API Features:**
- **Incremental input processing**
- **Phonetic breakdown** in audio
- **Partial correctness feedback**
- **Audio spelling** (letter names)

**Content Structure:**
```typescript
{
  title: "✏️ Demo: Spelling Master",
  demo_type: "spelling",
  language: "es-PR",
  content: {
    mode: "single_word",
    prompt: "Spell the word:",
    target: "mariposa",
    phonetic_hints: ["ma-ri-po-sa", "/m/ /a/ /r/ /i/ /p/ /o/ /s/ /a/"],
    letters: ["m", "a", "r", "i", "p", "o", "s", "a", "e", "l", "t", "n"],
    auto_shuffle: false,
    spelling_aid: {
      say_letter_names: true,
      syllable_breaks: true,
      rhyme_hints: ["butterfly in English"]
    },
    imageUrl: "butterfly.jpg"
  },
  pronunciation_words: ["mariposa"],
  voice_guidance: "Guide spelling letter by letter. Pronounce each letter name clearly. Break into syllables. Provide phonetic hints if stuck. Celebrate progress."
}
```

**Technical Implementation:**
- Listen for letter-by-letter transcription
- Compare partial input to target word
- Use `response.create` with custom `instructions` per letter
- Provide audio hints: "The first letter makes the /m/ sound like in 'mamá'"
- Track progress with metadata

---

### 6. WRITE ANSWER Demo: "Creative Writing Coach"
**Type:** `exercise` | **Subtype:** `write_answer`
**Unique Feature:** Real-time composition feedback and suggestions

**Realtime API Features:**
- **Long-form input handling**
- **Sentence-level analysis**
- **Constructive feedback** without revealing answer
- **Idea generation** via conversation

**Content Structure:**
```typescript
{
  title: "📝 Demo: Story Starter",
  demo_type: "writing",
  language: "es-PR",
  content: {
    prompt: "Describe what happened to Coquí on his adventure.",
    word_limit: 50,
    evaluation_criteria: [
      "Uses descriptive words",
      "Has beginning, middle, and end",
      "Includes character feelings",
      "Creative and original"
    ],
    coaching_hints: {
      vocabulary_suggestions: true,
      sentence_structure_help: true,
      creativity_prompts: true
    },
    example_response: "Coquí encontró un cofre mágico en el bosque. Cuando lo abrió..."
  },
  voice_guidance: "Coach creative writing. Ask questions to expand ideas: 'How did Coquí feel?' 'What happened next?' Praise specific details. Suggest vocabulary. Don't write for student."
}
```

**Technical Implementation:**
- Use out-of-band responses (`conversation: "none"`) for suggestions
- Parse transcription for key elements (emotions, descriptions)
- Generate prompts via `response.create` with custom context
- Track word count from transcription
- Allow multiple revisions

---

### 7. SPECIAL: "ReadFlow" - Interactive Reading
**Type:** `exercise` | **Subtype:** `reading_interactive` (NEW)
**Unique Feature:** Real-time word highlighting synchronized with student reading

**Realtime API Features:**
- **Word-level transcription timestamps**
- **Reading pace detection**
- **Pronunciation difficulty identification**
- **Fluency scoring**

**Content Structure:**
```typescript
{
  title: "📖 ReadFlow: Interactive Reading",
  demo_type: "readflow",
  language: "es-PR",
  content: {
    passage: {
      title: "La Aventura de Coquí",
      text: "Coquí el pequeño saltó de hoja en hoja. El bosque brillaba con luz dorada. De repente, escuchó un sonido extraño.",
      words: [
        { id: 0, text: "Coquí", pronunciation: "ko-kí", difficulty: "easy" },
        { id: 1, text: "el", pronunciation: "el", difficulty: "easy" },
        { id: 2, text: "pequeño", pronunciation: "pe-ke-ño", difficulty: "medium" },
        // ... word-by-word breakdown
      ],
      target_wcpm: 60, // Words Correct Per Minute
      min_accuracy: 0.90
    },
    reading_assistance: {
      word_highlighting: true,
      auto_scroll: true,
      pronunciation_hints: true,
      pace_feedback: true
    },
    feedback_types: [
      "pronunciation_error",
      "skipped_word",
      "repeated_word",
      "pace_too_fast",
      "pace_too_slow"
    ]
  },
  voice_guidance: "Listen carefully to student reading. Track each word. Highlight current word. Provide immediate pronunciation correction. Encourage fluency. Model correct reading if stuck."
}
```

**Technical Implementation:**
- Use `audio.input.transcription` with `gpt-4o-transcribe` for word-level timestamps
- Parse `conversation.item.input_audio_transcription.delta` events
- Map transcribed words to passage words using fuzzy matching
- Update UI to highlight current word via state updates
- Calculate reading metrics (WCPM, accuracy, fluency)
- Provide real-time audio feedback for problematic words

**Word Highlighting Algorithm:**
```typescript
// Pseudo-code for ReadFlow highlighting
let currentWordIndex = 0;
const passageWords = content.passage.words;

onTranscriptionDelta((delta) => {
  const spokenWord = cleanWord(delta);
  const expectedWord = passageWords[currentWordIndex];

  const match = fuzzyMatch(spokenWord, expectedWord.text, threshold=0.85);

  if (match) {
    // Highlight word as correct
    highlightWord(currentWordIndex, 'correct');
    currentWordIndex++;
  } else {
    // Check if skipped ahead
    const nextMatches = passageWords.slice(currentWordIndex + 1, currentWordIndex + 4)
      .map((w, i) => ({ word: w, index: i + currentWordIndex + 1, match: fuzzyMatch(spokenWord, w.text) }))
      .filter(m => m.match > 0.85);

    if (nextMatches.length > 0) {
      // Word skipped
      highlightWord(currentWordIndex, 'skipped');
      currentWordIndex = nextMatches[0].index;
      highlightWord(currentWordIndex, 'correct');
      currentWordIndex++;
    } else {
      // Pronunciation error
      highlightWord(currentWordIndex, 'error');
      providePronunciationHint(expectedWord);
    }
  }

  // Update scroll position
  autoScrollToWord(currentWordIndex);
});
```

---

## 🏗️ Technical Architecture - COMPLETE ISOLATION

### Two Completely Separate Systems

```
┌─────────────────────────────────────────────────────────────┐
│                  DEMO SYSTEM (Isolated)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐      ┌──────────────────┐             │
│  │  Demo Router    │─────▶│  Demo Players    │             │
│  │  /demo/:type/:id │      │  - ReadFlow      │             │
│  └─────────────────┘      │  - Pronunciation │             │
│                            │  - Speed Quiz    │             │
│                            └──────────────────┘             │
│                                     │                         │
│                                     ▼                         │
│                   ┌─────────────────────────────────┐       │
│                   │ ExperimentalVoiceClient         │       │
│                   │ (Standalone - NOT extending)    │       │
│                   └─────────────────────────────────┘       │
│                                     │                         │
│                                     ▼                         │
│              ┌──────────────────────────────────────┐       │
│              │  realtime-voice-demo-relay           │       │
│              │  (Dedicated Edge Function)           │       │
│              └──────────────────────────────────────┘       │
│                                     │                         │
│                                     ▼                         │
│              ┌──────────────────────────────────────┐       │
│              │  OpenAI Realtime API                 │       │
│              │  (Shared: API Keys Only)             │       │
│              └──────────────────────────────────────┘       │
│                                                               │
│  Database: demo_activities, demo_voice_sessions              │
└─────────────────────────────────────────────────────────────┘

                          NO CONNECTION
                              ⊗  ⊗  ⊗

┌─────────────────────────────────────────────────────────────┐
│           PRODUCTION SYSTEM (Completely Untouched)           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐     ┌──────────────────┐             │
│  │  Activity Router │────▶│  Activity Players│             │
│  │  /activities/**  │     │  - Lessons       │             │
│  └──────────────────┘     │  - Exercises     │             │
│                            └──────────────────┘             │
│                                     │                         │
│                                     ▼                         │
│                ┌──────────────────────────────────┐         │
│                │ RealtimeVoiceClientEnhanced      │         │
│                │ (Production - unchanged)         │         │
│                └──────────────────────────────────┘         │
│                                     │                         │
│                                     ▼                         │
│              ┌──────────────────────────────────────┐       │
│              │  realtime-voice-relay                │       │
│              │  (Production Edge Function)          │       │
│              └──────────────────────────────────────┘       │
│                                                               │
│  Database: manual_assessments, voice_sessions                │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema - NEW ISOLATED TABLES

```sql
-- NEW TABLE: demo_activities (NOT modifying manual_assessments)
CREATE TABLE demo_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  demo_type TEXT NOT NULL, -- 'readflow', 'pronunciation', etc.
  language TEXT NOT NULL, -- 'es-PR' or 'en-US'
  grade_level INTEGER NOT NULL,
  content JSONB NOT NULL,
  voice_guidance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEW TABLE: demo_voice_sessions (separate from voice_sessions)
CREATE TABLE demo_voice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_activity_id UUID REFERENCES demo_activities(id),
  student_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  telemetry JSONB,
  total_api_cost_cents INTEGER DEFAULT 0
);

-- NEW TABLE: demo_interactions (separate from voice_interactions)
CREATE TABLE demo_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_session_id UUID REFERENCES demo_voice_sessions(id),
  interaction_type TEXT NOT NULL,
  transcript TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ZERO CHANGES to manual_assessments table
-- ZERO CHANGES to voice_sessions table
-- ZERO CHANGES to voice_interactions table
```

---

## 📁 File Structure

```
/workspaces/k5-poc-1e7850ce/
├── docs/plan/24-realtime-demo/
│   ├── MASTER_PLAN.md (this file)
│   ├── TECHNICAL_SPECS.md (detailed implementation)
│   ├── CODE_TEMPLATES.md (reusable code patterns)
│   ├── TESTING_GUIDE.md (QA procedures)
│   └── OPEN_SOURCE_RESEARCH.md (libraries & tools)
│
├── src/
│   ├── pages/
│   │   └── DemoActivity.tsx (NEW - demo router)
│   │
│   ├── components/
│   │   ├── demo/
│   │   │   ├── DemoPlayers/
│   │   │   │   ├── StoryNarrationPlayer.tsx
│   │   │   │   ├── PronunciationPlayer.tsx
│   │   │   │   ├── SpeedQuizPlayer.tsx
│   │   │   │   ├── VoiceBuilderPlayer.tsx
│   │   │   │   ├── SpellingCoachPlayer.tsx
│   │   │   │   ├── WritingCoachPlayer.tsx
│   │   │   │   └── ReadFlowPlayer.tsx
│   │   │   │
│   │   │   ├── DemoControls.tsx
│   │   │   ├── DemoHeader.tsx
│   │   │   └── DemoFeedback.tsx
│   │   │
│   │   └── realtime/ (shared components)
│   │       ├── AudioWaveform.tsx
│   │       ├── TranscriptionDisplay.tsx
│   │       ├── PronunciationFeedback.tsx
│   │       └── ReadingHighlighter.tsx
│   │
│   ├── hooks/
│   │   ├── useRealtimeDemo.ts (demo orchestration)
│   │   ├── useWordHighlighting.ts (ReadFlow)
│   │   ├── usePronunciationAnalysis.ts
│   │   ├── useFunctionCalling.ts
│   │   └── useReadingMetrics.ts
│   │
│   └── utils/
│       ├── realtime/
│       │   ├── ExperimentalVoiceClient.ts (standalone - NO inheritance)
│       │   ├── TranscriptionParser.ts
│       │   ├── PronunciationScorer.ts
│       │   ├── FuzzyMatcher.ts
│       │   └── ReadingMetrics.ts
│       │
│       └── demo/
│           ├── demoActivities.ts (demo content definitions)
│           └── demoConfig.ts (configuration)
│
└── database/
    └── migrations/
        └── add_demo_activities.sql
```

---

## 🎯 Success Criteria

### Per-Activity Metrics

| Demo Type | Key Metric | Target | Test Method |
|-----------|-----------|--------|-------------|
| **Story Narration** | Branching depth | 3+ levels | Manual testing |
| **Pronunciation** | Transcription accuracy | >85% | Audio samples |
| **Speed Quiz** | Response latency | <500ms | Performance.now() |
| **Voice Builder** | Function call accuracy | >90% | Command tests |
| **Spelling Coach** | Letter detection rate | >95% | Alphabet test |
| **Writing Coach** | Feedback relevance | 4/5 rating | User survey |
| **ReadFlow** | Word sync accuracy | >92% | Passage tests |

### Overall System Metrics

- **First-time success rate:** 100% (all demos work on first deployment)
- **Error recovery:** <2 seconds to reconnect on failure
- **Browser compatibility:** Chrome, Firefox, Safari (latest 2 versions)
- **Mobile support:** iOS 15+, Android 12+
- **Concurrent sessions:** Support 10+ simultaneous demos
- **Audio quality:** Clear, no distortion, <100ms latency

---

## 🚧 Implementation Phases

### Phase 1: Foundation (Week 1)
**Days 1-2: Core Standalone Client**
- [ ] Create `ExperimentalVoiceClient.ts` (standalone - no inheritance)
- [ ] Implement `TranscriptionParser.ts` for word-level parsing
- [ ] Build `AudioWaveform.tsx` component
- [ ] Setup demo database schema
- [ ] Create demo routing structure

**Days 3-4: Shared Utilities**
- [ ] Implement `FuzzyMatcher.ts` for word matching
- [ ] Build `PronunciationScorer.ts`
- [ ] Create `useRealtimeDemo.ts` hook
- [ ] Implement `ReadingMetrics.ts` calculator
- [ ] Setup demo configuration system

**Day 5: Testing Infrastructure**
- [ ] Create demo test suite
- [ ] Setup audio sample library
- [ ] Implement performance monitoring
- [ ] Create demo launcher page

### Phase 2: Demo Activities (Week 2)
**Days 1-2: High-Priority Demos**
- [ ] ReadFlow Player (Day 1)
- [ ] Pronunciation Player (Day 2)

**Days 3-4: Core Demos**
- [ ] Story Narration Player (Day 3 AM)
- [ ] Speed Quiz Player (Day 3 PM)
- [ ] Voice Builder Player (Day 4)

**Day 5: Writing & Spelling**
- [ ] Spelling Coach Player (AM)
- [ ] Writing Coach Player (PM)

### Phase 3: Polish & Testing (Week 3)
**Days 1-2: Integration & QA**
- [ ] End-to-end testing all demos
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Mobile responsiveness
- [ ] Accessibility (ARIA labels, keyboard nav)

**Days 3-4: Documentation & Deployment**
- [ ] User documentation
- [ ] Demo walkthrough videos
- [ ] Deployment to staging
- [ ] Load testing
- [ ] Security audit

**Day 5: Production Launch**
- [ ] Deploy to production
- [ ] Monitor metrics
- [ ] Gather initial feedback
- [ ] Hotfix any critical issues

---

## ⚠️ Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Transcription accuracy** | Medium | High | Use gpt-4o-transcribe, implement fuzzy matching |
| **Audio latency** | Medium | High | Optimize AudioWorklet, use adaptive buffering |
| **WebSocket instability** | Low | High | Implement robust reconnection, heartbeat monitoring |
| **Browser compatibility** | Medium | Medium | Polyfills, feature detection, graceful degradation |
| **Function call errors** | Medium | Medium | Validate all parameters, error boundaries |
| **Word sync timing** | High | High | Use word-level timestamps, implement calibration |

### Content Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Insufficient test content** | Low | Medium | Create comprehensive demo content library |
| **Language mixing (ES/EN)** | Medium | Low | Strict language detection, clear UI labels |
| **Inappropriate AI responses** | Low | High | System prompts with safety guardrails |
| **Performance on slow devices** | Medium | Medium | Graceful quality degradation, loading states |

---

## 📚 Appendices

### A. Questions Answered

**Scope Questions:**
1. ✅ **Activity types:** 6 main exercise types + 1 new (ReadFlow) = 7 demos total
2. ✅ **Concurrent users:** Designed for 10+ simultaneous sessions
3. ✅ **Existing audio capabilities:** Yes - full WebAudio API with AudioWorklet

**Technical Questions:**
1. ✅ **Frontend framework:** React 18.3 + TypeScript + Vite
2. ✅ **WebSocket infrastructure:** Yes - existing RealtimeVoiceClientEnhanced
3. ✅ **Authentication flow:** Supabase Auth with localStorage persistence

**Feature Questions:**
1. ✅ **Reading feedback:** Real-time during reading (immediate)
2. ✅ **Pronunciation accuracy:** Target 85% threshold
3. ✅ **Scoring system:** Yes - per demo type with different metrics

**Integration Questions:**
1. ✅ **Voice permissions:** Existing flow via getUserMedia
2. ✅ **Demo access:** Special route `/demo/:type/:id` with demo badge
3. ✅ **Mobile support:** Yes - responsive design with mobile optimization

---

## 📊 Related Documents

- **[TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)** - Detailed implementation specifications
- **[CODE_TEMPLATES.md](./CODE_TEMPLATES.md)** - Reusable code patterns and examples
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - QA procedures and test cases
- **[OPEN_SOURCE_RESEARCH.md](./OPEN_SOURCE_RESEARCH.md)** - Libraries and tools analysis
- **[READFLOW_DESIGN.md](./READFLOW_DESIGN.md)** - Interactive reading feature deep dive

---

**Document Status:** ✅ READY FOR IMPLEMENTATION
**Next Action:** Proceed to TECHNICAL_SPECS.md for detailed code specifications
**Estimated Timeline:** 3 weeks (15 working days)
**Team Size:** 2-3 developers + 1 QA engineer

**Last Updated:** October 28, 2025
**Version:** 1.0
**Author:** Claude Code AI Assistant
