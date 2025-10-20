export interface RealtimeVoiceConfig {
  studentId: string;
  language: 'es-PR' | 'en-US';
  model?: string;
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioPlayback?: (isPlaying: boolean) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export class RealtimeVoiceClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private isConnected = false;
  private config: RealtimeVoiceConfig;
  private audioQueue: Int16Array[] = [];
  private isPlayingAudio = false;
  private projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'meertwtenhlmnlpwxhyz';

  constructor(config: RealtimeVoiceConfig) {
    this.config = config;
    console.log('[RealtimeVoice] 🎯 Client initialized with config:', {
      studentId: config.studentId,
      language: config.language,
      hasCallbacks: {
        onTranscription: !!config.onTranscription,
        onAudioPlayback: !!config.onAudioPlayback,
        onError: !!config.onError,
        onConnectionChange: !!config.onConnectionChange
      }
    });
  }

  async connect(token: string): Promise<void> {
    try {
      console.log('[RealtimeVoice] 🚀 Starting connection process...');
      console.log('[RealtimeVoice] 🔑 Token length:', token?.length || 0);
      
      // Initialize audio context
      console.log('[RealtimeVoice] 🎵 Creating AudioContext...');
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      console.log('[RealtimeVoice] ✅ AudioContext created, sample rate:', this.audioContext.sampleRate);

      // Load audio worklet for PCM16 processing
      console.log('[RealtimeVoice] 📦 Loading audio worklet module...');
      await this.audioContext.audioWorklet.addModule('/audio-worklet-processor.js');
      console.log('[RealtimeVoice] ✅ Audio worklet loaded successfully');

      // Get microphone access
      console.log('[RealtimeVoice] 🎤 Requesting microphone access...');
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('[RealtimeVoice] ✅ Microphone access granted:', {
        tracks: this.mediaStream.getTracks().length,
        settings: this.mediaStream.getAudioTracks()[0]?.getSettings()
      });

      // Create audio worklet node for input processing
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.audioWorklet = new AudioWorkletNode(this.audioContext, 'pcm16-processor');
      
      this.audioWorklet.port.onmessage = (event) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const pcm16Data = event.data as Int16Array;
          const base64Audio = this.encodePCM16ToBase64(pcm16Data);
          
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio
          }));
        }
      };

      source.connect(this.audioWorklet);
      this.audioWorklet.connect(this.audioContext.destination);
      console.log('[RealtimeVoice] Audio pipeline connected');

      // Connect to WebSocket relay
      const modelParam = this.config.model ? `&model=${encodeURIComponent(this.config.model)}` : '';
      const wsUrl = `wss://${this.projectId}.supabase.co/functions/v1/realtime-voice-relay?jwt=${token}&student_id=${this.config.studentId}&language=${this.config.language}${modelParam}`;
      console.log('[RealtimeVoice] 🔌 Connecting to WebSocket...');
      console.log('[RealtimeVoice] 📍 Project ID:', this.projectId);
      console.log('[RealtimeVoice] 🎯 Model:', this.config.model || 'default');
      console.log('[RealtimeVoice] 🌐 WebSocket URL:', wsUrl.replace(token, 'TOKEN_HIDDEN'));
      
      this.ws = new WebSocket(wsUrl);
      console.log('[RealtimeVoice] 🔄 WebSocket state:', this.ws.readyState);

      this.ws.onopen = () => {
        console.log('[RealtimeVoice] ✅ WebSocket connected');
        this.isConnected = true;
        this.config.onConnectionChange?.(true);
      };

      this.ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch (error) {
          console.error('[RealtimeVoice] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[RealtimeVoice] ❌ WebSocket error:', error);
        this.config.onError?.(new Error('WebSocket connection error'));
      };

      this.ws.onclose = (event) => {
        console.log('[RealtimeVoice] WebSocket closed - Code:', event.code, 'Reason:', event.reason);
        this.isConnected = false;
        this.config.onConnectionChange?.(false);
      };

    } catch (error) {
      console.error('[RealtimeVoice] Connection error:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private handleServerMessage(message: any): void {
    console.log('[RealtimeVoice] Server message:', message.type);

    switch (message.type) {
      case 'session.created':
        console.log('[RealtimeVoice] ✅ Session created');
        break;

      case 'session.updated':
        console.log('[RealtimeVoice] ✅ Session updated');
        break;

      case 'response.audio.delta':
        this.handleAudioDelta(message.delta);
        break;

      case 'response.audio.done':
        console.log('[RealtimeVoice] Audio response complete');
        this.config.onAudioPlayback?.(false);
        break;

      case 'response.audio_transcript.delta':
        console.log('[RealtimeVoice] 🔊 AI:', message.delta);
        this.config.onTranscription?.(message.delta, false);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        console.log('[RealtimeVoice] 🎤 User:', message.transcript);
        this.config.onTranscription?.(message.transcript, true);
        break;

      case 'error':
        console.error('[RealtimeVoice] ❌ Server error:', message.error);
        this.config.onError?.(new Error(message.error.message || 'Unknown error'));
        break;

      default:
        console.log('[RealtimeVoice] Event:', message.type);
    }
  }

  private handleAudioDelta(base64Audio: string): void {
    try {
      const pcm16Data = this.decodeBase64ToPCM16(base64Audio);
      this.audioQueue.push(pcm16Data);
      
      if (!this.isPlayingAudio) {
        this.playNextAudioChunk();
      }
    } catch (error) {
      console.error('[RealtimeVoice] Error handling audio delta:', error);
    }
  }

  private async playNextAudioChunk(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      return;
    }

    this.isPlayingAudio = true;
    this.config.onAudioPlayback?.(true);

    const pcm16Data = this.audioQueue.shift()!;
    
    try {
      if (!this.audioContext) return;

      // Convert PCM16 to Float32
      const float32Data = new Float32Array(pcm16Data.length);
      for (let i = 0; i < pcm16Data.length; i++) {
        float32Data[i] = pcm16Data[i] / 32768.0;
      }

      // Create audio buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      // Play audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        this.playNextAudioChunk();
      };

      source.start(0);
      console.log('[RealtimeVoice] Playing audio chunk:', pcm16Data.length, 'samples');

    } catch (error) {
      console.error('[RealtimeVoice] Error playing audio:', error);
      this.playNextAudioChunk();
    }
  }

  private encodePCM16ToBase64(pcm16Data: Int16Array): string {
    const uint8Array = new Uint8Array(pcm16Data.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode(...Array.from(chunk));
    }
    
    return btoa(binary);
  }

  private decodeBase64ToPCM16(base64: string): Int16Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return new Int16Array(bytes.buffer);
  }

  sendText(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[RealtimeVoice] Cannot send text: WebSocket not connected');
      return;
    }

    console.log('[RealtimeVoice] Sending text:', text);

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
    console.log('[RealtimeVoice] Disconnecting...');

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

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.audioQueue = [];
    this.isPlayingAudio = false;
    
    console.log('[RealtimeVoice] Disconnected');
  }

  isActive(): boolean {
    return this.isConnected;
  }
}
