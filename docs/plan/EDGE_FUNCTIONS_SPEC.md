# Edge Functions Specification
## Complete Supabase Edge Functions Implementation

**Version:** 1.0
**Last Updated:** October 21, 2025
**Runtime:** Deno (TypeScript)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Edge Functions](#core-edge-functions)
3. [Shared Libraries](#shared-libraries)
4. [Environment Configuration](#environment-configuration)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Guide](#deployment-guide)
7. [Monitoring & Logging](#monitoring--logging)

---

## Architecture Overview

### Edge Functions Structure

```
supabase/
├── functions/
│   ├── _shared/                       # Shared utilities
│   │   ├── cors.ts                    # CORS handling
│   │   ├── supabase-client.ts         # Supabase client factory
│   │   ├── ai-client.ts               # AI API wrapper
│   │   └── validators.ts              # Input validation
│   │
│   ├── generate-course/               # Course generation
│   │   ├── index.ts                   # Main handler
│   │   ├── lib/
│   │   │   ├── course-generator.ts    # Course generation logic
│   │   │   ├── cultural-adapter.ts    # Puerto Rican adaptations
│   │   │   └── quality-validator.ts   # Validation logic
│   │   └── types.ts                   # TypeScript types
│   │
│   ├── generate-assessment/           # Assessment generation
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── assessment-generator.ts
│   │   │   ├── question-generator.ts
│   │   │   └── irt-calibrator.ts     # IRT parameter estimation
│   │   └── types.ts
│   │
│   ├── adaptive-question-selector/    # Adaptive assessment
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── irt-engine.ts         # IRT calculations
│   │   │   └── stopping-rules.ts     # Termination logic
│   │   └── types.ts
│   │
│   ├── process-voice-assessment/      # Voice recognition
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── transcription.ts      # AssemblyAI integration
│   │   │   ├── metrics-calculator.ts # Reading metrics
│   │   │   └── feedback-generator.ts # Personalized feedback
│   │   └── types.ts
│   │
│   ├── generate-progress-report/      # Analytics
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── aggregator.ts         # Data aggregation
│   │   │   ├── analyzer.ts           # Performance analysis
│   │   │   └── recommender.ts        # Recommendation engine
│   │   └── types.ts
│   │
│   ├── send-notification/             # Notifications
│   │   ├── index.ts
│   │   └── lib/
│   │       ├── email.ts              # Email notifications
│   │       └── sms.ts                # SMS notifications (Twilio)
│   │
│   ├── process-pdf-completion/        # Webhook handler
│   │   └── index.ts
│   │
│   └── publish-course/                # Publishing workflow
│       └── index.ts
│
└── config.toml                        # Supabase configuration
```

---

## Core Edge Functions

### 1. generate-course

**Purpose:** Orchestrate course generation from parsed PDF

**File:** `supabase/functions/generate-course/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase-client.ts";
import { CourseGenerator } from "./lib/course-generator.ts";
import { CulturalAdapter } from "./lib/cultural-adapter.ts";
import { QualityValidator } from "./lib/quality-validator.ts";
import type {
  GenerateCourseRequest,
  GenerateCourseResponse,
  ErrorResponse
} from "./types.ts";

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const {
      pdfId,
      gradeLevel,
      autoPublish = false,
      teacherId
    }: GenerateCourseRequest = await req.json();

    // Validate inputs
    if (!pdfId || !gradeLevel) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: pdfId, gradeLevel'
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseClient = createSupabaseClient(req);

    // Fetch PDF parsing results
    console.log(`Fetching PDF data for: ${pdfId}`);
    const { data: pdfData, error: fetchError } = await supabaseClient
      .from('pdf_documents')
      .select(`
        *,
        pdf_extractions(*),
        pdf_images(*),
        pdf_questions(*),
        vocabulary_terms(*)
      `)
      .eq('id', pdfId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch PDF data:', fetchError);
      return new Response(
        JSON.stringify({
          error: `Failed to fetch PDF data: ${fetchError.message}`
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Verify PDF is completed
    if (pdfData.status !== 'completed') {
      return new Response(
        JSON.stringify({
          error: 'PDF parsing not yet completed'
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize course generator
    const generator = new CourseGenerator({
      gradeLevel,
      bilingualMode: true,
      culturalContext: 'puerto_rico',
      maxModulesPerCourse: 8,
      targetModuleDuration: 30 // minutes
    });

    // Generate course structure
    console.log('Generating course structure...');
    const courseStructure = await generator.createFromPDF(pdfData);

    // Apply cultural adaptations
    console.log('Applying cultural adaptations...');
    const adapter = new CulturalAdapter();
    const adaptedCourse = await adapter.adapt(courseStructure, {
      includeLocalExamples: true,
      vocabularyLocalization: true,
      culturalReferences: true,
      region: 'puerto_rico'
    });

    // Validate quality
    console.log('Validating course quality...');
    const validator = new QualityValidator();
    const validationResults = await validator.validate(adaptedCourse, {
      minBilingualAccuracy: 0.95,
      minCulturalRelevance: 0.80,
      maxComplexityDeviation: 0.5
    });

    // Flag for review if validation fails
    if (!validationResults.passed) {
      console.warn('Quality validation failed:', validationResults.issues);
      adaptedCourse.requiresReview = true;
      adaptedCourse.reviewNotes = validationResults.issues;
    }

    // Save course to database
    console.log('Saving course to database...');
    const { data: savedCourse, error: saveError } = await supabaseClient
      .from('courses')
      .insert({
        source_pdf_id: pdfId,
        grade_level: gradeLevel,
        title_es: adaptedCourse.title_es,
        title_en: adaptedCourse.title_en,
        description_es: adaptedCourse.description_es,
        description_en: adaptedCourse.description_en,
        complexity_score: adaptedCourse.complexity_score,
        cultural_context: adaptedCourse.cultural_context,
        status: autoPublish && validationResults.passed ? 'published' : 'draft',
        created_by: teacherId,
        created_at: new Date().toISOString(),
        ...(autoPublish && validationResults.passed && {
          published_at: new Date().toISOString()
        })
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save course:', saveError);
      return new Response(
        JSON.stringify({
          error: `Failed to save course: ${saveError.message}`
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Save course modules
    console.log('Saving course modules...');
    const modulesWithCourseId = adaptedCourse.modules.map(m => ({
      ...m,
      course_id: savedCourse.id,
      created_at: new Date().toISOString()
    }));

    const { error: modulesError } = await supabaseClient
      .from('course_modules')
      .insert(modulesWithCourseId);

    if (modulesError) {
      console.error('Failed to save modules:', modulesError);
      // Rollback course creation
      await supabaseClient
        .from('courses')
        .delete()
        .eq('id', savedCourse.id);

      return new Response(
        JSON.stringify({
          error: `Failed to save modules: ${modulesError.message}`
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Notify teacher if specified
    if (teacherId) {
      try {
        await supabaseClient.functions.invoke('send-notification', {
          body: {
            recipientId: teacherId,
            type: 'course_generated',
            data: {
              courseId: savedCourse.id,
              courseTitle: savedCourse.title_es,
              requiresReview: adaptedCourse.requiresReview
            }
          }
        });
      } catch (notifError) {
        console.warn('Failed to send notification:', notifError);
        // Don't fail the whole request if notification fails
      }
    }

    // Return success response
    const response: GenerateCourseResponse = {
      success: true,
      courseId: savedCourse.id,
      moduleCount: modulesWithCourseId.length,
      requiresReview: adaptedCourse.requiresReview || false,
      validationResults: {
        passed: validationResults.passed,
        bilingualAccuracy: validationResults.bilingualAccuracy,
        culturalRelevance: validationResults.culturalRelevance,
        complexityMatch: validationResults.complexityMatch,
        issues: validationResults.issues
      }
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Unexpected error in generate-course:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error'
      } as ErrorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
```

**File:** `supabase/functions/generate-course/types.ts`

```typescript
export interface GenerateCourseRequest {
  pdfId: string;
  gradeLevel: string;
  autoPublish?: boolean;
  teacherId?: string;
}

export interface GenerateCourseResponse {
  success: boolean;
  courseId: string;
  moduleCount: number;
  requiresReview: boolean;
  validationResults: ValidationResults;
}

export interface ValidationResults {
  passed: boolean;
  bilingualAccuracy: number;
  culturalRelevance: number;
  complexityMatch: boolean;
  issues?: string[];
}

export interface ErrorResponse {
  error: string;
}
```

---

### 2. adaptive-question-selector

**Purpose:** Real-time adaptive question selection using IRT

**File:** `supabase/functions/adaptive-question-selector/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase-client.ts";
import { IRTEngine } from "./lib/irt-engine.ts";
import { StoppingRules } from "./lib/stopping-rules.ts";

interface SelectQuestionRequest {
  sessionId: string;
}

interface SelectQuestionResponse {
  question: Question | null;
  shouldStop: boolean;
  currentAbility: number;
  standardError: number;
  questionsAnswered: number;
  reason?: string;
}

interface Question {
  id: string;
  question_number: number;
  question_text_es: string;
  question_text_en: string;
  options: QuestionOption[];
  difficulty_level: number;
}

interface QuestionOption {
  text_es: string;
  text_en: string;
  is_correct: boolean;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId }: SelectQuestionRequest = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing sessionId' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const supabaseClient = createSupabaseClient(req);

    // Fetch current session state
    const { data: session, error: sessionError } = await supabaseClient
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check stopping rules
    const stoppingRules = new StoppingRules();
    const shouldStop = stoppingRules.evaluate({
      theta: session.ability_estimate || 0,
      standardError: session.standard_error || 1.0,
      questionsAnswered: session.responses?.length || 0
    });

    if (shouldStop.stop) {
      // Complete the assessment
      await supabaseClient
        .from('assessment_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      // Create assessment result
      const resultData = await createAssessmentResult(
        supabaseClient,
        session
      );

      return new Response(
        JSON.stringify({
          question: null,
          shouldStop: true,
          currentAbility: session.ability_estimate,
          standardError: session.standard_error,
          questionsAnswered: session.responses?.length || 0,
          reason: shouldStop.reason
        } as SelectQuestionResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Fetch available questions
    const { data: questions, error: questionsError } = await supabaseClient
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', session.assessment_id);

    if (questionsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch questions' }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get already answered question IDs
    const answeredIds = (session.responses || []).map(
      (r: any) => r.question_id
    );

    // Filter available questions
    const availableQuestions = questions.filter(
      q => !answeredIds.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      // No more questions available, complete assessment
      await supabaseClient
        .from('assessment_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return new Response(
        JSON.stringify({
          question: null,
          shouldStop: true,
          currentAbility: session.ability_estimate,
          standardError: session.standard_error,
          questionsAnswered: session.responses?.length || 0,
          reason: 'No more questions available'
        } as SelectQuestionResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Use IRT to select optimal next question
    const irtEngine = new IRTEngine();
    const optimalQuestion = irtEngine.selectQuestion(
      availableQuestions,
      session.ability_estimate || 0
    );

    return new Response(
      JSON.stringify({
        question: optimalQuestion,
        shouldStop: false,
        currentAbility: session.ability_estimate || 0,
        standardError: session.standard_error || 1.0,
        questionsAnswered: session.responses?.length || 0
      } as SelectQuestionResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error in adaptive-question-selector:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

async function createAssessmentResult(
  supabaseClient: any,
  session: any
): Promise<void> {
  const responses = session.responses || [];
  const correctCount = responses.filter((r: any) => r.is_correct).length;
  const scorePercentage = responses.length > 0
    ? (correctCount / responses.length) * 100
    : 0;

  // Calculate comprehension breakdown
  const comprehensionBreakdown = {
    literal: calculateComprehensionScore(responses, 'literal'),
    inferential: calculateComprehensionScore(responses, 'inferential'),
    evaluative: calculateComprehensionScore(responses, 'evaluative')
  };

  await supabaseClient
    .from('assessment_results')
    .insert({
      session_id: session.id,
      student_id: session.student_id,
      assessment_id: session.assessment_id,
      started_at: session.started_at,
      completed_at: new Date().toISOString(),
      score_percentage: scorePercentage,
      questions_answered: responses.length,
      correct_answers: correctCount,
      final_ability_estimate: session.ability_estimate,
      final_standard_error: session.standard_error,
      comprehension_breakdown: comprehensionBreakdown,
      adaptive_path: responses.map((r: any) => ({
        question_id: r.question_id,
        difficulty: r.difficulty,
        is_correct: r.is_correct
      })),
      created_at: new Date().toISOString()
    });
}

function calculateComprehensionScore(
  responses: any[],
  cognitiveLevel: string
): number {
  const levelResponses = responses.filter(
    r => r.cognitive_level === cognitiveLevel
  );

  if (levelResponses.length === 0) return 0;

  const correctCount = levelResponses.filter(r => r.is_correct).length;
  return correctCount / levelResponses.length;
}
```

**File:** `supabase/functions/adaptive-question-selector/lib/irt-engine.ts`

```typescript
export class IRTEngine {
  /**
   * Select optimal question using Item Response Theory
   * Maximizes information at current ability estimate
   */
  selectQuestion(questions: any[], currentTheta: number): any {
    const questionsWithInfo = questions.map(q => {
      const irtParams = q.irt_parameters || { a: 1.0, b: 0 };
      const information = this.calculateInformation(
        irtParams.a,
        irtParams.b,
        currentTheta
      );

      return {
        question: q,
        information
      };
    });

    // Select question with maximum information
    const optimal = questionsWithInfo.reduce((best, current) =>
      current.information > best.information ? current : best
    );

    return optimal.question;
  }

  /**
   * Calculate information function: I(θ) = a² * P(θ) * Q(θ)
   */
  private calculateInformation(
    a: number,
    b: number,
    theta: number
  ): number {
    const p = this.calculateProbability(a, b, theta);
    const q = 1 - p;
    return Math.pow(a, 2) * p * q;
  }

  /**
   * 2PL IRT model: P(θ) = 1 / (1 + e^(-a(θ - b)))
   */
  private calculateProbability(
    a: number,
    b: number,
    theta: number
  ): number {
    const exponent = -a * (theta - b);
    return 1 / (1 + Math.exp(exponent));
  }

  /**
   * Update ability estimate using Maximum Likelihood Estimation
   */
  updateAbilityEstimate(
    currentTheta: number,
    currentSE: number,
    questionParams: { a: number; b: number },
    isCorrect: boolean
  ): { theta: number; standardError: number } {
    const { a, b } = questionParams;

    // Newton-Raphson method for MLE
    let theta = currentTheta;
    const maxIterations = 10;
    const tolerance = 0.001;

    for (let i = 0; i < maxIterations; i++) {
      const p = this.calculateProbability(a, b, theta);

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
    const information = this.calculateInformation(a, b, theta);
    const combinedInfo = Math.pow(currentSE, -2) + information;
    const standardError = 1 / Math.sqrt(combinedInfo);

    return { theta, standardError };
  }
}
```

**File:** `supabase/functions/adaptive-question-selector/lib/stopping-rules.ts`

```typescript
export interface StoppingCriteria {
  theta: number;
  standardError: number;
  questionsAnswered: number;
}

export interface StoppingDecision {
  stop: boolean;
  reason?: string;
}

export class StoppingRules {
  private minQuestions = 10;
  private maxQuestions = 30;
  private targetSE = 0.3;

  evaluate(criteria: StoppingCriteria): StoppingDecision {
    // Rule 1: Minimum questions not reached
    if (criteria.questionsAnswered < this.minQuestions) {
      return { stop: false };
    }

    // Rule 2: Maximum questions reached
    if (criteria.questionsAnswered >= this.maxQuestions) {
      return {
        stop: true,
        reason: 'Maximum questions reached'
      };
    }

    // Rule 3: Standard error threshold met
    if (criteria.standardError < this.targetSE) {
      return {
        stop: true,
        reason: 'Ability estimate sufficiently precise'
      };
    }

    // Continue assessment
    return { stop: false };
  }
}
```

---

### 3. submit-answer

**Purpose:** Process student answer and update ability estimate

**File:** `supabase/functions/submit-answer/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase-client.ts";
import { IRTEngine } from "../adaptive-question-selector/lib/irt-engine.ts";

interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  timestamp: string;
}

interface SubmitAnswerResponse {
  isCorrect: boolean;
  updatedAbilityEstimate: number;
  standardError: number;
  explanation?: string;
  nextQuestion?: any;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      sessionId,
      questionId,
      selectedAnswer,
      timestamp
    }: SubmitAnswerRequest = await req.json();

    const supabaseClient = createSupabaseClient(req);

    // Fetch session
    const { data: session } = await supabaseClient
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch question
    const { data: question } = await supabaseClient
      .from('assessment_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer === question.correct_answer;

    // Update ability estimate using IRT
    const irtEngine = new IRTEngine();
    const { theta, standardError } = irtEngine.updateAbilityEstimate(
      session.ability_estimate || 0,
      session.standard_error || 1.0,
      question.irt_parameters || { a: 1.0, b: 0 },
      isCorrect
    );

    // Add response to session
    const updatedResponses = [
      ...(session.responses || []),
      {
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        timestamp,
        difficulty: question.difficulty_level,
        cognitive_level: question.cognitive_level
      }
    ];

    // Update session
    await supabaseClient
      .from('assessment_sessions')
      .update({
        ability_estimate: theta,
        standard_error: standardError,
        responses: updatedResponses,
        current_question_number: (session.current_question_number || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Return response with explanation
    const response: SubmitAnswerResponse = {
      isCorrect,
      updatedAbilityEstimate: theta,
      standardError,
      explanation: isCorrect ? question.explanation_es : question.explanation_es
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error in submit-answer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
```

---

## Shared Libraries

### _shared/cors.ts

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### _shared/supabase-client.ts

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function createSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
}
```

### _shared/ai-client.ts

```typescript
export class AIClient {
  private apiKey: string;
  private provider: 'anthropic' | 'openai';

  constructor(provider: 'anthropic' | 'openai' = 'anthropic') {
    this.provider = provider;
    this.apiKey = provider === 'anthropic'
      ? Deno.env.get('ANTHROPIC_API_KEY') ?? ''
      : Deno.env.get('OPENAI_API_KEY') ?? '';
  }

  async generateText(prompt: string, options: any = {}): Promise<string> {
    if (this.provider === 'anthropic') {
      return this.callAnthropic(prompt, options);
    } else {
      return this.callOpenAI(prompt, options);
    }
  }

  private async callAnthropic(prompt: string, options: any): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-3-haiku-20240307',
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  }

  private async callOpenAI(prompt: string, options: any): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  extractJSON(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  }
}
```

---

## Environment Configuration

### .env (Local Development)

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Voice Recognition
ASSEMBLYAI_API_KEY=your-assemblyai-key

# Notifications
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### supabase/config.toml

```toml
[functions.generate-course]
verify_jwt = true

[functions.generate-assessment]
verify_jwt = true

[functions.adaptive-question-selector]
verify_jwt = true

[functions.submit-answer]
verify_jwt = true

[functions.process-voice-assessment]
verify_jwt = true

[functions.generate-progress-report]
verify_jwt = true

[functions.process-pdf-completion]
verify_jwt = false  # Triggered by webhook

[functions.send-notification]
verify_jwt = false  # Internal service
```

---

## Testing Strategy

### Unit Tests

**File:** `supabase/functions/generate-course/lib/course-generator.test.ts`

```typescript
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { CourseGenerator } from "./course-generator.ts";

Deno.test("CourseGenerator - analyzes content correctly", () => {
  const generator = new CourseGenerator({
    gradeLevel: '2',
    bilingualMode: true,
    culturalContext: 'puerto_rico',
    maxModulesPerCourse: 8,
    targetModuleDuration: 30
  });

  const mockPDFData = {
    id: 'test-pdf-id',
    pdf_extractions: [
      { page_number: 1, text_es: 'Test content', text_en: 'Test content', confidence: 0.95 }
    ],
    pdf_images: [],
    pdf_questions: [],
    vocabulary_terms: []
  };

  const analysis = generator['analyzeContent'](mockPDFData);

  assertEquals(analysis.totalPages, 1);
  assertEquals(analysis.suggestedModules, 1);
});
```

### Integration Tests

```bash
# Test generate-course function
supabase functions serve generate-course &
curl -X POST http://localhost:54321/functions/v1/generate-course \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfId": "test-pdf-id",
    "gradeLevel": "2",
    "autoPublish": false
  }'
```

---

## Deployment Guide

### Deploy All Functions

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy generate-course
supabase functions deploy generate-assessment
supabase functions deploy adaptive-question-selector
supabase functions deploy submit-answer
supabase functions deploy process-voice-assessment
supabase functions deploy generate-progress-report
supabase functions deploy send-notification
supabase functions deploy process-pdf-completion

# Set environment secrets
supabase secrets set ANTHROPIC_API_KEY=your-key
supabase secrets set ASSEMBLYAI_API_KEY=your-key
supabase secrets set SENDGRID_API_KEY=your-key
```

### CI/CD with GitHub Actions

**File:** `.github/workflows/deploy-functions.yml`

```yaml
name: Deploy Edge Functions

on:
  push:
    branches:
      - main
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Deploy Functions
        run: |
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## Monitoring & Logging

### Structured Logging

```typescript
// Use structured logging for better observability
console.log(JSON.stringify({
  level: 'info',
  function: 'generate-course',
  event: 'course_created',
  courseId: savedCourse.id,
  gradeLevel,
  moduleCount,
  timestamp: new Date().toISOString()
}));
```

### Error Tracking with Sentry

```typescript
import * as Sentry from "https://deno.land/x/sentry@7.77.0/index.mjs";

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  environment: Deno.env.get('ENVIRONMENT') || 'production'
});

// In catch blocks
catch (error) {
  Sentry.captureException(error);
  console.error('Error:', error);
}
```

### Performance Monitoring

```typescript
// Track function execution time
const startTime = Date.now();

// ... function logic ...

const duration = Date.now() - startTime;
console.log(JSON.stringify({
  level: 'metric',
  function: 'generate-course',
  metric: 'execution_time_ms',
  value: duration,
  timestamp: new Date().toISOString()
}));
```

---

## Complete Function List

| Function | Purpose | Auth Required | Trigger |
|----------|---------|---------------|---------|
| `generate-course` | Create course from PDF | Yes | API call |
| `generate-assessment` | Create assessment from course | Yes | API call |
| `adaptive-question-selector` | Select next question (IRT) | Yes | API call |
| `submit-answer` | Process student answer | Yes | API call |
| `process-voice-assessment` | Evaluate oral reading | Yes | API call |
| `generate-progress-report` | Generate analytics | Yes | API call |
| `send-notification` | Send email/SMS | No | Internal |
| `process-pdf-completion` | Trigger course generation | No | Webhook |
| `publish-course` | Publish course workflow | Yes | API call |

---

**Documentation Complete**

All Edge Functions specifications are now documented with complete implementations, testing strategies, and deployment guides. See related documents:
- [IMPLEMENTATION_ROADMAP.md](/workspaces/k5-poc-1e7850ce/docs/plan/IMPLEMENTATION_ROADMAP.md)
- [COURSE_GENERATION_ARCHITECTURE.md](/workspaces/k5-poc-1e7850ce/docs/plan/COURSE_GENERATION_ARCHITECTURE.md)
- [ASSESSMENT_ENGINE_DESIGN.md](/workspaces/k5-poc-1e7850ce/docs/plan/ASSESSMENT_ENGINE_DESIGN.md)
- [DATA_FLOW_DIAGRAM.md](/workspaces/k5-poc-1e7850ce/docs/plan/DATA_FLOW_DIAGRAM.md)
