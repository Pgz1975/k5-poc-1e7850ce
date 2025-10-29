import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { StudentRecommendation } from "@/data/teacherAnalytics";
import { Brain, TrendingUp, Calendar, Target, AlertCircle, CheckCircle2, AlertTriangle, Printer } from "lucide-react";

interface StudentRecommendationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: StudentRecommendation | null;
}

export function StudentRecommendationDrawer({
  open,
  onOpenChange,
  recommendation
}: StudentRecommendationDrawerProps) {
  const { t } = useLanguage();

  if (!recommendation) return null;

  const getSeverityConfig = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return {
          icon: AlertTriangle,
          className: "bg-red-100 text-red-700 border-red-300"
        };
      case "medium":
        return {
          icon: AlertCircle,
          className: "bg-yellow-100 text-yellow-700 border-yellow-300"
        };
      case "low":
        return {
          icon: CheckCircle2,
          className: "bg-green-100 text-green-700 border-green-300"
        };
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-2xl">{recommendation.studentName}</SheetTitle>
              <SheetDescription>
                {t("Plan de Aprendizaje Individualizado Generado por IA", "AI-Generated Individualized Learning Plan")}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline">{t("Nivel Actual", "Current Level")}: {recommendation.currentLevel}</Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              {recommendation.confidence}% {t("confianza", "confidence")}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Weaknesses Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-lg">
                {t("Áreas de Debilidad Identificadas", "Identified Weaknesses")}
              </h3>
            </div>
            <div className="space-y-3">
              {recommendation.weaknesses.map((weakness, index) => {
                const config = getSeverityConfig(weakness.severity);
                const Icon = config.icon;
                return (
                  <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {t(weakness.area, weakness.areaEn)}
                      </h4>
                      <Badge variant="outline" className={config.className}>
                        <Icon className="h-3 w-3 mr-1" />
                        {weakness.severity === "high" && t("Alta", "High")}
                        {weakness.severity === "medium" && t("Media", "Medium")}
                        {weakness.severity === "low" && t("Baja", "Low")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t(weakness.details, weakness.detailsEn)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Recommended Activities */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">
                {t("Actividades Recomendadas", "Recommended Activities")}
              </h3>
            </div>
            <div className="space-y-3">
              {recommendation.recommendedActivities.map((activity, index) => (
                <div key={index} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-gray-800">
                      {t(activity.title, activity.titleEn)}
                    </h4>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 shrink-0">
                      {activity.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{t(activity.frequency, activity.frequencyEn)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Expected Outcomes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">
                {t("Resultados Esperados", "Expected Outcomes")}
              </h3>
            </div>
            <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
              <p className="text-gray-800 font-medium">
                {t(recommendation.expectedImprovement, recommendation.expectedImprovementEn)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {t(
                  "Basado en patrones de estudiantes similares y evidencia de intervención",
                  "Based on similar student patterns and intervention evidence"
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t("Implementar Plan", "Implement Plan")}
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              {t("Imprimir", "Print")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
