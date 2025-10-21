# Coquí Mascot Integration - Complete Implementation Guide

## Overview
The Coquí (Eleutherodactylus coqui) is Puerto Rico's beloved tree frog and serves as the friendly AI companion throughout the K-5 learning journey. This document details the complete integration strategy for bringing Coquí to life in the educational platform.

## 1. Cultural Significance

### The Coquí as Puerto Rican Symbol
```markdown
**Biological Facts:**
- Endemic to Puerto Rico (found nowhere else naturally)
- Small tree frog (1-2 inches)
- Named after its distinctive "co-quí" sound
- Active at night, calls from dusk to dawn
- Lives primarily in El Yunque rainforest

**Cultural Importance:**
- National symbol of Puerto Rico
- Represents resilience and adaptation
- Sound is nostalgic for Puerto Ricans worldwide
- Featured in folklore and children's stories
- Symbol of environmental conservation
```

### Educational Value
```typescript
export const coquiEducationalValue = {
  identity: {
    purpose: 'Connect children to Puerto Rican heritage',
    implementation: 'Coquí shares facts about Puerto Rico during interactions',
    examples: [
      'Did you know El Yunque is my home?',
      'We coquís are found only in Puerto Rico!',
      'Listen to how I sing: co-quí, co-quí!'
    ]
  },

  science: {
    purpose: 'Teach ecology and biology naturally',
    topics: ['Rainforest ecosystem', 'Amphibian life cycle', 'Biodiversity', 'Conservation'],
    integration: 'Subtle references during reading exercises'
  },

  pride: {
    purpose: 'Build cultural confidence',
    approach: 'Coquí expresses pride in Puerto Rican identity',
    impact: 'Students associate learning with cultural heritage'
  }
};
```

## 2. Character Design Specifications

### Visual Design Assets

```typescript
export const coquiDesignAssets = {
  // SVG/Vector format for crisp rendering at all sizes
  mainCharacter: {
    format: 'SVG (primary), PNG fallback',
    colorMode: 'Full color with gradients',
    style: 'Cartoon, chibi-proportions',
    viewAngles: [
      'front',      // Main view (90% of use)
      'side-left',  // Movement animations
      'side-right', // Movement animations
      '3-quarter',  // Dynamic poses
      'back'        // Rare, special animations
    ]
  },

  bodyProportions: {
    head: '50% of total height',     // Cute, child-friendly
    body: '40% of total height',
    legs: '10% of total height',
    eyes: '30% of head width',       // Large, expressive
    mouth: 'Wide, stretchy for expressions',
    limbs: 'Short, rounded, webbed fingers/toes'
  },

  colorPalette: {
    primaryGreen: '#00AC65',         // Main body color
    accentGreen: '#26BB7D',          // Lighter areas (belly, inner limbs)
    darkGreen: '#008049',            // Shadows, depth
    eyeWhite: '#FFFFFF',
    eyeIris: '#4DBEFF',              // Caribbean blue
    eyePupil: '#212121',
    highlight: '#FFFFFF',            // Shiny spots on skin
    blush: '#FF9800',                // Cheeks when happy/excited
    tongue: '#FF5252'                // When showing tongue (playful)
  },

  textureDetails: {
    skin: 'Smooth gradient with subtle texture overlay',
    shine: 'Glossy highlights on head, back, arms',
    shadow: 'Soft drop shadow for depth',
    outline: '2-3px dark green stroke for clarity'
  }
};
```

### Expression Library

```typescript
export const coquiExpressions = {
  eyes: {
    neutral: {
      shape: 'Large circles, pupils centered',
      sparkle: 'Single highlight top-right',
      eyelids: 'Relaxed, visible'
    },
    happy: {
      shape: 'Slight upward curve (smile)',
      sparkle: 'Double highlights (extra sparkle)',
      eyelids: 'Relaxed, crescent moon shape when smiling'
    },
    excited: {
      shape: 'Extra large, pupils dilated',
      sparkle: 'Multiple highlights, starbursts',
      eyelids: 'Fully open, very animated'
    },
    thinking: {
      shape: 'One eye squinted, one normal',
      sparkle: 'Question mark reflection',
      eyelids: 'Asymmetric, contemplative'
    },
    encouraging: {
      shape: 'Soft, warm gaze',
      sparkle: 'Gentle glow',
      eyelids: 'Slight droop, kind expression'
    },
    listening: {
      shape: 'Focused, pupils slightly left/right toward sound',
      sparkle: 'Sound wave reflection',
      eyelids: 'Alert, attentive'
    },
    sleeping: {
      shape: 'Closed, peaceful',
      sparkle: 'None (eyes closed)',
      eyelids: 'Gentle Z\'s floating above'
    }
  },

  mouth: {
    neutral: 'Small, content smile',
    happy: 'Wide grin, showing no teeth (frogs don\'t have teeth!)',
    excited: 'Open smile, "o" shape',
    speaking: 'Animated shapes matching phonemes (A, E, I, O, U)',
    thinking: 'Small, pursed to one side',
    encouraging: 'Warm, gentle smile',
    singing: 'Open wide, "co-quí" shape with sound waves'
  },

  bodyLanguage: {
    neutral: {
      pose: 'Sitting upright, hands resting on belly',
      posture: 'Relaxed, slight forward lean',
      arms: 'Down by sides or folded on belly',
      legs: 'Tucked under body in sitting position'
    },
    happy: {
      pose: 'Slight bounce, arms slightly raised',
      posture: 'Upright, energetic',
      arms: 'Raised in mini-celebration',
      legs: 'Ready to hop'
    },
    excited: {
      pose: 'Mid-jump, arms fully extended up',
      posture: 'Dynamic, airborne',
      arms: 'Victory pose, hands open wide',
      legs: 'Extended downward, showing webbed feet'
    },
    thinking: {
      pose: 'Sitting, hand on chin',
      posture: 'Slight head tilt',
      arms: 'One hand on chin, other on belly',
      legs: 'Crossed (if visible)'
    },
    encouraging: {
      pose: 'Leaning forward, open arms',
      posture: 'Welcoming, supportive',
      arms: 'Extended toward viewer',
      legs: 'Stable stance'
    },
    listening: {
      pose: 'Leaning forward, hand cupped behind ear',
      posture: 'Alert, focused',
      arms: 'One hand to ear',
      legs: 'Balanced, ready'
    }
  }
};
```

## 3. Animation Implementation

### Framer Motion Animations

```typescript
import { motion } from 'framer-motion';

// Base Coquí component with state-based animations
export const CoquiMascot: React.FC<CoquiProps> = ({
  state = 'neutral',
  size = 'medium',
  position = 'inline',
  onAnimationComplete,
  showSpeechBubble = false,
  speechText = ''
}) => {
  const animations = {
    neutral: {
      y: [0, -5, 0],           // Gentle breathing
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut'
      }
    },

    happy: {
      y: [0, -20, 0, -10, 0],  // Happy bounces
      scale: [1, 1.1, 1, 1.05, 1],
      rotate: [0, -5, 5, -3, 0],
      transition: {
        duration: 1.5,
        ease: 'easeOut',
        times: [0, 0.3, 0.5, 0.7, 1]
      }
    },

    excited: {
      y: [0, -40, -10, -35, 0],  // Big jumps
      scale: [1, 1.2, 1.1, 1.15, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: {
        duration: 2,
        ease: [0.68, -0.55, 0.265, 1.55], // Bouncy
        times: [0, 0.3, 0.5, 0.7, 1]
      }
    },

    celebration: {
      scale: [1, 1.3, 1.1, 1.2, 1],
      rotate: [0, 360],          // Full spin!
      transition: {
        duration: 3,
        ease: 'easeInOut'
      }
    },

    thinking: {
      rotate: [-3, 3, -3],       // Gentle rock
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    },

    speaking: {
      scale: [1, 1.05, 1, 1.03, 1], // Subtle bounce with words
      transition: {
        repeat: Infinity,
        duration: 0.5,
        ease: 'easeInOut'
      }
    },

    listening: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0px rgba(0, 172, 101, 0.4)',
        '0 0 0 20px rgba(0, 172, 101, 0)',
        '0 0 0 0px rgba(0, 172, 101, 0)'
      ],  // Pulsing glow
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className={`coqui-container relative ${getSizeClass(size)}`}>
      <motion.div
        className="coqui-character"
        {...animations[state]}
        onAnimationComplete={onAnimationComplete}
      >
        <CoquiSVG state={state} />
        {showParticles(state) && <ParticleEffects state={state} />}
      </motion.div>

      {showSpeechBubble && (
        <SpeechBubble text={speechText} position={position} />
      )}
    </div>
  );
};
```

### Particle Effects

```typescript
// Confetti for celebrations
export const CelebrationParticles: React.FC = () => {
  return (
    <motion.div className="particle-container absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: Math.random() * 200 - 100,
            y: Math.random() * -200 - 50,
            scale: [0, 1, 0],
            rotate: Math.random() * 360,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
        >
          {['⭐', '✨', '🎉', '🎊', '⚡'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Sound waves for listening/speaking
export const SoundWaves: React.FC = () => {
  return (
    <motion.div className="sound-waves absolute">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="sound-wave"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 2],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeOut'
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '3px solid rgba(0, 172, 101, 0.5)',
            borderRadius: '50%',
            top: 0,
            left: 0
          }}
        />
      ))}
    </motion.div>
  );
};
```

## 4. Voice and Sound Design

### Coquí Voice Lines

```typescript
export const coquiVoiceSystem = {
  // Audio file organization
  audioFiles: {
    structure: '/sounds/coqui/{language}/{category}/{file}.mp3',
    languages: ['es', 'en'],
    categories: [
      'greetings',
      'encouragement',
      'celebration',
      'support',
      'instructions',
      'feedback',
      'transitions'
    ]
  },

  // Voice characteristics
  voiceProfile: {
    spanish: {
      accent: 'Puerto Rican Spanish',
      tone: 'Friendly, enthusiastic, clear',
      pace: 'Moderate (age-appropriate)',
      pitch: 'Medium-high (friendly, not childish)',
      characteristics: 'Warm, patient, encouraging'
    },
    english: {
      accent: 'Standard American English',
      tone: 'Friendly, enthusiastic, clear',
      pace: 'Moderate (ELL-appropriate)',
      pitch: 'Medium-high (friendly)',
      characteristics: 'Warm, patient, encouraging'
    }
  },

  // Actual voice line examples
  voiceLines: {
    spanish: {
      greetings: {
        morning: [
          { text: '¡Buenos días, amiguito!', audio: 'buenos-dias.mp3', duration: 2000 },
          { text: '¡Hola! ¿Listo para aprender?', audio: 'hola-listo.mp3', duration: 2500 },
          { text: '¡Qué bueno verte!', audio: 'bueno-verte.mp3', duration: 1800 }
        ],
        afternoon: [
          { text: '¡Buenas tardes!', audio: 'buenas-tardes.mp3', duration: 1800 },
          { text: '¡Hola! ¿Cómo estás?', audio: 'hola-como-estas.mp3', duration: 2200 }
        ],
        anytime: [
          { text: '¡Co-quí! ¡Bienvenido!', audio: 'coqui-bienvenido.mp3', duration: 2000 },
          { text: '¡Me alegra verte!', audio: 'alegra-verte.mp3', duration: 1800 }
        ]
      },

      encouragement: {
        during: [
          { text: '¡Muy bien!', audio: 'muy-bien.mp3', duration: 1500 },
          { text: '¡Sigue así!', audio: 'sigue-asi.mp3', duration: 1500 },
          { text: '¡Excelente!', audio: 'excelente.mp3', duration: 1500 },
          { text: '¡Tú puedes!', audio: 'tu-puedes.mp3', duration: 1500 },
          { text: '¡Lo estás logrando!', audio: 'estas-logrando.mp3', duration: 2000 }
        ],
        struggle: [
          { text: 'Intentemos otra vez', audio: 'otra-vez.mp3', duration: 2000 },
          { text: 'Casi lo tienes', audio: 'casi-lo-tienes.mp3', duration: 1800 },
          { text: 'No te rindas, vas bien', audio: 'no-te-rindas.mp3', duration: 2500 }
        ]
      },

      celebration: {
        good: [
          { text: '¡Fantástico!', audio: 'fantastico.mp3', duration: 2000 },
          { text: '¡Increíble!', audio: 'increible.mp3', duration: 1800 },
          { text: '¡Lo lograste!', audio: 'lo-lograste.mp3', duration: 2000 }
        ],
        perfect: [
          { text: '¡Perfecto! ¡Co-quí!', audio: 'perfecto-coqui.mp3', duration: 2500 },
          { text: '¡Eres una estrella!', audio: 'eres-estrella.mp3', duration: 2200 },
          { text: '¡Wow! ¡Impresionante!', audio: 'wow-impresionante.mp3', duration: 2500 }
        ],
        milestone: [
          { text: '¡Mira cuánto has aprendido!', audio: 'cuanto-aprendido.mp3', duration: 3000 },
          { text: '¡Subiste de nivel!', audio: 'subiste-nivel.mp3', duration: 2500 },
          { text: '¡Ganaste una estrella!', audio: 'ganaste-estrella.mp3', duration: 2500 }
        ]
      },

      instructions: {
        reading: [
          { text: 'Vamos a leer juntos', audio: 'leer-juntos.mp3', duration: 2500 },
          { text: 'Lee esta palabra', audio: 'lee-palabra.mp3', duration: 2000 },
          { text: 'Escucha y repite', audio: 'escucha-repite.mp3', duration: 2200 }
        ],
        quiz: [
          { text: '¿Cuál es la respuesta correcta?', audio: 'respuesta-correcta.mp3', duration: 2800 },
          { text: 'Elige una opción', audio: 'elige-opcion.mp3', duration: 2000 },
          { text: 'Piensa bien', audio: 'piensa-bien.mp3', duration: 1800 }
        ]
      },

      feedback: {
        correct: [
          { text: '¡Correcto!', audio: 'correcto.mp3', duration: 1500 },
          { text: '¡Sí! ¡Esa es!', audio: 'si-esa-es.mp3', duration: 1800 },
          { text: '¡Exacto!', audio: 'exacto.mp3', duration: 1500 }
        ],
        incorrect: [
          { text: 'Mmm, no exactamente', audio: 'no-exactamente.mp3', duration: 2500 },
          { text: 'Inténtalo de nuevo', audio: 'intentalo-nuevo.mp3', duration: 2200 },
          { text: 'Casi, pero no es esa', audio: 'casi-no-esa.mp3', duration: 2500 }
        ],
        hint: [
          { text: 'Te doy una pista', audio: 'doy-pista.mp3', duration: 2000 },
          { text: 'Piensa en...', audio: 'piensa-en.mp3', duration: 1800 },
          { text: 'Recuerda que...', audio: 'recuerda-que.mp3', duration: 2000 }
        ]
      },

      transitions: {
        next: [
          { text: '¡Vamos a la siguiente!', audio: 'vamos-siguiente.mp3', duration: 2500 },
          { text: 'Ahora algo nuevo', audio: 'ahora-nuevo.mp3', duration: 2200 }
        ],
        pause: [
          { text: 'Descansemos un momento', audio: 'descansemos.mp3', duration: 2500 },
          { text: 'Tomaremos un break', audio: 'tomaremos-break.mp3', duration: 2200 }
        ],
        complete: [
          { text: '¡Terminamos! ¡Co-quí!', audio: 'terminamos-coqui.mp3', duration: 2800 },
          { text: '¡Excelente trabajo hoy!', audio: 'excelente-trabajo.mp3', duration: 2800 }
        ]
      }
    },

    english: {
      greetings: {
        morning: [
          { text: 'Good morning, friend!', audio: 'good-morning.mp3', duration: 2000 },
          { text: 'Hello! Ready to learn?', audio: 'hello-ready.mp3', duration: 2200 },
          { text: 'Great to see you!', audio: 'great-see-you.mp3', duration: 1800 }
        ],
        afternoon: [
          { text: 'Good afternoon!', audio: 'good-afternoon.mp3', duration: 1800 },
          { text: 'Hi! How are you?', audio: 'hi-how-are-you.mp3', duration: 2000 }
        ],
        anytime: [
          { text: 'Co-kee! Welcome!', audio: 'cokee-welcome.mp3', duration: 2000 },
          { text: 'I\'m happy to see you!', audio: 'happy-see-you.mp3', duration: 2200 }
        ]
      },

      encouragement: {
        during: [
          { text: 'Great job!', audio: 'great-job.mp3', duration: 1500 },
          { text: 'Keep going!', audio: 'keep-going.mp3', duration: 1500 },
          { text: 'Excellent!', audio: 'excellent.mp3', duration: 1500 },
          { text: 'You can do it!', audio: 'you-can-do-it.mp3', duration: 1800 },
          { text: 'You\'re doing it!', audio: 'youre-doing-it.mp3', duration: 1800 }
        ],
        struggle: [
          { text: 'Let\'s try again', audio: 'try-again.mp3', duration: 1800 },
          { text: 'Almost there', audio: 'almost-there.mp3', duration: 1500 },
          { text: 'Don\'t give up, you\'re doing well', audio: 'dont-give-up.mp3', duration: 2800 }
        ]
      },

      celebration: {
        good: [
          { text: 'Fantastic!', audio: 'fantastic.mp3', duration: 1800 },
          { text: 'Amazing!', audio: 'amazing.mp3', duration: 1500 },
          { text: 'You did it!', audio: 'you-did-it.mp3', duration: 1800 }
        ],
        perfect: [
          { text: 'Perfect! Co-kee!', audio: 'perfect-cokee.mp3', duration: 2200 },
          { text: 'You\'re a star!', audio: 'youre-a-star.mp3', duration: 2000 },
          { text: 'Wow! Impressive!', audio: 'wow-impressive.mp3', duration: 2200 }
        ],
        milestone: [
          { text: 'Look how much you\'ve learned!', audio: 'how-much-learned.mp3', duration: 3000 },
          { text: 'You leveled up!', audio: 'leveled-up.mp3', duration: 2000 },
          { text: 'You earned a star!', audio: 'earned-star.mp3', duration: 2200 }
        ]
      },

      instructions: {
        reading: [
          { text: 'Let\'s read together', audio: 'read-together.mp3', duration: 2200 },
          { text: 'Read this word', audio: 'read-word.mp3', duration: 1800 },
          { text: 'Listen and repeat', audio: 'listen-repeat.mp3', duration: 2000 }
        ],
        quiz: [
          { text: 'Which is the correct answer?', audio: 'correct-answer.mp3', duration: 2500 },
          { text: 'Choose an option', audio: 'choose-option.mp3', duration: 2000 },
          { text: 'Think carefully', audio: 'think-carefully.mp3', duration: 2000 }
        ]
      },

      feedback: {
        correct: [
          { text: 'Correct!', audio: 'correct.mp3', duration: 1500 },
          { text: 'Yes! That\'s it!', audio: 'yes-thats-it.mp3', duration: 1800 },
          { text: 'Exactly!', audio: 'exactly.mp3', duration: 1500 }
        ],
        incorrect: [
          { text: 'Hmm, not quite', audio: 'not-quite.mp3', duration: 2000 },
          { text: 'Try again', audio: 'try-again-feedback.mp3', duration: 1800 },
          { text: 'Close, but not that one', audio: 'close-not-that.mp3', duration: 2500 }
        ],
        hint: [
          { text: 'I\'ll give you a hint', audio: 'give-hint.mp3', duration: 2000 },
          { text: 'Think about...', audio: 'think-about.mp3', duration: 1800 },
          { text: 'Remember that...', audio: 'remember-that.mp3', duration: 2000 }
        ]
      },

      transitions: {
        next: [
          { text: 'Let\'s go to the next one!', audio: 'next-one.mp3', duration: 2200 },
          { text: 'Now something new', audio: 'something-new.mp3', duration: 2000 }
        ],
        pause: [
          { text: 'Let\'s take a break', audio: 'take-break.mp3', duration: 2000 },
          { text: 'Time for a rest', audio: 'time-rest.mp3', duration: 1800 }
        ],
        complete: [
          { text: 'We\'re done! Co-kee!', audio: 'done-cokee.mp3', duration: 2500 },
          { text: 'Excellent work today!', audio: 'excellent-work.mp3', duration: 2500 }
        ]
      }
    }
  },

  // Sound effect library
  soundEffects: {
    coquiCall: {
      natural: '/sounds/coqui-call-natural.mp3',  // Real coquí sound
      stylized: '/sounds/coqui-call-cute.mp3',    // Friendly version
      celebration: '/sounds/coqui-call-happy.mp3'
    },
    interactions: {
      buttonClick: '/sounds/soft-pop.mp3',
      correctAnswer: '/sounds/success-chime.mp3',
      incorrectAnswer: '/sounds/gentle-buzz.mp3',
      starEarned: '/sounds/star-twinkle.mp3',
      levelUp: '/sounds/level-up-fanfare.mp3',
      pageFlip: '/sounds/page-turn.mp3'
    },
    ambient: {
      rainforest: '/sounds/el-yunque-ambient.mp3',  // Background for certain activities
      classroom: '/sounds/gentle-music-loop.mp3'
    }
  }
};
```

### Audio Player Implementation

```typescript
// Smart audio manager with queuing and interruption handling
export class CoquiAudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private audioQueue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;

  constructor(private language: 'es' | 'en') {}

  // Play voice line with automatic queuing
  async playVoiceLine(category: string, subcategory: string, index?: number): Promise<void> {
    const voiceLines = coquiVoiceSystem.voiceLines[this.language][category][subcategory];
    const selectedLine = index !== undefined
      ? voiceLines[index]
      : voiceLines[Math.floor(Math.random() * voiceLines.length)];

    await this.play(selectedLine.audio, selectedLine.duration);
    return selectedLine.text;
  }

  // Play with subtitle callback
  async play(audioPath: string, duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }

      this.currentAudio = new Audio(audioPath);
      this.currentAudio.volume = 0.8;
      this.isPlaying = true;

      this.currentAudio.onended = () => {
        this.isPlaying = false;
        resolve();
        this.playNext();
      };

      this.currentAudio.play().catch((error) => {
        console.error('Audio playback failed:', error);
        this.isPlaying = false;
        resolve();
      });
    });
  }

  // Play coquí call sound effect
  playCoquiCall(type: 'natural' | 'stylized' | 'celebration' = 'stylized'): void {
    const audio = new Audio(coquiVoiceSystem.soundEffects.coquiCall[type]);
    audio.volume = 0.6;
    audio.play();
  }

  // Queue management
  private playNext(): void {
    if (this.audioQueue.length > 0) {
      const next = this.audioQueue.shift()!;
      this.play(next.path, next.duration);
    }
  }

  // Stop all audio
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.audioQueue = [];
    this.isPlaying = false;
  }
}
```

## 5. Interactive Behavior Patterns

### Context-Aware Responses

```typescript
export const coquiContextualBehavior = {
  // Reading exercise interactions
  readingExercise: {
    onStart: {
      state: 'speaking',
      voiceLine: { category: 'instructions', subcategory: 'reading' },
      speechBubble: true,
      animation: 'bounce-in'
    },

    onWordCorrect: {
      state: (score: number) => score >= 90 ? 'excited' : 'happy',
      voiceLine: { category: 'encouragement', subcategory: 'during' },
      speechBubble: true,
      particles: (score: number) => score >= 90 ? 'stars' : 'sparkles'
    },

    onWordIncorrect: {
      state: 'encouraging',
      voiceLine: { category: 'encouragement', subcategory: 'struggle' },
      speechBubble: true,
      gesture: 'beckoning'
    },

    onExerciseComplete: {
      state: 'celebration',
      voiceLine: { category: 'celebration', subcategory: 'milestone' },
      speechBubble: true,
      particles: 'confetti',
      soundEffect: 'coqui-call-celebration'
    }
  },

  // Comprehension questions
  comprehensionCheck: {
    onQuestionShow: {
      state: 'thinking',
      voiceLine: { category: 'instructions', subcategory: 'quiz' },
      speechBubble: true,
      gesture: 'pointing-at-options'
    },

    onCorrectAnswer: {
      state: 'excited',
      voiceLine: { category: 'feedback', subcategory: 'correct' },
      speechBubble: true,
      particles: 'stars',
      soundEffect: 'success-chime'
    },

    onIncorrectAnswer: {
      state: 'encouraging',
      voiceLine: { category: 'feedback', subcategory: 'incorrect' },
      speechBubble: true,
      gesture: 'shake-head-gently'
    },

    onHintRequest: {
      state: 'thinking',
      voiceLine: { category: 'feedback', subcategory: 'hint' },
      speechBubble: true,
      animation: 'lean-forward'
    }
  },

  // Progress milestones
  milestones: {
    firstStar: {
      state: 'celebration',
      voiceLine: { category: 'celebration', subcategory: 'milestone' },
      customMessage: {
        es: '¡Tu primera estrella! ¡Co-quí!',
        en: 'Your first star! Co-kee!'
      },
      particles: 'star-burst',
      duration: 5000
    },

    streakDay5: {
      state: 'excited',
      customMessage: {
        es: '¡5 días seguidos! ¡Eres increíble!',
        en: '5 days in a row! You\'re amazing!'
      },
      badge: 'fire-badge',
      particles: 'fire-effect'
    },

    levelUp: {
      state: 'celebration',
      voiceLine: { category: 'celebration', subcategory: 'milestone' },
      customAnimation: 'level-up-spin',
      particles: 'rainbow-confetti',
      soundEffect: 'level-up-fanfare',
      duration: 8000
    }
  },

  // Idle behavior (no activity)
  idle: {
    after30Seconds: {
      state: 'neutral',
      animation: 'look-around',
      frequency: 'every-10s'
    },

    after2Minutes: {
      state: 'encouraging',
      voiceLine: {
        es: '¿Necesitas ayuda?',
        en: 'Need some help?'
      },
      speechBubble: true
    },

    after5Minutes: {
      state: 'sleeping',
      animation: 'fall-asleep',
      onInteraction: 'wake-up-animation'
    }
  },

  // Error handling
  errors: {
    voiceNotWorking: {
      state: 'neutral',
      speechBubble: true,
      message: {
        es: 'Podemos usar el teclado en su lugar',
        en: 'We can use the keyboard instead'
      }
    },

    connectionLost: {
      state: 'thinking',
      speechBubble: true,
      message: {
        es: 'Esperando conexión...',
        en: 'Waiting for connection...'
      }
    }
  }
};
```

## 6. React Component Implementation

### Main Coquí Component

```typescript
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CoquiAudioManager } from '@/lib/audio/CoquiAudioManager';

interface CoquiMascotProps {
  state?: CoquiState;
  size?: 'tiny' | 'small' | 'medium' | 'reading' | 'hero';
  position?: 'inline' | 'fixed' | 'absolute';
  showSpeechBubble?: boolean;
  speechText?: string;
  onAnimationComplete?: () => void;
  interactive?: boolean;
}

export const CoquiMascot: React.FC<CoquiMascotProps> = ({
  state = 'neutral',
  size = 'medium',
  position = 'inline',
  showSpeechBubble = false,
  speechText = '',
  onAnimationComplete,
  interactive = false
}) => {
  const { language } = useLanguage();
  const [audioManager] = useState(() => new CoquiAudioManager(language));
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Handle interactive clicks
  const handleClick = useCallback(() => {
    if (!interactive) return;

    setClickCount(prev => prev + 1);
    audioManager.playCoquiCall('stylized');

    // Easter egg: 5 clicks in a row
    if (clickCount + 1 >= 5) {
      audioManager.playCoquiCall('celebration');
      setClickCount(0);
      // Trigger special animation
    }
  }, [interactive, clickCount, audioManager]);

  // Play voice lines when speech bubble appears
  useEffect(() => {
    if (showSpeechBubble && speechText) {
      // Audio would be played here if text-to-speech is enabled
    }
  }, [showSpeechBubble, speechText]);

  // Get size dimensions
  const sizeMap = {
    tiny: 'w-[60px] h-[60px]',
    small: 'w-[100px] h-[100px]',
    medium: 'w-[150px] h-[150px]',
    reading: 'w-[200px] h-[200px]',
    hero: 'w-[300px] h-[300px]'
  };

  const positionMap = {
    inline: 'relative',
    fixed: 'fixed bottom-4 right-4 z-50',
    absolute: 'absolute'
  };

  return (
    <div
      className={`coqui-mascot-container ${sizeMap[size]} ${positionMap[position]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Main Coquí Character */}
      <motion.div
        className="coqui-character w-full h-full relative"
        {...getStateAnimation(state)}
        onAnimationComplete={onAnimationComplete}
      >
        <CoquiSVG
          state={state}
          isHovered={isHovered && interactive}
        />

        {/* Particle Effects */}
        <AnimatePresence>
          {shouldShowParticles(state) && (
            <ParticleEffects state={state} />
          )}
        </AnimatePresence>

        {/* Sound Waves (for listening/speaking states) */}
        {(state === 'listening' || state === 'speaking') && (
          <SoundWaves />
        )}
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && (
          <SpeechBubble
            text={speechText}
            language={language}
            position={position}
          />
        )}
      </AnimatePresence>

      {/* Accessibility: Screen reader text */}
      <span className="sr-only">
        {`Coquí mascot in ${state} state${speechText ? `: ${speechText}` : ''}`}
      </span>
    </div>
  );
};

export default CoquiMascot;
```

### Speech Bubble Component

```typescript
import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
  language: 'es' | 'en';
  position: 'inline' | 'fixed' | 'absolute';
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  language,
  position
}) => {
  return (
    <motion.div
      className={`
        speech-bubble
        absolute ${position === 'inline' ? 'top-0 left-full ml-4' : 'bottom-full mb-4'}
        bg-white rounded-2xl px-6 py-4
        shadow-xl border-4 border-coquiGreen-500
        max-w-[300px] min-w-[150px]
        z-10
      `}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Tail */}
      <div
        className={`
          absolute w-0 h-0
          ${position === 'inline'
            ? 'left-0 top-1/2 -translate-x-full -translate-y-1/2'
            : 'left-1/2 bottom-0 -translate-x-1/2 translate-y-full'
          }
          border-8 border-transparent
          ${position === 'inline'
            ? 'border-r-coquiGreen-500'
            : 'border-t-coquiGreen-500'
          }
        `}
      />

      {/* Text */}
      <p className="text-lg font-semibold text-neutral-900 text-center">
        {text}
      </p>
    </motion.div>
  );
};
```

## 7. Implementation Checklist

### Phase 1: Assets (Week 1-2)
- [ ] Design Coquí character in multiple states (Figma/Illustrator)
- [ ] Export SVG files for each state
- [ ] Create animation sprite sheets if needed
- [ ] Record voice lines (Spanish and English)
- [ ] Edit and optimize audio files
- [ ] Create sound effects library
- [ ] Organize assets in project structure

### Phase 2: Core Component (Week 3-4)
- [ ] Build base CoquiMascot component
- [ ] Implement state management
- [ ] Add Framer Motion animations
- [ ] Create particle effect system
- [ ] Build speech bubble component
- [ ] Implement audio manager
- [ ] Add accessibility features

### Phase 3: Integration (Week 5-6)
- [ ] Integrate into reading exercises
- [ ] Add to comprehension checks
- [ ] Implement in dashboard
- [ ] Create milestone celebrations
- [ ] Add idle behaviors
- [ ] Implement error handling

### Phase 4: Polish (Week 7-8)
- [ ] User testing with K-5 students
- [ ] Refine animations based on feedback
- [ ] Optimize audio files for web
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile optimization
- [ ] Final QA

## 8. Success Metrics

The Coquí mascot integration is successful when:

1. **Engagement**: Students interact with Coquí voluntarily
2. **Recognition**: 95%+ of students can identify Coquí
3. **Connection**: Students express excitement about the character
4. **Learning**: Coquí's presence improves completion rates
5. **Cultural Pride**: Students connect Coquí to Puerto Rican identity
6. **Accessibility**: All interactions are usable by students with disabilities
7. **Performance**: Animations run smoothly on all devices
8. **Audio Quality**: Voice lines are clear and age-appropriate

## 9. Future Enhancements

- **Multiple Coquí Characters**: Different colored coquís for multiplayer
- **Customization**: Students can dress up their Coquí
- **Coquí Collection**: Unlock different coquí species (there are 17!)
- **AR Integration**: View Coquí in real world via mobile camera
- **Coquí Stories**: Animated shorts teaching about Puerto Rico
- **Voice Recognition**: Coquí responds to spoken commands
- **AI Conversations**: Natural language chat with Coquí
- **Parent Coquí**: Different character for parent portal

---

**Note**: The Coquí is more than a mascot—it's a cultural ambassador that connects Puerto Rican children to their heritage while making learning fun and engaging. Every interaction should reinforce this dual purpose of education and cultural pride.
