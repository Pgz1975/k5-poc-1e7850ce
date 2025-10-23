import { ModelType } from './ModelType';

/**
 * Cost tracking metrics for a speech recognition model
 */
export interface CostMetrics {
  /** Model being tracked */
  model: ModelType;
  
  /** Total number of sessions */
  sessionsCount: number;
  
  /** Total input tokens consumed */
  totalInputTokens: number;
  
  /** Total output tokens consumed */
  totalOutputTokens: number;
  
  /** Total cost in USD */
  totalCost: number;
  
  /** Average cost per session in USD */
  averageCostPerSession: number;
  
  /** Cost of the last session in USD */
  lastSessionCost: number;
  
  /** Timestamp of last update */
  timestamp: Date;
}
