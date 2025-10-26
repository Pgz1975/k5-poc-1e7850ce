import { supabase } from "@/integrations/supabase/client";
import { searchPexelsImage } from "@/utils/pexelsApi";

// Helper to delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ParentLesson {
  title: string;
  description: string;
  voiceGuidance: string;
  lessonContent: string;
  pronunciationWords: string[];
  imageSearchTerms: string[];
  domainName: string;
  domainOrder: number;
}

interface ExerciseTemplate {
  title: string;
  description: string;
  subtype: 'multiple_choice' | 'drag_drop' | 'fill_blank' | 'true_false' | 'write_answer';
  voiceGuidance: string;
  contentBuilder: (images: (string | null)[]) => any;
  imageSearchTerms: string[]; // Empty array means text-only
  pronunciationWords?: string[];
}

export async function generateGrade2SpanishContentV2() {
  console.log("🚀 Starting Grade 2 Spanish Content Generation V2");
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Define 5 parent lessons (one per domain)
  const parentLessons: ParentLesson[] = [
    {
      title: "AI G2 V2: Dominio 1 - Fonética y Conciencia Fonológica",
      description: "Aprende dígrafos (CH, LL, RR) y grupos consonánticos",
      domainName: "Fonética y Conciencia Fonológica",
      domainOrder: 1,
      voiceGuidance: "¡Hola! Soy tu amigo Coquí. En esta lección aprenderás sonidos especiales del español: los dígrafos CH, LL y RR. Estos son dos letras que suenan como una sola. También conocerás grupos consonánticos como BR, PL y GR. Escucha con atención y participa. Si tienes dudas, pregúntame.",
      pronunciationWords: ["chico", "lluvia", "carro", "sílaba", "brazo", "plato"],
      imageSearchTerms: ["elementary school children learning"],
      lessonContent: `Los dígrafos son dos letras juntas que forman un solo sonido.

En español tenemos:
• CH - como en "chico" y "chocolate"
• LL - como en "lluvia" y "calle"
• RR - como en "carro" y "perro"

También aprenderemos grupos consonánticos:
• BR - brazo, libro
• PL - plato, pluma
• GR - grande, tigre
• FL - flor, flaco

Recuerda: Las palabras largas se dividen en sílabas. Cada sílaba tiene al menos una vocal.
Ejemplo: ma-ri-po-sa (4 sílabas)

Practica dividiendo estas palabras:
• carro = ca-rro (2 sílabas)
• lluvia = llu-via (2 sílabas)
• chocolate = cho-co-la-te (4 sílabas)`
    },
    {
      title: "AI G2 V2: Dominio 2 - Fluidez Lectora",
      description: "Desarrolla lectura fluida con signos de puntuación",
      domainName: "Fluidez Lectora",
      domainOrder: 2,
      voiceGuidance: "¡Bienvenido! Hoy aprenderás a leer con fluidez usando los signos de puntuación como guía. El punto te dice cuándo pausar, la coma te da una pausa corta, y los signos de interrogación y exclamación te muestran cómo expresar emociones. Vamos a leer juntos y practicar.",
      pronunciationWords: ["punto", "coma", "pregunta", "exclamación", "fluidez", "pausa"],
      imageSearchTerms: ["children reading books"],
      lessonContent: `Los signos de puntuación son tus guías de lectura:

El Punto (.) - Pausa larga al final de una oración
La Coma (,) - Pausa corta dentro de una oración
¿Interrogación? - Sube la voz para hacer una pregunta
¡Exclamación! - Muestra emoción o sorpresa

Palabras de alta frecuencia que debes reconocer rápido:
el, la, los, las, un, una, y, o, pero, porque, con, sin

Practica leyendo este párrafo:
"En la escuela, los niños aprenden muchas cosas. ¿Te gusta leer? ¡Es muy divertido! Cuando lees, puedes conocer nuevos lugares y personajes."

Meta de segundo grado: Leer 80-120 palabras por minuto con precisión.`
    },
    {
      title: "AI G2 V2: Dominio 3 - Desarrollo de Vocabulario",
      description: "Explora sinónimos, antónimos y lenguaje figurado",
      domainName: "Desarrollo de Vocabulario",
      domainOrder: 3,
      voiceGuidance: "¡Vamos a ampliar tu vocabulario! Hoy descubrirás palabras con significados parecidos llamadas sinónimos, palabras opuestas llamadas antónimos, y aprenderás lenguaje figurado que hace la lectura más interesante. Escucha los ejemplos y piensa en otras palabras similares.",
      pronunciationWords: ["sinónimo", "antónimo", "significado", "opuesto", "vocabulario"],
      imageSearchTerms: ["vocabulary words education"],
      lessonContent: `Sinónimos - Palabras con significados parecidos:
• feliz = contento = alegre
• triste = apenado = melancólico
• grande = enorme = gigante
• pequeño = chico = diminuto

Antónimos - Palabras opuestas:
• día ↔ noche
• caliente ↔ frío
• lleno ↔ vacío
• rápido ↔ lento
• alto ↔ bajo

Lenguaje Figurado - Comparaciones y expresiones:
• "Tan alto como un edificio" = muy alto
• "Rápido como el viento" = muy veloz
• "Fuerte como un león" = muy fuerte
• "Brillante como el sol" = muy inteligente

Recuerda: Conocer más palabras te ayuda a expresarte mejor y comprender lo que lees.`
    },
    {
      title: "AI G2 V2: Dominio 4 - Comprensión Literal",
      description: "Responde preguntas sobre quién, qué, dónde, cuándo y por qué",
      domainName: "Comprensión Literal",
      domainOrder: 4,
      voiceGuidance: "¡Hola detective de la lectura! En esta lección aprenderás a encontrar información directa en los textos. Usarás preguntas especiales: ¿Quién?, ¿Qué?, ¿Dónde?, ¿Cuándo? y ¿Por qué? Estas preguntas te ayudan a entender mejor lo que lees. Lee con atención cada detalle.",
      pronunciationWords: ["quién", "qué", "dónde", "cuándo", "por qué", "comprensión"],
      imageSearchTerms: ["children studying comprehension"],
      lessonContent: `Las Preguntas Clave para Comprender:

¿QUIÉN? - Identifica los personajes o personas
Ejemplo: "María fue a la biblioteca" → ¿Quién fue? María

¿QUÉ? - Identifica los eventos o acciones
Ejemplo: "Juan comió una manzana" → ¿Qué hizo? Comió una manzana

¿DÓNDE? - Identifica el lugar
Ejemplo: "Los niños juegan en el parque" → ¿Dónde? En el parque

¿CUÁNDO? - Identifica el tiempo
Ejemplo: "Ayer llovió mucho" → ¿Cuándo? Ayer

¿POR QUÉ? - Identifica las razones
Ejemplo: "Ana estudió porque tenía examen" → ¿Por qué? Porque tenía examen

Para encontrar la idea principal:
1. Lee el título del texto
2. Lee la primera oración de cada párrafo
3. Busca palabras que se repiten
4. Pregúntate: ¿De qué trata principalmente este texto?

Secuencia de eventos:
Primero → Luego → Después → Finalmente`
    },
    {
      title: "AI G2 V2: Dominio 5 - Comprensión Inferencial",
      description: "Usa pistas para descubrir información no escrita",
      domainName: "Comprensión Inferencial",
      domainOrder: 5,
      voiceGuidance: "¡Serás un detective de las pistas! Inferir significa descubrir información que no está escrita directamente. Usarás pistas del texto más lo que ya sabes para hacer predicciones, encontrar causas y efectos, y entender el propósito del autor. ¡Vamos a investigar juntos!",
      pronunciationWords: ["inferir", "pistas", "predicción", "causa", "efecto", "propósito"],
      imageSearchTerms: ["detective children thinking"],
      lessonContent: `Inferir es descubrir información usando pistas del texto y lo que ya sabes.

Ejemplo:
"Ana entró empapada a la casa y cerró su paraguas."
Podemos inferir: Estaba lloviendo afuera

Hacer Predicciones:
Usa pistas del texto para imaginar qué pasará después.
Ejemplo: "El cielo está oscuro y hace viento" → Probablemente va a llover

Causa y Efecto:
Causa: La razón por la que algo sucede
Efecto: Lo que sucede como resultado

Ejemplos:
• Causa: Estudió mucho → Efecto: Sacó buena nota
• Causa: No desayunó → Efecto: Tiene hambre
• Causa: Hizo ejercicio → Efecto: Se siente fuerte

Propósito del Autor - ¿Por qué escribió este texto?
• Informar - dar datos y enseñar algo nuevo
• Entretener - contar historias divertidas o interesantes
• Persuadir - convencer al lector de algo

Recuerda: Siempre busca evidencia en el texto para apoyar tus inferencias.`
    }
  ];

  // Insert parent lessons with images
  const insertedParents: any[] = [];
  console.log("📚 Creating 5 parent lessons...");

  for (const lesson of parentLessons) {
    // Fetch image for lesson (optional, some can be text-only)
    let imageUrl: string | null = null;
    if (lesson.imageSearchTerms.length > 0) {
      const imageResult = await searchPexelsImage(lesson.imageSearchTerms[0]);
      imageUrl = imageResult?.src?.large || null;
      await delay(600);
    }

    const { data: parentData, error: parentError } = await supabase
      .from('manual_assessments')
      .insert({
        type: 'lesson',
        subtype: 'lesson',
        title: lesson.title,
        description: lesson.description,
        grade_level: 2,
        language: 'es',
        status: 'published',
        created_by: user.id,
        voice_guidance: lesson.voiceGuidance,
        pronunciation_words: lesson.pronunciationWords,
        enable_voice: true,
        auto_read_question: true,
        estimated_duration_minutes: 10,
        content: {
          question: lesson.lessonContent,
          questionImage: imageUrl,
          answers: []
        },
        parent_lesson_id: null,
        order_in_lesson: null
      })
      .select()
      .single();

    if (parentError) {
      console.error("Error inserting parent lesson:", parentError);
      throw new Error(`Failed to create lesson: ${lesson.title}`);
    }

    insertedParents.push({
      ...parentData,
      domainName: lesson.domainName,
      domainOrder: lesson.domainOrder
    });
    console.log(`✅ Created: ${lesson.title}`);
  }

  // Define 6 exercises per lesson (30 total)
  const exercisesByParent: Record<number, ExerciseTemplate[]> = {
    // Lesson 1: Fonética (Dominio 1)
    0: [
      {
        title: "Reconoce el dígrafo CH",
        description: "Identifica palabras con el dígrafo CH",
        subtype: "multiple_choice",
        voiceGuidance: "Lee las opciones con cuidado. Busca la palabra que contiene el dígrafo CH, donde las letras C y H suenan juntas como un solo sonido. Piensa en el sonido 'ch' como en 'chico'.",
        imageSearchTerms: ["chocolate candy", "house", "dog", "sun"],
        pronunciationWords: ["chocolate", "casa", "perro"],
        contentBuilder: (images) => ({
          question: "¿Cuál palabra contiene el dígrafo CH?",
          questionImage: null,
          answers: [
            { text: "chocolate", imageUrl: images[0], isCorrect: true },
            { text: "casa", imageUrl: images[1], isCorrect: false },
            { text: "perro", imageUrl: images[2], isCorrect: false },
            { text: "sol", imageUrl: images[3], isCorrect: false }
          ]
        })
      },
      {
        title: "Forma la palabra 'lluvia'",
        description: "Arrastra letras para formar palabras con LL",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra las letras a su lugar correcto para formar la palabra 'lluvia'. Recuerda que LL es un dígrafo, dos letras que suenan como una. Tómate tu tiempo.",
        imageSearchTerms: [],
        pronunciationWords: ["lluvia"],
        contentBuilder: () => ({
          mode: "letters",
          question: "Arrastra las letras para formar 'lluvia'",
          questionImage: null,
          targetWord: "lluvia",
          availableLetters: ["ll", "u", "v", "i", "a", "m", "p", "s", "r"],
          autoShuffle: true
        })
      },
      {
        title: "Completa la palabra",
        description: "Completa palabras con el dígrafo RR",
        subtype: "fill_blank",
        voiceGuidance: "Usa las letras para completar la palabra. Piensa en el sonido fuerte de RR en el medio de la palabra, como en 'carro' o 'perro'.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "single_word",
          prompt: "Completa la palabra: ca___o (vehículo)",
          target: "carro",
          letters: ["c", "a", "rr", "o"],
          imageUrl: null,
          autoShuffle: false
        })
      },
      {
        title: "Cuenta las sílabas",
        description: "Identifica el número de sílabas en palabras",
        subtype: "multiple_choice",
        voiceGuidance: "Escucha la palabra y cuenta cuántas sílabas tiene. Recuerda que cada sílaba tiene al menos una vocal. Di la palabra en voz alta separando las partes.",
        imageSearchTerms: [],
        pronunciationWords: ["mariposa"],
        contentBuilder: () => ({
          question: "¿Cuántas sílabas tiene 'mariposa'?",
          questionImage: null,
          answers: [
            { text: "2 sílabas", imageUrl: null, isCorrect: false },
            { text: "3 sílabas", imageUrl: null, isCorrect: false },
            { text: "4 sílabas", imageUrl: null, isCorrect: true },
            { text: "5 sílabas", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Clasifica palabras con RR",
        description: "Arrastra palabras según tengan o no el dígrafo RR",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra cada palabra a su zona correcta. Escucha el sonido fuerte de RR en palabras como 'perro' y 'carro'. Las otras palabras no tienen este sonido.",
        imageSearchTerms: [],
        pronunciationWords: ["perro", "carro", "casa", "mesa"],
        contentBuilder: () => ({
          mode: "match",
          question: "Arrastra las palabras con dígrafo RR a su lugar",
          dropZones: [
            { id: "con-rr", label: "Tiene RR" },
            { id: "sin-rr", label: "No tiene RR" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "perro", correctZone: "con-rr" },
            { id: "2", type: "text", content: "carro", correctZone: "con-rr" },
            { id: "3", type: "text", content: "casa", correctZone: "sin-rr" },
            { id: "4", type: "text", content: "mesa", correctZone: "sin-rr" }
          ],
          allowMultiplePerZone: true
        })
      },
      {
        title: "Verdadero o Falso: Dígrafos",
        description: "Verifica tu conocimiento de dígrafos",
        subtype: "true_false",
        voiceGuidance: "Lee la oración con atención. Piensa en el sonido del dígrafo LL. ¿Es verdadera o falsa la afirmación? Usa lo que aprendiste sobre dígrafos.",
        imageSearchTerms: [],
        pronunciationWords: ["lluvia"],
        contentBuilder: () => ({
          question: "La palabra 'lluvia' tiene el dígrafo LL",
          questionImage: null,
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false }
          ]
        })
      }
    ],
    // Lesson 2: Fluidez Lectora (Dominio 2)
    1: [
      {
        title: "Identifica el signo de puntuación",
        description: "Reconoce el uso correcto de signos de puntuación",
        subtype: "multiple_choice",
        voiceGuidance: "Lee cada oración y piensa qué signo de puntuación debe ir al final. Si es una pregunta, necesita ¿?. Si expresa emoción, necesita ¡!. Si es una afirmación, necesita punto.",
        imageSearchTerms: [],
        pronunciationWords: ["pregunta", "exclamación", "punto"],
        contentBuilder: () => ({
          question: "¿Qué signo va al final?: 'Cómo te llamas'",
          questionImage: null,
          answers: [
            { text: "Punto (.)", imageUrl: null, isCorrect: false },
            { text: "Interrogación (¿?)", imageUrl: null, isCorrect: true },
            { text: "Exclamación (¡!)", imageUrl: null, isCorrect: false },
            { text: "Coma (,)", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Ordena la lectura",
        description: "Arrastra palabras para formar una oración fluida",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra las palabras en el orden correcto para formar una oración que tenga sentido. Lee en voz alta para verificar que suene bien.",
        imageSearchTerms: [],
        pronunciationWords: ["niños", "juegan", "parque"],
        contentBuilder: () => ({
          mode: "sequence",
          question: "Ordena las palabras para formar una oración:",
          targetSequence: ["Los", "niños", "juegan", "en", "el", "parque"],
          draggableItems: [
            { id: "1", type: "text", content: "Los" },
            { id: "2", type: "text", content: "niños" },
            { id: "3", type: "text", content: "juegan" },
            { id: "4", type: "text", content: "en" },
            { id: "5", type: "text", content: "el" },
            { id: "6", type: "text", content: "parque" }
          ],
          autoShuffle: true
        })
      },
      {
        title: "Completa con palabras frecuentes",
        description: "Usa palabras de alta frecuencia",
        subtype: "fill_blank",
        voiceGuidance: "Completa la oración usando las letras disponibles. Piensa en las palabras que usamos frecuentemente como 'el', 'la', 'un', 'una'.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "single_word",
          prompt: "Completa: ___ sol brilla",
          target: "el",
          letters: ["e", "l", "a", "o"],
          imageUrl: null,
          autoShuffle: true
        })
      },
      {
        title: "¿Cómo leer esta oración?",
        description: "Identifica la entonación correcta",
        subtype: "multiple_choice",
        voiceGuidance: "Mira la oración y sus signos de puntuación. ¿Cómo debes leerla? Los signos te dan pistas sobre la emoción y la entonación.",
        imageSearchTerms: [],
        pronunciationWords: ["qué", "lindo", "día"],
        contentBuilder: () => ({
          question: "¿Cómo debes leer: '¡Qué lindo día!'?",
          questionImage: null,
          answers: [
            { text: "Con emoción y alegría", imageUrl: null, isCorrect: true },
            { text: "Haciendo una pregunta", imageUrl: null, isCorrect: false },
            { text: "Con voz normal", imageUrl: null, isCorrect: false },
            { text: "En voz baja", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Pausa en las comas",
        description: "Identifica dónde hacer pausas al leer",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra las palabras 'PAUSA' donde veas una coma en la oración. Las comas te dicen dónde hacer una pausa corta al leer.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "match",
          question: "Marca dónde hay pausas: 'En la escuela, aprendo matemáticas, español, y ciencias.'",
          dropZones: [
            { id: "pausa1", label: "Después de 'escuela'" },
            { id: "pausa2", label: "Después de 'matemáticas'" },
            { id: "pausa3", label: "Después de 'español'" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "PAUSA", correctZone: "pausa1" },
            { id: "2", type: "text", content: "PAUSA", correctZone: "pausa2" },
            { id: "3", type: "text", content: "PAUSA", correctZone: "pausa3" }
          ],
          allowMultiplePerZone: false
        })
      },
      {
        title: "Verdadero o Falso: Puntuación",
        description: "Verifica tu conocimiento de signos",
        subtype: "true_false",
        voiceGuidance: "Lee la afirmación y decide si es verdadera o falsa. Piensa en lo que aprendiste sobre los signos de puntuación.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          question: "El punto (.) indica una pausa larga al final de una oración",
          questionImage: null,
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false }
          ]
        })
      }
    ],
    // Lesson 3: Vocabulario (Dominio 3)
    2: [
      {
        title: "Encuentra el sinónimo",
        description: "Identifica palabras con significados parecidos",
        subtype: "multiple_choice",
        voiceGuidance: "Lee la palabra y busca su sinónimo, una palabra que significa algo muy parecido. Piensa en palabras que podrías usar en su lugar.",
        imageSearchTerms: ["happy child", "sad child", "big elephant", "small mouse"],
        pronunciationWords: ["feliz", "contento", "alegre"],
        contentBuilder: (images) => ({
          question: "¿Cuál es un sinónimo de 'feliz'?",
          questionImage: images[0],
          answers: [
            { text: "contento", imageUrl: null, isCorrect: true },
            { text: "triste", imageUrl: null, isCorrect: false },
            { text: "enojado", imageUrl: null, isCorrect: false },
            { text: "cansado", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Empareja antónimos",
        description: "Une palabras con significados opuestos",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra cada palabra a su antónimo, la palabra que significa lo contrario. Por ejemplo, 'día' es lo opuesto de 'noche'.",
        imageSearchTerms: [],
        pronunciationWords: ["día", "noche", "caliente", "frío"],
        contentBuilder: () => ({
          mode: "match",
          question: "Une cada palabra con su antónimo (opuesto):",
          dropZones: [
            { id: "noche", label: "noche" },
            { id: "frio", label: "frío" },
            { id: "vacio", label: "vacío" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "día", correctZone: "noche" },
            { id: "2", type: "text", content: "caliente", correctZone: "frio" },
            { id: "3", type: "text", content: "lleno", correctZone: "vacio" }
          ],
          allowMultiplePerZone: false
        })
      },
      {
        title: "Completa el sinónimo",
        description: "Escribe una palabra con significado similar",
        subtype: "fill_blank",
        voiceGuidance: "Completa la palabra que es sinónimo de 'grande'. Piensa en palabras que significan algo muy grande.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "single_word",
          prompt: "Escribe un sinónimo de 'grande': _____",
          target: "enorme",
          letters: ["e", "n", "o", "r", "m", "e"],
          imageUrl: null,
          autoShuffle: true
        })
      },
      {
        title: "Lenguaje figurado",
        description: "Interpreta comparaciones y expresiones",
        subtype: "multiple_choice",
        voiceGuidance: "Lee la expresión figurada y piensa qué significa realmente. No es literal, es una comparación para describir algo.",
        imageSearchTerms: [],
        pronunciationWords: ["rápido", "viento"],
        contentBuilder: () => ({
          question: "¿Qué significa 'rápido como el viento'?",
          questionImage: null,
          answers: [
            { text: "Muy veloz", imageUrl: null, isCorrect: true },
            { text: "Muy lento", imageUrl: null, isCorrect: false },
            { text: "Invisible", imageUrl: null, isCorrect: false },
            { text: "Muy fuerte", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Clasifica sinónimos y antónimos",
        description: "Identifica si las palabras son similares u opuestas",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra cada par de palabras a la categoría correcta. ¿Son sinónimos (similares) o antónimos (opuestos)?",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "match",
          question: "Clasifica cada par de palabras:",
          dropZones: [
            { id: "sinonimos", label: "Sinónimos (similares)" },
            { id: "antonimos", label: "Antónimos (opuestos)" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "feliz - contento", correctZone: "sinonimos" },
            { id: "2", type: "text", content: "alto - bajo", correctZone: "antonimos" },
            { id: "3", type: "text", content: "grande - enorme", correctZone: "sinonimos" },
            { id: "4", type: "text", content: "caliente - frío", correctZone: "antonimos" }
          ],
          allowMultiplePerZone: true
        })
      },
      {
        title: "Verdadero o Falso: Vocabulario",
        description: "Verifica tu conocimiento de sinónimos",
        subtype: "true_false",
        voiceGuidance: "Lee la afirmación sobre sinónimos. Usa lo que aprendiste para decidir si es verdadera o falsa.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          question: "Las palabras 'pequeño' y 'diminuto' son sinónimos",
          questionImage: null,
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false }
          ]
        })
      }
    ],
    // Lesson 4: Comprensión Literal (Dominio 4)
    3: [
      {
        title: "¿Quién es el personaje?",
        description: "Identifica los personajes en una historia",
        subtype: "multiple_choice",
        voiceGuidance: "Lee el texto con atención y responde: ¿Quién? Esta pregunta busca identificar los personajes o personas en la historia.",
        imageSearchTerms: [],
        pronunciationWords: ["María", "biblioteca"],
        contentBuilder: () => ({
          question: "Lee: 'María fue a la biblioteca y pidió un libro.' ¿Quién fue a la biblioteca?",
          questionImage: null,
          answers: [
            { text: "María", imageUrl: null, isCorrect: true },
            { text: "El bibliotecario", imageUrl: null, isCorrect: false },
            { text: "Juan", imageUrl: null, isCorrect: false },
            { text: "La maestra", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Ordena los eventos",
        description: "Pon los eventos en secuencia correcta",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra los eventos en el orden en que sucedieron. Busca palabras como 'primero', 'luego', 'después' y 'finalmente' que te dan pistas.",
        imageSearchTerms: [],
        pronunciationWords: ["primero", "luego", "después", "finalmente"],
        contentBuilder: () => ({
          mode: "sequence",
          question: "Lee: 'Ana se despertó. Luego desayunó. Después se vistió. Finalmente salió a la escuela.' Ordena:",
          targetSequence: ["Se despertó", "Desayunó", "Se vistió", "Salió a la escuela"],
          draggableItems: [
            { id: "1", type: "text", content: "Se despertó" },
            { id: "2", type: "text", content: "Desayunó" },
            { id: "3", type: "text", content: "Se vistió" },
            { id: "4", type: "text", content: "Salió a la escuela" }
          ],
          autoShuffle: true
        })
      },
      {
        title: "¿Dónde sucede?",
        description: "Identifica el lugar de los eventos",
        subtype: "fill_blank",
        voiceGuidance: "Completa la respuesta a la pregunta ¿Dónde? Busca en el texto el lugar donde sucede la acción.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "single_word",
          prompt: "Lee: 'Los niños juegan en el parque.' ¿Dónde juegan? En el _____",
          target: "parque",
          letters: ["p", "a", "r", "q", "u", "e"],
          imageUrl: null,
          autoShuffle: true
        })
      },
      {
        title: "Encuentra la idea principal",
        description: "Identifica de qué trata el texto",
        subtype: "multiple_choice",
        voiceGuidance: "Lee el texto completo y piensa: ¿De qué trata principalmente? La idea principal es el tema más importante del texto.",
        imageSearchTerms: [],
        pronunciationWords: ["perros", "mascotas", "leales"],
        contentBuilder: () => ({
          question: "Lee: 'Los perros son mascotas leales. Les gusta jugar y correr. Son buenos amigos de las personas.' ¿Cuál es la idea principal?",
          questionImage: null,
          answers: [
            { text: "Los perros son mascotas leales", imageUrl: null, isCorrect: true },
            { text: "A los perros les gusta correr", imageUrl: null, isCorrect: false },
            { text: "Los perros juegan mucho", imageUrl: null, isCorrect: false },
            { text: "Las personas tienen mascotas", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Empareja preguntas con respuestas",
        description: "Une cada pregunta con su respuesta del texto",
        subtype: "drag_drop",
        voiceGuidance: "Lee el texto: 'Pedro comió pizza ayer en el restaurante porque tenía hambre.' Arrastra cada respuesta a su pregunta correcta.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "match",
          question: "Empareja cada pregunta con su respuesta:",
          dropZones: [
            { id: "quien", label: "¿Quién?" },
            { id: "que", label: "¿Qué?" },
            { id: "donde", label: "¿Dónde?" },
            { id: "porque", label: "¿Por qué?" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "Pedro", correctZone: "quien" },
            { id: "2", type: "text", content: "Comió pizza", correctZone: "que" },
            { id: "3", type: "text", content: "En el restaurante", correctZone: "donde" },
            { id: "4", type: "text", content: "Porque tenía hambre", correctZone: "porque" }
          ],
          allowMultiplePerZone: false
        })
      },
      {
        title: "Verdadero o Falso: Comprensión",
        description: "Verifica si entendiste el texto",
        subtype: "true_false",
        voiceGuidance: "Lee el texto y la afirmación. Decide si es verdadera o falsa basándote en lo que dice el texto.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          question: "Lee: 'El gato subió al árbol.' ¿Verdadero o falso? 'El perro subió al árbol.'",
          questionImage: null,
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: false },
            { text: "Falso", imageUrl: null, isCorrect: true }
          ]
        })
      }
    ],
    // Lesson 5: Comprensión Inferencial (Dominio 5)
    4: [
      {
        title: "Haz una inferencia",
        description: "Usa pistas para descubrir información no escrita",
        subtype: "multiple_choice",
        voiceGuidance: "Lee el texto y usa las pistas para inferir información que no está escrita directamente. Piensa en lo que ya sabes y combínalo con las pistas del texto.",
        imageSearchTerms: [],
        pronunciationWords: ["inferir", "pistas", "empapada", "paraguas"],
        contentBuilder: () => ({
          question: "Lee: 'Ana entró empapada a la casa y cerró su paraguas.' ¿Qué puedes inferir?",
          questionImage: null,
          answers: [
            { text: "Estaba lloviendo afuera", imageUrl: null, isCorrect: true },
            { text: "Ana iba a nadar", imageUrl: null, isCorrect: false },
            { text: "Hacía mucho calor", imageUrl: null, isCorrect: false },
            { text: "Ana estaba feliz", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Causa y Efecto",
        description: "Conecta las causas con sus efectos",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra cada causa a su efecto correcto. La causa es lo que hace que algo suceda, y el efecto es lo que sucede como resultado.",
        imageSearchTerms: [],
        pronunciationWords: ["causa", "efecto"],
        contentBuilder: () => ({
          mode: "match",
          question: "Une cada CAUSA con su EFECTO:",
          dropZones: [
            { id: "efecto1", label: "Sacó buena nota" },
            { id: "efecto2", label: "Tiene hambre" },
            { id: "efecto3", label: "Se siente fuerte" }
          ],
          draggableItems: [
            { id: "1", type: "text", content: "Estudió mucho", correctZone: "efecto1" },
            { id: "2", type: "text", content: "No desayunó", correctZone: "efecto2" },
            { id: "3", type: "text", content: "Hizo ejercicio", correctZone: "efecto3" }
          ],
          allowMultiplePerZone: false
        })
      },
      {
        title: "Predice qué sucederá",
        description: "Usa pistas para hacer una predicción",
        subtype: "multiple_choice",
        voiceGuidance: "Lee el texto y las pistas. Usa lo que sabes para predecir qué sucederá después. Las predicciones son como adivinanzas inteligentes basadas en evidencia.",
        imageSearchTerms: [],
        pronunciationWords: ["predicción", "nubes", "oscuras"],
        contentBuilder: () => ({
          question: "Lee: 'El cielo está lleno de nubes oscuras. Hace mucho viento y truena.' ¿Qué sucederá probablemente?",
          questionImage: null,
          answers: [
            { text: "Va a llover", imageUrl: null, isCorrect: true },
            { text: "Hará mucho calor", imageUrl: null, isCorrect: false },
            { text: "Saldrá el sol", imageUrl: null, isCorrect: false },
            { text: "Nevará", imageUrl: null, isCorrect: false }
          ]
        })
      },
      {
        title: "Propósito del autor",
        description: "Identifica por qué el autor escribió el texto",
        subtype: "fill_blank",
        voiceGuidance: "Piensa: ¿Por qué escribió esto el autor? Puede ser para informar (enseñar), entretener (divertir) o persuadir (convencer).",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "single_word",
          prompt: "Lee: 'Los dinosaurios vivieron hace millones de años. Había muchos tipos diferentes.' El propósito es _____",
          target: "informar",
          letters: ["i", "n", "f", "o", "r", "m", "a", "r"],
          imageUrl: null,
          autoShuffle: true
        })
      },
      {
        title: "Ordena el proceso de inferencia",
        description: "Organiza los pasos para hacer una buena inferencia",
        subtype: "drag_drop",
        voiceGuidance: "Arrastra los pasos en el orden correcto. Para hacer una buena inferencia, primero lees, luego buscas pistas, usas lo que sabes y finalmente haces tu inferencia.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          mode: "sequence",
          question: "Ordena los pasos para hacer una inferencia:",
          targetSequence: [
            "1. Lee el texto con atención",
            "2. Busca pistas importantes",
            "3. Usa lo que ya sabes",
            "4. Haz tu inferencia"
          ],
          draggableItems: [
            { id: "1", type: "text", content: "1. Lee el texto con atención" },
            { id: "2", type: "text", content: "2. Busca pistas importantes" },
            { id: "3", type: "text", content: "3. Usa lo que ya sabes" },
            { id: "4", type: "text", content: "4. Haz tu inferencia" }
          ],
          autoShuffle: true
        })
      },
      {
        title: "Verdadero o Falso: Inferencias",
        description: "Verifica tu conocimiento sobre inferencias",
        subtype: "true_false",
        voiceGuidance: "Lee la afirmación sobre inferencias. Piensa en lo que aprendiste para decidir si es verdadera o falsa.",
        imageSearchTerms: [],
        contentBuilder: () => ({
          question: "Para hacer una inferencia, solo necesitas leer el texto, no necesitas usar lo que ya sabes",
          questionImage: null,
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: false },
            { text: "Falso", imageUrl: null, isCorrect: true }
          ]
        })
      }
    ]
  };

  // Insert all exercises with proper linking
  const insertedExercises: any[] = [];
  let totalExerciseCount = 0;

  console.log("🎯 Creating 30 exercises (6 per lesson)...");

  for (let parentIndex = 0; parentIndex < insertedParents.length; parentIndex++) {
    const parent = insertedParents[parentIndex];
    const exercises = exercisesByParent[parentIndex];

    for (let exerciseIndex = 0; exerciseIndex < exercises.length; exerciseIndex++) {
      const exercise = exercises[exerciseIndex];
      
      // Fetch images if needed (some exercises are text-only)
      const images: (string | null)[] = [];
      if (exercise.imageSearchTerms.length > 0) {
        for (const searchTerm of exercise.imageSearchTerms) {
          const imageResult = await searchPexelsImage(searchTerm);
          images.push(imageResult?.src?.medium || null);
          await delay(600);
        }
      }

      // Build content using the contentBuilder function
      const content = exercise.contentBuilder(images);

      const { data: exerciseData, error: exerciseError } = await supabase
        .from('manual_assessments')
        .insert({
          type: 'exercise',
          subtype: exercise.subtype,
          title: exercise.title,
          description: exercise.description,
          grade_level: 2,
          language: 'es',
          status: 'published',
          created_by: user.id,
          voice_guidance: exercise.voiceGuidance,
          pronunciation_words: exercise.pronunciationWords || [],
          enable_voice: true,
          auto_read_question: true,
          estimated_duration_minutes: 3,
          content: content,
          parent_lesson_id: parent.id,
          order_in_lesson: exerciseIndex + 1
        })
        .select()
        .single();

      if (exerciseError) {
        console.error("Error inserting exercise:", exerciseError);
        throw new Error(`Failed to create exercise: ${exercise.title}`);
      }

      insertedExercises.push(exerciseData);
      totalExerciseCount++;
      console.log(`  ✅ Exercise ${exerciseIndex + 1}/6: ${exercise.title}`);
    }
  }

  // Create lesson_ordering records
  const orderingRecords: any[] = [];
  console.log("📋 Creating lesson ordering records...");

  for (let i = 0; i < insertedParents.length; i++) {
    const parent = insertedParents[i];
    const { data: orderData, error: orderError } = await supabase
      .from('lesson_ordering')
      .insert({
        grade_level: 2,
        assessment_id: parent.id,
        display_order: i + 1,
        parent_lesson_id: null,
        domain_name: parent.domainName,
        domain_order: parent.domainOrder
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating ordering record:", orderError);
      throw new Error(`Failed to create ordering for: ${parent.title}`);
    }

    orderingRecords.push(orderData);
  }

  console.log("✅ Grade 2 Spanish Content V2 generation complete!");

  return {
    success: true,
    parents: insertedParents.map(p => ({ 
      id: p.id, 
      title: p.title,
      domain: p.domainName 
    })),
    exercises: insertedExercises.map(e => ({ 
      id: e.id, 
      title: e.title,
      parent_lesson_id: e.parent_lesson_id,
      order: e.order_in_lesson 
    })),
    orderingRecords: orderingRecords.map(o => ({ 
      id: o.id, 
      assessment_id: o.assessment_id 
    }))
  };
}
