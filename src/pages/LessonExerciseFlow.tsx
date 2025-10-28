import { useState, useEffect, useMemo, useRef } from 'react';
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
import { CoquiLessonAssistantGuard } from '@/components/coqui/CoquiLessonAssistantGuard';
import { CoquiVoiceBridge } from '@/components/coqui/CoquiVoiceBridge';
import { ActivityActions } from '@/components/ActivityManagement/ActivityActions';
import { useUnitColor } from '@/hooks/useUnitColor';
import { cn } from '@/lib/utils';

export default function LessonExerciseFlow() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { colorScheme } = useUnitColor(lessonId);

  const hasInitialized = useRef(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [exerciseScores, setExerciseScores] = useState<Map<string, number>>(new Map());
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Voice session management for navigation guard
  const endSessionRef = useRef<(() => Promise<void>) | null>(null);

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
        .order('order_in_lesson', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!lessonId,
  });

  // Derive current exercise index from ID
  const currentExerciseIndex = useMemo(() => {
    if (!exercises || !currentExerciseId) return 0;
    const idx = exercises.findIndex(e => e.id === currentExerciseId);
    return idx === -1 ? 0 : idx;
  }, [exercises, currentExerciseId]);

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

  // Initialize completed exercises and scores (only once on first load)
  useEffect(() => {
    if (completedData && exercises && exercises.length > 0) {
      const completedIds = new Set(completedData.map(c => c.activity_id));
      const scores = new Map(completedData.map(c => [c.activity_id, c.score || 0]));
      
      // Always update local state from server data
      setCompletedExercises(completedIds);
      setExerciseScores(scores);

      // Only set the initial exercise position once
      if (!hasInitialized.current) {
        const firstIncomplete = exercises.find(ex => !completedIds.has(ex.id));
        
        if (!firstIncomplete) {
          // All exercises completed - show celebration
          setShowCelebration(true);
        } else {
          // Set the starting exercise by ID
          setCurrentExerciseId(firstIncomplete.id);
        }
        hasInitialized.current = true;
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
      // Optimistically update local state first
      const newCompletedSet = new Set(completedExercises);
      newCompletedSet.add(exerciseId);
      
      setCompletedExercises(newCompletedSet);
      setExerciseScores(prev => {
        const newMap = new Map(prev);
        const currentBest = newMap.get(exerciseId) || 0;
        newMap.set(exerciseId, Math.max(currentBest, score));
        return newMap;
      });

      // Determine next exercise deterministically
      const nextIncomplete = exercises.find((ex, idx) => 
        idx > currentExerciseIndex && !newCompletedSet.has(ex.id)
      );
      
      if (nextIncomplete) {
        // Found an incomplete exercise ahead - go there
        toast.success(t('¡Ejercicio completado!', 'Exercise completed!'));
        setCurrentExerciseId(nextIncomplete.id);
      } else if (currentExerciseIndex < exercises.length - 1) {
        // No incomplete ahead, but there are more exercises - go to next sequential
        toast.success(t('¡Ejercicio completado!', 'Exercise completed!'));
        setCurrentExerciseId(exercises[currentExerciseIndex + 1].id);
      } else {
        // This was the last exercise
        setShowCelebration(true);
      }

      // Save to database
      try {
        const existingScore = exerciseScores.get(exerciseId);
        if (!existingScore || score > existingScore) {
          await saveCompletionMutation.mutateAsync({ exerciseId, score });
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

  const handleBack = async () => {
    console.log('[LessonExerciseFlow] 🚦 Back button - cleaning up voice...');
    if (endSessionRef.current) {
      await endSessionRef.current();
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    navigate('/student-dashboard/lessons');
  };

  const handleReturnToDashboard = async () => {
    console.log('[LessonExerciseFlow] 🚦 Return to dashboard - cleaning up voice...');
    if (endSessionRef.current) {
      await endSessionRef.current();
    }
    await new Promise(resolve => setTimeout(resolve, 200));
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

  const defaultExerciseGuidance = `Start by greeting the Grade 1 student and summarizing the exercise "${currentExercise.title}" (${currentExercise.subtype}). Read or paraphrase any instructions or prompts from the activity content, then invite the student to try. Use a Socratic approach: offer hints instead of direct answers, model pronunciation when needed, and avoid revealing the solution unless the student is stuck.`;

  const exerciseVoiceContext = {
    title: currentExercise.title,
    subtype: currentExercise.subtype,
    language: currentExercise.language,
    voiceGuidance: currentExercise.voice_guidance ?? defaultExerciseGuidance,
    coquiDialogue: currentExercise.coqui_dialogue,
    pronunciationWords: currentExercise.pronunciation_words,
    content: currentExercise.content as Record<string, unknown> | null
  };

  const progressPercent = (completedExercises.size / exercises.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="relative h-4 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
          <div 
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              colorScheme?.bg
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className={cn(
          "text-sm font-bold mt-2 text-center",
          colorScheme?.text
        )}>
          {t(
            `Ejercicio ${currentExerciseIndex + 1} de ${exercises.length}`,
            `Exercise ${currentExerciseIndex + 1} of ${exercises.length}`
          )}
        </p>
      </div>

      {/* Exercise Navigation Menu */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {exercises.map((ex, idx) => {
          const isCurrent = ex.id === currentExerciseId;
          const isCompleted = completedExercises.has(ex.id);
          const highestCompleted = Math.max(-1, ...Array.from(completedExercises).map(id => 
            exercises.findIndex(e => e.id === id)
          ));
          const maxUnlocked = highestCompleted + 1;
          const isLocked = idx > maxUnlocked;
          
          return (
            <div key={ex.id} className="relative flex-shrink-0">
              <button
                onClick={() => !isLocked && setCurrentExerciseId(ex.id)}
                disabled={isLocked}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg",
                  "border-4 transition-all duration-200",
                  "shadow-[0_4px_0_rgba(0,0,0,0.12)]",
                  "hover:shadow-[0_6px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
                  "active:shadow-[0_2px_0_rgba(0,0,0,0.08)] active:translate-y-1",
                  isCurrent && "ring-4 ring-offset-2",
                  isCurrent && colorScheme?.border?.replace('border-', 'ring-'),
                  isCompleted 
                    ? 'bg-success border-success text-white' 
                    : isCurrent 
                      ? cn(colorScheme?.bg, colorScheme?.border, "text-white")
                      : isLocked
                        ? 'bg-gray-200 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed'
                        : cn(colorScheme?.border, "bg-white", colorScheme?.text, "hover:bg-gray-50")
                )}
                aria-label={t(`Ejercicio ${idx + 1}`, `Exercise ${idx + 1}`)}
              >
                {idx + 1}
              </button>
              {!isLocked && (
                <div className="absolute -top-1 -right-1">
                  <ActivityActions 
                    activity={{ id: ex.id, title: ex.title }} 
                    redirectPath={`/lesson/${lessonId}`}
                    size="icon"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Exercise */}
      <ExercisePlayer
        exercise={currentExercise}
        onComplete={(score, passed) => handleExerciseComplete(currentExercise.id, score, passed)}
        onExit={handleBack}
      />

      {/* Interactive Coquí Assistant */}
      <CoquiLessonAssistantGuard
        activityId={currentExercise.id}
        activityType="exercise"
        voiceContext={exerciseVoiceContext}
        autoConnect={true}
      />
      
      {/* Voice session bridge for navigation guard */}
      <CoquiVoiceBridge
        activityId={currentExercise.id}
        activityType="exercise"
        voiceContext={exerciseVoiceContext}
        endSessionRef={endSessionRef}
      />
    </div>
  );
}
