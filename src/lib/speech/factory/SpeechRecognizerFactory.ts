import { ISpeechRecognizer } from '../interfaces/ISpeechRecognizer';
import { ModelType } from '../types/ModelType';
import { WebSpeechAdapter } from '../adapters/WebSpeechAdapter';
import { OpenAIRealtimeAdapter } from '../adapters/OpenAIRealtimeAdapter';

/**
 * Factory for creating speech recognizer instances
 * Uses singleton pattern to reuse instances efficiently
 */
export class SpeechRecognizerFactory {
  private static instances: Map<ModelType, ISpeechRecognizer> = new Map();

  /**
   * Create or retrieve a speech recognizer instance
   * @param model Model type to create
   * @returns Speech recognizer instance
   */
  static create(model: ModelType): ISpeechRecognizer {
    console.log(`[SpeechRecognizerFactory] 🏭 Creating recognizer for: ${model}`);
    
    // Check if we already have an instance
    if (this.instances.has(model)) {
      console.log(`[SpeechRecognizerFactory] ♻️ Reusing existing instance`);
      return this.instances.get(model)!;
    }

    let recognizer: ISpeechRecognizer;

    switch (model) {
      case ModelType.WEB_SPEECH:
        recognizer = new WebSpeechAdapter();
        break;

      case ModelType.GPT4O_MINI_REALTIME:
      case ModelType.GPT4O_REALTIME:
      case ModelType.GPT4O_REALTIME_LEGACY:
        recognizer = new OpenAIRealtimeAdapter(model);
        break;

      default:
        throw new Error(`Unsupported model: ${model}`);
    }

    this.instances.set(model, recognizer);
    console.log(`[SpeechRecognizerFactory] ✅ Created new instance`);
    return recognizer;
  }

  /**
   * Clear a specific model instance
   * @param model Model to clear
   */
  static clearInstance(model: ModelType): void {
    const instance = this.instances.get(model);
    if (instance) {
      console.log(`[SpeechRecognizerFactory] 🗑️ Clearing instance: ${model}`);
      instance.disconnect();
      this.instances.delete(model);
    }
  }

  /**
   * Clear all instances
   */
  static clearAll(): void {
    console.log('[SpeechRecognizerFactory] 🗑️ Clearing all instances');
    this.instances.forEach((instance) => instance.disconnect());
    this.instances.clear();
  }
}
