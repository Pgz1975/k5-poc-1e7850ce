/**
 * Phonetic Processing
 * Extract phonetic patterns, pronunciation guides, and syllable detection
 */

import { type SupportedLanguage } from '../config/language-config';

export interface PhoneticPattern {
  grapheme: string;  // Written form
  phoneme: string;   // Sound representation
  examples: string[];
}

export interface SyllableInfo {
  syllable: string;
  stress: boolean;
  onset: string;     // Initial consonant(s)
  nucleus: string;   // Vowel(s)
  coda: string;      // Final consonant(s)
}

export interface PronunciationGuide {
  word: string;
  pronunciation: string;
  syllables: SyllableInfo[];
  stressPattern: number; // Index of stressed syllable
  phoneticPatterns: PhoneticPattern[];
  difficulty: 'easy' | 'moderate' | 'difficult';
}

export class PhoneticProcessor {
  private language: SupportedLanguage;

  // English phonetic patterns
  private static ENGLISH_PATTERNS: PhoneticPattern[] = [
    { grapheme: 'th', phoneme: 'θ/ð', examples: ['think', 'that'] },
    { grapheme: 'ch', phoneme: 'tʃ', examples: ['church', 'chair'] },
    { grapheme: 'sh', phoneme: 'ʃ', examples: ['ship', 'fish'] },
    { grapheme: 'ph', phoneme: 'f', examples: ['phone', 'photo'] },
    { grapheme: 'gh', phoneme: 'f/silent', examples: ['laugh', 'night'] },
    { grapheme: 'oo', phoneme: 'u/ʊ', examples: ['food', 'book'] },
    { grapheme: 'ee', phoneme: 'i', examples: ['see', 'tree'] },
    { grapheme: 'ea', phoneme: 'i/e', examples: ['eat', 'bread'] },
    { grapheme: 'ai', phoneme: 'eɪ', examples: ['rain', 'wait'] },
    { grapheme: 'ow', phoneme: 'aʊ/oʊ', examples: ['cow', 'show'] }
  ];

  // Spanish phonetic patterns
  private static SPANISH_PATTERNS: PhoneticPattern[] = [
    { grapheme: 'll', phoneme: 'ʎ/j', examples: ['lluvia', 'calle'] },
    { grapheme: 'ñ', phoneme: 'ɲ', examples: ['año', 'niño'] },
    { grapheme: 'rr', phoneme: 'r̄', examples: ['perro', 'carro'] },
    { grapheme: 'ch', phoneme: 'tʃ', examples: ['chico', 'mucho'] },
    { grapheme: 'qu', phoneme: 'k', examples: ['que', 'quiero'] },
    { grapheme: 'gu', phoneme: 'g', examples: ['guerra', 'guitarra'] },
    { grapheme: 'j', phoneme: 'x', examples: ['joven', 'rojo'] },
    { grapheme: 'g+e/i', phoneme: 'x', examples: ['gente', 'girar'] },
    { grapheme: 'c+e/i', phoneme: 's/θ', examples: ['centro', 'cine'] },
    { grapheme: 'z', phoneme: 's/θ', examples: ['zapato', 'luz'] }
  ];

  constructor(language: SupportedLanguage = 'en') {
    this.language = language;
  }

  /**
   * Generate pronunciation guide for a word
   */
  generatePronunciationGuide(word: string): PronunciationGuide {
    const normalized = word.toLowerCase().trim();
    const syllables = this.extractSyllables(normalized);
    const stressPattern = this.detectStress(syllables, normalized);
    const phoneticPatterns = this.identifyPhoneticPatterns(normalized);
    const pronunciation = this.generatePronunciation(normalized, syllables);
    const difficulty = this.assessPronunciationDifficulty(syllables, phoneticPatterns);

    return {
      word,
      pronunciation,
      syllables,
      stressPattern,
      phoneticPatterns,
      difficulty
    };
  }

  /**
   * Extract syllables with detailed structure
   */
  extractSyllables(word: string): SyllableInfo[] {
    if (this.language === 'en') {
      return this.extractEnglishSyllables(word);
    } else {
      return this.extractSpanishSyllables(word);
    }
  }

  /**
   * Extract English syllables
   */
  private extractEnglishSyllables(word: string): SyllableInfo[] {
    const syllables: SyllableInfo[] = [];
    const vowelPattern = /[aeiouy]+/g;
    let matches = [...word.matchAll(vowelPattern)];

    if (matches.length === 0) {
      return [{
        syllable: word,
        stress: true,
        onset: word,
        nucleus: '',
        coda: ''
      }];
    }

    let lastIndex = 0;

    matches.forEach((match, i) => {
      const vowelStart = match.index!;
      const vowelEnd = vowelStart + match[0].length;

      // Find syllable boundaries
      let syllableStart = lastIndex;
      let syllableEnd: number;

      if (i < matches.length - 1) {
        // Find midpoint between this and next vowel
        const nextVowelStart = matches[i + 1].index!;
        const consonantCluster = word.substring(vowelEnd, nextVowelStart);
        const midpoint = Math.ceil(consonantCluster.length / 2);
        syllableEnd = vowelEnd + midpoint;
      } else {
        syllableEnd = word.length;
      }

      const syllableText = word.substring(syllableStart, syllableEnd);
      const onset = word.substring(syllableStart, vowelStart);
      const nucleus = match[0];
      const coda = word.substring(vowelEnd, syllableEnd);

      syllables.push({
        syllable: syllableText,
        stress: false, // Will be determined by stress detection
        onset,
        nucleus,
        coda
      });

      lastIndex = syllableEnd;
    });

    return syllables;
  }

  /**
   * Extract Spanish syllables
   */
  private extractSpanishSyllables(word: string): SyllableInfo[] {
    const syllables: SyllableInfo[] = [];
    const vowels = /[aeiouáéíóúü]/;
    let currentSyllable = '';
    let onset = '';
    let nucleus = '';
    let coda = '';
    let inNucleus = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isVowel = vowels.test(char);

      if (isVowel) {
        if (!inNucleus) {
          // Start of nucleus
          inNucleus = true;
          nucleus = char;
        } else {
          // Check for diphthong
          const prevChar = word[i - 1];
          const isDiphthong = this.isSpanishDiphthong(prevChar + char);

          if (isDiphthong) {
            nucleus += char;
          } else {
            // New syllable
            syllables.push({
              syllable: currentSyllable,
              stress: /[áéíóú]/.test(nucleus),
              onset,
              nucleus,
              coda
            });

            currentSyllable = char;
            onset = '';
            nucleus = char;
            coda = '';
          }
        }
        currentSyllable += char;
      } else {
        if (!inNucleus) {
          onset += char;
        } else {
          coda += char;
        }
        currentSyllable += char;
      }
    }

    // Add last syllable
    if (currentSyllable) {
      syllables.push({
        syllable: currentSyllable,
        stress: /[áéíóú]/.test(nucleus),
        onset,
        nucleus,
        coda
      });
    }

    return syllables;
  }

  /**
   * Check if two Spanish vowels form a diphthong
   */
  private isSpanishDiphthong(vowelPair: string): boolean {
    const diphthongs = [
      'ai', 'au', 'ei', 'eu', 'oi', 'ou',
      'ia', 'ie', 'io', 'iu',
      'ua', 'ue', 'ui', 'uo'
    ];
    return diphthongs.includes(vowelPair.toLowerCase());
  }

  /**
   * Detect stress pattern in syllables
   */
  private detectStress(syllables: SyllableInfo[], word: string): number {
    // Check for explicit stress marks (Spanish)
    for (let i = 0; i < syllables.length; i++) {
      if (syllables[i].stress) {
        return i;
      }
    }

    // Apply stress rules
    if (this.language === 'en') {
      // English: typically first or second syllable for simple words
      return syllables.length > 1 ? 1 : 0;
    } else {
      // Spanish stress rules
      const lastChar = word[word.length - 1];
      const secondLastChar = word[word.length - 2];

      // Words ending in vowel, n, or s: stress on second-to-last syllable
      if (/[aeiouáéíóúüns]/.test(lastChar)) {
        return Math.max(0, syllables.length - 2);
      }
      // Other words: stress on last syllable
      return syllables.length - 1;
    }
  }

  /**
   * Identify phonetic patterns in word
   */
  private identifyPhoneticPatterns(word: string): PhoneticPattern[] {
    const patterns = this.language === 'en'
      ? PhoneticProcessor.ENGLISH_PATTERNS
      : PhoneticProcessor.SPANISH_PATTERNS;

    const identified: PhoneticPattern[] = [];

    patterns.forEach(pattern => {
      if (word.includes(pattern.grapheme)) {
        identified.push(pattern);
      }
    });

    return identified;
  }

  /**
   * Generate IPA-like pronunciation
   */
  private generatePronunciation(word: string, syllables: SyllableInfo[]): string {
    // Simplified pronunciation representation
    return syllables
      .map((syl, i) => {
        const stress = syl.stress ? 'ˈ' : '';
        return stress + syl.syllable;
      })
      .join('·');
  }

  /**
   * Assess pronunciation difficulty
   */
  private assessPronunciationDifficulty(
    syllables: SyllableInfo[],
    patterns: PhoneticPattern[]
  ): 'easy' | 'moderate' | 'difficult' {
    let difficultyScore = 0;

    // More syllables = harder
    difficultyScore += syllables.length * 0.5;

    // Complex phonetic patterns = harder
    difficultyScore += patterns.length * 0.3;

    // Complex consonant clusters = harder
    syllables.forEach(syl => {
      if (syl.onset.length > 2) difficultyScore += 0.5;
      if (syl.coda.length > 2) difficultyScore += 0.5;
    });

    if (difficultyScore < 2) return 'easy';
    if (difficultyScore < 4) return 'moderate';
    return 'difficult';
  }

  /**
   * Get all phonetic patterns for current language
   */
  getPhoneticPatterns(): PhoneticPattern[] {
    return this.language === 'en'
      ? PhoneticProcessor.ENGLISH_PATTERNS
      : PhoneticProcessor.SPANISH_PATTERNS;
  }

  /**
   * Set processing language
   */
  setLanguage(language: SupportedLanguage): void {
    this.language = language;
  }

  /**
   * Batch process multiple words
   */
  batchProcess(words: string[]): PronunciationGuide[] {
    return words.map(word => this.generatePronunciationGuide(word));
  }
}

export default PhoneticProcessor;
