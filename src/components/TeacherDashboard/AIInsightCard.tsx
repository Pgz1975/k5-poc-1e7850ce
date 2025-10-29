import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIInsightCardProps {
  type: "critical" | "trend" | "positive";
  icon: LucideIcon;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  actionText: string;
  actionTextEn: string;
  confidence: number;
  onClick?: () => void;
}

export function AIInsightCard({
  type,
  icon: Icon,
  title,
  titleEn,
  description,
  descriptionEn,
  actionText,
  actionTextEn,
  confidence,
  onClick
}: AIInsightCardProps) {
  const { t } = useLanguage();

  const borderColorClass = {
    critical: "border-l-red-500",
    trend: "border-l-yellow-500",
    positive: "border-l-green-500"
  }[type];

  const iconBgClass = {
    critical: "bg-red-100 text-red-600",
    trend: "bg-yellow-100 text-yellow-600",
    positive: "bg-green-100 text-green-600"
  }[type];

  return (
    <Card className={`border-l-4 ${borderColorClass} hover:shadow-lg transition-all`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-xl p-3 ${iconBgClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-800">
                {t(title, titleEn)}
              </h3>
              <Badge variant="outline" className="text-xs">
                {confidence}% {t("confianza", "confidence")}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {t(description, descriptionEn)}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClick}
              className="mt-2"
            >
              {t(actionText, actionTextEn)}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
