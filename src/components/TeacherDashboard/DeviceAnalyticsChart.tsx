import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockDeviceAnalytics } from "@/data/teacherDeviceAnalytics";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export const DeviceAnalyticsChart = () => {
  const { t } = useLanguage();
  const devices = mockDeviceAnalytics;

  const deviceData = [
    {
      name: t("Móvil", "Mobile"),
      value: devices.mobile,
      color: "hsl(329, 100%, 65%)",
      icon: Smartphone
    },
    {
      name: t("Tableta", "Tablet"),
      value: devices.tablet,
      color: "hsl(190, 100%, 65%)",
      icon: Tablet
    },
    {
      name: t("Computadora", "Computer"),
      value: devices.computer,
      color: "hsl(125, 100%, 55%)",
      icon: Monitor
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Uso por Dispositivo", "Device Usage")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          {deviceData.map((device) => {
            const Icon = device.icon;
            return (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: device.color }} />
                  <span className="text-sm font-medium">{device.name}</span>
                </div>
                <span className="text-2xl font-bold">{device.value}%</span>
              </div>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
