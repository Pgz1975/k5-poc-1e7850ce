import { supabase } from '@/integrations/supabase/client';

interface LogAIResponseParams {
  sessionId: string;
  studentId: string;
  text: string;
  activityId?: string;
  language?: string;
}

export async function logAIResponse({
  sessionId,
  studentId,
  text,
  activityId,
  language
}: LogAIResponseParams) {
  try {
    // Skip logging if activityId is not a valid UUID (e.g., system activities)
    const isUUID = typeof activityId === 'string' && 
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(activityId);
    
    if (!isUUID) {
      console.log('[VoiceLogger] Skipping log - non-UUID activityId:', activityId);
      return;
    }

    const { error } = await supabase
      .from('voice_interactions')
      .insert({
        session_id: sessionId,
        student_id: studentId,
        assessment_id: activityId,
        text,
        is_user: false,
        language,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('[VoiceLogger] Failed to log AI response:', error);
    }
  } catch (err) {
    console.error('[VoiceLogger] Exception logging AI response:', err);
  }
}
