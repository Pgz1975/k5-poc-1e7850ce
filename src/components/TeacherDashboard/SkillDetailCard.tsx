import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SkillDetail } from "@/data/teacherSkillsData";

interface SkillDetailCardProps {
  skill: SkillDetail;
}

export const SkillDetailCard = ({ skill }: SkillDetailCardProps) => {
  const { t, language } = useLanguage();

  const getTrendIcon = () => {
    switch (skill.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendBadge = () => {
    const trendText = skill.trendPercentage > 0 
      ? `+${skill.trendPercentage}%` 
      : skill.trendPercentage < 0 
      ? `${skill.trendPercentage}%` 
      : "0%";
    
    const bgColor = skill.trend === "up" 
      ? "bg-green-100 text-green-700 border-green-300" 
      : skill.trend === "down" 
      ? "bg-red-100 text-red-700 border-red-300" 
      : "bg-gray-100 text-gray-700 border-gray-300";

    return (
      <Badge className={`${bgColor} gap-1`}>
        {getTrendIcon()}
        {trendText}
      </Badge>
    );
  };

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {language === "es" ? skill.skillName : skill.skillNameEn}
          </CardTitle>
          {getTrendBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold" style={{ color: skill.color }}>
            {skill.averageScore}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            / 100
          </div>
        </div>

        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={skill.progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={skill.color}
              strokeWidth={2}
              dot={{ fill: skill.color, r: 4 }}
              name={t("Puntaje", "Score")}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {language === "es" ? skill.insights.es : skill.insights.en}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
