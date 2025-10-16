import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, LineChart, Mic, BookOpenCheck, Shield } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Para Estudiantes",
      description: "Actividades interactivas, juegos educativos y evaluaciones adaptativas que hacen el aprendizaje divertido.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Para Maestros",
      description: "Herramientas de seguimiento, recursos didácticos y reportes detallados de progreso por estudiante.",
      color: "text-secondary",
    },
    {
      icon: LineChart,
      title: "Panel de Control",
      description: "Visualización de métricas en tiempo real a nivel de estudiante, grupo, escuela y región.",
      color: "text-success",
    },
    {
      icon: Mic,
      title: "Reconocimiento de Voz",
      description: "Tecnología AI que escucha la lectura del estudiante y corrige pronunciación, ritmo y entonación.",
      color: "text-accent",
    },
    {
      icon: BookOpenCheck,
      title: "Evaluaciones Integradas",
      description: "Tests diagnósticos tres veces al año alineados con estándares del DEPR en ambos idiomas.",
      color: "text-primary",
    },
    {
      icon: Shield,
      title: "Seguro y Privado",
      description: "Cumple con FERPA, ADA y COPPA. Datos protegidos con infraestructura segura en la nube.",
      color: "text-secondary",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-bold">Características Principales</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa diseñada para transformar la educación de lectura en Puerto Rico
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-medium">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
