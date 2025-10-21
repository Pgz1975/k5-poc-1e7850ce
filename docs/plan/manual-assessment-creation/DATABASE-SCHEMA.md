# Database Schema - Manual Assessment Creation

## Overview
Simple database schema for teacher-created content. Reuses existing types and follows the same patterns as the PDF parsing system.

---

## Main Table: manual_assessments

```sql
-- ============================================================================
-- TABLE: manual_assessments
-- Stores manually created lessons, exercises, and assessments by teachers
-- ============================================================================
CREATE TABLE IF NOT EXISTS manual_assessments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type Classification
  type TEXT NOT NULL CHECK (type IN ('lesson', 'exercise', 'assessment')),
  subtype TEXT NOT NULL CHECK (subtype IN (
    'multiple_choice',
    'true_false',
    'fill_blank',
    'matching',
    'short_answer',
    'reading',
    'listening'
  )),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,

  -- Content (JSONB for flexibility)
  content JSONB NOT NULL,
  /* Expected structure:
  {
    "question": "¿Con qué letra comienza...?",
    "questionImage": "https://...",
    "answers": [
      {
        "text": "A (a)",
        "imageUrl": "https://...",
        "isCorrect": true
      }
    ],
    "explanation": "Optional explanation text",
    "voiceGuidance": "Lee cada opción con cuidado"
  }
  */

  -- Educational Metadata
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 0 AND 5),
  -- 0 = Kindergarten, 1-5 = Grades

  language language_code NOT NULL DEFAULT 'es',
  -- Reuse existing enum: 'es', 'en', 'es-PR'

  subject_area TEXT NOT NULL DEFAULT 'reading',
  -- 'reading', 'math', 'science', 'social_studies', 'art', 'other'

  curriculum_standards TEXT[],
  -- Array of standard codes: ['RF.K.2', 'RL.1.1']

  -- Voice Settings
  enable_voice BOOLEAN DEFAULT true,
  voice_speed DECIMAL(2,1) DEFAULT 1.0 CHECK (voice_speed BETWEEN 0.5 AND 2.0),
  auto_read_question BOOLEAN DEFAULT true,

  -- Difficulty & Duration
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_minutes INTEGER DEFAULT 5,

  -- Status & Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,

  -- Usage Tracking (denormalized for performance)
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),

  -- Ownership & Timestamps
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Additional Metadata (for future extensibility)
  metadata JSONB DEFAULT '{}'::jsonb
  /* Can store:
  {
    "tags": ["vowels", "beginner"],
    "thumbnail": "https://...",
    "notes": "Teacher notes",
    "prerequisites": ["uuid1", "uuid2"]
  }
  */
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Performance indexes
CREATE INDEX idx_manual_assessments_type ON manual_assessments(type);
CREATE INDEX idx_manual_assessments_subtype ON manual_assessments(subtype);
CREATE INDEX idx_manual_assessments_created_by ON manual_assessments(created_by);
CREATE INDEX idx_manual_assessments_grade_language ON manual_assessments(grade_level, language);
CREATE INDEX idx_manual_assessments_subject ON manual_assessments(subject_area);
CREATE INDEX idx_manual_assessments_status ON manual_assessments(status);
CREATE INDEX idx_manual_assessments_created_at ON manual_assessments(created_at DESC);

-- Full-text search on content (for finding specific questions/answers)
CREATE INDEX idx_manual_assessments_content_gin ON manual_assessments USING GIN(content);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamp
CREATE TRIGGER update_manual_assessments_updated_at
  BEFORE UPDATE ON manual_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at when status changes to 'published'
CREATE OR REPLACE FUNCTION set_published_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_published_at_trigger
  BEFORE UPDATE ON manual_assessments
  FOR EACH ROW
  EXECUTE FUNCTION set_published_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE manual_assessments ENABLE ROW LEVEL SECURITY;

-- Teachers can see all their own assessments
CREATE POLICY "Teachers can view own assessments"
  ON manual_assessments FOR SELECT
  USING (created_by = auth.uid());

-- Teachers can create assessments
CREATE POLICY "Teachers can create assessments"
  ON manual_assessments FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Teachers can update their own assessments
CREATE POLICY "Teachers can update own assessments"
  ON manual_assessments FOR UPDATE
  USING (created_by = auth.uid());

-- Teachers can delete their own assessments
CREATE POLICY "Teachers can delete own assessments"
  ON manual_assessments FOR DELETE
  USING (created_by = auth.uid());

-- Students can view published assessments (TODO: Add proper student role check)
CREATE POLICY "Students can view published assessments"
  ON manual_assessments FOR SELECT
  USING (status = 'published');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get assessment with answer statistics
CREATE OR REPLACE FUNCTION get_assessment_with_stats(assessment_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'assessment', row_to_json(ma),
    'stats', jsonb_build_object(
      'total_views', ma.view_count,
      'total_completions', ma.completion_count,
      'average_score', ma.average_score,
      'completion_rate',
        CASE
          WHEN ma.view_count > 0
          THEN (ma.completion_count::DECIMAL / ma.view_count * 100)
          ELSE 0
        END
    )
  ) INTO result
  FROM manual_assessments ma
  WHERE ma.id = assessment_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_assessment_view(assessment_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE manual_assessments
  SET view_count = view_count + 1
  WHERE id = assessment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record completion and update stats
CREATE OR REPLACE FUNCTION record_assessment_completion(
  assessment_id UUID,
  score DECIMAL
)
RETURNS void AS $$
BEGIN
  UPDATE manual_assessments
  SET
    completion_count = completion_count + 1,
    average_score = CASE
      WHEN completion_count = 0 THEN score
      ELSE (average_score * completion_count + score) / (completion_count + 1)
    END
  WHERE id = assessment_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Supporting Table: assessment_responses (Optional - for tracking student answers)

```sql
-- ============================================================================
-- TABLE: assessment_responses
-- Tracks student responses to manual assessments (COPPA compliant)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  assessment_id UUID NOT NULL REFERENCES manual_assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Response Data
  answers JSONB NOT NULL,
  /* Structure:
  [
    {
      "questionIndex": 0,
      "selectedAnswer": 1,
      "isCorrect": true,
      "timeSpent": 45
    }
  ]
  */

  -- Scoring
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN max_score > 0 THEN (score / max_score * 100) ELSE 0 END
  ) STORED,

  -- Timing
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent_seconds INTEGER NOT NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  /* Can store:
  {
    "device": "tablet",
    "voiceUsed": true,
    "attemptsCount": 1
  }
  */

  UNIQUE(assessment_id, student_id, completed_at)
  -- Allow multiple attempts, distinguished by timestamp
);

-- Indexes
CREATE INDEX idx_responses_assessment ON assessment_responses(assessment_id);
CREATE INDEX idx_responses_student ON assessment_responses(student_id);
CREATE INDEX idx_responses_completed ON assessment_responses(completed_at DESC);

-- RLS
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own responses"
  ON assessment_responses FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own responses"
  ON assessment_responses FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Teachers can view responses to their assessments
CREATE POLICY "Teachers can view responses to own assessments"
  ON assessment_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM manual_assessments
      WHERE id = assessment_responses.assessment_id
      AND created_by = auth.uid()
    )
  );
```

---

## Storage Bucket Configuration

```sql
-- ============================================================================
-- STORAGE BUCKET: manual-assessment-images
-- Stores images uploaded by teachers for assessments
-- ============================================================================

-- Create bucket (via Supabase Dashboard or SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('manual-assessment-images', 'manual-assessment-images', true);

-- RLS Policies for storage
CREATE POLICY "Teachers can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'manual-assessment-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'manual-assessment-images');

CREATE POLICY "Teachers can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'manual-assessment-images'
    AND auth.uid() = owner
  );

CREATE POLICY "Teachers can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'manual-assessment-images'
    AND auth.uid() = owner
  );
```

---

## Example Data Structure

### Multiple Choice Example

```json
{
  "type": "exercise",
  "subtype": "multiple_choice",
  "title": "Identificar Vocales",
  "content": {
    "question": "¿Con qué letra comienza la palabra 'escuela'?",
    "questionImage": "https://example.com/school.png",
    "answers": [
      {
        "text": "A (a)",
        "imageUrl": null,
        "isCorrect": false
      },
      {
        "text": "E (e)",
        "imageUrl": "https://example.com/letter-e.png",
        "isCorrect": true
      },
      {
        "text": "I (i)",
        "imageUrl": null,
        "isCorrect": false
      }
    ],
    "explanation": "La palabra 'escuela' comienza con la vocal E.",
    "voiceGuidance": "Lee cada opción con cuidado antes de responder."
  },
  "grade_level": 1,
  "language": "es",
  "subject_area": "reading",
  "difficulty_level": 2,
  "estimated_duration_minutes": 3
}
```

### True/False Example

```json
{
  "type": "assessment",
  "subtype": "true_false",
  "title": "Verificar Conocimiento de Vocales",
  "content": {
    "question": "Las vocales en español son: a, e, i, o, u",
    "questionImage": null,
    "answers": [
      {
        "text": "Verdadero",
        "imageUrl": null,
        "isCorrect": true
      },
      {
        "text": "Falso",
        "imageUrl": null,
        "isCorrect": false
      }
    ],
    "explanation": "Correcto! Las cinco vocales son a, e, i, o, u.",
    "voiceGuidance": "Piensa bien antes de responder."
  },
  "grade_level": 0,
  "language": "es",
  "subject_area": "reading",
  "difficulty_level": 1,
  "estimated_duration_minutes": 2
}
```

---

## Migration File

Create this file: `/supabase/migrations/[timestamp]_create_manual_assessments.sql`

```sql
-- Run all the CREATE TABLE statements above
-- This keeps the schema in version control
```

---

## Database Functions for Edge Functions

```typescript
// TypeScript types for frontend
export interface ManualAssessment {
  id: string;
  type: 'lesson' | 'exercise' | 'assessment';
  subtype: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  title: string;
  description?: string;
  content: {
    question: string;
    questionImage?: string;
    answers: Answer[];
    explanation?: string;
    voiceGuidance?: string;
  };
  grade_level: number;
  language: 'es' | 'en' | 'es-PR';
  subject_area: string;
  curriculum_standards?: string[];
  enable_voice: boolean;
  voice_speed: number;
  auto_read_question: boolean;
  difficulty_level?: number;
  estimated_duration_minutes: number;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  completion_count: number;
  average_score?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Answer {
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  student_id: string;
  answers: any[];
  score: number;
  max_score: number;
  percentage: number;
  started_at: string;
  completed_at: string;
  time_spent_seconds: number;
  metadata?: Record<string, any>;
}
```

---

## Query Examples

```sql
-- Get all published assessments for Grade 1, Spanish
SELECT * FROM manual_assessments
WHERE grade_level = 1
  AND language = 'es'
  AND status = 'published'
ORDER BY created_at DESC;

-- Get teacher's draft assessments
SELECT * FROM manual_assessments
WHERE created_by = 'teacher-uuid'
  AND status = 'draft'
ORDER BY updated_at DESC;

-- Get assessment with statistics
SELECT * FROM get_assessment_with_stats('assessment-uuid');

-- Get student's responses to an assessment
SELECT * FROM assessment_responses
WHERE student_id = 'student-uuid'
  AND assessment_id = 'assessment-uuid'
ORDER BY completed_at DESC
LIMIT 1;

-- Get all responses for a teacher's assessments
SELECT
  ma.title,
  ar.student_id,
  ar.score,
  ar.percentage,
  ar.completed_at
FROM assessment_responses ar
JOIN manual_assessments ma ON ar.assessment_id = ma.id
WHERE ma.created_by = 'teacher-uuid'
ORDER BY ar.completed_at DESC;
```

---

## Notes for Developers

1. **Reuse existing types**: The `language_code` enum already exists
2. **JSONB content field**: Flexible for different assessment types
3. **RLS is critical**: Protects student data (COPPA/FERPA compliance)
4. **Denormalized stats**: View/completion counts stored for performance
5. **Storage bucket**: Separate bucket for teacher-uploaded images
6. **Simple schema**: No over-engineering, just what's needed

---

**Remember**: This schema is designed to be SIMPLE and FLEXIBLE. The JSONB content field allows for easy extension without schema changes.
