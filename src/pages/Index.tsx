import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AIPlaceholder } from "@/components/AIPlaceholder";
import { CTASection } from "@/components/CTASection";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  return (
    <LanguageProvider>
      <Helmet>
        <title>LecturaPR - Plataforma Educativa Bilingüe con AI para Puerto Rico</title>
        <meta 
          name="description" 
          content="Plataforma educativa bilingüe innovadora con inteligencia artificial para estudiantes K-5 del Departamento de Educación de Puerto Rico. Aprende a leer en español e inglés con mentor AI personalizado." 
        />
        <meta 
          name="keywords" 
          content="educación Puerto Rico, lectura bilingüe, AI educación, DEPR, aprendizaje adaptativo, español inglés, K-5" 
        />
        <meta property="og:title" content="LecturaPR - Plataforma Educativa Bilingüe con AI" />
        <meta 
          property="og:description" 
          content="Aprende a leer en español e inglés con tecnología AI avanzada y métodos educativos probados para estudiantes de Puerto Rico." 
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://lecturapr.edu" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Hero />
          <FeaturesSection />
          <AIPlaceholder />
          <CTASection />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
