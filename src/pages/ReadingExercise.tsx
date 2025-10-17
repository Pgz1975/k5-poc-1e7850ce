import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import { useNavigate } from "react-router-dom";
import { useReadingExercise } from "@/hooks/useReadingExercise";
import { TextDisplay } from "@/components/ReadingExercise/TextDisplay";
import { IllustrationPanel } from "@/components/ReadingExercise/IllustrationPanel";
import { ControlPanel } from "@/components/ReadingExercise/ControlPanel";
import { ComprehensionCheck } from "@/components/ReadingExercise/ComprehensionCheck";
import { CompletionCelebration } from "@/components/ReadingExercise/CompletionCelebration";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { readingExercises } from "@/data/readingExercises";

export default function ReadingExercise() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const {
    currentExercise,
    exerciseIndex,
    mode,
    currentWordIndex,
    pronunciationScore,
    wordStatuses,
    currentQuestionIndex,
    streakDays,
    pointsEarned,
    nextExercise,
    setMode,
    startListening,
    startPracticing,
    handleWordPronunciation,
    selectWord,
    answerQuestion,
    resetExercise,
  } = useReadingExercise();

  const currentText = language === "es" ? currentExercise.textEs : currentExercise.textEn;
  const currentQuestions = language === "es" 
    ? currentExercise.comprehensionQuestions.es 
    : currentExercise.comprehensionQuestions.en;

  const getCoquiState = () => {
    if (mode === 'complete') return 'celebration';
    if (pronunciationScore >= 90) return 'excited';
    if (pronunciationScore >= 70) return 'happy';
    if (mode === 'practice') return 'speaking';
    return 'neutral';
  };

  if (mode === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white">
        <CompletionCelebration
          pronunciationScore={pronunciationScore}
          pointsEarned={pointsEarned}
          onNext={nextExercise}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white pb-32">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b border-border px-6 py-4 sticky top-0 z-40">
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
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground mr-2">
              {currentExercise.levelName}
            </span>
            <div className="flex gap-2">
              {readingExercises.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i <= exerciseIndex
                      ? "bg-primary scale-110"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-bold">
              🔥 {streakDays} {t("días", "days")}
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-secondary">
              ⭐ {pointsEarned} {t("puntos", "points")}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        {mode === 'comprehension' ? (
          <ComprehensionCheck
            questions={currentQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={answerQuestion}
          />
        ) : (
          <>
            <div className="grid lg:grid-cols-5 gap-6 mb-6">
              {/* Text Display Area - 60% */}
              <div className="lg:col-span-3">
                <TextDisplay
                  text={currentText}
                  currentWordIndex={currentWordIndex}
                  wordStatuses={wordStatuses}
                  onWordClick={selectWord}
                  pronunciationScore={pronunciationScore}
                  mode={mode}
                />
              </div>

              {/* Illustration Panel - 40% */}
              <div className="lg:col-span-2">
                <IllustrationPanel imageQuery={currentExercise.imageQuery} />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/80 backdrop-blur rounded-lg p-4 shadow-soft">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold">
                    {t("Progreso del ejercicio", "Exercise progress")}
                  </span>
                  <span className="font-bold text-primary">
                    {exerciseIndex + 1} {t("de", "of")} {readingExercises.length}
                  </span>
                </div>
                <Progress
                  value={((exerciseIndex + 1) / readingExercises.length) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Control Panel */}
      {mode !== 'comprehension' && (
        <ControlPanel
          mode={mode}
          onStartListening={startListening}
          onStartPracticing={startPracticing}
          onRepeat={resetExercise}
          onNext={nextExercise}
          canGoNext={pronunciationScore >= 60}
          pronunciationScore={pronunciationScore}
          onPronunciationUpdate={handleWordPronunciation}
        />
      )}

      {/* Coquí Mascot */}
      {mode !== 'comprehension' && (
        <div className="fixed bottom-28 right-8 z-50 w-[80px]">
          <CoquiMascot
            state={getCoquiState()}
            size="small"
            position="inline"
            className="drop-shadow-2xl"
          />
          
          {/* Speech Bubble */}
          {pronunciationScore >= 90 && mode === 'practice' && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card rounded-2xl px-4 py-2 shadow-lg animate-bounce-once whitespace-nowrap">
              <p className="text-sm font-bold text-primary">
                {t("¡Muy bien!", "Great job!")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
