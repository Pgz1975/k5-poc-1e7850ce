import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Home, Mic, RotateCcw, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import { useNavigate } from "react-router-dom";

type CoquiState = "speaking" | "happy" | "thinking" | "neutral";

export default function ReadingExercise() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [coquiState, setCoquiState] = useState<CoquiState>("neutral");
  const [pronunciationScore, setPronunciationScore] = useState(85);
  const [currentSentence, setCurrentSentence] = useState(0);

  // Sample sentence - in real app, this would come from content API
  const sentence = t(
    "La rana feliz saltó sobre la hoja de nenúfar",
    "The happy frog jumped over the lily pad"
  );
  const words = sentence.split(" ");
  const totalSentences = 5;

  useEffect(() => {
    if (isRecording) {
      setCoquiState("speaking");
    } else if (pronunciationScore >= 80) {
      setCoquiState("happy");
    } else {
      setCoquiState("neutral");
    }
  }, [isRecording, pronunciationScore]);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording and processing
      setTimeout(() => {
        setCoquiState("thinking");
        setTimeout(() => {
          setCoquiState("happy");
          setIsRecording(false);
          // Simulate word progression
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
          }
        }, 1500);
      }, 2000);
    }
  };

  const handleRepeat = () => {
    setCurrentWordIndex(0);
    setPronunciationScore(0);
  };

  const handleNext = () => {
    if (currentSentence < totalSentences - 1) {
      setCurrentSentence(currentSentence + 1);
      setCurrentWordIndex(0);
    }
  };

  const getWordStyle = (index: number) => {
    if (index < currentWordIndex) {
      return "text-primary/30"; // Already read
    } else if (index === currentWordIndex) {
      return "bg-secondary text-foreground animate-bounce-once"; // Current word
    } else {
      return "text-foreground/40"; // Upcoming
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-primary/10 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-primary/10"
          >
            <Home className="h-5 w-5" />
          </Button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalSentences }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all ${
                  i <= currentSentence
                    ? "bg-primary scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-bold">
              🔥 {t("5 días", "5 days")}
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-secondary">
              ⭐ {t("45 puntos", "45 points")}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Text Display Area - 60% */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-8 bg-white shadow-soft">
              {/* Sentence with word highlighting */}
              <div
                className="text-[28px] leading-relaxed flex flex-wrap gap-2"
                style={{ fontFamily: "'Comic Sans MS', 'Nunito', sans-serif" }}
              >
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={`${getWordStyle(
                      index
                    )} px-2 py-1 rounded transition-all duration-300`}
                  >
                    {word}
                  </span>
                ))}
              </div>

              {/* Pronunciation Feedback Bar */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{t("Precisión", "Accuracy")}</span>
                  <span className="text-primary flex items-center gap-1">
                    ⭐ {pronunciationScore}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
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
              </div>
            </Card>

            {/* Progress Indicator */}
            <Card className="p-4 bg-white/80 backdrop-blur shadow-soft">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold">
                  {t("Oraciones completadas", "Sentences completed")}
                </span>
                <span className="font-bold text-primary">
                  {currentSentence + 1} {t("de", "of")} {totalSentences}
                </span>
              </div>
              <Progress
                value={((currentSentence + 1) / totalSentences) * 100}
                className="h-2"
              />
            </Card>
          </div>

          {/* Illustration Panel - 40% */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-to-br from-green-100 to-blue-100 shadow-soft h-[400px] flex items-center justify-center overflow-hidden relative">
              {/* Pond Scene */}
              <div className="relative w-full h-full">
                {/* Sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-100 rounded-lg" />

                {/* Sun */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-pulse" />

                {/* Lily Pad */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-8 bg-green-500 rounded-full shadow-md animate-float" />

                {/* Frog */}
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-6xl animate-bounce-gentle">
                  🐸
                </div>

                {/* Water */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-blue-300/50 rounded-b-lg" />

                {/* Decorative elements */}
                <div className="absolute bottom-6 left-6 text-3xl">🌿</div>
                <div className="absolute top-1/3 right-6 text-2xl animate-sway">
                  🦋
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-primary/10 shadow-hover">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Repetir Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleRepeat}
                className="gap-2 border-2 border-primary/30"
              >
                <RotateCcw className="h-5 w-5" />
                {t("Repetir", "Repeat")}
              </Button>

              {/* Record Button */}
              <div className="relative">
                <Button
                  size="lg"
                  onClick={handleRecord}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 hover:scale-110 transition-all shadow-hover ${
                    isRecording ? "animate-pulse" : ""
                  }`}
                >
                  <Mic
                    className={`h-8 w-8 ${isRecording ? "text-white" : ""}`}
                  />
                </Button>

                {/* Speech Bubble */}
                {isRecording && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg animate-bounce-once">
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-primary rounded animate-pulse" />
                      <div className="w-2 h-8 bg-primary rounded animate-pulse delay-75" />
                      <div className="w-2 h-6 bg-primary rounded animate-pulse delay-150" />
                    </div>
                  </div>
                )}
              </div>

              {/* Siguiente Button */}
              <Button
                size="lg"
                onClick={handleNext}
                disabled={currentSentence >= totalSentences - 1}
                className="gap-2 bg-gradient-to-br from-primary via-green-700 to-green-900"
              >
                {t("Siguiente", "Next")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Coquí Mascot */}
        <div className="fixed bottom-24 right-8 z-50">
          <CoquiMascot
            state={coquiState}
            size="small"
            position="inline"
            className="drop-shadow-2xl"
          />
        </div>
      </main>
    </div>
  );
}
