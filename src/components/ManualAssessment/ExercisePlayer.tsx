import { useState } from 'react';
import { MultipleChoicePlayer } from './players/MultipleChoicePlayer';
import { TrueFalsePlayer } from './players/TrueFalsePlayer';
import { FillBlankPlayer } from './players/FillBlankPlayer';
import { WriteAnswerPlayer } from './players/WriteAnswerPlayer';
import { DragDropPlayer } from './players/DragDropPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  content: any;
  subtype: string;
  passing_score: number;
  enable_voice?: boolean;
  auto_read_question?: boolean;
}

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: (score: number, passed: boolean) => void;
  onExit: () => void;
  voiceClient?: any;
}

export function ExercisePlayer({ exercise, onComplete, onExit, voiceClient }: ExercisePlayerProps) {
  const { t } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const correct = exercise.content.answers[answerIndex]?.isCorrect || false;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    const calculatedScore = correct ? 100 : 0;
    setScore(calculatedScore);
  };

  const handleDragDropAnswer = (answer: string, correct: boolean) => {
    setIsCorrect(correct);
    setShowFeedback(true);
    const calculatedScore = correct ? 100 : 0;
    setScore(calculatedScore);
  };

  const handleWriteAnswer = (answer: string) => {
    // For write_answer, we'll consider it correct if they submit something
    // In a real scenario, this would need AI evaluation or teacher review
    const calculatedScore = answer.trim().length > 0 ? 100 : 0;
    setIsCorrect(calculatedScore === 100);
    setShowFeedback(true);
    setScore(calculatedScore);
  };

  const handleComplete = () => {
    const passed = score >= (exercise.passing_score || 70);
    setHasCompleted(true);
    onComplete(score, passed);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setScore(0);
    setHasCompleted(false);
  };

  const renderPlayer = () => {
    switch (exercise.subtype) {
      case 'multiple_choice':
        return (
          <MultipleChoicePlayer
            content={exercise.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        );
      
      case 'true_false':
        return (
          <TrueFalsePlayer
            content={exercise.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        );
      
      case 'fill_blank':
        return (
          <FillBlankPlayer
            content={exercise.content}
            onAnswer={handleDragDropAnswer}
            voiceClient={voiceClient}
          />
        );
      
      case 'write_answer':
        return (
          <WriteAnswerPlayer
            content={exercise.content}
            onAnswer={handleWriteAnswer}
            voiceClient={voiceClient}
          />
        );
      
      case 'drag_drop':
        return (
          <DragDropPlayer
            content={exercise.content}
            onAnswer={handleDragDropAnswer}
            voiceClient={voiceClient}
          />
        );
      
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">
                {t('Tipo de ejercicio no soportado', 'Exercise type not supported')}: {exercise.subtype}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const passed = score >= (exercise.passing_score || 70);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button onClick={onExit} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('Volver', 'Back')}
        </Button>
        <h2 className="text-2xl font-bold">{exercise.title}</h2>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Question Display */}
      {exercise.content.question && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl sm:text-3xl font-semibold mb-4">
              {exercise.content.question}
            </h3>
            {exercise.content.questionImage && (
              <img
                src={exercise.content.questionImage}
                alt={t('Imagen de la pregunta', 'Question image')}
                className="max-h-64 mx-auto rounded-lg border-2 object-contain"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Exercise Player */}
      {renderPlayer()}

      {/* Feedback and Actions */}
      {showFeedback && (
        <Card className={passed ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {passed ? (
                <CheckCircle2 className="h-8 w-8 text-success" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
              <div>
                <h3 className="text-2xl font-bold">
                  {passed 
                    ? t('¡Correcto!', 'Correct!') 
                    : t('Necesitas mejorar', 'Need to improve')}
                </h3>
                <p className="text-lg">
                  {t('Puntuación:', 'Score:')} {score}% 
                  {!passed && ` (${t('Mínimo requerido:', 'Minimum required:')} ${exercise.passing_score || 70}%)`}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {passed ? (
                <Button onClick={handleComplete} size="lg" className="flex-1">
                  {t('Continuar', 'Continue')}
                </Button>
              ) : (
                <>
                  <Button onClick={handleRetry} variant="outline" size="lg" className="flex-1">
                    {t('Intentar de Nuevo', 'Try Again')}
                  </Button>
                  <Button onClick={onExit} variant="secondary" size="lg" className="flex-1">
                    {t('Salir', 'Exit')}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
