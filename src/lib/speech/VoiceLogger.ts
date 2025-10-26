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
