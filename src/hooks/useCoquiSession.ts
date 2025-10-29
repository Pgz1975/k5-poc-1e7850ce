/**
 * Coquí Session Management Hook
 * Simplified voice connection wrapper
 */

import { useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

export interface VoiceContextConfig {
  title?: string;
  subtype?: string | null;
  language?: string | null;
  voiceGuidance?: string | null;
  coquiDialogue?: string | null;
  pronunciationWords?: string[] | null;
  content?: Record<string, unknown> | null;
}

interface UseCoquiSessionProps {
  activityId?: string;
  activityType?: 'lesson' | 'exercise' | 'system';
  voiceContext?: VoiceContextConfig;
  onAudioLevel?: (dbLevel: number) => void;
}

export function useCoquiSession({ activityId, activityType, voiceContext, onAudioLevel }: UseCoquiSessionProps = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const hasAttemptedConnection = useRef(false);
  const previousActivityId = useRef<string | undefined>(activityId);
  const connectionAttempts = useRef(0);
  const hasGreetedRef = useRef(false); // Track if we've greeted
  const greetingCooldownRef = useRef(false); // Cooldown to prevent rapid re-greeting
  const MAX_CONNECTION_ATTEMPTS = 3;

  const targetLanguage = language === 'es' ? 'es-PR' : 'en-US';
  const serializedVoiceContext = {
    activity_title: voiceContext?.title,
    activity_subtype: voiceContext?.subtype,
    language: voiceContext?.language ?? targetLanguage,
    voice_guidance: voiceContext?.voiceGuidance,
    coqui_dialogue: voiceContext?.coquiDialogue,
    pronunciation_words: voiceContext?.pronunciationWords,
    content: voiceContext?.content ?? { note: 'No explicit content provided.' }
  };

  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    isAIPlaying,
    sendText,
    transcript,
    client
  } = useRealtimeVoice({
    studentId: user?.id,
    language: targetLanguage,
    activityId,
    activityType,
    voiceGuidance: voiceContext?.voiceGuidance ?? undefined,
    contextPayload: serializedVoiceContext,
    onAudioLevel: onAudioLevel
  });

  // Store connect/disconnect in refs to avoid infinite loop
  const connectRef = useRef(connect);
  const disconnectRef = useRef(disconnect);

  // Update refs when functions change
  useEffect(() => {
    connectRef.current = connect;
    disconnectRef.current = disconnect;
  }, [connect, disconnect]);

  // Reset connection attempts on successful connection
  useEffect(() => {
    if (isConnected) {
      connectionAttempts.current = 0;
    }
  }, [isConnected]);

  // One-time greeting after connection (matching lesson behavior)
  useEffect(() => {
    if (!isConnected || hasGreetedRef.current || greetingCooldownRef.current) return;
    if (!voiceContext?.coquiDialogue) return;

    console.log('[useCoquiSession] 👋 Sending one-time greeting');
    hasGreetedRef.current = true;
    greetingCooldownRef.current = true;

    // Send greeting after a brief delay (like lessons do)
    const timer = setTimeout(() => {
      sendText(voiceContext.coquiDialogue!);
      console.log('[useCoquiSession] ✅ Greeting sent:', voiceContext.coquiDialogue);
      
      // Reset cooldown after 5 seconds
      setTimeout(() => {
        greetingCooldownRef.current = false;
      }, 5000);
    }, 800);

    return () => clearTimeout(timer);
  }, [isConnected, voiceContext?.coquiDialogue, sendText]);

  // Reconnect when activityId changes (ensures correct context per exercise)
  useEffect(() => {
    if (activityId !== previousActivityId.current && isConnected) {
      console.log('[useCoquiSession] 🔄 Activity changed - reconnecting with new context', {
        from: previousActivityId.current,
        to: activityId
      });
      
      previousActivityId.current = activityId;
      
      // Fast reconnect: disconnect then reconnect
      (async () => {
        await disconnectRef.current();
        // Small delay to ensure cleanup
        await new Promise(resolve => setTimeout(resolve, 300));
        hasAttemptedConnection.current = false; // Reset flag to allow reconnection
        await connectRef.current();
      })();
    } else if (activityId !== previousActivityId.current) {
      previousActivityId.current = activityId;
    }
  }, [activityId, isConnected]); // Removed connect and disconnect from deps to prevent infinite loop

  const startSession = useCallback(async () => {
    // Guard: prevent duplicate connection attempts
    if (hasAttemptedConnection.current || isConnected || isConnecting) {
      console.log('[useCoquiSession] ⏭️ Skipping - already attempted/connected/connecting');
      return;
    }

    // Guard: prevent too many connection attempts
    if (connectionAttempts.current >= MAX_CONNECTION_ATTEMPTS) {
      console.error('[useCoquiSession] ❌ Max connection attempts reached');
      return;
    }
    
    hasAttemptedConnection.current = true; // Set flag before async work
    connectionAttempts.current++;
    console.log('[useCoquiSession] 🚀 Starting session (attempt', connectionAttempts.current, ')');
    
    if (!user) {
      console.warn('[useCoquiSession] ⚠️ No user - cannot start session');
      hasAttemptedConnection.current = false; // Reset on failure
      return;
    }
    
    await connect();
  }, [connect, user, isConnected, isConnecting]);

  const endSession = useCallback(async () => {
    console.log('[useCoquiSession] 🛑 Ending session');
    hasAttemptedConnection.current = false; // Reset flag on disconnect
    hasGreetedRef.current = false; // Reset greeting flag
    greetingCooldownRef.current = false; // Reset cooldown
    
    await disconnect();
    
    // Add extra delay to ensure cleanup completes before next mount
    await new Promise(resolve => setTimeout(resolve, 200));
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    startSession,
    endSession,
    sendText,
    client
  };
}
