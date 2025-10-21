# Adaptive Assessment Engine Design
## AI-Powered Diagnostic & Formative Assessment System

**Version:** 1.0
**Last Updated:** October 21, 2025
**System:** Supabase Edge Functions + Item Response Theory (IRT)

---

## Table of Contents

1. [Overview](#overview)
2. [Assessment Types](#assessment-types)
3. [Adaptive Algorithm Design](#adaptive-algorithm-design)
4. [Question Generation Engine](#question-generation-engine)
5. [Voice Recognition Assessment](#voice-recognition-assessment)
6. [Real-Time Analytics](#real-time-analytics)
7. [Database Schema](#database-schema)
8. [Edge Functions](#edge-functions)
9. [Research-Based Methodologies](#research-based-methodologies)

---

## Overview

The K5 Assessment Engine provides adaptive, bilingual assessments that:
- Automatically adjust difficulty based on student performance
- Measure literal and inferential comprehension
- Support oral reading fluency via voice recognition
- Generate diagnostic reports 3x/year (August, December, May)
- Align with Common Core State Standards (CCSS)
- Provide real-time feedback to students, teachers, and parents

### Core Requirements

**From K5 PRD:**
- Diagnostic tests 3x/year for grades K-5
- Multiple choice format with 3+ questions per standard
- Adaptive difficulty using AI
- Voice recognition for oral reading assessment
- Bilingual (Spanish/English) support
- Real-time progress tracking
- Family portal access

### Architecture Principles

```
┌────────────────────────────────────────────────┐
│          Assessment Orchestration              │
│                                                │
│  ┌──────────────┐      ┌──────────────┐      │
│  │   Question   │      │   Adaptive   │      │
│  │  Generator   │──────│   Selector   │      │
│  └──────────────┘      └──────────────┘      │
│         │                      │              │
│         ▼                      ▼              │
│  ┌──────────────┐      ┌──────────────┐      │
│  │  Question    │      │     IRT      │      │
│  │    Bank      │      │   Algorithm  │      │
│  └──────────────┘      └──────────────┘      │
│         │                      │              │
│         └──────────┬───────────┘              │
│                    ▼                          │
│         ┌──────────────────────┐              │
│         │ Student Assessment   │              │
│         │     Session          │              │
│         └──────────────────────┘              │
│                    │                          │
│         ┌──────────┴──────────┐               │
│         ▼                     ▼               │
│  ┌──────────────┐      ┌──────────────┐      │
│  │   Voice      │      │  Analytics   │      │
│  │  Assessment  │      │   Engine     │      │
│  └──────────────┘      └──────────────┘      │
└────────────────────────────────────────────────┘
```

---

## Assessment Types

### 1. Diagnostic Assessments

**Purpose:** Establish baseline reading proficiency

**Timing:** August, December, May (3x/year)

**Characteristics:**
- 20-30 questions per assessment
- Covers all CCSS standards for grade level
- Adaptive difficulty (adjusts in real-time)
- 30-45 minute duration
- Bilingual questions (student chooses language)
- Oral reading component (voice recognition)

**Example Structure:**
```json
{
  "assessment_type": "diagnostic",
  "grade_level": "2",
  "timing": "august",
  "standards_coverage": [
    "CCSS.ELA-LITERACY.RL.2.1",
    "CCSS.ELA-LITERACY.RL.2.2",
    "CCSS.ELA-LITERACY.RL.2.3",
    "CCSS.ELA-LITERACY.RL.2.4",
    "CCSS.ELA-LITERACY.RL.2.7"
  ],
  "question_distribution": {
    "literal_comprehension": 15,
    "inferential_comprehension": 10,
    "vocabulary": 5
  },
  "oral_reading_passages": 2
}
```

### 2. Formative Assessments

**Purpose:** Monitor ongoing progress within courses

**Timing:** After each course module

**Characteristics:**
- 5-10 questions per module
- Aligned with module learning objectives
- Quick feedback (immediate results)
- 10-15 minute duration
- Contributes to overall progress tracking

### 3. Summative Assessments

**Purpose:** Evaluate course completion and mastery

**Timing:** End of each course

**Characteristics:**
- 15-20 questions covering all modules
- Comprehensive evaluation
- Certificate of completion upon passing (≥80%)
- 20-30 minute duration

### 4. Adaptive Practice

**Purpose:** Personalized skill building

**Timing:** Student-initiated, ongoing

**Characteristics:**
- Unlimited questions
- Focuses on identified weak areas
- Game-like elements (points, badges)
- No time limit

---

## Adaptive Algorithm Design

### Item Response Theory (IRT) Implementation

The assessment engine uses a 2-Parameter Logistic (2PL) IRT model to:
1. Estimate student ability (θ - theta)
2. Select optimal next question based on current ability estimate
3. Adjust difficulty dynamically

**Mathematical Foundation:**

```
P(θ) = 1 / (1 + e^(-a(θ - b)))

Where:
- P(θ) = Probability of correct response
- θ (theta) = Student ability level (-3 to +3 scale)
- a = Discrimination parameter (how well question differentiates ability)
- b = Difficulty parameter (-3 to +3 scale)
- e = Euler's constant (2.71828...)
```

**Research Citation:**
- Embretson, S. E., & Reise, S. P. (2000). *Item Response Theory for Psychologists*. Lawrence Erlbaum Associates.
- Baker, F. B., & Kim, S. H. (2004). *Item Response Theory: Parameter Estimation Techniques* (2nd ed.). CRC Press.

### Adaptive Algorithm Flow

```typescript
// Adaptive question selection algorithm
interface StudentAbilityEstimate {
  theta: number; // Current ability estimate (-3 to +3)
  standardError: number; // Uncertainty in estimate
  responses: number; // Questions answered so far
}

function selectNextQuestion(
  student: StudentAbilityEstimate,
  questionBank: Question[],
  answeredQuestions: string[]
): Question {
  // 1. Filter out already answered questions
  const availableQuestions = questionBank.filter(
    q => !answeredQuestions.includes(q.id)
  );

  // 2. Calculate information function for each question
  const questionsWithInfo = availableQuestions.map(q => ({
    question: q,
    information: calculateInformation(q, student.theta)
  }));

  // 3. Select question with maximum information at current theta
  const optimalQuestion = questionsWithInfo.reduce((best, current) =>
    current.information > best.information ? current : best
  );

  return optimalQuestion.question;
}

function calculateInformation(question: Question, theta: number): number {
  const { a, b } = question.irt_parameters; // Discrimination, difficulty
  const p = calculateProbability(a, b, theta);

  // Information function: I(θ) = a² * P(θ) * Q(θ)
  return Math.pow(a, 2) * p * (1 - p);
}

function calculateProbability(a: number, b: number, theta: number): number {
  // 2PL IRT model
  const exponent = -a * (theta - b);
  return 1 / (1 + Math.exp(exponent));
}

function updateAbilityEstimate(
  student: StudentAbilityEstimate,
  question: Question,
  isCorrect: boolean
): StudentAbilityEstimate {
  // Maximum Likelihood Estimation (MLE)
  const { a, b } = question.irt_parameters;

  // Newton-Raphson method for theta estimation
  let theta = student.theta;
  const maxIterations = 10;
  const tolerance = 0.001;

  for (let i = 0; i < maxIterations; i++) {
    const p = calculateProbability(a, b, theta);
    const likelihood = isCorrect ? p : (1 - p);

    // First derivative (slope)
    const firstDeriv = a * (isCorrect ? (1 - p) : -p);

    // Second derivative (curvature)
    const secondDeriv = -Math.pow(a, 2) * p * (1 - p);

    // Update theta
    const delta = firstDeriv / secondDeriv;
    theta = theta - delta;

    if (Math.abs(delta) < tolerance) break;
  }

  // Update standard error
  const information = calculateInformation(question, theta);
  const standardError = 1 / Math.sqrt(
    Math.pow(student.standardError, -2) + information
  );

  return {
    theta,
    standardError,
    responses: student.responses + 1
  };
}
```

### Stopping Rules

Assessment terminates when:
1. **Standard Error Threshold:** SE(θ) < 0.3 (high confidence in ability estimate)
2. **Minimum Questions:** At least 10 questions answered
3. **Maximum Questions:** 30 questions maximum (prevent fatigue)
4. **Time Limit:** 45 minutes elapsed

---

## Question Generation Engine

### Automatic Question Creation from Course Content

```typescript
// supabase/functions/generate-assessment-questions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface QuestionGenerationRequest {
  courseId: string;
  moduleId?: string; // Optional: generate for specific module
  standardsCoverage: string[]; // CCSS standards to cover
  questionsPerStandard: number; // Default: 3
  difficultyRange: [number, number]; // e.g., [1, 5]
  comprehensionTypes: string[]; // ['literal', 'inferential', 'evaluative']
}

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const config: QuestionGenerationRequest = await req.json();

  // 1. Fetch course content
  const { data: courseData } = await supabaseClient
    .from('courses')
    .select(`
      *,
      course_modules!inner(
        id,
        content_blocks,
        learning_objectives
      )
    `)
    .eq('id', config.courseId)
    .single();

  // 2. Generate questions using AI
  const questions = await generateQuestionsFromContent(
    courseData,
    config
  );

  // 3. Calibrate IRT parameters
  const calibratedQuestions = await calibrateIRTParameters(questions);

  // 4. Validate bilingual quality
  const validatedQuestions = await validateBilingualQuestions(
    calibratedQuestions
  );

  // 5. Save to question bank
  const { data: savedQuestions, error } = await supabaseClient
    .from('assessment_questions')
    .insert(validatedQuestions);

  return new Response(
    JSON.stringify({
      success: !error,
      questionsGenerated: validatedQuestions.length,
      questions: savedQuestions
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});

async function generateQuestionsFromContent(
  courseData: any,
  config: QuestionGenerationRequest
): Promise<Question[]> {
  const questions: Question[] = [];

  // Generate questions for each standard
  for (const standard of config.standardsCoverage) {
    // Find relevant content for this standard
    const relevantContent = findContentForStandard(
      courseData.course_modules,
      standard
    );

    // Generate questions for each comprehension type
    for (const compType of config.comprehensionTypes) {
      const questionsForType = await generateQuestionsByType(
        relevantContent,
        compType,
        standard,
        config.questionsPerStandard
      );

      questions.push(...questionsForType);
    }
  }

  return questions;
}

async function generateQuestionsByType(
  content: any,
  comprehensionType: string,
  standard: string,
  count: number
): Promise<Question[]> {
  const prompt = buildQuestionPrompt(content, comprehensionType, standard, count);

  // Call AI (Anthropic Claude or OpenAI)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const data = await response.json();
  const aiResponse = data.content[0].text;

  // Parse AI response (expected JSON format)
  const questionsJson = extractJSON(aiResponse);
  return questionsJson.questions;
}

function buildQuestionPrompt(
  content: any,
  comprehensionType: string,
  standard: string,
  count: number
): string {
  const comprehensionGuidelines = {
    literal: `
      - Questions should ask about explicitly stated information
      - Focus on who, what, when, where
      - Answers are directly in the text
    `,
    inferential: `
      - Questions require reading between the lines
      - Focus on why, how, what might happen
      - Require logical deduction from text
    `,
    evaluative: `
      - Questions ask for judgments or opinions
      - Compare to other texts or experiences
      - Analyze author's purpose or effectiveness
    `
  };

  return `
You are an expert educational assessment designer for K-5 bilingual students in Puerto Rico.

Generate ${count} multiple-choice questions based on this content:

CONTENT:
${JSON.stringify(content, null, 2)}

REQUIREMENTS:
- Comprehension Type: ${comprehensionType}
${comprehensionGuidelines[comprehensionType]}
- Standard: ${standard}
- Grade-appropriate vocabulary and complexity
- 4 answer options per question (1 correct, 3 plausible distractors)
- Bilingual: Both Spanish and English versions
- Cultural relevance to Puerto Rico

RESPONSE FORMAT (JSON):
{
  "questions": [
    {
      "question_text_es": "Spanish question text",
      "question_text_en": "English question text",
      "question_type": "multiple_choice",
      "options": [
        {"text_es": "Option 1 ES", "text_en": "Option 1 EN", "is_correct": false},
        {"text_es": "Option 2 ES", "text_en": "Option 2 EN", "is_correct": true},
        {"text_es": "Option 3 ES", "text_en": "Option 3 EN", "is_correct": false},
        {"text_es": "Option 4 ES", "text_en": "Option 4 EN", "is_correct": false}
      ],
      "correct_answer": "Option 2 ES",
      "explanation_es": "Explanation in Spanish",
      "explanation_en": "Explanation in English",
      "standard_code": "${standard}",
      "cognitive_level": "${comprehensionType}",
      "estimated_difficulty": 3
    }
  ]
}

Generate questions now:
  `;
}

async function calibrateIRTParameters(
  questions: Question[]
): Promise<Question[]> {
  // Initial IRT parameter estimation
  // In production, refine these through pilot testing with real students

  return questions.map(q => {
    const estimatedDifficulty = q.estimated_difficulty || 3;

    // Convert difficulty (1-5) to IRT b parameter (-2 to +2)
    const b = (estimatedDifficulty - 3) * 0.67; // Maps 1→-1.34, 3→0, 5→+1.34

    // Set discrimination parameter based on question quality
    const a = estimateDiscrimination(q);

    return {
      ...q,
      irt_parameters: { a, b },
      difficulty_level: estimatedDifficulty
    };
  });
}

function estimateDiscrimination(question: Question): number {
  // Discrimination (a) measures how well question differentiates ability
  // Higher values = better discrimination
  // Typical range: 0.5 to 2.5

  let discrimination = 1.0; // Default moderate discrimination

  // Increase for clear, well-written questions
  if (question.cognitive_level === 'inferential') {
    discrimination += 0.3; // Inferential questions often discriminate better
  }

  // Decrease for very easy or very hard questions
  if (question.estimated_difficulty <= 1 || question.estimated_difficulty >= 5) {
    discrimination -= 0.2;
  }

  // Ensure within reasonable bounds
  return Math.max(0.5, Math.min(2.5, discrimination));
}

async function validateBilingualQuestions(
  questions: Question[]
): Promise<Question[]> {
  // Validate translation quality
  const validated = [];

  for (const q of questions) {
    // Check for missing translations
    if (!q.question_text_es || !q.question_text_en) {
      console.warn(`Question ${q.id} missing translation, skipping`);
      continue;
    }

    // Validate option count
    if (q.options.length !== 4) {
      console.warn(`Question ${q.id} has ${q.options.length} options, expected 4`);
      continue;
    }

    // Ensure exactly one correct answer
    const correctCount = q.options.filter(opt => opt.is_correct).length;
    if (correctCount !== 1) {
      console.warn(`Question ${q.id} has ${correctCount} correct answers, expected 1`);
      continue;
    }

    validated.push(q);
  }

  return validated;
}

interface Question {
  id?: string;
  question_text_es: string;
  question_text_en: string;
  question_type: string;
  options: QuestionOption[];
  correct_answer: string;
  explanation_es: string;
  explanation_en: string;
  standard_code: string;
  cognitive_level: string;
  estimated_difficulty?: number;
  irt_parameters?: { a: number; b: number };
  difficulty_level?: number;
}

interface QuestionOption {
  text_es: string;
  text_en: string;
  is_correct: boolean;
}
```

---

## Voice Recognition Assessment

### Oral Reading Fluency Evaluation

**Purpose:** Assess oral reading skills (accuracy, fluency, prosody)

**Technology:** AssemblyAI Speech-to-Text (Spanish & English support)

**Metrics Measured:**
- **Accuracy:** % of words read correctly
- **Fluency:** Words per minute (WPM)
- **Prosody:** Expression and phrasing (analyzed via pitch variation)
- **Self-corrections:** Student-initiated fixes

### Edge Function Implementation

```typescript
// supabase/functions/process-voice-assessment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface VoiceAssessmentRequest {
  studentId: string;
  assessmentId: string;
  passageId: string;
  audioUrl: string; // URL to uploaded audio file
  language: 'es' | 'en';
}

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const {
    studentId,
    assessmentId,
    passageId,
    audioUrl,
    language
  }: VoiceAssessmentRequest = await req.json();

  // 1. Get expected text
  const { data: passage } = await supabaseClient
    .from('reading_passages')
    .select('*')
    .eq('id', passageId)
    .single();

  const expectedText = language === 'es'
    ? passage.text_es
    : passage.text_en;

  // 2. Transcribe audio using AssemblyAI
  const transcript = await transcribeAudio(audioUrl, language);

  // 3. Calculate reading metrics
  const metrics = calculateReadingMetrics(
    expectedText,
    transcript.words,
    transcript.audio_duration
  );

  // 4. Generate feedback
  const feedback = generateFeedback(metrics, passage.grade_level);

  // 5. Save results
  const { data: result } = await supabaseClient
    .from('voice_assessment_results')
    .insert({
      student_id: studentId,
      assessment_id: assessmentId,
      passage_id: passageId,
      transcript_text: transcript.text,
      expected_text: expectedText,
      accuracy: metrics.accuracy,
      fluency_wpm: metrics.wordsPerMinute,
      prosody_score: metrics.prosodyScore,
      errors: metrics.errors,
      feedback_es: feedback.feedback_es,
      feedback_en: feedback.feedback_en,
      audio_url: audioUrl,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return new Response(
    JSON.stringify({ metrics, feedback, resultId: result.id }),
    { headers: { "Content-Type": "application/json" } }
  );
});

async function transcribeAudio(
  audioUrl: string,
  language: 'es' | 'en'
): Promise<TranscriptResult> {
  const assemblyAIKey = Deno.env.get('ASSEMBLYAI_API_KEY');

  // 1. Submit transcription job
  const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': assemblyAIKey!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: language,
      punctuate: true,
      format_text: true,
      speaker_labels: false,
      disfluencies: true // Detect "um", "uh", etc.
    })
  });

  const { id } = await submitResponse.json();

  // 2. Poll for completion
  let transcript;
  while (true) {
    const pollResponse = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: { 'Authorization': assemblyAIKey! }
      }
    );

    transcript = await pollResponse.json();

    if (transcript.status === 'completed') break;
    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    text: transcript.text,
    words: transcript.words,
    audio_duration: transcript.audio_duration
  };
}

interface TranscriptResult {
  text: string;
  words: TranscriptWord[];
  audio_duration: number; // seconds
}

interface TranscriptWord {
  text: string;
  start: number; // milliseconds
  end: number;
  confidence: number;
}

function calculateReadingMetrics(
  expectedText: string,
  transcribedWords: TranscriptWord[],
  audioDuration: number
): ReadingMetrics {
  // Normalize texts for comparison
  const expectedWords = normalizeText(expectedText).split(/\s+/);
  const transcribedWordTexts = transcribedWords.map(w =>
    normalizeText(w.text)
  );

  // Calculate accuracy using Levenshtein distance
  const { correct, errors } = calculateAccuracy(
    expectedWords,
    transcribedWordTexts
  );

  const accuracy = (correct / expectedWords.length) * 100;

  // Calculate words per minute
  const minutesElapsed = audioDuration / 60;
  const wordsPerMinute = Math.round(transcribedWords.length / minutesElapsed);

  // Calculate prosody (pitch variation as proxy for expression)
  const prosodyScore = calculateProsody(transcribedWords);

  return {
    accuracy,
    wordsPerMinute,
    prosodyScore,
    totalWords: expectedWords.length,
    correctWords: correct,
    errors,
    duration: audioDuration
  };
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '') // Remove punctuation, keep Spanish chars
    .trim();
}

function calculateAccuracy(
  expected: string[],
  transcribed: string[]
): { correct: number; errors: ReadingError[] } {
  const errors: ReadingError[] = [];
  let correct = 0;

  // Use dynamic programming (edit distance) for alignment
  const aligned = alignSequences(expected, transcribed);

  for (let i = 0; i < aligned.length; i++) {
    const [expectedWord, transcribedWord] = aligned[i];

    if (expectedWord === transcribedWord) {
      correct++;
    } else {
      errors.push({
        type: determineErrorType(expectedWord, transcribedWord),
        expected: expectedWord,
        actual: transcribedWord,
        position: i
      });
    }
  }

  return { correct, errors };
}

function determineErrorType(
  expected: string | null,
  actual: string | null
): string {
  if (expected && !actual) return 'omission';
  if (!expected && actual) return 'insertion';
  if (expected && actual && expected !== actual) return 'substitution';
  return 'unknown';
}

function alignSequences(
  seq1: string[],
  seq2: string[]
): Array<[string | null, string | null]> {
  // Needleman-Wunsch alignment algorithm
  const m = seq1.length;
  const n = seq2.length;
  const score: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Initialize
  for (let i = 0; i <= m; i++) score[i][0] = -i;
  for (let j = 0; j <= n; j++) score[0][j] = -j;

  // Fill matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = score[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? 1 : -1);
      const del = score[i - 1][j] - 1;
      const ins = score[i][j - 1] - 1;
      score[i][j] = Math.max(match, del, ins);
    }
  }

  // Traceback
  const aligned: Array<[string | null, string | null]> = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && score[i][j] === score[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? 1 : -1)) {
      aligned.unshift([seq1[i - 1], seq2[j - 1]]);
      i--; j--;
    } else if (i > 0 && score[i][j] === score[i - 1][j] - 1) {
      aligned.unshift([seq1[i - 1], null]); // Omission
      i--;
    } else {
      aligned.unshift([null, seq2[j - 1]]); // Insertion
      j--;
    }
  }

  return aligned;
}

function calculateProsody(words: TranscriptWord[]): number {
  // Prosody approximation based on timing variation
  // More advanced: analyze pitch contours (requires additional audio processing)

  if (words.length < 2) return 50; // Default for insufficient data

  const durations = words.map(w => w.end - w.start);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const variance = durations.reduce((sum, d) =>
    sum + Math.pow(d - avgDuration, 2), 0
  ) / durations.length;
  const stdDev = Math.sqrt(variance);

  // Higher variation = more expressive reading
  // Normalize to 0-100 scale
  const prosodyRaw = (stdDev / avgDuration) * 100;
  return Math.min(100, Math.max(0, prosodyRaw * 2)); // Scale and bound
}

interface ReadingMetrics {
  accuracy: number; // 0-100
  wordsPerMinute: number;
  prosodyScore: number; // 0-100
  totalWords: number;
  correctWords: number;
  errors: ReadingError[];
  duration: number; // seconds
}

interface ReadingError {
  type: 'omission' | 'insertion' | 'substitution';
  expected: string | null;
  actual: string | null;
  position: number;
}

function generateFeedback(
  metrics: ReadingMetrics,
  gradeLevel: string
): { feedback_es: string; feedback_en: string } {
  const benchmarks = getReadingBenchmarks(gradeLevel);

  let feedback_es = '';
  let feedback_en = '';

  // Accuracy feedback
  if (metrics.accuracy >= 95) {
    feedback_es += '¡Excelente precisión! Leíste casi todas las palabras correctamente. ';
    feedback_en += 'Excellent accuracy! You read almost all words correctly. ';
  } else if (metrics.accuracy >= 90) {
    feedback_es += 'Buena precisión. Sigue practicando para mejorar aún más. ';
    feedback_en += 'Good accuracy. Keep practicing to improve even more. ';
  } else {
    feedback_es += 'Necesitas practicar más para mejorar tu precisión. ';
    feedback_en += 'You need more practice to improve your accuracy. ';
  }

  // Fluency feedback
  if (metrics.wordsPerMinute >= benchmarks.wpmTarget) {
    feedback_es += `Tu velocidad de lectura (${metrics.wordsPerMinute} ppm) es excelente. `;
    feedback_en += `Your reading speed (${metrics.wordsPerMinute} wpm) is excellent. `;
  } else {
    const gap = benchmarks.wpmTarget - metrics.wordsPerMinute;
    feedback_es += `Trabaja en aumentar tu velocidad. Meta: ${benchmarks.wpmTarget} ppm. `;
    feedback_en += `Work on increasing your speed. Goal: ${benchmarks.wpmTarget} wpm. `;
  }

  // Prosody feedback
  if (metrics.prosodyScore >= 70) {
    feedback_es += '¡Leíste con buena expresión!';
    feedback_en += 'You read with good expression!';
  } else {
    feedback_es += 'Practica leer con más expresión y ritmo.';
    feedback_en += 'Practice reading with more expression and rhythm.';
  }

  return { feedback_es, feedback_en };
}

function getReadingBenchmarks(gradeLevel: string): { wpmTarget: number } {
  // Research-based oral reading fluency norms (Hasbrouck & Tindal, 2017)
  const benchmarks: Record<string, number> = {
    'K': 0,
    '1': 60,
    '2': 90,
    '3': 110,
    '4': 125,
    '5': 135
  };

  return { wpmTarget: benchmarks[gradeLevel] || 90 };
}
```

**Research Citation:**
- Hasbrouck, J., & Tindal, G. A. (2017). An update to compiled ORF norms (Technical Report No. 1702). *Behavioral Research and Teaching*, University of Oregon.

---

## Real-Time Analytics

### Student Progress Dashboard

```typescript
// supabase/functions/get-assessment-analytics/index.ts
serve(async (req) => {
  const { studentId, dateRange } = await req.json();

  // Aggregate assessment results
  const { data: results } = await supabaseClient
    .from('assessment_results')
    .select(`
      *,
      assessments(title_es, title_en, assessment_type, timing)
    `)
    .eq('student_id', studentId)
    .gte('created_at', dateRange.start)
    .lte('created_at', dateRange.end)
    .order('created_at', { ascending: false });

  // Calculate analytics
  const analytics = {
    totalAssessments: results.length,
    averageScore: calculateAverage(results.map(r => r.score_percentage)),
    diagnosticProgress: analyzeDiagnosticProgress(results),
    strengthsAndWeaknesses: identifyPatternsFromResults(results),
    abilityEstimate: calculateCurrentAbility(results),
    recommendations: generateRecommendations(results)
  };

  return new Response(JSON.stringify({ analytics }), {
    headers: { "Content-Type": "application/json" }
  });
});

function analyzeDiagnosticProgress(results: any[]): DiagnosticProgress {
  const diagnostics = results.filter(r =>
    r.assessments.assessment_type === 'diagnostic'
  );

  // Sort by timing (august, december, may)
  const timingOrder = ['august', 'december', 'may'];
  diagnostics.sort((a, b) =>
    timingOrder.indexOf(a.assessments.timing) -
    timingOrder.indexOf(b.assessments.timing)
  );

  const progress = diagnostics.map(d => ({
    timing: d.assessments.timing,
    score: d.score_percentage,
    abilityEstimate: extractAbilityFromResults(d)
  }));

  // Calculate growth
  const growth = progress.length >= 2
    ? progress[progress.length - 1].score - progress[0].score
    : null;

  return { progress, growth };
}

interface DiagnosticProgress {
  progress: Array<{
    timing: string;
    score: number;
    abilityEstimate: number;
  }>;
  growth: number | null;
}
```

---

## Database Schema

```sql
-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  assessment_type VARCHAR(50) CHECK (assessment_type IN
    ('diagnostic', 'formative', 'summative', 'adaptive')),
  grade_level VARCHAR(10),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  timing VARCHAR(20) CHECK (timing IN ('august', 'december', 'may', 'ongoing')),
  standards_alignment JSONB,
  question_count INTEGER,
  estimated_duration_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Assessment questions with IRT parameters
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text_es TEXT NOT NULL,
  question_text_en TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple_choice',
  options JSONB, -- Array of {text_es, text_en, is_correct}
  correct_answer TEXT,
  explanation_es TEXT,
  explanation_en TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  irt_parameters JSONB, -- {a: discrimination, b: difficulty}
  standard_code VARCHAR(50),
  cognitive_level VARCHAR(50) CHECK (cognitive_level IN
    ('literal', 'inferential', 'evaluative')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student assessment sessions
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES assessments(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_question_number INTEGER DEFAULT 1,
  ability_estimate NUMERIC(5,3), -- Theta value
  standard_error NUMERIC(5,3),
  responses JSONB, -- Array of {question_id, selected_answer, is_correct, timestamp}
  status VARCHAR(20) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment results (completed sessions)
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id),
  student_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES assessments(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score_percentage NUMERIC(5,2),
  questions_answered INTEGER,
  correct_answers INTEGER,
  final_ability_estimate NUMERIC(5,3),
  final_standard_error NUMERIC(5,3),
  comprehension_breakdown JSONB, -- {literal: 0.85, inferential: 0.72, evaluative: 0.68}
  standards_performance JSONB, -- Performance per CCSS standard
  adaptive_path JSONB, -- Question sequence and difficulty progression
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice assessment results
CREATE TABLE voice_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES assessments(id),
  passage_id UUID,
  transcript_text TEXT,
  expected_text TEXT,
  accuracy NUMERIC(5,2), -- 0-100
  fluency_wpm INTEGER,
  prosody_score NUMERIC(5,2), -- 0-100
  errors JSONB, -- Array of {type, expected, actual, position}
  feedback_es TEXT,
  feedback_en TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading passages for voice assessments
CREATE TABLE reading_passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level VARCHAR(10),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  text_es TEXT NOT NULL,
  text_en TEXT NOT NULL,
  word_count INTEGER,
  complexity_score NUMERIC(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_assessments_grade_level ON assessments(grade_level);
CREATE INDEX idx_assessments_type_timing ON assessments(assessment_type, timing);
CREATE INDEX idx_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX idx_sessions_student ON assessment_sessions(student_id);
CREATE INDEX idx_sessions_status ON assessment_sessions(status);
CREATE INDEX idx_results_student_assessment ON assessment_results(student_id, assessment_id);
CREATE INDEX idx_voice_results_student ON voice_assessment_results(student_id);
```

---

## Research-Based Methodologies

### Item Response Theory (IRT)

**Key References:**
1. **Embretson, S. E., & Reise, S. P. (2000).** *Item Response Theory for Psychologists*. Lawrence Erlbaum Associates.
   - Foundational text on IRT models and applications

2. **Baker, F. B., & Kim, S. H. (2004).** *Item Response Theory: Parameter Estimation Techniques* (2nd ed.). CRC Press.
   - Methods for calibrating IRT parameters

3. **van der Linden, W. J., & Glas, C. A. (Eds.). (2010).** *Elements of Adaptive Testing*. Springer.
   - Comprehensive guide to computerized adaptive testing

### Oral Reading Fluency

**Key References:**
1. **Hasbrouck, J., & Tindal, G. A. (2017).** An update to compiled ORF norms. *Behavioral Research and Teaching*, University of Oregon.
   - Research-based reading fluency benchmarks for grades K-8

2. **Rasinski, T. V. (2017).** Readers who struggle: Why many struggle and a modest proposal for improving their reading. *The Reading Teacher*, 70(5), 519-524.
   - Addresses reading fluency interventions

3. **Schwanenflugel, P. J., & Kuhn, M. R. (2016).** *Reading Fluency: The Forgotten Dimension of Reading Success*. Guilford Press.
   - Comprehensive resource on fluency assessment and instruction

### Bilingual Assessment

**Key References:**
1. **García, O., & Wei, L. (2014).** *Translanguaging: Language, Bilingualism and Education*. Palgrave Macmillan.
   - Framework for bilingual assessment design

2. **Gottlieb, M. (2016).** *Assessing English Language Learners: Bridges to Educational Equity* (2nd ed.). Corwin.
   - Best practices for bilingual student assessment

3. **Solano-Flores, G. (2016).** *Assessing English Language Learners: Theory and Practice*. Routledge.
   - Research on equitable assessment for bilingual students

### Puerto Rican Educational Context

**Key References:**
1. **Pousada, A. (2017).** Language issues in Puerto Rico. *Language Problems and Language Planning*, 41(1), 45-68.
   - Context for bilingual education in Puerto Rico

2. **Departamento de Educación de Puerto Rico (DEPR). (2023).** *Estándares de Excelencia para el Programa de Español*.
   - Official standards for Spanish language instruction

---

**Next Documents:**
- [DATA_FLOW_DIAGRAM.md](/workspaces/k5-poc-1e7850ce/docs/plan/DATA_FLOW_DIAGRAM.md)
- [EDGE_FUNCTIONS_SPEC.md](/workspaces/k5-poc-1e7850ce/docs/plan/EDGE_FUNCTIONS_SPEC.md)
- [RESEARCH_CITATIONS.md](/workspaces/k5-poc-1e7850ce/docs/plan/RESEARCH_CITATIONS.md)
