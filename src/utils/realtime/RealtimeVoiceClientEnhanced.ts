import { supabase } from '@/integrations/supabase/client';
export interface RealtimeVoiceConfig {
  studentId: string;
  language: 'es-PR' | 'en-US';
  model?: string;
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioPlayback?: (isPlaying: boolean) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface AudioChunk {
  data: Int16Array;
  timestamp: number;
}

export class RealtimeVoiceClientEnhanced {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private isConnected = false;
  private config: RealtimeVoiceConfig;
  private currentToken: string = '';

  // Enhanced audio buffering
  private audioQueue: AudioChunk[] = [];
  private isPlayingAudio = false;
  private nextScheduledTime = 0;
  private minBufferSize = 3; // Minimum chunks before starting playback
  private maxBufferSize = 10; // Maximum buffer to prevent latency
  private bufferUnderrunCount = 0;

  // Connection management
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat = Date.now();
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Performance monitoring
  private audioLatency = 0;
  private networkJitter = 0;
  private lastPacketTime = 0;

  private projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'meertwtenhlmnlpwxhyz';

  constructor(config: RealtimeVoiceConfig) {
    this.config = config;
    console.log('[RealtimeVoiceEnhanced] 🎯 Client initialized with enhanced audio handling');
  }

  async connect(token: string): Promise<void> {
    try {
      console.log('[RealtimeVoiceEnhanced] 🚀 Starting enhanced connection...');

      // Initialize audio context with optimal settings
      this.audioContext = new AudioContext({
        sampleRate: 24000,
        latencyHint: 'interactive' // Optimize for low latency
      });

      // Resume audio context if suspended (browser policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Load enhanced audio worklet
      await this.loadEnhancedAudioWorklet();

      // Get microphone with optimized settings
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleSize: 16
        }
      });

      // Set up audio processing pipeline
      await this.setupAudioPipeline();

      // Connect to WebSocket with retry logic
      this.currentToken = token;
      await this.connectWebSocket(token);

      // Start heartbeat to maintain connection
      this.startHeartbeat();

    } catch (error) {
      console.error('[RealtimeVoiceEnhanced] Connection error:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private async loadEnhancedAudioWorklet(): Promise<void> {
    // First create the enhanced worklet processor
    const processorCode = `
      class EnhancedPCM16Processor extends AudioWorkletProcessor {
        constructor() {
          super();
          this.bufferSize = 2048; // Larger buffer for stability
          this.buffer = [];
        }

        process(inputs) {
          const input = inputs[0];
          if (!input || !input[0]) return true;

          const samples = input[0];

          // Buffer samples for batch processing
          for (let i = 0; i < samples.length; i++) {
            this.buffer.push(samples[i]);
          }

          // Process when buffer is full
          while (this.buffer.length >= this.bufferSize) {
            const chunk = this.buffer.splice(0, this.bufferSize);
            const pcm16 = new Int16Array(chunk.length);

            // Convert with better precision
            for (let i = 0; i < chunk.length; i++) {
              const s = Math.max(-1, Math.min(1, chunk[i]));
              pcm16[i] = Math.floor(s < 0 ? s * 32768 : s * 32767);
            }

            this.port.postMessage({
              type: 'audio',
              data: pcm16,
              timestamp: currentTime
            });
          }

          return true;
        }
      }

      registerProcessor('enhanced-pcm16-processor', EnhancedPCM16Processor);
    `;

    const blob = new Blob([processorCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await this.audioContext!.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);
  }

  private async setupAudioPipeline(): Promise<void> {
    const source = this.audioContext!.createMediaStreamSource(this.mediaStream!);
    this.audioWorklet = new AudioWorkletNode(this.audioContext!, 'enhanced-pcm16-processor');

    // Set up message handling with batching
    let audioBuffer: Int16Array[] = [];
    let sendTimer: NodeJS.Timeout | null = null;

    this.audioWorklet.port.onmessage = (event) => {
      if (event.data.type === 'audio' && this.ws?.readyState === WebSocket.OPEN) {
        audioBuffer.push(event.data.data);

        // Batch audio data for efficiency
        if (!sendTimer) {
          sendTimer = setTimeout(() => {
            if (audioBuffer.length > 0) {
              const concatenated = this.concatenateAudioBuffers(audioBuffer);
              const base64Audio = this.optimizedEncodePCM16ToBase64(concatenated);

              this.ws?.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: base64Audio
              }));

              audioBuffer = [];
            }
            sendTimer = null;
          }, 100); // Send every 100ms for balance between latency and efficiency
        }
      }
    };

    source.connect(this.audioWorklet);
    // Don't connect to destination to prevent echo
  }

  private async connectWebSocket(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const modelParam = this.config.model ? `&model=${encodeURIComponent(this.config.model)}` : '';
      const wsUrl = `wss://${this.projectId}.functions.supabase.co/functions/v1/realtime-voice-relay?jwt=${token}&student_id=${this.config.studentId}&language=${this.config.language}${modelParam}`;

      this.ws = new WebSocket(wsUrl);

      const connectTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.ws?.close();
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);

      this.ws.onopen = () => {
        clearTimeout(connectTimeout);
        console.log('[RealtimeVoiceEnhanced] ✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.config.onConnectionChange?.(true);
        resolve();
      };

      this.ws.onmessage = async (event) => {
        this.handleServerMessage(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        clearTimeout(connectTimeout);
        console.error('[RealtimeVoiceEnhanced] ❌ WebSocket error:', error);
        this.handleConnectionError();
      };

      this.ws.onclose = (event) => {
        clearTimeout(connectTimeout);
        console.log('[RealtimeVoiceEnhanced] WebSocket closed:', event.code, event.reason);
        this.isConnected = false;
        this.config.onConnectionChange?.(false);

        // Auto-reconnect if not intentionally closed
        if (event.code !== 1000) {
          this.handleReconnection();
        }
      };
    });
  }

  private handleServerMessage(message: any): void {
    // Track network timing for jitter calculation
    const now = Date.now();
    if (this.lastPacketTime > 0) {
      const timeDiff = now - this.lastPacketTime;
      this.networkJitter = Math.abs(timeDiff - 100); // Expected 100ms interval
    }
    this.lastPacketTime = now;

    switch (message.type) {
      case 'response.audio.delta':
        this.handleEnhancedAudioDelta(message.delta);
        break;

      case 'response.audio.done':
        console.log('[RealtimeVoiceEnhanced] Audio response complete');
        this.flushAudioBuffer();
        break;

      case 'response.audio_transcript.delta':
        this.config.onTranscription?.(message.delta, false);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.config.onTranscription?.(message.transcript, true);
        break;

      case 'error':
        console.error('[RealtimeVoiceEnhanced] Server error:', message.error);
        this.config.onError?.(new Error(message.error.message || 'Unknown error'));
        break;

      default:
        // Handle other message types
        break;
    }
  }

  private handleEnhancedAudioDelta(base64Audio: string): void {
    try {
      const pcm16Data = this.optimizedDecodeBase64ToPCM16(base64Audio);

      // Add to queue with timestamp for jitter buffer
      this.audioQueue.push({
        data: pcm16Data,
        timestamp: Date.now()
      });

      // Implement adaptive buffering
      const shouldStartPlayback = !this.isPlayingAudio && (
        this.audioQueue.length >= this.minBufferSize ||
        (this.audioQueue.length > 0 && this.bufferUnderrunCount > 2)
      );

      if (shouldStartPlayback) {
        this.startEnhancedPlayback();
      }

      // Prevent buffer overflow
      if (this.audioQueue.length > this.maxBufferSize) {
        console.warn('[RealtimeVoiceEnhanced] Buffer overflow, dropping old chunks');
        this.audioQueue = this.audioQueue.slice(-this.maxBufferSize);
      }

    } catch (error) {
      console.error('[RealtimeVoiceEnhanced] Error handling audio delta:', error);
    }
  }

  private async startEnhancedPlayback(): Promise<void> {
    if (this.isPlayingAudio) return;

    this.isPlayingAudio = true;
    this.config.onAudioPlayback?.(true);

    // Reset scheduling for new playback session
    this.nextScheduledTime = this.audioContext!.currentTime + 0.05; // Small initial delay

    while (this.audioQueue.length > 0) {
      await this.playNextEnhancedChunk();
    }

    this.isPlayingAudio = false;
    this.config.onAudioPlayback?.(false);
  }

  private async playNextEnhancedChunk(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.bufferUnderrunCount++;
      console.warn('[RealtimeVoiceEnhanced] Buffer underrun detected');
      return;
    }

    const chunk = this.audioQueue.shift()!;
    if (!this.audioContext) return;

    try {
      // Apply fade-in/fade-out for smooth transitions
      const float32Data = new Float32Array(chunk.data.length);
      const fadeLength = Math.min(256, chunk.data.length / 10);

      for (let i = 0; i < chunk.data.length; i++) {
        let sample = chunk.data[i] / 32768.0;

        // Apply fade-in
        if (i < fadeLength) {
          sample *= i / fadeLength;
        }
        // Apply fade-out
        else if (i >= chunk.data.length - fadeLength) {
          sample *= (chunk.data.length - i) / fadeLength;
        }

        float32Data[i] = sample;
      }

      // Create and schedule audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Apply dynamic range compression for consistent volume
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      source.connect(compressor);
      compressor.connect(this.audioContext.destination);

      // Schedule with overlap for gapless playback
      const now = this.audioContext.currentTime;
      const scheduledTime = Math.max(now + 0.01, this.nextScheduledTime);

      source.start(scheduledTime);

      // Update next scheduled time with slight overlap
      this.nextScheduledTime = scheduledTime + audioBuffer.duration - 0.001;

      // Track latency
      this.audioLatency = scheduledTime - now;

      // Wait for this chunk to finish
      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
      });

    } catch (error) {
      console.error('[RealtimeVoiceEnhanced] Error playing audio chunk:', error);
    }
  }

  private flushAudioBuffer(): void {
    // Play remaining audio immediately
    if (this.audioQueue.length > 0 && !this.isPlayingAudio) {
      this.startEnhancedPlayback();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Send ping to keep connection alive
        this.ws.send(JSON.stringify({ type: 'ping' }));

        // Check for connection timeout
        const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeat;
        if (timeSinceLastHeartbeat > 30000) {
          console.warn('[RealtimeVoiceEnhanced] Heartbeat timeout, reconnecting...');
          this.handleReconnection();
        }
      }
    }, 10000); // Send heartbeat every 10 seconds
  }

  private handleConnectionError(): void {
    this.config.onError?.(new Error('WebSocket connection error'));
    this.handleReconnection();
  }

  private async handleReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[RealtimeVoiceEnhanced] Max reconnection attempts reached');
      this.config.onError?.(new Error('Failed to reconnect after multiple attempts'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[RealtimeVoiceEnhanced] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      try {
        // Get fresh token if needed
        const token = await this.refreshToken();
        await this.connectWebSocket(token);
      } catch (error) {
        console.error('[RealtimeVoiceEnhanced] Reconnection failed:', error);
        this.handleReconnection();
      }
    }, delay);
  }

  private async refreshToken(): Promise<string> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const newToken = data.session?.access_token;
      if (newToken) {
        this.currentToken = newToken;
        return newToken;
      }
      // Fallback to existing token if available
      if (this.currentToken) return this.currentToken;
      throw new Error('No active session');
    } catch (e) {
      console.error('[RealtimeVoiceEnhanced] Token refresh failed:', e);
      // Use last known token to attempt reconnect, may still work if not expired
      return this.currentToken || '';
    }
  }

  private concatenateAudioBuffers(buffers: Int16Array[]): Int16Array {
    const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
    const result = new Int16Array(totalLength);
    let offset = 0;

    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.length;
    }

    return result;
  }

  private optimizedEncodePCM16ToBase64(pcm16Data: Int16Array): string {
    const uint8Array = new Uint8Array(pcm16Data.buffer, pcm16Data.byteOffset, pcm16Data.byteLength);
    const chunkSize = 65536; // Larger chunk for efficiency
    const chunks: string[] = [];

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      chunks.push(String.fromCharCode(...Array.from(chunk)));
    }

    return btoa(chunks.join(''));
  }

  private optimizedDecodeBase64ToPCM16(base64: string): Int16Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Int16Array(bytes.buffer);
  }

  sendText(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[RealtimeVoiceEnhanced] Cannot send text: WebSocket not connected');
      return;
    }

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

  disconnect(): void {
    console.log('[RealtimeVoiceEnhanced] Disconnecting...');

    // Clear heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    // Clear any pending reconnection timers
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Stop audio
    if (this.audioWorklet) {
      this.audioWorklet.disconnect();
      this.audioWorklet = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.isConnected = false;
    this.audioQueue = [];
    this.isPlayingAudio = false;

    console.log('[RealtimeVoiceEnhanced] Disconnected');
  }

  isActive(): boolean {
    return this.isConnected;
  }

  // Performance metrics
  getPerformanceMetrics(): {
    audioLatency: number;
    networkJitter: number;
    bufferSize: number;
    bufferUnderruns: number;
  } {
    return {
      audioLatency: this.audioLatency,
      networkJitter: this.networkJitter,
      bufferSize: this.audioQueue.length,
      bufferUnderruns: this.bufferUnderrunCount
    };
  }
}