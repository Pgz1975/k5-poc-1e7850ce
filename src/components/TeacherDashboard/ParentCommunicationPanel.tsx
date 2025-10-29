import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockParentCommunication } from "@/data/culturalLocalization";
import { MessageSquare, Mail, Phone, Send, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentNamePill } from "./StudentNamePill";

interface ParentCommunicationPanelProps {
  students: any[];
  onStudentClick?: (student: any) => void;
}

export const ParentCommunicationPanel = ({ students, onStudentClick }: ParentCommunicationPanelProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "sms":
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      email: "bg-blue-100 text-blue-700 border-blue-300",
      whatsapp: "bg-green-100 text-green-700 border-green-300",
      sms: "bg-purple-100 text-purple-700 border-purple-300"
    };

    return (
      <Badge className={colors[method as keyof typeof colors]}>
        {getMethodIcon(method)}
        <span className="ml-1">{method.toUpperCase()}</span>
      </Badge>
    );
  };

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-lime-600" />
              {t("Comunicación con Padres", "Parent Communication")}
            </CardTitle>
            <CardDescription>
              {t("Preferencias y historial de reportes", "Preferences and report history")}
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                {t("Enviar Reporte", "Send Report")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Enviar Reporte Semanal", "Send Weekly Report")}</DialogTitle>
                <DialogDescription>
                  {t("Selecciona el método y estudiantes", "Select method and students")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t("Método de Envío", "Delivery Method")}</Label>
                  <RadioGroup defaultValue="email">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t("Correo Electrónico", "Email")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        SMS
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>{t("Idioma del Reporte", "Report Language")}</Label>
                  <Select defaultValue="spanish">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spanish">{t("Español", "Spanish")}</SelectItem>
                      <SelectItem value="english">{t("Inglés", "English")}</SelectItem>
                      <SelectItem value="both">{t("Ambos", "Both")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setOpen(false)}>
                  <Send className="h-4 w-4 mr-2" />
                  {t("Enviar a Todos los Padres", "Send to All Parents")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Estudiante", "Student")}</TableHead>
              <TableHead>{t("Método", "Method")}</TableHead>
              <TableHead>{t("Frecuencia", "Frequency")}</TableHead>
              <TableHead>{t("Último Envío", "Last Sent")}</TableHead>
              <TableHead>{t("Estado", "Status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockParentCommunication.preferences.slice(0, 5).map((pref) => {
              const student = students.find(s => s.id === pref.studentId);
              const lastSent = mockParentCommunication.lastSent.find(ls => ls.studentId === pref.studentId);
              
              if (!student) return null;

              return (
                <TableRow key={pref.studentId}>
                  <TableCell>
                    <StudentNamePill
                      student={{ nameEs: student.nameEs, nameEn: student.nameEn }}
                      onClick={() => onStudentClick?.(student)}
                    />
                  </TableCell>
                  <TableCell>
                    {getMethodBadge(pref.method)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {pref.frequency === "weekly" && t("Semanal", "Weekly")}
                      {pref.frequency === "biweekly" && t("Quincenal", "Biweekly")}
                      {pref.frequency === "monthly" && t("Mensual", "Monthly")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lastSent ? lastSent.date : t("Nunca", "Never")}
                  </TableCell>
                  <TableCell>
                    {lastSent && lastSent.opened ? (
                      <CheckCircle className="h-5 w-5 text-lime-600" />
                    ) : lastSent ? (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
