/**
 * Correlation Engine Edge Function
 *
 * Maps images to their text context using proximity algorithms
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  AppError,
  errorResponse,
  successResponse,
  Logger,
  retryWithBackoff,
} from '../shared/utils.ts';
import { StorageService, DatabaseService } from '../shared/storage.ts';
import type {
  CorrelationResult,
  ImageTextCorrelation,
  TextExtractionResult,
  ImageExtractionResult,
  ExtractedImage,
  PageTextContent,
} from '../shared/types.ts';

const logger = new Logger('CorrelationEngine');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const storageService = new StorageService(SUPABASE_URL, SUPABASE_KEY);
const dbService = new DatabaseService(SUPABASE_URL, SUPABASE_KEY);

const CONTEXT_WINDOW = 500; // Characters before/after image
const PROXIMITY_THRESHOLD = 0.3; // Minimum proximity score

/**
 * Calculate proximity score between image and text
 */
function calculateProximity(
  image: ExtractedImage,
  textPage: PageTextContent
): number {
  if (image.pageNumber !== textPage.pageNumber) {
    return 0;
  }

  // Calculate vertical distance (normalized)
  const imageY = image.bounds.y;
  const pageHeight = textPage.bounds.height;
  const normalizedPosition = imageY / pageHeight;

  // Images at top of page get higher scores
  const positionScore = 1 - Math.abs(normalizedPosition - 0.5);

  // Check if image has OCR text that matches page text
  let textMatchScore = 0;
  if (image.ocrText && textPage.text) {
    const ocrWords = image.ocrText.toLowerCase().split(/\s+/);
    const pageWords = textPage.text.toLowerCase().split(/\s+/);

    const matchingWords = ocrWords.filter(word =>
      word.length > 3 && pageWords.includes(word)
    );

    textMatchScore = Math.min(1, matchingWords.length / Math.max(5, ocrWords.length));
  }

  // Combined score
  return (positionScore * 0.6) + (textMatchScore * 0.4);
}

/**
 * Extract context around image position
 */
function extractContext(
  pageText: string,
  position: number,
  windowSize: number
): { before: string; after: string } {
  const beforeStart = Math.max(0, position - windowSize);
  const afterEnd = Math.min(pageText.length, position + windowSize);

  const before = pageText.substring(beforeStart, position).trim();
  const after = pageText.substring(position, afterEnd).trim();

  return { before, after };
}

/**
 * Find best text match for image
 */
function findBestTextMatch(
  image: ExtractedImage,
  textPages: PageTextContent[]
): ImageTextCorrelation | null {
  const relevantPages = textPages.filter(p =>
    Math.abs(p.pageNumber - image.pageNumber) <= 1
  );

  if (relevantPages.length === 0) {
    return null;
  }

  let bestMatch: ImageTextCorrelation | null = null;
  let bestScore = 0;

  for (const page of relevantPages) {
    const proximity = calculateProximity(image, page);

    if (proximity > bestScore && proximity >= PROXIMITY_THRESHOLD) {
      bestScore = proximity;

      // Estimate position in text based on image position
      const estimatedPosition = Math.floor(
        (image.bounds.y / page.bounds.height) * page.text.length
      );

      const context = extractContext(page.text, estimatedPosition, CONTEXT_WINDOW);

      // Extract main text content near image
      const textContent = context.before.split('\n').slice(-3).join(' ') +
                         ' ' +
                         context.after.split('\n').slice(0, 3).join(' ');

      bestMatch = {
        imageId: image.id,
        textContent: textContent.trim(),
        proximity: proximity,
        contextBefore: context.before,
        contextAfter: context.after,
        pageNumber: page.pageNumber,
        confidence: proximity,
      };
    }
  }

  return bestMatch;
}

/**
 * Handle multi-column layouts
 */
function detectMultiColumnLayout(pageText: PageTextContent): boolean {
  const lines = pageText.text.split('\n');

  // Simple heuristic: if many lines are short, might be multi-column
  const shortLines = lines.filter(line => line.trim().length < 50);
  const ratio = shortLines.length / lines.length;

  return ratio > 0.6;
}

/**
 * Correlate all images with text
 */
function correlateImagesWithText(
  images: ExtractedImage[],
  textResult: TextExtractionResult
): CorrelationResult {
  logger.info('Starting correlation', { images: images.length });

  const correlations: ImageTextCorrelation[] = [];
  let totalConfidence = 0;

  for (const image of images) {
    const match = findBestTextMatch(image, textResult.pages);

    if (match) {
      correlations.push(match);
      totalConfidence += match.confidence;

      logger.debug('Correlation found', {
        imageId: image.id,
        confidence: match.confidence,
        pageNumber: match.pageNumber,
      });
    } else {
      logger.warn('No correlation found for image', { imageId: image.id });
    }
  }

  const avgConfidence = correlations.length > 0
    ? totalConfidence / correlations.length
    : 0;

  logger.info('Correlation complete', {
    total: correlations.length,
    avgConfidence: avgConfidence.toFixed(2),
  });

  return {
    correlations,
    confidence: avgConfidence,
  };
}

serve(async (req) => {
  const startTime = Date.now();

  try {
    if (req.method !== 'POST') {
      throw new AppError('METHOD_NOT_ALLOWED', 'Only POST method is allowed', 405);
    }

    const { jobId } = await req.json();

    if (!jobId) {
      throw new AppError('INVALID_INPUT', 'jobId is required', 400);
    }

    logger.info('Processing correlation', { jobId });

    // Load text extraction results
    const textResultPath = `results/${jobId}/text-extraction.json`;
    const textBlob = await retryWithBackoff(() =>
      storageService.downloadFile('documents', textResultPath)
    );
    const textResult: TextExtractionResult = JSON.parse(await textBlob.text());

    // Load image extraction results
    const imageResultPath = `results/${jobId}/image-extraction.json`;
    const imageBlob = await retryWithBackoff(() =>
      storageService.downloadFile('documents', imageResultPath)
    );
    const imageResult: ImageExtractionResult = JSON.parse(await imageBlob.text());

    await dbService.updateProcessingJob(jobId, { progress: 50 });

    // Perform correlation
    const result = correlateImagesWithText(imageResult.images, textResult);

    await dbService.updateProcessingJob(jobId, { progress: 80 });

    // Store correlations in database
    const correlationRecords = result.correlations.map(c => ({
      image_id: c.imageId,
      text_content: c.textContent,
      page_number: c.pageNumber,
      proximity: c.proximity,
      confidence: c.confidence,
      context_before: c.contextBefore.substring(0, 1000), // Limit length
      context_after: c.contextAfter.substring(0, 1000),
    }));

    if (correlationRecords.length > 0) {
      await dbService.insertCorrelations(correlationRecords);
    }

    // Store results
    const resultPath = `results/${jobId}/correlations.json`;
    const resultBlob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });

    await storageService.uploadFile('documents', resultPath, resultBlob, {
      contentType: 'application/json',
    });

    // Update job with results
    await dbService.updateProcessingJob(jobId, {
      progress: 100,
      results: { correlations: result },
    });

    logger.info('Correlation completed', { jobId });

    const processingTime = Date.now() - startTime;

    return successResponse({
      jobId,
      result,
      resultPath,
    }, processingTime);

  } catch (error) {
    logger.error('Correlation failed', error as Error);
    return errorResponse(error as Error);
  }
});
