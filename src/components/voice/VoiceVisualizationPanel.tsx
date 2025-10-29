import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AudioWaveform } from '@/components/realtime/AudioWaveform';
import CoquiMascot from '@/components/CoquiMascot';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceVisualizationPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  isAIPlaying: boolean;
  frequencyData: Uint8Array;
  audioLevel: number;
  mascotState?: string;
  className?: string;
  sendText?: (text: string) => void;
  voiceGuidance?: string;
  activityId?: string;
  client?: any;
}

export function VoiceVisualizationPanel({
  isConnected,
  isConnecting,
  isAIPlaying,
  frequencyData,
  audioLevel,
  mascotState,
  className,
  sendText,
  voiceGuidance,
  activityId,
  client
}: VoiceVisualizationPanelProps) {
  const { t } = useLanguage();
  
  const determineMascotState = (): string => {
    if (mascotState) return mascotState;
    if (isConnecting) return 'loading';
    if (isAIPlaying) return 'speaking';
    if (isConnected) return 'listening';
    return 'idle';
  };

  // Track greeting status and initial cooldown
  const hasGreeted = useRef(false);
  const initialCooldownRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isConnected && !hasGreeted.current && sendText) {
      hasGreeted.current = true;
      
      // Set a cooldown timer (1200ms) before allowing activity prompts
      initialCooldownRef.current = setTimeout(() => {
        console.log('[VoiceVisualizationPanel] ⏰ Initial cooldown complete');
      }, 1200);
      
      console.log('[VoiceVisualizationPanel] 👋 Connected - will use activity guidance as greeting');
    }
  }, [isConnected, sendText]);

  // Reset greeting flag and cooldown when disconnecting
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
    const currentPromptKey = `${activityId}_${voiceGuidance || ''}`;
    
    // Only send if connected, prompt changed, and we've greeted
    if (isConnected && hasGreeted.current && currentPromptKey !== lastPromptKey.current && sendText && voiceGuidance) {
      retryCount.current = 0; // Reset retry count for new prompt
      
      const sendActivityPrompt = () => {
        // Check if we're still in initial cooldown
        if (initialCooldownRef.current !== null) {
          retryCount.current++;
          const maxRetries = 10;
          
          if (retryCount.current >= maxRetries) {
            console.warn('[VoiceVisualizationPanel] ⚠️ Max retries reached, sending prompt anyway');
            sendText(voiceGuidance);
            lastPromptKey.current = currentPromptKey;
            retryCount.current = 0;
            return;
          }
          
          // Wait for cooldown with random interval 500-800ms
          const retryInterval = 500 + Math.random() * 300;
          console.log('[VoiceVisualizationPanel] ⏳ Waiting for initial cooldown...', {
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
            console.warn('[VoiceVisualizationPanel] ⚠️ Max retries reached, sending prompt anyway');
            sendText(voiceGuidance);
            lastPromptKey.current = currentPromptKey;
            retryCount.current = 0;
            return;
          }
          
          // Random interval between 500-800ms for better collision avoidance
          const retryInterval = 500 + Math.random() * 300;
          console.log('[VoiceVisualizationPanel] ⏳ AI still active, retrying activity prompt...', {
            isAIPlaying,
            isResponseActive: client?.isResponseActive(),
            retryCount: retryCount.current,
            nextRetryMs: Math.round(retryInterval)
          });
          retryTimerRef.current = setTimeout(sendActivityPrompt, retryInterval);
        } else {
          // AI finished - send the new activity's guidance
          console.log('[VoiceVisualizationPanel] 🔄 Activity changed, sending new guidance');
          sendText(voiceGuidance);
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
      console.log('[VoiceVisualizationPanel] ⏲️ Starting activity prompt with initial debounce:', Math.round(initialDebounce), 'ms');
      retryTimerRef.current = setTimeout(sendActivityPrompt, initialDebounce);
    }

    // Cleanup retry timer
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [isConnected, hasGreeted, activityId, voiceGuidance, isAIPlaying, sendText, t, client]);

  return (
    <div className={cn("grid grid-cols-3 gap-4 w-full", className)}>
      {/* Left 2/3: Audio Waveform */}
      <div className="col-span-2">
        <AudioWaveform
          frequencyData={frequencyData}
          audioLevel={audioLevel}
          isActive={isConnected || isAIPlaying}
          className="w-full"
        />
      </div>
      
      {/* Right 1/3: Coquí Mascot */}
      <div className="col-span-1 flex items-center justify-center">
        <CoquiMascot
          state={determineMascotState()}
          size="medium"
          className="mx-auto"
        />
      </div>
    </div>
  );
}
