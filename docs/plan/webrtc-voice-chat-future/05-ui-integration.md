# OpenAI Realtime API - UI Integration Plan

## Component Architecture

```
AIMentorChat (Main Component)
├── Connection Controls
│   ├── Connect Button
│   ├── Disconnect Button
│   └── Status Indicator
├── Chat Interface
│   ├── Transcript Display
│   ├── Speaking Indicator
│   └── Scroll Area
├── Input Methods
│   ├── Voice Input (automatic)
│   └── Text Input (fallback)
└── Error Display
    └── Toast Notifications
```

## Updated AIMentorChat Component

### File: `src/components/StudentDashboard/AIMentorChat.tsx`

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Mic, MicOff, Send, Loader2, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const AIMentorChat = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [textMessage, setTextMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use the realtime chat hook
  const {
    isConnected,
    isLoading,
    isSpeaking,
    error,
    transcript,
    connect,
    disconnect,
    sendText
  } = useRealtimeChat();

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast({
        title: t("Error", "Error"),
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast, t]);

  const handleConnect = async () => {
    try {
      // Get user role from context or default to student
      const userRole = 'student'; // TODO: Get from user context
      await connect(userRole, language);
      
      toast({
        title: t("Conectado", "Connected"),
        description: t("Puedes comenzar a hablar", "You can start speaking"),
      });
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: t("Desconectado", "Disconnected"),
      description: t("Sesión finalizada", "Session ended"),
    });
  };

  const handleSendText = () => {
    if (!textMessage.trim() || !isConnected) return;
    
    try {
      sendText(textMessage);
      setTextMessage("");
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {t("Mentor AI", "AI Mentor")}
                {/* Connection Status Badge */}
                {isConnected && (
                  <span className="flex items-center gap-1 text-xs font-normal text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                    {t("En línea", "Online")}
                  </span>
                )}
                {!isConnected && !isLoading && (
                  <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    <WifiOff className="h-3 w-3" />
                    {t("Desconectado", "Offline")}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {t("Tu asistente de aprendizaje personalizado", "Your personalized learning assistant")}
              </CardDescription>
            </div>
          </div>

          {/* Connection Controls */}
          <div className="flex gap-2">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("Conectando...", "Connecting...")}
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    {t("Conectar", "Connect")}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
              >
                <MicOff className="h-4 w-4 mr-2" />
                {t("Desconectar", "Disconnect")}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Chat Transcript */}
          <ScrollArea className="h-64 rounded-lg border bg-muted/30 p-4">
            <div ref={scrollRef}>
              {!isConnected && !transcript && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Mic className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">
                    {t(
                      "Haz clic en 'Conectar' para comenzar a hablar con tu mentor AI",
                      "Click 'Connect' to start talking with your AI mentor"
                    )}
                  </p>
                </div>
              )}

              {isConnected && !transcript && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 mb-4 animate-spin" />
                  <p className="text-sm">
                    {t(
                      "Escuchando... Empieza a hablar",
                      "Listening... Start speaking"
                    )}
                  </p>
                </div>
              )}

              {transcript && (
                <div className="whitespace-pre-wrap text-sm">
                  {transcript}
                </div>
              )}

              {/* Speaking Indicator */}
              {isSpeaking && (
                <div className="flex items-center gap-2 mt-4 text-primary">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-sm font-medium">
                    {t("Mentor hablando...", "Mentor speaking...")}
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Text Input (fallback option) */}
          <div className="flex gap-2">
            <Input
              placeholder={
                isConnected
                  ? t("O escribe tu pregunta...", "Or type your question...")
                  : t("Conecta para comenzar", "Connect to start")
              }
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              disabled={!isConnected}
            />
            <Button 
              size="icon" 
              onClick={handleSendText}
              disabled={!isConnected || !textMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Info Message */}
          {isConnected && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-muted-foreground">
              <p>
                {t(
                  "💡 Consejo: Habla naturalmente. El mentor AI te escucha y responde en tiempo real.",
                  "💡 Tip: Speak naturally. The AI mentor listens and responds in real-time."
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

## Visual States

### 1. Disconnected State
```
┌─────────────────────────────────────┐
│ 🤖 Mentor AI      [Desconectado]   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │      🎤                       │ │
│  │  Haz clic en 'Conectar'      │ │
│  │  para comenzar               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Conecta para comenzar      ] [>] │
└─────────────────────────────────────┘
```

### 2. Connecting State
```
┌─────────────────────────────────────┐
│ 🤖 Mentor AI      [⏳ Conectando]  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │      ⏳                       │ │
│  │  Estableciendo conexión...   │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 3. Connected & Listening
```
┌─────────────────────────────────────┐
│ 🤖 Mentor AI      [🟢 En línea]    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Mentor: ¡Hola! ¿En qué puedo │ │
│  │ ayudarte hoy?                 │ │
│  │                               │ │
│  │ You: Me gustaría practicar... │ │
│  │                               │ │
│  │ ● ● ● Mentor hablando...     │ │
│  └───────────────────────────────┘ │
│                                     │
│  [O escribe tu pregunta...    ] [>] │
│                                     │
│  💡 Habla naturalmente. El mentor  │
│     te escucha en tiempo real.     │
└─────────────────────────────────────┘
```

### 4. Error State
```
┌─────────────────────────────────────┐
│ 🤖 Mentor AI      [⚠️ Error]       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  ⚠️  Error de conexión        │ │
│  │  Intenta de nuevo             │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [       Reconectar       ]        │
└─────────────────────────────────────┘
```

## Accessibility Features

### 1. Keyboard Navigation
```typescript
// Add keyboard shortcuts
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    // Ctrl/Cmd + M to toggle microphone
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
      e.preventDefault();
      isConnected ? handleDisconnect() : handleConnect();
    }
    
    // Escape to disconnect
    if (e.key === 'Escape' && isConnected) {
      handleDisconnect();
    }
  };

  window.addEventListener('keydown', handleKeyboard);
  return () => window.removeEventListener('keydown', handleKeyboard);
}, [isConnected]);
```

### 2. Screen Reader Support
```typescript
// Add aria labels
<Button
  onClick={handleConnect}
  aria-label={t(
    "Conectar con el mentor AI por voz",
    "Connect with AI mentor by voice"
  )}
  aria-pressed={isConnected}
>
```

### 3. Visual Feedback
- Connection status badge
- Speaking indicator (animated dots)
- Transcript auto-scroll
- Error messages in toast

## Responsive Design

### Mobile Considerations

```typescript
// Optimize for mobile
<div className="lg:col-span-2"> {/* Full width on mobile */}
  <ScrollArea className="h-64 sm:h-80 lg:h-96"> {/* Responsive height */}
```

### Touch Optimizations
- Larger touch targets (buttons min 44x44px)
- Simplified controls
- Full-screen mode option (future)

## Testing Checklist

### Functional Tests
- [ ] Connect button establishes WebRTC connection
- [ ] Disconnect button terminates connection
- [ ] Text input sends messages when connected
- [ ] Transcript displays user and AI messages
- [ ] Speaking indicator shows when AI is speaking
- [ ] Auto-scroll works correctly
- [ ] Error toasts appear on failures

### UX Tests
- [ ] Loading states are clear
- [ ] Connection status is always visible
- [ ] Transcript is readable
- [ ] Controls are intuitive
- [ ] Keyboard shortcuts work
- [ ] Mobile experience is smooth

### Accessibility Tests
- [ ] Screen reader can navigate
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] ARIA labels are appropriate

## Future Enhancements

### Phase 2
- [ ] Conversation history persistence
- [ ] Export transcript feature
- [ ] Voice selection UI
- [ ] Language auto-detection
- [ ] Sentiment analysis display

### Phase 3
- [ ] Video avatar (visual representation)
- [ ] Custom wake word ("Hey Mentor")
- [ ] Multi-user sessions (group learning)
- [ ] Offline mode with queued messages

## Integration with Existing Features

### Link to Student Progress
```typescript
// In session config (backend)
instructions: `The student is currently at level ${studentLevel}. 
They have completed ${activitiesCompleted} activities.
Focus on topics related to ${currentFocus}.`
```

### Link to Achievements
```typescript
// When student achieves something
if (newAchievement) {
  sendText("I just completed a new achievement! Can you help me celebrate?");
}
```

## Next Steps

1. Implement useRealtimeChat hook
2. Update AIMentorChat component
3. Test connection flow
4. Add error handling
5. Polish UI animations
6. Test on mobile devices
7. Gather user feedback
