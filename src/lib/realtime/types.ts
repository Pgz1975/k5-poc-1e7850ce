// Types for the bilingual realtime demo

export type Language = 'es' | 'en';

export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

export interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  language: Language;
  confidence?: number;
}

export interface RealtimeError {
  type: 'connection' | 'audio' | 'token' | 'network' | 'permission';
  message: string;
  code?: string;
  retryable: boolean;
}

export interface TokenResponse {
  id: string;
  client_secret: {
    value: string;
    expires_at: string;
  };
  model: string;
  voice: string;
  language: Language;
  instructions: string;
  metadata?: {
    language: Language;
    voice: string;
    created_at: string;
  };
}

export interface TokenRequest {
  language: Language;
  studentId?: string;
  sessionMetadata?: {
    grade?: string;
    activity?: string;
  };
}

export interface OpenAIEvent {
  type: string;
  event_id?: string;
  [key: string]: any;
}

export interface ConversationItem {
  id: string;
  type: 'message';
  role: 'user' | 'assistant';
  content: Array<{
    type: 'text' | 'input_text' | 'audio';
    text?: string;
    audio?: string;
  }>;
}

export interface AudioConfiguration {
  sampleRate: number;
  channelCount: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

export interface RealtimeClientOptions {
  onConnectionStateChange?: (state: ConnectionState) => void;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  onError?: (error: RealtimeError) => void;
  onLatencyUpdate?: (latency: number) => void;
  onAudioLevelUpdate?: (level: number) => void;
}

export interface LanguageConfig {
  voice: string;
  greetingMessage: string;
  uiText: {
    connecting: string;
    connected: string;
    disconnected: string;
    reconnecting: string;
    mute: string;
    unmute: string;
    retry: string;
    speakNow: string;
    listening: string;
    you: string;
    guide: string;
  };
  errorMessages: {
    microphoneError: string;
    connectionError: string;
    networkError: string;
    tokenError: string;
    sessionExpired: string;
  };
}