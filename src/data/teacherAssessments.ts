export interface AssessmentPeriod {
  avgScore: number;
  standardsCovered: number;
  totalQuestions: number;
  date: string;
}

export interface StandardResult {
  standard: string;
  subject: string;
  score: number;
  questions: number;
  status: "excellent" | "good" | "needsWork";
}

export const mockAssessmentResults = {
  august: { 
    avgScore: 72, 
    standardsCovered: 18, 
    totalQuestions: 54,
    date: "2024-08-15"
  },
  december: { 
    avgScore: 78, 
    standardsCovered: 18, 
    totalQuestions: 54,
    date: "2024-12-10"
  },
  may: null, // future test
  byStandard: [
    // Spanish Language Standards
    { standard: "3.L.1", subject: "Español", score: 85, questions: 3, status: "excellent" as const },
    { standard: "3.L.2", subject: "Español", score: 78, questions: 3, status: "good" as const },
    { standard: "3.L.3", subject: "Español", score: 88, questions: 3, status: "excellent" as const },
    { standard: "3.L.4", subject: "Español", score: 72, questions: 3, status: "good" as const },
    { standard: "3.L.5", subject: "Español", score: 65, questions: 3, status: "needsWork" as const },
    { standard: "3.L.6", subject: "Español", score: 81, questions: 3, status: "excellent" as const },
    
    // Reading Comprehension Standards
    { standard: "3.RL.1", subject: "Lectura", score: 90, questions: 3, status: "excellent" as const },
    { standard: "3.RL.2", subject: "Lectura", score: 82, questions: 3, status: "excellent" as const },
    { standard: "3.RL.3", subject: "Lectura", score: 75, questions: 3, status: "good" as const },
    { standard: "3.RL.4", subject: "Lectura", score: 68, questions: 3, status: "needsWork" as const },
    { standard: "3.RL.5", subject: "Lectura", score: 87, questions: 3, status: "excellent" as const },
    { standard: "3.RL.6", subject: "Lectura", score: 79, questions: 3, status: "good" as const },
    
    // English Language Standards
    { standard: "3.ELA.1", subject: "English", score: 77, questions: 3, status: "good" as const },
    { standard: "3.ELA.2", subject: "English", score: 83, questions: 3, status: "excellent" as const },
    { standard: "3.ELA.3", subject: "English", score: 70, questions: 3, status: "good" as const },
    { standard: "3.ELA.4", subject: "English", score: 74, questions: 3, status: "good" as const },
    { standard: "3.ELA.5", subject: "English", score: 66, questions: 3, status: "needsWork" as const },
    { standard: "3.ELA.6", subject: "English", score: 80, questions: 3, status: "excellent" as const },
  ]
};

export const mockDiagnosticTimeline = [
  { month: "Ago", augustScore: 72, decemberScore: null },
  { month: "Sep", augustScore: 72, decemberScore: null },
  { month: "Oct", augustScore: 72, decemberScore: null },
  { month: "Nov", augustScore: 72, decemberScore: null },
  { month: "Dic", augustScore: 72, decemberScore: 78 },
  { month: "Ene", augustScore: null, decemberScore: 78 },
  { month: "Feb", augustScore: null, decemberScore: 78 },
  { month: "Mar", augustScore: null, decemberScore: 78 },
  { month: "Abr", augustScore: null, decemberScore: 78 },
  { month: "May", augustScore: null, decemberScore: 78 },
];
