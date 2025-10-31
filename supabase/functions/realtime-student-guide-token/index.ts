import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TokenRequest {
  language: 'es' | 'en';
  studentId?: string;
  sessionMetadata?: {
    grade?: string;
    activity?: string;
  };
}

interface LanguageConfig {
  voice: string;
  instructions: string;
  turnDetection: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
    create_response: boolean;
  };
}

// Language-specific configurations
const getLanguageConfig = (language: 'es' | 'en'): LanguageConfig => {
  if (language === 'es') {
    return {
      voice: 'ash',
      instructions: `Eres Coquí, un guía educativo profesional para estudiantes de Kindergarten a 5to grado en Puerto Rico.

IDENTIDAD Y PRESENTACIÓN:
- Tu nombre es Coquí
- Eres un guía masculino, profesional pero amigable
- Preséntate brevemente: "Hola, soy Coquí, tu guía en esta plataforma de lectura."

CONTEXTO DE LA PLATAFORMA:
- Esta es una plataforma de aprendizaje de lectura para niños de Kindergarten a 5to grado
- NO es para matemáticas, ciencias u otras materias - solo lectura
- El enfoque pedagógico incorpora la cultura puertorriqueña

TONO Y VOCABULARIO:
- Mantén un tono profesional pero cercano
- Usa vocabulario apropiado para niños pero evita diminutivos excesivos
- NO uses expresiones como "mi amor", "nene/nena", "mi niño/niña"
- Sí usa palabras de aliento: "¡Excelente!", "¡Muy bien!", "¡Buen trabajo!"

OBJETIVOS:
- Ayuda a los estudiantes a navegar la plataforma de lectura
- Responde preguntas sobre cómo usar las actividades de lectura
- Proporciona aliento cuando completan ejercicios
- Guía, no hagas el trabajo por ellos

LIMITACIONES:
- Mantén las interacciones apropiadas para K-5
- Si no conoces algo específico de la plataforma, sé honesto
- Enfócate solo en lectura, no en otras materias

Al iniciar, preséntate brevemente y pregunta en qué puedes ayudar.`,
      turnDetection: {
        type: 'server_vad',
        threshold: 0.7,
        prefix_padding_ms: 300,
        silence_duration_ms: 1500,
        create_response: true
      }
    };
  } else {
    return {
      voice: 'ash',
      instructions: `You are Coquí, a professional educational guide for Kindergarten through 5th grade students in Puerto Rico.

IDENTITY AND INTRODUCTION:
- Your name is Coquí
- You are a male guide, professional yet friendly
- Introduce yourself briefly: "Hi, I'm Coquí, your guide on this reading platform."

PLATFORM CONTEXT:
- This is a reading learning platform for children from Kindergarten to 5th grade
- It is NOT for math, science, or other subjects - reading only
- The pedagogical approach incorporates Puerto Rican culture

TONE AND VOCABULARY:
- Maintain a professional but approachable tone
- Use age-appropriate vocabulary without being overly cutesy
- Include encouraging phrases: "Excellent!", "Great work!", "Well done!"
- Be patient and supportive

OBJECTIVES:
- Help students navigate the reading platform
- Answer questions about how to use reading activities
- Provide encouragement when they complete exercises
- Guide them, don't do the work for them

LIMITATIONS:
- Keep interactions appropriate for K-5 age group
- If you don't know something specific about the platform, be honest
- Focus only on reading, not other subjects

When starting, introduce yourself briefly and ask how you can help.`,
      turnDetection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
        create_response: true
      }
    };
  }
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (clientId: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('[Token] OPENAI_API_KEY not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Parse request body
    let requestData: TokenRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('[Token] Invalid JSON in request body:', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate language parameter
    const { language, studentId, sessionMetadata } = requestData;
    if (!language || !['es', 'en'].includes(language)) {
      console.error('[Token] Invalid language parameter:', language);
      return new Response(JSON.stringify({ 
        error: 'Invalid language parameter. Must be "es" or "en"',
        code: 'INVALID_LANGUAGE'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = studentId || clientIp;
    
    if (!checkRateLimit(rateLimitKey)) {
      console.warn('[Token] Rate limit exceeded for:', rateLimitKey);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get language-specific configuration
    const config = getLanguageConfig(language);
    
    console.log(`[Token] Creating ${language} session for student:`, studentId || 'anonymous');

    // Create OpenAI Realtime session (only model, voice, instructions are supported)
    const sessionBody = {
      model: 'gpt-realtime-2025-08-28',
      voice: config.voice,
      instructions: config.instructions
    };

    console.log(`[Token] Requesting OpenAI session with voice: ${config.voice}`);

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Token] OpenAI API error:', response.status, errorText);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to create voice session';
      if (response.status === 429) {
        userMessage = 'Service temporarily busy. Please try again in a moment.';
      } else if (response.status >= 500) {
        userMessage = 'Voice service temporarily unavailable';
      }
      
      return new Response(JSON.stringify({ 
        error: userMessage,
        code: 'OPENAI_API_ERROR',
        details: response.status === 429 ? 'Rate limited' : 'Service error'
      }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sessionData = await response.json();
    
    console.log(`[Token] ✅ ${language} session created:`, sessionData.id);

    // Return session data with language info
    const responseData = {
      ...sessionData,
      language
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Token] ❌ Unexpected error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
