# API Specification - Bilingual Realtime Demo

## Supabase Edge Function: `realtime-student-guide-token`

### Endpoint
`POST /functions/v1/realtime-student-guide-token`

### Request Format

```typescript
interface TokenRequest {
  language: 'es' | 'en';
  studentId?: string;
  sessionMetadata?: {
    grade?: string;
    activity?: string;
  };
}
```

### Example Request
```json
{
  "language": "es",
  "studentId": "student-123",
  "sessionMetadata": {
    "grade": "K",
    "activity": "demo-guide"
  }
}
```

### Response Format

```typescript
interface TokenResponse {
  id: string;
  client_secret: {
    value: string;
    expires_at: string;
  };
  model: string;
  voice: string;
  language: string;
  instructions: string;
}
```

### Example Response (Spanish)
```json
{
  "id": "sess_abc123",
  "client_secret": {
    "value": "eph_1234567890abcdef",
    "expires_at": "2024-01-01T12:00:00Z"
  },
  "model": "gpt-realtime-2025-08-28",
  "voice": "echo",
  "language": "es",
  "instructions": "Eres una guía de aprendizaje amigable..."
}
```

### Error Responses

```typescript
interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
}
```

#### Common Errors
- `400` - Invalid language parameter
- `429` - Rate limit exceeded
- `500` - OpenAI API error
- `503` - Service temporarily unavailable

## WebRTC Client API

### Class: `StudentGuideRealtimeClient`

#### Constructor
```typescript
constructor(options?: {
  onConnectionStateChange?: (state: ConnectionState) => void;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  onError?: (error: RealtimeError) => void;
  onLatencyUpdate?: (latency: number) => void;
})
```

#### Methods

##### `connect(ephemeralToken: string, language: 'es' | 'en'): Promise<void>`
Establishes WebRTC connection with OpenAI Realtime API.

**Parameters:**
- `ephemeralToken` - Token received from edge function
- `language` - Language configuration to use

**Throws:**
- `ConnectionError` - Failed to establish connection
- `AudioError` - Microphone access denied
- `TokenError` - Invalid or expired token

##### `disconnect(): Promise<void>`
Cleanly closes WebRTC connection and releases resources.

##### `sendMessage(text: string): void`
Sends text message through data channel.

**Parameters:**
- `text` - Message to send to AI guide

##### `setInstructions(instructions: string): void`
Updates AI instructions during active session.

##### `getCurrentLatency(): number`
Returns current round-trip latency in milliseconds.

##### `getConnectionStatus(): ConnectionState`
Returns current connection state.

#### Events

```typescript
enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  language: 'es' | 'en';
  confidence?: number;
}

interface RealtimeError {
  type: 'connection' | 'audio' | 'token' | 'network';
  message: string;
  code?: string;
  retryable: boolean;
}
```

## React Hook API

### Hook: `useStudentGuideRealtime`

#### Usage
```typescript
const {
  isConnected,
  isConnecting,
  transcript,
  error,
  latency,
  connect,
  disconnect,
  sendMessage,
  retry,
  clearTranscript
} = useStudentGuideRealtime(language);
```

#### Parameters
- `language: 'es' | 'en'` - Current language from LanguageContext

#### Return Value

```typescript
interface UseStudentGuideRealtimeReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionState: ConnectionState;
  
  // Transcript and conversation
  transcript: TranscriptEntry[];
  lastMessage: TranscriptEntry | null;
  
  // Error handling
  error: RealtimeError | null;
  
  // Performance metrics
  latency: number;
  audioLevel: number;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (text: string) => void;
  retry: () => Promise<void>;
  clearTranscript: () => void;
  
  // Audio controls
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
}
```

## OpenAI Realtime Events

### Client Events (Sent to OpenAI)

#### Initial Greeting Trigger
```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "Please introduce yourself and our learning platform"
      }
    ]
  }
}
```

#### Text Message
```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "User's text message here"
      }
    ]
  }
}
```

### Server Events (Received from OpenAI)

#### Transcript Updates
```json
{
  "type": "conversation.item.completed",
  "item": {
    "id": "item_123",
    "type": "message",
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "AI response text"
      }
    ]
  }
}
```

#### Audio Stream Events
```json
{
  "type": "response.audio.delta",
  "delta": "base64_audio_chunk"
}
```

## Rate Limiting

### Edge Function Limits
- **Per IP:** 10 requests per minute
- **Per Student ID:** 5 requests per minute
- **Global:** 1000 requests per minute

### WebRTC Connection Limits
- **Concurrent connections per IP:** 3
- **Session duration:** 15 minutes maximum
- **Reconnection cooldown:** 5 seconds

## Monitoring and Analytics

### Metrics Collected
- Connection success rate per language
- Average latency per language
- Error rates by type
- Session duration statistics
- Language switching frequency

### Health Check Endpoint
`GET /functions/v1/realtime-student-guide-token/health`

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "openai_status": "available",
  "supported_languages": ["es", "en"]
}