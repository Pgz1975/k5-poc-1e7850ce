import { AlertTriangle, TrendingDown, Sparkles, BookOpen, Target, Brain } from "lucide-react";

export interface AIInsight {
  id: number;
  type: "critical" | "trend" | "positive";
  icon: typeof AlertTriangle;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  actionText: string;
  actionTextEn: string;
  students?: string[];
  affectedCount?: number;
  confidence: number;
}

export interface ErrorPattern {
  domain: string;
  domainEn: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface ResponseTimeData {
  student: string;
  avgSeconds: number;
  accuracy: number;
  status: "excellent" | "good" | "needsHelp";
}

export interface StudentRecommendation {
  studentName: string;
  currentLevel: string;
  weaknesses: {
    area: string;
    areaEn: string;
    severity: "high" | "medium" | "low";
    details: string;
    detailsEn: string;
  }[];
  recommendedActivities: {
    title: string;
    titleEn: string;
    duration: string;
    frequency: string;
    frequencyEn: string;
  }[];
  expectedImprovement: string;
  expectedImprovementEn: string;
  confidence: number;
}

export const mockAIInsights: AIInsight[] = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "3 Estudiantes Necesitan Intervención Inmediata",
    titleEn: "3 Students Need Immediate Intervention",
    description: "Carlos, Luis y Ana muestran declive en comprensión lectora",
    descriptionEn: "Carlos, Luis, and Ana show declining reading comprehension",
    actionText: "Ver Recomendaciones",
    actionTextEn: "View Recommendations",
    students: ["Carlos Torres", "Luis Rivera", "Ana Díaz"],
    confidence: 92
  },
  {
    id: 2,
    type: "trend",
    icon: TrendingDown,
    title: "Habilidades de Pronunciación Declinando",
    titleEn: "Pronunciation Skills Declining Class-Wide",
    description: "Promedio de pronunciación bajó 8% esta semana",
    descriptionEn: "Average pronunciation scores dropped 8% this week",
    actionText: "Generar Plan de Práctica",
    actionTextEn: "Generate Practice Plan",
    affectedCount: 15,
    confidence: 87
  },
  {
    id: 3,
    type: "positive",
    icon: Sparkles,
    title: "Dominio de Vocabulario Acelerando",
    titleEn: "Vocabulary Mastery Accelerating",
    description: "85% de la clase está adelantada en vocabulario",
    descriptionEn: "85% of class is ahead of grade-level benchmarks",
    actionText: "Desbloquear Contenido Avanzado",
    actionTextEn: "Unlock Advanced Content",
    confidence: 95
  }
];

export const mockErrorPatterns: ErrorPattern[] = [
  {
    domain: "Comprensión - Significado",
    domainEn: "Comprehension - Word Meaning",
    count: 45,
    percentage: 32,
    colorClass: "hsl(329, 100%, 65%)"
  },
  {
    domain: "Pronunciación - Vocales",
    domainEn: "Pronunciation - Vowels",
    count: 38,
    percentage: 27,
    colorClass: "hsl(11, 100%, 65%)"
  },
  {
    domain: "Fluidez - Ritmo",
    domainEn: "Fluency - Pacing",
    count: 32,
    percentage: 23,
    colorClass: "hsl(190, 100%, 65%)"
  },
  {
    domain: "Vocabulario - Académico",
    domainEn: "Vocabulary - Academic Terms",
    count: 28,
    percentage: 20,
    colorClass: "hsl(125, 100%, 55%)"
  }
];

export const mockResponseTimeData: ResponseTimeData[] = [
  { student: "María", avgSeconds: 12, accuracy: 95, status: "excellent" },
  { student: "Juan", avgSeconds: 18, accuracy: 88, status: "good" },
  { student: "Sofia", avgSeconds: 15, accuracy: 92, status: "excellent" },
  { student: "Carlos", avgSeconds: 35, accuracy: 62, status: "needsHelp" },
  { student: "Ana", avgSeconds: 28, accuracy: 70, status: "needsHelp" },
  { student: "Luis", avgSeconds: 32, accuracy: 65, status: "needsHelp" },
  { student: "Diego", avgSeconds: 16, accuracy: 85, status: "good" },
  { student: "Isabella", avgSeconds: 14, accuracy: 90, status: "excellent" },
  { student: "Miguel", avgSeconds: 20, accuracy: 82, status: "good" },
  { student: "Valeria", avgSeconds: 17, accuracy: 87, status: "good" }
];

export const mockStudentRecommendations: Record<string, StudentRecommendation> = {
  "Carlos Torres": {
    studentName: "Carlos Torres",
    currentLevel: "2.5",
    weaknesses: [
      {
        area: "Pronunciación",
        areaEn: "Pronunciation",
        severity: "high",
        details: "Dificultad con sonidos de 'r' y combinaciones consonánticas",
        detailsEn: "Struggles with 'r' sounds and consonant blends"
      },
      {
        area: "Comprensión",
        areaEn: "Comprehension",
        severity: "medium",
        details: "Identificación de pistas de contexto",
        detailsEn: "Context clue identification"
      }
    ],
    recommendedActivities: [
      {
        title: "Ejercicio de Pronunciación 3.2",
        titleEn: "Pronunciation Exercise 3.2",
        duration: "15 min",
        frequency: "diario",
        frequencyEn: "daily"
      },
      {
        title: "Lectura Guiada - El Yunque",
        titleEn: "Guided Reading - El Yunque",
        duration: "20 min",
        frequency: "3x/semana",
        frequencyEn: "3x/week"
      },
      {
        title: "Práctica de Pistas de Contexto",
        titleEn: "Context Clues Practice",
        duration: "10 min",
        frequency: "diario",
        frequencyEn: "daily"
      }
    ],
    expectedImprovement: "Mejora del 15-20% en 2 semanas",
    expectedImprovementEn: "15-20% improvement in 2 weeks",
    confidence: 88
  },
  "Luis Rivera": {
    studentName: "Luis Rivera",
    currentLevel: "2.7",
    weaknesses: [
      {
        area: "Fluidez",
        areaEn: "Fluency",
        severity: "high",
        details: "Lectura entrecortada, pausa frecuente",
        detailsEn: "Choppy reading, frequent pausing"
      },
      {
        area: "Vocabulario",
        areaEn: "Vocabulary",
        severity: "medium",
        details: "Términos académicos limitados",
        detailsEn: "Limited academic vocabulary"
      }
    ],
    recommendedActivities: [
      {
        title: "Práctica de Lectura Repetida",
        titleEn: "Repeated Reading Practice",
        duration: "20 min",
        frequency: "diario",
        frequencyEn: "daily"
      },
      {
        title: "Tarjetas de Vocabulario",
        titleEn: "Vocabulary Flashcards",
        duration: "10 min",
        frequency: "2x/día",
        frequencyEn: "2x/day"
      }
    ],
    expectedImprovement: "Mejora del 10-15% en 3 semanas",
    expectedImprovementEn: "10-15% improvement in 3 weeks",
    confidence: 85
  },
  "Ana Díaz": {
    studentName: "Ana Díaz",
    currentLevel: "2.9",
    weaknesses: [
      {
        area: "Comprensión",
        areaEn: "Comprehension",
        severity: "high",
        details: "Dificultad con inferencias y lectura entre líneas",
        detailsEn: "Difficulty with inferences and reading between the lines"
      }
    ],
    recommendedActivities: [
      {
        title: "Ejercicios de Inferencia",
        titleEn: "Inference Exercises",
        duration: "15 min",
        frequency: "diario",
        frequencyEn: "daily"
      },
      {
        title: "Discusión de Lectura Guiada",
        titleEn: "Guided Reading Discussion",
        duration: "25 min",
        frequency: "3x/semana",
        frequencyEn: "3x/week"
      }
    ],
    expectedImprovement: "Mejora del 12-18% en 2 semanas",
    expectedImprovementEn: "12-18% improvement in 2 weeks",
    confidence: 90
  }
};
