export const weeklySchedule = [
  { day: "sunday", dayEs: "Domingo", dayEn: "Sunday", planned: null, actual: null },
  { day: "monday", dayEs: "Lunes", dayEn: "Monday", planned: "15:30", actual: "15:45" },
  { day: "tuesday", dayEs: "Martes", dayEn: "Tuesday", planned: "19:00", actual: "19:15" },
  { day: "wednesday", dayEs: "Miércoles", dayEn: "Wednesday", planned: "19:00", actual: "19:00" },
  { day: "thursday", dayEs: "Jueves", dayEn: "Thursday", planned: "15:30", actual: "15:30" },
  { day: "friday", dayEs: "Viernes", dayEn: "Friday", planned: "19:00", actual: "19:30" },
  { day: "saturday", dayEs: "Sábado", dayEn: "Saturday", planned: null, actual: null },
];

export const goals = {
  weeklyMinutes: {
    target: 120,
    current: 150,
    percentage: 125,
  },
  activitiesPerWeek: {
    target: 5,
    current: 12,
    percentage: 240,
  },
  consecutiveDays: {
    target: 5,
    current: 7,
    percentage: 140,
  },
  customGoals: [
    {
      id: "cultural-stories",
      titleEs: "Leer 2 historias culturales esta semana",
      titleEn: "Read 2 cultural stories this week",
      progress: 2,
      target: 2,
      completed: true,
    },
    {
      id: "pronunciation-practice",
      titleEs: "Practicar pronunciación 5 días",
      titleEn: "Practice pronunciation 5 days",
      progress: 3,
      target: 5,
      completed: false,
    },
  ],
};

export const reminders = {
  dailyReading: {
    enabled: true,
    time: "19:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  achievementNotifications: {
    enabled: true,
  },
  weeklyReport: {
    enabled: true,
    day: "sunday",
    time: "10:00",
  },
  teacherMessages: {
    enabled: true,
  },
  platformUpdates: {
    enabled: false,
  },
};

export const familyChallenge = {
  titleEs: "Leer 30 minutos cada día esta semana",
  titleEn: "Read 30 minutes every day this week",
  progress: 5,
  target: 7,
  reward: {
    es: "Medalla Especial de Constancia 🏆",
    en: "Special Consistency Medal 🏆",
  },
  daysCompleted: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  daysRemaining: ["saturday", "sunday"],
};
