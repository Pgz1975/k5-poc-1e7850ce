/**
 * WebRTC-based Realtime Voice Client
 * Modern replacement for WebSocket-based RealtimeVoiceClientEnhanced
 * Uses ephemeral tokens from realtime-student-guide-token edge function
 */

import { supabase } from '@/integrations/supabase/client';

export interface RealtimeVoiceConfigWebRTC {
  studentId?: string;
  language?: string;
  activityId?: string;
  activityType?: string;
  persona?: 'demo-guide' | 'student-tutor';
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioPlayback?: (isPlaying: boolean) => void;
  onAudioLevel?: (dbLevel: number) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
  onResponseComplete?: () => void;
  onLatencyUpdate?: (latency: number) => void;
}

export class RealtimeVoiceClientWebRTC {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;
  private config: RealtimeVoiceConfigWebRTC;
  private isConnected = false;
  private latencyStartTime = 0;

  constructor(config: RealtimeVoiceConfigWebRTC = {}) {
    this.config = config;
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    (this.audioElement as any).playsInline = true;
  }

  async connect(): Promise<void> {
    console.log('[WebRTC] 🚀 Starting connection...');
    
    try {
      // Step 1: Generate ephemeral token from our edge function
      const { data, error } = await supabase.functions.invoke('realtime-student-guide-token', {
        body: {
          language: this.config.language || 'es',
          studentId: this.config.studentId || 'anonymous',
          persona: this.config.persona || 'student-tutor', // Default to student tutor for dashboard
          sessionMetadata: {
            grade: undefined, // Could be added if needed
            activity: this.config.activityId,
            activityType: this.config.activityType
          }
        }
      });

      if (error) throw error;
      if (!data?.client_secret?.value) {
        throw new Error('Failed to get ephemeral token from edge function');
      }

      const ephemeralToken = data.client_secret.value;
      console.log('[WebRTC] ✅ Ephemeral token received');

      // Step 2: Request microphone access
      await this.setupAudioInput();

      // Step 3: Create peer connection
      this.createPeerConnection();

      // Step 4: Set up data channel for OpenAI events
      this.setupDataChannel();

      // Step 5: Add local audio track
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, this.localStream!);
          }
        });
      }

      // Step 6: Create and send offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      // Step 7: Exchange SDP with OpenAI
      await this.exchangeSDP(ephemeralToken, offer.sdp!);

      console.log('[WebRTC] ✅ Connection complete');
    } catch (error) {
      console.error('[WebRTC] ❌ Connection error:', error);
      this.config.onError?.(error as Error);
      this.config.onConnectionChange?.(false);
      throw error;
    }
  }

  private async setupAudioInput(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      console.log('[WebRTC] 🎤 Microphone access granted');
    } catch (error) {
      console.error('[WebRTC] ❌ Microphone access denied:', error);
      throw new Error('Microphone access required for voice chat');
    }
  }

  private createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection();

    // Handle remote audio stream
    this.peerConnection.ontrack = (event) => {
      console.log('[WebRTC] 🔊 Remote audio track received');
      if (this.audioElement) {
        this.audioElement.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('[WebRTC] Connection state:', state);
      
      if (state === 'connected') {
        this.isConnected = true;
        this.config.onConnectionChange?.(true);
      } else if (state === 'disconnected' || state === 'failed') {
        this.isConnected = false;
        this.config.onConnectionChange?.(false);
        this.config.onError?.(new Error('Connection lost'));
      }
    };

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState;
      console.log('[WebRTC] ICE state:', state);
    };
  }

  private setupDataChannel(): void {
    if (!this.peerConnection) return;

    this.dataChannel = this.peerConnection.createDataChannel('oai-events');
    
    this.dataChannel.onopen = () => {
      console.log('[WebRTC] Data channel opened, configuring session...');
      
      // Send session configuration with turn_detection
      const sessionConfig = {
        type: 'session.update',
        session: {
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
            create_response: true
          }
        }
      };
      
      this.sendEvent(sessionConfig);
      console.log('[WebRTC] ✅ Session configuration sent');
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const openaiEvent = JSON.parse(event.data);
        this.handleOpenAIEvent(openaiEvent);
      } catch (error) {
        console.error('[WebRTC] Failed to parse OpenAI event:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('[WebRTC] Data channel error:', error);
      this.config.onError?.(new Error('Data channel error'));
    };
  }

  private async exchangeSDP(ephemeralToken: string, localSDP: string): Promise<void> {
    try {
      const response = await fetch('https://api.openai.com/v1/realtime?model=gpt-realtime-2025-08-28', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ephemeralToken}`,
          'Content-Type': 'application/sdp',
        },
        body: localSDP,
      });

      if (!response.ok) {
        throw new Error(`SDP exchange failed: ${response.status}`);
      }

      const remoteSDP = await response.text();
      
      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: remoteSDP,
      };

      await this.peerConnection!.setRemoteDescription(answer);
      console.log('[WebRTC] ✅ SDP exchange completed');
      
    } catch (error) {
      console.error('[WebRTC] ❌ SDP exchange failed:', error);
      throw error;
    }
  }

  private sendEvent(event: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('[WebRTC] Cannot send event - data channel not ready');
      return;
    }

    this.latencyStartTime = performance.now();
    this.dataChannel.send(JSON.stringify(event));
  }

  private handleOpenAIEvent(event: any): void {
    // Calculate latency
    if (this.latencyStartTime > 0 && event.type?.includes('response')) {
      const latency = performance.now() - this.latencyStartTime;
      this.config.onLatencyUpdate?.(latency);
      this.latencyStartTime = 0;
    }

    switch (event.type) {
      case 'session.created':
        console.log('[WebRTC] ✅ Session created:', event.session?.id);
        break;

      case 'session.updated':
        console.log('[WebRTC] ✅ Session configured with VAD');
        break;

      case 'response.audio.delta':
        // Audio is handled automatically by WebRTC
        this.config.onAudioPlayback?.(true);
        break;

      case 'response.audio.done':
        this.config.onAudioPlayback?.(false);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          this.config.onTranscription?.(event.transcript, true);
        }
        break;

      case 'response.audio_transcript.delta':
        // Accumulate AI transcript (could be implemented if needed)
        break;

      case 'response.audio_transcript.done':
        if (event.transcript) {
          this.config.onTranscription?.(event.transcript, false);
        }
        break;

      case 'input_audio_buffer.speech_started':
        console.log('[WebRTC] 🎤 User speaking detected by server VAD');
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('[WebRTC] 🤐 User stopped speaking');
        break;

      case 'response.created':
        console.log('[WebRTC] 🎬 AI response started');
        break;

      case 'response.done':
        console.log('[WebRTC] ✅ AI response completed');
        this.config.onResponseComplete?.();
        break;

      case 'error':
        console.error('[WebRTC] ❌ OpenAI error:', event.error);
        this.config.onError?.(new Error(event.error?.message || 'OpenAI API error'));
        break;

      default:
        console.log('[WebRTC] Unhandled event:', event.type);
    }
  }

  sendText(text: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('[WebRTC] ⚠️ Cannot send text - not ready');
      return;
    }

    console.log('[WebRTC] 📤 Sending text:', text);

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    };

    this.sendEvent(event);
    
    // Trigger response generation
    this.sendEvent({ type: 'response.create' });
  }

  disconnect(): void {
    console.log('[WebRTC] 🛑 Disconnecting...');

    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop local media tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Clear audio element
    if (this.audioElement) {
      this.audioElement.srcObject = null;
    }

    this.isConnected = false;
    this.config.onConnectionChange?.(false);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  destroy(): void {
    this.disconnect();
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }
  }
}
