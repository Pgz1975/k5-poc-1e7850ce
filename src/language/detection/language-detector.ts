/**
 * Language Detection System
 * Detects language (English, Spanish, Puerto Rican Spanish) with confidence scoring
 */

import {
  LANGUAGE_CONFIGS,
  PR_SPANISH_MARKERS,
  CODE_SWITCHING_PATTERNS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage
} from '../config/language-config';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  isPuertoRicanSpanish: boolean;
  hasCodeSwitching: boolean;
  codeSwitchingPatterns: string[];
  dialectMarkers: string[];
  alternativeLanguages: Array<{
    language: SupportedLanguage;
    confidence: number;
  }>;
}

export class LanguageDetector {
  private minConfidenceThreshold = 0.6;

  /**
   * Detect language from text with confidence scoring
   */
  detect(text: string): LanguageDetectionResult {
    if (!text || text.trim().length === 0) {
      return this.createDefaultResult();
    }

    const normalizedText = text.toLowerCase().trim();

    // Calculate scores for each language
    const scores = {
      english: this.calculateEnglishScore(normalizedText),
      spanish: this.calculateSpanishScore(normalizedText),
      puerto_rican: this.calculatePuertoRicanScore(normalizedText)
    };

    // Detect code-switching
    const codeSwitching = this.detectCodeSwitching(normalizedText);

    // Determine primary language
    const primaryLanguage = this.determinePrimaryLanguage(scores);
    const isPuertoRican = scores.puerto_rican > 0.5 && primaryLanguage !== SUPPORTED_LANGUAGES.ENGLISH;

    // Get dialect markers
    const dialectMarkers = isPuertoRican ? this.extractDialectMarkers(normalizedText) : [];

    // Calculate final confidence
    const confidence = this.calculateConfidence(scores, primaryLanguage);

    // Get alternative languages
    const alternatives = this.getAlternativeLanguages(scores, primaryLanguage);

    return {
      language: isPuertoRican ? SUPPORTED_LANGUAGES.SPANISH_PR : primaryLanguage,
      confidence,
      isPuertoRicanSpanish: isPuertoRican,
      hasCodeSwitching: codeSwitching.length > 0,
      codeSwitchingPatterns: codeSwitching,
      dialectMarkers,
      alternativeLanguages: alternatives
    };
  }

  /**
   * Calculate English language score
   */
  private calculateEnglishScore(text: string): number {
    const config = LANGUAGE_CONFIGS.en;
    let score = 0;
    let totalWords = 0;

    const words = text.split(/\s+/);
    totalWords = words.length;

    // Check for English stop words
    const stopWordMatches = words.filter(word =>
      config.stopWords.includes(word)
    ).length;
    score += (stopWordMatches / totalWords) * 0.5;

    // Check for English common words
    const commonWordMatches = words.filter(word =>
      config.commonWords.includes(word)
    ).length;
    score += (commonWordMatches / totalWords) * 0.3;

    // Check for absence of Spanish special characters
    const hasSpanishChars = LANGUAGE_CONFIGS.es.specialCharacters.some(char =>
      text.includes(char)
    );
    if (!hasSpanishChars) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate Spanish language score
   */
  private calculateSpanishScore(text: string): number {
    const config = LANGUAGE_CONFIGS.es;
    let score = 0;
    let totalWords = 0;

    const words = text.split(/\s+/);
    totalWords = words.length;

    // Check for Spanish stop words
    const stopWordMatches = words.filter(word =>
      config.stopWords.includes(word)
    ).length;
    score += (stopWordMatches / totalWords) * 0.5;

    // Check for Spanish common words
    const commonWordMatches = words.filter(word =>
      config.commonWords.includes(word)
    ).length;
    score += (commonWordMatches / totalWords) * 0.3;

    // Check for Spanish special characters
    const spanishCharCount = config.specialCharacters.filter(char =>
      text.includes(char)
    ).length;
    score += (spanishCharCount / config.specialCharacters.length) * 0.2;

    return Math.min(score, 1.0);
  }

  /**
   * Calculate Puerto Rican Spanish score
   */
  private calculatePuertoRicanScore(text: string): number {
    let score = 0;

    // Check vocabulary markers
    const vocabMatches = PR_SPANISH_MARKERS.vocabulary.filter(word =>
      text.includes(word)
    ).length;
    score += (vocabMatches / PR_SPANISH_MARKERS.vocabulary.length) * 0.4;

    // Check phonetic patterns
    const phoneticMatches = PR_SPANISH_MARKERS.phonetic.filter(pattern =>
      pattern.test(text)
    ).length;
    score += (phoneticMatches / PR_SPANISH_MARKERS.phonetic.length) * 0.3;

    // Check grammar patterns
    const grammarMatches = PR_SPANISH_MARKERS.grammar.filter(pattern =>
      pattern.test(text)
    ).length;
    score += (grammarMatches / PR_SPANISH_MARKERS.grammar.length) * 0.3;

    return Math.min(score, 1.0);
  }

  /**
   * Detect code-switching patterns
   */
  private detectCodeSwitching(text: string): string[] {
    const patterns: string[] = [];

    CODE_SWITCHING_PATTERNS.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        patterns.push(`Pattern ${index + 1}: ${matches[0]}`);
      }
    });

    return patterns;
  }

  /**
   * Extract Puerto Rican dialect markers
   */
  private extractDialectMarkers(text: string): string[] {
    const markers: string[] = [];

    // Find vocabulary markers
    PR_SPANISH_MARKERS.vocabulary.forEach(word => {
      if (text.includes(word)) {
        markers.push(`Vocabulary: ${word}`);
      }
    });

    // Find phonetic markers
    PR_SPANISH_MARKERS.phonetic.forEach((pattern, index) => {
      if (pattern.test(text)) {
        markers.push(`Phonetic pattern ${index + 1}`);
      }
    });

    // Find grammar markers
    PR_SPANISH_MARKERS.grammar.forEach((pattern, index) => {
      if (pattern.test(text)) {
        markers.push(`Grammar pattern ${index + 1}`);
      }
    });

    return markers;
  }

  /**
   * Determine primary language from scores
   */
  private determinePrimaryLanguage(scores: {
    english: number;
    spanish: number;
    puerto_rican: number;
  }): SupportedLanguage {
    if (scores.english > scores.spanish) {
      return SUPPORTED_LANGUAGES.ENGLISH;
    }
    return SUPPORTED_LANGUAGES.SPANISH;
  }

  /**
   * Calculate final confidence score
   */
  private calculateConfidence(
    scores: { english: number; spanish: number; puerto_rican: number },
    primaryLanguage: SupportedLanguage
  ): number {
    const primaryScore = primaryLanguage === SUPPORTED_LANGUAGES.ENGLISH
      ? scores.english
      : scores.spanish;

    // Adjust confidence based on score differential
    const otherScore = primaryLanguage === SUPPORTED_LANGUAGES.ENGLISH
      ? scores.spanish
      : scores.english;

    const differential = primaryScore - otherScore;
    return Math.max(this.minConfidenceThreshold, Math.min(primaryScore + differential * 0.2, 1.0));
  }

  /**
   * Get alternative language suggestions
   */
  private getAlternativeLanguages(
    scores: { english: number; spanish: number; puerto_rican: number },
    primaryLanguage: SupportedLanguage
  ): Array<{ language: SupportedLanguage; confidence: number }> {
    const alternatives: Array<{ language: SupportedLanguage; confidence: number }> = [];

    if (primaryLanguage === SUPPORTED_LANGUAGES.ENGLISH && scores.spanish > 0.3) {
      alternatives.push({
        language: SUPPORTED_LANGUAGES.SPANISH,
        confidence: scores.spanish
      });
    } else if (primaryLanguage === SUPPORTED_LANGUAGES.SPANISH && scores.english > 0.3) {
      alternatives.push({
        language: SUPPORTED_LANGUAGES.ENGLISH,
        confidence: scores.english
      });
    }

    return alternatives;
  }

  /**
   * Create default result for empty text
   */
  private createDefaultResult(): LanguageDetectionResult {
    return {
      language: SUPPORTED_LANGUAGES.ENGLISH,
      confidence: 0,
      isPuertoRicanSpanish: false,
      hasCodeSwitching: false,
      codeSwitchingPatterns: [],
      dialectMarkers: [],
      alternativeLanguages: []
    };
  }
}

export default LanguageDetector;
