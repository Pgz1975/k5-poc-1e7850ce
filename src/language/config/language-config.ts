/**
 * Language Configuration
 * Configuration for bilingual Spanish/English processing
 */

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  specialCharacters: string[];
  stopWords: string[];
  commonWords: string[];
}

export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  SPANISH_PR: 'es-PR', // Puerto Rican Spanish
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    specialCharacters: [],
    stopWords: [
      'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'of', 'at', 'by', 'for', 'with', 'about', 'as', 'into', 'through',
      'in', 'on', 'to', 'from', 'up', 'down', 'out', 'over', 'under',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
      'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
    ],
    commonWords: [
      'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world',
      'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work',
      'week', 'case', 'point', 'government', 'company', 'number', 'group'
    ]
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    specialCharacters: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ', '¡', '¿'],
    stopWords: [
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'y', 'o', 'pero', 'es', 'son', 'está', 'están', 'era', 'eran',
      'ser', 'estar', 'sido', 'siendo', 'hay', 'he', 'ha', 'hemos', 'han',
      'de', 'del', 'al', 'por', 'para', 'con', 'sin', 'sobre', 'como',
      'en', 'a', 'desde', 'hasta', 'hacia', 'entre', 'bajo', 'durante',
      'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
      'aquel', 'aquella', 'aquellos', 'aquellas', 'yo', 'tú', 'él', 'ella',
      'nosotros', 'vosotros', 'ellos', 'ellas', 'qué', 'cuál', 'quién',
      'cuándo', 'dónde', 'cómo', 'por qué'
    ],
    commonWords: [
      'tiempo', 'persona', 'año', 'manera', 'día', 'cosa', 'hombre', 'mundo',
      'vida', 'mano', 'parte', 'niño', 'ojo', 'mujer', 'lugar', 'trabajo',
      'semana', 'caso', 'punto', 'gobierno', 'empresa', 'número', 'grupo'
    ]
  },
  'es-PR': {
    code: 'es-PR',
    name: 'Puerto Rican Spanish',
    nativeName: 'Español Puertorriqueño',
    direction: 'ltr',
    specialCharacters: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ', '¡', '¿'],
    stopWords: [
      // Inherit from standard Spanish
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'y', 'o', 'pero', 'es', 'son', 'está', 'están', 'era', 'eran',
      // PR-specific colloquialisms
      'pues', 'dale', 'wepa', 'boricua', 'chavos'
    ],
    commonWords: [
      'tiempo', 'persona', 'año', 'manera', 'día', 'cosa', 'hombre', 'mundo',
      'vida', 'mano', 'parte', 'niño', 'ojo', 'mujer', 'lugar', 'trabajo',
      'semana', 'caso', 'punto', 'gobierno', 'empresa', 'número', 'grupo',
      // PR-specific
      'isla', 'playa', 'barrio', 'vecino', 'pueblo'
    ]
  }
};

// Puerto Rican Spanish dialect markers
export const PR_SPANISH_MARKERS = {
  // Phonetic markers (aspirated 's', dropped 'd')
  phonetic: [
    /eto$/i,      // esto -> eto
    /ao$/i,       // -ado -> -ao
    /para$/i,     // para vs pa'
    /verdad$/i    // verdá
  ],
  // Vocabulary markers
  vocabulary: [
    'wepa', 'dale', 'boricua', 'chavos', 'china', 'guagua', 'mahones',
    'nene', 'nena', 'jíbaro', 'coquí', 'piragua', 'mofongo', 'alcapurria',
    'bacalaíto', 'pana', 'mano', 'broki', 'pai', 'mai'
  ],
  // Grammar patterns
  grammar: [
    /¿verdad\?$/i,
    /¿no\?$/i,
    /¿tú sabes\?$/i
  ]
};

// Code-switching patterns (Spanish-English mix)
export const CODE_SWITCHING_PATTERNS = [
  /\b(okay|ok|sorry|please|thank you|bye)\b/i,  // English in Spanish
  /\b(pero|y|o|que|porque)\s+[a-z]+ing\b/i,     // Spanish connectors + English verbs
  /\b[a-z]+ar\s+(it|that|this)\b/i,             // Spanish infinitive + English pronoun
  /\b(el|la|los|las)\s+[A-Z][a-z]+\b/,         // Spanish articles + English nouns
];

// Grade level vocabulary complexity (K-5)
export const GRADE_LEVEL_VOCABULARY = {
  K: {
    syllables: [1, 2],
    avgWordLength: [3, 5],
    complexityScore: [0, 0.3]
  },
  1: {
    syllables: [1, 2],
    avgWordLength: [4, 6],
    complexityScore: [0.2, 0.4]
  },
  2: {
    syllables: [1, 3],
    avgWordLength: [4, 7],
    complexityScore: [0.3, 0.5]
  },
  3: {
    syllables: [2, 3],
    avgWordLength: [5, 8],
    complexityScore: [0.4, 0.6]
  },
  4: {
    syllables: [2, 4],
    avgWordLength: [6, 9],
    complexityScore: [0.5, 0.7]
  },
  5: {
    syllables: [2, 5],
    avgWordLength: [6, 10],
    complexityScore: [0.6, 0.8]
  }
};

export default LANGUAGE_CONFIGS;
