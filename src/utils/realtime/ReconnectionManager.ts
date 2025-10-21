/**
 * Fast Reconnection Manager for Realtime Voice
 * Uses aggressive reconnection schedule instead of exponential backoff
 */

import { ConnectionStateMachine } from './ConnectionStateMachine';

export class ReconnectionManager {
  private attempts = 0;
  private reconnectTimer: number | null = null;
  private maxAttempts = 10;

  // Fast reconnection schedule (not exponential backoff)
  private readonly schedule = [
    500,   // Attempt 1: 0.5s
    1000,  // Attempt 2: 1s
    2000,  // Attempt 3: 2s
    3000,  // Attempt 4: 3s
    5000,  // Attempt 5+: 5s (stable)
  ];

  async attemptReconnection(
    connectFn: () => Promise<void>,
    stateMachine: ConnectionStateMachine
  ): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.attempts >= this.maxAttempts) {
      console.error('[ReconnectionManager] Max reconnection attempts reached');
      stateMachine.transition('error');
      return;
    }

    const delay = this.schedule[Math.min(this.attempts, this.schedule.length - 1)];

    console.log(`[ReconnectionManager] Attempt ${this.attempts + 1}/${this.maxAttempts} in ${delay}ms`);

    this.reconnectTimer = window.setTimeout(async () => {
      this.attempts++;
      stateMachine.transition('connecting');

      try {
        await connectFn();
        console.log('[ReconnectionManager] Reconnection successful');
        this.reset(); // Success - reset attempts
      } catch (error) {
        console.error('[ReconnectionManager] Reconnection failed:', error);

        if (this.attempts < this.maxAttempts) {
          // Try again
          await this.attemptReconnection(connectFn, stateMachine);
        } else {
          // Give up
          stateMachine.transition('error');
        }
      }
    }, delay);
  }

  reset(): void {
    this.attempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  cancel(): void {
    this.reset();
  }

  getAttempts(): number {
    return this.attempts;
  }
}
