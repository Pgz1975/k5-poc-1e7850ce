import { AdaptiveJitterBuffer } from "./AdaptiveJitterBuffer";

export type DemoType =
  | "readflow"
  | "pronunciation"
  | "speed_quiz"
  | "voice_builder"
  | "spelling"
  | "writing"
  | "story";

export interface DemoFeatures {
  wordLevelTranscription?: boolean;
  functionCalling?: boolean;
  pronunciationAnalysis?: boolean;
  audioVisualization?: boolean;
}

export interface DemoConfig {
  demoActivityId: string;
  demoType: DemoType;
  features: DemoFeatures;
  studentId?: string;
  language?: "es-PR" | "en-US";
  voiceGuidance?: string;
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  edgeFunctionUrl?: string;
  onWordTranscription?: (word: string, timestamp: number, confidence: number) => void;
  onFunctionCall?: (name: string, args: any) => Promise<any>;
  onAudioVisualization?: (frequencyData: Uint8Array) => void;
}

type DemoEvent =
  | "connected"
  | "disconnected"
  | "error"
  | "audio-level"
  | "audio-playback"
  | "speech-started"
  | "speech-stopped"
  | "demo-session";

type DemoEventHandler<T = any> = (payload: T) => void;

interface FunctionCallEvent {
  call_id: string;
  name: string;
  arguments: string;
}

const DEFAULT_SAMPLE_RATE = 24000;
const PCM_CHUNK_SIZE = 2400; // 100ms of audio at 24kHz

export class ExperimentalVoiceClient {
  private config: DemoConfig;
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private visualizerFrame: number | null = null;
  private transcriptionBuffer: Array<{ word: string; timestamp: number; confidence: number }> = [];
  private functionCallHandlers: Map<string, (args: any) => Promise<any>> = new Map();
  private eventHandlers: Map<DemoEvent, Set<DemoEventHandler>> = new Map();
  private audioPlaybackQueue: Int16Array[] = [];
  private isPlayingAudio = false;
  // Server VAD handles turn detection - no manual commits needed
  private isAwaitingResponse = false;
  private isReady = false;
  private destroyed = false;
  private demoSessionId: string | null = null;
  // Track whether AI is currently responding to filter out AI speech transcriptions
  private isAIResponding = false;
  private studentSpeaking = false;
  private jitterBuffer: AdaptiveJitterBuffer | null = null;

  constructor(config: DemoConfig) {
    this.config = config;
    if (config.features.functionCalling && config.onFunctionCall) {
      this.registerFunctionHandler("__default__", (args) =>
        config.onFunctionCall!("__default__", args)
      );
    }
  }

  on<T = any>(event: DemoEvent, handler: DemoEventHandler<T>): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event)!;
    handlers.add(handler as DemoEventHandler);
    return () => handlers.delete(handler as DemoEventHandler);
  }

  off<T = any>(event: DemoEvent, handler: DemoEventHandler<T>): void {
    this.eventHandlers.get(event)?.delete(handler as DemoEventHandler);
  }

  private emit<T = any>(event: DemoEvent, payload: T): void {
    this.eventHandlers.get(event)?.forEach((handler) => {
      try {
        handler(payload);
      } catch (err) {
        console.error("[ExperimentalVoiceClient] Handler error", err);
      }
    });
  }

  async connect(): Promise<void> {
    if (this.ws || this.isReady) {
      await this.disconnect();
    }

    this.destroyed = false;
    await this.initializeAudio();
    await this.connectToDemo();
  }

  async disconnect(): Promise<void> {
    this.destroyed = true;
    this.isReady = false;
    this.isAwaitingResponse = false;
    this.audioPlaybackQueue = [];

    if (this.jitterBuffer) {
      this.jitterBuffer.clear();
      this.jitterBuffer = null;
    }

    if (this.visualizerFrame !== null) {
      cancelAnimationFrame(this.visualizerFrame);
      this.visualizerFrame = null;
    }

    if (this.audioWorklet) {
      this.audioWorklet.port.onmessage = null;
      this.audioWorklet.disconnect();
      this.audioWorklet = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (err) {
        console.warn("[ExperimentalVoiceClient] Failed to close AudioContext", err);
      } finally {
        this.audioContext = null;
      }
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close(1000, "Client disconnect");
    }
    this.ws = null;
    this.emit("disconnected", undefined);
  }

  sendText(text: string): void {
    if (!this.canSend()) {
      console.warn("[ExperimentalVoiceClient] Cannot send text – connection not ready");
      return;
    }

    this.ws!.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      }),
    );

    if (!this.isAwaitingResponse) {
      this.requestResponse();
    }
  }

  registerFunctionHandler(name: string, handler: (args: any) => Promise<any>): void {
    this.functionCallHandlers.set(name, handler);
  }

  clearTranscriptionHistory(): void {
    this.transcriptionBuffer = [];
  }

  getTranscriptionHistory() {
    return [...this.transcriptionBuffer];
  }

  private async initializeAudio(): Promise<void> {
    if (this.audioContext) return;

    const ctx = new AudioContext({ sampleRate: DEFAULT_SAMPLE_RATE });
    this.audioContext = ctx;

    // Initialize jitter buffer for smooth audio playback
    this.jitterBuffer = new AdaptiveJitterBuffer(ctx);

    const processorCode = `
      class PCM16CaptureProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
          this.bufferSize = ${PCM_CHUNK_SIZE};
          this.buffer = new Int16Array(this.bufferSize);
          this.bufferIndex = 0;
        }

        process(inputs) {
          const input = inputs[0];
          if (!input || !input[0]) return true;

          const inputChannel = input[0];
          for (let i = 0; i < inputChannel.length; i++) {
            const sample = Math.max(-1, Math.min(1, inputChannel[i]));
            const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            this.buffer[this.bufferIndex++] = int16Sample;

            if (this.bufferIndex >= this.bufferSize) {
              const out = this.buffer.slice(0, this.bufferIndex);
              this.port.postMessage({ type: 'audio', data: out }, [out.buffer]);
              this.bufferIndex = 0;
            }
          }
          return true;
        }
      }
      registerProcessor('pcm16-capture-processor', PCM16CaptureProcessor);
    `;

    const blob = new Blob([processorCode], { type: "application/javascript" });
    const moduleUrl = URL.createObjectURL(blob);
    await ctx.audioWorklet.addModule(moduleUrl);
    URL.revokeObjectURL(moduleUrl);

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: DEFAULT_SAMPLE_RATE,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const source = ctx.createMediaStreamSource(this.mediaStream);
    this.audioWorklet = new AudioWorkletNode(ctx, "pcm16-capture-processor");
    source.connect(this.audioWorklet);

    if (this.config.features.audioVisualization) {
      this.analyserNode = ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      source.connect(this.analyserNode);
      this.startVisualizationLoop();
    }

    this.audioWorklet.port.onmessage = (event) => {
      if (event.data?.type === "audio") {
        const chunk: Int16Array = event.data.data;
        this.handleCapturedSamples(chunk);
      }
    };
  }

  private async connectToDemo(): Promise<void> {
    const url = this.buildWebSocketUrl();
    console.log("[ExperimentalVoiceClient] 🔌 Connecting to WebSocket:", url);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      this.ws = ws;

      // Connection timeout - if no session.created within 5s, fail
      const connectionTimeout = setTimeout(() => {
        if (!this.isReady && this.ws === ws) {
          console.error("[ExperimentalVoiceClient] ⏱️ Connection timeout - no session.created received");
          reject(new Error("Connection timeout - no session established"));
          ws.close();
        }
      }, 5000);

      const rejectOnce = (err: unknown) => {
        clearTimeout(connectionTimeout);
        if (this.ws === ws) {
          reject(err);
        }
      };

      ws.onopen = () => {
        console.log("[ExperimentalVoiceClient] ✅ WebSocket opened", {
          readyState: ws.readyState,
          protocol: ws.protocol,
          url: ws.url
        });
        if (this.destroyed) {
          clearTimeout(connectionTimeout);
          ws.close();
          return;
        }
        resolve();
      };

      ws.onmessage = (event) => {
        console.log("[ExperimentalVoiceClient] 📨 Message received:", {
          dataType: typeof event.data,
          dataLength: event.data?.length,
          preview: event.data?.substring?.(0, 200)
        });
        this.handleMessage(event);
      };

      ws.onerror = (event) => {
        console.error("[ExperimentalVoiceClient] ❌ WebSocket error", {
          event,
          readyState: ws.readyState,
          url: ws.url
        });
        this.emit("error", new Error("Realtime connection error"));
        rejectOnce(new Error("Realtime connection error"));
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log("[ExperimentalVoiceClient] 🔌 WebSocket closed", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        this.isReady = false;
        this.emit("disconnected", undefined);
      };
    });
  }

  private buildWebSocketUrl(): string {
    if (this.config.edgeFunctionUrl) {
      return this.appendQueryParams(this.config.edgeFunctionUrl);
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("VITE_SUPABASE_URL environment variable is required for demo client");
    }

    const projectHost = supabaseUrl.replace("https://", "");
    const base = `wss://${projectHost}/functions/v1/realtime-voice-demo-relay`;
    return this.appendQueryParams(base);
  }

  private appendQueryParams(baseUrl: string): string {
    const params = new URLSearchParams();
    params.set("demo_activity_id", this.config.demoActivityId);
    params.set("language", this.config.language ?? "es-PR");
    params.set("voice", this.config.voice ?? "alloy");

    if (this.config.studentId) {
      params.set("student_id", this.config.studentId);
    }
    if (this.config.voiceGuidance) {
      params.set("voice_guidance", this.config.voiceGuidance);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  private handleMessage(event: MessageEvent) {
    if (typeof event.data !== "string") {
      console.warn("[ExperimentalVoiceClient] ⚠️ Non-string message data:", typeof event.data);
      return;
    }

    try {
      const message = JSON.parse(event.data);
      const type = message.type;
      
      // Only log important events, not every audio delta
      const shouldLog = !type.includes('audio.delta') && !type.includes('audio_transcript.delta');
      if (shouldLog) {
        console.log("[ExperimentalVoiceClient] 📥", type);
      }

      switch (type) {
        case "demo.session.created":
          console.log("[ExperimentalVoiceClient] 🎯 Demo session created:", message.demo_session_id);
          if (typeof message.demo_session_id === "string") {
            this.demoSessionId = message.demo_session_id;
            this.emit("demo-session", this.demoSessionId);
          }
          break;
        case "session.created":
          console.log("[ExperimentalVoiceClient] ✅ OpenAI session.created");
          this.sendSessionUpdate();
          break;
        case "session.updated":
          console.log("[ExperimentalVoiceClient] ✅ session.updated - ready");
          if (!this.isReady) {
            this.isReady = true;
            this.emit("connected", undefined);
          }
          break;
        case "input_audio_buffer.speech_started":
          console.log("[ExperimentalVoiceClient] 🎤 Student started speaking");
          this.studentSpeaking = true;
          this.emit("speech-started", undefined);
          break;
        case "input_audio_buffer.speech_stopped":
          console.log("[ExperimentalVoiceClient] 🛑 Student stopped speaking");
          this.studentSpeaking = false;
          this.emit("speech-stopped", undefined);
          break;
        case "response.created":
          console.log("[ExperimentalVoiceClient] 🤖 AI response started");
          this.isAIResponding = true;
          break;
        case "response.audio.delta":
        case "response.output_audio.delta":
          if (typeof message.delta === "string") {
            this.queueAudioPlayback(this.base64ToPCM16(message.delta));
          }
          break;
        case "response.audio.done":
        case "response.output_audio.done":
        case "response.completed":
        case "response.done":
          console.log("[ExperimentalVoiceClient] ✅ AI response complete");
          this.isAwaitingResponse = false;
          this.isAIResponding = false;
          if (!this.isPlayingAudio) {
            this.emit("audio-playback", false);
          }
          break;
        case "response.audio_transcript.delta":
        case "response.output_audio_transcript.delta":
          // AI speech - ignore for pronunciation matching
          if (typeof message.delta === "string") {
            console.log("[ExperimentalVoiceClient] 🤖 Ignoring AI speech:", message.delta);
          }
          break;
        case "response.audio_transcript.done":
        case "response.output_audio_transcript.done":
          break;
        case "conversation.item.input_audio_transcription.completed":
          // CRITICAL: Only process student speech, not AI responses
          if (this.isAIResponding) {
            console.log("[ExperimentalVoiceClient] 🤖 Ignoring AI transcription:", message.transcript);
            break;
          }
          
          console.log(`[ExperimentalVoiceClient] 🎤 Student transcription completed:`, {
            transcript: message.transcript,
            confidence: message.confidence,
          });
          
          if (message.transcript) {
            const cleaned = message.transcript.toLowerCase().trim();
            // Extract confidence from logprob if available (Whisper provides this)
            const confidence = this.extractConfidenceFromMessage(message);
            
            console.log(`[ExperimentalVoiceClient] 🔍 Triggering onWordTranscription with: "${cleaned}" (confidence: ${confidence})`);
            this.config.onWordTranscription?.(cleaned, performance.now(), confidence);
            this.transcriptionBuffer.push({
              word: cleaned,
              timestamp: performance.now(),
              confidence,
            });
          }
          break;
        case "response.function_call_arguments.done":
          this.handleFunctionCall(message as FunctionCallEvent);
          break;
        case "error":
        case "response.error":
          this.emit("error", new Error(message.error?.message ?? "Realtime API error"));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("[ExperimentalVoiceClient] Failed to parse message", err);
    }
  }

  getDemoSessionId(): string | null {
    return this.demoSessionId;
  }

  private extractConfidenceFromMessage(message: any): number {
    // Try to extract confidence from Whisper's logprob
    // Whisper provides avg_logprob in the usage field
    if (message.usage?.avg_logprob !== undefined) {
      // Convert logprob to confidence (0-1 scale)
      // logprobs typically range from -5 (low confidence) to 0 (high confidence)
      const avgLogprob = message.usage.avg_logprob;
      const confidence = Math.max(0, Math.min(1, Math.exp(avgLogprob)));
      console.log(`[ExperimentalVoiceClient] 📊 Whisper logprob: ${avgLogprob.toFixed(2)}, confidence: ${confidence.toFixed(2)}`);
      return confidence;
    }
    
    // Fallback to provided confidence or default
    return message.confidence ?? 0.9;
  }

  private queueAudioPlayback(chunk: Int16Array) {
    if (!this.jitterBuffer) {
      // Fallback to direct playback if jitter buffer not initialized
      this.audioPlaybackQueue.push(chunk);
      if (!this.isPlayingAudio) {
        this.playNextAudioChunk();
      }
      return;
    }

    // Add to jitter buffer for smooth playback
    this.jitterBuffer.addChunk(chunk, Date.now());
    
    if (!this.isPlayingAudio) {
      this.isPlayingAudio = true;
      this.emit("audio-playback", true);
    }
  }

  private playNextAudioChunk() {
    if (!this.audioContext) return;
    const chunk = this.audioPlaybackQueue.shift();
    if (!chunk) {
      this.isPlayingAudio = false;
      this.emit("audio-playback", false);
      return;
    }

    this.isPlayingAudio = true;
    const float32 = new Float32Array(chunk.length);
    for (let i = 0; i < chunk.length; i++) {
      float32[i] = chunk[i] / 32768;
    }

    const buffer = this.audioContext.createBuffer(1, float32.length, DEFAULT_SAMPLE_RATE);
    buffer.copyToChannel(float32, 0, 0);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.onended = () => this.playNextAudioChunk();
    source.start();
    this.emit("audio-playback", true);
  }

  private handleCapturedSamples(chunk: Int16Array) {
    if (chunk.length === 0) return;

    const audioLevel = this.calculateDbLevel(chunk);
    this.emit("audio-level", audioLevel);

    if (!this.canSend()) return;

    const base64 = this.pcm16ToBase64(chunk);
    this.ws!.send(
      JSON.stringify({
        type: "input_audio_buffer.append",
        audio: base64,
      }),
    );

    // No manual commits - server VAD handles turn detection
  }


  private requestResponse() {
    if (!this.canSend()) return;
    this.isAwaitingResponse = true;
    this.ws!.send(JSON.stringify({ type: "response.create" }));
  }

  private pcm16ToBase64(chunk: Int16Array): string {
    const buffer = new ArrayBuffer(chunk.length * 2);
    const view = new DataView(buffer);
    chunk.forEach((sample, index) => view.setInt16(index * 2, sample, true));
    const uint8 = new Uint8Array(buffer);
    let binary = "";
    uint8.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  private base64ToPCM16(base64: string): Int16Array {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int16Array(buffer);
  }

  private calculateDbLevel(samples: Int16Array): number {
    if (!samples.length) return -100;
    let sumSquares = 0;
    for (let i = 0; i < samples.length; i++) {
      const normalized = samples[i] / 32768;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / samples.length);
    if (rms <= 1e-6) return -100;
    return 20 * Math.log10(rms);
  }

  private sendSessionUpdate() {
    if (!this.canSend()) return;

    const sessionUpdate = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: this.buildInstructions(),
        voice: this.config.voice ?? "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        turn_detection: {
          type: "server_vad",
          threshold: 0.55,
          prefix_padding_ms: 320,
          silence_duration_ms: 600,
          create_response: true,
        },
        input_audio_transcription: this.config.features.wordLevelTranscription
          ? { model: "whisper-1" }
          : undefined,
        tools: this.buildFunctionTools(),
        tool_choice: this.config.features.functionCalling ? "auto" : undefined,
        temperature: 0.8,
        max_response_output_tokens: 4096,
      },
    };

    this.ws!.send(JSON.stringify(sessionUpdate));
  }

  private buildInstructions(): string {
    const language = this.config.language ?? "es-PR";
    const base =
      language === "es-PR"
        ? `Eres un tutor amistoso para estudiantes de primer grado (6-7 años) en Puerto Rico. Usa frases cortas (máximo 10 palabras), celebra los intentos y habla con acento boricua natural.`
        : `You are a warm Grade 1 tutor for 6-7 year olds. Use short phrases (max 10 words) and celebrate effort.`;

    const voiceGuidance = this.config.voiceGuidance
      ? `\n\n### Voice Guidance\n${this.config.voiceGuidance}`
      : "";

    const demoContext = `\n\n### Demo Context\n- Activity type: ${this.config.demoType}\n- Demo activity id: ${this.config.demoActivityId}\n- Maintain friendly, age-appropriate tone.\n- Never mention production systems or databases.\n`;

    return `${base}${voiceGuidance}${demoContext}`.trim();
  }

  private buildFunctionTools(): any[] | undefined {
    if (!this.config.features.functionCalling) return undefined;

    if (this.config.demoType === "voice_builder") {
      return [
        {
          type: "function",
          function: {
            name: "move_item",
            description: "Move a draggable item within the playground",
            parameters: {
              type: "object",
              properties: {
                item: { type: "string" },
                position: { type: "string", enum: ["left", "right", "up", "down"] },
              },
              required: ["item", "position"],
            },
          },
        },
      ];
    }

    return [];
  }

  private async handleFunctionCall(event: FunctionCallEvent) {
    const { call_id, name, arguments: args } = event;
    let handler = this.functionCallHandlers.get(name);

    if (!handler) {
      handler = this.functionCallHandlers.get("__default__");
    }

    if (!handler) {
      this.sendFunctionResult(call_id, { error: `No handler registered for ${name}` });
      return;
    }

    try {
      const parsedArgs = args ? JSON.parse(args) : {};
      const result = await handler(parsedArgs);
      this.sendFunctionResult(call_id, result ?? { ok: true });
    } catch (err) {
      console.error("[ExperimentalVoiceClient] Function call error", err);
      this.sendFunctionResult(call_id, { error: (err as Error).message });
    }
  }

  private sendFunctionResult(callId: string, result: any) {
    if (!this.canSend()) return;

    this.ws!.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(result),
        },
      }),
    );

    this.requestResponse();
  }

  private canSend(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN && this.isReady && !this.destroyed;
  }

  private startVisualizationLoop() {
    if (!this.analyserNode) return;

    const analyser = this.analyserNode;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!this.analyserNode) return;
      this.analyserNode.getByteFrequencyData(data);
      if (this.config.onAudioVisualization) {
        this.config.onAudioVisualization(new Uint8Array(data));
      }
      this.visualizerFrame = requestAnimationFrame(draw);
    };

    this.visualizerFrame = requestAnimationFrame(draw);
  }
}
