import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    const { documentIds } = await req.json();

    console.log('[Batch Processor] Processing', documentIds.length, 'documents');

    const results = [];

    for (const documentId of documentIds) {
      try {
        // Trigger processing for each document
        const { error } = await supabase.functions.invoke('process-pdf', {
          body: { documentId }
        });

        if (error) {
          results.push({ documentId, success: false, error: error.message });
        } else {
          results.push({ documentId, success: true });
        }
      } catch (error: any) {
        results.push({ documentId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    console.log('[Batch Processor] Completed:', successCount, '/', documentIds.length);

    return new Response(
      JSON.stringify({
        success: true,
        processed: successCount,
        total: documentIds.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Batch Processor] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
