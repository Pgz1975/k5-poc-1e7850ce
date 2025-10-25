# Coqui Voice Integration - Implementation Plan V2 (Demo-First Approach)

**Version:** 2.0
**Date:** October 25, 2025
**Approach:** Natural Conversations with Smart Timeout
**Timeline:** 6 Weeks

---

## 📋 Table of Contents

1. [Updated Approach](#updated-approach)
2. [Inactivity Management System](#inactivity-management-system)
3. [Visual Timeout Component](#visual-timeout-component)
4. [Session Management](#session-management)
5. [Demo vs Production Modes](#demo-vs-production-modes)

---

## 🎯 Updated Approach

### Core Principle: **Natural Conversations First**

**Demo/POC Mode**:
- ✅ Uninterrupted natural conversations
- ✅ Smart 15-second inactivity detection
- ✅ Friendly visual timeout indicators
- ✅ Easy session restart
- ❌ No cost-based interruptions
- ❌ No hard duration limits

---

## 🔄 Inactivity Management System

### Core Logic Flow (Hook-Based)

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCoquiInactivity({
  onWarning,
  onTimeout,
  onCountdown
}: {
  onWarning: () => void;
  onTimeout: () => void;
  onCountdown: (seconds: number) => void;
}) {
  const [status, setStatus] = useState<'idle' | 'warning' | 'timedOut'>('idle');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    [silenceTimerRef, warningTimerRef, countdownIntervalRef].forEach(ref => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }, []);

  const startWarningPhase = useCallback(() => {
    setStatus('warning');
    onWarning();

    let remainingSeconds = 10;
    onCountdown(remainingSeconds);

    countdownIntervalRef.current = setInterval(() => {
      remainingSeconds--;
      onCountdown(remainingSeconds);

      if (remainingSeconds <= 0 && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setStatus('timedOut');
        onTimeout();
      }
    }, 1000);

    warningTimerRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setStatus('timedOut');
      onTimeout();
    }, 10000);
  }, [onCountdown, onTimeout, onWarning]);

  const recordActivity = useCallback(() => {
    clearTimers();
    setStatus('idle');
    silenceTimerRef.current = setTimeout(startWarningPhase, 15000);
  }, [clearTimers, startWarningPhase]);

  const stopMonitoring = useCallback(() => {
    clearTimers();
    setStatus('idle');
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    status,
    startMonitoring: recordActivity, // first call arms the silence timer
    recordActivity,
    stopMonitoring
  };
}
```

### Integration with `useRealtimeVoice`

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

export function useCoquiSession(activityId: string) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(10);
  const inactivity = useCoquiInactivity({
    onWarning: () => sendEmpathyCheck(),
    onTimeout: () => handleTimeout(),
    onCountdown: setCountdown
  });

  const {
    connect,
    disconnect,
    isConnected,
    isAIPlaying,
    sendText
  } = useRealtimeVoice({
    studentId: user?.id ?? 'demo-student',
    language: language === 'es' ? 'es-PR' : 'en-US',
    onTranscription: (_text, isUser) => {
      if (isUser) inactivity.recordActivity();
    },
    onAudioLevel: (dbLevel) => {
      if (dbLevel > -40) {
        inactivity.recordActivity();
      }
    }
  });

  const startSession = useCallback(async () => {
    await connect();
    inactivity.startMonitoring();
  }, [connect, inactivity]);

  const endSession = useCallback(() => {
    inactivity.stopMonitoring();
    disconnect();
  }, [disconnect, inactivity]);

  const sendEmpathyCheck = () => {
    const prompt = language === 'es'
      ? "¿Está todo bien? ¿Necesitas más tiempo para pensar?"
      : "Is everything okay? Do you need more time?";
    sendText(prompt);
  };

  const handleTimeout = () => {
    const goodbye = language === 'es'
      ? "No hay problema. Haz clic en mí cuando quieras continuar."
      : "No problem! Click me when you're ready to continue.";
    sendText(goodbye);
    setTimeout(endSession, 3000);
  };

  return {
    countdown,
    isConnected,
    isAIPlaying,
    startSession,
    endSession,
    resetTimeout: inactivity.recordActivity
  };
}
```

---

## 🎨 Visual Timeout Component

### React Component Implementation

```typescript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MousePointer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CoquiTimeoutIndicatorProps {
  countdownSeconds: number;
  isVisible: boolean;
  position?: 'above' | 'below' | 'beside';
  onReactivate?: () => void;
}

export const CoquiTimeoutIndicator: React.FC<CoquiTimeoutIndicatorProps> = ({
  countdownSeconds,
  isVisible,
  position = 'above',
  onReactivate
}) => {
  const { language } = useLanguage();
  const [animatedCount, setAnimatedCount] = useState(countdownSeconds);

  useEffect(() => {
    setAnimatedCount(countdownSeconds);
  }, [countdownSeconds]);

  const messages = {
    es: {
      waiting: "Esperando tu respuesta...",
      ending: "La sesión terminará en",
      click: "Haz clic para continuar hablando",
      seconds: "segundos"
    },
    en: {
      waiting: "Waiting for your response...",
      ending: "Session will end in",
      click: "Click to keep talking",
      seconds: "seconds"
    }
  };

  const msg = messages[language === 'es' ? 'es' : 'en'];

  const positionClasses = {
    above: 'bottom-full mb-4',
    below: 'top-full mt-4',
    beside: 'left-full ml-4'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute z-50",
            positionClasses[position],
            "bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4",
            "border-2 border-orange-200",
            "min-w-[250px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {msg.waiting}
            </span>
          </div>

          {/* Countdown Display */}
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-orange-600">
              {animatedCount}
            </div>
            <div className="text-xs text-gray-500">
              {msg.seconds}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: 10,
                ease: 'linear'
              }}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={onReactivate}
            className="w-full bg-gradient-to-r from-primary to-primary-dark
                     text-white rounded-lg py-2 px-4
                     flex items-center justify-center gap-2
                     hover:shadow-lg transition-all duration-200
                     transform hover:scale-105"
          >
            <MousePointer className="w-4 h-4" />
            <span className="text-sm font-medium">
              {msg.click}
            </span>
          </button>

          {/* Friendly Character */}
          <div className="absolute -top-3 right-4">
            <div className="bg-white rounded-full p-1 shadow-md">
              <span className="text-2xl">🕐</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### Integration with Coqui Mascot

```typescript
export const CoquiWithTimeout: React.FC<{ activityId: string }> = ({ activityId }) => {
  const [mascotState, setMascotState] = useState<'waiting' | 'speaking' | 'thinking'>('waiting');
  const {
    countdown,
    isConnected,
    isAIPlaying,
    startSession,
    endSession,
    resetTimeout
  } = useCoquiSession(activityId);

  useEffect(() => {
    if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected) {
      setMascotState('thinking');
    } else {
      setMascotState('waiting');
    }
  }, [isAIPlaying, isConnected]);

  return (
    <div className="relative inline-block">
      <CoquiMascot
        state={mascotState}
        onClick={!isConnected ? startSession : endSession}
        className={cn(
          "cursor-pointer transition-all",
          isConnected && "animate-pulse"
        )}
      />

      <CoquiTimeoutIndicator
        countdownSeconds={countdown}
        isVisible={countdown < 10 && countdown > 0}
        position="above"
        onReactivate={resetTimeout}
      />

      {isConnected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Activo
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 🔧 Session Management Configuration

### Demo Mode Configuration

```typescript
export const DEMO_SESSION_CONFIG = {
  // Session behavior
  allowNaturalConversations: true,
  interruptForCost: false,
  maxSessionDuration: null, // No hard limit

  // Inactivity management
  inactivityTimeout: {
    enabled: true,
    silenceThreshold: 15000, // 15 seconds
    warningDuration: 10000,  // 10 seconds to respond

    // Warning messages
    warningPrompts: {
      es: [
        "¿Está todo bien? ¿Necesitas más tiempo para pensar?",
        "¿Sigues ahí? ¿Necesitas ayuda?",
        "Tómate tu tiempo. ¿Todo está bien?"
      ],
      en: [
        "Is everything okay? Do you need more time to think?",
        "Are you still there? Do you need help?",
        "Take your time. Is everything alright?"
      ]
    },

    // Goodbye messages
    goodbyeMessages: {
      es: [
        "No hay problema. Estaré aquí cuando me necesites. ¡Haz clic cuando quieras!",
        "¡Nos vemos pronto! Haz clic en mí cuando quieras continuar.",
        "Descansa un poco. Aquí estaré cuando regreses."
      ],
      en: [
        "No problem! I'll be here when you need me. Just click when you're ready!",
        "See you soon! Click on me whenever you want to continue.",
        "Take a break. I'll be here when you come back."
      ]
    }
  },

  // Cost tracking (for analysis only)
  costTracking: {
    enabled: true,
    enforceLimit: false, // Don't enforce during demo
    trackMetrics: true,
    reportingInterval: 'daily'
  },

  // Visual indicators
  visualFeedback: {
    showSessionStatus: true,
    showTimeoutWarning: true,
    countdownStyle: 'friendly', // vs 'urgent'
    animations: true
  }
};
```

### Production Mode Configuration (Future)

```typescript
export const PRODUCTION_SESSION_CONFIG = {
  // Session behavior
  allowNaturalConversations: true,
  interruptForCost: false, // Still no abrupt cuts
  maxSessionDuration: 300000, // 5 minute safety max

  // Inactivity management
  inactivityTimeout: {
    ...DEMO_SESSION_CONFIG.inactivityTimeout,
    silenceThreshold: 10000, // Shorter in production
  },

  // Cost management
  costTracking: {
    enabled: true,
    enforceLimit: true,
    dailyLimit: 0.02,  // $0.02/day
    monthlyLimit: 0.50, // $0.50/month

    // Graceful degradation
    limitApproachBehavior: {
      80: 'warning',     // Warn at 80%
      90: 'shorten',     // Shorter sessions at 90%
      95: 'essential',   // Essential only at 95%
      100: 'text_only'   // Fallback to text at 100%
    }
  }
};
```

---

## 🎮 Demo vs Production Modes

### Mode Selection

```typescript
export class CoquiModeSelector {
  private mode: 'demo' | 'production';

  constructor() {
    // Environment-based selection
    this.mode = process.env.VITE_COQUI_MODE === 'production'
      ? 'production'
      : 'demo';
  }

  getConfig(): SessionConfig {
    return this.mode === 'demo'
      ? DEMO_SESSION_CONFIG
      : PRODUCTION_SESSION_CONFIG;
  }

  shouldEnforceCostLimits(): boolean {
    return this.mode === 'production';
  }

  getInactivityTimeout(): number {
    const config = this.getConfig();
    return config.inactivityTimeout.silenceThreshold;
  }

  shouldShowCostWarnings(): boolean {
    return this.mode === 'production';
  }
}
```

### Feature Flags

```typescript
export const COQUI_FEATURES = {
  // Demo features
  NATURAL_CONVERSATIONS: true,
  INACTIVITY_DETECTION: true,
  VISUAL_TIMEOUT: true,
  COST_TRACKING: true,

  // Production features (disabled in demo)
  COST_ENFORCEMENT: false,
  SESSION_LIMITS: false,
  BUDGET_WARNINGS: false,
  FALLBACK_MODE: false,

  // UI features
  SHOW_SESSION_BADGE: true,
  SHOW_COUNTDOWN: true,
  ANIMATED_MASCOT: true,
  FRIENDLY_MESSAGES: true
};
```

---

## 📊 Metrics Collection for Future Optimization

### Demo Phase Metrics

```typescript
interface DemoMetrics {
  // Session patterns
  averageSessionDuration: number;
  medianSessionDuration: number;
  sessionDurationByType: {
    lesson: number;
    exercise: number;
    assessment: number;
  };

  // Inactivity patterns
  inactivityTriggers: number;
  averageResponseTime: number;
  abandonedSessions: number;
  reactivatedSessions: number;

  // Conversation quality
  averageTurnsPerSession: number;
  studentSpeakingTime: number;
  aiSpeakingTime: number;
  silenceTime: number;

  // Educational impact
  hintsProvided: number;
  correctAnswersAfterHint: number;
  strugglesDetected: number;
  improvementRate: number;

  // Cost analysis
  totalCostIncurred: number;
  costPerOutcome: number;
  costPerMinute: number;
  projectedAnnualCost: number;
}
```

### Data Collection Service

```typescript
export class CoquiMetricsCollector {
  async collectSessionMetrics(sessionId: string): Promise<void> {
    const session = await this.getSessionData(sessionId);

    // Store for analysis
    await supabase
      .from('demo_metrics')
      .insert({
        session_id: sessionId,
        duration_ms: session.duration,
        turns_count: session.interactions.length,
        inactivity_triggered: session.hadInactivity,
        cost_dollars: session.estimatedCost,
        educational_value: this.calculateValue(session),
        timestamp: new Date()
      });
  }

  private calculateValue(session: any): number {
    // Algorithm to determine educational value
    const factors = {
      completedActivity: 1.0,
      neededHints: -0.2,
      timeOnTask: 0.1,
      correctAnswer: 1.5,
      engagement: 0.3
    };

    return Object.entries(factors)
      .reduce((score, [key, weight]) => {
        return score + (session[key] * weight);
      }, 0);
  }
}
```

---

## 🚀 Implementation Timeline

### Week 1-2: Core Infrastructure
- [x] Natural conversation flow (no interruptions)
- [x] Inactivity detection system (15-second rule)
- [x] Visual timeout component
- [x] Session restart capability

### Week 3-4: Intelligence Layer
- [ ] Context-aware responses
- [ ] Progressive hint system
- [ ] WCPM assessment integration
- [ ] Difficulty adaptation

### Week 5-6: Demo Preparation
- [ ] UI/UX polish
- [ ] Metrics dashboard
- [ ] Teacher documentation
- [ ] Demo scenarios

---

## 🎯 Key Implementation Files

```
src/
├── components/
│   ├── StudentDashboard/
│   │   └── CoquiVoiceChat.tsx          # Entry point for student experience
│   └── coqui/
│       ├── CoquiTimeoutIndicator.tsx   # Visual countdown (new)
│       ├── CoquiSessionBadge.tsx       # Status indicator (new)
│       └── CoquiMascot.jsx             # Existing mascot component
├── hooks/
│   ├── useRealtimeVoice.ts             # Existing voice connection hook
│   ├── useCoquiInactivity.ts           # New inactivity manager hook
│   └── useCoquiSession.ts              # Wrapper that coordinates voice + inactivity
└── utils/
    └── realtime/
        └── RealtimeVoiceClientEnhanced.ts  # Low-level audio/WebSocket plumbing
```

---

## 🧭 Alignment Tasks for Current Hook-Based Architecture

To keep Phase 1 deliverables attainable without a ground-up refactor, implement the smart-timeout experience on top of the existing `CoquiVoiceChat` + `useRealtimeVoice` stack:

- **Voice Hook Enhancements**  
  - Extend `useRealtimeVoice` / `RealtimeVoiceClientEnhanced` to emit `onUserActivity` / `onSilenceStart` callbacks so the inactivity manager can subscribe without a new session class.
  - Provide a typed event bridge (e.g., `useRealtimeVoiceActivity`) that exposes student/AI speaking state and resets timers when `input_audio_buffer.speech_started` comes from the relay.

- **Inactivity Logic Layer**  
  - Create `useCoquiInactivity` that wraps the new callbacks, enforces the 15 s + 10 s countdown logic, and surfaces `state`, `countdown`, and `onReactivate` handlers back to `CoquiVoiceChat`.
  - Ensure the hook pauses timers when the AI is speaking to avoid premature warnings.

- **UI Components**  
  - Build `components/coqui/CoquiTimeoutIndicator.tsx` and wire it into the student dashboard card, matching the visual spec in this plan.
  - Add a lightweight `CoquiSessionBadge` that reflects “Activo / Pausado / Finalizado” so students see status changes triggered by the inactivity hook.

- **Data & Migrations**  
  - Introduce Supabase migrations for any new tables referenced here (`demo_metrics`, `coqui_interactions`, timeout audit logs) before the frontend ships, so telemetry writers don’t fail at runtime.
  - Update the realtime relay (and future metrics collector) to record timeout warnings vs. final session closures, enabling the KPIs listed in the Executive Summary.

Document these tasks in the demo backlog and keep the scope tied to the hook-based implementation so milestones remain achievable without blocking on a large-scale refactor.

---

## ✅ Summary

This updated implementation provides:

1. **Natural Conversations**: No cost-based interruptions
2. **Smart Timeout**: 15-second inactivity detection
3. **Friendly UX**: Visual countdown and easy restart
4. **Demo Focus**: Collect data without restrictions
5. **Future Ready**: Production mode configuration prepared

The system balances optimal user experience with resource management, ensuring sessions don't run indefinitely when students leave, while never interrupting active learning conversations.

---

*Last Updated: October 25, 2025*
