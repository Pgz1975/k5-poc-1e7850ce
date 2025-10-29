export interface ActivityHistoryItem {
  id: string;
  title: string;
  titleEs: string;
  type: "lesson" | "exercise" | "assessment";
  completedAt: string; // ISO date
  score: number; // 0-100
  timeSpent: number; // minutes
  skillsPracticed: string[];
  skillsPracticedEs: string[];
  culturalContent: boolean;
  badge?: string; // Optional badge earned
  badgeEs?: string;
}

export const mockActivitiesHistory: ActivityHistoryItem[] = [
  {
    id: "act-1",
    title: "El Yunque Rainforest Reading",
    titleEs: "Lectura sobre El Yunque",
    type: "lesson",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    score: 92,
    timeSpent: 18,
    skillsPracticed: ["Comprehension", "Cultural Vocabulary"],
    skillsPracticedEs: ["Comprensión", "Vocabulario Cultural"],
    culturalContent: true,
    badge: "El Yunque Explorer",
    badgeEs: "Explorador del Yunque",
  },
  {
    id: "act-2",
    title: "Pronunciation Practice: Puerto Rican Words",
    titleEs: "Práctica de Pronunciación: Palabras Puertorriqueñas",
    type: "exercise",
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    score: 85,
    timeSpent: 12,
    skillsPracticed: ["Pronunciation", "Cultural Vocabulary"],
    skillsPracticedEs: ["Pronunciación", "Vocabulario Cultural"],
    culturalContent: true,
  },
  {
    id: "act-3",
    title: "Comprehension Assessment: Grade 3",
    titleEs: "Evaluación de Comprensión: 3er Grado",
    type: "assessment",
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    score: 88,
    timeSpent: 25,
    skillsPracticed: ["Comprehension", "Vocabulary"],
    skillsPracticedEs: ["Comprensión", "Vocabulario"],
    culturalContent: false,
  },
  {
    id: "act-4",
    title: "Coquí's Night Song",
    titleEs: "El Canto Nocturno del Coquí",
    type: "lesson",
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    score: 95,
    timeSpent: 15,
    skillsPracticed: ["Fluency", "Cultural Vocabulary"],
    skillsPracticedEs: ["Fluidez", "Vocabulario Cultural"],
    culturalContent: true,
    badge: "Coquí Master",
    badgeEs: "Maestro del Coquí",
  },
  {
    id: "act-5",
    title: "Speed Reading Challenge",
    titleEs: "Desafío de Lectura Rápida",
    type: "exercise",
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    score: 78,
    timeSpent: 10,
    skillsPracticed: ["Fluency"],
    skillsPracticedEs: ["Fluidez"],
    culturalContent: false,
  },
  {
    id: "act-6",
    title: "Three Kings Day Story",
    titleEs: "Historia del Día de Reyes",
    type: "lesson",
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    score: 91,
    timeSpent: 20,
    skillsPracticed: ["Comprehension", "Cultural Vocabulary", "Vocabulary"],
    skillsPracticedEs: ["Comprensión", "Vocabulario Cultural", "Vocabulario"],
    culturalContent: true,
  },
];
