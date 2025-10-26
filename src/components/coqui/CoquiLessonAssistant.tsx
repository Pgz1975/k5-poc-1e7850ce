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
    sendText,
    client
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

  // Track greeting status and initial cooldown
  const hasGreeted = useRef(false);
  const initialCooldownRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isConnected && !hasGreeted.current && sendText) {
      // Use activity guidance as the "greeting" to avoid double sending
      // Mark as greeted but don't send a separate greeting
      hasGreeted.current = true;
      
      // Set a cooldown timer (1200ms) before allowing activity prompts
      initialCooldownRef.current = setTimeout(() => {
        console.log('[CoquiLessonAssistant] ⏰ Initial cooldown complete');
      }, 1200);
      
      console.log('[CoquiLessonAssistant] 👋 Connected - will use activity guidance as greeting');
    }
  }, [isConnected, sendText]);

  // Reset greeting flag, prompt key, retry count, and cooldown when disconnecting
  useEffect(() => {
    if (!isConnected && hasGreeted.current) {
      hasGreeted.current = false;
      lastPromptKey.current = '';
      retryCount.current = 0;
      if (initialCooldownRef.current) {
        clearTimeout(initialCooldownRef.current);
        initialCooldownRef.current = null;
      }
    }
  }, [isConnected]);

  // Per-activity greeting: send guidance when activityId changes while connected
  const lastPromptKey = useRef<string>('');
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);

  useEffect(() => {
    // Build unique prompt key from activityId + guidance content
    const currentPromptKey = `${activityId}_${voiceContext?.voiceGuidance || voiceContext?.coquiDialogue || ''}`;
    
    // Only send if connected, prompt changed, and we've greeted
    if (isConnected && hasGreeted.current && currentPromptKey !== lastPromptKey.current && sendText) {
      retryCount.current = 0; // Reset retry count for new prompt
      
      const sendActivityPrompt = () => {
        // Check if we're still in initial cooldown
        if (initialCooldownRef.current !== null) {
          retryCount.current++;
          const maxRetries = 10;
          
          if (retryCount.current >= maxRetries) {
            console.warn('[CoquiLessonAssistant] ⚠️ Max retries reached, sending prompt anyway');
            const guidance = voiceContext?.coquiDialogue 
              || voiceContext?.voiceGuidance 
              || t(
                  `Ahora vamos a trabajar en una nueva actividad.`,
                  `Now let's work on a new activity.`
                );
            sendText(guidance);
            lastPromptKey.current = currentPromptKey;
            retryCount.current = 0;
            return;
          }
          
          // Wait for cooldown with random interval 500-800ms
          const retryInterval = 500 + Math.random() * 300;
          console.log('[CoquiLessonAssistant] ⏳ Waiting for initial cooldown...', {
            retryCount: retryCount.current,
            nextRetryMs: Math.round(retryInterval)
          });
          retryTimerRef.current = setTimeout(sendActivityPrompt, retryInterval);
          return;
        }
        
        // Wait for BOTH audio playback AND response generation to finish
        if (isAIPlaying || client?.isResponseActive()) {
          retryCount.current++;
          const maxRetries = 10;
          
          if (retryCount.current >= maxRetries) {
            console.warn('[CoquiLessonAssistant] ⚠️ Max retries reached, sending prompt anyway');
            const guidance = voiceContext?.coquiDialogue 
              || voiceContext?.voiceGuidance 
              || t(
                  `Ahora vamos a trabajar en una nueva actividad.`,
                  `Now let's work on a new activity.`
                );
            sendText(guidance);
            lastPromptKey.current = currentPromptKey;
            retryCount.current = 0;
            return;
          }
          
          // Random interval between 500-800ms for better collision avoidance
          const retryInterval = 500 + Math.random() * 300;
          console.log('[CoquiLessonAssistant] ⏳ AI still active, retrying activity prompt...', {
            isAIPlaying,
            isResponseActive: client?.isResponseActive(),
            retryCount: retryCount.current,
            nextRetryMs: Math.round(retryInterval)
          });
          retryTimerRef.current = setTimeout(sendActivityPrompt, retryInterval);
        } else {
          // AI finished - send the new activity's guidance
          const guidance = voiceContext?.coquiDialogue 
            || voiceContext?.voiceGuidance 
            || t(
                `Ahora vamos a trabajar en una nueva actividad.`,
                `Now let's work on a new activity.`
              );
          
          console.log('[CoquiLessonAssistant] 🔄 Activity changed, sending new guidance');
          sendText(guidance);
          lastPromptKey.current = currentPromptKey;
          retryCount.current = 0;
          
          // Clear retry timer
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
          }
        }
      };

      // Add initial debounce (600-800ms) before first check
      const initialDebounce = 600 + Math.random() * 200;
      console.log('[CoquiLessonAssistant] ⏲️ Starting activity prompt with initial debounce:', Math.round(initialDebounce), 'ms');
      retryTimerRef.current = setTimeout(sendActivityPrompt, initialDebounce);
    }

    // Cleanup retry timer
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [isConnected, hasGreeted, activityId, voiceContext, isAIPlaying, sendText, t, client]);

  // Store endSession in a ref to prevent dependency issues
  const endSessionRef = useRef(endSession);
  const hasDisconnected = useRef(false);
  
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);

  // Reset hasDisconnected when reconnecting
  useEffect(() => {
    if (isConnecting) {
      hasDisconnected.current = false;
    }
  }, [isConnecting]);

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
