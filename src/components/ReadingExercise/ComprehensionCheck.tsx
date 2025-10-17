import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface ComprehensionCheckProps {
  questions: ComprehensionQuestion[];
  currentQuestionIndex: number;
  onAnswer: (answerIndex: number) => void;
}

export const ComprehensionCheck = ({
  questions,
  currentQuestionIndex,
  onAnswer,
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

  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="max-w-3xl mx-auto p-8 bg-card shadow-soft">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">
              {t("Pregunta", "Question")} {currentQuestionIndex + 1}/3
            </h3>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full transition-all ${
                    i <= currentQuestionIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-2xl font-semibold mb-6">{currentQuestion.question}</p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => !showFeedback && handleSelectAnswer(index)}
              disabled={showFeedback}
              variant="outline"
              className={`w-full py-6 text-lg justify-start hover:bg-primary/10 transition-all ${
                showFeedback && index === selectedAnswer
                  ? isCorrect
                    ? "bg-green-500/20 border-green-500"
                    : "bg-red-500/20 border-red-500"
                  : ""
              }`}
            >
              <span className="flex items-center gap-3 w-full">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left">{option}</span>
                {showFeedback && index === selectedAnswer && (
                  <span className="flex-shrink-0">
                    {isCorrect ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )}
                  </span>
                )}
              </span>
            </Button>
          ))}
        </div>

        {showFeedback && (
          <div
            className={`mt-6 p-4 rounded-lg animate-fade-in ${
              isCorrect ? "bg-green-500/10" : "bg-orange-500/10"
            }`}
          >
            <p className="text-lg font-semibold text-center">
              {isCorrect
                ? t("¡Excelente! ⭐", "Excellent! ⭐")
                : t("¡Inténtalo de nuevo!", "Try again!")}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
