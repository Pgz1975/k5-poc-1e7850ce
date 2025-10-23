import { CostMetrics } from '../types/CostMetrics';
import { ModelMetadata } from '../types/ModelMetadata';
import { ModelType } from '../types/ModelType';
import { SpeechRecognizerFactory } from '../factory/SpeechRecognizerFactory';

/**
 * Tracks cost metrics for OpenAI models
 * Persists data to localStorage for session continuity
 */
export class CostTracker {
  private metrics: CostMetrics;
  private model: ModelType;
  private sessionStartTime: Date | null = null;
  private sessionInputTokens = 0;
  private sessionOutputTokens = 0;

  constructor(model: ModelType) {
    this.model = model;
    this.metrics = this.loadFromStorage() || this.createInitialMetrics();
  }

  startSession(): void {
    console.log(`[CostTracker] 📊 Starting session for ${this.model}`);
    this.sessionStartTime = new Date();
    this.sessionInputTokens = 0;
    this.sessionOutputTokens = 0;
  }

  trackTokens(input: number, output: number): void {
    this.sessionInputTokens += input;
    this.sessionOutputTokens += output;
    this.metrics.totalInputTokens += input;
    this.metrics.totalOutputTokens += output;
    this.updateCost();
  }

  endSession(): void {
    if (this.sessionStartTime) {
      console.log(`[CostTracker] 📊 Ending session for ${this.model}`);
      this.metrics.sessionsCount++;
      this.metrics.lastSessionCost = this.calculateSessionCost();
      this.metrics.averageCostPerSession =
        this.metrics.totalCost / this.metrics.sessionsCount;
      this.metrics.timestamp = new Date();
      this.saveToStorage();
      this.sessionStartTime = null;
      
      console.log(`[CostTracker] Session cost: $${this.metrics.lastSessionCost.toFixed(4)}`);
      console.log(`[CostTracker] Total cost: $${this.metrics.totalCost.toFixed(4)}`);
    }
  }

  private updateCost(): void {
    const metadata = this.getModelMetadata();
    this.metrics.totalCost =
      (this.metrics.totalInputTokens * metadata.costPerInputToken) +
      (this.metrics.totalOutputTokens * metadata.costPerOutputToken);
  }

  private calculateSessionCost(): number {
    const metadata = this.getModelMetadata();
    return (
      (this.sessionInputTokens * metadata.costPerInputToken) +
      (this.sessionOutputTokens * metadata.costPerOutputToken)
    );
  }

  getMetrics(): CostMetrics {
    return { ...this.metrics };
  }

  private saveToStorage(): void {
    try {
      const key = `cost_metrics_${this.model}`;
      localStorage.setItem(key, JSON.stringify(this.metrics));
      console.log(`[CostTracker] 💾 Saved metrics to localStorage: ${key}`);
    } catch (error) {
      console.error('[CostTracker] ❌ Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): CostMetrics | null {
    try {
      const key = `cost_metrics_${this.model}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const metrics = JSON.parse(stored);
        // Convert timestamp string back to Date
        metrics.timestamp = new Date(metrics.timestamp);
        console.log(`[CostTracker] 📂 Loaded metrics from localStorage: ${key}`);
        return metrics;
      }
    } catch (error) {
      console.error('[CostTracker] ❌ Failed to load from localStorage:', error);
    }
    return null;
  }

  private createInitialMetrics(): CostMetrics {
    return {
      model: this.model,
      sessionsCount: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
      averageCostPerSession: 0,
      lastSessionCost: 0,
      timestamp: new Date()
    };
  }

  private getModelMetadata(): ModelMetadata {
    const recognizer = SpeechRecognizerFactory.create(this.model);
    return recognizer.getMetadata();
  }
}
