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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { text } = await req.json();

    console.log('[Language Detector] Analyzing text of length:', text.length);

    const result = detectLanguage(text);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('[Language Detector] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function detectLanguage(text: string) {
  const lowerText = text.toLowerCase();

  // Puerto Rican Spanish indicators
  const puertoRicanTerms = {
    guagua: /\bguagua\b/g,
    zafacon: /\bzafac[óo]n\b/g,
    mahones: /\bmahones\b/g,
    chiringa: /\bchiringa\b/g,
    chavos: /\bchavos\b/g,
    carro: /\bcarro\b/g,
    nene: /\bnene\b/g,
    nena: /\bnena\b/g,
    china: /\bchina\b/g,
    marqueta: /\bmarqueta\b/g,
  };

  // Spanish indicators
  const spanishIndicators = {
    articles: /\b(el|la|los|las|un|una|unos|unas)\b/g,
    verbs: /\b(es|son|está|están|hay|tiene|tienen)\b/g,
    prepositions: /\b(de|del|a|al|en|con|por|para|sin|sobre)\b/g,
    pronouns: /\b(yo|tú|él|ella|nosotros|ustedes|ellos)\b/g,
  };

  // English indicators
  const englishIndicators = {
    articles: /\b(the|a|an)\b/g,
    verbs: /\b(is|are|was|were|have|has|do|does)\b/g,
    prepositions: /\b(in|on|at|to|for|of|with|from|by)\b/g,
    pronouns: /\b(i|you|he|she|we|they|it)\b/g,
  };

  // Count matches
  let spanishScore = 0;
  let englishScore = 0;
  let puertoRicanScore = 0;

  // Check Spanish
  Object.values(spanishIndicators).forEach(regex => {
    const matches = lowerText.match(regex);
    if (matches) spanishScore += matches.length;
  });

  // Check English
  Object.values(englishIndicators).forEach(regex => {
    const matches = lowerText.match(regex);
    if (matches) englishScore += matches.length;
  });

  // Check Puerto Rican dialect
  Object.values(puertoRicanTerms).forEach(regex => {
    const matches = lowerText.match(regex);
    if (matches) puertoRicanScore += matches.length * 3; // Weight PR terms heavily
  });

  const totalWords = text.split(/\s+/).length;
  const totalIndicators = spanishScore + englishScore;

  let detectedLanguage: 'es' | 'en' | 'bilingual';
  let confidence: number;

  if (spanishScore > englishScore * 1.5) {
    detectedLanguage = 'es';
    confidence = Math.min(0.99, spanishScore / totalWords);
  } else if (englishScore > spanishScore * 1.5) {
    detectedLanguage = 'en';
    confidence = Math.min(0.99, englishScore / totalWords);
  } else {
    detectedLanguage = 'bilingual';
    confidence = Math.min(0.99, totalIndicators / totalWords);
  }

  const isPuertoRican = puertoRicanScore > 0 || (
    detectedLanguage === 'es' && 
    (lowerText.includes('puerto rico') || lowerText.includes('boricua'))
  );

  return {
    language: detectedLanguage,
    confidence,
    isPuertoRicanDialect: isPuertoRican,
    scores: {
      spanish: spanishScore,
      english: englishScore,
      puertoRican: puertoRicanScore
    },
    detectedTerms: extractPuertoRicanTerms(lowerText, puertoRicanTerms)
  };
}

function extractPuertoRicanTerms(text: string, terms: Record<string, RegExp>): string[] {
  const found: string[] = [];
  
  Object.entries(terms).forEach(([term, regex]) => {
    if (regex.test(text)) {
      found.push(term);
    }
  });

  return found;
}
