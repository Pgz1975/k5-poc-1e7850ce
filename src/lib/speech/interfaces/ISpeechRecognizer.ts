import { RecognizerConfig } from '../types/RecognizerConfig';
import { CostMetrics } from '../types/CostMetrics';
import { ModelMetadata } from '../types/ModelMetadata';

/**
 * Core interface for all speech recognizer implementations
 */
export interface ISpeechRecognizer {
  /**
   * Connect to the speech recognition service
   * @param config Configuration options
   */
  connect(config: RecognizerConfig): Promise<void>;
  
  /**
   * Disconnect from the speech recognition service
   */
  disconnect(): Promise<void>;
  
  /**
   * Check if the recognizer is currently active
   */
  isActive(): boolean;
  
  /**
   * Send text to be spoken by the AI
   * @param text Text to speak
   */
  sendText(text: string): void;
  
  /**
   * Get cost metrics for this recognizer
   */
  getCost(): CostMetrics;
  
  /**
   * Get metadata about this model
   */
  getMetadata(): ModelMetadata;
}
