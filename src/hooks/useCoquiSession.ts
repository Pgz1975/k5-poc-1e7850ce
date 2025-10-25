/**
 * Coquí Session Management Hook
 * Integrates voice connection with inactivity management
 */

import { useCallback, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useCoquiInactivity } from '@/hooks/useCoquiInactivity';

interface UseCoquiSessionProps {
  activityId?: string;
  activityType?: 'lesson' | 'exercise';
  voiceGuidance?: string;
}

export function useCoquiSession({ activityId, activityType, voiceGuidance }: UseCoquiSessionProps = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(10);
  const goodbyeSentRef = useRef(false);

  const inactivity = useCoquiInactivity({
    onWarning: () => {
      console.log('[useCoquiSession] ⚠️ Inactivity warning - sending empathy check');
      sendEmpathyCheck();
    },
    onTimeout: () => {
      console.log('[useCoquiSession] ⏰ Timeout reached');
      handleTimeout();
    },
    onCountdown: setCountdown
  });

  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    isAIPlaying,
    sendText,
    transcript
  } = useRealtimeVoice({
    studentId: user?.id ?? 'demo-student',
    language: language === 'es' ? 'es-PR' : 'en-US',
    voiceGuidance,
    onTranscription: (text, isUser) => {
      console.log('[useCoquiSession] 📝 Transcription:', isUser ? 'User' : 'AI', text.slice(0, 50));
      if (isUser) {
        inactivity.recordActivity();
      }
    },
    onAudioLevel: (dbLevel) => {
      // Reset inactivity on user speech
      if (dbLevel > -40) {
        inactivity.recordActivity();
      }
    }
  });

  const startSession = useCallback(async () => {
    console.log('[useCoquiSession] 🚀 Starting session');
    goodbyeSentRef.current = false;
    await connect();
    inactivity.startMonitoring();
  }, [connect, inactivity]);

  const endSession = useCallback(() => {
    console.log('[useCoquiSession] 🛑 Ending session');
    inactivity.stopMonitoring();
    disconnect();
    goodbyeSentRef.current = false;
  }, [disconnect, inactivity]);

  const sendEmpathyCheck = useCallback(() => {
    if (goodbyeSentRef.current) return;
    
    const prompt = language === 'es'
      ? "¿Está todo bien? ¿Necesitas más tiempo para pensar?"
      : "Is everything okay? Do you need more time?";
    
    console.log('[useCoquiSession] 💬 Sending empathy check:', prompt);
    sendText(prompt);
  }, [language, sendText]);

  const handleTimeout = useCallback(() => {
    if (goodbyeSentRef.current) return;
    goodbyeSentRef.current = true;
    
    const goodbye = language === 'es'
      ? "No hay problema. Haz clic en mí cuando quieras continuar."
      : "No problem! Click me when you're ready to continue.";
    
    console.log('[useCoquiSession] 👋 Sending goodbye:', goodbye);
    sendText(goodbye);
    
    // Delay disconnect to allow goodbye audio to play
    setTimeout(() => {
      console.log('[useCoquiSession] 🔌 Disconnecting after goodbye');
      endSession();
    }, 3000);
  }, [language, sendText, endSession]);

  const resetTimeout = useCallback(() => {
    console.log('[useCoquiSession] 🔄 User clicked to continue - resetting timeout');
    goodbyeSentRef.current = false;
    inactivity.recordActivity();
  }, [inactivity]);

  return {
    countdown,
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    startSession,
    endSession,
    resetTimeout,
    sendText,
    inactivityStatus: inactivity.status
  };
}
