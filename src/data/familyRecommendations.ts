export const aiRecommendations = [
  {
    id: "pronunciation-r",
    priority: "high",
    titleEs: "Practicar Pronunciación - Letra 'R'",
    titleEn: "Practice Pronunciation - Letter 'R'",
    descriptionEs: "María necesita práctica adicional con palabras que contienen la letra 'r'.",
    descriptionEn: "María needs additional practice with words containing the letter 'r'.",
    icon: "🗣️",
    specificWords: ["perro", "ratón", "carrera", "rosa", "regalo"],
    activitySuggestion: {
      es: "Juego de 'Repite después de mí' - 5 min/día",
      en: "Repeat after me game - 5 min/day",
    },
    estimatedTime: 5,
    difficulty: "medium",
    videoTutorial: "https://example.com/pronunciation-r",
    completed: false,
  },
  {
    id: "read-aloud",
    priority: "daily",
    titleEs: "Lectura en Voz Alta",
    titleEn: "Read Aloud",
    descriptionEs: "Lean juntos 15 minutos diarios para mejorar la fluidez.",
    descriptionEn: "Read together for 15 minutes daily to improve fluency.",
    icon: "📖",
    tips: {
      es: "Deja que María lea una página, tú lees la siguiente",
      en: "Let María read one page, you read the next",
    },
    bestTime: "After dinner (based on usage patterns)",
    estimatedTime: 15,
    difficulty: "easy",
    completed: false,
  },
  {
    id: "word-of-day",
    priority: "medium",
    titleEs: "Vocabulario del Día",
    titleEn: "Word of the Day",
    descriptionEs: "Introduce una palabra nueva cada día durante las comidas.",
    descriptionEn: "Introduce a new word each day during meals.",
    icon: "💡",
    todayWord: {
      word: "flamboyán",
      definition: {
        es: "Árbol tropical con flores rojas brillantes, símbolo de Puerto Rico",
        en: "Tropical tree with bright red flowers, symbol of Puerto Rico",
      },
      exampleSentence: {
        es: "El flamboyán en el patio de la escuela está floreciendo.",
        en: "The flamboyán in the school yard is blooming.",
      },
      image: "/assets/flamboyan.jpg",
    },
    estimatedTime: 5,
    difficulty: "easy",
    completed: false,
  },
  {
    id: "cultural-connection",
    priority: "medium",
    titleEs: "Conexión Cultural - El Yunque",
    titleEn: "Cultural Connection - El Yunque",
    descriptionEs: "Explora historias del Yunque juntos para conectar con la cultura puertorriqueña.",
    descriptionEn: "Explore El Yunque stories together to connect with Puerto Rican culture.",
    icon: "🌿",
    suggestions: [
      {
        es: "Visita la biblioteca local para libros de historia de PR",
        en: "Visit local library for PR history books",
      },
      {
        es: "Mira: Video sobre coquíes del Yunque",
        en: "Watch: Video about El Yunque coquí frogs",
      },
    ],
    estimatedTime: 20,
    difficulty: "easy",
    completed: false,
  },
];

export const weeklyChallenge = {
  titleEs: "Crea una Historia con Nuevas Palabras",
  titleEn: "Create a Story with New Words",
  descriptionEs: "Juntos, inventen una historia usando 5 palabras de vocabulario nuevas.",
  descriptionEn: "Together, create a story using 5 new vocabulary words.",
  words: ["flamboyán", "coquí", "piragua", "aventura", "familia"],
  reward: {
    es: "Medalla de Creatividad 🏅",
    en: "Creativity Medal 🏅",
  },
  dueDate: "2025-01-22",
  completed: false,
};

export const aiInsight = {
  messageEs: "Basado en el progreso de María, el mentor AI sugiere enfocarse en pronunciación esta semana. ¡Su comprensión es excelente!",
  messageEn: "Based on María's progress, the AI mentor suggests focusing on pronunciation this week. Her comprehension is excellent!",
  strengths: ["Comprehension", "Vocabulary"],
  areasToFocus: ["Pronunciation"],
  trend: "positive",
};
