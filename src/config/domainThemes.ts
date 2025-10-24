import {
  Brain,
  Headphones,
  SplitSquareVertical,
  BookOpen,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

export interface DomainTheme {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  order: number;
}

export const DOMAIN_THEMES: Record<string, DomainTheme> = {
  "Conciencia Fonológica": {
    name: "Conciencia Fonológica",
    icon: Brain,
    color: "hsl(220, 90%, 56%)", // Blue
    bgColor: "hsl(220, 90%, 96%)",
    borderColor: "hsl(220, 90%, 80%)",
    order: 1,
  },
  "Fonética": {
    name: "Fonética",
    icon: Headphones,
    color: "hsl(340, 82%, 52%)", // Pink
    bgColor: "hsl(340, 82%, 96%)",
    borderColor: "hsl(340, 82%, 80%)",
    order: 2,
  },
  "Conciencia Silábica": {
    name: "Conciencia Silábica",
    icon: SplitSquareVertical,
    color: "hsl(160, 84%, 39%)", // Green
    bgColor: "hsl(160, 84%, 96%)",
    borderColor: "hsl(160, 84%, 70%)",
    order: 3,
  },
  "Vocabulario": {
    name: "Vocabulario",
    icon: BookOpen,
    color: "hsl(45, 93%, 47%)", // Yellow
    bgColor: "hsl(45, 93%, 96%)",
    borderColor: "hsl(45, 93%, 70%)",
    order: 4,
  },
  "Comprensión": {
    name: "Comprensión",
    icon: MessageSquare,
    color: "hsl(280, 65%, 60%)", // Purple
    bgColor: "hsl(280, 65%, 96%)",
    borderColor: "hsl(280, 65%, 80%)",
    order: 5,
  },
  // English equivalents
  "Phonological Awareness": {
    name: "Phonological Awareness",
    icon: Brain,
    color: "hsl(220, 90%, 56%)",
    bgColor: "hsl(220, 90%, 96%)",
    borderColor: "hsl(220, 90%, 80%)",
    order: 1,
  },
  "Phonics": {
    name: "Phonics",
    icon: Headphones,
    color: "hsl(340, 82%, 52%)",
    bgColor: "hsl(340, 82%, 96%)",
    borderColor: "hsl(340, 82%, 80%)",
    order: 2,
  },
  "Syllable Awareness": {
    name: "Syllable Awareness",
    icon: SplitSquareVertical,
    color: "hsl(160, 84%, 39%)",
    bgColor: "hsl(160, 84%, 96%)",
    borderColor: "hsl(160, 84%, 70%)",
    order: 3,
  },
  "Vocabulary": {
    name: "Vocabulary",
    icon: BookOpen,
    color: "hsl(45, 93%, 47%)",
    bgColor: "hsl(45, 93%, 96%)",
    borderColor: "hsl(45, 93%, 70%)",
    order: 4,
  },
  "Comprehension": {
    name: "Comprehension",
    icon: MessageSquare,
    color: "hsl(280, 65%, 60%)",
    bgColor: "hsl(280, 65%, 96%)",
    borderColor: "hsl(280, 65%, 80%)",
    order: 5,
  },
};

// Fallback theme for uncategorized domains
export const DEFAULT_DOMAIN_THEME: DomainTheme = {
  name: "General",
  icon: BookOpen,
  color: "hsl(var(--primary))",
  bgColor: "hsl(var(--primary) / 0.1)",
  borderColor: "hsl(var(--primary) / 0.3)",
  order: 999,
};

export function getDomainTheme(domainName: string): DomainTheme {
  return DOMAIN_THEMES[domainName] || DEFAULT_DOMAIN_THEME;
}
