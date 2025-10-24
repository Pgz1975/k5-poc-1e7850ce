import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePasteZone } from '../ImagePasteZone';
import { useLanguage } from '@/contexts/LanguageContext';

interface WriteAnswerContent {
  question: string;
  questionImage?: string;
  correctAnswer: string;
  caseSensitive: false;
}

interface WriteAnswerEditorProps {
  content: WriteAnswerContent;
  onChange: (content: WriteAnswerContent) => void;
  language: 'es' | 'en';
}

export function WriteAnswerEditor({ content, onChange, language }: WriteAnswerEditorProps) {
  const { t } = useLanguage();
  const isSpanish = language === 'es';

  const handleQuestionChange = (question: string) => {
    onChange({ ...content, question });
  };

  const handleAnswerChange = (answer: string) => {
    // Only allow letters (including Spanish accents)
    const sanitized = answer.replace(/[^a-zA-Záéíóúüñ]/gi, '');
    onChange({ ...content, correctAnswer: sanitized });
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div>
        <Label htmlFor="question">
          {isSpanish ? 'Pregunta *' : 'Question *'}
        </Label>
        <Textarea
          id="question"
          value={content.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder={isSpanish 
            ? '¿Qué animal es este?' 
            : 'What animal is this?'}
          className="min-h-24"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {content.question.length}/500
        </p>
      </div>

      {/* Optional Image */}
      <div>
        <Label>
          {isSpanish ? 'Imagen (Opcional)' : 'Image (Optional)'}
        </Label>
        <ImagePasteZone
          onImageUploaded={(imageUrl) => onChange({ ...content, questionImage: imageUrl })}
          currentImage={content.questionImage}
        />
      </div>

      {/* Correct Answer */}
      <div>
        <Label htmlFor="correctAnswer">
          {isSpanish ? 'Respuesta Correcta *' : 'Correct Answer *'}
        </Label>
        <Input
          id="correctAnswer"
          value={content.correctAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder={isSpanish ? 'coquí' : 'frog'}
          maxLength={50}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {isSpanish 
            ? 'Solo una palabra (sin espacios ni números)' 
            : 'Single word only (no spaces or numbers)'}
        </p>
        {content.correctAnswer && (
          <p className="text-sm text-muted-foreground mt-1">
            {content.correctAnswer.length}/50
          </p>
        )}
      </div>

      {/* Case Sensitivity Note */}
      <div className="p-3 bg-muted/30 rounded-md">
        <p className="text-sm text-muted-foreground">
          ℹ️ {isSpanish 
            ? 'Las respuestas NO distinguen entre mayúsculas y minúsculas' 
            : 'Answers are NOT case-sensitive'}
        </p>
      </div>
    </div>
  );
}
