import { supabase } from "@/integrations/supabase/client";
import { searchPexelsImage } from "@/utils/pexelsApi";

interface ParentLesson {
  title: string;
  description: string;
  imageSearchTerms: string[];
  voiceGuidance: string;
  lessonContent: string; // Main teaching content
}

interface ExerciseTemplate {
  title: string;
  type: string;
  subtype: string;
  description: string;
  contentBuilder: (images: (string | null)[]) => any;
  imageSearchTerms: string[];
  voiceGuidance: string;
  requireAllImages?: boolean;
}

export async function generateGrade2SpanishContent() {
  console.log("🚀 Starting Grade 2 Spanish content generation...");

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const createdBy = user.id;

  // Define 5 parent lessons with teaching content
  const parentLessons: ParentLesson[] = [
    {
      title: "AI G2: Dominio 1 - Fonética y Conciencia Fonológica",
      description: "Dígrafos, grupos consonánticos y palabras multisilábicas",
      imageSearchTerms: ["spanish alphabet classroom children learning"],
      voiceGuidance: "¡Hola! Soy tu amigo Coquí. En esta lección aprenderemos sobre los sonidos especiales del español.",
      lessonContent: `Los dígrafos son dos letras juntas que forman un solo sonido.

En español tenemos:
• CH - como en "chocolate"
• LL - como en "lluvia"
• RR - como en "perro"

También aprenderemos grupos consonánticos:
• BR - brazo
• PL - plato
• GR - grande
• FL - flor

Recuerda: Las palabras largas se dividen en sílabas. Cada sílaba tiene al menos una vocal.
Ejemplo: ma-ri-po-sa (4 sílabas)`
    },
    {
      title: "AI G2: Dominio 2 - Fluidez Lectora",
      description: "Lectura fluida con ritmo y entonación adecuados",
      imageSearchTerms: ["children reading books Puerto Rico school"],
      voiceGuidance: "En esta lección vamos a practicar la lectura en voz alta. Tu meta es leer entre 80 y 120 palabras por minuto.",
      lessonContent: `Los signos de puntuación son tus guías de lectura:

El Punto (.) - Pausa larga
La Coma (,) - Pausa corta
¿Interrogación? - Sube la voz
¡Exclamación! - Muestra emoción

Palabras de alta frecuencia que debes reconocer rápido:
el, la, los, las, un, una, y, o, pero, porque

Practica leyendo:
"En Puerto Rico, el coquí canta todas las noches. Su canto suena como su nombre: ¡co-quí, co-quí!"`
    },
    {
      title: "AI G2: Dominio 3 - Desarrollo de Vocabulario",
      description: "Sinónimos, antónimos y lenguaje figurado",
      imageSearchTerms: ["spanish vocabulary words dictionary"],
      voiceGuidance: "¡Vamos a enriquecer nuestro vocabulario! Aprenderemos palabras nuevas y sus relaciones.",
      lessonContent: `Sinónimos - Palabras con significados parecidos:
• feliz = contento
• triste = apenado
• grande = enorme

Antónimos - Palabras opuestas:
• día ↔ noche
• caliente ↔ frío
• lleno ↔ vacío

Lenguaje Figurado:
• "Tan alto como una palmera" = muy alto
• "Rápido como el viento" = muy veloz

Vocabulario Boricua:
• chinchorro = kiosco de playa
• piragua = raspado de hielo
• vejigante = máscara de carnaval`
    },
    {
      title: "AI G2: Dominio 4 - Comprensión Literal",
      description: "Entender información explícita en textos",
      imageSearchTerms: ["story book reading Puerto Rico"],
      voiceGuidance: "Aprenderás a identificar personajes, lugares y eventos. Practicaremos las preguntas clave.",
      lessonContent: `Las Preguntas Clave para Comprender:

¿QUIÉN? - Los personajes
¿QUÉ? - Los eventos
¿DÓNDE? - El lugar
¿CUÁNDO? - El tiempo
¿POR QUÉ? - Las razones

Para encontrar la idea principal:
1. Lee el título
2. Lee la primera oración
3. Busca palabras que se repiten

Secuencia de eventos:
Primero → Luego → Después → Finalmente`
    },
    {
      title: "AI G2: Dominio 5 - Comprensión Inferencial",
      description: "Hacer inferencias, predicciones y pensamiento crítico",
      imageSearchTerms: ["thinking child reading book question"],
      voiceGuidance: "¡Serás un detective de la lectura! Aprenderás a descubrir información no escrita.",
      lessonContent: `Inferir es descubrir información usando pistas.

Ejemplo:
"Ana entró empapada a la casa."
Podemos inferir: Estaba lloviendo

Hacer Predicciones:
Usa pistas del texto para imaginar qué pasará.

Causa y Efecto:
Causa: Estudió mucho → Efecto: Sacó buena nota

Propósito del Autor:
• Informar - dar datos
• Entretener - contar historias
• Persuadir - convencer

Recuerda: Siempre busca evidencia en el texto para apoyar tus ideas.`
    },
  ];

  // Fetch images for parent lessons
  console.log("📸 Fetching parent lesson images from Pexels...");
  const parentImages: (string | null)[] = [];

  for (const lesson of parentLessons) {
    let image = null;
    for (const searchTerm of lesson.imageSearchTerms) {
      image = await searchPexelsImage(searchTerm);
      if (image) break;
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    parentImages.push(image?.src.large || null);
  }

  // Insert parent lessons with proper structure
  console.log("📚 Creating parent lessons...");
  const { data: insertedParents, error: parentError } = await supabase
    .from("manual_assessments")
    .insert(
      parentLessons.map((lesson, index) => ({
        created_by: createdBy,
        title: lesson.title,
        description: lesson.description,
        type: "lesson" as const,
        subtype: "lesson" as const,
        grade_level: 2,
        language: "es" as const,
        subject_area: "reading" as const,
        status: "published" as const,
        content: {
          question: lesson.lessonContent, // Main lesson content goes in question field
          questionImage: parentImages[index], // Optional lesson image
          answers: [] // Empty for lessons
        },
        enable_voice: true,
        auto_read_question: true,
        voice_speed: 1.0,
        passing_score: 70,
        max_attempts: 3,
        difficulty_level: 2,
        estimated_duration_minutes: 20,
        curriculum_standards: ["DEPR Grade 2 Spanish Literacy"],
        voice_guidance: lesson.voiceGuidance,
      }))
    )
    .select();

  if (parentError || !insertedParents) {
    console.error("❌ Error creating parent lessons:", parentError);
    throw parentError;
  }

  console.log(`✅ Created ${insertedParents.length} parent lessons`);

  // Define exercises with corrected structure
  const lessonExercises: ExerciseTemplate[][] = [
    // Dominio 1: Fonética - 6 exercises
    [
      {
        title: "AI G2: Identifica el dígrafo CH",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Reconoce palabras con CH",
        imageSearchTerms: ["chocolate", "milk", "chair", "car"],
        voiceGuidance: "El dígrafo CH suena como en chocolate. ¿Cuál palabra tiene ese sonido?",
        requireAllImages: true,
        contentBuilder: (images) => {
          // Ensure all images or none
          const hasAllImages = images.every(img => img !== null);
          const useImages = hasAllImages ? images : [null, null, null, null];

          return {
            question: "¿Cuál palabra contiene el dígrafo CH?",
            questionImage: null,
            answers: [
              { text: "chocolate", imageUrl: useImages[0], isCorrect: true },
              { text: "leche", imageUrl: useImages[1], isCorrect: false },
              { text: "silla", imageUrl: useImages[2], isCorrect: false },
              { text: "carro", imageUrl: useImages[3], isCorrect: false },
            ],
          };
        },
      },
      {
        title: "AI G2: Forma palabras con LL",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra letras para formar palabras con LL",
        imageSearchTerms: [],
        voiceGuidance: "Forma la palabra 'lluvia' arrastrando las letras correctas.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Arrastra las letras para formar 'lluvia'",
          targetWord: "lluvia",
          availableLetters: ["ll", "u", "v", "i", "a", "m", "p", "s"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI G2: Completa con RR",
        type: "exercise",
        subtype: "fill_blank",
        description: "Completa palabras con RR",
        imageSearchTerms: [],
        voiceGuidance: "Completa la palabra usando las letras correctas. Recuerda que RR suena fuerte.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "Animal que dice guau: pe___",
          target: "perro",
          letters: ["p", "e", "rr", "o"],
          autoShuffle: false,
        }),
      },
      {
        title: "AI G2: Grupos consonánticos",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica grupos BR, PL, GR",
        imageSearchTerms: [],
        voiceGuidance: "Los grupos consonánticos son dos consonantes juntas. ¿Cuál palabra tiene BR?",
        contentBuilder: (images) => ({
          question: "¿Qué palabra contiene el grupo consonántico BR?",
          questionImage: null,
          answers: [
            { text: "brazo", imageUrl: null, isCorrect: true },
            { text: "paso", imageUrl: null, isCorrect: false },
            { text: "mesa", imageUrl: null, isCorrect: false },
            { text: "casa", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Cuenta las sílabas",
        type: "exercise",
        subtype: "write_answer",
        description: "Cuenta sílabas en palabras",
        imageSearchTerms: [],
        voiceGuidance: "Cuenta las sílabas: ma-ri-po-sa. ¿Cuántas hay?",
        contentBuilder: (images) => ({
          question: "¿Cuántas sílabas tiene 'mariposa'? (escribe el número)",
          questionImage: null,
          correctAnswer: "4",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: ¿Tiene dígrafo?",
        type: "exercise",
        subtype: "true_false",
        description: "Identifica si hay dígrafo",
        imageSearchTerms: [],
        voiceGuidance: "¿La palabra 'carro' tiene el dígrafo RR?",
        contentBuilder: (images) => ({
          question: "La palabra 'carro' contiene el dígrafo RR",
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 2: Fluidez - 5 exercises
    [
      {
        title: "AI G2: Identifica las pausas",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Reconoce dónde pausar al leer",
        imageSearchTerms: [],
        voiceGuidance: "Los puntos son pausas largas. Las comas son pausas cortas.",
        contentBuilder: (images) => ({
          question: "¿Cuántas pausas hay en: 'Luis, Ana y Pedro juegan.'?",
          questionImage: null,
          answers: [
            { text: "2 pausas", imageUrl: null, isCorrect: true },
            { text: "1 pausa", imageUrl: null, isCorrect: false },
            { text: "3 pausas", imageUrl: null, isCorrect: false },
            { text: "0 pausas", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Lee con emoción",
        type: "exercise",
        subtype: "true_false",
        description: "Entonación en exclamaciones",
        imageSearchTerms: [],
        voiceGuidance: "Las exclamaciones se leen con emoción y entusiasmo.",
        contentBuilder: (images) => ({
          question: "¡Qué lindo día! se debe leer con emoción",
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Palabras frecuentes",
        type: "exercise",
        subtype: "drag_drop",
        description: "Forma palabras de alta frecuencia",
        imageSearchTerms: [],
        voiceGuidance: "Estas palabras aparecen mucho. Debes reconocerlas rápido.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Forma una palabra muy común",
          targetWord: "porque",
          availableLetters: ["por", "que"],
          autoShuffle: false,
        }),
      },
      {
        title: "AI G2: Comprensión rápida",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Lee y comprende",
        imageSearchTerms: [],
        voiceGuidance: "Lee: 'El coquí canta en El Yunque por las noches.' ¿Cuándo canta?",
        contentBuilder: (images) => ({
          question: "Según el texto, ¿cuándo canta el coquí?",
          questionImage: null,
          answers: [
            { text: "Por las noches", imageUrl: null, isCorrect: true },
            { text: "Por las mañanas", imageUrl: null, isCorrect: false },
            { text: "Al mediodía", imageUrl: null, isCorrect: false },
            { text: "Todo el día", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Meta de velocidad",
        type: "exercise",
        subtype: "write_answer",
        description: "Conoce tu meta de lectura",
        imageSearchTerms: [],
        voiceGuidance: "En segundo grado debes leer entre 80 y 120 palabras por minuto.",
        contentBuilder: (images) => ({
          question: "¿Cuántas palabras por minuto es la meta mínima? (escribe el número)",
          questionImage: null,
          correctAnswer: "80",
          caseSensitive: false,
        }),
      },
    ],
    // Dominio 3: Vocabulario - 6 exercises
    [
      {
        title: "AI G2: Encuentra el sinónimo",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Palabras con significado similar",
        imageSearchTerms: [],
        voiceGuidance: "Los sinónimos son palabras hermanas. Significan casi lo mismo.",
        contentBuilder: (images) => ({
          question: "¿Cuál es sinónimo de 'contento'?",
          questionImage: null,
          answers: [
            { text: "feliz", imageUrl: null, isCorrect: true },
            { text: "triste", imageUrl: null, isCorrect: false },
            { text: "enojado", imageUrl: null, isCorrect: false },
            { text: "cansado", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Encuentra el antónimo",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Palabras opuestas",
        imageSearchTerms: [],
        voiceGuidance: "Los antónimos son totalmente opuestos.",
        contentBuilder: (images) => ({
          question: "¿Cuál es el antónimo de 'caliente'?",
          questionImage: null,
          answers: [
            { text: "frío", imageUrl: null, isCorrect: true },
            { text: "tibio", imageUrl: null, isCorrect: false },
            { text: "suave", imageUrl: null, isCorrect: false },
            { text: "duro", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Clasifica palabras",
        type: "exercise",
        subtype: "drag_drop",
        description: "Agrupa por categorías",
        imageSearchTerms: [],
        voiceGuidance: "Clasifica las palabras en sus familias correctas.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Arrastra cada palabra a su familia",
          dropZones: [
            { id: "frutas", label: "Frutas" },
            { id: "animales", label: "Animales" },
          ],
          draggableItems: [
            {
              id: "item-1",
              content: "mango",
              type: "text",
              correctZone: "frutas"
            },
            {
              id: "item-2",
              content: "perro",
              type: "text",
              correctZone: "animales"
            },
            {
              id: "item-3",
              content: "piña",
              type: "text",
              correctZone: "frutas"
            },
            {
              id: "item-4",
              content: "gato",
              type: "text",
              correctZone: "animales"
            },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI G2: Lenguaje figurado",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Comprende comparaciones",
        imageSearchTerms: [],
        voiceGuidance: "Las comparaciones con 'como' no son literales.",
        contentBuilder: (images) => ({
          question: "¿Qué significa 'rápido como el viento'?",
          questionImage: null,
          answers: [
            { text: "Muy rápido", imageUrl: null, isCorrect: true },
            { text: "Es viento", imageUrl: null, isCorrect: false },
            { text: "Hace viento", imageUrl: null, isCorrect: false },
            { text: "Le gusta el viento", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Vocabulario boricua",
        type: "exercise",
        subtype: "write_answer",
        description: "Palabras de Puerto Rico",
        imageSearchTerms: [],
        voiceGuidance: "En Puerto Rico, un raspado de hielo con sirope se llama...",
        contentBuilder: (images) => ({
          question: "¿Cómo se llama el raspado de hielo con sirope en PR?",
          questionImage: null,
          correctAnswer: "piragua",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: Usa el contexto",
        type: "exercise",
        subtype: "fill_blank",
        description: "Deduce significados",
        imageSearchTerms: [],
        voiceGuidance: "Las palabras alrededor te dan pistas del significado.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "Usé el ___ porque llovía (protege de la lluvia)",
          target: "paraguas",
          letters: ["pa", "ra", "gu", "as"],
          autoShuffle: true,
        }),
      },
    ],
    // Dominio 4: Comprensión Literal - 6 exercises
    [
      {
        title: "AI G2: Identifica personajes",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Encuentra los personajes",
        imageSearchTerms: [],
        voiceGuidance: "Lee: 'Juan y su perro Max fueron al parque.' ¿Quiénes son los personajes?",
        contentBuilder: (images) => ({
          question: "En el texto, ¿quiénes son los personajes?",
          questionImage: null,
          answers: [
            { text: "Juan y Max", imageUrl: null, isCorrect: true },
            { text: "Solo Juan", imageUrl: null, isCorrect: false },
            { text: "El parque", imageUrl: null, isCorrect: false },
            { text: "Juan y María", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: ¿Dónde ocurre?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica el lugar",
        imageSearchTerms: [],
        voiceGuidance: "Lee: 'Los niños jugaban en la plaza de recreo.' ¿Dónde están?",
        contentBuilder: (images) => ({
          question: "¿Dónde están jugando los niños?",
          questionImage: null,
          answers: [
            { text: "En la plaza de recreo", imageUrl: null, isCorrect: true },
            { text: "En casa", imageUrl: null, isCorrect: false },
            { text: "En la escuela", imageUrl: null, isCorrect: false },
            { text: "En la playa", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Ordena eventos",
        type: "exercise",
        subtype: "drag_drop",
        description: "Secuencia de acontecimientos",
        imageSearchTerms: [],
        voiceGuidance: "Ordena qué pasó primero, segundo y tercero.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Ordena los eventos en secuencia",
          dropZones: [
            { id: "primero", label: "Primero" },
            { id: "segundo", label: "Segundo" },
            { id: "tercero", label: "Tercero" },
          ],
          draggableItems: [
            {
              id: "item-1",
              content: "Se levantó",
              type: "text",
              correctZone: "primero"
            },
            {
              id: "item-2",
              content: "Desayunó",
              type: "text",
              correctZone: "segundo"
            },
            {
              id: "item-3",
              content: "Fue a la escuela",
              type: "text",
              correctZone: "tercero"
            },
          ],
          allowMultiplePerZone: false,
        }),
      },
      {
        title: "AI G2: Idea principal",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Encuentra el tema central",
        imageSearchTerms: [],
        voiceGuidance: "La idea principal es lo más importante del texto.",
        contentBuilder: (images) => ({
          question: "Lee: 'El coquí es el símbolo de PR. Canta de noche.' ¿Cuál es la idea principal?",
          questionImage: null,
          answers: [
            { text: "El coquí es el símbolo de PR", imageUrl: null, isCorrect: true },
            { text: "Canta fuerte", imageUrl: null, isCorrect: false },
            { text: "Es verde", imageUrl: null, isCorrect: false },
            { text: "Vive en árboles", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Detalles específicos",
        type: "exercise",
        subtype: "write_answer",
        description: "Encuentra información exacta",
        imageSearchTerms: [],
        voiceGuidance: "Lee: 'El coquí mide 3 centímetros.' ¿Cuánto mide?",
        contentBuilder: (images) => ({
          question: "¿Cuántos centímetros mide el coquí? (número)",
          questionImage: null,
          correctAnswer: "3",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: ¿Es correcto?",
        type: "exercise",
        subtype: "true_false",
        description: "Verifica información",
        imageSearchTerms: [],
        voiceGuidance: "Según el texto, ¿es correcta esta información?",
        contentBuilder: (images) => ({
          question: "El texto dice: 'El coquí canta de noche.' ¿Es cierto?",
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 5: Comprensión Inferencial - 8 exercises
    [
      {
        title: "AI G2: Infiere la causa",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Deduce por qué pasó algo",
        imageSearchTerms: [],
        voiceGuidance: "Lee: 'Ana llegó mojada a casa.' ¿Por qué estará mojada?",
        contentBuilder: (images) => ({
          question: "Si Ana llegó mojada, ¿qué pudo haber pasado?",
          questionImage: null,
          answers: [
            { text: "Estaba lloviendo", imageUrl: null, isCorrect: true },
            { text: "Hacía calor", imageUrl: null, isCorrect: false },
            { text: "Era de noche", imageUrl: null, isCorrect: false },
            { text: "Estaba cansada", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Predice el final",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Anticipa qué pasará",
        imageSearchTerms: [],
        voiceGuidance: "Las nubes están negras y hay viento. ¿Qué pasará?",
        contentBuilder: (images) => ({
          question: "Si hay nubes negras y viento fuerte, ¿qué pasará?",
          questionImage: null,
          answers: [
            { text: "Va a llover", imageUrl: null, isCorrect: true },
            { text: "Saldrá el sol", imageUrl: null, isCorrect: false },
            { text: "Nevará", imageUrl: null, isCorrect: false },
            { text: "Hará calor", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: ¿Cómo se siente?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Infiere emociones",
        imageSearchTerms: [],
        voiceGuidance: "Si alguien tiene lágrimas en los ojos, ¿cómo se siente?",
        contentBuilder: (images) => ({
          question: "Luis tiene lágrimas en los ojos. ¿Cómo se siente?",
          questionImage: null,
          answers: [
            { text: "Triste", imageUrl: null, isCorrect: true },
            { text: "Feliz", imageUrl: null, isCorrect: false },
            { text: "Enojado", imageUrl: null, isCorrect: false },
            { text: "Aburrido", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: El mensaje",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica la enseñanza",
        imageSearchTerms: [],
        voiceGuidance: "¿Qué nos enseña el cuento?",
        contentBuilder: (images) => ({
          question: "Si el niño honesto ganó amigos, ¿qué nos enseña?",
          questionImage: null,
          answers: [
            { text: "Ser honesto es bueno", imageUrl: null, isCorrect: true },
            { text: "Jugar es malo", imageUrl: null, isCorrect: false },
            { text: "No tener amigos", imageUrl: null, isCorrect: false },
            { text: "Correr rápido", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Propósito del texto",
        type: "exercise",
        subtype: "multiple_choice",
        description: "¿Para qué se escribió?",
        imageSearchTerms: [],
        voiceGuidance: "¿El autor quiere informar, entretener o convencer?",
        contentBuilder: (images) => ({
          question: "'¡Recicla para salvar el planeta!' ¿Cuál es el propósito?",
          questionImage: null,
          answers: [
            { text: "Convencernos de reciclar", imageUrl: null, isCorrect: true },
            { text: "Contar un cuento", imageUrl: null, isCorrect: false },
            { text: "Dar información", imageUrl: null, isCorrect: false },
            { text: "Hacernos reír", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Compara personajes",
        type: "exercise",
        subtype: "drag_drop",
        description: "Diferencias entre personajes",
        imageSearchTerms: [],
        voiceGuidance: "¿En qué se diferencian los personajes?",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Clasifica: hormiga trabajó, cigarra cantó",
          dropZones: [
            { id: "hormiga", label: "Hormiga" },
            { id: "cigarra", label: "Cigarra" },
          ],
          draggableItems: [
            {
              id: "item-1",
              content: "trabajadora",
              type: "text",
              correctZone: "hormiga"
            },
            {
              id: "item-2",
              content: "cantaba",
              type: "text",
              correctZone: "cigarra"
            },
            {
              id: "item-3",
              content: "preparada",
              type: "text",
              correctZone: "hormiga"
            },
            {
              id: "item-4",
              content: "descuidada",
              type: "text",
              correctZone: "cigarra"
            },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI G2: Causa y efecto",
        type: "exercise",
        subtype: "write_answer",
        description: "Conecta causa con resultado",
        imageSearchTerms: [],
        voiceGuidance: "Si Juan estudió y sacó A, ¿por qué sacó buena nota?",
        contentBuilder: (images) => ({
          question: "Juan sacó A porque... (una palabra)",
          questionImage: null,
          correctAnswer: "estudió",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: ¿Es inferencia correcta?",
        type: "exercise",
        subtype: "true_false",
        description: "Valida inferencias",
        imageSearchTerms: [],
        voiceGuidance: "¿Es correcta esta inferencia del texto?",
        contentBuilder: (images) => ({
          question: "Si dice 'saltó de alegría', inferimos que está feliz",
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
  ];

  // Process exercises
  const allExercises = [];
  const allOrderingRecords = [];

  for (let parentIndex = 0; parentIndex < insertedParents.length; parentIndex++) {
    const parent = insertedParents[parentIndex];
    const exercises = lessonExercises[parentIndex];

    console.log(`\n📝 Processing exercises for: ${parent.title}`);

    for (let exerciseIndex = 0; exerciseIndex < exercises.length; exerciseIndex++) {
      const template = exercises[exerciseIndex];

      console.log(`  🎯 Creating: ${template.title}`);

      // Fetch images if needed
      const exerciseImages: (string | null)[] = [];
      if (template.imageSearchTerms.length > 0) {
        for (const searchTerm of template.imageSearchTerms) {
          const image = await searchPexelsImage(searchTerm);
          exerciseImages.push(image?.src.large || null);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }

      const content = template.contentBuilder(exerciseImages);

      allExercises.push({
        created_by: createdBy,
        title: template.title,
        description: template.description,
        type: "exercise" as const,
        subtype: template.subtype as any,
        parent_lesson_id: parent.id,
        order_in_lesson: exerciseIndex + 1,
        grade_level: 2,
        language: "es" as const,
        subject_area: "reading" as const,
        status: "published" as const,
        content,
        enable_voice: true,
        auto_read_question: true,
        voice_speed: 1.0,
        passing_score: 70,
        max_attempts: 3,
        difficulty_level: 2,
        estimated_duration_minutes: 4,
        curriculum_standards: ["DEPR Grade 2 Spanish Literacy"],
        voice_guidance: template.voiceGuidance,
      });
    }
  }

  // Insert all exercises
  console.log(`\n🎯 Inserting ${allExercises.length} exercises...`);
  const { data: insertedExercises, error: exerciseError } = await supabase
    .from("manual_assessments")
    .insert(allExercises)
    .select();

  if (exerciseError || !insertedExercises) {
    console.error("❌ Error creating exercises:", exerciseError);
    throw exerciseError;
  }

  console.log(`✅ Created ${insertedExercises.length} exercises`);

  // Get current max display_order
  const { data: maxOrderData } = await supabase
    .from("lesson_ordering")
    .select("display_order")
    .eq("grade_level", 2)
    .order("display_order", { ascending: false })
    .limit(1);

  let nextDisplayOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

  // Create ordering
  console.log("\n📊 Creating lesson ordering...");

  for (const parent of insertedParents) {
    allOrderingRecords.push({
      assessment_id: parent.id,
      grade_level: 2,
      display_order: nextDisplayOrder++,
      parent_lesson_id: null,
    });
  }

  for (const exercise of insertedExercises) {
    allOrderingRecords.push({
      assessment_id: exercise.id,
      grade_level: 2,
      display_order: nextDisplayOrder++,
      parent_lesson_id: exercise.parent_lesson_id,
    });
  }

  const { error: orderingError } = await supabase
    .from("lesson_ordering")
    .insert(allOrderingRecords);

  if (orderingError) {
    console.error("❌ Error creating lesson ordering:", orderingError);
    throw orderingError;
  }

  console.log(`✅ Created ${allOrderingRecords.length} ordering records`);

  console.log("\n🎉 Grade 2 Spanish content generation complete!");
  console.log(`📚 5 Dominios (parent lessons) with teaching content`);
  console.log(`📝 ${insertedExercises.length} exercises aligned to DEPR standards`);
  console.log(`✅ All content properly formatted for the platform`);

  return {
    parents: insertedParents,
    exercises: insertedExercises,
    orderingRecords: allOrderingRecords,
  };
}