import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const log = (...args: any[]) => console.log('[Realtime-Relay]', ...args);
const warn = (...args: any[]) => console.warn('[Realtime-Relay]', ...args);
const error = (...args: any[]) => console.error('[Realtime-Relay]', ...args);

interface SessionState {
  openaiWS: WebSocket | null;
  clientWS: WebSocket;
  state: 'connecting' | 'session_creating' | 'session_created' | 'session_updating' | 'ready' | 'error';
  pendingMessages: string[];
  voiceGuidance: string | null;
  language: string;
  studentId: string;
  metrics: {
    connectionStart: number;
    sessionReady: number;
    chunksForwarded: number;
    audioChunksReceived: number;
  };
}

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const upgradeHeader = req.headers.get('upgrade') || '';
    if (upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket connection', { status: 400, headers: corsHeaders });
    }

    const { socket: clientWS, response } = Deno.upgradeWebSocket(req);
    const url = new URL(req.url);

    const voiceGuidance = url.searchParams.get('voice_guidance');
    const studentId = url.searchParams.get('student_id') ?? 'unknown';
    const language = url.searchParams.get('language') ?? 'es-PR';
    const model = url.searchParams.get('model') ?? 'gpt-4o-realtime-preview-2024-12-17';

    log('Upgrade request', { studentId, language, model, hasGuidance: !!voiceGuidance });

    if (!OPENAI_API_KEY) {
      error('OPENAI_API_KEY not configured');
      queueMicrotask(() => clientWS.close(1011, 'Server configuration error'));
      return response;
    }

    // Initialize session state
    const session: SessionState = {
      openaiWS: null,
      clientWS,
      state: 'connecting',
      pendingMessages: [],
      voiceGuidance,
      language,
      studentId,
      metrics: {
        connectionStart: performance.now(),
        sessionReady: 0,
        chunksForwarded: 0,
        audioChunksReceived: 0
      }
    };

    // Connect to OpenAI Realtime API
    session.openaiWS = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${model}`,
      [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1'
      ],
    );

    session.openaiWS.addEventListener('open', () => {
      log('✅ Connected to OpenAI Realtime API');
      session.state = 'session_creating';
    });

    session.openaiWS.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string);

        // CRITICAL: Forward audio immediately with ZERO delay
        if (msg.type === 'response.audio.delta') {
          if (session.clientWS.readyState === WebSocket.OPEN) {
            session.clientWS.send(event.data);
            session.metrics.chunksForwarded++;
          }
          return; // No further processing needed
        }

        // Forward all other messages immediately
        if (session.clientWS.readyState === WebSocket.OPEN) {
          session.clientWS.send(event.data);
        }

        // Handle session lifecycle
        if (msg.type === 'session.created') {
          log('✅ session.created');
          handleSessionCreated(session);
        } else if (msg.type === 'session.updated') {
          log('✅ session.updated');
          session.state = 'ready';
          session.metrics.sessionReady = performance.now();
          flushPendingMessages(session);
        } else if (msg.type === 'error') {
          error('OpenAI error:', msg.error);
          session.state = 'error';
        }
      } catch (e) {
        error('Error parsing OpenAI message:', e);
      }
    });

    session.openaiWS.addEventListener('close', (ev) => {
      warn('OpenAI closed:', ev.code, ev.reason);
      if (session.clientWS.readyState === WebSocket.OPEN) {
        session.clientWS.close(1014, 'OpenAI connection lost');
      }
    });

    session.openaiWS.addEventListener('error', (ev) => {
      error('OpenAI WebSocket error:', ev);
      if (session.clientWS.readyState === WebSocket.OPEN) {
        session.clientWS.close(1011, 'OpenAI error');
      }
    });

    session.clientWS.onmessage = (event) => {
      handleClientMessage(session, event);
    };

    session.clientWS.onclose = () => {
      log('Client disconnected');
      try { session.openaiWS?.close(); } catch (_) {}
      session.pendingMessages = [];
    };

    session.clientWS.onerror = (ev) => {
      error('Client WebSocket error:', ev);
      try { session.openaiWS?.close(); } catch (_) {}
    };

    return response;
  } catch (e) {
    error('Fatal error:', e);
    return new Response('Internal error', { status: 500, headers: corsHeaders });
  }
});

// Helper functions
function getBaseInstructions(language: string): string {
  if (language === 'es-PR') {
    return `Eres Coquí, un tutor de lectura amigable para niños de K-5 en Puerto Rico.
Tu rol es:
1. Escuchar a los estudiantes leer en español o inglés
2. Proporcionar retroalimentación gentil y alentadora sobre la pronunciación
3. Cambiar sin problemas entre español e inglés
4. Usar un tono cálido y paciente apropiado para jóvenes aprendices
5. Celebrar el progreso y el esfuerzo
6. Usar acento puertorriqueño natural, no mexicano ni castellano
7. Hablar despacio y claramente

Cuando un estudiante cometa un error de pronunciación:
- Primero, elogia su esfuerzo
- Demuestra gentilmente la pronunciación correcta
- Anímalos a intentarlo de nuevo
- Hazlo divertido y atractivo`;
  } else {
    return `You are Coquí, a friendly bilingual reading assistant for K-5 students in Puerto Rico.
Your role is to:
1. Listen to students reading in Spanish or English
2. Provide gentle, encouraging pronunciation feedback
3. Switch seamlessly between Spanish and English
4. Use a warm, patient tone appropriate for young learners
5. Celebrate progress and effort
6. Use clear American English appropriate for English Language Learners
7. Speak slowly and clearly

When a student makes a pronunciation error:
- First, praise their effort
- Gently demonstrate the correct pronunciation
- Encourage them to try again
- Make it fun and engaging`;
  }
}

function handleSessionCreated(session: SessionState): void {
  session.state = 'session_updating';

  // Build instructions with voice guidance injection
  const baseInstructions = getBaseInstructions(session.language);
  const fullInstructions = session.voiceGuidance
    ? `${baseInstructions}\n\nACTIVITY-SPECIFIC GUIDANCE:\n${session.voiceGuidance}`
    : baseInstructions;

  const sessionConfig = {
    type: 'session.update',
    session: {
      modalities: ['text', 'audio'],
      instructions: fullInstructions,
      voice: session.language === 'es-PR' ? 'alloy' : 'nova',
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        enabled: true,
        language: session.language === 'es-PR' ? 'es' : 'en',
        model: 'whisper-1'
      },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500
      },
      temperature: 0.8,
      max_response_output_tokens: 4096,
      tools: [],
      tool_choice: 'none',
    },
  };

  log('Sending session.update with voice guidance');
  session.openaiWS!.send(JSON.stringify(sessionConfig));
}

function handleClientMessage(session: SessionState, event: MessageEvent): void {
  try {
    const msg = JSON.parse(event.data);

    // Handle heartbeat
    if (msg.type === 'ping') {
      session.clientWS.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      return;
    }

    // Queue or forward based on state
    if (session.state === 'ready' && session.openaiWS?.readyState === WebSocket.OPEN) {
      session.openaiWS.send(event.data);

      if (msg.type === 'input_audio_buffer.append') {
        session.metrics.audioChunksReceived++;
      }
    } else {
      session.pendingMessages.push(event.data);
      if (session.pendingMessages.length > 200) {
        session.pendingMessages.shift(); // Prevent memory overflow
      }
    }
  } catch (e) {
    error('Error parsing client message:', e);
  }
}

function flushPendingMessages(session: SessionState): void {
  if (session.pendingMessages.length > 0) {
    log(`Flushing ${session.pendingMessages.length} pending messages`);
    for (const buffered of session.pendingMessages) {
      try {
        session.openaiWS!.send(buffered);
      } catch (e) {
        error('Error flushing message:', e);
      }
    }
    session.pendingMessages = [];
  }
}
