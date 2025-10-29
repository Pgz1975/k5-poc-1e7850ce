import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
    {
      coquiState: "reading",
      titleEs: "📚 Lectura Adaptativa AI",
      titleEn: "📚 AI Adaptive Reading",
      descriptionEs: "Textos que se ajustan automáticamente a tu nivel de fluidez con soporte en tiempo real.",
      descriptionEn: "Texts that automatically adjust to your fluency level with real-time support.",
      bgColor: "bg-gradient-to-br from-primary/10 via-green-50 to-primary/5",
    },
    {
      coquiState: "speaking",
      titleEs: "🎤 Pronunciación Inteligente",
      titleEn: "🎤 Intelligent Pronunciation",
      descriptionEs: "AI que escucha tu voz y te ayuda a pronunciar correctamente en español e inglés.",
      descriptionEn: "AI that listens to your voice and helps you pronounce correctly in Spanish and English.",
      bgColor: "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100/50",
    },
    {
      coquiState: "graduation",
      titleEs: "🎓 Mentor Bilingüe 24/7",
      titleEn: "🎓 24/7 Bilingual Mentor",
      descriptionEs: "Coquí responde tus preguntas en español o inglés cuando lo necesites.",
      descriptionEn: "Coquí answers your questions in Spanish or English whenever you need.",
      bgColor: "bg-gradient-to-br from-accent/10 via-purple-50 to-accent/5",
    },
    {
      coquiState: "score",
      titleEs: "📊 Seguimiento Personalizado",
      titleEn: "📊 Personalized Tracking",
      descriptionEs: "Progreso detallado en fluidez, pronunciación, comprensión y vocabulario.",
      descriptionEn: "Detailed progress in fluency, pronunciation, comprehension and vocabulary.",
      bgColor: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-secondary/10",
    },
    {
      coquiState: "exploring",
      titleEs: "🌴 Contenido Puertorriqueño",
      titleEn: "🌴 Puerto Rican Content",
      descriptionEs: "Historias sobre El Yunque, el coquí y nuestra cultura única adaptadas a tu nivel.",
      descriptionEn: "Stories about El Yunque, the coquí and our unique culture adapted to your level.",
      bgColor: "bg-gradient-to-br from-green-100 via-green-50 to-green-100/50",
    },
    {
      coquiState: "happy",
      titleEs: "🎮 Aprendizaje Gamificado",
      titleEn: "🎮 Gamified Learning",
      descriptionEs: "Medallas, desafíos y celebraciones que hacen el desarrollo de fluidez emocionante.",
      descriptionEn: "Medals, challenges and celebrations that make fluency development exciting.",
      bgColor: "bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100/50",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-yellow-50 via-white to-green-50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            {t("Características de FluenxIA", "FluenxIA Features")}
          </h2>
          <p className="text-xl font-semibold text-foreground/70">
            {t(
              "Tecnología AI que desarrolla fluidez real en ambos idiomas",
              "AI technology that develops real fluency in both languages"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.bgColor} border-4 border-cyan-300 rounded-3xl shadow-[0_6px_0_hsl(180,60%,80%)] hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_8px_0_hsl(180,60%,70%)] transition-all duration-300 overflow-hidden group`}
            >
              <CardHeader className="text-center pb-4">
                {/* Coquí Mascot */}
                <div className="flex justify-center mb-4 group-hover:animate-bounce-once">
                  <CoquiMascot 
                    state={feature.coquiState}
                    size="medium"
                    position="inline"
                    className="drop-shadow-lg"
                  />
                </div>
                <CardTitle className="text-2xl font-heading font-bold">
                  {t(feature.titleEs, feature.titleEn)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-lg font-semibold text-foreground/80">
                  {t(feature.descriptionEs, feature.descriptionEn)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-2xl font-bold text-primary mb-4">
            {t("🎉 ¡Lista para tu primera aventura!", "🎉 Ready for your first adventure!")}
          </p>
        </div>
      </div>
    </section>
  );
};
