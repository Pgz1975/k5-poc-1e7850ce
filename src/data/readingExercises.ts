export interface ReadingExercise {
  id: string;
  level: number;
  levelName: string;
  textEs: string;
  textEn: string;
  imagePath: string;
  comprehensionQuestions: {
    es: { question: string; options: string[]; correctIndex: number }[];
    en: { question: string; options: string[]; correctIndex: number }[];
  };
}

export const readingExercises: ReadingExercise[] = [
  {
    id: "kindergarten-1",
    level: 1,
    levelName: "Kindergarten",
    textEs: "El sapo verde salta alto",
    textEn: "The green frog jumps high",
    imagePath: "/exercises/frog-rainforest.jpg",
    comprehensionQuestions: {
      es: [
        {
          question: "¿De qué color es el sapo?",
          options: ["Azul", "Verde", "Rojo"],
          correctIndex: 1
        },
        {
          question: "¿Qué hace el sapo?",
          options: ["Nada", "Salta", "Corre"],
          correctIndex: 1
        },
        {
          question: "¿Cómo salta el sapo?",
          options: ["Bajo", "Alto", "Rápido"],
          correctIndex: 1
        }
      ],
      en: [
        {
          question: "What color is the frog?",
          options: ["Blue", "Green", "Red"],
          correctIndex: 1
        },
        {
          question: "What does the frog do?",
          options: ["Swims", "Jumps", "Runs"],
          correctIndex: 1
        },
        {
          question: "How does the frog jump?",
          options: ["Low", "High", "Fast"],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: "grade1-1",
    level: 2,
    levelName: "Grade 1",
    textEs: "María va a la playa. Ella construye un castillo de arena grande.",
    textEn: "Maria goes to the beach. She builds a big sand castle.",
    imagePath: "/exercises/family-beach.jpg",
    comprehensionQuestions: {
      es: [
        {
          question: "¿A dónde va María?",
          options: ["Al parque", "A la playa", "A la escuela"],
          correctIndex: 1
        },
        {
          question: "¿Qué construye María?",
          options: ["Una casa", "Un castillo de arena", "Un barco"],
          correctIndex: 1
        },
        {
          question: "¿Cómo es el castillo?",
          options: ["Pequeño", "Mediano", "Grande"],
          correctIndex: 2
        }
      ],
      en: [
        {
          question: "Where does Maria go?",
          options: ["To the park", "To the beach", "To school"],
          correctIndex: 1
        },
        {
          question: "What does Maria build?",
          options: ["A house", "A sand castle", "A boat"],
          correctIndex: 1
        },
        {
          question: "How is the castle?",
          options: ["Small", "Medium", "Big"],
          correctIndex: 2
        }
      ]
    }
  },
  {
    id: "grade2-1",
    level: 3,
    levelName: "Grade 2-3",
    textEs: "El coquí vive en El Yunque, el bosque tropical de Puerto Rico. Cada noche canta su melodía especial. Su canto suena como 'co-quí, co-quí'. Los coquís son muy pequeños pero tienen voces grandes.",
    textEn: "The coquí lives in El Yunque, Puerto Rico's rainforest. Every night it sings its special melody. Its song sounds like 'co-kee, co-kee'. Coquís are very small but have big voices.",
    imagePath: "/exercises/rainforest-waterfall.jpg",
    comprehensionQuestions: {
      es: [
        {
          question: "¿Dónde vive el coquí?",
          options: ["En la ciudad", "En El Yunque", "En la playa"],
          correctIndex: 1
        },
        {
          question: "¿Cuándo canta el coquí?",
          options: ["En la mañana", "En la tarde", "En la noche"],
          correctIndex: 2
        },
        {
          question: "¿Cómo son los coquís?",
          options: ["Grandes y callados", "Pequeños con voces grandes", "Medianos"],
          correctIndex: 1
        }
      ],
      en: [
        {
          question: "Where does the coquí live?",
          options: ["In the city", "In El Yunque", "At the beach"],
          correctIndex: 1
        },
        {
          question: "When does the coquí sing?",
          options: ["In the morning", "In the afternoon", "At night"],
          correctIndex: 2
        },
        {
          question: "What are coquís like?",
          options: ["Big and quiet", "Small with big voices", "Medium sized"],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: "grade4-1",
    level: 4,
    levelName: "Grade 4",
    textEs: "La tortuga marina nadaba lentamente por el océano azul. De repente, vio algo brillante en el agua. '¿Qué será?' pensó curiosa. Se acercó con cuidado y descubrió que era un pez de colores hermosos. 'Hola amiga', dijo el pez. 'Ven, te mostraré mi arrecife de coral favorito.'",
    textEn: "The sea turtle swam slowly through the blue ocean. Suddenly, she saw something shiny in the water. 'What could it be?' she thought curiously. She approached carefully and discovered it was a beautifully colored fish. 'Hello friend', said the fish. 'Come, I'll show you my favorite coral reef.'",
    imagePath: "/exercises/turtle-ocean.jpg",
    comprehensionQuestions: {
      es: [
        {
          question: "¿Cómo nadaba la tortuga?",
          options: ["Rápidamente", "Lentamente", "No nadaba"],
          correctIndex: 1
        },
        {
          question: "¿Qué encontró la tortuga?",
          options: ["Una concha", "Un pez de colores", "Una estrella de mar"],
          correctIndex: 1
        },
        {
          question: "¿Cómo se sintió la tortuga?",
          options: ["Asustada", "Curiosa", "Triste"],
          correctIndex: 1
        }
      ],
      en: [
        {
          question: "How did the turtle swim?",
          options: ["Quickly", "Slowly", "Didn't swim"],
          correctIndex: 1
        },
        {
          question: "What did the turtle find?",
          options: ["A shell", "A colorful fish", "A starfish"],
          correctIndex: 1
        },
        {
          question: "How did the turtle feel?",
          options: ["Scared", "Curious", "Sad"],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: "grade5-1",
    level: 5,
    levelName: "Grade 5",
    textEs: "El ecosistema del bosque tropical de El Yunque es único en su tipo. Miles de especies de plantas y animales coexisten en perfecta armonía. El coquí, símbolo nacional de Puerto Rico, juega un papel importante en el ecosistema al controlar las poblaciones de insectos. Los árboles centenarios alcanzan alturas impresionantes, creando un dosel que protege la biodiversidad del suelo del bosque. Las lluvias frecuentes mantienen todo verde y lleno de vida.",
    textEn: "The ecosystem of El Yunque rainforest is unique in its kind. Thousands of species of plants and animals coexist in perfect harmony. The coquí, Puerto Rico's national symbol, plays an important role in the ecosystem by controlling insect populations. Century-old trees reach impressive heights, creating a canopy that protects the forest floor's biodiversity. Frequent rains keep everything green and full of life.",
    imagePath: "/exercises/rainforest-waterfall.jpg",
    comprehensionQuestions: {
      es: [
        {
          question: "¿Qué hace el coquí en el ecosistema?",
          options: ["Canta canciones", "Controla insectos", "Planta árboles"],
          correctIndex: 1
        },
        {
          question: "¿Qué crean los árboles centenarios?",
          options: ["Un río", "Un dosel protector", "Una montaña"],
          correctIndex: 1
        },
        {
          question: "¿Por qué el ecosistema es único?",
          options: ["Por las lluvias", "Por la coexistencia armoniosa", "Por el tamaño"],
          correctIndex: 1
        }
      ],
      en: [
        {
          question: "What does the coquí do in the ecosystem?",
          options: ["Sings songs", "Controls insects", "Plants trees"],
          correctIndex: 1
        },
        {
          question: "What do century-old trees create?",
          options: ["A river", "A protective canopy", "A mountain"],
          correctIndex: 1
        },
        {
          question: "Why is the ecosystem unique?",
          options: ["Because of rain", "Because of harmonious coexistence", "Because of size"],
          correctIndex: 1
        }
      ]
    }
  }
];
