import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatIsFluenxIA = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
              {t("¿Qué es FluenxIA?", "What is FluenxIA?")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left: Mission */}
            <Card className="border-2 border-primary/20 bg-white">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-3" />
                <CardTitle className="text-xl">
                  {t("Nuestra Misión", "Our Mission")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>{t(
                  "FluenxIA es la plataforma educativa bilingüe diseñada específicamente para estudiantes K-5 del Departamento de Educación de Puerto Rico.",
                  "FluenxIA is the bilingual educational platform designed specifically for K-5 students in the Puerto Rico Department of Education."
                )}</p>
                <p>{t(
                  "Combinamos tecnología de inteligencia artificial de vanguardia con métodos pedagógicos probados para desarrollar fluidez verdadera en español e inglés.",
                  "We combine cutting-edge artificial intelligence technology with proven pedagogical methods to develop true fluency in Spanish and English."
                )}</p>
              </CardContent>
            </Card>

            {/* Right: How it Works */}
            <Card className="border-2 border-accent/20 bg-white">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-accent mb-3" />
                <CardTitle className="text-xl">
                  {t("Cómo Funciona", "How It Works")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>{t(
                  "Nuestra AI analiza el nivel de cada estudiante en tiempo real y adapta automáticamente el contenido, la dificultad y el apoyo necesario.",
                  "Our AI analyzes each student's level in real-time and automatically adapts the content, difficulty, and support needed."
                )}</p>
                <p>{t(
                  "Coquí, nuestro mentor AI bilingüe, guía a los estudiantes a través de lecturas interactivas, práctica de pronunciación y ejercicios de comprensión.",
                  "Coquí, our bilingual AI mentor, guides students through interactive readings, pronunciation practice, and comprehension exercises."
                )}</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-3xl font-bold text-primary">K-5</div>
              <div className="text-sm text-muted-foreground">{t("Grados", "Grades")}</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-xl">
              <div className="text-3xl font-bold text-accent">2</div>
              <div className="text-sm text-muted-foreground">{t("Idiomas", "Languages")}</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-xl">
              <div className="text-3xl font-bold text-secondary">24/7</div>
              <div className="text-sm text-muted-foreground">{t("Acceso AI", "AI Access")}</div>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-xl">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">{t("Adaptativo", "Adaptive")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
