import { ISpeechRecognizer } from '../interfaces/ISpeechRecognizer';
import { RecognizerConfig } from '../types/RecognizerConfig';
import { CostMetrics } from '../types/CostMetrics';
import { ModelMetadata } from '../types/ModelMetadata';
import { ModelType, ModelFeature } from '../types/ModelType';

/**
 * Web Speech API adapter implementation
 * Uses browser's native speech recognition and synthesis (free, client-side)
 */
export class WebSpeechAdapter implements ISpeechRecognizer {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private config: RecognizerConfig | null = null;
  private sessionCount = 0;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async connect(config: RecognizerConfig): Promise<void> {
    console.log('[WebSpeechAdapter] 🔌 Connecting...');
    
    this.config = config;
    
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      const error = new Error('Web Speech API not supported in this browser. Please use Chrome, Edge, or Safari.');
      config.onError?.(error);
      throw error;
    }

    // Initialize speech recognition
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = config.language;
    this.recognition.maxAlternatives = 1;

    // Set up event handlers
    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join('');
      
      if (transcript.trim()) {
        config.onTranscription?.(transcript, true);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('[WebSpeechAdapter] ❌ Error:', event.error);
      
      // Don't treat 'no-speech' as a critical error
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        config.onError?.(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    this.recognition.onstart = () => {
      console.log('[WebSpeechAdapter] 🎤 Listening started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('[WebSpeechAdapter] 🛑 Listening stopped');
      this.isListening = false;
      
      // Auto-restart if we should still be listening
      if (this.recognition && this.config) {
        try {
          this.recognition.start();
        } catch (e) {
          // Ignore if already started
        }
      }
    };

    // Start listening
    this.recognition.start();
    this.sessionCount++;
    
    config.onConnectionChange?.(true);
    console.log('[WebSpeechAdapter] ✅ Connected');
  }

  async disconnect(): Promise<void> {
    console.log('[WebSpeechAdapter] 🔌 Disconnecting...');
    
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    
    this.isListening = false;
    this.config?.onConnectionChange?.(false);
    this.config = null;
    
    console.log('[WebSpeechAdapter] ✅ Disconnected');
  }

  isActive(): boolean {
    return this.recognition !== null && this.isListening;
  }

  sendText(text: string): void {
    console.log('[WebSpeechAdapter] 🔊 Speaking:', text);
    
    if (!this.config) {
      console.warn('[WebSpeechAdapter] ⚠️ Not connected, cannot speak');
      return;
    }

    // Use Web Speech Synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.language;
    utterance.rate = 0.9; // Slightly slower for clarity
    
    utterance.onstart = () => {
      this.config?.onTranscription?.(text, false);
    };
    
    utterance.onerror = (event) => {
      console.error('[WebSpeechAdapter] ❌ Synthesis error:', event.error);
      this.config?.onError?.(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    this.synthesis.speak(utterance);
  }

  getCost(): CostMetrics {
    // Web Speech API is free
    return {
      model: ModelType.WEB_SPEECH,
      sessionsCount: this.sessionCount,
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
      averageLatency: 800
    };
  }
}
