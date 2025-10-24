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
        <Button
          key={index}
          onClick={() => onAnswer(index)}
          disabled={showFeedback}
          className={`w-full p-4 sm:p-6 justify-start min-h-[80px] ${
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
          <div className="flex-1 flex items-center gap-3 sm:gap-4">
            {answer.imageUrl && (
              <img
                src={answer.imageUrl}
                alt={`${t("Opción", "Option")} ${index + 1}`}
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded flex-shrink-0"
              />
            )}
            <span className="text-lg sm:text-2xl text-left">{answer.text}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
