import { cn } from '@/lib/utils';
import { AudioWaveform } from '@/components/realtime/AudioWaveform';
import CoquiMascot from '@/components/CoquiMascot';

interface VoiceVisualizationPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  isAIPlaying: boolean;
  frequencyData: Uint8Array;
  audioLevel: number;
  mascotState?: string;
  className?: string;
}

export function VoiceVisualizationPanel({
  isConnected,
  isConnecting,
  isAIPlaying,
  frequencyData,
  audioLevel,
  mascotState,
  className
}: VoiceVisualizationPanelProps) {
  
  const determineMascotState = (): string => {
    if (mascotState) return mascotState;
    if (isConnecting) return 'loading';
    if (isAIPlaying) return 'speaking';
    if (isConnected) return 'listening';
    return 'idle';
  };

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
