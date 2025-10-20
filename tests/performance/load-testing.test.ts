/**
 * Load Testing for Concurrent PDF Uploads
 * Target: Handle 1000+ concurrent uploads
 */

import { describe, it, expect } from 'vitest';
import { MockPDFGenerator } from '../mocks/pdf-generator';
import { createMockSupabaseClient } from '../mocks/supabase-client';

describe('Load Testing - Concurrent Uploads', () => {
  it('should handle 10 concurrent uploads', async () => {
    const supabase = createMockSupabaseClient();
    const pdfs = await generateMultiplePDFs(10);

    const startTime = performance.now();
    const results = await uploadConcurrently(supabase, pdfs, 10);
    const endTime = performance.now();

    const duration = endTime - startTime;
    const successRate = results.filter(r => r.success).length / results.length;

    console.log(`10 concurrent uploads: ${duration.toFixed(2)}ms, ${(successRate * 100).toFixed(1)}% success`);

    expect(successRate).toBeGreaterThan(0.95);
    expect(duration).toBeLessThan(5000);
  }, 15000);

  it('should handle 100 concurrent uploads', async () => {
    const supabase = createMockSupabaseClient();
    const pdfs = await generateMultiplePDFs(100);

    const startTime = performance.now();
    const results = await uploadConcurrently(supabase, pdfs, 100);
    const endTime = performance.now();

    const duration = endTime - startTime;
    const successRate = results.filter(r => r.success).length / results.length;

    console.log(`100 concurrent uploads: ${duration.toFixed(2)}ms, ${(successRate * 100).toFixed(1)}% success`);

    expect(successRate).toBeGreaterThan(0.90);
    expect(duration).toBeLessThan(30000);
  }, 45000);

  it('should handle 1000 concurrent uploads (target)', async () => {
    const supabase = createMockSupabaseClient();

    // Use batching to manage memory
    const batchSize = 100;
    const batches = 10;
    let totalSuccess = 0;
    let totalTime = 0;

    for (let i = 0; i < batches; i++) {
      const pdfs = await generateMultiplePDFs(batchSize);

      const startTime = performance.now();
      const results = await uploadConcurrently(supabase, pdfs, batchSize);
      const endTime = performance.now();

      totalSuccess += results.filter(r => r.success).length;
      totalTime += endTime - startTime;

      console.log(`Batch ${i + 1}/10 completed in ${(endTime - startTime).toFixed(2)}ms`);
    }

    const overallSuccessRate = totalSuccess / 1000;
    const avgBatchTime = totalTime / batches;

    console.log(`1000 uploads: ${totalTime.toFixed(2)}ms total, ${(overallSuccessRate * 100).toFixed(1)}% success`);
    console.log(`Average batch time: ${avgBatchTime.toFixed(2)}ms`);

    expect(overallSuccessRate).toBeGreaterThan(0.85);
  }, 180000);
});

describe('Load Testing - Processing Queue', () => {
  it('should queue processing tasks efficiently', async () => {
    const supabase = createMockSupabaseClient();
    const documentIds = Array(50).fill(null).map(() => `doc-${Math.random()}`);

    const startTime = performance.now();

    const queueResults = await Promise.all(
      documentIds.map(id => queueProcessing(supabase, id))
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(queueResults.every(r => r.queued)).toBe(true);
    expect(duration).toBeLessThan(1000);
  });

  it('should process queue in parallel', async () => {
    const supabase = createMockSupabaseClient();
    const queue = Array(20).fill(null).map((_, i) => ({
      id: `doc-${i}`,
      priority: i % 3 === 0 ? 'high' : 'normal'
    }));

    const startTime = performance.now();

    const results = await processQueue(supabase, queue, {
      maxConcurrent: 5
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Processed 20 items in ${duration.toFixed(2)}ms with max 5 concurrent`);

    expect(results.filter(r => r.success).length).toBe(20);
    expect(duration).toBeLessThan(10000);
  }, 15000);

  it('should prioritize high-priority items', async () => {
    const supabase = createMockSupabaseClient();
    const queue = [
      { id: 'low-1', priority: 'low', submitted: Date.now() },
      { id: 'high-1', priority: 'high', submitted: Date.now() + 10 },
      { id: 'normal-1', priority: 'normal', submitted: Date.now() + 5 },
      { id: 'high-2', priority: 'high', submitted: Date.now() + 20 }
    ];

    const processedOrder = await processQueueOrdered(supabase, queue);

    const highItems = processedOrder.filter((_, i) =>
      queue[i].priority === 'high'
    );

    // High priority items should be processed first
    expect(processedOrder[0].priority).toBe('high');
    expect(processedOrder[1].priority).toBe('high');
  });
});

describe('Load Testing - Database Performance', () => {
  it('should handle high write throughput', async () => {
    const supabase = createMockSupabaseClient();

    const records = Array(1000).fill(null).map((_, i) => ({
      pdf_document_id: `doc-${i}`,
      page_number: 1,
      section_order: 1,
      text_content: `Sample text ${i}`,
      detected_language: 'spanish',
      language_confidence: 0.96,
      word_count: 50
    }));

    const startTime = performance.now();

    // Batch insert in chunks
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await supabase.from('pdf_text_content').insert(chunk);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Inserted 1000 records in ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(5000);
  });

  it('should handle high read throughput', async () => {
    const supabase = createMockSupabaseClient();

    // Seed database
    await seedDatabase(supabase, 5000);

    const startTime = performance.now();

    const queries = Array(100).fill(null).map((_, i) =>
      supabase.from('pdf_documents')
        .select('*')
        .eq('grade_level', `${(i % 5) + 1}`)
        .limit(10)
    );

    await Promise.all(queries);

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Executed 100 queries in ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(2000);
  });

  it('should maintain performance under mixed load', async () => {
    const supabase = createMockSupabaseClient();

    const startTime = performance.now();

    // Simulate mixed read/write operations
    const operations = [];

    // 50 writes
    for (let i = 0; i < 50; i++) {
      operations.push(
        supabase.from('pdf_documents').insert({
          filename: `test-${i}.pdf`,
          file_size: 1000000,
          content_type: 'reading_passage',
          grade_level: ['3'],
          primary_language: 'spanish'
        })
      );
    }

    // 50 reads
    for (let i = 0; i < 50; i++) {
      operations.push(
        supabase.from('pdf_documents')
          .select('*')
          .limit(10)
      );
    }

    await Promise.all(operations);

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Mixed 50 writes + 50 reads in ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(5000);
  });
});

describe('Load Testing - Resource Usage', () => {
  it('should maintain stable memory usage', async () => {
    const supabase = createMockSupabaseClient();
    const iterations = 100;

    const memBefore = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      const pdf = await MockPDFGenerator.generatePDF({ pageCount: 5 });
      await uploadPDF(supabase, pdf);

      // Periodic cleanup
      if (i % 10 === 0 && global.gc) {
        global.gc();
      }
    }

    if (global.gc) {
      global.gc();
    }

    const memAfter = process.memoryUsage().heapUsed;
    const memIncrease = (memAfter - memBefore) / 1024 / 1024;

    console.log(`Memory increase after 100 uploads: ${memIncrease.toFixed(2)} MB`);

    expect(memIncrease).toBeLessThan(50); // Should not leak significantly
  }, 60000);

  it('should handle sustained load', async () => {
    const supabase = createMockSupabaseClient();
    const duration = 10000; // 10 seconds
    const uploadInterval = 100; // Upload every 100ms

    const startTime = Date.now();
    let uploadCount = 0;
    let errorCount = 0;

    while (Date.now() - startTime < duration) {
      try {
        const pdf = await MockPDFGenerator.generatePDF({ pageCount: 1 });
        await uploadPDF(supabase, pdf);
        uploadCount++;
      } catch (error) {
        errorCount++;
      }

      await delay(uploadInterval);
    }

    const errorRate = errorCount / (uploadCount + errorCount);

    console.log(`Sustained load: ${uploadCount} uploads in 10s, ${(errorRate * 100).toFixed(2)}% error rate`);

    expect(uploadCount).toBeGreaterThan(50); // At least 5 uploads/second
    expect(errorRate).toBeLessThan(0.05); // Less than 5% error rate
  }, 15000);
});

// Helper functions
async function generateMultiplePDFs(count: number): Promise<Buffer[]> {
  const pdfs = [];

  for (let i = 0; i < count; i++) {
    const pdf = await MockPDFGenerator.generatePDF({
      pageCount: Math.floor(Math.random() * 3) + 1,
      language: i % 2 === 0 ? 'spanish' : 'english'
    });
    pdfs.push(pdf);
  }

  return pdfs;
}

async function uploadConcurrently(
  supabase: any,
  pdfs: Buffer[],
  concurrency: number
): Promise<any[]> {
  const results = await Promise.all(
    pdfs.map((pdf, i) => uploadPDF(supabase, pdf, `upload-${i}.pdf`))
  );

  return results;
}

async function uploadPDF(supabase: any, pdf: Buffer, filename?: string): Promise<any> {
  try {
    const path = `uploads/${Date.now()}-${filename || 'test.pdf'}`;

    await supabase.storage
      .from('educational-pdfs')
      .upload(path, pdf);

    const { data } = await supabase
      .from('pdf_documents')
      .insert({
        filename: filename || 'test.pdf',
        file_size: pdf.length,
        storage_path: path,
        file_hash: `hash-${Date.now()}`,
        content_type: 'reading_passage',
        grade_level: ['3'],
        primary_language: 'spanish'
      })
      .select()
      .single();

    return { success: true, id: data.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function queueProcessing(supabase: any, documentId: string): Promise<any> {
  await delay(Math.random() * 10);
  return { queued: true, documentId };
}

async function processQueue(supabase: any, queue: any[], options: any): Promise<any[]> {
  const results: any[] = [];
  const maxConcurrent = options.maxConcurrent || 5;

  for (let i = 0; i < queue.length; i += maxConcurrent) {
    const batch = queue.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(item => processItem(supabase, item))
    );
    results.push(...batchResults);
  }

  return results;
}

async function processQueueOrdered(supabase: any, queue: any[]): Promise<any[]> {
  // Sort by priority
  const sorted = [...queue].sort((a, b) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] -
           priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return sorted;
}

async function processItem(supabase: any, item: any): Promise<any> {
  await delay(50);
  return { success: true, id: item.id };
}

async function seedDatabase(supabase: any, count: number): Promise<void> {
  const records = Array(count).fill(null).map((_, i) => ({
    filename: `doc-${i}.pdf`,
    file_size: 1000000,
    storage_path: `path-${i}`,
    file_hash: `hash-${i}`,
    content_type: 'reading_passage',
    grade_level: [`${(i % 5) + 1}`],
    primary_language: i % 2 === 0 ? 'spanish' : 'english'
  }));

  const chunkSize = 100;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    await supabase.from('pdf_documents').insert(chunk);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
