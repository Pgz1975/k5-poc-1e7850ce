import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResponseTimeData } from "@/data/teacherAnalytics";

interface ResponseTimeChartProps {
  data: ResponseTimeData[];
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const { t } = useLanguage();

  const chartData = data.map(item => ({
    ...item,
    z: 100, // size of dots
    fill: item.status === "excellent" ? "hsl(125, 100%, 55%)" :
          item.status === "good" ? "hsl(190, 100%, 65%)" :
          "hsl(11, 100%, 65%)"
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Tiempo de Respuesta por Estudiante", "Response Time per Student")}
        </CardTitle>
        <CardDescription>
          {t("Velocidad vs. precisión de respuesta", "Response speed vs. accuracy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              dataKey="avgSeconds" 
              name={t("Segundos", "Seconds")}
              label={{ 
                value: t("Tiempo Promedio (seg)", "Average Time (sec)"), 
                position: 'insideBottom', 
                offset: -10 
              }}
            />
            <YAxis 
              type="number" 
              dataKey="accuracy" 
              name={t("Precisión", "Accuracy")}
              label={{ 
                value: t("Precisión (%)", "Accuracy (%)"), 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 100]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => {
                if (name === t("Segundos", "Seconds")) return `${value}s`;
                if (name === t("Precisión", "Accuracy")) return `${value}%`;
                return value;
              }}
            />
            <Scatter name={t("Estudiantes", "Students")} data={chartData}>
              {chartData.map((entry, index) => (
                <circle key={`dot-${index}`} fill={entry.fill} r={6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(125,100%,55%)]" />
            <span>{t("Excelente", "Excellent")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(190,100%,65%)]" />
            <span>{t("Bueno", "Good")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(11,100%,65%)]" />
            <span>{t("Necesita Ayuda", "Needs Help")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
