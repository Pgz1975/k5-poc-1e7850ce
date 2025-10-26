import { ISpeechRecognizer } from '../interfaces/ISpeechRecognizer';
import { RecognizerConfig } from '../types/RecognizerConfig';
import { CostMetrics } from '../types/CostMetrics';
import { ModelMetadata } from '../types/ModelMetadata';
import { ModelType, ModelFeature } from '../types/ModelType';
import { RealtimeVoiceClientEnhanced } from '@/utils/realtime/RealtimeVoiceClientEnhanced';
import { CostTracker } from '../services/CostTracker';
import { CostDatabaseService } from '../services/CostDatabaseService';

/**
 * OpenAI Realtime API adapter implementation
 * Wraps the existing RealtimeVoiceClientEnhanced to conform to ISpeechRecognizer interface
 */
export class OpenAIRealtimeAdapter implements ISpeechRecognizer {
  private client: RealtimeVoiceClientEnhanced | null = null;
  private config: RecognizerConfig | null = null;
  private costTracker: CostTracker;
  private costDbService: CostDatabaseService;
  private model: ModelType;
  private sessionToken: string | null = null;

  constructor(model: ModelType) {
    this.model = model;
    this.costTracker = new CostTracker(model);
    this.costDbService = new CostDatabaseService();
  }

  async connect(config: RecognizerConfig): Promise<void> {
    console.log(`[OpenAIRealtimeAdapter] 🔌 Connecting to ${this.model}...`);
    
    this.config = config;
    
    // Get session token from Supabase
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      const error = new Error('No active session. Please log in.');
      config.onError?.(error);
      throw error;
    }
    
    this.sessionToken = session.access_token;

    // Create enhanced client
    this.client = new RealtimeVoiceClientEnhanced({
      studentId: config.studentId || 'anonymous',
      language: config.language,
      model: this.model,
      voiceGuidance: config.voiceGuidance,
      onTranscription: config.onTranscription,
      onError: config.onError,
      onConnectionChange: config.onConnectionChange,
      onAudioLevel: config.onAudioLevel,
      onAudioPlayback: (isPlaying) => {
        // Audio playback state change (logging removed to reduce console noise)
      }
    });

    // Start cost tracking session
    this.costTracker.startSession();

    // Start database session
    await this.costDbService.startSession(
      config.studentId || 'anonymous',
      this.model
    );

    // Connect with session token
    await this.client.connect(this.sessionToken);
    
    console.log('[OpenAIRealtimeAdapter] ✅ Connected');
  }

  async disconnect(): Promise<void> {
    console.log('[OpenAIRealtimeAdapter] 🔌 Disconnecting...');
    
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
    
    // End cost tracking session
    this.costTracker.endSession();

    // End database session
    await this.costDbService.endSession();
    
    this.config?.onConnectionChange?.(false);
    this.config = null;
    this.sessionToken = null;
    
    console.log('[OpenAIRealtimeAdapter] ✅ Disconnected');
  }

  isActive(): boolean {
    return this.client?.isConnected() ?? false;
  }

  sendText(text: string): void {
    console.log('[OpenAIRealtimeAdapter] 📤 Sending text:', text);
    
    if (!this.client || !this.isActive()) {
      console.warn('[OpenAIRealtimeAdapter] ⚠️ Not connected, cannot send text');
      return;
    }
    
    this.client.sendText(text);
    
    // Track estimated tokens (rough approximation: ~4 chars per token)
    const estimatedTokens = Math.ceil(text.length / 4);
    this.costTracker.trackTokens(estimatedTokens, 0);

    // Update database with token usage
    const costPerToken = this.getMetadata().costPerInputToken;
    this.costDbService.updateTokenUsage(
      estimatedTokens,
      0,
      estimatedTokens * costPerToken
    );
  }

  getCost(): CostMetrics {
    return this.costTracker.getMetrics();
  }

  getMetadata(): ModelMetadata {
    const isMini = this.model === ModelType.GPT4O_MINI_REALTIME;
    
    return {
      name: isMini ? 'GPT-4o Mini Realtime' : 'GPT-4o Realtime',
      type: this.model,
      provider: 'openai',
      costPerInputToken: isMini ? 0.0000032 : 0.000032,
      costPerOutputToken: isMini ? 0.0000064 : 0.000064,
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
}
