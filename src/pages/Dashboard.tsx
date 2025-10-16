import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const portals = [
    {
      icon: Users,
      titleEs: "Portal Estudiante",
      titleEn: "Student Portal",
      descriptionEs: "Accede a tus actividades de lectura, evaluaciones y mentor AI",
      descriptionEn: "Access your reading activities, assessments, and AI mentor",
      color: "from-primary to-primary-glow",
      route: "/student-dashboard",
    },
    {
      icon: School,
      titleEs: "Portal Maestro",
      titleEn: "Teacher Portal",
      descriptionEs: "Gestiona estudiantes, revisa progreso y accede a recursos",
      descriptionEn: "Manage students, review progress, and access resources",
      color: "from-secondary to-accent",
      route: "/teacher-dashboard",
    },
    {
      icon: Home,
      titleEs: "Portal Familia",
      titleEn: "Family Portal",
      descriptionEs: "Monitorea el progreso de tu hijo(a) y recibe sugerencias",
      descriptionEn: "Monitor your child's progress and receive suggestions",
      color: "from-success to-primary",
      route: "/family-dashboard",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("Seleccionar Portal - LecturaPR", "Select Portal - LecturaPR")}</title>
        <meta name="description" content={t("Selecciona tu portal para acceder a la plataforma", "Select your portal to access the platform")} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <h1 className="font-bold">
                {t("Selecciona tu Portal", "Select Your Portal")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t(
                  "Elige el portal que corresponde a tu rol para comenzar",
                  "Choose the portal that matches your role to get started"
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {portals.map((portal, index) => (
                <Card 
                  key={index}
                  className="border-2 hover:border-primary/50 transition-all hover:shadow-strong cursor-pointer"
                  onClick={() => navigate(portal.route)}
                >
                  <CardHeader>
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-4`}>
                      <portal.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{t(portal.titleEs, portal.titleEn)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {t(portal.descriptionEs, portal.descriptionEn)}
                    </CardDescription>
                    <Button variant="outline" className="w-full">
                      {t("Ingresar", "Enter")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
