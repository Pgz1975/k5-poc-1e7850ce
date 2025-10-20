/**
 * Vocabulary Extraction and Categorization Module
 * Identifies and classifies vocabulary for educational purposes
 */

export interface VocabularyItem {
  word: string;
  frequency: number;
  category: VocabularyCategory;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  gradeLevel: number;
  partOfSpeech?: string;
  definition?: string;
  contextExamples: string[];
  translations?: {
    spanish?: string;
    english?: string;
  };
}

export type VocabularyCategory =
  | 'academic'
  | 'content-specific'
  | 'high-frequency'
  | 'tier-2'
  | 'tier-3'
  | 'cultural'
  | 'cognate';

export interface VocabularyAnalysis {
  totalWords: number;
  uniqueWords: number;
  vocabularyItems: VocabularyItem[];
  categoryDistribution: Record<VocabularyCategory, number>;
  gradeDistribution: Record<number, number>;
  keyVocabulary: VocabularyItem[];
  recommendations: string[];
}

export class VocabularyExtractor {
  // High-frequency words (Dolch/Fry lists combined)
  private static readonly HIGH_FREQUENCY_WORDS = new Set([
    // English
    'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on',
    'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one',
    'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can',
    'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will',
    // Spanish
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber', 'por', 'con',
    'su', 'para', 'como', 'estar', 'tener', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o',
    'poder', 'decir', 'este', 'ir', 'otro', 'ese', 'la', 'si', 'me', 'ya', 'ver', 'porque',
    'dar', 'cuando', 'él', 'muy', 'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno'
  ]);

  // Academic vocabulary by grade level
  private static readonly ACADEMIC_VOCABULARY: Record<number, Set<string>> = {
    0: new Set(['color', 'shape', 'big', 'small', 'number', 'letter', 'same', 'different']),
    1: new Set(['add', 'subtract', 'compare', 'order', 'group', 'pattern', 'first', 'last', 'more', 'less']),
    2: new Set(['measure', 'estimate', 'solve', 'explain', 'describe', 'identify', 'character', 'setting']),
    3: new Set(['analyze', 'conclude', 'evidence', 'predict', 'sequence', 'classify', 'summarize', 'cause', 'effect']),
    4: new Set(['evaluate', 'justify', 'synthesize', 'interpret', 'formulate', 'demonstrate', 'perspective', 'theme']),
    5: new Set(['critique', 'hypothesize', 'deduce', 'infer', 'generalize', 'collaborate', 'argument', 'claim', 'reasoning'])
  };

  // Spanish-English cognates
  private static readonly COGNATES: Record<string, string> = {
    'animal': 'animal',
    'color': 'color',
    'familia': 'family',
    'importante': 'important',
    'música': 'music',
    'natural': 'natural',
    'persona': 'person',
    'problema': 'problem',
    'diferente': 'different',
    'ejemplo': 'example',
    'historia': 'history',
    'información': 'information',
    'minuto': 'minute',
    'necesario': 'necessary',
    'similar': 'similar',
    'especial': 'special',
    'estudiar': 'study',
    'grupo': 'group',
    'idea': 'idea',
    'importante': 'important'
  };

  // Puerto Rican cultural vocabulary
  private static readonly CULTURAL_VOCABULARY = new Set([
    'guagua', 'zafacón', 'mahones', 'chiringa', 'china', 'mofongo',
    'alcapurria', 'piragua', 'coquí', 'jíbaro', 'boricua', 'wepa',
    'plátano', 'yuca', 'gandules', 'arroz', 'habichuelas', 'sofrito'
  ]);

  /**
   * Extract and analyze vocabulary from text
   */
  public static analyze(text: string, language: 'spanish' | 'english'): VocabularyAnalysis {
    const words = this.extractWords(text);
    const wordFrequency = this.calculateFrequency(words);

    // Build vocabulary items
    const vocabularyItems = this.buildVocabularyItems(wordFrequency, language);

    // Calculate distributions
    const categoryDistribution = this.calculateCategoryDistribution(vocabularyItems);
    const gradeDistribution = this.calculateGradeDistribution(vocabularyItems);

    // Identify key vocabulary (Tier 2 and Tier 3 words)
    const keyVocabulary = vocabularyItems.filter(
      item => item.category === 'tier-2' || item.category === 'tier-3' || item.category === 'academic'
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(vocabularyItems, language);

    return {
      totalWords: words.length,
      uniqueWords: Object.keys(wordFrequency).length,
      vocabularyItems: vocabularyItems.sort((a, b) => b.frequency - a.frequency),
      categoryDistribution,
      gradeDistribution,
      keyVocabulary,
      recommendations
    };
  }

  /**
   * Extract words from text
   */
  private static extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.replace(/[^\wáéíóúñü]/g, ''))
      .filter(w => w.length >= 2); // Filter out very short words
  }

  /**
   * Calculate word frequency
   */
  private static calculateFrequency(words: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return frequency;
  }

  /**
   * Build vocabulary items with categorization
   */
  private static buildVocabularyItems(
    wordFrequency: Record<string, number>,
    language: 'spanish' | 'english'
  ): VocabularyItem[] {
    const items: VocabularyItem[] = [];

    Object.entries(wordFrequency).forEach(([word, frequency]) => {
      const category = this.categorizeWord(word, language);
      const difficulty = this.assessDifficulty(word, category);
      const gradeLevel = this.determineGradeLevel(word, category);

      const item: VocabularyItem = {
        word,
        frequency,
        category,
        difficulty,
        gradeLevel,
        contextExamples: [],
        translations: this.getTranslations(word, language)
      };

      items.push(item);
    });

    return items;
  }

  /**
   * Categorize word into vocabulary tiers
   */
  private static categorizeWord(word: string, language: 'spanish' | 'english'): VocabularyCategory {
    // Check cultural vocabulary first
    if (this.CULTURAL_VOCABULARY.has(word)) {
      return 'cultural';
    }

    // Check cognates
    if (this.isCognate(word)) {
      return 'cognate';
    }

    // Check academic vocabulary
    for (const gradeSet of Object.values(this.ACADEMIC_VOCABULARY)) {
      if (gradeSet.has(word)) {
        return 'academic';
      }
    }

    // Check high-frequency words (Tier 1)
    if (this.HIGH_FREQUENCY_WORDS.has(word)) {
      return 'high-frequency';
    }

    // Tier 2: General academic words (useful across domains)
    if (this.isTier2Word(word)) {
      return 'tier-2';
    }

    // Tier 3: Domain-specific words
    if (this.isTier3Word(word)) {
      return 'tier-3';
    }

    return 'content-specific';
  }

  /**
   * Check if word is a cognate
   */
  private static isCognate(word: string): boolean {
    return word in this.COGNATES || Object.values(this.COGNATES).includes(word);
  }

  /**
   * Check if word is Tier 2 (general academic)
   */
  private static isTier2Word(word: string): boolean {
    // Tier 2 words are general academic words that appear across domains
    const tier2Indicators = [
      word.length >= 6, // Longer words tend to be Tier 2
      /tion|sion|ment|ness|ity|ción|dad|eza|ura/.test(word), // Abstract noun endings
    ];

    return tier2Indicators.filter(Boolean).length >= 1;
  }

  /**
   * Check if word is Tier 3 (domain-specific)
   */
  private static isTier3Word(word: string): boolean {
    // Tier 3 words are specialized, domain-specific
    const tier3Patterns = [
      /photo|bio|geo|hydro|foto|bio|geo/i, // Scientific prefixes
      /meter|gram|scope|metro|grama/i, // Scientific suffixes
    ];

    return tier3Patterns.some(pattern => pattern.test(word));
  }

  /**
   * Assess word difficulty
   */
  private static assessDifficulty(word: string, category: VocabularyCategory): 'basic' | 'intermediate' | 'advanced' {
    if (category === 'high-frequency' || category === 'cognate') {
      return 'basic';
    }

    if (category === 'tier-2' || category === 'academic') {
      return 'intermediate';
    }

    if (category === 'tier-3' || word.length >= 10) {
      return 'advanced';
    }

    return 'intermediate';
  }

  /**
   * Determine appropriate grade level for word
   */
  private static determineGradeLevel(word: string, category: VocabularyCategory): number {
    // Check academic vocabulary grade levels
    for (let grade = 0; grade <= 5; grade++) {
      if (this.ACADEMIC_VOCABULARY[grade as keyof typeof this.ACADEMIC_VOCABULARY]?.has(word)) {
        return grade;
      }
    }

    // Estimate based on category and word length
    if (category === 'high-frequency') return 0;
    if (category === 'cognate') return 1;
    if (category === 'cultural') return 2;
    if (word.length <= 4) return 1;
    if (word.length <= 6) return 2;
    if (word.length <= 8) return 3;
    if (word.length <= 10) return 4;
    return 5;
  }

  /**
   * Get translations for word
   */
  private static getTranslations(word: string, language: 'spanish' | 'english'): {
    spanish?: string;
    english?: string;
  } {
    const translations: { spanish?: string; english?: string } = {};

    if (language === 'spanish') {
      translations.spanish = word;
      translations.english = this.COGNATES[word]; // Simple lookup
    } else {
      translations.english = word;
      // Reverse lookup for cognates
      const spanishWord = Object.entries(this.COGNATES).find(([_, eng]) => eng === word)?.[0];
      if (spanishWord) {
        translations.spanish = spanishWord;
      }
    }

    return translations;
  }

  /**
   * Calculate category distribution
   */
  private static calculateCategoryDistribution(items: VocabularyItem[]): Record<VocabularyCategory, number> {
    const distribution: Record<VocabularyCategory, number> = {
      'academic': 0,
      'content-specific': 0,
      'high-frequency': 0,
      'tier-2': 0,
      'tier-3': 0,
      'cultural': 0,
      'cognate': 0
    };

    items.forEach(item => {
      distribution[item.category]++;
    });

    return distribution;
  }

  /**
   * Calculate grade level distribution
   */
  private static calculateGradeDistribution(items: VocabularyItem[]): Record<number, number> {
    const distribution: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    items.forEach(item => {
      if (item.gradeLevel >= 0 && item.gradeLevel <= 5) {
        distribution[item.gradeLevel]++;
      }
    });

    return distribution;
  }

  /**
   * Generate recommendations for vocabulary instruction
   */
  private static generateRecommendations(items: VocabularyItem[], language: 'spanish' | 'english'): string[] {
    const recommendations: string[] = [];

    const categoryDist = this.calculateCategoryDistribution(items);

    // Check for adequate academic vocabulary
    const academicRatio = categoryDist.academic / items.length;
    if (academicRatio < 0.05) {
      recommendations.push('Consider including more academic vocabulary for grade-level instruction');
    }

    // Check for cognates (beneficial for bilingual learners)
    const cognateRatio = categoryDist.cognate / items.length;
    if (cognateRatio < 0.1 && language === 'spanish') {
      recommendations.push('Identify and highlight cognates to support bilingual learners');
    }

    // Check cultural vocabulary
    if (categoryDist.cultural > 0) {
      recommendations.push('Cultural vocabulary present - ensure proper context and explanation');
    }

    // Check Tier 2 vocabulary (most important for instruction)
    const tier2Ratio = categoryDist['tier-2'] / items.length;
    if (tier2Ratio < 0.15) {
      recommendations.push('Add more Tier 2 vocabulary for comprehensive language development');
    }

    return recommendations;
  }

  /**
   * Extract key vocabulary for instruction (Tier 2 and academic)
   */
  public static extractKeyVocabulary(text: string, language: 'spanish' | 'english', maxWords: number = 10): VocabularyItem[] {
    const analysis = this.analyze(text, language);

    return analysis.keyVocabulary
      .sort((a, b) => {
        // Prioritize by category importance, then frequency
        const categoryWeight = { 'academic': 3, 'tier-2': 2, 'tier-3': 1 };
        const aWeight = (categoryWeight[a.category as keyof typeof categoryWeight] || 0) * 100 + a.frequency;
        const bWeight = (categoryWeight[b.category as keyof typeof categoryWeight] || 0) * 100 + b.frequency;
        return bWeight - aWeight;
      })
      .slice(0, maxWords);
  }

  /**
   * Find cognates between Spanish and English text
   */
  public static findCognates(spanishText: string, englishText: string): Array<{
    spanish: string;
    english: string;
    frequency: number;
  }> {
    const spanishWords = this.extractWords(spanishText);
    const englishWords = this.extractWords(englishText);
    const cognates: Array<{ spanish: string; english: string; frequency: number }> = [];

    spanishWords.forEach(spanishWord => {
      const englishEquivalent = this.COGNATES[spanishWord];
      if (englishEquivalent && englishWords.includes(englishEquivalent)) {
        cognates.push({
          spanish: spanishWord,
          english: englishEquivalent,
          frequency: this.calculateFrequency(spanishWords)[spanishWord]
        });
      }
    });

    return cognates;
  }

  /**
   * Get vocabulary statistics
   */
  public static getStatistics(analysis: VocabularyAnalysis): {
    lexicalDiversity: number;
    academicDensity: number;
    culturalDensity: number;
    cognateDensity: number;
  } {
    const lexicalDiversity = analysis.uniqueWords / analysis.totalWords;

    const academicDensity =
      (analysis.categoryDistribution.academic + analysis.categoryDistribution['tier-2']) /
      analysis.vocabularyItems.length;

    const culturalDensity = analysis.categoryDistribution.cultural / analysis.vocabularyItems.length;

    const cognateDensity = analysis.categoryDistribution.cognate / analysis.vocabularyItems.length;

    return {
      lexicalDiversity,
      academicDensity,
      culturalDensity,
      cognateDensity
    };
  }

  /**
   * Batch analyze multiple texts
   */
  public static analyzeBatch(
    texts: Array<{ text: string; language: 'spanish' | 'english' }>
  ): VocabularyAnalysis[] {
    return texts.map(({ text, language }) => this.analyze(text, language));
  }
}

export default VocabularyExtractor;
