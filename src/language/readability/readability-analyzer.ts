/**
 * Reading Level Analysis
 * Implements Flesch-Kincaid (English) and INFLESZ (Spanish) readability metrics
 */

import { type SupportedLanguage } from '../config/language-config';
import { type ProcessedText } from '../processing/text-processor';

export interface ReadabilityScore {
  score: number;
  gradeLevel: string; // K, 1, 2, 3, 4, 5
  difficulty: 'very-easy' | 'easy' | 'moderate' | 'difficult' | 'very-difficult';
  method: 'flesch-kincaid' | 'inflesz' | 'hybrid';
  details: {
    totalWords: number;
    totalSentences: number;
    totalSyllables: number;
    averageWordsPerSentence: number;
    averageSyllablesPerWord: number;
    complexWordPercentage: number;
  };
  recommendations: string[];
}

export class ReadabilityAnalyzer {
  private language: SupportedLanguage;

  constructor(language: SupportedLanguage = 'en') {
    this.language = language;
  }

  /**
   * Analyze readability of processed text
   */
  analyze(processedText: ProcessedText): ReadabilityScore {
    const details = this.calculateDetails(processedText);

    let score: number;
    let method: ReadabilityScore['method'];

    // Use appropriate formula based on language
    if (this.language === 'en') {
      score = this.calculateFleschKincaid(details);
      method = 'flesch-kincaid';
    } else if (this.language === 'es' || this.language === 'es-PR') {
      score = this.calculateINFLESZ(details);
      method = 'inflesz';
    } else {
      // Fallback to hybrid
      score = this.calculateHybridScore(details);
      method = 'hybrid';
    }

    const gradeLevel = this.mapToGradeLevel(score, method);
    const difficulty = this.determineDifficulty(score, method);
    const recommendations = this.generateRecommendations(score, details, method);

    return {
      score,
      gradeLevel,
      difficulty,
      method,
      details,
      recommendations
    };
  }

  /**
   * Calculate text details for readability analysis
   */
  private calculateDetails(processedText: ProcessedText): ReadabilityScore['details'] {
    const { tokens, statistics } = processedText;

    // Count syllables for each word
    const words = tokens.filter(t => t.isWord);
    const totalSyllables = words.reduce((sum, token) =>
      sum + this.countSyllables(token.text, this.language), 0
    );

    // Count complex words (3+ syllables)
    const complexWords = words.filter(token =>
      this.countSyllables(token.text, this.language) >= 3
    ).length;

    const totalWords = statistics.wordCount;
    const complexWordPercentage = totalWords > 0 ? (complexWords / totalWords) * 100 : 0;

    return {
      totalWords,
      totalSentences: statistics.sentenceCount,
      totalSyllables,
      averageWordsPerSentence: statistics.averageWordsPerSentence,
      averageSyllablesPerWord: totalWords > 0 ? totalSyllables / totalWords : 0,
      complexWordPercentage
    };
  }

  /**
   * Calculate Flesch-Kincaid Grade Level (English)
   * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
   */
  private calculateFleschKincaid(details: ReadabilityScore['details']): number {
    const { totalWords, totalSentences, totalSyllables } = details;

    if (totalSentences === 0 || totalWords === 0) return 0;

    const wordsPerSentence = totalWords / totalSentences;
    const syllablesPerWord = totalSyllables / totalWords;

    const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

    // Normalize to 0-12 scale for K-12
    return Math.max(0, Math.min(12, grade));
  }

  /**
   * Calculate INFLESZ (Spanish readability)
   * Formula: 206.835 - 1.015 * (words/sentences) - 60 * (syllables/words)
   * Then convert to grade level using Fernández Huerta scale
   */
  private calculateINFLESZ(details: ReadabilityScore['details']): number {
    const { totalWords, totalSentences, totalSyllables } = details;

    if (totalSentences === 0 || totalWords === 0) return 0;

    const wordsPerSentence = totalWords / totalSentences;
    const syllablesPerWord = totalSyllables / totalWords;

    // Fernández Huerta formula (adapted for Spanish)
    const perspicuity = 206.835 - (1.015 * wordsPerSentence) - (60 * syllablesPerWord);

    // Convert perspicuity score to grade level (0-12)
    // Higher perspicuity = easier reading = lower grade
    if (perspicuity >= 90) return 1;
    if (perspicuity >= 80) return 2;
    if (perspicuity >= 70) return 3;
    if (perspicuity >= 60) return 4;
    if (perspicuity >= 50) return 5;
    if (perspicuity >= 40) return 6;
    if (perspicuity >= 30) return 7;
    return 8;
  }

  /**
   * Calculate hybrid score for unknown languages
   */
  private calculateHybridScore(details: ReadabilityScore['details']): number {
    // Simple heuristic based on complexity metrics
    const sentenceComplexity = Math.min(details.averageWordsPerSentence / 20, 1) * 4;
    const wordComplexity = Math.min(details.averageSyllablesPerWord / 3, 1) * 4;
    const vocabularyComplexity = (details.complexWordPercentage / 100) * 4;

    return sentenceComplexity + wordComplexity + vocabularyComplexity;
  }

  /**
   * Count syllables in a word
   */
  private countSyllables(word: string, language: SupportedLanguage): number {
    if (!word || word.length === 0) return 0;

    const lowerWord = word.toLowerCase();

    if (language === 'en') {
      return this.countEnglishSyllables(lowerWord);
    } else if (language === 'es' || language === 'es-PR') {
      return this.countSpanishSyllables(lowerWord);
    }

    // Fallback
    return this.countEnglishSyllables(lowerWord);
  }

  /**
   * Count syllables in English word
   */
  private countEnglishSyllables(word: string): number {
    // Remove non-letters
    word = word.replace(/[^a-z]/g, '');

    if (word.length <= 3) return 1;

    // Count vowel groups
    let syllables = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = /[aeiouy]/.test(word[i]);

      if (isVowel && !previousWasVowel) {
        syllables++;
      }

      previousWasVowel = isVowel;
    }

    // Adjust for silent 'e'
    if (word.endsWith('e')) {
      syllables = Math.max(1, syllables - 1);
    }

    // Adjust for 'le' ending
    if (word.length > 2 && word.endsWith('le') && !/[aeiouy]/.test(word[word.length - 3])) {
      syllables++;
    }

    return Math.max(1, syllables);
  }

  /**
   * Count syllables in Spanish word
   */
  private countSpanishSyllables(word: string): number {
    // Remove non-letters (keep accented characters)
    word = word.replace(/[^a-záéíóúüñ]/g, '');

    if (word.length <= 2) return 1;

    // Spanish vowels (including accented)
    const vowels = /[aeiouáéíóúü]/;
    let syllables = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.test(word[i]);

      if (isVowel) {
        // Check for diphthongs (two vowels that form one syllable)
        if (!previousWasVowel) {
          syllables++;
        } else {
          // Weak vowels (i, u) with strong vowels form diphthongs
          const current = word[i];
          const previous = word[i - 1];

          const isWeakCurrent = /[iuü]/.test(current);
          const isWeakPrevious = /[iuü]/.test(previous);

          // If both are weak or accented vowels break diphthong
          if ((/[áéíóú]/.test(current) || /[áéíóú]/.test(previous)) ||
              (isWeakCurrent && isWeakPrevious)) {
            syllables++;
          }
        }
      }

      previousWasVowel = isVowel;
    }

    return Math.max(1, syllables);
  }

  /**
   * Map score to K-5 grade level
   */
  private mapToGradeLevel(score: number, method: ReadabilityScore['method']): string {
    if (method === 'inflesz') {
      // INFLESZ already returns grade level directly
      if (score <= 1) return 'K';
      if (score <= 2) return '1';
      if (score <= 3) return '2';
      if (score <= 4) return '3';
      if (score <= 5) return '4';
      return '5';
    }

    // Flesch-Kincaid and hybrid mapping
    if (score <= 1) return 'K';
    if (score <= 2) return '1';
    if (score <= 3) return '2';
    if (score <= 4) return '3';
    if (score <= 5) return '4';
    return '5';
  }

  /**
   * Determine difficulty level
   */
  private determineDifficulty(
    score: number,
    method: ReadabilityScore['method']
  ): ReadabilityScore['difficulty'] {
    if (method === 'inflesz') {
      if (score <= 2) return 'very-easy';
      if (score <= 3) return 'easy';
      if (score <= 4) return 'moderate';
      if (score <= 5) return 'difficult';
      return 'very-difficult';
    }

    // Flesch-Kincaid scale
    if (score <= 2) return 'very-easy';
    if (score <= 4) return 'easy';
    if (score <= 6) return 'moderate';
    if (score <= 8) return 'difficult';
    return 'very-difficult';
  }

  /**
   * Generate recommendations for improving readability
   */
  private generateRecommendations(
    score: number,
    details: ReadabilityScore['details'],
    method: ReadabilityScore['method']
  ): string[] {
    const recommendations: string[] = [];

    // Check sentence length
    if (details.averageWordsPerSentence > 15) {
      recommendations.push('Consider breaking long sentences into shorter ones.');
    }

    // Check word complexity
    if (details.averageSyllablesPerWord > 2) {
      recommendations.push('Try using simpler words with fewer syllables.');
    }

    // Check complex word percentage
    if (details.complexWordPercentage > 15) {
      recommendations.push('Reduce the number of complex words (3+ syllables).');
    }

    // Grade-specific recommendations
    const gradeLevel = this.mapToGradeLevel(score, method);
    if (gradeLevel === '5' || score > 5) {
      recommendations.push('Content may be too advanced for K-5 students.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Text readability is appropriate for the target grade level.');
    }

    return recommendations;
  }

  /**
   * Set analysis language
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
  }
}

export default ReadabilityAnalyzer;
