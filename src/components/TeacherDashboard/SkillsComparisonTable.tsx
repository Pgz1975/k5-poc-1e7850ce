import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUpDown } from "lucide-react";
import { mockStudentSkillScores, StudentSkillScore } from "@/data/teacherSkillsData";
import { Button } from "@/components/ui/button";

type SortField = "studentName" | "comprehension" | "fluency" | "vocabulary" | "pronunciation" | "overall";

export const SkillsComparisonTable = () => {
  const { t } = useLanguage();
  const [sortField, setSortField] = useState<SortField>("overall");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStudents = [...mockStudentSkillScores].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return <Badge className="bg-green-100 text-green-700 border-green-300">{score}</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">{score}</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 border-red-300">{score}</Badge>;
    }
  };

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-700 border-green-300">{t("Bajo", "Low")}</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">{t("Medio", "Medium")}</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-700 border-red-300">{t("Alto", "High")}</Badge>;
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 px-2 hover:bg-muted"
      onClick={() => handleSort(field)}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{t("Comparación de Habilidades por Estudiante", "Skills Comparison by Student")}</CardTitle>
        <CardDescription>
          {t("Haga clic en los encabezados para ordenar", "Click headers to sort")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortButton field="studentName" label={t("Estudiante", "Student")} />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton field="comprehension" label={t("Comprensión", "Comprehension")} />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton field="fluency" label={t("Fluidez", "Fluency")} />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton field="vocabulary" label={t("Vocabulario", "Vocabulary")} />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton field="pronunciation" label={t("Pronunciación", "Pronunciation")} />
                </TableHead>
                <TableHead className="text-center">
                  <SortButton field="overall" label={t("Promedio", "Overall")} />
                </TableHead>
                <TableHead className="text-center">
                  {t("Riesgo", "Risk")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.studentName}>
                  <TableCell className="font-medium">
                    {student.studentName}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScoreBadge(student.comprehension)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScoreBadge(student.fluency)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScoreBadge(student.vocabulary)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScoreBadge(student.pronunciation)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className="font-bold"
                      style={{
                        backgroundColor: student.overall >= 85 ? "hsl(125, 100%, 55%)" : 
                                       student.overall >= 70 ? "hsl(27, 100%, 71%)" : 
                                       "hsl(11, 100%, 65%)",
                        color: "white",
                        border: "none"
                      }}
                    >
                      {student.overall}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getRiskBadge(student.riskLevel)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
