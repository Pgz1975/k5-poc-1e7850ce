import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

export const CoquiVoiceChat = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mascotState, setMascotState] = useState("waiting");
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    connect,
    disconnect,
  } = useRealtimeVoice({
    studentId: user?.id || 'demo-student',
    language: language === 'es' ? 'es-PR' : 'en-US',
    onTranscription: (text, isUser) => {
      setMessages(prev => [...prev, { 
        text, 
        isUser, 
        timestamp: Date.now() 
      }]);
      
      // Update mascot state based on conversation
      if (!isUser) {
        // AI is responding
        if (text.toLowerCase().includes('excelente') || 
            text.toLowerCase().includes('muy bien') ||
            text.toLowerCase().includes('excellent') ||
            text.toLowerCase().includes('great job')) {
          setMascotState('excited');
          setTimeout(() => setMascotState('speaking'), 2000);
        } else {
          setMascotState('speaking');
        }
      } else {
        // User is speaking
        setMascotState('thinking');
      }
    }
  });

  // Update mascot based on audio playback
  useEffect(() => {
    if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected && !isAIPlaying) {
      setMascotState('waiting');
    }
  }, [isAIPlaying, isConnected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggleConnection = async () => {
    if (isConnected) {
      disconnect();
      setMascotState('neutral');
      setMessages([]);
    } else {
      setMascotState('loading');
      await connect();
      setMascotState('happy');
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Mascot Section */}
        <div className="flex flex-col items-center space-y-4">
          <CoquiMascot 
            state={mascotState}
            size="large"
            position="inline"
            className={isConnected ? "animate-breathe" : ""}
          />
          
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-primary">
              {t("¡Habla con Coquí! 🐸", "Talk with Coquí! 🐸")}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {isConnected 
                ? t("Estoy escuchando... ¡Háblame!", "I'm listening... Talk to me!")
                : t("Presiona el botón para empezar a hablar", "Press the button to start talking")
              }
            </p>
          </div>
        </div>

        {/* Conversation Display */}
        <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] max-h-[300px]">
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
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">
                          {msg.isUser ? '👦' : '🐸'}
                        </span>
                        <p className="text-base leading-relaxed break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleToggleConnection}
            disabled={isConnecting}
            size="lg"
            className={`gap-2 text-lg px-6 py-6 ${
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
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-6 py-6"
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
