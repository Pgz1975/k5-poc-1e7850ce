export const teacherMessages = [
  {
    id: "msg-001",
    from: "Sra. Rivera",
    date: "2025-01-12",
    time: "14:30",
    subjectEs: "Excelente progreso de María",
    subjectEn: "María's excellent progress",
    messageEs: "Hola familia González, quería felicitarlos por el apoyo que le están dando a María. Su nivel de lectura ha mejorado significativamente este trimestre. ¡Sigan con el buen trabajo!",
    messageEn: "Hello González family, I wanted to congratulate you for the support you're giving María. Her reading level has improved significantly this quarter. Keep up the good work!",
    read: true,
  },
  {
    id: "msg-002",
    from: "Departamento de Lectura",
    date: "2025-01-15",
    time: "09:00",
    subjectEs: "Recordatorio: Examen diagnóstico próximo",
    subjectEn: "Reminder: Upcoming diagnostic test",
    messageEs: "Se aproxima el examen diagnóstico del segundo trimestre. Se llevará a cabo el 15 de diciembre. No requiere preparación especial, solo que María continúe con su rutina de lectura.",
    messageEn: "The second quarter diagnostic test is approaching. It will take place on December 15th. No special preparation needed, just continue María's reading routine.",
    read: false,
  },
];

export const progressReports = [
  {
    id: "report-001",
    period: "Q2 2024-2025",
    date: "2025-01-10",
    titleEs: "Reporte Trimestral - Segundo Trimestre",
    titleEn: "Quarterly Report - Second Quarter",
    downloadUrl: "/reports/maria-q2-2024.pdf",
    highlights: {
      readingLevel: 3.2,
      improvement: "+12%",
      activitiesCompleted: 24,
      strengths: ["Comprehension", "Vocabulary"],
      areasToWork: ["Pronunciation"],
    },
  },
  {
    id: "report-002",
    period: "Q1 2024-2025",
    date: "2024-11-15",
    titleEs: "Reporte Trimestral - Primer Trimestre",
    titleEn: "Quarterly Report - First Quarter",
    downloadUrl: "/reports/maria-q1-2024.pdf",
    highlights: {
      readingLevel: 3.0,
      improvement: "+8%",
      activitiesCompleted: 20,
      strengths: ["Vocabulary"],
      areasToWork: ["Fluency", "Pronunciation"],
    },
  },
];

export const communicationPreferences = {
  preferredMethod: "whatsapp", // email, whatsapp, sms
  language: "es", // es, en
  frequency: "weekly", // daily, weekly, biweekly, monthly
  notificationTime: "18:00",
  achievementNotifications: true,
  weeklyReports: true,
  teacherMessages: true,
  platformUpdates: false,
};

export const encouragementTemplates = [
  {
    es: "¡Sigue así, campeón! 🌟",
    en: "Keep it up, champion! 🌟",
  },
  {
    es: "¡Estoy muy orgulloso de ti! ❤️",
    en: "I'm so proud of you! ❤️",
  },
  {
    es: "¡Eres una estrella brillante! ⭐",
    en: "You're a shining star! ⭐",
  },
  {
    es: "¡Me encanta verte crecer! 🌱",
    en: "I love seeing you grow! 🌱",
  },
  {
    es: "¡Tu esfuerzo vale la pena! 💪",
    en: "Your effort is paying off! 💪",
  },
];
