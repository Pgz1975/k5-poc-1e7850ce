/**
 * Speech Recognition Abstraction Layer
 * Provides unified interface for Web Speech API and OpenAI Realtime API
 */

// Core interface
export type { ISpeechRecognizer } from './interfaces/ISpeechRecognizer';

// Types
export { ModelType, ModelFeature } from './types/ModelType';
export type { ModelProvider } from './types/ModelType';
export type { RecognizerConfig } from './types/RecognizerConfig';
export type { CostMetrics } from './types/CostMetrics';
export type { ModelMetadata } from './types/ModelMetadata';

// Adapters
export { WebSpeechAdapter } from './adapters/WebSpeechAdapter';
export { OpenAIRealtimeAdapter } from './adapters/OpenAIRealtimeAdapter';

// Services
export { CostTracker } from './services/CostTracker';

// Factory
export { SpeechRecognizerFactory } from './factory/SpeechRecognizerFactory';
