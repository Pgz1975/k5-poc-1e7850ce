export interface Achievement {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  category: "streak" | "skill" | "cultural" | "level" | "special";
  earned: boolean;
  earnedAt?: string; // ISO date if earned
  progress?: number; // 0-100 if not earned yet
  requirement: string;
  requirementEs: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const mockAchievements: Achievement[] = [
  // Earned achievements
  {
    id: "badge-1",
    name: "7-Day Streak",
    nameEs: "Racha de 7 Días",
    description: "Practiced 7 days in a row",
    descriptionEs: "Practicaste 7 días seguidos",
    icon: "🔥",
    category: "streak",
    earned: true,
    earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: "Practice for 7 consecutive days",
    requirementEs: "Practica por 7 días consecutivos",
    rarity: "rare",
  },
  {
    id: "badge-2",
    name: "El Yunque Explorer",
    nameEs: "Explorador del Yunque",
    description: "Completed El Yunque themed lessons",
    descriptionEs: "Completaste lecciones sobre El Yunque",
    icon: "🌴",
    category: "cultural",
    earned: true,
    earnedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    requirement: "Complete 3 El Yunque lessons",
    requirementEs: "Completa 3 lecciones sobre El Yunque",
    rarity: "epic",
  },
  {
    id: "badge-3",
    name: "Coquí Master",
    nameEs: "Maestro del Coquí",
    description: "Mastered coquí-related vocabulary",
    descriptionEs: "Dominaste vocabulario sobre el coquí",
    icon: "🐸",
    category: "cultural",
    earned: true,
    earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: "Learn all coquí vocabulary words",
    requirementEs: "Aprende todas las palabras sobre el coquí",
    rarity: "legendary",
  },
  {
    id: "badge-4",
    name: "Comprehension Champion",
    nameEs: "Campeón de Comprensión",
    description: "Scored 90+ on 10 comprehension activities",
    descriptionEs: "Obtuviste 90+ en 10 actividades de comprensión",
    icon: "🧠",
    category: "skill",
    earned: true,
    earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: "Score 90+ on 10 comprehension activities",
    requirementEs: "Obtén 90+ en 10 actividades de comprensión",
    rarity: "epic",
  },
  {
    id: "badge-5",
    name: "Level 10 Achieved",
    nameEs: "Nivel 10 Alcanzado",
    description: "Reached reading level 10",
    descriptionEs: "Alcanzaste el nivel de lectura 10",
    icon: "🏆",
    category: "level",
    earned: true,
    earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    requirement: "Reach level 10",
    requirementEs: "Alcanza el nivel 10",
    rarity: "rare",
  },

  // Locked achievements (in progress)
  {
    id: "badge-6",
    name: "30-Day Streak",
    nameEs: "Racha de 30 Días",
    description: "Practice for 30 consecutive days",
    descriptionEs: "Practica por 30 días consecutivos",
    icon: "🔥",
    category: "streak",
    earned: false,
    progress: 23, // 7/30 days
    requirement: "Practice for 30 consecutive days",
    requirementEs: "Practica por 30 días consecutivos",
    rarity: "legendary",
  },
  {
    id: "badge-7",
    name: "Pronunciation Pro",
    nameEs: "Profesional de Pronunciación",
    description: "Score 95+ on 15 pronunciation activities",
    descriptionEs: "Obtén 95+ en 15 actividades de pronunciación",
    icon: "🎤",
    category: "skill",
    earned: false,
    progress: 60, // 9/15 activities
    requirement: "Score 95+ on 15 pronunciation activities",
    requirementEs: "Obtén 95+ en 15 actividades de pronunciación",
    rarity: "epic",
  },
  {
    id: "badge-8",
    name: "Puerto Rico Expert",
    nameEs: "Experto en Puerto Rico",
    description: "Complete all cultural lessons",
    descriptionEs: "Completa todas las lecciones culturales",
    icon: "🏝️",
    category: "cultural",
    earned: false,
    progress: 45, // 9/20 lessons
    requirement: "Complete 20 cultural lessons",
    requirementEs: "Completa 20 lecciones culturales",
    rarity: "legendary",
  },
  {
    id: "badge-9",
    name: "Vocabulary Virtuoso",
    nameEs: "Virtuoso del Vocabulario",
    description: "Learn 200 new vocabulary words",
    descriptionEs: "Aprende 200 palabras nuevas de vocabulario",
    icon: "📚",
    category: "skill",
    earned: false,
    progress: 78, // 156/200 words
    requirement: "Learn 200 vocabulary words",
    requirementEs: "Aprende 200 palabras de vocabulario",
    rarity: "epic",
  },
  {
    id: "badge-10",
    name: "Speed Reader",
    nameEs: "Lector Veloz",
    description: "Complete 20 fluency exercises",
    descriptionEs: "Completa 20 ejercicios de fluidez",
    icon: "⚡",
    category: "skill",
    earned: false,
    progress: 90, // 18/20 exercises
    requirement: "Complete 20 fluency exercises",
    requirementEs: "Completa 20 ejercicios de fluidez",
    rarity: "rare",
  },
  {
    id: "badge-11",
    name: "Plena Performer",
    nameEs: "Intérprete de Plena",
    description: "Complete plena music and culture lessons",
    descriptionEs: "Completa lecciones sobre música y cultura de plena",
    icon: "🎵",
    category: "cultural",
    earned: false,
    progress: 33, // 1/3 lessons
    requirement: "Complete 3 plena lessons",
    requirementEs: "Completa 3 lecciones sobre plena",
    rarity: "epic",
  },
  {
    id: "badge-12",
    name: "Perfect Score",
    nameEs: "Puntuación Perfecta",
    description: "Score 100% on any assessment",
    descriptionEs: "Obtén 100% en cualquier evaluación",
    icon: "💯",
    category: "special",
    earned: false,
    progress: 0,
    requirement: "Score 100% on an assessment",
    requirementEs: "Obtén 100% en una evaluación",
    rarity: "legendary",
  },
];
