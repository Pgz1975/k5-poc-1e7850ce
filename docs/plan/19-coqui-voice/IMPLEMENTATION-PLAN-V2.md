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

### Core Logic Flow

```typescript
export class CoquiInactivityManager {
  private silenceTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();
  private hasWarnedUser: boolean = false;

  // Configuration
  private readonly SILENCE_THRESHOLD = 15000; // 15 seconds
  private readonly WARNING_DURATION = 10000;  // 10 seconds to respond

  constructor(
    private onInactivityWarning: () => void,
    private onSessionTimeout: () => void,
    private onCountdownUpdate: (seconds: number) => void
  ) {}

  // Called on any user activity (voice or interaction)
  public recordActivity(): void {
    this.lastActivityTime = Date.now();
    this.resetTimers();
    this.hasWarnedUser = false;
  }

  // Start monitoring for inactivity
  public startMonitoring(): void {
    this.resetTimers();

    this.silenceTimer = setTimeout(() => {
      this.triggerInactivityWarning();
    }, this.SILENCE_THRESHOLD);
  }

  private triggerInactivityWarning(): void {
    if (this.hasWarnedUser) return;

    this.hasWarnedUser = true;
    this.onInactivityWarning(); // Trigger Coqui to ask "¿Está todo bien?"

    // Start countdown timer
    let remainingSeconds = 10;
    this.onCountdownUpdate(remainingSeconds);

    const countdownInterval = setInterval(() => {
      remainingSeconds--;
      this.onCountdownUpdate(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        this.onSessionTimeout();
      }
    }, 1000);

    // Store interval for cleanup
    this.warningTimer = setTimeout(() => {
      clearInterval(countdownInterval);
      this.onSessionTimeout();
    }, this.WARNING_DURATION);
  }

  private resetTimers(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  public cleanup(): void {
    this.resetTimers();
  }
}
```

### Integration with Voice Session

```typescript
export class CoquiSessionManager {
  private client: EnhancedRealtimeClient | null = null;
  private inactivityManager: CoquiInactivityManager | null = null;
  private isWarningActive: boolean = false;

  async startSession(options: {
    studentId: string;
    activityId: string;
    context: any;
    onTimeout: () => void;
    onCountdownUpdate: (seconds: number) => void;
  }): Promise<void> {
    const { studentId, activityId, context, onTimeout, onCountdownUpdate } = options;

    // Initialize inactivity manager
    this.inactivityManager = new CoquiInactivityManager(
      // On warning callback
      () => this.sendInactivityCheck(),
      // On timeout callback
      () => this.handleSessionTimeout(onTimeout),
      // On countdown update
      onCountdownUpdate
    );

    // Initialize realtime client
    this.client = new EnhancedRealtimeClient({
      studentId,
      language: context.activity.language,
      gradeLevel: context.activity.gradeLevel,
      assessmentId: activityId,

      onTranscription: (text, isUser) => {
        console.log(`[Coqui] ${isUser ? 'Student' : 'AI'}: ${text}`);

        // Record activity on any transcription
        if (isUser) {
          this.inactivityManager?.recordActivity();
          this.isWarningActive = false;
        }
      },

      onEvent: (event) => {
        // Record activity on user audio
        if (event.type === 'input_audio_buffer.speech_started') {
          this.inactivityManager?.recordActivity();
        }
      }
    });

    await this.client.connect();
    this.inactivityManager.startMonitoring();
  }

  private async sendInactivityCheck(): Promise<void> {
    if (!this.client || this.isWarningActive) return;

    this.isWarningActive = true;

    const language = this.client.config.language;
    const message = language === 'es-PR'
      ? "¿Está todo bien? ¿Necesitas más tiempo para pensar?"
      : "Is everything okay? Do you need more time to think?";

    this.client.sendText(message);
  }

  private async handleSessionTimeout(onTimeout: () => void): Promise<void> {
    if (!this.client) return;

    const language = this.client.config.language;
    const goodbyeMessage = language === 'es-PR'
      ? "No hay problema. Estaré aquí cuando me necesites. ¡Haz clic en mí cuando quieras continuar!"
      : "No problem! I'll be here when you need me. Just click on me when you want to continue!";

    // Send goodbye message
    this.client.sendText(goodbyeMessage);

    // Wait for message to complete
    setTimeout(() => {
      this.disconnect();
      onTimeout();
    }, 3000);
  }

  public disconnect(): void {
    this.inactivityManager?.cleanup();
    this.client?.disconnect();
    this.client = null;
    this.inactivityManager = null;
  }
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
export const CoquiWithTimeout: React.FC<{
  activityId: string;
  activityType: string;
  activityContent: any;
}> = ({ activityId, activityType, activityContent }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [mascotState, setMascotState] = useState<'waiting' | 'speaking' | 'thinking'>('waiting');

  const sessionManager = useRef<CoquiSessionManager | null>(null);

  const startSession = async () => {
    setIsSessionActive(true);
    setMascotState('thinking');
    setShowTimeout(false);

    sessionManager.current = new CoquiSessionManager();

    await sessionManager.current.startSession({
      studentId: user?.id,
      activityId,
      context: await buildContext(activityId),

      onTimeout: () => {
        setIsSessionActive(false);
        setMascotState('waiting');
        setShowTimeout(false);
      },

      onCountdownUpdate: (seconds) => {
        if (seconds === 10) {
          setShowTimeout(true);
        }
        setCountdown(seconds);

        if (seconds === 0) {
          setShowTimeout(false);
        }
      }
    });

    setMascotState('waiting');
  };

  const handleReactivate = () => {
    // Cancel timeout and continue session
    sessionManager.current?.recordActivity();
    setShowTimeout(false);
  };

  return (
    <div className="relative inline-block">
      {/* Coqui Mascot */}
      <CoquiMascot
        state={mascotState}
        onClick={!isSessionActive ? startSession : undefined}
        className={cn(
          "cursor-pointer transition-all",
          isSessionActive && "animate-pulse"
        )}
      />

      {/* Timeout Indicator */}
      <CoquiTimeoutIndicator
        countdownSeconds={countdown}
        isVisible={showTimeout}
        position="above"
        onReactivate={handleReactivate}
      />

      {/* Status Badge */}
      {isSessionActive && (
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
├── services/
│   ├── coqui/
│   │   ├── CoquiSessionManager.ts      # Core session logic
│   │   ├── CoquiInactivityManager.ts   # Timeout handling
│   │   ├── CoquiContextService.ts      # Context building
│   │   ├── CoquiMetricsCollector.ts    # Demo metrics
│   │   └── CoquiModeSelector.ts        # Demo/Prod modes
├── components/
│   ├── coqui/
│   │   ├── CoquiWithTimeout.tsx        # Main component
│   │   ├── CoquiTimeoutIndicator.tsx   # Visual countdown
│   │   ├── CoquiSessionBadge.tsx       # Status indicator
│   │   └── CoquiMascot.tsx             # Mascot animation
├── hooks/
│   ├── useCoquiSession.ts              # Session hook
│   └── useCoquiMetrics.ts              # Metrics hook
```

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