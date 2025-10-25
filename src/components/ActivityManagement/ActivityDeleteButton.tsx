import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDeleteActivity } from '@/hooks/useDeleteActivity';

interface ActivityDeleteButtonProps {
  activityId: string;
  activityTitle: string;
  redirectPath: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}

export function ActivityDeleteButton({
  activityId,
  activityTitle,
  redirectPath,
  size = 'icon',
  variant = 'ghost',
}: ActivityDeleteButtonProps) {
  const { t } = useLanguage();
  const deleteMutation = useDeleteActivity();

  const handleDelete = () => {
    deleteMutation.mutate({ activityId, redirectPath });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('¿Eliminar actividad?', 'Delete activity?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              `¿Estás seguro de que quieres eliminar "${activityTitle}"? Esta acción no se puede deshacer.`,
              `Are you sure you want to delete "${activityTitle}"? This action cannot be undone.`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('Cancelar', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? t('Eliminando...', 'Deleting...')
              : t('Eliminar', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
