import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeVoiceClient } from '@/utils/realtime/RealtimeVoiceClient';
import { useToast } from '@/hooks/use-toast';

interface UseRealtimeVoiceProps {
  studentId: string;
  language: 'es-PR' | 'en-US';
  onTranscription?: (text: string, isUser: boolean) => void;
}

export function useRealtimeVoice({ studentId, language, onTranscription }: UseRealtimeVoiceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const clientRef = useRef<RealtimeVoiceClient | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) {
      console.log('[useRealtimeVoice] Already connecting or connected');
      return;
    }

    setIsConnecting(true);
    console.log('[useRealtimeVoice] Starting connection...');

    try {
      // Get current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session. Please log in.');
      }

      console.log('[useRealtimeVoice] Session token obtained');

      // Create client
      clientRef.current = new RealtimeVoiceClient({
        studentId,
        language,
        onTranscription: (text, isUser) => {
          console.log(`[useRealtimeVoice] ${isUser ? '🎤 User' : '🔊 AI'}:`, text);
          setTranscript(prev => [...prev, { text, isUser }]);
          onTranscription?.(text, isUser);
        },
        onAudioPlayback: (isPlaying) => {
          console.log('[useRealtimeVoice] Audio playback:', isPlaying);
          setIsAIPlaying(isPlaying);
        },
        onError: (error) => {
          console.error('[useRealtimeVoice] Error:', error);
          toast({
            title: 'Voice Error',
            description: error.message,
            variant: 'destructive'
          });
        },
        onConnectionChange: (connected) => {
          console.log('[useRealtimeVoice] Connection status:', connected);
          setIsConnected(connected);
        }
      });

      await clientRef.current.connect(session.access_token);
      
      toast({
        title: language === 'es-PR' ? '¡Conectado!' : 'Connected!',
        description: language === 'es-PR' 
          ? 'Comienza a leer en voz alta' 
          : 'Start reading aloud'
      });

    } catch (error) {
      console.error('[useRealtimeVoice] Connection error:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect',
        variant: 'destructive'
      });
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [studentId, language, isConnecting, isConnected, onTranscription, toast]);

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
    return () => {
      console.log('[useRealtimeVoice] Cleanup on unmount');
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
    sendText
  };
}
