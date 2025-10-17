import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic, Volume2, RotateCcw, ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";

interface ControlPanelProps {
  mode: 'listen' | 'practice' | 'comprehension' | 'complete';
  onStartListening: () => void;
  onStartPracticing: () => void;
  onRepeat: () => void;
  onNext: () => void;
  canGoNext: boolean;
  pronunciationScore: number;
  onPronunciationUpdate: (score: number) => void;
}

export const ControlPanel = ({
  mode,
  onStartListening,
  onStartPracticing,
  onRepeat,
  onNext,
  canGoNext,
  pronunciationScore,
  onPronunciationUpdate
}: ControlPanelProps) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleListen = () => {
    setIsPlaying(true);
    onStartListening();
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleRecord = () => {
    setIsRecording(true);
    
    // Simulate recording and pronunciation scoring
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      onPronunciationUpdate(mockScore);
      setIsRecording(false);
    }, 2000);
  };

  if (mode === 'comprehension' || mode === 'complete') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border shadow-hover z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {mode === 'listen' && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onRepeat}
                className="gap-2 border-2"
              >
                <RotateCcw className="h-5 w-5" />
                {t("Repetir", "Repeat")}
              </Button>

              <div className="relative">
                <Button
                  size="lg"
                  onClick={handleListen}
                  disabled={isPlaying}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:scale-110 transition-all shadow-hover ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                >
                  {isPlaying ? (
                    <Volume2 className="h-8 w-8 animate-pulse" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>

                {isPlaying && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-4 py-2 shadow-lg animate-bounce-once">
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-blue-500 rounded animate-pulse" />
                      <div className="w-2 h-8 bg-blue-500 rounded animate-pulse delay-75" />
                      <div className="w-2 h-6 bg-blue-500 rounded animate-pulse delay-150" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                size="lg"
                onClick={onStartPracticing}
                className="gap-2 bg-gradient-to-br from-orange-500 to-orange-700"
              >
                {t("Tu Turno", "Your Turn")}
                <Mic className="h-5 w-5" />
              </Button>
            </>
          )}

          {mode === 'practice' && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onRepeat}
                className="gap-2 border-2"
              >
                <RotateCcw className="h-5 w-5" />
                {t("Repetir", "Repeat")}
              </Button>

              <div className="relative">
                <Button
                  size="lg"
                  onClick={handleRecord}
                  disabled={isRecording}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 hover:scale-110 transition-all shadow-hover ${
                    isRecording ? "animate-pulse" : ""
                  }`}
                >
                  <Mic className={`h-8 w-8 ${isRecording ? "text-white" : ""}`} />
                </Button>

                {isRecording && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-4 py-2 shadow-lg animate-bounce-once">
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-orange-500 rounded animate-pulse" />
                      <div className="w-2 h-8 bg-orange-500 rounded animate-pulse delay-75" />
                      <div className="w-2 h-6 bg-orange-500 rounded animate-pulse delay-150" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                size="lg"
                onClick={onNext}
                disabled={!canGoNext}
                className="gap-2 bg-gradient-to-br from-primary to-green-700"
              >
                {t("Siguiente", "Next")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
