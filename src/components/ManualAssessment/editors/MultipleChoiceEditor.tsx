import { Label } from '@/components/ui/label';
import { AnswerList } from '@/components/ManualAssessment/AnswerList';
import { useLanguage } from '@/contexts/LanguageContext';

interface Answer {
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

interface MultipleChoiceContent {
  question: string;
  questionImage?: string;
  answers: Answer[];
}

interface MultipleChoiceEditorProps {
  content: MultipleChoiceContent;
  onChange: (content: MultipleChoiceContent) => void;
}

export function MultipleChoiceEditor({ content, onChange }: MultipleChoiceEditorProps) {
  const { t } = useLanguage();

  const updateAnswers = (answers: Answer[]) => {
    onChange({ ...content, answers });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold text-foreground">
          {t("Opciones de Respuesta", "Answer Options")}
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          {t(
            "Añade las opciones de respuesta. Marca la(s) correcta(s).",
            "Add answer options. Mark the correct one(s)."
          )}
        </p>
        <AnswerList answers={content.answers} onChange={updateAnswers} />
      </div>
    </div>
  );
}
