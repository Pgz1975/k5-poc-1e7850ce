import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
  colorScheme?: any;
}

export function TrueFalsePlayer({
  content,
  onAnswer,
  selectedAnswer,
  showFeedback,
  isCorrect,
  colorScheme
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
            className={cn(
              "text-xl sm:text-3xl p-6 sm:p-12 h-auto",
              "border-4 rounded-2xl font-black",
              "shadow-[0_6px_0_rgba(0,0,0,0.12)]",
              "hover:shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
              "active:shadow-[0_2px_0_rgba(0,0,0,0.08)] active:translate-y-1",
              "transition-all duration-200",
              
              !showFeedback && cn(colorScheme?.border, "bg-white", colorScheme?.text),
              
              showFeedback && selectedAnswer === index && (
                isCorrect
                  ? 'bg-success border-success text-white'
                  : 'bg-destructive border-destructive text-white'
              )
            )}
            variant="outline"
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
