import { EventEmitter } from 'events';

export interface EnhancedRealtimeConfig {
  studentId: string;
  language: 'en' | 'es-PR';
  gradeLevel: number;
  assessmentId?: string;
  voiceGuidance?: string;
  onTranscription?: (text: string, isUser: boolean) => void;
  onEvent?: (event: any) => void;
  onMetrics?: (metrics: VoiceMetrics) => void;
}

interface VoiceMetrics {
  avgLatency?: number;
  minLatency?: number;
  maxLatency?: number;
  interactions?: number;
  errors?: number;
  uptime?: number;
  startTime?: number;
  latency?: number[];
}

export class EnhancedRealtimeClient extends EventEmitter {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private config: EnhancedRealtimeConfig;
  private metrics: VoiceMetrics = {
    startTime: 0,
    latency: [],
    interactions: 0,
    errors: 0
  };

  constructor(config: EnhancedRealtimeConfig) {
    super();
    this.config = config;
    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = true;
    this.audioEl.setAttribute('playsinline', 'true'); // Mobile support
  }

  async connect(tokenEndpoint?: string) {
    console.log('[Enhanced] 🚀 Starting WebRTC connection...');

    try {
      // Step 1: Get enhanced ephemeral token
      const token = await this.getEnhancedToken(tokenEndpoint);

      // Step 2: Create RTCPeerConnection with optimal config
      this.pc = new RTCPeerConnection({
        iceServers: [], // No TURN/STUN needed for direct connection
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
      });

      // Step 3: Handle remote audio (AI voice)
      this.pc.ontrack = (e) => {
        console.log('[Enhanced] 🔊 AI audio track received');
        this.audioEl.srcObject = e.streams[0];
        this.emit('connected', true);
      };

      // Step 4: Add local microphone with optimal settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000, // Match OpenAI requirement
          channelCount: 1,   // Mono
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0 // Request lowest latency
        } as MediaTrackConstraints
      });

      const audioTrack = stream.getTracks()[0];
      this.pc.addTrack(audioTrack);
      console.log('[Enhanced] 🎤 Microphone connected');

      // Step 5: Create data channel for events
      this.dc = this.pc.createDataChannel('oai-events', {
        ordered: true,
        maxRetransmits: 3
      });

      this.dc.addEventListener('message', (e) => {
        this.handleDataChannelMessage(e.data);
      });

      // Step 6: Create and send offer
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Step 7: Exchange SDP with OpenAI
      const answer = await this.exchangeSDP(offer.sdp!, token);
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answer
      });

      console.log('[Enhanced] ✅ WebRTC connection established!');
      this.metrics.startTime = Date.now();

    } catch (error) {
      console.error('[Enhanced] ❌ Connection failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  private async getEnhancedToken(endpoint?: string): Promise<string> {
    const url = endpoint || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realtime-token-enhanced`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: this.config.studentId,
        language: this.config.language,
        gradeLevel: this.config.gradeLevel,
        assessmentId: this.config.assessmentId,
        voiceGuidance: this.config.voiceGuidance
      })
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.client_secret?.value || data.token;
  }

  private async exchangeSDP(offerSdp: string, token: string): Promise<string> {
    const response = await fetch(
      'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
      {
        method: 'POST',
        body: offerSdp,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/sdp'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`SDP exchange failed: ${response.status}`);
    }

    return response.text();
  }

  private handleDataChannelMessage(data: string) {
    try {
      const event = JSON.parse(data);
      console.log('[Enhanced] 📨 Event:', event.type);

      // Track metrics
      if (event.type === 'response.audio.delta') {
        const latency = Date.now() - this.metrics.startTime!;
        this.metrics.latency!.push(latency);
      }

      // Handle transcriptions
      if (event.type === 'conversation.item.created') {
        const isUser = event.item.role === 'user';
        const text = event.item.content?.[0]?.text ||
                    event.item.content?.[0]?.transcript || '';

        if (text) {
          this.config.onTranscription?.(text, isUser);
          this.logInteraction(text, isUser);
        }
      }

      // Forward to handler
      this.config.onEvent?.(event);
      this.emit('event', event);

      // Update metrics
      if (event.type === 'response.done') {
        this.metrics.interactions!++;
        this.config.onMetrics?.(this.getMetrics());
      }

    } catch (error) {
      console.error('[Enhanced] Error handling message:', error);
      this.metrics.errors!++;
    }
  }

  sendText(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('[Enhanced] Data channel not ready');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({ type: 'response.create' }));
    console.log('[Enhanced] 📤 Sent text:', text);
  }

  interrupt() {
    if (this.dc?.readyState === 'open') {
      this.dc.send(JSON.stringify({ type: 'response.cancel' }));
      console.log('[Enhanced] 🛑 Interrupted AI');
    }
  }

  private async logInteraction(text: string, isUser: boolean) {
    // Log to database for analytics
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/voice_interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          student_id: this.config.studentId,
          assessment_id: this.config.assessmentId,
          text,
          is_user: isUser,
          language: this.config.language,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.warn('[Enhanced] Failed to log interaction:', response.status);
      }
    } catch (error) {
      console.error('[Enhanced] Failed to log interaction:', error);
    }
  }

  getMetrics(): VoiceMetrics {
    const latencyArray = this.metrics.latency || [];
    return {
      avgLatency: latencyArray.reduce((a, b) => a + b, 0) / latencyArray.length || 0,
      minLatency: Math.min(...latencyArray) || 0,
      maxLatency: Math.max(...latencyArray) || 0,
      interactions: this.metrics.interactions,
      errors: this.metrics.errors,
      uptime: Date.now() - (this.metrics.startTime || Date.now())
    };
  }

  disconnect() {
    console.log('[Enhanced] 🛑 Disconnecting...');

    if (this.audioEl.srcObject) {
      const tracks = (this.audioEl.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }

    this.dc?.close();
    this.pc?.close();

    this.pc = null;
    this.dc = null;

    this.emit('disconnected');
  }
}
