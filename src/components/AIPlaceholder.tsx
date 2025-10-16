import { Card } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

export const AIPlaceholder = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Mentor AI Inteligente</h3>
                  <p className="text-muted-foreground">Powered by OpenAI Realtime API & Gemini AI</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground">
                  Nuestro asistente AI bilingüe utiliza tecnología de vanguardia para:
                </p>
                <ul className="space-y-2">
                  {[
                    "Adaptar el contenido al nivel de cada estudiante",
                    "Proporcionar retroalimentación inmediata en tiempo real",
                    "Detectar y corregir errores de pronunciación",
                    "Crear planes de aprendizaje personalizados",
                    "Comunicarse naturalmente en español e inglés",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 border-2 border-dashed border-primary/30">
                <div className="text-center text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">🔧 Placeholder para integración AI</p>
                  <p>OpenAI Realtime API + Gemini AI + Edge Functions</p>
                  <p className="text-xs">WebSocket connections, voice recognition, y conversational AI</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
