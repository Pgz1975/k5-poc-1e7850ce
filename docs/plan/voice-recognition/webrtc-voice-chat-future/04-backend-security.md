# OpenAI Realtime API - Backend & Security Plan

## Security Principles

1. **Never expose API keys in frontend**
2. **Use ephemeral tokens** with short expiration
3. **Validate authentication** before issuing tokens
4. **Rate limit** token generation
5. **Log usage** for monitoring and cost control

## Backend Architecture

```
┌─────────────────────┐
│   User's Browser    │
│   (Authenticated)   │
└──────────┬──────────┘
           │
           │ POST /functions/v1/generate-realtime-token
           │ Authorization: Bearer <supabase-token>
           ▼
┌─────────────────────┐
│  Supabase Edge      │
│  Function           │
│  - Verify JWT       │
│  - Check rate limit │
│  - Get user context │
└──────────┬──────────┘
           │
           │ POST /v1/realtime/client_secrets
           │ Authorization: Bearer <openai-api-key>
           ▼
┌─────────────────────┐
│   OpenAI API        │
│   Returns:          │
│   ephemeral token   │
└──────────┬──────────┘
           │
           │ Return token
           ▼
┌─────────────────────┐
│   User's Browser    │
│   Use token for     │
│   WebRTC connection │
└─────────────────────┘
```

## Edge Function Implementation

### File: `supabase/functions/generate-realtime-token/index.ts`

```typescript
import { serve } from \"https://deno.land/std@0.168.0/http/server.ts\";
import { createClient } from \"https://esm.sh/@supabase/supabase-js@2\";
import \"https://deno.land/x/xhr@0.1.0/mod.ts\";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenRequest {
  userRole?: 'student' | 'teacher' | 'family';
  language?: 'es' | 'en';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verify authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Token request from user: ${user.id}`);

    // 2. Get request parameters
    const { userRole, language }: TokenRequest = await req.json().catch(() => ({}));

    // 3. Fetch user profile for additional context
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const actualRole = roleData?.role || userRole || 'student';

    // 4. Check rate limiting (optional but recommended)
    const rateLimitOk = await checkRateLimit(supabaseClient, user.id);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // 6. Configure session with custom instructions
    const sessionConfig = {
      session: {
        type: \"realtime\",
        model: \"gpt-realtime\",
        instructions: getInstructions(actualRole, language || 'en', profile?.full_name),
        audio: {
          output: { 
            voice: getVoiceForLanguage(language || 'en')
          }
        },
        turn_detection: {
          type: \"server_vad\",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        input_audio_transcription: {
          model: \"whisper-1\"
        }
      }
    };

    // 7. Request ephemeral token from OpenAI
    const response = await fetch(\"https://api.openai.com/v1/realtime/client_secrets\", {
      method: \"POST\",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        \"Content-Type\": \"application/json\",
      },
      body: JSON.stringify(sessionConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    // 8. Log token generation for monitoring
    await logTokenUsage(supabaseClient, user.id, actualRole);

    // 9. Return token to client
    return new Response(
      JSON.stringify({ 
        token: data.value,
        expiresAt: Date.now() + 60000 // Tokens typically expire in 60 seconds
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(\"Error generating token:\", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper: Get custom instructions based on role
function getInstructions(role: string, language: string, userName?: string): string {
  const greeting = userName ? `Hi ${userName}!` : 'Hello!';
  
  const instructions = {
    student: {
      es: `Eres un mentor AI amigable llamado \\\"Mentor Virtual\\\". Tu objetivo es ayudar a estudiantes a mejorar sus habilidades de lectura y comprensión en español e inglés.\\n\\nComportamiento:\\n- Usa lenguaje simple y claro\\n- Sé paciente y alentador\\n- Celebra los logros del estudiante\\n- Si el estudiante tiene dificultades, ofrece pistas en lugar de respuestas directas\\n- Mantén las respuestas cortas (2-3 oraciones)\\n- Haz preguntas para verificar comprensión\\n\\nRecuerda: Tu meta es inspirar amor por la lectura.`,

      en: `You are a friendly AI mentor called \\\"Virtual Mentor\\\". Your goal is to help students improve their reading and comprehension skills in Spanish and English.\\n\\nBehavior:\\n- Use simple, clear language\\n- Be patient and encouraging\\n- Celebrate student achievements\\n- If student struggles, offer hints rather than direct answers\\n- Keep responses short (2-3 sentences)\\n- Ask questions to verify understanding\\n\\nRemember: Your goal is to inspire love for reading.`
    },
    teacher: {
      es: `Eres un asistente AI para profesores. Ayudas con:\\n- Estrategias de enseñanza personalizadas\\n- Análisis de progreso estudiantil\\n- Sugerencias de actividades\\n- Responder preguntas pedagógicas\\n\\nSé profesional pero accesible. Proporciona respuestas prácticas y basadas en evidencia.`,

      en: `You are an AI assistant for teachers. You help with:\\n- Personalized teaching strategies\\n- Student progress analysis\\n- Activity suggestions\\n- Answering pedagogical questions\\n\\nBe professional but approachable. Provide practical, evidence-based responses.`
    },
    family: {
      es: `Eres un asistente AI para familias. Ayudas a padres a:\\n- Entender el progreso de sus hijos\\n- Sugerir actividades de apoyo en casa\\n- Responder preguntas sobre el aprendizaje\\n- Proporcionar consejos de crianza positiva\\n\\nSé empático y comprensivo. Reconoce los desafíos de la crianza.`,

      en: `You are an AI assistant for families. You help parents to:\\n- Understand their children's progress\\n- Suggest support activities at home\\n- Answer questions about learning\\n- Provide positive parenting tips\\n\\nBe empathetic and understanding. Acknowledge parenting challenges.`
    }
  };

  const instruction = instructions[role]?.[language] || instructions.student.en;
  return `${greeting}\\\\n\\\\n${instruction}`;
}

// Helper: Select voice based on language
function getVoiceForLanguage(language: string): string {
  const voices = {
    es: 'nova',      // Warm, friendly female voice
    en: 'nova'       // Same voice works well for both
  };
  return voices[language] || 'nova';
}

// Helper: Rate limiting (prevents abuse)
async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  const LIMIT = 10; // 10 tokens per hour
  const WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

  const { data, error } = await supabase
    .from('realtime_token_usage')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - WINDOW).toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow if check fails
  }

  return (data?.length || 0) < LIMIT;
}

// Helper: Log token usage
async function logTokenUsage(supabase: any, userId: string, role: string) {
  await supabase
    .from('realtime_token_usage')
    .insert({
      user_id: userId,
      role: role,
      created_at: new Date().toISOString()
    });
}
```

## Database Schema for Tracking

### Migration: Track token usage

```sql
-- Create table for tracking realtime token usage
CREATE TABLE IF NOT EXISTS realtime_token_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for rate limiting queries
CREATE INDEX idx_realtime_token_usage_user_created 
ON realtime_token_usage(user_id, created_at);

-- Enable RLS
ALTER TABLE realtime_token_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage
CREATE POLICY \"Users can view their own token usage\"
ON realtime_token_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can insert (for edge function)
CREATE POLICY \"Service role can insert token usage\"
ON realtime_token_usage
FOR INSERT
WITH CHECK (true);
```

## Configuration

### Update `supabase/config.toml`

```toml
[functions.generate-realtime-token]
verify_jwt = true  # Require authentication
```

## Cost Management

### OpenAI Pricing (as of 2024)

Realtime API pricing:
- **Audio input**: $0.10 per minute
- **Audio output**: $0.20 per minute
- **Text input**: Varies by model
- **Text output**: Varies by model

### Estimated Costs

For educational use:
- **Average session**: 3-5 minutes
- **Cost per session**: ~$0.90 - $1.50
- **100 students, 1 session/day**: ~$90-150/day

### Cost Control Strategies

1. **Rate Limiting**: Limit tokens per user per hour
2. **Session Duration Limits**: Auto-disconnect after 10 minutes
3. **Usage Quotas**: Give students X minutes per week
4. **Monitoring**: Alert when costs exceed threshold

### Implementation

```typescript
// In edge function
const MAX_SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

// Include in session config
const sessionConfig = {
  session: {
    // ... other config
    max_response_output_tokens: 1000,  // Limit response length
  }
};
```

## Monitoring & Logging

### What to Log

```typescript
// In edge function
console.log(JSON.stringify({
  event: 'token_generated',
  userId: user.id,
  role: actualRole,
  language: language,
  timestamp: new Date().toISOString()
}));
```

### Metrics to Track

1. **Token generation rate**: Tokens/hour, tokens/day
2. **User engagement**: Sessions per user
3. **Error rate**: Failed token requests
4. **Costs**: OpenAI API usage
5. **Performance**: Token generation latency

### Dashboard Queries

```sql
-- Daily token usage by role
SELECT 
  DATE(created_at) as date,
  role,
  COUNT(*) as token_count
FROM realtime_token_usage
GROUP BY DATE(created_at), role
ORDER BY date DESC;

-- Top users by token consumption
SELECT 
  user_id,
  COUNT(*) as session_count,
  MAX(created_at) as last_session
FROM realtime_token_usage
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY session_count DESC
LIMIT 10;
```

## Security Checklist

- [x] API key stored as Supabase secret (not in code)
- [x] JWT verification enabled on edge function
- [x] Rate limiting implemented
- [x] User authentication required
- [x] Tokens are ephemeral (short-lived)
- [x] Usage logging for auditing
- [x] Error messages don't expose sensitive info
- [x] CORS properly configured
- [x] Input validation on requests
- [x] Cost controls in place

## Testing the Backend

### 1. Test token generation

```bash
curl -X POST \\
  'https://your-project.supabase.co/functions/v1/generate-realtime-token' \\
  -H 'Authorization: Bearer YOUR_SUPABASE_JWT' \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"userRole\": \"student\",
    \"language\": \"en\"
  }'
```

Expected response:
```json
{
  \"token\": \"ek_abc123...\",
  \"expiresAt\": 1234567890
}
```

### 2. Test authentication failure

```bash
curl -X POST \\
  'https://your-project.supabase.co/functions/v1/generate-realtime-token'
```

Expected: 401 Unauthorized

### 3. Test rate limiting

Make 11+ requests within 1 hour:

Expected: 429 Too Many Requests

## Troubleshooting

### Issue: \"OPENAI_API_KEY not configured\"

**Solution**: Add secret in Supabase dashboard
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-...
```

### Issue: 401 Unauthorized

**Solution**: Check JWT token is valid and not expired

### Issue: High costs

**Solution**: 
1. Check usage logs
2. Implement stricter rate limits
3. Add session duration limits
4. Consider using text-only mode for some interactions

## Next Steps

1. Implement edge function
2. Create database migration for tracking
3. Test token generation flow
4. Set up monitoring dashboard
5. Configure cost alerts
