import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      <div className="container relative px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Centered Content */}
          <div className="space-y-8 text-center flex flex-col items-center">
            {/* Coquí Mascot - 150px width */}
            <div className="w-[150px] animate-bounce-gentle">
              <CoquiMascot 
                state="excited"
                size="inline"
                position="inline"
                className="drop-shadow-2xl w-full"
              />
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl leading-tight">
              <span className="text-primary animate-fade-in">
                {t("¡Aprende a Leer con Coquí!", "Learn to Read with Coquí!")}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-semibold text-foreground/70">
              {t("Tu amigo bilingüe de El Yunque", "Your bilingual friend from El Yunque")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="gap-2 text-lg py-6 px-8 bg-gradient-to-br from-primary via-green-700 to-green-900 hover:scale-105 shadow-hover" 
                asChild
              >
                <a href="/auth">
                  {t("Comenzar Aventura", "Start Adventure")}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-2 border-primary hover:bg-primary/10" asChild>
                <a href="/dashboard">
                  {t("Ver Demo", "View Demo")}
                </a>
              </Button>
            </div>

            {/* Simple baseline */}
            <p className="text-base md:text-lg text-foreground/60 max-w-2xl pt-6 leading-relaxed">
              {t(
                "Una plataforma educativa bilingüe que adapta el contenido al nivel de cada estudiante, con mentor AI y seguimiento de progreso para K-5.",
                "A bilingual educational platform that adapts content to each student's level, with AI mentor and progress tracking for K-5."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
