export interface ReadingProgress {
  textsCompleted: number;
  avgPagesPerSession: number;
  completionRate: number; // percentage
  levelProgression: Array<{ month: string; avgLevel: number }>;
  unitsCompleted: Record<string, number>;
}

export const mockReadingProgress: ReadingProgress = {
  textsCompleted: 78,
  avgPagesPerSession: 5.3,
  completionRate: 87,
  levelProgression: [
    { month: "Ago/Aug", avgLevel: 2.1 },
    { month: "Sep", avgLevel: 2.4 },
    { month: "Oct", avgLevel: 2.7 },
    { month: "Nov", avgLevel: 3.0 }
  ],
  unitsCompleted: { 
    "Unidad 1": 24, 
    "Unidad 2": 20, 
    "Unidad 3": 15,
    "Unidad 4": 8
  }
};
