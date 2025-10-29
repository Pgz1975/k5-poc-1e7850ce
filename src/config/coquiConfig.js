// Coquí mascot state configuration
export const coquiStates = {
  // Idle and neutral states - using animated webm
  idle: '/src/assets/coqui/coqui-animated.webm',
  neutral: '/src/assets/coqui/coqui-animated.webm',
  loading: '/src/assets/coqui/coqui-animated.webm',
  
  // Activity states
  thinking: '/assets/coqui/thinking.png',
  speaking: '/assets/coqui/speaking.png',
  recording: '/assets/coqui/speaking.png',
  reading: '/assets/coqui/reading_book.png',
  pointing: '/assets/coqui/pointing_at_text.png',
  exploring: '/assets/coqui/using_magnifying_glass.png',
  writing: '/assets/coqui/writing_taking_notes.png',
  
  // Feedback states
  correct: '/assets/coqui/happy.png',
  excellent: '/assets/coqui/excited.png',
  happy: '/assets/coqui/happy.png',
  excited: '/assets/coqui/excited.png',
  
  // Achievement states
  showingScore: '/assets/coqui/holding_up_score_card.png',
  score: '/assets/coqui/holding_up_score_card.png',
  dailyStreak: '/assets/coqui/wearing_gold_medal.png',
  levelComplete: '/assets/coqui/holding_trophy.png',
  gradeAdvancement: '/assets/coqui/graduation_cap_moment.png',
  graduation: '/assets/coqui/graduation_cap_moment.png',
  celebration: '/assets/coqui/confetti_celebration.png',
  perfectScore: '/assets/coqui/confetti_celebration.png',
  
  // Fallback
  default: '/src/assets/coqui/coqui-animated.webm',
};

// Animation classes for each state
export const coquiAnimations = {
  idle: '',
  neutral: '',
  loading: '',
  waiting: '',
  
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
  small: 'h-20 md:h-24',
  medium: 'h-28 md:h-32',
  reading: 'h-[150px]',
  default: 'h-[100px] md:h-[120px]',
  large: 'h-48 md:h-64',
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
