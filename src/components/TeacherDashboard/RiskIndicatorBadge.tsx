import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RiskIndicatorBadgeProps {
  level: "high" | "medium" | "low";
}

export function RiskIndicatorBadge({ level }: RiskIndicatorBadgeProps) {
  const { t } = useLanguage();

  const config = {
    high: {
      icon: AlertTriangle,
      label: t("Alto Riesgo", "High Risk"),
      className: "bg-red-100 text-red-700 border-red-300"
    },
    medium: {
      icon: AlertCircle,
      label: t("Riesgo Moderado", "Moderate Risk"),
      className: "bg-yellow-100 text-yellow-700 border-yellow-300"
    },
    low: {
      icon: CheckCircle,
      label: t("En Progreso", "On Track"),
      className: "bg-green-100 text-green-700 border-green-300"
    }
  }[level];

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
