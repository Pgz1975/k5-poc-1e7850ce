# OpenAI Realtime Voice API - Quick Reference Card

## 🚀 One-Page Implementation Guide for K5 POC

---

## Model & Pricing

**Model:** `gpt-realtime-preview-2024-10-01`
**Status:** Production-ready (launched Aug 2025)

| Type | Input | Output |
|------|--------|--------|
| Audio | $32/1M tokens | $64/1M tokens |
| Cached Audio | $20/1M tokens | - |

**K5 Cost:** $0.17/student/month = $311K/year (551 schools)
**vs Traditional:** Saves $139K/year (31% reduction)

---

## Audio Specifications

| Parameter | Value |
|-----------|-------|
| **Format** | PCM16 (16-bit linear) |
| **Sample Rate** | 24,000 Hz |
| **Channels** | Mono (1 channel) |
| **Byte Order** | Little-endian |
| **Chunk Size** | 4800 samples (200ms) |
| **Encoding** | Base64 for transmission |

---

## WebSocket Connection

```typescript
// Connection URL
wss://api.openai.com/v1/realtime?model=gpt-realtime-preview-2024-10-01

// Headers (WebSocket subprotocols)
[
  'realtime',
  'openai-insecure-api-key.{YOUR_API_KEY}',
  'openai-beta.realtime-v1'
]
```

---

## Session Configuration

```json
{
  "type": "session.update",
  "session": {
    "modalities": ["text", "audio"],
    "instructions": "You are Coquí, a bilingual K-5 reading assistant...",
    "voice": "alloy",
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 500
    },
    "input_audio_transcription": {
      "model": "whisper-1"
    }
  }
}
```

---

## Key Event Types

### Client → Server

| Event | Purpose |
|-------|---------|
| `input_audio_buffer.append` | Send audio chunk |
| `conversation.item.create` | Add user message |
| `response.create` | Request AI response |

### Server → Client

| Event | Purpose |
|-------|---------|
| `response.audio.delta` | Audio chunk from AI |
| `conversation.item.audio_transcription.completed` | User speech transcribed |
| `response.done` | Response complete |
| `error` | Error occurred |

---

## Supabase Edge Function (Minimal)

```typescript
import { WebSocketServer } from "npm:ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (clientWS) => {
  const openaiWS = new WebSocket(
    'wss://api.openai.com/v1/realtime?model=gpt-realtime-preview-2024-10-01',
    ['realtime', `openai-insecure-api-key.${OPENAI_API_KEY}`, 'openai-beta.realtime-v1']
  );

  // Relay: OpenAI → Client
  openaiWS.addEventListener('message', (e) => clientWS.send(e.data));

  // Relay: Client → OpenAI
  clientWS.on('message', (data) => openaiWS.send(data.toString()));
});
```

**Deploy:**
```bash
supabase functions deploy realtime-voice-relay --no-verify-jwt
supabase secrets set OPENAI_API_KEY=sk-...
```

---

## React Client (Minimal)

```typescript
const ws = new WebSocket(`wss://your-project.supabase.co/functions/v1/realtime-voice-relay?jwt=${token}`);

// Send audio
const sendAudio = (pcm16Data: Int16Array) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16Data.buffer)));
  ws.send(JSON.stringify({
    type: 'input_audio_buffer.append',
    audio: base64
  }));
};

// Receive audio
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'response.audio.delta') {
    playAudio(msg.delta); // base64 PCM16
  }
};
```

---

## Audio Worklet (PCM16 Conversion)

```javascript
// audio-processor.js
class PCM16Processor extends AudioWorkletProcessor {
  process(inputs) {
    const samples = inputs[0][0]; // Float32Array [-1, 1]
    const pcm16 = new Int16Array(samples.length);

    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    this.port.postMessage(pcm16);
    return true;
  }
}
registerProcessor('pcm16-processor', PCM16Processor);
```

---

## Latency Optimization

| Target | Value |
|--------|-------|
| **Total Voice-to-Voice** | <800ms |
| **OpenAI Processing** | ~500ms (US) |
| **Audio + Network** | <300ms budget |

**Techniques:**
- 200ms audio chunks (4800 samples @ 24kHz)
- Server-side VAD for turn detection
- WebSocket keep-alive
- Edge deployment (Supabase global CDN)

---

## Cost Tracking Query

```sql
SELECT
  school_id,
  COUNT(*) as sessions,
  SUM(duration_ms) / 60000 as total_minutes,
  SUM(audio_input_tokens) as input_tokens,
  SUM(audio_output_tokens) as output_tokens,
  SUM(total_cost) as total_cost
FROM voice_sessions
WHERE started_at >= CURRENT_DATE
GROUP BY school_id;
```

---

## Bilingual Instructions Template

```
You are Coquí, a friendly bilingual reading assistant for K-5 students in Puerto Rico.

LANGUAGE RULES:
- When student speaks Spanish, respond in Spanish
- When student speaks English, respond in English
- Maintain same language unless asked to switch
- Preserve emotion and tone across languages

FEEDBACK STYLE:
- Kindergarten: Very simple, lots of encouragement
- Grades 1-2: Gentle corrections, celebrate effort
- Grades 3-5: Specific tips, build confidence

PRONUNCIATION FEEDBACK:
1. Praise the attempt
2. Model correct pronunciation
3. Encourage retry
4. Make it fun and engaging
```

---

## Environment Variables

```bash
# Client (.env)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_SUPABASE_REALTIME_RELAY_URL=https://xxx.supabase.co/functions/v1/realtime-voice-relay

# Server (Supabase secrets)
OPENAI_API_KEY=sk-proj-xxx
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **No audio input** | Check microphone permissions |
| **High latency** | Reduce chunk size, check network |
| **Connection drops** | Implement reconnection logic |
| **Wrong language** | Explicit instructions in prompts |
| **Budget exceeded** | Check daily cost limits |

---

## Testing Checklist

- [ ] WebSocket connects successfully
- [ ] Audio streams both directions
- [ ] Transcription appears
- [ ] Latency <800ms
- [ ] Bilingual switching works
- [ ] VAD detects speech end
- [ ] Interruptions handled
- [ ] Costs tracked accurately

---

## Useful Commands

```bash
# Test WebSocket locally
supabase functions serve realtime-voice-relay

# Check logs
supabase functions logs realtime-voice-relay

# Monitor costs
psql -c "SELECT SUM(total_cost) FROM voice_sessions WHERE started_at >= CURRENT_DATE"

# Test audio format
ffmpeg -i input.wav -ar 24000 -ac 1 -f s16le output.pcm
```

---

## Links

**OpenAI Docs:** https://platform.openai.com/docs/guides/realtime
**Supabase WebSocket:** https://supabase.com/docs/guides/functions/websockets
**Full Implementation:** `/docs/plan/K5-REALTIME-VOICE-IMPLEMENTATION.md`

---

**Last Updated:** October 2025
**K5 POC Status:** Ready for implementation
