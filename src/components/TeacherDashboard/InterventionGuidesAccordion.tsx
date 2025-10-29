import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookText, Brain, MessageCircle, Volume2 } from "lucide-react";
import { mockInterventionGuides } from "@/data/teacherResources";

export const InterventionGuidesAccordion = () => {
  const { t } = useLanguage();

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "comprehension": return <BookText className="h-5 w-5 text-pink-500" />;
      case "fluency": return <Volume2 className="h-5 w-5 text-cyan-500" />;
      case "vocabulary": return <MessageCircle className="h-5 w-5 text-lime-500" />;
      case "pronunciation": return <Brain className="h-5 w-5 text-coral-500" />;
      default: return null;
    }
  };

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          {t("Guías de Intervención", "Intervention Guides")}
        </CardTitle>
        <CardDescription>
          {t("Estrategias prácticas para apoyar el desarrollo de habilidades", "Practical strategies to support skill development")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {mockInterventionGuides.map((guide) => (
            <AccordionItem key={guide.id} value={`guide-${guide.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  {getSkillIcon(guide.skill)}
                  <div className="text-left">
                    <div className="font-semibold">
                      {t(guide.titleEs, guide.titleEn)}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {guide.skill}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t(
                      "Sigue estos pasos para mejorar esta habilidad:",
                      "Follow these steps to improve this skill:"
                    )}
                  </p>
                  <ol className="space-y-3">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <Badge className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-700 border-purple-300">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-gray-700 pt-0.5">
                          {t(step.es, step.en)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
