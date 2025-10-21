# Voice Integration - Manual Assessment Creation

## Overview
Integrate the **existing** voice system from `/voice-test` into manual assessments. Coquí reads questions, provides guidance, and gives feedback in the student's language.

## Core Principle: REUSE EXISTING CODE
The `/voice-test` page already has a working voice system with the `useRealtimeVoice` hook. We just need to integrate it into the assessment flow.

---

## Architecture

### Existing Voice System (Already Built!)

```
useRealtimeVoice Hook
├── RealtimeVoiceClientEnhanced class
├── WebSocket connection to Edge Function
├── OpenAI Realtime API integration
├── Audio playback via Web Audio API
└── Transcription tracking
```

### Integration Points for Manual Assessments

```
ManualAssessmentView.tsx
├── Import useRealtimeVoice hook
├── Connect on component mount
├── Read question automatically
├── Read voice guidance (if provided)
└── Provide answer feedback
```

---

## Implementation Steps

### Step 1: Copy Hook Usage from VoiceTest.tsx

The `/voice-test` page shows exactly how to use the hook:

```typescript
// From /src/pages/VoiceTest.tsx (lines 36-50)
const {
  isConnected,
  isConnecting,
  isAIPlaying,
  transcript,
  connect,
  disconnect,
  sendText
} = useRealtimeVoice({
  studentId: user?.id || 'test-student',
  language,  // 'es-PR' or 'en-US'
  model: 'gpt-4o-realtime-preview-2024-12-17',
  onTranscription: (text, isUser) => {
    console.log(`${isUser ? 'User' : 'AI'}: ${text}`);
  }
});
```

### Step 2: Integrate into ManualAssessmentView.tsx

```typescript
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useAuth } from '@/contexts/AuthContext';

export default function ManualAssessmentView() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);

  // Initialize voice system
  const { connect, sendText, isConnected, isAIPlaying } = useRealtimeVoice({
    studentId: user?.id || '',
    language: assessment?.settings.language === 'es' ? 'es-PR' : 'en-US',
    model: 'gpt-4o-realtime-preview-2024-12-17',
    onTranscription: (text, isUser) => {
      console.log(`Voice: ${text}`);
    }
  });

  // Auto-connect and read question on page load
  useEffect(() => {
    if (assessment && !isConnected) {
      connect().then(() => {
        // 1. Read voice guidance (if provided)
        if (assessment.content.voiceGuidance) {
          sendText(assessment.content.voiceGuidance);
        }

        // 2. Read the question (after short delay)
        setTimeout(() => {
          sendText(assessment.content.question);
        }, 2000);
      });
    }
  }, [assessment, isConnected]);

  // Handle answer selection
  const handleAnswer = (index: number) => {
    const isCorrect = assessment.content.answers[index].isCorrect;

    // Provide voice feedback
    if (isCorrect) {
      sendText(
        assessment.settings.language === 'es'
          ? '¡Excelente! Respuesta correcta.'
          : 'Excellent! Correct answer.'
      );
    } else {
      sendText(
        assessment.settings.language === 'es'
          ? 'Inténtalo de nuevo. Piensa un poco más.'
          : 'Try again. Think a little more.'
      );
    }
  };

  // ... rest of component
}
```

---

## Voice Flow Sequence

### Sequence 1: Student Opens Assessment

```
1. Page loads → ManualAssessmentView mounts
2. Fetch assessment data from Supabase
3. Initialize useRealtimeVoice hook
4. Auto-connect to voice system
5. Wait for connection (isConnected = true)
6. Read voice guidance (if exists)
7. Wait 2 seconds
8. Read question text
9. Student hears question in their language
```

### Sequence 2: Student Answers Question

```
1. Student clicks answer option
2. Check if answer is correct
3. sendText() with appropriate feedback
4. Show visual feedback (green/red highlight)
5. Wait 1.5 seconds
6. Proceed to next question or show completion
```

### Sequence 3: Student Leaves Page

```
1. Component unmounts
2. useEffect cleanup runs
3. Voice connection automatically disconnects
4. Resources freed
```

---

## Voice Messages by Language

### Spanish (es-PR)

```typescript
const voiceMessages = {
  // Guidance
  guidance: {
    multipleChoice: 'Lee cada opción con cuidado antes de responder.',
    trueFalse: 'Piensa bien antes de decir verdadero o falso.',
    fillBlank: 'Escucha la frase y completa el espacio en blanco.',
    matching: 'Conecta cada palabra con su pareja correcta.'
  },

  // Feedback
  feedback: {
    correct: '¡Excelente! Respuesta correcta.',
    incorrect: 'Inténtalo de nuevo. Piensa un poco más.',
    tryAgain: 'No te preocupes, puedes intentarlo otra vez.',
    almostThere: '¡Casi! Estás muy cerca de la respuesta.'
  },

  // Encouragement
  encouragement: {
    start: '¡Vamos a aprender juntos!',
    middle: '¡Lo estás haciendo muy bien!',
    end: '¡Felicidades! Completaste el ejercicio.'
  }
};
```

### English (en-US)

```typescript
const voiceMessages = {
  // Guidance
  guidance: {
    multipleChoice: 'Read each option carefully before answering.',
    trueFalse: 'Think carefully before saying true or false.',
    fillBlank: 'Listen to the sentence and fill in the blank.',
    matching: 'Connect each word with its correct pair.'
  },

  // Feedback
  feedback: {
    correct: 'Excellent! Correct answer.',
    incorrect: 'Try again. Think a little more.',
    tryAgain: "Don't worry, you can try again.",
    almostThere: 'Almost! You are very close to the answer.'
  },

  // Encouragement
  encouragement: {
    start: "Let's learn together!",
    middle: 'You are doing great!',
    end: 'Congratulations! You completed the exercise.'
  }
};
```

---

## Voice Settings (Teacher Control)

Teachers can customize voice behavior when creating assessments:

```typescript
interface VoiceSettings {
  // Basic Settings
  enableVoice: boolean;                // Default: true
  autoReadQuestion: boolean;           // Default: true
  voiceSpeed: number;                  // Default: 1.0 (range: 0.5 - 2.0)

  // Custom Messages
  voiceGuidance?: string;              // Custom instruction text
  correctFeedback?: string;            // Override default correct message
  incorrectFeedback?: string;          // Override default incorrect message

  // Advanced Settings (Future)
  voiceGender?: 'male' | 'female';     // Future feature
  voiceAccent?: 'es-PR' | 'es-MX';     // Future: regional accents
  readAnswers?: boolean;                // Future: read all answer options
}
```

### UI for Voice Settings (in ContentEditorForm)

```typescript
<Card className="p-6 mb-6">
  <h3 className="text-xl font-bold mb-4">🎙️ Voice Settings</h3>

  {/* Enable Voice */}
  <div className="flex items-center gap-3 mb-4">
    <Switch
      checked={voiceSettings.enableVoice}
      onCheckedChange={(checked) =>
        setVoiceSettings({ ...voiceSettings, enableVoice: checked })
      }
    />
    <label className="text-lg">Enable voice guidance</label>
  </div>

  {/* Auto-read Question */}
  <div className="flex items-center gap-3 mb-4">
    <Switch
      checked={voiceSettings.autoReadQuestion}
      onCheckedChange={(checked) =>
        setVoiceSettings({ ...voiceSettings, autoReadQuestion: checked })
      }
    />
    <label className="text-lg">Automatically read question</label>
  </div>

  {/* Voice Speed */}
  <div className="mb-4">
    <label className="text-lg mb-2 block">Voice speed:</label>
    <div className="flex items-center gap-4">
      <Slider
        value={[voiceSettings.voiceSpeed]}
        onValueChange={([speed]) =>
          setVoiceSettings({ ...voiceSettings, voiceSpeed: speed })
        }
        min={0.5}
        max={2.0}
        step={0.1}
        className="flex-1"
      />
      <span className="text-lg font-medium w-12">
        {voiceSettings.voiceSpeed}x
      </span>
    </div>
  </div>

  {/* Custom Voice Guidance */}
  <div>
    <label className="text-lg mb-2 block">Custom voice message:</label>
    <Textarea
      value={voiceSettings.voiceGuidance}
      onChange={(e) =>
        setVoiceSettings({ ...voiceSettings, voiceGuidance: e.target.value })
      }
      placeholder="e.g., Lee cada opción con cuidado..."
      className="text-xl"
    />
    <p className="text-sm text-muted-foreground mt-2">
      This message will be spoken before the question.
    </p>
  </div>
</Card>
```

---

## Voice UI Indicators

Show voice status to students:

### 1. Connection Status Badge

```typescript
<Badge variant={isConnected ? 'default' : 'secondary'}>
  {isConnected ? '🔊 Voice Active' : '🔇 Voice Inactive'}
</Badge>
```

### 2. Speaking Indicator

```typescript
{isAIPlaying && (
  <div className="flex items-center gap-2 text-blue-600 animate-pulse">
    <Volume2 className="h-5 w-5" />
    <span className="font-medium">Coquí is speaking...</span>
  </div>
)}
```

### 3. Coquí Visual State Sync

```typescript
const getCoquiState = () => {
  if (isAIPlaying) return 'speaking';
  if (showFeedback) {
    return isCorrect ? 'celebration' : 'neutral';
  }
  return 'thinking';
};

<CoquiMascot state={getCoquiState()} size="large" />
```

---

## Error Handling

### Connection Failures

```typescript
const { connect, disconnect } = useRealtimeVoice({
  // ... config
  onError: (error) => {
    console.error('Voice error:', error);

    toast({
      title: 'Voice connection failed',
      description: 'Continuing without voice. You can still read the questions.',
      variant: 'default'
    });

    // Continue with visual-only mode
    setVoiceEnabled(false);
  },
  onConnectionChange: (connected) => {
    if (!connected) {
      // Show reconnect option
      setShowReconnectButton(true);
    }
  }
});
```

### Fallback Mode (No Voice)

If voice fails, assessment still works:

```typescript
if (!isConnected) {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Voice is not available right now. You can still complete the exercise
        by reading the questions.
        <Button onClick={connect} variant="link">
          Try connecting again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

---

## Performance Optimization

### 1. Lazy Connection

Don't connect immediately on page load. Wait until assessment data is loaded:

```typescript
useEffect(() => {
  // Only connect when we have assessment data
  if (assessment && !isConnected && !hasAttemptedConnection) {
    setHasAttemptedConnection(true);
    connect();
  }
}, [assessment]);
```

### 2. Disconnect on Unmount

```typescript
useEffect(() => {
  return () => {
    // Cleanup: disconnect voice when leaving page
    disconnect();
  };
}, []);
```

### 3. Throttle sendText Calls

```typescript
const sendTextThrottled = useCallback(
  debounce((text: string) => {
    if (isConnected) {
      sendText(text);
    }
  }, 500),
  [isConnected]
);
```

---

## Testing Voice Integration

### Test Cases

1. **Basic Voice Flow**
   - Load assessment → Voice connects → Question is read
   - Expected: Hear question in selected language

2. **Answer Feedback**
   - Click correct answer → Hear positive feedback
   - Click incorrect answer → Hear try again message

3. **Multiple Questions**
   - Complete question 1 → Move to question 2
   - Expected: New question is read automatically

4. **Connection Failure**
   - Disconnect network → Voice should fail gracefully
   - Expected: UI shows error, assessment still usable

5. **Language Switching**
   - Spanish assessment → Voice in Spanish
   - English assessment → Voice in English
   - Expected: Correct language voice

### Manual Testing Checklist

```
□ Voice connects on page load
□ Question is read automatically
□ Voice guidance is read (if provided)
□ Correct answer feedback works
□ Incorrect answer feedback works
□ Coquí mascot state syncs with voice
□ Voice disconnects on page leave
□ Fallback mode works without voice
□ Both Spanish and English work
□ Mobile voice works (tablet)
```

---

## Edge Function (No Changes Needed!)

The existing `/functions/v1/realtime-voice-relay` already handles everything:

- WebSocket relay to OpenAI
- Language selection
- Audio streaming
- Transcription

**We don't need to modify the Edge Function at all!** Just use it as-is.

---

## Future Enhancements (NOT for MVP)

1. **Voice-to-Text Answers**
   - Student speaks answer instead of clicking
   - Voice recognition checks correctness

2. **Pronunciation Practice**
   - Student repeats question/answer
   - System scores pronunciation

3. **Multiple Voice Options**
   - Different Coquí personalities
   - Male/female voices
   - Regional accents

4. **Voice Speed Control (Student-Side)**
   - Students can slow down/speed up
   - Stored as user preference

5. **Read-Along Highlighting**
   - Highlight words as Coquí speaks them
   - Helps with reading comprehension

---

## Integration Summary

### What We're Using:
- ✅ `useRealtimeVoice` hook (already built)
- ✅ `RealtimeVoiceClientEnhanced` class (already built)
- ✅ `/realtime-voice-relay` Edge Function (already deployed)
- ✅ OpenAI Realtime API (already configured)

### What We're Building:
- New: Integration into ManualAssessmentView
- New: Teacher voice settings UI
- New: Voice feedback messages
- New: Voice status indicators

### Total New Code:
- ~50 lines in ManualAssessmentView.tsx
- ~30 lines in ContentEditorForm.tsx
- ~20 lines for voice messages
- **Total: ~100 lines** (mostly integration code)

---

## Code Example: Complete Voice Integration

```typescript
// /src/pages/ManualAssessmentView.tsx

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useAuth } from '@/contexts/AuthContext';
import CoquiMascot from '@/components/CoquiMascot';
import { supabase } from '@/integrations/supabase/client';

// Voice messages
const getVoiceMessage = (type: string, language: string) => {
  const messages = {
    es: {
      correct: '¡Excelente! Respuesta correcta.',
      incorrect: 'Inténtalo de nuevo. Piensa un poco más.',
      start: '¡Vamos a aprender juntos!',
      end: '¡Felicidades! Completaste el ejercicio.'
    },
    en: {
      correct: 'Excellent! Correct answer.',
      incorrect: 'Try again. Think a little more.',
      start: "Let's learn together!",
      end: 'Congratulations! You completed the exercise.'
    }
  };

  return messages[language][type] || messages.en[type];
};

export default function ManualAssessmentView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Voice integration
  const { connect, sendText, isConnected, isAIPlaying, disconnect } =
    useRealtimeVoice({
      studentId: user?.id || '',
      language: assessment?.settings.language === 'es' ? 'es-PR' : 'en-US',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      onTranscription: (text, isUser) => {
        console.log(`${isUser ? 'Student' : 'Coquí'}: ${text}`);
      }
    });

  // Fetch assessment
  useEffect(() => {
    const fetchAssessment = async () => {
      const { data } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('id', id)
        .single();

      setAssessment(data);
    };

    fetchAssessment();
  }, [id]);

  // Auto-connect voice and read question
  useEffect(() => {
    if (assessment && !isConnected) {
      connect().then(() => {
        // Read guidance if provided
        if (assessment.content.voiceGuidance) {
          sendText(assessment.content.voiceGuidance);
          setTimeout(() => {
            sendText(assessment.content.question);
          }, 2000);
        } else {
          sendText(assessment.content.question);
        }
      });
    }

    // Cleanup on unmount
    return () => disconnect();
  }, [assessment, isConnected]);

  // Handle answer
  const handleAnswer = useCallback(
    (index: number) => {
      setSelectedAnswer(index);
      setShowFeedback(true);

      const isCorrect = assessment.content.answers[index].isCorrect;
      const language = assessment.settings.language;

      // Voice feedback
      sendText(getVoiceMessage(isCorrect ? 'correct' : 'incorrect', language));

      // Move to next question after delay
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowFeedback(false);
        // ... load next question
      }, 2000);
    },
    [assessment, sendText]
  );

  if (!assessment) return <div>Loading...</div>;

  const isCorrect =
    selectedAnswer !== null &&
    assessment.content.answers[selectedAnswer]?.isCorrect;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white">
      {/* Voice status indicator */}
      {isAIPlaying && (
        <div className="fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          🔊 Coquí is speaking...
        </div>
      )}

      {/* Coquí mascot with voice-synced state */}
      <div className="flex justify-center mb-8">
        <CoquiMascot
          state={
            isAIPlaying
              ? 'speaking'
              : showFeedback
              ? isCorrect
                ? 'celebration'
                : 'neutral'
              : 'thinking'
          }
          size="large"
        />
      </div>

      {/* Rest of assessment UI... */}
    </div>
  );
}
```

---

## Summary

**Voice integration is SIMPLE because**:
1. Hook already exists (`useRealtimeVoice`)
2. Edge Function already works
3. Just need to call `sendText()` at right times
4. ~100 lines of integration code total

**Key Points**:
- Auto-read questions on load
- Voice feedback on answers
- Sync Coquí mascot with voice state
- Graceful fallback if voice fails
- No new backend code needed

**Remember**: Don't reinvent the wheel. The voice system works perfectly in `/voice-test`. Just copy the pattern!
