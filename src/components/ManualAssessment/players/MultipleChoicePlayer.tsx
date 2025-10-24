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
          className={`w-full text-2xl p-8 justify-start ${
            showFeedback && selectedAnswer === index
              ? isCorrect
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
              : ''
          }`}
          variant={showFeedback && selectedAnswer === index ? 'default' : 'outline'}
        >
          <span className="font-bold mr-4">{String.fromCharCode(65 + index)})</span>
          <div className="flex-1 text-left">
            {answer.text}
            {answer.imageUrl && (
              <img
                src={answer.imageUrl}
                alt={`${t("Opción", "Option")} ${index + 1}`}
                className="mt-2 h-24 w-24 object-cover rounded"
              />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
