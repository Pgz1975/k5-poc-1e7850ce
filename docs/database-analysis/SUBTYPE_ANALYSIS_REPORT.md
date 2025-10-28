# Manual Assessments - Complete Subtype Analysis

**Generated:** October 28, 2025
**Database:** meertwtenhlmnlpwxhyz.supabase.co
**Total Records:** 495

---

## Executive Summary

The `manual_assessments` table contains **495 records** with **6 unique subtypes** distributed across 3 primary types (exercise, lesson, assessment).

### Key Findings:
- **54.5%** Multiple Choice activities (dominant subtype)
- **22.0%** Lesson subtypes (second most common)
- **77.8%** Exercise type activities
- **80.6%** Complete activities with both questions and answers
- **Recent Growth:** 495 assessments created in the last 7 days

---

## Complete List of ALL Unique Subtypes

### Found: **6 Unique Subtypes**

| # | Subtype | Count | Percentage | Description |
|---|---------|-------|------------|-------------|
| 1 | **multiple_choice** | 270 | 54.5% | Select the correct answer from multiple options |
| 2 | **lesson** | 109 | 22.0% | Lesson-type content (auto-selected for lesson type) |
| 3 | **drag_drop** | 50 | 10.1% | Drag elements to answer questions |
| 4 | **true_false** | 29 | 5.9% | Answer true or false questions |
| 5 | **fill_blank** | 28 | 5.7% | Drag letters to form words/fill blanks |
| 6 | **write_answer** | 9 | 1.8% | Write the correct word/answer |

---

## Subtype Distribution by Type

### 1. **Exercise Type** (385 records - 77.8%)

| Subtype | Count | % of Exercises |
|---------|-------|----------------|
| multiple_choice | 270 | 70.1% |
| drag_drop | 50 | 13.0% |
| true_false | 29 | 7.5% |
| fill_blank | 28 | 7.3% |
| write_answer | 9 | 2.3% |

### 2. **Lesson Type** (109 records - 22.0%)

| Subtype | Count | % of Lessons |
|---------|-------|--------------|
| lesson | 109 | 100% |

**Note:** Lessons have only one subtype, which is auto-selected.

### 3. **Assessment Type** (1 record - 0.2%)

| Subtype | Count |
|---------|-------|
| Not specified | 1 |

---

## Detailed Subtype Descriptions

### 1. **multiple_choice** (270 activities)
- **Spanish:** Opción Múltiple
- **Icon:** ListChecks
- **User Action:** Select the correct answer from options
- **Content Structure:**
  - `question`: Text question
  - `answers`: Array of answer options
  - Optional `questionImage`: Image URL
  - Optional `imageUrl` in answers

**Example Content:**
```json
{
  "question": "Cada lunes, en el patio, cantamos La Borinqueña...",
  "answers": [
    { "text": "Option 1", "isCorrect": true },
    { "text": "Option 2", "isCorrect": false }
  ]
}
```

### 2. **lesson** (109 activities)
- **Spanish:** Lección
- **Auto-selected:** Yes (only option for lesson type)
- **User Action:** View lesson content
- **Content Structure:**
  - `question`: Lesson content/description
  - `answers`: Supporting information
  - Objectives and learning goals

**Example Content:**
```json
{
  "question": "Objetivo: Identificar tradiciones, costumbres o valores...",
  "answers": [...]
}
```

### 3. **drag_drop** (50 activities)
- **Spanish:** Arrastrar y Soltar
- **Icon:** Move
- **User Action:** Drag elements to answer
- **Content Structure:**
  - Interactive drag-and-drop components
  - Source and target areas

### 4. **true_false** (29 activities)
- **Spanish:** Verdadero/Falso
- **Icon:** CheckCircle2
- **User Action:** Answer true or false
- **Content Structure:**
  - `question`: Statement to evaluate
  - `answers`: True/False options with correct answer marked

**Example Content:**
```json
{
  "question": "En las tardes de verano, mi abuelo tocaba el barril...",
  "answers": [
    { "text": "Verdadero", "isCorrect": true },
    { "text": "Falso", "isCorrect": false }
  ]
}
```

### 5. **fill_blank** (28 activities)
- **Spanish:** Completar Espacios
- **Icon:** HelpCircle
- **User Action:** Drag letters to form words
- **Content Structure:**
  - Text with blanks
  - Letter/word options to fill gaps

### 6. **write_answer** (9 activities)
- **Spanish:** Escribir Respuesta
- **Icon:** PenLine
- **User Action:** Type the correct word/answer
- **Content Structure:**
  - `question`: Prompt for written response
  - Expected answer for validation

---

## Content Quality Metrics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Assessments** | 495 | 100% |
| With Images | 130 | 26.3% |
| With Questions | 456 | 92.1% |
| With Answers | 401 | 81.0% |
| **Complete (Q+A)** | 399 | **80.6%** |

---

## Type Distribution

| Type | Count | Percentage | Primary Subtypes |
|------|-------|------------|------------------|
| **exercise** | 385 | 77.8% | multiple_choice, drag_drop, true_false, fill_blank, write_answer |
| **lesson** | 109 | 22.0% | lesson |
| **assessment** | 1 | 0.2% | N/A |

---

## Recent Activity (Last 7 Days)

| Date | Assessments Created |
|------|---------------------|
| 10/28/2025 | 82 |
| 10/27/2025 | 101 |
| 10/26/2025 | 40 |
| 10/25/2025 | 135 |
| 10/24/2025 | 73 |
| 10/23/2025 | 43 |
| 10/22/2025 | 18 |
| 10/21/2025 | 3 |
| **Total** | **495** |

---

## Database Schema Reference

### Table: `manual_assessments`

**Key Fields:**
- `id` - Primary key
- `type` - Type of content (lesson, exercise, assessment)
- `subtype` - Specific activity format (see list above)
- `content` - JSON content with question and answers
- `title` - Activity title
- `grade_level` - Target grade
- `language` - Content language
- `enable_voice` - Voice interaction support
- `estimated_duration_minutes` - Expected completion time
- `parent_assessment_id` - For hierarchical relationships
- `created_at` - Timestamp

---

## Implementation Notes

### SubtypeSelector Component Location
`/src/components/ManualAssessment/SubtypeSelector.tsx`

### Subtype Configuration

```typescript
const subtypes = [
  {
    id: 'multiple_choice',
    icon: ListChecks,
    titleEs: 'Opción Múltiple',
    titleEn: 'Multiple Choice',
  },
  {
    id: 'true_false',
    icon: CheckCircle2,
    titleEs: 'Verdadero/Falso',
    titleEn: 'True/False',
  },
  {
    id: 'fill_blank',
    icon: HelpCircle,
    titleEs: 'Completar Espacios',
    titleEn: 'Fill in the Blank',
  },
  {
    id: 'write_answer',
    icon: PenLine,
    titleEs: 'Escribir Respuesta',
    titleEn: 'Write Answer',
  },
  {
    id: 'drag_drop',
    icon: Move,
    titleEs: 'Arrastrar y Soltar',
    titleEn: 'Drag and Drop',
  }
];
```

---

## Recommendations

### Usage Patterns:
1. **Multiple Choice** (54.5%) - Most popular format, works well for comprehension
2. **Lessons** (22.0%) - Essential for introducing concepts
3. **Drag Drop** (10.1%) - Interactive engagement
4. **True/False** (5.9%) - Quick assessment format
5. **Fill Blank** (5.7%) - Word formation and vocabulary
6. **Write Answer** (1.8%) - Free-form response (least used)

### Potential Additions:
- **Matching** - Pair items from two lists
- **Ordering/Sequencing** - Arrange items in correct order
- **Audio Response** - Voice-based answers
- **Drawing/Annotation** - Visual responses
- **Math Input** - Specialized for equations

---

## Database Connection Details

```typescript
SUPABASE_URL: "https://meertwtenhlmnlpwxhyz.supabase.co"
SUPABASE_KEY: (Publishable/Anon key)

// Authentication for full access:
Admin Email: admin@demo.com
Admin Password: demo1234
```

---

## Analysis Scripts

### Available Scripts:
1. `/scripts/analyze-manual-assessments.mjs` - Comprehensive analysis
2. `/scripts/extract-assessment-content.js` - Content extraction
3. `/scripts/database-analysis/analyze-subtypes.js` - This analysis tool

### Running Analysis:
```bash
node scripts/analyze-manual-assessments.mjs
```

---

## Appendix: Sample Activities

### Sample Multiple Choice:
```json
{
  "id": "...",
  "title": "La bandera de mi escuela (símbolos y orgullo nacional)",
  "type": "exercise",
  "subtype": "multiple_choice",
  "content": {
    "question": "Cada lunes, en el patio, cantamos La Borinqueña...",
    "answers": [...]
  },
  "grade_level": 1,
  "language": "es"
}
```

### Sample True/False:
```json
{
  "id": "...",
  "title": "El tambor del abuelo (identidad y raíces)",
  "type": "exercise",
  "subtype": "true_false",
  "content": {
    "question": "En las tardes de verano, mi abuelo tocaba el barril...",
    "answers": [
      { "text": "Verdadero", "isCorrect": true },
      { "text": "Falso", "isCorrect": false }
    ]
  }
}
```

### Sample Lesson:
```json
{
  "id": "...",
  "title": "Parte 2: Conexión personal y análisis cultural",
  "type": "lesson",
  "subtype": "lesson",
  "content": {
    "question": "Objetivo: Relacionar temas culturales con experiencias...",
    "answers": []
  }
}
```

---

## Conclusion

The `manual_assessments` table contains **6 distinct subtypes** with clear usage patterns:
- **Assessment exercises** dominate (77.8%) with multiple_choice being the most popular
- **Lesson content** comprises 22% of the database
- High content quality with 80.6% completion rate
- Active development with 495 new items in the past week

**All Subtypes Found:**
1. multiple_choice
2. lesson
3. drag_drop
4. true_false
5. fill_blank
6. write_answer

---

*Report generated using Node.js analysis script with Supabase JS Client v2.39.0*
