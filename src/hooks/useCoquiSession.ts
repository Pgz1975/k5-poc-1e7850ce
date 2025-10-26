/**
 * Coquí Session Management Hook
 * Simplified voice connection wrapper
 */

import { useCallback, useRef } from 'react';
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

  const startSession = useCallback(async () => {
    // Guard: prevent duplicate connection attempts
    if (hasAttemptedConnection.current || isConnected || isConnecting) {
      console.log('[useCoquiSession] ⏭️ Skipping - already attempted/connected/connecting');
      return;
    }
    
    hasAttemptedConnection.current = true; // Set flag before async work
    console.log('[useCoquiSession] 🚀 Starting session');
    
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
