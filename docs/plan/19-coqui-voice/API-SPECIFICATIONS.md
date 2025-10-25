# Coqui Voice Integration - API Specifications

**Version:** 1.0
**Date:** October 25, 2025
**API:** OpenAI Realtime API

---

## 🔌 Realtime Voice Integration

### Architecture Overview
- Browser connects to `RealtimeVoiceClientEnhanced` (WebSocket + AudioWorklet).
- Client talks to Supabase Edge relay (`realtime-voice-relay`) instead of hitting OpenAI directly.
- Relay maintains the upstream OpenAI Realtime WebSocket and streams audio/text back and forth with zero delay.
- Supabase Edge function `realtime-token-enhanced` still creates sessions/tokens with OpenAI on demand.

### Client Endpoint
```
wss://{SUPABASE_PROJECT}.supabase.co/functions/v1/realtime-voice-relay?student_id={id}&language={es-PR|en-US}&model=gpt-realtime-2025-08-28
```

### Authentication
- **Method**: Bearer Token
- **Header**: `Authorization: Bearer ${OPENAI_API_KEY}`
- **Session Token**: Generated via Supabase Edge Function

---

## 🎯 Session Configuration

### Initial Session Request
```typescript
interface RealtimeSessionConfig {
  model: "gpt-4o-realtime-preview-2024-12-17";
  voice: "alloy" | "echo" | "shimmer"; // Based on language
  instructions: string; // Dynamic prompt from CoquiPromptBuilder

  turn_detection: {
    type: "server_vad";
    threshold: 0.5;
    prefix_padding_ms: 300;
    silence_duration_ms: 500;
    create_response: boolean;
  };

  input_audio_transcription: {
    model: "whisper-1";
  };

  tools?: Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: object;
    };
  }>;

  // Coqui-specific configuration
  max_response_output_tokens?: number;
  temperature?: number;
  voice_settings?: {
    speed: number; // 0.5 to 2.0
    pitch?: number; // Future support
  };
}
```

### Example Session Creation
```typescript
const sessionConfig: RealtimeSessionConfig = {
  model: "gpt-4o-realtime-preview-2024-12-17",
  voice: "shimmer", // For Spanish
  instructions: buildCoquiInstructions(context),

  turn_detection: {
    type: "server_vad",
    threshold: 0.5, // Sensitivity for K-5 students
    prefix_padding_ms: 300, // Buffer before speech
    silence_duration_ms: 500, // Quick response
    create_response: true // Auto-respond
  },

  input_audio_transcription: {
    model: "whisper-1"
  },

  tools: [
    {
      type: "function",
      function: {
        name: "pronunciation_feedback",
        description: "Provide feedback on pronunciation",
        parameters: {
          type: "object",
          properties: {
            word: { type: "string" },
            confidence: { type: "number" },
            needsCorrection: { type: "boolean" }
          }
        }
      }
    }
  ],

  max_response_output_tokens: 150, // Cost control
  temperature: 0.7, // Balanced creativity
  voice_settings: {
    speed: 1.1 // 10% faster for cost optimization
  }
};
```

---

## 📡 WebRTC Connection Flow

### 1. Token Generation (Supabase Edge Function)
- Endpoint: `POST /functions/v1/realtime-token-enhanced`
- Source of truth: `supabase/functions/realtime-token-enhanced/index.ts`
- Responsibilities:
  1. Fetch optional assessment context (`manual_assessments`).
  2. Build instructions + pick appropriate voice.
  3. Call `https://api.openai.com/v1/realtime/sessions` with `gpt-realtime-2025-08-28`.
  4. Persist `voice_sessions` record (session id, student id, model, etc.).
  5. Return session payload to the caller (Lovable app or relay).

### 2. WebSocket Relay (Supabase Edge Function)
- Endpoint: `wss://.../functions/v1/realtime-voice-relay`
- Source: `supabase/functions/realtime-voice-relay/index.ts`
- Responsibilities:
  1. Upgrade client WebSocket, connect upstream to OpenAI Realtime via API key.
  2. Stream `response.audio.delta` packets immediately down to the browser.
  3. Forward user input events (audio append, conversation items) upstream.
  4. Log VAD events (e.g., `input_audio_buffer.speech_started`) for telemetry.
  5. Close both sockets gracefully on either side disconnect.

### 3. Browser Client
- File: `src/utils/realtime/RealtimeVoiceClientEnhanced.ts`
- Highlights:
  - Uses `AudioWorklet` to capture PCM16 at 24 kHz and streams via relay WebSocket.
  - Maintains jitter buffer, heartbeat, reconnection logic.
  - Emits callbacks consumed by `useRealtimeVoice` (`onTranscription`, `onAudioPlayback`, `onAudioLevel`, etc.).

---

## 📨 Message Protocol

### Client to Server Events

#### 1. Text Message (Data Channel Message via Relay)
```typescript
interface TextMessageEvent {
  type: "conversation.item.create";
  item: {
    type: "message";
    role: "user";
    content: [{
      type: "text";
      text: string;
    }];
  };
}

// Example
this.dc.send(JSON.stringify({
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [{
      type: "text",
      text: "¿Cuál es la respuesta correcta?"
    }]
  }
}));
```

#### 2. Audio Control (WebSocket JSON payloads routed through relay)
```typescript
interface AudioControlEvent {
  type: "input_audio_buffer.commit" | "input_audio_buffer.clear";
}

// Commit audio buffer
this.dc.send(JSON.stringify({
  type: "input_audio_buffer.commit"
}));
```

#### 3. Response Control
```typescript
interface ResponseControlEvent {
  type: "response.create";
  response?: {
    instructions?: string;
    voice?: string;
    max_output_tokens?: number;
  };
}

// Request response with constraints
this.dc.send(JSON.stringify({
  type: "response.create",
  response: {
    max_output_tokens: 100 // Limit response length
  }
}));
```

### Server to Client Events

#### 1. Transcription Events
```typescript
interface TranscriptionEvent {
  type: "conversation.item.input_audio_transcription.completed";
  item_id: string;
  content_index: number;
  transcript: string;
}

// Handle transcription
this.dc.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "conversation.item.input_audio_transcription.completed") {
    console.log("Student said:", data.transcript);
    this.handleStudentTranscription(data.transcript);
  }
};
```

#### 2. Audio Response Events
```typescript
interface AudioDeltaEvent {
  type: "response.audio.delta";
  response_id: string;
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string; // Base64 encoded audio
}

interface AudioDoneEvent {
  type: "response.audio.done";
  response_id: string;
  item_id: string;
  output_index: number;
  content_index: number;
}
```

#### 3. Function Call Events
```typescript
interface FunctionCallEvent {
  type: "response.function_call";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

// Handle function calls
if (data.type === "response.function_call") {
  const args = JSON.parse(data.function.arguments);

  switch(data.function.name) {
    case "pronunciation_feedback":
      this.handlePronunciationFeedback(args);
      break;
    case "update_difficulty":
      this.updateDifficultyLevel(args);
      break;
  }
}
```

---

## 🔧 Function Definitions

### WCPM Assessment Functions
```typescript
const wcpmFunctions = [
  {
    name: "pronunciation_feedback",
    description: "Analyze and provide feedback on word pronunciation",
    parameters: {
      type: "object",
      properties: {
        word: {
          type: "string",
          description: "The word being evaluated"
        },
        confidence: {
          type: "number",
          description: "Confidence score 0-1"
        },
        needsCorrection: {
          type: "boolean",
          description: "Whether to provide verbal correction"
        },
        position: {
          type: "number",
          description: "Word position in passage"
        }
      },
      required: ["word", "confidence", "needsCorrection"]
    }
  },
  {
    name: "reading_progress",
    description: "Track reading progress through passage",
    parameters: {
      type: "object",
      properties: {
        currentWord: {
          type: "number",
          description: "Current word index"
        },
        wordsPerMinute: {
          type: "number",
          description: "Current WPM calculation"
        },
        errors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              word: { type: "string" },
              type: { type: "string" }
            }
          }
        }
      }
    }
  },
  {
    name: "update_visual_feedback",
    description: "Update visual indicators in UI",
    parameters: {
      type: "object",
      properties: {
        wordIndex: {
          type: "number"
        },
        feedbackType: {
          type: "string",
          enum: ["correct", "error", "warning", "skipped"]
        },
        message: {
          type: "string",
          description: "Optional message to display"
        }
      }
    }
  }
];
```

### Adaptive Learning Functions
```typescript
const adaptiveFunctions = [
  {
    name: "adjust_difficulty",
    description: "Adjust guidance level based on performance",
    parameters: {
      type: "object",
      properties: {
        currentLevel: {
          type: "string",
          enum: ["learning", "practicing", "mastering", "struggling"]
        },
        suggestedLevel: {
          type: "string",
          enum: ["learning", "practicing", "mastering", "struggling"]
        },
        reason: {
          type: "string"
        },
        metrics: {
          type: "object",
          properties: {
            successRate: { type: "number" },
            hintsUsed: { type: "number" },
            timeSpent: { type: "number" }
          }
        }
      }
    }
  },
  {
    name: "trigger_intervention",
    description: "Request teacher intervention for struggling student",
    parameters: {
      type: "object",
      properties: {
        severity: {
          type: "string",
          enum: ["low", "medium", "high"]
        },
        reason: {
          type: "string"
        },
        strugglingAreas: {
          type: "array",
          items: { type: "string" }
        }
      }
    }
  }
];
```

---

## 🔐 Security Considerations

### API Key Management
```typescript
// Never expose API keys client-side
// Use Edge Functions for token generation

// Supabase Edge Function (Secure)
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Client-side (Never do this)
// ❌ const API_KEY = "sk-..."; // NEVER!
```

### Session Security
1. **Token Expiry**: 60 seconds
2. **Session Timeout**: 20 seconds max
3. **Rate Limiting**: 10 sessions/day/student
4. **IP Restrictions**: School network only (optional)

### Data Privacy
```typescript
// Anonymize all stored data
function anonymizeTranscription(text: string): string {
  return text
    .replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]')
    .replace(/\b\d{3,}\b/g, '[NUMBER]')
    .replace(/\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
}

// Never store raw audio
// Delete transcriptions after 30 days
// Encrypt sensitive data at rest
```

---

## 📊 Error Handling

### Connection Errors
```typescript
class ErrorHandler {
  static handle(error: any): void {
    switch(error.code) {
      case 'NotAllowedError':
        // Microphone permission denied
        this.showMicrophonePermissionDialog();
        break;

      case 'NetworkError':
        // Connection failed
        this.fallbackToTextMode();
        break;

      case 'QuotaExceededError':
        // Budget exceeded
        this.switchToMinimalMode();
        break;

      default:
        console.error('Unexpected error:', error);
        this.reportError(error);
    }
  }

  static async fallbackToTextMode() {
    // Graceful degradation to text hints
    const hints = await this.getTextHints();
    this.displayTextHints(hints);
  }
}
```

### Rate Limiting
```typescript
interface RateLimitResponse {
  error: {
    type: "rate_limit_exceeded";
    message: string;
    retry_after: number; // seconds
  };
}

// Handle rate limits
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  await this.delay(parseInt(retryAfter) * 1000);
  return this.retry();
}
```

---

## 🧪 Testing Endpoints

### Development Environment
```
wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17
```

### Mock Server (Local Testing)
```typescript
// Use mock server for development
const MOCK_SERVER = process.env.NODE_ENV === 'development'
  ? 'ws://localhost:8080/mock-realtime'
  : 'wss://api.openai.com/v1/realtime';
```

---

## 📈 Monitoring & Analytics

### Session Metrics
```typescript
interface SessionMetrics {
  sessionId: string;
  duration: number;
  tokenCount: {
    input: number;
    output: number;
  };
  audioData: {
    inputSeconds: number;
    outputSeconds: number;
  };
  interactions: {
    userMessages: number;
    aiResponses: number;
    functionCalls: number;
  };
  errors: Array<{
    timestamp: number;
    type: string;
    message: string;
  }>;
  cost: {
    audio: number;
    tokens: number;
    total: number;
  };
}
```

### Logging Requirements
```typescript
// Log all API interactions
logger.info('Session started', {
  sessionId,
  studentId,
  activityId,
  timestamp: Date.now()
});

// Track performance metrics
logger.metric('session.duration', duration);
logger.metric('session.cost', cost);
logger.metric('session.tokenCount', tokenCount);

// Monitor errors
logger.error('API error', {
  error,
  sessionId,
  recoveryAction
});
```

---

## 🔄 Versioning Strategy

### API Version Management
```typescript
const API_VERSIONS = {
  current: "2024-12-17",
  fallback: "2024-10-01",
  deprecated: ["2024-08-01"]
};

// Version selection
const selectApiVersion = (): string => {
  if (isFeatureEnabled('latest_api')) {
    return API_VERSIONS.current;
  }
  return API_VERSIONS.fallback;
};
```

---

*Last Updated: October 25, 2025*
