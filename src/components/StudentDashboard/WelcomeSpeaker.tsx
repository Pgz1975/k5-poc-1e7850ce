import { useEffect, useRef, useState } from 'react';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

interface WelcomeSpeakerProps {
  language: 'es' | 'en';
  onDone: () => void;
}

export function WelcomeSpeaker({ language, onDone }: WelcomeSpeakerProps) {
  const [sent, setSent] = useState(false);
  const cleanupRef = useRef(false);
  const lastSoundAtRef = useRef<number>(Date.now());
  // Use special voice guidance to make AI just read the text without adding commentary
  const { connect, disconnect, sendText, isConnected, isAIPlaying } = useRealtimeVoice({
    studentId: 'welcome-speaker',
    language: language === 'es' ? 'es-PR' : 'en-US',
    voiceGuidance: 'You are a text-to-speech system. Read EXACTLY what the user provides, word for word, with appropriate emotion and Puerto Rican Spanish pronunciation. Do not add any commentary, greetings, or extra words. Just read the text provided.',
    onResponseComplete: () => {
      // Do NOT disconnect here; wait for 20s of silence instead
      console.log('[WelcomeSpeaker] Response complete');
    },
    onAudioLevel: (db: number) => {
      // Reset silence timer when any sound (AI or user) is detected above noise floor
      if (db > -55) lastSoundAtRef.current = Date.now();
    }
  });

  // Connect on mount
  useEffect(() => {
    console.log('[WelcomeSpeaker] Mounting, connecting...');
    connect();
    lastSoundAtRef.current = Date.now();
    
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

  // Reset silence timer whenever AI starts speaking
  useEffect(() => {
    if (isAIPlaying) {
      lastSoundAtRef.current = Date.now();
    }
  }, [isAIPlaying]);

  // Disconnect only after 20s of continuous silence; otherwise keep alive until unmount
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      const silentFor = Date.now() - lastSoundAtRef.current;
      if (!isAIPlaying && silentFor >= 20000 && !cleanupRef.current) {
        console.log('[WelcomeSpeaker] 20s of silence, disconnecting...');
        cleanupRef.current = true;
        disconnect();
        onDone();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected, isAIPlaying, disconnect, onDone]);

  return null;
}
