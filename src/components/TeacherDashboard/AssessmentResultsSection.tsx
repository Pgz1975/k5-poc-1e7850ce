import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClipboardCheck, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockAssessmentResults, mockDiagnosticTimeline } from "@/data/teacherAssessments";

export const AssessmentResultsSection = () => {
  const { t } = useLanguage();

  const getImprovementBadge = () => {
    if (!mockAssessmentResults.august || !mockAssessmentResults.december) return null;
    const improvement = mockAssessmentResults.december.avgScore - mockAssessmentResults.august.avgScore;
    
    if (improvement > 0) {
      return (
        <Badge className="bg-gradient-to-r from-lime-400 to-lime-500 text-white border-0 gap-1">
          <TrendingUp className="h-3 w-3" />
          +{improvement} {t("puntos", "points")}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg">
          <ClipboardCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("Resultados de Evaluaciones", "Assessment Results")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("Pruebas diagnósticas y alineación con estándares DEPR", "Diagnostic tests and DEPR standards alignment")}
          </p>
        </div>
      </div>

      {/* Assessment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* August Assessment */}
        <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("Agosto", "August")}</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              {mockAssessmentResults.august?.date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">
                {mockAssessmentResults.august?.avgScore}%
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{mockAssessmentResults.august?.standardsCovered} {t("estándares", "standards")}</div>
                <div>{mockAssessmentResults.august?.totalQuestions} {t("preguntas", "questions")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* December Assessment */}
        <Card className="border-2 border-purple-300 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("Diciembre", "December")}</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <CardDescription className="text-xs">
              {mockAssessmentResults.december?.date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-purple-600">
                  {mockAssessmentResults.december?.avgScore}%
                </div>
                {getImprovementBadge()}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{mockAssessmentResults.december?.standardsCovered} {t("estándares", "standards")}</div>
                <div>{mockAssessmentResults.december?.totalQuestions} {t("preguntas", "questions")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* May Assessment (Upcoming) */}
        <Card className="border-2 border-dashed border-gray-300 shadow-md hover:shadow-lg transition-all bg-gray-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-muted-foreground">{t("Mayo", "May")}</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">
              {t("Programado", "Scheduled")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-muted-foreground">
                —
              </div>
              <div className="text-sm text-muted-foreground">
                {t("Evaluación pendiente", "Upcoming assessment")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline Chart */}
      <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>{t("Progreso de Evaluaciones", "Assessment Progress")}</CardTitle>
          <CardDescription>
            {t("Evolución del rendimiento a lo largo del año", "Performance evolution throughout the year")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockDiagnosticTimeline}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="augustScore" 
                stroke="hsl(250, 100%, 75%)" 
                strokeWidth={3}
                name={t("Evaluación Agosto", "August Assessment")}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="decemberScore" 
                stroke="hsl(125, 100%, 71%)" 
                strokeWidth={3}
                name={t("Evaluación Diciembre", "December Assessment")}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
