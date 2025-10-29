import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockComparativeData } from "@/data/teacherComparisons";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const BenchmarkingTable = () => {
  const { t } = useLanguage();

  const benchmarks = [
    {
      category: t("Mi Clase - 3er Grado Sección A", "My Class - 3rd Grade Section A"),
      average: mockComparativeData.thisClass,
      isHighlight: true,
      trend: "baseline"
    },
    {
      category: t("Otras Clases de 3er Grado", "Other 3rd Grade Classes"),
      average: mockComparativeData.otherGrade3Classes,
      isHighlight: false,
      trend: mockComparativeData.thisClass > mockComparativeData.otherGrade3Classes ? "up" : "down"
    },
    {
      category: t("Promedio de la Escuela", "School Average"),
      average: mockComparativeData.schoolAverage,
      isHighlight: false,
      trend: mockComparativeData.thisClass > mockComparativeData.schoolAverage ? "up" : "down"
    },
    {
      category: t("Promedio Regional (ORE)", "Regional Average (ORE)"),
      average: mockComparativeData.regionalAverage,
      isHighlight: false,
      trend: mockComparativeData.thisClass > mockComparativeData.regionalAverage ? "up" : "down"
    },
    {
      category: t("Promedio de la Isla", "Island Average"),
      average: mockComparativeData.islandAverage,
      isHighlight: false,
      trend: mockComparativeData.thisClass > mockComparativeData.islandAverage ? "up" : "down"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-lime-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-coral-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendBadge = (trend: string) => {
    if (trend === "up") return <Badge className="bg-lime-100 text-lime-700 border-lime-300">{t("Superior", "Above")}</Badge>;
    if (trend === "down") return <Badge className="bg-coral-100 text-coral-700 border-coral-300">{t("Inferior", "Below")}</Badge>;
    return <Badge variant="outline">{t("Base", "Baseline")}</Badge>;
  };

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{t("Comparación de Rendimiento", "Performance Benchmarking")}</CardTitle>
        <CardDescription>
          {t("Rendimiento de tu clase comparado con otros grupos", "Your class performance compared to other groups")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Grupo", "Group")}</TableHead>
              <TableHead className="text-right">{t("Promedio", "Average")}</TableHead>
              <TableHead className="text-right">{t("Comparación", "Comparison")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benchmarks.map((benchmark, index) => (
              <TableRow key={index} className={benchmark.isHighlight ? "bg-lime-50 font-semibold" : ""}>
                <TableCell>
                  {benchmark.category}
                  {benchmark.isHighlight && (
                    <Badge className="ml-2 bg-gradient-to-r from-lime-400 to-lime-500 text-white border-0">
                      {t("Tú", "You")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-lg font-bold">{benchmark.average}%</span>
                    {getTrendIcon(benchmark.trend)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {getTrendBadge(benchmark.trend)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
