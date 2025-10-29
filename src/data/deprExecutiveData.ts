export interface ExecutiveKPIs {
  totalStudents: number;
  islandAverage: number;
  totalSchools: number;
  platformUsageRate: number;
  programHealthScore: number;
}

export interface RegionalPerformance {
  id: number;
  region: string;
  regionEn: string;
  average: number;
  schools: number;
  students: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface ProgramComparison {
  metric: string;
  metricEn: string;
  spanish: number;
  english: number;
}

export interface PolicyMetric {
  month: string;
  schoolsOnboarded: number;
  activeUsers: number;
  targetSchools: number;
}

export interface DiagnosticTestResults {
  grade: string;
  gradeEn: string;
  august: number;
  december: number;
  may: number;
  growth: number;
}

export const mockExecutiveKPIs: ExecutiveKPIs = {
  totalStudents: 24750,
  islandAverage: 82,
  totalSchools: 551,
  platformUsageRate: 68,
  programHealthScore: 85
};

export const mockRegionalPerformance: RegionalPerformance[] = [
  { 
    id: 1, 
    region: "San Juan", 
    regionEn: "San Juan", 
    average: 85, 
    schools: 12, 
    students: 4250, 
    trend: 'up', 
    color: "hsl(125, 100%, 55%)" 
  },
  { 
    id: 2, 
    region: "Bayamón", 
    regionEn: "Bayamón", 
    average: 83, 
    schools: 8, 
    students: 3250, 
    trend: 'up', 
    color: "hsl(125, 100%, 55%)" 
  },
  { 
    id: 3, 
    region: "Arecibo", 
    regionEn: "Arecibo", 
    average: 81, 
    schools: 9, 
    students: 3100, 
    trend: 'stable', 
    color: "hsl(45, 100%, 55%)" 
  },
  { 
    id: 4, 
    region: "Mayagüez", 
    regionEn: "Mayagüez", 
    average: 82, 
    schools: 10, 
    students: 3450, 
    trend: 'up', 
    color: "hsl(125, 100%, 55%)" 
  },
  { 
    id: 5, 
    region: "Ponce", 
    regionEn: "Ponce", 
    average: 84, 
    schools: 11, 
    students: 3800, 
    trend: 'up', 
    color: "hsl(125, 100%, 55%)" 
  },
  { 
    id: 6, 
    region: "Caguas", 
    regionEn: "Caguas", 
    average: 80, 
    schools: 7, 
    students: 2900, 
    trend: 'stable', 
    color: "hsl(45, 100%, 55%)" 
  },
  { 
    id: 7, 
    region: "Humacao", 
    regionEn: "Humacao", 
    average: 79, 
    schools: 6, 
    students: 2000, 
    trend: 'down', 
    color: "hsl(11, 100%, 55%)" 
  }
];

export const mockProgramComparison: ProgramComparison[] = [
  { metric: "Promedio General", metricEn: "Overall Average", spanish: 83, english: 81 },
  { metric: "Tasa de Uso", metricEn: "Usage Rate", spanish: 72, english: 65 },
  { metric: "Comprensión", metricEn: "Comprehension", spanish: 85, english: 82 },
  { metric: "Fluidez", metricEn: "Fluency", spanish: 81, english: 80 },
  { metric: "Vocabulario", metricEn: "Vocabulary", spanish: 86, english: 83 },
  { metric: "Pronunciación", metricEn: "Pronunciation", spanish: 80, english: 84 }
];

export const mockPolicyMetrics: PolicyMetric[] = [
  { month: "Ago/Aug", schoolsOnboarded: 150, activeUsers: 8500, targetSchools: 276 },
  { month: "Sep", schoolsOnboarded: 225, activeUsers: 13200, targetSchools: 276 },
  { month: "Oct", schoolsOnboarded: 310, activeUsers: 18400, targetSchools: 276 },
  { month: "Nov", schoolsOnboarded: 375, activeUsers: 21750, targetSchools: 276 },
  { month: "Dic/Dec", schoolsOnboarded: 375, activeUsers: 24750, targetSchools: 276 }
];

export const mockDiagnosticResults: DiagnosticTestResults[] = [
  { grade: "Kinder", gradeEn: "K", august: 72, december: 78, may: 82, growth: 10 },
  { grade: "1ro", gradeEn: "1st", august: 74, december: 80, may: 85, growth: 11 },
  { grade: "2do", gradeEn: "2nd", august: 76, december: 83, may: 87, growth: 11 },
  { grade: "3ro", gradeEn: "3rd", august: 79, december: 87, may: 91, growth: 12 },
  { grade: "4to", gradeEn: "4th", august: 77, december: 85, may: 89, growth: 12 },
  { grade: "5to", gradeEn: "5th", august: 78, december: 86, may: 90, growth: 12 }
];

export const mockIslandGradePerformance = [
  { grade: "K", average: 78, students: 4250 },
  { grade: "1", average: 80, students: 4150 },
  { grade: "2", average: 83, students: 4050 },
  { grade: "3", average: 87, students: 4200 },
  { grade: "4", average: 85, students: 4000 },
  { grade: "5", average: 86, students: 4100 }
];

import { Target, AlertTriangle, Sparkles } from "lucide-react";

export const mockExecutiveAIInsights = [
  {
    id: "1",
    type: "positive" as const,
    icon: Target,
    title: "Meta de Adopción Alcanzada",
    titleEn: "Adoption Goal Reached",
    description: "68% de las escuelas K-5 están activamente usando la plataforma, superando la meta del 50% para diciembre.",
    descriptionEn: "68% of K-5 schools actively using the platform, exceeding the 50% goal for December.",
    actionText: "Ver Dashboard",
    actionTextEn: "View Dashboard",
    confidence: 98
  },
  {
    id: "2",
    type: "critical" as const,
    icon: AlertTriangle,
    title: "Brecha Regional Detectada",
    titleEn: "Regional Gap Detected",
    description: "Existe una diferencia del 7.5% entre las regiones de mayor y menor rendimiento. Se recomienda intervención estratégica.",
    descriptionEn: "7.5% difference exists between highest and lowest performing regions. Strategic intervention recommended.",
    actionText: "Ver Análisis",
    actionTextEn: "View Analysis",
    confidence: 94
  },
  {
    id: "3",
    type: "trend" as const,
    icon: Sparkles,
    title: "Contenido Cultural de Alto Impacto",
    titleEn: "High-Impact Cultural Content",
    description: "Las lecciones con contenido puertorriqueño muestran 23% más de engagement que contenido genérico.",
    descriptionEn: "Lessons with Puerto Rican content show 23% more engagement than generic content.",
    actionText: "Expandir Contenido",
    actionTextEn: "Expand Content",
    confidence: 96
  }
];
