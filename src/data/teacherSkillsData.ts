export interface SkillDetail {
  skillName: string;
  skillNameEn: string;
  averageScore: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  progressData: Array<{ month: string; score: number }>;
  insights: {
    es: string;
    en: string;
  };
  color: string;
}

export interface StudentSkillScore {
  studentName: string;
  comprehension: number;
  fluency: number;
  vocabulary: number;
  pronunciation: number;
  overall: number;
  riskLevel: "low" | "medium" | "high";
}

export const mockSkillsData: Record<string, SkillDetail> = {
  comprehension: {
    skillName: "Comprensión",
    skillNameEn: "Comprehension",
    averageScore: 88,
    trend: "up",
    trendPercentage: 5,
    progressData: [
      { month: "Ago", score: 82 },
      { month: "Sep", score: 85 },
      { month: "Oct", score: 86 },
      { month: "Nov", score: 88 }
    ],
    insights: {
      es: "La clase muestra mejora constante en identificación de ideas principales",
      en: "Class shows consistent improvement in main idea identification"
    },
    color: "hsl(329, 100%, 65%)"
  },
  fluency: {
    skillName: "Fluidez",
    skillNameEn: "Fluency",
    averageScore: 85,
    trend: "stable",
    trendPercentage: 0,
    progressData: [
      { month: "Ago", score: 84 },
      { month: "Sep", score: 85 },
      { month: "Oct", score: 86 },
      { month: "Nov", score: 85 }
    ],
    insights: {
      es: "Promedio de 95 palabras por minuto, estable en el último mes",
      en: "Average 95 words per minute, stable over the last month"
    },
    color: "hsl(190, 100%, 65%)"
  },
  vocabulary: {
    skillName: "Vocabulario",
    skillNameEn: "Vocabulary",
    averageScore: 90,
    trend: "up",
    trendPercentage: 8,
    progressData: [
      { month: "Ago", score: 82 },
      { month: "Sep", score: 86 },
      { month: "Oct", score: 88 },
      { month: "Nov", score: 90 }
    ],
    insights: {
      es: "145 nuevas palabras aprendidas este mes, retención del 92%",
      en: "145 new words learned this month, 92% retention rate"
    },
    color: "hsl(125, 100%, 55%)"
  },
  pronunciation: {
    skillName: "Pronunciación",
    skillNameEn: "Pronunciation",
    averageScore: 82,
    trend: "down",
    trendPercentage: -3,
    progressData: [
      { month: "Ago", score: 85 },
      { month: "Sep", score: 84 },
      { month: "Oct", score: 83 },
      { month: "Nov", score: 82 }
    ],
    insights: {
      es: "Errores comunes en sonidos 'r' y combinaciones consonánticas",
      en: "Common errors with 'r' sounds and consonant blends"
    },
    color: "hsl(11, 100%, 65%)"
  }
};

export const mockStudentSkillScores: StudentSkillScore[] = [
  {
    studentName: "María González",
    comprehension: 95,
    fluency: 92,
    vocabulary: 98,
    pronunciation: 90,
    overall: 94,
    riskLevel: "low"
  },
  {
    studentName: "Juan Pérez",
    comprehension: 88,
    fluency: 85,
    vocabulary: 90,
    pronunciation: 82,
    overall: 86,
    riskLevel: "low"
  },
  {
    studentName: "Sofia Rodríguez",
    comprehension: 92,
    fluency: 90,
    vocabulary: 95,
    pronunciation: 88,
    overall: 91,
    riskLevel: "low"
  },
  {
    studentName: "Carlos Torres",
    comprehension: 70,
    fluency: 68,
    vocabulary: 75,
    pronunciation: 62,
    overall: 69,
    riskLevel: "high"
  },
  {
    studentName: "Ana Díaz",
    comprehension: 68,
    fluency: 72,
    vocabulary: 78,
    pronunciation: 70,
    overall: 72,
    riskLevel: "high"
  },
  {
    studentName: "Luis Rivera",
    comprehension: 72,
    fluency: 65,
    vocabulary: 70,
    pronunciation: 68,
    overall: 69,
    riskLevel: "high"
  },
  {
    studentName: "Diego Martínez",
    comprehension: 85,
    fluency: 82,
    vocabulary: 88,
    pronunciation: 80,
    overall: 84,
    riskLevel: "low"
  },
  {
    studentName: "Isabella Cruz",
    comprehension: 90,
    fluency: 88,
    vocabulary: 92,
    pronunciation: 85,
    overall: 89,
    riskLevel: "low"
  },
  {
    studentName: "Miguel Santos",
    comprehension: 82,
    fluency: 80,
    vocabulary: 85,
    pronunciation: 78,
    overall: 81,
    riskLevel: "low"
  },
  {
    studentName: "Valeria Flores",
    comprehension: 87,
    fluency: 85,
    vocabulary: 90,
    pronunciation: 83,
    overall: 86,
    riskLevel: "low"
  }
];
