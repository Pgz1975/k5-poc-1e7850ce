/**
 * Coquí Timeout Warning Component
 * Shows friendly countdown when student is inactive
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MousePointer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CoquiTimeoutIndicatorProps {
  countdownSeconds: number;
  isVisible: boolean;
  position?: 'above' | 'below' | 'beside';
  onReactivate?: () => void;
}

export const CoquiTimeoutIndicator: React.FC<CoquiTimeoutIndicatorProps> = ({
  countdownSeconds,
  isVisible,
  position = 'above',
  onReactivate
}) => {
  const { language } = useLanguage();
  const [animatedCount, setAnimatedCount] = useState(countdownSeconds);

  useEffect(() => {
    setAnimatedCount(countdownSeconds);
  }, [countdownSeconds]);

  const messages = {
    es: {
      waiting: "Esperando tu respuesta...",
      ending: "La sesión terminará en",
      click: "Haz clic para continuar hablando",
      seconds: "segundos"
    },
    en: {
      waiting: "Waiting for your response...",
      ending: "Session will end in",
      click: "Click to keep talking",
      seconds: "seconds"
    }
  };

  const msg = messages[language === 'es' ? 'es' : 'en'];

  const positionClasses = {
    above: 'bottom-full mb-4',
    below: 'top-full mt-4',
    beside: 'left-full ml-4'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute z-50",
            positionClasses[position],
            "bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4",
            "border-2 border-orange-200",
            "min-w-[250px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {msg.waiting}
            </span>
          </div>

          {/* Countdown Display */}
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-orange-600">
              {animatedCount}
            </div>
            <div className="text-xs text-gray-500">
              {msg.seconds}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: 10,
                ease: 'linear'
              }}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={onReactivate}
            className="w-full bg-gradient-to-r from-primary to-primary-dark
                     text-white rounded-lg py-2 px-4
                     flex items-center justify-center gap-2
                     hover:shadow-lg transition-all duration-200
                     transform hover:scale-105"
          >
            <MousePointer className="w-4 h-4" />
            <span className="text-sm font-medium">
              {msg.click}
            </span>
          </button>

          {/* Friendly Character */}
          <div className="absolute -top-3 right-4">
            <div className="bg-white rounded-full p-1 shadow-md">
              <span className="text-2xl">🕐</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
