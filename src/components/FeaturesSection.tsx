import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
    {
      coquiState: "reading",
      titleEs: "📚 Lectura Adaptativa",
      titleEn: "📚 Adaptive Reading",
      descriptionEs: "¡Coquí lee contigo! Historias que se adaptan a tu nivel y crecen contigo.",
      descriptionEn: "Coquí reads with you! Stories that adapt to your level and grow with you.",
      bgColor: "bg-gradient-to-br from-primary/10 via-green-50 to-primary/5",
      emoji: "📚",
    },
    {
      coquiState: "graduation",
      titleEs: "🎓 Mentor AI Bilingüe",
      titleEn: "🎓 Bilingual AI Mentor",
      descriptionEs: "¡Coquí te ayuda en español e inglés! Respuestas al instante y mucho ánimo.",
      descriptionEn: "Coquí helps you in Spanish and English! Instant answers and lots of encouragement.",
      bgColor: "bg-gradient-to-br from-accent/10 via-blue-50 to-accent/5",
      emoji: "🎓",
    },
    {
      coquiState: "score",
      titleEs: "⭐ Seguimiento de Progreso",
      titleEn: "⭐ Progress Tracking",
      descriptionEs: "¡Mira cuánto has crecido! Gana estrellas y comparte con tu familia.",
      descriptionEn: "See how much you've grown! Earn stars and share with your family.",
      bgColor: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-secondary/10",
      emoji: "⭐",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-yellow-50 via-white to-green-50 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-heading font-bold text-primary">
            {t("¿Qué Haremos Juntos?", "What Will We Do Together?")}
          </h2>
          <p className="text-2xl font-bold text-accent max-w-2xl mx-auto">
            {t(
              "¡Aventuras de lectura con tu amigo Coquí!",
              "Reading adventures with your friend Coquí!"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.bgColor} border-4 border-primary/20 hover:border-primary hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-hover overflow-hidden group`}
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
                <CardTitle className="text-2xl font-heading">
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
