import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🧹 Starting TEST G1 data reset...');

    // Get TEST G1 activity IDs
    const { data: testActivities, error: activitiesError } = await supabase
      .from('manual_assessments')
      .select('id')
      .ilike('title', 'TEST G1%');

    if (activitiesError) {
      console.error('Error fetching TEST G1 activities:', activitiesError);
      throw activitiesError;
    }

    const activityIds = testActivities?.map(a => a.id) || [];
    console.log(`Found ${activityIds.length} TEST G1 activities`);

    if (activityIds.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          completedActivityCount: 0,
          voiceSessionsCount: 0,
          message: 'No TEST G1 activities found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete completed_activity rows
    const { data: deletedActivities, error: deleteActivitiesError } = await supabase
      .from('completed_activity')
      .delete()
      .in('activity_id', activityIds)
      .select();

    if (deleteActivitiesError) {
      console.error('Error deleting completed_activity:', deleteActivitiesError);
      throw deleteActivitiesError;
    }

    const completedActivityCount = deletedActivities?.length || 0;
    console.log(`✅ Deleted ${completedActivityCount} completed_activity rows`);

    // Delete voice_sessions rows
    const { data: deletedSessions, error: deleteSessionsError } = await supabase
      .from('voice_sessions')
      .delete()
      .in('assessment_id', activityIds)
      .select();

    if (deleteSessionsError) {
      console.error('Error deleting voice_sessions:', deleteSessionsError);
      throw deleteSessionsError;
    }

    const voiceSessionsCount = deletedSessions?.length || 0;
    console.log(`✅ Deleted ${voiceSessionsCount} voice_sessions rows`);

    console.log('🎉 Reset complete!');

    return new Response(
      JSON.stringify({
        success: true,
        completedActivityCount,
        voiceSessionsCount,
        activityIds,
        message: `Successfully reset TEST G1 data: ${completedActivityCount} completed activities, ${voiceSessionsCount} voice sessions`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Reset failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
