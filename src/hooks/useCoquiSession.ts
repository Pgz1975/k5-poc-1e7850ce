/**
 * Coquí Session Management Hook
 * Simplified voice connection wrapper
 */

import { useCallback } from 'react';
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
    transcript
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
    console.log('[useCoquiSession] 🚀 Starting session');
    if (!user) {
      console.warn('[useCoquiSession] ⚠️ No user - cannot start session');
      return;
    }
    await connect();
  }, [connect, user]);

  const endSession = useCallback(async () => {
    console.log('[useCoquiSession] 🛑 Ending session');
    await disconnect();
    
    // Add extra delay to ensure cleanup completes
    await new Promise(resolve => setTimeout(resolve, 200));
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    startSession,
    endSession,
    sendText
  };
}
