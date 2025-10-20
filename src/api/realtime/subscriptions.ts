/**
 * K5 Platform Real-time Subscriptions
 * WebSocket-based real-time updates using Supabase Realtime
 */

import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

export interface SubscriptionOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface ProcessingUpdate {
  documentId: string;
  status: string;
  progress: number;
  currentStep: string;
  error?: string;
}

export interface UploadNotification {
  documentId: string;
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ============================================================================
// Realtime Subscription Manager
// ============================================================================

export class RealtimeSubscriptionManager {
  private supabase: ReturnType<typeof createClient>;
  private channels: Map<string, RealtimeChannel>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.channels = new Map();
  }

  /**
   * Subscribe to processing progress updates
   */
  subscribeToProcessingProgress(
    documentId: string,
    callback: (update: ProcessingUpdate) => void,
    options?: SubscriptionOptions
  ): () => void {
    const channelName = `processing:${documentId}`;

    // Remove existing channel if any
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pdf_documents',
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          const data = payload.new as any;
          callback({
            documentId: data.id,
            status: data.processing_status,
            progress: data.processing_progress || 0,
            currentStep: this.getProcessingStep(data.processing_status),
            error: data.processing_error,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          options?.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          options?.onError?.(new Error('Channel subscription failed'));
        } else if (status === 'TIMED_OUT') {
          options?.onError?.(new Error('Channel subscription timed out'));
        } else if (status === 'CLOSED') {
          options?.onDisconnect?.();
        }
      });

    this.channels.set(channelName, channel);

    // Return unsubscribe function
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to new document uploads
   */
  subscribeToDocumentUploads(
    userId: string,
    callback: (notification: UploadNotification) => void,
    options?: SubscriptionOptions
  ): () => void {
    const channelName = `uploads:${userId}`;

    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pdf_documents',
          filter: `uploaded_by=eq.${userId}`,
        },
        (payload) => {
          const data = payload.new as any;
          callback({
            documentId: data.id,
            filename: data.filename,
            uploadedBy: data.uploaded_by,
            uploadedAt: data.uploaded_at,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          options?.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          options?.onError?.(new Error('Channel subscription failed'));
        } else if (status === 'CLOSED') {
          options?.onDisconnect?.();
        }
      });

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to assessment submissions
   */
  subscribeToAssessmentSubmissions(
    studentId: string,
    callback: (submission: any) => void,
    options?: SubscriptionOptions
  ): () => void {
    const channelName = `assessments:${studentId}`;

    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assessment_submissions',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          options?.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          options?.onError?.(new Error('Channel subscription failed'));
        } else if (status === 'CLOSED') {
          options?.onDisconnect?.();
        }
      });

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to voice reading sessions
   */
  subscribeToVoiceReadings(
    studentId: string,
    callback: (session: any) => void,
    options?: SubscriptionOptions
  ): () => void {
    const channelName = `voice:${studentId}`;

    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voice_reading_sessions',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          options?.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          options?.onError?.(new Error('Channel subscription failed'));
        } else if (status === 'CLOSED') {
          options?.onDisconnect?.();
        }
      });

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to broadcast channel for custom events
   */
  subscribeToBroadcast(
    channelName: string,
    eventName: string,
    callback: (payload: any) => void,
    options?: SubscriptionOptions
  ): () => void {
    const fullChannelName = `broadcast:${channelName}`;

    if (this.channels.has(fullChannelName)) {
      this.unsubscribe(fullChannelName);
    }

    const channel = this.supabase
      .channel(fullChannelName)
      .on('broadcast', { event: eventName }, (payload) => {
        callback(payload.payload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          options?.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          options?.onError?.(new Error('Channel subscription failed'));
        } else if (status === 'CLOSED') {
          options?.onDisconnect?.();
        }
      });

    this.channels.set(fullChannelName, channel);

    return () => this.unsubscribe(fullChannelName);
  }

  /**
   * Broadcast event to channel
   */
  async broadcast(
    channelName: string,
    eventName: string,
    payload: any
  ): Promise<void> {
    const fullChannelName = `broadcast:${channelName}`;
    let channel = this.channels.get(fullChannelName);

    if (!channel) {
      channel = this.supabase.channel(fullChannelName);
      await channel.subscribe();
      this.channels.set(fullChannelName, channel);
    }

    await channel.send({
      type: 'broadcast',
      event: eventName,
      payload,
    });
  }

  /**
   * Unsubscribe from channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel, name) => {
      this.supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  /**
   * Get active channel count
   */
  getActiveChannelCount(): number {
    return this.channels.size;
  }

  /**
   * Get processing step description
   */
  private getProcessingStep(status: string): string {
    const steps: Record<string, string> = {
      pending: 'Queued for processing',
      validating: 'Validating PDF file',
      processing: 'Extracting content',
      completed: 'Processing complete',
      failed: 'Processing failed',
    };
    return steps[status] || 'Unknown';
  }
}

// ============================================================================
// Export singleton instance factory
// ============================================================================

let realtimeManager: RealtimeSubscriptionManager | null = null;

export function getRealtimeManager(
  supabaseUrl?: string,
  supabaseKey?: string
): RealtimeSubscriptionManager {
  if (!realtimeManager) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials required to initialize realtime manager');
    }
    realtimeManager = new RealtimeSubscriptionManager(supabaseUrl, supabaseKey);
  }
  return realtimeManager;
}

// ============================================================================
// React Hook Example (for documentation)
// ============================================================================

/**
 * Example React hook for processing progress
 *
 * ```typescript
 * import { useEffect, useState } from 'react';
 * import { getRealtimeManager } from './subscriptions';
 *
 * export function useProcessingProgress(documentId: string) {
 *   const [progress, setProgress] = useState<ProcessingUpdate | null>(null);
 *
 *   useEffect(() => {
 *     const manager = getRealtimeManager(
 *       process.env.SUPABASE_URL,
 *       process.env.SUPABASE_KEY
 *     );
 *
 *     const unsubscribe = manager.subscribeToProcessingProgress(
 *       documentId,
 *       (update) => setProgress(update),
 *       {
 *         onConnect: () => console.log('Connected'),
 *         onError: (error) => console.error('Error:', error),
 *       }
 *     );
 *
 *     return unsubscribe;
 *   }, [documentId]);
 *
 *   return progress;
 * }
 * ```
 */
