/**
 * Coquí Session Status Badge
 * Shows current session status (Active, Warning, etc.)
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { InactivityStatus } from '@/hooks/useCoquiInactivity';

interface CoquiSessionBadgeProps {
  isConnected: boolean;
  inactivityStatus: InactivityStatus;
  className?: string;
}

export const CoquiSessionBadge: React.FC<CoquiSessionBadgeProps> = ({
  isConnected,
  inactivityStatus,
  className
}) => {
  const { language } = useLanguage();

  const statusConfig = {
    connected: {
      es: 'Activo',
      en: 'Active',
      color: 'bg-green-500'
    },
    warning: {
      es: 'Esperando',
      en: 'Waiting',
      color: 'bg-orange-500 animate-pulse'
    },
    timedOut: {
      es: 'Pausado',
      en: 'Paused',
      color: 'bg-gray-400'
    },
    disconnected: {
      es: 'Inactivo',
      en: 'Inactive',
      color: 'bg-gray-300'
    }
  };

  const getStatus = () => {
    if (!isConnected) return statusConfig.disconnected;
    if (inactivityStatus === 'warning') return statusConfig.warning;
    if (inactivityStatus === 'timedOut') return statusConfig.timedOut;
    return statusConfig.connected;
  };

  const status = getStatus();
  const text = language === 'es' ? status.es : status.en;

  return (
    <div
      className={cn(
        "px-2 py-1 rounded-full text-white text-xs font-medium",
        status.color,
        className
      )}
    >
      {text}
    </div>
  );
};
