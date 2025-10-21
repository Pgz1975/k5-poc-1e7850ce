/**
 * Heartbeat Manager for WebSocket Connection Health
 * Detects connection loss and triggers reconnection
 */

export class HeartbeatManager {
  private interval: number | null = null;
  private lastPong = 0;
  private missedPongs = 0;
  private readonly maxMissedPongs = 2;
  private readonly heartbeatInterval = 15000; // 15 seconds
  private readonly pongTimeout = 30000; // 30 seconds

  start(ws: WebSocket, onConnectionLost: () => void): void {
    this.stop(); // Clear any existing interval

    this.lastPong = Date.now();
    this.missedPongs = 0;

    console.log('[Heartbeat] Started');

    // Send ping every 15 seconds
    this.interval = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Check for missed pongs
        if (Date.now() - this.lastPong > this.pongTimeout) {
          this.missedPongs++;

          console.warn(`[Heartbeat] Missed pong (${this.missedPongs}/${this.maxMissedPongs})`);

          if (this.missedPongs >= this.maxMissedPongs) {
            console.error('[Heartbeat] Connection lost - no pong received');
            this.stop();
            onConnectionLost();
            return;
          }
        }

        // Send ping
        try {
          ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        } catch (error) {
          console.error('[Heartbeat] Failed to send ping:', error);
          this.stop();
          onConnectionLost();
        }
      } else {
        console.warn('[Heartbeat] WebSocket not open, stopping');
        this.stop();
        onConnectionLost();
      }
    }, this.heartbeatInterval);
  }

  handlePong(): void {
    this.lastPong = Date.now();
    this.missedPongs = 0;
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('[Heartbeat] Stopped');
    }
  }

  isActive(): boolean {
    return this.interval !== null;
  }
}
