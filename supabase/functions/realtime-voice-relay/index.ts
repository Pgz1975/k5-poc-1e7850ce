import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const log = (...args: any[]) => console.log('[Realtime-Relay]', ...args);
const warn = (...args: any[]) => console.warn('[Realtime-Relay]', ...args);
const error = (...args: any[]) => console.error('[Realtime-Relay]', ...args);

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

    const jwt = url.searchParams.get('jwt');
    const studentId = url.searchParams.get('student_id') ?? 'unknown';
    const language = url.searchParams.get('language') ?? 'es-PR';
    const model = url.searchParams.get('model') ?? 'gpt-4o-realtime-preview-2024-12-17';

    log('Upgrade request', { jwt: !!jwt, studentId, language, model });

    if (!OPENAI_API_KEY) {
      error('OPENAI_API_KEY not configured');
      queueMicrotask(() => clientWS.close(1011, 'Server configuration error'));
      return response;
    }

    // Connect to OpenAI Realtime API
    const openaiWS = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${model}`,
      [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1'
      ],
    );

    let sessionConfigured = false;
    let pendingClientMessages: string[] = [];

    // Buffer audio deltas for smoother playback to client
    let audioBuffer: string[] = [];
    let bufferTimer: number | null = null;

    openaiWS.addEventListener('open', () => {
      log('✅ Connected to OpenAI Realtime API');
    });

    openaiWS.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string);

        if (msg.type === 'response.audio.delta') {
          // Batch-send audio chunks to the browser for smoother playback
          audioBuffer.push(event.data as string);
          if (!bufferTimer) {
            bufferTimer = setTimeout(() => {
              if (clientWS.readyState === WebSocket.OPEN && audioBuffer.length) {
                for (const data of audioBuffer) clientWS.send(data);
                audioBuffer = [];
              }
              bufferTimer = null;
            }, 50);
          }
          return; // Don't forward this again below
        }

        // Forward all non-audio messages immediately
        if (clientWS.readyState === WebSocket.OPEN) {
          clientWS.send(event.data);
        }

        if (msg.type === 'session.created') {
          log('✅ session.created');

          const instructions = language === 'es-PR'
            ? `Eres Coquí, un asistente bilingüe amigable para estudiantes de K-5 en Puerto Rico.
               Tu rol es:
               1. Escuchar a los estudiantes leer en español o inglés
               2. Proporcionar retroalimentación gentil y alentadora sobre la pronunciación
               3. Cambiar sin problemas entre español e inglés
               4. Usar un tono cálido y paciente apropiado para jóvenes aprendices
               5. Celebrar el progreso y el esfuerzo

               Cuando un estudiante cometa un error de pronunciación:
               - Primero, elogia su esfuerzo
               - Demuestra gentilmente la pronunciación correcta
               - Anímalos a intentarlo de nuevo
               - Hazlo divertido y atractivo`
            : `You are Coquí, a friendly bilingual reading assistant for K-5 students in Puerto Rico.
               Your role is to:
               1. Listen to students reading in Spanish or English
               2. Provide gentle, encouraging pronunciation feedback
               3. Switch seamlessly between Spanish and English
               4. Use a warm, patient tone appropriate for young learners
               5. Celebrate progress and effort

               When a student makes a pronunciation error:
               - First, praise their effort
               - Gently demonstrate the correct pronunciation
               - Encourage them to try again
               - Make it fun and engaging`;

          const sessionConfig = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions,
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: { model: 'whisper-1' },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000,
              },
              temperature: 0.8,
              max_response_output_tokens: 4096,
              tools: [],
              tool_choice: 'none',
            },
          } as const;

          log('Sending session.update');
          openaiWS.send(JSON.stringify(sessionConfig));
        } else if (msg.type === 'session.updated') {
          log('✅ session.updated');
          sessionConfigured = true;
          if (pendingClientMessages.length) {
            log(`Flushing ${pendingClientMessages.length} buffered client messages`);
            for (const buffered of pendingClientMessages) {
              try { openaiWS.send(buffered); } catch (e) { error('Error flushing buffered message:', e); }
            }
            pendingClientMessages = [];
          }
        } else if (msg.type === 'error') {
          error('OpenAI error:', msg.error);
        }
      } catch (e) {
        error('Error parsing OpenAI message:', e);
      }
    });

    openaiWS.addEventListener('close', (ev) => {
      warn('OpenAI closed:', ev.code, ev.reason);
      if (clientWS.readyState === WebSocket.OPEN) {
        clientWS.close(1014, 'OpenAI connection lost');
      }
    });

    openaiWS.addEventListener('error', (ev) => {
      error('OpenAI WebSocket error:', ev);
      if (clientWS.readyState === WebSocket.OPEN) {
        clientWS.close(1011, 'OpenAI error');
      }
    });

    clientWS.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'ping') {
          clientWS.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Buffer until session is configured
        if (openaiWS.readyState === WebSocket.OPEN && sessionConfigured) {
          openaiWS.send(event.data);
        } else {
          warn('Buffering client message until session is ready');
          pendingClientMessages.push(event.data);
          if (pendingClientMessages.length > 200) pendingClientMessages.shift();
        }
      } catch (e) {
        error('Error parsing client message:', e);
      }
    };

    clientWS.onclose = () => {
      log('Client disconnected');
      try { openaiWS.close(); } catch (_) {}
      if (bufferTimer) clearTimeout(bufferTimer);
      pendingClientMessages = [];
      sessionConfigured = false;
      audioBuffer = [];
    };

    clientWS.onerror = (ev) => {
      error('Client WebSocket error:', ev);
      try { openaiWS.close(); } catch (_) {}
    };

    return response;
  } catch (e) {
    error('Fatal error:', e);
    return new Response('Internal error', { status: 500, headers: corsHeaders });
  }
});
