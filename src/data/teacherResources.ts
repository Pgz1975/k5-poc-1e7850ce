export interface TeacherResource {
  id: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  grade: number;
  skill: "comprehension" | "fluency" | "vocabulary" | "pronunciation";
  language: "spanish" | "english" | "bilingual";
  culturallyRelevant: boolean;
  type: "activity" | "text" | "guide";
  duration: string;
  difficulty: "low" | "medium" | "high";
}

export const mockTeacherResources: TeacherResource[] = [
  {
    id: 1,
    titleEs: "El Coquí y la Luna",
    titleEn: "The Coquí and the Moon",
    descriptionEs: "Actividad interactiva sobre el coquí y su importancia en la cultura puertorriqueña",
    descriptionEn: "Interactive activity about the coquí and its importance in Puerto Rican culture",
    grade: 3,
    skill: "comprehension",
    language: "spanish",
    culturallyRelevant: true,
    type: "activity",
    duration: "25 min",
    difficulty: "medium",
  },
  {
    id: 2,
    titleEs: "Aventura en el Viejo San Juan",
    titleEn: "Old San Juan Adventure",
    descriptionEs: "Lectura guiada sobre la historia de San Juan con comprensión de lectura",
    descriptionEn: "Guided reading about San Juan's history with reading comprehension",
    grade: 3,
    skill: "comprehension",
    language: "bilingual",
    culturallyRelevant: true,
    type: "text",
    duration: "30 min",
    difficulty: "medium",
  },
  {
    id: 3,
    titleEs: "Práctica de Fluidez: Trabalenguas",
    titleEn: "Fluency Practice: Tongue Twisters",
    descriptionEs: "Ejercicios de pronunciación y fluidez con trabalenguas en español",
    descriptionEn: "Pronunciation and fluency exercises with Spanish tongue twisters",
    grade: 3,
    skill: "fluency",
    language: "spanish",
    culturallyRelevant: false,
    type: "activity",
    duration: "15 min",
    difficulty: "high",
  },
  {
    id: 4,
    titleEs: "Vocabulario de la Playa",
    titleEn: "Beach Vocabulary",
    descriptionEs: "Expansión de vocabulario relacionado con el ambiente costero",
    descriptionEn: "Vocabulary expansion related to coastal environments",
    grade: 3,
    skill: "vocabulary",
    language: "bilingual",
    culturallyRelevant: true,
    type: "activity",
    duration: "20 min",
    difficulty: "low",
  },
  {
    id: 5,
    titleEs: "Sonidos del Español",
    titleEn: "Sounds of Spanish",
    descriptionEs: "Guía de pronunciación para sonidos difíciles del español",
    descriptionEn: "Pronunciation guide for difficult Spanish sounds",
    grade: 3,
    skill: "pronunciation",
    language: "spanish",
    culturallyRelevant: false,
    type: "guide",
    duration: "10 min",
    difficulty: "medium",
  },
  {
    id: 6,
    titleEs: "El Huracán: Lectura Científica",
    titleEn: "The Hurricane: Scientific Reading",
    descriptionEs: "Texto informativo sobre huracanes con vocabulario científico",
    descriptionEn: "Informational text about hurricanes with scientific vocabulary",
    grade: 3,
    skill: "comprehension",
    language: "spanish",
    culturallyRelevant: true,
    type: "text",
    duration: "35 min",
    difficulty: "high",
  },
  {
    id: 7,
    titleEs: "Reading Fluency Builder",
    titleEn: "Reading Fluency Builder",
    descriptionEs: "Ejercicios progresivos para mejorar velocidad de lectura en inglés",
    descriptionEn: "Progressive exercises to improve English reading speed",
    grade: 3,
    skill: "fluency",
    language: "english",
    culturallyRelevant: false,
    type: "activity",
    duration: "20 min",
    difficulty: "medium",
  },
  {
    id: 8,
    titleEs: "Palabras de la Cocina Criolla",
    titleEn: "Criolla Cuisine Words",
    descriptionEs: "Vocabulario culinario puertorriqueño con contexto cultural",
    descriptionEn: "Puerto Rican culinary vocabulary with cultural context",
    grade: 3,
    skill: "vocabulary",
    language: "spanish",
    culturallyRelevant: true,
    type: "activity",
    duration: "25 min",
    difficulty: "low",
  },
];

export const mockTextRecommendations = [
  {
    id: 1,
    titleEs: "La Leyenda del Cemí",
    titleEn: "The Legend of the Cemí",
    level: 3,
    reason: "alignedWithCurriculum",
    culturalRelevance: true,
  },
  {
    id: 2,
    titleEs: "Los Animales del Bosque",
    titleEn: "Forest Animals",
    level: 2.8,
    reason: "matchesClassAverage",
    culturalRelevance: false,
  },
  {
    id: 3,
    titleEs: "Historia de Puerto Rico para Niños",
    titleEn: "Puerto Rico History for Kids",
    level: 3,
    reason: "studentInterest",
    culturalRelevance: true,
  },
];

export const mockInterventionGuides = [
  {
    id: 1,
    skill: "comprehension",
    titleEs: "Estrategias de Comprensión",
    titleEn: "Comprehension Strategies",
    steps: [
      {
        es: "Antes de leer: Activar conocimiento previo y hacer predicciones",
        en: "Before reading: Activate prior knowledge and make predictions",
      },
      {
        es: "Durante la lectura: Hacer pausas para verificar comprensión",
        en: "During reading: Pause to check comprehension",
      },
      {
        es: "Después de leer: Resumir ideas principales y detalles importantes",
        en: "After reading: Summarize main ideas and important details",
      },
      {
        es: "Usar organizadores gráficos para visualizar la información",
        en: "Use graphic organizers to visualize information",
      },
    ],
  },
  {
    id: 2,
    skill: "fluency",
    titleEs: "Mejora de Fluidez",
    titleEn: "Fluency Improvement",
    steps: [
      {
        es: "Lectura repetida: Practicar el mismo texto 3-5 veces",
        en: "Repeated reading: Practice the same text 3-5 times",
      },
      {
        es: "Modelado: Leer en voz alta con expresión y ritmo apropiado",
        en: "Modeling: Read aloud with appropriate expression and pace",
      },
      {
        es: "Lectura coral: Leer en grupo para desarrollar confianza",
        en: "Choral reading: Read in groups to build confidence",
      },
      {
        es: "Usar grabaciones para que el estudiante se escuche",
        en: "Use recordings for students to hear themselves",
      },
    ],
  },
  {
    id: 3,
    skill: "vocabulary",
    titleEs: "Expansión de Vocabulario",
    titleEn: "Vocabulary Expansion",
    steps: [
      {
        es: "Enseñar palabras en contexto, no aisladas",
        en: "Teach words in context, not in isolation",
      },
      {
        es: "Crear mapas de palabras con sinónimos y antónimos",
        en: "Create word maps with synonyms and antonyms",
      },
      {
        es: "Practicar uso activo en conversaciones y escritura",
        en: "Practice active use in conversations and writing",
      },
      {
        es: "Conectar palabras nuevas con experiencias personales",
        en: "Connect new words with personal experiences",
      },
    ],
  },
  {
    id: 4,
    skill: "pronunciation",
    titleEs: "Mejora de Pronunciación",
    titleEn: "Pronunciation Improvement",
    steps: [
      {
        es: "Identificar sonidos específicos que causan dificultad",
        en: "Identify specific sounds causing difficulty",
      },
      {
        es: "Practicar palabras con esos sonidos de forma aislada",
        en: "Practice words with those sounds in isolation",
      },
      {
        es: "Usar espejos para observar posición de boca y lengua",
        en: "Use mirrors to observe mouth and tongue position",
      },
      {
        es: "Grabar y comparar con modelos de pronunciación correcta",
        en: "Record and compare with correct pronunciation models",
      },
    ],
  },
];
