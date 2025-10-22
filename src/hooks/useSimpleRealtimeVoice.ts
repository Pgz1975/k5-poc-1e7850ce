import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SimpleRealtimeClient } from '@/utils/SimpleRealtimeClient';
import { useToast } from '@/hooks/use-toast';

export function useSimpleRealtimeVoice() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const clientRef = useRef<SimpleRealtimeClient | null>(null);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    console.log('[Hook] 🔑 Requesting ephemeral token...');

    try {
      // Get token from our edge function
      const { data, error } = await supabase.functions.invoke('realtime-token-simple');
      
      if (error) throw error;
      if (!data?.client_secret?.value) {
        throw new Error('No ephemeral token received');
      }

      console.log('[Hook] ✅ Token received, connecting to WebRTC...');

      // Create client and connect
      clientRef.current = new SimpleRealtimeClient((event) => {
        setEvents(prev => [...prev.slice(-19), event]); // Keep last 20 events
      });

      await clientRef.current.connect(data.client_secret.value);
      
      setIsConnected(true);
      toast({
        title: 'Connected! 🎉',
        description: 'Voice chat is ready. Start speaking to the AI!',
      });

    } catch (error) {
      console.error('[Hook] ❌ Connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, toast]);

  const disconnect = useCallback(() => {
    console.log('[Hook] Disconnecting...');
    clientRef.current?.disconnect();
    setIsConnected(false);
    setEvents([]);
  }, []);

  return {
    isConnected,
    isConnecting,
    events,
    connect,
    disconnect,
  };
}
