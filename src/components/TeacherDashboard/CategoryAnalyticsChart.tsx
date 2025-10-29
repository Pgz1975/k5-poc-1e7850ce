import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCategoryAnalytics } from "@/data/teacherCategoryAnalytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const CategoryAnalyticsChart = () => {
  const { t, language } = useLanguage();
  const categories = mockCategoryAnalytics;

  const chartData = categories.map(cat => ({
    name: language === "es" ? cat.category : cat.categoryEn,
    value: cat.completed,
    color: cat.colorClass
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Textos por Categoría", "Texts by Category")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" name={t("Completados", "Completed")}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid gap-2">
          {categories.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.colorClass }}
                />
                <span>{language === "es" ? cat.category : cat.categoryEn}</span>
              </div>
              <span className="font-semibold">{cat.completed} {t("textos", "texts")}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
