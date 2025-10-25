import { useEffect, useRef, useState } from 'react';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

interface WelcomeSpeakerProps {
  language: 'es' | 'en';
  onDone: () => void;
}

export function WelcomeSpeaker({ language, onDone }: WelcomeSpeakerProps) {
  const [sent, setSent] = useState(false);
  const cleanupRef = useRef(false);
  
  // Use special voice guidance to make AI just read the text without adding commentary
  const { connect, disconnect, sendText, isConnected } = useRealtimeVoice({
    studentId: 'welcome-speaker',
    language: language === 'es' ? 'es-PR' : 'en-US',
    voiceGuidance: 'You are a text-to-speech system. Read EXACTLY what the user provides, word for word, with appropriate emotion and Puerto Rican Spanish pronunciation. Do not add any commentary, greetings, or extra words. Just read the text provided.',
    onResponseComplete: () => {
      // Wait for complete response, then cleanup
      if (!cleanupRef.current) {
        console.log('[WelcomeSpeaker] Response complete, cleaning up...');
        cleanupRef.current = true;
        setTimeout(() => {
          disconnect();
          onDone();
        }, 500);
      }
    }
  });

  // Connect on mount
  useEffect(() => {
    console.log('[WelcomeSpeaker] Mounting, connecting...');
    connect();
    
    return () => {
      console.log('[WelcomeSpeaker] Unmounting, disconnecting...');
      disconnect();
    };
  }, []);

  // Send message once connected
  useEffect(() => {
    if (isConnected && !sent) {
      const message = language === 'es'
        ? "¡Perfecto! Ya tengo permiso para usar tu micrófono. Cuando quieras hablar conmigo durante tus lecciones, solo haz clic sobre mí y estaré listo para ayudarte."
        : "Perfect! I now have permission to use your microphone. When you want to talk to me during your lessons, just click on me and I'll be ready to help you.";
      
      console.log('[WelcomeSpeaker] Connected, sending welcome message');
      sendText(message);
      setSent(true);
    }
  }, [isConnected, sent, language, sendText]);

  return null;
}
