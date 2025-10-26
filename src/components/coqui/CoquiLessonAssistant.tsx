import { useState, useEffect } from "react";
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
}

export const CoquiLessonAssistant = ({ 
  activityId, 
  activityType, 
  voiceContext,
  position = 'fixed',
  className = ''
}: CoquiLessonAssistantProps) => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("idle");

  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    startSession,
    endSession
  } = useCoquiSession({
    activityId,
    activityType,
    voiceContext
  });

  // Auto-start session on mount
  useEffect(() => {
    const initSession = async () => {
      console.log('[CoquiLessonAssistant] 🚀 Auto-starting voice session');
      try {
        await startSession();
        toast.success(t("¡Coquí está listo! Empieza a hablar.", "Coquí is ready! Start talking."));
      } catch (error) {
        console.error('[CoquiLessonAssistant] Failed to auto-start session:', error);
        toast.error(t("No se pudo iniciar la voz. Haz clic en Coquí para reintentar.", "Could not start voice. Click Coquí to retry."));
      }
    };
    
    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update mascot state based on connection and AI state
  useEffect(() => {
    if (isConnecting) {
      setMascotState('loading');
    } else if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected) {
      setMascotState('listening');
    } else {
      setMascotState('idle');
    }
  }, [isConnecting, isAIPlaying, isConnected]);

  // Cleanup: End session when leaving the page
  useEffect(() => {
    return () => {
      console.log('[CoquiLessonAssistant] 🧹 Cleanup - ending session on unmount');
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMascotClick = () => {
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
    </div>
  );
};
