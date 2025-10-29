export interface UsageMetrics {
  weeklyFrequency: number; // sessions per student per week
  avgSessionDuration: number; // minutes
  totalSessionsThisWeek: number;
  activeStudentsPercent: number;
  schoolVsHomeUsage: { school: number; home: number };
}

export const mockUsageMetrics: UsageMetrics = {
  weeklyFrequency: 4.2,
  avgSessionDuration: 22,
  totalSessionsThisWeek: 105,
  activeStudentsPercent: 92,
  schoolVsHomeUsage: { school: 65, home: 35 }
};
