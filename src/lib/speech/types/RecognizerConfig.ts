import { ModelType } from './ModelType';

/**
 * Configuration for speech recognizer initialization
 */
export interface RecognizerConfig {
  /** Speech recognition model to use */
  model: ModelType;
  
  /** Recognition language */
  language: 'es-PR' | 'en-US';
  
  /** Student identifier for tracking (optional) */
  studentId?: string;
  
  /** Custom voice guidance/instructions (optional) */
  voiceGuidance?: string;
  
  /** Callback for transcription events */
  onTranscription?: (text: string, isUser: boolean) => void;
  
  /** Callback for error events */
  onError?: (error: Error) => void;
  
  /** Callback for connection state changes */
  onConnectionChange?: (connected: boolean) => void;
  
  /** Callback for audio level changes */
  onAudioLevel?: (level: number) => void;
}
