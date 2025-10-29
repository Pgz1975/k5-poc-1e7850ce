import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import { useCoquiSession } from "@/hooks/useCoquiSession";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoquiClickHint } from "./CoquiClickHint";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

export const CoquiVoiceChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mascotState, setMascotState] = useState("waiting");
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dashboard-specific voice guidance
  const dashboardGuidance = language === 'es' 
    ? `Eres Coquí, el amigo y guía oficial de la plataforma educativa LecturaPR. 

IMPORTANTE - ACENTO: Usa acento puertorriqueño natural y cálido.

Tu rol es dar la bienvenida a estudiantes de Kindergarten a 5to grado y explicarles brevemente cómo usar la plataforma.

SALUDO INICIAL (di esto cuando conectes):
"¡Hola! Soy Coquí, tu amigo. Aquí puedes aprender en Lecciones, practicar en Ejercicios, y hacer Evaluaciones cuando estés listo. ¿Tienes alguna pregunta?"

TONO: Amigable, breve, entusiasta pero no abrumador.
EDAD: Recuerda que hablas con niños de 4 a 11 años.
RESPUESTAS: Responde preguntas sobre la plataforma de forma simple y clara.`
    : `You are Coquí, the official friend and guide for the LecturaPR educational platform.

IMPORTANT - ACCENT: Use warm, clear American English.

Your role is to welcome students from Kindergarten to 5th grade and briefly explain how to use the platform.

INITIAL GREETING (say this when you connect):
"Hello! I'm Coquí, your friend. Here you can learn in Lessons, practice in Exercises, and take Assessments when you're ready. Do you have any questions?"

TONE: Friendly, brief, enthusiastic but not overwhelming.
AGE: Remember you're speaking to children ages 4 to 11.
RESPONSES: Answer questions about the platform in simple, clear language.`;

  // Use simplified session hook with dashboard context
  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    startSession,
    endSession
  } = useCoquiSession({
    activityId: 'dashboard-intro',
    activityType: 'system',
    voiceContext: {
      title: 'Dashboard Introduction',
      language: language === 'es' ? 'es-PR' : 'en-US',
      voiceGuidance: dashboardGuidance
    }
  });

  // Convert transcript array to messages
  useEffect(() => {
    const newMessages: Message[] = transcript.map(t => ({
      text: t.text,
      isUser: t.isUser,
      timestamp: Date.now()
    }));
    setMessages(newMessages);
  }, [transcript]);

  // Update mascot based on audio playback and connection state
  useEffect(() => {
    if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected) {
      setMascotState('thinking');
    } else {
      setMascotState('waiting');
    }
  }, [isAIPlaying, isConnected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup: End session when leaving the page
  useEffect(() => {
    return () => {
      if (isConnected) {
        console.log('[CoquiVoiceChat] 🧹 Cleanup - ending session on unmount');
        endSession();
      }
    };
  }, [isConnected, endSession]);

  const handleToggleConnection = async () => {
    if (isConnected) {
      setMessages([]);
      await endSession();
      setMascotState('neutral');
    } else {
      // Mark hint as dismissed when user clicks to connect
      localStorage.setItem("coqui-hint-dismissed", "true");
      await startSession();
      // Don't manually set mascot state - let the effect handle it
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background shadow-lg">
      <CardContent className="p-4 space-y-3">
        {/* Mascot Section with Click Hint and Timeout Indicator */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative inline-block" onClick={!isConnected ? handleToggleConnection : undefined}>
            <CoquiMascot 
              state={isConnecting ? "waiting" : mascotState}
              size="small"
              position="inline"
              className={
                isConnecting 
                  ? "animate-pulse cursor-wait" 
                  : isConnected 
                    ? "animate-breathe" 
                    : "cursor-pointer"
              }
            />
            
            {!isConnected && !isConnecting && <CoquiClickHint />}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-primary">
              {t("¡Habla con Coquí!", "Talk with Coquí!")}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {isConnecting
                ? t("Conectando...", "Connecting...")
                : isConnected 
                  ? t("Estoy escuchando... ¡Háblame!", "I'm listening... Talk to me!")
                  : t("Haz clic en Coquí para empezar", "Click on Coquí to start")
              }
            </p>
          </div>
        </div>

        {/* Conversation Display - Simplified during intro, full after */}
        {isConnected && (
          <div className="bg-muted/30 rounded-lg p-3 min-h-[150px] max-h-[200px]">
            {isAIPlaying ? (
              // Simplified view while Coquí is speaking
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="text-4xl mb-4 animate-bounce-gentle">🐸</div>
                <p className="text-lg font-medium text-primary">
                  {t("Coquí está hablando...", "Coquí is speaking...")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("Escucha la introducción", "Listen to the introduction")}
                </p>
              </div>
            ) : (
              // Full conversation view after intro for Q&A
              <ScrollArea className="h-full pr-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-lg">
                      {t(
                        "Cuando empieces a hablar, nuestra conversación aparecerá aquí 💬",
                        "When you start talking, our conversation will appear here 💬"
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                            msg.isUser
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">
                              {msg.isUser ? '👦' : '🐸'}
                            </span>
                            <p className="text-base md:text-lg leading-relaxed break-words">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={handleToggleConnection}
            disabled={isConnecting}
            size="default"
            className={`gap-2 px-4 py-2 ${
              isConnected 
                ? 'bg-destructive hover:bg-destructive/90' 
                : 'bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary'
            }`}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                {t("Conectando...", "Connecting...")}
              </>
            ) : isConnected ? (
              <>
                <MicOff className="h-5 w-5" />
                {t("Terminar", "End Chat")}
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                {t("Empezar a Hablar", "Start Talking")}
              </>
            )}
          </Button>

          {isConnected && (
            <Button
              onClick={() => setIsMuted(!isMuted)}
              size="default"
              variant="outline"
              className="gap-2 px-4 py-2"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-5 w-5" />
                  {t("Activar Sonido", "Unmute")}
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5" />
                  {t("Silenciar", "Mute")}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        {isConnected && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${isAIPlaying ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
            <span>
              {isAIPlaying 
                ? t("Coquí está hablando...", "Coquí is talking...")
                : t("Esperando tu voz...", "Listening for you...")
              }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
