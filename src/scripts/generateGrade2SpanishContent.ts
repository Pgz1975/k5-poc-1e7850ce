import { supabase } from "@/integrations/supabase/client";
import { searchPexelsImage } from "@/utils/pexelsApi";

interface ParentLesson {
  title: string;
  description: string;
  imageSearchTerms: string[];
  voiceGuidance: string;
}

interface ExerciseTemplate {
  title: string;
  type: string;
  subtype: string;
  description: string;
  contentBuilder: (images: (string | null)[]) => any;
  imageSearchTerms: string[];
  voiceGuidance: string;
}

export async function generateGrade2SpanishContent() {
  console.log("🚀 Starting Grade 2 Spanish content generation...");

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const createdBy = user.id;

  // Define 5 parent lessons - one for each domain (dominio)
  const parentLessons: ParentLesson[] = [
    {
      title: "AI G2: Dominio 1 - Fonética y Conciencia Fonológica",
      description: "Dígrafos, grupos consonánticos y palabras multisilábicas",
      imageSearchTerms: ["spanish alphabet letters colorful"],
      voiceGuidance: "¡Hola! Soy tu amigo Coquí. En esta lección aprenderemos sobre los sonidos especiales del español. Vamos a practicar con dígrafos como CH, LL, y RR, y palabras con muchas sílabas. ¡Será muy divertido!",
    },
    {
      title: "AI G2: Dominio 2 - Fluidez Lectora",
      description: "Lectura fluida con ritmo y entonación adecuados",
      imageSearchTerms: ["child reading book spanish"],
      voiceGuidance: "En esta lección vamos a practicar la lectura en voz alta. Aprenderás a leer con buena velocidad, sin trabarte, y respetando los signos de puntuación. ¡Tu meta es leer entre 80 y 120 palabras por minuto!",
    },
    {
      title: "AI G2: Dominio 3 - Desarrollo de Vocabulario",
      description: "Sinónimos, antónimos y lenguaje figurado",
      imageSearchTerms: ["spanish dictionary words vocabulary"],
      voiceGuidance: "¡Vamos a enriquecer nuestro vocabulario! Aprenderemos palabras nuevas, sus sinónimos y antónimos. También descubriremos expresiones divertidas como 'tan alto como una jirafa'. ¡Ampliarás tu mundo de palabras!",
    },
    {
      title: "AI G2: Dominio 4 - Comprensión Literal",
      description: "Entender información explícita en textos narrativos e informativos",
      imageSearchTerms: ["story book Puerto Rico children"],
      voiceGuidance: "En esta sección leeremos cuentos y textos informativos sobre Puerto Rico. Aprenderás a identificar personajes, lugares, eventos y la idea principal. Practicaremos respondiendo preguntas de ¿Quién?, ¿Qué?, ¿Dónde? y ¿Cuándo?",
    },
    {
      title: "AI G2: Dominio 5 - Comprensión Inferencial",
      description: "Hacer inferencias, predicciones y pensamiento crítico",
      imageSearchTerms: ["thinking child question mark"],
      voiceGuidance: "¡Es hora de pensar más allá del texto! Aprenderás a deducir información que no está escrita directamente, hacer predicciones sobre lo que pasará después, y entender el mensaje del autor. ¡Serás un detective de la lectura!",
    },
  ];

  // Fetch images for parent lessons
  console.log("📸 Fetching parent lesson images from Pexels...");
  const parentImages: (string | null)[] = [];
  for (const lesson of parentLessons) {
    const image = await searchPexelsImage(lesson.imageSearchTerms[0]);
    parentImages.push(image?.src.large || null);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Insert parent lessons
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
          image_url: parentImages[index],
          description: lesson.description,
        },
        enable_voice: true,
        auto_read_question: true,
        voice_speed: 1.0,
        passing_score: 70,
        max_attempts: 3,
        difficulty_level: 2,
        estimated_duration_minutes: 25,
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

  // Define exercises for each domain
  const lessonExercises: ExerciseTemplate[][] = [
    // Dominio 1: Fonética y Conciencia Fonológica
    [
      {
        title: "AI G2: Construye palabras con dígrafos",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra sílabas para formar palabras con CH, LL, RR",
        imageSearchTerms: ["spanish letters", "alphabet blocks"],
        voiceGuidance: "Vamos a construir palabras usando los dígrafos CH, LL y RR. Recuerda que estos pares de letras forman un solo sonido. Por ejemplo, CH suena como en 'chavo', LL como en 'lluvia', y RR como en 'perro'.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Arrastra las sílabas para formar la palabra correcta",
          questionText: "Une las sílabas para formar palabras con dígrafos. Escucha bien el sonido especial que hacen CH, LL y RR.",
          questionImage: images[0],
          targetWord: "cachorro",
          availableLetters: ["ca", "cho", "rro", "ma", "te", "si", "la"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI G2: Completa con el dígrafo correcto",
        type: "exercise",
        subtype: "fill_blank",
        description: "Completa palabras con CH, LL o RR",
        imageSearchTerms: ["milk glass", "key metal", "dog puppy"],
        voiceGuidance: "Completa cada palabra con el dígrafo que falta. Piensa en el sonido que necesitas: ¿CH como en leche, LL como en llave, o RR como en perro?",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "Completa: le___e (leche)",
          target: "leche",
          letters: ["c", "h", "l", "l", "r", "r", "m", "n"],
          imageUrl: images[0],
          autoShuffle: true,
        }),
      },
      {
        title: "AI G2: Identifica grupos consonánticos",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Selecciona palabras con BR, PL, GR, FL",
        imageSearchTerms: ["tree branch", "plate dish", "grapes fruit", "flower bloom"],
        voiceGuidance: "Los grupos consonánticos son dos consonantes juntas como BR, PL, GR, FL. Escucha bien: BRazo, PLato, GRande, FLor. ¿Puedes identificar cuál palabra tiene el grupo consonántico?",
        contentBuilder: (images) => ({
          question: "¿Cuál palabra contiene el grupo consonántico 'BR'?",
          questionText: "Lee cada opción con cuidado. Busca la palabra que tiene las letras BR juntas, como en 'brazo'.",
          questionImage: images[0],
          answers: [
            { text: "brazo", imageUrl: images[0], isCorrect: true },
            { text: "mesa", imageUrl: images[1], isCorrect: false },
            { text: "silla", imageUrl: images[2], isCorrect: false },
            { text: "cama", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Separa en sílabas",
        type: "exercise",
        subtype: "drag_drop",
        description: "Divide palabras multisilábicas en sílabas",
        imageSearchTerms: ["butterfly colorful"],
        voiceGuidance: "Vamos a separar palabras largas en sílabas. Recuerda: cada sílaba tiene al menos una vocal. Por ejemplo: ma-ri-po-sa tiene 4 sílabas.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Separa la palabra 'mariposa' en sílabas",
          questionText: "Arrastra cada sílaba a su lugar correcto. Ma-ri-po-sa tiene 4 sílabas.",
          questionImage: images[0],
          draggableItems: [
            { id: "1", type: "text", content: "ma", label: "ma", correctZone: "silaba1" },
            { id: "2", type: "text", content: "ri", label: "ri", correctZone: "silaba2" },
            { id: "3", type: "text", content: "po", label: "po", correctZone: "silaba3" },
            { id: "4", type: "text", content: "sa", label: "sa", correctZone: "silaba4" },
          ],
          dropZones: [
            { id: "silaba1", label: "1ª sílaba" },
            { id: "silaba2", label: "2ª sílaba" },
            { id: "silaba3", label: "3ª sílaba" },
            { id: "silaba4", label: "4ª sílaba" },
          ],
          allowMultiplePerZone: false,
        }),
      },
      {
        title: "AI G2: Escucha y selecciona",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Selección múltiple auditiva",
        imageSearchTerms: ["spanish words", "vocabulary", "letters", "school supplies"],
        voiceGuidance: "Escucha con atención la palabra que voy a decir. Luego selecciona la opción escrita que corresponde. La palabra es: 'chocolate'.",
        contentBuilder: (images) => ({
          question: "Escucha: 'chocolate'. ¿Cuál es la palabra correcta?",
          questionImage: images[0],
          answers: [
            { text: "chocolate", imageUrl: null, isCorrect: true },
            { text: "chocalate", imageUrl: null, isCorrect: false },
            { text: "chokolate", imageUrl: null, isCorrect: false },
            { text: "chocolat", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Lectura guiada básica",
        type: "exercise",
        subtype: "true_false",
        description: "Practica la correlación grafofonémica",
        imageSearchTerms: ["reading practice spanish"],
        voiceGuidance: "Lee conmigo: 'El carro rojo corre rápido'. Nota cómo la doble RR suena fuerte. ¿Practicamos juntos?",
        contentBuilder: (images) => ({
          question: "La palabra 'carro' tiene el dígrafo RR",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 2: Fluidez Lectora
    [
      {
        title: "AI G2: Lectura cronometrada",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Lee el texto y responde preguntas de comprensión",
        imageSearchTerms: ["Puerto Rico beach", "coqui frog", "tropical forest"],
        voiceGuidance: "Lee este texto sobre Puerto Rico en voz alta. Trata de leer entre 80 y 120 palabras por minuto. Respeta las pausas en las comas y los puntos.",
        contentBuilder: (images) => ({
          question: "Después de leer: ¿Dónde vive el coquí?",
          questionText: "Texto: 'El coquí es una ranita pequeña que vive en Puerto Rico. Le gusta cantar por las noches en el bosque de El Yunque. Su canto suena como su nombre: co-quí, co-quí.'",
          questionImage: images[1],
          answers: [
            { text: "En el bosque de El Yunque", imageUrl: images[2], isCorrect: true },
            { text: "En la playa", imageUrl: images[0], isCorrect: false },
            { text: "En la ciudad", imageUrl: null, isCorrect: false },
            { text: "En el río", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Practica la entonación",
        type: "exercise",
        subtype: "true_false",
        description: "Reconoce signos de puntuación para modular la voz",
        imageSearchTerms: ["exclamation mark", "question mark"],
        voiceGuidance: "Los signos de puntuación nos dicen cómo leer. El signo de interrogación (¿?) sube la voz al preguntar. El de exclamación (¡!) muestra emoción. Practiquemos: '¡Qué lindo día!' vs '¿Qué hora es?'",
        contentBuilder: (images) => ({
          question: "¿La oración '¡Vamos a la playa!' debe leerse con emoción?",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Palabras de alta frecuencia",
        type: "exercise",
        subtype: "drag_drop",
        description: "Automatización de palabras comunes",
        imageSearchTerms: ["common spanish words"],
        voiceGuidance: "Estas son palabras que verás mucho al leer. Debes reconocerlas rápidamente sin deletrear: el, la, de, que, y, a, en, un, por, con.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Forma rápidamente la palabra de alta frecuencia",
          questionImage: images[0],
          targetWord: "porque",
          availableLetters: ["por", "que", "par", "qui", "pe", "ro"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI G2: Lectura con pausas",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Respeta comas y puntos al leer",
        imageSearchTerms: ["reading child"],
        voiceGuidance: "Lee este texto haciendo pausas cortas en las comas y pausas largas en los puntos: 'María, mi hermana, tiene un gato. El gato es negro, blanco y gris.'",
        contentBuilder: (images) => ({
          question: "¿Cuántas pausas (comas) hay en: 'María, mi hermana, tiene un gato'?",
          questionImage: images[0],
          answers: [
            { text: "2 pausas", imageUrl: null, isCorrect: true },
            { text: "1 pausa", imageUrl: null, isCorrect: false },
            { text: "3 pausas", imageUrl: null, isCorrect: false },
            { text: "No hay pausas", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Comprensión rápida",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Lee y comprende rápidamente",
        imageSearchTerms: ["Puerto Rican food mofongo"],
        voiceGuidance: "Lee rápido pero con atención: 'El mofongo es un plato típico de Puerto Rico. Se hace con plátano verde machacado y chicharrón.'",
        contentBuilder: (images) => ({
          question: "¿Con qué se hace el mofongo?",
          questionImage: images[0],
          answers: [
            { text: "Plátano verde y chicharrón", imageUrl: images[0], isCorrect: true },
            { text: "Arroz y habichuelas", imageUrl: null, isCorrect: false },
            { text: "Yuca y carne", imageUrl: null, isCorrect: false },
            { text: "Papa y pollo", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 3: Desarrollo de Vocabulario
    [
      {
        title: "AI G2: Sinónimos - palabras hermanas",
        type: "exercise",
        subtype: "drag_drop",
        description: "Empareja palabras con significados similares",
        imageSearchTerms: ["happy child", "sad child", "big elephant", "small mouse"],
        voiceGuidance: "Los sinónimos son palabras diferentes que significan casi lo mismo. Por ejemplo: 'bonito' y 'hermoso', 'saltar' y 'brincar'. Son como hermanos de significado.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Empareja cada palabra con su sinónimo",
          questionText: "Une las palabras que significan lo mismo. Por ejemplo: feliz = contento, grande = enorme.",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "text", content: "feliz", label: "feliz", correctZone: "contento" },
            { id: "2", type: "text", content: "triste", label: "triste", correctZone: "apenado" },
            { id: "3", type: "text", content: "grande", label: "grande", correctZone: "enorme" },
            { id: "4", type: "text", content: "pequeño", label: "pequeño", correctZone: "chiquito" },
          ],
          dropZones: [
            { id: "contento", label: "contento" },
            { id: "apenado", label: "apenado" },
            { id: "enorme", label: "enorme" },
            { id: "chiquito", label: "chiquito" },
          ],
          allowMultiplePerZone: false,
        }),
      },
      {
        title: "AI G2: Antónimos - opuestos",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica palabras con significados opuestos",
        imageSearchTerms: ["hot cold", "day night", "up down"],
        voiceGuidance: "Los antónimos son palabras opuestas. Como 'día' y 'noche', 'caliente' y 'frío'. Son totalmente diferentes, como el blanco y el negro.",
        contentBuilder: (images) => ({
          question: "¿Cuál es el antónimo de 'lleno'?",
          questionText: "Busca la palabra que significa lo contrario de 'lleno'. Si un vaso está lleno de agua, lo opuesto sería...",
          questionImage: images[0],
          answers: [
            { text: "vacío", imageUrl: null, isCorrect: true },
            { text: "grande", imageUrl: null, isCorrect: false },
            { text: "mojado", imageUrl: null, isCorrect: false },
            { text: "nuevo", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Familias de palabras",
        type: "exercise",
        subtype: "drag_drop",
        description: "Agrupa palabras por categorías semánticas",
        imageSearchTerms: ["animals zoo", "fruits tropical", "school supplies"],
        voiceGuidance: "Las familias de palabras son grupos relacionados. Por ejemplo, la familia 'animales': perro, gato, caballo. O la familia 'frutas': mango, piña, guayaba.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Clasifica las palabras en sus familias",
          questionText: "Arrastra cada palabra a su familia correcta: Animales, Frutas o Útiles escolares.",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "text", content: "mango", label: "mango", correctZone: "frutas" },
            { id: "2", type: "text", content: "perro", label: "perro", correctZone: "animales" },
            { id: "3", type: "text", content: "lápiz", label: "lápiz", correctZone: "utiles" },
            { id: "4", type: "text", content: "piña", label: "piña", correctZone: "frutas" },
            { id: "5", type: "text", content: "gato", label: "gato", correctZone: "animales" },
            { id: "6", type: "text", content: "libreta", label: "libreta", correctZone: "utiles" },
          ],
          dropZones: [
            { id: "animales", label: "Animales" },
            { id: "frutas", label: "Frutas" },
            { id: "utiles", label: "Útiles escolares" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI G2: Lenguaje figurado básico",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Reconoce símiles y personificaciones sencillas",
        imageSearchTerms: ["giraffe tall", "butterfly stomach"],
        voiceGuidance: "El lenguaje figurado usa comparaciones divertidas. 'Tan alto como una jirafa' no significa que seas una jirafa, sino muy alto. 'Mariposas en el estómago' significa estar nervioso.",
        contentBuilder: (images) => ({
          question: "¿Qué significa 'tan alto como una jirafa'?",
          questionText: "Esta expresión es un símil. No significa que la persona sea una jirafa, sino que es...",
          questionImage: images[0],
          answers: [
            { text: "Muy alta", imageUrl: images[0], isCorrect: true },
            { text: "Un animal", imageUrl: null, isCorrect: false },
            { text: "Amarilla", imageUrl: null, isCorrect: false },
            { text: "Del zoológico", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Contexto para entender",
        type: "exercise",
        subtype: "fill_blank",
        description: "Usa pistas del contexto para entender palabras nuevas",
        imageSearchTerms: ["rain umbrella"],
        voiceGuidance: "Cuando no conoces una palabra, las otras palabras te dan pistas. Lee: 'Usé el paraguas porque estaba lloviendo.' ¿Qué será un paraguas? Las pistas dicen que se usa cuando llueve.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "El ___ protege de la lluvia",
          target: "paraguas",
          letters: ["p", "a", "r", "a", "g", "u", "a", "s"],
          imageUrl: images[0],
          autoShuffle: false,
        }),
      },
      {
        title: "AI G2: Palabras del entorno boricua",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Vocabulario de Puerto Rico",
        imageSearchTerms: ["Puerto Rico flag", "vejigante mask", "puerto rico beach"],
        voiceGuidance: "En Puerto Rico tenemos palabras especiales. 'Vejigante' es una máscara tradicional del carnaval. 'Piragua' es un raspado de hielo con sirope. ¡Son palabras boricuas!",
        contentBuilder: (images) => ({
          question: "¿Qué es una 'piragua' en Puerto Rico?",
          questionImage: images[2],
          answers: [
            { text: "Un raspado de hielo con sirope", imageUrl: null, isCorrect: true },
            { text: "Un barco pequeño", imageUrl: null, isCorrect: false },
            { text: "Un pájaro tropical", imageUrl: null, isCorrect: false },
            { text: "Una flor", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 4: Comprensión Literal
    [
      {
        title: "AI G2: ¿Quién es el personaje?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica personajes principales en el cuento",
        imageSearchTerms: ["Puerto Rican boy", "grandmother cooking", "coqui frog"],
        voiceGuidance: "Lee con atención: 'Juan vive con su abuela en Ponce. Todas las mañanas, la abuela prepara un rico desayuno con café y pan.' ¿Quiénes son los personajes?",
        contentBuilder: (images) => ({
          question: "¿Quiénes son los personajes del texto?",
          questionText: "Texto: 'Juan vive con su abuela en Ponce. Todas las mañanas, la abuela prepara un rico desayuno con café y pan.'",
          questionImage: images[0],
          answers: [
            { text: "Juan y su abuela", imageUrl: images[1], isCorrect: true },
            { text: "Juan y su mamá", imageUrl: null, isCorrect: false },
            { text: "Solo Juan", imageUrl: null, isCorrect: false },
            { text: "La abuela y el abuelo", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: ¿Dónde ocurre la historia?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica el escenario del texto",
        imageSearchTerms: ["Ponce Puerto Rico", "Old San Juan", "El Yunque forest", "beach puerto rico"],
        voiceGuidance: "El escenario es el lugar donde pasa la historia. Lee: 'Los niños jugaban en la plaza de Ponce mientras las palomas volaban alrededor de la fuente.' ¿Dónde están?",
        contentBuilder: (images) => ({
          question: "¿Dónde están jugando los niños?",
          questionText: "Texto: 'Los niños jugaban en la plaza de Ponce mientras las palomas volaban alrededor de la fuente.'",
          questionImage: images[0],
          answers: [
            { text: "En la plaza de Ponce", imageUrl: images[0], isCorrect: true },
            { text: "En el Viejo San Juan", imageUrl: images[1], isCorrect: false },
            { text: "En El Yunque", imageUrl: images[2], isCorrect: false },
            { text: "En la playa", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Ordena los eventos",
        type: "exercise",
        subtype: "drag_drop",
        description: "Secuencia cronológica de eventos",
        imageSearchTerms: ["morning sunrise", "afternoon sun", "night moon"],
        voiceGuidance: "Lee la historia y ordena qué pasó primero, segundo y tercero. 'María se despertó temprano. Luego desayunó con su familia. Finalmente, se fue a la escuela.'",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Ordena los eventos del cuento",
          questionText: "Arrastra los eventos en el orden correcto: primero, segundo, tercero.",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "text", content: "Se fue a la escuela", label: "Se fue a la escuela", correctZone: "tercero" },
            { id: "2", type: "text", content: "Se despertó temprano", label: "Se despertó temprano", correctZone: "primero" },
            { id: "3", type: "text", content: "Desayunó con su familia", label: "Desayunó con su familia", correctZone: "segundo" },
          ],
          dropZones: [
            { id: "primero", label: "1° Primero" },
            { id: "segundo", label: "2° Segundo" },
            { id: "tercero", label: "3° Tercero" },
          ],
          allowMultiplePerZone: false,
        }),
      },
      {
        title: "AI G2: Idea principal del texto",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Encuentra la idea central del párrafo",
        imageSearchTerms: ["coqui Puerto Rico frog"],
        voiceGuidance: "La idea principal es lo más importante del texto. Lee: 'El coquí es el símbolo de Puerto Rico. Esta ranita canta por las noches. Su canto alegra los campos boricuas.' ¿Cuál es la idea principal?",
        contentBuilder: (images) => ({
          question: "¿Cuál es la idea principal del texto sobre el coquí?",
          questionText: "Texto: 'El coquí es el símbolo de Puerto Rico. Esta ranita canta por las noches. Su canto alegra los campos boricuas.'",
          questionImage: images[0],
          answers: [
            { text: "El coquí es el símbolo de Puerto Rico", imageUrl: images[0], isCorrect: true },
            { text: "El coquí canta de día", imageUrl: null, isCorrect: false },
            { text: "El coquí es grande", imageUrl: null, isCorrect: false },
            { text: "El coquí vive en el mar", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Mapa del cuento",
        type: "exercise",
        subtype: "write_answer",
        description: "Completa información explícita del texto",
        imageSearchTerms: ["story map diagram"],
        voiceGuidance: "Vamos a completar un mapa del cuento. Lee: 'Ana encontró un gatito en el parque. Lo llevó a casa y le dio leche.' ¿Qué encontró Ana?",
        contentBuilder: (images) => ({
          question: "¿Qué encontró Ana? (una palabra)",
          questionImage: images[0],
          correctAnswer: "gatito",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: Usa las ilustraciones",
        type: "exercise",
        subtype: "true_false",
        description: "Las imágenes ayudan a comprender",
        imageSearchTerms: ["rain umbrella child"],
        voiceGuidance: "Las ilustraciones nos dan información extra. Si ves una imagen de lluvia y un niño con paraguas, puedes entender mejor cuando el texto dice 'Era un día lluvioso'.",
        contentBuilder: (images) => ({
          question: "Las ilustraciones nos ayudan a entender mejor el texto",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Dominio 5: Comprensión Inferencial
    [
      {
        title: "AI G2: ¿Por qué pasó esto?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Inferir causas no explícitas",
        imageSearchTerms: ["wet floor", "spilled water", "crying child"],
        voiceGuidance: "A veces el texto no dice todo directamente. Lee: 'El piso estaba mojado. María resbaló.' El texto no dice por qué estaba mojado, pero podemos deducir que alguien derramó agua.",
        contentBuilder: (images) => ({
          question: "Lee: 'El piso estaba mojado. María resbaló.' ¿Por qué crees que el piso estaba mojado?",
          questionText: "Piensa: ¿Qué pudo haber pasado antes para que el piso estuviera mojado? El texto no lo dice, pero puedes deducirlo.",
          questionImage: images[0],
          answers: [
            { text: "Alguien derramó agua", imageUrl: images[1], isCorrect: true },
            { text: "María lo secó", imageUrl: null, isCorrect: false },
            { text: "Estaba limpio", imageUrl: null, isCorrect: false },
            { text: "Era de madera", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Predice qué pasará",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Hacer predicciones lógicas",
        imageSearchTerms: ["dark clouds rain", "umbrella", "sunny day"],
        voiceGuidance: "Usa las pistas para predecir. Lee: 'Las nubes negras cubrieron el cielo. Juan corrió a buscar su paraguas.' ¿Qué crees que pasará después?",
        contentBuilder: (images) => ({
          question: "Lee: 'Las nubes negras cubrieron el cielo. Juan corrió a buscar su paraguas.' ¿Qué pasará después?",
          questionImage: images[0],
          answers: [
            { text: "Va a llover", imageUrl: images[0], isCorrect: true },
            { text: "Saldrá el sol", imageUrl: images[2], isCorrect: false },
            { text: "Nevará", imageUrl: null, isCorrect: false },
            { text: "Hará calor", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: El mensaje del cuento",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identificar la moraleja o enseñanza",
        imageSearchTerms: ["sharing children", "helping others", "teamwork kids"],
        voiceGuidance: "Los cuentos tienen enseñanzas. Lee: 'Pedro compartió su merienda con Ana que no tenía. Ana se sintió feliz y agradecida.' ¿Qué nos enseña este cuento?",
        contentBuilder: (images) => ({
          question: "¿Qué lección nos enseña el cuento de Pedro y Ana?",
          questionText: "Cuento: 'Pedro compartió su merienda con Ana que no tenía. Ana se sintió feliz y agradecida.' ¿Cuál es el mensaje?",
          questionImage: images[0],
          answers: [
            { text: "Es bueno compartir con otros", imageUrl: images[0], isCorrect: true },
            { text: "No hay que traer merienda", imageUrl: null, isCorrect: false },
            { text: "Ana debe traer comida", imageUrl: null, isCorrect: false },
            { text: "Pedro come mucho", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: ¿Quién cuenta la historia?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identificar el punto de vista del narrador",
        imageSearchTerms: ["storyteller", "perspective view"],
        voiceGuidance: "¿Quién cuenta la historia? Si dice 'Yo fui al parque', el personaje cuenta su propia historia. Si dice 'María fue al parque', alguien más la cuenta.",
        contentBuilder: (images) => ({
          question: "Lee: 'Yo vi un arcoíris hermoso después de la lluvia.' ¿Quién cuenta esto?",
          questionImage: images[0],
          answers: [
            { text: "El personaje mismo", imageUrl: null, isCorrect: true },
            { text: "Un narrador externo", imageUrl: null, isCorrect: false },
            { text: "La mamá", imageUrl: null, isCorrect: false },
            { text: "El maestro", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Compara dos textos",
        type: "exercise",
        subtype: "drag_drop",
        description: "Encuentra semejanzas y diferencias",
        imageSearchTerms: ["rain weather", "water cycle"],
        voiceGuidance: "Lee dos textos sobre la lluvia. Texto A: 'La lluvia moja las plantas.' Texto B: 'El agua se evapora y forma nubes.' Uno es poético, otro es científico.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "¿Qué información aparece en cada texto?",
          questionText: "Texto A habla de cómo la lluvia moja las plantas. Texto B explica el ciclo del agua. Clasifica la información.",
          questionImage: images[0],
          draggableItems: [
            { id: "1", type: "text", content: "Moja las plantas", label: "Moja las plantas", correctZone: "textoA" },
            { id: "2", type: "text", content: "Ciclo del agua", label: "Ciclo del agua", correctZone: "textoB" },
            { id: "3", type: "text", content: "Evaporación", label: "Evaporación", correctZone: "textoB" },
            { id: "4", type: "text", content: "Plantas verdes", label: "Plantas verdes", correctZone: "textoA" },
          ],
          dropZones: [
            { id: "textoA", label: "Texto A (poético)" },
            { id: "textoB", label: "Texto B (científico)" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI G2: Propósito del autor",
        type: "exercise",
        subtype: "multiple_choice",
        description: "¿Para qué escribió el autor este texto?",
        imageSearchTerms: ["recycling kids", "information book", "entertainment story"],
        voiceGuidance: "Los autores escriben por diferentes razones: informar (dar datos), entretener (contar cuentos), o persuadir (convencer). ¿Cuál es el propósito aquí?",
        contentBuilder: (images) => ({
          question: "Lee: '¡Recicla! Salva el planeta separando la basura.' ¿Cuál es el propósito?",
          questionImage: images[0],
          answers: [
            { text: "Persuadir - convencernos de reciclar", imageUrl: images[0], isCorrect: true },
            { text: "Entretener con un cuento", imageUrl: images[2], isCorrect: false },
            { text: "Informar datos científicos", imageUrl: images[1], isCorrect: false },
            { text: "Enseñar matemáticas", imageUrl: null, isCorrect: false },
          ],
        }),
      },
      {
        title: "AI G2: Evidencia del texto",
        type: "exercise",
        subtype: "write_answer",
        description: "Justifica inferencias con evidencia",
        imageSearchTerms: ["sad child", "evidence clues"],
        voiceGuidance: "Cuando inferimos algo, necesitamos evidencia del texto. Si dices 'Ana estaba triste', debes encontrar la frase que lo sugiere, como 'Ana tenía lágrimas en los ojos'.",
        contentBuilder: (images) => ({
          question: "Si Ana tenía lágrimas en los ojos, ¿cómo se sentía? (una palabra)",
          questionImage: images[0],
          correctAnswer: "triste",
          caseSensitive: false,
        }),
      },
      {
        title: "AI G2: Causa y efecto implícito",
        type: "exercise",
        subtype: "true_false",
        description: "Relaciona causas y efectos no explícitos",
        imageSearchTerms: ["homework study", "good grades"],
        voiceGuidance: "Lee: 'Luis estudió mucho para el examen. Sacó una A.' El texto no dice que estudiar causó la buena nota, pero podemos conectar causa (estudiar) y efecto (buena nota).",
        contentBuilder: (images) => ({
          question: "Luis sacó buena nota porque estudió mucho",
          questionImage: images[0],
          answers: [
            { text: "Verdadero - es la causa más probable", imageUrl: null, isCorrect: true },
            { text: "Falso - no hay relación", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
  ];

  // Process exercises for each domain
  const allExercises = [];
  const allOrderingRecords = [];

  for (let parentIndex = 0; parentIndex < insertedParents.length; parentIndex++) {
    const parent = insertedParents[parentIndex];
    const exercises = lessonExercises[parentIndex];

    console.log(`\n📝 Processing exercises for: ${parent.title}`);

    // Grade 2 has different exercise counts per domain
    // Domain 1 & 2: 6 exercises each
    // Domain 3: 6 exercises
    // Domain 4: 6 exercises
    // Domain 5: 8 exercises
    const exercisesToProcess = exercises.slice(0, parentIndex === 4 ? 8 : 6);

    for (let exerciseIndex = 0; exerciseIndex < exercisesToProcess.length; exerciseIndex++) {
      const template = exercisesToProcess[exerciseIndex];

      console.log(`  🖼️  Fetching images for: ${template.title}`);
      const exerciseImages: (string | null)[] = [];

      for (const searchTerm of template.imageSearchTerms) {
        const image = await searchPexelsImage(searchTerm);
        exerciseImages.push(image?.src.large || null);
        await new Promise(resolve => setTimeout(resolve, 500));
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
        estimated_duration_minutes: 5,
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

  // Get current max display_order for grade 2
  const { data: maxOrderData } = await supabase
    .from("lesson_ordering")
    .select("display_order")
    .eq("grade_level", 2)
    .order("display_order", { ascending: false })
    .limit(1);

  let nextDisplayOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

  // Create lesson ordering records
  console.log("\n📊 Creating lesson ordering for Grade 2...");

  // Add parent lessons
  for (const parent of insertedParents) {
    allOrderingRecords.push({
      assessment_id: parent.id,
      grade_level: 2,
      display_order: nextDisplayOrder++,
      parent_lesson_id: null,
    });
  }

  // Add exercises
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

  console.log("\n🎉 Grade 2 content generation complete!");
  console.log(`📚 Total parent lessons (dominios): ${insertedParents.length}`);
  console.log(`📝 Total exercises: ${insertedExercises.length}`);
  console.log(`📊 Total ordering records: ${allOrderingRecords.length}`);

  return {
    parents: insertedParents,
    exercises: insertedExercises,
    orderingRecords: allOrderingRecords,
  };
}