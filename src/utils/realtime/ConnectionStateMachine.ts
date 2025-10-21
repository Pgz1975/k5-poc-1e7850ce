/**
 * Connection State Machine for Realtime Voice
 * Ensures valid state transitions and lifecycle management
 */

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'websocket_open'
  | 'session_created'
  | 'ready'
  | 'reconnecting'
  | 'error';

interface StateHistoryEntry {
  state: ConnectionState;
  timestamp: number;
}

export class ConnectionStateMachine {
  private state: ConnectionState = 'disconnected';
  private stateHistory: StateHistoryEntry[] = [];
  private listeners = new Map<ConnectionState, Set<() => void>>();

  transition(newState: ConnectionState): boolean {
    if (!this.isValidTransition(this.state, newState)) {
      console.error(`[StateMachine] Invalid transition: ${this.state} -> ${newState}`);
      return false;
    }

    const oldState = this.state;
    this.state = newState;

    this.stateHistory.push({
      state: newState,
      timestamp: performance.now()
    });

    // Keep only recent history
    if (this.stateHistory.length > 100) {
      this.stateHistory.shift();
    }

    console.log(`[StateMachine] ${oldState} -> ${newState}`);
    this.notifyListeners(newState);

    return true;
  }

  private isValidTransition(from: ConnectionState, to: ConnectionState): boolean {
    const validTransitions: Record<ConnectionState, ConnectionState[]> = {
      'disconnected': ['connecting'],
      'connecting': ['websocket_open', 'error', 'disconnected'],
      'websocket_open': ['session_created', 'error', 'disconnected'],
      'session_created': ['ready', 'error', 'disconnected'],
      'ready': ['error', 'disconnected', 'reconnecting'],
      'reconnecting': ['connecting', 'error', 'disconnected'],
      'error': ['disconnected', 'connecting']
    };

    return validTransitions[from]?.includes(to) ?? false;
  }

  onState(state: ConnectionState, callback: () => void): void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, new Set());
    }
    this.listeners.get(state)!.add(callback);
  }

  private notifyListeners(state: ConnectionState): void {
    this.listeners.get(state)?.forEach(cb => {
      try {
        cb();
      } catch (error) {
        console.error('[StateMachine] Listener error:', error);
      }
    });
  }

  getState(): ConnectionState {
    return this.state;
  }

  getStateDuration(): number {
    const lastEntry = this.stateHistory[this.stateHistory.length - 1];
    return lastEntry ? performance.now() - lastEntry.timestamp : 0;
  }

  isConnected(): boolean {
    return this.state === 'ready';
  }

  canSendMessages(): boolean {
    return this.state === 'ready';
  }

  reset(): void {
    this.state = 'disconnected';
    this.stateHistory = [];
  }

  getHistory(): StateHistoryEntry[] {
    return [...this.stateHistory];
  }
}
