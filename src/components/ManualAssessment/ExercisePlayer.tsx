import { useState, useEffect } from 'react';
import { MultipleChoicePlayer } from './players/MultipleChoicePlayer';
import { TrueFalsePlayer } from './players/TrueFalsePlayer';
import { FillBlankPlayer } from './players/FillBlankPlayer';
import { WriteAnswerPlayer } from './players/WriteAnswerPlayer';
import { DragDropPlayer } from './players/DragDropPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { ActivityActions } from '@/components/ActivityManagement/ActivityActions';
import { useUnitColor } from '@/hooks/useUnitColor';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { VoiceVisualizationPanel } from '@/components/voice/VoiceVisualizationPanel';
import { useHasParentVisualization } from '@/contexts/VoiceVisualizationContext';
import { useCoquiSession } from '@/hooks/useCoquiSession';

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
  const { colorScheme } = useUnitColor(exercise?.id);
  const hasParentVisualization = useHasParentVisualization();
  
  // Guard against transient undefined props during transitions
  if (!exercise) {
    return null;
  }

  const { 
    isConnected, 
    isConnecting, 
    isAIPlaying, 
    frequencyData, 
    audioLevel,
    startSession,
    endSession,
    sendText,
    client
  } = useCoquiSession({
    activityId: exercise.id,
    activityType: 'exercise',
    voiceContext: { title: exercise.title, subtype: exercise.subtype }
  });

  // Auto-connect voice session when exercise loads (only if not embedded in lesson)
  useEffect(() => {
    if (exercise && !hasParentVisualization && !isConnected && !isConnecting) {
      startSession();
    }
  }, [exercise, hasParentVisualization, isConnected, isConnecting, startSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setScore(0);
    setHasCompleted(false);
  }, [exercise?.id]);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const correct = exercise.content.answers[answerIndex]?.isCorrect || false;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    const calculatedScore = correct ? 100 : 0;
    setScore(calculatedScore);

    // Trigger confetti for correct answers with unit color
    if (correct) {
      const hslMatch = colorScheme?.bg.match(/hsl\((\d+),(\d+)%,(\d+)%\)/);
      const confettiColor = hslMatch 
        ? `hsl(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%)`
        : '#ec4899'; // fallback pink
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [confettiColor, '#10b981', '#fbbf24']
      });
    }
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
            colorScheme={colorScheme}
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
            colorScheme={colorScheme}
          />
        );
      
      case 'fill_blank':
        return (
          <FillBlankPlayer
            content={exercise.content}
            onAnswer={handleDragDropAnswer}
            voiceClient={voiceClient}
            colorScheme={colorScheme}
          />
        );
      
      case 'write_answer':
        return (
          <WriteAnswerPlayer
            content={exercise.content}
            onAnswer={handleWriteAnswer}
            voiceClient={voiceClient}
            colorScheme={colorScheme}
          />
        );
      
      case 'drag_drop':
        return (
          <DragDropPlayer
            content={exercise.content}
            onAnswer={handleDragDropAnswer}
            voiceClient={voiceClient}
            colorScheme={colorScheme}
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
    <div className="space-y-6 animate-fade-in">
      {/* Header with Back Button */}
      <div className={cn(
        "rounded-2xl border-4 p-6",
        colorScheme?.border,
        colorScheme?.bg,
        colorScheme?.shadow,
        "flex items-center justify-between"
      )}>
        <Button 
          onClick={onExit} 
          variant="outline" 
          size="sm"
          className="bg-white border-2 border-white/50 hover:bg-white/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('Volver', 'Back')}
        </Button>
        <h2 className="text-2xl font-black text-white">{exercise.title}</h2>
        <ActivityActions 
          activity={{ id: exercise.id, title: exercise.title }} 
          redirectPath={window.location.pathname.split('/exercises')[0] || '/student-dashboard'}
          size="sm"
        />
      </div>

      {/* Question Display */}
      {exercise.content.question && (
        <Card className={cn(
          "rounded-2xl border-4",
          colorScheme?.border,
          "bg-white"
        )}>
          <CardContent className="p-6">
            <h3 className={cn(
              "text-xl sm:text-3xl font-bold mb-4",
              colorScheme?.text
            )}>
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
                <Button 
                  onClick={handleComplete} 
                  size="lg" 
                  className={cn(
                    "flex-1 rounded-2xl border-4 font-black text-lg py-6",
                    "shadow-[0_4px_0_rgba(0,0,0,0.12)]",
                    "hover:shadow-[0_6px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
                    "active:shadow-[0_2px_0_rgba(0,0,0,0.08)] active:translate-y-1",
                    "transition-all duration-200",
                    colorScheme?.bg,
                    colorScheme?.border,
                    "text-white"
                  )}
                >
                  {t('Continuar', 'Continue')}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleRetry} 
                    size="lg" 
                    className="flex-1 rounded-2xl border-4 border-primary bg-background text-primary font-black text-lg py-6 hover:bg-primary/5"
                  >
                    {t('Intentar de Nuevo', 'Try Again')}
                  </Button>
                  <Button 
                    onClick={onExit} 
                    size="lg" 
                    className="flex-1 rounded-2xl border-4 bg-destructive border-destructive text-white font-black text-lg py-6 hover:bg-destructive/90"
                  >
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
