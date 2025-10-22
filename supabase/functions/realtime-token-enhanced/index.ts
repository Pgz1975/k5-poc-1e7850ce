import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      studentId,
      language = 'es-PR',
      gradeLevel = 0,
      assessmentId,
      voiceGuidance
    } = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let dynamicGuidance = voiceGuidance;
    let assessmentContent = null;

    if (assessmentId && !voiceGuidance) {
      const { data: assessment } = await supabase
        .from('manual_assessments')
        .select('title, content, voice_guidance, coqui_dialogue, pronunciation_words')
        .eq('id', assessmentId)
        .single();

      if (assessment) {
        assessmentContent = assessment.content;
        dynamicGuidance = assessment.coqui_dialogue || assessment.voice_guidance;
      }
    }

    const instructions = buildInstructions({
      language,
      gradeLevel,
      voiceGuidance: dynamicGuidance,
      assessmentContent
    });

    console.log('[Token] Creating enhanced session...');

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: getVoiceForLanguage(language),
        instructions,
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
          create_response: true
        },
        input_audio_transcription: {
          model: 'whisper-1'
        },
        temperature: 0.7,
        max_response_output_tokens: 4096
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Token] OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    await supabase.from('voice_sessions').insert({
      session_id: data.id,
      student_id: studentId,
      assessment_id: assessmentId,
      language,
      grade_level: gradeLevel,
      created_at: new Date().toISOString()
    });

    console.log('[Token] ✅ Enhanced session created:', data.id);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Token] ❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildInstructions({ language, gradeLevel, voiceGuidance, assessmentContent }: any) {
  const baseInstructions = getBaseInstructions(language, gradeLevel);
  let fullInstructions = baseInstructions;

  if (voiceGuidance) {
    fullInstructions += `\n\n## Guía Específica de la Actividad:\n${voiceGuidance}`;
  }

  if (assessmentContent) {
    const contentStr = typeof assessmentContent === 'string' 
      ? assessmentContent 
      : JSON.stringify(assessmentContent);
    fullInstructions += `\n\n## Contenido de la Evaluación:\n${contentStr}`;
  }

  return fullInstructions;
}

function getBaseInstructions(language: string, gradeLevel: number): string {
  if (language === 'es-PR') {
    return `Eres un tutor de lectura amigable y paciente para estudiantes de ${getGradeName(gradeLevel)} en Puerto Rico.

INSTRUCCIONES CRÍTICAS:
1. ACENTO: Usa acento puertorriqueño natural. NO uses acento mexicano, castellano o neutro.
2. VOCABULARIO: Usa palabras locales puertorriqueñas (ej: "chévere", "nene/nena", "ay bendito").
3. VELOCIDAD: Habla despacio y claramente, apropiado para niños de ${4 + gradeLevel} años.
4. TONO: Sé cálido, alentador y celebra cada pequeño logro.
5. CORRECCIONES: Nunca digas "está mal". En su lugar: "Casi lo tienes, vamos a intentarlo otra vez".
6. PACIENCIA: Si el niño no responde, espera 5 segundos antes de dar una pista.

FRASES TÍPICAS PUERTORRIQUEÑAS A USAR:
- "¡Wepa! ¡Qué bien lo hiciste!"
- "Dale, mi amor, tú puedes"
- "¡Ay qué chévere!"
- "¡Mira qué bien, nene/nena!"
- "¡Eso es, así mismito!"

PROCESO DE ENSEÑANZA:
1. Saluda con entusiasmo puertorriqueño
2. Explica la actividad en términos simples
3. Modela la pronunciación correcta
4. Pide al estudiante que repita
5. Celebra el esfuerzo, no solo el resultado
6. Ofrece ayuda si hay dificultad
7. Refuerza positivamente al final`;
  } else {
    return `You are a friendly, patient reading tutor for ${getGradeName(gradeLevel)} students in Puerto Rico who are English Language Learners.

CRITICAL INSTRUCTIONS:
1. ACCENT: Use clear, standard American English appropriate for ESL learners.
2. SPEED: Speak slowly and articulate clearly, appropriate for ${4 + gradeLevel}-year-olds.
3. VOCABULARY: Use simple, grade-appropriate words. Define new words.
4. TONE: Be warm, encouraging, and celebrate small victories.
5. CORRECTIONS: Never say "wrong". Instead: "Almost! Let's try again."
6. PATIENCE: If child doesn't respond, wait 5 seconds before giving a hint.
7. CULTURAL AWARENESS: These students' first language is Spanish.

SUPPORTIVE PHRASES TO USE:
- "Great job!"
- "You're doing amazing!"
- "I like how you tried!"
- "Let's practice together"
- "You're getting better!"

TEACHING PROCESS:
1. Greet enthusiastically
2. Explain activity in simple terms
3. Model correct pronunciation
4. Ask student to repeat
5. Celebrate effort, not just correctness
6. Offer help if struggling
7. Positive reinforcement at end`;
  }
}

function getGradeName(gradeLevel: number): string {
  const grades = ['Kindergarten', 'Primer Grado', 'Segundo Grado',
                  'Tercer Grado', 'Cuarto Grado', 'Quinto Grado'];
  return grades[gradeLevel] || 'Kindergarten';
}

function getVoiceForLanguage(language: string): string {
  if (language === 'es-PR') {
    return 'shimmer';
  }
  return 'alloy';
}
