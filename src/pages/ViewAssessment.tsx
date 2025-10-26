import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';
import { CoquiLessonAssistant } from '@/components/coqui/CoquiLessonAssistant';
import { MultipleChoicePlayer } from '@/components/ManualAssessment/players/MultipleChoicePlayer';
import { TrueFalsePlayer } from '@/components/ManualAssessment/players/TrueFalsePlayer';
import { FillBlankPlayer } from '@/components/ManualAssessment/players/FillBlankPlayer';
import { WriteAnswerPlayer } from '@/components/ManualAssessment/players/WriteAnswerPlayer';
import { DragDropPlayer } from '@/components/ManualAssessment/players/DragDropPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function ViewAssessment() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPreConnecting, setIsPreConnecting] = useState(false);
  const [showExercise, setShowExercise] = useState(false);

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


  // Show loading screen while pre-connecting
  if (isPreConnecting || !showExercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <CoquiMascot 
            state={isPreConnecting ? "loading" : "thinking"} 
            size="large" 
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {t("Preparando tu ejercicio...", "Preparing your exercise...")}
            </h2>
            <p className="text-muted-foreground">
              {isPreConnecting 
                ? t("Conectando con Coquí...", "Connecting with Coquí...")
                : t("Cargando contenido...", "Loading content...")}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 to-background">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-background">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
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


        {/* Question - Only for multiple choice and true/false */}
        {assessment.subtype !== 'fill_blank' && 
         assessment.subtype !== 'write_answer' && 
         assessment.subtype !== 'drag_drop' && (
          <Card className="p-8 mb-6">
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

        {/* Type-Specific Players */}
        {assessment.subtype === 'multiple_choice' && (
          <MultipleChoicePlayer
            content={assessment.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
        )}

        {assessment.subtype === 'true_false' && (
          <TrueFalsePlayer
            content={assessment.content}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
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
          />
        )}

        {/* Coquí Assistant - Single voice stack */}
        {assessment && (
          <CoquiLessonAssistant
            activityId={assessment.id}
            activityType="exercise"
            voiceContext={{
              title: assessment.title,
              subtype: assessment.assessment_type,
              language: assessment.language,
              voiceGuidance: assessment.voice_guidance,
              content: assessment.content
            }}
            autoConnect={true}
            isConnecting={isPreConnecting}
            position="fixed"
          />
        )}

        {/* Feedback */}
        {showFeedback && (
          <Card className={`p-6 mt-6 ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
            <p className="text-2xl font-bold text-center mb-4">
              {isCorrect
                ? t("¡Correcto! ¡Excelente trabajo!", "Correct! Excellent work!")
                : t("Intenta de nuevo", "Try again")}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
