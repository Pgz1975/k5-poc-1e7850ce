/**
 * Text Normalization and Cleaning Module
 * Handles Spanish and English text preprocessing for educational content
 */

export interface NormalizationOptions {
  preserveCase?: boolean;
  preserveAccents?: boolean;
  removeHtmlTags?: boolean;
  removePunctuation?: boolean;
  removeNumbers?: boolean;
  normalizeWhitespace?: boolean;
  expandContractions?: boolean;
  normalizeApostrophes?: boolean;
  preservePuertoRicanTerms?: boolean;
}

export interface NormalizationResult {
  original: string;
  normalized: string;
  changes: {
    type: string;
    count: number;
    examples: string[];
  }[];
  quality: {
    cleanliness: number;
    readability: number;
  };
}

export class TextNormalizer {
  private static readonly HTML_TAG_PATTERN = /<[^>]+>/g;
  private static readonly EXTRA_WHITESPACE_PATTERN = /\s+/g;
  private static readonly PUNCTUATION_PATTERN = /[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g;
  private static readonly NUMBER_PATTERN = /\d+/g;

  // Spanish contractions and their expansions
  private static readonly SPANISH_CONTRACTIONS: Record<string, string> = {
    "pa'": "para",
    "to'": "todo",
    "na'": "nada",
    "ta'": "está",
    "pa": "para",
    "pal": "para el",
    "deja'o": "dejado",
    "acaba'o": "acabado",
    "comía'o": "comido",
    "bebía'o": "bebido"
  };

  // English contractions and their expansions
  private static readonly ENGLISH_CONTRACTIONS: Record<string, string> = {
    "can't": "cannot",
    "won't": "will not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "I'm": "I am",
    "you're": "you are",
    "he's": "he is",
    "she's": "she is",
    "it's": "it is",
    "we're": "we are",
    "they're": "they are",
    "I've": "I have",
    "you've": "you have",
    "we've": "we have",
    "they've": "they have",
    "I'll": "I will",
    "you'll": "you will",
    "he'll": "he will",
    "she'll": "she will",
    "we'll": "we will",
    "they'll": "they will"
  };

  // Puerto Rican terms to preserve
  private static readonly PUERTO_RICAN_TERMS = new Set([
    'guagua', 'zafacón', 'mahones', 'chiringa', 'china', 'nene', 'nena',
    'boricua', 'wepa', 'mofongo', 'alcapurria', 'piragua', 'mampostial',
    'tembleque', 'tripleta', 'ahorita', 'chavos', 'gomas', 'pantallas', 'nevera'
  ]);

  /**
   * Normalize text with comprehensive cleaning
   */
  public static normalize(text: string, options: NormalizationOptions = {}): NormalizationResult {
    const changes: Array<{ type: string; count: number; examples: string[] }> = [];
    let normalized = text;
    const original = text;

    // Set default options
    const opts: Required<NormalizationOptions> = {
      preserveCase: false,
      preserveAccents: true,
      removeHtmlTags: true,
      removePunctuation: false,
      removeNumbers: false,
      normalizeWhitespace: true,
      expandContractions: true,
      normalizeApostrophes: true,
      preservePuertoRicanTerms: true,
      ...options
    };

    // Step 1: Remove HTML tags
    if (opts.removeHtmlTags) {
      const { result, count, examples } = this.removeHtml(normalized);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'html_removed', count, examples });
      }
    }

    // Step 2: Normalize apostrophes and quotes
    if (opts.normalizeApostrophes) {
      const { result, count } = this.normalizeQuotesAndApostrophes(normalized);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'apostrophes_normalized', count, examples: [] });
      }
    }

    // Step 3: Expand contractions
    if (opts.expandContractions) {
      const { result, count, examples } = this.expandContractions(normalized, opts.preservePuertoRicanTerms);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'contractions_expanded', count, examples });
      }
    }

    // Step 4: Normalize whitespace
    if (opts.normalizeWhitespace) {
      const { result, count } = this.normalizeWhitespace(normalized);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'whitespace_normalized', count, examples: [] });
      }
    }

    // Step 5: Remove numbers
    if (opts.removeNumbers) {
      const { result, count, examples } = this.removeNumbers(normalized);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'numbers_removed', count, examples });
      }
    }

    // Step 6: Remove punctuation
    if (opts.removePunctuation) {
      const { result, count } = this.removePunctuation(normalized, opts.preserveAccents);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'punctuation_removed', count, examples: [] });
      }
    }

    // Step 7: Normalize case
    if (!opts.preserveCase) {
      normalized = normalized.toLowerCase();
      changes.push({ type: 'case_normalized', count: 1, examples: [] });
    }

    // Step 8: Remove accents (if requested)
    if (!opts.preserveAccents) {
      const { result, count, examples } = this.removeAccents(normalized);
      if (count > 0) {
        normalized = result;
        changes.push({ type: 'accents_removed', count, examples });
      }
    }

    // Final cleanup
    normalized = normalized.trim();

    // Calculate quality metrics
    const quality = this.assessQuality(original, normalized);

    return {
      original,
      normalized,
      changes,
      quality
    };
  }

  /**
   * Quick normalize for simple use cases
   */
  public static quickNormalize(text: string): string {
    return this.normalize(text, {
      preserveCase: false,
      preserveAccents: true,
      removeHtmlTags: true,
      normalizeWhitespace: true,
      expandContractions: false,
      removePunctuation: false
    }).normalized;
  }

  /**
   * Normalize for voice recognition
   */
  public static normalizeForVoice(text: string, language: 'spanish' | 'english'): string {
    return this.normalize(text, {
      preserveCase: false,
      preserveAccents: language === 'spanish',
      removeHtmlTags: true,
      normalizeWhitespace: true,
      expandContractions: true,
      removePunctuation: true,
      removeNumbers: false,
      preservePuertoRicanTerms: language === 'spanish'
    }).normalized;
  }

  /**
   * Normalize for search indexing
   */
  public static normalizeForSearch(text: string): string {
    return this.normalize(text, {
      preserveCase: false,
      preserveAccents: false,
      removeHtmlTags: true,
      normalizeWhitespace: true,
      expandContractions: true,
      removePunctuation: true,
      removeNumbers: false
    }).normalized;
  }

  /**
   * Remove HTML tags
   */
  private static removeHtml(text: string): { result: string; count: number; examples: string[] } {
    const matches = text.match(this.HTML_TAG_PATTERN) || [];
    const examples = matches.slice(0, 3);
    const result = text.replace(this.HTML_TAG_PATTERN, ' ');

    return {
      result,
      count: matches.length,
      examples
    };
  }

  /**
   * Normalize quotes and apostrophes
   */
  private static normalizeQuotesAndApostrophes(text: string): { result: string; count: number } {
    let count = 0;
    let result = text;

    // Normalize various quote types
    const quoteReplacements: Array<[RegExp, string]> = [
      [/[""]/g, '"'],
      [/['']/g, "'"],
      [/[«»]/g, '"'],
      [/[‹›]/g, "'"]
    ];

    quoteReplacements.forEach(([pattern, replacement]) => {
      const matches = result.match(pattern);
      if (matches) {
        count += matches.length;
        result = result.replace(pattern, replacement);
      }
    });

    return { result, count };
  }

  /**
   * Expand contractions
   */
  private static expandContractions(
    text: string,
    preservePuertoRican: boolean
  ): { result: string; count: number; examples: string[] } {
    let result = text;
    let count = 0;
    const examples: string[] = [];

    // Expand English contractions
    Object.entries(this.ENGLISH_CONTRACTIONS).forEach(([contraction, expansion]) => {
      const pattern = new RegExp(`\\b${contraction}\\b`, 'gi');
      const matches = result.match(pattern);
      if (matches) {
        count += matches.length;
        if (examples.length < 3) {
          examples.push(`${contraction} → ${expansion}`);
        }
        result = result.replace(pattern, expansion);
      }
    });

    // Expand Spanish contractions (unless preserving PR terms)
    if (!preservePuertoRican) {
      Object.entries(this.SPANISH_CONTRACTIONS).forEach(([contraction, expansion]) => {
        const pattern = new RegExp(`\\b${contraction}\\b`, 'gi');
        const matches = result.match(pattern);
        if (matches) {
          count += matches.length;
          if (examples.length < 3) {
            examples.push(`${contraction} → ${expansion}`);
          }
          result = result.replace(pattern, expansion);
        }
      });
    }

    return { result, count, examples };
  }

  /**
   * Normalize whitespace
   */
  private static normalizeWhitespace(text: string): { result: string; count: number } {
    const original = text;
    const result = text
      .replace(/\t/g, ' ')          // Replace tabs with spaces
      .replace(/\r\n/g, '\n')        // Normalize line endings
      .replace(/\r/g, '\n')          // Normalize line endings
      .replace(/ +/g, ' ')           // Multiple spaces to single
      .replace(/\n\n+/g, '\n\n')     // Multiple newlines to double
      .trim();

    const count = original.length - result.length;
    return { result, count };
  }

  /**
   * Remove numbers
   */
  private static removeNumbers(text: string): { result: string; count: number; examples: string[] } {
    const matches = text.match(this.NUMBER_PATTERN) || [];
    const examples = matches.slice(0, 3);
    const result = text.replace(this.NUMBER_PATTERN, '');

    return {
      result,
      count: matches.length,
      examples
    };
  }

  /**
   * Remove punctuation
   */
  private static removePunctuation(text: string, preserveAccents: boolean): { result: string; count: number } {
    const original = text;
    const pattern = preserveAccents
      ? /[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g
      : /[^\w\s]/g;

    const result = text.replace(pattern, ' ');
    const count = original.length - result.length;

    return { result, count };
  }

  /**
   * Remove accents
   */
  private static removeAccents(text: string): { result: string; count: number; examples: string[] } {
    const accentMap: Record<string, string> = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U', 'Ñ': 'N'
    };

    const examples: string[] = [];
    let count = 0;

    const result = text.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, (match) => {
      count++;
      if (examples.length < 3) {
        examples.push(`${match} → ${accentMap[match]}`);
      }
      return accentMap[match] || match;
    });

    return { result, count, examples };
  }

  /**
   * Assess text quality
   */
  private static assessQuality(original: string, normalized: string): {
    cleanliness: number;
    readability: number;
  } {
    // Cleanliness: ratio of useful characters
    const usefulChars = normalized.replace(/\s/g, '').length;
    const totalChars = original.replace(/\s/g, '').length;
    const cleanliness = totalChars > 0 ? usefulChars / totalChars : 1;

    // Readability: based on whitespace normalization and structure
    const sentences = normalized.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = normalized.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;

    // Optimal is 10-20 words per sentence for K-5
    const readability = avgWordsPerSentence > 0
      ? Math.max(0, 1 - Math.abs(avgWordsPerSentence - 15) / 15)
      : 0.5;

    return {
      cleanliness: Math.round(cleanliness * 100) / 100,
      readability: Math.round(readability * 100) / 100
    };
  }

  /**
   * Clean and prepare text for educational use
   */
  public static cleanForEducation(text: string, gradeLevel: number): string {
    // More aggressive normalization for younger students
    const preserveCase = gradeLevel >= 3;

    return this.normalize(text, {
      preserveCase,
      preserveAccents: true,
      removeHtmlTags: true,
      normalizeWhitespace: true,
      expandContractions: gradeLevel <= 2,
      removePunctuation: false,
      preservePuertoRicanTerms: true
    }).normalized;
  }

  /**
   * Batch normalize multiple texts
   */
  public static normalizeBatch(
    texts: string[],
    options?: NormalizationOptions
  ): NormalizationResult[] {
    return texts.map(text => this.normalize(text, options));
  }
}

export default TextNormalizer;
