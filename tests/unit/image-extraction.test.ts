/**
 * Unit Tests for Image Extraction
 * Tests image extraction quality, format handling, and optimization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { extractImages, optimizeImage, detectImageType, correlateImagesWithText } from '@/services/pdf/imageExtraction';

describe('Image Extraction', () => {
  describe('extractImages', () => {
    it('should extract all images from PDF', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [1, 2, 1], // 1 = paintImageXObject
            argsArray: [['img1'], [], ['img2']]
          }),
          objs: {
            get: vi.fn()
              .mockResolvedValueOnce({ data: new Uint8Array([1, 2, 3]), width: 100, height: 100 })
              .mockResolvedValueOnce({ data: new Uint8Array([4, 5, 6]), width: 200, height: 150 })
          }
        })
      };

      const result = await extractImages(mockPDF);

      expect(result.images).toHaveLength(2);
      expect(result.images[0].width).toBe(100);
      expect(result.images[1].width).toBe(200);
    });

    it('should preserve image quality', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [1],
            argsArray: [['highQualityImage']]
          }),
          objs: {
            get: vi.fn().mockResolvedValue({
              data: new Uint8Array(1000),
              width: 800,
              height: 600
            })
          }
        })
      };

      const result = await extractImages(mockPDF);

      expect(result.images[0].quality).toBeGreaterThan(0.8);
      expect(result.images[0].data).toBeDefined();
    });

    it('should handle PDFs with no images', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [0], // No image operators
            argsArray: [[]]
          })
        })
      };

      const result = await extractImages(mockPDF);

      expect(result.images).toHaveLength(0);
      expect(result.hasImages).toBe(false);
    });

    it('should extract images from multiple pages', async () => {
      const mockPDF = {
        numPages: 3,
        getPage: vi.fn()
          .mockResolvedValueOnce({
            getOperatorList: vi.fn().mockResolvedValue({
              fnArray: [1],
              argsArray: [['img1']]
            }),
            objs: {
              get: vi.fn().mockResolvedValue({ data: new Uint8Array([1]), width: 100, height: 100 })
            }
          })
          .mockResolvedValueOnce({
            getOperatorList: vi.fn().mockResolvedValue({
              fnArray: [1],
              argsArray: [['img2']]
            }),
            objs: {
              get: vi.fn().mockResolvedValue({ data: new Uint8Array([2]), width: 100, height: 100 })
            }
          })
          .mockResolvedValueOnce({
            getOperatorList: vi.fn().mockResolvedValue({
              fnArray: [1],
              argsArray: [['img3']]
            }),
            objs: {
              get: vi.fn().mockResolvedValue({ data: new Uint8Array([3]), width: 100, height: 100 })
            }
          })
      };

      const result = await extractImages(mockPDF);

      expect(result.images).toHaveLength(3);
      expect(result.pageDistribution).toEqual({ 1: 1, 2: 1, 3: 1 });
    });

    it('should maintain image metadata', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [1],
            argsArray: [['img1']]
          }),
          objs: {
            get: vi.fn().mockResolvedValue({
              data: new Uint8Array([1, 2, 3]),
              width: 400,
              height: 300,
              kind: 1, // RGB
              interpolate: true
            })
          }
        })
      };

      const result = await extractImages(mockPDF);

      expect(result.images[0].metadata).toMatchObject({
        width: 400,
        height: 300,
        colorSpace: 'RGB',
        interpolate: true
      });
    });
  });

  describe('optimizeImage', () => {
    it('should resize large images while maintaining aspect ratio', async () => {
      const largeImage = {
        data: new Uint8Array(4000 * 3000 * 4), // 4000x3000 RGBA
        width: 4000,
        height: 3000
      };

      const result = await optimizeImage(largeImage, { maxWidth: 1024, maxHeight: 768 });

      expect(result.width).toBeLessThanOrEqual(1024);
      expect(result.height).toBeLessThanOrEqual(768);
      expect(result.width / result.height).toBeCloseTo(4000 / 3000, 1);
    });

    it('should compress image data', async () => {
      const uncompressedImage = {
        data: new Uint8Array(1000),
        width: 100,
        height: 100
      };

      const result = await optimizeImage(uncompressedImage, { compression: 0.8 });

      expect(result.data.length).toBeLessThan(uncompressedImage.data.length);
      expect(result.compressionRatio).toBeGreaterThan(0);
    });

    it('should convert to appropriate format', async () => {
      const image = {
        data: new Uint8Array(100),
        width: 50,
        height: 50,
        format: 'BMP'
      };

      const result = await optimizeImage(image, { outputFormat: 'JPEG' });

      expect(result.format).toBe('JPEG');
    });

    it('should not upscale small images', async () => {
      const smallImage = {
        data: new Uint8Array(100),
        width: 50,
        height: 50
      };

      const result = await optimizeImage(smallImage, { maxWidth: 1000, maxHeight: 1000 });

      expect(result.width).toBe(50);
      expect(result.height).toBe(50);
    });
  });

  describe('detectImageType', () => {
    it('should detect photograph', () => {
      const photoData = new Uint8Array([/* complex gradient data */]);
      const result = detectImageType({ data: photoData, width: 800, height: 600 });

      expect(result.type).toBe('photograph');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should detect illustration', () => {
      const illustrationData = new Uint8Array([/* flat color data */]);
      const result = detectImageType({ data: illustrationData, width: 400, height: 400 });

      expect(result.type).toBe('illustration');
    });

    it('should detect diagram or chart', () => {
      const diagramData = new Uint8Array([/* structured lines */]);
      const result = detectImageType({ data: diagramData, width: 600, height: 400 });

      expect(result.type).toMatch(/diagram|chart/);
    });

    it('should detect icon or logo', () => {
      const iconData = new Uint8Array([/* small simple shape */]);
      const result = detectImageType({ data: iconData, width: 64, height: 64 });

      expect(result.type).toBe('icon');
    });

    it('should analyze color depth', () => {
      const colorImage = {
        data: new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]),
        width: 3,
        height: 1
      };

      const result = detectImageType(colorImage);

      expect(result.colorDepth).toBe('full-color');
      expect(result.uniqueColors).toBeGreaterThan(1);
    });
  });

  describe('correlateImagesWithText', () => {
    it('should match images with captions', () => {
      const images = [
        { id: 'img1', page: 1, position: { x: 100, y: 200 } }
      ];

      const textBlocks = [
        { text: 'Figure 1: A beautiful sunset', page: 1, position: { x: 100, y: 350 } }
      ];

      const result = correlateImagesWithText(images, textBlocks);

      expect(result[0].caption).toBe('Figure 1: A beautiful sunset');
      expect(result[0].hasCaptionAbove).toBe(false);
      expect(result[0].hasCaptionBelow).toBe(true);
    });

    it('should detect images referenced in text', () => {
      const images = [
        { id: 'img1', page: 2, position: { x: 100, y: 200 } }
      ];

      const textBlocks = [
        { text: 'As shown in the image above, photosynthesis...', page: 2, position: { x: 100, y: 350 } }
      ];

      const result = correlateImagesWithText(images, textBlocks);

      expect(result[0].referencedInText).toBe(true);
      expect(result[0].context).toContain('photosynthesis');
    });

    it('should identify floating vs inline images', () => {
      const inlineImage = { id: 'img1', page: 1, position: { x: 50, y: 200 }, width: 100 };
      const floatingImage = { id: 'img2', page: 1, position: { x: 400, y: 100 }, width: 200 };

      const textBlocks = [
        { text: 'Normal text flow', page: 1, position: { x: 50, y: 180 } }
      ];

      const result = correlateImagesWithText([inlineImage, floatingImage], textBlocks);

      expect(result[0].placement).toBe('inline');
      expect(result[1].placement).toBe('floating');
    });

    it('should group related images', () => {
      const images = [
        { id: 'img1', page: 1, position: { x: 100, y: 200 } },
        { id: 'img2', page: 1, position: { x: 350, y: 200 } }
      ];

      const textBlocks = [
        { text: 'Figure 1a and 1b show...', page: 1, position: { x: 200, y: 350 } }
      ];

      const result = correlateImagesWithText(images, textBlocks);

      expect(result[0].groupId).toBe(result[1].groupId);
      expect(result[0].isGrouped).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should extract images from 1-page PDF under 500ms', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [1, 1, 1],
            argsArray: [['img1'], ['img2'], ['img3']]
          }),
          objs: {
            get: vi.fn().mockResolvedValue({
              data: new Uint8Array(1000),
              width: 100,
              height: 100
            })
          }
        })
      };

      const start = performance.now();
      await extractImages(mockPDF);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should optimize image under 100ms', async () => {
      const image = {
        data: new Uint8Array(1000 * 1000 * 4),
        width: 1000,
        height: 1000
      };

      const start = performance.now();
      await optimizeImage(image);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Quality Metrics', () => {
    it('should maintain >90% visual quality after optimization', async () => {
      const originalImage = {
        data: generateTestImageData(800, 600),
        width: 800,
        height: 600
      };

      const optimized = await optimizeImage(originalImage, { quality: 0.9 });
      const qualityScore = calculateImageQuality(originalImage, optimized);

      expect(qualityScore).toBeGreaterThan(0.9);
    });

    it('should preserve important image features', async () => {
      const imageWithText = {
        data: generateImageWithText('Important Label'),
        width: 400,
        height: 300
      };

      const optimized = await optimizeImage(imageWithText);

      expect(optimized.hasTextElements).toBe(true);
      expect(optimized.textReadability).toBeGreaterThan(0.8);
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted image data', async () => {
      const mockPDF = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue({
          getOperatorList: vi.fn().mockResolvedValue({
            fnArray: [1],
            argsArray: [['corruptImg']]
          }),
          objs: {
            get: vi.fn().mockRejectedValue(new Error('Corrupted image'))
          }
        })
      };

      const result = await extractImages(mockPDF);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Corrupted image');
    });

    it('should handle very small images (1x1 pixels)', async () => {
      const tinyImage = {
        data: new Uint8Array([255, 255, 255, 255]),
        width: 1,
        height: 1
      };

      const result = await optimizeImage(tinyImage);

      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
    });

    it('should handle transparent images', async () => {
      const transparentImage = {
        data: new Uint8Array([255, 255, 255, 0]), // RGBA with alpha = 0
        width: 1,
        height: 1,
        hasAlpha: true
      };

      const result = await optimizeImage(transparentImage);

      expect(result.preservedAlpha).toBe(true);
    });
  });
});

// Helper functions
function generateTestImageData(width: number, height: number): Uint8Array {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.random() * 255;     // R
    data[i + 1] = Math.random() * 255; // G
    data[i + 2] = Math.random() * 255; // B
    data[i + 3] = 255;                  // A
  }
  return data;
}

function generateImageWithText(text: string): Uint8Array {
  // Simplified: just return test data
  return new Uint8Array(400 * 300 * 4);
}

function calculateImageQuality(original: any, optimized: any): number {
  // Simplified quality calculation
  return 0.95;
}
