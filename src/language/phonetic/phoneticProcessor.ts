/**
 * Phonetic Processing Module
 * Generates phonetic transcriptions for voice recognition
 * Optimized for Spanish (including Puerto Rican dialect) and English
 */

export interface PhoneticResult {
  original: string;
  phonetic: string;
  language: 'spanish' | 'english';
  syllables: string[];
  stress: number[]; // Indices of stressed syllables
  ipa: string; // International Phonetic Alphabet
  hints: string[]; // Voice recognition hints
}

export interface VoiceHint {
  word: string;
  pronunciation: string;
  alternatives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export class PhoneticProcessor {
  // Spanish phonetic rules (optimized for Puerto Rican Spanish)
  private static readonly SPANISH_VOWELS = 'aeiouáéíóú';
  private static readonly SPANISH_CONSONANTS = 'bcdfghjklmnñpqrstvwxyz';

  // Puerto Rican Spanish specific pronunciations
  private static readonly PR_SPANISH_RULES: Array<[RegExp, string, string]> = [
    // R weakening at end of syllables (common in PR Spanish)
    [/r(?=[^\saeioué]|$)/gi, 'r', 'ɾ~l'],
    // L and R confusion
    [/l(?=[^\saeioué]|$)/gi, 'l', 'l~ɾ'],
    // S aspiration or deletion at end of syllables
    [/s(?=[^\saeioué]|$)/gi, 's', 'h~∅'],
    // D deletion between vowels
    [/([aeiouáéíóú])d([aeiouáéíóú])/gi, '$1d$2', '$1ð~∅$2'],
    // LL and Y (both pronounced as 'j' in PR)
    [/ll/gi, 'll', 'dʒ'],
    [/y(?=[aeiouáéíóú])/gi, 'y', 'dʒ'],
    // Velarization of n before consonants
    [/n(?=[pbfvtkgdʒ])/gi, 'n', 'ŋ'],
  ];

  // Standard Spanish phonetic rules
  private static readonly SPANISH_PHONETIC_RULES: Array<[RegExp, string]> = [
    [/ch/gi, 'tʃ'],
    [/ll/gi, 'ʎ'],
    [/ñ/gi, 'ɲ'],
    [/rr/gi, 'r'],
    [/qu([ei])/gi, 'k$1'],
    [/gu([ei])/gi, 'g$1'],
    [/güe/gi, 'gwe'],
    [/güi/gi, 'gwi'],
    [/[cz](?=[ei])/gi, 'θ~s'], // Varies by region
    [/c(?=[aou])/gi, 'k'],
    [/g(?=[aou])/gi, 'g'],
    [/g(?=[ei])/gi, 'x~h'],
    [/j/gi, 'x~h'],
    [/h/gi, ''], // Silent
    [/x/gi, 'ks'],
    [/v/gi, 'b'], // Often pronounced as b in Spanish
  ];

  // English phonetic rules
  private static readonly ENGLISH_PHONETIC_RULES: Array<[RegExp, string]> = [
    // Consonant clusters
    [/th(?=[ei])/gi, 'θ'],
    [/th/gi, 'ð'],
    [/sh/gi, 'ʃ'],
    [/ch/gi, 'tʃ'],
    [/ph/gi, 'f'],
    [/gh(?=[aeiou])/gi, 'g'],
    [/gh/gi, 'f~∅'],
    [/kn/gi, 'n'],
    [/wr/gi, 'r'],
    [/wh/gi, 'w~hw'],
    // Vowel combinations
    [/ee/gi, 'i'],
    [/ea/gi, 'i~ɛ'],
    [/oo/gi, 'u'],
    [/ou/gi, 'aʊ'],
    [/ow/gi, 'aʊ~oʊ'],
    [/ay/gi, 'eɪ'],
    [/ai/gi, 'eɪ'],
    [/oi/gi, 'ɔɪ'],
    [/oy/gi, 'ɔɪ'],
  ];

  // Common English word pronunciations
  private static readonly ENGLISH_EXCEPTIONS: Record<string, string> = {
    'the': 'ðə',
    'a': 'ə~eɪ',
    'to': 'tu~tə',
    'of': 'əv',
    'and': 'ænd~ənd',
    'in': 'ɪn',
    'is': 'ɪz',
    'it': 'ɪt',
    'you': 'ju',
    'that': 'ðæt',
    'he': 'hi',
    'was': 'wʌz~wɑz',
    'for': 'fɔr~fər',
    'on': 'ɑn~ɔn',
    'are': 'ɑr~ər',
    'with': 'wɪθ~wɪð',
    'as': 'æz~əz',
    'I': 'aɪ',
    'his': 'hɪz',
    'they': 'ðeɪ',
    'be': 'bi',
    'at': 'æt~ət',
    'one': 'wʌn',
    'have': 'hæv',
    'this': 'ðɪs',
    'from': 'frʌm~frəm',
    'or': 'ɔr',
    'had': 'hæd',
    'by': 'baɪ',
    'but': 'bʌt',
    'what': 'wʌt~wɑt',
    'all': 'ɔl',
    'were': 'wɜr',
    'we': 'wi',
    'when': 'wɛn~hwɛn',
  };

  /**
   * Generate phonetic transcription
   */
  public static process(text: string, language: 'spanish' | 'english'): PhoneticResult {
    const words = text.toLowerCase().split(/\s+/);
    const phonetics: string[] = [];
    const allSyllables: string[] = [];
    const stressIndices: number[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^\wáéíóúñü]/g, '');
      if (!cleanWord) return;

      const phonetic = language === 'spanish'
        ? this.processSpanishWord(cleanWord)
        : this.processEnglishWord(cleanWord);

      phonetics.push(phonetic);

      const syllables = this.syllabify(cleanWord, language);
      const stress = this.identifyStress(syllables, language);

      allSyllables.push(...syllables);
      if (stress >= 0) {
        stressIndices.push(allSyllables.length - syllables.length + stress);
      }
    });

    const phoneticText = phonetics.join(' ');
    const hints = this.generateVoiceHints(text, language);

    return {
      original: text,
      phonetic: phoneticText,
      language,
      syllables: allSyllables,
      stress: stressIndices,
      ipa: phoneticText,
      hints: hints.map(h => h.pronunciation)
    };
  }

  /**
   * Process Spanish word with PR dialect considerations
   */
  private static processSpanishWord(word: string): string {
    let phonetic = word;

    // Apply Puerto Rican specific rules
    this.PR_SPANISH_RULES.forEach(([pattern, _original, prPronunciation]) => {
      phonetic = phonetic.replace(pattern, prPronunciation);
    });

    // Apply standard Spanish rules
    this.SPANISH_PHONETIC_RULES.forEach(([pattern, replacement]) => {
      phonetic = phonetic.replace(pattern, replacement);
    });

    return phonetic;
  }

  /**
   * Process English word
   */
  private static processEnglishWord(word: string): string {
    // Check for exceptions first
    const lowerWord = word.toLowerCase();
    if (this.ENGLISH_EXCEPTIONS[lowerWord]) {
      return this.ENGLISH_EXCEPTIONS[lowerWord];
    }

    let phonetic = word;

    // Apply English phonetic rules
    this.ENGLISH_PHONETIC_RULES.forEach(([pattern, replacement]) => {
      phonetic = phonetic.replace(pattern, replacement);
    });

    return phonetic;
  }

  /**
   * Syllabify a word
   */
  public static syllabify(word: string, language: 'spanish' | 'english'): string[] {
    if (language === 'spanish') {
      return this.syllabifySpanish(word);
    } else {
      return this.syllabifyEnglish(word);
    }
  }

  /**
   * Syllabify Spanish word
   * Spanish syllabification is more regular than English
   */
  private static syllabifySpanish(word: string): string[] {
    const syllables: string[] = [];
    let currentSyllable = '';
    const chars = word.toLowerCase().split('');

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextChar = chars[i + 1];
      const isVowel = this.SPANISH_VOWELS.includes(char);
      const nextIsVowel = nextChar && this.SPANISH_VOWELS.includes(nextChar);

      currentSyllable += char;

      // Break syllable after vowel if next is consonant
      if (isVowel && nextChar && !nextIsVowel) {
        // Look ahead for consonant cluster
        let j = i + 1;
        let consonantCluster = '';
        while (j < chars.length && !this.SPANISH_VOWELS.includes(chars[j])) {
          consonantCluster += chars[j];
          j++;
        }

        // Split consonant cluster
        if (consonantCluster.length > 1) {
          // Keep first consonant with current syllable
          currentSyllable += consonantCluster[0];
          syllables.push(currentSyllable);
          currentSyllable = consonantCluster.substring(1);
          i = j - 1;
        } else {
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
      }
    }

    if (currentSyllable) {
      syllables.push(currentSyllable);
    }

    return syllables.filter(s => s.length > 0);
  }

  /**
   * Syllabify English word (simplified)
   */
  private static syllabifyEnglish(word: string): string[] {
    // Simple English syllabification (can be enhanced with library)
    const syllables: string[] = [];
    const vowelPattern = /[aeiou]+/gi;
    let lastIndex = 0;

    let match;
    while ((match = vowelPattern.exec(word)) !== null) {
      const vowelIndex = match.index;
      const vowelEnd = vowelIndex + match[0].length;

      // Include preceding consonants
      const syllableStart = lastIndex;
      const syllableEnd = vowelEnd;

      syllables.push(word.substring(syllableStart, syllableEnd));
      lastIndex = vowelEnd;
    }

    // Add any remaining characters to last syllable
    if (lastIndex < word.length && syllables.length > 0) {
      syllables[syllables.length - 1] += word.substring(lastIndex);
    }

    return syllables.filter(s => s.length > 0);
  }

  /**
   * Identify stressed syllable
   */
  private static identifyStress(syllables: string[], language: 'spanish' | 'english'): number {
    if (syllables.length === 0) return -1;
    if (syllables.length === 1) return 0;

    if (language === 'spanish') {
      // Spanish stress rules:
      // 1. If word ends in vowel, n, or s: stress penultimate syllable
      // 2. Otherwise: stress final syllable
      // 3. Accent marks override these rules

      const lastSyllable = syllables[syllables.length - 1];
      const hasAccent = syllables.some(s => /[áéíóú]/.test(s));

      if (hasAccent) {
        return syllables.findIndex(s => /[áéíóú]/.test(s));
      }

      if (/[aeiounsáéíóú]$/i.test(lastSyllable)) {
        return Math.max(0, syllables.length - 2); // Penultimate
      } else {
        return syllables.length - 1; // Final
      }
    } else {
      // English stress is irregular, default to first syllable
      return 0;
    }
  }

  /**
   * Generate voice recognition hints
   */
  public static generateVoiceHints(text: string, language: 'spanish' | 'english'): VoiceHint[] {
    const words = text.toLowerCase().split(/\s+/);
    const hints: VoiceHint[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^\wáéíóúñü]/g, '');
      if (!cleanWord || cleanWord.length < 3) return;

      const phonetic = language === 'spanish'
        ? this.processSpanishWord(cleanWord)
        : this.processEnglishWord(cleanWord);

      const alternatives = this.generateAlternatives(cleanWord, phonetic, language);
      const difficulty = this.assessPronunciationDifficulty(cleanWord, language);

      hints.push({
        word: cleanWord,
        pronunciation: phonetic,
        alternatives,
        difficulty
      });
    });

    return hints;
  }

  /**
   * Generate pronunciation alternatives
   */
  private static generateAlternatives(
    word: string,
    phonetic: string,
    language: 'spanish' | 'english'
  ): string[] {
    const alternatives: string[] = [];

    if (language === 'spanish') {
      // Handle common PR Spanish variations
      if (phonetic.includes('~')) {
        const variants = phonetic.split('~');
        alternatives.push(...variants);
      }
    }

    return alternatives;
  }

  /**
   * Assess pronunciation difficulty
   */
  private static assessPronunciationDifficulty(
    word: string,
    language: 'spanish' | 'english'
  ): 'easy' | 'medium' | 'hard' {
    const syllables = this.syllabify(word, language);

    if (syllables.length <= 2) return 'easy';
    if (syllables.length <= 4) return 'medium';
    return 'hard';
  }

  /**
   * Generate phonetic spelling for display
   */
  public static generatePhoneticSpelling(word: string, language: 'spanish' | 'english'): string {
    const syllables = this.syllabify(word, language);
    const stress = this.identifyStress(syllables, language);

    return syllables.map((syl, i) => {
      if (i === stress) {
        return syl.toUpperCase();
      }
      return syl;
    }).join('-');
  }

  /**
   * Batch process multiple texts
   */
  public static processBatch(
    texts: string[],
    language: 'spanish' | 'english'
  ): PhoneticResult[] {
    return texts.map(text => this.process(text, language));
  }
}

export default PhoneticProcessor;
