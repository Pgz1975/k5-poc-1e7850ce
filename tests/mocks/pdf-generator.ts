/**
 * Mock PDF Generator for Testing
 * Creates realistic PDF test data
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface MockPDFOptions {
  pageCount?: number;
  language?: 'spanish' | 'english' | 'bilingual';
  includeImages?: boolean;
  imageCount?: number;
  contentType?: 'reading_passage' | 'assessment' | 'instructional_material' | 'activity_sheet';
  gradeLevel?: string;
  complexity?: 'low' | 'medium' | 'high';
}

export class MockPDFGenerator {
  /**
   * Generate a test PDF with specified characteristics
   */
  static async generatePDF(options: MockPDFOptions = {}): Promise<Buffer> {
    const {
      pageCount = 1,
      language = 'english',
      includeImages = false,
      imageCount = 0,
      contentType = 'reading_passage',
      gradeLevel = '3',
      complexity = 'medium'
    } = options;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.addPage([612, 792]); // US Letter size
      const { width, height } = page.getSize();

      // Add title
      const title = this.getTitle(contentType, language, i + 1);
      page.drawText(title, {
        x: 50,
        y: height - 50,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Add content based on type
      const content = this.getContent(contentType, language, gradeLevel, complexity);
      const lines = this.wrapText(content, width - 100, font, 12);

      let yPosition = height - 100;
      for (const line of lines) {
        if (yPosition < 50) break; // Don't overflow page
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0, 0, 0)
        });
        yPosition -= 18;
      }

      // Add images (mock rectangles)
      if (includeImages && i === 0) {
        for (let j = 0; j < imageCount; j++) {
          const imgY = height - 300 - (j * 150);
          page.drawRectangle({
            x: width - 200,
            y: imgY,
            width: 150,
            height: 100,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(0.9, 0.9, 0.9)
          });

          page.drawText(`[Image ${j + 1}]`, {
            x: width - 150,
            y: imgY + 45,
            size: 10,
            font,
            color: rgb(0.5, 0.5, 0.5)
          });
        }
      }

      // Add page number
      page.drawText(`Página ${i + 1} de ${pageCount}`, {
        x: width / 2 - 50,
        y: 30,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Generate a bilingual test PDF
   */
  static async generateBilingualPDF(pageCount: number = 2): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Spanish page
    const spanishPage = pdfDoc.addPage([612, 792]);
    spanishPage.drawText('El Gato y el Ratón', {
      x: 50,
      y: 742,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    const spanishText = `Había una vez un pequeño ratón que vivía en un agujero en la pared.
Un día, un gato grande llegó a la casa. El ratón tenía mucho miedo del gato.
El gato era muy astuto y siempre estaba buscando al ratón.

El ratón decidió que necesitaba un plan. Pensó y pensó, y finalmente tuvo una idea brillante.
Puso una campana en el collar del gato. Ahora podría escuchar cuando el gato se acercaba.

Esta es una historia sobre ser inteligente y pensar en soluciones creativas.`;

    const spanishLines = this.wrapText(spanishText, 512, font, 12);
    let yPos = 700;
    for (const line of spanishLines) {
      spanishPage.drawText(line, { x: 50, y: yPos, size: 12, font });
      yPos -= 18;
    }

    // English page
    const englishPage = pdfDoc.addPage([612, 792]);
    englishPage.drawText('The Cat and the Mouse', {
      x: 50,
      y: 742,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    const englishText = `Once upon a time, there was a little mouse who lived in a hole in the wall.
One day, a big cat came to the house. The mouse was very afraid of the cat.
The cat was very clever and was always looking for the mouse.

The mouse decided that he needed a plan. He thought and thought, and finally had a brilliant idea.
He put a bell on the cat's collar. Now he could hear when the cat was coming.

This is a story about being smart and thinking of creative solutions.`;

    const englishLines = this.wrapText(englishText, 512, font, 12);
    yPos = 700;
    for (const line of englishLines) {
      englishPage.drawText(line, { x: 50, y: yPos, size: 12, font });
      yPos -= 18;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Generate assessment PDF with multiple choice questions
   */
  static async generateAssessmentPDF(questionCount: number = 10, language: 'spanish' | 'english' = 'spanish'): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    const title = language === 'spanish'
      ? 'Evaluación de Comprensión de Lectura - Grado 3'
      : 'Reading Comprehension Assessment - Grade 3';

    page.drawText(title, {
      x: 50,
      y: height - 50,
      size: 16,
      font: boldFont
    });

    let yPos = height - 100;
    const questions = this.generateQuestions(questionCount, language);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (yPos < 150) break; // Don't overflow

      // Question number and text
      page.drawText(`${i + 1}. ${q.question}`, {
        x: 50,
        y: yPos,
        size: 11,
        font: boldFont
      });
      yPos -= 25;

      // Choices
      const choices = ['A', 'B', 'C', 'D'];
      for (let j = 0; j < q.choices.length; j++) {
        page.drawText(`   ${choices[j]}. ${q.choices[j]}`, {
          x: 60,
          y: yPos,
          size: 10,
          font
        });
        yPos -= 20;
      }
      yPos -= 15;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  private static getTitle(contentType: string, language: string, pageNum: number): string {
    const titles: Record<string, Record<string, string>> = {
      reading_passage: {
        spanish: 'Pasaje de Lectura',
        english: 'Reading Passage',
        bilingual: pageNum % 2 === 0 ? 'Reading Passage' : 'Pasaje de Lectura'
      },
      assessment: {
        spanish: 'Evaluación',
        english: 'Assessment',
        bilingual: 'Assessment / Evaluación'
      },
      instructional_material: {
        spanish: 'Material Instructivo',
        english: 'Instructional Material',
        bilingual: 'Instructional Material / Material Instructivo'
      },
      activity_sheet: {
        spanish: 'Hoja de Actividades',
        english: 'Activity Sheet',
        bilingual: 'Activity Sheet / Hoja de Actividades'
      }
    };

    return titles[contentType]?.[language] || 'Test Document';
  }

  private static getContent(contentType: string, language: string, gradeLevel: string, complexity: string): string {
    const spanishContent = {
      low: 'El sol brilla. El cielo es azul. Los pájaros cantan. Es un día hermoso.',
      medium: 'El pequeño niño corrió por el parque. Vio muchas flores de colores brillantes. Su perro jugaba felizmente a su lado. Era un día perfecto para estar afuera.',
      high: 'Durante el cálido día de verano, la familia decidió visitar la playa cercana. Las olas del océano creaban un sonido relajante mientras las gaviotas volaban sobre sus cabezas. Los niños construyeron elaborados castillos de arena, decorándolos con conchas que encontraron a lo largo de la costa.'
    };

    const englishContent = {
      low: 'The sun shines. The sky is blue. Birds sing. It is a beautiful day.',
      medium: 'The little boy ran through the park. He saw many brightly colored flowers. His dog played happily beside him. It was a perfect day to be outside.',
      high: 'During the warm summer day, the family decided to visit the nearby beach. The ocean waves created a soothing sound as seagulls flew overhead. The children built elaborate sand castles, decorating them with shells they found along the shore.'
    };

    const content = language === 'spanish' ? spanishContent : englishContent;
    return content[complexity] || content.medium;
  }

  private static wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private static generateQuestions(count: number, language: 'spanish' | 'english'): Array<{ question: string; choices: string[] }> {
    const spanishQuestions = [
      {
        question: '¿Cuál es la idea principal del pasaje?',
        choices: [
          'Los animales son importantes',
          'La naturaleza es hermosa',
          'Debemos cuidar el medio ambiente',
          'Las plantas necesitan agua'
        ]
      },
      {
        question: '¿Qué significa la palabra "brillante" en el contexto?',
        choices: [
          'Inteligente',
          'Luminoso',
          'Colorido',
          'Rápido'
        ]
      }
    ];

    const englishQuestions = [
      {
        question: 'What is the main idea of the passage?',
        choices: [
          'Animals are important',
          'Nature is beautiful',
          'We should care for the environment',
          'Plants need water'
        ]
      },
      {
        question: 'What does the word "brilliant" mean in context?',
        choices: [
          'Smart',
          'Bright',
          'Colorful',
          'Fast'
        ]
      }
    ];

    const questions = language === 'spanish' ? spanishQuestions : englishQuestions;
    return questions.slice(0, count);
  }
}

/**
 * Generate test PDF files for various scenarios
 */
export const generateTestPDFs = async () => {
  return {
    singlePage: await MockPDFGenerator.generatePDF({ pageCount: 1 }),
    multiPage: await MockPDFGenerator.generatePDF({ pageCount: 10 }),
    hundredPage: await MockPDFGenerator.generatePDF({ pageCount: 100 }),
    withImages: await MockPDFGenerator.generatePDF({ pageCount: 5, includeImages: true, imageCount: 3 }),
    bilingual: await MockPDFGenerator.generateBilingualPDF(),
    spanishAssessment: await MockPDFGenerator.generateAssessmentPDF(10, 'spanish'),
    englishAssessment: await MockPDFGenerator.generateAssessmentPDF(10, 'english'),
    complexSpanish: await MockPDFGenerator.generatePDF({
      pageCount: 20,
      language: 'spanish',
      includeImages: true,
      imageCount: 5,
      complexity: 'high',
      gradeLevel: '5'
    })
  };
};
