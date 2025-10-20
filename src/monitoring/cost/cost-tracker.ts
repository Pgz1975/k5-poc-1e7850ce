/**
 * Cost Tracking and Optimization Service
 * Monitors resource costs and provides optimization recommendations
 */

import { EventEmitter } from 'events';
import { CostMetrics } from '../types';
import { alertThresholds } from '../config/monitoring.config';
import { metrics } from '../metrics/prometheus-client';
import { alertManager } from '../alerts/alert-manager';
import { logger } from '../logging/log-aggregator';

interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface OptimizationRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  potentialSavings: number;
  savingsPercentage: number;
  effort: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionItems: string[];
}

class CostTracker extends EventEmitter {
  private currentCosts: CostMetrics | null = null;
  private costHistory: CostMetrics[] = [];
  private dailyBudget: number;
  private monthlyBudget: number;
  private trackingInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.dailyBudget = parseFloat(process.env.DAILY_BUDGET || '100');
    this.monthlyBudget = parseFloat(process.env.MONTHLY_BUDGET || '3000');
    this.startTracking();
  }

  /**
   * Start cost tracking
   */
  private startTracking(): void {
    // Track costs every 5 minutes
    this.trackingInterval = setInterval(() => {
      this.collectCosts();
    }, 5 * 60 * 1000);

    // Initial collection
    this.collectCosts();
  }

  /**
   * Stop cost tracking
   */
  public stop(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  /**
   * Collect current cost metrics
   */
  private async collectCosts(): Promise<void> {
    try {
      const costs = await this.fetchCostData();
      this.currentCosts = costs;
      this.costHistory.push(costs);

      // Trim history (keep last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      this.costHistory = this.costHistory.filter(c => c.timestamp >= thirtyDaysAgo);

      // Update Prometheus metrics
      metrics.setCost('infrastructure', 'compute', costs.computeCost);
      metrics.setCost('infrastructure', 'storage', costs.storageCost);
      metrics.setCost('infrastructure', 'network', costs.networkCost);
      metrics.setCost('infrastructure', 'database', costs.databaseCost);
      metrics.setLlmCost('total', costs.llmTokenCost);

      // Calculate budget utilization
      const dailyUtilization = (costs.currentSpend / this.dailyBudget) * 100;
      metrics.setBudgetUtilization('daily', dailyUtilization);

      // Check budget alerts
      this.checkBudgetAlerts(costs);

      // Analyze for optimization opportunities
      const recommendations = this.analyzeOptimizations(costs);
      if (recommendations.length > 0) {
        this.emit('optimizations', recommendations);
      }

      this.emit('costs:updated', costs);
    } catch (error) {
      logger.error('Failed to collect cost data', error as Error);
      this.emit('costs:error', error);
    }
  }

  /**
   * Fetch cost data from cloud providers
   */
  private async fetchCostData(): Promise<CostMetrics> {
    // In production, this would fetch from AWS Cost Explorer, Azure Cost Management, etc.
    // For now, simulate with estimated costs

    const now = new Date();
    const hourOfDay = now.getHours();
    const dayOfMonth = now.getDate();

    // Simulate realistic cost data
    const computeCost = this.estimateComputeCost();
    const storageCost = this.estimateStorageCost();
    const networkCost = this.estimateNetworkCost();
    const databaseCost = this.estimateDatabaseCost();
    const llmTokenCost = this.estimateLLMCost();
    const embeddingCost = this.estimateEmbeddingCost();

    const totalCost = computeCost + storageCost + networkCost + databaseCost + llmTokenCost + embeddingCost;

    // Calculate daily spend (accumulate throughout the day)
    const previousDailySpend = this.currentCosts?.currentSpend || 0;
    const currentSpend = hourOfDay === 0 ? totalCost : previousDailySpend + totalCost;

    // Project end-of-day spend
    const projectedSpend = hourOfDay > 0 ? (currentSpend / hourOfDay) * 24 : currentSpend;

    return {
      computeCost,
      storageCost,
      networkCost,
      databaseCost,
      llmTokenCost,
      embeddingCost,
      inferenceTime: 0,
      resourceUtilization: this.calculateResourceUtilization(),
      wastedResources: this.calculateWastedResources(),
      optimizationPotential: this.calculateOptimizationPotential(),
      dailyBudget: this.dailyBudget,
      currentSpend,
      projectedSpend,
      budgetVariance: projectedSpend - this.dailyBudget,
      timestamp: now,
      billingPeriod: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    };
  }

  /**
   * Estimate compute costs
   */
  private estimateComputeCost(): number {
    // Simulate compute cost based on instance hours
    // Example: 2 t3.medium instances @ $0.0416/hour
    const instanceCost = 2 * 0.0416 / 12; // Per 5 minutes
    return instanceCost;
  }

  /**
   * Estimate storage costs
   */
  private estimateStorageCost(): number {
    // Simulate storage cost
    // Example: 100GB S3 @ $0.023/GB/month
    const monthlyCost = 100 * 0.023;
    const hourlyCost = monthlyCost / (30 * 24);
    return hourlyCost / 12; // Per 5 minutes
  }

  /**
   * Estimate network costs
   */
  private estimateNetworkCost(): number {
    // Simulate data transfer cost
    // Example: 50GB transfer @ $0.09/GB
    const monthlyCost = 50 * 0.09;
    const hourlyCost = monthlyCost / (30 * 24);
    return hourlyCost / 12; // Per 5 minutes
  }

  /**
   * Estimate database costs
   */
  private estimateDatabaseCost(): number {
    // Simulate RDS cost
    // Example: db.t3.medium @ $0.068/hour
    const hourlyCost = 0.068;
    return hourlyCost / 12; // Per 5 minutes
  }

  /**
   * Estimate LLM API costs
   */
  private estimateLLMCost(): number {
    // Simulate LLM cost based on token usage
    // Example: 1M tokens @ $0.002/1K tokens
    const tokensPerInterval = Math.random() * 10000; // Random between 0-10K tokens per 5 min
    const costPerToken = 0.002 / 1000;
    return tokensPerInterval * costPerToken;
  }

  /**
   * Estimate embedding costs
   */
  private estimateEmbeddingCost(): number {
    // Simulate embedding cost
    const embeddingsPerInterval = Math.random() * 1000;
    const costPerEmbedding = 0.0001 / 1000;
    return embeddingsPerInterval * costPerEmbedding;
  }

  /**
   * Calculate resource utilization
   */
  private calculateResourceUtilization(): number {
    // This would integrate with actual resource metrics
    // For now, return a simulated value between 60-80%
    return 60 + Math.random() * 20;
  }

  /**
   * Calculate wasted resources
   */
  private calculateWastedResources(): number {
    const utilization = this.calculateResourceUtilization();
    // Waste is inversely proportional to utilization
    return (100 - utilization) / 100 * (this.currentCosts?.computeCost || 0);
  }

  /**
   * Calculate optimization potential
   */
  private calculateOptimizationPotential(): number {
    const wastedResources = this.calculateWastedResources();
    // Assume we can optimize 60% of wasted resources
    return wastedResources * 0.6;
  }

  /**
   * Check budget alerts
   */
  private checkBudgetAlerts(costs: CostMetrics): void {
    const dailyUtilization = (costs.projectedSpend / this.dailyBudget);

    // Check thresholds
    if (dailyUtilization >= alertThresholds.dailyBudget.critical) {
      logger.warn('Daily budget critically exceeded', {
        currentSpend: costs.currentSpend,
        projectedSpend: costs.projectedSpend,
        budget: this.dailyBudget,
        utilization: dailyUtilization * 100
      });
    } else if (dailyUtilization >= alertThresholds.dailyBudget.warning) {
      logger.warn('Daily budget warning threshold reached', {
        currentSpend: costs.currentSpend,
        projectedSpend: costs.projectedSpend,
        budget: this.dailyBudget,
        utilization: dailyUtilization * 100
      });
    }
  }

  /**
   * Analyze costs for optimization opportunities
   */
  private analyzeOptimizations(costs: CostMetrics): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Check compute optimization
    if (costs.resourceUtilization < 60) {
      recommendations.push({
        id: 'opt-compute-rightsizing',
        category: 'compute',
        title: 'Right-size compute instances',
        description: `Current resource utilization is ${costs.resourceUtilization.toFixed(1)}%. Consider downsizing instances.`,
        potentialSavings: costs.computeCost * 0.3,
        savingsPercentage: 30,
        effort: 'low',
        priority: 'high',
        actionItems: [
          'Analyze instance metrics over past 7 days',
          'Identify under-utilized instances',
          'Test with smaller instance types',
          'Implement auto-scaling policies'
        ]
      });
    }

    // Check storage optimization
    if (costs.storageCost > 20) {
      recommendations.push({
        id: 'opt-storage-lifecycle',
        category: 'storage',
        title: 'Implement storage lifecycle policies',
        description: 'Move infrequently accessed data to cheaper storage tiers.',
        potentialSavings: costs.storageCost * 0.4,
        savingsPercentage: 40,
        effort: 'medium',
        priority: 'medium',
        actionItems: [
          'Identify data access patterns',
          'Configure S3 Intelligent-Tiering',
          'Set up lifecycle rules for old data',
          'Enable compression for backups'
        ]
      });
    }

    // Check LLM optimization
    if (costs.llmTokenCost > 10) {
      recommendations.push({
        id: 'opt-llm-caching',
        category: 'llm',
        title: 'Implement LLM response caching',
        description: 'Cache common LLM responses to reduce API calls.',
        potentialSavings: costs.llmTokenCost * 0.5,
        savingsPercentage: 50,
        effort: 'low',
        priority: 'high',
        actionItems: [
          'Identify repeated prompts',
          'Implement semantic caching',
          'Set appropriate TTLs for cached responses',
          'Monitor cache hit rates'
        ]
      });
    }

    // Check database optimization
    if (costs.databaseCost > 15) {
      recommendations.push({
        id: 'opt-db-reserved',
        category: 'database',
        title: 'Purchase reserved database instances',
        description: 'Switch from on-demand to reserved instances for 40% savings.',
        potentialSavings: costs.databaseCost * 0.4,
        savingsPercentage: 40,
        effort: 'low',
        priority: 'medium',
        actionItems: [
          'Commit to 1-year reserved instance',
          'Choose appropriate payment option',
          'Monitor instance type requirements'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Get cost breakdown
   */
  public getCostBreakdown(): CostBreakdown[] {
    if (!this.currentCosts) {
      return [];
    }

    const total = this.currentCosts.computeCost +
                  this.currentCosts.storageCost +
                  this.currentCosts.networkCost +
                  this.currentCosts.databaseCost +
                  this.currentCosts.llmTokenCost +
                  this.currentCosts.embeddingCost;

    const breakdown: CostBreakdown[] = [
      {
        category: 'Compute',
        amount: this.currentCosts.computeCost,
        percentage: (this.currentCosts.computeCost / total) * 100,
        trend: this.calculateTrend('computeCost')
      },
      {
        category: 'Storage',
        amount: this.currentCosts.storageCost,
        percentage: (this.currentCosts.storageCost / total) * 100,
        trend: this.calculateTrend('storageCost')
      },
      {
        category: 'Network',
        amount: this.currentCosts.networkCost,
        percentage: (this.currentCosts.networkCost / total) * 100,
        trend: this.calculateTrend('networkCost')
      },
      {
        category: 'Database',
        amount: this.currentCosts.databaseCost,
        percentage: (this.currentCosts.databaseCost / total) * 100,
        trend: this.calculateTrend('databaseCost')
      },
      {
        category: 'LLM/AI',
        amount: this.currentCosts.llmTokenCost + this.currentCosts.embeddingCost,
        percentage: ((this.currentCosts.llmTokenCost + this.currentCosts.embeddingCost) / total) * 100,
        trend: this.calculateTrend('llmTokenCost')
      }
    ];

    return breakdown.sort((a, b) => b.amount - a.amount);
  }

  /**
   * Calculate cost trend
   */
  private calculateTrend(costField: keyof CostMetrics): 'increasing' | 'decreasing' | 'stable' {
    if (this.costHistory.length < 12) { // Need at least 1 hour of data
      return 'stable';
    }

    const recent = this.costHistory.slice(-12); // Last hour
    const older = this.costHistory.slice(-24, -12); // Hour before that

    const recentAvg = recent.reduce((sum, c) => sum + (c[costField] as number || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, c) => sum + (c[costField] as number || 0), 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  /**
   * Get current costs
   */
  public getCurrentCosts(): CostMetrics | null {
    return this.currentCosts;
  }

  /**
   * Get cost forecast
   */
  public getCostForecast(days: number = 7): { date: Date; projected: number }[] {
    if (this.costHistory.length === 0) {
      return [];
    }

    // Simple linear regression based on historical data
    const dailyAverages = this.calculateDailyAverages();

    if (dailyAverages.length === 0) {
      return [];
    }

    const trend = this.calculateOverallTrend(dailyAverages);
    const lastAverage = dailyAverages[dailyAverages.length - 1];

    const forecast: { date: Date; projected: number }[] = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const projected = lastAverage + (trend * i);
      forecast.push({ date, projected });
    }

    return forecast;
  }

  /**
   * Calculate daily cost averages
   */
  private calculateDailyAverages(): number[] {
    const dailyTotals = new Map<string, { total: number; count: number }>();

    for (const costs of this.costHistory) {
      const dateKey = costs.timestamp.toISOString().split('T')[0];
      const total = costs.computeCost + costs.storageCost + costs.networkCost +
                   costs.databaseCost + costs.llmTokenCost + costs.embeddingCost;

      const existing = dailyTotals.get(dateKey) || { total: 0, count: 0 };
      dailyTotals.set(dateKey, {
        total: existing.total + total,
        count: existing.count + 1
      });
    }

    return Array.from(dailyTotals.values()).map(d => d.total / d.count);
  }

  /**
   * Calculate overall cost trend
   */
  private calculateOverallTrend(dailyAverages: number[]): number {
    if (dailyAverages.length < 2) {
      return 0;
    }

    const changes: number[] = [];
    for (let i = 1; i < dailyAverages.length; i++) {
      changes.push(dailyAverages[i] - dailyAverages[i - 1]);
    }

    return changes.reduce((sum, c) => sum + c, 0) / changes.length;
  }

  /**
   * Get cost report for a time period
   */
  public getCostReport(startDate: Date, endDate: Date): {
    totalCost: number;
    breakdown: CostBreakdown[];
    recommendations: OptimizationRecommendation[];
    trends: Record<string, 'increasing' | 'decreasing' | 'stable'>;
  } {
    const periodCosts = this.costHistory.filter(
      c => c.timestamp >= startDate && c.timestamp <= endDate
    );

    if (periodCosts.length === 0) {
      return {
        totalCost: 0,
        breakdown: [],
        recommendations: [],
        trends: {}
      };
    }

    // Sum up all costs
    const totalCost = periodCosts.reduce((sum, c) =>
      sum + c.computeCost + c.storageCost + c.networkCost +
      c.databaseCost + c.llmTokenCost + c.embeddingCost, 0
    );

    return {
      totalCost,
      breakdown: this.getCostBreakdown(),
      recommendations: this.currentCosts ? this.analyzeOptimizations(this.currentCosts) : [],
      trends: {
        compute: this.calculateTrend('computeCost'),
        storage: this.calculateTrend('storageCost'),
        network: this.calculateTrend('networkCost'),
        database: this.calculateTrend('databaseCost'),
        llm: this.calculateTrend('llmTokenCost')
      }
    };
  }
}

// Singleton instance
export const costTracker = new CostTracker();

export default CostTracker;
