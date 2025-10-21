# Data Flow Diagram
## PDF Parsing to Courses & Assessments Pipeline

**Version:** 1.0
**Last Updated:** October 21, 2025

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Complete Data Flow](#complete-data-flow)
3. [Database Entity Relationships](#database-entity-relationships)
4. [API Data Flows](#api-data-flows)
5. [Real-Time Event Streams](#real-time-event-streams)
6. [Data Transformation Stages](#data-transformation-stages)

---

## System Overview

The K5 Learning Platform data flow encompasses:
- PDF upload and parsing
- Course generation from parsed content
- Assessment creation and administration
- Student progress tracking
- Parent/teacher analytics

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Student  │  │ Teacher  │  │  Parent  │  │  Admin   │   │
│  │   App    │  │ Dashboard│  │  Portal  │  │  Panel   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼────────────┼──────────────┼─────────────┼──────────┘
        │            │              │             │
        ▼            ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE API LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Edge Functions (Serverless)                │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐   │  │
│  │  │ Course  │ │Assessment│ │  Voice  │ │Analytics │   │  │
│  │  │Generator│ │  Engine  │ │Processor│ │  Engine  │   │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        PostgreSQL Database (with RLS)                 │  │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ PDFs   │ │Courses │ │Assessments│ │ Progress │    │  │
│  │  └────────┘ └────────┘ └──────────┘ └──────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Realtime Subscriptions                      │  │
│  │  (Progress updates, Assessment events, Notifications) │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
        │                                            │
        ▼                                            ▼
┌──────────────┐                            ┌──────────────┐
│  External    │                            │   Storage    │
│  Services    │                            │   (Audio,    │
│  (AssemblyAI,│                            │   Images)    │
│  Anthropic)  │                            │              │
└──────────────┘                            └──────────────┘
```

---

## Complete Data Flow

### Stage 1: PDF Upload & Parsing

```
┌──────────────┐
│   Teacher    │
│  Uploads PDF │
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│  Supabase Storage          │
│  - Store PDF file          │
│  - Generate public URL     │
└──────┬─────────────────────┘
       │
       │ Webhook trigger
       ▼
┌────────────────────────────────────────┐
│  Edge Function: parse-pdf              │
│  - Extract text (bilingual)            │
│  - Process images (AI descriptions)    │
│  - Generate vocabulary terms           │
│  - Auto-create assessment questions    │
│  - Calculate complexity metrics        │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Database: pdf_documents               │
│  pdf_extractions                       │
│  pdf_images                            │
│  pdf_questions                         │
│  vocabulary_terms                      │
└──────┬─────────────────────────────────┘
       │
       │ Status = 'completed'
       ▼
┌────────────────────────────────────────┐
│  Trigger: notify_pdf_completion()      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Edge Function:                        │
│  process-pdf-completion                │
└────────────────────────────────────────┘
```

**Data Transformations:**

```typescript
// Input: Raw PDF file
interface PDFUpload {
  file: File;
  gradeLevel: string;
  uploadedBy: string; // Teacher ID
}

// Output: Parsed PDF data
interface ParsedPDF {
  id: string;
  title: string;
  extractions: Array<{
    page_number: number;
    text_es: string;
    text_en: string;
    confidence: number;
  }>;
  images: Array<{
    id: string;
    page_number: number;
    description_es: string;
    description_en: string;
    educational_relevance: number;
    image_url: string;
  }>;
  questions: Array<{
    question_es: string;
    question_en: string;
    options: string[];
    correct_answer: string;
  }>;
  vocabulary: Array<{
    term_es: string;
    term_en: string;
    definition_es: string;
    definition_en: string;
  }>;
  complexity_metrics: {
    grade_level: number;
    lexile_measure: number;
    vocabulary_complexity: number;
  };
}
```

---

### Stage 2: Course Generation

```
┌────────────────────────────────────────┐
│  Edge Function: generate-course        │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  1. Fetch PDF parsing results          │
│     FROM pdf_documents                 │
│     JOIN pdf_extractions               │
│     JOIN pdf_images                    │
│     JOIN vocabulary_terms              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  2. CourseGenerator.createFromPDF()    │
│     - Analyze content structure        │
│     - Chunk into modules               │
│     - Extract learning objectives      │
│     - Calculate complexity             │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  3. CulturalAdapter.adapt()            │
│     - Add Puerto Rican examples        │
│     - Localize vocabulary              │
│     - Insert cultural references       │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  4. QualityValidator.validate()        │
│     - Check bilingual accuracy ≥95%    │
│     - Verify cultural relevance        │
│     - Confirm complexity match         │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  5. Save to database                   │
│     INSERT INTO courses                │
│     INSERT INTO course_modules         │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  6. Notify teacher                     │
│     Edge Function: send-notification   │
└────────────────────────────────────────┘
```

**Data Transformations:**

```typescript
// Input: PDF parsing results
interface PDFParsingResults {
  pdfId: string;
  extractions: TextExtraction[];
  images: ImageData[];
  vocabulary: VocabularyTerm[];
}

// Intermediate: Course structure
interface CourseStructure {
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  complexity_score: number;
  modules: ModuleStructure[];
}

// Output: Saved course
interface SavedCourse {
  courseId: string;
  moduleCount: number;
  status: 'draft' | 'published';
  requiresReview: boolean;
}
```

---

### Stage 3: Assessment Generation

```
┌────────────────────────────────────────┐
│  Edge Function: generate-assessment    │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  1. Fetch course content               │
│     FROM courses                       │
│     JOIN course_modules                │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  2. AssessmentGenerator.create()       │
│     - Define assessment structure      │
│     - Select standards to cover        │
│     - Set question distribution        │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  3. Generate questions using AI        │
│     - Literal comprehension Qs         │
│     - Inferential comprehension Qs     │
│     - Vocabulary questions             │
│     - Bilingual question pairs         │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  4. Calibrate IRT parameters           │
│     - Estimate difficulty (b)          │
│     - Estimate discrimination (a)      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  5. Validate bilingual quality         │
│     - Check translations               │
│     - Verify option count              │
│     - Confirm correct answers          │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  6. Save to database                   │
│     INSERT INTO assessments            │
│     INSERT INTO assessment_questions   │
└────────────────────────────────────────┘
```

**Data Transformations:**

```typescript
// Input: Course data
interface CourseData {
  courseId: string;
  gradeLevel: string;
  modules: Array<{
    content_blocks: ContentBlock[];
    learning_objectives: LearningObjective[];
  }>;
}

// Intermediate: Generated questions
interface GeneratedQuestion {
  question_text_es: string;
  question_text_en: string;
  options: QuestionOption[];
  correct_answer: string;
  standard_code: string;
  cognitive_level: 'literal' | 'inferential' | 'evaluative';
  estimated_difficulty: number; // 1-5
}

// Output: Saved assessment
interface SavedAssessment {
  assessmentId: string;
  questionCount: number;
  standardsCovered: string[];
  status: 'draft' | 'published';
}
```

---

### Stage 4: Student Assessment Session

```
┌────────────────────────────────────────┐
│  Student starts assessment             │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  1. Create assessment session          │
│     INSERT INTO assessment_sessions    │
│     status = 'in_progress'             │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  2. Select first question              │
│     Edge Function:                     │
│     adaptive-question-selector         │
│     - Initial theta = 0 (average)      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  3. Student answers question           │
│     POST /answer-question              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  4. Update ability estimate            │
│     - Calculate new theta using IRT    │
│     - Update standard error            │
│     - Save response to session.responses│
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  5. Check stopping criteria            │
│     - SE < 0.3?                        │
│     - Min questions reached?           │
│     - Max questions reached?           │
└──────┬─────────────────────────────────┘
       │
       ├─ Continue ──┐
       │             │
       ▼             │
┌──────────────┐    │
│ Select next  │    │
│  question    │────┘
│  (adaptive)  │
└──────────────┘
       │
       │ Stop
       ▼
┌────────────────────────────────────────┐
│  6. Complete assessment                │
│     UPDATE assessment_sessions         │
│     status = 'completed'               │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  7. Generate assessment result         │
│     INSERT INTO assessment_results     │
│     - Final score                      │
│     - Ability estimate                 │
│     - Comprehension breakdown          │
│     - Standards performance            │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  8. Update student progress            │
│     UPDATE student_progress            │
│     - Completion percentage            │
│     - Performance metrics              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  9. Realtime notification              │
│     - Student: Results available       │
│     - Parent: Assessment completed     │
│     - Teacher: Student finished        │
└────────────────────────────────────────┘
```

**Data Transformations:**

```typescript
// Input: Student answer
interface StudentAnswer {
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  timestamp: string;
}

// Intermediate: Updated ability estimate
interface AbilityUpdate {
  theta: number; // -3 to +3
  standardError: number;
  isCorrect: boolean;
  questionsAnswered: number;
}

// Output: Assessment result
interface AssessmentResult {
  resultId: string;
  scorePercentage: number;
  finalAbilityEstimate: number;
  comprehensionBreakdown: {
    literal: number;
    inferential: number;
    evaluative: number;
  };
  standardsPerformance: Record<string, number>;
  recommendations: string[];
}
```

---

### Stage 5: Voice Assessment

```
┌────────────────────────────────────────┐
│  Student records oral reading          │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  1. Upload audio to Supabase Storage   │
│     - Generate audio URL               │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  2. Edge Function:                     │
│     process-voice-assessment           │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  3. Fetch expected passage text        │
│     FROM reading_passages              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  4. Transcribe audio (AssemblyAI)      │
│     - Speech-to-text                   │
│     - Word-level timestamps            │
│     - Confidence scores                │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  5. Calculate reading metrics          │
│     - Accuracy (alignment algorithm)   │
│     - Fluency (WPM calculation)        │
│     - Prosody (timing variation)       │
│     - Identify errors (omissions, etc.)│
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  6. Generate feedback                  │
│     - Bilingual feedback               │
│     - Compare to grade benchmarks      │
│     - Personalized recommendations     │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  7. Save results                       │
│     INSERT INTO                        │
│     voice_assessment_results           │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  8. Realtime update to parent/teacher  │
└────────────────────────────────────────┘
```

**Data Transformations:**

```typescript
// Input: Audio recording
interface VoiceAssessmentInput {
  studentId: string;
  passageId: string;
  audioFile: File;
  language: 'es' | 'en';
}

// Intermediate: Transcription result
interface TranscriptionResult {
  text: string;
  words: Array<{
    text: string;
    start: number; // milliseconds
    end: number;
    confidence: number;
  }>;
  audioDuration: number; // seconds
}

// Output: Voice assessment result
interface VoiceAssessmentResult {
  resultId: string;
  accuracy: number; // 0-100
  fluencyWPM: number;
  prosodyScore: number; // 0-100
  errors: Array<{
    type: 'omission' | 'insertion' | 'substitution';
    expected: string;
    actual: string;
    position: number;
  }>;
  feedback: {
    feedback_es: string;
    feedback_en: string;
  };
}
```

---

### Stage 6: Analytics & Dashboards

```
┌────────────────────────────────────────┐
│  Parent/Teacher requests dashboard     │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  Edge Function:                        │
│  generate-progress-report              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  1. Aggregate data from multiple tables│
│     - student_progress                 │
│     - assessment_results               │
│     - voice_assessment_results         │
│     - course_modules                   │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  2. Calculate analytics                │
│     - Overall completion %             │
│     - Average scores                   │
│     - Time spent                       │
│     - Strengths/weaknesses             │
│     - Diagnostic progress (3x/year)    │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  3. Generate recommendations           │
│     - Next courses to assign           │
│     - Areas needing support            │
│     - Skill-building activities        │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│  4. Return dashboard data              │
│     JSON response to frontend          │
└────────────────────────────────────────┘
```

---

## Database Entity Relationships

### Complete Schema Diagram

```
┌─────────────────────┐
│    auth.users       │
│  (Supabase Auth)    │
│─────────────────────│
│ id (PK)             │
│ email               │
│ role                │ ──┐
│ grade_level         │   │
└─────────────────────┘   │
           │              │
           │              │
      ┌────┴────┬─────────┴─────┬──────────┬───────────┐
      │         │               │          │           │
      ▼         ▼               ▼          ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Teachers │ │ Students │ │ Parents  │ │  Admins  │ │  Staff   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘

┌──────────────────────────────────────────────────────────────┐
│                     PDF PROCESSING                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  pdf_documents      │
│─────────────────────│
│ id (PK)             │
│ title               │
│ uploaded_by (FK)    │──→ auth.users.id
│ grade_level         │
│ status              │
│ storage_path        │
│ created_at          │
└─────────────────────┘
           │
           ├──────────────┬──────────────┬───────────────┐
           │              │              │               │
           ▼              ▼              ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐
│pdf_extractions│ │ pdf_images   │ │pdf_questions │ │vocabulary   │
│──────────────│ │──────────────│ │──────────────│ │_terms       │
│ id (PK)      │ │ id (PK)      │ │ id (PK)      │ │─────────────│
│ pdf_id (FK)  │ │ pdf_id (FK)  │ │ pdf_id (FK)  │ │ id (PK)     │
│ page_number  │ │ page_number  │ │ question_es  │ │ pdf_id (FK) │
│ text_es      │ │ description  │ │ question_en  │ │ term_es     │
│ text_en      │ │  _es, _en    │ │ options      │ │ term_en     │
│ confidence   │ │ image_url    │ │ correct_ans  │ │ definition  │
└──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   COURSE STRUCTURE                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│     courses         │
│─────────────────────│
│ id (PK)             │
│ source_pdf_id (FK)  │──→ pdf_documents.id
│ grade_level         │
│ title_es, title_en  │
│ description_es/_en  │
│ complexity_score    │
│ cultural_context    │
│ status              │
│ created_by (FK)     │──→ auth.users.id
│ created_at          │
│ published_at        │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│  course_modules     │
│─────────────────────│
│ id (PK)             │
│ course_id (FK)      │──→ courses.id
│ module_number       │
│ title_es, title_en  │
│ learning_objectives │ (JSONB)
│ content_blocks      │ (JSONB)
│ estimated_duration  │
│ created_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  ASSESSMENT SYSTEM                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│    assessments      │
│─────────────────────│
│ id (PK)             │
│ course_id (FK)      │──→ courses.id
│ assessment_type     │ ('diagnostic', 'formative', 'summative')
│ grade_level         │
│ title_es, title_en  │
│ timing              │ ('august', 'december', 'may', 'ongoing')
│ standards_alignment │ (JSONB)
│ question_count      │
│ estimated_duration  │
│ status              │
│ created_at          │
│ published_at        │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│assessment_questions │
│─────────────────────│
│ id (PK)             │
│ assessment_id (FK)  │──→ assessments.id
│ question_number     │
│ question_text_es/_en│
│ question_type       │
│ options             │ (JSONB)
│ correct_answer      │
│ explanation_es/_en  │
│ difficulty_level    │ (1-5)
│ irt_parameters      │ (JSONB: {a, b})
│ standard_code       │
│ cognitive_level     │ ('literal', 'inferential', 'evaluative')
│ created_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│               STUDENT ASSESSMENT FLOW                        │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│assessment_sessions  │
│─────────────────────│
│ id (PK)             │
│ student_id (FK)     │──→ auth.users.id
│ assessment_id (FK)  │──→ assessments.id
│ started_at          │
│ completed_at        │
│ current_question_num│
│ ability_estimate    │ (theta)
│ standard_error      │
│ responses           │ (JSONB array)
│ status              │ ('in_progress', 'completed')
│ created_at          │
└─────────────────────┘
           │
           │ (on completion)
           ▼
┌─────────────────────┐
│ assessment_results  │
│─────────────────────│
│ id (PK)             │
│ session_id (FK)     │──→ assessment_sessions.id
│ student_id (FK)     │──→ auth.users.id
│ assessment_id (FK)  │──→ assessments.id
│ started_at          │
│ completed_at        │
│ score_percentage    │
│ questions_answered  │
│ correct_answers     │
│ final_ability_est   │
│ final_standard_err  │
│ comprehension       │ (JSONB: {literal, inferential, evaluative})
│  _breakdown         │
│ standards           │ (JSONB: performance per standard)
│  _performance       │
│ adaptive_path       │ (JSONB: question sequence)
│ created_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                 VOICE ASSESSMENT                             │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  reading_passages   │
│─────────────────────│
│ id (PK)             │
│ grade_level         │
│ title_es, title_en  │
│ text_es, text_en    │
│ word_count          │
│ complexity_score    │
│ created_at          │
└─────────────────────┘
           │
           │ (referenced by)
           ▼
┌─────────────────────┐
│voice_assessment     │
│_results             │
│─────────────────────│
│ id (PK)             │
│ student_id (FK)     │──→ auth.users.id
│ assessment_id (FK)  │──→ assessments.id
│ passage_id (FK)     │──→ reading_passages.id
│ transcript_text     │
│ expected_text       │
│ accuracy            │ (0-100)
│ fluency_wpm         │
│ prosody_score       │ (0-100)
│ errors              │ (JSONB array)
│ feedback_es/_en     │
│ audio_url           │
│ created_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  PROGRESS TRACKING                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│  student_progress   │
│─────────────────────│
│ id (PK)             │
│ student_id (FK)     │──→ auth.users.id
│ course_id (FK)      │──→ courses.id
│ module_id (FK)      │──→ course_modules.id
│ completion_%        │
│ time_spent_minutes  │
│ last_accessed       │
│ performance_metrics │ (JSONB)
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│             RELATIONSHIPS & ACCESS CONTROL                   │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│parent_child         │
│_relationships       │
│─────────────────────│
│ id (PK)             │
│ parent_id (FK)      │──→ auth.users.id
│ child_id (FK)       │──→ auth.users.id
│ relationship_type   │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│  class_enrollments  │
│─────────────────────│
│ id (PK)             │
│ student_id (FK)     │──→ auth.users.id
│ class_id (FK)       │──→ classes.id
│ enrolled_at         │
└─────────────────────┘

┌─────────────────────┐
│   teacher_classes   │
│─────────────────────│
│ id (PK)             │
│ teacher_id (FK)     │──→ auth.users.id
│ class_id (FK)       │──→ classes.id
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│      classes        │
│─────────────────────│
│ id (PK)             │
│ name                │
│ grade_level         │
│ school_id (FK)      │
│ academic_year       │
│ created_at          │
└─────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  AUDIT & COMPLIANCE                          │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│     audit_log       │
│─────────────────────│
│ id (PK)             │
│ user_id (FK)        │──→ auth.users.id
│ action              │
│ table_name          │
│ record_id           │
│ old_data            │ (JSONB)
│ new_data            │ (JSONB)
│ ip_address          │
│ user_agent          │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│ parental_consents   │
│─────────────────────│
│ id (PK)             │
│ parent_id (FK)      │──→ auth.users.id
│ student_id (FK)     │──→ auth.users.id
│ consent_type        │ ('data_collection', 'assessment', 'voice')
│ granted             │
│ granted_at          │
│ ip_address          │
│ user_agent          │
│ created_at          │
└─────────────────────┘
```

---

## API Data Flows

### REST API Endpoints (Supabase PostgREST)

**1. Get Course with Modules**
```http
GET /rest/v1/courses?id=eq.{courseId}&select=*,course_modules(*)
```

**Response:**
```json
{
  "id": "uuid",
  "title_es": "Animales del Bosque",
  "title_en": "Forest Animals",
  "course_modules": [
    {
      "id": "uuid",
      "module_number": 1,
      "title_es": "Introducción",
      "content_blocks": [...]
    }
  ]
}
```

**2. Get Student Progress**
```http
GET /rest/v1/student_progress?student_id=eq.{userId}&select=*,courses(*),course_modules(*)
```

**3. Submit Assessment Answer**
```http
POST /functions/v1/submit-answer
```

**Request:**
```json
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "selectedAnswer": "Option B",
  "timestamp": "2025-10-21T10:30:00Z"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "updatedAbilityEstimate": 0.45,
  "standardError": 0.42,
  "nextQuestion": {
    "id": "uuid",
    "question_text_es": "..."
  }
}
```

---

## Real-Time Event Streams

### Supabase Realtime Subscriptions

**1. Student Progress Updates**
```typescript
// Parent portal subscription
const progressSubscription = supabase
  .channel('student-progress')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'student_progress',
      filter: `student_id=eq.${studentId}`
    },
    (payload) => {
      console.log('Progress updated:', payload.new);
      updateDashboard(payload.new);
    }
  )
  .subscribe();
```

**2. Assessment Completion Events**
```typescript
// Teacher dashboard subscription
const assessmentSubscription = supabase
  .channel('assessment-completions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'assessment_results',
      filter: `student_id=in.(${studentIds.join(',')})`
    },
    (payload) => {
      console.log('Student completed assessment:', payload.new);
      notifyTeacher(payload.new);
    }
  )
  .subscribe();
```

**3. Voice Assessment Results**
```typescript
// Student app subscription
const voiceResultsSubscription = supabase
  .channel('voice-results')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'voice_assessment_results',
      filter: `student_id=eq.${studentId}`
    },
    (payload) => {
      console.log('Voice assessment complete:', payload.new);
      displayFeedback(payload.new.feedback_es);
    }
  )
  .subscribe();
```

---

## Data Transformation Stages

### Summary of Key Transformations

| Stage | Input | Transformation | Output | Duration |
|-------|-------|----------------|--------|----------|
| **PDF Parsing** | PDF file | Text extraction, AI image description, vocabulary extraction | Structured bilingual content | 2-5 min |
| **Course Generation** | Parsed PDF | Content chunking, module creation, cultural adaptation | Complete course with modules | 30-60 sec |
| **Assessment Generation** | Course content | Question generation (AI), IRT calibration | Assessment with questions | 1-2 min |
| **Adaptive Assessment** | Student responses | IRT ability estimation, question selection | Personalized assessment path | Real-time |
| **Voice Assessment** | Audio recording | Speech-to-text, accuracy calculation, feedback generation | Reading metrics & feedback | 10-30 sec |
| **Analytics** | Multiple data sources | Aggregation, calculation, recommendation generation | Dashboard data | <1 sec |

---

## Performance Considerations

### Database Indexes

```sql
-- Critical indexes for performance
CREATE INDEX idx_courses_grade_status ON courses(grade_level, status);
CREATE INDEX idx_modules_course ON course_modules(course_id, module_number);
CREATE INDEX idx_questions_assessment ON assessment_questions(assessment_id, question_number);
CREATE INDEX idx_sessions_student_status ON assessment_sessions(student_id, status);
CREATE INDEX idx_results_student_assessment ON assessment_results(student_id, assessment_id);
CREATE INDEX idx_progress_student_updated ON student_progress(student_id, updated_at DESC);
```

### Caching Strategy

- **Course content:** Cache for 24 hours (rarely changes after publication)
- **Assessment questions:** Cache for 1 hour (static during assessment period)
- **Student progress:** Cache for 5 minutes (updated frequently)
- **Analytics:** Cache for 15 minutes (balance freshness vs. compute)

---

**Next Documents:**
- [EDGE_FUNCTIONS_SPEC.md](/workspaces/k5-poc-1e7850ce/docs/plan/EDGE_FUNCTIONS_SPEC.md) - Complete Edge Functions code
- [RESEARCH_CITATIONS.md](/workspaces/k5-poc-1e7850ce/docs/plan/RESEARCH_CITATIONS.md) - Academic references
