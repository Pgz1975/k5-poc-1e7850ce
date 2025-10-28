# Technical Specifications - OpenAI Realtime API Demo Activities
## Detailed Implementation Guide - COMPLETE ISOLATION ARCHITECTURE

**Document Version:** 2.0 - ISOLATION ARCHITECTURE
**Last Updated:** October 28, 2025
**Status:** IMPLEMENTATION READY
**Architecture:** COMPLETE ISOLATION

---

## 🚨 CRITICAL: ISOLATION PRINCIPLE

This implementation creates a **completely separate demo system** with:
- **Standalone client** (`ExperimentalVoiceClient` - does NOT extend production client)
- **Dedicated Edge Function** (`realtime-voice-demo-relay`)
- **Isolated database tables** (`demo_activities`, `demo_voice_sessions`)
- **Separate routes** (`/demo/**` - never `/activities/**`)
- **ONLY shared resource**: OpenAI API keys

### NO Production Code Reuse

The demo system is **structurally isolated** - not an extension:
- ❌ Does NOT extend `RealtimeVoiceClientEnhanced`
- ❌ Does NOT use `manual_assessments` table
- ❌ Does NOT share voice session tables
- ❌ Does NOT modify production components
- ✅ Completely independent implementation

---

## 🎯 Overview

This document provides **production-ready technical specifications** for implementing 7 demo activities showcasing the OpenAI Realtime API. Each specification includes:

- Standalone component architecture
- Isolated API integration patterns
- Complete code implementation examples
- Error handling strategies
- Performance optimization techniques

**REMEMBER**: Every component is isolated from production.

---

## 🏗️ Core Architecture - STANDALONE IMPLEMENTATION

### Demo Realtime Client (Standalone)

**File:** `src/utils/realtime/ExperimentalVoiceClient.ts`

**CRITICAL**: This client is **completely standalone** - it does NOT extend production client.

```typescript
// NO IMPORT from production client - standalone implementation

export interface DemoFeatures {
  wordLevelTranscription?: boolean;
  functionCalling?: boolean;
  pronunciationAnalysis?: boolean;
  voiceModulation?: boolean;
  audioVisualization?: boolean;
}

// Standalone config - not extending production types
export interface DemoConfig {
  apiKey?: string;  // Will use env var if not provided
  edgeFunctionUrl?: string;  // Full WebSocket URL or will construct from Supabase project ID
  demoType: 'story' | 'pronunciation' | 'speed_quiz' | 'voice_builder' | 'spelling' | 'writing' | 'readflow';
  features: DemoFeatures;
  language?: 'es-PR' | 'en-US';  // Language for voice and transcription
  voiceGuidance?: string;  // Instructions for the AI assistant
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';  // OpenAI voice
  onWordTranscription?: (word: string, timestamp: number, confidence: number) => void;
  onFunctionCall?: (name: string, args: any) => Promise<any>;
  onAudioVisualization?: (frequencyData: Uint8Array) => void;
}

export class ExperimentalVoiceClient {
  private demoConfig: DemoConfig;
  private transcriptionBuffer: Array<{ word: string; timestamp: number; confidence: number }> = [];
  private functionCallHandlers: Map<string, (args: any) => Promise<any>> = new Map();
  private visualizerNode: AnalyserNode | null = null;
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private isConnected: boolean = false;

  constructor(config: DemoConfig) {
    this.demoConfig = config;
    this.setupDemoFeatures();
  }

  // Standalone WebSocket connection to Supabase Edge Function demo relay
  private async connectToDemo() {
    let wsUrl: string;

    if (this.demoConfig.edgeFunctionUrl) {
      // Use provided URL directly (assumes it's already a valid WebSocket URL)
      wsUrl = this.demoConfig.edgeFunctionUrl;
    } else {
      // Extract project ID from Supabase URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);

      if (!match || !match[1]) {
        throw new Error('Unable to extract project ID from VITE_SUPABASE_URL');
      }

      const projectId = match[1];  // e.g., 'meertwtenhlmnlpwxhyz'
      wsUrl = `wss://${projectId}.supabase.co/functions/v1/realtime-voice-demo-relay`;
    }

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.sendSessionUpdate();
      this.initializeAudio();
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };

    this.ws.onclose = () => {
      this.isConnected = false;
    };
  }

  // Send session configuration with type: "realtime" - matches GA schema
  private sendSessionUpdate() {
    if (!this.ws) return;

    const sessionUpdate: any = {
      type: 'session.update',
      session: {
        model: 'gpt-4o-realtime-preview-2024-10-01',  // GA model required
        type: 'realtime',
        modalities: ['text', 'audio'],
        instructions: this.demoConfig.voiceGuidance || this.getDefaultInstructions(),
        voice: this.demoConfig.voice || 'alloy',
        // GA audio object structure
        audio: {
          input: {
            format: 'pcm16',
            sample_rate: 24000
          },
          output: {
            format: 'pcm16',
            sample_rate: 24000,
            voice: this.demoConfig.voice || 'alloy'
          }
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        }
      }
    };

    // Enable transcription if needed (GA structure)
    if (this.demoConfig.features.wordLevelTranscription) {
      sessionUpdate.session.input_audio_transcription = {
        model: 'whisper-1'
      };
    }

    // Add function tools if available
    if (this.demoConfig.features.functionCalling) {
      sessionUpdate.session.tools = this.getFunctionTools();
      sessionUpdate.session.tool_choice = 'auto';
    }

    this.ws.send(JSON.stringify(sessionUpdate));
  }

  private async initializeAudio() {
    this.audioContext = new AudioContext({ sampleRate: 24000 });
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 24000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Set up AudioWorklet for audio capture
    await this.audioContext.audioWorklet.addModule('/audio-capture-worklet.js');

    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.audioWorklet = new AudioWorkletNode(this.audioContext, 'audio-capture-processor');

    // Send audio chunks to WebSocket
    this.audioWorklet.port.onmessage = (event) => {
      if (event.data.audio && this.ws && this.isConnected) {
        // Base64 encode PCM16 audio before sending
        const base64Audio = this.arrayBufferToBase64(event.data.audio);
        this.ws.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }));
      }
    };

    source.connect(this.audioWorklet);
    this.audioWorklet.connect(this.audioContext.destination);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private getDefaultInstructions(): string {
    const language = this.demoConfig.language || 'es-PR';
    const isSpanish = language === 'es-PR';

    const instructions = {
      'readflow': isSpanish
        ? 'Eres un asistente de lectura amigable. Escucha al estudiante leer y proporciona retroalimentación sobre pronunciación.'
        : 'You are a friendly reading assistant. Listen to the student read and provide feedback on pronunciation.',
      'pronunciation': isSpanish
        ? 'Eres un entrenador de pronunciación. Ayuda al estudiante a pronunciar palabras correctamente.'
        : 'You are a pronunciation coach. Help the student pronounce words correctly.',
      'speed_quiz': isSpanish
        ? 'Eres un anfitrión de quiz rápido. Haz preguntas de verdadero/falso con límite de tiempo.'
        : 'You are a speed quiz host. Ask true/false questions with time limits.',
      'voice_builder': isSpanish
        ? 'Eres un asistente de construcción. Ayuda al estudiante a organizar elementos con comandos de voz.'
        : 'You are a building assistant. Help the student arrange items using voice commands.',
      'spelling': isSpanish
        ? 'Eres un entrenador de ortografía. Ayuda al estudiante a deletrear palabras letra por letra.'
        : 'You are a spelling coach. Help the student spell words letter by letter.',
      'writing': isSpanish
        ? 'Eres un asistente de escritura creativa. Ayuda al estudiante a componer historias.'
        : 'You are a creative writing assistant. Help the student compose stories.',
      'story': isSpanish
        ? 'Eres un narrador interactivo. Cuenta historias y haz que el estudiante participe.'
        : 'You are an interactive storyteller. Tell stories and engage the student.'
    };

    return instructions[this.demoConfig.demoType] || instructions['story'];
  }

  private getFunctionTools(): any[] {
    // Return function tools based on demo type
    if (this.demoConfig.demoType === 'voice_builder') {
      return [{
        type: 'function',
        function: {
          name: 'move_item',
          description: 'Move an item to a new position',
          parameters: {
            type: 'object',
            properties: {
              item: { type: 'string' },
              position: { type: 'string', enum: ['left', 'right', 'up', 'down'] }
            },
            required: ['item', 'position']
          }
        }
      }];
    }
    return [];
  }

  private setupDemoFeatures() {
    // Enable word-level transcription if needed
    if (this.demoConfig.features.wordLevelTranscription) {
      this.enableWordTranscription();
    }

    // Setup function calling
    if (this.demoConfig.features.functionCalling) {
      this.enableFunctionCalling();
    }

    // Setup audio visualization
    if (this.demoConfig.features.audioVisualization) {
      this.enableAudioVisualization();
    }
  }

  // Standalone event handling
  private eventHandlers: Map<string, Set<Function>> = new Map();

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  private emit(event: string, data: any) {
    this.eventHandlers.get(event)?.forEach(handler => handler(data));
  }

  private handleMessage(message: any) {
    // Handle WebSocket messages with CORRECT GA event names
    switch (message.type) {
      case 'session.created':
        console.log('Session created:', message.session);
        break;

      case 'session.updated':
        console.log('Session updated:', message.session);
        break;

      case 'conversation.item.added':
        console.log('Conversation item added:', message.item);
        break;

      case 'conversation.item.done':
        console.log('Conversation item completed:', message.item);
        break;

      case 'input_audio_buffer.speech_started':
        console.log('Speech started');
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('Speech stopped');
        break;

      case 'input_audio_buffer.committed':
        console.log('Audio buffer committed');
        break;

      case 'response.created':
        console.log('Response created:', message.response);
        break;

      case 'response.output_audio.delta':
        // Play audio delta
        if (message.delta) {
          this.playAudioDelta(message.delta);
        }
        break;

      case 'response.output_audio.done':
        console.log('Audio output complete');
        break;

      case 'response.output_audio_transcript.delta':
        // Handle transcription delta for word-level tracking
        this.emit('response.output_audio_transcript.delta', message);
        if (this.demoConfig.features.wordLevelTranscription) {
          this.processTranscriptionDelta(message.delta);
        }
        break;

      case 'response.output_audio_transcript.done':
        console.log('Transcript complete:', message.transcript);
        break;

      case 'response.function_call_arguments.done':
        this.emit('function_call.arguments.done', message);
        this.handleFunctionCall(message);
        break;

      case 'error':
        console.error('Realtime API error:', message.error);
        this.emit('error', message.error);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private playAudioDelta(base64Audio: string) {
    // Decode base64 audio and play
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert to PCM16 and queue for playback
    const audioData = new Int16Array(bytes.buffer);
    this.queueAudioPlayback(audioData);
  }

  private audioPlaybackQueue: Int16Array[] = [];
  private isPlayingAudio: boolean = false;

  private queueAudioPlayback(audioData: Int16Array) {
    this.audioPlaybackQueue.push(audioData);
    if (!this.isPlayingAudio) {
      this.playNextAudioChunk();
    }
  }

  private playNextAudioChunk() {
    if (this.audioPlaybackQueue.length === 0) {
      this.isPlayingAudio = false;
      return;
    }

    this.isPlayingAudio = true;
    const chunk = this.audioPlaybackQueue.shift()!;

    if (!this.audioContext) return;

    // Convert Int16 to Float32 for Web Audio API
    const float32Data = new Float32Array(chunk.length);
    for (let i = 0; i < chunk.length; i++) {
      float32Data[i] = chunk[i] / 32768.0; // Normalize to -1.0 to 1.0
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.onended = () => this.playNextAudioChunk();
    source.start();
  }

  private processTranscriptionDelta(delta: string) {
    const words = this.parseWords(delta);
    words.forEach(({ word, timestamp, confidence }) => {
      this.transcriptionBuffer.push({ word, timestamp, confidence });
      this.demoConfig.onWordTranscription?.(word, timestamp, confidence);
    });
  }

  private enableWordTranscription() {
    // Word-level transcription is handled in handleMessage
    // via response.output_audio_transcript.delta events
    console.log('Word-level transcription enabled');
  }

  private parseWords(delta: string): Array<{ word: string; timestamp: number; confidence: number }> {
    // Split delta into words with timing information
    const words = delta.trim().split(/\s+/);
    const timestamp = performance.now();

    return words.map(word => ({
      word: word.toLowerCase().replace(/[^\w\sáéíóúñü]/gi, ''),
      timestamp,
      confidence: 0.9 // Would come from logprobs in production
    }));
  }

  private enableFunctionCalling() {
    // Function calling is handled in handleMessage
    // via response.function_call_arguments.done events
    console.log('Function calling enabled');
  }

  private async handleFunctionCall(event: any) {
    const { call_id, name, arguments: args } = event;

    try {
      const handler = this.functionCallHandlers.get(name);
      if (handler) {
        const result = await handler(JSON.parse(args));
        this.sendFunctionResult(call_id, result);
      } else {
        console.error(`No handler for function: ${name}`);
        this.sendFunctionResult(call_id, { error: `No handler for function: ${name}` });
      }
    } catch (error: any) {
      console.error(`Function call error: ${name}`, error);
      this.sendFunctionResult(call_id, { error: error.message });
    }
  }

  private sendFunctionResult(callId: string, result: any) {
    if (!this.ws) return;

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result)
      }
    };

    this.ws.send(JSON.stringify(event));

    // Trigger response generation
    this.ws.send(JSON.stringify({ type: 'response.create' }));
  }

  public async disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    this.isConnected = false;
  }

  public commitAudioBuffer() {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
    }
  }

  public createResponse() {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({ type: 'response.create' }));
    }
  }

  public sendText(text: string) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: text
            }
          ]
        }
      }));
      // Trigger response generation
      this.createResponse();
    }
  }

  public registerFunctionHandler(name: string, handler: (args: any) => Promise<any>) {
    this.functionCallHandlers.set(name, handler);
  }

  private enableAudioVisualization() {
    if (!this.audioContext) return;

    this.visualizerNode = this.audioContext.createAnalyser();
    this.visualizerNode.fftSize = 256;

    // Connect to audio source (would need to tap into existing audio pipeline)
    this.startVisualizationLoop();
  }

  private startVisualizationLoop() {
    if (!this.visualizerNode) return;

    const bufferLength = this.visualizerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.visualizerNode) return;

      requestAnimationFrame(draw);
      this.visualizerNode.getByteFrequencyData(dataArray);
      this.demoConfig.onAudioVisualization?.(dataArray);
    };

    draw();
  }

  // Public API: Connect to demo session
  public async connect(): Promise<void> {
    await this.connectToDemo();
  }

  public getTranscriptionHistory(): Array<{ word: string; timestamp: number; confidence: number }> {
    return [...this.transcriptionBuffer];
  }

  public clearTranscriptionHistory() {
    this.transcriptionBuffer = [];
  }

}
```

---

## 📖 Demo 1: ReadFlow - Interactive Reading

### Component Architecture

**File:** `src/components/demo/DemoPlayers/ReadFlowPlayer.tsx`

```typescript
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { useRealtimeDemo } from '@/hooks/useRealtimeDemo';
import { ReadingHighlighter } from '@/components/realtime/ReadingHighlighter';
import { useReadingMetrics } from '@/hooks/useReadingMetrics';

interface Word {
  id: number;
  text: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ReadFlowContent {
  passage: {
    title: string;
    text: string;
    words: Word[];
    target_wcpm: number;
    min_accuracy: number;
  };
  reading_assistance: {
    word_highlighting: boolean;
    auto_scroll: boolean;
    pronunciation_hints: boolean;
    pace_feedback: boolean;
  };
}

interface ReadFlowPlayerProps {
  content: ReadFlowContent;
  activityId: string;
  language: string;
}

export function ReadFlowPlayer({ content, activityId, language }: ReadFlowPlayerProps) {
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStates, setWordStates] = useState<Map<number, 'pending' | 'correct' | 'error' | 'skipped'>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { client, isConnected, startSession, endSession } = useRealtimeDemo({
    demoType: 'readflow',
    language,
    features: {
      wordLevelTranscription: true,
      audioVisualization: true
    },
    voiceGuidance: `You are a reading coach. Listen carefully as the student reads the passage. Track each word they say. If they mispronounce a word, gently correct them and model the correct pronunciation. Encourage fluency and expression. Provide positive feedback.`,
    onWordTranscription: handleWordTranscription
  });

  const metrics = useReadingMetrics({
    words: content.passage.words,
    currentIndex: currentWordIndex,
    wordStates,
    startTime: isReading ? Date.now() : null
  });

  function handleWordTranscription(word: string, timestamp: number, confidence: number) {
    if (!isReading) return;

    const expectedWord = content.passage.words[currentWordIndex];
    if (!expectedWord) return;

    // Fuzzy match the spoken word to expected word
    const match = fuzzyMatch(word, expectedWord.text);

    if (match.score > 0.85) {
      // Correct word
      setWordStates(prev => new Map(prev).set(currentWordIndex, 'correct'));
      setCurrentWordIndex(prev => prev + 1);

      // Check for completion
      if (currentWordIndex + 1 >= content.passage.words.length) {
        handleReadingComplete();
      }
    } else {
      // Check if student skipped ahead
      const nextWords = content.passage.words.slice(currentWordIndex + 1, currentWordIndex + 4);
      const skipMatch = nextWords.findIndex(w => fuzzyMatch(word, w.text).score > 0.85);

      if (skipMatch !== -1) {
        // Mark skipped word
        setWordStates(prev => new Map(prev).set(currentWordIndex, 'skipped'));
        setCurrentWordIndex(prev => prev + skipMatch + 1);
      } else if (match.score > 0.6) {
        // Pronunciation error (close but not quite)
        setWordStates(prev => new Map(prev).set(currentWordIndex, 'error'));

        // Request pronunciation help from AI
        client?.sendText(`The student is trying to say "${expectedWord.text}" but said "${word}". Gently model the correct pronunciation.`);
      }
    }

    // Auto-scroll if enabled
    if (content.reading_assistance.auto_scroll) {
      scrollToWord(currentWordIndex);
    }
  }

  function fuzzyMatch(spoken: string, expected: string): { score: number; distance: number } {
    // Levenshtein distance implementation
    const s = spoken.toLowerCase();
    const e = expected.toLowerCase();

    const matrix: number[][] = [];

    for (let i = 0; i <= e.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= s.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= e.length; i++) {
      for (let j = 1; j <= s.length; j++) {
        if (e[i - 1] === s[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    const distance = matrix[e.length][s.length];
    const maxLen = Math.max(s.length, e.length);
    const score = 1 - (distance / maxLen);

    return { score, distance };
  }

  function scrollToWord(index: number) {
    const wordElement = document.getElementById(`word-${index}`);
    if (wordElement && containerRef.current) {
      const container = containerRef.current;
      const wordRect = wordElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (wordRect.top < containerRect.top || wordRect.bottom > containerRect.bottom) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  async function handleStart() {
    if (!isConnected) {
      await startSession();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for connection
    }

    setIsReading(true);
    setCurrentWordIndex(0);
    setWordStates(new Map());
    setShowResults(false);

    // Announce start
    client?.sendText(`The student is ready to read "${content.passage.title}". Listen carefully and provide support.`);
  }

  function handlePause() {
    setIsReading(false);
  }

  function handleReset() {
    setIsReading(false);
    setCurrentWordIndex(0);
    setWordStates(new Map());
    setShowResults(false);
  }

  function handleReadingComplete() {
    setIsReading(false);
    setShowResults(true);

    // Request final feedback from AI
    const accuracy = metrics.accuracy;
    const wcpm = metrics.wcpm;

    client?.sendText(`The student completed the passage. Accuracy: ${(accuracy * 100).toFixed(1)}%, Speed: ${wcpm} words per minute. Provide encouraging feedback and specific praise.`);
  }

  return (
    <div className="space-y-6">
      {/* Demo Badge */}
      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
        ✨ ReadFlow Demo - Interactive Reading with AI Coach
      </Badge>

      {/* Title */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-2xl font-bold text-center">{content.passage.title}</h2>
      </Card>

      {/* Reading Passage */}
      <Card
        ref={containerRef}
        className="p-8 max-h-[400px] overflow-y-auto scroll-smooth"
      >
        <div className="text-2xl leading-relaxed">
          {content.passage.words.map((word, index) => {
            const state = wordStates.get(index) || 'pending';
            const isCurrent = index === currentWordIndex && isReading;

            return (
              <span
                key={index}
                id={`word-${index}`}
                className={cn(
                  'inline-block mx-1 px-2 py-1 rounded transition-all duration-200',
                  {
                    'bg-gray-100': state === 'pending',
                    'bg-green-200 text-green-800': state === 'correct',
                    'bg-red-200 text-red-800': state === 'error',
                    'bg-yellow-200 text-yellow-800': state === 'skipped',
                    'ring-4 ring-blue-400 scale-110': isCurrent
                  }
                )}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isReading && !showResults && (
          <Button
            onClick={handleStart}
            size="lg"
            className="gap-2"
            disabled={!isConnected && !isReading}
          >
            <Play className="w-5 h-5" />
            Start Reading
          </Button>
        )}

        {isReading && (
          <Button
            onClick={handlePause}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </Button>
      </div>

      {/* Metrics */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Words Read</p>
            <p className="text-2xl font-bold">{currentWordIndex}</p>
            <p className="text-xs text-muted-foreground">/ {content.passage.words.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-2xl font-bold">{(metrics.accuracy * 100).toFixed(1)}%</p>
            <Progress value={metrics.accuracy * 100} className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Speed (WCPM)</p>
            <p className="text-2xl font-bold">{metrics.wcpm}</p>
            <p className="text-xs text-muted-foreground">Target: {content.passage.target_wcpm}</p>
          </div>
        </div>
      </Card>

      {/* Results */}
      {showResults && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">🎉 Great Job!</h3>
          <div className="space-y-2 text-green-700">
            <p>✅ Accuracy: {(metrics.accuracy * 100).toFixed(1)}%</p>
            <p>⚡ Speed: {metrics.wcpm} words per minute</p>
            <p>📊 Words Correct: {metrics.correctWords} / {content.passage.words.length}</p>
            {metrics.accuracy >= content.passage.min_accuracy ? (
              <p className="font-bold mt-4">🏆 You've mastered this passage!</p>
            ) : (
              <p className="mt-4">Keep practicing to improve your accuracy!</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
```

### Reading Metrics Hook

**File:** `src/hooks/useReadingMetrics.ts`

```typescript
import { useMemo } from 'react';

interface Word {
  id: number;
  text: string;
}

interface ReadingMetricsProps {
  words: Word[];
  currentIndex: number;
  wordStates: Map<number, 'pending' | 'correct' | 'error' | 'skipped'>;
  startTime: number | null;
}

export function useReadingMetrics({ words, currentIndex, wordStates, startTime }: ReadingMetricsProps) {
  return useMemo(() => {
    const totalWords = words.length;
    const readWords = currentIndex;
    const correctWords = Array.from(wordStates.values()).filter(s => s === 'correct').length;
    const errorWords = Array.from(wordStates.values()).filter(s => s === 'error').length;
    const skippedWords = Array.from(wordStates.values()).filter(s => s === 'skipped').length;

    // Calculate accuracy
    const accuracy = readWords > 0 ? correctWords / readWords : 0;

    // Calculate WCPM (Words Correct Per Minute)
    let wcpm = 0;
    if (startTime && readWords > 0) {
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      wcpm = Math.round(correctWords / elapsed);
    }

    // Calculate fluency score (0-100)
    const fluencyScore = Math.round(
      (accuracy * 70) + // 70% weight on accuracy
      (Math.min(wcpm / 100, 1) * 30) // 30% weight on speed (max at 100 WCPM)
    );

    return {
      totalWords,
      readWords,
      correctWords,
      errorWords,
      skippedWords,
      accuracy,
      wcpm,
      fluencyScore,
      progress: readWords / totalWords
    };
  }, [words, currentIndex, wordStates, startTime]);
}
```

---

## 🎤 Demo 2: Pronunciation Coaching

### Component

**File:** `src/components/demo/DemoPlayers/PronunciationPlayer.tsx`

```typescript
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2 } from 'lucide-react';
import { useRealtimeDemo } from '@/hooks/useRealtimeDemo';
import { AudioWaveform } from '@/components/realtime/AudioWaveform';
import { PronunciationFeedback } from '@/components/realtime/PronunciationFeedback';
import { usePronunciationAnalysis } from '@/hooks/usePronunciationAnalysis';

interface Answer {
  text: string;
  pronunciation: string[];
  isCorrect: boolean;
}

interface PronunciationContent {
  question: string;
  target_pronunciation: string;
  answers: Answer[];
  pronunciation_challenge: {
    say_to_select: boolean;
    confidence_threshold: number;
    feedback_levels: string[];
  };
}

interface PronunciationPlayerProps {
  content: PronunciationContent;
  activityId: string;
  language: string;
}

export function PronunciationPlayer({ content, activityId, language }: PronunciationPlayerProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [spokenWord, setSpokenWord] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(-100);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(128));

  const { client, isConnected, startSession } = useRealtimeDemo({
    demoType: 'pronunciation',
    language,
    features: {
      wordLevelTranscription: true,
      pronunciationAnalysis: true,
      audioVisualization: true
    },
    voiceGuidance: `You are a pronunciation coach. Listen carefully to the student's pronunciation. Provide specific phoneme-level feedback. Model the correct pronunciation clearly. Encourage and praise effort.`,
    onWordTranscription: handlePronunciation,
    onAudioVisualization: setFrequencyData
  });

  const analysis = usePronunciationAnalysis({
    spokenWord,
    targetWord: content.target_pronunciation,
    confidence
  });

  function handlePronunciation(word: string, timestamp: number, confidenceScore: number) {
    if (!isListening) return;

    setSpokenWord(word);
    setConfidence(confidenceScore);

    // Match spoken word to one of the answers
    const matchedIndex = content.answers.findIndex(
      answer => answer.text.toLowerCase() === word.toLowerCase()
    );

    if (matchedIndex !== -1 && confidenceScore >= content.pronunciation_challenge.confidence_threshold) {
      setSelectedAnswer(matchedIndex);
      setIsListening(false);
      setShowFeedback(true);

      // Get AI feedback
      const answer = content.answers[matchedIndex];
      if (answer.isCorrect) {
        client?.sendText(`Excellent pronunciation of "${word}"! That's the correct answer.`);
      } else {
        client?.sendText(`You said "${word}" clearly. The correct answer is "${content.target_pronunciation}". Let me help you with the pronunciation.`);
      }
    }
  }

  async function handleStartListening() {
    if (!isConnected) {
      await startSession();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsListening(true);
    setSpokenWord('');
    setConfidence(0);
    setShowFeedback(false);
    setSelectedAnswer(null);

    client?.sendText(`Ready to listen. The student will say one of these words: ${content.answers.map(a => a.text).join(', ')}.`);
  }

  function handlePlayAudio(text: string) {
    // Request AI to model pronunciation
    client?.sendText(`Model the pronunciation of "${text}" clearly and slowly.`);
  }

  return (
    <div className="space-y-6">
      {/* Demo Badge */}
      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
        🎤 Pronunciation Demo - Live Coaching with AI
      </Badge>

      {/* Question */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">{content.question}</h2>
        <p className="text-muted-foreground">
          Say the correct word out loud to select your answer
        </p>
      </Card>

      {/* Audio Visualization */}
      {isListening && (
        <Card className="p-6">
          <AudioWaveform
            frequencyData={frequencyData}
            audioLevel={audioLevel}
            isActive={isListening}
          />
        </Card>
      )}

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4">
        {content.answers.map((answer, index) => (
          <Card
            key={index}
            className={cn(
              'p-6 cursor-pointer hover:border-blue-300 transition-all',
              {
                'border-blue-500 bg-blue-50': selectedAnswer === index && !showFeedback,
                'border-green-500 bg-green-50': selectedAnswer === index && showFeedback && answer.isCorrect,
                'border-red-500 bg-red-50': selectedAnswer === index && showFeedback && !answer.isCorrect
              }
            )}
            onClick={() => !showFeedback && handlePlayAudio(answer.text)}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{answer.text}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio(answer.text);
                }}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {answer.pronunciation.join('-')}
            </p>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        {!isListening && !showFeedback && (
          <Button
            onClick={handleStartListening}
            size="lg"
            className="gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Speaking
          </Button>
        )}

        {isListening && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-center text-blue-700 font-medium">
              🎤 Listening... Say one of the words above
            </p>
            {spokenWord && (
              <p className="text-center text-sm mt-2">
                Heard: <span className="font-bold">{spokenWord}</span>
                {confidence > 0 && (
                  <span className="ml-2">
                    (Confidence: {(confidence * 100).toFixed(0)}%)
                  </span>
                )}
              </p>
            )}
          </Card>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && selectedAnswer !== null && (
        <PronunciationFeedback
          spokenWord={spokenWord}
          targetWord={content.target_pronunciation}
          isCorrect={content.answers[selectedAnswer].isCorrect}
          analysis={analysis}
          onTryAgain={() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
            handleStartListening();
          }}
        />
      )}
    </div>
  );
}
```

### Pronunciation Analysis Hook

**File:** `src/hooks/usePronunciationAnalysis.ts`

```typescript
import { useMemo } from 'react';

interface PronunciationAnalysisProps {
  spokenWord: string;
  targetWord: string;
  confidence: number;
}

export function usePronunciationAnalysis({ spokenWord, targetWord, confidence }: PronunciationAnalysisProps) {
  return useMemo(() => {
    if (!spokenWord || !targetWord) {
      return {
        phonemeMatch: 0,
        syllableMatch: 0,
        overallScore: 0,
        issues: []
      };
    }

    const spoken = spokenWord.toLowerCase();
    const target = targetWord.toLowerCase();

    // Simple phoneme matching (would use more sophisticated algorithm in production)
    const spokenPhonemes = spoken.split('');
    const targetPhonemes = target.split('');

    let matchingPhonemes = 0;
    const minLength = Math.min(spokenPhonemes.length, targetPhonemes.length);

    for (let i = 0; i < minLength; i++) {
      if (spokenPhonemes[i] === targetPhonemes[i]) {
        matchingPhonemes++;
      }
    }

    const phonemeMatch = matchingPhonemes / targetPhonemes.length;

    // Syllable matching (simplified)
    const syllableMatch = spoken === target ? 1.0 : phonemeMatch;

    // Overall score incorporating confidence
    const overallScore = (phonemeMatch * 0.6) + (syllableMatch * 0.2) + (confidence * 0.2);

    // Identify issues
    const issues: string[] = [];
    if (phonemeMatch < 0.7) {
      issues.push('Some sounds need work');
    }
    if (spoken.length < target.length) {
      issues.push('Missing some sounds');
    }
    if (spoken.length > target.length) {
      issues.push('Added extra sounds');
    }
    if (confidence < 0.8) {
      issues.push('Speak more clearly');
    }

    return {
      phonemeMatch,
      syllableMatch,
      overallScore,
      issues
    };
  }, [spokenWord, targetWord, confidence]);
}
```

---

## ⚡ Demo 3: Speed Quiz

**File:** `src/components/demo/DemoPlayers/SpeedQuizPlayer.tsx`

```typescript
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Zap } from 'lucide-react';
import { useRealtimeDemo } from '@/hooks/useRealtimeDemo';

interface Question {
  statement: string;
  correct: boolean;
  category: string;
  time_limit_ms: number;
}

interface SpeedQuizContent {
  questions: Question[];
  scoring: {
    base_points: number;
    speed_multiplier: boolean;
    max_multiplier: number;
    penalty_per_second: number;
  };
}

export function SpeedQuizPlayer({ content, activityId, language }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<Array<{ correct: boolean; time: number }>>([]);
  const questionStartTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { client, isConnected, startSession } = useRealtimeDemo({
    demoType: 'speed_quiz',
    language,
    features: {
      wordLevelTranscription: true
    },
    voiceGuidance: `You are hosting a rapid-fire quiz. Read each statement clearly and quickly. Immediately confirm if the student says "verdadero"/"true" or "falso"/"false". Celebrate fast correct answers with energy. Keep it exciting and fast-paced!`,
    onWordTranscription: handleAnswer
  });

  function handleAnswer(word: string) {
    if (!isPlaying) return;

    const normalizedWord = word.toLowerCase().trim();
    const isTrueAnswer = ['verdadero', 'true', 'sí', 'yes', 'cierto'].includes(normalizedWord);
    const isFalseAnswer = ['falso', 'false', 'no', 'incorrecto'].includes(normalizedWord);

    if (!isTrueAnswer && !isFalseAnswer) return;

    const answerTime = performance.now() - questionStartTime.current;
    const question = content.questions[currentQuestion];
    const studentAnswer = isTrueAnswer;
    const isCorrect = studentAnswer === question.correct;

    // Calculate points
    let points = 0;
    if (isCorrect) {
      points = content.scoring.base_points;

      if (content.scoring.speed_multiplier) {
        const speedBonus = Math.max(
          0,
          question.time_limit_ms - answerTime
        ) / 1000 * content.scoring.penalty_per_second;

        const multiplier = Math.min(
          1 + (speedBonus / 10),
          content.scoring.max_multiplier
        );

        points = Math.round(points * multiplier);
      }

      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setScore(prev => prev + points);
    setResults(prev => [...prev, { correct: isCorrect, time: answerTime }]);

    // Move to next question or finish
    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      resetTimer();

      // AI reads next question
      const nextQ = content.questions[currentQuestion + 1];
      client?.sendText(`Next question: ${nextQ.statement}. True or false?`);
    } else {
      finishQuiz();
    }
  }

  function resetTimer() {
    const question = content.questions[currentQuestion];
    setTimeRemaining(question.time_limit_ms);
    questionStartTime.current = performance.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          // Time's up - auto advance
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }

  function handleTimeout() {
    setResults(prev => [...prev, { correct: false, time: content.questions[currentQuestion].time_limit_ms }]);

    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      resetTimer();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const correctCount = results.filter(r => r.correct).length;
    const accuracy = (correctCount / results.length) * 100;
    const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;

    client?.sendText(`Quiz complete! Score: ${score} points. Accuracy: ${accuracy.toFixed(0)}%. Average time: ${(avgTime / 1000).toFixed(1)} seconds. Great job!`);
  }

  async function startQuiz() {
    if (!isConnected) {
      await startSession();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsPlaying(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    resetTimer();

    const firstQ = content.questions[0];
    client?.sendText(`Speed quiz starting! First question: ${firstQ.statement}. True or false?`);
  }

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
        ⚡ Speed Quiz Demo - Rapid-Fire with AI Host
      </Badge>

      {!isPlaying && results.length === 0 ? (
        <Card className="p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">Ready for Speed Quiz?</h2>
          <p className="text-muted-foreground mb-6">
            Answer as fast as you can! Faster correct answers earn more points.
          </p>
          <Button onClick={startQuiz} size="lg">
            Start Quiz
          </Button>
        </Card>
      ) : isPlaying ? (
        <>
          {/* Question Card */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge>Question {currentQuestion + 1} / {content.questions.length}</Badge>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono">{(timeRemaining / 1000).toFixed(1)}s</span>
              </div>
            </div>

            <Progress
              value={(timeRemaining / content.questions[currentQuestion].time_limit_ms) * 100}
              className="mb-6"
            />

            <h3 className="text-2xl font-bold text-center mb-6">
              {content.questions[currentQuestion].statement}
            </h3>

            <p className="text-center text-muted-foreground">
              Say "Verdadero" or "Falso" out loud
            </p>
          </Card>

          {/* Score Display */}
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-3xl font-bold text-yellow-600">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-3xl font-bold text-green-600">{streak} 🔥</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-3xl font-bold text-blue-600">
                  {results.filter(r => r.correct).length}
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-2xl font-bold text-center mb-6">🏆 Quiz Complete!</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Final Score</p>
              <p className="text-4xl font-bold text-yellow-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-4xl font-bold text-green-600">
                {((results.filter(r => r.correct).length / results.length) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <Button onClick={startQuiz} size="lg" className="w-full">
            Play Again
          </Button>
        </Card>
      )}
    </div>
  );
}
```

---

## 🎨 Shared Components

### Audio Waveform Visualizer

**File:** `src/components/realtime/AudioWaveform.tsx`

```typescript
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  frequencyData: Uint8Array;
  audioLevel: number;
  isActive: boolean;
  className?: string;
}

export function AudioWaveform({ frequencyData, audioLevel, isActive, className }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);

      if (!isActive) {
        // Draw idle state
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      // Draw waveform
      const barWidth = width / frequencyData.length;
      const barSpacing = 2;

      for (let i = 0; i < frequencyData.length; i++) {
        const value = frequencyData[i];
        const percent = value / 255;
        const barHeight = percent * height;
        const x = i * (barWidth + barSpacing);
        const y = (height - barHeight) / 2;

        // Color based on amplitude
        const hue = 200 + (percent * 60); // Blue to purple
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Draw audio level indicator
      const levelPercent = Math.max(0, Math.min(1, (audioLevel + 60) / 60));
      ctx.fillStyle = levelPercent > 0.5 ? '#22c55e' : '#f59e0b';
      ctx.fillRect(0, height - 4, width * levelPercent, 4);
    };

    draw();
    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, [frequencyData, audioLevel, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={120}
      className={cn('w-full rounded-lg', className)}
    />
  );
}
```

---

## 🔌 Demo Hook

**File:** `src/hooks/useRealtimeDemo.ts`

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { ExperimentalVoiceClient, DemoConfig } from '@/utils/realtime/ExperimentalVoiceClient';
import { useAuth } from '@/contexts/AuthContext';

export function useRealtimeDemo(config: Partial<DemoConfig>) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<ExperimentalVoiceClient | null>(null);

  const fullConfig: DemoConfig = {
    demoType: config.demoType!,
    features: config.features || {},
    language: config.language || 'es-PR',
    voiceGuidance: config.voiceGuidance,
    voice: config.voice || 'alloy',
    edgeFunctionUrl: config.edgeFunctionUrl,  // Optional: provide full WebSocket URL
    onWordTranscription: config.onWordTranscription,
    onFunctionCall: config.onFunctionCall,
    onAudioVisualization: config.onAudioVisualization
  };

  const startSession = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Create client if not exists
      if (!clientRef.current) {
        clientRef.current = new ExperimentalVoiceClient(fullConfig);
      }

      await clientRef.current.connect();
    } catch (err) {
      setError(err as Error);
      console.error('Demo session error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [fullConfig]);

  const endSession = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    client: clientRef.current,
    isConnected,
    isConnecting,
    isAIPlaying,
    error,
    startSession,
    endSession
  };
}
```

---

## 📊 Database Migration

**File:** `supabase/migrations/create_demo_tables.sql`

```sql
-- Create completely separate demo tables (NOT modifying production)
-- See DATABASE_MIGRATION.sql for complete schema

-- Example: demo_activities table (completely separate from manual_assessments)
CREATE TABLE IF NOT EXISTS demo_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_type TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  content JSONB NOT NULL,
  grade_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo tables are ISOLATED - production tables remain untouched
-- NO modifications to manual_assessments, voice_sessions, or voice_interactions
```

---

## 🎯 Next Steps

1. Review **[CODE_TEMPLATES.md](./CODE_TEMPLATES.md)** for additional demos (Voice Builder, Spelling Coach, Writing Coach)
2. Implement shared utilities from this document
3. Create demo content in database
4. Setup testing infrastructure
5. Deploy to staging for QA

**Status:** ✅ Technical specifications complete
**Next Document:** CODE_TEMPLATES.md

