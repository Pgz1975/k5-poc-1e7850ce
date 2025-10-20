# OpenAI Realtime API - Technical Implementation Plan

## Technology Stack

### Frontend
- **React** (existing)
- **TypeScript** (existing)
- **WebRTC API** (native browser)
- **Web Audio API** (native browser)

### Backend
- **Supabase Edge Functions** (existing infrastructure)
- **Deno runtime** (for edge functions)

### External Services
- **OpenAI Realtime API**
- **Model**: `gpt-realtime`

## File Structure

```
src/
├── components/
│   └── StudentDashboard/
│       └── AIMentorChat.tsx              (UPDATE)
├── utils/
│   ├── realtime/
│   │   ├── RealtimeClient.ts             (CREATE)
│   │   ├── AudioRecorder.ts              (CREATE)
│   │   ├── AudioPlayer.ts                (CREATE)
│   │   └── types.ts                      (CREATE)
│   └── supabase.ts                       (existing)
└── hooks/
    └── useRealtimeChat.ts                (CREATE)

supabase/
└── functions/
    └── generate-realtime-token/
        └── index.ts                      (CREATE)
```

## Implementation Steps

### Step 1: Backend - Token Generation Service

**File**: `supabase/functions/generate-realtime-token/index.ts`

This edge function will:
1. Verify user is authenticated
2. Generate ephemeral token from OpenAI
3. Return token to client
4. Log usage for monitoring

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Get user context (optional: for custom instructions)
    const { userRole, language } = await req.json();

    // Configure session based on user
    const sessionConfig = {
      session: {
        type: "realtime",
        model: "gpt-realtime",
        instructions: getInstructionsForRole(userRole, language),
        audio: {
          output: { voice: "nova" } // Friendly voice for education
        }
      }
    };

    // Request ephemeral token
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionConfig),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ token: data.value }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error generating token:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getInstructionsForRole(role: string, language: string): string {
  const instructions = {
    student: {
      es: "Eres un mentor AI amigable y paciente. Ayudas a estudiantes a aprender y mejorar sus habilidades de lectura. Usa un lenguaje simple y anima al estudiante.",
      en: "You are a friendly and patient AI mentor. You help students learn and improve their reading skills. Use simple language and encourage the student."
    },
    teacher: {
      es: "Eres un asistente AI para profesores. Ayudas con estrategias de enseñanza y análisis de progreso estudiantil.",
      en: "You are an AI assistant for teachers. You help with teaching strategies and student progress analysis."
    },
    family: {
      es: "Eres un asistente AI familiar. Ayudas a padres a entender el progreso de sus hijos y cómo apoyarlos.",
      en: "You are a family AI assistant. You help parents understand their children's progress and how to support them."
    }
  };

  return instructions[role]?.[language] || instructions.student.en;
}
```

### Step 2: Audio Recording Utility

**File**: `src/utils/realtime/AudioRecorder.ts`

```typescript
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) this.source.disconnect();
    if (this.processor) this.processor.disconnect();
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());
    if (this.audioContext) this.audioContext.close();
    
    this.source = null;
    this.processor = null;
    this.stream = null;
    this.audioContext = null;
  }
}

// Convert Float32Array to base64 PCM16
export function encodeAudioForAPI(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
}
```

### Step 3: WebRTC Client

**File**: `src/utils/realtime/RealtimeClient.ts`

This will be implemented in detail in `03-webrtc-integration.md`.

### Step 4: React Hook

**File**: `src/hooks/useRealtimeChat.ts`

```typescript
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeClient } from '@/utils/realtime/RealtimeClient';

export function useRealtimeChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  const clientRef = useRef<RealtimeClient | null>(null);

  const connect = useCallback(async (userRole: string, language: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get ephemeral token from backend
      const { data, error } = await supabase.functions.invoke(
        'generate-realtime-token',
        { body: { userRole, language } }
      );

      if (error) throw error;

      // Initialize WebRTC client
      clientRef.current = new RealtimeClient({
        token: data.token,
        onConnected: () => setIsConnected(true),
        onDisconnected: () => setIsConnected(false),
        onSpeakingChange: (speaking) => setIsSpeaking(speaking),
        onTranscript: (text) => setTranscript(prev => prev + text),
        onError: (err) => setError(err.message)
      });

      await clientRef.current.connect();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    clientRef.current = null;
    setIsConnected(false);
    setTranscript('');
  }, []);

  const sendText = useCallback((text: string) => {
    clientRef.current?.sendText(text);
  }, []);

  return {
    isConnected,
    isLoading,
    isSpeaking,
    error,
    transcript,
    connect,
    disconnect,
    sendText
  };
}
```

### Step 5: Update AIMentorChat Component

**File**: `src/components/StudentDashboard/AIMentorChat.tsx`

Key changes:
1. Replace demo messages with real conversation
2. Integrate `useRealtimeChat` hook
3. Add connection controls
4. Show real-time transcript
5. Visual indicators for speaking/listening

## Configuration Requirements

### Environment Variables (Already set)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### New Secrets Needed
- `OPENAI_API_KEY` (for edge function)

### Supabase Config
Update `supabase/config.toml`:
```toml
[functions.generate-realtime-token]
verify_jwt = true  # Require authentication
```

## Testing Strategy

1. **Unit Tests**: Audio encoding/decoding functions
2. **Integration Tests**: WebRTC connection flow
3. **Manual Tests**: 
   - Voice quality
   - Latency measurement
   - Error recovery
   - Multiple languages
4. **User Acceptance**: Beta test with students

## Performance Considerations

- **Audio Quality**: 24kHz, 16-bit PCM
- **Network**: Requires stable connection (adaptive quality not available)
- **Latency Target**: < 500ms end-to-end
- **Browser Support**: Modern browsers with WebRTC support

## Error Handling

1. **Microphone Permission Denied**: Show friendly message with instructions
2. **Network Failure**: Auto-reconnect with exponential backoff
3. **API Errors**: Display user-friendly error messages
4. **Token Expiration**: Request new token automatically

## Monitoring & Analytics

Track these metrics:
- Session duration
- Connection success rate
- Error frequency
- User satisfaction (optional feedback)

## Next Steps

1. Review WebRTC implementation details in `03-webrtc-integration.md`
2. Review security considerations in `04-backend-security.md`
3. Begin implementation with backend token service
