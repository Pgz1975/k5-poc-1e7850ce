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
  apiKey?: string;
  accessToken?: string;
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
  private samplesSinceCommit = 0;
  private lastCommitTime = 0;
  private commitIntervalMs = 750;
  private isAwaitingResponse = false;
  private isReady = false;
  private destroyed = false;
  private demoSessionId: string | null = null;

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
    this.samplesSinceCommit = 0;
    this.lastCommitTime = 0;
    this.audioPlaybackQueue = [];

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

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      this.ws = ws;

      const rejectOnce = (err: unknown) => {
        if (this.ws === ws) {
          reject(err);
        }
      };

      ws.onopen = () => {
        if (this.destroyed) {
          ws.close();
          return;
        }
        resolve();
      };

      ws.onmessage = (event) => this.handleMessage(event);
      ws.onerror = (event) => {
        console.error("[ExperimentalVoiceClient] WebSocket error", event);
        this.emit("error", new Error("Realtime connection error"));
        rejectOnce(new Error("Realtime connection error"));
      };

      ws.onclose = () => {
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
    if (this.config.apiKey) {
      params.set("apikey", this.config.apiKey);
    }
    if (this.config.accessToken) {
      params.set("access_token", this.config.accessToken);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  private handleMessage(event: MessageEvent) {
    if (typeof event.data !== "string") return;

    try {
      const message = JSON.parse(event.data);
      const type = message.type;

      switch (type) {
        case "demo.session.created":
          if (typeof message.demo_session_id === "string") {
            this.demoSessionId = message.demo_session_id;
            this.emit("demo-session", this.demoSessionId);
          }
          break;
        case "session.created":
          this.sendSessionUpdate();
          break;
        case "session.updated":
          if (!this.isReady) {
            this.isReady = true;
            this.emit("connected", undefined);
          }
          break;
        case "input_audio_buffer.speech_started":
          this.emit("speech-started", undefined);
          break;
        case "input_audio_buffer.speech_stopped":
          this.emit("speech-stopped", undefined);
          break;
        case "response.output_audio.delta":
          if (typeof message.delta === "string") {
            this.queueAudioPlayback(this.base64ToPCM16(message.delta));
          }
          break;
        case "response.output_audio.done":
        case "response.completed":
        case "response.done":
          this.isAwaitingResponse = false;
          if (!this.isPlayingAudio) {
            this.emit("audio-playback", false);
          }
          break;
        case "response.output_audio_transcript.delta":
          if (typeof message.delta === "string") {
            this.processTranscriptionDelta(message.delta);
          }
          break;
        case "response.output_audio_transcript.done":
          break;
        case "conversation.item.input_audio_transcription.completed":
          if (message.transcript) {
            this.transcriptionBuffer.push({
              word: message.transcript,
              timestamp: performance.now(),
              confidence: message.confidence ?? 0.9,
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

  private processTranscriptionDelta(delta: string) {
    if (!delta?.trim()) return;
    const words = delta.trim().split(/\s+/);
    const timestamp = performance.now();

    for (const rawWord of words) {
      const cleaned = rawWord.toLowerCase().replace(/[^\w\sáéíóúñü]/gi, "");
      if (cleaned) {
        const entry = { word: cleaned, timestamp, confidence: 0.9 };
        this.transcriptionBuffer.push(entry);
        this.config.onWordTranscription?.(entry.word, entry.timestamp, entry.confidence);
      }
    }
  }

  private queueAudioPlayback(chunk: Int16Array) {
    this.audioPlaybackQueue.push(chunk);
    if (!this.isPlayingAudio) {
      this.playNextAudioChunk();
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

    this.samplesSinceCommit += chunk.length;
    const now = Date.now();
    if (
      this.samplesSinceCommit >= PCM_CHUNK_SIZE * 3 &&
      now - this.lastCommitTime >= this.commitIntervalMs
    ) {
      this.commitAudioBuffer();
    }
  }

  private commitAudioBuffer() {
    if (!this.canSend()) return;
    this.ws!.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
    this.samplesSinceCommit = 0;
    this.lastCommitTime = Date.now();
    if (!this.isAwaitingResponse) {
      this.requestResponse();
    }
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
        type: "realtime",
        model: "gpt-4o-realtime-preview-2024-10-01",
        modalities: ["text", "audio"],
        instructions: this.buildInstructions(),
        voice: this.config.voice ?? "alloy",
        audio: {
          input: { format: "pcm16", sample_rate: DEFAULT_SAMPLE_RATE },
          output: { format: "pcm16", sample_rate: DEFAULT_SAMPLE_RATE, voice: this.config.voice ?? "alloy" },
        },
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
