import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeVoiceClientEnhanced } from '@/utils/realtime/RealtimeVoiceClientEnhanced';
import { useToast } from '@/hooks/use-toast';
import { logAIResponse } from '@/lib/speech/VoiceLogger';

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
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(128));
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [client, setClient] = useState<RealtimeVoiceClientEnhanced | null>(null);
  const clientRef = useRef<RealtimeVoiceClientEnhanced | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const isDisconnecting = useRef(false);
  const isDisconnected = useRef(false);
  const frequencyIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    console.log('[useRealtimeVoice] 🎯 Connect called');
    console.log('[useRealtimeVoice] 📊 State:', { isConnecting, isConnected });
    
    if (isConnecting || isConnected) {
      console.log('[useRealtimeVoice] ⚠️ Already connecting or connected, aborting');
      return;
    }

    // Reset disconnect flags when starting fresh connection
    isDisconnected.current = false;
    isDisconnecting.current = false;

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
          
          // Log AI responses to database
          if (!isUser && studentId) {
            logAIResponse({
              sessionId: sessionIdRef.current,
              studentId,
              text,
              activityId,
              language: language || 'es-PR'
            });
          }
        },
        onAudioPlayback: (isPlaying) => {
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
      
      // Start polling frequency data
      frequencyIntervalRef.current = window.setInterval(() => {
        if (clientRef.current) {
          const data = clientRef.current.getFrequencyData();
          setFrequencyData(new Uint8Array(data));
        }
      }, 50); // Update at ~20fps
      
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

  const disconnect = useCallback(async () => {
    // Idempotent guard: prevent double disconnect
    if (isDisconnecting.current || isDisconnected.current) {
      console.log('[useRealtimeVoice] ⏭️ Already disconnecting/disconnected, skipping');
      return;
    }

    console.log('[useRealtimeVoice] 🛑 Disconnecting...');
    isDisconnecting.current = true;
    
    // Stop frequency polling
    if (frequencyIntervalRef.current) {
      clearInterval(frequencyIntervalRef.current);
      frequencyIntervalRef.current = null;
    }
    
    try {
      if (clientRef.current) {
        await clientRef.current.disconnect();
        clientRef.current = null;
      }
      
      setIsConnected(false);
      setIsConnecting(false);
      setIsAIPlaying(false);
      setTranscript([]);
      setFrequencyData(new Uint8Array(128));
      setAudioLevel(0);
      
      console.log('[useRealtimeVoice] ✅ Disconnected successfully');
    } catch (error) {
      // Ignore InvalidStateError from AudioContext double-close
      if (error instanceof Error && error.message.includes('Cannot close a closed AudioContext')) {
        console.log('[useRealtimeVoice] ⚠️ AudioContext already closed, ignoring error');
      } else {
        console.error('[useRealtimeVoice] ❌ Error during disconnect:', error);
      }
    } finally {
      isDisconnected.current = true;
      isDisconnecting.current = false;
    }
  }, []);

  const sendText = useCallback((text: string) => {
    console.log('[useRealtimeVoice] Sending text:', text);
    clientRef.current?.sendText(text);
  }, []);

  // Callback to update audio level from client
  useEffect(() => {
    if (onAudioLevel) {
      const handler = (level: number) => setAudioLevel(level);
      // This is managed via the onAudioLevel callback passed to the client
    }
  }, [onAudioLevel]);

  // Cleanup on unmount
  useEffect(() => {
    console.log('[useRealtimeVoice] 🎬 Hook mounted');
    return () => {
      console.log('[useRealtimeVoice] 🧹 Cleanup on unmount');
      if (frequencyIntervalRef.current) {
        clearInterval(frequencyIntervalRef.current);
      }
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
    client,
    frequencyData,
    audioLevel
  };
}
