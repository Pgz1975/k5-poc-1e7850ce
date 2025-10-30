import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CoquiMascot from "@/components/CoquiMascot";
import { WhatIsFluenxIA } from "@/components/WhatIsFluenxIA";
import { ForPuertoRico } from "@/components/ForPuertoRico";
import { BookOpen, Mic, Trophy, Sparkles } from "lucide-react";
import logoFluenxia from "@/assets/logo-fluenxia.png";

function HeroV2() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column - Mascot */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-[16rem]">
              <CoquiMascot 
                state="happy" 
                size="large"
                position="inline"
                className="z-10 drop-shadow-2xl w-48 h-48"
              />
              <div className="absolute -top-2 right-0 animate-pulse">
                <Sparkles className="w-12 h-12 text-student-yellow" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in">
            <div className="space-y-4">
              <img 
                src={logoFluenxia} 
                alt="FluenxIA" 
                className="w-full max-w-xl mx-auto lg:mx-0 animate-fade-in"
              />
              <p className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-student-lime to-student-coral">
                {t("Fluidez impulsada por Inteligencia Artificial", "Fluency powered by Artificial Intelligence")}
              </p>
            </div>
            
            <p className="text-lg md:text-xl text-foreground/80">
              {t(
                "Desarrolla fluidez verdadera en español e inglés con tecnología AI que se adapta a tu nivel. Para estudiantes K-5 en Puerto Rico.",
                "Develop true fluency in Spanish and English with AI technology that adapts to your level. For K-5 students in Puerto Rico."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                variant="student-lime"
                className="text-lg px-8 py-6"
              >
                <Link to="/auth">
                  {t("¡Empezar Aventura!", "Start Adventure!")}
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="student-peach"
                className="text-lg px-8 py-6"
              >
                <Link to="/student-dashboard">
                  {t("Ver Demo", "View Demo")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesV2() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: t("Lectura Adaptativa AI", "AI Adaptive Reading"),
      description: t(
        "Textos que se ajustan automáticamente a tu nivel de fluidez",
        "Texts that automatically adjust to your fluency level"
      ),
      color: "pink" as const,
    },
    {
      icon: Mic,
      title: t("Pronunciación Inteligente", "Intelligent Pronunciation"),
      description: t(
        "AI que escucha tu voz y te ayuda a pronunciar correctamente",
        "AI that listens to your voice and helps you pronounce correctly"
      ),
      color: "coral" as const,
    },
    {
      icon: Trophy,
      title: t("Seguimiento Personalizado", "Personalized Tracking"),
      description: t(
        "Progreso detallado en fluidez, pronunciación y comprensión",
        "Detailed progress in fluency, pronunciation and comprehension"
      ),
      color: "yellow" as const,
    },
    {
      icon: Sparkles,
      title: t("Mentor AI 24/7", "24/7 AI Mentor"),
      description: t(
        "Coquí responde tus preguntas cuando lo necesites",
        "Coquí answers your questions whenever you need"
      ),
      color: "lime" as const,
    },
  ];

  const colorClasses = {
    pink: "bg-[hsl(329,100%,95%)] border-[hsl(329,100%,75%)] text-[hsl(329,100%,35%)]",
    coral: "bg-[hsl(11,100%,95%)] border-[hsl(11,100%,75%)] text-[hsl(11,100%,35%)]",
    peach: "bg-[hsl(27,100%,95%)] border-[hsl(27,100%,75%)] text-[hsl(27,100%,35%)]",
    yellow: "bg-[hsl(45,100%,95%)] border-[hsl(45,100%,75%)] text-[hsl(45,100%,35%)]",
    lime: "bg-[hsl(125,100%,95%)] border-[hsl(125,100%,75%)] text-[hsl(125,100%,35%)]",
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          {t("¿Qué hace especial a FluenxIA?", "What makes FluenxIA special?")}
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t(
            "Aprende con tecnología de punta y métodos probados",
            "Learn with cutting-edge technology and proven methods"
          )}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-3xl border-4 p-6 transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer ${colorClasses[feature.color]}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/60 rounded-2xl p-4 w-fit mb-4">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAV2() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("¿Listo para empezar?", "Ready to get started?")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t(
              "Únete a miles de estudiantes que están mejorando sus habilidades de lectura",
              "Join thousands of students improving their reading skills"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              asChild 
              size="lg" 
              variant="student-lime"
              className="text-xl px-10 py-7"
            >
              <Link to="/auth">
                {t("Crear Cuenta Gratis", "Create Free Account")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndexV2Content() {
  return (
    <>
      <Helmet>
        <title>FluenxIA - Fluidez Bilingüe con Inteligencia Artificial para Puerto Rico</title>
        <meta 
          name="description" 
          content="FluenxIA es la plataforma de fluidez bilingüe con IA para estudiantes K-5 del Departamento de Educación de Puerto Rico. Desarrolla lectura, pronunciación y comprensión en español e inglés con tecnología AI avanzada." 
        />
        <meta 
          name="keywords" 
          content="FluenxIA, fluidez bilingüe, AI educación, DEPR, lectura adaptativa, pronunciación AI, español inglés, K-5 Puerto Rico" 
        />
        <meta property="og:title" content="FluenxIA - Fluency powered by Artificial Intelligence" />
        <meta 
          property="og:description" 
          content="Desarrolla fluidez verdadera en español e inglés con tecnología AI que se adapta a tu nivel. Plataforma educativa bilingüe para estudiantes K-5 en Puerto Rico." 
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.fluenxia.com" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <HeroV2 />
          <WhatIsFluenxIA />
          <FeaturesV2 />
          <ForPuertoRico />
          <CTAV2 />
        </main>

        <Footer />
      </div>
    </>
  );
}

const IndexV2 = () => {
  return (
    <LanguageProvider>
      <IndexV2Content />
    </LanguageProvider>
  );
};

export default IndexV2;
