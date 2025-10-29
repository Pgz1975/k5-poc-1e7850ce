export const mockStudentProfiles = {
  1: {
    sessions: [
      { date: "2024-01-15", duration: 25, activitiesCompleted: 3, avgScore: 92 },
      { date: "2024-01-14", duration: 30, activitiesCompleted: 4, avgScore: 88 },
      { date: "2024-01-12", duration: 22, activitiesCompleted: 2, avgScore: 95 },
      { date: "2024-01-10", duration: 28, activitiesCompleted: 3, avgScore: 90 },
      { date: "2024-01-08", duration: 20, activitiesCompleted: 2, avgScore: 87 }
    ],
    skillProgression: {
      comprehension: [
        { date: "2024-01-01", score: 82 },
        { date: "2024-01-08", score: 85 },
        { date: "2024-01-15", score: 88 }
      ],
      fluency: [
        { date: "2024-01-01", score: 78 },
        { date: "2024-01-08", score: 82 },
        { date: "2024-01-15", score: 85 }
      ],
      vocabulary: [
        { date: "2024-01-01", score: 85 },
        { date: "2024-01-08", score: 88 },
        { date: "2024-01-15", score: 90 }
      ],
      pronunciation: [
        { date: "2024-01-01", score: 75 },
        { date: "2024-01-08", score: 78 },
        { date: "2024-01-15", score: 82 }
      ]
    },
    assessmentHistory: [
      { date: "2024-01-10", type: "Diagnóstico", score: 88, standardsCovered: 12 },
      { date: "2023-12-15", type: "Intermedio", score: 85, standardsCovered: 12 },
      { date: "2023-09-01", type: "Inicial", score: 78, standardsCovered: 12 }
    ],
    aiRecommendations: [
      {
        date: "2024-01-15",
        recommendation: "Enfocarse en ejercicios de fluidez lectora",
        status: "active",
        priority: "high"
      },
      {
        date: "2024-01-08",
        recommendation: "Practicar vocabulario científico",
        status: "completed",
        priority: "medium"
      }
    ],
    parentCommunication: [
      { date: "2024-01-15", method: "email", subject: "Reporte Semanal", opened: true },
      { date: "2024-01-08", method: "email", subject: "Reporte Semanal", opened: true },
      { date: "2024-01-01", method: "whatsapp", subject: "Recordatorio", opened: true }
    ]
  },
  2: {
    sessions: [
      { date: "2024-01-15", duration: 20, activitiesCompleted: 2, avgScore: 85 },
      { date: "2024-01-13", duration: 25, activitiesCompleted: 3, avgScore: 82 },
      { date: "2024-01-11", duration: 18, activitiesCompleted: 2, avgScore: 88 }
    ],
    skillProgression: {
      comprehension: [
        { date: "2024-01-01", score: 75 },
        { date: "2024-01-08", score: 78 },
        { date: "2024-01-15", score: 82 }
      ],
      fluency: [
        { date: "2024-01-01", score: 72 },
        { date: "2024-01-08", score: 75 },
        { date: "2024-01-15", score: 78 }
      ],
      vocabulary: [
        { date: "2024-01-01", score: 80 },
        { date: "2024-01-08", score: 83 },
        { date: "2024-01-15", score: 85 }
      ],
      pronunciation: [
        { date: "2024-01-01", score: 70 },
        { date: "2024-01-08", score: 73 },
        { date: "2024-01-15", score: 76 }
      ]
    },
    assessmentHistory: [
      { date: "2024-01-10", type: "Diagnóstico", score: 82, standardsCovered: 12 },
      { date: "2023-12-15", type: "Intermedio", score: 80, standardsCovered: 12 }
    ],
    aiRecommendations: [],
    parentCommunication: [
      { date: "2024-01-14", method: "whatsapp", subject: "Progreso Semanal", opened: true }
    ]
  }
};
