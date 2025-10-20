/**
 * K5 POC Storage System - Main Export
 *
 * Comprehensive storage solution for Supabase with CDN integration,
 * lifecycle management, backup/recovery, and COPPA compliance.
 */

// Core Configuration
export * from './config';
export * from './utils';

// Lifecycle Management
export * from './lifecycle';

// Backup and Recovery
export * from './backup';

// COPPA Compliance
export * from './coppa-compliance';

// CDN Integration
export * from './cdn/cloudflare';

// Optimization
export * from './optimization/cleanup';
export * from './optimization/webp-converter';

// Re-export commonly used classes for convenience
export { StorageUploader, StorageDownloader, StorageBatchOperations } from './utils';
export { CloudflareCDNManager, CacheKeyGenerator, CacheWarmer } from './cdn/cloudflare';
export { StorageCleanupService, CleanupScheduler } from './optimization/cleanup';
export { WebPConverter, WebPConversionWorker } from './optimization/webp-converter';
export { LifecyclePolicyManager } from './lifecycle';
export { StorageBackupService } from './backup';
export { COPPAComplianceService } from './coppa-compliance';
