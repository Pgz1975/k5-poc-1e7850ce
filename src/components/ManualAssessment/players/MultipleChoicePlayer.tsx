import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
}

export function MultipleChoicePlayer({
  content,
  onAnswer,
  selectedAnswer,
  showFeedback,
  isCorrect
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
            className={`flex-1 p-4 sm:p-6 justify-start min-h-[80px] ${
              showFeedback && selectedAnswer === index
                ? isCorrect
                  ? 'bg-success hover:bg-success/90 text-success-foreground'
                  : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : ''
            }`}
            variant={showFeedback && selectedAnswer === index ? 'default' : 'outline'}
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
