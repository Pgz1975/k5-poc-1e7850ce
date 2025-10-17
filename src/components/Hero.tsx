import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      <div className="container relative px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
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
            
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="text-primary animate-fade-in">
                {t("¡Aprende a Leer con Coquí!", "Learn to Read with Coquí!")}
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold text-accent">
              {t("Tu amigo bilingüe de El Yunque", "Your bilingual friend from El Yunque")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 text-xl py-7 px-10 bg-gradient-to-br from-primary via-green-700 to-green-900 hover:scale-110 shadow-hover" 
                asChild
              >
                <a href="/auth">
                  {t("🚀 Comenzar Aventura", "🚀 Start Adventure")}
                  <ArrowRight className="h-6 w-6" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-xl py-7 px-10 border-4 border-primary hover:bg-primary/10" asChild>
                <a href="/dashboard">
                  {t("👀 Ver Demo", "👀 View Demo")}
                </a>
              </Button>
            </div>

            {/* Fun Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 w-full max-w-xl">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
                <div className="text-4xl font-bold text-primary">📚 K-5</div>
                <div className="text-sm font-semibold text-foreground/70">{t("Grados", "Grades")}</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
                <div className="text-4xl font-bold text-accent">🌎 2</div>
                <div className="text-sm font-semibold text-foreground/70">{t("Idiomas", "Languages")}</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
                <div className="text-4xl font-bold text-secondary">✨ AI</div>
                <div className="text-sm font-semibold text-foreground/70">{t("Mentor", "Mentor")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
