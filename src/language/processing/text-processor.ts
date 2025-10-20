/**
 * Text Processing Pipeline
 * Tokenization, sentence segmentation, and formatting for Spanish and English
 */

import { LANGUAGE_CONFIGS, type SupportedLanguage } from '../config/language-config';

export interface Token {
  text: string;
  position: number;
  isWord: boolean;
  isPunctuation: boolean;
  isNumber: boolean;
  isSpecialChar: boolean;
}

export interface Sentence {
  text: string;
  startIndex: number;
  endIndex: number;
  tokens: Token[];
}

export interface Paragraph {
  text: string;
  startIndex: number;
  endIndex: number;
  sentences: Sentence[];
}

export interface ProcessedText {
  originalText: string;
  normalizedText: string;
  paragraphs: Paragraph[];
  sentences: Sentence[];
  tokens: Token[];
  statistics: {
    paragraphCount: number;
    sentenceCount: number;
    wordCount: number;
    characterCount: number;
    averageWordsPerSentence: number;
    averageSentencesPerParagraph: number;
  };
}

export class TextProcessor {
  private language: SupportedLanguage;

  constructor(language: SupportedLanguage = 'en') {
    this.language = language;
  }

  /**
   * Process text through complete pipeline
   */
  process(text: string): ProcessedText {
    if (!text || text.trim().length === 0) {
      return this.createEmptyResult();
    }

    // Normalize text
    const normalizedText = this.normalizeText(text);

    // Extract paragraphs
    const paragraphs = this.extractParagraphs(normalizedText);

    // Extract all sentences
    const allSentences = paragraphs.flatMap(p => p.sentences);

    // Extract all tokens
    const allTokens = allSentences.flatMap(s => s.tokens);

    // Calculate statistics
    const statistics = this.calculateStatistics(paragraphs, allSentences, allTokens);

    return {
      originalText: text,
      normalizedText,
      paragraphs,
      sentences: allSentences,
      tokens: allTokens,
      statistics
    };
  }

  /**
   * Normalize text while preserving special characters
   */
  private normalizeText(text: string): string {
    // Preserve special Spanish characters
    let normalized = text;

    // Normalize whitespace
    normalized = normalized.replace(/\r\n/g, '\n'); // Windows line endings
    normalized = normalized.replace(/\r/g, '\n');   // Old Mac line endings
    normalized = normalized.replace(/\t/g, ' ');     // Tabs to spaces
    normalized = normalized.replace(/ +/g, ' ');     // Multiple spaces to single

    // Preserve paragraph breaks (double newlines)
    normalized = normalized.replace(/\n\n+/g, '\n\n');

    return normalized.trim();
  }

  /**
   * Extract paragraphs from text
   */
  private extractParagraphs(text: string): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    const paragraphTexts = text.split(/\n\n+/);

    let currentIndex = 0;

    paragraphTexts.forEach(paraText => {
      const trimmedPara = paraText.trim();
      if (trimmedPara.length === 0) return;

      const startIndex = text.indexOf(trimmedPara, currentIndex);
      const endIndex = startIndex + trimmedPara.length;

      // Extract sentences for this paragraph
      const sentences = this.extractSentences(trimmedPara, startIndex);

      paragraphs.push({
        text: trimmedPara,
        startIndex,
        endIndex,
        sentences
      });

      currentIndex = endIndex;
    });

    return paragraphs;
  }

  /**
   * Extract sentences from text
   */
  private extractSentences(text: string, baseIndex: number = 0): Sentence[] {
    const sentences: Sentence[] = [];

    // Sentence boundary patterns for both languages
    // Handle Spanish ¿? and ¡! punctuation
    const sentencePattern = /[^.!?¿¡]+[.!?]+["']?|[^.!?¿¡]+$/g;
    const matches = text.match(sentencePattern);

    if (!matches) return sentences;

    let currentIndex = 0;

    matches.forEach(match => {
      const trimmedSentence = match.trim();
      if (trimmedSentence.length === 0) return;

      const startIndex = text.indexOf(trimmedSentence, currentIndex);
      const endIndex = startIndex + trimmedSentence.length;

      // Tokenize sentence
      const tokens = this.tokenize(trimmedSentence, baseIndex + startIndex);

      sentences.push({
        text: trimmedSentence,
        startIndex: baseIndex + startIndex,
        endIndex: baseIndex + endIndex,
        tokens
      });

      currentIndex = endIndex;
    });

    return sentences;
  }

  /**
   * Tokenize text into words and symbols
   */
  tokenize(text: string, baseIndex: number = 0): Token[] {
    const tokens: Token[] = [];

    // Pattern that handles Spanish special characters
    const tokenPattern = /\p{L}+|\p{N}+|[¿¡.,!?;:'"()\-–—]|\s+/gu;
    const matches = text.matchAll(tokenPattern);

    for (const match of matches) {
      const tokenText = match[0];
      const position = baseIndex + match.index!;

      // Skip whitespace tokens for the list
      if (/^\s+$/.test(tokenText)) continue;

      tokens.push({
        text: tokenText,
        position,
        isWord: /\p{L}+/u.test(tokenText),
        isPunctuation: /[¿¡.,!?;:'"()\-–—]/.test(tokenText),
        isNumber: /\p{N}+/u.test(tokenText),
        isSpecialChar: this.isSpecialCharacter(tokenText)
      });
    }

    return tokens;
  }

  /**
   * Check if text contains Spanish special characters
   */
  private isSpecialCharacter(text: string): boolean {
    const specialChars = LANGUAGE_CONFIGS[this.language]?.specialCharacters || [];
    return specialChars.some(char => text.includes(char));
  }

  /**
   * Calculate text statistics
   */
  private calculateStatistics(
    paragraphs: Paragraph[],
    sentences: Sentence[],
    tokens: Token[]
  ): ProcessedText['statistics'] {
    const wordCount = tokens.filter(t => t.isWord).length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;
    const characterCount = tokens.reduce((sum, t) => sum + t.text.length, 0);

    return {
      paragraphCount,
      sentenceCount,
      wordCount,
      characterCount,
      averageWordsPerSentence: sentenceCount > 0 ? wordCount / sentenceCount : 0,
      averageSentencesPerParagraph: paragraphCount > 0 ? sentenceCount / paragraphCount : 0
    };
  }

  /**
   * Create empty result for invalid input
   */
  private createEmptyResult(): ProcessedText {
    return {
      originalText: '',
      normalizedText: '',
      paragraphs: [],
      sentences: [],
      tokens: [],
      statistics: {
        paragraphCount: 0,
        sentenceCount: 0,
        wordCount: 0,
        characterCount: 0,
        averageWordsPerSentence: 0,
        averageSentencesPerParagraph: 0
      }
    };
  }

  /**
   * Set processing language
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
  }

  /**
   * Get current language
   */
  getLanguage(): SupportedLanguage {
    return this.language;
  }
}

export default TextProcessor;
