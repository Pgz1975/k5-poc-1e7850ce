import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CoquiMascot from "@/components/CoquiMascot";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      {/* Animated Jungle Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-sway">🌴</div>
        <div className="absolute top-20 right-20 text-5xl animate-sway-delayed">🍃</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-float">🦜</div>
        <div className="absolute top-1/3 right-1/3 text-7xl animate-sway">🌿</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-sway-delayed">🌺</div>
      </div>
      
      <div className="container relative px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 text-primary text-lg font-bold animate-bounce-once shadow-soft">
              <Sparkles className="h-5 w-5" />
              {t("¡Tu Amigo de El Yunque!", "Your Friend from El Yunque!")}
            </div>
            
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="text-primary animate-fade-in">
                {t("¡Aprende a Leer con Coquí!", "Learn to Read with Coquí!")}
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold text-accent">
              {t("Tu amigo bilingüe de El Yunque", "Your bilingual friend from El Yunque")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="gap-2 text-xl py-7 px-10 bg-gradient-to-r from-primary via-accent to-secondary hover:scale-110 shadow-hover animate-pulse-slow" 
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
            <div className="grid grid-cols-3 gap-6 pt-8">
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

          {/* Coquí Animation Area */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Spanish Book */}
            <div className="absolute left-10 top-20 animate-float bg-white rounded-xl p-6 shadow-strong transform rotate-[-15deg] hover:rotate-[-10deg] transition-transform">
              <div className="text-6xl">📖</div>
              <div className="text-lg font-bold text-primary mt-2">Español</div>
            </div>

            {/* English Book */}
            <div className="absolute right-10 top-32 animate-float-delayed bg-white rounded-xl p-6 shadow-strong transform rotate-[15deg] hover:rotate-[10deg] transition-transform">
              <div className="text-6xl">📕</div>
              <div className="text-lg font-bold text-accent mt-2">English</div>
            </div>

            {/* Main Coquí - using excited pose for hero */}
            <div className="relative z-10 animate-bounce-gentle">
              <CoquiMascot 
                state="excited"
                size="medium"
                position="inline"
                className="drop-shadow-2xl"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-1/4 text-4xl animate-spin-slow">⭐</div>
            <div className="absolute top-10 right-1/4 text-3xl animate-spin-slow-reverse">✨</div>
          </div>
        </div>
      </div>
    </section>
  );
};
