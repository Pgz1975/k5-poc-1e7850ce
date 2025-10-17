import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X } from "lucide-react";
import { useState } from "react";
import CoquiMascot from "@/components/CoquiMascot";

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface ComprehensionCheckProps {
  questions: ComprehensionQuestion[];
  currentQuestionIndex: number;
  onAnswer: (answerIndex: number) => void;
  imagePath: string;
}

export const ComprehensionCheck = ({
  questions,
  currentQuestionIndex,
  onAnswer,
  imagePath,
}: ComprehensionCheckProps) => {
  const { t } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(index);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const isCorrect = selectedAnswer === currentQuestion.correctIndex;

  // Different Coqui poses for each question
  const coquiPoses = ['thinking', 'reading', 'pointing'];
  const currentPose = showFeedback 
    ? (isCorrect ? 'celebration' : 'neutral')
    : coquiPoses[currentQuestionIndex % coquiPoses.length];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Exercise Image Banner */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={imagePath}
            alt="Exercise illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-6 items-start">
          {/* Questions Section */}
          <Card className="flex-1 p-8 bg-card shadow-soft">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-primary">
                  {t("Pregunta", "Question")} {currentQuestionIndex + 1}/3
                </h3>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-3 w-12 rounded-full transition-all ${
                        i <= currentQuestionIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-3xl font-bold mb-8 leading-relaxed text-foreground">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => !showFeedback && handleSelectAnswer(index)}
                  disabled={showFeedback}
                  variant="outline"
                  className={`w-full py-8 text-xl justify-start hover:bg-primary/10 transition-all ${
                    showFeedback && index === selectedAnswer
                      ? isCorrect
                        ? "bg-green-500/20 border-green-500 border-2"
                        : "bg-red-500/20 border-red-500 border-2"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-4 w-full">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-left font-semibold">{option}</span>
                    {showFeedback && index === selectedAnswer && (
                      <span className="flex-shrink-0">
                        {isCorrect ? (
                          <Check className="h-8 w-8 text-green-600" />
                        ) : (
                          <X className="h-8 w-8 text-red-600" />
                        )}
                      </span>
                    )}
                  </span>
                </Button>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 p-6 rounded-lg animate-fade-in ${
                  isCorrect ? "bg-green-500/10" : "bg-orange-500/10"
                }`}
              >
                <p className="text-2xl font-bold text-center">
                  {isCorrect
                    ? t("¡Excelente! ⭐", "Excellent! ⭐")
                    : t("¡Inténtalo de nuevo!", "Try again!")}
                </p>
              </div>
            )}
          </Card>

          {/* Coqui Mascot on the Right */}
          <div className="flex-shrink-0 w-48 sticky top-8">
            <CoquiMascot
              state={currentPose}
              size="large"
              className="animate-fade-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
