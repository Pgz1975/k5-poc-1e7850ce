import {
  ConnectionState,
  type Language,
  type TranscriptEntry,
  type RealtimeError,
  type TokenResponse,
  type OpenAIEvent,
  type RealtimeClientOptions,
  type AudioConfiguration
} from './types';
import { getInitialGreeting } from './languageConfigs';

export class StudentGuideRealtimeClient {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;
  
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private currentLanguage: Language = 'en';
  private transcript: TranscriptEntry[] = [];
  private latencyStartTime: number = 0;
  private currentLatency: number = 0;
  
  // Event handlers
  private onConnectionStateChange?: (state: ConnectionState) => void;
  private onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  private onError?: (error: RealtimeError) => void;
  private onLatencyUpdate?: (latency: number) => void;
  private onAudioLevelUpdate?: (level: number) => void;

  // Audio configuration optimized for OpenAI Realtime
  private readonly audioConfig: AudioConfiguration = {
    sampleRate: 24000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };

  constructor(options?: RealtimeClientOptions) {
    this.onConnectionStateChange = options?.onConnectionStateChange;
    this.onTranscriptUpdate = options?.onTranscriptUpdate;
    this.onError = options?.onError;
    this.onLatencyUpdate = options?.onLatencyUpdate;
    this.onAudioLevelUpdate = options?.onAudioLevelUpdate;
    
    // Create audio element for playback
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    // Set playsInline for mobile compatibility
    (this.audioElement as any).playsInline = true;
  }

  /**
   * Connect to OpenAI Realtime API using ephemeral token
   */
  async connect(ephemeralToken: string, language: Language): Promise<void> {
    try {
      this.currentLanguage = language;
      this.setConnectionState(ConnectionState.CONNECTING);
      
      // Clean up any existing connection
      await this.cleanup();
      
      // Request microphone access
      await this.setupAudioInput();
      
      // Create peer connection
      this.createPeerConnection();
      
      // Set up data channel for OpenAI events
      this.setupDataChannel();
      
      // Add local audio track
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, this.localStream!);
          }
        });
      }
      
      // Create and send offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);
      
      // Send SDP to OpenAI
      await this.exchangeSDP(ephemeralToken, offer.sdp!);
      
    } catch (error) {
      console.error('[RealtimeClient] Connection failed:', error);
      this.handleError({
        type: 'connection',
        message: 'Failed to establish connection',
        retryable: true
      });
    }
  }

  /**
   * Disconnect from the session
   */
  async disconnect(): Promise<void> {
    this.setConnectionState(ConnectionState.DISCONNECTED);
    await this.cleanup();
  }

  /**
   * Send a text message to the AI
   */
  sendMessage(text: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('[RealtimeClient] Data channel not ready');
      return;
    }

    const event: OpenAIEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: text
        }]
      }
    };

    this.sendEvent(event);
    
    // Add to transcript
    this.addToTranscript({
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: text,
      timestamp: new Date(),
      language: this.currentLanguage
    });
  }

  /**
   * Send initial greeting to start conversation
   */
  sendInitialGreeting(): void {
    const greetingPrompt = this.currentLanguage === 'es'
      ? 'Por favor, preséntate y presenta nuestra plataforma de aprendizaje, luego pregunta cómo me siento sobre empezar a aprender hoy.'
      : 'Please introduce yourself and our learning platform, then ask how I\'m feeling about learning today.';
    
    const event: OpenAIEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: greetingPrompt
        }]
      }
    };

    this.sendEvent(event);
    
    // Trigger response generation
    const responseEvent: OpenAIEvent = {
      type: 'response.create'
    };
    
    this.sendEvent(responseEvent);
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get current latency in milliseconds
   */
  getCurrentLatency(): number {
    return this.currentLatency;
  }

  /**
   * Get current transcript
   */
  getTranscript(): TranscriptEntry[] {
    return [...this.transcript];
  }

  /**
   * Clear transcript history
   */
  clearTranscript(): void {
    this.transcript = [];
    this.onTranscriptUpdate?.(this.transcript);
  }

  // Private methods

  private async setupAudioInput(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.audioConfig.sampleRate,
          channelCount: this.audioConfig.channelCount,
          echoCancellation: this.audioConfig.echoCancellation,
          noiseSuppression: this.audioConfig.noiseSuppression,
          autoGainControl: this.audioConfig.autoGainControl
        }
      });
    } catch (error) {
      console.error('[RealtimeClient] Microphone access denied:', error);
      throw {
        type: 'permission',
        message: 'Microphone access required',
        retryable: false
      } as RealtimeError;
    }
  }

  private createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [] // OpenAI handles ICE
    });

    // Handle remote audio stream
    this.peerConnection.ontrack = (event) => {
      console.log('[RealtimeClient] Remote audio track received');
      if (this.audioElement) {
        this.audioElement.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('[RealtimeClient] Connection state:', state);
      
      if (state === 'connected') {
        this.setConnectionState(ConnectionState.CONNECTED);
        // Send initial greeting after connection is established
        setTimeout(() => this.sendInitialGreeting(), 500);
      } else if (state === 'disconnected' || state === 'failed') {
        this.setConnectionState(ConnectionState.ERROR);
        this.handleError({
          type: 'connection',
          message: 'Connection lost',
          retryable: true
        });
      }
    };

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState;
      console.log('[RealtimeClient] ICE state:', state);
    };
  }

  private setupDataChannel(): void {
    if (!this.peerConnection) return;

    this.dataChannel = this.peerConnection.createDataChannel('oai-events');
    
    this.dataChannel.onopen = () => {
      console.log('[RealtimeClient] Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const openaiEvent: OpenAIEvent = JSON.parse(event.data);
        this.handleOpenAIEvent(openaiEvent);
      } catch (error) {
        console.error('[RealtimeClient] Failed to parse OpenAI event:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('[RealtimeClient] Data channel error:', error);
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
      console.log('[RealtimeClient] SDP exchange completed');
      
    } catch (error) {
      console.error('[RealtimeClient] SDP exchange failed:', error);
      throw error;
    }
  }

  private sendEvent(event: OpenAIEvent): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('[RealtimeClient] Cannot send event - data channel not ready');
      return;
    }

    this.latencyStartTime = performance.now();
    this.dataChannel.send(JSON.stringify(event));
  }

  private handleOpenAIEvent(event: OpenAIEvent): void {
    console.log('[RealtimeClient] Received OpenAI event:', event.type);

    // Calculate latency for response events
    if (this.latencyStartTime > 0) {
      this.currentLatency = performance.now() - this.latencyStartTime;
      this.onLatencyUpdate?.(this.currentLatency);
      this.latencyStartTime = 0;
    }

    switch (event.type) {
      case 'conversation.item.completed':
        this.handleConversationItemCompleted(event);
        break;
      case 'response.audio.delta':
        // Audio is handled by the WebRTC connection automatically
        break;
      case 'session.created':
        console.log('[RealtimeClient] Session created:', event.session?.id);
        break;
      case 'error':
        this.handleError({
          type: 'network',
          message: event.error?.message || 'OpenAI API error',
          code: event.error?.code,
          retryable: true
        });
        break;
      default:
        console.log('[RealtimeClient] Unhandled event type:', event.type);
    }
  }

  private handleConversationItemCompleted(event: OpenAIEvent): void {
    const item = event.item;
    if (item?.role === 'assistant' && item.content) {
      const textContent = item.content.find((c: any) => c.type === 'text');
      if (textContent?.text) {
        this.addToTranscript({
          id: item.id || `assistant-${Date.now()}`,
          speaker: 'assistant',
          text: textContent.text,
          timestamp: new Date(),
          language: this.currentLanguage
        });
      }
    }
  }

  private addToTranscript(entry: TranscriptEntry): void {
    this.transcript.push(entry);
    this.onTranscriptUpdate?.(this.transcript);
  }

  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.onConnectionStateChange?.(state);
    }
  }

  private handleError(error: RealtimeError): void {
    console.error('[RealtimeClient] Error:', error);
    this.setConnectionState(ConnectionState.ERROR);
    this.onError?.(error);
  }

  private async cleanup(): Promise<void> {
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
  }

  /**
   * Cleanup resources when instance is destroyed
   */
  destroy(): void {
    this.cleanup();
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }
  }
}