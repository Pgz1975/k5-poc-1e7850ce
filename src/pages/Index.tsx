import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { WhatIsFluenxIA } from "@/components/WhatIsFluenxIA";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ForPuertoRico } from "@/components/ForPuertoRico";
import { AIPlaceholder } from "@/components/AIPlaceholder";
import { CTASection } from "@/components/CTASection";
import { ParentTeacherSection } from "@/components/ParentTeacherSection";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  return (
    <LanguageProvider>
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
          <Hero />
          <WhatIsFluenxIA />
          <FeaturesSection />
          <ForPuertoRico />
          <AIPlaceholder />
          <ParentTeacherSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
