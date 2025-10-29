import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';
import { MultipleChoicePlayer } from '@/components/ManualAssessment/players/MultipleChoicePlayer';
import { TrueFalsePlayer } from '@/components/ManualAssessment/players/TrueFalsePlayer';
import { FillBlankPlayer } from '@/components/ManualAssessment/players/FillBlankPlayer';
import { WriteAnswerPlayer } from '@/components/ManualAssessment/players/WriteAnswerPlayer';
import { DragDropPlayer } from '@/components/ManualAssessment/players/DragDropPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useDesignVersion } from '@/hooks/useDesignVersion';
import { useUnitColor } from '@/hooks/useUnitColor';
import { VoiceVisualizationPanel } from '@/components/voice/VoiceVisualizationPanel';
import { useCoquiSession } from '@/hooks/useCoquiSession';
import { CoquiVoiceBridge } from '@/components/coqui/CoquiVoiceBridge';

export default function ViewAssessment() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { useV2Design } = useDesignVersion();
  const [assessment, setAssessment] = useState<any>(null);
  const { colorScheme } = useUnitColor(assessment?.id);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPreConnecting, setIsPreConnecting] = useState(false);
  const [showExercise, setShowExercise] = useState(false);

  // Voice session for audio visualization
  const { 
    isConnected, 
    isConnecting, 
    isAIPlaying, 
    frequencyData, 
    audioLevel 
  } = useCoquiSession({
    activityId: id || '',
    activityType: 'exercise',
    voiceContext: assessment ? {
      title: assessment.title,
      subtype: assessment.assessment_type,
      language: assessment.language,
      voiceGuidance: assessment.voice_guidance,
      content: assessment.content
    } : undefined
  });

  useEffect(() => {
    const fetchAssessment = async () => {
      setIsPreConnecting(true);
      
      const { data, error } = await supabase
        .from('manual_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Fetch error:', error);
        toast({
          title: t("Error", "Error"),
          description: t("No se pudo cargar el ejercicio", "Could not load exercise"),
          variant: 'destructive'
        });
        return;
      }

      setAssessment(data);
      
      // Small delay to let CoquiLessonAssistant mount and auto-connect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowExercise(true);
      setIsPreConnecting(false);
    };

    if (id) fetchAssessment();
  }, [id, toast, t]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = assessment.content.answers[index].isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  // Normalize fill_blank content for backward compatibility
  const normalizeFillBlank = (content: any) => {
    // If already new format, return as is
    if (content.target && content.letters) {
      return {
        mode: 'single_word' as const,
        prompt: content.prompt || '',
        target: content.target,
        letters: content.letters,
        imageUrl: content.imageUrl || content.questionImage,
        autoShuffle: content.autoShuffle ?? true
      };
    }

    // Legacy format: extract from question and answers
    const target = content.answers?.find((a: any) => a.correct)?.text || '';
    const lettersMatch = content.question?.match(/\[(.*?)\]/);
    const letters = lettersMatch?.[1]?.split(',').map((l: string) => l.trim()) || [];
    
    return {
      mode: 'single_word' as const,
      prompt: content.question?.replace(/\[.*?\]/, '').trim() || '',
      target,
      letters,
      imageUrl: content.questionImage,
      autoShuffle: true
    };
  };


  // Early return only if assessment hasn't loaded yet
  if (!assessment) {
    return (
      <div className={useV2Design ? "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" : "min-h-screen bg-gradient-to-b from-accent/20 to-background"}>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Once assessment is loaded, show overlay instead of early return
  const showOverlay = isPreConnecting || !showExercise;

  return (
    <div className={useV2Design ? "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative" : "min-h-screen bg-gradient-to-b from-accent/20 to-background relative"}>
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-4xl relative">
        {/* Activity Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {assessment.title}
          </h1>
          {assessment.type && (
            <Badge variant="outline" className="text-sm">
              {assessment.type === 'lesson' && t("Lección", "Lesson")}
              {assessment.type === 'exercise' && t("Ejercicio", "Exercise")}
              {assessment.type === 'assessment' && t("Evaluación", "Assessment")}
            </Badge>
          )}
        </div>

        {/* Audio Waveform + Mascot Panel */}
        <div className="mb-6">
          <VoiceVisualizationPanel
            isConnected={isConnected}
            isConnecting={isConnecting}
            isAIPlaying={isAIPlaying}
            frequencyData={frequencyData}
            audioLevel={audioLevel}
          />
        </div>


        {/* Question - Only for multiple choice and true/false */}
        {assessment.subtype !== 'fill_blank' && 
         assessment.subtype !== 'write_answer' && 
         assessment.subtype !== 'drag_drop' && (
          <div className={useV2Design ? `rounded-2xl border-4 ${colorScheme.border} ${colorScheme.shadow} bg-white p-8 mb-6` : "mb-6"}>
            {useV2Design ? (
              <>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  {assessment.content.question}
                </h2>
                {assessment.content.questionImage && (
                  <img
                    src={assessment.content.questionImage}
                    alt="Question"
                    className="w-full max-h-96 object-contain rounded-xl mb-4"
                  />
                )}
              </>
            ) : (
              <Card className="p-8">
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  {assessment.content.question}
                </h2>
                {assessment.content.questionImage && (
                  <img
                    src={assessment.content.questionImage}
                    alt="Question"
                    className="w-full max-h-96 object-contain rounded border-2 mb-4"
                  />
                )}
              </Card>
            )}
          </div>
        )}

        {/* Type-Specific Players */}
        {assessment.subtype === 'multiple_choice' && (
          <MultipleChoicePlayer
            content={assessment.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            colorScheme={useV2Design ? colorScheme : undefined}
          />
        )}

        {assessment.subtype === 'true_false' && (
          <TrueFalsePlayer
            content={assessment.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            colorScheme={useV2Design ? colorScheme : undefined}
          />
        )}

        {assessment.subtype === 'fill_blank' && (
          <FillBlankPlayer
            content={normalizeFillBlank(assessment.content)}
            onAnswer={(answer, correct) => {
              setIsCorrect(correct);
              setShowFeedback(true);
            }}
            voiceClient={null}
            colorScheme={useV2Design ? colorScheme : undefined}
          />
        )}

        {assessment.subtype === 'write_answer' && (
          <WriteAnswerPlayer
            content={assessment.content}
            onAnswer={(answer, correct) => {
              setIsCorrect(correct);
              setShowFeedback(true);
            }}
            voiceClient={null}
            colorScheme={useV2Design ? colorScheme : undefined}
          />
        )}

        {assessment.subtype === 'drag_drop' && assessment.content && (
          <DragDropPlayer
            content={assessment.content}
            onAnswer={(answer, correct) => {
              setIsCorrect(correct);
              setShowFeedback(true);
            }}
            voiceClient={null}
            colorScheme={useV2Design ? colorScheme : undefined}
          />
        )}

        {/* Voice session bridge for cleanup */}
        <CoquiVoiceBridge
          activityId={assessment.id}
          activityType="exercise"
          voiceContext={{
            title: assessment.title,
            subtype: assessment.assessment_type,
            language: assessment.language,
            voiceGuidance: assessment.voice_guidance,
            content: assessment.content
          }}
          endSessionRef={{ current: null }}
        />

        {/* Feedback */}
        {showFeedback && (
          <div className={useV2Design 
            ? `rounded-2xl border-4 p-6 mt-6 ${isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`
            : ""
          }>
            {useV2Design ? (
              <p className="text-2xl font-bold text-center mb-4 text-gray-800">
                {isCorrect
                  ? t("¡Correcto! ¡Excelente trabajo!", "Correct! Excellent work!")
                  : t("Intenta de nuevo", "Try again")}
              </p>
            ) : (
              <Card className={`p-6 ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
                <p className="text-2xl font-bold text-center mb-4">
                  {isCorrect
                    ? t("¡Correcto! ¡Excelente trabajo!", "Correct! Excellent work!")
                    : t("Intenta de nuevo", "Try again")}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Loading Overlay - covers content but doesn't unmount components */}
        {showOverlay && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50/95 via-green-50/95 to-blue-50/95 dark:from-yellow-900/95 dark:via-green-900/95 dark:to-blue-900/95">
            <div className="text-center space-y-6">
              <CoquiMascot state="loading" size="large" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("Preparando tu ejercicio...", "Preparing your exercise...")}
                </h2>
                <p className="text-muted-foreground">
                  {t("Conectando con Coquí...", "Connecting with Coquí...")}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
