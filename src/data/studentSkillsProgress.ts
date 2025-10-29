export interface SkillProgress {
  id: string;
  name: string;
  nameEs: string;
  currentScore: number; // 0-100
  previousScore: number; // For trend calculation
  gradeExpectation: number; // What's expected at this grade level
  icon: string;
  color: string; // HSL color
  trend: "up" | "down" | "stable";
  lastPracticed: string; // ISO date string
  practiceCount: number; // Number of activities completed for this skill
}

export const mockSkillsProgress: SkillProgress[] = [
  {
    id: "comprehension",
    name: "Comprehension",
    nameEs: "Comprensión",
    currentScore: 85,
    previousScore: 78,
    gradeExpectation: 75,
    icon: "🧠",
    color: "hsl(200, 100%, 65%)",
    trend: "up",
    lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    practiceCount: 24,
  },
  {
    id: "fluency",
    name: "Fluency",
    nameEs: "Fluidez",
    currentScore: 72,
    previousScore: 75,
    gradeExpectation: 70,
    icon: "⚡",
    color: "hsl(280, 100%, 65%)",
    trend: "down",
    lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    practiceCount: 18,
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    nameEs: "Vocabulario",
    currentScore: 91,
    previousScore: 89,
    gradeExpectation: 80,
    icon: "📚",
    color: "hsl(125, 100%, 65%)",
    trend: "up",
    lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    practiceCount: 32,
  },
  {
    id: "pronunciation",
    name: "Pronunciation",
    nameEs: "Pronunciación",
    currentScore: 68,
    previousScore: 68,
    gradeExpectation: 75,
    icon: "🎤",
    color: "hsl(27, 100%, 65%)",
    trend: "stable",
    lastPracticed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    practiceCount: 15,
  },
  {
    id: "cultural",
    name: "Cultural Vocabulary",
    nameEs: "Vocabulario Cultural",
    currentScore: 88,
    previousScore: 82,
    gradeExpectation: 70,
    icon: "🏝️",
    color: "hsl(176, 84%, 65%)",
    trend: "up",
    lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    practiceCount: 21,
  },
];
