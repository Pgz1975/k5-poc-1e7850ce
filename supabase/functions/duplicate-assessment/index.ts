import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { id, new_name } = body;

    if (!id) {
      throw new Error('id is required');
    }

    // Fetch original assessment
    const { data: original, error: fetchError } = await supabase
      .from('generated_assessments')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id)
      .single();

    if (fetchError) throw fetchError;

    // Create duplicate
    const duplicate = {
      created_by: user.id,
      source_pdf_id: original.source_pdf_id,
      selected_items: original.selected_items,
      assessment_type: original.assessment_type,
      grade_level: original.grade_level,
      language: original.language,
      content: original.content,
      metadata: {
        ...original.metadata,
        duplicated_from: id,
        duplicated_at: new Date().toISOString(),
        name: new_name || `${original.metadata?.name || 'Assessment'} (Copy)`
      }
    };

    const { data: newAssessment, error: insertError } = await supabase
      .from('generated_assessments')
      .insert(duplicate)
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        assessment_id: newAssessment.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
