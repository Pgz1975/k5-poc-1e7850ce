import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Loader2 } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function ViewAssessment() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { connect, sendText, isConnected, isAIPlaying, disconnect } = useRealtimeVoice({
    studentId: user?.id || 'demo',
    language: assessment?.language === 'es' ? 'es-PR' : 'en-US',
    model: 'gpt-4o-realtime-preview-2024-12-17',
    onTranscription: (text, isUser) => {
      console.log(`Voice: ${text}`);
    }
  });

  useEffect(() => {
    const fetchAssessment = async () => {
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
    };

    if (id) fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (assessment && !isConnected) {
      connect().then(() => {
        if (assessment.voice_guidance) {
          sendText(assessment.voice_guidance);
          setTimeout(() => {
            sendText(assessment.content.question);
          }, 2000);
        } else {
          sendText(assessment.content.question);
        }
      });
    }

    return () => disconnect();
  }, [assessment]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = assessment.content.answers[index].isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);

    const language = assessment.language;
    if (correct) {
      sendText(
        language === 'es'
          ? '¡Excelente! Respuesta correcta.'
          : 'Excellent! Correct answer.'
      );
    } else {
      sendText(
        language === 'es'
          ? 'Inténtalo de nuevo. Piensa un poco más.'
          : 'Try again. Think a little more.'
      );
    }
  };

  const getCoquiState = () => {
    if (isAIPlaying) return 'speaking';
    if (showFeedback) {
      return isCorrect ? 'celebration' : 'neutral';
    }
    return 'thinking';
  };

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
        {/* Voice Status */}
        <div className="flex justify-between items-center mb-6">
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? '🔊 ' + t("Voz Activa", "Voice Active") : '🔇 ' + t("Voz Inactiva", "Voice Inactive")}
          </Badge>

          {isAIPlaying && (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <Volume2 className="h-5 w-5" />
              <span className="font-medium">
                {t("Coquí está hablando...", "Coquí is speaking...")}
              </span>
            </div>
          )}
        </div>

        {/* Question */}
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

        {/* Answers */}
        <div className="space-y-4 mb-8">
          {assessment.content.answers.map((answer: any, index: number) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`w-full text-2xl p-8 justify-start ${
                showFeedback && selectedAnswer === index
                  ? isCorrect
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                  : ''
              }`}
              variant={showFeedback && selectedAnswer === index ? 'default' : 'outline'}
            >
              <span className="font-bold mr-4">{String.fromCharCode(65 + index)})</span>
              <div className="flex-1 text-left">
                {answer.text}
                {answer.imageUrl && (
                  <img
                    src={answer.imageUrl}
                    alt={`Answer ${index + 1}`}
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Coquí Mascot */}
        <div className="flex justify-center">
          <CoquiMascot state={getCoquiState()} size="large" />
        </div>

        {/* Feedback */}
        {showFeedback && (
          <Card className={`p-6 mt-6 ${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
            <p className="text-2xl font-bold text-center">
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
