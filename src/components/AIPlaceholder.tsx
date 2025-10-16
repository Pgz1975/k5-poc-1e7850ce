import { Card } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AIPlaceholder = () => {
  const { t } = useLanguage();
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
                  <h3 className="font-bold text-2xl">
                    {t("Mentor AI Inteligente", "Intelligent AI Mentor")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("Powered by OpenAI Realtime API & Gemini AI", "Powered by OpenAI Realtime API & Gemini AI")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground">
                  {t(
                    "Nuestro asistente AI bilingüe utiliza tecnología de vanguardia para:",
                    "Our bilingual AI assistant uses cutting-edge technology to:"
                  )}
                </p>
                <ul className="space-y-2">
                  {[
                    {
                      es: "Adaptar el contenido al nivel de cada estudiante",
                      en: "Adapt content to each student's level",
                    },
                    {
                      es: "Proporcionar retroalimentación inmediata en tiempo real",
                      en: "Provide immediate real-time feedback",
                    },
                    {
                      es: "Detectar y corregir errores de pronunciación",
                      en: "Detect and correct pronunciation errors",
                    },
                    {
                      es: "Crear planes de aprendizaje personalizados",
                      en: "Create personalized learning plans",
                    },
                    {
                      es: "Comunicarse naturalmente en español e inglés",
                      en: "Communicate naturally in Spanish and English",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{t(item.es, item.en)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 border-2 border-dashed border-primary/30">
                <div className="text-center text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    {t("🔧 Placeholder para integración AI", "🔧 Placeholder for AI integration")}
                  </p>
                  <p>OpenAI Realtime API + Gemini AI + Edge Functions</p>
                  <p className="text-xs">
                    {t(
                      "WebSocket connections, voice recognition, y conversational AI",
                      "WebSocket connections, voice recognition, and conversational AI"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
