# 🚀 Voice System Implementation Summary for Lovable
## Quick Reference Guide - Fix Choppy Audio NOW

**Model**: `gpt-realtime-2025-08-28` ✅ (Latest Production - October 2025)
**Time Required**: 3-4 hours
**Priority**: URGENT - Production Issue

---

## 🔴 THE MAIN PROBLEM

**Your `AdaptiveJitterBuffer` doesn't actually play audio!** It schedules but never creates proper audio nodes or connects to speakers. This causes choppy/no audio.

---

## ✅ Critical Fixes Required (In Order)

### 1️⃣ **FIX JITTER BUFFER** (30 min) - `src/utils/realtime/AdaptiveJitterBuffer.ts`
```typescript
// BROKEN (Current):
private schedulePlayback(): void {
  // Creates buffer but NEVER PLAYS IT!
}

// FIXED (Replace with):
private schedulePlayback(): void {
  if (this.isPlaying) return;

  const chunk = this.buffer.get(this.playbackPosition);
  if (!chunk) {
    this.playSilence();
    return;
  }

  this.isPlaying = true;
  const audioBuffer = this.audioContext.createBuffer(1, chunk.data.length, 24000);
  const channelData = audioBuffer.getChannelData(0);

  // CRITICAL: Convert PCM16 to Float32
  for (let i = 0; i < chunk.data.length; i++) {
    channelData[i] = chunk.data[i] / 32768.0;
  }

  const source = this.audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(this.audioContext.destination);

  source.onended = () => {
    this.isPlaying = false;
    this.playbackPosition++;
    this.buffer.delete(this.playbackPosition - 1);
    if (this.buffer.size > 0) this.schedulePlayback();
  };

  source.start(0);
}

// ADD this missing method:
private playSilence(): void {
  const silenceBuffer = this.audioContext.createBuffer(1, 2400, 24000);
  const source = this.audioContext.createBufferSource();
  source.buffer = silenceBuffer;
  source.connect(this.audioContext.destination);
  source.start(0);
}

// ADD this property:
private isPlaying = false;
```

### 2️⃣ **UPDATE CHUNK SIZE** (10 min) - `src/utils/realtime/RealtimeVoiceClientEnhanced.ts`
```typescript
// Line 79 - CHANGE:
this.bufferSize = 1024;  // ❌ OLD (43ms chunks)
// TO:
this.bufferSize = 2400;  // ✅ NEW (100ms chunks)

// Also update in the processorCode string:
const processorCode = `
  class PCM16CaptureProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.bufferSize = 2400; // CHANGE FROM 1024
      // ... rest of code
    }
  }
`;
```

### 3️⃣ **USE LATEST MODEL** (20 min) - `supabase/functions/realtime-voice-relay/index.ts`
```typescript
// Line 299 - REPLACE ENTIRE WebSocket connection:
const latestModel = 'gpt-realtime-2025-08-28'; // NOT preview version!

session.openaiWS = new WebSocket(
  `wss://api.openai.com/v1/realtime?model=${latestModel}`,
  {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1'
    }
  }
);
```

### 4️⃣ **ADD INTERRUPT HANDLING** (15 min) - `src/utils/realtime/RealtimeVoiceClientEnhanced.ts`
```typescript
// In handleWebSocketMessage, ADD these cases:
case 'input_audio_buffer.speech_started':
  console.log('[Voice] User speaking - clearing buffers');
  this.jitterBuffer?.clear();
  this.audioContext?.suspend();
  break;

case 'response.cancel':
case 'response.cancelled':
case 'response.interrupted':
  console.log('[Voice] Response interrupted');
  this.jitterBuffer?.clear();
  this.audioContext?.resume();
  break;
```

### 5️⃣ **ADD VAD CONFIG** (10 min) - `supabase/functions/realtime-voice-relay/index.ts`
```typescript
// In handleSessionCreated function, ADD turn_detection:
const sessionConfig = {
  type: 'session.update',
  session: {
    instructions: fullInstructions,
    voice: session.language === 'es-PR' ? 'alloy' : 'nova',
    input_audio_format: 'pcm16',
    output_audio_format: 'pcm16',

    // ADD THIS:
    turn_detection: {
      type: 'server_vad',
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 500,
      create_response: true
    },

    input_audio_transcription: {
      enabled: true,
      language: session.language === 'es-PR' ? 'es' : 'en',
      model: 'whisper-1'
    },
    temperature: 0.8,
    max_response_output_tokens: 4096
  }
};
```

---

## 📄 Voice Test Page Implementation

### Complete `/src/pages/voice-test.tsx`:
```typescript
import { useState } from 'react';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

export default function VoiceTestPage() {
  const [language, setLanguage] = useState<'en' | 'es-PR'>('en');
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [metrics, setMetrics] = useState({
    latency: 0,
    bufferSize: 0,
    underruns: 0,
    health: 100
  });

  const { connect, disconnect, isConnecting, error } = useRealtimeVoice({
    studentId: 'test-user',
    language,
    model: 'gpt-realtime-2025-08-28', // LATEST MODEL
    voiceGuidance: 'Test mode - respond naturally',
    onTranscription: setTranscription,
    onConnectionChange: setIsConnected,
    onMetricsUpdate: setMetrics
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="card">
        <h1>🎤 Voice System Test - Model: gpt-realtime-2025-08-28</h1>
        <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '✅ Connected' : '⭕ Disconnected'}
        </div>
      </div>

      <div className="controls">
        <button onClick={connect} disabled={isConnected || isConnecting}>
          {isConnecting ? 'Connecting...' : 'Start Voice Session'}
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          Stop Session
        </button>

        <div className="language-toggle">
          <button onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'active' : ''}>
            🇺🇸 English
          </button>
          <button onClick={() => setLanguage('es-PR')}
                  className={language === 'es-PR' ? 'active' : ''}>
            🇵🇷 Spanish (PR)
          </button>
        </div>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      <div className="transcription">
        <h3>Live Transcription:</h3>
        <p>{transcription || 'Waiting for speech...'}</p>
      </div>

      <div className="metrics">
        <h3>Performance Metrics:</h3>
        <div className="metric-grid">
          <div className={`metric ${metrics.latency < 300 ? 'good' : 'warning'}`}>
            <label>Latency</label>
            <value>{metrics.latency}ms</value>
          </div>
          <div className={`metric ${metrics.bufferSize >= 3 ? 'good' : 'warning'}`}>
            <label>Buffer</label>
            <value>{metrics.bufferSize}</value>
          </div>
          <div className={`metric ${metrics.underruns === 0 ? 'good' : 'error'}`}>
            <label>Underruns</label>
            <value>{metrics.underruns}</value>
          </div>
          <div className={`metric ${metrics.health > 80 ? 'good' : 'warning'}`}>
            <label>Health</label>
            <value>{metrics.health}%</value>
          </div>
        </div>
      </div>

      <div className="test-scenarios">
        <h3>Quick Tests:</h3>
        <ul>
          <li>✅ Say "Hello" - Should respond in <300ms</li>
          <li>✅ Interrupt AI mid-sentence - Should stop immediately</li>
          <li>✅ Stay silent 10 seconds - No glitches</li>
          <li>✅ 2-minute conversation - No degradation</li>
        </ul>
      </div>
    </div>
  );
}
```

### Add CSS for Voice Test Page:
```css
/* Add to your global CSS or component styles */
.status.connected { color: green; font-weight: bold; }
.status.disconnected { color: gray; }
.metric.good { border-color: green; }
.metric.warning { border-color: orange; }
.metric.error { border-color: red; }
.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.language-toggle button.active { background: #3b82f6; color: white; }
```

---

## 🧪 Quick Test Procedure

1. **Navigate to `/voice-test`**
2. **Click "Start Voice Session"**
3. **Say "Hello"** → Should respond in <300ms
4. **Check metrics** → All should be green
5. **Interrupt test** → Let AI speak, then interrupt
6. **Long test** → 2-minute conversation

---

## 📊 Success Criteria

| Check | Target | How to Verify |
|-------|--------|--------------|
| ✅ Model | `gpt-realtime-2025-08-28` | Network tab shows model |
| ✅ Chunk Size | 2400 samples | Console: `bufferSize: 2400` |
| ✅ Audio Plays | Continuous | Hear smooth audio |
| ✅ Latency | <300ms | Metrics show <300 |
| ✅ No Chops | 0% | Audio is smooth |
| ✅ Interrupts | Clean | No overlap when interrupting |

---

## 🚨 Common Issues & Solutions

### "No Audio"
- Check: Is `schedulePlayback` actually playing?
- Fix: Ensure `source.start(0)` is called

### "Still Choppy"
- Check: Buffer size is 2400, not 1024
- Fix: Update both places (line 79 and processorCode)

### "Wrong Model"
- Check: Network tab for model name
- Fix: Hard-code `gpt-realtime-2025-08-28` everywhere

### "High Latency"
- Check: Pre-buffering working?
- Fix: Ensure 3 chunks buffer before play

---

## 📁 Files to Modify Summary

1. **`src/utils/realtime/AdaptiveJitterBuffer.ts`** - Fix playback
2. **`src/utils/realtime/RealtimeVoiceClientEnhanced.ts`** - Chunk size & interrupts
3. **`supabase/functions/realtime-voice-relay/index.ts`** - Model & VAD
4. **`src/pages/voice-test.tsx`** - Test page (create new)
5. **`src/hooks/useRealtimeVoice.ts`** - Update model parameter

---

## 🎯 Implementation Time

- **Fixes**: 1.5 hours
- **Voice Test Page**: 1 hour
- **Testing**: 30 minutes
- **Total**: 3 hours

---

## ✅ Final Checklist for Lovable

Before marking complete:
- [ ] Jitter buffer actually plays audio (not just schedules)
- [ ] Chunk size is 2400 everywhere
- [ ] Model is `gpt-realtime-2025-08-28` (not preview)
- [ ] VAD turn_detection configured
- [ ] Interrupt handling clears buffers
- [ ] Voice test page works
- [ ] All metrics green
- [ ] 2-minute test passes
- [ ] No choppy audio!

---

**Ready to implement! This will fix your choppy audio issue completely.**

Model: `gpt-realtime-2025-08-28` ✅
Document: October 2025
Priority: URGENT