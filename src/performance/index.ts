/**
 * Performance Optimization System - Main Export
 * Comprehensive performance optimization for K5 PDF processing
 *
 * Targets:
 * - <3s single page processing
 * - <45s for 100-page PDFs
 * - <$0.05 per PDF cost
 * - 60% storage reduction
 */

// Caching
export {
  RedisCacheManager,
  CacheStrategy,
  getCacheManager,
  disconnectCache,
  type CacheConfig,
  type CacheEntry,
  type CacheStats,
} from './caching/redis-cache';

// Compression
export {
  CompressionManager,
  getCompressionManager,
  type CompressionOptions,
  type CompressionResult,
  type CompressionStats,
} from './compression/algorithms';

// Workers
export {
  PDFWorkerPool,
  getWorkerPool,
  shutdownWorkerPool,
  type WorkerTask,
  type WorkerResult,
  type WorkerPoolConfig,
} from './workers/pdf-worker-pool';

// Database
export {
  QueryOptimizer,
  ConnectionPoolManager,
  getQueryOptimizer,
  type QueryPlan,
  type IndexStrategy,
  type ConnectionPoolConfig,
} from './database/query-optimizer';

// Storage
export {
  PDFStreamProcessor,
  LazyLoadManager,
  getStreamProcessor,
  getLazyLoader,
  type StreamConfig,
  type ChunkMetadata,
} from './storage/stream-processor';

// CDN
export {
  CloudflareCDNManager,
  getCDNManager,
  type CloudflareConfig,
  type CDNPerformanceMetrics,
  type UploadOptions,
} from './cdn/cloudflare-config';

// Monitoring
export {
  PerformanceMonitor,
  getPerformanceMonitor,
  type PerformanceMetrics,
  type ProcessingEvent,
  type Alert,
  type PerformanceThresholds,
} from './monitoring/performance-monitor';

export {
  BottleneckDetector,
  getBottleneckDetector,
  type Bottleneck,
  type PerformanceTrace,
  type BottleneckThresholds,
} from './monitoring/bottleneck-detector';

// Scaling
export {
  AutoScaler,
  getAutoScaler,
  stopAutoScaler,
  type ScalingConfig,
  type ScalingMetrics,
  type ScalingEvent,
} from './scaling/auto-scaler';

// Pooling
export {
  ResourcePool,
  createConnectionPool,
  type PoolConfig,
  type ResourceFactory,
  type PoolStats,
} from './pooling/resource-pool';

// Memory
export {
  MemoryManager,
  getMemoryManager,
  stopMemoryManager,
  type MemoryConfig,
  type MemoryStats,
  type MemoryAlert,
} from './memory/memory-manager';

// Orchestration
export {
  BatchOrchestrator,
  getBatchOrchestrator,
  type BatchJob,
  type BatchResult,
  type BatchProgress,
} from './orchestration/batch-orchestrator';

/**
 * Initialize all performance systems with default configuration
 */
export async function initializePerformanceSystems(config?: {
  redis?: { host: string; port: number; password?: string };
  cloudflare?: { accountId: string; apiToken: string; r2BucketName: string };
  workers?: { minWorkers?: number; maxWorkers?: number };
  memory?: { maxHeapUsage?: number };
  scaling?: { minInstances?: number; maxInstances?: number };
}) {
  const systems = {
    cache: getCacheManager(config?.redis),
    compression: getCompressionManager(),
    workers: getWorkerPool(config?.workers),
    monitor: getPerformanceMonitor(),
    bottleneck: getBottleneckDetector(),
    memory: getMemoryManager(config?.memory),
    scaler: getAutoScaler(config?.scaling),
    orchestrator: getBatchOrchestrator(),
    cdn: config?.cloudflare ? getCDNManager(config.cloudflare) : null,
  };

  // Connect systems
  systems.workers.on('metrics', (metrics) => {
    systems.monitor.updateWorkerMetrics(
      metrics.activeWorkers,
      metrics.queueSize
    );
    systems.scaler.updateMetrics({
      utilization: metrics.avgWorkerUtilization,
      queueDepth: metrics.queueSize,
    });
  });

  systems.cache.on('stats', (stats) => {
    systems.monitor.updateCacheMetrics(
      stats.hitRate,
      1 - stats.hitRate,
      stats.keyCount
    );
  });

  systems.bottleneck.on('bottleneck', (bottleneck) => {
    console.warn(`[Bottleneck Detected] ${bottleneck.type}: ${bottleneck.description}`);
    bottleneck.recommendations.forEach((rec) => console.log(`  - ${rec}`));
  });

  return systems;
}

/**
 * Shutdown all performance systems gracefully
 */
export async function shutdownPerformanceSystems() {
  await Promise.all([
    disconnectCache(),
    shutdownWorkerPool(),
    stopMemoryManager(),
    stopAutoScaler(),
  ]);
}
