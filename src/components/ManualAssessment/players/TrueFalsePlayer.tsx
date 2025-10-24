import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Answer {
  text: string;
  imageUrl?: string | null;
  isCorrect: boolean;
}

interface TrueFalseContent {
  question: string;
  questionImage?: string;
  answers: Answer[];
}

interface TrueFalsePlayerProps {
  content: TrueFalseContent;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

export function TrueFalsePlayer({
  content,
  onAnswer,
  selectedAnswer,
  showFeedback,
  isCorrect
}: TrueFalsePlayerProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      {content.answers.map((answer, index) => (
        <div key={index} className="flex flex-col gap-3 sm:gap-4">
          {answer.imageUrl && (
            <div className="w-full rounded-lg overflow-hidden border-2 bg-muted">
              <img 
                src={answer.imageUrl} 
                alt={answer.text}
                className="w-full h-32 sm:h-48 object-contain"
              />
            </div>
          )}
          <Button
            onClick={() => onAnswer(index)}
            disabled={showFeedback}
            className={`text-xl sm:text-3xl p-6 sm:p-12 h-auto ${
              showFeedback && selectedAnswer === index
                ? isCorrect
                  ? 'bg-success hover:bg-success/90 text-success-foreground'
                  : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : ''
            }`}
            variant={showFeedback && selectedAnswer === index ? 'default' : 'outline'}
            aria-label={`${answer.text}`}
            aria-pressed={selectedAnswer === index}
          >
            {answer.text}
          </Button>
        </div>
      ))}
    </div>
  );
}
