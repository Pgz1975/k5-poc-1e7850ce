import { ActivityEditModal } from './ActivityEditModal';
import { ActivityDeleteButton } from './ActivityDeleteButton';

interface ActivityActionsProps {
  activity: {
    id: string;
    title: string;
  };
  redirectPath: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ActivityActions({
  activity,
  redirectPath,
  size = 'icon',
}: ActivityActionsProps) {
  // NO PERMISSION CHECKS - Always show buttons for debugging
  return (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <ActivityEditModal 
        activityId={activity.id} 
        size={size}
      />
      <ActivityDeleteButton
        activityId={activity.id}
        activityTitle={activity.title}
        redirectPath={redirectPath}
        size={size}
      />
    </div>
  );
}
