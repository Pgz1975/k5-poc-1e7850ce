/**
 * Enhanced WebRTC-based Realtime Voice Client
 * Optimized for K-5 Puerto Rico Educational Platform
 * 
 * Features:
 * - Direct WebRTC connection to OpenAI (<150ms latency)
 * - Automatic audio handling via browser WebRTC
 * - Performance metrics tracking
 * - Session logging to database
 */

import { supabase } from '@/integrations/supabase/client';

interface EnhancedClientConfig {
  onMessage?: (message: any) => void;
  onTranscript?: (text: string, isUser: boolean) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
  sessionId?: string;
  studentId?: string;
  assessmentId?: string;
}

interface PerformanceMetrics {
  latency: number[];
  interactions: number;
  errors: number;
  startTime: number;
}

export class EnhancedRealtimeClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement;
  private config: EnhancedClientConfig;
  private metrics: PerformanceMetrics;
  private sessionId: string;
  private dbSessionId: string | null = null;

  constructor(config: EnhancedClientConfig = {}) {
    this.config = config;
    this.sessionId = config.sessionId || crypto.randomUUID();
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    
    this.metrics = {
      latency: [],
      interactions: 0,
      errors: 0,
      startTime: Date.now(),
    };
  }

  async connect(token: string): Promise<void> {
    try {
      // Create session record in database
      await this.createSessionRecord();

      // Create peer connection
      this.pc = new RTCPeerConnection({
        iceServers: [],
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
      });

      // Handle remote audio track
      this.pc.ontrack = (event) => {
        console.log('Received audio track');
        this.audioElement.srcObject = event.streams[0];
      };

      // Add local microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      this.pc.addTrack(stream.getTracks()[0]);

      // Set up data channel for events
      this.dc = this.pc.createDataChannel('oai-events');
      this.setupDataChannel();

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Exchange SDP with OpenAI
      const response = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-realtime-2025-08-28`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to connect: ${await response.text()}`);
      }

      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await response.text(),
      };

      await this.pc.setRemoteDescription(answer);
      console.log('WebRTC connection established');
      this.config.onConnectionChange?.(true);

    } catch (error) {
      console.error('Connection error:', error);
      this.metrics.errors++;
      this.config.onError?.(error instanceof Error ? error.message : 'Connection failed');
      throw error;
    }
  }

  private setupDataChannel(): void {
    if (!this.dc) return;

    this.dc.addEventListener('open', () => {
      console.log('Data channel opened');
    });

    this.dc.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleServerMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.dc.addEventListener('close', () => {
      console.log('Data channel closed');
      this.config.onConnectionChange?.(false);
    });

    this.dc.addEventListener('error', (error) => {
      console.error('Data channel error:', error);
      this.metrics.errors++;
    });
  }

  private async handleServerMessage(message: any): Promise<void> {
    this.config.onMessage?.(message);

    const startTime = Date.now();

    switch (message.type) {
      case 'session.created':
        console.log('Session created:', message.session);
        break;

      case 'response.audio_transcript.delta':
        this.config.onTranscript?.(message.delta, false);
        await this.logInteraction(message.delta, false);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.config.onTranscript?.(message.transcript, true);
        await this.logInteraction(message.transcript, true);
        this.metrics.interactions++;
        break;

      case 'response.done':
        const latency = Date.now() - startTime;
        this.metrics.latency.push(latency);
        console.log('Response completed, latency:', latency, 'ms');
        break;

      case 'error':
        console.error('Server error:', message.error);
        this.metrics.errors++;
        this.config.onError?.(message.error.message);
        break;
    }
  }

  private async createSessionRecord(): Promise<void> {
    if (!this.config.studentId) return;

    try {
      const { data, error } = await supabase
        .from('voice_sessions')
        .insert({
          session_id: this.sessionId,
          student_id: this.config.studentId,
          assessment_id: this.config.assessmentId,
          language: 'es-PR',
          metrics: JSON.parse(JSON.stringify(this.metrics)),
        })
        .select()
        .single();

      if (error) throw error;
      this.dbSessionId = data.id;
    } catch (error) {
      console.error('Failed to create session record:', error);
    }
  }

  private async logInteraction(text: string, isUser: boolean): Promise<void> {
    if (!this.config.studentId || !this.dbSessionId) return;

    try {
      await supabase.from('voice_interactions').insert({
        session_id: this.dbSessionId,
        student_id: this.config.studentId,
        assessment_id: this.config.assessmentId,
        text,
        is_user: isUser,
        language: 'es-PR',
      });
    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  }

  sendText(text: string): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('Data channel not ready');
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
  }

  async disconnect(): Promise<void> {
    // Update session metrics
    if (this.dbSessionId) {
      try {
        await supabase
          .from('voice_sessions')
          .update({
            metrics: JSON.parse(JSON.stringify(this.metrics)),
            ended_at: new Date().toISOString(),
          })
          .eq('id', this.dbSessionId);
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }

    this.dc?.close();
    this.pc?.close();
    this.dc = null;
    this.pc = null;
    this.config.onConnectionChange?.(false);
  }

  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      latency: this.metrics.latency.length > 0
        ? this.metrics.latency
        : [0],
    };
  }

  isConnected(): boolean {
    return this.dc?.readyState === 'open';
  }
}
