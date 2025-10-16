import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Mic } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const AIMentorChat = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");

  const demoMessages = [
    {
      isAI: true,
      textEs: "¡Hola! Soy tu mentor AI. ¿En qué puedo ayudarte hoy?",
      textEn: "Hi! I'm your AI mentor. How can I help you today?",
    },
    {
      isAI: false,
      textEs: "¿Puedes explicarme qué es una metáfora?",
      textEn: "Can you explain what a metaphor is?",
    },
    {
      isAI: true,
      textEs: "¡Claro! Una metáfora es una figura literaria donde comparamos dos cosas sin usar 'como'. Por ejemplo: 'Sus ojos son dos luceros' compara ojos con estrellas.",
      textEn: "Of course! A metaphor is a literary figure where we compare two things without using 'like'. For example: 'Her eyes are stars' compares eyes with stars.",
    },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>{t("Mentor AI", "AI Mentor")}</CardTitle>
            <CardDescription>
              {t("Tu asistente de aprendizaje personalizado", "Your personalized learning assistant")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
            {demoMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isAI
                      ? "bg-card border shadow-sm"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{t(msg.textEs, msg.textEn)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder Notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">
              {t(
                "🔧 Placeholder: OpenAI Realtime API + Gemini AI se integrarán aquí para conversación en tiempo real con reconocimiento de voz.",
                "🔧 Placeholder: OpenAI Realtime API + Gemini AI will be integrated here for real-time conversation with voice recognition."
              )}
            </p>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder={t("Escribe tu pregunta...", "Type your question...")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button size="icon" variant="outline">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
