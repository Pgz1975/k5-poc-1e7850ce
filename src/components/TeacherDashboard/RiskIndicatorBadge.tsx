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
      className: "bg-destructive/10 text-destructive border-destructive/30"
    },
    medium: {
      icon: AlertCircle,
      label: t("Riesgo Moderado", "Moderate Risk"),
      className: "bg-warning/10 text-warning border-warning/30"
    },
    low: {
      icon: CheckCircle,
      label: t("En Progreso", "On Track"),
      className: "bg-success/10 text-success border-success/30"
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
