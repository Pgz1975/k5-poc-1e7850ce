import { ISpeechRecognizer } from '../interfaces/ISpeechRecognizer';
import { SpeechRecognizerFactory } from '../factory/SpeechRecognizerFactory';
import { ModelType } from '../types/ModelType';
import { RecognizerConfig } from '../types/RecognizerConfig';
import { CostDatabaseService } from './CostDatabaseService';

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
  private costDbService: CostDatabaseService;

  constructor() {
    this.costDbService = new CostDatabaseService();
  }

  /**
   * Switch to a new model while preserving state
   */
  async switchModel(
    newModel: ModelType,
    config: RecognizerConfig,
    preserveTranscript = true
  ): Promise<ISpeechRecognizer> {
    console.log(`[ModelSwitcher] 🔄 Switching from ${this.currentModel} to ${newModel}`);
    
    // Check cost limits before switching to paid models
    const canSwitch = await this.checkCostLimit(config.studentId || 'anonymous', newModel);
    if (!canSwitch) {
      throw new Error('Cost limit exceeded. Please use Web Speech API.');
    }

    // Set transitioning flag
    this.isTransitioning = true;

    try {
      // Log the switch event
      await this.costDbService.logModelSwitch(
        config.studentId || 'anonymous',
        this.currentModel,
        newModel,
        'User requested switch'
      );
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
   * Check cost limit before switching models
   */
  async checkCostLimit(studentId: string, targetModel: ModelType): Promise<boolean> {
    // Skip check for free model
    if (targetModel === ModelType.WEB_SPEECH) return true;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-cost-limits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ studentId, modelType: targetModel })
        }
      );

      const { allowed, remaining } = await response.json();

      if (!allowed) {
        throw new Error(`Monthly cost limit reached. Please use Web Speech API (free).`);
      }

      if (remaining < 1) {
        console.warn(`[ModelSwitcher] Warning: Only $${remaining.toFixed(2)} remaining in monthly budget`);
      }

      return allowed;
    } catch (error) {
      console.error('[ModelSwitcher] Cost limit check failed:', error);
      // Fail open for now - allow the switch
      return true;
    }
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
