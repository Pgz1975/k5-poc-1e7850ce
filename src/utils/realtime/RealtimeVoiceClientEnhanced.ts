/**
 * Production-Grade Realtime Voice Client
 * Implements streaming-first architecture with adaptive buffering
 */

import { AdaptiveJitterBuffer } from './AdaptiveJitterBuffer';
import { ConnectionStateMachine } from './ConnectionStateMachine';
import { ReconnectionManager } from './ReconnectionManager';
import { HeartbeatManager } from './HeartbeatManager';
import { PerformanceMonitor } from './PerformanceMonitor';

export interface RealtimeVoiceConfig {
  studentId?: string;
  language?: string;
  model?: string;
  voiceGuidance?: string;
  activityId?: string;
  activityType?: string;
  contextPayload?: Record<string, unknown>;
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioPlayback?: (isPlaying: boolean) => void;
  onAudioLevel?: (dbLevel: number) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
  onResponseComplete?: () => void;
}

export class RealtimeVoiceClientEnhanced {
  public ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  private jitterBuffer: AdaptiveJitterBuffer | null = null;
  private stateMachine: ConnectionStateMachine;
  private reconnectionManager: ReconnectionManager;
  private heartbeatManager: HeartbeatManager;
  private performanceMonitor: PerformanceMonitor;
  private config: RealtimeVoiceConfig;
  private encoder = new TextEncoder();
  private currentTranscript = { user: '', ai: '' };
  private silenceStartTime: number | null = null;
  private isUserSpeaking = false;
  private audioGateThreshold = -45; // dB threshold for sending audio
  // Commit control
  private serverVADEnabled = true; // rely on server VAD; skip manual commits when true
  private appendedSamplesSinceLastCommit = 0;
  private minCommitSamples = 2400; // 100ms at 24kHz

  constructor(config: RealtimeVoiceConfig = {}) {
    this.config = config;
    this.stateMachine = new ConnectionStateMachine();
    this.reconnectionManager = new ReconnectionManager();
    this.heartbeatManager = new HeartbeatManager();
    this.performanceMonitor = PerformanceMonitor.getInstance();

    // Set up state listeners
    this.stateMachine.onState('ready', () => {
      console.log('[RealtimeVoiceClient] ✅ Ready state reached');
      this.config.onConnectionChange?.(true);
    });

    this.stateMachine.onState('disconnected', () => {
      console.log('[RealtimeVoiceClient] ❌ Disconnected');
      this.config.onConnectionChange?.(false);
    });
  }

  async connect(token?: string): Promise<void> {
    console.log('[RealtimeVoiceClient] 🚀 Starting connection...');
    
    if (!this.stateMachine.transition('connecting')) {
      console.warn('[RealtimeVoiceClient] Already connecting or connected');
      return;
    }

    try {
      // Initialize audio context
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      console.log('[RealtimeVoiceClient] 🎵 AudioContext created');
      
      this.jitterBuffer = new AdaptiveJitterBuffer(this.audioContext);
      this.jitterBuffer.onUnderrun(() => {
        this.performanceMonitor.recordBufferUnderrun();
        this.config.onAudioPlayback?.(false);
      });

      // Create inline AudioWorklet processor to avoid CORS issues
      const processorCode = `
        class PCM16CaptureProcessor extends AudioWorkletProcessor {
          constructor() {
            super();
            this.bufferSize = 2400;
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
                const dataToSend = this.buffer.slice(0, this.bufferIndex);
                this.port.postMessage({ type: 'audio', data: dataToSend });
                this.bufferIndex = 0;
              }
            }
            return true;
          }
        }
        registerProcessor('pcm16-capture-processor', PCM16CaptureProcessor);
      `;

      const blob = new Blob([processorCode], { type: 'application/javascript' });
      const processorUrl = URL.createObjectURL(blob);
      
      await this.audioContext.audioWorklet.addModule(processorUrl);
      URL.revokeObjectURL(processorUrl);
      console.log('[RealtimeVoiceClient] 🎛️ AudioWorklet loaded (inline)');

      // Setup microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('[RealtimeVoiceClient] 🎤 Microphone access granted');

      // Create audio worklet
      this.audioWorklet = new AudioWorkletNode(this.audioContext, 'pcm16-capture-processor');
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.audioWorklet);

      this.audioWorklet.port.onmessage = (event) => {
        if (event.data.type === 'audio') {
          const dbLevel = this.monitorAudioLevel(event.data.data);
          this.handleAudioGating(event.data.data, dbLevel);
        }
      };

      // Connect WebSocket
      await this.connectWebSocket();

      // Start heartbeat
      if (this.ws) {
        this.heartbeatManager.start(this.ws, () => {
          this.handleConnectionLost();
        });
      }

      console.log('[RealtimeVoiceClient] ✅ Connection complete');

    } catch (error) {
      console.error('[RealtimeVoiceClient] ❌ Connection error:', error);
      this.config.onError?.(error as Error);
      this.stateMachine.transition('error');
      throw error;
    }
  }

  private async connectWebSocket(): Promise<void> {
    const baseUrl = 'wss://meertwtenhlmnlpwxhyz.supabase.co/functions/v1/realtime-voice-relay';
    const params = new URLSearchParams({
      student_id: this.config.studentId || 'test',
      language: this.config.language || 'es-PR',
      model: this.config.model || 'gpt-realtime-2025-08-28'
    });

    if (this.config.voiceGuidance) {
      params.set('voice_guidance', this.config.voiceGuidance);
      console.log('[RealtimeVoiceClient] 📝 Voice guidance included');
    }

    if (this.config.activityId) {
      params.set('activity_id', this.config.activityId);
    }

    if (this.config.activityType) {
      params.set('activity_type', this.config.activityType);
    }

    if (this.config.contextPayload) {
      const encoded = this.encodeContextPayload(this.config.contextPayload);
      if (encoded) {
        params.set('context_payload', encoded);
        console.log('[RealtimeVoiceClient] 🧠 Context payload attached', { bytes: encoded.length });
      }
    }

    const wsUrl = `${baseUrl}?${params.toString()}`;
    console.log('[RealtimeVoiceClient] 🔌 Connecting to WebSocket...');

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.stateMachine.transition('websocket_open');

      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 10000);

      this.ws.onopen = () => {
        clearTimeout(timeout);
        console.log('[RealtimeVoiceClient] ✅ WebSocket connected');
        resolve();
      };

      this.ws.onmessage = (event) => {
        this.handleServerMessage(event);
      };

      this.ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('[RealtimeVoiceClient] ❌ WebSocket error:', error);
        this.config.onError?.(new Error('WebSocket error'));
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('[RealtimeVoiceClient] 🔌 WebSocket closed');
        this.handleConnectionLost();
      };
    });
  }

  private handleServerMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'session.created':
          console.log('[RealtimeVoiceClient] 📋 Session created');
          this.stateMachine.transition('session_created');
          break;

        case 'session.updated':
          console.log('[RealtimeVoiceClient] ✅ Session updated - READY');
          this.stateMachine.transition('ready');
          this.config.onConnectionChange?.(true);
          break;

        case 'response.audio.delta':
          this.handleAudioDelta(message.delta);
          break;

        case 'response.audio.done':
          this.config.onAudioPlayback?.(false);
          break;

        case 'response.audio_transcript.delta':
          this.currentTranscript.ai += message.delta;
          break;

        case 'response.audio_transcript.done':
          if (this.currentTranscript.ai) {
            this.config.onTranscription?.(this.currentTranscript.ai, false);
            this.currentTranscript.ai = '';
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (message.transcript) {
            this.config.onTranscription?.(message.transcript, true);
          }
          break;

        case 'input_audio_buffer.speech_started':
          console.log('[RealtimeVoiceClient] 🎤 User speaking detected by server VAD');
          this.isUserSpeaking = true;
          this.serverVADEnabled = true;
          this.appendedSamplesSinceLastCommit = 0;
          this.jitterBuffer?.clear();
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('[RealtimeVoiceClient] 🤐 User stopped speaking');
          this.isUserSpeaking = false;
          break;

        case 'response.created':
          console.log('[RealtimeVoiceClient] 🎬 AI response started');
          break;

        case 'response.done':
          console.log('[RealtimeVoiceClient] ✅ AI response completed');
          this.config.onResponseComplete?.();
          break;

        case 'response.cancel':
        case 'response.cancelled':
        case 'response.interrupted':
          console.log('[RealtimeVoiceClient] ⚠️ Response interrupted');
          this.jitterBuffer?.clear();
          break;

        case 'pong':
          this.heartbeatManager.handlePong();
          break;

        case 'error':
          console.error('[RealtimeVoiceClient] ❌ Server error:', message.error);
          this.config.onError?.(new Error(message.error.message));
          break;
      }
    } catch (error) {
      console.error('[RealtimeVoiceClient] ❌ Message parse error:', error);
    }
  }

  private handleAudioDelta(delta: string): void {
    // Decode base64 to PCM16
    const binaryString = atob(delta);
    const pcm16Data = new Int16Array(binaryString.length / 2);
    
    for (let i = 0; i < pcm16Data.length; i++) {
      const byte1 = binaryString.charCodeAt(i * 2);
      const byte2 = binaryString.charCodeAt(i * 2 + 1);
      pcm16Data[i] = (byte2 << 8) | byte1;
    }

    // Add to jitter buffer for smooth playback
    this.jitterBuffer?.addChunk(pcm16Data, performance.now());
    this.config.onAudioPlayback?.(true);
  }

  private sendAudioChunk(pcm16Data: Int16Array): void {
    if (!this.ws) {
      console.warn('[RealtimeVoiceClient] ⚠️ Cannot send audio - WebSocket not connected');
      return;
    }
    
    if (!this.stateMachine.canSendMessages()) {
      console.warn('[RealtimeVoiceClient] ⚠️ Cannot send audio - state:', this.stateMachine.getState());
      return;
    }

    console.log('[RealtimeVoiceClient] 🎤 Sending audio chunk:', pcm16Data.length, 'samples');
    this.appendedSamplesSinceLastCommit += pcm16Data.length;

    // Encode to base64
    const uint8 = new Uint8Array(pcm16Data.buffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);

    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      audio: base64
    }));
  }

  private monitorAudioLevel(pcm16Data: Int16Array): number {
    // Calculate RMS (Root Mean Square) audio level
    let sum = 0;
    for (let i = 0; i < pcm16Data.length; i++) {
      sum += pcm16Data[i] * pcm16Data[i];
    }
    const rms = Math.sqrt(sum / pcm16Data.length);
    const dbLevel = 20 * Math.log10(rms / 32768);
    
    if (dbLevel > -40) {  // Above silence threshold
      console.log('[AudioWorklet] 🔊 Audio level:', dbLevel.toFixed(1), 'dB');
    }
    
    this.config.onAudioLevel?.(dbLevel);
    return dbLevel;
  }

  private handleAudioGating(pcm16Data: Int16Array, dbLevel: number): void {
    const now = performance.now();

    // If above threshold, send immediately
    if (dbLevel > this.audioGateThreshold) {
      this.sendAudioChunk(pcm16Data);
      this.silenceStartTime = null;
      return;
    }

    // Below threshold
    if (this.serverVADEnabled) {
      // When server VAD is active we NEVER commit manually.
      if (this.silenceStartTime === null) this.silenceStartTime = now; // for diagnostics
      return;
    }

    if (this.silenceStartTime === null) {
      this.silenceStartTime = now;
      return;
    }

    const silenceDuration = now - this.silenceStartTime;

    // After 1200ms of silence, commit only if enough audio was appended
    if (silenceDuration > 1200 && this.stateMachine.canSendMessages()) {
      if (this.appendedSamplesSinceLastCommit >= this.minCommitSamples) {
        console.log('[RealtimeVoiceClient] 🤐 Silence detected, committing audio buffer');
        this.ws?.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
        this.appendedSamplesSinceLastCommit = 0;
      } else {
        console.log('[RealtimeVoiceClient] ⏭️ Skip commit - no audio appended since last commit');
      }
      this.silenceStartTime = null;
    }
  }

  sendText(text: string): void {
    if (!this.ws || !this.stateMachine.canSendMessages()) {
      console.warn('[RealtimeVoiceClient] ⚠️ Cannot send text - not ready');
      return;
    }

    console.log('[RealtimeVoiceClient] 📤 Sending text:', text);

    this.ws.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));

    this.ws.send(JSON.stringify({ type: 'response.create' }));
  }

  private handleConnectionLost(): void {
    if (this.stateMachine.getState() === 'disconnected') return;

    console.log('[RealtimeVoiceClient] 🔄 Connection lost, attempting reconnection...');
    this.heartbeatManager.stop();
    this.stateMachine.transition('reconnecting');
    this.performanceMonitor.recordReconnection();
    
    this.reconnectionManager.attemptReconnection(
      () => this.connect(),
      this.stateMachine
    );
  }

  disconnect(): void {
    console.log('[RealtimeVoiceClient] 🛑 Disconnecting...');
    
    this.heartbeatManager.stop();
    this.reconnectionManager.cancel();
    
    this.audioWorklet?.disconnect();
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.audioContext?.close();
    this.ws?.close();
    this.jitterBuffer?.clear();
    
    // Reset commit tracking
    this.appendedSamplesSinceLastCommit = 0;
    this.silenceStartTime = null;
    
    this.stateMachine.reset();
    this.performanceMonitor.logSummary();
    
    console.log('[RealtimeVoiceClient] ✅ Disconnected');
  }

  isConnected(): boolean {
    return this.stateMachine.isConnected();
  }

  getPerformanceMetrics() {
    return this.performanceMonitor.getMetricsSummary();
  }

  private encodeContextPayload(payload: Record<string, unknown>): string | null {
    try {
      const json = JSON.stringify(payload, (_, value) => (value === undefined ? undefined : value));
      if (!json || json === '{}') {
        return null;
      }
      const bytes = this.encoder.encode(json);
      let binary = '';
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    } catch (error) {
      console.error('[RealtimeVoiceClient] ❌ Failed to encode context payload', error);
      return null;
    }
  }
}
