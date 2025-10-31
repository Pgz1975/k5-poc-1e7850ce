/**
 * Feature Flag Hook
 * Check if user is enrolled in a feature rollout (A/B testing)
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureFlag = (flagName: string, userId: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const { data, error } = await supabase
          .from('voice_feature_flags')
          .select('*')
          .eq('flag_name', flagName)
          .single();

        if (error) throw error;

        if (!data || !data.enabled) {
          setIsEnabled(false);
          setIsLoading(false);
          return;
        }

        // Deterministic user bucketing based on user ID hash
        const userHash = hashCode(userId);
        const bucket = Math.abs(userHash) % 100;
        
        // User is enrolled if their bucket is within the rollout percentage
        const enrolled = bucket < data.rollout_percentage;
        
        setIsEnabled(enrolled);
      } catch (err) {
        console.error('[FeatureFlag] Error checking flag:', err);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureFlag();
  }, [flagName, userId]);

  return { isEnabled, isLoading };
};

// Simple hash function for deterministic bucketing
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
