/**
 * Voice Monitoring Hook
 * Tracks performance metrics and errors for voice sessions
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VoiceMetrics {
  sessionId: string;
  studentId: string;
  implementationType: 'websocket' | 'webrtc';
  language: string;
  activityId?: string;
  activityType?: string;
  connectionStartMs: number;
  connectionEstablishedMs?: number;
  audioChunksSent: number;
  audioChunksReceived: number;
  bufferUnderruns: number;
  reconnectionAttempts: number;
  latencies: number[];
}

export interface VoiceError {
  sessionId: string;
  studentId: string;
  implementationType: 'websocket' | 'webrtc';
  errorType: string;
  errorCode?: string;
  errorMessage: string;
  stackTrace?: string;
  isRetryable: boolean;
  activityId?: string;
  activityType?: string;
  language?: string;
}

export const useVoiceMonitoring = (
  sessionId: string,
  studentId: string,
  implementationType: 'websocket' | 'webrtc',
  language: string,
  activityId?: string,
  activityType?: string
) => {
  const metricsRef = useRef<VoiceMetrics>({
    sessionId,
    studentId,
    implementationType,
    language,
    activityId,
    activityType,
    connectionStartMs: Date.now(),
    audioChunksSent: 0,
    audioChunksReceived: 0,
    bufferUnderruns: 0,
    reconnectionAttempts: 0,
    latencies: [],
  });

  const recordConnectionEstablished = () => {
    metricsRef.current.connectionEstablishedMs = Date.now();
  };

  const recordAudioChunkSent = () => {
    metricsRef.current.audioChunksSent++;
  };

  const recordAudioChunkReceived = () => {
    metricsRef.current.audioChunksReceived++;
  };

  const recordBufferUnderrun = () => {
    metricsRef.current.bufferUnderruns++;
  };

  const recordReconnection = () => {
    metricsRef.current.reconnectionAttempts++;
  };

  const recordLatency = (latencyMs: number) => {
    metricsRef.current.latencies.push(latencyMs);
  };

  const recordError = async (error: Omit<VoiceError, 'sessionId' | 'studentId' | 'implementationType'>) => {
    try {
      await supabase.from('voice_session_errors').insert({
        session_id: sessionId,
        student_id: studentId,
        implementation_type: implementationType,
        error_type: error.errorType,
        error_code: error.errorCode,
        error_message: error.errorMessage,
        stack_trace: error.stackTrace,
        is_retryable: error.isRetryable,
        activity_id: activityId,
        activity_type: activityType,
        language,
      });
    } catch (err) {
      console.error('[VoiceMonitoring] Failed to log error:', err);
    }
  };

  const endSession = async (success: boolean) => {
    const metrics = metricsRef.current;
    const now = Date.now();
    const connectionDuration = metrics.connectionEstablishedMs
      ? now - metrics.connectionEstablishedMs
      : 0;

    // Calculate percentile latencies
    const sortedLatencies = [...metrics.latencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedLatencies.length * 0.95);
    const p99Index = Math.floor(sortedLatencies.length * 0.99);

    const avgLatency = metrics.latencies.length > 0
      ? metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length
      : null;

    try {
      await supabase.from('voice_session_metrics').insert({
        student_id: studentId,
        session_id: sessionId,
        implementation_type: implementationType,
        language,
        activity_id: activityId,
        activity_type: activityType,
        connection_start_ms: metrics.connectionStartMs,
        connection_established_ms: metrics.connectionEstablishedMs,
        connection_duration_ms: connectionDuration,
        connection_success: success,
        avg_latency_ms: avgLatency,
        p95_latency_ms: sortedLatencies[p95Index] || null,
        p99_latency_ms: sortedLatencies[p99Index] || null,
        buffer_underruns: metrics.bufferUnderruns,
        reconnection_attempts: metrics.reconnectionAttempts,
        audio_chunks_sent: metrics.audioChunksSent,
        audio_chunks_received: metrics.audioChunksReceived,
        session_ended_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[VoiceMonitoring] Failed to save session metrics:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't automatically end session on unmount, let component control this
    };
  }, []);

  return {
    recordConnectionEstablished,
    recordAudioChunkSent,
    recordAudioChunkReceived,
    recordBufferUnderrun,
    recordReconnection,
    recordLatency,
    recordError,
    endSession,
  };
};
