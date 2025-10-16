import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, LineChart, Mic, BookOpenCheck, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: GraduationCap,
      titleEs: "Para Estudiantes",
      titleEn: "For Students",
      descriptionEs: "Actividades interactivas, juegos educativos y evaluaciones adaptativas que hacen el aprendizaje divertido.",
      descriptionEn: "Interactive activities, educational games, and adaptive assessments that make learning fun.",
      color: "text-primary",
    },
    {
      icon: Users,
      titleEs: "Para Maestros",
      titleEn: "For Teachers",
      descriptionEs: "Herramientas de seguimiento, recursos didácticos y reportes detallados de progreso por estudiante.",
      descriptionEn: "Tracking tools, teaching resources, and detailed progress reports per student.",
      color: "text-secondary",
    },
    {
      icon: LineChart,
      titleEs: "Panel de Control",
      titleEn: "Dashboard",
      descriptionEs: "Visualización de métricas en tiempo real a nivel de estudiante, grupo, escuela y región.",
      descriptionEn: "Real-time metrics visualization at student, group, school, and regional levels.",
      color: "text-success",
    },
    {
      icon: Mic,
      titleEs: "Reconocimiento de Voz",
      titleEn: "Voice Recognition",
      descriptionEs: "Tecnología AI que escucha la lectura del estudiante y corrige pronunciación, ritmo y entonación.",
      descriptionEn: "AI technology that listens to student reading and corrects pronunciation, rhythm, and intonation.",
      color: "text-accent",
    },
    {
      icon: BookOpenCheck,
      titleEs: "Evaluaciones Integradas",
      titleEn: "Integrated Assessments",
      descriptionEs: "Tests diagnósticos tres veces al año alineados con estándares del DEPR en ambos idiomas.",
      descriptionEn: "Diagnostic tests three times a year aligned with PRDE standards in both languages.",
      color: "text-primary",
    },
    {
      icon: Shield,
      titleEs: "Seguro y Privado",
      titleEn: "Safe and Private",
      descriptionEs: "Cumple con FERPA, ADA y COPPA. Datos protegidos con infraestructura segura en la nube.",
      descriptionEn: "Complies with FERPA, ADA, and COPPA. Data protected with secure cloud infrastructure.",
      color: "text-secondary",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-bold">{t("Características Principales", "Key Features")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Una plataforma completa diseñada para transformar la educación de lectura en Puerto Rico",
              "A comprehensive platform designed to transform reading education in Puerto Rico"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-medium">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle>{t(feature.titleEs, feature.titleEn)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(feature.descriptionEs, feature.descriptionEn)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
