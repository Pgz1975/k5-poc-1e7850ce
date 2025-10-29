import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ErrorPattern } from "@/data/teacherAnalytics";

interface ErrorPatternChartProps {
  data: ErrorPattern[];
}

export function ErrorPatternChart({ data }: ErrorPatternChartProps) {
  const { t, language } = useLanguage();

  const chartData = data.map(item => ({
    name: language === "es" ? item.domain : item.domainEn,
    value: item.count,
    color: item.colorClass,
    percentage: item.percentage
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Errores Más Comunes por Dominio", "Most Common Errors by Domain")}
        </CardTitle>
        <CardDescription>
          {t("Análisis de patrones de error para orientar la instrucción", "Error pattern analysis to guide instruction")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} ${t("errores", "errors")} (${props.payload.percentage}%)`,
                t("Frecuencia", "Frequency")
              ]}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
