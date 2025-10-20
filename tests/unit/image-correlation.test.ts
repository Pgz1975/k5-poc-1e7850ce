/**
 * Image-Text Correlation Accuracy Tests
 * Target: 90%+ correlation accuracy
 */

import { describe, it, expect } from 'vitest';

describe('Image Correlation - Accuracy Tests', () => {
  const testCases = generateCorrelationTestCases();

  it('should achieve 90%+ correlation accuracy', () => {
    let correctCorrelations = 0;

    for (const testCase of testCases) {
      const predicted = correlateTextAndImages(testCase.text, testCase.images);
      const accuracy = evaluateCorrelation(predicted, testCase.expected);

      if (accuracy > 0.8) {
        correctCorrelations++;
      }
    }

    const overallAccuracy = correctCorrelations / testCases.length;
    console.log(`Correlation accuracy: ${(overallAccuracy * 100).toFixed(2)}%`);

    expect(overallAccuracy).toBeGreaterThanOrEqual(0.90);
  });

  it('should identify caption relationships', () => {
    const textBlocks = [
      {
        text: 'Figure 1: The Water Cycle',
        bbox: { x1: 100, y1: 250, x2: 300, y2: 270 },
        category: 'caption'
      },
      {
        text: 'Water evaporates from the ocean...',
        bbox: { x1: 100, y1: 100, x2: 400, y2: 150 },
        category: 'paragraph'
      }
    ];

    const images = [
      {
        bbox: { x1: 100, y1: 50, x2: 300, y2: 240 },
        imageOrder: 1,
        pageNumber: 1
      }
    ];

    const correlations = correlateTextAndImages(textBlocks, images);
    const captionCorrelation = correlations.find(c => c.type === 'caption');

    expect(captionCorrelation).toBeDefined();
    expect(captionCorrelation?.confidence).toBeGreaterThan(0.90);
  });

  it('should detect adjacent image-text pairs', () => {
    const textBlocks = [
      {
        text: 'The cat sits on the mat.',
        bbox: { x1: 50, y1: 100, x2: 250, y2: 200 }
      }
    ];

    const images = [
      {
        bbox: { x1: 300, y1: 100, x2: 500, y2: 200 }
      }
    ];

    const correlations = correlateTextAndImages(textBlocks, images);

    expect(correlations.length).toBeGreaterThan(0);
    expect(correlations[0].type).toBe('adjacent');
    expect(correlations[0].distance).toBeLessThan(100);
  });

  it('should handle reference-based correlations', () => {
    const textBlocks = [
      {
        text: 'As shown in Figure 3, the process begins...',
        bbox: { x1: 50, y1: 100, x2: 400, y2: 150 }
      }
    ];

    const images = [
      {
        bbox: { x1: 50, y1: 200, x2: 300, y2: 400 },
        imageOrder: 3
      }
    ];

    const correlations = correlateTextAndImages(textBlocks, images);
    const referenceCorrelation = correlations.find(c => c.type === 'reference');

    expect(referenceCorrelation).toBeDefined();
    expect(referenceCorrelation?.confidence).toBeGreaterThan(0.85);
  });

  it('should calculate accurate distance scores', () => {
    const testPairs = [
      {
        text: { bbox: { x1: 100, y1: 100, x2: 200, y2: 150 } },
        image: { bbox: { x1: 210, y1: 100, x2: 310, y2: 200 } },
        expectedDistance: 10 // Very close
      },
      {
        text: { bbox: { x1: 100, y1: 100, x2: 200, y2: 150 } },
        image: { bbox: { x1: 400, y1: 400, x2: 500, y2: 500 } },
        expectedDistance: 360 // Far apart
      }
    ];

    for (const pair of testPairs) {
      const distance = calculateDistance(pair.text.bbox, pair.image.bbox);
      expect(Math.abs(distance - pair.expectedDistance)).toBeLessThan(20);
    }
  });

  it('should prioritize nearby correlations', () => {
    const textBlock = {
      text: 'See the image',
      bbox: { x1: 100, y1: 100, x2: 200, y2: 120 }
    };

    const images = [
      { id: 'near', bbox: { x1: 210, y1: 95, x2: 310, y2: 195 } },
      { id: 'far', bbox: { x1: 500, y1: 500, x2: 600, y2: 600 } }
    ];

    const correlations = correlateTextAndImages([textBlock], images);

    expect(correlations[0].image.id).toBe('near');
    expect(correlations[0].confidence).toBeGreaterThan(
      correlations.find(c => c.image.id === 'far')?.confidence || 0
    );
  });

  it('should handle multiple images per text block', () => {
    const textBlock = {
      text: 'Figures 1, 2, and 3 show the process.',
      bbox: { x1: 50, y1: 100, x2: 400, y2: 150 }
    };

    const images = [
      { imageOrder: 1, bbox: { x1: 50, y1: 200, x2: 150, y2: 300 } },
      { imageOrder: 2, bbox: { x1: 200, y1: 200, x2: 300, y2: 300 } },
      { imageOrder: 3, bbox: { x1: 350, y1: 200, x2: 450, y2: 300 } }
    ];

    const correlations = correlateTextAndImages([textBlock], images);

    expect(correlations.length).toBe(3);
    expect(correlations.every(c => c.type === 'reference')).toBe(true);
  });

  it('should detect contextual relationships', () => {
    const textBlocks = [
      {
        text: 'The diagram illustrates photosynthesis.',
        bbox: { x1: 50, y1: 50, x2: 300, y2: 80 }
      },
      {
        text: 'Plants use sunlight, water, and carbon dioxide...',
        bbox: { x1: 50, y1: 350, x2: 400, y2: 450 }
      }
    ];

    const images = [
      {
        type: 'diagram',
        bbox: { x1: 50, y1: 100, x2: 300, y2: 330 }
      }
    ];

    const correlations = correlateTextAndImages(textBlocks, images);
    const contextual = correlations.filter(c => c.type === 'contextual');

    expect(contextual.length).toBeGreaterThan(0);
  });
});

describe('Image Correlation - Layout Suggestions', () => {
  it('should suggest side-by-side layout for adjacent items', () => {
    const text = { bbox: { x1: 50, y1: 100, x2: 250, y2: 200 } };
    const image = { bbox: { x1: 300, y1: 100, x2: 500, y2: 200 } };

    const correlation = createCorrelation(text, image);

    expect(correlation.layoutSuggestion).toBe('side-by-side');
  });

  it('should suggest text-below for caption relationships', () => {
    const text = { bbox: { x1: 100, y1: 250, x2: 300, y2: 270 } };
    const image = { bbox: { x1: 100, y1: 50, x2: 300, y2: 240 } };

    const correlation = createCorrelation(text, image, 'caption');

    expect(correlation.layoutSuggestion).toBe('text-below');
  });

  it('should suggest text-above for title relationships', () => {
    const text = {
      bbox: { x1: 100, y1: 50, x2: 300, y2: 80 },
      category: 'heading'
    };
    const image = { bbox: { x1: 100, y1: 100, x2: 300, y2: 300 } };

    const correlation = createCorrelation(text, image, 'contextual');

    expect(correlation.layoutSuggestion).toBe('text-above');
  });

  it('should determine display order', () => {
    const textBlocks = [
      { bbox: { x1: 50, y1: 100, x2: 200, y2: 150 }, order: 1 },
      { bbox: { x1: 50, y1: 200, x2: 200, y2: 250 }, order: 2 },
      { bbox: { x1: 50, y1: 300, x2: 200, y2: 350 }, order: 3 }
    ];

    const images = [
      { bbox: { x1: 250, y1: 150, x2: 400, y2: 280 } }
    ];

    const correlations = correlateTextAndImages(textBlocks, images);

    for (const correlation of correlations) {
      expect(correlation).toHaveProperty('displayOrder');
      expect(correlation.displayOrder).toBeGreaterThan(0);
    }
  });
});

describe('Image Correlation - Performance', () => {
  it('should correlate quickly for typical documents', () => {
    const textBlocks = Array(50).fill(null).map((_, i) => ({
      text: `Text block ${i}`,
      bbox: { x1: 50, y1: i * 30, x2: 400, y2: i * 30 + 20 }
    }));

    const images = Array(10).fill(null).map((_, i) => ({
      bbox: { x1: 450, y1: i * 100, x2: 550, y2: i * 100 + 80 }
    }));

    const startTime = performance.now();
    correlateTextAndImages(textBlocks, images);
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`Correlation time for 50 texts + 10 images: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(100);
  });

  it('should handle large documents efficiently', () => {
    const textBlocks = Array(500).fill(null).map((_, i) => ({
      text: `Text ${i}`,
      bbox: { x1: 50, y1: i * 20, x2: 400, y2: i * 20 + 15 }
    }));

    const images = Array(100).fill(null).map((_, i) => ({
      bbox: { x1: 450, y1: i * 100, x2: 550, y2: i * 100 + 80 }
    }));

    const startTime = performance.now();
    correlateTextAndImages(textBlocks, images);
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`Correlation time for 500 texts + 100 images: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(500);
  });
});

// Helper functions
function generateCorrelationTestCases(): any[] {
  return [
    {
      text: [
        { text: 'Figure 1: Cat', bbox: { x1: 100, y1: 250, x2: 200, y2: 270 } }
      ],
      images: [
        { bbox: { x1: 100, y1: 50, x2: 200, y2: 240 } }
      ],
      expected: [{ type: 'caption', confidence: 0.95 }]
    },
    {
      text: [
        { text: 'The cat sits.', bbox: { x1: 50, y1: 100, x2: 250, y2: 150 } }
      ],
      images: [
        { bbox: { x1: 300, y1: 100, x2: 500, y2: 200 } }
      ],
      expected: [{ type: 'adjacent', confidence: 0.85 }]
    },
    {
      text: [
        { text: 'See Figure 3', bbox: { x1: 50, y1: 100, x2: 200, y2: 120 } }
      ],
      images: [
        { imageOrder: 3, bbox: { x1: 50, y1: 150, x2: 200, y2: 300 } }
      ],
      expected: [{ type: 'reference', confidence: 0.90 }]
    }
  ];
}

function correlateTextAndImages(textBlocks: any[], images: any[]): any[] {
  const correlations: any[] = [];

  for (const text of textBlocks) {
    for (const image of images) {
      const type = determineCorrelationType(text, image);
      const distance = calculateDistance(text.bbox, image.bbox);
      const confidence = calculateConfidence(type, distance, text, image);

      if (confidence > 0.5) {
        correlations.push({
          text,
          image,
          type,
          distance,
          confidence,
          layoutSuggestion: suggestLayout(text, image, type),
          displayOrder: determineDisplayOrder(text, image)
        });
      }
    }
  }

  return correlations.sort((a, b) => b.confidence - a.confidence);
}

function determineCorrelationType(text: any, image: any): string {
  const textStr = text.text?.toLowerCase() || '';

  // Check for caption
  if (textStr.includes('figure') || textStr.includes('figura') ||
      textStr.includes('image') || textStr.includes('imagen')) {
    if (text.bbox.y1 > image.bbox.y2 - 50) {
      return 'caption';
    }
  }

  // Check for reference
  if (/figure\s+\d+|figura\s+\d+/i.test(textStr)) {
    const match = textStr.match(/\d+/);
    if (match && image.imageOrder === parseInt(match[0])) {
      return 'reference';
    }
  }

  // Check for adjacent
  const distance = calculateDistance(text.bbox, image.bbox);
  if (distance < 100) {
    return 'adjacent';
  }

  // Default to contextual
  return 'contextual';
}

function calculateDistance(bbox1: any, bbox2: any): number {
  const centerX1 = (bbox1.x1 + bbox1.x2) / 2;
  const centerY1 = (bbox1.y1 + bbox1.y2) / 2;
  const centerX2 = (bbox2.x1 + bbox2.x2) / 2;
  const centerY2 = (bbox2.y1 + bbox2.y2) / 2;

  return Math.sqrt(
    Math.pow(centerX2 - centerX1, 2) +
    Math.pow(centerY2 - centerY1, 2)
  );
}

function calculateConfidence(type: string, distance: number, text: any, image: any): number {
  let baseConfidence = 0.5;

  switch (type) {
    case 'caption':
      baseConfidence = 0.95;
      break;
    case 'reference':
      baseConfidence = 0.90;
      break;
    case 'adjacent':
      baseConfidence = 0.85;
      break;
    case 'contextual':
      baseConfidence = 0.70;
      break;
  }

  // Adjust based on distance
  const distancePenalty = Math.min(distance / 500, 0.3);
  return Math.max(0, baseConfidence - distancePenalty);
}

function suggestLayout(text: any, image: any, type: string): string {
  if (type === 'caption') {
    return text.bbox.y1 > image.bbox.y2 ? 'text-below' : 'text-above';
  }

  if (type === 'adjacent') {
    if (Math.abs(text.bbox.y1 - image.bbox.y1) < 50) {
      return 'side-by-side';
    }
  }

  return 'text-above';
}

function determineDisplayOrder(text: any, image: any): number {
  const textCenter = text.bbox.y1 + (text.bbox.y2 - text.bbox.y1) / 2;
  const imageCenter = image.bbox.y1 + (image.bbox.y2 - image.bbox.y1) / 2;

  return textCenter < imageCenter ? 1 : 2;
}

function createCorrelation(text: any, image: any, type?: string): any {
  const correlationType = type || determineCorrelationType(text, image);
  return {
    text,
    image,
    type: correlationType,
    layoutSuggestion: suggestLayout(text, image, correlationType),
    displayOrder: determineDisplayOrder(text, image)
  };
}

function evaluateCorrelation(predicted: any[], expected: any[]): number {
  if (predicted.length === 0 || expected.length === 0) return 0;

  let matches = 0;
  for (const exp of expected) {
    const match = predicted.find(p =>
      p.type === exp.type && Math.abs(p.confidence - exp.confidence) < 0.2
    );
    if (match) matches++;
  }

  return matches / expected.length;
}
