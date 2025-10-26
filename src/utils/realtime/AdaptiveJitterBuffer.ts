/**
 * Adaptive Jitter Buffer for OpenAI Realtime Voice
 * Handles network jitter and ensures smooth audio playback
 */

interface AudioChunk {
  data: Int16Array;
  timestamp: number;
  sequenceNumber: number;
}

export class AdaptiveJitterBuffer {
  private buffer: Map<number, AudioChunk> = new Map();
  private playbackPosition = 0;
  private targetLatency = 250; // ms (increased for smoother playback)
  private readonly minLatency = 200;
  private readonly maxLatency = 400;
  private networkJitter: number[] = [];
  private audioContext: AudioContext;
  private onUnderrunCallback?: () => void;
  private isPlaying = false;
  private lastChunkTime = 0;
  private nextSequence = 0;
  private accumulatedPCM: Int16Array[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  addChunk(pcm16Data: Int16Array, timestamp: number): void {
    const chunk: AudioChunk = {
      data: pcm16Data,
      timestamp,
      sequenceNumber: this.nextSequence++
    };

    this.buffer.set(chunk.sequenceNumber, chunk);
    this.accumulatedPCM.push(pcm16Data);
    this.updateJitterEstimate(timestamp);
    this.adjustTargetLatency();

    // Trigger playback if we have enough buffered (now targets larger chunks)
    const bufferedDuration = this.getBufferedDuration();
    if (bufferedDuration >= this.targetLatency && !this.isPlaying) {
      console.log('[JitterBuffer] Starting playback, buffered:', bufferedDuration, 'ms');
      this.schedulePlayback();
    }
  }

  private updateJitterEstimate(timestamp: number): void {
    if (this.lastChunkTime > 0) {
      const jitter = Math.abs(timestamp - this.lastChunkTime);
      this.networkJitter.push(jitter);
      
      // Keep only recent jitter measurements
      if (this.networkJitter.length > 50) {
        this.networkJitter.shift();
      }
    }
    this.lastChunkTime = timestamp;
  }

  private adjustTargetLatency(): void {
    const avgJitter = this.calculateAverageJitter();

    // Adapt buffer size based on network conditions (200-400ms range)
    const oldLatency = this.targetLatency;
    if (avgJitter > 50) {
      this.targetLatency = Math.min(this.targetLatency + 10, this.maxLatency);
    } else if (avgJitter < 20 && this.targetLatency > this.minLatency) {
      this.targetLatency = Math.max(this.targetLatency - 5, this.minLatency);
    }
    
    if (oldLatency !== this.targetLatency) {
      console.log(`[JitterBuffer] Target latency adjusted: ${oldLatency}ms → ${this.targetLatency}ms (jitter: ${avgJitter.toFixed(1)}ms)`);
    }
  }

  private calculateAverageJitter(): number {
    if (this.networkJitter.length === 0) return 0;
    return this.networkJitter.reduce((a, b) => a + b, 0) / this.networkJitter.length;
  }

  private getBufferedDuration(): number {
    // Calculate duration in ms based on sample rate
    const totalSamples = Array.from(this.buffer.values())
      .reduce((sum, chunk) => sum + chunk.data.length, 0);
    
    // PCM16 at 24kHz
    return (totalSamples / 24000) * 1000;
  }

  private schedulePlayback(): void {
    if (this.isPlaying || this.accumulatedPCM.length === 0) return;

    this.isPlaying = true;

    // Combine accumulated PCM chunks into a single larger buffer
    const totalLength = this.accumulatedPCM.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedPCM = new Int16Array(totalLength);
    let offset = 0;
    
    for (const chunk of this.accumulatedPCM) {
      combinedPCM.set(chunk, offset);
      offset += chunk.length;
    }

    // Clear accumulated chunks
    this.accumulatedPCM = [];

    const audioBuffer = this.audioContext.createBuffer(1, combinedPCM.length, 24000);
    const channelData = audioBuffer.getChannelData(0);

    // CRITICAL: Convert PCM16 to Float32
    for (let i = 0; i < combinedPCM.length; i++) {
      channelData[i] = combinedPCM[i] / 32768.0;
    }

    // Apply subtle fade-in/fade-out to eliminate clicks
    const fadeLength = Math.min(240, combinedPCM.length / 10); // 10ms fade at 24kHz
    for (let i = 0; i < fadeLength; i++) {
      const fadeIn = i / fadeLength;
      channelData[i] *= fadeIn;
      const fadeOut = (fadeLength - i) / fadeLength;
      channelData[channelData.length - 1 - i] *= fadeOut;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    source.onended = () => {
      this.isPlaying = false;
      // Clear old chunks from buffer
      const currentSeq = this.playbackPosition;
      for (const [seq] of this.buffer) {
        if (seq <= currentSeq) {
          this.buffer.delete(seq);
        }
      }
      this.playbackPosition = this.nextSequence;
      
      // Continue if more data available
      if (this.buffer.size > 0 || this.accumulatedPCM.length > 0) {
        this.schedulePlayback();
      }
    };

    source.start(0);
  }

  private playSilence(): void {
    const silenceBuffer = this.audioContext.createBuffer(1, 2400, 24000);
    const source = this.audioContext.createBufferSource();
    source.buffer = silenceBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  private pcm16ToAudioBuffer(pcm16Data: Int16Array): AudioBuffer {
    const audioBuffer = this.audioContext.createBuffer(
      1, // mono
      pcm16Data.length,
      24000 // 24kHz sample rate
    );

    const channelData = audioBuffer.getChannelData(0);
    
    // Convert Int16 to Float32
    for (let i = 0; i < pcm16Data.length; i++) {
      channelData[i] = pcm16Data[i] / 32768.0;
    }

    return audioBuffer;
  }

  getTargetLatency(): number {
    return this.targetLatency;
  }

  onUnderrun(callback: () => void): void {
    this.onUnderrunCallback = callback;
  }

  clear(): void {
    this.buffer.clear();
    this.accumulatedPCM = [];
    this.playbackPosition = 0;
    this.isPlaying = false;
    this.networkJitter = [];
    this.lastChunkTime = 0;
  }

  getBufferSize(): number {
    return this.buffer.size;
  }
}
