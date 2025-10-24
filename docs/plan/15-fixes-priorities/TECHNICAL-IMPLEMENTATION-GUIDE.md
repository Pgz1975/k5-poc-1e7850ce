# TECHNICAL IMPLEMENTATION GUIDE
## LecturaPR K5 POC - Critical Fixes

---

## QUICK START COMMANDS

```bash
# Navigate to project
cd /workspaces/k5-poc-1e7850ce

# Install dependencies if needed
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## PRIORITY 0 FIXES - IMMEDIATE ACTION

### 1. SYSTEM STABILITY FIX (2-3 hours)

#### Step 1: Update ViewAssessment.tsx
```typescript
// File: /src/pages/ViewAssessment.tsx

// Line 55: Replace the entire startVoiceSession function
const startVoiceSession = async () => {
  if (isConnected || isLoading || !assessment) return;

  setIsLoading(true);

  // Add timeout mechanism
  const timeoutId = setTimeout(() => {
    setIsLoading(false);
    setIsConnected(false);
    toast({
      title: t("Tiempo de espera agotado", "Connection timeout"),
      description: t("Por favor, intenta de nuevo", "Please try again"),
      variant: "destructive"
    });
  }, 10000); // 10 second timeout

  try {
    const client = new EnhancedRealtimeClient({
      studentId: user?.id || 'demo',
      language: assessment?.language === 'es' ? 'es-PR' : 'en',
      gradeLevel: 0,
      assessmentId: id,
      voiceGuidance: assessment?.voice_guidance,
      onTranscription: (text, isUser) => {
        setTranscript(prev => [...prev, `${isUser ? '👦' : '🤖'} ${text}`]);
      },
      onEvent: (event) => {
        if (event.type === 'response.audio.delta') setIsAIPlaying(true);
        if (event.type === 'response.done') setIsAIPlaying(false);
      },
      onMetrics: setMetrics
    });

    await client.connect();
    clientRef.current = client;
    setIsConnected(true);

    // Send initial question after short delay
    setTimeout(() => {
      if (assessment?.content?.question) {
        client.sendText(assessment.content.question);
      }
    }, 1000);

  } catch (error) {
    console.error('Voice connection failed:', error);
    toast({
      title: t("Error de conexión", "Connection error"),
      description: t("No se pudo conectar la voz", "Could not connect voice"),
      variant: "destructive"
    });
  } finally {
    // CRITICAL: Always clear timeout and loading state
    clearTimeout(timeoutId);
    setIsLoading(false);
  }
};
```

#### Step 2: Update useRealtimeVoice.ts
```typescript
// File: /src/hooks/useRealtimeVoice.ts

// Add after line 23 (after const { toast } = useToast();)
const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Update connect function starting at line 24
const connect = useCallback(async () => {
  console.log('[useRealtimeVoice] 🎯 Connect called');
  console.log('[useRealtimeVoice] 📊 State:', { isConnecting, isConnected });

  if (isConnecting || isConnected) {
    console.log('[useRealtimeVoice] ⚠️ Already connecting or connected, aborting');
    return;
  }

  setIsConnecting(true);

  // Set connection timeout
  connectionTimeoutRef.current = setTimeout(() => {
    console.error('[useRealtimeVoice] ⏱️ Connection timeout after 10 seconds');
    setIsConnecting(false);
    toast({
      title: language === 'es-PR' ? 'Tiempo agotado' : 'Connection timeout',
      description: language === 'es-PR'
        ? 'La conexión tardó demasiado. Intenta de nuevo.'
        : 'Connection took too long. Please try again.',
      variant: 'destructive'
    });
  }, 10000);

  try {
    // ... existing connection code ...

    // Clear timeout on successful connection
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

  } catch (error) {
    // ... existing error handling ...
  } finally {
    // Clear timeout and reset state
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    setIsConnecting(false);
  }
}, [isConnecting, isConnected, /* ... other deps ... */]);

// Add cleanup on unmount (after the connect function)
useEffect(() => {
  return () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
  };
}, []);
```

---

### 2. CHILD-APPROPRIATE LANGUAGE FIX (1-2 hours)

#### Step 1: Update CreateAssessment.tsx Templates
```typescript
// File: /src/pages/CreateAssessment.tsx

// Line 268: Update pronunciation words - REMOVE adult terms
pronunciation_words: isSpanish ? 'gato\npato\nluna\ncuna\nflor\ncolor' : 'cat\nhat\ntree\nbee\nstar\ncar',

// Search and replace ALL instances of:
// "amor" → "amigo" or "color"
// "cariño" → "amiguito"
// "querido" → "estudiante"
```

#### Step 2: Create Child-Friendly Prompts Configuration
```typescript
// New File: /src/utils/prompts/childFriendlyConfig.ts

export const CHILD_FRIENDLY_CONFIG = {
  // System prompt for OpenAI
  systemPrompt: `You are Coquí, a friendly educational assistant for children K-5.

CRITICAL RULES:
1. ALWAYS use gender-inclusive language:
   - Spanish: Use "estudiante", "amiguito y amiguita", or both forms
   - NEVER default to only masculine forms
   - When unsure, use: "niño o niña", "amigo o amiga"

2. NEVER use romantic or adult terms:
   - Forbidden: amor, cariño, querido, corazón, mi vida
   - Use instead: amiguito/a, estudiante, campeón/campeona

3. Age-appropriate encouragement only:
   - Good: "¡Muy bien!", "¡Excelente!", "¡Sigue así!"
   - Bad: "amor", "cariño", "mi vida"

4. Educational tone:
   - Be friendly but professional
   - Use simple, clear language
   - Encourage learning and trying again`,

  // Response templates
  responses: {
    es: {
      greeting: [
        "¡Hola amiguito o amiguita!",
        "¡Hola estudiante!",
        "¡Bienvenido o bienvenida!"
      ],
      correct: [
        "¡Muy bien!",
        "¡Excelente trabajo!",
        "¡Correcto! ¡Sigue así!",
        "¡Qué bien lo haces!"
      ],
      incorrect: [
        "Casi lo tienes, intenta otra vez",
        "No te preocupes, vamos a intentarlo de nuevo",
        "Está bien equivocarse, es parte de aprender"
      ],
      encouragement: [
        "¡Tú puedes!",
        "¡Sigue intentando!",
        "¡Vas muy bien!",
        "¡No te rindas!"
      ]
    },
    en: {
      greeting: [
        "Hello friend!",
        "Hi there, student!",
        "Welcome!"
      ],
      correct: [
        "Great job!",
        "Excellent work!",
        "Correct! Keep going!",
        "You're doing great!"
      ],
      incorrect: [
        "Almost there, try again",
        "Don't worry, let's try once more",
        "It's okay to make mistakes, that's how we learn"
      ],
      encouragement: [
        "You can do it!",
        "Keep trying!",
        "You're doing well!",
        "Don't give up!"
      ]
    }
  }
};
```

#### Step 3: Update Voice Client to Use Child-Friendly Config
```typescript
// File: /src/utils/realtime/RealtimeVoiceClientEnhanced.ts

// Add import at top
import { CHILD_FRIENDLY_CONFIG } from '@/utils/prompts/childFriendlyConfig';

// Update system message in constructor or initialization
this.systemMessage = CHILD_FRIENDLY_CONFIG.systemPrompt;
```

---

### 3. EXERCISE FORMAT DEFAULT FIX (30 minutes)

#### Step 1: Fix CreateAssessment.tsx
```typescript
// File: /src/pages/CreateAssessment.tsx

// Line 414: Replace the subtype assignment
const payload: any = {
  type: data.type,
  // FIX: Properly handle subtype based on type and form data
  subtype: data.subtype || (
    data.type === 'lesson' ? 'lesson' :
    data.type === 'exercise' && formData.subtype ? formData.subtype :
    data.type === 'assessment' && formData.subtype ? formData.subtype :
    'multiple_choice'
  ),
  title: data.title,
  content: data.content,
  // ... rest of payload
};
```

#### Step 2: Add Subtype Persistence
```typescript
// File: /src/components/ManualAssessment/SubtypeSelector.tsx

// Add useEffect to persist selection
useEffect(() => {
  // Force update form when value changes
  if (value && form) {
    form.setValue('subtype', value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }
}, [value, form]);
```

---

### 4. ERROR HANDLING & RETRY MECHANISM (1 hour)

#### Step 1: Add Retry Functionality to ViewAssessment
```typescript
// File: /src/pages/ViewAssessment.tsx

// Add state after line 30
const [attemptCount, setAttemptCount] = useState(0);
const [canRetry, setCanRetry] = useState(false);

// Update handleAnswer function (line 106)
const handleAnswer = (index: number) => {
  setSelectedAnswer(index);
  const correct = assessment.content.answers[index].isCorrect;
  setIsCorrect(correct);
  setShowFeedback(true);

  // Track attempts
  setAttemptCount(prev => prev + 1);

  const language = assessment.language;
  if (clientRef.current) {
    if (correct) {
      // Reset for next question
      setAttemptCount(0);
      setCanRetry(false);

      clientRef.current.sendText(
        language === 'es'
          ? '¡Excelente! Respuesta correcta. ¡Sigue así!'
          : 'Excellent! Correct answer! Keep going!'
      );
    } else {
      // Enable retry
      setCanRetry(true);

      clientRef.current.sendText(
        language === 'es'
          ? 'Casi lo tienes. Haz clic en "Intentar de nuevo" para volver a intentarlo.'
          : 'Almost there! Click "Try Again" to retry.'
      );
    }
  }
};

// Add retry button handler
const handleRetry = () => {
  setSelectedAnswer(null);
  setShowFeedback(false);
  setIsCorrect(false);
  setCanRetry(false);

  // Re-read the question
  if (clientRef.current && assessment?.content?.question) {
    clientRef.current.sendText(
      `${assessment.language === 'es' ? 'Intentemos de nuevo. ' : "Let's try again. "}${assessment.content.question}`
    );
  }
};

// Add retry button in JSX (after line 220, in the answers section)
{showFeedback && !isCorrect && (
  <Button
    onClick={handleRetry}
    className="mt-4 w-full"
    variant="outline"
  >
    {t("Intentar de nuevo", "Try Again")}
  </Button>
)}
```

---

### 5. ASSESSMENT LIMIT REMOVAL (45 minutes)

#### Step 1: Update AdminDashboard.tsx
```typescript
// File: /src/pages/AdminDashboard.tsx

// Add pagination state after line 20
const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [itemsPerPage] = useState(25); // Show 25 items per page

// Update fetchData function (line 38)
const fetchData = async () => {
  setLoading(true);
  try {
    const [manualResult, generatedResult, pdfResult] = await Promise.all([
      // Fetch with pagination
      supabase
        .from("manual_assessments")
        .select("id, title, created_at, grade_level, language, status, type, subtype, parent_lesson_id",
          { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage - 1
        ),

      // Keep generated assessments with limit for now
      supabase
        .from("generated_assessments")
        .select("id, assessment_type, created_at, grade_level, language, metadata")
        .order("created_at", { ascending: false })
        .limit(10),

      // Keep PDFs with limit for now
      supabase
        .from("pdf_documents")
        .select("id, filename, created_at, processing_status, grade_level")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Calculate total pages for manual assessments
    if (manualResult.count) {
      setTotalPages(Math.ceil(manualResult.count / itemsPerPage));
    }

    // ... rest of existing code
  } catch (error) {
    // ... existing error handling
  } finally {
    setLoading(false);
  }
};

// Add useEffect to refetch on page change
useEffect(() => {
  fetchData();
}, [currentPage]);

// Add pagination controls in JSX (after the table)
<div className="flex justify-center gap-2 mt-4">
  <Button
    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
    disabled={currentPage === 0}
    variant="outline"
  >
    Previous
  </Button>

  <span className="flex items-center px-4">
    Page {currentPage + 1} of {totalPages || 1}
  </span>

  <Button
    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
    disabled={currentPage >= totalPages - 1}
    variant="outline"
  >
    Next
  </Button>
</div>
```

#### Step 2: Add Edit Capability
```typescript
// In the assessment list table, add edit button
// File: /src/pages/AdminDashboard.tsx

// In the table row for each assessment (around line 150)
<TableCell>
  <Button
    size="sm"
    variant="outline"
    onClick={() => navigate(`/create-assessment?edit=${assessment.id}`)}
  >
    {t("Editar", "Edit")}
  </Button>
</TableCell>
```

---

## TESTING COMMANDS

### Quick Test Suite
```bash
# Test system stability
npm run test:stability

# Test language appropriateness
npm run test:language

# Test exercise formats
npm run test:exercises

# Full test suite
npm run test
```

### Manual Testing Steps
1. **Stability Test**
   - Start an exercise
   - Disconnect internet briefly
   - Verify timeout message appears
   - Reconnect and verify recovery

2. **Language Test**
   - Create new lesson
   - Verify no adult terms in templates
   - Check AI responses for inclusive language

3. **Exercise Format Test**
   - Create exercise with True/False
   - Save and reload
   - Verify format is preserved

4. **Retry Test**
   - Answer incorrectly
   - Click "Try Again"
   - Verify exercise resets properly

5. **Assessment Pagination Test**
   - Navigate to admin dashboard
   - Verify pagination controls appear
   - Test navigation through pages

---

## DATABASE UPDATES

Run these in Supabase SQL editor:

```sql
-- Remove view limits from RLS policies
DROP POLICY IF EXISTS "Teachers can view their assessments" ON manual_assessments;

CREATE POLICY "Teachers can view their assessments" ON manual_assessments
  FOR SELECT
  USING (created_by = auth.uid() OR is_public = true);

-- Add edit tracking
ALTER TABLE manual_assessments
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS edit_count INT DEFAULT 0;

-- Create trigger for edit tracking
CREATE OR REPLACE FUNCTION update_edit_tracking()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_edited_at = NOW();
  NEW.edit_count = COALESCE(OLD.edit_count, 0) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manual_assessments_edit_tracking
  BEFORE UPDATE ON manual_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_edit_tracking();
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All P0 fixes implemented
- [ ] Tests passing
- [ ] Manual QA completed
- [ ] Database migrations applied

### Deployment Steps
```bash
# Build production bundle
npm run build

# Run production checks
npm run build:check

# Deploy to Vercel/Netlify
npm run deploy
```

### Post-Deployment
- [ ] Verify all features working in production
- [ ] Monitor error logs for 30 minutes
- [ ] Test with actual users
- [ ] Document any issues found

---

## ROLLBACK PLAN

If critical issues found after deployment:

```bash
# Revert to previous version
git checkout <previous-version-tag>

# Rebuild and deploy
npm run build
npm run deploy:emergency

# Notify team
echo "Rollback completed to version X.Y.Z"
```

---

## MONITORING

### Key Metrics to Watch
- Connection timeout rate (<5%)
- Exercise completion rate (>80%)
- Error rate (<1%)
- Average session length (>5 minutes)

### Error Tracking
```typescript
// Add to main app component
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to monitoring service
  if (window.analytics) {
    window.analytics.track('Error', {
      message: event.error.message,
      stack: event.error.stack,
      url: window.location.href
    });
  }
});
```

---

*Technical Guide Version: 1.0*
*Created: October 23, 2024*
*For: LecturaPR K5 POC Critical Fixes*