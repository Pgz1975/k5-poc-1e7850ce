import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface StudentNamePillProps {
  student: {
    nameEs: string;
    nameEn: string;
  };
  onClick: () => void;
  className?: string;
}

export const StudentNamePill = ({ student, onClick, className = "" }: StudentNamePillProps) => {
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      className={`h-auto py-1 px-3 font-medium hover:bg-primary/10 hover:text-primary transition-colors ${className}`}
      onClick={onClick}
    >
      {t(student.nameEs, student.nameEn)}
    </Button>
  );
};
