import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import { useNavigate } from "react-router-dom";
import { useReadingExercise } from "@/hooks/useReadingExercise";
import { TextDisplay } from "@/components/ReadingExercise/TextDisplay";
import { IllustrationPanel } from "@/components/ReadingExercise/IllustrationPanel";
import { ControlPanel } from "@/components/ReadingExercise/ControlPanel";
import { ComprehensionCheck } from "@/components/ReadingExercise/ComprehensionCheck";
import { CompletionCelebration } from "@/components/ReadingExercise/CompletionCelebration";
import { Header } from "@/components/Header";
import { readingExercises } from "@/data/readingExercises";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white flex flex-col">
      {/* Main Navigation Header */}
      <Header />

      {/* Stats Bar - K5 Friendly */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b-4 border-primary/20 px-6 py-4 sticky top-16 z-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Level and Progress Dots */}
            <Card className="bg-white/90 backdrop-blur px-4 py-2 shadow-lg border-2 border-primary/20">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">
                  {currentExercise.levelName}
                </span>
                <div className="flex gap-1.5">
                  {readingExercises.map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-full transition-all ${
                        i <= exerciseIndex
                          ? "bg-primary scale-110 shadow-lg"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Fun Stats */}
            <div className="flex items-center gap-3">
              <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-300 px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-orange-600">{streakDays}</span>
                    <span className="text-xs font-medium text-orange-600/80">{t("días", "days")}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300 px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-yellow-600">{pointsEarned}</span>
                    <span className="text-xs font-medium text-yellow-600/80">{t("puntos", "points")}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered Vertically */}
      <main className="flex-1 flex items-center justify-center px-6 py-6">
        {mode === 'comprehension' ? (
          <ComprehensionCheck
            questions={currentQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={answerQuestion}
            imagePath={currentExercise.imagePath}
          />
        ) : (
          <div className="w-full max-w-6xl">
            {/* Image, Mascot, and Progress Row */}
            <div className="mb-8">
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
            <div>
              <TextDisplay
                text={currentText}
                currentWordIndex={currentWordIndex}
                wordStatuses={wordStatuses}
                onWordClick={selectWord}
                pronunciationScore={pronunciationScore}
                mode={mode}
              />
            </div>
          </div>
        )}
      </main>

      {/* Control Panel */}
      {mode !== 'comprehension' && (
        <ControlPanel
          mode={mode}
          onStartListening={() => startListening(currentText, language)}
          onStartPracticing={startPracticing}
          onRepeat={resetExercise}
          onNext={nextExercise}
          canGoNext={pronunciationScore >= 60}
          pronunciationScore={pronunciationScore}
          onPronunciationUpdate={handleWordPronunciation}
          currentText={currentText}
          language={language}
        />
      )}

    </div>
  );
}
