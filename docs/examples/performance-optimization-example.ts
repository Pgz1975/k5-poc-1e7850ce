/**
 * Complete Performance Optimization Example
 * Demonstrates full integration of all performance systems
 */

import {
  initializePerformanceSystems,
  shutdownPerformanceSystems,
  getBatchOrchestrator,
  getPerformanceMonitor,
  getMemoryManager,
} from '../src/performance';

// Configuration
const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
    r2BucketName: process.env.CLOUDFLARE_R2_BUCKET || 'k5-pdfs',
  },
  workers: {
    minWorkers: 2,
    maxWorkers: 10,
  },
  memory: {
    maxHeapUsage: 1024 * 1024 * 1024, // 1GB
  },
  scaling: {
    minInstances: 2,
    maxInstances: 20,
  },
};

/**
 * Example 1: Process Single PDF with Full Optimization
 */
async function processSinglePDF(pdfBuffer: Buffer, pdfId: string) {
  const systems = await initializePerformanceSystems(config);
  const startTime = Date.now();

  try {
    // 1. Check cache
    const cacheKey = `pdf:${pdfId}:result`;
    const cached = await systems.cache.get(cacheKey);

    if (cached) {
      console.log('✅ Cache hit! Returning cached result');
      return cached;
    }

    // 2. Prepare memory
    const memory = getMemoryManager();
    const canProceed = await memory.prepareForLargeOperation(pdfBuffer.length);

    if (!canProceed) {
      throw new Error('Insufficient memory for operation');
    }

    // 3. Compress for storage
    const compressed = await systems.compression.compress(pdfBuffer, {
      algorithm: 'auto',
      level: 6,
    });

    console.log(`📦 Compressed ${((1 - compressed.ratio) * 100).toFixed(1)}% space`);

    // 4. Upload to CDN (if available)
    let cdnUrl: string | null = null;
    if (systems.cdn) {
      cdnUrl = await systems.cdn.uploadFile(
        `pdfs/${pdfId}.pdf`,
        compressed.compressed,
        { compress: true }
      );
      console.log(`☁️ Uploaded to CDN: ${cdnUrl}`);
    }

    // 5. Process in worker pool
    const result = await systems.workers.execute({
      id: pdfId,
      type: 'parse',
      data: { buffer: pdfBuffer, pdfId },
      priority: 'high',
      timeout: 120000,
    });

    console.log(`✅ Processing complete in ${result.duration}ms`);

    // 6. Cache result
    await systems.cache.set(cacheKey, result.data, 3600, ['pdf', pdfId]);

    // 7. Record metrics
    systems.monitor.recordEvent({
      id: pdfId,
      type: 'pdf_parse',
      startTime,
      endTime: Date.now(),
      pageCount: result.data?.pageCount,
      fileSize: pdfBuffer.length,
      success: result.success,
      cost: 0.03,
      metadata: { compressed: compressed.ratio < 0.9, cached: false },
    });

    // 8. Get performance report
    const report = systems.monitor.getPerformanceReport();
    console.log('\n📊 Performance Report:');
    console.log(report.summary);

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach((rec) => console.log(`  - ${rec}`));
    }

    return result.data;
  } catch (error) {
    console.error('❌ Processing failed:', error);

    systems.monitor.recordEvent({
      id: pdfId,
      type: 'pdf_parse',
      startTime,
      endTime: Date.now(),
      success: false,
      error: error.message,
    });

    throw error;
  } finally {
    await shutdownPerformanceSystems();
  }
}

/**
 * Example 2: Batch Process Multiple PDFs
 */
async function batchProcessPDFs(pdfs: Array<{ id: string; buffer: Buffer }>) {
  const systems = await initializePerformanceSystems(config);
  const orchestrator = getBatchOrchestrator();

  // Set up processor
  orchestrator.setProcessor(async (file) => {
    // Check cache first
    const cached = await systems.cache.get(`pdf:${file.id}:result`);
    if (cached) return cached;

    // Compress
    const compressed = await systems.compression.compress(file.buffer!);

    // Upload to CDN
    if (systems.cdn) {
      await systems.cdn.uploadFile(`pdfs/${file.id}.pdf`, compressed.compressed);
    }

    // Process
    const result = await systems.workers.execute({
      id: file.id,
      type: 'parse',
      data: { buffer: file.buffer, pdfId: file.id },
      priority: 'medium',
    });

    // Cache result
    await systems.cache.set(`pdf:${file.id}:result`, result.data, 3600);

    return result.data;
  });

  // Submit batch job
  const jobId = await orchestrator.submitJob({
    id: `batch-${Date.now()}`,
    files: pdfs.map((pdf) => ({
      id: pdf.id,
      name: `${pdf.id}.pdf`,
      size: pdf.buffer.length,
      buffer: pdf.buffer,
    })),
    config: {
      maxConcurrency: 5,
      timeout: 120000,
      retries: 2,
      enableCaching: true,
    },
  });

  console.log(`📦 Batch job submitted: ${jobId}`);

  // Monitor progress
  orchestrator.on('progress', (progress) => {
    if (progress.jobId === jobId) {
      console.log(
        `⏳ Progress: ${progress.progress.toFixed(1)}% ` +
        `(${progress.completed}/${progress.total}) - ` +
        `ETA: ${(progress.eta / 1000).toFixed(0)}s`
      );
    }
  });

  // Wait for completion
  return new Promise((resolve, reject) => {
    orchestrator.on('jobCompleted', (result) => {
      if (result.jobId === jobId) {
        console.log(`\n✅ Batch complete!`);
        console.log(`   Total: ${result.totalFiles}`);
        console.log(`   Successful: ${result.successful}`);
        console.log(`   Failed: ${result.failed}`);
        console.log(`   Duration: ${(result.duration / 1000).toFixed(1)}s`);
        console.log(`   Avg per file: ${result.metrics.avgProcessingTime.toFixed(0)}ms`);
        console.log(`   Throughput: ${result.metrics.throughput.toFixed(2)} files/s`);
        console.log(`   Total cost: $${result.metrics.totalCost.toFixed(4)}`);

        resolve(result);
      }
    });

    orchestrator.on('jobError', ({ jobId: errorJobId, error }) => {
      if (errorJobId === jobId) {
        reject(error);
      }
    });
  });
}

/**
 * Example 3: Monitor and Optimize Performance
 */
async function monitorPerformance() {
  const systems = await initializePerformanceSystems(config);

  // Set up real-time monitoring
  systems.monitor.on('alert', (alert) => {
    console.warn(`⚠️ [${alert.severity.toUpperCase()}] ${alert.type}: ${alert.message}`);
  });

  systems.bottleneck.on('bottleneck', (bottleneck) => {
    console.warn(`\n🔍 Bottleneck Detected:`);
    console.log(`   Type: ${bottleneck.type}`);
    console.log(`   Component: ${bottleneck.component}`);
    console.log(`   Severity: ${bottleneck.severity}`);
    console.log(`   Impact: ${bottleneck.impact}%`);
    console.log(`   Description: ${bottleneck.description}`);
    console.log(`\n   Recommendations:`);
    bottleneck.recommendations.forEach((rec) => console.log(`   - ${rec}`));
  });

  systems.memory.on('alert', (alert) => {
    console.warn(`💾 Memory Alert: ${alert.message}`);
    alert.recommendations.forEach((rec) => console.log(`   - ${rec}`));
  });

  systems.scaler.on('scaled', ({ action, fromInstances, toInstances, reason }) => {
    console.log(`⚖️ Auto-scaled ${action}: ${fromInstances} → ${toInstances}`);
    console.log(`   Reason: ${reason}`);
  });

  // Generate periodic reports
  setInterval(() => {
    const perfReport = systems.monitor.getPerformanceReport();
    const memReport = systems.memory.generateReport();
    const bottleneckReport = systems.bottleneck.getReport();

    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE REPORT');
    console.log('='.repeat(60));
    console.log(perfReport.summary);

    console.log('\n💾 MEMORY STATUS');
    console.log(`   Usage: ${(memReport.current.usage * 100).toFixed(1)}%`);
    console.log(`   Pressure: ${memReport.current.pressure}`);
    console.log(`   Trend: ${memReport.trend.trend}`);

    console.log('\n🔍 BOTTLENECKS');
    console.log(`   Active: ${bottleneckReport.activeBottlenecks}`);
    console.log(`   Total Detected: ${bottleneckReport.totalDetected}`);

    if (bottleneckReport.topBottlenecks.length > 0) {
      console.log('\n   Top Issues:');
      bottleneckReport.topBottlenecks.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.component} (${b.severity}): ${b.description}`);
      });
    }

    console.log('='.repeat(60) + '\n');
  }, 60000); // Every minute
}

/**
 * Example 4: Stress Test with Auto-Scaling
 */
async function stressTest(pdfCount: number = 100) {
  const systems = await initializePerformanceSystems(config);

  console.log(`🔥 Starting stress test with ${pdfCount} PDFs\n`);

  // Generate test PDFs (simulated)
  const testPDFs = Array.from({ length: pdfCount }, (_, i) => ({
    id: `test-pdf-${i}`,
    buffer: Buffer.alloc(Math.random() * 5 * 1024 * 1024), // 0-5MB random
  }));

  // Track scaling events
  systems.scaler.on('scaled', ({ action, fromInstances, toInstances }) => {
    console.log(`⚖️ Scaled ${action}: ${fromInstances} → ${toInstances} instances`);
  });

  // Process batch
  const startTime = Date.now();
  const result = await batchProcessPDFs(testPDFs);
  const duration = Date.now() - startTime;

  // Results
  console.log('\n' + '='.repeat(60));
  console.log('🏁 STRESS TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total PDFs: ${pdfCount}`);
  console.log(`Duration: ${(duration / 1000).toFixed(1)}s`);
  console.log(`Success Rate: ${(result.successful / result.totalFiles * 100).toFixed(1)}%`);
  console.log(`Avg per PDF: ${result.metrics.avgProcessingTime.toFixed(0)}ms`);
  console.log(`Throughput: ${result.metrics.throughput.toFixed(2)} PDFs/s`);
  console.log(`Peak Memory: ${(result.metrics.peakMemory / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`Total Cost: $${result.metrics.totalCost.toFixed(4)}`);
  console.log(`Cost per PDF: $${(result.metrics.totalCost / pdfCount).toFixed(6)}`);

  // Check if targets met
  const avgTime = result.metrics.avgProcessingTime;
  const costPerPDF = result.metrics.totalCost / pdfCount;

  console.log('\n📋 Target Validation:');
  console.log(`   <3s single page: ${avgTime < 3000 ? '✅' : '❌'} (${avgTime.toFixed(0)}ms)`);
  console.log(`   <45s per 100 pages: ${avgTime < 45000 ? '✅' : '❌'}`);
  console.log(`   <$0.05 per PDF: ${costPerPDF < 0.05 ? '✅' : '❌'} ($${costPerPDF.toFixed(6)})`);
  console.log('='.repeat(60) + '\n');

  await shutdownPerformanceSystems();
}

// Run examples
if (require.main === module) {
  const example = process.argv[2] || 'single';

  switch (example) {
    case 'single':
      // Example: node performance-optimization-example.js single
      const samplePDF = Buffer.alloc(2 * 1024 * 1024); // 2MB sample
      processSinglePDF(samplePDF, 'example-pdf-1');
      break;

    case 'batch':
      // Example: node performance-optimization-example.js batch
      const batchPDFs = Array.from({ length: 10 }, (_, i) => ({
        id: `batch-pdf-${i}`,
        buffer: Buffer.alloc(Math.random() * 3 * 1024 * 1024),
      }));
      batchProcessPDFs(batchPDFs);
      break;

    case 'monitor':
      // Example: node performance-optimization-example.js monitor
      monitorPerformance();
      break;

    case 'stress':
      // Example: node performance-optimization-example.js stress 100
      const count = parseInt(process.argv[3] || '100');
      stressTest(count);
      break;

    default:
      console.log('Usage: node performance-optimization-example.js <single|batch|monitor|stress>');
  }
}

export {
  processSinglePDF,
  batchProcessPDFs,
  monitorPerformance,
  stressTest,
};
