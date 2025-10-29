import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CoquiMascot from "@/components/CoquiMascot";
import { BookOpen, Mic, Trophy, Sparkles } from "lucide-react";

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
                className="z-10 animate-bounce-gentle drop-shadow-2xl w-48 h-48"
              />
              <div className="absolute -top-2 right-0 animate-pulse">
                <Sparkles className="w-12 h-12 text-student-yellow" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-student-pink via-student-peach to-student-yellow">
                {t("¡Aprende a Leer!", "Learn to Read!")}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80">
              {t(
                "Plataforma educativa bilingüe con AI para estudiantes K-5 de Puerto Rico",
                "Bilingual AI-powered educational platform for K-5 students in Puerto Rico"
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
      title: t("Lectura Interactiva", "Interactive Reading"),
      description: t(
        "Ejercicios de lectura con narración AI y retroalimentación",
        "Reading exercises with AI narration and feedback"
      ),
      color: "pink" as const,
    },
    {
      icon: Mic,
      title: t("Práctica de Pronunciación", "Pronunciation Practice"),
      description: t(
        "Mejora tu pronunciación con reconocimiento de voz",
        "Improve pronunciation with voice recognition"
      ),
      color: "coral" as const,
    },
    {
      icon: Trophy,
      title: t("Gamificación", "Gamification"),
      description: t(
        "Gana estrellas, medallas y sube de nivel",
        "Earn stars, medals and level up"
      ),
      color: "yellow" as const,
    },
    {
      icon: Sparkles,
      title: t("Mentor AI", "AI Mentor"),
      description: t(
        "Asistente personalizado para ayudarte a aprender",
        "Personalized assistant to help you learn"
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
          <FeaturesV2 />
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
