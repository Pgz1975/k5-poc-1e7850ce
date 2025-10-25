import { useState } from 'react';
import { Edit, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateAssessment from '@/pages/CreateAssessment';

interface ActivityEditModalProps {
  activityId: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  openInNewWindow?: boolean;
}

export function ActivityEditModal({
  activityId,
  size = 'icon',
  variant = 'ghost',
  openInNewWindow = false,
}: ActivityEditModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openInNewWindow) {
      navigate(`/assessments/edit/${activityId}`);
    } else {
      setOpen(true);
    }
  };

  if (openInNewWindow) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleEditClick}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('Editar Actividad', 'Edit Activity')}</DialogTitle>
          <DialogDescription>
            {t('Realiza cambios a esta actividad y guarda cuando termines', 'Make changes to this activity and save when you\'re done')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <CreateAssessment 
            editId={activityId} 
            isModal={true}
            onSaveSuccess={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
