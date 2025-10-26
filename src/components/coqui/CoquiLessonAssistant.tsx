import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoquiSession, VoiceContextConfig } from "@/hooks/useCoquiSession";
import CoquiMascot from "@/components/CoquiMascot";
import { toast } from "sonner";

interface CoquiLessonAssistantProps {
  activityId: string;
  activityType: 'lesson' | 'exercise';
  voiceContext?: VoiceContextConfig;
  position?: 'fixed' | 'inline';
  className?: string;
  autoConnect?: boolean;
  isConnecting?: boolean;
}

export const CoquiLessonAssistant = ({ 
  activityId, 
  activityType, 
  voiceContext,
  position = 'fixed',
  className = '',
  autoConnect = true,
  isConnecting: isConnectingProp = false
}: CoquiLessonAssistantProps) => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("idle");
  const [audioLevel, setAudioLevel] = useState(-100);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  useEffect(() => {
    console.log('[CoquiLessonAssistant] 🧩 Mounted', { autoConnect });
  }, []);

  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    startSession,
    endSession,
    sendText
  } = useCoquiSession({
    activityId,
    activityType,
    voiceContext,
    onAudioLevel: (dbLevel) => {
      setAudioLevel(dbLevel);
      
      // Detect if user is speaking (above silence threshold)
      const isSpeaking = dbLevel > -45;
      setIsUserSpeaking(isSpeaking);
      
      // Show hint if level too low (user trying to speak but too quiet)
      if (dbLevel > -50 && dbLevel < -45 && isConnected) {
        toast.info(
          t("Habla un poco más fuerte", "Speak a bit louder"),
          { duration: 2000 }
        );
      }
    }
  });

  // Auto-connect if prop is true
  useEffect(() => {
    console.log('[CoquiLessonAssistant] 🔄 AutoConnect check', { autoConnect, isConnected, isConnecting });
    if (autoConnect && !isConnected && !isConnecting) {
      console.log('[CoquiLessonAssistant] 🚀 Auto-connecting...');
      startSession();
    }
  }, [autoConnect, isConnected, isConnecting, startSession]);

  // Update mascot state based on connection and AI state
  // Use parent's isConnecting prop OR internal isConnecting state
  const effectiveConnecting = isConnectingProp || isConnecting;
  
  useEffect(() => {
    if (effectiveConnecting) {
      setMascotState('loading');
    } else if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected) {
      setMascotState('listening');
    } else {
      setMascotState('idle');
    }
  }, [effectiveConnecting, isAIPlaying, isConnected]);

  // Send post-connect greeting exactly once when connection is established
  const hasGreeted = useRef(false);
  
  useEffect(() => {
    if (isConnected && !hasGreeted.current && sendText) {
      hasGreeted.current = true;
      
      const greeting = voiceContext?.coquiDialogue 
        || voiceContext?.voiceGuidance 
        || t(
            "¡Hola! Soy Coquí, tu asistente de lectura. ¿Cómo te puedo ayudar hoy?",
            "Hi! I'm Coquí, your reading assistant. How can I help you today?"
          );
      
      console.log('[CoquiLessonAssistant] 👋 Sending post-connect greeting');
      sendText(greeting);
    }
  }, [isConnected, voiceContext, sendText, t]);

  // Reset greeting flag when disconnecting
  useEffect(() => {
    if (!isConnected && hasGreeted.current) {
      hasGreeted.current = false;
    }
  }, [isConnected]);

  // Store endSession in a ref to prevent dependency issues
  const endSessionRef = useRef(endSession);
  const hasDisconnected = useRef(false);
  
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);

  // Cleanup: ONLY on actual unmount, and only once
  useEffect(() => {
    return () => {
      if (!hasDisconnected.current) {
        console.log('[CoquiLessonAssistant] 🛑 Component unmounting - cleanup');
        hasDisconnected.current = true;
        endSessionRef.current();
      }
    };
  }, []); // Empty array = only runs on actual unmount

  const handleMascotClick = () => {
    if (!isConnected && !isConnecting) {
      console.log('[CoquiLessonAssistant] 🖱️ Manual start via mascot click');
      startSession();
      return;
    }
    toast.info(t("Estoy escuchando. Habla conmigo.", "I'm listening. Talk to me."));
  };

  const mascotSize = position === 'inline' ? 'large' : 'medium';
  const mascotPosition = position === 'inline' ? undefined : 'bottom-right';

  return (
    <div className={className}>
      {/* Mascot (always visible, clickable) */}
      <div
        onClick={handleMascotClick}
        className="cursor-pointer select-none relative"
        role="button"
        aria-label={t("Interactuar con Coquí", "Interact with Coquí")}
      >
        <CoquiMascot
          state={mascotState}
          size={mascotSize}
          position={mascotPosition}
        />
      </div>
      
      {/* Audio Level Indicator (only show when connected) */}
      {isConnected && (
        <div className="mt-4 space-y-2">
          {/* Visual bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {t("Audio:", "Audio:")}
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${
                  isUserSpeaking ? 'bg-green-500' : 'bg-gray-400'
                }`}
                style={{ 
                  width: `${Math.max(0, Math.min(100, (audioLevel + 60) * 2))}%` 
                }}
              />
            </div>
          </div>
          
          {/* Speaking indicator */}
          {isUserSpeaking && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t("Te estoy escuchando...", "I'm listening...")}
            </div>
          )}
          
          {/* Debug info */}
          <div className="text-xs text-muted-foreground">
            {audioLevel.toFixed(1)} dB
          </div>
        </div>
      )}
    </div>
  );
};
