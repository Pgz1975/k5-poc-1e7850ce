import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const ForPuertoRico = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-4xl">🇵🇷</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                {t("Diseñado para Puerto Rico", "Designed for Puerto Rico")}
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-lg text-muted-foreground">
            <p className="text-center leading-relaxed">
              {t(
                "FluenxIA fue creado específicamente para las necesidades únicas de los estudiantes puertorriqueños, respetando nuestra cultura, acento y métodos de enseñanza.",
                "FluenxIA was created specifically for the unique needs of Puerto Rican students, respecting our culture, accent and teaching methods."
              )}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🗣️</div>
                  <CardTitle className="text-base">
                    {t("Acento Local", "Local Accent")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {t(
                    "Reconocimiento de voz entrenado con acento puertorriqueño en español y variantes locales del inglés",
                    "Voice recognition trained with Puerto Rican Spanish accent and local English variants"
                  )}
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">📖</div>
                  <CardTitle className="text-base">
                    {t("Cultura Integrada", "Integrated Culture")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {t(
                    "Historias sobre El Yunque, el coquí, nuestras tradiciones y vocabulario puertorriqueño",
                    "Stories about El Yunque, the coquí, our traditions and Puerto Rican vocabulary"
                  )}
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">🏫</div>
                  <CardTitle className="text-base">
                    {t("Estándares DEPR", "PRDE Standards")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {t(
                    "100% alineado con los estándares del Departamento de Educación de Puerto Rico",
                    "100% aligned with Puerto Rico Department of Education standards"
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
