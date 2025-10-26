import { useEffect, useRef } from 'react';
import { useCoquiSession, type VoiceContextConfig } from '@/hooks/useCoquiSession';

/**
 * Bridge component to expose endSession to parent via ref
 * Used for navigation guards in ViewLesson and LessonExerciseFlow
 */
interface CoquiVoiceBridgeProps {
  activityId: string;
  activityType: 'lesson' | 'exercise';
  voiceContext?: VoiceContextConfig;
  endSessionRef: React.MutableRefObject<(() => Promise<void>) | null>;
}

export function CoquiVoiceBridge({ 
  activityId, 
  activityType, 
  voiceContext,
  endSessionRef 
}: CoquiVoiceBridgeProps) {
  const { endSession } = useCoquiSession({
    activityId,
    activityType,
    voiceContext
  });

  // Expose endSession to parent via ref
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession, endSessionRef]);

  return null; // No UI - just session management
}
