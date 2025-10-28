import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const log = (...args: unknown[]) => console.log("[Realtime-Demo]", ...args);
const warn = (...args: unknown[]) => console.warn("[Realtime-Demo]", ...args);
const error = (...args: unknown[]) => console.error("[Realtime-Demo]", ...args);

type DemoActivityRow = {
  id: string;
  title: string;
  description: string | null;
  demo_type: string;
  language: string;
  voice_guidance: string | null;
  content: Record<string, unknown> | string | null;
};

interface DemoSessionState {
  clientWS: WebSocket;
  openaiWS: WebSocket | null;
  supabase: SupabaseClient;
  demoActivity: DemoActivityRow;
  demoSessionId: string;
  studentId: string | null;
  language: string;
  voice: string;
  isReady: boolean;
  pendingMessages: string[];
  aiTranscriptBuffer: string[];
  telemetry: {
    connectionStart: number;
    sessionReady: number;
    audioChunksReceived: number;
    audioChunksForwarded: number;
    openaiEvents: number;
  };
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      error("Missing required environment variables");
      return new Response("Server misconfigured", { status: 500, headers: corsHeaders });
    }

    const upgrade = req.headers.get("upgrade") ?? "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket connection", { status: 400, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const demoActivityId = url.searchParams.get("demo_activity_id");
    const studentId = url.searchParams.get("student_id");
    const requestedLanguage = url.searchParams.get("language") ?? "es-PR";
    const requestedVoice = url.searchParams.get("voice") ?? "alloy";
    const explicitGuidance = url.searchParams.get("voice_guidance");

    log("📡 WebSocket upgrade request", {
      demoActivityId,
      studentId,
      language: requestedLanguage,
      voice: requestedVoice,
      hasGuidance: !!explicitGuidance
    });

    if (!demoActivityId) {
      warn("Missing demo_activity_id");
      return new Response("Missing demo_activity_id", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
      global: { headers: { "X-Client-Info": "realtime-voice-demo-relay" } },
    });

    const { data: demoActivity, error: activityError } = await supabase
      .from("demo_activities")
      .select("id, title, description, demo_type, language, voice_guidance, content")
      .eq("id", demoActivityId)
      .maybeSingle();

    if (activityError) {
      error("Failed to load demo activity", activityError);
      return new Response("Unable to load demo activity", { status: 500, headers: corsHeaders });
    }

    if (!demoActivity) {
      warn("Demo activity not found", demoActivityId);
      return new Response("Demo activity not found", { status: 404, headers: corsHeaders });
    }

    const voiceGuidance = explicitGuidance ?? demoActivity.voice_guidance ?? undefined;

    const sessionInsertPayload = {
      demo_activity_id: demoActivity.id,
      student_id: studentId,
      telemetry: {
        language: requestedLanguage,
        voice: requestedVoice,
        user_agent: req.headers.get("user-agent") ?? "unknown",
      },
      metadata: {
        source: "realtime-voice-demo-relay",
        demo_type: demoActivity.demo_type,
      },
    };

    const { data: sessionRow, error: sessionError } = await supabase
      .from("demo_voice_sessions")
      .insert(sessionInsertPayload)
      .select("id")
      .single();

    if (sessionError || !sessionRow) {
      error("Failed to create demo session", sessionError);
      return new Response("Failed to create demo session", { status: 500, headers: corsHeaders });
    }

    const { socket: clientWS, response } = Deno.upgradeWebSocket(req);

    const state: DemoSessionState = {
      clientWS,
      openaiWS: null,
      supabase,
      demoActivity,
      demoSessionId: sessionRow.id,
      studentId,
      language: requestedLanguage,
      voice: requestedVoice,
      isReady: false,
      pendingMessages: [],
      aiTranscriptBuffer: [],
      telemetry: {
        connectionStart: performance.now(),
        sessionReady: 0,
        audioChunksReceived: 0,
        audioChunksForwarded: 0,
        openaiEvents: 0,
      },
    };

    try {
      clientWS.send(JSON.stringify({
        type: "demo.session.created",
        demo_session_id: sessionRow.id,
        demo_activity_id: demoActivity.id,
        language: requestedLanguage,
      }));
    } catch (sendErr) {
      warn("Failed to send demo session metadata", sendErr);
    }

    connectToOpenAI(state, voiceGuidance);

    clientWS.onmessage = (event) => handleClientMessage(state, event);
    clientWS.onclose = () => handleClientClose(state);
    clientWS.onerror = (event) => {
      warn("Client WebSocket error", event);
      try {
        state.openaiWS?.close(1011, "Client error");
      } catch (_err) {
        // no-op
      }
    };

    return response;
  } catch (err) {
    error("Unexpected failure", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});

function connectToOpenAI(state: DemoSessionState, voiceGuidance?: string) {
  const model = "gpt-4o-realtime-preview-2024-10-01";
  log("🔌 Connecting to OpenAI Realtime API...", { model });
  
  const ws = new WebSocket(
    `wss://api.openai.com/v1/realtime?model=${model}`,
    [
      `openai-insecure-api-key.${OPENAI_API_KEY}`,
      "openai-beta.realtime-v1",
    ],
  );

  state.openaiWS = ws;

  ws.addEventListener("open", () => {
    log("✅ Connected to OpenAI Realtime API");
  });

  ws.addEventListener("message", (event) =>
    handleOpenAIMessage(state, event, voiceGuidance)
  );

  ws.addEventListener("close", (event) => {
    warn("❌ OpenAI WebSocket closed", event.code, event.reason);
    if (state.clientWS.readyState === WebSocket.OPEN) {
      try {
        state.clientWS.send(JSON.stringify({
          type: "error",
          message: `AI connection closed: ${event.reason || 'Unknown reason'}`,
          stage: "openai_close",
          code: event.code
        }));
      } catch (_) {}
      state.clientWS.close(1014, "OpenAI connection closed");
    }
    finalizeSession(state);
  });

  ws.addEventListener("error", (event) => {
    error("❌ OpenAI WebSocket error", event);
    if (state.clientWS.readyState === WebSocket.OPEN) {
      try {
        state.clientWS.send(JSON.stringify({
          type: "error",
          message: "AI connection error occurred",
          stage: "openai_error"
        }));
      } catch (_) {}
      state.clientWS.close(1011, "OpenAI error");
    }
    finalizeSession(state);
  });
}

function handleClientMessage(state: DemoSessionState, event: MessageEvent) {
  try {
    const { data } = event;
    if (typeof data !== "string") {
      warn("Ignoring non-string client message");
      return;
    }

    const parsed = JSON.parse(data);

    if (parsed.type === "ping") {
      state.clientWS.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
      return;
    }

    if (parsed.type === "input_audio_buffer.append") {
      state.telemetry.audioChunksReceived += 1;
    }

    if (state.isReady && state.openaiWS?.readyState === WebSocket.OPEN) {
      state.openaiWS.send(data);
    } else {
      state.pendingMessages.push(data);
      if (state.pendingMessages.length > 500) {
        state.pendingMessages.shift();
      }
    }
  } catch (err) {
    error("Failed to handle client message", err);
  }
}

function flushPendingMessages(state: DemoSessionState) {
  if (!state.openaiWS || state.openaiWS.readyState !== WebSocket.OPEN) return;

  for (const message of state.pendingMessages) {
    state.openaiWS.send(message);
  }
  state.pendingMessages = [];
}

function handleOpenAIMessage(
  state: DemoSessionState,
  event: MessageEvent,
  voiceGuidance?: string,
) {
  try {
    const raw = event.data;
    if (typeof raw !== "string") {
      warn("Ignoring non-string OpenAI message");
      return;
    }

    state.telemetry.openaiEvents += 1;

    const message = JSON.parse(raw);
    const type = message.type;

  if (type === "session.created") {
      log("✅ session.created received");
      sendSessionUpdate(state, voiceGuidance);
    } else if (type === "session.updated") {
      log("✅ session.updated - relay ready");
      state.isReady = true;
      state.telemetry.sessionReady = performance.now();
      flushPendingMessages(state);
    } else if (type === "response.output_audio.delta") {
      state.telemetry.audioChunksForwarded += 1;
    } else if (type === "response.output_audio_transcript.delta") {
      if (typeof message.delta === "string") {
        state.aiTranscriptBuffer.push(message.delta);
      }
    } else if (type === "response.output_audio_transcript.done") {
      if (state.aiTranscriptBuffer.length > 0) {
        const transcript = state.aiTranscriptBuffer.join("").trim();
        state.aiTranscriptBuffer = [];
        if (transcript.length > 0) {
          logDemoInteraction(state, {
            interaction_type: "assistant_transcript",
            transcript,
            metadata: {
              event: type,
              demo_type: state.demoActivity.demo_type,
            },
          });
        }
      }
    } else if (type === "conversation.item.input_audio_transcription.completed") {
      if (typeof message.transcript === "string" && message.transcript.trim().length > 0) {
        logDemoInteraction(state, {
          interaction_type: "user_transcript",
          transcript: message.transcript.trim(),
          metadata: {
            event: type,
            confidence: message.confidence ?? null,
          },
        });
      }
    } else if (type === "response.error" || type === "error") {
      warn("OpenAI reported error", message);
    }

    if (state.clientWS.readyState === WebSocket.OPEN) {
      state.clientWS.send(raw);
    }
  } catch (err) {
    error("Failed to process OpenAI message", err);
  }
}

function sendSessionUpdate(state: DemoSessionState, voiceGuidance?: string) {
  if (!state.openaiWS || state.openaiWS.readyState !== WebSocket.OPEN) return;

  const instructions = buildInstructions({
    activity: state.demoActivity,
    language: state.language,
    voiceGuidance,
  });

  const sessionUpdate = {
    type: "session.update",
    session: {
      modalities: ["text", "audio"],
      instructions,
      voice: state.voice,
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      turn_detection: {
        type: "server_vad",
        threshold: 0.55,
        prefix_padding_ms: 320,
        silence_duration_ms: 600,
        create_response: true,
      },
      input_audio_transcription: {
        model: "whisper-1",
      },
      temperature: 0.8,
      max_response_output_tokens: 4096,
    },
  };

  log("Sending session.update with GA schema");
  state.openaiWS.send(JSON.stringify(sessionUpdate));
}

function buildInstructions({
  activity,
  language,
  voiceGuidance,
}: {
  activity: DemoActivityRow;
  language: string;
  voiceGuidance?: string;
}): string {
  const base =
    language === "es-PR"
      ? `Eres un tutor de lectura puertorriqueño para estudiantes de primer grado (6-7 años). Habla con calidez, celebra los intentos y usa palabras locales como "chévere" y "lo lograste". Usa frases cortas (máximo 10 palabras).`
      : `You are an encouraging Grade 1 reading coach for 6-7 year olds. Speak warmly, celebrate effort, and use simple words. Keep phrases under 10 words.`;

  const demoSummary = [
    `Demo activity: ${activity.title}`,
    activity.description ? `Descripción: ${activity.description}` : null,
    `Tipo: ${activity.demo_type}`,
  ]
    .filter(Boolean)
    .join("\n");

  const activityContent =
    typeof activity.content === "string"
      ? activity.content
      : JSON.stringify(activity.content ?? {}, null, 2);

  const extraGuidance = voiceGuidance
    ? `\n\n### Voice Guidance\n${voiceGuidance}`
    : "";

  return `${base}

### Objetivo / Goal
${demoSummary}

### Activity Content (for instructor only)
${activityContent}${extraGuidance}

### Critical Rules
- Mantén la conversación segura y apropiada para niños.
- Alterna entre escuchar y guiar, deja pausas después de cada pregunta.
- Refuerza pronunciaciones y ritmo de lectura con paciencia.
- Evita referencias a la plataforma de producción.`
    .trim();
}

async function logDemoInteraction(
  state: DemoSessionState,
  payload: {
    interaction_type: string;
    transcript: string;
    metadata?: Record<string, unknown>;
  },
) {
  try {
    const { error: insertError } = await state.supabase.from("demo_interactions").insert({
      demo_session_id: state.demoSessionId,
      interaction_type: payload.interaction_type,
      transcript: payload.transcript,
      metadata: payload.metadata ?? {},
    });

    if (insertError) {
      warn("Failed to insert demo interaction", insertError);
    }
  } catch (err) {
    warn("Unexpected error inserting interaction", err);
  }
}

function handleClientClose(state: DemoSessionState) {
  log("Client disconnected");
  try {
    state.openaiWS?.close(1000, "Client disconnected");
  } catch (_err) {
    // no-op
  }
  finalizeSession(state);
}

async function finalizeSession(state: DemoSessionState) {
  try {
    const durationMs =
      state.telemetry.sessionReady > 0
        ? performance.now() - state.telemetry.sessionReady
        : 0;

    const telemetry = {
      ...state.telemetry,
      totalDurationMs: durationMs,
      disconnectedAt: new Date().toISOString(),
    };

    const { error: updateError } = await state.supabase
      .from("demo_voice_sessions")
      .update({
        ended_at: new Date().toISOString(),
        telemetry,
      })
      .eq("id", state.demoSessionId);

    if (updateError) {
      warn("Failed to update demo_voice_sessions on close", updateError);
    }
  } catch (err) {
    warn("Error finalizing session", err);
  }
}
