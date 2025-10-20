/**
 * Supabase Storage Configuration
 *
 * Defines bucket structure, policies, CDN settings, and optimization strategies
 * for the K5 PDF parsing and assessment system.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// ===========================
// Bucket Definitions
// ===========================

export interface BucketConfig {
  name: string;
  public: boolean;
  allowedMimeTypes: string[];
  fileSizeLimit: number; // in bytes
  versioning?: boolean;
  ttl?: number; // Time to live in seconds
  description: string;
}

export const STORAGE_BUCKETS: Record<string, BucketConfig> = {
  PDF_ORIGINALS: {
    name: 'pdf-originals',
    public: false,
    allowedMimeTypes: ['application/pdf'],
    fileSizeLimit: 100 * 1024 * 1024, // 100MB
    versioning: true,
    description: 'Original PDF files with versioning enabled',
  },
  PDF_IMAGES: {
    name: 'pdf-images',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    description: 'Extracted and optimized images from PDFs',
  },
  PDF_THUMBNAILS: {
    name: 'pdf-thumbnails',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
    ttl: 7 * 24 * 60 * 60, // 7 days
    description: 'Quick preview thumbnails for PDFs',
  },
  PDF_PROCESSED: {
    name: 'pdf-processed',
    public: true,
    allowedMimeTypes: ['application/pdf', 'application/json'],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    description: 'Processed PDF outputs and metadata',
  },
  ASSESSMENT_ASSETS: {
    name: 'assessment-assets',
    public: true,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
    ],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    description: 'Assessment-related media (images, audio, video)',
  },
};

// ===========================
// Storage Policies
// ===========================

export interface StoragePolicy {
  name: string;
  bucket: string;
  definition: string;
  roles: string[];
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
}

export const STORAGE_POLICIES: StoragePolicy[] = [
  // PDF Originals - Teacher Upload, Admin Delete
  {
    name: 'pdf_originals_upload_teachers',
    bucket: 'pdf-originals',
    definition: `(
      auth.role() = 'authenticated' AND
      (auth.jwt()->>'role')::text IN ('teacher', 'admin')
    )`,
    roles: ['authenticated'],
    operation: 'INSERT',
  },
  {
    name: 'pdf_originals_read_authenticated',
    bucket: 'pdf-originals',
    definition: `(
      auth.role() = 'authenticated'
    )`,
    roles: ['authenticated'],
    operation: 'SELECT',
  },
  {
    name: 'pdf_originals_delete_admin',
    bucket: 'pdf-originals',
    definition: `(
      auth.role() = 'authenticated' AND
      (auth.jwt()->>'role')::text = 'admin'
    )`,
    roles: ['authenticated'],
    operation: 'DELETE',
  },

  // PDF Images - Public Read, Authenticated Upload
  {
    name: 'pdf_images_read_public',
    bucket: 'pdf-images',
    definition: 'true',
    roles: ['anon', 'authenticated'],
    operation: 'SELECT',
  },
  {
    name: 'pdf_images_upload_authenticated',
    bucket: 'pdf-images',
    definition: 'auth.role() = \'authenticated\'',
    roles: ['authenticated'],
    operation: 'INSERT',
  },

  // PDF Thumbnails - Public Read, System Upload
  {
    name: 'pdf_thumbnails_read_public',
    bucket: 'pdf-thumbnails',
    definition: 'true',
    roles: ['anon', 'authenticated'],
    operation: 'SELECT',
  },
  {
    name: 'pdf_thumbnails_upload_system',
    bucket: 'pdf-thumbnails',
    definition: 'auth.role() = \'authenticated\'',
    roles: ['authenticated'],
    operation: 'INSERT',
  },

  // PDF Processed - Public Read, Teacher Upload
  {
    name: 'pdf_processed_read_public',
    bucket: 'pdf-processed',
    definition: 'true',
    roles: ['anon', 'authenticated'],
    operation: 'SELECT',
  },
  {
    name: 'pdf_processed_upload_teachers',
    bucket: 'pdf-processed',
    definition: `(
      auth.role() = 'authenticated' AND
      (auth.jwt()->>'role')::text IN ('teacher', 'admin')
    )`,
    roles: ['authenticated'],
    operation: 'INSERT',
  },

  // Assessment Assets - Public Read, Teacher Upload
  {
    name: 'assessment_assets_read_public',
    bucket: 'assessment-assets',
    definition: 'true',
    roles: ['anon', 'authenticated'],
    operation: 'SELECT',
  },
  {
    name: 'assessment_assets_upload_teachers',
    bucket: 'assessment-assets',
    definition: `(
      auth.role() = 'authenticated' AND
      (auth.jwt()->>'role')::text IN ('teacher', 'admin')
    )`,
    roles: ['authenticated'],
    operation: 'INSERT',
  },
  {
    name: 'assessment_assets_delete_admin',
    bucket: 'assessment-assets',
    definition: `(
      auth.role() = 'authenticated' AND
      (auth.jwt()->>'role')::text = 'admin'
    )`,
    roles: ['authenticated'],
    operation: 'DELETE',
  },
];

// ===========================
// CDN Configuration
// ===========================

export interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'custom';
  baseUrl?: string;
  cachingRules: CachingRule[];
  invalidationStrategy: 'immediate' | 'scheduled' | 'on-demand';
}

export interface CachingRule {
  pattern: string;
  duration: number; // in seconds
  description: string;
}

export const CDN_CONFIG: CDNConfig = {
  enabled: true,
  provider: 'cloudflare',
  baseUrl: process.env.CDN_BASE_URL,
  cachingRules: [
    {
      pattern: '/pdf-originals/**',
      duration: 3600, // 1 hour
      description: 'Original PDFs - moderate caching',
    },
    {
      pattern: '/pdf-images/**',
      duration: 7 * 24 * 3600, // 7 days
      description: 'Extracted images - long-term caching',
    },
    {
      pattern: '/pdf-thumbnails/**',
      duration: 7 * 24 * 3600, // 7 days
      description: 'Thumbnails - long-term caching',
    },
    {
      pattern: '/pdf-processed/**',
      duration: 24 * 3600, // 1 day
      description: 'Processed PDFs - daily refresh',
    },
    {
      pattern: '/assessment-assets/**',
      duration: 7 * 24 * 3600, // 7 days
      description: 'Assessment media - long-term caching',
    },
  ],
  invalidationStrategy: 'on-demand',
};

// ===========================
// Storage Optimization
// ===========================

export interface CompressionConfig {
  enabled: boolean;
  quality: number; // 0-100
  format?: 'jpeg' | 'webp' | 'png';
}

export interface OptimizationConfig {
  images: {
    maxWidth: number;
    maxHeight: number;
    compression: CompressionConfig;
    generateWebP: boolean;
  };
  pdfs: {
    compress: boolean;
    removeMetadata: boolean;
    optimizeImages: boolean;
  };
  thumbnails: {
    width: number;
    height: number;
    quality: number;
  };
}

export const OPTIMIZATION_CONFIG: OptimizationConfig = {
  images: {
    maxWidth: 2048,
    maxHeight: 2048,
    compression: {
      enabled: true,
      quality: 85,
      format: 'webp',
    },
    generateWebP: true,
  },
  pdfs: {
    compress: true,
    removeMetadata: false, // Keep metadata for versioning
    optimizeImages: true,
  },
  thumbnails: {
    width: 300,
    height: 400,
    quality: 80,
  },
};

// ===========================
// Archival Policies
// ===========================

export interface ArchivalPolicy {
  bucket: string;
  daysUntilArchive: number;
  archiveLocation: string;
  deleteAfterArchive: boolean;
}

export const ARCHIVAL_POLICIES: ArchivalPolicy[] = [
  {
    bucket: 'pdf-originals',
    daysUntilArchive: 365, // 1 year
    archiveLocation: 'cold-storage',
    deleteAfterArchive: false,
  },
  {
    bucket: 'pdf-thumbnails',
    daysUntilArchive: 30, // 30 days
    archiveLocation: 'temp-cleanup',
    deleteAfterArchive: true,
  },
  {
    bucket: 'pdf-processed',
    daysUntilArchive: 180, // 6 months
    archiveLocation: 'cold-storage',
    deleteAfterArchive: false,
  },
];

// ===========================
// Cleanup Configuration
// ===========================

export interface CleanupConfig {
  enabled: boolean;
  schedule: string; // Cron expression
  rules: CleanupRule[];
}

export interface CleanupRule {
  bucket: string;
  condition: 'age' | 'size' | 'orphaned';
  threshold: number; // days for age, bytes for size
  action: 'delete' | 'archive';
}

export const CLEANUP_CONFIG: CleanupConfig = {
  enabled: true,
  schedule: '0 2 * * *', // 2 AM daily
  rules: [
    {
      bucket: 'pdf-thumbnails',
      condition: 'age',
      threshold: 30, // 30 days
      action: 'delete',
    },
    {
      bucket: 'pdf-images',
      condition: 'orphaned',
      threshold: 7, // 7 days
      action: 'delete',
    },
    {
      bucket: 'pdf-processed',
      condition: 'age',
      threshold: 180, // 6 months
      action: 'archive',
    },
  ],
};

// ===========================
// Storage Initialization
// ===========================

export async function initializeStorageBuckets(
  supabase: SupabaseClient
): Promise<void> {
  console.log('Initializing storage buckets...');

  for (const [key, config] of Object.entries(STORAGE_BUCKETS)) {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === config.name);

      if (!bucketExists) {
        // Create bucket
        const { data, error } = await supabase.storage.createBucket(
          config.name,
          {
            public: config.public,
            fileSizeLimit: config.fileSizeLimit,
            allowedMimeTypes: config.allowedMimeTypes,
          }
        );

        if (error) {
          console.error(`Failed to create bucket ${config.name}:`, error);
        } else {
          console.log(`✓ Created bucket: ${config.name}`);
        }
      } else {
        console.log(`✓ Bucket already exists: ${config.name}`);
      }
    } catch (error) {
      console.error(`Error initializing bucket ${config.name}:`, error);
    }
  }
}

// ===========================
// Policy SQL Generation
// ===========================

export function generatePolicySQL(): string {
  let sql = '-- Storage Policies for K5 PDF System\n\n';

  for (const policy of STORAGE_POLICIES) {
    sql += `-- ${policy.name}\n`;
    sql += `CREATE POLICY "${policy.name}"\n`;
    sql += `ON storage.objects\n`;
    sql += `FOR ${policy.operation}\n`;
    sql += `TO ${policy.roles.join(', ')}\n`;
    sql += `USING (\n`;
    sql += `  bucket_id = '${policy.bucket}' AND\n`;
    sql += `  ${policy.definition}\n`;
    sql += `);\n\n`;
  }

  return sql;
}

// ===========================
// Configuration Validation
// ===========================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateStorageConfig(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate bucket configurations
  for (const [key, config] of Object.entries(STORAGE_BUCKETS)) {
    if (config.fileSizeLimit <= 0) {
      errors.push(`${key}: File size limit must be positive`);
    }

    if (config.allowedMimeTypes.length === 0) {
      warnings.push(`${key}: No MIME types specified`);
    }

    if (config.public && config.versioning) {
      warnings.push(
        `${key}: Public bucket with versioning may increase costs`
      );
    }
  }

  // Validate CDN configuration
  if (CDN_CONFIG.enabled && !CDN_CONFIG.baseUrl) {
    warnings.push('CDN enabled but no base URL configured');
  }

  // Validate optimization settings
  if (
    OPTIMIZATION_CONFIG.images.compression.quality < 0 ||
    OPTIMIZATION_CONFIG.images.compression.quality > 100
  ) {
    errors.push('Image compression quality must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ===========================
// Export Configuration Summary
// ===========================

export function getConfigurationSummary() {
  return {
    buckets: Object.keys(STORAGE_BUCKETS).length,
    policies: STORAGE_POLICIES.length,
    cachingRules: CDN_CONFIG.cachingRules.length,
    archivalPolicies: ARCHIVAL_POLICIES.length,
    cleanupRules: CLEANUP_CONFIG.rules.length,
    totalStorageLimit: Object.values(STORAGE_BUCKETS).reduce(
      (sum, bucket) => sum + bucket.fileSizeLimit,
      0
    ),
    validation: validateStorageConfig(),
  };
}
