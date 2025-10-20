/**
 * Translation Module
 * Provides culturally-sensitive Spanish-English translation
 * Preserves Puerto Rican cultural context and educational content
 */

export interface TranslationOptions {
  preserveCulturalTerms?: boolean;
  targetAudience?: 'children' | 'educators' | 'parents';
  gradeLevel?: number; // K-5
  formality?: 'formal' | 'informal';
  dialect?: 'standard' | 'puerto-rican';
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLanguage: 'spanish' | 'english';
  targetLanguage: 'spanish' | 'english';
  culturalNotes: CulturalNote[];
  confidence: number;
  preservedTerms: string[];
  alternatives?: string[];
}

export interface CulturalNote {
  term: string;
  context: string;
  explanation: string;
  preserveOriginal: boolean;
}

export class Translator {
  // Puerto Rican cultural terms that should be preserved or noted
  private static readonly CULTURAL_TERMS: Record<string, CulturalNote> = {
    'guagua': {
      term: 'guagua',
      context: 'Puerto Rican Spanish for "bus"',
      explanation: 'In Puerto Rico, "guagua" is used instead of "autobús". This is a culturally significant term.',
      preserveOriginal: true
    },
    'zafacón': {
      term: 'zafacón',
      context: 'Puerto Rican Spanish for "trash can"',
      explanation: 'A uniquely Puerto Rican term. Mainland Spanish uses "basurero" or "papelera".',
      preserveOriginal: true
    },
    'mahones': {
      term: 'mahones',
      context: 'Puerto Rican Spanish for "jeans"',
      explanation: 'Puerto Ricans say "mahones" while other Spanish speakers say "vaqueros" or "jeans".',
      preserveOriginal: true
    },
    'chiringa': {
      term: 'chiringa',
      context: 'Puerto Rican Spanish for "kite"',
      explanation: 'In Puerto Rico, kites are called "chiringas". Other Spanish speakers use "cometa".',
      preserveOriginal: true
    },
    'china': {
      term: 'china',
      context: 'Puerto Rican Spanish for "orange"',
      explanation: 'Puerto Ricans call oranges "chinas". Standard Spanish uses "naranja".',
      preserveOriginal: true
    },
    'mofongo': {
      term: 'mofongo',
      context: 'Traditional Puerto Rican dish',
      explanation: 'A beloved Puerto Rican dish made from fried plantains. No direct translation exists.',
      preserveOriginal: true
    },
    'alcapurria': {
      term: 'alcapurria',
      context: 'Puerto Rican fried food',
      explanation: 'A popular Puerto Rican fritter. This is a cultural food item with no equivalent.',
      preserveOriginal: true
    },
    'piragua': {
      term: 'piragua',
      context: 'Puerto Rican shaved ice treat',
      explanation: 'A traditional Puerto Rican dessert, similar to a snow cone but culturally distinct.',
      preserveOriginal: true
    },
    'coquí': {
      term: 'coquí',
      context: 'Small tree frog endemic to Puerto Rico',
      explanation: 'The coquí is a national symbol of Puerto Rico. Its name comes from its distinctive call.',
      preserveOriginal: true
    },
    'jíbaro': {
      term: 'jíbaro',
      context: 'Puerto Rican peasant/farmer',
      explanation: 'Represents the traditional Puerto Rican rural farmer, a symbol of cultural identity.',
      preserveOriginal: true
    }
  };

  // Educational vocabulary for age-appropriate translation
  private static readonly GRADE_APPROPRIATE_VOCAB: Record<number, Set<string>> = {
    0: new Set(['mom', 'dad', 'cat', 'dog', 'red', 'blue', 'big', 'small', 'happy', 'sad']),
    1: new Set(['friend', 'school', 'teacher', 'book', 'play', 'learn', 'color', 'number']),
    2: new Set(['family', 'community', 'weather', 'season', 'animal', 'plant', 'story', 'question']),
    3: new Set(['neighborhood', 'environment', 'culture', 'tradition', 'measure', 'compare']),
    4: new Set(['society', 'history', 'science', 'experiment', 'conclusion', 'evidence']),
    5: new Set(['democracy', 'ecosystem', 'hypothesis', 'analyze', 'synthesize', 'evaluate'])
  };

  // Common educational phrases with culturally-appropriate translations
  private static readonly EDUCATIONAL_PHRASES: Record<string, Record<string, string>> = {
    'english_to_spanish': {
      'Good morning, class!': '¡Buenos días, clase!',
      'Raise your hand': 'Levanta la mano',
      'Great job!': '¡Excelente trabajo!',
      'Let\'s read together': 'Vamos a leer juntos',
      'Turn to page': 'Abre la página',
      'Time for lunch': 'Es hora de almorzar',
      'Line up, please': 'Hagan fila, por favor',
      'Homework assignment': 'Tarea para la casa',
      'Parent-teacher conference': 'Reunión de padres y maestros',
      'Field trip': 'Excursión escolar'
    },
    'spanish_to_english': {
      '¡Buenos días, clase!': 'Good morning, class!',
      'Levanta la mano': 'Raise your hand',
      '¡Excelente trabajo!': 'Great job!',
      'Vamos a leer juntos': 'Let\'s read together',
      'Abre la página': 'Turn to page',
      'Es hora de almorzar': 'Time for lunch',
      'Hagan fila, por favor': 'Line up, please',
      'Tarea para la casa': 'Homework assignment',
      'Reunión de padres y maestros': 'Parent-teacher conference',
      'Excursión escolar': 'Field trip'
    }
  };

  /**
   * Translate text with cultural sensitivity
   */
  public static async translate(
    text: string,
    targetLanguage: 'spanish' | 'english',
    options: TranslationOptions = {}
  ): Promise<TranslationResult> {
    const opts: Required<TranslationOptions> = {
      preserveCulturalTerms: true,
      targetAudience: 'children',
      gradeLevel: 3,
      formality: 'informal',
      dialect: 'puerto-rican',
      ...options
    };

    // Detect source language
    const sourceLanguage = targetLanguage === 'spanish' ? 'english' : 'spanish';

    // Extract cultural terms to preserve
    const culturalNotes: CulturalNote[] = [];
    const preservedTerms: string[] = [];
    let processedText = text;

    if (opts.preserveCulturalTerms) {
      Object.entries(this.CULTURAL_TERMS).forEach(([term, note]) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        if (regex.test(text)) {
          culturalNotes.push(note);
          preservedTerms.push(term);
          // Mark term for preservation in translation
          processedText = processedText.replace(regex, `<PRESERVE>${term}</PRESERVE>`);
        }
      });
    }

    // Translate (simplified - in production, use a proper translation API)
    let translated = await this.performTranslation(
      processedText,
      sourceLanguage,
      targetLanguage,
      opts
    );

    // Restore preserved terms
    translated = translated.replace(/<PRESERVE>(.*?)<\/PRESERVE>/g, '$1');

    // Generate alternatives if needed
    const alternatives = this.generateAlternatives(text, translated, opts);

    // Calculate confidence based on various factors
    const confidence = this.calculateConfidence(text, translated, culturalNotes.length);

    return {
      original: text,
      translated,
      sourceLanguage,
      targetLanguage,
      culturalNotes,
      confidence,
      preservedTerms,
      alternatives
    };
  }

  /**
   * Perform translation (simplified implementation)
   * In production, integrate with Google Translate API, DeepL, or custom ML model
   */
  private static async performTranslation(
    text: string,
    sourceLanguage: 'spanish' | 'english',
    targetLanguage: 'spanish' | 'english',
    options: Required<TranslationOptions>
  ): Promise<string> {
    // Check for exact phrase matches first
    const phraseKey = sourceLanguage === 'english' ? 'english_to_spanish' : 'spanish_to_english';
    const phrases = this.EDUCATIONAL_PHRASES[phraseKey];

    if (phrases[text]) {
      return phrases[text];
    }

    // For this implementation, we'll provide a basic word-by-word translation
    // In production, use a proper translation service
    const words = text.split(/\s+/);
    const translatedWords = words.map(word => {
      return this.translateWord(word, sourceLanguage, targetLanguage, options);
    });

    return translatedWords.join(' ');
  }

  /**
   * Translate individual word (simplified)
   */
  private static translateWord(
    word: string,
    sourceLanguage: 'spanish' | 'english',
    targetLanguage: 'spanish' | 'english',
    options: Required<TranslationOptions>
  ): string {
    // Remove punctuation for lookup
    const cleanWord = word.replace(/[^\wáéíóúñü]/g, '').toLowerCase();

    // Check if it's a preserved term
    if (word.includes('<PRESERVE>')) {
      return word;
    }

    // Simple dictionary (extend with comprehensive dictionary in production)
    const dictionary = this.getSimpleDictionary(sourceLanguage, targetLanguage);

    return dictionary[cleanWord] || word;
  }

  /**
   * Get simple translation dictionary
   */
  private static getSimpleDictionary(
    sourceLanguage: 'spanish' | 'english',
    targetLanguage: 'spanish' | 'english'
  ): Record<string, string> {
    if (sourceLanguage === 'english' && targetLanguage === 'spanish') {
      return {
        'hello': 'hola',
        'goodbye': 'adiós',
        'please': 'por favor',
        'thank': 'gracias',
        'yes': 'sí',
        'no': 'no',
        'book': 'libro',
        'school': 'escuela',
        'teacher': 'maestro',
        'student': 'estudiante',
        'read': 'leer',
        'write': 'escribir',
        'learn': 'aprender',
        'play': 'jugar',
        'friend': 'amigo',
        'family': 'familia',
        'mother': 'madre',
        'father': 'padre',
        'child': 'niño',
        'house': 'casa',
        'water': 'agua',
        'food': 'comida',
        'color': 'color',
        'number': 'número'
      };
    } else {
      return {
        'hola': 'hello',
        'adiós': 'goodbye',
        'por favor': 'please',
        'gracias': 'thank you',
        'sí': 'yes',
        'no': 'no',
        'libro': 'book',
        'escuela': 'school',
        'maestro': 'teacher',
        'estudiante': 'student',
        'leer': 'read',
        'escribir': 'write',
        'aprender': 'learn',
        'jugar': 'play',
        'amigo': 'friend',
        'familia': 'family',
        'madre': 'mother',
        'padre': 'father',
        'niño': 'child',
        'casa': 'house',
        'agua': 'water',
        'comida': 'food',
        'color': 'color',
        'número': 'number'
      };
    }
  }

  /**
   * Generate alternative translations
   */
  private static generateAlternatives(
    original: string,
    translated: string,
    options: Required<TranslationOptions>
  ): string[] {
    const alternatives: string[] = [];

    // Could generate alternatives with different formality levels
    // or regional variations

    return alternatives;
  }

  /**
   * Calculate translation confidence
   */
  private static calculateConfidence(
    original: string,
    translated: string,
    culturalTermsCount: number
  ): number {
    let confidence = 0.8; // Base confidence

    // Adjust based on cultural preservation
    if (culturalTermsCount > 0) {
      confidence += 0.1; // Bonus for cultural awareness
    }

    // Adjust based on length similarity (rough heuristic)
    const lengthRatio = translated.length / original.length;
    if (lengthRatio >= 0.7 && lengthRatio <= 1.3) {
      confidence += 0.05;
    }

    return Math.min(confidence, 1);
  }

  /**
   * Translate with context preservation
   */
  public static async translateWithContext(
    segments: Array<{ text: string; context: string }>,
    targetLanguage: 'spanish' | 'english',
    options?: TranslationOptions
  ): Promise<TranslationResult[]> {
    return Promise.all(
      segments.map(segment =>
        this.translate(segment.text, targetLanguage, options)
      )
    );
  }

  /**
   * Get cultural term information
   */
  public static getCulturalTermInfo(term: string): CulturalNote | undefined {
    return this.CULTURAL_TERMS[term.toLowerCase()];
  }

  /**
   * Check if term should be preserved
   */
  public static shouldPreserveTerm(term: string): boolean {
    const termInfo = this.CULTURAL_TERMS[term.toLowerCase()];
    return termInfo?.preserveOriginal || false;
  }

  /**
   * Batch translate multiple texts
   */
  public static async translateBatch(
    texts: string[],
    targetLanguage: 'spanish' | 'english',
    options?: TranslationOptions
  ): Promise<TranslationResult[]> {
    return Promise.all(
      texts.map(text => this.translate(text, targetLanguage, options))
    );
  }

  /**
   * Get all cultural terms
   */
  public static getAllCulturalTerms(): CulturalNote[] {
    return Object.values(this.CULTURAL_TERMS);
  }
}

export default Translator;
