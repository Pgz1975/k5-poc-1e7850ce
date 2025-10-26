import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeVoiceClientEnhanced } from '@/utils/realtime/RealtimeVoiceClientEnhanced';
import { useToast } from '@/hooks/use-toast';

interface UseRealtimeVoiceProps {
  studentId?: string;
  language?: 'es-PR' | 'en-US';
  model?: string;
  voiceGuidance?: string;
  activityId?: string;
  activityType?: 'lesson' | 'exercise' | 'system';
  contextPayload?: Record<string, unknown>;
  onTranscription?: (text: string, isUser: boolean) => void;
  onAudioLevel?: (dbLevel: number) => void;
  onResponseComplete?: () => void;
}

export function useRealtimeVoice({ studentId, language, model, voiceGuidance, activityId, activityType, contextPayload, onTranscription, onAudioLevel, onResponseComplete }: UseRealtimeVoiceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [client, setClient] = useState<RealtimeVoiceClientEnhanced | null>(null);
  const clientRef = useRef<RealtimeVoiceClientEnhanced | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    console.log('[useRealtimeVoice] 🎯 Connect called');
    console.log('[useRealtimeVoice] 📊 State:', { isConnecting, isConnected });
    
    if (isConnecting || isConnected) {
      console.log('[useRealtimeVoice] ⚠️ Already connecting or connected, aborting');
      return;
    }

    setIsConnecting(true);
    console.log('[useRealtimeVoice] 🚀 Starting connection process...');

    try {
      // Get current session token
      console.log('[useRealtimeVoice] 🔐 Fetching Supabase session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[useRealtimeVoice] ❌ Session error:', sessionError);
        throw new Error('Session error: ' + sessionError.message);
      }
      
      if (!session) {
        console.error('[useRealtimeVoice] ❌ No active session');
        throw new Error('No active session. Please log in.');
      }

      console.log('[useRealtimeVoice] ✅ Session token obtained, user:', session.user?.id);

      // Create client
      console.log('[useRealtimeVoice] 🏗️ Creating RealtimeVoiceClientEnhanced...');
      clientRef.current = new RealtimeVoiceClientEnhanced({
        studentId,
        language,
        model,
        voiceGuidance,
        activityId,
        activityType,
        contextPayload,
        onTranscription: (text, isUser) => {
          console.log(`[useRealtimeVoice] ${isUser ? '🎤 User' : '🔊 AI'}:`, text);
          setTranscript(prev => [...prev, { text, isUser }]);
          onTranscription?.(text, isUser);
        },
        onAudioPlayback: (isPlaying) => {
          console.log('[useRealtimeVoice] 🔊 Audio playback:', isPlaying);
          setIsAIPlaying(isPlaying);
        },
        onAudioLevel: onAudioLevel,
        onResponseComplete: onResponseComplete,
        onError: (error) => {
          console.error('[useRealtimeVoice] ❌ Error callback triggered:', error);
          const msg = (error && (error as Error).message) || '';
          // Suppress benign commit-empty noise
          if (msg.includes('input_audio_buffer_commit_empty') || msg.includes('buffer too small')) {
            console.warn('[useRealtimeVoice] ⚠️ Suppressing toast for commit-empty error');
            return;
          }
          toast({
            title: 'Voice Error',
            description: msg || 'Unknown error',
            variant: 'destructive'
          });
        },
        onConnectionChange: (connected) => {
          console.log('[useRealtimeVoice] 📡 Connection status changed:', connected);
          setIsConnected(connected);
        }
      });

      console.log('[useRealtimeVoice] 🔌 Calling client.connect()...');
      await clientRef.current.connect(session.access_token);
      setClient(clientRef.current);
      console.log('[useRealtimeVoice] ✅ Client connected successfully');
      
      toast({
        title: language === 'es-PR' ? '¡Conectado!' : 'Connected!',
        description: language === 'es-PR' 
          ? 'Comienza a leer en voz alta' 
          : 'Start reading aloud'
      });

    } catch (error) {
      console.error('[useRealtimeVoice] ❌ Connection error:', error);
      console.error('[useRealtimeVoice] 📋 Error stack:', error instanceof Error ? error.stack : 'No stack');
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect',
        variant: 'destructive'
      });
      setIsConnected(false);
    } finally {
      console.log('[useRealtimeVoice] 🏁 Connection attempt finished');
      setIsConnecting(false);
    }
  }, [studentId, language, model, voiceGuidance, activityId, activityType, contextPayload, isConnecting, isConnected, onTranscription, onAudioLevel, onResponseComplete, toast]);

  const disconnect = useCallback(() => {
    console.log('[useRealtimeVoice] Disconnecting...');
    clientRef.current?.disconnect();
    clientRef.current = null;
    setIsConnected(false);
    setTranscript([]);
    setIsAIPlaying(false);
  }, []);

  const sendText = useCallback((text: string) => {
    console.log('[useRealtimeVoice] Sending text:', text);
    clientRef.current?.sendText(text);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    console.log('[useRealtimeVoice] 🎬 Hook mounted');
    return () => {
      console.log('[useRealtimeVoice] 🧹 Cleanup on unmount');
      clientRef.current?.disconnect();
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
    client
  };
}
