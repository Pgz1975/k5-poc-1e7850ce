class PCM16Processor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) {
      return true;
    }

    const samples = input[0]; // Float32Array [-1, 1]
    const pcm16 = new Int16Array(samples.length);

    // Convert Float32 to PCM16
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Send to main thread
    this.port.postMessage(pcm16);
    
    return true;
  }
}

registerProcessor('pcm16-processor', PCM16Processor);
