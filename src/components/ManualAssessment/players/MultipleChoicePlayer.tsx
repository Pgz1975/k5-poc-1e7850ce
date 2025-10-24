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
          className={`w-full text-lg sm:text-2xl p-4 sm:p-8 justify-start ${
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
          <span className="font-bold mr-2 sm:mr-4 text-base sm:text-xl">{String.fromCharCode(65 + index)})</span>
          <div className="flex-1 text-left">
            {answer.text}
            {answer.imageUrl && (
              <img
                src={answer.imageUrl}
                alt={`${t("Opción", "Option")} ${index + 1}`}
                className="mt-2 h-20 w-20 sm:h-24 sm:w-24 object-contain rounded"
              />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
