# Grade 1 Content Specifications - OpenAI Realtime API Demos
## Complete Bilingual Content Examples - ISOLATED SYSTEM

**Version:** 2.0 - ISOLATION ARCHITECTURE
**Date:** October 28, 2025
**Grade Level:** Grade 1 (Ages 6-7)
**Languages:** Puerto Rican Spanish (es-PR) + American English (en-US)
**Architecture:** COMPLETE ISOLATION

---

## 🚨 CRITICAL: ISOLATED DEMO SYSTEM

**All content in this document refers to the ISOLATED demo system:**
- Stored in `demo_activities` table (NOT `manual_assessments`)
- Accessed via `/demo/**` routes (NOT `/activities/**`)
- Uses `ExperimentalVoiceClient` (NOT production client)
- Completely separate from production activities

**Zero impact on production manual assessments.**

---

## 📚 Curriculum Alignment

### From Bosquejo-de-Primer-grado.md

**DOMINIO 1: CONCIENCIA FONOLÓGICA Y FONÉTICA**
- Lección 1: Reconocimiento del sonido inicial (sol, mar, flor, coquí)
- Lección 2: Comparación de sonidos iniciales
- Lección 3: Identificación del sonido del medio (pan, jugo, leche)
- Lección 4: Detección del sonido final (flor, sol, luz, campo)

**DOMINIO 2: CORRESPONDENCIA GRAFEMA-FONEMA**
- Lección 1: Formar palabras (sol, mesa, libro, lápiz, pluma, salón)
- Lección 2: Selección de sílabas (pa-jarito, gui-tarra)

**DOMINIO 3: CONCIENCIA SILÁBICA Y FLUIDEZ**
- Lección 1: Identificar sílabas iniciales y finales
- Lección 2: Contar sílabas (cotorra, tortuga, ballena, gorila, elefante)
- Lección 3: Segmentar palabras

---

## 🎯 Demo 4: DRAG & DROP - "Ordena las Sílabas"

### Spanish Version (es-PR):
```typescript
{
  title: "🎨 Demo: Ordena las Sílabas",
  demo_type: "voice_builder",
  language: "es-PR",
  grade_level: 1,
  content: {
    instructions: "Usa tu voz para ordenar las sílabas.",
    target_words: [
      {
        word: "perro",
        syllables: ["pe", "rro"],
        shuffled: ["rro", "pe"],
        image_url: "/images/perro.png",
        pronunciation_help: "pe-rro"
      },
      {
        word: "gato",
        syllables: ["ga", "to"],
        shuffled: ["to", "ga"],
        image_url: "/images/gato.png",
        pronunciation_help: "ga-to"
      },
      {
        word: "mesa",
        syllables: ["me", "sa"],
        shuffled: ["sa", "me"],
        image_url: "/images/mesa.png",
        pronunciation_help: "me-sa"
      },
      {
        word: "libro",
        syllables: ["li", "bro"],
        shuffled: ["bro", "li"],
        image_url: "/images/libro.png",
        pronunciation_help: "li-bro"
      },
      {
        word: "coquí",
        syllables: ["co", "quí"],
        shuffled: ["quí", "co"],
        image_url: "/images/coqui.png",
        pronunciation_help: "co-quí"
      }
    ],
    voice_commands: {
      move_first: ["primero", "uno", "mueve primero"],
      move_second: ["segundo", "dos", "mueve segundo"],
      swap: ["cambia", "intercambia"],
      undo: ["deshacer", "atrás", "quitar"],
      help: ["ayuda", "no sé"]
    },
    practice_mode: true,
    pause_on_struggle: true
  },
  voice_guidance: "Guide student to order syllables using voice only. Accept commands like 'mueve pe primero' or 'cambia las sílabas'. Confirm each action. Provide pronunciation help. Celebrate when word is complete. Use Puerto Rican accent."
}
```

### English Version (en-US):
```typescript
{
  title: "🎨 Demo: Order the Syllables",
  language: "en-US",
  grade_level: 1,
  content: {
    instructions: "Use your voice to put the syllables in order.",
    target_words: [
      {
        word: "dog",
        syllables: ["dog"], // Single syllable
        pronunciation_help: "dawg"
      },
      {
        word: "table",
        syllables: ["ta", "ble"],
        shuffled: ["ble", "ta"],
        pronunciation_help: "tay-buhl"
      }
      // Simpler for English Grade 1
    ]
  },
  voice_guidance: "Help student order syllables with voice. Accept 'move ta first' or 'switch syllables'. Use clear American accent. Praise effort."
}
```

---

## 🎯 Demo 5: FILL BLANK - "Completa la Palabra"

### Spanish Version (es-PR):
```typescript
{
  title: "✏️ Demo: Completa la Palabra",
  demo_type: "spelling",
  language: "es-PR",
  grade_level: 1,
  content: {
    mode: "single_word",
    prompts: [
      {
        sentence: "El ___ brilla en el cielo.",
        answer: "sol",
        hint_image: "/images/sun.png",
        phonetic_hints: ["s-o-l", "/s/ /o/ /l/"],
        syllable_hint: "sol (1 sílaba)",
        initial_sound: "/s/",
        rhymes_with: "col"
      },
      {
        sentence: "El coquí canta en la ___.",
        answer: "noche",
        hint_image: "/images/night.png",
        phonetic_hints: ["no-che", "/n/ /o/ /ch/ /e/"],
        syllable_hint: "no-che (2 sílabas)",
        initial_sound: "/n/"
      },
      {
        sentence: "Mi ___ tiene cuatro patas.",
        answer: "perro",
        hint_image: "/images/dog.png",
        phonetic_hints: ["pe-rro", "/p/ /e/ /rr/ /o/"],
        syllable_hint: "pe-rro (2 sílabas)",
        initial_sound: "/p/"
      },
      {
        sentence: "Leo un ___ en la escuela.",
        answer: "libro",
        hint_image: "/images/book.png",
        phonetic_hints: ["li-bro", "/l/ /i/ /b/ /r/ /o/"],
        syllable_hint: "li-bro (2 sílabas)",
        initial_sound: "/l/"
      }
    ],
    spelling_aid: {
      say_letter_names: true,
      syllable_breaks: true,
      pronunciation_on_complete: true,
      practice_wrong_attempts: true
    }
  },
  voice_guidance: "Read sentence slowly with Puerto Rican accent. Ask student to say or spell the missing word. Guide letter by letter if needed. Pronounce each letter clearly. Break into syllables. Provide phonetic hints: 'La primera letra hace /s/ como en serpiente'. Celebrate progress. Model correct pronunciation when complete."
}
```

### English Version (en-US):
```typescript
{
  title: "✏️ Demo: Fill in the Blank",
  language: "en-US",
  grade_level: 1,
  content: {
    prompts: [
      {
        sentence: "The ___ shines in the sky.",
        answer: "sun",
        phonetic_hints: ["s-u-n", "/s/ /ŭ/ /n/"],
        syllable_hint: "sun (1 syllable)",
        initial_sound: "/s/"
      },
      {
        sentence: "My ___ has four legs.",
        answer: "dog",
        phonetic_hints: ["d-o-g", "/d/ /ŏ/ /g/"],
        syllable_hint: "dog (1 syllable)",
        initial_sound: "/d/"
      }
    ]
  },
  voice_guidance: "Read sentence with clear American accent. Help student spell word letter by letter. Pronounce each letter name. Give phonetic hints like 'The first letter makes /s/ sound'."
}
```

---

## 🎯 Demo 6: WRITE ANSWER - "Escribe tu Respuesta"

### Spanish Version (es-PR):
```typescript
{
  title: "📝 Demo: Cuéntame del Coquí",
  demo_type: "writing",
  language: "es-PR",
  grade_level: 1,
  content: {
    prompt: "¿Qué hace el coquí en la noche?",
    prompt_image: "/images/coqui_night.png",
    word_limit: 25, // Shorter for Grade 1
    evaluation_criteria: [
      "Usa palabras simples",
      "Tiene sujeto y verbo",
      "Está relacionado con el coquí"
    ],
    coaching_hints: {
      vocabulary_suggestions: true,
      sentence_starter_prompts: [
        "El coquí...",
        "En la noche, el coquí...",
        "Yo escucho al coquí..."
      ],
      question_prompts: [
        "¿Qué sonido hace el coquí?",
        "¿Dónde está el coquí?",
        "¿Qué hace el coquí?"
      ]
    },
    sample_responses: [
      "El coquí canta en la noche.",
      "El coquí dice co-quí, co-quí.",
      "El coquí vive en los árboles."
    ]
  },
  voice_guidance: "Coach creative writing gently. Ask open questions: '¿Qué hace el coquí?' '¿Qué sonido hace?' Suggest Grade 1 vocabulary. Praise specific details. Don't write for student - guide with questions. Accept short sentences (5-7 words). Model correct grammar gently. Use Puerto Rican accent."
}
```

### English Version (en-US):
```typescript
{
  title: "📝 Demo: Tell Me About the Coquí",
  language: "en-US",
  grade_level: 1,
  content: {
    prompt: "What does the coquí do at night?",
    sentence_starter_prompts: [
      "The coquí...",
      "At night, the coquí...",
      "I hear the coquí..."
    ],
    sample_responses: [
      "The coquí sings at night.",
      "The coquí says co-kee, co-kee.",
      "The coquí lives in trees."
    ]
  },
  voice_guidance: "Help student compose simple sentence. Ask guiding questions. Accept 5-7 word sentences. Praise creative thinking. Use clear American accent."
}
```

---

## 🎯 Demo 7: READFLOW - "Lectura Interactiva"

### Spanish Version (es-PR):
```typescript
{
  title: "📖 ReadFlow: El Coquí Canta",
  demo_type: "readflow",
  language: "es-PR",
  grade_level: 1,
  content: {
    passage: {
      title: "El Coquí Canta",
      text: "El coquí vive en Puerto Rico. Es un animal pequeño. El coquí canta en la noche. Dice co-quí, co-quí. El sonido es bonito. Todos en Puerto Rico aman al coquí.",
      words: [
        // Word 0
        { id: 0, text: "El", pronunciation: "el", syllables: 1, difficulty: "easy" },
        // Word 1
        { id: 1, text: "coquí", pronunciation: "co-quí", syllables: 2, difficulty: "medium" },
        // Word 2
        { id: 2, text: "vive", pronunciation: "vi-ve", syllables: 2, difficulty: "easy" },
        // Word 3
        { id: 3, text: "en", pronunciation: "en", syllables: 1, difficulty: "easy" },
        // Word 4
        { id: 4, text: "Puerto", pronunciation: "Puer-to", syllables: 2, difficulty: "easy" },
        // Word 5
        { id: 5, text: "Rico", pronunciation: "Ri-co", syllables: 2, difficulty: "easy" },
        // Word 6
        { id: 6, text: "Es", pronunciation: "es", syllables: 1, difficulty: "easy" },
        // Word 7
        { id: 7, text: "un", pronunciation: "un", syllables: 1, difficulty: "easy" },
        // Word 8
        { id: 8, text: "animal", pronunciation: "a-ni-mal", syllables: 3, difficulty: "medium" },
        // Word 9
        { id: 9, text: "pequeño", pronunciation: "pe-que-ño", syllables: 3, difficulty: "medium" },
        // Continue for all 40 words...
      ],
      target_wcpm: 40, // Grade 1 target: 40-60 WCPM
      min_accuracy: 0.85,
      total_words: 40
    },
    reading_assistance: {
      word_highlighting: true,
      auto_scroll: true,
      pronunciation_hints: true,
      pace_feedback: true,
      practice_problematic_words: true,
      pause_on_struggle: true
    },
    feedback_types: [
      "pronunciation_error",
      "skipped_word",
      "repeated_word",
      "pace_too_slow" // Not "too fast" for Grade 1
    ],
    teacher_settings: {
      tolerance: "medium", // low/medium/high
      feedback_style: "encouraging", // brief/detailed/encouraging
      session_length_minutes: 5 // 5/10/15
    }
  },
  voice_guidance: "Listen carefully as student reads passage aloud. Track each word spoken. Highlight current word in real-time. Provide immediate, gentle pronunciation correction for errors. Model correct pronunciation syllable by syllable. Encourage fluency and expression. Pause and practice problematic words before continuing. Calculate WCPM at end. Celebrate progress. Use Puerto Rican accent."
}
```

### English Version (en-US):
```typescript
{
  title: "📖 ReadFlow: The Coquí Sings",
  language: "en-US",
  grade_level: 1,
  content: {
    passage: {
      title: "The Coquí Sings",
      text: "The coquí lives in Puerto Rico. It is a small animal. The coquí sings at night. It says co-kee, co-kee. The sound is pretty. Everyone in Puerto Rico loves the coquí.",
      words: [
        { id: 0, text: "The", pronunciation: "thuh", syllables: 1, difficulty: "easy" },
        { id: 1, text: "coquí", pronunciation: "co-KEE", syllables: 2, difficulty: "medium" },
        // Continue for all words...
      ],
      target_wcpm: 45, // Slightly higher for English Grade 1
      min_accuracy: 0.85
    }
  },
  voice_guidance: "Listen as student reads. Highlight words in real-time. Help with pronunciation using clear American accent. Explain what a coquí is. Encourage smooth reading."
}
```

---

## 📊 Teacher Settings Configuration

### Configurable Parameters
```typescript
interface TeacherSettings {
  // Per-demo or global
  tolerance_level: "low" | "medium" | "high";
  feedback_style: "brief" | "detailed" | "encouraging";
  session_length_minutes: 5 | 10 | 15;
  auto_practice_errors: boolean;
  pause_on_struggle: boolean;
  celebration_frequency: "every" | "milestone" | "completion";
  pronunciation_strictness: 0.70 | 0.80 | 0.90; // Confidence threshold
}

// Default for Grade 1
const GRADE1_DEFAULTS: TeacherSettings = {
  tolerance_level: "medium",
  feedback_style: "encouraging",
  session_length_minutes: 10,
  auto_practice_errors: true,
  pause_on_struggle: true,
  celebration_frequency: "milestone",
  pronunciation_strictness: 0.70 // Lower for beginners
};
```

### Teacher Dashboard Settings UI
```typescript
// Component: src/components/demo/TeacherDemoSettings.tsx
<Card>
  <h3>Demo Settings - Grade 1</h3>

  <FormField>
    <Label>Pronunciation Tolerance</Label>
    <RadioGroup>
      <Radio value="low">Strict (90% accuracy required)</Radio>
      <Radio value="medium" checked>Balanced (80% accuracy) ✓ Recommended</Radio>
      <Radio value="high">Lenient (70% accuracy)</Radio>
    </RadioGroup>
  </FormField>

  <FormField>
    <Label>Feedback Style</Label>
    <Select>
      <Option value="brief">Brief (Quick feedback)</Option>
      <Option value="detailed">Detailed (Explain errors)</Option>
      <Option value="encouraging" selected>Encouraging (Positive focus) ✓</Option>
    </Select>
  </FormField>

  <FormField>
    <Label>Session Length</Label>
    <RadioGroup>
      <Radio value="5">5 minutes</Radio>
      <Radio value="10" checked>10 minutes ✓</Radio>
      <Radio value="15">15 minutes</Radio>
    </RadioGroup>
  </FormField>

  <FormField>
    <Label>Learning Support</Label>
    <Checkbox checked>Auto-practice difficult words</Checkbox>
    <Checkbox checked>Pause when student struggles</Checkbox>
    <Checkbox>Show visual hints (images)</Checkbox>
  </FormField>
</Card>
```

---

## 🔒 COPPA Compliance & Privacy

### Data Retention Policy
```typescript
interface DemoDataRetention {
  audio_recordings: {
    retention_days: 30,
    auto_delete: true,
    parent_accessible: true
  },
  transcriptions: {
    retention_days: 30,
    anonymized: true, // Remove PII
    parent_accessible: true
  },
  progress_data: {
    retention_days: 365, // 1 year
    aggregated_only: true, // No individual recordings
    parent_accessible: true
  },
  telemetry: {
    retention_days: 90,
    anonymized: true,
    aggregated_only: true
  }
}
```

### Privacy Safeguards
1. **No PII in Logs:** Student names replaced with IDs
2. **Audio Encryption:** All recordings encrypted at rest
3. **Parent Access:** Parents can view/delete child's data
4. **Age Verification:** Grade 1 = verified 6-7 years old
5. **Consent Required:** Microphone permission via Coquí mascot
6. **Data Minimization:** Only collect necessary demo data
7. **DEPR Compliance:** Aligned with Puerto Rico Department of Education policies

### Consent Flow
```typescript
// When demo starts first time
<MicrophonePermissionModal>
  <CoquíMascot animated />
  <h2>¡Hola! Soy Coquí</h2>
  <p>Necesito usar tu micrófono para escucharte leer.</p>
  <p>¿Me das permiso?</p>

  <InfoBox>
    <p><strong>Para padres:</strong></p>
    <ul>
      <li>Grabaciones temporales (30 días)</li>
      <li>Solo para propósito educativo</li>
      <li>Pueden ver/borrar datos en cualquier momento</li>
      <li>Cumple con COPPA y políticas del DEPR</li>
    </ul>
  </InfoBox>

  <Button primary>Sí, dale permiso a Coquí</Button>
  <Button secondary>No ahora</Button>
</MicrophonePermissionModal>
```

---

## 📈 Telemetry & Analytics

### Metrics to Track
```typescript
interface DemoTelemetry {
  // Usage metrics
  total_sessions: number;
  unique_students: number;
  avg_session_duration_seconds: number;
  completion_rate: number; // Percentage who finish

  // Performance metrics (per demo type)
  pronunciation_accuracy_avg: number;
  wcpm_avg: number; // ReadFlow only
  correct_answers_rate: number;

  // Engagement metrics
  retry_rate: number; // Students trying again
  practice_mode_usage: number;
  help_requests: number;

  // Technical metrics
  api_latency_ms: number;
  error_rate: number;
  reconnection_count: number;

  // Cost tracking
  total_api_cost_cents: number;
  cost_per_session_cents: number;

  // Effectiveness
  student_satisfaction: number; // 1-5 rating at end
  teacher_feedback_score: number;
}
```

### Dashboard for Admins
```typescript
// Component: src/components/admin/DemoAnalyticsDashboard.tsx
<DemoAnalytics>
  <MetricCard>
    <h3>Total Demo Sessions</h3>
    <BigNumber>247</BigNumber>
    <Trend up>+12% this week</Trend>
  </MetricCard>

  <MetricCard>
    <h3>Completion Rate</h3>
    <BigNumber>87%</BigNumber>
    <ProgressBar value={87} />
  </MetricCard>

  <MetricCard>
    <h3>Average WCPM (ReadFlow)</h3>
    <BigNumber>42</BigNumber>
    <Subtitle>Target: 40 (Grade 1)</Subtitle>
  </MetricCard>

  <Chart type="line" title="Demo Usage Over Time" />
  <Chart type="bar" title="Completion Rate by Demo Type" />
  <Table title="Most Practiced Words" />
</DemoAnalytics>
```

---

## 🚀 Phased Rollout Strategy

### Phase 1: Single Demo Validation (Week 1)
- **Deploy:** ReadFlow only
- **Users:** Internal testing + 5 pilot students
- **Duration:** 3 days
- **Success Criteria:**
  - Zero critical bugs
  - Completion rate >80%
  - WCPM accuracy >90%
  - Student satisfaction >4.0/5

### Phase 2: Core Demos (Week 2)
- **Deploy:** Multiple Choice + Lesson
- **Users:** 20 Grade 1 students
- **Duration:** 5 days
- **Validation:** Same criteria as Phase 1

### Phase 3: Remaining Demos (Week 3)
- **Deploy:** True/False, Drag & Drop, Fill Blank, Write Answer
- **Users:** 50 Grade 1 students
- **Duration:** 7 days
- **Full Production:** If all metrics pass

### Rollback Plan
```typescript
// If critical issues found
interface RollbackTriggers {
  error_rate_above: 0.05, // 5% errors = rollback
  completion_rate_below: 0.70, // 70% = investigate
  api_latency_above_ms: 2000, // 2 seconds = rollback
  student_satisfaction_below: 3.0 // 3/5 = pause
}
```

---

## 📝 Production Checklist

### Before Launch
- [ ] All 7 demos tested with real Grade 1 students
- [ ] Both languages (es-PR, en-US) validated by native speakers
- [ ] Pronunciation accuracy >85% on test dataset
- [ ] COPPA compliance reviewed by legal
- [ ] Parent consent flow tested
- [ ] Teacher settings functional
- [ ] Telemetry dashboard operational
- [ ] Database migrations applied
- [ ] Audio storage configured (30-day retention)
- [ ] Error monitoring setup (Sentry/LogRocket)
- [ ] Load testing completed (10 concurrent users)
- [ ] Mobile responsiveness verified (iOS/Android)
- [ ] Microphone permission flow tested
- [ ] Coquí mascot integration working
- [ ] Content reviewed by DEPR curriculum specialist

---

**Document Status:** ✅ COMPLETE - Grade 1 Content Specifications
**Next:** Integrate these specs into implementation files
**Owner:** Development Team + Curriculum Specialist
**Review Date:** Before each phase deployment
