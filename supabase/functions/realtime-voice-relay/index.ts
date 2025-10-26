import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const log = (...args: any[]) => console.log('[Realtime-Relay]', ...args);
const warn = (...args: any[]) => console.warn('[Realtime-Relay]', ...args);
const error = (...args: any[]) => console.error('[Realtime-Relay]', ...args);

interface ActivityContextPayload {
  activity_title?: string;
  activity_subtype?: string;
  language?: string;
  voice_guidance?: string;
  coqui_dialogue?: string;
  pronunciation_words?: string[];
  content?: unknown;
  is_continuation?: boolean;
  skip_greeting?: boolean;
}

interface SessionState {
  openaiWS: WebSocket | null;
  clientWS: WebSocket;
  state: 'connecting' | 'session_creating' | 'session_created' | 'session_updating' | 'ready' | 'error';
  pendingMessages: string[];
  voiceGuidance: string | null;
  language: string;
  studentId: string;
  activityId?: string;
  activityType?: string;
  contextPayload?: ActivityContextPayload | null;
  metrics: {
    connectionStart: number;
    sessionReady: number;
    chunksForwarded: number;
    audioChunksReceived: number;
  };
}

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const upgradeHeader = req.headers.get('upgrade') || '';
    if (upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket connection', { status: 400, headers: corsHeaders });
    }

    const { socket: clientWS, response } = Deno.upgradeWebSocket(req);
    const url = new URL(req.url);

    const voiceGuidance = url.searchParams.get('voice_guidance');
    const studentId = url.searchParams.get('student_id') ?? 'unknown';
    const language = url.searchParams.get('language') ?? 'es-PR';
    const model = url.searchParams.get('model') ?? 'gpt-4o-realtime-preview-2024-12-17';
    const activityId = url.searchParams.get('activity_id');
    const activityType = url.searchParams.get('activity_type');
    const rawContextPayload = url.searchParams.get('context_payload');
    const contextPayload = rawContextPayload ? decodeContextPayload(rawContextPayload) : null;

    log('Upgrade request', { 
      studentId, 
      language, 
      model, 
      activityId, 
      activityType,
      hasGuidance: !!voiceGuidance,
      hasContextPayload: !!contextPayload,
      contextBytes: rawContextPayload ? rawContextPayload.length : 0
    });

    if (!OPENAI_API_KEY) {
      error('OPENAI_API_KEY not configured');
      queueMicrotask(() => clientWS.close(1011, 'Server configuration error'));
      return response;
    }

    // Initialize session state
    const session: SessionState = {
      openaiWS: null,
      clientWS,
      state: 'connecting',
      pendingMessages: [],
      voiceGuidance,
      language,
      studentId,
      activityId: activityId ?? undefined,
      activityType: activityType ?? undefined,
      contextPayload,
      metrics: {
        connectionStart: performance.now(),
        sessionReady: 0,
        chunksForwarded: 0,
        audioChunksReceived: 0
      }
    };

    // Use latest production model (NOT preview)
    const latestModel = 'gpt-realtime-2025-08-28';
    
    // Connect to OpenAI Realtime API
    session.openaiWS = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${latestModel}`,
      [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1'
      ],
    );

    session.openaiWS.addEventListener('open', () => {
      log('✅ Connected to OpenAI Realtime API');
      session.state = 'session_creating';
    });

    session.openaiWS.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string);

        // CRITICAL: Forward audio immediately with ZERO delay
        if (msg.type === 'response.audio.delta') {
          if (session.clientWS.readyState === WebSocket.OPEN) {
            session.clientWS.send(event.data);
            session.metrics.chunksForwarded++;
          }
          return; // No further processing needed
        }

        // Forward all other messages immediately
        if (session.clientWS.readyState === WebSocket.OPEN) {
          session.clientWS.send(event.data);
        }

        // Handle session lifecycle
        if (msg.type === 'session.created') {
          log('✅ session.created');
          handleSessionCreated(session);
        } else if (msg.type === 'session.updated') {
          log('✅ session.updated');
          session.state = 'ready';
          session.metrics.sessionReady = performance.now();
          flushPendingMessages(session);
        } else if (msg.type === 'error') {
          error('OpenAI error:', msg.error);
          session.state = 'error';
        }

        // Log important VAD and response events
        if (msg.type === 'input_audio_buffer.speech_started') {
          log('🎤 VAD: User started speaking');
        } else if (msg.type === 'input_audio_buffer.speech_stopped') {
          log('🤐 VAD: User stopped speaking');
        } else if (msg.type === 'conversation.item.input_audio_transcription.completed') {
          log('📝 User said:', msg.transcript);
        } else if (msg.type === 'response.created') {
          log('🎬 AI response started');
        } else if (msg.type === 'response.done') {
          log('✅ AI response completed');
        }
      } catch (e) {
        error('Error parsing OpenAI message:', e);
      }
    });

    session.openaiWS.addEventListener('close', (ev) => {
      warn('OpenAI closed:', ev.code, ev.reason);
      if (session.clientWS.readyState === WebSocket.OPEN) {
        session.clientWS.close(1014, 'OpenAI connection lost');
      }
    });

    session.openaiWS.addEventListener('error', (ev) => {
      error('OpenAI WebSocket error:', ev);
      if (session.clientWS.readyState === WebSocket.OPEN) {
        session.clientWS.close(1011, 'OpenAI error');
      }
    });

    session.clientWS.onmessage = (event) => {
      handleClientMessage(session, event);
    };

    session.clientWS.onclose = () => {
      log('Client disconnected');
      try { session.openaiWS?.close(); } catch (_) {}
      session.pendingMessages = [];
    };

    session.clientWS.onerror = (ev) => {
      error('Client WebSocket error:', ev);
      try { session.openaiWS?.close(); } catch (_) {}
    };

    return response;
  } catch (e) {
    error('Fatal error:', e);
    return new Response('Internal error', { status: 500, headers: corsHeaders });
  }
});

// Helper functions
function getBaseInstructions(language: string, activityType?: string): string {
  const baseRole = language === 'es-PR' 
    ? 'Eres Coquí, un tutor amigable MASCULINO para niños de K-5 en Puerto Rico.'
    : 'You are Coquí, a friendly MALE tutor for K-5 students in Puerto Rico.';

  // Exercise-specific instructions (brief, action-oriented)
  if (activityType === 'exercise') {
    return language === 'es-PR'
      ? `${baseRole}

En ejercicios:
- Usa frases cortas y directas (máximo 15 palabras por turno)
- Lee las opciones claramente y pausa 2-3 segundos
- Si el ejercicio es visual (opciones en pantalla), invita al estudiante a elegir/tocar/arrastrar la respuesta
- Si el ejercicio requiere hablar, pide que repita o diga la respuesta en voz alta
- Celebra intentos y ofrece pistas específicas si dudan
- Habla despacio con voz masculina y acento natural puertorriqueño
- NO uses saludos largos si el estudiante acaba de hablar contigo`

      : `${baseRole}

In exercises:
- Use short, direct phrases (maximum 15 words per turn)
- Read options clearly and pause 2-3 seconds
- If the exercise is visual (options on screen), invite the student to choose/tap/drag the answer
- If the exercise requires speaking, ask them to repeat or say the answer aloud
- Celebrate attempts and offer specific hints if needed
- Speak slowly with a MALE voice and clear American accent
- DO NOT use long greetings if the student just spoke with you`;
  }

  // Lesson-specific instructions (exploratory, conversational)
  return language === 'es-PR'
    ? `${baseRole}

En lecciones:
- Sé conversacional y exploratorio
- Escucha atentamente cuando leen en español o inglés
- Proporciona retroalimentación gentil sobre pronunciación
- Haz preguntas abiertas para fomentar la reflexión
- Usa ejemplos culturales de Puerto Rico (coquí, El Yunque, etc.)
- Habla con voz masculina y acento puertorriqueño natural
- Adapta tu velocidad al nivel del estudiante`

    : `${baseRole}

In lessons:
- Be conversational and exploratory
- Listen carefully when they read in Spanish or English
- Provide gentle feedback on pronunciation
- Ask open-ended questions to encourage reflection
- Use cultural examples from Puerto Rico (coquí, El Yunque, etc.)
- Speak with a MALE voice and clear American accent
- Adapt your speed to the student's level`;
}

function handleSessionCreated(session: SessionState): void {
  const baseInstructions = getBaseInstructions(session.language, session.activityType);
  const contextInstructions = buildContextInstructions(session);
  const fullInstructions = `${baseInstructions}${contextInstructions}`;

  const hasContext = !!contextInstructions;
  const contextHasSpeakerMarker = session.contextPayload ? hasSpeakerMarker(session.contextPayload) : false;
  const pronunciationTargetCount = session.contextPayload?.pronunciation_words?.length ?? 0;
  log('[Instruction] 🔊 markers present:', contextHasSpeakerMarker);
  log('[Instruction] 🎯 pronunciation targets:', pronunciationTargetCount);
  log('[Instruction] 📏 length:', fullInstructions.length, 'chars');
  log(`Sending session.update${hasContext ? ' with context' : ''}`);

  const isWelcomeSpeaker = session.studentId === 'welcome-speaker';

  const turnDetection = isWelcomeSpeaker
    ? {
        type: 'server_vad',
        threshold: 0.95, // Very high to avoid false barge-in during TTS
        prefix_padding_ms: 300,
        silence_duration_ms: 1500,
        create_response: false // Do not auto-start a new response when mic picks up sound
      }
    : {
        type: 'server_vad',
        threshold: 0.45,
        prefix_padding_ms: 300,
        silence_duration_ms: 1200,
        create_response: true
      };

  const sessionConfig = {
    type: 'session.update',
    session: {
      modalities: ['text', 'audio'],
      instructions: fullInstructions,
      voice: 'shimmer',
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      turn_detection: turnDetection,
      input_audio_transcription: isWelcomeSpeaker ? undefined : { model: 'whisper-1' },
      temperature: 0.8,
      max_response_output_tokens: 4096
    },
  };

  log('📤 Session config:', JSON.stringify(sessionConfig, null, 2));
  session.openaiWS!.send(JSON.stringify(sessionConfig));
}

function handleClientMessage(session: SessionState, event: MessageEvent): void {
  try {
    const msg = JSON.parse(event.data);

    // Handle heartbeat
    if (msg.type === 'ping') {
      session.clientWS.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      return;
    }

    // Queue or forward based on state
    if (session.state === 'ready' && session.openaiWS?.readyState === WebSocket.OPEN) {
      session.openaiWS.send(event.data);

      if (msg.type === 'input_audio_buffer.append') {
        session.metrics.audioChunksReceived++;
      }
    } else {
      session.pendingMessages.push(event.data);
      if (session.pendingMessages.length > 200) {
        session.pendingMessages.shift(); // Prevent memory overflow
      }
    }
  } catch (e) {
    error('Error parsing client message:', e);
  }
}

function decodeContextPayload(raw: string): ActivityContextPayload | null {
  try {
    const binary = atob(raw);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return JSON.parse(decoded);
  } catch (err) {
    warn('Failed to decode context payload', err);
    return null;
  }
}

function detectSpokenInteraction(context: any): boolean {
  if (!context) return false;
  
  const textToCheck = [
    context.voice_guidance || '',
    context.coqui_dialogue || '',
    context.content?.question || ''
  ].join(' ').toLowerCase();
  
  const spokenCues = [
    // Spanish - Reading
    'lee',
    'lee el texto',
    'lee en voz alta',
    'leer',
    'lea',
    'leen',
    
    // Spanish - Repetition
    'repite',
    'repetir',
    'repiten',
    'pídele que repita',
    'pídeles',
    
    // Spanish - Pronunciation
    'pronuncia',
    'pronunciar',
    'modela',
    'enfatizando',
    
    // Spanish - Listening
    'escucha',
    'escucha lo que dice',
    'escuchas',
    'escuchará',
    
    // Spanish - Speaking
    'di',
    'dile',
    'dices',
    'dirá',
    'deletreen',
    'deletrea',
    'oralmente',
    
    // Spanish - Questioning
    'pregunta',
    'preguntar',
    
    // Spanish - Waiting for response
    'espera la respuesta',
    'espera',
    'respondan',
    
    // Spanish - Completing words
    'completa la palabra',
    'completar',
    
    // Spanish - Confirmation
    'confirma repitiendo',
    'confirmar',
    
    // English - Reading
    'read aloud',
    'read',
    
    // English - Repetition
    'repeat',
    
    // English - Pronunciation
    'pronounce',
    
    // English - Listening
    'listen',
    'listen to what',
    
    // English - Speaking
    'ask',
    'say',
    'tell',
    'speak',
    
    // English - Waiting
    'wait for response',
    
    // Universal
    '🔊'
  ];
  
  return spokenCues.some(cue => textToCheck.includes(cue));
}

function detectVisualInteraction(context: any): boolean {
  if (!context) return false;
  
  const textToCheck = [
    context.voice_guidance || '',
    context.coqui_dialogue || '',
    context.content?.question || ''
  ].join(' ').toLowerCase();
  
  const visualCues = [
    'arrastra',
    'drag',
    'selecciona',
    'select',
    'elige',
    'choose',
    'toca',
    'tap'
  ];
  
  const hasVisualStructure = !!(
    context.content?.answers ||
    context.content?.availableLetters ||
    context.content?.letters
  );
  
  return hasVisualStructure || visualCues.some(cue => textToCheck.includes(cue));
}

function buildContextInstructions(session: SessionState): string {
  const sections: string[] = [];
  const context = session.contextPayload;

  if (session.activityType || session.activityId) {
    sections.push(
      `Activity metadata:\n- Type: ${session.activityType ?? 'unknown'}\n- ID: ${session.activityId ?? 'unknown'}`
    );
  }

  if (context?.activity_title || context?.activity_subtype) {
    sections.push(
      `Activity title: ${context.activity_title ?? 'Not provided'}\nSubtype: ${context.activity_subtype ?? 'unspecified'}`
    );
  }

  // Detect interaction mode from content analysis
  const hasSpokenComponent = detectSpokenInteraction(context);
  const hasVisualComponent = detectVisualInteraction(context);

  if (hasVisualComponent && hasSpokenComponent) {
    // HYBRID: Both visual AND spoken interaction expected
    sections.push(
      `INTERACTION MODE: This is a HYBRID exercise combining visual interaction with spoken practice.
    
    VISUAL COMPONENT: The student can see options/letters on screen and will interact by tapping, dragging, or selecting.
    - Use action verbs: "elige" (choose), "arrastra" (drag), "selecciona" (select)
    - Example: "Ahora te voy a dar una palabra, y tú la vas a escribir con las letras que ves."
    
    SPOKEN COMPONENT: The student is ALSO expected to practice pronunciation or respond verbally.
    - Read the question/prompt aloud: "${(context?.content as any)?.question || 'the prompt'}"
    - Ask follow-up questions: "¿Qué letra falta?" "¿Puedes repetir la palabra completa?"
    - Listen and validate: "Escucha lo que dice el estudiante" means WAIT for them to speak before commenting
    - Celebrate verbal attempts: "¡Muy bien dicho!" "¡Excelente pronunciación!"
    
    SEQUENCING: Typically, you'll (1) introduce the task, (2) read aloud what's on screen, (3) ask a question, (4) wait for visual OR spoken response, (5) validate and celebrate.`
    );
  } else if (hasVisualComponent) {
    // Pure visual interaction
    sections.push(
      `INTERACTION MODE: This is a VISUAL exercise. The student will interact by tapping, dragging, or selecting on screen.
    - Use action verbs: "elige" (choose), "arrastra" (drag), "selecciona" (select), "toca" (tap)
    - Avoid "dime" (tell me) or "qué piensas" (what do you think) unless the voice_guidance explicitly instructs otherwise.
    - After they make a selection, react to the UI feedback (correct/incorrect) and explain why.`
    );
  } else if (hasSpokenComponent) {
    // Pure spoken interaction
    sections.push(
      `INTERACTION MODE: This is a SPOKEN exercise. The student should practice pronunciation and respond verbally.
    - Encourage them to speak: "repite" (repeat), "di en voz alta" (say aloud), "pronuncia" (pronounce)
    - Wait for their spoken response before commenting.
    - Model correct pronunciation if they struggle.`
    );
  }

  // Detect if this is a parent lesson (not an exercise)
  const isParentLesson = context?.activity_subtype === 'lesson' || 
                         session.activityType === 'lesson';

  if (isParentLesson) {
    sections.push(
      `LESSON MODE: This is an instructional lesson, not a quick exercise. Be exploratory and conversational.\n   - If the voice_guidance or coqui_dialogue instructs you to "Lee el texto" (read the text) or "Read the following", you MUST read the content from the content.question or content.text field verbatim.\n   - Use a natural, storytelling pace. Pause for comprehension.\n   - After reading, invite the student to discuss or ask questions about what they heard.\n   - Spanish: "¿Qué piensas?" "¿Te gustó?" "¿Qué aprendiste?"\n   - English: "What do you think?" "Did you like it?" "What did you learn?"`
    );
  }

  // Detect if this is a continuation session (within last 2 minutes)
  if (context?.is_continuation || (context as any)?.skip_greeting) {
    sections.push(
      `SESSION CONTINUITY: This student recently completed another activity. Skip the greeting and jump straight to the task with a brief transition:\n   - Spanish: "Ahora..." or "Siguiente..."\n   - English: "Now..." or "Next..."\n   Do NOT say "Hola," "Qué bueno saludarte," or "Hoy vamos a..."`
    );
  }

  if (context?.voice_guidance) {
    sections.push(`AUTHOR VOICE GUIDANCE:\n${context.voice_guidance}`);
  }

  // Check if voice_guidance instructs reading content verbatim
  if (context?.voice_guidance && isParentLesson) {
    const readInstructions = [
      'lee el texto',
      'lee con expresión',
      'read the following',
      'read the text',
      'read aloud'
    ];
    
    const shouldReadVerbatim = readInstructions.some(phrase => 
      context.voice_guidance?.toLowerCase().includes(phrase)
    );
    
    if (shouldReadVerbatim) {
      sections.push(
        `VERBATIM READING INSTRUCTION DETECTED: The voice_guidance says to read the text. You MUST read the content from content.question or content.text field word-for-word, with expression and natural pauses. Do not paraphrase or summarize.`
      );
    }
  }

  if (context?.coqui_dialogue) {
    sections.push(`COQUÍ DIALOGUE SCRIPT:\n${context.coqui_dialogue}`);
  }

  if (context?.pronunciation_words && context.pronunciation_words.length > 0) {
    sections.push(
      `PRONUNCIATION TARGETS:\n${context.pronunciation_words.join(', ')}\nRead each word slowly, ask the student to repeat it, and celebrate small improvements.`
    );
  }

  if (context?.content) {
    sections.push(
      `CONTENT JSON (analyze to infer expected behavior):\n${stringifyContentSnippet(context.content)}`
    );
  }

  if (session.voiceGuidance && !context?.voice_guidance) {
    sections.push(`LEGACY GUIDANCE:\n${session.voiceGuidance}`);
  }

  if (sections.length === 0) {
    return '';
  }

  sections.push(
    `INTERACTION CONTRACT:\n1. Keep your opening brief and contextual. Skip lengthy greetings if this is a continuation of recent activity. Adapt your language to the exercise interface:\n   - For visual exercises (multiple choice, drag & drop, true/false), invite the student to "choose," "drag," "select," or "tap" — NOT to "say" the answer.\n   - For spoken exercises (lessons, short answer), ask the student to speak or repeat aloud.\n2. When you see the 🔊 marker in any field, read or paraphrase that line aloud before prompting the student.\n3. Follow a Socratic sequence: offer praise → give a hint → model pronunciation (use pronunciation_words) → scaffold → only reveal the answer if the student stays stuck after guidance.\n4. Use the pronunciation_words array as explicit coaching targets—say them slowly, ask the student to repeat, and celebrate effort more than correctness.\n5. Stay strictly within the provided lesson/exercise context; do not introduce unrelated topics.\n6. After you speak, pause a few seconds to let the student respond before continuing.`
  );

  return `\n\n## Activity Context From Supabase\n${sections.join('\n\n')}`;
}

function stringifyContentSnippet(content: unknown): string {
  try {
    const serialized = typeof content === 'string' ? content : JSON.stringify(content);
    if (!serialized) return 'No content payload provided.';
    if (serialized.length > 4000) {
      return `${serialized.slice(0, 4000)}\n...[truncated, full JSON available in Supabase]`;
    }
    return serialized;
  } catch (err) {
    warn('Failed to stringify content payload', err);
    return 'Unable to stringify content payload.';
  }
}

function hasSpeakerMarker(context: ActivityContextPayload): boolean {
  try {
    const serialized = JSON.stringify(context);
    return serialized?.includes('🔊') ?? false;
  } catch (_err) {
    return false;
  }
}

function flushPendingMessages(session: SessionState): void {
  if (session.pendingMessages.length > 0) {
    log(`Flushing ${session.pendingMessages.length} pending messages`);
    for (const buffered of session.pendingMessages) {
      try {
        session.openaiWS!.send(buffered);
      } catch (e) {
        error('Error flushing message:', e);
      }
    }
    session.pendingMessages = [];
  }
}
