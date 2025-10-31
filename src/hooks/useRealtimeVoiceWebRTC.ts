/**
 * React Hook for WebRTC Realtime Voice
 * Drop-in replacement for useRealtimeVoice with monitoring integration
 */

import { useState, useRef, useEffect } from 'react';
import { RealtimeVoiceClientWebRTC } from '@/utils/realtime/RealtimeVoiceClientWebRTC';
import { useVoiceMonitoring } from './useVoiceMonitoring';
import { useToast } from '@/hooks/use-toast';

export interface UseRealtimeVoiceWebRTCProps {
  studentId?: string;
  language?: string;
  activityId?: string;
  activityType?: string;
  persona?: 'demo-guide' | 'student-tutor';
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioLevel?: (dbLevel: number) => void;
  onResponseComplete?: () => void;
}

export const useRealtimeVoiceWebRTC = ({
  studentId = 'anonymous',
  language = 'es',
  activityId,
  activityType,
  persona = 'student-tutor',
  onTranscription,
  onAudioLevel,
  onResponseComplete,
}: UseRealtimeVoiceWebRTCProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ text: string; isUser: boolean }>>([]);
  
  const clientRef = useRef<RealtimeVoiceClientWebRTC | null>(null);
  const sessionIdRef = useRef(`webrtc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  // Initialize monitoring
  const monitoring = useVoiceMonitoring(
    sessionIdRef.current,
    studentId,
    'webrtc',
    language,
    activityId,
    activityType
  );

  const connect = async () => {
    if (isConnecting || isConnected) {
      console.warn('[useRealtimeVoiceWebRTC] Already connecting or connected');
      return;
    }

    setIsConnecting(true);

    try {
      const client = new RealtimeVoiceClientWebRTC({
        studentId,
        language,
        activityId,
        activityType,
        persona,
        onTranscription: (text, isUser) => {
          setTranscript(prev => [...prev, { text, isUser }]);
          onTranscription?.(text, isUser);
        },
        onAudioLevel,
        onAudioPlayback: (isPlaying) => {
          setIsAIPlaying(isPlaying);
          if (isPlaying) {
            monitoring.recordAudioChunkReceived();
          }
        },
        onConnectionChange: (connected) => {
          setIsConnected(connected);
          if (connected) {
            monitoring.recordConnectionEstablished();
            toast({
              title: language === 'es' ? '✅ Conectado' : '✅ Connected',
              description: language === 'es' 
                ? 'Tu tutor de voz está listo' 
                : 'Your voice tutor is ready',
            });
          }
        },
        onError: async (error) => {
          console.error('[useRealtimeVoiceWebRTC] Error:', error);
          
          await monitoring.recordError({
            errorType: 'connection',
            errorMessage: error.message,
            stackTrace: error.stack,
            isRetryable: true,
          });

          toast({
            title: language === 'es' ? '❌ Error de conexión' : '❌ Connection Error',
            description: error.message,
            variant: 'destructive',
          });
        },
        onResponseComplete: () => {
          onResponseComplete?.();
        },
        onLatencyUpdate: (latency) => {
          monitoring.recordLatency(latency);
        },
      });

      await client.connect();
      clientRef.current = client;

    } catch (error) {
      console.error('[useRealtimeVoiceWebRTC] Connection failed:', error);
      
      await monitoring.recordError({
        errorType: 'connection_failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stackTrace: error instanceof Error ? error.stack : undefined,
        isRetryable: true,
      });

      await monitoring.endSession(false);

      toast({
        title: language === 'es' ? '❌ No se pudo conectar' : '❌ Connection Failed',
        description: language === 'es'
          ? 'No se pudo iniciar la sesión de voz'
          : 'Could not start voice session',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setIsAIPlaying(false);
    setTranscript([]);

    await monitoring.endSession(true);
  };

  const sendText = (text: string) => {
    if (clientRef.current) {
      clientRef.current.sendText(text);
    } else {
      console.warn('[useRealtimeVoiceWebRTC] Cannot send text - not connected');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
        monitoring.endSession(false);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    connect,
    disconnect,
    sendText,
  };
};
