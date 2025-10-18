import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { ReadingActivities } from "@/components/StudentDashboard/ReadingActivities";
import CoquiMascot from "@/components/CoquiMascot";
import { useState } from "react";

const Activities = () => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("happy");

  return (
    <>
      <Helmet>
        <title>{t("Mis Actividades - LecturaPR", "My Activities - LecturaPR")}</title>
        <meta name="description" content={t("Actividades de lectura y práctica", "Reading and practice activities")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
        <Header />
        
        <main className="flex-1 py-6 md:py-12">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            {/* Fun Header with Mascot */}
            <div className="text-center mb-8 md:mb-12 space-y-4">
              <div className="flex justify-center">
                <CoquiMascot 
                  state={mascotState}
                  size="large"
                  position="inline"
                  className="animate-bounce-once"
                />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                {t("¡Vamos a Practicar!", "Let's Practice!")}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t(
                  "Elige una actividad divertida para mejorar tu lectura 📚",
                  "Choose a fun activity to improve your reading 📚"
                )}
              </p>
            </div>

            {/* Activities Section */}
            <ReadingActivities />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Activities;
