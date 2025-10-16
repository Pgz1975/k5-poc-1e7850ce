# OpenAI Realtime API - WebRTC Integration Guide

## Why WebRTC?

WebRTC provides:
- **Lowest latency** for browser-based voice applications
- **Direct peer connection** between browser and OpenAI
- **Built-in audio handling** (encoding, decoding, echo cancellation)
- **Secure transport** with DTLS encryption

## WebRTC Flow Diagram

```
┌──────────────┐
│   Browser    │
│   Client     │
└──────┬───────┘
       │
       │ 1. Request token
       ▼
┌──────────────┐
│   Backend    │
│ Edge Function│
└──────┬───────┘
       │
       │ 2. Return ephemeral token
       ▼
┌──────────────┐
│   Browser    │
│   Client     │
└──────┬───────┘
       │
       │ 3. Create RTCPeerConnection
       │ 4. Add audio track
       │ 5. Create offer (SDP)
       ▼
┌──────────────┐
│  OpenAI API  │
│   /v1/       │
│ realtime/    │
│   calls      │
└──────┬───────┘
       │
       │ 6. Return answer (SDP)
       ▼
┌──────────────┐
│   Browser    │
│   Establish  │
│  Connection  │
└──────────────┘
```

## Complete Implementation

### File: `src/utils/realtime/RealtimeClient.ts`

```typescript
import { AudioRecorder, encodeAudioForAPI } from './AudioRecorder';

export interface RealtimeClientConfig {
  token: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSpeakingChange?: (speaking: boolean) => void;
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
}

export class RealtimeClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private config: RealtimeClientConfig;

  constructor(config: RealtimeClientConfig) {
    this.config = config;
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async connect() {
    try {
      console.log('Starting WebRTC connection...');

      // Create RTCPeerConnection
      this.pc = new RTCPeerConnection();

      // Set up remote audio playback
      this.pc.ontrack = (event) => {
        console.log('Received remote audio track');
        this.audioEl.srcObject = event.streams[0];
      };

      // Add local audio track from microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      stream.getTracks().forEach(track => {
        this.pc!.addTrack(track, stream);
      });

      // Set up data channel for control messages
      this.dc = this.pc.createDataChannel("oai-events");
      this.setupDataChannel();

      // Create and set local description (offer)
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Send offer to OpenAI and get answer
      const baseUrl = "https://api.openai.com/v1/realtime/calls";
      const sdpResponse = await fetch(baseUrl, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect: ${sdpResponse.status}`);
      }

      const sdp = await sdpResponse.text();
      const answer = { type: "answer" as RTCSdpType, sdp };
      await this.pc.setRemoteDescription(answer);

      console.log('WebRTC connection established');
      this.config.onConnected?.();

    } catch (error) {
      console.error('Connection error:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private setupDataChannel() {
    if (!this.dc) return;

    this.dc.onopen = () => {
      console.log('Data channel opened');
      
      // Send initial session configuration
      this.sendEvent({
        type: 'session.update',
        session: {
          type: 'realtime',
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          input_audio_transcription: {
            model: 'whisper-1'
          }
        }
      });
    };

    this.dc.onclose = () => {
      console.log('Data channel closed');
      this.config.onDisconnected?.();
    };

    this.dc.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleServerEvent(message);
      } catch (error) {
        console.error('Error parsing server event:', error);
      }
    };

    this.dc.onerror = (error) => {
      console.error('Data channel error:', error);
      this.config.onError?.(new Error('Data channel error'));
    };
  }

  private handleServerEvent(event: any) {
    console.log('Server event:', event.type);

    switch (event.type) {
      case 'session.created':
      case 'session.updated':
        console.log('Session ready');
        break;

      case 'response.output_audio.delta':
        // Audio is played automatically through WebRTC
        this.config.onSpeakingChange?.(true);
        break;

      case 'response.output_audio.done':
        this.config.onSpeakingChange?.(false);
        break;

      case 'response.output_audio_transcript.delta':
        this.config.onTranscript?.(event.delta);
        break;

      case 'response.output_text.delta':
        this.config.onTranscript?.(event.delta);
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.config.onTranscript?.(`\nYou: ${event.transcript}\n`);
        break;

      case 'error':
        console.error('Server error:', event.error);
        this.config.onError?.(new Error(event.error.message));
        break;

      default:
        // Other events can be logged or ignored
        break;
    }
  }

  sendText(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    // Add text message to conversation
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    });

    // Trigger response
    this.sendEvent({ type: 'response.create' });
  }

  private sendEvent(event: any) {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('Cannot send event: data channel not ready');
      return;
    }

    try {
      this.dc.send(JSON.stringify(event));
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }

  disconnect() {
    this.recorder?.stop();
    this.dc?.close();
    this.pc?.close();
    
    this.recorder = null;
    this.dc = null;
    this.pc = null;
    
    this.config.onDisconnected?.();
  }
}
```

## Audio Playback Details

### Automatic Audio Handling

With WebRTC, audio playback is handled automatically:

1. OpenAI sends audio through the RTC audio track
2. Browser's WebRTC stack handles decoding
3. Audio plays through `<audio>` element with `autoplay`

**No manual audio decoding required!** This is a major advantage over WebSocket.

### Volume Control (Optional)

```typescript
// In RealtimeClient constructor
this.audioEl.volume = 0.8; // 80% volume

// Method to adjust volume
setVolume(level: number) {
  this.audioEl.volume = Math.max(0, Math.min(1, level));
}
```

## Event Types Reference

### Client → Server Events

| Event Type | Purpose | When to Send |
|------------|---------|--------------|
| `session.update` | Configure session | After connection |
| `conversation.item.create` | Add user message | When user sends text |
| `response.create` | Request AI response | After adding message |
| `input_audio_buffer.append` | Send audio data | Continuous (streaming) |

### Server → Client Events

| Event Type | Meaning | Action |
|------------|---------|--------|
| `session.created` | Session ready | Start interaction |
| `response.output_audio.delta` | AI speaking | Show "Speaking" indicator |
| `response.output_audio.done` | AI finished | Hide "Speaking" indicator |
| `response.output_audio_transcript.delta` | AI speech text | Append to transcript |
| `conversation.item.input_audio_transcription.completed` | User speech transcribed | Show what user said |
| `error` | Something went wrong | Display error |

## Session Configuration

### Turn Detection (Voice Activity Detection)

```typescript
{
  type: 'session.update',
  session: {
    type: 'realtime',
    turn_detection: {
      type: 'server_vad',          // Let server detect speech
      threshold: 0.5,               // Sensitivity (0-1)
      prefix_padding_ms: 300,       // Include 300ms before speech
      silence_duration_ms: 1000     // Wait 1s of silence before turn ends
    }
  }
}
```

**Important**: With `server_vad`, you don't need to manually commit audio buffers. The server automatically detects when the user stops speaking.

### Audio Configuration

```typescript
{
  type: 'session.update',
  session: {
    type: 'realtime',
    audio: {
      input: {
        format: 'pcm16',    // 16-bit PCM
        sampleRate: 24000   // 24kHz
      },
      output: {
        format: 'pcm16',
        sampleRate: 24000,
        voice: 'nova'       // Choose voice
      }
    }
  }
}
```

### Transcription

```typescript
{
  type: 'session.update',
  session: {
    type: 'realtime',
    input_audio_transcription: {
      model: 'whisper-1'
    }
  }
}
```

This enables real-time transcription of user's speech.

## Common Issues & Solutions

### Issue: No audio playback

**Solution**: Ensure autoplay is enabled and user has interacted with page
```typescript
// In component
const handleConnect = async () => {
  // This user interaction enables autoplay
  await realtimeClient.connect();
};
```

### Issue: Connection fails

**Solution**: Check token is valid and not expired
```typescript
// Tokens expire after ~60 seconds
// Request new token if connection takes too long
```

### Issue: Audio quality is poor

**Solution**: Check microphone settings and network quality
```typescript
{
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
}
```

### Issue: Delayed responses

**Solution**: WebRTC should be low-latency. If delayed:
- Check network connection
- Verify server_vad settings
- Ensure no other processes blocking

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ⚠️ Mobile browsers (may have limitations)

### Feature Detection

```typescript
if (!('RTCPeerConnection' in window)) {
  throw new Error('WebRTC not supported in this browser');
}

if (!navigator.mediaDevices?.getUserMedia) {
  throw new Error('Microphone access not supported');
}
```

## Performance Optimization

1. **Reuse connections**: Don't disconnect/reconnect frequently
2. **Handle cleanup**: Always call `disconnect()` when done
3. **Monitor bandwidth**: WebRTC adapts quality automatically
4. **Error recovery**: Implement reconnection logic

## Next Steps

1. Implement the RealtimeClient class
2. Test connection flow
3. Add error handling
4. Integrate with UI component
5. Test audio quality and latency
