import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface WriteAnswerContent {
  question: string;
  questionImage?: string;
  correctAnswer: string;
  caseSensitive: false;
}

interface WriteAnswerPlayerProps {
  content: WriteAnswerContent;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  voiceClient?: any;
}

export function WriteAnswerPlayer({ content, onAnswer, voiceClient }: WriteAnswerPlayerProps) {
  const { t } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const normalized = userInput.trim().toLowerCase();
    const correctNormalized = content.correctAnswer.toLowerCase();
    const correct = normalized === correctNormalized;
    
    setIsSubmitted(true);
    setIsCorrect(correct);
    onAnswer(userInput, correct);

    if (voiceClient) {
      if (correct) {
        voiceClient.sendText(t("¡Perfecto! Esa es la respuesta correcta.", "Perfect! That's the correct answer."));
      } else {
        voiceClient.sendText(t(`La respuesta correcta es: ${content.correctAnswer}. ¡Sigue practicando!`, `The correct answer is: ${content.correctAnswer}. Keep practicing!`));
      }
    }
  };

  const handleReset = () => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !isSubmitted) {
      handleSubmit();
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">{content.question}</h2>
      
      {content.questionImage && (
        <img 
          src={content.questionImage} 
          alt={t("Imagen de la pregunta", "Question image")} 
          className="max-h-48 sm:max-h-64 mx-auto mb-6 rounded-lg border-2 object-contain" 
        />
      )}

      {/* Answer Input */}
      <div className="mb-6">
        <label htmlFor="answer-input" className="text-sm text-muted-foreground mb-3 block">
          {t('Escribe tu respuesta:', 'Type your answer:')}
        </label>
        <Input
          id="answer-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("Escribe aquí...", "Type here...")}
          disabled={isSubmitted}
          className="text-lg sm:text-xl p-3 sm:p-4"
          autoFocus
          maxLength={50}
          aria-label={t("Campo de respuesta", "Answer field")}
          aria-describedby="answer-hint"
        />
        <p id="answer-hint" className="text-xs text-muted-foreground mt-1">
          {t('Solo una palabra, sin espacios', 'Single word only, no spaces')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!userInput.trim() || isSubmitted}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isSubmitted 
            ? t('✓ Enviado', '✓ Submitted') 
            : t('Enviar Respuesta', 'Submit Answer')}
        </Button>
        {isSubmitted && (
          <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
            {t('Intentar de Nuevo', 'Try Again')}
          </Button>
        )}
      </div>

      {/* Feedback */}
      {isSubmitted && (
        <Alert className={isCorrect ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}>
          {isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-success" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" />
          )}
          <AlertTitle className="text-lg">
            {isCorrect 
              ? t('¡Correcto!', 'Correct!') 
              : t('Incorrecto', 'Incorrect')}
          </AlertTitle>
          {!isCorrect && (
            <AlertDescription>
              {t('La respuesta correcta es:', 'The correct answer is:')} <strong>{content.correctAnswer}</strong>
            </AlertDescription>
          )}
        </Alert>
      )}
    </Card>
  );
}
