import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';

interface Answer {
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

interface TrueFalseContent {
  question: string;
  questionImage?: string;
  answers: Answer[];
}

interface TrueFalseEditorProps {
  content: TrueFalseContent;
  onChange: (content: TrueFalseContent) => void;
}

export function TrueFalseEditor({ content, onChange }: TrueFalseEditorProps) {
  const { t, language } = useLanguage();
  const isSpanish = language === 'es';

  // Ensure we always have exactly 2 answers for True/False
  const ensureTrueFalseAnswers = () => {
    if (!content.answers || content.answers.length !== 2) {
      return [
        { text: isSpanish ? 'Verdadero' : 'True', imageUrl: null, isCorrect: false },
        { text: isSpanish ? 'Falso' : 'False', imageUrl: null, isCorrect: false }
      ];
    }
    return content.answers;
  };

  const answers = ensureTrueFalseAnswers();
  const correctAnswerIndex = answers.findIndex(a => a.isCorrect);

  const handleCorrectAnswerChange = (value: string) => {
    const selectedIndex = parseInt(value);
    const updatedAnswers = answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === selectedIndex
    }));
    onChange({ ...content, answers: updatedAnswers });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold text-foreground mb-4">
          {t("Respuesta Correcta", "Correct Answer")}
        </Label>
        <RadioGroup
          value={correctAnswerIndex >= 0 ? correctAnswerIndex.toString() : undefined}
          onValueChange={handleCorrectAnswerChange}
          className="space-y-3"
        >
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-3 border-2 rounded-lg p-4 bg-card">
              <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
              <Label
                htmlFor={`answer-${index}`}
                className="text-xl font-medium cursor-pointer flex-1"
              >
                {answer.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
