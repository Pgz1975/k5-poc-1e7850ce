import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, modelType } = await req.json();

    console.log('[check-cost-limits] Checking limits for:', { studentId, modelType });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check monthly cost limit ($10 per student for premium models)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('model_usage_costs')
      .select('actual_cost')
      .eq('student_id', studentId)
      .gte('created_at', startOfMonth.toISOString())
      .neq('model_type', 'web-speech-api');

    if (error) {
      console.error('[check-cost-limits] Database error:', error);
      return new Response(JSON.stringify({ allowed: false, error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    const totalCost = data.reduce((sum, row) => sum + (row.actual_cost || 0), 0);
    const monthlyLimit = 10.00; // $10 per student per month

    const allowed = totalCost < monthlyLimit;
    const remaining = Math.max(0, monthlyLimit - totalCost);

    console.log('[check-cost-limits] Result:', { totalCost, allowed, remaining });

    return new Response(JSON.stringify({
      allowed,
      totalCost,
      remaining,
      limit: monthlyLimit
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('[check-cost-limits] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
