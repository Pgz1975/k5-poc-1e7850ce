import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet";
import { ReadingActivitiesV2 } from "@/components/StudentDashboard/ReadingActivities-v2";
import CoquiMascot from "@/components/CoquiMascot";
import { useState } from "react";

const ActivitiesV2 = () => {
  const { t } = useLanguage();
  const [mascotState, setMascotState] = useState("happy");

  return (
    <>
      <Helmet>
        <title>{t("Mis Actividades - FluenxIA", "My Activities - FluenxIA")}</title>
        <meta name="description" content={t("Actividades de lectura y práctica", "Reading and practice activities")} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50">
        <Header />
        
        <main className="flex-1 py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            {/* Welcome Header with Mascot - Duolingo Style */}
            <div className="rounded-3xl border-4 border-white bg-gradient-to-br from-[hsl(176,84%,95%)] to-[hsl(176,84%,85%)] p-8 md:p-12 shadow-[0_8px_0_rgba(255,255,255,0.8)] mb-8">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                <div className="flex justify-center">
                  <CoquiMascot 
                    state={mascotState}
                    size="large"
                    position="inline"
                    className="drop-shadow-2xl"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-black mb-4 text-[hsl(176,84%,25%)]">
                    {t("¡Vamos a Practicar!", "Let's Practice!")} 📚
                  </h1>
                  <p className="text-xl md:text-2xl font-bold text-[hsl(176,84%,30%)]">
                    {t(
                      "Elige una actividad divertida para mejorar tu lectura",
                      "Choose a fun activity to improve your reading"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Activities Section */}
            <ReadingActivitiesV2 />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ActivitiesV2;
