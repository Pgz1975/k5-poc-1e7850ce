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
  private shouldAutoRestart = false;

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

      // Permission or device issues: stop and do not auto-restart
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
        this.shouldAutoRestart = false;
        this.isListening = false;
        try { this.recognition?.stop(); } catch {}
        const message = event.error === 'audio-capture'
          ? 'No microphone found or it is in use by another application.'
          : 'Microphone access was blocked. Please allow mic permissions and reload.';
        config.onError?.(new Error(message));
        return;
      }
      
      // Don't treat 'no-speech' and 'aborted' as critical
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
      
      // Auto-restart only when allowed
      if (this.recognition && this.config && this.shouldAutoRestart) {
        try {
          this.recognition.start();
        } catch (e) {
          // Ignore if already started
        }
      } else {
        console.log('[WebSpeechAdapter] ⏸️ Auto-restart disabled');
      }
    };

    // Ensure secure context and permission granted before starting
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      const error = new Error('Microphone requires HTTPS or localhost. Please open the site over https://');
      config.onError?.(error);
      throw error;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      console.error('[WebSpeechAdapter] ❌ Microphone permission denied or unavailable');
      this.shouldAutoRestart = false;
      config.onError?.(new Error('Microphone access denied. Please allow mic permissions in your browser.'));
      throw err;
    }

    // Start listening
    this.shouldAutoRestart = true;
    this.recognition.start();
    this.sessionCount++;
    
    config.onConnectionChange?.(true);
    console.log('[WebSpeechAdapter] ✅ Connected');
  }

  async disconnect(): Promise<void> {
    console.log('[WebSpeechAdapter] 🔌 Disconnecting...');
    
    this.shouldAutoRestart = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
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
