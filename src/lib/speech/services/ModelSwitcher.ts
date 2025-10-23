import { ISpeechRecognizer } from '../interfaces/ISpeechRecognizer';
import { SpeechRecognizerFactory } from '../factory/SpeechRecognizerFactory';
import { ModelType } from '../types/ModelType';
import { RecognizerConfig } from '../types/RecognizerConfig';

/**
 * Service for switching between speech recognition models
 * Handles state preservation and smooth transitions
 */
export class ModelSwitcher {
  private currentRecognizer: ISpeechRecognizer | null = null;
  private currentModel: ModelType | null = null;
  private currentConfig: RecognizerConfig | null = null;
  private isTransitioning = false;
  private preservedTranscript: Array<{text: string, isUser: boolean}> = [];

  /**
   * Switch to a new model while preserving state
   */
  async switchModel(
    newModel: ModelType,
    config: RecognizerConfig,
    preserveTranscript = true
  ): Promise<ISpeechRecognizer> {
    console.log(`[ModelSwitcher] 🔄 Switching from ${this.currentModel} to ${newModel}`);
    
    // Set transitioning flag
    this.isTransitioning = true;

    try {
      // Disconnect current recognizer if exists
      if (this.currentRecognizer) {
        console.log('[ModelSwitcher] 🔌 Disconnecting current recognizer');
        
        // Save transcript if requested
        if (preserveTranscript && this.preservedTranscript.length > 0) {
          console.log(`[ModelSwitcher] 💾 Preserving ${this.preservedTranscript.length} transcript entries`);
        }
        
        // Disconnect
        await this.currentRecognizer.disconnect();
        
        // Clear factory instance for the old model
        if (this.currentModel) {
          SpeechRecognizerFactory.clearInstance(this.currentModel);
        }
      }

      // Create new recognizer
      console.log(`[ModelSwitcher] 🏭 Creating new recognizer for ${newModel}`);
      const newRecognizer = SpeechRecognizerFactory.create(newModel);

      // Connect with new config
      console.log('[ModelSwitcher] 🔌 Connecting new recognizer');
      await newRecognizer.connect(config);

      // Update state
      this.currentRecognizer = newRecognizer;
      this.currentModel = newModel;
      this.currentConfig = config;

      console.log('[ModelSwitcher] ✅ Model switch completed');
      return newRecognizer;

    } catch (error) {
      console.error('[ModelSwitcher] ❌ Model switch failed:', error);
      throw error;
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Update preserved transcript
   */
  updateTranscript(transcript: Array<{text: string, isUser: boolean}>): void {
    this.preservedTranscript = transcript;
  }

  /**
   * Get current model type
   */
  getCurrentModel(): ModelType | null {
    return this.currentModel;
  }

  /**
   * Check if currently transitioning
   */
  isModelTransitioning(): boolean {
    return this.isTransitioning;
  }

  /**
   * Get preserved transcript
   */
  getPreservedTranscript(): Array<{text: string, isUser: boolean}> {
    return this.preservedTranscript;
  }

  /**
   * Clear all state
   */
  async clear(): Promise<void> {
    console.log('[ModelSwitcher] 🗑️ Clearing all state');
    
    if (this.currentRecognizer) {
      await this.currentRecognizer.disconnect();
    }
    
    if (this.currentModel) {
      SpeechRecognizerFactory.clearInstance(this.currentModel);
    }

    this.currentRecognizer = null;
    this.currentModel = null;
    this.currentConfig = null;
    this.preservedTranscript = [];
    this.isTransitioning = false;
  }
}
