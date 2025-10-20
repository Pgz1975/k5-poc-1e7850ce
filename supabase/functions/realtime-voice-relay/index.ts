import { createServer } from "node:http";
import { WebSocketServer } from "npm:ws";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req, socket, head) => {
  console.log("[Relay] Upgrade request received");
  
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const jwt = url.searchParams.get('jwt');
  const studentId = url.searchParams.get('student_id');
  const language = url.searchParams.get('language') || 'es-PR';

  console.log(`[Relay] Auth check - JWT: ${jwt ? 'present' : 'missing'}, Student: ${studentId}, Language: ${language}`);

  if (!jwt) {
    console.error("[Relay] No JWT token provided");
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    console.log("[Relay] WebSocket upgraded successfully");
    wss.emit('connection', ws, req, { studentId, language });
  });
});

wss.on("connection", async (clientWS: any, req: any, context: any) => {
  const { studentId, language } = context;
  
  console.log(`[Relay] WebSocket connection established - Student: ${studentId}, Language: ${language}`);

  if (!OPENAI_API_KEY) {
    console.error("[Relay] OPENAI_API_KEY not configured");
    clientWS.close(1008, 'OpenAI API key not configured');
    return;
  }

  console.log("[Relay] Connecting to OpenAI Realtime API...");
  
  const openaiWS = new WebSocket(
    'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
    [
      'realtime',
      `openai-insecure-api-key.${OPENAI_API_KEY}`,
      'openai-beta.realtime-v1'
    ]
  );

  let audioInputTokens = 0;
  let audioOutputTokens = 0;
  let sessionStartTime = Date.now();
  let isOpenAIConnected = false;

  openaiWS.addEventListener('open', () => {
    console.log("[Relay] ✅ Connected to OpenAI Realtime API");
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
        max_response_output_tokens: 4096
      }
    };

    console.log("[Relay] Sending session configuration:", JSON.stringify(sessionConfig, null, 2));
    openaiWS.send(JSON.stringify(sessionConfig));
  });

  openaiWS.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data as string);
      
      // Log important events
      if (message.type === 'session.created') {
        console.log("[Relay] ✅ Session created");
      } else if (message.type === 'session.updated') {
        console.log("[Relay] ✅ Session updated");
      } else if (message.type === 'response.audio.delta') {
        audioOutputTokens += estimateTokens(message.delta);
      } else if (message.type === 'conversation.item.input_audio_transcription.completed') {
        console.log(`[Relay] 🎤 Student transcription: "${message.transcript}"`);
      } else if (message.type === 'response.audio_transcript.delta') {
        console.log(`[Relay] 🔊 AI response: "${message.delta}"`);
      } else if (message.type === 'error') {
        console.error("[Relay] ❌ OpenAI error:", message.error);
      } else {
        console.log(`[Relay] OpenAI event: ${message.type}`);
      }

      if (clientWS.readyState === WebSocket.OPEN) {
        clientWS.send(event.data);
      }
    } catch (error) {
      console.error("[Relay] Error parsing OpenAI message:", error);
    }
  });

  clientWS.on('message', (data: any) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'input_audio_buffer.append') {
        audioInputTokens += estimateTokens(message.audio);
      } else {
        console.log(`[Relay] Client event: ${message.type}`);
      }

      if (openaiWS.readyState === WebSocket.OPEN) {
        openaiWS.send(data.toString());
      } else {
        console.warn(`[Relay] Cannot forward message, OpenAI not connected (state: ${openaiWS.readyState})`);
      }
    } catch (error) {
      console.error("[Relay] Error parsing client message:", error);
    }
  });

  const cleanup = async () => {
    const sessionDuration = Date.now() - sessionStartTime;
    const inputCost = (audioInputTokens / 1000000) * 32;
    const outputCost = (audioOutputTokens / 1000000) * 64;
    const totalCost = inputCost + outputCost;

    console.log(`[Relay] 📊 Session ended:
      Duration: ${(sessionDuration / 1000).toFixed(2)}s
      Input tokens: ${audioInputTokens}
      Output tokens: ${audioOutputTokens}
      Cost: $${totalCost.toFixed(4)}`);

    if (openaiWS.readyState === WebSocket.OPEN) {
      openaiWS.close();
    }
  };

  clientWS.on('close', (code: any, reason: any) => {
    console.log(`[Relay] Client disconnected - Code: ${code}, Reason: ${reason}`);
    cleanup();
  });

  openaiWS.addEventListener('close', (event) => {
    console.log(`[Relay] OpenAI disconnected - Code: ${event.code}`);
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.close();
    }
  });

  clientWS.on('error', (error: any) => {
    console.error("[Relay] Client WebSocket error:", error);
    cleanup();
  });

  openaiWS.addEventListener('error', (error) => {
    console.error("[Relay] OpenAI WebSocket error:", error);
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.close(1011, 'OpenAI connection error');
    }
  });
});

function estimateTokens(audioData: string): number {
  const bytes = audioData.length * 0.75;
  const seconds = bytes / 48000;
  return Math.round(seconds * 100);
}

const port = 8000;
server.listen(port, () => {
  console.log(`[Relay] WebSocket relay server running on port ${port}`);
});
