import { supabase } from '@/integrations/supabase/client';
import { ModelType } from '../types/ModelType';

export interface UsageSession {
  id: string;
  studentId: string;
  modelType: ModelType;
  startedAt: Date;
  endedAt?: Date;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export class CostDatabaseService {
  private currentSession: UsageSession | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = crypto.randomUUID();
  }

  /**
   * Start tracking a new usage session
   */
    async startSession(studentId: string, modelType: ModelType): Promise<void> {
      try {
        const { data, error } = await supabase
          .from('voice_model_usage')
          .insert({
            student_id: studentId,
            session_id: this.sessionId,
            model: modelType,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        this.currentSession = {
          id: data.id,
          studentId,
          modelType,
          startedAt: new Date(data.created_at),
          inputTokens: 0,
          outputTokens: 0,
          estimatedCost: 0
        };

        console.log('[CostDB] Session started:', this.currentSession.id);
      } catch (error) {
        console.error('[CostDB] Failed to start session:', error);
      }
    }

  /**
   * Update token usage
   */
    async updateTokenUsage(inputTokens: number, outputTokens: number, cost: number): Promise<void> {
      if (!this.currentSession) return;

      this.currentSession.inputTokens += inputTokens;
      this.currentSession.outputTokens += outputTokens;
      this.currentSession.estimatedCost += cost;

      try {
        const { error } = await supabase
          .from('voice_model_usage')
          .update({
            input_tokens: this.currentSession.inputTokens,
            output_tokens: this.currentSession.outputTokens,
            session_cost: this.currentSession.estimatedCost
          })
          .eq('id', this.currentSession.id);

        if (error) throw error;
      } catch (error) {
        console.error('[CostDB] Failed to update tokens:', error);
      }
    }

  /**
   * End the current session
   */
    async endSession(): Promise<void> {
      if (!this.currentSession) return;

      const endedAt = new Date();
      const durationSeconds = Math.floor(
        (endedAt.getTime() - this.currentSession.startedAt.getTime()) / 1000
      );

      try {
        const { error } = await supabase
          .from('voice_model_usage')
          .update({
            updated_at: endedAt.toISOString(),
            session_duration_seconds: durationSeconds,
            session_cost: this.currentSession.estimatedCost
          })
          .eq('id', this.currentSession.id);

        if (error) throw error;

        console.log('[CostDB] Session ended:', this.currentSession.id);
        this.currentSession = null;
      } catch (error) {
        console.error('[CostDB] Failed to end session:', error);
      }
    }

  /**
   * Log a model switch event
   */
  async logModelSwitch(
    studentId: string,
    fromModel: ModelType | null,
    toModel: ModelType,
    reason?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('model_switch_events')
        .insert({
          student_id: studentId,
          session_id: this.sessionId,
          from_model: fromModel,
          to_model: toModel,
          switch_reason: reason,
          switched_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('[CostDB] Model switch logged:', fromModel, '->', toModel);
    } catch (error) {
      console.error('[CostDB] Failed to log switch:', error);
    }
  }

  /**
   * Get usage statistics for a student
   */
    async getStudentUsageStats(studentId: string, days: number = 30): Promise<any> {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      try {
        const { data, error } = await supabase
          .from('voice_model_usage')
          .select('*')
          .eq('student_id', studentId)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate totals by model
        const statsByModel = data.reduce((acc: any, session: any) => {
          const model = session.model;
          if (!acc[model]) {
            acc[model] = {
              sessions: 0,
              totalCost: 0,
              totalDuration: 0,
              totalInputTokens: 0,
              totalOutputTokens: 0
            };
          }

          acc[model].sessions++;
          acc[model].totalCost += session.session_cost || 0;
          acc[model].totalDuration += session.session_duration_seconds || 0;
          acc[model].totalInputTokens += session.input_tokens || 0;
          acc[model].totalOutputTokens += session.output_tokens || 0;

          return acc;
        }, {});

        return {
          totalSessions: data.length,
          totalCost: data.reduce((sum, s) => sum + (s.session_cost || 0), 0),
          byModel: statsByModel,
          recentSessions: data.slice(0, 10)
        };
      } catch (error) {
        console.error('[CostDB] Failed to get stats:', error);
        return null;
      }
    }

  /**
   * Get organization-wide usage statistics (admin only)
   */
    async getOrganizationStats(days: number = 30): Promise<any> {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      try {
        // Get aggregate stats
        const { data: costs, error: costsError } = await supabase
          .from('voice_model_usage')
          .select('model, session_cost, session_duration_seconds')
          .gte('created_at', startDate.toISOString());

        if (costsError) throw costsError;

        // Get switch events
        const { data: switches, error: switchError } = await supabase
          .from('model_switch_events')
          .select('from_model, to_model')
          .gte('switched_at', startDate.toISOString());

        if (switchError) throw switchError;

        return {
          totalCost: costs.reduce((sum, c) => sum + (c.session_cost || 0), 0),
          totalSessions: costs.length,
          totalSwitches: switches.length,
          averageCostPerSession: costs.length > 0
            ? costs.reduce((sum, c) => sum + (c.session_cost || 0), 0) / costs.length
            : 0,
          modelDistribution: this.calculateModelDistribution(costs),
          switchPatterns: this.analyzeSwitchPatterns(switches)
        };
      } catch (error) {
        console.error('[CostDB] Failed to get org stats:', error);
        return null;
      }
    }

  private calculateModelDistribution(costs: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    const total = costs.length;

    costs.forEach(cost => {
      distribution[cost.model] = (distribution[cost.model] || 0) + 1;
    });

    // Convert to percentages
    Object.keys(distribution).forEach(model => {
      distribution[model] = (distribution[model] / total) * 100;
    });

    return distribution;
  }

  private analyzeSwitchPatterns(switches: any[]): Record<string, number> {
    const patterns: Record<string, number> = {};

    switches.forEach(sw => {
      const pattern = `${sw.from_model || 'start'} → ${sw.to_model}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });

    return patterns;
  }
}
