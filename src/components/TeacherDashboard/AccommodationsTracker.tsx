import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockAccommodations, mockStudentAccommodations } from "@/data/culturalLocalization";
import { FileText } from "lucide-react";

interface AccommodationsTrackerProps {
  students: any[];
}

export const AccommodationsTracker = ({ students }: AccommodationsTrackerProps) => {
  const { t } = useLanguage();

  const getAccommodationBadge = (accKey: string) => {
    const acc = mockAccommodations[accKey as keyof typeof mockAccommodations];
    if (!acc) return null;
    
    return (
      <Badge variant="outline" className="mr-1 mb-1">
        <span className="mr-1">{acc.icon}</span>
        {t(acc.labelEs, acc.labelEn)}
      </Badge>
    );
  };

  const studentsWithAccommodations = students.filter(student => 
    mockStudentAccommodations.some(sa => sa.studentId === student.id)
  );

  return (
    <Card className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          {t("Acomodos Razonables y PEI", "Accommodations & IEP")}
        </CardTitle>
        <CardDescription>
          {t("Estudiantes con Plan Educativo Individualizado", "Students with Individualized Education Program")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Estudiante", "Student")}</TableHead>
              <TableHead>{t("PEI", "IEP")}</TableHead>
              <TableHead>{t("Acomodos", "Accommodations")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsWithAccommodations.map((student) => {
              const studentAccommodations = mockStudentAccommodations.find(sa => sa.studentId === student.id);
              if (!studentAccommodations) return null;

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {t(student.nameEs, student.nameEn)}
                  </TableCell>
                  <TableCell>
                    {studentAccommodations.hasPEI ? (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                        {t("Activo", "Active")}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t("504", "504")}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap">
                      {studentAccommodations.accommodations.map((accKey) => (
                        <div key={accKey}>
                          {getAccommodationBadge(accKey)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700">
            <strong>{t("Total:", "Total:")}</strong> {studentsWithAccommodations.length} {t("estudiantes con acomodos", "students with accommodations")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
