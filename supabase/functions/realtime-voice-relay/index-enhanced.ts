import { createServer } from "node:http";
import { WebSocketServer } from "npm:ws";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const server = createServer();
const wss = new WebSocketServer({
  noServer: true,
  perMessageDeflate: false, // Disable compression for lower latency
  maxPayload: 10 * 1024 * 1024 // 10MB max payload
});

// Connection tracking for monitoring
const activeConnections = new Map<string, {
  studentId: string;
  startTime: number;
  lastActivity: number;
  audioInputTokens: number;
  audioOutputTokens: number;
}>();

server.on("upgrade", async (req, socket, head) => {
  console.log("[Relay-Enhanced] Upgrade request received");

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const jwt = url.searchParams.get('jwt');
  const studentId = url.searchParams.get('student_id');
  const language = url.searchParams.get('language') || 'es-PR';
  const model = url.searchParams.get('model') || 'gpt-4o-realtime-preview-2024-12-17';

  console.log(`[Relay-Enhanced] Auth check - JWT: ${jwt ? 'present' : 'missing'}, Student: ${studentId}, Language: ${language}, Model: ${model}`);

  if (!jwt) {
    console.error("[Relay-Enhanced] No JWT token provided");
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  // Set socket options for better performance
  socket.setNoDelay(true); // Disable Nagle's algorithm
  socket.setKeepAlive(true, 10000); // Keep-alive every 10 seconds

  wss.handleUpgrade(req, socket, head, (ws) => {
    console.log("[Relay-Enhanced] WebSocket upgraded successfully");
    wss.emit('connection', ws, req, { studentId, language, model });
  });
});

wss.on("connection", async (clientWS: any, req: any, context: any) => {
  const { studentId, language, model } = context;
  const connectionId = `${studentId}-${Date.now()}`;

  console.log(`[Relay-Enhanced] WebSocket connection established - ID: ${connectionId}`);

  if (!OPENAI_API_KEY) {
    console.error("[Relay-Enhanced] OPENAI_API_KEY not configured");
    clientWS.close(1008, 'OpenAI API key not configured');
    return;
  }

  // Track connection
  activeConnections.set(connectionId, {
    studentId,
    startTime: Date.now(),
    lastActivity: Date.now(),
    audioInputTokens: 0,
    audioOutputTokens: 0
  });

  console.log(`[Relay-Enhanced] Connecting to OpenAI Realtime API with model: ${model}...`);

  const openaiWS = new WebSocket(
    `wss://api.openai.com/v1/realtime?model=${model}`,
    [
      'realtime',
      `openai-insecure-api-key.${OPENAI_API_KEY}`,
      'openai-beta.realtime-v1'
    ]
  );

  let isOpenAIConnected = false;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let audioBuffer: string[] = [];
  let bufferTimer: NodeJS.Timeout | null = null;

  openaiWS.addEventListener('open', () => {
    console.log("[Relay-Enhanced] ✅ Connected to OpenAI Realtime API");
    isOpenAIConnected = true;

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
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        temperature: 0.8,
        max_response_output_tokens: 4096,
        // Add audio optimization settings
        tools: [],
        tool_choice: 'none'
      }
    };

    console.log("[Relay-Enhanced] Sending optimized session configuration");
    openaiWS.send(JSON.stringify(sessionConfig));

    // Start heartbeat to maintain connection
    heartbeatInterval = setInterval(() => {
      if (openaiWS.readyState === WebSocket.OPEN) {
        openaiWS.ping();
      }
    }, 20000); // Ping every 20 seconds
  });

  openaiWS.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data as string);
      const connection = activeConnections.get(connectionId);

      if (connection) {
        connection.lastActivity = Date.now();
      }

      // Track token usage for cost monitoring
      if (message.type === 'response.audio.delta') {
        if (connection) {
          connection.audioOutputTokens += estimateTokensEnhanced(message.delta, 24000);
        }

        // Buffer audio data for smoother delivery
        audioBuffer.push(event.data as string);

        if (!bufferTimer) {
          bufferTimer = setTimeout(() => {
            if (audioBuffer.length > 0 && clientWS.readyState === WebSocket.OPEN) {
              // Send buffered audio in batch
              for (const data of audioBuffer) {
                clientWS.send(data);
              }
              audioBuffer = [];
            }
            bufferTimer = null;
          }, 50); // Send every 50ms for smooth playback
        }
      } else {
        // Forward non-audio messages immediately
        if (clientWS.readyState === WebSocket.OPEN) {
          clientWS.send(event.data);
        }

        // Log important events
        if (message.type === 'session.created' || message.type === 'session.updated') {
          console.log(`[Relay-Enhanced] ✅ ${message.type}`);
        } else if (message.type === 'conversation.item.input_audio_transcription.completed') {
          console.log(`[Relay-Enhanced] 🎤 Student: "${message.transcript}"`);
        } else if (message.type === 'response.audio_transcript.delta') {
          console.log(`[Relay-Enhanced] 🔊 AI: "${message.delta}"`);
        } else if (message.type === 'error') {
          console.error("[Relay-Enhanced] ❌ OpenAI error:", message.error);
        }
      }
    } catch (error) {
      console.error("[Relay-Enhanced] Error parsing OpenAI message:", error);
    }
  });

  clientWS.on('message', (data: any) => {
    try {
      const message = JSON.parse(data.toString());
      const connection = activeConnections.get(connectionId);

      if (connection) {
        connection.lastActivity = Date.now();
      }

      // Handle heartbeat from client
      if (message.type === 'ping') {
        clientWS.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      if (message.type === 'input_audio_buffer.append' && connection) {
        connection.audioInputTokens += estimateTokensEnhanced(message.audio, 24000);
      }

      // Forward to OpenAI if connected
      if (openaiWS.readyState === WebSocket.OPEN) {
        openaiWS.send(data.toString());
      } else {
        console.warn(`[Relay-Enhanced] Cannot forward message, OpenAI not connected`);
        // Try to reconnect if needed
        if (!isOpenAIConnected) {
          clientWS.close(1014, 'OpenAI connection lost');
        }
      }
    } catch (error) {
      console.error("[Relay-Enhanced] Error parsing client message:", error);
    }
  });

  const cleanup = async () => {
    // Clear intervals
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (bufferTimer) {
      clearTimeout(bufferTimer);
    }

    // Get connection stats
    const connection = activeConnections.get(connectionId);
    if (connection) {
      const sessionDuration = Date.now() - connection.startTime;
      const inputCost = (connection.audioInputTokens / 1000000) * 100; // Updated pricing
      const outputCost = (connection.audioOutputTokens / 1000000) * 200; // Updated pricing
      const totalCost = inputCost + outputCost;

      console.log(`[Relay-Enhanced] 📊 Session ended for ${connectionId}:
        Duration: ${(sessionDuration / 1000).toFixed(2)}s
        Input tokens: ${connection.audioInputTokens}
        Output tokens: ${connection.audioOutputTokens}
        Estimated cost: $${totalCost.toFixed(4)}`);

      // Remove from active connections
      activeConnections.delete(connectionId);
    }

    // Close OpenAI connection
    if (openaiWS.readyState === WebSocket.OPEN) {
      openaiWS.close();
    }
  };

  clientWS.on('close', (code: any, reason: any) => {
    console.log(`[Relay-Enhanced] Client disconnected - Code: ${code}, Reason: ${reason}`);
    cleanup();
  });

  openaiWS.addEventListener('close', (event) => {
    console.log(`[Relay-Enhanced] OpenAI disconnected - Code: ${event.code}`);
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.close(1014, 'OpenAI connection closed');
    }
  });

  clientWS.on('error', (error: any) => {
    console.error("[Relay-Enhanced] Client WebSocket error:", error);
    cleanup();
  });

  openaiWS.addEventListener('error', (error) => {
    console.error("[Relay-Enhanced] OpenAI WebSocket error:", error);
    isOpenAIConnected = false;
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.close(1011, 'OpenAI connection error');
    }
  });

  // Add pong handler for OpenAI
  openaiWS.addEventListener('pong', () => {
    console.log('[Relay-Enhanced] Received pong from OpenAI');
  });
});

function estimateTokensEnhanced(audioData: string, sampleRate: number): number {
  // More accurate token estimation based on actual sample rate
  const bytes = (audioData.length * 3) / 4; // Base64 to bytes
  const samples = bytes / 2; // PCM16 = 2 bytes per sample
  const seconds = samples / sampleRate;
  return Math.round(seconds * 100); // ~100 tokens per second of audio
}

// Monitor active connections
setInterval(() => {
  const now = Date.now();
  for (const [id, connection] of activeConnections) {
    const inactiveTime = now - connection.lastActivity;
    if (inactiveTime > 60000) { // 1 minute of inactivity
      console.warn(`[Relay-Enhanced] Connection ${id} inactive for ${inactiveTime}ms`);
    }
  }

  console.log(`[Relay-Enhanced] Active connections: ${activeConnections.size}`);
}, 30000); // Check every 30 seconds

const port = 8000;
server.listen(port, () => {
  console.log(`[Relay-Enhanced] WebSocket relay server running on port ${port}`);
  console.log(`[Relay-Enhanced] Ready to handle realtime voice connections with enhanced audio handling`);
});