export interface RegionalMetrics {
  totalStudents: number;
  regionalAverage: number;
  totalSchools: number;
  topSchool: string;
  schoolsNeedingSupport: number;
}

export interface SchoolComparison {
  id: number;
  schoolName: string;
  students: number;
  averageSpanish: number;
  averageEnglish: number;
  activeTeachers: number;
  weeklyUsage: number;
  trend: 'up' | 'down' | 'stable';
  performanceLevel: 'high' | 'medium' | 'low';
}

export interface RegionalSkillsData {
  school: string;
  comprehension: number;
  fluency: number;
  vocabulary: number;
  pronunciation: number;
}

export const mockRegionalMetrics: RegionalMetrics = {
  totalStudents: 3250,
  regionalAverage: 83,
  totalSchools: 8,
  topSchool: "Escuela Julia de Burgos",
  schoolsNeedingSupport: 2
};

export const mockSchoolComparison: SchoolComparison[] = [
  { 
    id: 1, 
    schoolName: "Escuela Julia de Burgos", 
    students: 425, 
    averageSpanish: 87, 
    averageEnglish: 84, 
    activeTeachers: 18, 
    weeklyUsage: 92, 
    trend: 'up', 
    performanceLevel: 'high' 
  },
  { 
    id: 2, 
    schoolName: "Escuela José de Diego", 
    students: 398, 
    averageSpanish: 84, 
    averageEnglish: 82, 
    activeTeachers: 16, 
    weeklyUsage: 88, 
    trend: 'up', 
    performanceLevel: 'high' 
  },
  { 
    id: 3, 
    schoolName: "Escuela Rafael Hernández", 
    students: 412, 
    averageSpanish: 82, 
    averageEnglish: 80, 
    activeTeachers: 17, 
    weeklyUsage: 85, 
    trend: 'stable', 
    performanceLevel: 'medium' 
  },
  { 
    id: 4, 
    schoolName: "Escuela Eugenio María de Hostos", 
    students: 385, 
    averageSpanish: 80, 
    averageEnglish: 78, 
    activeTeachers: 15, 
    weeklyUsage: 82, 
    trend: 'stable', 
    performanceLevel: 'medium' 
  },
  { 
    id: 5, 
    schoolName: "Escuela Luis Muñoz Rivera", 
    students: 365, 
    averageSpanish: 79, 
    averageEnglish: 77, 
    activeTeachers: 14, 
    weeklyUsage: 78, 
    trend: 'down', 
    performanceLevel: 'low' 
  },
  { 
    id: 6, 
    schoolName: "Escuela Pedro Albizu Campos", 
    students: 420, 
    averageSpanish: 81, 
    averageEnglish: 79, 
    activeTeachers: 17, 
    weeklyUsage: 83, 
    trend: 'up', 
    performanceLevel: 'medium' 
  },
  { 
    id: 7, 
    schoolName: "Escuela Ramón Emeterio Betances", 
    students: 445, 
    averageSpanish: 85, 
    averageEnglish: 83, 
    activeTeachers: 19, 
    weeklyUsage: 90, 
    trend: 'up', 
    performanceLevel: 'high' 
  },
  { 
    id: 8, 
    schoolName: "Escuela Lola Rodríguez de Tió", 
    students: 400, 
    averageSpanish: 76, 
    averageEnglish: 74, 
    activeTeachers: 16, 
    weeklyUsage: 70, 
    trend: 'down', 
    performanceLevel: 'low' 
  }
];

export const mockRegionalSkillsHeatmap: RegionalSkillsData[] = [
  { school: "Julia de Burgos", comprehension: 88, fluency: 85, vocabulary: 90, pronunciation: 84 },
  { school: "José de Diego", comprehension: 85, fluency: 82, vocabulary: 87, pronunciation: 81 },
  { school: "Rafael Hernández", comprehension: 83, fluency: 80, vocabulary: 84, pronunciation: 79 },
  { school: "E.M. de Hostos", comprehension: 81, fluency: 78, vocabulary: 82, pronunciation: 77 },
  { school: "L.M. Rivera", comprehension: 80, fluency: 77, vocabulary: 80, pronunciation: 76 },
  { school: "P.A. Campos", comprehension: 82, fluency: 79, vocabulary: 83, pronunciation: 78 },
  { school: "R.E. Betances", comprehension: 86, fluency: 83, vocabulary: 88, pronunciation: 82 },
  { school: "L.R. de Tió", comprehension: 77, fluency: 74, vocabulary: 78, pronunciation: 73 }
];

export const mockRegionalComparison = [
  { region: "San Juan", regionEn: "San Juan", average: 85, schools: 12, highlight: false },
  { region: "Bayamón", regionEn: "Bayamón", average: 83, schools: 8, highlight: true },
  { region: "Arecibo", regionEn: "Arecibo", average: 81, schools: 9, highlight: false },
  { region: "Mayagüez", regionEn: "Mayagüez", average: 82, schools: 10, highlight: false },
  { region: "Ponce", regionEn: "Ponce", average: 84, schools: 11, highlight: false },
  { region: "Caguas", regionEn: "Caguas", average: 80, schools: 7, highlight: false },
  { region: "Humacao", regionEn: "Humacao", average: 79, schools: 6, highlight: false }
];

import { TrendingUp, AlertTriangle, GraduationCap } from "lucide-react";

export const mockRegionalAIInsights = [
  {
    id: "1",
    type: "positive" as const,
    icon: TrendingUp,
    title: "Región Supera Meta Trimestral",
    titleEn: "Region Exceeds Quarterly Goal",
    description: "Bayamón alcanzó 83% promedio, superando la meta del 80% establecida para Q4.",
    descriptionEn: "Bayamón reached 83% average, exceeding the 80% goal set for Q4.",
    actionText: "Ver Informe",
    actionTextEn: "View Report",
    confidence: 96
  },
  {
    id: "2",
    type: "critical" as const,
    icon: AlertTriangle,
    title: "Disparidad entre Escuelas",
    titleEn: "School Disparity",
    description: "Se detectó una brecha del 13% entre las escuelas de mejor y menor desempeño. Se sugiere redistribución de recursos.",
    descriptionEn: "13% gap detected between highest and lowest performing schools. Resource redistribution suggested.",
    actionText: "Ver Análisis",
    actionTextEn: "View Analysis",
    confidence: 91
  },
  {
    id: "3",
    type: "trend" as const,
    icon: GraduationCap,
    title: "Mejora en Capacitación Docente",
    titleEn: "Teacher Training Improvement",
    description: "Las escuelas con maestros certificados en Q3 muestran un 8% más de rendimiento estudiantil.",
    descriptionEn: "Schools with Q3-certified teachers show 8% higher student performance.",
    actionText: "Ver Programa",
    actionTextEn: "View Program",
    confidence: 89
  }
];
