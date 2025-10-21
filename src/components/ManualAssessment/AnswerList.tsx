import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { ImagePasteZone } from './ImagePasteZone';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Answer {
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
}

interface AnswerListProps {
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
}

export function AnswerList({ answers, onChange }: AnswerListProps) {
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const addAnswer = () => {
    onChange([...answers, { text: '', imageUrl: null, isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    onChange(answers.filter((_, i) => i !== index));
  };

  const updateAnswer = (index: number, field: keyof Answer, value: any) => {
    const updated = [...answers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => (
        <div key={index} className="border-2 rounded-lg p-4 bg-card">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-lg font-bold text-foreground">
              {t("Opción", "Option")} {index + 1}:
            </span>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={answer.isCorrect}
                onCheckedChange={(checked) => updateAnswer(index, 'isCorrect', checked)}
              />
              <span className="text-sm text-foreground">
                {t("Marcar como correcta", "Mark as correct")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAnswer(index)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              value={answer.text}
              onChange={(e) => updateAnswer(index, 'text', e.target.value)}
              placeholder={t("Escribe la respuesta...", "Enter answer text...")}
              className="text-xl"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedImageIndex(expandedImageIndex === index ? null : index)}
              className="w-full"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {answer.imageUrl
                ? t("Cambiar imagen", "Change image")
                : t("Añadir imagen (opcional)", "Add image (optional)")}
            </Button>

            {expandedImageIndex === index && (
              <ImagePasteZone
                currentImage={answer.imageUrl}
                onImageUploaded={(url) => {
                  updateAnswer(index, 'imageUrl', url);
                  setExpandedImageIndex(null);
                }}
              />
            )}

            {answer.imageUrl && expandedImageIndex !== index && (
              <div className="mt-2">
                <img
                  src={answer.imageUrl}
                  alt={`Answer ${index + 1}`}
                  className="h-24 w-24 object-cover rounded border-2"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <Button
        onClick={addAnswer}
        variant="outline"
        className="w-full border-dashed border-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("Añadir Otra Opción", "Add Another Option")}
      </Button>
    </div>
  );
}
