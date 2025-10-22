# Manual Content Creation Updates Specification - SIMPLIFIED POC VERSION
## Based on Kinder_Ani.md Requirements and OpenAI Realtime Voice Integration

---

## Executive Summary

This document outlines the **simplified, implementable-in-hours** updates to the manual content creation process to support Coquí-themed lessons following Kinder_Ani.md patterns, with full OpenAI Realtime Voice autonomy.

---

## 1. Database Schema Updates - SIMPLIFIED

### 1.1 Minimal Column Additions (Required Changes Only)

```sql
-- Add only essential columns to manual_assessments table
ALTER TABLE manual_assessments ADD COLUMN IF NOT EXISTS
  activity_template TEXT, -- Template type: 'coqui_escucha', 'coqui_encuentra', etc.
  coqui_dialogue TEXT, -- What Coquí says throughout the activity
  pronunciation_words TEXT[], -- Words to practice pronunciation
  max_attempts INTEGER DEFAULT 3; -- Adaptive based on performance

-- NO NEW TABLES NEEDED FOR POC
```

### 1.2 Tracking Table for Voice Results

```sql
-- Simple table to store pronunciation assessment results
CREATE TABLE IF NOT EXISTS voice_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES manual_assessments(id),
  student_id UUID REFERENCES auth.users(id),
  word_practiced TEXT,
  pronunciation_score INTEGER CHECK (pronunciation_score BETWEEN 1 AND 5), -- 1-5 stars
  attempts INTEGER,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Content Creation Interface Updates - SIMPLE FORM

### 2.1 New Fields for CreateAssessment.tsx

#### Template Selection (Dropdown)
1. **"Coquí escucha y habla"** - Listen and speak with Coquí
2. **"Coquí encuentra el sonido"** - Coquí finds the sound
3. **"Coquí une los sonidos"** - Connect sounds with Coquí
4. **"Rima con Coquí"** - Rhyme with Coquí
5. **"Las vocales de Coquí"** - Coquí's vowels

#### Simple Form Fields

```typescript
// Simplified form structure
interface SimplifiedAssessmentForm {
  // Basic
  activity_template: string; // Dropdown selection
  title: string;

  // Coquí's dialogue (simple textarea with section markers)
  coqui_dialogue: string; // "SECTION 1: Hola...\nSECTION 2: Ahora..."

  // Words to practice (one per line in textarea)
  pronunciation_words: string; // "sol\nsapo\nserpiente"

  // Existing fields remain unchanged
  content: {
    question: string;
    answers: Answer[];
  };
}
```

#### How Sections Work (Simple)
```
Teacher enters in voice_guidance field:
"SECTION 1: ¡Hola! Soy Coquí. Vamos a practicar el sonido /s/.
SECTION 2: Escucha y repite: sol, sapo.
SECTION 3: ¡Muy bien! Lo hiciste excelente."

This correlates with content.answers array by index:
- SECTION 1 = Introduction (before answers)
- SECTION 2 = content.answers[0]
- SECTION 3 = content.answers[1] etc.
```

---

## 3. OpenAI Realtime Voice API Integration - FULL AUTONOMY

### 3.1 Updated System Instructions for Coquí

```typescript
// Enhancement to existing edge function (line 165)
const enhancedInstructions = `
${existingInstructions}

PRONUNCIATION ASSESSMENT:
8. Evalúa la pronunciación en escala de 1-5 estrellas
9. 5 estrellas = pronunciación perfecta con acento puertorriqueño natural
10. 3 estrellas = comprensible pero necesita práctica
11. SIEMPRE da al menos 1 estrella por el intento
12. Ajusta automáticamente el número de intentos:
    - Si obtiene 4-5 estrellas: continúa al siguiente
    - Si obtiene 2-3 estrellas: permite 1-2 intentos más
    - Si obtiene 1 estrella: da hasta 3 intentos con más apoyo

ACTIVITY GUIDANCE:
- Lee las secciones marcadas como SECTION 1, SECTION 2, etc.
- Correlaciona cada sección con el contenido correspondiente
- Mantén el tono de Coquí amigable y alentador siempre
`;
```

### 3.2 OpenAI Handles Everything

OpenAI Realtime will autonomously:
1. **Generate** correct pronunciations dynamically
2. **Evaluate** student responses without external references
3. **Return** pronunciation score (1-5 stars) in response
4. **Adapt** difficulty based on performance
5. **Provide** contextual feedback in Coquí's voice

### 3.3 Visual Display and Storage

```typescript
// When OpenAI returns a score:
const handlePronunciationResult = async (score: number, word: string) => {
  // 1. DISPLAY stars visually in UI
  showStarsInUI(score); // ⭐⭐⭐⭐☆ appears on screen

  // 2. SAVE to database for tracking
  await supabase.from('voice_assessment_results').insert({
    assessment_id: currentAssessmentId,
    student_id: userId,
    word_practiced: word,
    pronunciation_score: score, // 1-5 stars
    attempts: attemptNumber,
    duration_seconds: elapsedTime
  });

  // 3. UPDATE UI with encouragement
  showEncouragement(score); // "¡Muy bien!" text appears
  animateCoqui(score); // Coquí reacts happily
};
```

**Student sees on screen:**
- ⭐⭐⭐⭐☆ (visual stars)
- "¡Muy bien!" (encouragement text)
- Coquí animation (happy/encouraging)
- Progress bar updates

**Data stored for teachers:**
- Each attempt with score
- Average scores per word
- Progress over time
- All tracked in `voice_assessment_results` table

---

## 4. Simplified Activity Templates (Pre-filled Forms)

### 4.1 Template: "Coquí escucha y habla"

When teacher selects this template, form auto-fills:
```
Title: Practica el sonido [___]
Coquí Dialogue:
"SECTION 1: ¡Hola! Soy Coquí. Hoy vamos a practicar el sonido [___].
SECTION 2: Escucha y repite después de mí.
SECTION 3: ¡Qué bien lo haces! Sigamos practicando."

Words to Practice: [Teacher adds words, one per line]
```

### 4.2 Template: "Las vocales de Coquí"

Auto-fills with:
```
Title: Las vocales con Coquí
Coquí Dialogue:
"SECTION 1: ¡Hola amiguito! Soy Coquí y hoy aprenderemos las vocales.
SECTION 2: Escucha cada vocal: a, e, i, o, u.
SECTION 3: ¡Excelente! Las vocales son muy importantes para leer."

Words to Practice:
árbol
estrella
iglesia
oso
uva
```

---

## 5. Implementation Steps (2-3 Hours)

### Step 1: Database Migration (30 minutes)
```sql
-- Run this migration
ALTER TABLE manual_assessments ADD COLUMN IF NOT EXISTS
  activity_template TEXT,
  coqui_dialogue TEXT,
  pronunciation_words TEXT[],
  max_attempts INTEGER DEFAULT 3;

CREATE TABLE IF NOT EXISTS voice_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES manual_assessments(id),
  student_id UUID REFERENCES auth.users(id),
  word_practiced TEXT,
  pronunciation_score INTEGER CHECK (pronunciation_score BETWEEN 1 AND 5),
  attempts INTEGER,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Update CreateAssessment.tsx (1 hour)
1. Add template dropdown with 5 Coquí options
2. Add Coquí dialogue textarea
3. Add pronunciation words textarea
4. Auto-fill form when template selected
5. Use existing ImagePasteZone component

### Step 3: Update Edge Function (30 minutes)
Add pronunciation evaluation instructions to line 165 in realtime-voice-relay/index.ts

### Step 4: Simple UI with Existing Components (30 minutes)
- Use existing CoquiMascot component for visual
- Simple CSS animations (bounce, fade)
- No complex drag-drop needed for POC

---

## 6. Simplified UI Mock-up

### 6.1 Teacher's View (CreateAssessment.tsx)

```
┌──────────────────────────────────────┐
│ Crear Actividad con Coquí 🐸         │
├──────────────────────────────────────┤
│ Tipo de Actividad:                   │
│ [▼ Selecciona...                  ]  │
│   • Coquí escucha y habla           │
│   • Coquí encuentra el sonido       │
│   • Coquí une los sonidos           │
│   • Rima con Coquí                  │
│   • Las vocales de Coquí            │
│                                      │
│ Título: [_____________________]     │
│                                      │
│ Diálogo de Coquí:                    │
│ ┌──────────────────────────────┐    │
│ │SECTION 1: ¡Hola! Soy Coquí... │    │
│ │SECTION 2: Escucha y repite... │    │
│ │SECTION 3: ¡Muy bien!...       │    │
│ └──────────────────────────────┘    │
│                                      │
│ Palabras para Practicar:             │
│ ┌──────────────────────────────┐    │
│ │sol                            │    │
│ │sapo                           │    │
│ │serpiente                      │    │
│ └──────────────────────────────┘    │
│                                      │
│ [Pegar Imagen] [Guardar Actividad]   │
└──────────────────────────────────────┘
```

### 6.2 No New Components Needed
- Use existing components
- Templates auto-fill the form
- Simple textareas for input
- Existing image paste functionality

---

## 7. Simple Progress Tracking

### 7.1 Data to Track (Stored in Database)
```typescript
// Stored in voice_assessment_results table
interface VoiceTracking {
  assessment_id: UUID;        // Which activity
  student_id: UUID;          // Which student
  word_practiced: string;    // What word they practiced
  pronunciation_score: number; // 1-5 stars from OpenAI
  attempts: number;          // How many tries
  duration_seconds: number;  // Time spent
  created_at: Date;         // When it happened
}
```

### 7.2 Teacher Dashboard Shows (From Database)
- **Visual star display** for each student (⭐⭐⭐⭐☆)
- **Words practiced today** with scores
- **Average pronunciation score** (class and individual)
- **Time spent practicing** per session
- **Progress graph** showing improvement over time
- **All data pulled from `voice_assessment_results` table**

---

## 8. Quick Testing Checklist

### Before POC Demo
- [ ] Template dropdown works
- [ ] Coquí dialogue saves correctly
- [ ] OpenAI reads sections in order
- [ ] Pronunciation scoring returns 1-5 stars
- [ ] Results save to database
- [ ] CoquiMascot appears on screen

---

## 9. Summary of Changes

### What We're Adding (Simple)
1. **4 database columns** (template, dialogue, words, attempts)
2. **1 tracking table** (voice_assessment_results)
3. **3 form fields** (template dropdown, Coquí dialogue, words)
4. **5 activity templates** (all Coquí-themed)
5. **Star rating system** (1-5 stars for pronunciation)

### What We're NOT Adding (Too Complex)
- ❌ Reference audio storage
- ❌ Complex drag-and-drop
- ❌ Visual flow designers
- ❌ Custom animations
- ❌ Multi-step workflows
- ❌ Complex tracking

### Using What We Have
- ✅ Existing CoquiMascot component
- ✅ Existing ImagePasteZone
- ✅ Existing OpenAI integration
- ✅ Existing voice_guidance field (repurposed)
- ✅ Simple CSS for animations

---

## Conclusion

This simplified approach delivers Coquí-themed, voice-enabled activities following Kinder_Ani patterns while being implementable in 2-3 hours. OpenAI handles all pronunciation evaluation autonomously, teachers get simple forms with templates, and students interact with Coquí throughout their learning journey.