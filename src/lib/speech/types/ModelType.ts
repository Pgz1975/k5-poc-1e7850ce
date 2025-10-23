/**
 * Available speech recognition models
 */
export enum ModelType {
  WEB_SPEECH = 'web-speech-api',
  GPT4O_REALTIME = 'gpt-4o-realtime-preview-2024-12-17',
  GPT4O_REALTIME_LEGACY = 'gpt-4o-realtime-preview-2024-10-01',
  GPT4O_MINI_REALTIME = 'gpt-4o-mini-realtime-preview-2024-12-17'
}

/**
 * Model features available
 */
export enum ModelFeature {
  REAL_TIME_TRANSCRIPTION = 'real-time-transcription',
  EMOTION_DETECTION = 'emotion-detection',
  FUNCTION_CALLING = 'function-calling',
  IMAGE_SUPPORT = 'image-support',
  OFFLINE_MODE = 'offline-mode',
  INTERRUPTION_HANDLING = 'interruption-handling'
}

/**
 * Model provider types
 */
export type ModelProvider = 'browser' | 'openai';
