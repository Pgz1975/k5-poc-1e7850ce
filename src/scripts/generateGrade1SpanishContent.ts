import { supabase } from "@/integrations/supabase/client";
import { searchPexelsImage } from "@/utils/pexelsApi";

interface ParentLesson {
  title: string;
  description: string;
  imageSearchTerms: string[];
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

export async function generateGrade1SpanishContent() {
  console.log("🚀 Starting Grade 1 Spanish content generation...");

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const createdBy = user.id;

  // Define parent lessons
  const parentLessons: ParentLesson[] = [
    {
      title: "AI: Sonidos Iniciales - Letra M",
      description: "Aprende a reconocer y usar el sonido /m/ con Coquí",
      imageSearchTerms: ["letter M alphabet colorful"],
    },
    {
      title: "AI: Sonidos Iniciales - Letra S",
      description: "Descubre palabras que comienzan con el sonido /s/",
      imageSearchTerms: ["letter S alphabet children"],
    },
    {
      title: "AI: El Coquí de Puerto Rico",
      description: "Lee y aprende sobre nuestro coquí puertorriqueño",
      imageSearchTerms: ["coqui frog Puerto Rico"],
    },
    {
      title: "AI: Comida Típica Boricua",
      description: "Conoce las deliciosas comidas de Puerto Rico",
      imageSearchTerms: ["Puerto Rican food plantain"],
    },
  ];

  // Fetch images for parent lessons with delays
  console.log("📸 Fetching parent lesson images from Pexels...");
  const parentImages: (string | null)[] = [];
  for (const lesson of parentLessons) {
    const image = await searchPexelsImage(lesson.imageSearchTerms[0]);
    parentImages.push(image?.src.large || null);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit protection
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
        grade_level: 1,
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
        difficulty_level: 1,
        estimated_duration_minutes: 20,
        curriculum_standards: ["DEPR Grade 1 Spanish Literacy"],
        voice_guidance: `¡Hola! Soy Coquí, tu amigo de Puerto Rico. Vamos a aprender juntos sobre ${lesson.title.replace("AI: ", "")}. ¡Será muy divertido! Presiona cada actividad para comenzar.`,
      }))
    )
    .select();

  if (parentError || !insertedParents) {
    console.error("❌ Error creating parent lessons:", parentError);
    throw parentError;
  }

  console.log(`✅ Created ${insertedParents.length} parent lessons`);

  // Define exercise templates for each parent lesson
  const lessonExercises: ExerciseTemplate[][] = [
    // Lesson 1: Letra M
    [
      {
        title: "AI: ¿Cuál comienza con M?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica la palabra que comienza con el sonido /m/",
        imageSearchTerms: ["mother child", "house home", "dog pet", "sun sky"],
        voiceGuidance: "Escucha bien cada palabra. ¿Cuál comienza con el sonido /m/ como en 'mamá'? Tómate tu tiempo para pensar.",
        contentBuilder: (images) => ({
          question: "¿Cuál palabra comienza con el sonido /m/?",
          questionImage: images[0],
          answers: [
            { text: "mamá", imageUrl: images[0], isCorrect: true },
            { text: "casa", imageUrl: images[1], isCorrect: false },
            { text: "perro", imageUrl: images[2], isCorrect: false },
            { text: "sol", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI: Forma la palabra MAMÁ",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las letras para formar MAMÁ",
        imageSearchTerms: ["mother daughter"],
        voiceGuidance: "Arrastra las letras para formar la palabra 'mamá'. Escucha el sonido de cada letra y ponlas en orden.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Arrastra las letras para formar la palabra 'mamá'",
          questionImage: images[0],
          targetWord: "mamá",
          availableLetters: ["m", "a", "m", "á", "s", "t", "l", "n"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Relaciona con M",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las imágenes que comienzan con M",
        imageSearchTerms: ["hand fingers", "table desk", "apple fruit", "monkey animal"],
        voiceGuidance: "Mira las imágenes y escucha sus nombres. Arrastra al lado correcto las que comienzan con /m/.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Arrastra las imágenes según comiencen o no con el sonido /m/",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "image", content: images[0] || "", label: "mano", correctZone: "con-m" },
            { id: "2", type: "image", content: images[1] || "", label: "mesa", correctZone: "con-m" },
            { id: "3", type: "image", content: images[2] || "", label: "manzana", correctZone: "con-m" },
            { id: "4", type: "image", content: images[3] || "", label: "mono", correctZone: "con-m" },
          ],
          dropZones: [
            { id: "con-m", label: "Comienza con M" },
            { id: "sin-m", label: "No comienza con M" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI: Completa MESA",
        type: "exercise",
        subtype: "fill_blank",
        description: "Usa las letras para formar MESA",
        imageSearchTerms: ["wooden table"],
        voiceGuidance: "Mira la imagen. Usa las letras para formar la palabra que ves. Recuerda que comienza con /m/.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "Forma la palabra que ves en la imagen",
          target: "mesa",
          letters: ["m", "e", "s", "a", "o", "l", "t"],
          imageUrl: images[0],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Primera letra de MANGO",
        type: "exercise",
        subtype: "write_answer",
        description: "Escribe la primera letra de mango",
        imageSearchTerms: ["mango tropical fruit"],
        voiceGuidance: "Mira la imagen. Escucha la palabra 'mango'. Escribe solamente la primera letra que escuchas.",
        contentBuilder: (images) => ({
          question: "Escribe la primera letra que escuchas en 'mango'",
          questionImage: images[0],
          correctAnswer: "m",
          caseSensitive: false,
        }),
      },
      {
        title: "AI: ¿MONO empieza con M?",
        type: "exercise",
        subtype: "true_false",
        description: "Decide si mono comienza con M",
        imageSearchTerms: ["monkey cute"],
        voiceGuidance: "Mira la imagen del mono. Piensa bien: ¿la palabra 'mono' comienza con el sonido /m/?",
        contentBuilder: (images) => ({
          question: "La palabra 'mono' comienza con el sonido /m/",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Lesson 2: Letra S
    [
      {
        title: "AI: ¿Cuál comienza con S?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica la palabra que comienza con el sonido /s/",
        imageSearchTerms: ["sun bright", "moon night", "tree forest", "car vehicle"],
        voiceGuidance: "Escucha cada palabra con atención. ¿Cuál comienza con /s/ como 'sol'?",
        contentBuilder: (images) => ({
          question: "¿Cuál palabra comienza con el sonido /s/?",
          questionImage: images[0],
          answers: [
            { text: "sol", imageUrl: images[0], isCorrect: true },
            { text: "luna", imageUrl: images[1], isCorrect: false },
            { text: "árbol", imageUrl: images[2], isCorrect: false },
            { text: "carro", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI: Forma la palabra SOL",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las letras para formar SOL",
        imageSearchTerms: ["bright sun"],
        voiceGuidance: "Forma la palabra 'sol' arrastrando las letras correctas. Piensa en el sonido de cada letra.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Arrastra las letras para formar 'sol'",
          questionImage: images[0],
          targetWord: "sol",
          availableLetters: ["s", "o", "l", "m", "a", "t", "r"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Relaciona con S",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las imágenes que comienzan con S",
        imageSearchTerms: ["chair furniture", "watermelon fruit", "snake reptile", "sofa couch"],
        voiceGuidance: "Mira bien cada imagen. Arrastra las que empiezan con /s/ a la zona correcta.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Arrastra las imágenes según comiencen o no con /s/",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "image", content: images[0] || "", label: "silla", correctZone: "con-s" },
            { id: "2", type: "image", content: images[1] || "", label: "sandía", correctZone: "con-s" },
            { id: "3", type: "image", content: images[2] || "", label: "serpiente", correctZone: "con-s" },
            { id: "4", type: "image", content: images[3] || "", label: "sofá", correctZone: "con-s" },
          ],
          dropZones: [
            { id: "con-s", label: "Comienza con S" },
            { id: "sin-s", label: "No comienza con S" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI: Completa SAPO",
        type: "exercise",
        subtype: "fill_blank",
        description: "Usa las letras para formar SAPO",
        imageSearchTerms: ["toad frog green"],
        voiceGuidance: "¿Ves el animal en la imagen? Forma su nombre usando las letras.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "Forma la palabra que ves en la imagen",
          target: "sapo",
          letters: ["s", "a", "p", "o", "m", "l", "e"],
          imageUrl: images[0],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Primera letra de SILLA",
        type: "exercise",
        subtype: "write_answer",
        description: "Escribe la primera letra de silla",
        imageSearchTerms: ["wooden chair"],
        voiceGuidance: "Mira la silla. Escucha bien: 'silla'. ¿Con qué letra comienza?",
        contentBuilder: (images) => ({
          question: "Escribe la primera letra que escuchas en 'silla'",
          questionImage: images[0],
          correctAnswer: "s",
          caseSensitive: false,
        }),
      },
      {
        title: "AI: ¿SERPIENTE empieza con S?",
        type: "exercise",
        subtype: "true_false",
        description: "Decide si serpiente comienza con S",
        imageSearchTerms: ["snake green"],
        voiceGuidance: "Observa la serpiente. ¿Crees que 'serpiente' comienza con /s/?",
        contentBuilder: (images) => ({
          question: "La palabra 'serpiente' comienza con el sonido /s/",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Lesson 3: El Coquí
    [
      {
        title: "AI: ¿Dónde vive el coquí?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Aprende dónde vive nuestro coquí",
        imageSearchTerms: ["El Yunque rainforest Puerto Rico", "ocean beach", "desert sand", "city buildings"],
        voiceGuidance: "El coquí es muy especial de Puerto Rico. ¿Sabes dónde vive? Piensa bien antes de responder.",
        contentBuilder: (images) => ({
          question: "¿Dónde vive el coquí?",
          questionImage: images[0],
          answers: [
            { text: "En el bosque de El Yunque", imageUrl: images[0], isCorrect: true },
            { text: "En el mar", imageUrl: images[1], isCorrect: false },
            { text: "En el desierto", imageUrl: images[2], isCorrect: false },
            { text: "En la ciudad", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI: Forma COQUÍ",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las letras para formar COQUÍ",
        imageSearchTerms: ["coqui frog close up"],
        voiceGuidance: "Vamos a formar el nombre de nuestro amigo. Arrastra las letras para escribir 'coquí'.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Forma el nombre de nuestro amiguito",
          questionImage: images[0],
          targetWord: "coquí",
          availableLetters: ["c", "o", "q", "u", "í", "a", "e", "s", "l"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Hogar del coquí",
        type: "exercise",
        subtype: "drag_drop",
        description: "Relaciona las imágenes con el hábitat del coquí",
        imageSearchTerms: ["tropical leaves", "Puerto Rico waterfall", "tree branch", "coqui frog"],
        voiceGuidance: "Arrastra las cosas que encuentras en el hogar del coquí al bosque tropical.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Arrastra al bosque tropical las cosas del hogar del coquí",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "image", content: images[0] || "", label: "hojas", correctZone: "bosque" },
            { id: "2", type: "image", content: images[1] || "", label: "cascada", correctZone: "bosque" },
            { id: "3", type: "image", content: images[2] || "", label: "árboles", correctZone: "bosque" },
            { id: "4", type: "image", content: images[3] || "", label: "coquí", correctZone: "bosque" },
          ],
          dropZones: [
            { id: "bosque", label: "Bosque Tropical" },
            { id: "otro", label: "Otro Lugar" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI: Completa RANA",
        type: "exercise",
        subtype: "fill_blank",
        description: "El coquí es un tipo de...",
        imageSearchTerms: ["green frog"],
        voiceGuidance: "El coquí es un tipo de animal. Usa las letras para formar su familia de animales.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "El coquí es un tipo de...",
          target: "rana",
          letters: ["r", "a", "n", "a", "m", "s", "o"],
          imageUrl: images[0],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: ¿Qué dice el coquí?",
        type: "exercise",
        subtype: "write_answer",
        description: "Escribe el sonido que hace el coquí",
        imageSearchTerms: ["coqui singing"],
        voiceGuidance: "El coquí canta en las noches de Puerto Rico. ¿Sabes qué dice? Escribe su canción.",
        contentBuilder: (images) => ({
          question: "¿Qué sonido hace el coquí cuando canta?",
          questionImage: images[0],
          correctAnswer: "coquí",
          caseSensitive: false,
        }),
      },
      {
        title: "AI: ¿Es símbolo de Puerto Rico?",
        type: "exercise",
        subtype: "true_false",
        description: "Verifica si el coquí representa a Puerto Rico",
        imageSearchTerms: ["Puerto Rico flag"],
        voiceGuidance: "El coquí es muy importante para Puerto Rico. ¿Será nuestro símbolo?",
        contentBuilder: (images) => ({
          question: "El coquí es un símbolo de Puerto Rico",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
    // Lesson 4: Comida Boricua
    [
      {
        title: "AI: ¿Cuál es comida boricua?",
        type: "exercise",
        subtype: "multiple_choice",
        description: "Identifica la comida típica de Puerto Rico",
        imageSearchTerms: ["tostones plantain", "pizza food", "sushi japanese", "tacos mexican"],
        voiceGuidance: "Vamos a aprender sobre nuestra deliciosa comida. ¿Cuál de estas es de Puerto Rico?",
        contentBuilder: (images) => ({
          question: "¿Cuál de estas comidas es típica de Puerto Rico?",
          questionImage: images[0],
          answers: [
            { text: "tostones", imageUrl: images[0], isCorrect: true },
            { text: "pizza", imageUrl: images[1], isCorrect: false },
            { text: "sushi", imageUrl: images[2], isCorrect: false },
            { text: "tacos", imageUrl: images[3], isCorrect: false },
          ],
        }),
      },
      {
        title: "AI: Forma ARROZ",
        type: "exercise",
        subtype: "drag_drop",
        description: "Arrastra las letras para formar ARROZ",
        imageSearchTerms: ["white rice bowl"],
        voiceGuidance: "El arroz es muy importante en nuestra comida. Forma la palabra con las letras.",
        contentBuilder: (images) => ({
          mode: "letters",
          question: "Forma el nombre de este alimento básico",
          questionImage: images[0],
          targetWord: "arroz",
          availableLetters: ["a", "r", "r", "o", "z", "s", "m", "l", "e"],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: Comidas de PR",
        type: "exercise",
        subtype: "drag_drop",
        description: "Clasifica comidas puertorriqueñas",
        imageSearchTerms: ["mofongo Puerto Rico", "rice and beans", "roasted pork", "hamburger"],
        voiceGuidance: "Mira las comidas. Arrastra las que son de Puerto Rico a la zona correcta.",
        contentBuilder: (images) => ({
          mode: "match",
          question: "Arrastra las comidas típicas de Puerto Rico",
          questionImage: null,
          draggableItems: [
            { id: "1", type: "image", content: images[0] || "", label: "mofongo", correctZone: "boricua" },
            { id: "2", type: "image", content: images[1] || "", label: "arroz con habichuelas", correctZone: "boricua" },
            { id: "3", type: "image", content: images[2] || "", label: "pernil", correctZone: "boricua" },
            { id: "4", type: "image", content: images[3] || "", label: "hamburguesa", correctZone: "otra" },
          ],
          dropZones: [
            { id: "boricua", label: "Comida Boricua" },
            { id: "otra", label: "Otra Comida" },
          ],
          allowMultiplePerZone: true,
        }),
      },
      {
        title: "AI: Completa PLÁTANO",
        type: "exercise",
        subtype: "fill_blank",
        description: "Forma la palabra del ingrediente de los tostones",
        imageSearchTerms: ["green plantain"],
        voiceGuidance: "Los tostones se hacen con esta fruta verde. ¿Sabes cuál es? Forma su nombre.",
        contentBuilder: (images) => ({
          mode: "single_word",
          prompt: "¿Con qué se hacen los tostones?",
          target: "plátano",
          letters: ["p", "l", "á", "t", "a", "n", "o", "s", "m", "e"],
          imageUrl: images[0],
          autoShuffle: true,
        }),
      },
      {
        title: "AI: ¿Qué comemos con arroz?",
        type: "exercise",
        subtype: "write_answer",
        description: "Completa el plato típico",
        imageSearchTerms: ["beans legumes"],
        voiceGuidance: "En Puerto Rico, casi siempre comemos arroz con... ¿Sabes qué? Escribe la respuesta.",
        contentBuilder: (images) => ({
          question: "En Puerto Rico comemos arroz con...",
          questionImage: images[0],
          correctAnswer: "habichuelas",
          caseSensitive: false,
        }),
      },
      {
        title: "AI: ¿El mofongo es boricua?",
        type: "exercise",
        subtype: "true_false",
        description: "Verifica si el mofongo es de Puerto Rico",
        imageSearchTerms: ["mofongo Puerto Rican food"],
        voiceGuidance: "El mofongo es un plato muy especial. ¿Será de Puerto Rico?",
        contentBuilder: (images) => ({
          question: "El mofongo es un plato típico de Puerto Rico",
          questionImage: images[0],
          answers: [
            { text: "Verdadero", imageUrl: null, isCorrect: true },
            { text: "Falso", imageUrl: null, isCorrect: false },
          ],
        }),
      },
    ],
  ];

  // Process each parent lesson and its exercises
  const allExercises = [];
  const allOrderingRecords = [];

  for (let parentIndex = 0; parentIndex < insertedParents.length; parentIndex++) {
    const parent = insertedParents[parentIndex];
    const exercises = lessonExercises[parentIndex];

    console.log(`\n📝 Processing exercises for: ${parent.title}`);

    for (let exerciseIndex = 0; exerciseIndex < exercises.length; exerciseIndex++) {
      const template = exercises[exerciseIndex];
      
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
        grade_level: 1,
        language: "es" as const,
        subject_area: "reading" as const,
        status: "published" as const,
        content,
        enable_voice: true,
        auto_read_question: true,
        voice_speed: 1.0,
        passing_score: 70,
        max_attempts: 3,
        difficulty_level: 1,
        estimated_duration_minutes: 3,
        curriculum_standards: ["DEPR Grade 1 Spanish Literacy"],
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
    .order("display_order", { ascending: false })
    .limit(1);

  let nextDisplayOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

  // Create lesson ordering records
  console.log("\n📊 Creating lesson ordering...");
  
  // Add parents
  for (const parent of insertedParents) {
    allOrderingRecords.push({
      assessment_id: parent.id,
      grade_level: 1,
      display_order: nextDisplayOrder++,
      parent_lesson_id: null,
    });
  }

  // Add exercises
  for (const exercise of insertedExercises) {
    allOrderingRecords.push({
      assessment_id: exercise.id,
      grade_level: 1,
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

  console.log("\n🎉 Content generation complete!");
  console.log(`📚 Total parent lessons: ${insertedParents.length}`);
  console.log(`📝 Total exercises: ${insertedExercises.length}`);
  console.log(`📊 Total ordering records: ${allOrderingRecords.length}`);

  return {
    parents: insertedParents,
    exercises: insertedExercises,
    orderingRecords: allOrderingRecords,
  };
}
