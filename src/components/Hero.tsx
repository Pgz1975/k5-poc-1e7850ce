import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";
import logoFluenxia from "@/assets/logo-fluenxia.png";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      <div className="container relative px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Centered Content */}
          <div className="space-y-8 text-center flex flex-col items-center">
            {/* Coquí Mascot - 150px width */}
            <div className="w-[150px]">
              <CoquiMascot 
                state="excited"
                size="inline"
                position="inline"
                className="drop-shadow-2xl w-full"
              />
            </div>
            
            <div className="space-y-4">
              <img 
                src={logoFluenxia} 
                alt="FluenxIA" 
                className="w-full max-w-2xl mx-auto animate-fade-in"
              />
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                {t("Fluidez impulsada por Inteligencia Artificial", "Fluency powered by Artificial Intelligence")}
              </p>
            </div>
            
            <p className="text-xl md:text-2xl font-semibold text-foreground/70 mt-4">
              {t("Tu compañero bilingüe con AI para dominar español e inglés", "Your bilingual AI companion to master Spanish and English")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="gap-2 text-lg py-6 px-8 bg-gradient-to-br from-cyan-400 to-cyan-500 text-white border-4 border-cyan-600 rounded-3xl shadow-[0_6px_0_hsl(186,72%,40%)] hover:-translate-y-1 hover:shadow-[0_8px_0_hsl(186,72%,40%)] active:translate-y-1 active:shadow-[0_2px_0_hsl(186,72%,40%)] transition-all font-bold" 
                asChild
              >
                <a href="/auth">
                  {t("Comenzar Aventura", "Start Adventure")}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="lg" 
                className="text-lg py-6 px-8 bg-white text-gray-700 border-4 border-purple-400 rounded-3xl shadow-[0_6px_0_hsl(270,60%,70%)] hover:-translate-y-1 hover:shadow-[0_8px_0_hsl(270,60%,70%)] active:translate-y-1 active:shadow-[0_2px_0_hsl(270,60%,70%)] transition-all font-bold" 
                asChild
              >
                <a href="/dashboard">
                  {t("Ver Demo", "View Demo")}
                </a>
              </Button>
            </div>

            {/* Simple baseline */}
            <p className="text-base md:text-lg text-foreground/60 max-w-2xl pt-6 leading-relaxed">
              {t(
                "Desarrolla fluidez real en lectura, pronunciación y comprensión con tecnología AI que se adapta a tu nivel. Diseñado para estudiantes K-5 en Puerto Rico.",
                "Develop real fluency in reading, pronunciation and comprehension with AI technology that adapts to your level. Designed for K-5 students in Puerto Rico."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
