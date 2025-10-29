export interface SchoolMetrics {
  totalStudents: number;
  schoolAverage: number;
  activitiesThisWeek: number;
  totalTeachers: number;
  classroomsAtRisk: number;
}

export interface GradePerformance {
  grade: string;
  gradeEn: string;
  average: number;
  students: number;
  comprehension: number;
  fluency: number;
  vocabulary: number;
  pronunciation: number;
}

export interface ClassroomPerformance {
  id: number;
  teacherName: string;
  gradeSubject: string;
  gradeSubjectEn: string;
  students: number;
  average: number;
  weeklyCompletion: number;
  riskLevel: 'low' | 'medium' | 'high';
  studentsAtRisk: number;
}

export interface SubjectPerformance {
  metric: string;
  metricEn: string;
  spanish: number;
  english: number;
}

export const mockSchoolMetrics: SchoolMetrics = {
  totalStudents: 425,
  schoolAverage: 84,
  activitiesThisWeek: 1847,
  totalTeachers: 18,
  classroomsAtRisk: 2
};

export const mockGradePerformance: GradePerformance[] = [
  { grade: "Kinder", gradeEn: "K", average: 78, students: 65, comprehension: 76, fluency: 77, vocabulary: 80, pronunciation: 79 },
  { grade: "1ro", gradeEn: "1st", average: 80, students: 72, comprehension: 79, fluency: 78, vocabulary: 82, pronunciation: 81 },
  { grade: "2do", gradeEn: "2nd", average: 83, students: 68, comprehension: 82, fluency: 81, vocabulary: 85, pronunciation: 84 },
  { grade: "3ro", gradeEn: "3rd", average: 87, students: 75, comprehension: 88, fluency: 85, vocabulary: 90, pronunciation: 86 },
  { grade: "4to", gradeEn: "4th", average: 85, students: 70, comprehension: 84, fluency: 83, vocabulary: 88, pronunciation: 85 },
  { grade: "5to", gradeEn: "5th", average: 86, students: 75, comprehension: 87, fluency: 85, vocabulary: 89, pronunciation: 84 }
];

export const mockClassroomPerformance: ClassroomPerformance[] = [
  { id: 1, teacherName: "Prof. María Santos", gradeSubject: "3ro - Español", gradeSubjectEn: "3rd - Spanish", students: 25, average: 87, weeklyCompletion: 92, riskLevel: 'low', studentsAtRisk: 0 },
  { id: 2, teacherName: "Prof. John Rivera", gradeSubject: "3ro - Inglés", gradeSubjectEn: "3rd - English", students: 25, average: 86, weeklyCompletion: 89, riskLevel: 'low', studentsAtRisk: 1 },
  { id: 3, teacherName: "Prof. Ana López", gradeSubject: "1ro - Español", gradeSubjectEn: "1st - Spanish", students: 22, average: 80, weeklyCompletion: 85, riskLevel: 'low', studentsAtRisk: 2 },
  { id: 4, teacherName: "Prof. David Ruiz", gradeSubject: "5to - Inglés", gradeSubjectEn: "5th - English", students: 24, average: 86, weeklyCompletion: 91, riskLevel: 'low', studentsAtRisk: 1 },
  { id: 5, teacherName: "Prof. Carmen Díaz", gradeSubject: "2do - Español", gradeSubjectEn: "2nd - Spanish", students: 20, average: 75, weeklyCompletion: 68, riskLevel: 'high', studentsAtRisk: 5 },
  { id: 6, teacherName: "Prof. Robert Chen", gradeSubject: "4to - Inglés", gradeSubjectEn: "4th - English", students: 23, average: 78, weeklyCompletion: 72, riskLevel: 'medium', studentsAtRisk: 4 }
];

export const mockSubjectPerformance: SubjectPerformance[] = [
  { metric: "Comprensión", metricEn: "Comprehension", spanish: 85, english: 83 },
  { metric: "Fluidez", metricEn: "Fluency", spanish: 82, english: 81 },
  { metric: "Vocabulario", metricEn: "Vocabulary", spanish: 88, english: 84 },
  { metric: "Pronunciación", metricEn: "Pronunciation", spanish: 80, english: 86 }
];

export const mockUsageByLocation = {
  school: 58,
  home: 42
};

export const mockDeviceUsage = [
  { device: "Móvil", deviceEn: "Mobile", percentage: 48, count: 204 },
  { device: "Tableta", deviceEn: "Tablet", percentage: 32, count: 136 },
  { device: "Computadora", deviceEn: "Computer", percentage: 20, count: 85 }
];

import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export const mockSchoolAIInsights = [
  {
    id: "1",
    type: "positive" as const,
    icon: TrendingUp,
    title: "Excelente Progreso en Vocabulario",
    titleEn: "Excellent Vocabulary Progress",
    description: "El 3er grado muestra un crecimiento del 15% en vocabulario este mes, superando la meta del trimestre.",
    descriptionEn: "3rd grade shows 15% vocabulary growth this month, exceeding the quarterly goal.",
    actionText: "Ver Detalles",
    actionTextEn: "View Details",
    confidence: 95
  },
  {
    id: "2",
    type: "critical" as const,
    icon: AlertTriangle,
    title: "Atención Necesaria en 2do Grado",
    titleEn: "Attention Needed in 2nd Grade",
    description: "La clase de Prof. Díaz muestra una disminución del 12% en participación. Se recomienda intervención.",
    descriptionEn: "Prof. Díaz's class shows a 12% decrease in participation. Intervention recommended.",
    actionText: "Ver Plan",
    actionTextEn: "View Plan",
    confidence: 88
  },
  {
    id: "3",
    type: "trend" as const,
    icon: Lightbulb,
    title: "Contenido Cultural Destacado",
    titleEn: "Featured Cultural Content",
    description: "Las actividades sobre El Yunque muestran el mayor nivel de engagement (94% de completación).",
    descriptionEn: "El Yunque activities show highest engagement (94% completion rate).",
    actionText: "Explorar",
    actionTextEn: "Explore",
    confidence: 92
  }
];
