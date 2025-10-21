# Gamification Framework - K-5 Educational Platform

## Overview
This framework transforms learning into an engaging, game-like experience while maintaining educational rigor. Designed specifically for K-5 students (ages 5-11) in Puerto Rico with age-appropriate rewards and culturally relevant content.

## 1. Core Gamification Principles

### Design Philosophy
```typescript
export const gamificationPrinciples = {
  intrinsicMotivation: {
    principle: 'Foster love of learning, not just rewards',
    implementation: [
      'Celebrate progress, not just perfection',
      'Encourage curiosity and exploration',
      'Make learning feel like discovery',
      'Provide meaningful choices'
    ]
  },

  ageAppropriate: {
    principle: 'Match complexity to developmental stage',
    K1: 'Simple, visual rewards (stars, stickers)',
    grade2_3: 'Collections, badges, simple progression',
    grade4_5: 'Strategies, customization, social features'
  },

  culturalRelevance: {
    principle: 'Celebrate Puerto Rican identity',
    elements: [
      'Puerto Rico-themed badges and rewards',
      'Local landmarks as progression milestones',
      'Taíno cultural references',
      'Caribbean nature themes'
    ]
  },

  inclusivity: {
    principle: 'Everyone can succeed',
    implementation: [
      'Multiple paths to achievement',
      'Effort-based rewards alongside skill-based',
      'No public failure or punishment',
      'Celebrate diverse learning styles'
    ]
  }
};
```

## 2. Point System

### Point Structure

```typescript
export interface PointSystem {
  // Core activities
  activities: {
    readingExercise: {
      completion: 100,              // Base points for finishing
      perfectScore: 50,              // Bonus for 100% correct
      firstTry: 25,                  // Bonus for first attempt success
      improvement: 20,               // Bonus for beating previous score
      consistency: 10                // Daily reading bonus
    };

    comprehension: {
      correctAnswer: 20,             // Per correct answer
      perfectQuiz: 50,               // All questions correct
      thoughtfulAnswer: 10,          // Bonus for detailed responses
      quickAnswer: 5                 // Bonus for fast correct answers
    };

    pronunciation: {
      excellent90Plus: 50,           // 90%+ pronunciation
      good70to89: 30,                // 70-89% pronunciation
      passing60to69: 15,             // 60-69% pronunciation
      improvement: 20,               // Better than last attempt
      syllablesMastered: 10          // Per difficult syllable mastered
    };

    vocabulary: {
      newWordLearned: 15,            // Per new word in vocabulary
      wordMastered: 30,              // Word used correctly 5 times
      vocabularyMilestone: 100       // Every 10 words mastered
    };

    engagement: {
      dailyLogin: 10,                // Login bonus
      streakBonus: (days: number) => days * 5,  // Streak multiplier
      helpingOthers: 25,             // Peer reading session
      askingQuestions: 5             // Engagement with content
    };
  };

  // Multipliers
  multipliers: {
    streakDays: (days: number) => {
      if (days >= 30) return 2.0;    // 30+ days: 2x points
      if (days >= 14) return 1.5;    // 14-29 days: 1.5x
      if (days >= 7) return 1.25;    // 7-13 days: 1.25x
      return 1.0;                    // <7 days: 1x
    },

    levelMultiplier: (level: number) => {
      return 1 + (level * 0.1);      // 10% bonus per level
    },

    timeOfDay: {
      morning: 1.1,                  // Morning reading bonus
      afternoon: 1.0,
      evening: 1.0
    }
  };
}

// Calculate total points with multipliers
export const calculatePoints = (
  basePoints: number,
  streakDays: number,
  userLevel: number,
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): number => {
  let total = basePoints;

  // Apply streak multiplier
  total *= pointSystem.multipliers.streakDays(streakDays);

  // Apply level multiplier
  total *= pointSystem.multipliers.levelMultiplier(userLevel);

  // Apply time of day multiplier
  total *= pointSystem.multipliers.timeOfDay[timeOfDay];

  return Math.round(total);
};
```

### Points Display Component

```typescript
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

export const PointsDisplay: React.FC<{
  currentPoints: number;
  pointsEarned: number;
  multiplier: number;
  animated?: boolean;
}> = ({ currentPoints, pointsEarned, multiplier, animated = true }) => {
  return (
    <motion.div
      className="points-display bg-gradient-to-br from-sunnyYellow-100 to-sunnyYellow-50 rounded-2xl p-4 shadow-lg border-2 border-sunnyYellow-300"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Total Points */}
        <div className="flex items-center gap-2">
          <Star className="text-sunnyYellow-600 fill-sunnyYellow-600" size={32} />
          <div>
            <p className="text-xs text-sunnyYellow-700 font-medium">Puntos Totales</p>
            <motion.p
              className="text-3xl font-bold text-sunnyYellow-800"
              key={currentPoints}
              initial={animated ? { scale: 1.5 } : {}}
              animate={{ scale: 1 }}
            >
              {currentPoints.toLocaleString()}
            </motion.p>
          </div>
        </div>

        {/* Points Earned (if any) */}
        {pointsEarned > 0 && (
          <motion.div
            className="flex items-center gap-1 bg-success/20 rounded-full px-3 py-1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <TrendingUp className="text-success" size={16} />
            <span className="text-success font-bold">
              +{Math.round(pointsEarned * multiplier)}
            </span>
            {multiplier > 1 && (
              <span className="text-xs text-success/80">
                (x{multiplier})
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
```

## 3. Badges and Achievements

### Badge System

```typescript
export interface Badge {
  id: string;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  icon: string;  // Emoji or image path
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'reading' | 'pronunciation' | 'streak' | 'milestone' | 'cultural' | 'special';

  // Unlock criteria
  unlockCriteria: {
    type: 'count' | 'streak' | 'achievement' | 'time' | 'special';
    target: number;
    current?: number;
  };

  // Rewards
  rewards: {
    points: number;
    unlocks?: string[];  // What this badge unlocks
  };

  // Visual
  colors: {
    primary: string;
    secondary: string;
  };
}

export const badgeLibrary: Badge[] = [
  // Reading Badges
  {
    id: 'first-story',
    name: { es: 'Primera Historia', en: 'First Story' },
    description: { es: 'Completa tu primer ejercicio de lectura', en: 'Complete your first reading exercise' },
    icon: '📖',
    rarity: 'common',
    category: 'reading',
    unlockCriteria: { type: 'count', target: 1 },
    rewards: { points: 50 },
    colors: { primary: '#4DCA95', secondary: '#B3E8D1' }
  },
  {
    id: 'bookworm',
    name: { es: 'Ratón de Biblioteca', en: 'Bookworm' },
    description: { es: 'Lee 50 historias', en: 'Read 50 stories' },
    icon: '🐛📚',
    rarity: 'uncommon',
    category: 'reading',
    unlockCriteria: { type: 'count', target: 50 },
    rewards: { points: 500 },
    colors: { primary: '#00AC65', secondary: '#26BB7D' }
  },
  {
    id: 'library-master',
    name: { es: 'Maestro de Biblioteca', en: 'Library Master' },
    description: { es: 'Lee 200 historias', en: 'Read 200 stories' },
    icon: '🏆📚',
    rarity: 'epic',
    category: 'reading',
    unlockCriteria: { type: 'count', target: 200 },
    rewards: { points: 2000, unlocks: ['custom-avatar'] },
    colors: { primary: '#FFB74D', secondary: '#FDD835' }
  },

  // Streak Badges
  {
    id: 'on-fire',
    name: { es: 'En Fuego', en: 'On Fire' },
    description: { es: '7 días seguidos', en: '7 days in a row' },
    icon: '🔥',
    rarity: 'uncommon',
    category: 'streak',
    unlockCriteria: { type: 'streak', target: 7 },
    rewards: { points: 200 },
    colors: { primary: '#FF9800', secondary: '#FFB74D' }
  },
  {
    id: 'unstoppable',
    name: { es: 'Imparable', en: 'Unstoppable' },
    description: { es: '30 días seguidos', en: '30 days in a row' },
    icon: '⚡🔥',
    rarity: 'rare',
    category: 'streak',
    unlockCriteria: { type: 'streak', target: 30 },
    rewards: { points: 1000 },
    colors: { primary: '#F57C00', secondary: '#FF9800' }
  },
  {
    id: 'legendary-streak',
    name: { es: 'Racha Legendaria', en: 'Legendary Streak' },
    description: { es: '100 días seguidos', en: '100 days in a row' },
    icon: '👑🔥',
    rarity: 'legendary',
    category: 'streak',
    unlockCriteria: { type: 'streak', target: 100 },
    rewards: { points: 5000, unlocks: ['legendary-avatar', 'special-theme'] },
    colors: { primary: '#9C27B0', secondary: '#BA68C8' }
  },

  // Pronunciation Badges
  {
    id: 'clear-speaker',
    name: { es: 'Hablador Claro', en: 'Clear Speaker' },
    description: { es: 'Logra 90% de precisión 10 veces', en: 'Achieve 90% accuracy 10 times' },
    icon: '🎤✨',
    rarity: 'uncommon',
    category: 'pronunciation',
    unlockCriteria: { type: 'achievement', target: 10 },
    rewards: { points: 300 },
    colors: { primary: '#009EFF', secondary: '#4DBEFF' }
  },
  {
    id: 'pronunciation-master',
    name: { es: 'Maestro de Pronunciación', en: 'Pronunciation Master' },
    description: { es: '100% de precisión 5 veces', en: '100% accuracy 5 times' },
    icon: '🎯🎤',
    rarity: 'rare',
    category: 'pronunciation',
    unlockCriteria: { type: 'achievement', target: 5 },
    rewards: { points: 800 },
    colors: { primary: '#0088E0', secondary: '#009EFF' }
  },

  // Cultural Badges (Puerto Rico themed)
  {
    id: 'coqui-friend',
    name: { es: 'Amigo del Coquí', en: 'Coquí Friend' },
    description: { es: 'Completa todas las lecciones sobre el coquí', en: 'Complete all coquí lessons' },
    icon: '🐸💚',
    rarity: 'uncommon',
    category: 'cultural',
    unlockCriteria: { type: 'special', target: 1 },
    rewards: { points: 400, unlocks: ['coqui-sounds'] },
    colors: { primary: '#00AC65', secondary: '#26BB7D' }
  },
  {
    id: 'el-yunque-explorer',
    name: { es: 'Explorador de El Yunque', en: 'El Yunque Explorer' },
    description: { es: 'Lee todas las historias sobre El Yunque', en: 'Read all El Yunque stories' },
    icon: '🌴🏞️',
    rarity: 'rare',
    category: 'cultural',
    unlockCriteria: { type: 'special', target: 1 },
    rewards: { points: 600 },
    colors: { primary: '#4CAF50', secondary: '#81C784' }
  },
  {
    id: 'borinquen-pride',
    name: { es: 'Orgullo Borinqueño', en: 'Borinquen Pride' },
    description: { es: 'Aprende sobre toda la historia de Puerto Rico', en: 'Learn all Puerto Rico history' },
    icon: '🇵🇷❤️',
    rarity: 'epic',
    category: 'cultural',
    unlockCriteria: { type: 'special', target: 1 },
    rewards: { points: 1500, unlocks: ['pr-flag-theme'] },
    colors: { primary: '#FF5252', secondary: '#4D82FF' }
  },

  // Special Event Badges
  {
    id: 'early-bird',
    name: { es: 'Madrugador', en: 'Early Bird' },
    description: { es: 'Lee antes de las 8am 10 veces', en: 'Read before 8am 10 times' },
    icon: '🌅📖',
    rarity: 'uncommon',
    category: 'special',
    unlockCriteria: { type: 'time', target: 10 },
    rewards: { points: 250 },
    colors: { primary: '#FFEB3B', secondary: '#FFF59D' }
  },
  {
    id: 'night-owl',
    name: { es: 'Búho Nocturno', en: 'Night Owl' },
    description: { es: 'Lee después de las 8pm 10 veces', en: 'Read after 8pm 10 times' },
    icon: '🦉🌙',
    rarity: 'uncommon',
    category: 'special',
    unlockCriteria: { type: 'time', target: 10 },
    rewards: { points: 250 },
    colors: { primary: '#5C6BC0', secondary: '#9FA8DA' }
  }
];
```

### Badge Display Component

```typescript
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export const BadgeCard: React.FC<{
  badge: Badge;
  unlocked: boolean;
  progress?: number;
}> = ({ badge, unlocked, progress = 0 }) => {
  const rarityColors = {
    common: 'from-neutral-300 to-neutral-400',
    uncommon: 'from-coquiGreen-400 to-coquiGreen-500',
    rare: 'from-caribbeanBlue-400 to-caribbeanBlue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 via-orange-500 to-red-500'
  };

  return (
    <motion.div
      className={`
        badge-card relative rounded-2xl p-4
        ${unlocked ? 'cursor-pointer' : 'opacity-60'}
        bg-gradient-to-br ${rarityColors[badge.rarity]}
        shadow-lg hover:shadow-xl
        transition-shadow duration-200
      `}
      whileHover={unlocked ? { scale: 1.05, rotate: 2 } : {}}
      whileTap={unlocked ? { scale: 0.95 } : {}}
    >
      {/* Badge Icon */}
      <div className="text-center mb-3">
        <motion.div
          className="text-6xl"
          animate={unlocked ? {
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 0.5,
            repeat: unlocked ? Infinity : 0,
            repeatDelay: 3
          }}
        >
          {unlocked ? badge.icon : <Lock className="mx-auto text-white" size={48} />}
        </motion.div>
      </div>

      {/* Badge Name */}
      <h4 className="text-white font-bold text-center mb-2">
        {badge.name.es}
      </h4>

      {/* Progress (if locked) */}
      {!unlocked && badge.unlockCriteria.current !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/90 mb-1">
            <span>Progreso</span>
            <span>{badge.unlockCriteria.current}/{badge.unlockCriteria.target}</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${(badge.unlockCriteria.current / badge.unlockCriteria.target) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Points Reward */}
      <div className="mt-2 text-center">
        <span className="text-white/90 text-sm font-medium">
          +{badge.rewards.points} puntos
        </span>
      </div>

      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        <div className="bg-white/30 backdrop-blur rounded-full px-2 py-0.5">
          <span className="text-xs text-white font-bold uppercase">
            {badge.rarity}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Badge Collection Grid
export const BadgeCollection: React.FC<{
  badges: Badge[];
  unlockedIds: string[];
  userProgress: Map<string, number>;
}> = ({ badges, unlockedIds, userProgress }) => {
  const categories = ['reading', 'pronunciation', 'streak', 'cultural', 'special'];

  return (
    <div className="badge-collection space-y-8">
      {categories.map(category => {
        const categoryBadges = badges.filter(b => b.category === category);
        const unlocked = categoryBadges.filter(b => unlockedIds.includes(b.id)).length;

        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-neutral-900 capitalize">
                {category}
              </h3>
              <span className="text-lg text-neutral-600">
                {unlocked}/{categoryBadges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={{
                    ...badge,
                    unlockCriteria: {
                      ...badge.unlockCriteria,
                      current: userProgress.get(badge.id) || 0
                    }
                  }}
                  unlocked={unlockedIds.includes(badge.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

## 4. Progress Visualization

### Level System

```typescript
export interface LevelSystem {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;

  // Level configuration
  levelConfig: {
    baseXP: 1000;                    // XP needed for level 2
    scalingFactor: 1.2;               // Each level requires 20% more XP
    maxLevel: 50;
  };
}

// Calculate XP needed for level
export const calculateXPForLevel = (level: number): number => {
  const { baseXP, scalingFactor } = levelConfig;
  return Math.round(baseXP * Math.pow(scalingFactor, level - 1));
};

// Level rewards
export const getLevelRewards = (level: number): LevelReward => {
  const rewards: LevelReward = {
    points: level * 100,
    badges: [],
    unlocks: []
  };

  // Milestone rewards
  if (level === 5) rewards.unlocks.push('custom-coqui-color');
  if (level === 10) rewards.badges.push('level-10-badge');
  if (level === 15) rewards.unlocks.push('advanced-exercises');
  if (level === 20) rewards.badges.push('level-20-badge');
  if (level === 25) rewards.unlocks.push('peer-reading');
  if (level === 30) rewards.badges.push('level-30-badge');
  if (level === 50) rewards.badges.push('max-level-badge');

  return rewards;
};
```

### Level Progress Bar

```typescript
export const LevelProgressBar: React.FC<{
  level: number;
  currentXP: number;
  xpToNext: number;
}> = ({ level, currentXP, xpToNext }) => {
  const percentage = (currentXP / xpToNext) * 100;

  return (
    <div className="level-progress bg-white rounded-3xl p-6 shadow-lg">
      {/* Level Display */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-neutral-600">Nivel Actual</p>
          <motion.h2
            className="text-5xl font-bold text-coquiGreen-600"
            key={level}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {level}
          </motion.h2>
        </div>

        <div className="text-right">
          <p className="text-sm text-neutral-600">Próximo Nivel</p>
          <p className="text-2xl font-bold text-neutral-900">{level + 1}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-8 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-coquiGreen-500 via-caribbeanBlue-500 to-sunnyYellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* XP Counter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {currentXP.toLocaleString()} / {xpToNext.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Next Reward Preview */}
      <div className="mt-4 text-center">
        <p className="text-sm text-neutral-600">Próxima recompensa:</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Star className="text-sunnyYellow-500 fill-sunnyYellow-500" size={20} />
          <span className="font-semibold text-neutral-900">
            +{(level + 1) * 100} puntos
          </span>
        </div>
      </div>
    </div>
  );
};
```

## 5. Daily Streaks & Challenges

### Streak System

```typescript
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: Date[];

  // Streak rewards
  milestones: {
    7: { completed: boolean; points: 200 };
    14: { completed: boolean; points: 500 };
    30: { completed: boolean; points: 1000 };
    60: { completed: boolean; points: 2500 };
    100: { completed: boolean; points: 5000 };
  };
}

// Streak visualization
export const StreakDisplay: React.FC<{ streakData: StreakData }> = ({
  streakData
}) => {
  const nextMilestone = [7, 14, 30, 60, 100].find(
    m => m > streakData.currentStreak
  ) || 100;

  return (
    <div className="streak-display bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl p-6 shadow-lg border-2 border-orange-300">
      {/* Flame Icon with Count */}
      <div className="text-center mb-4">
        <motion.div
          className="text-7xl inline-block"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-5, 5, -5]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}
        >
          🔥
        </motion.div>
        <h2 className="text-5xl font-bold text-orange-600 mt-2">
          {streakData.currentStreak}
        </h2>
        <p className="text-lg text-orange-700 font-medium">
          días seguidos
        </p>
      </div>

      {/* Progress to Next Milestone */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-orange-700 mb-2">
          <span>Próxima meta</span>
          <span>{nextMilestone} días</span>
        </div>
        <div className="h-3 bg-orange-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{
              width: `${(streakData.currentStreak / nextMilestone) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Record */}
      <div className="text-center text-sm text-orange-600">
        <span className="font-medium">Récord personal: </span>
        <span className="font-bold">{streakData.longestStreak} días 🏆</span>
      </div>
    </div>
  );
};
```

### Daily Challenges

```typescript
export interface DailyChallenge {
  id: string;
  date: string;
  challenges: {
    id: string;
    type: 'reading' | 'pronunciation' | 'vocabulary' | 'comprehension';
    title: { es: string; en: string };
    description: { es: string; en: string };
    target: number;
    current: number;
    reward: number;
    completed: boolean;
    icon: string;
  }[];
}

// Daily challenge card
export const DailyChallengeCard: React.FC<{
  challenge: DailyChallenge['challenges'][0];
  onStart: () => void;
}> = ({ challenge, onStart }) => {
  const progress = (challenge.current / challenge.target) * 100;

  return (
    <motion.div
      className={`
        challenge-card rounded-2xl p-4
        ${challenge.completed
          ? 'bg-success/20 border-2 border-success'
          : 'bg-white border-2 border-neutral-200'
        }
        shadow-md hover:shadow-lg
        transition-shadow
      `}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl">{challenge.icon}</div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-bold text-lg text-neutral-900 mb-1">
            {challenge.title.es}
          </h4>
          <p className="text-sm text-neutral-600 mb-3">
            {challenge.description.es}
          </p>

          {/* Progress */}
          {!challenge.completed && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Progreso</span>
                <span>{challenge.current}/{challenge.target}</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-coquiGreen-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {challenge.completed ? (
            <div className="flex items-center gap-2 text-success font-semibold">
              <span>✓ Completado</span>
              <span className="text-sm">+{challenge.reward} pts</span>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="btn-sm bg-coquiGreen-500 hover:bg-coquiGreen-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Empezar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
```

## 6. Virtual Rewards & Collectibles

### Collectible System

```typescript
export interface Collectible {
  id: string;
  category: 'coqui-variants' | 'backgrounds' | 'stickers' | 'themes' | 'sounds';
  name: { es: string; en: string };
  preview: string;  // Image URL
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  unlockMethod: {
    type: 'points' | 'level' | 'badge' | 'streak' | 'special';
    requirement: string | number;
  };

  unlocked: boolean;
  dateUnlocked?: string;
}

// Coquí color variants
export const coquiVariants: Collectible[] = [
  {
    id: 'coqui-green',
    category: 'coqui-variants',
    name: { es: 'Coquí Verde', en: 'Green Coquí' },
    preview: '/collectibles/coqui-green.svg',
    rarity: 'common',
    unlockMethod: { type: 'level', requirement: 1 },
    unlocked: true  // Default
  },
  {
    id: 'coqui-blue',
    category: 'coqui-variants',
    name: { es: 'Coquí Azul', en: 'Blue Coquí' },
    preview: '/collectibles/coqui-blue.svg',
    rarity: 'uncommon',
    unlockMethod: { type: 'level', requirement: 5 },
    unlocked: false
  },
  {
    id: 'coqui-gold',
    category: 'coqui-variants',
    name: { es: 'Coquí Dorado', en: 'Golden Coquí' },
    preview: '/collectibles/coqui-gold.svg',
    rarity: 'epic',
    unlockMethod: { type: 'level', requirement: 25 },
    unlocked: false
  },
  {
    id: 'coqui-rainbow',
    category: 'coqui-variants',
    name: { es: 'Coquí Arcoíris', en: 'Rainbow Coquí' },
    preview: '/collectibles/coqui-rainbow.svg',
    rarity: 'legendary',
    unlockMethod: { type: 'streak', requirement: 100 },
    unlocked: false
  }
];

// Background themes
export const backgroundThemes: Collectible[] = [
  {
    id: 'el-yunque',
    category: 'backgrounds',
    name: { es: 'El Yunque', en: 'El Yunque' },
    preview: '/collectibles/bg-el-yunque.jpg',
    rarity: 'uncommon',
    unlockMethod: { type: 'badge', requirement: 'el-yunque-explorer' },
    unlocked: false
  },
  {
    id: 'beach',
    category: 'backgrounds',
    name: { es: 'Playa', en: 'Beach' },
    preview: '/collectibles/bg-beach.jpg',
    rarity: 'common',
    unlockMethod: { type: 'points', requirement: 5000 },
    unlocked: false
  }
];
```

## 7. Leaderboards (Privacy-Conscious)

### Safe Leaderboard Design

```typescript
export interface LeaderboardEntry {
  // No real names or identifying information
  displayName: string;  // Auto-generated fun names
  avatar: string;       // Coquí variant
  score: number;
  rank: number;
  isCurrentUser: boolean;
}

// Generate safe, fun display names
const animalNames = ['Coquí', 'Iguana', 'Parrot', 'Dolphin', 'Turtle'];
const adjectives = ['Happy', 'Smart', 'Fast', 'Brave', 'Clever'];

export const generateDisplayName = (userId: string): string => {
  const hash = userId.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const animal = animalNames[Math.abs(hash) % animalNames.length];
  const adj = adjectives[Math.abs(hash >> 8) % adjectives.length];
  return `${adj} ${animal}`;
};

// Leaderboard component (classroom-only, opt-in)
export const ClassroomLeaderboard: React.FC<{
  entries: LeaderboardEntry[];
  timeframe: 'daily' | 'weekly' | 'monthly';
}> = ({ entries, timeframe }) => {
  return (
    <div className="leaderboard bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-neutral-900 mb-4">
        Top Lectores - {timeframe}
      </h3>

      <div className="space-y-3">
        {entries.slice(0, 10).map((entry, index) => (
          <motion.div
            key={entry.displayName}
            className={`
              flex items-center gap-4 p-3 rounded-xl
              ${entry.isCurrentUser ? 'bg-coquiGreen-100 border-2 border-coquiGreen-500' : 'bg-neutral-50'}
            `}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {entry.rank <= 3 ? (
                <span className="text-2xl">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="text-lg font-bold text-neutral-600">
                  #{entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12">
              <img src={entry.avatar} alt="" className="w-full h-full" />
            </div>

            {/* Name */}
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">
                {entry.displayName}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-sm text-coquiGreen-600">(Tú)</span>
                )}
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="text-xl font-bold text-coquiGreen-600">
                {entry.score.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-600">puntos</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Point system implementation
- [ ] Level calculation logic
- [ ] Basic progress tracking
- [ ] Points display components

### Phase 2: Badges & Achievements (Weeks 3-4)
- [ ] Badge system implementation
- [ ] Achievement tracking
- [ ] Badge unlock animations
- [ ] Badge collection UI

### Phase 3: Engagement Features (Weeks 5-6)
- [ ] Daily streak system
- [ ] Daily challenges
- [ ] Challenge completion flow
- [ ] Streak visualization

### Phase 4: Collectibles (Weeks 7-8)
- [ ] Coquí variants
- [ ] Background themes
- [ ] Unlock system
- [ ] Collection gallery

### Phase 5: Social Features (Weeks 9-10)
- [ ] Safe leaderboards
- [ ] Peer reading features
- [ ] Parent/teacher views
- [ ] Privacy controls

## 9. Success Metrics

1. **Engagement**: 70%+ daily return rate
2. **Streaks**: 40%+ maintain 7-day streaks
3. **Completion**: 60%+ complete daily challenges
4. **Collection**: 80%+ unlock at least 5 collectibles
5. **Fun Factor**: 90%+ report enjoying the rewards
6. **Learning**: Rewards don't distract from learning objectives
7. **Privacy**: 100% COPPA compliance
8. **Accessibility**: All features work with assistive technologies

---

This gamification framework balances fun and engagement with educational goals while respecting children's privacy and developmental needs.
