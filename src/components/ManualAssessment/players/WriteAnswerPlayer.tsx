import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
  colorScheme?: any;
}

export function WriteAnswerPlayer({ content, onAnswer, voiceClient, colorScheme }: WriteAnswerPlayerProps) {
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
    <Card className={cn(
      "p-4 sm:p-6 border-4 rounded-2xl",
      colorScheme?.border,
      "bg-white shadow-[0_4px_0_rgba(0,0,0,0.08)]"
    )}>
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
          className={cn(
            "text-lg sm:text-xl p-3 sm:p-4 border-3 rounded-xl",
            colorScheme?.border,
            "focus-visible:ring-offset-0",
            `focus-visible:ring-2 focus-visible:${colorScheme?.border}`
          )}
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
          className={cn(
            "w-full sm:w-auto border-4 rounded-2xl font-black",
            colorScheme?.bg,
            colorScheme?.border,
            colorScheme?.shadow,
            "text-white hover:-translate-y-0.5 active:translate-y-1",
            "transition-all duration-200"
          )}
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
