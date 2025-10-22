export class SimpleRealtimeClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private onMessageCallback: (msg: any) => void;

  constructor(onMessage: (msg: any) => void) {
    this.onMessageCallback = onMessage;
    this.audioEl = document.createElement('audio');
    this.audioEl.autoplay = true;
  }

  async connect(ephemeralToken: string) {
    console.log('[SimpleClient] 🚀 Starting WebRTC connection...');

    // Step 1: Create peer connection
    this.pc = new RTCPeerConnection();

    // Step 2: Handle remote audio (AI speaking)
    this.pc.ontrack = (e) => {
      console.log('[SimpleClient] 🔊 Remote audio track received');
      this.audioEl.srcObject = e.streams[0];
    };

    // Step 3: Add local microphone
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 24000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });
    this.pc.addTrack(stream.getTracks()[0]);
    console.log('[SimpleClient] 🎤 Local microphone added');

    // Step 4: Create data channel for events
    this.dc = this.pc.createDataChannel('oai-events');
    this.dc.addEventListener('message', (e) => {
      const event = JSON.parse(e.data);
      console.log('[SimpleClient] 📨 Event:', event.type);
      this.onMessageCallback(event);
    });

    // Step 5: Create SDP offer
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    console.log('[SimpleClient] 📝 SDP offer created');

    // Step 6: Send to OpenAI (official GA endpoint)
    const baseUrl = 'https://api.openai.com/v1/realtime';
    const model = 'gpt-realtime-2025-08-28';
    
    console.log('[SimpleClient] 🌐 Connecting to OpenAI Realtime API...');
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        'Authorization': `Bearer ${ephemeralToken}`,
        'Content-Type': 'application/sdp',
      },
    });

    if (!sdpResponse.ok) {
      const error = await sdpResponse.text();
      console.error('[SimpleClient] ❌ SDP exchange failed:', error);
      throw new Error(`SDP exchange failed: ${sdpResponse.status}`);
    }

    // Step 7: Set remote description
    const answerSdp = await sdpResponse.text();
    await this.pc.setRemoteDescription({
      type: 'answer',
      sdp: answerSdp,
    });

    console.log('[SimpleClient] ✅ WebRTC connection established! 🎉');
  }

  disconnect() {
    console.log('[SimpleClient] 🛑 Disconnecting...');
    this.dc?.close();
    this.pc?.close();
    this.pc = null;
    this.dc = null;
  }
}
