# K5 Storage System - Quick Start Guide

## 5-Minute Setup

### Step 1: Apply Database Migration (1 min)

```bash
# Connect to your Supabase database
psql -h db.your-project.supabase.co -U postgres -d postgres \
  -f src/storage/migrations/001_storage_system.sql
```

Or use Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `src/storage/migrations/001_storage_system.sql`
3. Run the migration

### Step 2: Create Storage Buckets (1 min)

```typescript
import { supabase } from '@/lib/supabase';
import { initializeStorageBuckets } from '@/storage/config';

// Run once during deployment
await initializeStorageBuckets(supabase);
```

### Step 3: Configure Environment Variables (1 min)

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# CDN (Optional but recommended)
VITE_CDN_BASE_URL=https://cdn.yourproject.com
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-cloudflare-token
```

### Step 4: Import and Use (2 min)

```typescript
import {
  StorageUploader,
  StorageDownloader,
  WebPConverter,
  COPPAComplianceService,
  LifecyclePolicyManager,
} from '@/storage';

// Ready to use!
const uploader = new StorageUploader(supabase);
```

## Common Tasks

### Upload a PDF

```typescript
import { StorageUploader } from '@/storage';

const uploader = new StorageUploader(supabase);

const result = await uploader.upload({
  bucket: 'pdf-originals',
  path: `reading-passages/spanish/k/${fileName}`,
  file: pdfFile,
  onProgress: (progress) => {
    console.log(`Upload: ${progress.percentage}%`);
    console.log(`Speed: ${progress.bytesPerSecond} bytes/sec`);
    console.log(`ETA: ${progress.estimatedTimeRemaining}ms`);
  },
});

if (result.success) {
  console.log('✅ Uploaded:', result.url);
  console.log('🚀 CDN URL:', result.cdnUrl);
} else {
  console.error('❌ Upload failed:', result.error);
}
```

### Upload Images with Optimization

```typescript
import { StorageUploader, WebPConverter } from '@/storage';

const converter = new WebPConverter();
const uploader = new StorageUploader(supabase);

// Convert to WebP first
const webpResult = await converter.convertToWebP(imageFile, {
  quality: 85,
  generateResponsive: true,
  responsiveSizes: [320, 640, 1024, 1920],
});

// Upload optimized image
const uploadResult = await uploader.upload({
  bucket: 'pdf-images',
  path: `extracted/${docId}/image.webp`,
  file: webpResult.blob,
});

// Upload responsive variants
if (webpResult.responsiveImages) {
  for (const responsive of webpResult.responsiveImages) {
    await uploader.upload({
      bucket: 'pdf-images',
      path: `extracted/${docId}/image-${responsive.width}w.webp`,
      file: responsive.blob,
    });
  }
}

console.log(`Saved ${webpResult.compressionRatio}% with WebP!`);
```

### Batch Upload Multiple Files

```typescript
const results = await uploader.uploadBatch([
  {
    bucket: 'pdf-images',
    path: 'page-1.webp',
    file: image1,
  },
  {
    bucket: 'pdf-images',
    path: 'page-2.webp',
    file: image2,
  },
  {
    bucket: 'pdf-images',
    path: 'page-3.webp',
    file: image3,
  },
]);

console.log(`✅ Uploaded ${results.successful}/${results.total} files`);
console.log(`❌ Failed: ${results.failed}`);
```

### Download a File

```typescript
import { StorageDownloader } from '@/storage';

const downloader = new StorageDownloader(supabase);

const result = await downloader.download({
  bucket: 'pdf-originals',
  path: 'document.pdf',
  onProgress: (progress) => {
    console.log(`Download: ${progress.percentage}%`);
  },
});

if (result.success && result.data) {
  // Create download link
  const url = URL.createObjectURL(result.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
```

### Verify COPPA Compliance

```typescript
import { COPPAComplianceService } from '@/storage';

const coppa = new COPPAComplianceService(supabase);

// Before accessing student data
const { required, granted, consent } = await coppa.verifyParentalConsent(
  studentId
);

if (required && !granted) {
  throw new Error('Parental consent required for student under 13');
}

// Log the access
await coppa.logStudentDataAccess({
  studentId,
  accessedBy: teacherId,
  accessType: 'view',
  bucket: 'assessment-assets',
  path: 'student-work.pdf',
  purpose: 'Grading assessment',
  timestamp: new Date(),
  ipAddress: req.ip,
});
```

### Grant Parental Consent

```typescript
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
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

### Run Backup

```typescript
import { StorageBackupService } from '@/storage';

const backup = new StorageBackupService(supabase);

// Full backup
const result = await backup.createFullBackup('pdf-originals', {
  compress: true,
  encrypt: true,
  destination: 's3',
});

console.log(`Backup ID: ${result.id}`);
console.log(`Files backed up: ${result.fileCount}`);
console.log(`Size: ${result.size} bytes`);
```

### Restore from Backup

```typescript
const restoreResult = await backup.restore({
  backupId: 'backup-xyz-123',
  targetBucket: 'pdf-originals',
  overwrite: false,
  validate: true,
});

console.log(`Restored ${restoreResult.filesRestored} files`);
console.log(`Size: ${restoreResult.bytesRestored} bytes`);
console.log(`Duration: ${restoreResult.duration}ms`);
```

### Configure CDN

```typescript
import { CloudflareCDNManager } from '@/storage';

const cdn = new CloudflareCDNManager({
  zoneId: process.env.CLOUDFLARE_ZONE_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  baseUrl: process.env.VITE_CDN_BASE_URL,
});

// Purge cache after file update
await cdn.purgeFiles('pdf-images', ['path/to/updated-image.webp']);

// Get analytics
const analytics = await cdn.getAnalytics('7d');
console.log(`Cache hit rate: ${analytics.cacheHitRate}%`);
console.log(`Bandwidth: ${analytics.bandwidth} bytes`);
```

### Run Cleanup

```typescript
import { StorageCleanupService } from '@/storage';

const cleanup = new StorageCleanupService(supabase);

// Clean up old thumbnails
const report = await cleanup.cleanupTemporaryFiles(30); // 30 days

console.log(`Cleaned ${report.filesDeleted} files`);
console.log(`Freed ${report.bytesFreed} bytes`);

// Find orphaned files
const orphaned = await cleanup.findOrphanedFiles('pdf-images');
console.log(`Found ${orphaned.length} orphaned files`);

// Delete them
const result = await cleanup.deleteOrphanedFiles(orphaned);
console.log(`Deleted ${result.deleted} orphaned files`);
```

### Apply Lifecycle Policies

```typescript
import { LifecyclePolicyManager } from '@/storage';

const lifecycle = new LifecyclePolicyManager(supabase);

// Get default policies
const rules = lifecycle.getDefaultLifecycleRules();

// Apply to bucket
await lifecycle.applyLifecycleRules('pdf-images', rules);

// Execute transitions
const result = await lifecycle.executeLifecycleTransitions('pdf-processed');

console.log(`Transitioned: ${result.transitioned} files`);
console.log(`Deleted: ${result.deleted} files`);
```

## React Component Examples

### File Upload Component

```tsx
import { useState } from 'react';
import { StorageUploader } from '@/storage';
import { supabase } from '@/lib/supabase';

export function FileUploadComponent() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);

    const uploader = new StorageUploader(supabase);

    const result = await uploader.upload({
      bucket: 'pdf-originals',
      path: `uploads/${Date.now()}-${file.name}`,
      file,
      onProgress: (p) => setProgress(p.percentage),
    });

    setUploading(false);

    if (result.success) {
      alert('Upload successful!');
    } else {
      alert(`Upload failed: ${result.error?.message}`);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max={100} />}
    </div>
  );
}
```

### Image Gallery with WebP

```tsx
import { useEffect, useState } from 'react';
import { StorageDownloader } from '@/storage';
import { supabase } from '@/lib/supabase';

export function ImageGallery({ documentId }: { documentId: string }) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      // List images for this document
      const { data } = await supabase.storage
        .from('pdf-images')
        .list(`extracted/${documentId}`);

      if (data) {
        const urls = data.map((file) =>
          supabase.storage
            .from('pdf-images')
            .getPublicUrl(`extracted/${documentId}/${file.name}`).data.publicUrl
        );
        setImages(urls);
      }
    };

    loadImages();
  }, [documentId]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Page ${i + 1}`}
          loading="lazy"
          className="w-full h-auto"
        />
      ))}
    </div>
  );
}
```

### Parental Consent Form

```tsx
import { useState } from 'react';
import { COPPAComplianceService } from '@/storage';
import { supabase } from '@/lib/supabase';

export function ParentalConsentForm({
  studentId,
  parentId,
}: {
  studentId: string;
  parentId: string;
}) {
  const [permissions, setPermissions] = useState({
    allowDataCollection: true,
    allowImageStorage: true,
    allowVoiceRecording: false,
    allowProgressTracking: true,
    allowAssessmentResults: true,
    allowContentSharing: false,
  });

  const handleSubmit = async () => {
    const coppa = new COPPAComplianceService(supabase);

    const result = await coppa.grantParentalConsent({
      studentId,
      parentId,
      consentType: 'full',
      permissions,
      verificationMethod: 'email',
      ipAddress: await fetch('https://api.ipify.org?format=json')
        .then((r) => r.json())
        .then((d) => d.ip),
      userAgent: navigator.userAgent,
    });

    if (result.success) {
      alert('Consent granted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Parental Consent Form</h2>

      <label>
        <input
          type="checkbox"
          checked={permissions.allowDataCollection}
          onChange={(e) =>
            setPermissions({ ...permissions, allowDataCollection: e.target.checked })
          }
        />
        Allow data collection for educational purposes
      </label>

      <label>
        <input
          type="checkbox"
          checked={permissions.allowImageStorage}
          onChange={(e) =>
            setPermissions({ ...permissions, allowImageStorage: e.target.checked })
          }
        />
        Allow storage of student work images
      </label>

      {/* Add more checkboxes for other permissions */}

      <button type="submit">Grant Consent</button>
    </form>
  );
}
```

## Troubleshooting

### Upload Fails with "Quota Exceeded"

```typescript
// Check current quota
const { data: quota } = await supabase
  .from('storage.quotas')
  .select('*')
  .eq('user_id', userId)
  .single();

console.log(`Used: ${quota.used_bytes} / ${quota.quota_bytes}`);

// Increase quota (admin only)
await supabase
  .from('storage.quotas')
  .update({ quota_bytes: 10 * 1024 * 1024 * 1024 }) // 10GB
  .eq('user_id', userId);
```

### CDN Not Working

```typescript
const cdn = new CloudflareCDNManager(config);

// Test configuration
const test = await cdn.testConfiguration();

if (!test.connected) {
  console.error('CDN connection failed:', test.errors);
}

if (!test.cacheWorking) {
  console.warn('Cache headers missing - check zone settings');
}
```

### Parental Consent Not Found

```typescript
const { required, granted } = await coppa.verifyParentalConsent(studentId);

if (required && !granted) {
  // Redirect to consent form
  router.push(`/consent?student=${studentId}`);
}
```

## Production Checklist

- [ ] SQL migration applied
- [ ] Storage buckets created
- [ ] Environment variables configured
- [ ] CDN integration tested
- [ ] Backup system scheduled
- [ ] Cleanup scheduler running
- [ ] COPPA compliance verified
- [ ] Lifecycle policies active
- [ ] Access logging enabled
- [ ] Monitoring dashboard set up

## Next Steps

1. **Test uploads**: Upload sample PDFs and images
2. **Verify CDN**: Check cache hit rates
3. **Run audit**: Execute COPPA compliance audit
4. **Schedule backups**: Set up automated daily backups
5. **Monitor usage**: Review storage and bandwidth metrics

## Support

- Full documentation: `/src/storage/README.md`
- Implementation summary: `/src/storage/IMPLEMENTATION_SUMMARY.md`
- Code examples: Throughout source files
