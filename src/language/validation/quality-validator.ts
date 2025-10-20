/**
 * Quality Validation System
 * Spell checking, grammar validation, completeness, and format consistency
 */

import { type SupportedLanguage, LANGUAGE_CONFIGS } from '../config/language-config';
import { type ProcessedText } from '../processing/text-processor';

export interface SpellingError {
  word: string;
  position: number;
  suggestions: string[];
  type: 'misspelling' | 'repeated-word' | 'capitalization' | 'special-char';
}

export interface GrammarError {
  text: string;
  startIndex: number;
  endIndex: number;
  rule: string;
  message: string;
  suggestions: string[];
  severity: 'error' | 'warning' | 'suggestion';
}

export interface CompletenessCheck {
  hasPunctuation: boolean;
  hasCapitalization: boolean;
  hasCompleteSentences: boolean;
  minimumWordCount: boolean;
  minimumSentenceCount: boolean;
  score: number; // 0-1
}

export interface FormatConsistency {
  consistentPunctuation: boolean;
  consistentSpacing: boolean;
  consistentCapitalization: boolean;
  properParagraphStructure: boolean;
  score: number; // 0-1
}

export interface ValidationResult {
  isValid: boolean;
  overallScore: number; // 0-1
  spellingErrors: SpellingError[];
  grammarErrors: GrammarError[];
  completeness: CompletenessCheck;
  consistency: FormatConsistency;
  summary: string[];
}

export class QualityValidator {
  private language: SupportedLanguage;
  private customDictionary: Set<string> = new Set();

  // Common misspellings and corrections
  private static COMMON_CORRECTIONS: Record<string, Record<string, string[]>> = {
    en: {
      'teh': ['the'],
      'recieve': ['receive'],
      'occured': ['occurred'],
      'seperate': ['separate'],
      'definately': ['definitely'],
      'accomodate': ['accommodate'],
      'necesary': ['necessary'],
      'wierd': ['weird']
    },
    es: {
      'aver': ['a ver', 'haber'],
      'halla': ['haya', 'allá'],
      'echo': ['hecho'],
      'asia': ['hacia', 'hacía'],
      'tubo': ['tuvo'],
      'aya': ['haya', 'allá'],
      'valla': ['vaya'],
      'balla': ['vaya', 'baya']
    }
  };

  // Grammar rules
  private static GRAMMAR_RULES: Record<string, Array<{
    pattern: RegExp;
    rule: string;
    message: string;
    suggestion: string;
  }>> = {
    en: [
      {
        pattern: /\ba\s+[aeiou]/i,
        rule: 'article-usage',
        message: 'Use "an" before vowel sounds',
        suggestion: 'Replace "a" with "an"'
      },
      {
        pattern: /\ban\s+[^aeiou]/i,
        rule: 'article-usage',
        message: 'Use "a" before consonant sounds',
        suggestion: 'Replace "an" with "a"'
      },
      {
        pattern: /\b(their|there|they're)\s+(is|are)\b/i,
        rule: 'homophone-confusion',
        message: 'Check their/there/they\'re usage',
        suggestion: 'Verify correct form'
      },
      {
        pattern: /\byour\s+(doing|going|being)\b/i,
        rule: 'your-youre',
        message: 'Should this be "you\'re"?',
        suggestion: 'Replace "your" with "you\'re"'
      },
      {
        pattern: /[.!?]\s*[a-z]/,
        rule: 'capitalization',
        message: 'Sentence should start with capital letter',
        suggestion: 'Capitalize first word'
      }
    ],
    es: [
      {
        pattern: /\b(el|la|los|las)\s+(el|la|los|las)\b/i,
        rule: 'double-article',
        message: 'Duplicate article',
        suggestion: 'Remove duplicate'
      },
      {
        pattern: /\bque\s+que\b/i,
        rule: 'repeated-que',
        message: 'Repeated "que"',
        suggestion: 'Remove duplicate'
      },
      {
        pattern: /\ba\s+a\b/i,
        rule: 'repeated-preposition',
        message: 'Repeated preposition',
        suggestion: 'Remove duplicate'
      },
      {
        pattern: /[.!?]\s*[a-z]/,
        rule: 'capitalization',
        message: 'Sentence should start with capital letter',
        suggestion: 'Capitalize first word'
      },
      {
        pattern: /^[A-Z][^.!?¿¡]*$/,
        rule: 'missing-punctuation',
        message: 'Missing end punctuation',
        suggestion: 'Add period, exclamation, or question mark'
      }
    ]
  };

  constructor(language: SupportedLanguage = 'en') {
    this.language = language;
  }

  /**
   * Validate text quality
   */
  validate(processedText: ProcessedText): ValidationResult {
    const spellingErrors = this.checkSpelling(processedText);
    const grammarErrors = this.checkGrammar(processedText);
    const completeness = this.checkCompleteness(processedText);
    const consistency = this.checkConsistency(processedText);

    const overallScore = this.calculateOverallScore(
      spellingErrors.length,
      grammarErrors.length,
      completeness.score,
      consistency.score
    );

    const isValid = overallScore >= 0.7;
    const summary = this.generateSummary(
      spellingErrors,
      grammarErrors,
      completeness,
      consistency
    );

    return {
      isValid,
      overallScore,
      spellingErrors,
      grammarErrors,
      completeness,
      consistency,
      summary
    };
  }

  /**
   * Check spelling errors
   */
  private checkSpelling(processedText: ProcessedText): SpellingError[] {
    const errors: SpellingError[] = [];
    const words = processedText.tokens.filter(t => t.isWord);
    const seenWords = new Map<string, number>();

    words.forEach((token, index) => {
      const word = token.text.toLowerCase();

      // Check for repeated words
      const lastPosition = seenWords.get(word);
      if (lastPosition !== undefined && index - lastPosition === 1) {
        errors.push({
          word: token.text,
          position: token.position,
          suggestions: ['Remove duplicate'],
          type: 'repeated-word'
        });
      }
      seenWords.set(word, index);

      // Check against common corrections
      const corrections = QualityValidator.COMMON_CORRECTIONS[this.language] || {};
      if (corrections[word]) {
        errors.push({
          word: token.text,
          position: token.position,
          suggestions: corrections[word],
          type: 'misspelling'
        });
      }

      // Check capitalization (first word of sentence should be capitalized)
      if (index === 0 || this.isStartOfSentence(processedText, token.position)) {
        if (token.text[0] !== token.text[0].toUpperCase()) {
          errors.push({
            word: token.text,
            position: token.position,
            suggestions: [token.text.charAt(0).toUpperCase() + token.text.slice(1)],
            type: 'capitalization'
          });
        }
      }

      // Check for mixed special characters
      if (this.hasInconsistentSpecialChars(token.text)) {
        errors.push({
          word: token.text,
          position: token.position,
          suggestions: [this.normalizeSpecialChars(token.text)],
          type: 'special-char'
        });
      }
    });

    return errors;
  }

  /**
   * Check grammar errors
   */
  private checkGrammar(processedText: ProcessedText): GrammarError[] {
    const errors: GrammarError[] = [];
    const rules = QualityValidator.GRAMMAR_RULES[this.language] || [];
    const text = processedText.normalizedText;

    rules.forEach(rule => {
      const matches = text.matchAll(new RegExp(rule.pattern, 'g'));

      for (const match of matches) {
        errors.push({
          text: match[0],
          startIndex: match.index!,
          endIndex: match.index! + match[0].length,
          rule: rule.rule,
          message: rule.message,
          suggestions: [rule.suggestion],
          severity: 'warning'
        });
      }
    });

    return errors;
  }

  /**
   * Check completeness
   */
  private checkCompleteness(processedText: ProcessedText): CompletenessCheck {
    const { statistics, sentences, tokens } = processedText;

    const hasPunctuation = tokens.some(t => t.isPunctuation);
    const hasCapitalization = tokens.some(t => t.isWord && /[A-Z]/.test(t.text[0]));
    const hasCompleteSentences = sentences.every(s => /[.!?]$/.test(s.text.trim()));
    const minimumWordCount = statistics.wordCount >= 5;
    const minimumSentenceCount = statistics.sentenceCount >= 1;

    const checks = [
      hasPunctuation,
      hasCapitalization,
      hasCompleteSentences,
      minimumWordCount,
      minimumSentenceCount
    ];
    const score = checks.filter(Boolean).length / checks.length;

    return {
      hasPunctuation,
      hasCapitalization,
      hasCompleteSentences,
      minimumWordCount,
      minimumSentenceCount,
      score
    };
  }

  /**
   * Check format consistency
   */
  private checkConsistency(processedText: ProcessedText): FormatConsistency {
    const { normalizedText, sentences, paragraphs } = processedText;

    // Check punctuation consistency (all sentences end with same style)
    const endPunctuations = sentences.map(s => {
      const last = s.text.trim().slice(-1);
      return /[.!?]/.test(last) ? last : '';
    });
    const consistentPunctuation = new Set(endPunctuations.filter(p => p)).size <= 2;

    // Check spacing consistency
    const hasDoubleSpaces = /  +/.test(normalizedText);
    const consistentSpacing = !hasDoubleSpaces;

    // Check capitalization consistency
    const sentenceStarts = sentences.map(s => s.text.trim()[0]);
    const capitalizedStarts = sentenceStarts.filter(c => /[A-Z]/.test(c)).length;
    const consistentCapitalization = capitalizedStarts === sentenceStarts.length;

    // Check paragraph structure
    const properParagraphStructure = paragraphs.every(p => p.sentences.length >= 1);

    const checks = [
      consistentPunctuation,
      consistentSpacing,
      consistentCapitalization,
      properParagraphStructure
    ];
    const score = checks.filter(Boolean).length / checks.length;

    return {
      consistentPunctuation,
      consistentSpacing,
      consistentCapitalization,
      properParagraphStructure,
      score
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallScore(
    spellingErrorCount: number,
    grammarErrorCount: number,
    completenessScore: number,
    consistencyScore: number
  ): number {
    // Weighted scoring
    const spellingPenalty = Math.min(spellingErrorCount * 0.05, 0.3);
    const grammarPenalty = Math.min(grammarErrorCount * 0.03, 0.2);

    const baseScore = (completenessScore * 0.3) + (consistencyScore * 0.2);
    const finalScore = baseScore + 0.5 - spellingPenalty - grammarPenalty;

    return Math.max(0, Math.min(1, finalScore));
  }

  /**
   * Generate validation summary
   */
  private generateSummary(
    spellingErrors: SpellingError[],
    grammarErrors: GrammarError[],
    completeness: CompletenessCheck,
    consistency: FormatConsistency
  ): string[] {
    const summary: string[] = [];

    if (spellingErrors.length > 0) {
      summary.push(`Found ${spellingErrors.length} spelling error(s)`);
    }

    if (grammarErrors.length > 0) {
      summary.push(`Found ${grammarErrors.length} grammar issue(s)`);
    }

    if (!completeness.hasCompleteSentences) {
      summary.push('Some sentences are missing end punctuation');
    }

    if (!completeness.minimumWordCount) {
      summary.push('Text is too short (minimum 5 words)');
    }

    if (!consistency.consistentSpacing) {
      summary.push('Inconsistent spacing detected');
    }

    if (!consistency.consistentCapitalization) {
      summary.push('Inconsistent capitalization in sentences');
    }

    if (summary.length === 0) {
      summary.push('Text quality is good');
    }

    return summary;
  }

  /**
   * Check if position is start of sentence
   */
  private isStartOfSentence(processedText: ProcessedText, position: number): boolean {
    const priorText = processedText.normalizedText.substring(0, position).trim();
    return priorText.length === 0 || /[.!?]$/.test(priorText);
  }

  /**
   * Check for inconsistent special characters
   */
  private hasInconsistentSpecialChars(word: string): boolean {
    // Check for mix of accented and unaccented versions
    if (this.language === 'es' || this.language === 'es-PR') {
      const hasAccent = /[áéíóúü]/.test(word);
      const baseVowels = word.replace(/[áéíóúü]/gi, '').match(/[aeiou]/gi);
      return hasAccent && baseVowels !== null;
    }
    return false;
  }

  /**
   * Normalize special characters
   */
  private normalizeSpecialChars(word: string): string {
    // This is a simple normalization - in production would use proper dictionary
    return word;
  }

  /**
   * Add words to custom dictionary
   */
  addToCustomDictionary(words: string[]): void {
    words.forEach(word => this.customDictionary.add(word.toLowerCase()));
  }

  /**
   * Check if word is in custom dictionary
   */
  isInCustomDictionary(word: string): boolean {
    return this.customDictionary.has(word.toLowerCase());
  }

  /**
   * Set validation language
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
  }
}

export default QualityValidator;
