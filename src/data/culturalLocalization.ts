export const mockAccommodations = {
  extendedTime: { icon: "⏱️", labelEs: "Tiempo Extendido", labelEn: "Extended Time" },
  enlargedText: { icon: "🔍", labelEs: "Texto Ampliado", labelEn: "Enlarged Text" },
  audioSupport: { icon: "🔊", labelEs: "Apoyo de Audio", labelEn: "Audio Support" },
  breaks: { icon: "☕", labelEs: "Descansos Frecuentes", labelEn: "Frequent Breaks" },
  preferentialSeating: { icon: "💺", labelEs: "Asiento Preferencial", labelEn: "Preferential Seating" },
  visualAids: { icon: "👁️", labelEs: "Ayudas Visuales", labelEn: "Visual Aids" }
};

export const mockStudentAccommodations = [
  { studentId: 4, accommodations: ["extendedTime", "audioSupport"], hasPEI: true },
  { studentId: 5, accommodations: ["enlargedText", "breaks"], hasPEI: true },
  { studentId: 6, accommodations: ["audioSupport", "visualAids"], hasPEI: false }
];

export const mockCulturalContent = {
  totalCompleted: 45,
  byCategory: [
    { category: "El Yunque y Naturaleza", completed: 12, total: 15 },
    { category: "Historia de Puerto Rico", completed: 10, total: 12 },
    { category: "Tradiciones y Fiestas", completed: 8, total: 10 },
    { category: "Música y Arte Boricua", completed: 9, total: 11 },
    { category: "Comida Típica", completed: 6, total: 8 }
  ],
  culturalVocabulary: [
    { word: "coquí", mastery: 95, usage: 88 },
    { word: "huracán", mastery: 92, usage: 85 },
    { word: "plena", mastery: 87, usage: 78 },
    { word: "mofongo", mastery: 90, usage: 82 },
    { word: "vejigante", mastery: 85, usage: 75 },
    { word: "piragua", mastery: 88, usage: 80 }
  ]
};

export const mockParentCommunication = {
  preferences: [
    { studentId: 1, method: "email", frequency: "weekly", language: "spanish" },
    { studentId: 2, method: "whatsapp", frequency: "biweekly", language: "spanish" },
    { studentId: 3, method: "sms", frequency: "monthly", language: "english" },
    { studentId: 4, method: "whatsapp", frequency: "weekly", language: "spanish" },
    { studentId: 5, method: "email", frequency: "weekly", language: "spanish" },
    { studentId: 6, method: "sms", frequency: "biweekly", language: "spanish" }
  ],
  lastSent: [
    { studentId: 1, date: "2024-01-15", method: "email", opened: true },
    { studentId: 2, date: "2024-01-14", method: "whatsapp", opened: true },
    { studentId: 4, date: "2024-01-10", method: "whatsapp", opened: false }
  ]
};
