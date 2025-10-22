import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedRealtimeClient } from '@/utils/EnhancedRealtimeClient';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, HelpCircle, RotateCcw, Gauge, Star, Sparkles } from 'lucide-react';
import CoquiMascot from './CoquiMascot';

interface VoiceAssessmentProps {
  assessmentId: string;
  studentId: string;
  language?: 'es-PR' | 'en-US';
  gradeLevel?: number;
}

interface Transcript {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function VoiceAssessment({ 
  assessmentId, 
  studentId, 
  language = 'es-PR',
  gradeLevel 
}: VoiceAssessmentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const clientRef = useRef<EnhancedRealtimeClient | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Get ephemeral token from edge function
      const { data, error } = await supabase.functions.invoke('realtime-token-enhanced', {
        body: {
          language,
          assessmentId,
          studentId,
          gradeLevel,
        },
      });

      if (error) throw error;

      if (!data?.client_secret?.value) {
        throw new Error('No token received');
      }

      // Create and connect client
      const client = new EnhancedRealtimeClient({
        sessionId: crypto.randomUUID(),
        studentId,
        assessmentId,
        onMessage: (msg) => {
          console.log('Message:', msg.type);
          if (msg.type === 'response.audio.delta') {
            setIsAISpeaking(true);
          } else if (msg.type === 'response.audio.done') {
            setIsAISpeaking(false);
          }
        },
        onTranscript: (text, isUser) => {
          setTranscripts(prev => [...prev, { text, isUser, timestamp: new Date() }]);
        },
        onConnectionChange: (connected) => {
          setIsConnected(connected);
          if (connected) {
            toast({
              title: language === 'es-PR' ? '¡Conectado!' : 'Connected!',
              description: language === 'es-PR' 
                ? 'Ya puedes hablar con Coquí' 
                : 'You can now talk to Coquí',
            });
          }
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        },
      });

      await client.connect(data.client_secret.value);
      clientRef.current = client;

    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Error de Conexión',
        description: error instanceof Error ? error.message : 'No se pudo conectar',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect();
      clientRef.current = null;
    }
    setTranscripts([]);
  };

  const handleQuickAction = (action: 'help' | 'repeat' | 'slower') => {
    if (!clientRef.current?.isConnected()) return;

    const messages = {
      'help': language === 'es-PR' 
        ? 'Ayúdame con esto, por favor' 
        : 'Help me with this please',
      'repeat': language === 'es-PR' 
        ? '¿Puedes repetir eso?' 
        : 'Can you repeat that?',
      'slower': language === 'es-PR' 
        ? 'Más lento, por favor' 
        : 'Slower please',
    };

    clientRef.current.sendText(messages[action]);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Trigger celebration on achievements (example: after 5 interactions)
  useEffect(() => {
    if (transcripts.length > 0 && transcripts.length % 5 === 0) {
      triggerCelebration();
    }
  }, [transcripts.length]);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  const metrics = clientRef.current?.getMetrics();
  const avgLatency = metrics?.latency.length 
    ? Math.round(metrics.latency.reduce((a, b) => a + b, 0) / metrics.latency.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Connection Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isConnected ? (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {isConnecting 
                    ? (language === 'es-PR' ? 'Conectando...' : 'Connecting...') 
                    : (language === 'es-PR' ? 'Empezar a Hablar' : 'Start Speaking')}
                </Button>
              ) : (
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  size="lg"
                >
                  <MicOff className="h-5 w-5 mr-2" />
                  {language === 'es-PR' ? 'Terminar' : 'Stop'}
                </Button>
              )}

              {isConnected && (
                <Badge variant={isAISpeaking ? 'default' : 'secondary'} className="animate-pulse">
                  {isAISpeaking 
                    ? (language === 'es-PR' ? 'Coquí está hablando...' : 'Coquí is speaking...') 
                    : (language === 'es-PR' ? 'Escuchando...' : 'Listening...')}
                </Badge>
              )}
            </div>

            {/* Performance Metrics */}
            {isConnected && metrics && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <span>{avgLatency}ms</span>
                <Star className="h-4 w-4 ml-2" />
                <span>{metrics.interactions} interacciones</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {isConnected && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleQuickAction('help')}
                variant="outline"
                size="sm"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {language === 'es-PR' ? 'Ayuda' : 'Help'}
              </Button>
              <Button
                onClick={() => handleQuickAction('repeat')}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {language === 'es-PR' ? 'Repetir' : 'Repeat'}
              </Button>
              <Button
                onClick={() => handleQuickAction('slower')}
                variant="outline"
                size="sm"
              >
                <Gauge className="h-4 w-4 mr-2" />
                {language === 'es-PR' ? 'Más Lento' : 'Slower'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transcripts */}
      {transcripts.length > 0 && (
        <Card>
          <CardContent className="p-4 max-h-96 overflow-y-auto space-y-2">
            {transcripts.map((t, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  t.isUser 
                    ? 'bg-blue-500/10 border-l-4 border-blue-500 ml-8' 
                    : 'bg-green-500/10 border-l-4 border-green-500 mr-8'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium">
                    {t.isUser 
                      ? (language === 'es-PR' ? 'Tú' : 'You') 
                      : 'Coquí'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{t.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Coqui Mascot */}
      <div className="fixed bottom-8 right-8">
        <CoquiMascot
          state={
            showCelebration ? 'celebration' : 
            isAISpeaking ? 'speaking' : 
            isConnected ? 'reading' : 
            'waiting'
          }
          position="bottom-right"
          size="large"
          animate={isConnected ? 'breathe' : 'none'}
        />
      </div>

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">
            <Sparkles className="h-24 w-24 text-yellow-400" />
          </div>
        </div>
      )}
    </div>
  );
}
