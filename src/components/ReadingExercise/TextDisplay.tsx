import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextDisplayProps {
  text: string;
  currentWordIndex: number;
  wordStatuses: string[];
  onWordClick: (index: number) => void;
  pronunciationScore: number;
  mode: 'listen' | 'practice' | 'comprehension' | 'complete';
}

export const TextDisplay = ({
  text,
  currentWordIndex,
  wordStatuses,
  onWordClick,
  pronunciationScore,
  mode
}: TextDisplayProps) => {
  const { t } = useLanguage();
  const words = text.split(" ");

  const getWordStyle = (index: number) => {
    const status = wordStatuses[index];
    
    if (mode === 'listen' && index === currentWordIndex) {
      return "bg-primary/20 text-primary scale-110 animate-bounce-once";
    }
    
    if (mode === 'practice') {
      if (status === 'correct') {
        return "bg-green-500/30 text-green-900";
      } else if (status === 'close') {
        return "bg-yellow-400/30 text-yellow-900";
      } else if (status === 'incorrect') {
        return "bg-red-500/30 text-red-900";
      } else if (index === currentWordIndex) {
        return "bg-[#FFD93D] text-gray-900 animate-bounce-once scale-110";
      } else if (index < currentWordIndex) {
        return "text-muted-foreground/40";
      }
    }
    
    return "text-foreground hover:text-primary cursor-pointer";
  };

  const playWord = (word: string, index: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      onWordClick(index);
    }
  };

  return (
    <Card className="p-10 bg-card shadow-soft">
      <div
        className="text-[40px] leading-relaxed flex flex-wrap gap-3 mb-8 justify-center"
        style={{ fontFamily: "'Comic Sans MS', 'Nunito', sans-serif" }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            onClick={() => playWord(word, index)}
            className={`${getWordStyle(index)} px-3 py-2 rounded-xl transition-all duration-300 font-semibold`}
          >
            {word}
          </span>
        ))}
      </div>

      {mode === 'practice' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              {t("Precisión de Pronunciación", "Pronunciation Accuracy")}
            </span>
            <span className="text-primary flex items-center gap-1">
              ⭐ {pronunciationScore}%
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${pronunciationScore}%`,
                background:
                  pronunciationScore < 50
                    ? "linear-gradient(to right, #ff4d4f, #ffa940)"
                    : pronunciationScore < 80
                    ? "linear-gradient(to right, #ffa940, #fadb14)"
                    : "linear-gradient(to right, #52c41a, #73d13d)",
              }}
            />
          </div>

          {/* Rhythm and Speed Indicators */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{t("Velocidad", "Speed")}:</span>
              <div className="flex gap-2">
                <span className="text-xl opacity-30">🐢</span>
                <span className="text-xl">🐸</span>
                <span className="text-xl opacity-30">🐰</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{t("Ritmo", "Rhythm")}:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
