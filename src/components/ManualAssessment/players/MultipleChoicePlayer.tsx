import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Answer {
  text: string;
  imageUrl?: string | null;
  isCorrect: boolean;
}

interface MultipleChoiceContent {
  question: string;
  questionImage?: string;
  answers: Answer[];
}

interface MultipleChoicePlayerProps {
  content: MultipleChoiceContent;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  colorScheme?: any;
}

export function MultipleChoicePlayer({
  content,
  onAnswer,
  selectedAnswer,
  showFeedback,
  isCorrect,
  colorScheme
}: MultipleChoicePlayerProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mb-8">
      {content.answers.map((answer, index) => (
        <div key={index} className="flex items-center gap-4">
          {answer.imageUrl && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
              <img
                src={answer.imageUrl}
                alt={`${t("Opción", "Option")} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Button
            onClick={() => onAnswer(index)}
            disabled={showFeedback}
            className={cn(
              "flex-1 p-4 sm:p-6 justify-start min-h-[80px]",
              "border-4 rounded-2xl font-bold",
              "shadow-[0_4px_0_rgba(0,0,0,0.08)]",
              "hover:shadow-[0_6px_0_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
              "active:shadow-[0_2px_0_rgba(0,0,0,0.08)] active:translate-y-1",
              "transition-all duration-200",
              
              // Default state: unit color border
              !showFeedback && cn(colorScheme?.border, "bg-white"),
              
              // Feedback state: semantic colors override
              showFeedback && selectedAnswer === index && (
                isCorrect
                  ? 'bg-success border-success text-white'
                  : 'bg-destructive border-destructive text-white'
              )
            )}
            variant="outline"
            aria-label={`${t("Opción", "Option")} ${String.fromCharCode(65 + index)}: ${answer.text}`}
            aria-pressed={selectedAnswer === index}
          >
            <span className="font-bold mr-3 sm:mr-4 text-base sm:text-xl self-start">{String.fromCharCode(65 + index)})</span>
            <span className="text-lg sm:text-2xl text-left flex-1">{answer.text}</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
