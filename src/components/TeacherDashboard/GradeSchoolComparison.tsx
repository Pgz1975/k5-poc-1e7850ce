import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockGradeComparison, mockSchoolComparison } from "@/data/teacherComparisons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const GradeSchoolComparison = () => {
  const { t } = useLanguage();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Grade Level Comparison */}
      <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>{t("Comparación entre Grados", "Grade Level Comparison")}</CardTitle>
          <CardDescription>
            {t("Rendimiento promedio por grado escolar", "Average performance by grade level")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockGradeComparison}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="grade" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                {mockGradeComparison.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.highlight ? "hsl(125, 100%, 71%)" : "hsl(176, 84%, 71%)"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2">
            {t("* Tu clase está resaltada en verde", "* Your class is highlighted in green")}
          </p>
        </CardContent>
      </Card>

      {/* School Comparison */}
      <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle>{t("Comparación entre Escuelas", "School Comparison")}</CardTitle>
          <CardDescription>
            {t("Rendimiento de tu escuela vs. otras escuelas", "Your school vs. other schools performance")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Escuela", "School")}</TableHead>
                <TableHead className="text-right">{t("Promedio", "Average")}</TableHead>
                <TableHead className="text-right">{t("Estudiantes", "Students")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSchoolComparison.map((school, index) => (
                <TableRow key={index} className={school.highlight ? "bg-lime-50 font-semibold" : ""}>
                  <TableCell>
                    {school.school}
                    {school.highlight && (
                      <Badge className="ml-2 bg-gradient-to-r from-lime-400 to-lime-500 text-white border-0">
                        {t("Tu Escuela", "Your School")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={school.highlight ? "text-lg font-bold text-lime-700" : ""}>
                      {school.average}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {school.students}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
