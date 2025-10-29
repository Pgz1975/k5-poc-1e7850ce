export const studentProfile = {
  name: "María González",
  grade: 3,
  readingLevel: 3.2,
  photoUrl: null,
  lastLogin: "2025-01-15T19:30:00",
};

export const weeklyActivity = [
  { day: "Lun", dayEn: "Mon", minutes: 25, activities: 2, sessions: 2, timeOfDay: "afternoon" },
  { day: "Mar", dayEn: "Tue", minutes: 30, activities: 3, sessions: 2, timeOfDay: "evening" },
  { day: "Mié", dayEn: "Wed", minutes: 28, activities: 2, sessions: 1, timeOfDay: "evening" },
  { day: "Jue", dayEn: "Thu", minutes: 35, activities: 3, sessions: 2, timeOfDay: "afternoon" },
  { day: "Vie", dayEn: "Fri", minutes: 32, activities: 2, sessions: 2, timeOfDay: "evening" },
  { day: "Sáb", dayEn: "Sat", minutes: 0, activities: 0, sessions: 0, timeOfDay: null },
  { day: "Dom", dayEn: "Sun", minutes: 0, activities: 0, sessions: 0, timeOfDay: null },
];

export const weeklyStats = {
  totalMinutes: 150,
  goalMinutes: 120,
  activeDays: 5,
  totalDays: 7,
  streak: 7,
  averageSessionLength: 30,
  longestSession: 45,
  preferredTime: "7:00 PM - 8:00 PM",
};

export const skillsDetailed = {
  comprehension: {
    overall: 88,
    subskills: {
      mainIdeas: 92,
      inference: 85,
      details: 87,
    },
  },
  fluency: {
    overall: 85,
    wordsPerMinute: 95,
    expressionScore: 83,
  },
  vocabulary: {
    overall: 90,
    newWordsThisMonth: 28,
    retentionRate: 92,
  },
  pronunciation: {
    overall: 82,
    accuracyScore: 82,
    commonChallenges: ["'r' sounds", "consonant blends"],
  },
};

export const culturalVocabulary = {
  mastered: ["coquí", "plena", "mofongo", "piragua"],
  next: ["vejigante", "flamboyán", "boricua"],
  totalCulturalStories: 15,
  completedStories: 12,
  percentage: 80,
};

export const achievements = [
  {
    id: "7-day-streak",
    titleEs: "Racha de 7 Días",
    titleEn: "7-Day Streak",
    icon: "🔥",
    date: "2025-01-15",
    special: false,
  },
  {
    id: "10-readings",
    titleEs: "10 Lecturas Completas",
    titleEn: "10 Readings Complete",
    icon: "📚",
    date: "2025-01-14",
    special: false,
  },
  {
    id: "level-3",
    titleEs: "Nivel 3 Alcanzado",
    titleEn: "Level 3 Reached",
    icon: "🎯",
    date: "2025-01-12",
    special: false,
  },
  {
    id: "yunque-explorer",
    titleEs: "Explorador del Yunque",
    titleEn: "Yunque Explorer",
    icon: "🌿",
    date: "2025-01-10",
    special: true,
    cultural: true,
  },
  {
    id: "coqui-master",
    titleEs: "Maestro del Coquí",
    titleEn: "Coquí Master",
    icon: "🐸",
    date: "2025-01-08",
    special: true,
    cultural: true,
  },
];

export const recentActivities = [
  {
    date: "2025-01-15",
    time: "19:30",
    titleEs: "El Coquí del Yunque",
    titleEn: "The Coquí of El Yunque",
    category: "El Yunque",
    duration: 32,
    comprehensionScore: 90,
    pronunciationScore: 85,
    hasRecording: true,
  },
  {
    date: "2025-01-15",
    time: "15:45",
    titleEs: "La Plena Puertorriqueña",
    titleEn: "Puerto Rican Plena",
    category: "Traditions",
    duration: 28,
    comprehensionScore: 88,
    pronunciationScore: 80,
    hasRecording: true,
  },
  {
    date: "2025-01-14",
    time: "19:15",
    titleEs: "El Flamboyán Rojo",
    titleEn: "The Red Flamboyán",
    category: "Nature",
    duration: 30,
    comprehensionScore: 92,
    pronunciationScore: 88,
    hasRecording: false,
  },
];

export const levelProgress = {
  currentLevel: 3.2,
  nextLevel: 4.0,
  progressPercentage: 65,
  skillsNeeded: ["Comprehension +5%", "Pronunciation +8%"],
  estimatedTimeToNext: "2 weeks",
};
