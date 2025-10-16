import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="container relative px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {t("Plataforma Educativa del DEPR", "PRDE Educational Platform")}
            </div>
            
            <h1 className="font-bold tracking-tight">
              {t("Aprende a Leer con", "Learn to Read with")}{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {t("Inteligencia Artificial", "Artificial Intelligence")}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t(
                "Una plataforma bilingüe innovadora que combina tecnología AI avanzada con métodos educativos probados para estudiantes de K-5 en Puerto Rico.",
                "An innovative bilingual platform that combines advanced AI technology with proven educational methods for K-5 students in Puerto Rico."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 shadow-medium hover:shadow-strong transition-all" asChild>
                <a href="/auth">
                  {t("Comenzar Ahora", "Get Started")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/dashboard">
                  {t("Ver Demo", "View Demo")}
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">K-5</div>
                <div className="text-sm text-muted-foreground">{t("Grados", "Grades")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">{t("Idiomas", "Languages")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">AI</div>
                <div className="text-sm text-muted-foreground">{t("Mentoría", "Mentoring")}</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t("Lectura Adaptativa", "Adaptive Reading")}</h3>
              <p className="text-muted-foreground text-sm">
                {t(
                  "Contenido que se ajusta automáticamente al nivel de cada estudiante.",
                  "Content that automatically adjusts to each student's level."
                )}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <Brain className="h-10 w-10 text-secondary mb-4" />
              <h3 className="font-semibold mb-2">{t("Mentor AI Bilingüe", "Bilingual AI Mentor")}</h3>
              <p className="text-muted-foreground text-sm">
                {t(
                  "Asistente inteligente que guía en español e inglés con retroalimentación inmediata.",
                  "Intelligent assistant that guides in Spanish and English with immediate feedback."
                )}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <TrendingUp className="h-10 w-10 text-success mb-4" />
              <h3 className="font-semibold mb-2">{t("Seguimiento de Progreso", "Progress Tracking")}</h3>
              <p className="text-muted-foreground text-sm">
                {t(
                  "Monitoreo en tiempo real para estudiantes, maestros y familias.",
                  "Real-time monitoring for students, teachers, and families."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
