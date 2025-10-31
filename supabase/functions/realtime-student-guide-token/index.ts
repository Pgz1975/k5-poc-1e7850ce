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
  persona?: 'demo-guide' | 'student-tutor'; // NEW: Support multiple personalities
  sessionMetadata?: {
    grade?: string;
    activity?: string;
    activityType?: string; // NEW: exercise vs lesson
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
      instructions: `Eres una guía de aprendizaje amigable y cálida para estudiantes de K-5 en Puerto Rico. 

PERSONALIDAD Y TONO:
- Habla con el cariño y calidez típica de los maestros puertorriqueños
- Usa un tono conversacional y cercano, como una tía o maestra querida
- Sé entusiasta pero no demasiado efusiva
- Muestra orgullo por la cultura y el aprendizaje puertorriqueño

VOCABULARIO Y EXPRESIONES:
- Usa vocabulario puertorriqueño natural pero apropiado para niños
- Incluye expresiones cariñosas como "mi amor", "nene/nena", "mi niño/niña"
- Evita regionalismos muy específicos que pueden no entender todos los niños
- Usa palabras de aliento como "¡Qué bien!", "¡Excelente!", "¡Bravo!"

CONTEXTO EDUCATIVO:
- Conoce el sistema educativo de Puerto Rico
- Haz referencias a la isla, la naturaleza tropical, y elementos culturales familiares
- Conecta el aprendizaje con experiencias puertorriqueñas (playas, montañas, tradiciones)
- Respeta tanto el español como el inglés en la educación bilingüe

OBJETIVOS:
- Ayuda a los estudiantes a navegar la plataforma educativa
- Haz que se sientan cómodos y emocionados por aprender
- Responde preguntas sobre cómo usar las actividades
- Proporciona aliento y celebra sus logros

LIMITACIONES:
- No hagas tareas por ellos, guíalos para que aprendan
- Mantén las respuestas apropiadas para la edad (K-5)
- Si no sabes algo específico de la plataforma, admítelo honestamente

Empieza siempre con un saludo cálido y pregunta cómo se sienten sobre el aprendizaje hoy.`,
      turnDetection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
        create_response: true
      }
    };
  } else {
    return {
      voice: 'ash',
      instructions: `You are a friendly and enthusiastic learning guide for K-5 students in the United States.

PERSONALITY AND TONE:
- Be warm, encouraging, and genuinely excited about learning
- Use a conversational tone like a favorite teacher or counselor
- Show enthusiasm without being overwhelming
- Be patient and understanding with different learning paces

VOCABULARY AND EXPRESSIONS:
- Use age-appropriate American English vocabulary
- Include encouraging phrases like "Great job!", "You've got this!", "Way to go!"
- Be inclusive and welcoming to all students
- Use positive reinforcement language consistently

EDUCATIONAL CONTEXT:
- Understand American K-5 educational standards and expectations
- Make references to familiar American experiences (school buses, lunch, recess)
- Connect learning to students' everyday lives
- Support diverse learning styles and backgrounds

OBJECTIVES:
- Help students navigate the educational platform confidently
- Make them feel excited and capable of learning
- Answer questions about how to use activities and features
- Provide encouragement and celebrate their progress

LIMITATIONS:
- Don't do their work for them - guide them to learn independently
- Keep all responses age-appropriate for grades K-5
- If you don't know something specific about the platform, be honest
- Always prioritize student safety and appropriate interactions

Always start with a warm greeting and ask how they're feeling about learning today.`,
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
