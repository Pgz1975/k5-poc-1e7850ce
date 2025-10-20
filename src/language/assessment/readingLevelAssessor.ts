/**
 * Reading Level Assessment Module
 * Evaluates text complexity for K-5 grade levels
 * Supports both Spanish and English
 */

export interface ReadingLevelResult {
  gradeLevel: number; // 0-5 (K-5)
  gradeLevelRange: [number, number];
  confidence: number;
  metrics: ReadabilityMetrics;
  recommendations: string[];
  complexity: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
}

export interface ReadabilityMetrics {
  // Basic metrics
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;

  // Complexity indicators
  uniqueWordRatio: number;
  longWordRatio: number; // Words with 3+ syllables
  complexSentenceRatio: number;

  // Vocabulary level
  vocabularyLevel: number;
  academicWordRatio: number;

  // Language-specific
  language: 'spanish' | 'english';
  dialectFeatures?: string[];
}

export class ReadingLevelAssessor {
  // Flesch-Kincaid grade level ranges for K-5
  private static readonly GRADE_LEVEL_RANGES = {
    0: { min: 0, max: 1.5, name: 'Kindergarten' },
    1: { min: 1.0, max: 2.5, name: 'First Grade' },
    2: { min: 2.0, max: 3.5, name: 'Second Grade' },
    3: { min: 3.0, max: 4.5, name: 'Third Grade' },
    4: { min: 4.0, max: 5.5, name: 'Fourth Grade' },
    5: { min: 5.0, max: 7.0, name: 'Fifth Grade' }
  };

  // Expected vocabulary sizes by grade (approximate)
  private static readonly EXPECTED_VOCABULARY = {
    0: 500,    // K: 500 words
    1: 1000,   // 1st: 1,000 words
    2: 2000,   // 2nd: 2,000 words
    3: 3000,   // 3rd: 3,000 words
    4: 4000,   // 4th: 4,000 words
    5: 5000    // 5th: 5,000 words
  };

  // Common academic vocabulary for each grade
  private static readonly ACADEMIC_VOCABULARY: Record<number, Set<string>> = {
    0: new Set(['color', 'shape', 'big', 'small', 'number', 'letter']),
    1: new Set(['add', 'subtract', 'compare', 'order', 'group', 'pattern']),
    2: new Set(['measure', 'estimate', 'solve', 'explain', 'describe', 'identify']),
    3: new Set(['analyze', 'conclude', 'evidence', 'predict', 'sequence', 'classify']),
    4: new Set(['evaluate', 'justify', 'synthesize', 'interpret', 'formulate', 'demonstrate']),
    5: new Set(['critique', 'hypothesize', 'deduce', 'infer', 'generalize', 'collaborate'])
  };

  /**
   * Assess reading level of text
   */
  public static assess(text: string, language: 'spanish' | 'english'): ReadingLevelResult {
    // Calculate basic metrics
    const metrics = this.calculateMetrics(text, language);

    // Calculate grade level using multiple formulas
    const gradeLevels = [
      this.calculateFleschKincaid(metrics, language),
      this.calculateFogIndex(metrics),
      this.calculateSMOGIndex(metrics),
      this.calculateColemanLiau(metrics)
    ];

    // Average the results and bound to K-5 range
    const averageGrade = gradeLevels.reduce((a, b) => a + b, 0) / gradeLevels.length;
    const gradeLevel = Math.max(0, Math.min(5, Math.round(averageGrade)));

    // Calculate grade range
    const standardDeviation = this.calculateStandardDeviation(gradeLevels);
    const gradeLevelRange: [number, number] = [
      Math.max(0, Math.floor(averageGrade - standardDeviation)),
      Math.min(5, Math.ceil(averageGrade + standardDeviation))
    ];

    // Calculate confidence based on agreement between formulas
    const confidence = this.calculateConfidence(gradeLevels, standardDeviation);

    // Determine complexity
    const complexity = this.determineComplexity(gradeLevel);

    // Generate recommendations
    const recommendations = this.generateRecommendations(gradeLevel, metrics);

    return {
      gradeLevel,
      gradeLevelRange,
      confidence,
      metrics,
      recommendations,
      complexity
    };
  }

  /**
   * Calculate comprehensive readability metrics
   */
  public static calculateMetrics(text: string, language: 'spanish' | 'english'): ReadabilityMetrics {
    const sentences = this.getSentences(text);
    const words = this.getWords(text);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    const sentenceCount = sentences.length || 1;
    const wordCount = words.length || 1;
    const syllableCount = words.reduce((sum, word) => sum + this.countSyllables(word, language), 0);

    // Calculate ratios
    const averageWordsPerSentence = wordCount / sentenceCount;
    const averageSyllablesPerWord = syllableCount / wordCount;
    const uniqueWordRatio = uniqueWords.size / wordCount;

    // Long words (3+ syllables)
    const longWords = words.filter(word => this.countSyllables(word, language) >= 3);
    const longWordRatio = longWords.length / wordCount;

    // Complex sentences (15+ words)
    const complexSentences = sentences.filter(s => this.getWords(s).length >= 15);
    const complexSentenceRatio = complexSentences.length / sentenceCount;

    // Academic vocabulary
    const academicWords = this.countAcademicWords(words);
    const academicWordRatio = academicWords / wordCount;

    // Vocabulary level estimation
    const vocabularyLevel = this.estimateVocabularyLevel(uniqueWords.size);

    return {
      wordCount,
      sentenceCount,
      syllableCount,
      averageWordsPerSentence,
      averageSyllablesPerWord,
      uniqueWordRatio,
      longWordRatio,
      complexSentenceRatio,
      vocabularyLevel,
      academicWordRatio,
      language
    };
  }

  /**
   * Flesch-Kincaid Grade Level
   * Adapted for Spanish and English
   */
  private static calculateFleschKincaid(metrics: ReadabilityMetrics, language: 'spanish' | 'english'): number {
    const { averageWordsPerSentence, averageSyllablesPerWord } = metrics;

    if (language === 'english') {
      // English formula
      return 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
    } else {
      // Spanish formula (adjusted coefficients)
      // Spanish tends to have more syllables, so we adjust the weight
      return 0.40 * averageWordsPerSentence + 9.0 * averageSyllablesPerWord - 13.0;
    }
  }

  /**
   * Gunning Fog Index
   */
  private static calculateFogIndex(metrics: ReadabilityMetrics): number {
    const { averageWordsPerSentence, longWordRatio } = metrics;
    return 0.4 * (averageWordsPerSentence + 100 * longWordRatio);
  }

  /**
   * SMOG Index (Simple Measure of Gobbledygook)
   */
  private static calculateSMOGIndex(metrics: ReadabilityMetrics): number {
    const { sentenceCount, longWordRatio, wordCount } = metrics;
    const polysyllables = longWordRatio * wordCount;

    if (sentenceCount < 30) {
      // Adjusted for shorter texts
      return 1.0430 * Math.sqrt(polysyllables * (30 / sentenceCount)) + 3.1291;
    }

    return 1.0430 * Math.sqrt(polysyllables) + 3.1291;
  }

  /**
   * Coleman-Liau Index
   */
  private static calculateColemanLiau(metrics: ReadabilityMetrics): number {
    const { wordCount, sentenceCount } = metrics;
    const characters = wordCount * metrics.averageSyllablesPerWord * 2.5; // Approximation

    const L = (characters / wordCount) * 100; // Average letters per 100 words
    const S = (sentenceCount / wordCount) * 100; // Average sentences per 100 words

    return 0.0588 * L - 0.296 * S - 15.8;
  }

  /**
   * Count syllables in a word
   */
  private static countSyllables(word: string, language: 'spanish' | 'english'): number {
    const cleanWord = word.toLowerCase().replace(/[^a-záéíóúñü]/g, '');

    if (cleanWord.length === 0) return 0;
    if (cleanWord.length <= 3) return 1;

    if (language === 'spanish') {
      return this.countSpanishSyllables(cleanWord);
    } else {
      return this.countEnglishSyllables(cleanWord);
    }
  }

  /**
   * Count syllables in Spanish word
   */
  private static countSpanishSyllables(word: string): number {
    const vowels = 'aeiouáéíóúü';
    let count = 0;
    let previousWasVowel = false;

    for (const char of word) {
      const isVowel = vowels.includes(char);

      if (isVowel && !previousWasVowel) {
        count++;
      }

      previousWasVowel = isVowel;
    }

    return Math.max(1, count);
  }

  /**
   * Count syllables in English word
   */
  private static countEnglishSyllables(word: string): number {
    // Simple syllable counting for English
    let count = 0;
    const vowels = 'aeiouy';
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isVowel = vowels.includes(char);

      if (isVowel && !previousWasVowel) {
        count++;
      }

      previousWasVowel = isVowel;
    }

    // Adjust for silent 'e'
    if (word.endsWith('e') && count > 1) {
      count--;
    }

    return Math.max(1, count);
  }

  /**
   * Get sentences from text
   */
  private static getSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  /**
   * Get words from text
   */
  private static getWords(text: string): string[] {
    return text
      .split(/\s+/)
      .map(w => w.replace(/[^\wáéíóúñü]/g, ''))
      .filter(w => w.length > 0);
  }

  /**
   * Count academic vocabulary words
   */
  private static countAcademicWords(words: string[]): number {
    let count = 0;
    const allAcademicWords = new Set<string>();

    Object.values(this.ACADEMIC_VOCABULARY).forEach(gradeSet => {
      gradeSet.forEach(word => allAcademicWords.add(word.toLowerCase()));
    });

    words.forEach(word => {
      if (allAcademicWords.has(word.toLowerCase())) {
        count++;
      }
    });

    return count;
  }

  /**
   * Estimate vocabulary level based on unique word count
   */
  private static estimateVocabularyLevel(uniqueWordCount: number): number {
    for (let grade = 0; grade <= 5; grade++) {
      if (uniqueWordCount <= this.EXPECTED_VOCABULARY[grade as keyof typeof this.EXPECTED_VOCABULARY]) {
        return grade;
      }
    }
    return 5;
  }

  /**
   * Calculate standard deviation
   */
  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate confidence in assessment
   */
  private static calculateConfidence(gradeLevels: number[], standardDeviation: number): number {
    // Lower standard deviation = higher confidence
    // SD of 0 = 100% confidence, SD of 2+ = low confidence
    const sdConfidence = Math.max(0, 1 - (standardDeviation / 2));

    // Check if all formulas agree within 1 grade level
    const min = Math.min(...gradeLevels);
    const max = Math.max(...gradeLevels);
    const agreementConfidence = max - min <= 1 ? 1 : 0.7;

    return (sdConfidence + agreementConfidence) / 2;
  }

  /**
   * Determine complexity level
   */
  private static determineComplexity(gradeLevel: number): 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard' {
    if (gradeLevel <= 1) return 'very-easy';
    if (gradeLevel <= 2) return 'easy';
    if (gradeLevel <= 3) return 'medium';
    if (gradeLevel <= 4) return 'hard';
    return 'very-hard';
  }

  /**
   * Generate recommendations for improving readability
   */
  private static generateRecommendations(gradeLevel: number, metrics: ReadabilityMetrics): string[] {
    const recommendations: string[] = [];

    // Sentence length recommendations
    if (metrics.averageWordsPerSentence > 15) {
      recommendations.push('Consider shortening sentences for better readability');
    } else if (metrics.averageWordsPerSentence < 6 && gradeLevel >= 2) {
      recommendations.push('Sentences could be slightly longer to develop ideas');
    }

    // Vocabulary recommendations
    if (metrics.uniqueWordRatio < 0.5) {
      recommendations.push('Consider introducing more varied vocabulary');
    }

    if (metrics.longWordRatio > 0.3 && gradeLevel <= 2) {
      recommendations.push('Reduce complex words for younger readers');
    }

    // Academic vocabulary
    if (metrics.academicWordRatio < 0.05 && gradeLevel >= 3) {
      recommendations.push('Consider including more academic vocabulary');
    }

    // Complexity
    if (metrics.complexSentenceRatio > 0.5 && gradeLevel <= 2) {
      recommendations.push('Simplify sentence structures for younger students');
    }

    return recommendations;
  }

  /**
   * Assess if text is appropriate for grade level
   */
  public static isAppropriateForGrade(text: string, targetGrade: number, language: 'spanish' | 'english'): {
    appropriate: boolean;
    assessment: ReadingLevelResult;
    reason: string;
  } {
    const assessment = this.assess(text, language);
    const [minGrade, maxGrade] = assessment.gradeLevelRange;

    const appropriate = targetGrade >= minGrade && targetGrade <= maxGrade;

    let reason = '';
    if (!appropriate) {
      if (targetGrade < minGrade) {
        reason = `Text is too difficult for grade ${targetGrade}. Assessed at grade ${assessment.gradeLevel}.`;
      } else {
        reason = `Text is too easy for grade ${targetGrade}. Assessed at grade ${assessment.gradeLevel}.`;
      }
    } else {
      reason = `Text is appropriate for grade ${targetGrade}.`;
    }

    return {
      appropriate,
      assessment,
      reason
    };
  }

  /**
   * Batch assess multiple texts
   */
  public static assessBatch(
    texts: Array<{ text: string; language: 'spanish' | 'english' }>,
  ): ReadingLevelResult[] {
    return texts.map(({ text, language }) => this.assess(text, language));
  }

  /**
   * Get recommended grade level range
   */
  public static getGradeInfo(grade: number): { min: number; max: number; name: string } {
    return this.GRADE_LEVEL_RANGES[grade as keyof typeof this.GRADE_LEVEL_RANGES] ||
      { min: 0, max: 7, name: 'Unknown' };
  }
}

export default ReadingLevelAssessor;
