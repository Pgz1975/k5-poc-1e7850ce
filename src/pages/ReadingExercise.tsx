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
            {/* Image, Mascot, and Progress Row */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="flex items-start gap-6 mb-4">
                {/* Illustration Panel - Left */}
                <div className="flex-1">
                  <IllustrationPanel imagePath={currentExercise.imagePath} />
                </div>

                {/* Right Side: Mascot + Progress */}
                <div className="flex flex-col justify-between" style={{ width: '200px', height: '300px' }}>
                  {/* Coquí Mascot */}
                  <div className="flex justify-center">
                    <CoquiMascot
                      state={getCoquiState()}
                      size="reading"
                      position="inline"
                      className="drop-shadow-2xl"
                    />
                  </div>

                  {/* Progress Indicator - Aligned to bottom */}
                  <div className="bg-card/80 backdrop-blur rounded-lg p-3 shadow-soft">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold">
                        {t("Progreso", "Progress")}
                      </span>
                      <span className="font-bold text-primary">
                        {exerciseIndex + 1}/{readingExercises.length}
                      </span>
                    </div>
                    <Progress
                      value={((exerciseIndex + 1) / readingExercises.length) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Speech Bubble - Below layout */}
              {pronunciationScore >= 90 && mode === 'practice' && (
                <div className="mt-2 bg-card rounded-2xl px-4 py-2 shadow-lg animate-bounce-once text-center max-w-xs mx-auto">
                  <p className="text-sm font-bold text-primary">
                    {t("¡Muy bien!", "Great job!")}
                  </p>
                </div>
              )}
            </div>

            {/* Text Display Area - Full Width, Centered */}
            <div className="max-w-5xl mx-auto">
              <TextDisplay
                text={currentText}
                currentWordIndex={currentWordIndex}
                wordStatuses={wordStatuses}
                onWordClick={selectWord}
                pronunciationScore={pronunciationScore}
                mode={mode}
              />
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

    </div>
  );
}
