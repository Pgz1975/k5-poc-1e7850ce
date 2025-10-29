export interface AIRecommendation {
  id: string;
  type: "exercise" | "lesson" | "assessment" | "practice";
  title: string;
  titleEs: string;
  reason: string;
  reasonEs: string;
  skillTarget: string;
  skillTargetEs: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number; // minutes
  culturalContent?: boolean;
  route: string;
  priority: "high" | "medium" | "low";
  icon: string;
}

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    type: "practice",
    title: "Pronunciation Practice: Puerto Rican Words",
    titleEs: "Práctica de Pronunciación: Palabras Puertorriqueñas",
    reason: "Your pronunciation score is below grade level. Let's practice with familiar cultural words!",
    reasonEs: "Tu puntuación de pronunciación está por debajo del nivel de grado. ¡Practiquemos con palabras culturales familiares!",
    skillTarget: "Pronunciation",
    skillTargetEs: "Pronunciación",
    difficulty: "medium",
    estimatedTime: 10,
    culturalContent: true,
    route: "/student-dashboard/exercises",
    priority: "high",
    icon: "🎤",
  },
  {
    id: "rec-2",
    type: "lesson",
    title: "El Yunque Rainforest Adventure",
    titleEs: "Aventura en El Yunque",
    reason: "Great job on vocabulary! This story will challenge your comprehension skills.",
    reasonEs: "¡Excelente trabajo en vocabulario! Esta historia desafiará tus habilidades de comprensión.",
    skillTarget: "Comprehension",
    skillTargetEs: "Comprensión",
    difficulty: "medium",
    estimatedTime: 15,
    culturalContent: true,
    route: "/student-dashboard/lessons",
    priority: "medium",
    icon: "🌴",
  },
  {
    id: "rec-3",
    type: "exercise",
    title: "Speed Reading Challenge",
    titleEs: "Desafío de Lectura Rápida",
    reason: "Boost your fluency by practicing timed reading with feedback.",
    reasonEs: "Mejora tu fluidez practicando lectura cronometrada con retroalimentación.",
    skillTarget: "Fluency",
    skillTargetEs: "Fluidez",
    difficulty: "hard",
    estimatedTime: 8,
    culturalContent: false,
    route: "/student-dashboard/exercises",
    priority: "high",
    icon: "⚡",
  },
  {
    id: "rec-4",
    type: "lesson",
    title: "Coquí's Night Song",
    titleEs: "El Canto Nocturno del Coquí",
    reason: "Perfect for reviewing cultural vocabulary you've mastered!",
    reasonEs: "¡Perfecto para revisar el vocabulario cultural que has dominado!",
    skillTarget: "Cultural Vocabulary",
    skillTargetEs: "Vocabulario Cultural",
    difficulty: "easy",
    estimatedTime: 12,
    culturalContent: true,
    route: "/student-dashboard/lessons",
    priority: "low",
    icon: "🐸",
  },
];
