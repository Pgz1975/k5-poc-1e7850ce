import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExercisePlayer } from '@/components/ManualAssessment/ExercisePlayer';
import { LessonCompletionScreen } from '@/components/LessonCompletion/LessonCompletionScreen';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LessonExerciseFlow() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [exerciseScores, setExerciseScores] = useState<Map<string, number>>(new Map());
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch lesson details
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // Fetch all exercises for this lesson
  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ['lesson-exercises', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('parent_lesson_id', lessonId)
        .order('order_in_lesson');

      if (error) throw error;
      return data || [];
    },
    enabled: !!lessonId,
  });

  // Fetch completed exercises
  const { data: completedData } = useQuery({
    queryKey: ['completed-exercises', lessonId, user?.id],
    queryFn: async () => {
      if (!user?.id || !exercises) return [];

      const { data, error } = await supabase
        .from('completed_activity')
        .select('activity_id, score')
        .eq('student_id', user.id)
        .eq('activity_type', 'exercise')
        .in('activity_id', exercises.map(e => e.id));

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!exercises && exercises.length > 0,
  });

  // Initialize completed exercises and scores
  useEffect(() => {
    if (completedData) {
      const completedIds = new Set(completedData.map(c => c.activity_id));
      const scores = new Map(completedData.map(c => [c.activity_id, c.score || 0]));
      
      setCompletedExercises(completedIds);
      setExerciseScores(scores);

      // Find first incomplete exercise
      if (exercises) {
        const firstIncomplete = exercises.findIndex(ex => !completedIds.has(ex.id));
        
        if (firstIncomplete === -1) {
          // All exercises completed - show celebration
          setShowCelebration(true);
        } else {
          setCurrentExerciseIndex(firstIncomplete);
        }
      }
    }
  }, [completedData, exercises]);

  // Mutation to save exercise completion
  const saveCompletionMutation = useMutation({
    mutationFn: async ({ exerciseId, score }: { exerciseId: string; score: number }) => {
      const { error } = await supabase
        .from('completed_activity')
        .upsert({
          student_id: user!.id,
          activity_id: exerciseId,
          activity_type: 'exercise',
          score: score,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-exercises'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-exercise-progress'] });
    },
  });

  const handleExerciseComplete = async (exerciseId: string, score: number, passed: boolean) => {
    if (!exercises) return;

    const exercise = exercises[currentExerciseIndex];

    if (passed) {
      try {
        // Check if we should update (only if new score is better)
        const existingScore = exerciseScores.get(exerciseId);
        
        if (!existingScore || score > existingScore) {
          await saveCompletionMutation.mutateAsync({ exerciseId, score });
        }
        
        // ALWAYS update local state when passed (regardless of score comparison)
        setCompletedExercises(prev => new Set(prev).add(exerciseId));
        setExerciseScores(prev => {
          const newMap = new Map(prev);
          const currentBest = newMap.get(exerciseId) || 0;
          newMap.set(exerciseId, Math.max(currentBest, score));
          return newMap;
        });

        // Move to next exercise or show celebration
        if (currentExerciseIndex < exercises.length - 1) {
          toast.success(t('¡Ejercicio completado!', 'Exercise completed!'));
          // Small delay to show toast before switching
          setTimeout(() => {
            setCurrentExerciseIndex(prev => prev + 1);
          }, 500);
        } else {
          setShowCelebration(true);
        }
      } catch (error) {
        console.error('Error saving exercise completion:', error);
        toast.error(t('Error al guardar el progreso', 'Error saving progress'));
      }
    } else {
      toast.error(t(
        `Necesitas al menos ${exercise.passing_score || 70}% para continuar`,
        `You need at least ${exercise.passing_score || 70}% to continue`
      ));
    }
  };

  const handleBack = () => {
    navigate('/student-dashboard/lessons');
  };

  const handleReturnToDashboard = () => {
    navigate('/student-dashboard/lessons');
  };

  if (lessonLoading || exercisesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lesson || !exercises || exercises.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-muted-foreground">
          {t('No se encontraron ejercicios para esta lección', 'No exercises found for this lesson')}
        </p>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <LessonCompletionScreen
        lesson={lesson}
        exercises={exercises}
        exerciseScores={exerciseScores}
        onReturn={handleReturnToDashboard}
      />
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const progressPercent = (completedExercises.size / exercises.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <Progress value={progressPercent} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {t(
            `Ejercicio ${currentExerciseIndex + 1} de ${exercises.length}`,
            `Exercise ${currentExerciseIndex + 1} of ${exercises.length}`
          )}
        </p>
      </div>

      {/* Exercise Navigation Menu */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {exercises.map((ex, idx) => (
          <button
            key={ex.id}
            onClick={() => idx <= currentExerciseIndex && setCurrentExerciseIndex(idx)}
            disabled={idx > currentExerciseIndex}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold
              transition-all flex-shrink-0
              ${completedExercises.has(ex.id) 
                ? 'bg-success text-success-foreground' 
                : idx === currentExerciseIndex 
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' 
                  : idx > currentExerciseIndex
                    ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
            aria-label={t(`Ejercicio ${idx + 1}`, `Exercise ${idx + 1}`)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Current Exercise */}
      <ExercisePlayer
        exercise={currentExercise}
        onComplete={(score, passed) => handleExerciseComplete(currentExercise.id, score, passed)}
        onExit={handleBack}
      />
    </div>
  );
}
