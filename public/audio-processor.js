/**
 * Optimized AudioWorklet Processor for Real-time Voice
 * Buffer size reduced from 2048 to 1024 for 43ms latency improvement
 */

class PCM16CaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Reduced buffer size for lower latency
    this.bufferSize = 1024;
    this.buffer = new Int16Array(this.bufferSize);
    this.bufferIndex = 0;
    
    console.log('[AudioProcessor] Initialized with buffer size:', this.bufferSize);
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (!input || !input[0]) {
      return true; // Keep processor alive
    }

    const inputChannel = input[0];

    for (let i = 0; i < inputChannel.length; i++) {
      // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
      const sample = Math.max(-1, Math.min(1, inputChannel[i]));
      const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      
      this.buffer[this.bufferIndex++] = int16Sample;

      // Send immediately when buffer is full
      if (this.bufferIndex >= this.bufferSize) {
        // Create a copy for transfer
        const dataToSend = this.buffer.slice(0, this.bufferIndex);
        
        this.port.postMessage({
          type: 'audio',
          data: dataToSend,
          timestamp: currentTime
        });

        // Reset buffer
        this.bufferIndex = 0;
      }
    }

    return true; // Keep processor alive
  }
}

registerProcessor('pcm16-capture-processor', PCM16CaptureProcessor);
console.log('[AudioProcessor] Registered pcm16-capture-processor');
