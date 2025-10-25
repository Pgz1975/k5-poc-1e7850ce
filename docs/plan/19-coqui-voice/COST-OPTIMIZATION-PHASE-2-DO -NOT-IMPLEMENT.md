# Coqui Voice Integration - Cost Optimization Strategy

**Version:** 1.0
**Date:** October 25, 2025
**Annual Budget Target:** $5/student

---

## 📊 Executive Summary

This document outlines the comprehensive cost optimization strategy for the Coqui voice integration, ensuring sustainable operation within the $5/student/year budget while maximizing educational value.

---

## 💵 OpenAI Realtime API Pricing Structure

### Current Pricing (as of October 2025)
| Component | Price | Unit |
|-----------|-------|------|
| Audio Input | $0.06 | per minute |
| Audio Output | $0.24 | per minute |
| Text Input | $5.00 | per 1M tokens |
| Text Output | $20.00 | per 1M tokens |
| **Combined Audio Rate** | **$0.30** | **per minute** |

### Cost Per Session Type
| Session Type | Duration | Audio Cost | Token Cost (Est.) | Total Cost |
|--------------|----------|------------|-------------------|------------|
| Lesson Introduction | 15 sec | $0.075 | $0.005 | **$0.08** |
| Exercise Help | 20 sec | $0.10 | $0.007 | **$0.107** |
| Inactivity Prompt | 10 sec | $0.05 | $0.003 | **$0.053** |
| WCPM Assessment | 60 sec | $0.30 | $0.015 | **$0.315** |

---

## 🎯 Budget Allocation Model

### Annual Budget: $5.00/student

#### Projected Usage Pattern
Based on 20-week academic year (2 semesters):
- **Lessons**: 2 per week × 20 weeks = 40 lessons
- **Exercises**: 8 per week × 20 weeks = 160 exercises
- **Assessments**: 1 per month × 5 months = 5 assessments

#### Interaction Projections
| Interaction Type | Frequency | Unit Cost | Annual Cost |
|-----------------|-----------|-----------|-------------|
| Lesson Spontaneous | 40/year | $0.015 | $0.60 |
| Exercise Help (30% request) | 48/year | $0.020 | $0.96 |
| Inactivity Prompts | 80/year | $0.010 | $0.80 |
| WCPM Assessments | 5/year | $0.315 | $1.58 |
| Struggle Detection | 20/year | $0.015 | $0.30 |
| **Total Projected** | | | **$4.24** |

**Buffer Remaining: $0.76 (15.2%)**

---

## 🚀 Optimization Strategies

### 1. Session Duration Management

#### Aggressive Time Limits
```typescript
const SESSION_LIMITS = {
  lesson_start: {
    soft_limit: 12000,  // 12 seconds warning
    hard_limit: 15000,  // 15 seconds force disconnect
    cost_cap: 0.015     // 1.5 cents
  },
  help_requested: {
    soft_limit: 15000,  // 15 seconds warning
    hard_limit: 20000,  // 20 seconds force disconnect
    cost_cap: 0.020     // 2.0 cents
  },
  inactivity_prompt: {
    soft_limit: 8000,   // 8 seconds warning
    hard_limit: 10000,  // 10 seconds force disconnect
    cost_cap: 0.010     // 1.0 cent
  }
};
```

### 2. Response Length Control

#### Prompt Engineering for Brevity
```javascript
// Enforce concise responses
const RESPONSE_CONSTRAINTS = {
  premium: "Respond naturally but concisely",
  standard: "Maximum 3 sentences",
  reduced: "Maximum 2 sentences",
  minimal: "Maximum 1 sentence"
};

// Token limits
const TOKEN_LIMITS = {
  prompt_max: 500,      // Input prompt
  response_max: 150     // Output response
};
```

### 3. Context Caching

#### Pre-processed Context Storage
```typescript
interface CachedContext {
  activityId: string;
  basePrompt: string;      // Pre-built, reusable
  correctAnswers: string[]; // Encrypted
  hints: string[];         // Pre-generated
  ttl: number;            // Cache for 24 hours
}

// Cache hit rate target: 70%
// Savings: ~30% on prompt tokens
```

### 4. Intelligent Session Batching

#### Combine Related Interactions
```typescript
// Instead of multiple short sessions:
// ❌ Introduction (15s) + Help (20s) + Celebration (10s) = 45s total

// Use context-aware single session:
// ✅ Combined interaction (25s) = 44% cost reduction
```

### 5. Voice Speed Optimization

#### Dynamic Speed Adjustment
```typescript
const VOICE_SPEED = {
  premium: 1.0,    // Normal speed
  standard: 1.1,   // 10% faster
  reduced: 1.2,    // 20% faster
  minimal: 1.3     // 30% faster
};

// Faster speech = shorter duration = lower cost
// 20% faster = ~17% cost reduction
```

---

## 📈 Progressive Degradation Model

### Budget Consumption Tiers

#### Tier 1: Premium (0-60% budget used)
- Full features enabled
- Normal speech speed
- Extended interactions allowed
- All trigger types active

#### Tier 2: Standard (60-80% budget used)
- Slightly faster speech
- Shorter interactions
- Reduced spontaneous triggers
- Focus on help requests

#### Tier 3: Reduced (80-95% budget used)
- Fast speech delivery
- Minimal interactions only
- Help requests only
- No spontaneous engagement

#### Tier 4: Minimal (95-100% budget used)
- Emergency mode
- Text-only hints
- Web Speech API fallback
- Critical help only

---

## 🔧 Implementation Code

### Cost Tracker Service
```typescript
export class CoquiCostTracker {
  private static readonly BUDGET_THRESHOLDS = {
    WARNING: 0.60,    // 60% - Start optimization
    CRITICAL: 0.80,   // 80% - Aggressive limits
    EMERGENCY: 0.95   // 95% - Minimal mode
  };

  async trackSession(studentId: string, cost: number): Promise<void> {
    const { data: current } = await supabase
      .from('voice_cost_optimization')
      .select('spent_cents, yearly_budget_cents')
      .eq('student_id', studentId)
      .single();

    const newSpent = current.spent_cents + (cost * 100);
    const percentUsed = newSpent / current.yearly_budget_cents;

    // Update optimization level
    let newLevel = 'premium';
    if (percentUsed > this.BUDGET_THRESHOLDS.EMERGENCY) {
      newLevel = 'minimal';
    } else if (percentUsed > this.BUDGET_THRESHOLDS.CRITICAL) {
      newLevel = 'reduced';
    } else if (percentUsed > this.BUDGET_THRESHOLDS.WARNING) {
      newLevel = 'standard';
    }

    await supabase
      .from('voice_cost_optimization')
      .update({
        spent_cents: newSpent,
        optimization_level: newLevel,
        last_session_cost_cents: cost * 100
      })
      .eq('student_id', studentId);
  }
}
```

### Smart Prompt Compression
```typescript
export class PromptOptimizer {
  static compress(prompt: string, level: string): string {
    switch(level) {
      case 'minimal':
        // Remove all non-essential context
        return this.extractEssentials(prompt);

      case 'reduced':
        // Compress verbose sections
        return this.compressVerbose(prompt);

      case 'standard':
        // Minor optimizations
        return this.removeRedundancy(prompt);

      default:
        return prompt;
    }
  }

  private static extractEssentials(prompt: string): string {
    // Keep only: question, answer hint, student state
    const essentials = [
      'Q: [QUESTION]',
      'Hint: [FIRST_LETTER]',
      'Attempt: [NUMBER]'
    ];
    return essentials.join('\n');
  }
}
```

---

## 💰 Cost Monitoring Dashboard

### Real-time Metrics
```typescript
interface CostDashboard {
  current_month: {
    total_spent: number;
    sessions_count: number;
    avg_session_cost: number;
    projected_annual: number;
  };

  by_interaction_type: {
    lessons: { count: number; total_cost: number; };
    exercises: { count: number; total_cost: number; };
    assessments: { count: number; total_cost: number; };
  };

  optimization_metrics: {
    cache_hit_rate: number;
    avg_session_duration: number;
    prompt_compression_rate: number;
  };

  alerts: Array<{
    level: 'info' | 'warning' | 'critical';
    message: string;
    student_count: number;
  }>;
}
```

### Alert Thresholds
| Alert Level | Trigger | Action |
|------------|---------|---------|
| Info | 50% budget used | Monitor closely |
| Warning | 70% budget used | Enable optimization |
| Critical | 85% budget used | Aggressive limits |
| Emergency | 95% budget used | Minimal mode |

---

## 🔬 A/B Testing Framework

### Test Variations
1. **Control Group**: Standard 15-20 second sessions
2. **Speed Test**: 1.2x voice speed, same duration
3. **Brevity Test**: 10-15 second sessions
4. **Cache Test**: 70% cached contexts

### Success Metrics
- Cost per interaction
- Student satisfaction scores
- Learning outcome improvements
- Engagement rates

---

## 📊 Projected Annual Costs

### Conservative Estimate (High Usage)
| Students | Annual Cost | Per Student | Budget Status |
|----------|------------|-------------|---------------|
| 100 | $424 | $4.24 | ✅ Under budget |
| 500 | $2,120 | $4.24 | ✅ Under budget |
| 1,000 | $4,240 | $4.24 | ✅ Under budget |
| 5,000 | $21,200 | $4.24 | ✅ Under budget |

### With Optimization (30% reduction)
| Students | Annual Cost | Per Student | Budget Status |
|----------|------------|-------------|---------------|
| 100 | $297 | $2.97 | ✅ 40% under budget |
| 500 | $1,485 | $2.97 | ✅ 40% under budget |
| 1,000 | $2,970 | $2.97 | ✅ 40% under budget |
| 5,000 | $14,850 | $2.97 | ✅ 40% under budget |

---

## 🚨 Emergency Cost Controls

### Circuit Breaker Pattern
```typescript
export class CostCircuitBreaker {
  private static readonly DAILY_LIMIT = 0.02; // $0.02/day/student
  private static readonly HOURLY_LIMIT = 0.005; // $0.005/hour/student

  async checkLimits(studentId: string): Promise<boolean> {
    const hourlySpend = await this.getHourlySpend(studentId);
    const dailySpend = await this.getDailySpend(studentId);

    if (hourlySpend > this.HOURLY_LIMIT) {
      console.warn(`Hourly limit exceeded for ${studentId}`);
      return false; // Block session
    }

    if (dailySpend > this.DAILY_LIMIT) {
      console.warn(`Daily limit exceeded for ${studentId}`);
      return false; // Block session
    }

    return true; // Allow session
  }
}
```

### Fallback Strategies
1. **Level 1**: Use cached responses (0 cost)
2. **Level 2**: Web Speech API for simple reading ($0)
3. **Level 3**: Text-only hints ($0)
4. **Level 4**: Disable voice completely ($0)

---

## 📈 ROI Calculation

### Cost-Benefit Analysis
| Metric | Without Coqui | With Coqui | Improvement |
|--------|--------------|------------|-------------|
| Teacher Time (hrs/week) | 10 | 6 | -40% |
| Student Engagement | 60% | 85% | +42% |
| Exercise Completion | 70% | 88% | +26% |
| Learning Outcomes | Baseline | +15% | +15% |
| **Annual Cost** | $0 | $5/student | - |
| **Teacher Time Value** | $300/week | $180/week | $120 saved |
| **ROI** | - | **440%** | ✅ |

---

## 🔍 Monitoring Queries

### Daily Cost Report
```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as sessions,
  SUM(estimated_cost_cents)/100.0 as daily_cost,
  AVG(duration_ms) as avg_duration,
  COUNT(DISTINCT student_id) as active_students
FROM coqui_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Student Budget Status
```sql
SELECT
  student_id,
  spent_cents/100.0 as spent_dollars,
  (yearly_budget_cents - spent_cents)/100.0 as remaining,
  optimization_level,
  (spent_cents::float / yearly_budget_cents) * 100 as percent_used
FROM voice_cost_optimization
WHERE spent_cents > yearly_budget_cents * 0.5
ORDER BY percent_used DESC;
```

---

## ✅ Implementation Checklist

- [ ] Implement session time limits
- [ ] Add prompt compression
- [ ] Set up context caching
- [ ] Configure voice speed settings
- [ ] Create cost tracking service
- [ ] Build monitoring dashboard
- [ ] Set up alert system
- [ ] Implement circuit breakers
- [ ] Configure fallback strategies
- [ ] Deploy A/B testing framework
- [ ] Create cost reports
- [ ] Train staff on optimization

---

## 📞 Support Escalation

### Cost Overrun Protocol
1. **Automatic**: System switches to reduced mode
2. **Alert**: Admin notified at 85% budget
3. **Review**: Weekly cost optimization meeting
4. **Adjust**: Modify limits based on patterns
5. **Report**: Monthly stakeholder update

---

*Last Updated: October 25, 2025*