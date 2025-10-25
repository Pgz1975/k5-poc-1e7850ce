import { useEffect, useRef, useState } from "react";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";

interface WelcomeSpeakerProps {
  language: 'es' | 'en';
  onDone: () => void;
}

export function WelcomeSpeaker({ language, onDone }: WelcomeSpeakerProps) {
  const [sent, setSent] = useState(false);
  const [aiStarted, setAiStarted] = useState(false);
  const cleanupRef = useRef(false);
  
  const { connect, disconnect, sendText, isConnected, isAIPlaying } = useRealtimeVoice({
    studentId: "welcome-once",
    language: language === "es" ? "es-PR" : "en-US",
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

  // Send message when connected
  useEffect(() => {
    if (isConnected && !sent) {
      console.log('[WelcomeSpeaker] Connected, sending welcome message');
      const msg = language === "es"
        ? "¡Perfecto! Ya tengo permiso para usar tu micrófono. Cuando quieras hablar conmigo durante tus lecciones, solo haz clic sobre mí y estaré listo para ayudarte."
        : "Perfect! I now have permission to use your microphone. When you want to talk to me during your lessons, just click on me and I'll be ready to help you.";
      
      sendText(msg);
      setSent(true);
    }
  }, [isConnected, sent, language, sendText]);

  // Track when AI playback starts
  useEffect(() => {
    if (sent && isAIPlaying && !aiStarted) {
      console.log('[WelcomeSpeaker] AI playback started');
      setAiStarted(true);
    }
  }, [sent, isAIPlaying, aiStarted]);

  // Cleanup after playback finishes (only after it has started)
  useEffect(() => {
    if (aiStarted && !isAIPlaying && !cleanupRef.current) {
      console.log('[WelcomeSpeaker] Playback finished, cleaning up...');
      cleanupRef.current = true;
      
      const timer = setTimeout(() => {
        disconnect();
        onDone();
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [aiStarted, isAIPlaying, disconnect, onDone]);

  return null;
}
