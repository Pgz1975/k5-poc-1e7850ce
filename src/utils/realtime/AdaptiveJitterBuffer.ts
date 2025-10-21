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
  private targetLatency = 150; // ms (dynamic)
  private readonly minLatency = 100;
  private readonly maxLatency = 300;
  private networkJitter: number[] = [];
  private audioContext: AudioContext;
  private onUnderrunCallback?: () => void;
  private isPlaying = false;
  private lastChunkTime = 0;
  private nextSequence = 0;

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
    this.updateJitterEstimate(timestamp);
    this.adjustTargetLatency();

    // Trigger playback if we have enough buffered
    if (this.getBufferedDuration() >= this.targetLatency && !this.isPlaying) {
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

    // Adapt buffer size based on network conditions
    if (avgJitter > 50) {
      this.targetLatency = Math.min(this.targetLatency + 10, this.maxLatency);
    } else if (avgJitter < 20 && this.targetLatency > this.minLatency) {
      this.targetLatency = Math.max(this.targetLatency - 5, this.minLatency);
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
    this.isPlaying = true;
    this.playNext();
  }

  private playNext(): void {
    const chunk = this.buffer.get(this.playbackPosition);

    if (!chunk) {
      // Buffer underrun
      this.isPlaying = false;
      this.onUnderrunCallback?.();
      return;
    }

    const audioBuffer = this.pcm16ToAudioBuffer(chunk.data);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    // Schedule precisely with minimal lookahead
    const currentTime = this.audioContext.currentTime;
    source.start(currentTime + 0.001); // 1ms lookahead

    // Clean up and schedule next
    source.onended = () => {
      this.buffer.delete(this.playbackPosition);
      this.playbackPosition++;
      
      if (this.buffer.size > 0) {
        this.playNext();
      } else {
        this.isPlaying = false;
      }
    };
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
    this.playbackPosition = 0;
    this.isPlaying = false;
    this.networkJitter = [];
    this.lastChunkTime = 0;
  }

  getBufferSize(): number {
    return this.buffer.size;
  }
}
