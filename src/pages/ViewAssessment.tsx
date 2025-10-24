import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Loader2 } from 'lucide-react';
import CoquiMascot from '@/components/CoquiMascot';
import { FillBlankPlayer } from '@/components/ManualAssessment/players/FillBlankPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedRealtimeClient } from '@/utils/EnhancedRealtimeClient';
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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const clientRef = useRef<EnhancedRealtimeClient | null>(null);

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

  const startVoiceSession = async () => {
    if (isConnected || isLoading || !assessment) return;

    setIsLoading(true);
    try {
      const client = new EnhancedRealtimeClient({
        studentId: user?.id || 'demo',
        language: assessment?.language === 'es' ? 'es-PR' : 'en',
        gradeLevel: 0,
        assessmentId: id,
        voiceGuidance: assessment?.voice_guidance,
        onTranscription: (text, isUser) => {
          setTranscript(prev => [...prev, `${isUser ? '👦' : '🤖'} ${text}`]);
        },
        onEvent: (event) => {
          if (event.type === 'response.audio.delta') setIsAIPlaying(true);
          if (event.type === 'response.done') setIsAIPlaying(false);
        },
        onMetrics: setMetrics
      });

      await client.connect();
      clientRef.current = client;
      setIsConnected(true);

      setTimeout(() => {
        if (assessment?.content?.question) {
          client.sendText(assessment.content.question);
        }
      }, 1000);
    } catch (error) {
      console.error('Voice connection failed:', error);
      toast({
        title: t("Error", "Error"),
        description: t("No se pudo conectar la voz", "Could not connect voice"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assessment && !isConnected && !isLoading) {
      startVoiceSession();
    }
    return () => {
      clientRef.current?.disconnect();
    };
  }, [assessment]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = assessment.content.answers[index].isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);

    const language = assessment.language;
    if (clientRef.current) {
      if (correct) {
        clientRef.current.sendText(
          language === 'es'
            ? '¡Excelente! Respuesta correcta. ¡Wepa!'
            : 'Excellent! Correct answer!'
        );
      } else {
        clientRef.current.sendText(
          language === 'es'
            ? 'Casi lo tienes, vamos a intentarlo otra vez.'
            : 'Almost there! Let\'s try again.'
        );
      }
    }
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

        {/* Quick Action Buttons */}
        {isConnected && (
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => clientRef.current?.sendText('Necesito ayuda')}
            >
              🆘 {t("Ayuda", "Help")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => clientRef.current?.sendText('Repite por favor')}
            >
              🔁 {t("Repetir", "Repeat")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => clientRef.current?.sendText('Más despacio')}
            >
              🐢 {t("Más Lento", "Slower")}
            </Button>
          </div>
        )}

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

        {/* Type-Specific Players */}
        {assessment.subtype === 'fill_blank' ? (
          <FillBlankPlayer
            content={normalizeFillBlank(assessment.content)}
            onAnswer={(answer, correct) => {
              setIsCorrect(correct);
              setShowFeedback(true);
              if (clientRef.current) {
                if (correct) {
                  clientRef.current.sendText(t("¡Excelente! Formaste la palabra correctamente.", "Excellent! You formed the word correctly."));
                } else {
                  clientRef.current.sendText(t("Intenta de nuevo. Revisa las letras.", "Try again. Check the letters."));
                }
              }
            }}
            voiceClient={clientRef.current}
          />
        ) : (
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
        )}

        {/* Coquí Mascot */}
        <div className="flex justify-center">
          <CoquiMascot state={getCoquiState()} size="large" />
        </div>

        {/* Transcript Section */}
        <Card className="mb-6 p-6 max-h-64 overflow-y-auto">
          <h3 className="font-semibold mb-4">{t("Conversación", "Conversation")}</h3>
          {transcript.length === 0 ? (
            <p className="text-gray-500 italic">
              {t("La conversación aparecerá aquí...", "The conversation will appear here...")}
            </p>
          ) : (
            <div className="space-y-2">
              {transcript.map((line, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    line.startsWith('👦') ? 'bg-blue-100' : 'bg-green-100'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </Card>

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

        {/* Performance Metrics */}
        {isConnected && metrics.avgLatency !== undefined && (
          <Card className="p-4 mt-6">
            <h3 className="font-semibold mb-4">{t("Métricas de Rendimiento", "Performance Metrics")}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(metrics.avgLatency)}ms
                </div>
                <div className="text-sm text-gray-600">{t("Latencia", "Latency")}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.interactions || 0}
                </div>
                <div className="text-sm text-gray-600">{t("Interacciones", "Interactions")}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(metrics.uptime / 1000)}s
                </div>
                <div className="text-sm text-gray-600">{t("Duración", "Duration")}</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
