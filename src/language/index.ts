/**
 * Language Processing Module
 * Bilingual Spanish/English processing for K-5 educational content
 */

// Core modules
export { LanguageDetector } from './detection/language-detector';
export type { LanguageDetectionResult } from './detection/language-detector';

export { TextProcessor } from './processing/text-processor';
export type {
  Token,
  Sentence,
  Paragraph,
  ProcessedText
} from './processing/text-processor';

export { ReadabilityAnalyzer } from './readability/readability-analyzer';
export type { ReadabilityScore } from './readability/readability-analyzer';

export { PhoneticProcessor } from './phonetics/phonetic-processor';
export type {
  PhoneticPattern,
  SyllableInfo,
  PronunciationGuide
} from './phonetics/phonetic-processor';

export { QualityValidator } from './validation/quality-validator';
export type {
  SpellingError,
  GrammarError,
  CompletenessCheck,
  FormatConsistency,
  ValidationResult
} from './validation/quality-validator';

// Configuration and utilities
export {
  LANGUAGE_CONFIGS,
  SUPPORTED_LANGUAGES,
  PR_SPANISH_MARKERS,
  CODE_SWITCHING_PATTERNS,
  GRADE_LEVEL_VOCABULARY
} from './config/language-config';
export type {
  LanguageConfig,
  SupportedLanguage
} from './config/language-config';

export * as LanguageUtils from './utils/language-utils';

// Integrated language processor
export class LanguageProcessor {
  private detector: LanguageDetector;
  private textProcessor: TextProcessor;
  private readabilityAnalyzer: ReadabilityAnalyzer;
  private phoneticProcessor: PhoneticProcessor;
  private qualityValidator: QualityValidator;

  constructor() {
    this.detector = new LanguageDetector();
    this.textProcessor = new TextProcessor();
    this.readabilityAnalyzer = new ReadabilityAnalyzer();
    this.phoneticProcessor = new PhoneticProcessor();
    this.qualityValidator = new QualityValidator();
  }

  /**
   * Process text through complete pipeline
   */
  async processText(text: string) {
    // Detect language
    const detection = this.detector.detect(text);

    // Update processors with detected language
    this.textProcessor.setLanguage(detection.language);
    this.readabilityAnalyzer.setLanguage(detection.language);
    this.phoneticProcessor.setLanguage(detection.language);
    this.qualityValidator.setLanguage(detection.language);

    // Process text
    const processed = this.textProcessor.process(text);

    // Analyze readability
    const readability = this.readabilityAnalyzer.analyze(processed);

    // Validate quality
    const validation = this.qualityValidator.validate(processed);

    // Get phonetic info for key words (first 10 unique words)
    const uniqueWords = [...new Set(
      processed.tokens
        .filter(t => t.isWord && t.text.length > 3)
        .map(t => t.text)
        .slice(0, 10)
    )];
    const phonetics = this.phoneticProcessor.batchProcess(uniqueWords);

    return {
      detection,
      processed,
      readability,
      validation,
      phonetics,
      summary: {
        language: detection.language,
        confidence: detection.confidence,
        gradeLevel: readability.gradeLevel,
        isValid: validation.isValid,
        qualityScore: validation.overallScore,
        wordCount: processed.statistics.wordCount,
        sentenceCount: processed.statistics.sentenceCount,
        hasPuertoRicanDialect: detection.isPuertoRicanSpanish,
        hasCodeSwitching: detection.hasCodeSwitching
      }
    };
  }
}

export default LanguageProcessor;
