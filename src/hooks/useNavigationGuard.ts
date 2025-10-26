import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Intercepts navigation to ensure cleanup completes first
 */
export function useNavigationGuard(cleanup: () => Promise<void>) {
  const navigate = useNavigate();
  
  const guardedNavigate = useCallback(async (to: string) => {
    console.log('[NavigationGuard] 🚦 Navigation requested, cleaning up first...');
    await cleanup();
    console.log('[NavigationGuard] ✅ Cleanup complete, navigating...');
    navigate(to);
  }, [cleanup, navigate]);
  
  return guardedNavigate;
}
