import { ModelType, ModelFeature, ModelProvider } from './ModelType';

/**
 * Metadata describing a speech recognition model
 */
export interface ModelMetadata {
  /** Display name of the model */
  name: string;
  
  /** Model type identifier */
  type: ModelType;
  
  /** Provider of the model */
  provider: ModelProvider;
  
  /** Cost per input token in USD */
  costPerInputToken: number;
  
  /** Cost per output token in USD */
  costPerOutputToken: number;
  
  /** Features supported by this model */
  features: ModelFeature[];
  
  /** Accuracy rate (0-1) */
  accuracy: number;
  
  /** Average latency in milliseconds */
  averageLatency: number;
}
