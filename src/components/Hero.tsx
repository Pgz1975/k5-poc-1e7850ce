import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, TrendingUp } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="container relative px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Plataforma Educativa del DEPR
            </div>
            
            <h1 className="font-bold tracking-tight">
              Aprende a Leer con{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Una plataforma bilingüe innovadora que combina tecnología AI avanzada 
              con métodos educativos probados para estudiantes de K-5 en Puerto Rico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 shadow-medium hover:shadow-strong transition-all">
                Comenzar Ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">K-5</div>
                <div className="text-sm text-muted-foreground">Grados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">Idiomas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">AI</div>
                <div className="text-sm text-muted-foreground">Mentoría</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Lectura Adaptativa</h3>
              <p className="text-muted-foreground text-sm">
                Contenido que se ajusta automáticamente al nivel de cada estudiante.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <Brain className="h-10 w-10 text-secondary mb-4" />
              <h3 className="font-semibold mb-2">Mentor AI Bilingüe</h3>
              <p className="text-muted-foreground text-sm">
                Asistente inteligente que guía en español e inglés con retroalimentación inmediata.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-medium hover:shadow-strong transition-all border">
              <TrendingUp className="h-10 w-10 text-success mb-4" />
              <h3 className="font-semibold mb-2">Seguimiento de Progreso</h3>
              <p className="text-muted-foreground text-sm">
                Monitoreo en tiempo real para estudiantes, maestros y familias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
