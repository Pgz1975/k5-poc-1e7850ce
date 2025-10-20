import { Button } from "@/components/ui/button";
import { ArrowRight, Users, School, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CTASection = () => {
  const { t } = useLanguage();
  const portals = [
    {
      icon: Users,
      titleEs: "Portal Estudiantes",
      titleEn: "Student Portal",
      descriptionEs: "Accede a actividades, evaluaciones y tu mentor AI personal",
      descriptionEn: "Access activities, assessments, and your personal AI mentor",
      color: "from-primary to-primary-glow",
    },
    {
      icon: School,
      titleEs: "Portal Maestros",
      titleEn: "Teacher Portal",
      descriptionEs: "Gestiona grupos, revisa progreso y accede a recursos didácticos",
      descriptionEn: "Manage groups, review progress, and access teaching resources",
      color: "from-primary to-primary-glow",
    },
    {
      icon: Home,
      titleEs: "Portal Familias",
      titleEn: "Family Portal",
      descriptionEs: "Monitorea el progreso diario y recibe sugerencias de apoyo",
      descriptionEn: "Monitor daily progress and receive support suggestions",
      color: "from-primary to-primary-glow",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-bold">
            {t("Comienza tu Viaje de Aprendizaje", "Start Your Learning Journey")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Elige tu portal y descubre cómo la tecnología AI puede transformar la educación",
              "Choose your portal and discover how AI technology can transform education"
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {portals.map((portal, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 border-2 hover:border-primary/50 transition-all hover:shadow-strong cursor-pointer"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <portal.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">{t(portal.titleEs, portal.titleEn)}</h3>
              <p className="text-muted-foreground mb-6">{t(portal.descriptionEs, portal.descriptionEn)}</p>
              <Button variant="ghost" className="gap-2 p-0 h-auto hover:gap-3 transition-all">
                {t("Acceder", "Access")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="gap-2 shadow-medium hover:shadow-strong transition-all">
            {t("Solicitar Demostración", "Request Demo")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
