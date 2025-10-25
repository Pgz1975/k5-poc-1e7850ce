/**
 * Coquí Inactivity Management Hook
 * Implements 15-second silence detection with 10-second countdown warning
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type InactivityStatus = 'idle' | 'warning' | 'timedOut';

export interface UseCoquiInactivityProps {
  onWarning: () => void;
  onTimeout: () => void;
  onCountdown: (seconds: number) => void;
}

export function useCoquiInactivity({
  onWarning,
  onTimeout,
  onCountdown
}: UseCoquiInactivityProps) {
  const [status, setStatus] = useState<InactivityStatus>('idle');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    [silenceTimerRef, warningTimerRef, countdownIntervalRef].forEach(ref => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }, []);

  const startWarningPhase = useCallback(() => {
    console.log('[useCoquiInactivity] ⚠️ Starting warning phase');
    setStatus('warning');
    onWarning();

    let remainingSeconds = 10;
    onCountdown(remainingSeconds);

    countdownIntervalRef.current = setInterval(() => {
      remainingSeconds--;
      onCountdown(remainingSeconds);
      console.log('[useCoquiInactivity] ⏱️ Countdown:', remainingSeconds);

      if (remainingSeconds <= 0 && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setStatus('timedOut');
        onTimeout();
      }
    }, 1000);

    warningTimerRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setStatus('timedOut');
      onTimeout();
    }, 10000);
  }, [onCountdown, onTimeout, onWarning]);

  const recordActivity = useCallback(() => {
    console.log('[useCoquiInactivity] 👍 Activity recorded, resetting timers');
    clearTimers();
    setStatus('idle');
    silenceTimerRef.current = setTimeout(startWarningPhase, 15000);
  }, [clearTimers, startWarningPhase]);

  const stopMonitoring = useCallback(() => {
    console.log('[useCoquiInactivity] 🛑 Stopping monitoring');
    clearTimers();
    setStatus('idle');
  }, [clearTimers]);

  useEffect(() => () => {
    console.log('[useCoquiInactivity] 🧹 Cleanup');
    clearTimers();
  }, [clearTimers]);

  return {
    status,
    startMonitoring: recordActivity, // first call arms the silence timer
    recordActivity,
    stopMonitoring
  };
}
