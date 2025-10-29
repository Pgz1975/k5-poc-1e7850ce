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
                  <h3 className="font-bold text-2xl md:text-3xl">
                    {t("Tecnología AI de FluenxIA", "FluenxIA's AI Technology")}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {t(
                      "Potenciado por OpenAI Realtime API & Google Gemini",
                      "Powered by OpenAI Realtime API & Google Gemini"
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t(
                    "FluenxIA integra las tecnologías de inteligencia artificial más avanzadas del mundo para crear una experiencia de aprendizaje verdaderamente personalizada. Nuestro sistema analiza en tiempo real la fluidez de cada estudiante y adapta automáticamente el contenido, la dificultad y el tipo de soporte necesario.",
                    "FluenxIA integrates the world's most advanced artificial intelligence technologies to create a truly personalized learning experience. Our system analyzes each student's fluency in real-time and automatically adapts content, difficulty, and the type of support needed."
                  )}
                </p>
                <p className="text-muted-foreground font-medium mt-6">
                  {t(
                    "Capacidades principales:",
                    "Core capabilities:"
                  )}
                </p>
                <ul className="space-y-2">
                  {[
                    {
                      es: "Evaluar y mejorar fluidez en lectura en tiempo real",
                      en: "Assess and improve reading fluency in real-time",
                    },
                    {
                      es: "Corregir pronunciación con retroalimentación inmediata",
                      en: "Correct pronunciation with immediate feedback",
                    },
                    {
                      es: "Adaptar complejidad de textos según nivel de fluidez",
                      en: "Adapt text complexity based on fluency level",
                    },
                    {
                      es: "Crear rutas de aprendizaje personalizadas por estudiante",
                      en: "Create personalized learning paths per student",
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
