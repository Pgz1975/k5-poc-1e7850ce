import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LineChart, Shield, BookOpenCheck, GraduationCap, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const ParentTeacherSection = () => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const adultFeatures = [
    {
      icon: LineChart,
      titleEs: "Panel de Control Completo",
      titleEn: "Comprehensive Dashboard",
      descriptionEs: "Visualización de métricas en tiempo real a nivel de estudiante, grupo, escuela y región.",
      descriptionEn: "Real-time metrics visualization at student, group, school, and regional levels.",
    },
    {
      icon: FileText,
      titleEs: "Reportes Detallados",
      titleEn: "Detailed Reports",
      descriptionEs: "Informes de progreso personalizados con análisis de fortalezas y áreas de mejora.",
      descriptionEn: "Customized progress reports with analysis of strengths and areas for improvement.",
    },
    {
      icon: BookOpenCheck,
      titleEs: "Evaluaciones Integradas",
      titleEn: "Integrated Assessments",
      descriptionEs: "Tests diagnósticos tres veces al año alineados con estándares del DEPR en ambos idiomas.",
      descriptionEn: "Diagnostic tests three times a year aligned with PRDE standards in both languages.",
    },
    {
      icon: Shield,
      titleEs: "Seguridad y Privacidad",
      titleEn: "Security and Privacy",
      descriptionEs: "Cumple con FERPA, ADA y COPPA. Datos protegidos con infraestructura segura en la nube.",
      descriptionEn: "Complies with FERPA, ADA, and COPPA. Data protected with secure cloud infrastructure.",
    },
    {
      icon: Users,
      titleEs: "Colaboración Familia-Escuela",
      titleEn: "Family-School Collaboration",
      descriptionEs: "Herramientas de comunicación que conectan a padres, maestros y estudiantes.",
      descriptionEn: "Communication tools that connect parents, teachers, and students.",
    },
    {
      icon: GraduationCap,
      titleEs: "Recursos Didácticos",
      titleEn: "Teaching Resources",
      descriptionEs: "Biblioteca de actividades, planes de lección y materiales descargables.",
      descriptionEn: "Library of activities, lesson plans, and downloadable materials.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container px-4 md:px-6">
        {/* Toggle Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1 max-w-[200px]"></div>
            <h2 className="font-heading font-bold text-slate-700">
              {t("Para Padres y Maestros", "For Parents and Teachers")}
            </h2>
            <div className="h-px bg-border flex-1 max-w-[200px]"></div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
            {t(
              "Herramientas profesionales para monitorear el progreso, generar reportes y apoyar el aprendizaje de cada estudiante.",
              "Professional tools to monitor progress, generate reports, and support each student's learning."
            )}
          </p>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowDetails(!showDetails)}
            className="border-2 border-slate-300 hover:border-primary hover:bg-primary/5"
          >
            {showDetails 
              ? t("Ocultar Detalles", "Hide Details")
              : t("Ver Características Completas", "View Full Features")
            }
          </Button>
        </div>

        {/* Expandable Content */}
        {showDetails && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {adultFeatures.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-white border border-slate-200 hover:border-primary/50 transition-all hover:shadow-medium"
                >
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-3" />
                    <CardTitle className="text-lg text-slate-800">
                      {t(feature.titleEs, feature.titleEn)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">
                      {t(feature.descriptionEs, feature.descriptionEn)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="gap-2" asChild>
                <a href="/auth">
                  {t("Acceso para Educadores", "Educator Access")}
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
