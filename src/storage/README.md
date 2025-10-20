# K5 POC Storage System

Comprehensive Supabase Storage configuration for the K5 PDF parsing and assessment system with COPPA compliance, CDN integration, and advanced optimization.

## Overview

This storage system provides:

- **Multi-bucket architecture** for organized file storage
- **Row-Level Security (RLS)** for access control
- **Cloudflare CDN integration** for global content delivery
- **Automated lifecycle management** and archival
- **Backup and disaster recovery** with point-in-time restoration
- **COPPA compliance** for student data protection
- **WebP image optimization** for reduced bandwidth
- **Automated cleanup** and storage quota management

## Directory Structure

```
src/storage/
├── config.ts                 # Bucket and policy configuration
├── utils.ts                  # Upload/download utilities
├── lifecycle.ts              # Lifecycle and archival policies
├── backup.ts                 # Backup and recovery system
├── coppa-compliance.ts       # COPPA compliance features
├── policies/
│   └── rls.sql              # Row-Level Security policies
├── cdn/
│   └── cloudflare.ts        # CDN management
└── optimization/
    ├── cleanup.ts           # Automated cleanup
    └── webp-converter.ts    # Image optimization
```

## Storage Buckets

### 1. pdf-originals
- **Purpose**: Original PDF files with versioning
- **Access**: Teachers and admins can upload, authenticated users can read
- **Retention**: Permanent with 90-day version retention
- **Encryption**: Required

### 2. pdf-images
- **Purpose**: Extracted images from PDFs
- **Access**: Public read, authenticated upload
- **Retention**: Transition to cold storage after 30 days
- **Optimization**: Automatic WebP conversion

### 3. pdf-thumbnails
- **Purpose**: Quick preview thumbnails
- **Access**: Public read, system upload
- **Retention**: 30 days, then auto-delete
- **Optimization**: Compressed and cached

### 4. pdf-processed
- **Purpose**: Processed PDF outputs and metadata
- **Access**: Public read, teachers upload
- **Retention**: Archive after 180 days
- **Features**: Full-text search metadata

### 5. assessment-assets
- **Purpose**: Assessment media (images, audio, video)
- **Access**: Public read, teachers upload
- **Retention**: 60 days standard, then cold storage
- **Features**: Multi-format support

## Quick Start

### Initialize Storage

```typescript
import { initializeStorageBuckets } from './storage/config';
import { supabase } from './lib/supabase';

// Create all buckets
await initializeStorageBuckets(supabase);
```

### Upload Files

```typescript
import { StorageUploader } from './storage/utils';

const uploader = new StorageUploader(supabase);

// Upload with progress tracking
const result = await uploader.upload({
  bucket: 'pdf-originals',
  path: 'reading-passages/spanish/k/document.pdf',
  file: pdfFile,
  onProgress: (progress) => {
    console.log(`${progress.percentage}% uploaded`);
  },
});

console.log('File URL:', result.url);
console.log('CDN URL:', result.cdnUrl);
```

### Batch Operations

```typescript
// Upload multiple files
const results = await uploader.uploadBatch([
  { bucket: 'pdf-images', path: 'image1.jpg', file: file1 },
  { bucket: 'pdf-images', path: 'image2.jpg', file: file2 },
]);

console.log(`${results.successful} files uploaded successfully`);
```

## CDN Integration

### Setup Cloudflare CDN

```typescript
import { CloudflareCDNManager } from './storage/cdn/cloudflare';

const cdn = new CloudflareCDNManager({
  zoneId: process.env.CLOUDFLARE_ZONE_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  baseUrl: process.env.CDN_BASE_URL,
});

// Purge cache for a file
await cdn.purgeFiles('pdf-images', ['path/to/image.webp']);

// Get analytics
const analytics = await cdn.getAnalytics('7d');
console.log(`Cache hit rate: ${analytics.cacheHitRate}%`);
```

### Cache Configuration

Automatic caching rules:
- **PDF Originals**: 1 hour cache
- **Images**: 7 days cache
- **Thumbnails**: 7 days cache
- **Processed PDFs**: 24 hours cache
- **Assessment Assets**: 7 days cache

## Lifecycle Management

### Configure Lifecycle Policies

```typescript
import { LifecyclePolicyManager } from './storage/lifecycle';

const lifecycle = new LifecyclePolicyManager(supabase);

// Apply default policies
const rules = lifecycle.getDefaultLifecycleRules();
await lifecycle.applyLifecycleRules('pdf-images', rules);

// Get storage tier recommendations
const recommendations = await lifecycle.getStorageTierRecommendations('pdf-originals');

for (const rec of recommendations) {
  console.log(`Move ${rec.path} to ${rec.recommendedTier} to save $${rec.savings}/month`);
}
```

### Execute Lifecycle Transitions

```typescript
// Run lifecycle policies
const result = await lifecycle.executeLifecycleTransitions('pdf-processed');

console.log(`Transitioned: ${result.transitioned} files`);
console.log(`Deleted: ${result.deleted} files`);
```

## Backup and Recovery

### Create Backups

```typescript
import { StorageBackupService } from './storage/backup';

const backup = new StorageBackupService(supabase);

// Full backup
const fullBackup = await backup.createFullBackup('pdf-originals', {
  compress: true,
  encrypt: true,
});

console.log(`Backup ID: ${fullBackup.id}`);
console.log(`Files backed up: ${fullBackup.fileCount}`);

// Incremental backup
const incrementalBackup = await backup.createIncrementalBackup(
  'pdf-originals',
  fullBackup.id,
  { compress: true }
);
```

### Restore from Backup

```typescript
// Restore specific files
const restoreResult = await backup.restore({
  backupId: 'backup-xyz-123',
  targetBucket: 'pdf-originals',
  filesFilter: ['important-doc.pdf'],
  overwrite: false,
  validate: true,
});

console.log(`Restored ${restoreResult.filesRestored} files`);
console.log(`Total size: ${restoreResult.bytesRestored} bytes`);
```

### Schedule Automated Backups

```typescript
// Create backup schedule
const scheduleId = await backup.createBackupSchedule({
  bucket: 'pdf-originals',
  enabled: true,
  cronExpression: '0 2 * * *', // Daily at 2 AM
  config: {
    bucket: 'pdf-originals',
    schedule: 'daily',
    retention: 30,
    incremental: true,
    compress: true,
    encrypt: true,
    destination: 's3',
  },
});
```

## COPPA Compliance

### Parental Consent Management

```typescript
import { COPPAComplianceService } from './storage/coppa-compliance';

const coppa = new COPPAComplianceService(supabase);

// Grant parental consent
await coppa.grantParentalConsent({
  studentId: 'student-123',
  parentId: 'parent-456',
  consentType: 'full',
  permissions: {
    allowDataCollection: true,
    allowImageStorage: true,
    allowVoiceRecording: false,
    allowProgressTracking: true,
    allowAssessmentResults: true,
    allowContentSharing: false,
  },
  verificationMethod: 'email',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});

// Verify consent before data access
const { granted, consent } = await coppa.verifyParentalConsent('student-123');

if (!granted) {
  throw new Error('Parental consent required');
}
```

### Data Export and Deletion

```typescript
// Export student data (COPPA right to access)
const exportRequest = await coppa.exportStudentData(
  'student-123',
  'parent-456',
  'json',
  true // Include files
);

// Delete student data (COPPA right to deletion)
const deleteRequest = await coppa.deleteStudentData(
  'student-123',
  'parent-456',
  false // Not immediate (30-day grace period)
);
```

### Compliance Auditing

```typescript
// Run automated compliance audit
const audit = await coppa.runComplianceAudit();

console.log('Passed checks:', audit.passedChecks);
console.log('Failed checks:', audit.failedChecks);
console.log('Warnings:', audit.warnings);
```

## Image Optimization

### WebP Conversion

```typescript
import { WebPConverter } from './storage/optimization/webp-converter';

const converter = new WebPConverter();

// Convert single image
const result = await converter.convertToWebP(imageFile, {
  quality: 85,
  generateResponsive: true,
  responsiveSizes: [320, 640, 1024, 1920],
});

console.log(`Compression: ${result.compressionRatio}%`);
console.log(`Saved: ${result.originalSize - result.webpSize} bytes`);

// Access responsive images
if (result.responsiveImages) {
  for (const img of result.responsiveImages) {
    console.log(`${img.width}w: ${img.size} bytes`);
  }
}
```

### Batch Conversion

```typescript
// Convert multiple images
const batchResult = await converter.convertBatch(
  [
    { file: image1, filename: 'image1.jpg' },
    { file: image2, filename: 'image2.png' },
  ],
  { quality: 80 }
);

console.log(`Converted: ${batchResult.successful}/${batchResult.total}`);
console.log(`Total savings: ${batchResult.totalSizeBefore - batchResult.totalSizeAfter} bytes`);
```

### Optimize for Target Size

```typescript
// Automatically adjust quality to meet size target
const optimized = await converter.optimizeForSize(
  largeImage,
  500000 // 500 KB target
);

console.log(`Final size: ${optimized.webpSize} bytes at ${optimized.quality}% quality`);
```

## Cleanup and Maintenance

### Automated Cleanup

```typescript
import { StorageCleanupService, CleanupScheduler } from './storage/optimization/cleanup';

const cleanup = new StorageCleanupService(supabase);

// Run cleanup for a specific bucket
const report = await cleanup.cleanupBucket(
  'pdf-thumbnails',
  'age',
  30, // 30 days old
  'delete'
);

console.log(`Cleaned up ${report.filesDeleted} files`);
console.log(`Freed ${report.bytesFreed} bytes`);
```

### Find Orphaned Files

```typescript
// Detect files with no database references
const orphaned = await cleanup.findOrphanedFiles('pdf-images');

console.log(`Found ${orphaned.length} orphaned files`);

// Delete orphaned files
const result = await cleanup.deleteOrphanedFiles(orphaned);
console.log(`Deleted ${result.deleted} orphaned files`);
```

### Schedule Automated Cleanup

```typescript
const scheduler = new CleanupScheduler(supabase);

// Start daily cleanup at 2 AM
scheduler.start();

// Run cleanup immediately
const reports = await scheduler.runNow();
```

## Security Features

### Row-Level Security (RLS)

All buckets have RLS policies enforcing:
- **Authentication requirements** for uploads
- **Role-based access control** (teacher, admin, student)
- **Ownership verification** for modifications
- **Audit logging** for all operations

### Storage Quotas

```typescript
// Quotas are automatically enforced via database triggers
// Default: 1GB per user
// Teachers: 10GB
// Schools: 100GB
```

### Access Logging

All file access is automatically logged for:
- Compliance auditing
- Usage analytics
- Security monitoring
- COPPA compliance

## Performance Optimization

### Upload Performance

- Multipart uploads for large files
- Progress tracking and cancellation
- Automatic retry on failure
- Parallel batch uploads

### Download Performance

- CDN delivery with edge caching
- Responsive image variants
- WebP format for 60%+ size reduction
- Resume support for large files

### Storage Efficiency

- Automatic image optimization
- Lifecycle transitions to cold storage
- Deduplication (planned)
- Compression for backups

## Database Schema

Execute the SQL files to set up required tables:

```bash
# Storage policies and RLS
psql -f src/storage/policies/rls.sql

# Lifecycle management
# (Included in lifecycle.ts)

# Backup system
# (Included in backup.ts)

# COPPA compliance
# (Included in coppa-compliance.ts)
```

## Environment Variables

Required environment variables:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# CDN
VITE_CDN_BASE_URL=https://cdn.yourproject.com
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-api-token

# Backup
BACKUP_DESTINATION=s3
S3_BUCKET=your-backup-bucket
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

## Monitoring and Alerts

### Storage Metrics

```typescript
import { getConfigurationSummary } from './storage/config';

const summary = getConfigurationSummary();

console.log(`Buckets: ${summary.buckets}`);
console.log(`Policies: ${summary.policies}`);
console.log(`Total storage limit: ${summary.totalStorageLimit} bytes`);
```

### CDN Analytics

```typescript
const analytics = await cdn.getAnalytics('30d');

console.log(`Requests: ${analytics.requests}`);
console.log(`Bandwidth: ${analytics.bandwidth} bytes`);
console.log(`Cache hit rate: ${analytics.cacheHitRate}%`);
console.log(`Errors: ${analytics.errors}`);
```

## Best Practices

1. **Always use CDN URLs** for public assets
2. **Enable WebP conversion** for all images
3. **Implement progress tracking** for large uploads
4. **Use batch operations** for multiple files
5. **Monitor storage quotas** regularly
6. **Run compliance audits** monthly
7. **Test backup restoration** quarterly
8. **Review access logs** for security
9. **Clean up orphaned files** weekly
10. **Update lifecycle policies** as needed

## Troubleshooting

### Upload Failures

```typescript
// Check bucket configuration
const config = STORAGE_BUCKETS.PDF_ORIGINALS;
console.log('Max file size:', config.fileSizeLimit);
console.log('Allowed types:', config.allowedMimeTypes);

// Verify user has permission
const { granted } = await coppa.verifyParentalConsent(studentId);
```

### CDN Issues

```typescript
// Test CDN configuration
const test = await cdn.testConfiguration();

if (!test.connected) {
  console.error('CDN connection failed:', test.errors);
}

if (!test.cacheWorking) {
  console.warn('Cache not functioning properly');
}
```

### Performance Issues

```typescript
// Get storage statistics
const stats = await cleanup.getStorageStats('pdf-images');

console.log(`Total files: ${stats.totalFiles}`);
console.log(`Total size: ${stats.totalSize} bytes`);
console.log(`Oldest file: ${stats.oldestFile}`);
```

## Support and Documentation

- **Supabase Storage Docs**: https://supabase.com/docs/guides/storage
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **COPPA Compliance**: https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule

## License

This storage system is part of the K5 POC project and follows the same license terms.
