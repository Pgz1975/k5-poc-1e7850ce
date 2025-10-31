import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StudentGuideRealtimeClient } from '@/lib/realtime/StudentGuideRealtimeClient';
import { getLanguageConfig, getErrorMessage } from '@/lib/realtime/languageConfigs';
import {
  ConnectionState,
  type Language,
  type TranscriptEntry,
  type RealtimeError,
  type TokenRequest,
  type TokenResponse
} from '@/lib/realtime/types';

interface UseStudentGuideRealtimeOptions {
  studentId?: string;
  autoConnect?: boolean;
  onConnectionSuccess?: () => void;
  onConnectionError?: (error: RealtimeError) => void;
}

interface UseStudentGuideRealtimeReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionState: ConnectionState;
  
  // Transcript and conversation
  transcript: TranscriptEntry[];
  lastMessage: TranscriptEntry | null;
  
  // Error handling
  error: RealtimeError | null;
  
  // Performance metrics
  latency: number;
  audioLevel: number;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (text: string) => void;
  retry: () => Promise<void>;
  clearTranscript: () => void;
  
  // Audio controls
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
}

export function useStudentGuideRealtime(
  language: Language,
  options: UseStudentGuideRealtimeOptions = {}
): UseStudentGuideRealtimeReturn {
  // State
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<RealtimeError | null>(null);
  const [latency, setLatency] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Refs
  const clientRef = useRef<StudentGuideRealtimeClient | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  
  // Derived state
  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.RECONNECTING;
  const lastMessage = transcript.length > 0 ? transcript[transcript.length - 1] : null;

  // Initialize client
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new StudentGuideRealtimeClient({
        onConnectionStateChange: setConnectionState,
        onTranscriptUpdate: setTranscript,
        onError: setError,
        onLatencyUpdate: setLatency,
        onAudioLevelUpdate: setAudioLevel
      });
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
    };
  }, []);

  // Handle language changes - reconnect if already connected
  useEffect(() => {
    if (isConnected && currentTokenRef.current) {
      console.log('[useRealtime] Language changed, reconnecting...');
      handleLanguageChange();
    }
  }, [language]);

  // Auto-connect if enabled
  useEffect(() => {
    if (options.autoConnect && !isConnected && !isConnecting && !error) {
      connect();
    }
  }, [options.autoConnect, isConnected, isConnecting, error]);

  // Generate ephemeral token
  const generateToken = useCallback(async (): Promise<string> => {
    try {
      const tokenRequest: TokenRequest = {
        language,
        studentId: options.studentId,
        sessionMetadata: {
          activity: 'student-guide-demo',
          grade: 'K-5'
        }
      };

      const { data, error } = await supabase.functions.invoke('realtime-student-guide-token', {
        body: tokenRequest
      });

      if (error) {
        console.error('[useRealtime] Token generation error:', error);
        throw new Error(`Token generation failed: ${error.message}`);
      }

      if (!data?.client_secret?.value) {
        throw new Error('Invalid token response');
      }

      const tokenResponse = data as TokenResponse;
      console.log(`[useRealtime] Token generated for ${language} session`);
      
      return tokenResponse.client_secret.value;

    } catch (error) {
      console.error('[useRealtime] Failed to generate token:', error);
      const errorMessage = getErrorMessage(language, 'tokenError');
      throw {
        type: 'token',
        message: errorMessage,
        retryable: true
      } as RealtimeError;
    }
  }, [language, options.studentId]);

  // Connect to realtime session
  const connect = useCallback(async (): Promise<void> => {
    if (isConnectingRef.current || isConnected) {
      console.log('[useRealtime] Already connecting or connected');
      return;
    }

    try {
      isConnectingRef.current = true;
      setError(null);
      
      console.log(`[useRealtime] Connecting to ${language} session...`);
      
      // Generate token
      const token = await generateToken();
      currentTokenRef.current = token;
      
      // Connect with client
      if (clientRef.current) {
        await clientRef.current.connect(token, language);
        options.onConnectionSuccess?.();
        console.log(`[useRealtime] Successfully connected to ${language} session`);
      }

    } catch (error) {
      console.error('[useRealtime] Connection failed:', error);
      const realtimeError = error as RealtimeError;
      setError(realtimeError);
      options.onConnectionError?.(realtimeError);
    } finally {
      isConnectingRef.current = false;
    }
  }, [language, generateToken, isConnected, options]);

  // Disconnect from session
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      console.log('[useRealtime] Disconnecting...');
      
      if (clientRef.current) {
        await clientRef.current.disconnect();
      }
      
      currentTokenRef.current = null;
      setError(null);
      
    } catch (error) {
      console.error('[useRealtime] Disconnect error:', error);
    }
  }, []);

  // Handle language change during active session
  const handleLanguageChange = useCallback(async (): Promise<void> => {
    if (!isConnected) return;

    try {
      console.log(`[useRealtime] Switching to ${language}...`);
      setConnectionState(ConnectionState.RECONNECTING);
      
      // Disconnect current session
      if (clientRef.current) {
        await clientRef.current.disconnect();
      }
      
      // Small delay to ensure clean disconnection
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reconnect with new language
      await connect();
      
    } catch (error) {
      console.error('[useRealtime] Language switch failed:', error);
      setError(error as RealtimeError);
    }
  }, [language, isConnected, connect]);

  // Send text message
  const sendMessage = useCallback((text: string): void => {
    if (!clientRef.current || !isConnected) {
      console.warn('[useRealtime] Cannot send message - not connected');
      return;
    }

    try {
      clientRef.current.sendMessage(text);
    } catch (error) {
      console.error('[useRealtime] Failed to send message:', error);
      setError({
        type: 'network',
        message: getErrorMessage(language, 'networkError'),
        retryable: true
      });
    }
  }, [isConnected, language]);

  // Retry connection
  const retry = useCallback(async (): Promise<void> => {
    console.log('[useRealtime] Retrying connection...');
    setError(null);
    
    // Disconnect first if needed
    if (isConnected || isConnecting) {
      await disconnect();
      // Wait a bit before reconnecting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await connect();
  }, [isConnected, isConnecting, disconnect, connect]);

  // Clear transcript
  const clearTranscript = useCallback((): void => {
    if (clientRef.current) {
      clientRef.current.clearTranscript();
    }
    setTranscript([]);
  }, []);

  // Audio controls
  const mute = useCallback((): void => {
    if (clientRef.current) {
      // Get all audio tracks and disable them
      const audioElement = (clientRef.current as any).audioElement;
      if (audioElement) {
        audioElement.muted = true;
      }
      setIsMuted(true);
      console.log('[useRealtime] Muted');
    }
  }, []);

  const unmute = useCallback((): void => {
    if (clientRef.current) {
      // Get all audio tracks and enable them
      const audioElement = (clientRef.current as any).audioElement;
      if (audioElement) {
        audioElement.muted = false;
      }
      setIsMuted(false);
      console.log('[useRealtime] Unmuted');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionState,
    
    // Transcript and conversation
    transcript,
    lastMessage,
    
    // Error handling
    error,
    
    // Performance metrics
    latency,
    audioLevel,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    retry,
    clearTranscript,
    
    // Audio controls
    mute,
    unmute,
    isMuted
  };
}