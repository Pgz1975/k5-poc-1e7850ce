// Coquí mascot state configuration
export const coquiStates = {
  // Idle and neutral states
  idle: '/assets/coqui/waiting.webp',
  neutral: '/assets/coqui/neutral_waiting.webp',
  loading: '/assets/coqui/waiting.webp',
  
  // Activity states
  thinking: '/assets/coqui/thinking.webp',
  speaking: '/assets/coqui/speaking.webp',
  recording: '/assets/coqui/speaking.webp',
  reading: '/assets/coqui/reading_book.webp',
  pointing: '/assets/coqui/pointing_at_text.webp',
  exploring: '/assets/coqui/using_magnifying_glass.webp',
  writing: '/assets/coqui/writing_taking_notes.webp',
  
  // Feedback states
  correct: '/assets/coqui/happy.webp',
  excellent: '/assets/coqui/excited.webp',
  happy: '/assets/coqui/happy.webp',
  excited: '/assets/coqui/excited.webp',
  
  // Achievement states
  showingScore: '/assets/coqui/holding_up_score_card.webp',
  dailyStreak: '/assets/coqui/wearing_gold_medal.webp',
  levelComplete: '/assets/coqui/holding_trophy.webp',
  gradeAdvancement: '/assets/coqui/graduation_cap_moment.webp',
  celebration: '/assets/coqui/confetti_celebration.webp',
  perfectScore: '/assets/coqui/confetti_celebration.webp',
  
  // Fallback
  default: '/assets/coqui/coqui.webp',
};

// Animation classes for each state
export const coquiAnimations = {
  idle: 'animate-breathe',
  neutral: 'animate-breathe',
  loading: 'animate-breathe',
  waiting: 'animate-breathe',
  
  thinking: 'animate-pulse',
  
  happy: 'animate-bounce-once',
  correct: 'animate-bounce-once',
  excited: 'animate-bounce-once',
  excellent: 'animate-bounce-once',
  
  celebration: 'animate-jump',
  perfectScore: 'animate-jump',
  levelComplete: 'animate-jump',
  gradeAdvancement: 'animate-jump',
  dailyStreak: 'animate-jump',
};

// Size presets
export const coquiSizes = {
  small: 'h-20',
  medium: 'h-24 md:h-28',
  default: 'h-[100px] md:h-[120px]',
  large: 'h-32 md:h-40',
};

// Position presets
export const coquiPositions = {
  'bottom-right': 'fixed bottom-5 right-5',
  'bottom-left': 'fixed bottom-5 left-5',
  'top-right': 'fixed top-5 right-5',
  'top-left': 'fixed top-5 left-5',
  'bottom-center': 'fixed bottom-5 left-1/2 -translate-x-1/2',
  'inline': 'relative',
};
