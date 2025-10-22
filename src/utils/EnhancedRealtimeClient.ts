// Simple event emitter for browser
class SimpleEventEmitter {
  private listeners: Record<string, Function[]> = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }

  removeAllListeners() {
    this.listeners = {};
  }
}

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

export class EnhancedRealtimeClient extends SimpleEventEmitter {
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
    this.audioEl.setAttribute('playsinline', 'true');
  }

  async connect(tokenEndpoint?: string) {
    console.log('[Enhanced] 🚀 Starting WebRTC connection...');

    try {
      const token = await this.getEnhancedToken(tokenEndpoint);

      this.pc = new RTCPeerConnection({
        iceServers: [],
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
      });

      this.pc.ontrack = (e) => {
        console.log('[Enhanced] 🔊 AI audio track received');
        this.audioEl.srcObject = e.streams[0];
        this.emit('connected', true);
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const audioTrack = stream.getTracks()[0];
      this.pc.addTrack(audioTrack);
      console.log('[Enhanced] 🎤 Microphone connected');

      this.dc = this.pc.createDataChannel('oai-events', {
        ordered: true,
        maxRetransmits: 3
      });

      this.dc.addEventListener('message', (e) => {
        this.handleDataChannelMessage(e.data);
      });

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

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
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
      },
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

      if (event.type === 'response.audio.delta') {
        const latency = Date.now() - this.metrics.startTime;
        this.metrics.latency.push(latency);
      }

      if (event.type === 'conversation.item.created') {
        const isUser = event.item.role === 'user';
        const text = event.item.content?.[0]?.text ||
                    event.item.content?.[0]?.transcript || '';

        if (text) {
          this.config.onTranscription?.(text, isUser);
          this.logInteraction(text, isUser);
        }
      }

      this.config.onEvent?.(event);
      this.emit('event', event);

      if (event.type === 'response.done') {
        this.metrics.interactions++;
        this.config.onMetrics?.(this.getMetrics());
      }

    } catch (error) {
      console.error('[Enhanced] Error handling message:', error);
      this.metrics.errors++;
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
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/voice_interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
      
      // Silently ignore errors - this is optional telemetry
    } catch (error) {
      // Silently ignore - voice chat continues working
    }
  }

  getMetrics(): VoiceMetrics {
    const latencyArray = this.metrics.latency;
    return {
      avgLatency: latencyArray.reduce((a, b) => a + b, 0) / latencyArray.length || 0,
      minLatency: Math.min(...latencyArray) || 0,
      maxLatency: Math.max(...latencyArray) || 0,
      interactions: this.metrics.interactions,
      errors: this.metrics.errors,
      uptime: Date.now() - this.metrics.startTime
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
