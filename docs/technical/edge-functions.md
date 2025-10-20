# Edge Functions Documentation

## Overview

Supabase Edge Functions are serverless TypeScript/JavaScript functions deployed globally on Deno Deploy. They provide the backend logic for PDF processing, running close to users for minimal latency.

## Edge Function: pdf-processor

### Purpose

Main processing function that orchestrates PDF parsing, text extraction, image optimization, and database storage.

### Location

```
/supabase/functions/pdf-processor/
├── index.ts           # Main handler
├── lib/
│   ├── pdf-parser.ts      # PDF parsing logic
│   ├── text-extractor.ts  # Text extraction
│   ├── image-processor.ts # Image optimization
│   ├── language-detector.ts # Language detection
│   └── ocr-processor.ts   # OCR for scanned PDFs
└── types.ts           # TypeScript interfaces
```

### Implementation

```typescript
// /supabase/functions/pdf-processor/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { PDFParser } from './lib/pdf-parser.ts'
import { TextExtractor } from './lib/text-extractor.ts'
import { ImageProcessor } from './lib/image-processor.ts'
import { LanguageDetector } from './lib/language-detector.ts'
import { OCRProcessor } from './lib/ocr-processor.ts'

interface ProcessRequest {
  document_id: string
  storage_path: string
  metadata: PDFMetadata
}

serve(async (req: Request) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Authenticate request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return errorResponse('Missing authorization', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return errorResponse('Invalid token', 401)
    }

    // Parse request
    const requestData: ProcessRequest = await req.json()

    // Update status to processing
    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', requestData.document_id)

    // Process PDF
    const result = await processPDF(supabase, requestData, user.id)

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Processing error:', error)

    // Update document status
    if (requestData?.document_id) {
      await supabase
        .from('pdf_documents')
        .update({
          processing_status: 'failed',
          processing_error: error.message,
          processing_completed_at: new Date().toISOString()
        })
        .eq('id', requestData.document_id)
    }

    return errorResponse(error.message, 500)
  }
})

async function processPDF(
  supabase: any,
  request: ProcessRequest,
  userId: string
): Promise<ProcessingResult> {

  const startTime = Date.now()
  const logs: ProcessingLog[] = []

  // Log helper
  const log = async (step: string, status: string, message: string, metadata?: any) => {
    const logEntry = {
      pdf_document_id: request.document_id,
      step_name: step,
      step_status: status,
      log_level: status === 'failed' ? 'error' : 'info',
      message,
      metadata,
      created_at: new Date().toISOString()
    }
    logs.push(logEntry)

    await supabase.from('pdf_processing_logs').insert(logEntry)
  }

  try {
    // Step 1: Download PDF from storage
    await log('download_pdf', 'started', 'Downloading PDF from storage')

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('educational-pdfs')
      .download(request.storage_path)

    if (downloadError) throw new Error(`Download failed: ${downloadError.message}`)

    const pdfBuffer = await fileData.arrayBuffer()
    await log('download_pdf', 'completed', `Downloaded ${pdfBuffer.byteLength} bytes`)

    // Step 2: Parse PDF structure
    await log('pdf_parse', 'started', 'Parsing PDF structure')

    const parser = new PDFParser()
    const pdfDocument = await parser.parse(pdfBuffer)

    await log('pdf_parse', 'completed', `Parsed ${pdfDocument.pageCount} pages`)

    // Step 3: Extract text content
    await log('text_extraction', 'started', 'Extracting text from pages')

    const textExtractor = new TextExtractor()
    const textContent = await textExtractor.extract(pdfDocument)

    await log('text_extraction', 'completed', `Extracted ${textContent.length} text sections`)

    // Step 4: Detect language for each text section
    await log('language_detection', 'started', 'Detecting languages')

    const languageDetector = new LanguageDetector()
    const textWithLanguages = await Promise.all(
      textContent.map(async (section) => ({
        ...section,
        ...await languageDetector.detect(section.text_content)
      }))
    )

    await log('language_detection', 'completed', `Detected languages for all sections`)

    // Step 5: Extract images
    await log('image_extraction', 'started', 'Extracting images')

    const imageProcessor = new ImageProcessor(supabase)
    const images = await imageProcessor.extract(pdfDocument, request.document_id)

    await log('image_extraction', 'completed', `Extracted ${images.length} images`)

    // Step 6: Optimize images
    await log('image_optimization', 'started', 'Optimizing images')

    const optimizedImages = await imageProcessor.optimize(images)

    await log('image_optimization', 'completed', `Optimized ${optimizedImages.length} images`)

    // Step 7: Run OCR if needed
    const hasScannedContent = pdfDocument.isScanned || textContent.length < 5
    let ocrText = []

    if (hasScannedContent) {
      await log('ocr_processing', 'started', 'Running OCR on scanned content')

      const ocrProcessor = new OCRProcessor()
      ocrText = await ocrProcessor.process(images, request.metadata.primary_language)

      await log('ocr_processing', 'completed', `Processed ${ocrText.length} OCR sections`)
    }

    // Step 8: Correlate text and images
    await log('content_correlation', 'started', 'Correlating text with images')

    const correlations = correlateContent(textWithLanguages, optimizedImages)

    await log('content_correlation', 'completed', `Created ${correlations.length} correlations`)

    // Step 9: Store in database
    await log('database_storage', 'started', 'Storing processed content')

    // Insert text content
    const { error: textError } = await supabase
      .from('pdf_text_content')
      .insert(textWithLanguages.map(section => ({
        ...section,
        pdf_document_id: request.document_id
      })))

    if (textError) throw new Error(`Text storage failed: ${textError.message}`)

    // Insert images
    const { error: imageError } = await supabase
      .from('pdf_images')
      .insert(optimizedImages.map(img => ({
        ...img,
        pdf_document_id: request.document_id
      })))

    if (imageError) throw new Error(`Image storage failed: ${imageError.message}`)

    // Insert correlations
    if (correlations.length > 0) {
      await supabase
        .from('text_image_correlations')
        .insert(correlations)
    }

    await log('database_storage', 'completed', 'All content stored successfully')

    // Step 10: Update document record
    const processingTime = Date.now() - startTime
    const qualityScore = calculateQualityScore(textWithLanguages, optimizedImages)

    await supabase
      .from('pdf_documents')
      .update({
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        page_count: pdfDocument.pageCount,
        word_count: textWithLanguages.reduce((sum, t) => sum + t.word_count, 0),
        image_count: optimizedImages.length,
        has_ocr_content: hasScannedContent,
        text_extraction_confidence: calculateTextConfidence(textWithLanguages),
        language_detection_confidence: calculateLanguageConfidence(textWithLanguages),
        quality_score: qualityScore
      })
      .eq('id', request.document_id)

    await log('processing_complete', 'completed', `Total processing time: ${processingTime}ms`)

    return {
      document_id: request.document_id,
      status: 'completed',
      processing_time_ms: processingTime,
      statistics: {
        pages: pdfDocument.pageCount,
        text_sections: textWithLanguages.length,
        images: optimizedImages.length,
        correlations: correlations.length,
        total_words: textWithLanguages.reduce((sum, t) => sum + t.word_count, 0)
      },
      quality_score: qualityScore
    }

  } catch (error) {
    await log('processing_failed', 'failed', error.message, { error: error.stack })
    throw error
  }
}

// Helper: Correlate text and images by proximity
function correlateContent(
  textSections: TextSection[],
  images: ImageRecord[]
): Correlation[] {
  const correlations: Correlation[] = []

  for (const text of textSections) {
    const pageImages = images.filter(img => img.page_number === text.page_number)

    for (const image of pageImages) {
      // Calculate distance between text and image bounding boxes
      const distance = Math.sqrt(
        Math.pow(text.bbox_x1 - image.bbox_x1, 2) +
        Math.pow(text.bbox_y1 - image.bbox_y1, 2)
      )

      // Check if text is a caption
      const isCaption = /^(figura|fig|image|diagram)/i.test(text.text_content.substring(0, 20))

      if (distance < 100 || isCaption) {
        correlations.push({
          text_content_id: text.id,
          image_id: image.id,
          correlation_type: isCaption ? 'caption' : distance < 50 ? 'adjacent' : 'contextual',
          confidence_score: isCaption ? 0.95 : Math.max(0.6, 1 - distance / 200),
          distance_score: distance
        })
      }
    }
  }

  return correlations
}

// Helper: Calculate overall quality score
function calculateQualityScore(
  textSections: TextSection[],
  images: ImageRecord[]
): number {
  const avgTextConfidence = textSections.reduce((sum, t) => sum + t.language_confidence, 0) / textSections.length
  const avgImageQuality = images.reduce((sum, img) => sum + (img.image_quality_score || 0.8), 0) / images.length
  const hasContent = textSections.length > 0 ? 0.2 : 0
  const hasImages = images.length > 0 ? 0.1 : 0

  return Math.min(1.0, (avgTextConfidence * 0.5) + (avgImageQuality * 0.2) + hasContent + hasImages)
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function errorResponse(message: string, status: number) {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message,
        timestamp: new Date().toISOString()
      }
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  )
}
```

## Library: PDF Parser

```typescript
// /supabase/functions/pdf-processor/lib/pdf-parser.ts

import * as pdfjsLib from 'npm:pdfjs-dist@4.0.269'

export class PDFParser {
  async parse(pdfBuffer: ArrayBuffer): Promise<PDFDocument> {
    // Load PDF
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true
    })

    const pdf = await loadingTask.promise

    // Extract metadata
    const metadata = await pdf.getMetadata()
    const isScanned = await this.detectScannedPDF(pdf)

    return {
      pdf,
      pageCount: pdf.numPages,
      metadata: metadata.info,
      isScanned
    }
  }

  private async detectScannedPDF(pdf: any): Promise<boolean> {
    // Check first page for text content
    const page = await pdf.getPage(1)
    const textContent = await page.getTextContent()

    // If very little text, likely scanned
    return textContent.items.length < 10
  }
}
```

## Library: Text Extractor

```typescript
// /supabase/functions/pdf-processor/lib/text-extractor.ts

export class TextExtractor {
  async extract(pdfDocument: PDFDocument): Promise<TextSection[]> {
    const sections: TextSection[] = []

    for (let pageNum = 1; pageNum <= pdfDocument.pageCount; pageNum++) {
      const page = await pdfDocument.pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const viewport = page.getViewport({ scale: 1.0 })

      // Group text items by proximity
      const grouped = this.groupTextItems(textContent.items, viewport)

      grouped.forEach((group, index) => {
        sections.push({
          page_number: pageNum,
          section_order: index + 1,
          text_content: group.text,
          bbox_x1: group.bbox[0],
          bbox_y1: group.bbox[1],
          bbox_x2: group.bbox[2],
          bbox_y2: group.bbox[3],
          word_count: group.text.split(/\s+/).length,
          sentence_count: group.text.split(/[.!?]+/).length
        })
      })
    }

    return sections
  }

  private groupTextItems(items: any[], viewport: any): TextGroup[] {
    // Implementation for grouping nearby text items
    // Uses spatial proximity and line breaks
    // Returns array of text groups with bounding boxes
    // ...
  }
}
```

## Library: Image Processor

```typescript
// /supabase/functions/pdf-processor/lib/image-processor.ts

import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'

export class ImageProcessor {
  constructor(private supabase: any) {}

  async extract(pdfDocument: PDFDocument, documentId: string): Promise<ImageRecord[]> {
    const images: ImageRecord[] = []

    for (let pageNum = 1; pageNum <= pdfDocument.pageCount; pageNum++) {
      const page = await pdfDocument.pdf.getPage(pageNum)
      const ops = await page.getOperatorList()

      // Extract image operations
      for (let i = 0; i < ops.fnArray.length; i++) {
        if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
          const imageName = ops.argsArray[i][0]
          const image = await page.objs.get(imageName)

          images.push({
            page_number: pageNum,
            image_order: images.filter(img => img.page_number === pageNum).length + 1,
            data: image.data,
            width_pixels: image.width,
            height_pixels: image.height,
            original_format: 'png'
          })
        }
      }
    }

    return images
  }

  async optimize(images: ImageRecord[]): Promise<OptimizedImageRecord[]> {
    return await Promise.all(
      images.map(async (img) => {
        // Decode and optimize with ImageScript
        const decoded = await Image.decode(img.data)

        // Resize if too large
        if (decoded.width > 1200 || decoded.height > 1200) {
          decoded.resize(1200, Image.RESIZE_AUTO)
        }

        // Convert to WebP
        const webpData = await decoded.encodeWEBP(85)

        // Upload to storage
        const storagePath = `${img.pdf_document_id}/page-${img.page_number}-img-${img.image_order}.webp`

        await this.supabase.storage
          .from('educational-images')
          .upload(storagePath, webpData, {
            contentType: 'image/webp',
            upsert: true
          })

        return {
          ...img,
          storage_path: storagePath,
          optimized_format: 'webp',
          original_size_bytes: img.data.length,
          optimized_size_bytes: webpData.length,
          compression_ratio: webpData.length / img.data.length
        }
      })
    )
  }
}
```

## Performance Optimization

### Chunking Large PDFs

```typescript
async function processLargePDF(pdfDocument: PDFDocument) {
  const CHUNK_SIZE = 10  // Process 10 pages at a time

  for (let i = 0; i < pdfDocument.pageCount; i += CHUNK_SIZE) {
    const endPage = Math.min(i + CHUNK_SIZE, pdfDocument.pageCount)

    // Process chunk
    const chunkResults = await processPageRange(pdfDocument, i + 1, endPage)

    // Store chunk results
    await storeChunkResults(chunkResults)

    // Update progress
    const progress = Math.round((endPage / pdfDocument.pageCount) * 100)
    await updateProgress(pdfDocument.id, progress)
  }
}
```

### Memory Management

```typescript
// Use streaming for large files
async function streamPDFProcessing(storage Path: string) {
  const stream = await supabase.storage
    .from('educational-pdfs')
    .createReadStream(storagePath)

  const chunks: Uint8Array[] = []

  for await (const chunk of stream) {
    chunks.push(chunk)

    // Process incrementally if chunks get too large
    if (chunks.reduce((sum, c) => sum + c.length, 0) > 10_000_000) {
      await processChunks(chunks)
      chunks.length = 0  // Clear array
    }
  }
}
```

---

**Next**: See [Storage Configuration Guide](./storage-configuration.md) for CDN and bucket setup.
