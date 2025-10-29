import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { mockAssessmentResults } from "@/data/teacherAssessments";
import { useState } from "react";

export const StandardsAlignmentTable = () => {
  const { t } = useLanguage();
  const [filterSubject, setFilterSubject] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <Badge className="bg-gradient-to-r from-lime-400 to-lime-500 text-white border-0 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("Excelente", "Excellent")}
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-0 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("Bien", "Good")}
          </Badge>
        );
      case "needsWork":
        return (
          <Badge className="bg-gradient-to-r from-coral-400 to-coral-500 text-white border-0 gap-1">
            <AlertCircle className="h-3 w-3" />
            {t("Necesita Apoyo", "Needs Support")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const subjects = ["Español", "Lectura", "English"];
  const filteredStandards = filterSubject
    ? mockAssessmentResults.byStandard.filter(s => s.subject === filterSubject)
    : mockAssessmentResults.byStandard;

  const needsWorkCount = mockAssessmentResults.byStandard.filter(s => s.status === "needsWork").length;

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              {t("Alineación con Estándares DEPR", "DEPR Standards Alignment")}
            </CardTitle>
            <CardDescription>
              {t("Rendimiento de la clase por estándar educativo", "Class performance by educational standard")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterSubject === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterSubject(null)}
            >
              {t("Todos", "All")}
            </Button>
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={filterSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {needsWorkCount > 0 && (
          <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">
                  {t("Áreas de Atención", "Areas of Attention")}
                </h4>
                <p className="text-sm text-amber-700">
                  {needsWorkCount} {t("estándares requieren intervención adicional", "standards require additional intervention")}
                </p>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Estándar", "Standard")}</TableHead>
              <TableHead>{t("Materia", "Subject")}</TableHead>
              <TableHead>{t("Puntuación", "Score")}</TableHead>
              <TableHead>{t("Preguntas", "Questions")}</TableHead>
              <TableHead>{t("Estado", "Status")}</TableHead>
              <TableHead>{t("Acción", "Action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStandards.map((standard) => (
              <TableRow key={standard.standard}>
                <TableCell className="font-mono font-semibold">
                  {standard.standard}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{standard.subject}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-bold ${
                    standard.score >= 80 ? 'text-lime-600' : 
                    standard.score >= 70 ? 'text-cyan-600' : 
                    'text-coral-600'
                  }`}>
                    {standard.score}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {standard.questions}
                </TableCell>
                <TableCell>
                  {getStatusBadge(standard.status)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {t("Recursos", "Resources")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
