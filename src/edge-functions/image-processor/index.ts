/**
 * Image Extraction and Optimization Edge Function
 *
 * Extracts images from PDFs, optimizes them, and performs OCR
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getDocument } from 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.mjs';
import {
  AppError,
  errorResponse,
  successResponse,
  Logger,
  retryWithBackoff,
  calculateHash,
} from '../shared/utils.ts';
import { StorageService, DatabaseService } from '../shared/storage.ts';
import type {
  ImageExtractionResult,
  ExtractedImage,
  Thumbnail,
  BoundingBox,
} from '../shared/types.ts';

const logger = new Logger('ImageProcessor');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const THUMBNAIL_SIZE = 200;
const MAX_IMAGE_DIMENSION = 2048;

const storageService = new StorageService(SUPABASE_URL, SUPABASE_KEY);
const dbService = new DatabaseService(SUPABASE_URL, SUPABASE_KEY);

/**
 * Convert image to WebP format (placeholder - requires sharp or similar)
 */
async function convertToWebP(imageData: Uint8Array, quality: number = 80): Promise<Uint8Array> {
  // In production, use a library like sharp or wasm-imagemagick
  // For now, return original data
  logger.info('Converting to WebP', { quality });

  // TODO: Implement actual WebP conversion
  // This would require adding a WebP encoder library

  return imageData;
}

/**
 * Create thumbnail
 */
async function createThumbnail(
  imageData: Uint8Array,
  targetSize: number
): Promise<Uint8Array> {
  logger.info('Creating thumbnail', { targetSize });

  // TODO: Implement actual thumbnail generation
  // This would require image processing library

  return imageData;
}

/**
 * Perform OCR on image (placeholder)
 */
async function performOCR(imageData: Uint8Array): Promise<string | undefined> {
  logger.info('Performing OCR');

  // TODO: Integrate Tesseract.js or similar OCR library
  // For now, return undefined

  // Example with Tesseract (would need to add dependency):
  // import Tesseract from 'https://esm.sh/tesseract.js@4.1.1';
  // const result = await Tesseract.recognize(imageData, 'spa+eng');
  // return result.data.text;

  return undefined;
}

/**
 * Extract images from a single page
 */
async function extractPageImages(
  page: any,
  pageNumber: number,
  jobId: string
): Promise<ExtractedImage[]> {
  logger.info('Extracting images from page', { pageNumber });

  const images: ExtractedImage[] = [];
  const operatorList = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1.0 });

  for (let i = 0; i < operatorList.fnArray.length; i++) {
    const fn = operatorList.fnArray[i];
    const args = operatorList.argsArray[i];

    // Check for image operations (paintImageXObject, etc.)
    if (fn === 85 || fn === 86 || fn === 87) { // Image operation codes
      try {
        const imageName = args[0];
        const image = await page.objs.get(imageName);

        if (!image || !image.data) {
          continue;
        }

        const imageData = new Uint8Array(image.data);
        const hash = await calculateHash(imageData);

        const imageId = `img_${pageNumber}_${i}_${hash.substring(0, 8)}`;

        // Determine bounds (simplified - would need transform matrix calculation)
        const bounds: BoundingBox = {
          x: 0,
          y: 0,
          width: image.width || 0,
          height: image.height || 0,
        };

        // Optimize image
        const optimizedData = await convertToWebP(imageData, 85);

        // Upload optimized image
        const imagePath = `images/${jobId}/${imageId}.webp`;
        const imageBlob = new Blob([optimizedData], { type: 'image/webp' });
        await storageService.uploadFile('documents', imagePath, imageBlob, {
          contentType: 'image/webp',
        });

        const optimizedUrl = await storageService.getPublicUrl('documents', imagePath);

        // Perform OCR if image might contain text
        const ocrText = await performOCR(imageData);

        images.push({
          id: imageId,
          pageNumber,
          format: 'webp',
          width: image.width || 0,
          height: image.height || 0,
          bounds,
          hash,
          optimizedUrl,
          ocrText,
          fileSize: optimizedData.length,
        });

      } catch (error) {
        logger.error('Failed to extract image', error as Error, { pageNumber, index: i });
      }
    }
  }

  return images;
}

/**
 * Generate thumbnails for images
 */
async function generateThumbnails(
  images: ExtractedImage[],
  jobId: string
): Promise<Thumbnail[]> {
  logger.info('Generating thumbnails', { count: images.length });

  const thumbnails: Thumbnail[] = [];

  for (const image of images) {
    try {
      // Download original image
      const imagePath = `images/${jobId}/${image.id}.webp`;
      const imageBlob = await storageService.downloadFile('documents', imagePath);
      const imageData = new Uint8Array(await imageBlob.arrayBuffer());

      // Create thumbnail
      const thumbnailData = await createThumbnail(imageData, THUMBNAIL_SIZE);

      // Upload thumbnail
      const thumbnailPath = `thumbnails/${jobId}/${image.id}_thumb.webp`;
      const thumbnailBlob = new Blob([thumbnailData], { type: 'image/webp' });
      await storageService.uploadFile('documents', thumbnailPath, thumbnailBlob, {
        contentType: 'image/webp',
      });

      const thumbnailUrl = await storageService.getPublicUrl('documents', thumbnailPath);

      thumbnails.push({
        imageId: image.id,
        url: thumbnailUrl,
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
      });

    } catch (error) {
      logger.error('Failed to generate thumbnail', error as Error, { imageId: image.id });
    }
  }

  return thumbnails;
}

/**
 * Extract all images from PDF
 */
async function extractImages(
  pdfData: Uint8Array,
  jobId: string
): Promise<ImageExtractionResult> {
  logger.info('Starting image extraction');

  const loadingTask = getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;

  const allImages: ExtractedImage[] = [];

  // Extract images from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const pageImages = await extractPageImages(page, i, jobId);
    allImages.push(...pageImages);

    // Update progress
    const progress = 30 + Math.floor((i / pdf.numPages) * 40);
    await dbService.updateProcessingJob(jobId, { progress });
  }

  // Generate thumbnails
  const thumbnails = await generateThumbnails(allImages, jobId);

  // Remove duplicate images by hash
  const uniqueImages = allImages.reduce((acc, img) => {
    if (!acc.find(i => i.hash === img.hash)) {
      acc.push(img);
    }
    return acc;
  }, [] as ExtractedImage[]);

  const result: ImageExtractionResult = {
    images: uniqueImages,
    thumbnails,
    totalImages: uniqueImages.length,
  };

  logger.info('Image extraction complete', {
    total: allImages.length,
    unique: uniqueImages.length,
    thumbnails: thumbnails.length,
  });

  return result;
}

serve(async (req) => {
  const startTime = Date.now();

  try {
    if (req.method !== 'POST') {
      throw new AppError('METHOD_NOT_ALLOWED', 'Only POST method is allowed', 405);
    }

    const { jobId, pdfPath } = await req.json();

    if (!jobId || !pdfPath) {
      throw new AppError('INVALID_INPUT', 'jobId and pdfPath are required', 400);
    }

    logger.info('Processing image extraction', { jobId, pdfPath });

    // Download PDF from storage
    const pdfBlob = await retryWithBackoff(() =>
      storageService.downloadFile('documents', pdfPath)
    );

    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);

    // Extract images
    const result = await retryWithBackoff(() => extractImages(pdfData, jobId));

    await dbService.updateProcessingJob(jobId, { progress: 80 });

    // Store results
    const resultPath = `results/${jobId}/image-extraction.json`;
    const resultBlob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });

    await storageService.uploadFile('documents', resultPath, resultBlob, {
      contentType: 'application/json',
    });

    // Update job with results
    await dbService.updateProcessingJob(jobId, {
      results: { imageExtraction: result },
    });

    logger.info('Image extraction completed', { jobId });

    const processingTime = Date.now() - startTime;

    return successResponse({
      jobId,
      result,
      resultPath,
    }, processingTime);

  } catch (error) {
    logger.error('Image extraction failed', error as Error);
    return errorResponse(error as Error);
  }
});
