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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {content.answers.map((answer, index) => (
        <Button
          key={index}
          onClick={() => onAnswer(index)}
          disabled={showFeedback}
          className={`text-3xl p-12 h-auto ${
            showFeedback && selectedAnswer === index
              ? isCorrect
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
              : ''
          }`}
          variant={showFeedback && selectedAnswer === index ? 'default' : 'outline'}
        >
          {answer.text}
        </Button>
      ))}
    </div>
  );
}
