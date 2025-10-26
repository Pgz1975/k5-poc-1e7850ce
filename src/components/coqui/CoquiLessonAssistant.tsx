import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCoquiSession, VoiceContextConfig } from "@/hooks/useCoquiSession";
import CoquiMascot from "@/components/CoquiMascot";
import { CoquiVoicePanel } from "./CoquiVoicePanel";
import { CoquiTimeoutIndicator } from "./CoquiTimeoutIndicator";
import { CoquiSessionBadge } from "./CoquiSessionBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface CoquiLessonAssistantProps {
  activityId: string;
  activityType: 'lesson' | 'exercise';
  voiceContext?: VoiceContextConfig;
  position?: 'fixed' | 'inline';
}

export const CoquiLessonAssistant = ({ 
  activityId, 
  activityType, 
  voiceContext,
  position = 'fixed'
}: CoquiLessonAssistantProps) => {
  const { t } = useLanguage();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mascotState, setMascotState] = useState("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    countdown,
    isConnected,
    isConnecting,
    isAIPlaying,
    transcript,
    startSession,
    endSession,
    resetTimeout,
    sendText,
    inactivityStatus
  } = useCoquiSession({
    activityId,
    activityType,
    voiceContext
  });

  // Convert transcript to messages
  useEffect(() => {
    const newMessages: Message[] = transcript.map(t => ({
      text: t.text,
      isUser: t.isUser,
      timestamp: Date.now()
    }));
    setMessages(newMessages);
  }, [transcript]);

  // Update mascot state based on connection and AI state
  useEffect(() => {
    if (isConnecting) {
      setMascotState('loading');
    } else if (isAIPlaying) {
      setMascotState('speaking');
    } else if (isConnected) {
      setMascotState('thinking');
    } else {
      setMascotState('idle');
    }
  }, [isConnecting, isAIPlaying, isConnected]);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup: End session when leaving the page
  useEffect(() => {
    return () => {
      if (isConnected) {
        console.log('[CoquiLessonAssistant] 🧹 Cleanup - ending session on unmount');
        endSession();
      }
    };
  }, [isConnected, endSession]);

  const handleMascotClick = async () => {
    if (isConnected) {
      // Already connected - just open panel
      setIsPanelOpen(true);
      resetTimeout();
    } else {
      // Start new session - user interaction grants mic permission
      setIsPanelOpen(true);
      setMascotState('loading');
      
      try {
        await startSession();
        setMascotState('happy');
        
        // Send greeting after successful connection
        const greeting = t(
          "¡Hola! Estoy aquí para ayudarte con esta lección. Puedes hacerme cualquier pregunta.",
          "Hi! I'm here to help you with this lesson. Feel free to ask me anything."
        );
        
        setTimeout(() => {
          sendText(greeting);
        }, 1000);
      } catch (error) {
        console.error('[CoquiLessonAssistant] Failed to start session:', error);
        setMascotState('neutral');
        setIsPanelOpen(false);
      }
    }
  };

  const handleEndSession = () => {
    endSession();
    setMessages([]);
    setMascotState('neutral');
    setIsPanelOpen(false);
    
    toast.info(
      t("Sesión terminada. ¡Haz clic en mí si necesitas más ayuda!", "Session ended. Click me if you need more help!")
    );
  };

  const handleClosePanel = () => {
    if (isConnected) {
      // Just close panel, keep session active
      setIsPanelOpen(false);
    } else {
      setIsPanelOpen(false);
    }
  };

  return (
    <>
      {/* Clickable Mascot */}
      <div 
        className={`
          z-40 cursor-pointer group
          ${position === 'fixed' ? 'fixed bottom-6 right-6' : 'sticky top-24'}
        `}
        onClick={handleMascotClick}
      >
        <div className="relative">
          <CoquiMascot 
            state={mascotState}
            size="small" 
            position="inline"
            className={`
              transition-transform duration-250 
              ${!isConnected && 'group-hover:scale-110 animate-breathe'}
              ${isConnected && 'animate-pulse-gentle'}
            `}
          />
          
          {/* Timeout Warning */}
          <CoquiTimeoutIndicator
            countdownSeconds={countdown}
            isVisible={countdown < 10 && countdown > 0 && isConnected}
            position="above"
            onReactivate={resetTimeout}
          />
          
          {/* Session Badge */}
          {isConnected && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <CoquiSessionBadge
                isConnected={isConnected}
                inactivityStatus={inactivityStatus}
              />
            </div>
          )}
          
          {/* Hint Tooltip */}
          {!isConnected && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-primary text-primary-foreground text-sm px-3 py-1.5 rounded-lg shadow-lg">
                {t("¿Necesitas ayuda? 🐸", "Need help? 🐸")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Panel */}
      <CoquiVoicePanel isOpen={isPanelOpen} onClose={handleClosePanel}>
        <div className="h-full flex flex-col p-4 space-y-4">
          {/* Activity Context Badge */}
          <div className="bg-primary/10 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              {activityType === 'lesson' 
                ? t("📚 Ayuda con la lección", "📚 Lesson Help")
                : t("✏️ Ayuda con el ejercicio", "✏️ Exercise Help")
              }
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-muted/30 rounded-lg p-3 overflow-hidden">
            <ScrollArea className="h-full pr-3" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground px-4">
                  <p>
                    {isConnected
                      ? t(
                          "Empieza a hablar y nuestra conversación aparecerá aquí 💬",
                          "Start talking and our conversation will appear here 💬"
                        )
                      : t(
                          "Haz clic en 'Empezar' para activar la voz",
                          "Click 'Start' to activate voice"
                        )
                    }
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
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl flex-shrink-0">
                            {msg.isUser ? '👦' : '🐸'}
                          </span>
                          <p className="text-sm leading-relaxed break-words">
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
          <div className="space-y-3">
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isConnected ? (
                <Button
                  onClick={handleMascotClick}
                  disabled={isConnecting}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      {t("Conectando...", "Connecting...")}
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      {t("Empezar a Hablar", "Start Talking")}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleEndSession}
                  variant="destructive"
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <MicOff className="h-5 w-5" />
                  {t("Terminar Sesión", "End Session")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CoquiVoicePanel>
    </>
  );
};
