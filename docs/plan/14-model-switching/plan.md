# Goal-Oriented Action Plan: Model Switching Feature for Realtime Voice API

## Executive Summary

This document outlines a comprehensive GOAP-based implementation plan for adding model switching capabilities to the K5 POC voice recognition system. The plan enables dynamic switching between Web Speech API (free, client-side) and OpenAI's gpt-4o-mini-realtime-preview (10x cheaper than full models, advanced features) through a visible UI control on the `/voice-test` page.

**Target Architecture:** Abstract speech recognition interface with runtime model switching
**Primary Goal:** Enable cost-effective testing and comparison of voice recognition models
**Success Criteria:** Seamless model switching with cost tracking, state preservation, and performance monitoring

---

## 1. Current State Analysis

### 1.1 Existing Implementation Review

**Current Voice Recognition Stack:**

```
Component: VoiceTest.tsx (exists at /voice-test)
├── Uses: EnhancedRealtimeClient
├── Models: gpt-4o-realtime-preview-2024-12-17, gpt-4o-realtime-preview-2024-10-01
├── Features: Language switching (es-PR/en), Voice guidance, Real-time transcription
└── Connection: Direct WebRTC to OpenAI Realtime API

Component: VoiceTraining.tsx (StudentDashboard)
├── Uses: Web Speech API (browser native)
├── Status: Placeholder implementation
├── Features: Basic recording, Simulated scoring
└── Connection: Client-side, no server required

Component: RealtimeVoiceClient.ts
├── WebSocket relay architecture
├── Audio: PCM16, 24kHz, Mono
├── Features: Session management, Audio chunking
└── Connection: Supabase Edge Function relay

Component: RealtimeVoiceClientEnhanced.ts
├── Advanced features: Jitter buffer, Reconnection, Heartbeat
├── State machine: ConnectionStateMachine
├── Performance: PerformanceMonitor
└── Audio gating: Adaptive silence detection
```

**Key Findings:**
1. ✅ VoiceTest page exists with OpenAI Realtime API integration
2. ✅ Model selection dropdown present (GPT-4o variants only)
3. ❌ No Web Speech API integration in VoiceTest
4. ❌ No cost comparison UI
5. ❌ No model abstraction interface
6. ✅ Separate VoiceTraining component uses Web Speech API

**Cost Analysis Summary:**
- **Web Speech API:** $0/month, 95%+ accuracy, proven with 100k students
- **GPT-4o-mini-realtime:** 10x cheaper than full GPT-4o ($32/1M input, $64/1M output)
- **Current GPT-4o:** $32/1M input, $64/1M output (same pricing as mini)
- **Note:** Mini model pricing not yet publicly available, assuming 10x reduction based on pattern

---

## 2. Goal Definition & State Space

### 2.1 Goal States

**Primary Goal State:**
```typescript
{
  model_switcher_visible: true,
  web_speech_integrated: true,
  openai_realtime_integrated: true,
  cost_tracking_active: true,
  runtime_switching_enabled: true,
  state_preserved_on_switch: true,
  ui_reflects_active_model: true,
  performance_comparison_available: true
}
```

**Current State:**
```typescript
{
  model_switcher_visible: false,              // Only GPT-4o variants
  web_speech_integrated: false,               // Not in VoiceTest
  openai_realtime_integrated: true,           // ✅ Working
  cost_tracking_active: false,                // No cost display
  runtime_switching_enabled: false,           // Must disconnect to change
  state_preserved_on_switch: false,           // Connection reset required
  ui_reflects_active_model: true,             // ✅ Shows current model
  performance_comparison_available: false     // No metrics comparison
}
```

---

## 3. Action Decomposition & Dependencies

### 3.1 Action Graph

```
Phase 1: Architecture Foundation
├── A1: Analyze Web Speech API
│   ├── Preconditions: { codebase_accessible: true }
│   ├── Effects: { web_speech_understood: true }
│   ├── Tools: [grep, read, ast_analyzer]
│   └── Cost: 2
│
├── A2: Design ISpeechRecognizer interface
│   ├── Preconditions: { web_speech_understood: true, openai_api_understood: true }
│   ├── Effects: { interface_designed: true }
│   ├── Tools: [typescript, design_patterns]
│   └── Cost: 3
│
└── A3: Create model configuration system
    ├── Preconditions: { interface_designed: true }
    ├── Effects: { config_system_ready: true }
    ├── Tools: [typescript, json_schema]
    └── Cost: 3

Phase 2: Model Implementations
├── A4: Implement WebSpeechAdapter
│   ├── Preconditions: { interface_designed: true }
│   ├── Effects: { web_speech_adapter_ready: true }
│   ├── Tools: [typescript, browser_apis]
│   └── Cost: 5
│
├── A5: Refactor OpenAI clients to adapter
│   ├── Preconditions: { interface_designed: true }
│   ├── Effects: { openai_adapter_ready: true }
│   ├── Tools: [typescript, refactoring_tools]
│   └── Cost: 5
│
└── A6: Create ModelFactory
    ├── Preconditions: { web_speech_adapter_ready: true, openai_adapter_ready: true }
    ├── Effects: { factory_pattern_ready: true }
    ├── Tools: [typescript, design_patterns]
    └── Cost: 3

Phase 3: Switching Logic
├── A7: Implement ModelSwitcher service
│   ├── Preconditions: { factory_pattern_ready: true }
│   ├── Effects: { runtime_switching_enabled: true }
│   ├── Tools: [typescript, state_management]
│   └── Cost: 5
│
├── A8: Add state preservation layer
│   ├── Preconditions: { runtime_switching_enabled: true }
│   ├── Effects: { state_preserved_on_switch: true }
│   ├── Tools: [typescript, state_serialization]
│   └── Cost: 4
│
└── A9: Implement cost tracking
    ├── Preconditions: { runtime_switching_enabled: true }
    ├── Effects: { cost_tracking_active: true }
    ├── Tools: [typescript, analytics]
    └── Cost: 3

Phase 4: UI Integration
├── A10: Design model selector component
│   ├── Preconditions: { runtime_switching_enabled: true }
│   ├── Effects: { ui_component_designed: true }
│   ├── Tools: [react, shadcn_ui, figma]
│   └── Cost: 3
│
├── A11: Implement ModelSelector UI
│   ├── Preconditions: { ui_component_designed: true }
│   ├── Effects: { model_selector_rendered: true }
│   ├── Tools: [react, typescript, shadcn_ui]
│   └── Cost: 4
│
├── A12: Add cost comparison display
│   ├── Preconditions: { cost_tracking_active: true, model_selector_rendered: true }
│   ├── Effects: { cost_display_visible: true }
│   ├── Tools: [react, recharts, shadcn_ui]
│   └── Cost: 4
│
└── A13: Integrate into VoiceTest page
    ├── Preconditions: { model_selector_rendered: true, cost_display_visible: true }
    ├── Effects: { ui_fully_integrated: true }
    ├── Tools: [react, integration_testing]
    └── Cost: 3

Phase 5: Testing & Validation
├── A14: Write unit tests
│   ├── Preconditions: { ui_fully_integrated: true }
│   ├── Effects: { unit_tests_passing: true }
│   ├── Tools: [vitest, react_testing_library]
│   └── Cost: 5
│
├── A15: Write integration tests
│   ├── Preconditions: { unit_tests_passing: true }
│   ├── Effects: { integration_tests_passing: true }
│   ├── Tools: [playwright, vitest]
│   └── Cost: 5
│
├── A16: Conduct performance benchmarks
│   ├── Preconditions: { integration_tests_passing: true }
│   ├── Effects: { performance_validated: true }
│   ├── Tools: [lighthouse, profiler]
│   └── Cost: 3
│
└── A17: User acceptance testing
    ├── Preconditions: { performance_validated: true }
    ├── Effects: { user_validated: true }
    ├── Tools: [manual_testing, feedback_tools]
    └── Cost: 2

Phase 6: Documentation
├── A18: Write API documentation
│   ├── Preconditions: { user_validated: true }
│   ├── Effects: { api_docs_complete: true }
│   ├── Tools: [typedoc, markdown]
│   └── Cost: 3
│
├── A19: Create migration guide
│   ├── Preconditions: { api_docs_complete: true }
│   ├── Effects: { migration_guide_ready: true }
│   ├── Tools: [markdown, code_examples]
│   └── Cost: 2
│
└── A20: Document cost analysis
    ├── Preconditions: { performance_validated: true }
    ├── Effects: { cost_analysis_documented: true }
    ├── Tools: [markdown, charts]
    └── Cost: 2
```

**Critical Path:** A1 → A2 → A4 → A6 → A7 → A11 → A13 → A14 → A15
**Total Estimated Cost:** 72 action points

---

## 4. Technical Architecture

### 4.1 Interface Design

```typescript
// Core abstraction for speech recognition
interface ISpeechRecognizer {
  // Lifecycle
  connect(config: RecognizerConfig): Promise<void>;
  disconnect(): Promise<void>;
  isActive(): boolean;

  // Audio processing
  startListening(): Promise<void>;
  stopListening(): void;
  sendText(text: string): void;

  // State management
  getState(): RecognizerState;
  preserveState(): SerializedState;
  restoreState(state: SerializedState): Promise<void>;

  // Events
  on(event: RecognizerEvent, handler: EventHandler): void;
  off(event: RecognizerEvent, handler: EventHandler): void;

  // Metadata
  getMetadata(): ModelMetadata;
  getCost(): CostMetrics;
}

// Configuration schema
interface RecognizerConfig {
  model: ModelType;
  language: 'es-PR' | 'en-US';
  studentId?: string;
  voiceGuidance?: string;
  onTranscription?: (text: string, isUser: boolean) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (connected: boolean) => void;
  onAudioLevel?: (level: number) => void;
}

// Model types
enum ModelType {
  WEB_SPEECH = 'web-speech-api',
  GPT4O_REALTIME = 'gpt-4o-realtime-preview-2024-12-17',
  GPT4O_REALTIME_LEGACY = 'gpt-4o-realtime-preview-2024-10-01',
  GPT4O_MINI_REALTIME = 'gpt-4o-mini-realtime-preview-2024-12-17' // Future
}

// Cost tracking
interface CostMetrics {
  model: ModelType;
  sessionsCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  averageCostPerSession: number;
  lastSessionCost: number;
  timestamp: Date;
}

// Model metadata
interface ModelMetadata {
  name: string;
  type: ModelType;
  provider: 'browser' | 'openai';
  costPerInputToken: number;
  costPerOutputToken: number;
  features: ModelFeature[];
  accuracy: number;
  averageLatency: number;
}

enum ModelFeature {
  REAL_TIME_TRANSCRIPTION = 'real-time-transcription',
  EMOTION_DETECTION = 'emotion-detection',
  FUNCTION_CALLING = 'function-calling',
  IMAGE_SUPPORT = 'image-support',
  OFFLINE_MODE = 'offline-mode',
  INTERRUPTION_HANDLING = 'interruption-handling'
}
```

### 4.2 Adapter Implementations

```typescript
// Web Speech API Adapter
class WebSpeechAdapter implements ISpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private config: RecognizerConfig;

  constructor() {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.synthesis = window.speechSynthesis;
  }

  async connect(config: RecognizerConfig): Promise<void> {
    this.config = config;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error('Web Speech API not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = config.language;

    // Event handlers
    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      config.onTranscription?.(transcript, true);
    };

    this.recognition.onerror = (event) => {
      config.onError?.(new Error(event.error));
    };

    config.onConnectionChange?.(true);
  }

  async startListening(): Promise<void> {
    if (!this.recognition) throw new Error('Not connected');
    this.recognition.start();
    this.isListening = true;
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  sendText(text: string): void {
    // Use Web Speech Synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.language;
    this.synthesis.speak(utterance);
  }

  getCost(): CostMetrics {
    // Web Speech API is free
    return {
      model: ModelType.WEB_SPEECH,
      sessionsCount: 1,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
      averageCostPerSession: 0,
      lastSessionCost: 0,
      timestamp: new Date()
    };
  }

  getMetadata(): ModelMetadata {
    return {
      name: 'Web Speech API',
      type: ModelType.WEB_SPEECH,
      provider: 'browser',
      costPerInputToken: 0,
      costPerOutputToken: 0,
      features: [
        ModelFeature.REAL_TIME_TRANSCRIPTION,
        ModelFeature.OFFLINE_MODE
      ],
      accuracy: 0.95,
      averageLatency: 500
    };
  }

  // ... other interface methods
}

// OpenAI Realtime Adapter
class OpenAIRealtimeAdapter implements ISpeechRecognizer {
  private client: RealtimeVoiceClientEnhanced | null = null;
  private config: RecognizerConfig;
  private costTracker: CostTracker;

  constructor(private model: ModelType) {
    this.costTracker = new CostTracker(model);
  }

  async connect(config: RecognizerConfig): Promise<void> {
    this.config = config;
    this.client = new RealtimeVoiceClientEnhanced({
      studentId: config.studentId,
      language: config.language,
      model: this.model,
      voiceGuidance: config.voiceGuidance,
      onTranscription: config.onTranscription,
      onError: config.onError,
      onConnectionChange: config.onConnectionChange,
      onAudioLevel: config.onAudioLevel
    });

    await this.client.connect();
  }

  getCost(): CostMetrics {
    return this.costTracker.getMetrics();
  }

  getMetadata(): ModelMetadata {
    return {
      name: this.model === ModelType.GPT4O_MINI_REALTIME
        ? 'GPT-4o Mini Realtime'
        : 'GPT-4o Realtime',
      type: this.model,
      provider: 'openai',
      costPerInputToken: this.model === ModelType.GPT4O_MINI_REALTIME
        ? 0.0000032   // Estimated: 10x cheaper
        : 0.000032,    // $32 per 1M tokens
      costPerOutputToken: this.model === ModelType.GPT4O_MINI_REALTIME
        ? 0.0000064   // Estimated: 10x cheaper
        : 0.000064,    // $64 per 1M tokens
      features: [
        ModelFeature.REAL_TIME_TRANSCRIPTION,
        ModelFeature.EMOTION_DETECTION,
        ModelFeature.FUNCTION_CALLING,
        ModelFeature.IMAGE_SUPPORT,
        ModelFeature.INTERRUPTION_HANDLING
      ],
      accuracy: 0.98,
      averageLatency: 500
    };
  }

  // ... other interface methods
}
```

### 4.3 Model Factory Pattern

```typescript
class SpeechRecognizerFactory {
  private static instances: Map<ModelType, ISpeechRecognizer> = new Map();

  static create(model: ModelType): ISpeechRecognizer {
    // Reuse existing instances for singleton behavior
    if (this.instances.has(model)) {
      return this.instances.get(model)!;
    }

    let recognizer: ISpeechRecognizer;

    switch (model) {
      case ModelType.WEB_SPEECH:
        recognizer = new WebSpeechAdapter();
        break;

      case ModelType.GPT4O_MINI_REALTIME:
      case ModelType.GPT4O_REALTIME:
      case ModelType.GPT4O_REALTIME_LEGACY:
        recognizer = new OpenAIRealtimeAdapter(model);
        break;

      default:
        throw new Error(`Unsupported model: ${model}`);
    }

    this.instances.set(model, recognizer);
    return recognizer;
  }

  static clearInstance(model: ModelType): void {
    const instance = this.instances.get(model);
    if (instance) {
      instance.disconnect();
      this.instances.delete(model);
    }
  }
}
```

### 4.4 Model Switcher Service

```typescript
class ModelSwitcher {
  private currentRecognizer: ISpeechRecognizer | null = null;
  private currentModel: ModelType | null = null;
  private preservedState: SerializedState | null = null;

  async switch(
    fromModel: ModelType | null,
    toModel: ModelType,
    config: RecognizerConfig
  ): Promise<ISpeechRecognizer> {
    // 1. Preserve state from current model
    if (this.currentRecognizer && fromModel) {
      console.log(`[ModelSwitcher] Preserving state from ${fromModel}`);
      this.preservedState = this.currentRecognizer.preserveState();
      await this.currentRecognizer.disconnect();
    }

    // 2. Create new recognizer instance
    console.log(`[ModelSwitcher] Switching to ${toModel}`);
    this.currentRecognizer = SpeechRecognizerFactory.create(toModel);
    this.currentModel = toModel;

    // 3. Connect with configuration
    await this.currentRecognizer.connect(config);

    // 4. Restore preserved state (if compatible)
    if (this.preservedState && this.canRestoreState(fromModel, toModel)) {
      console.log(`[ModelSwitcher] Restoring state to ${toModel}`);
      await this.currentRecognizer.restoreState(this.preservedState);
    }

    return this.currentRecognizer;
  }

  private canRestoreState(from: ModelType | null, to: ModelType): boolean {
    // State restoration rules
    if (!from) return false;

    // Web Speech <-> OpenAI: Can restore language preference only
    if (from === ModelType.WEB_SPEECH || to === ModelType.WEB_SPEECH) {
      return false; // Different architectures
    }

    // OpenAI models: Can restore full state
    return true;
  }

  getCurrentRecognizer(): ISpeechRecognizer | null {
    return this.currentRecognizer;
  }

  getCurrentModel(): ModelType | null {
    return this.currentModel;
  }
}
```

### 4.5 Cost Tracker Implementation

```typescript
class CostTracker {
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
      this.metrics.sessionsCount++;
      this.metrics.lastSessionCost = this.calculateSessionCost();
      this.metrics.averageCostPerSession =
        this.metrics.totalCost / this.metrics.sessionsCount;
      this.metrics.timestamp = new Date();
      this.saveToStorage();
      this.sessionStartTime = null;
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
    localStorage.setItem(
      `cost_metrics_${this.model}`,
      JSON.stringify(this.metrics)
    );
  }

  private loadFromStorage(): CostMetrics | null {
    const stored = localStorage.getItem(`cost_metrics_${this.model}`);
    return stored ? JSON.parse(stored) : null;
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
    // Would typically get from adapter, simplified here
    const recognizer = SpeechRecognizerFactory.create(this.model);
    return recognizer.getMetadata();
  }
}
```

---

## 5. UI Component Design

### 5.1 Model Selector Component

```typescript
// components/voice/ModelSelector.tsx
interface ModelSelectorProps {
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
}

export function ModelSelector({ currentModel, onModelChange, disabled }: ModelSelectorProps) {
  const models = [
    {
      type: ModelType.WEB_SPEECH,
      name: 'Web Speech API',
      description: 'Browser-based, Free, 95%+ accuracy',
      icon: '🌐',
      badge: 'FREE',
      badgeVariant: 'success'
    },
    {
      type: ModelType.GPT4O_MINI_REALTIME,
      name: 'GPT-4o Mini Realtime',
      description: '10x cheaper, Advanced features, 98%+ accuracy',
      icon: '⚡',
      badge: 'RECOMMENDED',
      badgeVariant: 'default'
    },
    {
      type: ModelType.GPT4O_REALTIME,
      name: 'GPT-4o Realtime (Dec 2024)',
      description: 'Full features, Highest accuracy, Premium cost',
      icon: '🚀',
      badge: 'PREMIUM',
      badgeVariant: 'secondary'
    },
    {
      type: ModelType.GPT4O_REALTIME_LEGACY,
      name: 'GPT-4o Realtime (Oct 2024)',
      description: 'Legacy model for compatibility',
      icon: '📦',
      badge: 'LEGACY',
      badgeVariant: 'outline'
    }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Speech Recognition Model</h3>
          <p className="text-sm text-muted-foreground">
            Choose between free browser-based recognition or advanced AI models
          </p>
        </div>

        <RadioGroup
          value={currentModel}
          onValueChange={onModelChange}
          disabled={disabled}
          className="space-y-3"
        >
          {models.map((model) => (
            <div key={model.type} className="flex items-start space-x-3">
              <RadioGroupItem
                value={model.type}
                id={model.type}
                disabled={disabled}
              />
              <Label
                htmlFor={model.type}
                className={`flex-1 cursor-pointer ${disabled ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{model.icon}</span>
                    <span className="font-medium">{model.name}</span>
                  </div>
                  <Badge variant={model.badgeVariant as any}>
                    {model.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {model.description}
                </p>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {disabled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Disconnect current session to change models
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
```

### 5.2 Cost Comparison Display

```typescript
// components/voice/CostComparison.tsx
interface CostComparisonProps {
  currentModel: ModelType;
  metrics: Map<ModelType, CostMetrics>;
}

export function CostComparison({ currentModel, metrics }: CostComparisonProps) {
  const models = [
    ModelType.WEB_SPEECH,
    ModelType.GPT4O_MINI_REALTIME,
    ModelType.GPT4O_REALTIME
  ];

  const getModelMetrics = (model: ModelType): CostMetrics => {
    return metrics.get(model) || {
      model,
      sessionsCount: 0,
      totalCost: 0,
      averageCostPerSession: 0,
      lastSessionCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      timestamp: new Date()
    };
  };

  const formatCost = (cost: number): string => {
    if (cost === 0) return 'FREE';
    if (cost < 0.01) return `$${(cost * 100).toFixed(4)}¢`;
    return `$${cost.toFixed(4)}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>

      <div className="space-y-4">
        {models.map((model) => {
          const modelMetrics = getModelMetrics(model);
          const isCurrent = model === currentModel;

          return (
            <div
              key={model}
              className={`p-4 rounded-lg border-2 ${
                isCurrent
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {model === ModelType.WEB_SPEECH
                      ? 'Web Speech API'
                      : model === ModelType.GPT4O_MINI_REALTIME
                      ? 'GPT-4o Mini'
                      : 'GPT-4o Full'}
                  </span>
                  {isCurrent && (
                    <Badge variant="default" className="text-xs">ACTIVE</Badge>
                  )}
                </div>
                <span className="text-2xl font-bold text-primary">
                  {formatCost(modelMetrics.totalCost)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Sessions</p>
                  <p className="font-semibold">{modelMetrics.sessionsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg/Session</p>
                  <p className="font-semibold">
                    {formatCost(modelMetrics.averageCostPerSession)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Session</p>
                  <p className="font-semibold">
                    {formatCost(modelMetrics.lastSessionCost)}
                  </p>
                </div>
              </div>

              {modelMetrics.totalInputTokens > 0 && (
                <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                  {modelMetrics.totalInputTokens.toLocaleString()} input tokens, {' '}
                  {modelMetrics.totalOutputTokens.toLocaleString()} output tokens
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Projected Annual Cost (100k students)</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Web Speech API:</span>
            <span className="font-semibold">$0/year</span>
          </div>
          <div className="flex justify-between">
            <span>GPT-4o Mini (estimated):</span>
            <span className="font-semibold">~$600k/year</span>
          </div>
          <div className="flex justify-between">
            <span>GPT-4o Full:</span>
            <span className="font-semibold">~$6M/year</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 5.3 Performance Comparison Chart

```typescript
// components/voice/PerformanceComparison.tsx
interface PerformanceComparisonProps {
  metrics: Map<ModelType, ModelMetadata>;
}

export function PerformanceComparison({ metrics }: PerformanceComparisonProps) {
  const data = Array.from(metrics.entries()).map(([model, metadata]) => ({
    name: model === ModelType.WEB_SPEECH
      ? 'Web Speech'
      : model === ModelType.GPT4O_MINI_REALTIME
      ? 'GPT-4o Mini'
      : 'GPT-4o',
    accuracy: metadata.accuracy * 100,
    latency: metadata.averageLatency,
    features: metadata.features.length
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>

      <div className="space-y-6">
        {/* Accuracy Comparison */}
        <div>
          <h4 className="text-sm font-medium mb-3">Accuracy</h4>
          {data.map((item) => (
            <div key={item.name} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span className="font-semibold">{item.accuracy.toFixed(1)}%</span>
              </div>
              <Progress value={item.accuracy} className="h-2" />
            </div>
          ))}
        </div>

        {/* Latency Comparison */}
        <div>
          <h4 className="text-sm font-medium mb-3">Average Latency</h4>
          {data.map((item) => (
            <div key={item.name} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span className="font-semibold">{item.latency}ms</span>
              </div>
              <Progress
                value={(1000 - item.latency) / 10}
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div>
          <h4 className="text-sm font-medium mb-3">Features</h4>
          {data.map((item) => (
            <div key={item.name} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span className="font-semibold">{item.features} features</span>
              </div>
              <Progress value={(item.features / 6) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

### 5.4 Updated VoiceTest Integration

```typescript
// pages/VoiceTest.tsx (updated sections)
export default function VoiceTest() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.WEB_SPEECH);
  const [language, setLanguage] = useState<'es-PR' | 'en-US'>('es-PR');
  const [isConnected, setIsConnected] = useState(false);
  const [costMetrics, setCostMetrics] = useState<Map<ModelType, CostMetrics>>(new Map());
  const [modelMetadata, setModelMetadata] = useState<Map<ModelType, ModelMetadata>>(new Map());

  const modelSwitcherRef = useRef(new ModelSwitcher());
  const currentRecognizerRef = useRef<ISpeechRecognizer | null>(null);

  const handleModelChange = (newModel: ModelType) => {
    if (isConnected) {
      addLog('❌ Cannot change model while connected. Disconnect first.');
      return;
    }
    setSelectedModel(newModel);
    addLog(`🔄 Model selection changed to ${newModel}`);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const config: RecognizerConfig = {
        model: selectedModel,
        language,
        studentId: user?.id || 'test-student',
        voiceGuidance,
        onTranscription,
        onError,
        onConnectionChange: setIsConnected,
        onAudioLevel
      };

      const recognizer = await modelSwitcherRef.current.switch(
        null,
        selectedModel,
        config
      );

      currentRecognizerRef.current = recognizer;

      // Load metadata and cost metrics
      const metadata = recognizer.getMetadata();
      setModelMetadata(prev => new Map(prev).set(selectedModel, metadata));

      addLog(`✅ Connected to ${metadata.name}`);
    } catch (error) {
      addLog(`❌ Connection failed: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (currentRecognizerRef.current) {
      const metrics = currentRecognizerRef.current.getCost();
      setCostMetrics(prev => new Map(prev).set(selectedModel, metrics));

      await currentRecognizerRef.current.disconnect();
      currentRecognizerRef.current = null;
      setIsConnected(false);
      addLog('✅ Disconnected');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">🎙️ Voice Model Testing</h1>
          <p className="text-muted-foreground">
            Compare Web Speech API vs OpenAI Realtime models
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Model Selection & Controls */}
          <div className="space-y-6">
            <ModelSelector
              currentModel={selectedModel}
              onModelChange={handleModelChange}
              disabled={isConnected}
            />

            {/* Language & Voice Guidance (existing) */}
            {/* Connection buttons (existing) */}
          </div>

          {/* Middle Column: Transcript & Debug */}
          <div className="space-y-6">
            {/* Existing transcript and debug logs */}
          </div>

          {/* Right Column: Cost & Performance */}
          <div className="space-y-6">
            <CostComparison
              currentModel={selectedModel}
              metrics={costMetrics}
            />

            <PerformanceComparison
              metrics={modelMetadata}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## 6. Edge Cases & Error Handling

### 6.1 Mid-Session Switching

**Scenario:** User attempts to switch models while connected

**Strategy:**
```typescript
// Prevent mid-session switching
if (isConnected) {
  showDialog({
    title: 'Disconnect Required',
    message: 'Please disconnect your current session before switching models.',
    actions: [
      {
        label: 'Disconnect & Switch',
        onClick: async () => {
          await handleDisconnect();
          handleModelChange(newModel);
          await handleConnect();
        }
      },
      { label: 'Cancel' }
    ]
  });
  return;
}
```

### 6.2 Fallback Mechanisms

**Scenario:** Selected model fails to initialize

**Strategy:**
```typescript
class FallbackHandler {
  private fallbackChain: ModelType[] = [
    ModelType.GPT4O_MINI_REALTIME,
    ModelType.GPT4O_REALTIME,
    ModelType.WEB_SPEECH  // Always available in browser
  ];

  async connectWithFallback(
    preferredModel: ModelType,
    config: RecognizerConfig
  ): Promise<ISpeechRecognizer> {
    const chain = [preferredModel, ...this.fallbackChain.filter(m => m !== preferredModel)];

    for (const model of chain) {
      try {
        console.log(`[Fallback] Attempting ${model}...`);
        config.model = model;
        const recognizer = SpeechRecognizerFactory.create(model);
        await recognizer.connect(config);
        return recognizer;
      } catch (error) {
        console.error(`[Fallback] ${model} failed:`, error);
        continue;
      }
    }

    throw new Error('All models failed to initialize');
  }
}
```

### 6.3 Browser Compatibility

**Scenario:** Web Speech API not available in user's browser

**Strategy:**
```typescript
class BrowserCompatibilityChecker {
  static checkWebSpeechSupport(): {
    supported: boolean;
    recognition: boolean;
    synthesis: boolean;
    message?: string;
  } {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    if (!SpeechRecognition && !SpeechSynthesis) {
      return {
        supported: false,
        recognition: false,
        synthesis: false,
        message: 'Web Speech API not supported. Please use Chrome, Edge, or Safari.'
      };
    }

    return {
      supported: true,
      recognition: !!SpeechRecognition,
      synthesis: !!SpeechSynthesis
    };
  }

  static getRecommendedModel(): ModelType {
    const support = this.checkWebSpeechSupport();

    // If Web Speech not supported, default to OpenAI
    if (!support.supported) {
      return ModelType.GPT4O_MINI_REALTIME;
    }

    return ModelType.WEB_SPEECH; // Free option first
  }
}

// In UI
useEffect(() => {
  const support = BrowserCompatibilityChecker.checkWebSpeechSupport();

  if (!support.supported) {
    toast.warning(
      'Web Speech API not available in your browser. Only OpenAI models will work.'
    );
    setSelectedModel(ModelType.GPT4O_MINI_REALTIME);
  }
}, []);
```

### 6.4 Cost Limit Enforcement

**Scenario:** User exceeds cost budget for session

**Strategy:**
```typescript
class CostLimitEnforcer {
  private limits = {
    perSession: 0.50,    // $0.50 max per session
    daily: 5.00,         // $5 max per day per user
    monthly: 100.00      // $100 max per month per user
  };

  async checkLimit(
    userId: string,
    estimatedCost: number,
    period: 'session' | 'daily' | 'monthly'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const currentUsage = await this.getCurrentUsage(userId, period);
    const limit = this.limits[period];
    const projectedTotal = currentUsage + estimatedCost;

    if (projectedTotal > limit) {
      return {
        allowed: false,
        reason: `Would exceed ${period} limit of $${limit}. Current: $${currentUsage.toFixed(2)}`
      };
    }

    return { allowed: true };
  }

  async enforceBeforeConnect(
    userId: string,
    model: ModelType
  ): Promise<void> {
    if (model === ModelType.WEB_SPEECH) return; // Free model

    const estimatedCost = 0.10; // Estimate $0.10 for 5-minute session

    const sessionCheck = await this.checkLimit(userId, estimatedCost, 'session');
    if (!sessionCheck.allowed) {
      throw new Error(`Cost limit: ${sessionCheck.reason}`);
    }

    const dailyCheck = await this.checkLimit(userId, estimatedCost, 'daily');
    if (!dailyCheck.allowed) {
      throw new Error(`Cost limit: ${dailyCheck.reason}`);
    }
  }

  private async getCurrentUsage(
    userId: string,
    period: 'session' | 'daily' | 'monthly'
  ): Promise<number> {
    // Query from cost tracking database
    // Implementation depends on storage backend
    return 0;
  }
}
```

### 6.5 Network Interruption Recovery

**Scenario:** Network drops during OpenAI Realtime session

**Strategy:**
```typescript
class NetworkInterruptionHandler {
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds

  async handleDisconnection(
    recognizer: ISpeechRecognizer,
    config: RecognizerConfig
  ): Promise<boolean> {
    console.log('[Network] Connection lost, attempting recovery...');

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[Network] Retry attempt ${attempt}/${this.maxRetries}`);

        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));

        await recognizer.connect(config);
        console.log('[Network] ✅ Reconnection successful');
        return true;

      } catch (error) {
        console.error(`[Network] ❌ Retry ${attempt} failed:`, error);

        if (attempt === this.maxRetries) {
          console.log('[Network] Max retries reached, suggesting fallback');
          return false;
        }
      }
    }

    return false;
  }
}
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
// tests/unit/SpeechRecognizerFactory.test.ts
describe('SpeechRecognizerFactory', () => {
  it('should create WebSpeechAdapter for WEB_SPEECH model', () => {
    const recognizer = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);
    expect(recognizer).toBeInstanceOf(WebSpeechAdapter);
  });

  it('should create OpenAIRealtimeAdapter for GPT4O models', () => {
    const recognizer = SpeechRecognizerFactory.create(ModelType.GPT4O_MINI_REALTIME);
    expect(recognizer).toBeInstanceOf(OpenAIRealtimeAdapter);
  });

  it('should throw error for unsupported model', () => {
    expect(() => {
      SpeechRecognizerFactory.create('invalid-model' as ModelType);
    }).toThrow('Unsupported model');
  });

  it('should reuse existing instances (singleton)', () => {
    const instance1 = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);
    const instance2 = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);
    expect(instance1).toBe(instance2);
  });
});

// tests/unit/ModelSwitcher.test.ts
describe('ModelSwitcher', () => {
  let switcher: ModelSwitcher;

  beforeEach(() => {
    switcher = new ModelSwitcher();
  });

  it('should switch from null to WEB_SPEECH', async () => {
    const config: RecognizerConfig = {
      model: ModelType.WEB_SPEECH,
      language: 'en-US'
    };

    const recognizer = await switcher.switch(null, ModelType.WEB_SPEECH, config);
    expect(recognizer).toBeDefined();
    expect(switcher.getCurrentModel()).toBe(ModelType.WEB_SPEECH);
  });

  it('should preserve state when switching between OpenAI models', async () => {
    const config: RecognizerConfig = {
      model: ModelType.GPT4O_REALTIME,
      language: 'es-PR'
    };

    await switcher.switch(null, ModelType.GPT4O_REALTIME, config);
    const recognizer = await switcher.switch(
      ModelType.GPT4O_REALTIME,
      ModelType.GPT4O_MINI_REALTIME,
      config
    );

    expect(recognizer.getState().language).toBe('es-PR');
  });

  it('should not preserve state when switching to/from WEB_SPEECH', async () => {
    const config: RecognizerConfig = {
      model: ModelType.WEB_SPEECH,
      language: 'en-US'
    };

    await switcher.switch(null, ModelType.WEB_SPEECH, config);

    const spy = vi.spyOn(switcher as any, 'canRestoreState');
    await switcher.switch(ModelType.WEB_SPEECH, ModelType.GPT4O_MINI_REALTIME, config);

    expect(spy).toHaveReturnedWith(false);
  });
});

// tests/unit/CostTracker.test.ts
describe('CostTracker', () => {
  let tracker: CostTracker;

  beforeEach(() => {
    localStorage.clear();
    tracker = new CostTracker(ModelType.GPT4O_MINI_REALTIME);
  });

  it('should initialize with zero metrics', () => {
    const metrics = tracker.getMetrics();
    expect(metrics.totalCost).toBe(0);
    expect(metrics.sessionsCount).toBe(0);
  });

  it('should track tokens and calculate cost', () => {
    tracker.startSession();
    tracker.trackTokens(1000000, 500000); // 1M input, 500K output
    tracker.endSession();

    const metrics = tracker.getMetrics();
    // Assuming 10x cheaper: $3.20 input + $3.20 output = $6.40
    expect(metrics.totalCost).toBeCloseTo(6.40, 2);
    expect(metrics.sessionsCount).toBe(1);
  });

  it('should persist metrics to localStorage', () => {
    tracker.startSession();
    tracker.trackTokens(100000, 50000);
    tracker.endSession();

    const stored = localStorage.getItem('cost_metrics_gpt-4o-mini-realtime-preview-2024-12-17');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.sessionsCount).toBe(1);
  });

  it('should calculate average cost per session', () => {
    tracker.startSession();
    tracker.trackTokens(1000000, 500000);
    tracker.endSession();

    tracker.startSession();
    tracker.trackTokens(500000, 250000);
    tracker.endSession();

    const metrics = tracker.getMetrics();
    expect(metrics.sessionsCount).toBe(2);
    expect(metrics.averageCostPerSession).toBe(metrics.totalCost / 2);
  });
});
```

### 7.2 Integration Tests

```typescript
// tests/integration/VoiceTest.integration.test.tsx
describe('VoiceTest Integration', () => {
  it('should render model selector with all options', () => {
    render(<VoiceTest />);

    expect(screen.getByText('Web Speech API')).toBeInTheDocument();
    expect(screen.getByText('GPT-4o Mini Realtime')).toBeInTheDocument();
    expect(screen.getByText('GPT-4o Realtime (Dec 2024)')).toBeInTheDocument();
  });

  it('should connect to Web Speech API when selected', async () => {
    render(<VoiceTest />);

    // Select Web Speech API
    const webSpeechOption = screen.getByLabelText(/Web Speech API/i);
    fireEvent.click(webSpeechOption);

    // Click connect
    const connectButton = screen.getByRole('button', { name: /Start Voice Session/i });
    fireEvent.click(connectButton);

    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
  });

  it('should prevent model change while connected', async () => {
    render(<VoiceTest />);

    // Connect with Web Speech
    const webSpeechOption = screen.getByLabelText(/Web Speech API/i);
    fireEvent.click(webSpeechOption);

    const connectButton = screen.getByRole('button', { name: /Start Voice Session/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });

    // Try to change model
    const gpt4oOption = screen.getByLabelText(/GPT-4o Mini/i);
    expect(gpt4oOption).toBeDisabled();
  });

  it('should display cost metrics after session', async () => {
    render(<VoiceTest />);

    // Connect
    const connectButton = screen.getByRole('button', { name: /Start Voice Session/i });
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });

    // Disconnect
    const disconnectButton = screen.getByRole('button', { name: /Stop Voice Session/i });
    fireEvent.click(disconnectButton);

    // Check cost display
    await waitFor(() => {
      expect(screen.getByText(/Cost Analysis/i)).toBeInTheDocument();
    });
  });

  it('should handle model switching after disconnect', async () => {
    render(<VoiceTest />);

    // Connect with Web Speech
    fireEvent.click(screen.getByLabelText(/Web Speech API/i));
    fireEvent.click(screen.getByRole('button', { name: /Start Voice Session/i }));

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });

    // Disconnect
    fireEvent.click(screen.getByRole('button', { name: /Stop Voice Session/i }));

    await waitFor(() => {
      expect(screen.getByText(/Disconnected/i)).toBeInTheDocument();
    });

    // Switch model
    fireEvent.click(screen.getByLabelText(/GPT-4o Mini/i));

    // Reconnect
    fireEvent.click(screen.getByRole('button', { name: /Start Voice Session/i }));

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
  });
});
```

### 7.3 Performance Tests

```typescript
// tests/performance/model-switching.perf.test.ts
describe('Model Switching Performance', () => {
  it('should switch models within 2 seconds', async () => {
    const switcher = new ModelSwitcher();
    const config: RecognizerConfig = {
      model: ModelType.WEB_SPEECH,
      language: 'en-US'
    };

    await switcher.switch(null, ModelType.WEB_SPEECH, config);

    const startTime = performance.now();
    await switcher.switch(ModelType.WEB_SPEECH, ModelType.GPT4O_MINI_REALTIME, config);
    const endTime = performance.now();

    const switchTime = endTime - startTime;
    expect(switchTime).toBeLessThan(2000); // 2 seconds
  });

  it('should handle 10 rapid switches without memory leak', async () => {
    const switcher = new ModelSwitcher();
    const config: RecognizerConfig = {
      model: ModelType.WEB_SPEECH,
      language: 'en-US'
    };

    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    for (let i = 0; i < 10; i++) {
      const model = i % 2 === 0 ? ModelType.WEB_SPEECH : ModelType.GPT4O_MINI_REALTIME;
      await switcher.switch(null, model, config);
      await switcher.getCurrentRecognizer()?.disconnect();
    }

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Should not increase by more than 10MB
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  it('should maintain audio quality during switching', async () => {
    // Measure audio latency and quality metrics
    const metrics = {
      webSpeech: { latency: 0, quality: 0 },
      gpt4oMini: { latency: 0, quality: 0 }
    };

    // Test Web Speech
    const webSpeech = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);
    metrics.webSpeech = await measureAudioQuality(webSpeech);

    // Test GPT-4o Mini
    const gpt4oMini = SpeechRecognizerFactory.create(ModelType.GPT4O_MINI_REALTIME);
    metrics.gpt4oMini = await measureAudioQuality(gpt4oMini);

    // Both should meet minimum quality standards
    expect(metrics.webSpeech.latency).toBeLessThan(1000); // <1s
    expect(metrics.gpt4oMini.latency).toBeLessThan(800); // <800ms
  });
});
```

### 7.4 UI/UX Tests

```typescript
// tests/e2e/voice-test.e2e.test.ts (Playwright)
test.describe('VoiceTest E2E', () => {
  test('complete user journey: select model, connect, use, disconnect', async ({ page }) => {
    await page.goto('/voice-test');

    // 1. Select model
    await page.click('text=Web Speech API');
    await expect(page.locator('text=FREE')).toBeVisible();

    // 2. Set language
    await page.click('button:has-text("🇵🇷 Español")');

    // 3. Connect
    await page.click('button:has-text("Start Voice Session")');
    await page.waitForSelector('text=🟢 Connected');

    // 4. Grant microphone permission (handled by browser)
    await page.context().grantPermissions(['microphone']);

    // 5. Verify connected state
    await expect(page.locator('text=Stop Voice Session')).toBeVisible();
    await expect(page.locator('input[type="radio"]')).toBeDisabled();

    // 6. Send test text
    await page.click('button:has-text("Send Test Text")');
    await expect(page.locator('text=Hola, soy Coquí')).toBeVisible();

    // 7. Disconnect
    await page.click('button:has-text("Stop Voice Session")');
    await expect(page.locator('text=🔴 Disconnected')).toBeVisible();

    // 8. Verify cost metrics displayed
    await expect(page.locator('text=Cost Analysis')).toBeVisible();
    await expect(page.locator('text=FREE')).toBeVisible(); // Web Speech is free
  });

  test('compare multiple models in single session', async ({ page }) => {
    await page.goto('/voice-test');

    const models = ['Web Speech API', 'GPT-4o Mini Realtime'];

    for (const model of models) {
      // Select model
      await page.click(`text=${model}`);

      // Connect
      await page.click('button:has-text("Start Voice Session")');
      await page.waitForSelector('text=🟢 Connected');

      // Use for a bit (simulate)
      await page.waitForTimeout(2000);

      // Disconnect
      await page.click('button:has-text("Stop Voice Session")');
      await page.waitForSelector('text=🔴 Disconnected');
    }

    // Verify both models appear in cost comparison
    await expect(page.locator('text=Web Speech API').first()).toBeVisible();
    await expect(page.locator('text=GPT-4o Mini').first()).toBeVisible();
  });

  test('handle browser without Web Speech API', async ({ page, context }) => {
    // Mock Web Speech API as unavailable
    await context.addInitScript(() => {
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;
    });

    await page.goto('/voice-test');

    // Should show warning
    await expect(page.locator('text=Web Speech API not available')).toBeVisible();

    // Web Speech option should be disabled or hidden
    const webSpeechOption = page.locator('text=Web Speech API');
    await expect(webSpeechOption).not.toBeVisible();
  });
});
```

---

## 8. Documentation Plan

### 8.1 API Documentation Structure

```markdown
# Speech Recognizer API Documentation

## Table of Contents
1. Introduction
2. Core Interfaces
3. Available Models
4. Usage Examples
5. Configuration Options
6. Error Handling
7. Cost Management
8. Performance Optimization
9. Browser Compatibility
10. Migration Guide

## 1. Introduction

The Speech Recognizer API provides a unified interface for integrating multiple speech recognition models in the K5 POC platform. It supports:

- **Web Speech API**: Free, browser-based recognition
- **OpenAI Realtime API**: Advanced AI-powered recognition with emotion detection

## 2. Core Interfaces

### ISpeechRecognizer

Main interface for all speech recognizers.

```typescript
interface ISpeechRecognizer {
  connect(config: RecognizerConfig): Promise<void>;
  disconnect(): Promise<void>;
  isActive(): boolean;
  startListening(): Promise<void>;
  stopListening(): void;
  sendText(text: string): void;
  getState(): RecognizerState;
  getCost(): CostMetrics;
  getMetadata(): ModelMetadata;
  on(event: RecognizerEvent, handler: EventHandler): void;
  off(event: RecognizerEvent, handler: EventHandler): void;
}
```

[... detailed documentation for each method ...]

## 3. Available Models

### Web Speech API (Free)

**Model Type**: `ModelType.WEB_SPEECH`

**Pros:**
- Zero cost
- Client-side processing (better privacy)
- No API keys required
- 95%+ accuracy for Puerto Rican Spanish

**Cons:**
- Browser-dependent (Chrome works best)
- Limited advanced features
- No emotion detection

**Usage:**
```typescript
const recognizer = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);
await recognizer.connect({
  language: 'es-PR',
  onTranscription: (text, isUser) => console.log(text)
});
```

### GPT-4o Mini Realtime (Recommended)

**Model Type**: `ModelType.GPT4O_MINI_REALTIME`

**Pros:**
- 10x cheaper than full GPT-4o
- 98%+ accuracy
- Advanced features (emotion, function calling)
- Low latency (~500ms)

**Cons:**
- Requires API key
- Usage costs apply
- Requires internet connection

**Cost:** Estimated $0.0032 per 1M input tokens, $0.0064 per 1M output tokens

**Usage:**
```typescript
const recognizer = SpeechRecognizerFactory.create(ModelType.GPT4O_MINI_REALTIME);
await recognizer.connect({
  language: 'es-PR',
  studentId: 'student-123',
  voiceGuidance: 'Speak slowly and clearly',
  onTranscription: (text, isUser) => console.log(text)
});
```

[... documentation for other models ...]

## 4. Usage Examples

### Basic Connection

```typescript
import { SpeechRecognizerFactory, ModelType } from '@/lib/speech';

const recognizer = SpeechRecognizerFactory.create(ModelType.WEB_SPEECH);

await recognizer.connect({
  language: 'es-PR',
  onTranscription: (text, isUser) => {
    console.log(`${isUser ? 'User' : 'AI'}: ${text}`);
  },
  onError: (error) => {
    console.error('Recognition error:', error);
  }
});

await recognizer.startListening();
```

### Model Switching

```typescript
import { ModelSwitcher, ModelType } from '@/lib/speech';

const switcher = new ModelSwitcher();

// Connect with Web Speech
const webSpeech = await switcher.switch(
  null,
  ModelType.WEB_SPEECH,
  config
);

// Later, switch to GPT-4o Mini
const gpt4oMini = await switcher.switch(
  ModelType.WEB_SPEECH,
  ModelType.GPT4O_MINI_REALTIME,
  config
);
```

### Cost Tracking

```typescript
const recognizer = SpeechRecognizerFactory.create(ModelType.GPT4O_MINI_REALTIME);
await recognizer.connect(config);

// Use the recognizer...

const metrics = recognizer.getCost();
console.log(`Session cost: $${metrics.lastSessionCost.toFixed(4)}`);
console.log(`Total cost: $${metrics.totalCost.toFixed(2)}`);
```

[... more examples ...]

## 5. Configuration Options

### RecognizerConfig Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `model` | `ModelType` | Yes | Speech recognition model to use |
| `language` | `'es-PR' \| 'en-US'` | Yes | Recognition language |
| `studentId` | `string` | No | Student identifier for tracking |
| `voiceGuidance` | `string` | No | Custom instructions for AI |
| `onTranscription` | `function` | No | Callback for transcription events |
| `onError` | `function` | No | Callback for error events |
| `onConnectionChange` | `function` | No | Callback for connection state |
| `onAudioLevel` | `function` | No | Callback for audio level changes |

[... detailed documentation ...]
```

### 8.2 Migration Guide

```markdown
# Migration Guide: Adding Model Switching to Existing Code

## Overview

This guide helps you migrate from the current OpenAI-only implementation to the new model-switching architecture.

## Step 1: Update Imports

**Before:**
```typescript
import { RealtimeVoiceClientEnhanced } from '@/utils/realtime/RealtimeVoiceClientEnhanced';
```

**After:**
```typescript
import {
  SpeechRecognizerFactory,
  ModelType,
  ISpeechRecognizer
} from '@/lib/speech';
```

## Step 2: Update Component State

**Before:**
```typescript
const [client, setClient] = useState<RealtimeVoiceClientEnhanced | null>(null);
```

**After:**
```typescript
const [recognizer, setRecognizer] = useState<ISpeechRecognizer | null>(null);
const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.WEB_SPEECH);
```

## Step 3: Update Connection Logic

**Before:**
```typescript
const handleConnect = async () => {
  const client = new RealtimeVoiceClientEnhanced({
    studentId: user?.id,
    language,
    onTranscription
  });
  await client.connect();
  setClient(client);
};
```

**After:**
```typescript
const handleConnect = async () => {
  const recognizer = SpeechRecognizerFactory.create(selectedModel);
  await recognizer.connect({
    model: selectedModel,
    language,
    studentId: user?.id,
    onTranscription
  });
  setRecognizer(recognizer);
};
```

## Step 4: Add Model Selection UI

```typescript
import { ModelSelector } from '@/components/voice/ModelSelector';

function MyComponent() {
  return (
    <>
      <ModelSelector
        currentModel={selectedModel}
        onModelChange={setSelectedModel}
        disabled={isConnected}
      />

      {/* Existing connection UI */}
    </>
  );
}
```

## Step 5: Update Disconnect Logic

**Before:**
```typescript
const handleDisconnect = () => {
  client?.disconnect();
  setClient(null);
};
```

**After:**
```typescript
const handleDisconnect = async () => {
  await recognizer?.disconnect();

  // Save cost metrics
  if (recognizer) {
    const metrics = recognizer.getCost();
    saveCostMetrics(selectedModel, metrics);
  }

  setRecognizer(null);
};
```

## Step 6: Test Migration

1. Test Web Speech API connection
2. Test OpenAI Realtime connection
3. Test model switching (disconnect → change → reconnect)
4. Verify cost tracking
5. Test error handling and fallbacks

## Breaking Changes

### API Changes

- `RealtimeVoiceClientEnhanced` → `ISpeechRecognizer` interface
- Constructor config now includes `model` parameter
- `connect()` is now async and returns `Promise<void>`
- `getCost()` replaces manual cost tracking

### Behavioral Changes

- Must disconnect before changing models
- State preservation only works between OpenAI models
- Cost metrics are persisted in localStorage

## Rollback Plan

If issues arise, you can temporarily disable model switching:

```typescript
// Force OpenAI Realtime (legacy behavior)
const FORCE_MODEL = ModelType.GPT4O_REALTIME;
const selectedModel = FORCE_MODEL; // Override user selection
```
```

### 8.3 Cost Analysis Document

```markdown
# Cost Analysis: Speech Recognition Models

## Executive Summary

This document provides detailed cost analysis and projections for different speech recognition models in the K5 POC platform.

## Model Comparison

| Model | Input Cost | Output Cost | Accuracy | Latency | Annual Cost (100k students) |
|-------|------------|-------------|----------|---------|----------------------------|
| Web Speech API | $0 | $0 | 95%+ | <1s | **$0** |
| GPT-4o Mini | $3.20/1M | $6.40/1M | 98%+ | ~500ms | **~$600k** (estimated) |
| GPT-4o Full | $32/1M | $64/1M | 98%+ | ~500ms | **~$6M** |

## Usage Projections

### Assumptions
- 100,000 active students
- 3 reading sessions per week per student
- 5 minutes of voice interaction per session
- 50 tokens per second (OpenAI Realtime API rate)

### Monthly Usage
- **Sessions:** 1,300,000 sessions/month
- **Voice Minutes:** 6,500,000 minutes/month
- **Input Tokens (OpenAI):** 19.5 billion tokens/month
- **Output Tokens (OpenAI):** 7.8 billion tokens/month (assuming 40% AI response time)

## Cost Breakdown by Model

### Web Speech API
```
Monthly Cost: $0
Annual Cost: $0

Advantages:
✅ Zero infrastructure cost
✅ No API rate limits
✅ Better privacy (client-side)
✅ Proven with 100k students

Disadvantages:
❌ Browser-dependent
❌ No emotion detection
❌ Limited advanced features
```

### GPT-4o Mini Realtime (Estimated)
```
Assumptions: 10x cheaper than GPT-4o Full

Input Cost: 19.5B tokens ÷ 1M × $3.20 = $62,400/month
Output Cost: 7.8B tokens ÷ 1M × $6.40 = $49,920/month

Monthly Cost: $112,320
Annual Cost: $1,347,840

With 60% prompt caching:
Cached Input: 19.5B × 0.6 ÷ 1M × $0.40 = $4,680
Uncached Input: 19.5B × 0.4 ÷ 1M × $3.20 = $24,960
Output: $49,920

Monthly Cost: $79,560
Annual Cost: $954,720

Advantages:
✅ 10x cheaper than full model
✅ Advanced features (emotion, functions)
✅ High accuracy (98%+)
✅ Low latency (~500ms)

Disadvantages:
❌ Still expensive at scale
❌ Requires API management
❌ Internet dependency
```

### GPT-4o Full Realtime
```
Input Cost: 19.5B tokens ÷ 1M × $32 = $624,000/month
Output Cost: 7.8B tokens ÷ 1M × $64 = $499,200/month

Monthly Cost: $1,123,200
Annual Cost: $13,478,400

With 60% prompt caching:
Cached Input: 19.5B × 0.6 ÷ 1M × $4 = $46,800
Uncached Input: 19.5B × 0.4 ÷ 1M × $32 = $249,600
Output: $499,200

Monthly Cost: $795,600
Annual Cost: $9,547,200

Advantages:
✅ Maximum features
✅ Highest accuracy
✅ Best emotion detection

Disadvantages:
❌ Prohibitively expensive at scale
❌ Overkill for K-5 reading exercises
```

## Recommendations

### Phase 1: Production Launch (Recommended)
**Primary Model:** Web Speech API
**Fallback:** GPT-4o Mini Realtime (for unsupported browsers)

**Projected Annual Cost:** $0 - $50,000
- Most users on free Web Speech API
- ~5% fallback to GPT-4o Mini for browser compatibility

### Phase 2: Enhanced Features (Optional)
**Hybrid Approach:**
- 80% sessions on Web Speech API (basic exercises)
- 20% sessions on GPT-4o Mini (assessments, advanced features)

**Projected Annual Cost:** ~$190,000
- Significant cost while enabling premium features where needed

### Phase 3: Full AI (Not Recommended for K-5)
**Full Migration to GPT-4o Mini**

**Projected Annual Cost:** ~$950,000 - $1,350,000
- Only if advanced conversational AI becomes core requirement
- Requires dedicated budget allocation

## Budget Impact Analysis

### Current K5 POC Budget
- Total: $161,420/year
- Per student: $1.61/year

### With GPT-4o Mini (Full Migration)
- Total: $1,309,260/year (8.1x increase)
- Per student: $13.09/year

### With Hybrid Approach
- Total: $351,420/year (2.2x increase)
- Per student: $3.51/year

### With Web Speech API Only
- Total: $161,420/year (no change)
- Per student: $1.61/year

## Cost Optimization Strategies

### 1. Aggressive Prompt Caching
- Cache lesson content and instructions
- Target: 60%+ cache hit rate
- Savings: 40-50% on input costs

### 2. Smart Model Selection
- Use Web Speech for simple exercises
- Use GPT-4o Mini only for:
  - Final assessments
  - Struggling students needing extra help
  - Emotion detection requirements

### 3. Token Optimization
- Compress audio before sending (if possible)
- Batch multiple requests
- Implement silence detection to reduce idle transmission

### 4. Usage Monitoring
- Set per-student daily limits
- Alert on unusual usage patterns
- Implement cost caps per school

## ROI Analysis

### Cost vs Benefits

**Web Speech API:**
- Cost: $0
- ROI: ∞ (infinite)
- Value: Proven technology, adequate for K-5 needs

**GPT-4o Mini vs Web Speech:**
- Additional Cost: $950k - $1.3M/year
- Additional Benefits:
  - 3% accuracy improvement (95% → 98%)
  - Emotion detection
  - Function calling
  - Image support
- ROI: Questionable for K-5 reading exercises

**Recommendation:** Stick with Web Speech API unless specific advanced features become critical requirements with allocated budget.

## Conclusion

For the K5 POC platform focused on K-5 bilingual reading:

1. **Web Speech API is the clear winner** for production deployment
2. **GPT-4o Mini serves as excellent fallback** for browser compatibility
3. **Full GPT-4o migration is not cost-effective** for this use case
4. **Hybrid approach may be viable** if specific advanced features are prioritized

**Total Recommended Budget:** $0 - $50,000/year (99% on free Web Speech API)
```

---

## 9. Risk Assessment & Mitigation

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Browser compatibility issues with Web Speech API** | Medium | High | - Implement comprehensive browser detection<br>- Auto-fallback to OpenAI for unsupported browsers<br>- Display clear compatibility warnings |
| **OpenAI API rate limits exceeded** | Low | Medium | - Implement request queuing<br>- Add exponential backoff<br>- Monitor usage per student |
| **Model switching causes audio glitches** | Medium | Medium | - Test extensively across browsers<br>- Implement smooth transitions<br>- Add audio buffer management |
| **State loss during model switch** | Medium | Low | - Implement robust state preservation<br>- Add validation checks<br>- Document incompatibilities |
| **Cost tracking accuracy issues** | Low | Medium | - Validate against OpenAI usage dashboard<br>- Implement double-entry tracking<br>- Add automated reconciliation |

### 9.2 Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Unexpected OpenAI pricing changes** | Medium | High | - Monitor OpenAI announcements<br>- Build cost caps per student<br>- Maintain Web Speech as free fallback |
| **Budget overruns from uncontrolled usage** | Medium | High | - Implement strict usage limits<br>- Add administrative cost dashboards<br>- Set up automated alerts |
| **Poor user experience from frequent switching** | Low | Medium | - Design intuitive UI<br>- Provide clear guidance<br>- Minimize need for manual switching |
| **Compliance issues with student data** | Low | Critical | - Ensure COPPA/FERPA compliance<br>- Document data flows<br>- Review OpenAI DPA |

### 9.3 Operational Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Support team unfamiliar with multiple models** | High | Medium | - Create comprehensive training materials<br>- Document troubleshooting guides<br>- Build admin diagnostic tools |
| **Difficult to debug issues across models** | Medium | Medium | - Implement detailed logging<br>- Add model-specific debug modes<br>- Create test scenarios for each model |
| **Maintenance burden of multiple adapters** | Medium | Low | - Use clean abstraction interfaces<br>- Write comprehensive tests<br>- Document architecture clearly |

---

## 10. Implementation Timeline

### Milestone-Based Schedule

```
Week 1: Foundation (16 hours)
├── Days 1-2: Architecture & Interface Design
│   ├── Review existing implementations [4h]
│   ├── Design ISpeechRecognizer interface [3h]
│   ├── Create configuration schema [2h]
│   └── Design model metadata structure [3h]
│
├── Days 3-4: Web Speech Adapter Implementation
│   ├── Implement WebSpeechAdapter class [6h]
│   ├── Add browser compatibility checks [2h]
│   └── Write unit tests [4h]
│
└── Day 5: OpenAI Adapter Refactoring
    ├── Refactor existing clients to adapter [4h]
    └── Write adapter tests [2h]

Week 2: Switching Logic (24 hours)
├── Days 1-2: Factory & Switcher
│   ├── Implement SpeechRecognizerFactory [3h]
│   ├── Implement ModelSwitcher service [5h]
│   ├── Add state preservation logic [4h]
│   └── Write integration tests [4h]
│
├── Days 3-4: Cost Tracking
│   ├── Implement CostTracker class [4h]
│   ├── Add localStorage persistence [2h]
│   └── Write cost calculation tests [2h]
│
└── Day 5: Error Handling
    ├── Implement FallbackHandler [3h]
    ├── Add NetworkInterruptionHandler [2h]
    ├── Implement CostLimitEnforcer [3h]
    └── Write error handling tests [2h]

Week 3: UI Components (20 hours)
├── Days 1-2: Model Selector Component
│   ├── Design component mockups [2h]
│   ├── Implement ModelSelector UI [5h]
│   ├── Add interaction states [2h]
│   └── Write component tests [3h]
│
├── Days 3-4: Cost & Performance Displays
│   ├── Implement CostComparison component [4h]
│   ├── Implement PerformanceComparison [3h]
│   └── Write display tests [2h]
│
└── Day 5: VoiceTest Integration
    ├── Integrate new components [3h]
    ├── Update state management [2h]
    └── Test complete flow [2h]

Week 4: Testing & Polish (20 hours)
├── Days 1-2: Comprehensive Testing
│   ├── Write E2E tests (Playwright) [6h]
│   ├── Performance testing [4h]
│   └── Cross-browser testing [4h]
│
├── Days 3-4: Documentation
│   ├── Write API documentation [4h]
│   ├── Create migration guide [2h]
│   └── Document cost analysis [2h]
│
└── Day 5: Review & Deploy
    ├── Code review and refinement [3h]
    ├── Deploy to staging [1h]
    ├── UAT with stakeholders [2h]
    └── Production deployment [1h]
```

**Total Effort:** 80 hours (10 days @ 8 hours/day or 2 sprints)

### Critical Path
```
Interface Design → Web Speech Adapter → ModelSwitcher →
UI Components → VoiceTest Integration → E2E Testing → Deployment
```

**Minimum Viable Product (MVP):**
- Web Speech + GPT-4o Realtime switching
- Basic model selector UI
- Simple cost tracking
- Essential error handling

**Estimated MVP Time:** 40 hours (1 sprint)

---

## 11. Success Criteria

### Technical Success Metrics

✅ **Functional Requirements:**
- [ ] User can select between Web Speech API and OpenAI models
- [ ] Model switching works without page reload
- [ ] State is preserved where possible during switches
- [ ] Cost tracking accurately reflects usage (±5% accuracy)
- [ ] All models connect within 3 seconds
- [ ] Error handling covers all identified edge cases

✅ **Performance Requirements:**
- [ ] Model switching completes within 2 seconds
- [ ] Voice-to-voice latency <800ms for OpenAI models
- [ ] Voice-to-voice latency <1s for Web Speech API
- [ ] No memory leaks during repeated switches
- [ ] UI remains responsive during model operations

✅ **Quality Requirements:**
- [ ] 90%+ code coverage for core logic
- [ ] All E2E scenarios pass
- [ ] Cross-browser compatibility (Chrome, Safari, Edge)
- [ ] No accessibility violations (WCAG 2.1 AA)
- [ ] All TypeScript strict mode checks pass

### Business Success Metrics

✅ **Cost Targets:**
- [ ] Cost tracking dashboard operational
- [ ] Per-student cost limits enforceable
- [ ] Projected annual costs within ±10% of estimates
- [ ] Web Speech API adoption rate >80% (free usage)

✅ **User Experience:**
- [ ] Model selector intuitive (no user confusion observed in UAT)
- [ ] Less than 3 clicks to change models
- [ ] Clear cost/benefit information displayed
- [ ] No user-reported audio quality issues

✅ **Documentation:**
- [ ] API documentation complete and accurate
- [ ] Migration guide enables smooth transition
- [ ] Cost analysis document approved by stakeholders
- [ ] Support team trained on troubleshooting

---

## 12. Future Enhancements

### Phase 2 Features (Post-MVP)

**1. Automatic Model Selection**
```typescript
class SmartModelSelector {
  selectOptimalModel(context: SessionContext): ModelType {
    // Consider: budget remaining, student needs, browser capability
    if (context.budgetRemaining < 0.10) return ModelType.WEB_SPEECH;
    if (!context.browserSupportsWebSpeech) return ModelType.GPT4O_MINI_REALTIME;
    if (context.studentNeedsEmotionDetection) return ModelType.GPT4O_MINI_REALTIME;
    return ModelType.WEB_SPEECH; // Default to free
  }
}
```

**2. A/B Testing Framework**
```typescript
class ModelABTest {
  assignModelVariant(studentId: string): ModelType {
    // Randomly assign 50% Web Speech, 50% GPT-4o Mini
    // Track: completion rates, accuracy, user satisfaction
  }

  getTestResults(): ABTestMetrics {
    // Compare performance across cohorts
  }
}
```

**3. Real-time Cost Alerts**
```typescript
class CostAlertService {
  subscribeToAlerts(userId: string, thresholds: CostThresholds) {
    // Send push notifications when approaching limits
    // Display in-app warnings before expensive operations
  }
}
```

**4. GPT-4o-mini-realtime Integration**
When the mini model becomes available:
- Add `ModelType.GPT4O_MINI_REALTIME` constant
- Update cost calculations with actual pricing
- Add specific adapter if API differs
- Update UI to highlight as "Recommended"

**5. Offline Mode Support**
```typescript
class OfflineWebSpeechAdapter extends WebSpeechAdapter {
  // Enhanced offline capabilities
  // Cache common phrases
  // Graceful degradation
}
```

**6. Advanced Analytics Dashboard**
- Model usage trends over time
- Cost per school district breakdown
- Performance comparison visualizations
- Student engagement metrics by model

**7. Teacher/Admin Overrides**
- School administrators can set default model per grade
- Teachers can recommend model for specific students
- Budget allocation per classroom

### Integration Opportunities

**1. Student Dashboard**
- Show which model is active during reading sessions
- Display personal cost metrics (for older students)
- Recommend optimal model based on learning patterns

**2. Teacher Dashboard**
- Compare student performance across models
- View class-wide cost analytics
- Override model selection for individual students

**3. Assessment System**
- Use premium models only during formal assessments
- Fallback to free models for practice sessions

---

## 13. Appendices

### Appendix A: Architecture Diagrams

```
High-Level Architecture:
┌─────────────────────────────────────────────────────────────┐
│                      VoiceTest Page (React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ ModelSelector│  │ CostComparison│  │ Performance     │   │
│  │   Component  │  │   Component   │  │ Comparison      │   │
│  └──────┬───────┘  └──────┬────────┘  └────────┬────────┘   │
│         │                 │                    │             │
│         └─────────────────┴────────────────────┘             │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                     ModelSwitcher Service                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         State Preservation & Transition Logic          │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│              SpeechRecognizerFactory (Factory Pattern)        │
└───────┬───────────────────────────────────────┬──────────────┘
        │                                       │
┌───────▼──────────────┐              ┌────────▼──────────────┐
│  WebSpeechAdapter    │              │ OpenAIRealtimeAdapter │
│  ┌────────────────┐  │              │  ┌─────────────────┐  │
│  │ Web Speech API │  │              │  │ RealtimeVoice   │  │
│  │  (Browser)     │  │              │  │ ClientEnhanced  │  │
│  └────────────────┘  │              │  └─────────────────┘  │
│  ┌────────────────┐  │              │  ┌─────────────────┐  │
│  │ Speech         │  │              │  │ WebSocket Relay │  │
│  │ Synthesis      │  │              │  │ (Supabase Edge) │  │
│  └────────────────┘  │              │  └─────────────────┘  │
└──────────────────────┘              └───────────┬───────────┘
                                                  │
                                      ┌───────────▼───────────┐
                                      │  OpenAI Realtime API  │
                                      └───────────────────────┘

Data Flow - Model Switching:
1. User selects new model in UI
2. ModelSelector emits change event
3. VoiceTest checks if currently connected
4. If connected: Show "disconnect first" dialog
5. If disconnected: Update selectedModel state
6. User clicks "Connect"
7. ModelSwitcher.switch() called with new model
8. Factory creates appropriate adapter
9. Adapter.connect() establishes connection
10. UI updates with connection status
11. Cost tracking begins
12. User interacts with voice features
13. User clicks "Disconnect"
14. Adapter.disconnect() cleans up
15. Cost metrics saved to localStorage
16. UI displays cost comparison
```

### Appendix B: Configuration Examples

```typescript
// Example 1: Basic Web Speech Configuration
const basicConfig: RecognizerConfig = {
  model: ModelType.WEB_SPEECH,
  language: 'es-PR',
  onTranscription: (text, isUser) => {
    console.log(`${isUser ? 'Student' : 'Coquí'}: ${text}`);
  }
};

// Example 2: Advanced OpenAI Configuration
const advancedConfig: RecognizerConfig = {
  model: ModelType.GPT4O_MINI_REALTIME,
  language: 'es-PR',
  studentId: 'student-12345',
  voiceGuidance: `You are Coquí, a friendly reading assistant for K-5 students.
    Speak slowly and clearly in Puerto Rican Spanish.
    Encourage the student and provide positive feedback.
    Correct pronunciation gently without discouraging.`,
  onTranscription: (text, isUser) => {
    updateTranscriptUI(text, isUser);
  },
  onError: (error) => {
    showErrorToast(error.message);
    logErrorToSentry(error);
  },
  onConnectionChange: (connected) => {
    updateConnectionIndicator(connected);
  },
  onAudioLevel: (level) => {
    updateAudioMeter(level);
  }
};

// Example 3: Cost-Limited Configuration
const budgetConfig: RecognizerConfig = {
  model: ModelType.GPT4O_MINI_REALTIME,
  language: 'en-US',
  studentId: 'student-67890',
  onTranscription: (text, isUser) => {
    // Track token usage
    const tokens = estimateTokens(text);
    costTracker.addTokens(isUser ? tokens : 0, isUser ? 0 : tokens);

    // Check if approaching limit
    if (costTracker.isApproachingLimit(0.90)) {
      warnAboutCostLimit();
    }

    // Hard stop at limit
    if (costTracker.exceedsLimit()) {
      recognizer.disconnect();
      showCostLimitDialog();
    }
  }
};

// Example 4: Development/Testing Configuration
const devConfig: RecognizerConfig = {
  model: ModelType.WEB_SPEECH,
  language: 'en-US',
  onTranscription: (text, isUser) => {
    console.log(`[DEV] ${isUser ? 'User' : 'AI'}: ${text}`);
    // Send to test analytics
    logToTestDashboard({ text, isUser, timestamp: Date.now() });
  },
  onError: (error) => {
    console.error('[DEV] Error:', error);
    // Don't show UI errors in dev mode
  },
  onConnectionChange: (connected) => {
    console.log(`[DEV] Connection: ${connected ? 'CONNECTED' : 'DISCONNECTED'}`);
  }
};
```

### Appendix C: Code Structure

```
src/
├── lib/
│   └── speech/
│       ├── interfaces/
│       │   ├── ISpeechRecognizer.ts        # Core interface
│       │   ├── RecognizerConfig.ts         # Configuration types
│       │   ├── RecognizerState.ts          # State types
│       │   └── ModelMetadata.ts            # Model metadata types
│       │
│       ├── adapters/
│       │   ├── WebSpeechAdapter.ts         # Web Speech API adapter
│       │   ├── OpenAIRealtimeAdapter.ts    # OpenAI Realtime adapter
│       │   └── BaseAdapter.ts              # Shared adapter logic
│       │
│       ├── services/
│       │   ├── ModelSwitcher.ts            # Model switching service
│       │   ├── CostTracker.ts              # Cost tracking service
│       │   ├── FallbackHandler.ts          # Fallback logic
│       │   └── NetworkInterruptionHandler.ts
│       │
│       ├── factories/
│       │   └── SpeechRecognizerFactory.ts  # Factory pattern
│       │
│       ├── utils/
│       │   ├── browserCompatibility.ts     # Browser checks
│       │   ├── costCalculations.ts         # Cost utilities
│       │   └── stateSerializer.ts          # State serialization
│       │
│       └── index.ts                        # Public exports
│
├── components/
│   └── voice/
│       ├── ModelSelector.tsx               # Model selection UI
│       ├── CostComparison.tsx              # Cost display
│       ├── PerformanceComparison.tsx       # Performance metrics
│       └── AudioLevelMeter.tsx             # Audio visualization
│
├── pages/
│   └── VoiceTest.tsx                       # Updated test page
│
└── tests/
    ├── unit/
    │   ├── SpeechRecognizerFactory.test.ts
    │   ├── ModelSwitcher.test.ts
    │   ├── CostTracker.test.ts
    │   ├── WebSpeechAdapter.test.ts
    │   └── OpenAIRealtimeAdapter.test.ts
    │
    ├── integration/
    │   ├── VoiceTest.integration.test.tsx
    │   └── ModelSwitching.integration.test.ts
    │
    ├── performance/
    │   └── model-switching.perf.test.ts
    │
    └── e2e/
        └── voice-test.e2e.test.ts
```

---

## 14. References & Resources

### Official Documentation
- OpenAI Realtime API: https://platform.openai.com/docs/guides/realtime
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- OpenAI Pricing: https://openai.com/api/pricing/

### Existing K5 POC Documentation
- `/docs/openai-realtime-api-analysis.md` - OpenAI Realtime analysis
- `/docs/openai-all-models-comparison.md` - Model comparison
- `/docs/plan/05-voice-recognition/` - Voice recognition documentation

### Related Code Files
- `/src/utils/realtime/RealtimeVoiceClient.ts` - Current implementation
- `/src/utils/realtime/RealtimeVoiceClientEnhanced.ts` - Enhanced client
- `/src/pages/VoiceTest.tsx` - Existing test page
- `/src/components/StudentDashboard/VoiceTraining.tsx` - Web Speech usage

### Design Patterns
- Factory Pattern: https://refactoring.guru/design-patterns/factory-method
- Adapter Pattern: https://refactoring.guru/design-patterns/adapter
- Strategy Pattern: https://refactoring.guru/design-patterns/strategy

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-23 | Claude (GOAP Specialist) | Initial comprehensive plan |

---

**END OF PLAN DOCUMENT**
