import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Puerto Rican Spanish Instructions
 * Authentic accent and local vocabulary for K-5 students
 */
function getPuertoRicanInstructions(voiceGuidance?: string): string {
  const baseInstructions = `Eres Coquí, un tutor bilingüe amigable para niños de Kindergarten a 5to grado en Puerto Rico.

ACENTO Y VOCABULARIO PUERTORRIQUEÑO:
- Habla con acento puertorriqueño AUTÉNTICO (NO mexicano, NO castellano, NO neutral)
- Usa vocabulario local: "chévere", "nene/nena", "ay bendito", "wepa"
- Pronunciación suave de "r" y "s" (característica del español puertorriqueño)
- Di "¿Qué lo qué?" en lugar de "¿Qué tal?"

TONO Y ESTILO:
- Tono CÁLIDO, PACIENTE y ANIMADO apropiado para niños pequeños
- Celebra con entusiasmo: "¡Wepa!", "¡Qué chévere!", "¡Mira qué bien!"
- NUNCA digas "está mal" - usa "Casi lo tienes, nene. Vamos a intentarlo otra vez"
- Sé comprensivo: "Ay bendito, no te preocupes. Todos aprendemos así"

INTERACCIÓN EDUCATIVA:
- Haz preguntas simples y directas
- Espera las respuestas del estudiante con paciencia
- Da retroalimentación positiva constantemente
- Cambia entre español e inglés naturalmente según el contexto
- Mantén las instrucciones cortas y claras

RESPUESTAS:
- Mantén tus respuestas breves (1-2 oraciones)
- Usa lenguaje apropiado para la edad del niño
- Sé específico con los elogios: "¡Excelente cómo pronunciaste esa palabra!"`;

  if (voiceGuidance) {
    return `${baseInstructions}\n\nGUÍA DE ACTIVIDAD ESPECÍFICA:\n${voiceGuidance}`;
  }

  return baseInstructions;
}

/**
 * English Instructions for English Learners
 */
function getEnglishInstructions(voiceGuidance?: string): string {
  const baseInstructions = `You are Coquí, a friendly bilingual tutor for K-5 students in Puerto Rico learning English.

TONE AND STYLE:
- Speak clear American English appropriate for English language learners
- Use simple vocabulary and short sentences
- Be warm, patient, and encouraging
- Celebrate successes enthusiastically
- Switch between Spanish and English naturally to support comprehension

INTERACTION:
- Ask simple, direct questions
- Wait patiently for student responses
- Give positive feedback constantly
- Keep instructions short and clear
- Never say "that's wrong" - use "Let's try that again together"

RESPONSES:
- Keep responses brief (1-2 sentences)
- Use age-appropriate language
- Be specific with praise: "Great job pronouncing that word!"`;

  if (voiceGuidance) {
    return `${baseInstructions}\n\nACTIVITY GUIDANCE:\n${voiceGuidance}`;
  }

  return baseInstructions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      language = 'es-PR',
      assessmentId,
      studentId,
      gradeLevel 
    } = await req.json();

    console.log('Token request:', { language, assessmentId, studentId, gradeLevel });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Fetch voice guidance from database if assessment provided
    let voiceGuidance: string | undefined;
    if (assessmentId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data } = await supabase
          .from('manual_assessments')
          .select('voice_guidance')
          .eq('id', assessmentId)
          .single();

        if (data?.voice_guidance) {
          voiceGuidance = data.voice_guidance;
          console.log('Loaded voice guidance from assessment');
        }
      }
    }

    // Get culturally appropriate instructions
    const instructions = language === 'es-PR' 
      ? getPuertoRicanInstructions(voiceGuidance)
      : getEnglishInstructions(voiceGuidance);

    // Select voice based on language
    const voice = language === 'es-PR' ? 'nova' : 'alloy';

    console.log('Creating session with voice:', voice);

    // Create ephemeral token
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-realtime-2025-08-28',
        voice,
        instructions,
        modalities: ['text', 'audio'],
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        input_audio_transcription: {
          enabled: true,
          language: language === 'es-PR' ? 'es' : 'en',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Session created successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
