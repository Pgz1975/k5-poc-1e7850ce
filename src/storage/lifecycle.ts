/**
 * Storage Lifecycle Management
 *
 * Manages bucket lifecycle policies, versioning, and transition rules
 * for optimal storage cost and performance.
 */

import { SupabaseClient } from '@supabase/supabase-js';

// ===========================
// Type Definitions
// ===========================

export interface LifecycleRule {
  id: string;
  bucket: string;
  enabled: boolean;
  filter?: {
    prefix?: string;
    tags?: Record<string, string>;
  };
  transitions?: LifecycleTransition[];
  expiration?: LifecycleExpiration;
  noncurrentVersionExpiration?: {
    noncurrentDays: number;
  };
}

export interface LifecycleTransition {
  days: number;
  storageClass: 'STANDARD' | 'INFREQUENT_ACCESS' | 'GLACIER' | 'DEEP_ARCHIVE';
}

export interface LifecycleExpiration {
  days?: number;
  expiredObjectDeleteMarker?: boolean;
}

export interface BucketVersioning {
  bucket: string;
  enabled: boolean;
  mfaDelete?: boolean;
}

export interface StorageTier {
  name: string;
  description: string;
  costPerGB: number;
  retrievalCost: number;
  minimumStorageDays: number;
}

// ===========================
// Lifecycle Policy Manager
// ===========================

export class LifecyclePolicyManager {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Default lifecycle rules for K5 storage buckets
   */
  getDefaultLifecycleRules(): LifecycleRule[] {
    return [
      // PDF Originals: Keep forever with versioning
      {
        id: 'pdf-originals-retention',
        bucket: 'pdf-originals',
        enabled: true,
        noncurrentVersionExpiration: {
          noncurrentDays: 90, // Delete old versions after 90 days
        },
      },

      // PDF Images: Transition to infrequent access after 30 days
      {
        id: 'pdf-images-transition',
        bucket: 'pdf-images',
        enabled: true,
        transitions: [
          {
            days: 30,
            storageClass: 'INFREQUENT_ACCESS',
          },
          {
            days: 90,
            storageClass: 'GLACIER',
          },
        ],
      },

      // Thumbnails: Delete after 30 days (regenerable)
      {
        id: 'thumbnails-cleanup',
        bucket: 'pdf-thumbnails',
        enabled: true,
        expiration: {
          days: 30,
        },
      },

      // Processed PDFs: Archive after 180 days
      {
        id: 'processed-archive',
        bucket: 'pdf-processed',
        enabled: true,
        transitions: [
          {
            days: 180,
            storageClass: 'GLACIER',
          },
        ],
      },

      // Assessment Assets: Keep in standard for 60 days
      {
        id: 'assessment-assets-transition',
        bucket: 'assessment-assets',
        enabled: true,
        transitions: [
          {
            days: 60,
            storageClass: 'INFREQUENT_ACCESS',
          },
        ],
      },

      // Temporary uploads: Delete after 7 days
      {
        id: 'temp-uploads-cleanup',
        bucket: 'user-uploads',
        enabled: true,
        filter: {
          prefix: 'temp/',
        },
        expiration: {
          days: 7,
        },
      },
    ];
  }

  /**
   * Apply lifecycle rules to a bucket
   */
  async applyLifecycleRules(
    bucket: string,
    rules: LifecycleRule[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Supabase doesn't directly support lifecycle policies
      // Store policies in database for application-level enforcement
      const { error } = await this.supabase.from('storage_lifecycle_policies').upsert(
        rules.map((rule) => ({
          bucket,
          rule_id: rule.id,
          enabled: rule.enabled,
          config: rule,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'bucket,rule_id' }
      );

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get active lifecycle rules for a bucket
   */
  async getLifecycleRules(bucket: string): Promise<LifecycleRule[]> {
    try {
      const { data, error } = await this.supabase
        .from('storage_lifecycle_policies')
        .select('*')
        .eq('bucket', bucket)
        .eq('enabled', true);

      if (error) throw error;

      return data?.map((row) => row.config as LifecycleRule) || [];
    } catch (error) {
      console.error('Failed to get lifecycle rules:', error);
      return [];
    }
  }

  /**
   * Enable versioning for a bucket
   */
  async enableVersioning(bucket: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Store versioning config in database
      const { error } = await this.supabase.from('bucket_configs').upsert({
        bucket,
        versioning_enabled: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get storage tier recommendations based on access patterns
   */
  async getStorageTierRecommendations(
    bucket: string
  ): Promise<
    Array<{
      path: string;
      currentTier: string;
      recommendedTier: string;
      savings: number;
      reason: string;
    }>
  > {
    const recommendations: Array<{
      path: string;
      currentTier: string;
      recommendedTier: string;
      savings: number;
      reason: string;
    }> = [];

    try {
      // Get files and their access patterns
      const { data: files, error } = await this.supabase.storage.from(bucket).list();

      if (error || !files) return recommendations;

      for (const file of files) {
        const created = new Date(file.created_at);
        const ageDays = Math.floor(
          (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Get access count (would need tracking)
        const accessCount = await this.getFileAccessCount(bucket, file.name);

        // Make recommendations based on age and access
        if (ageDays > 90 && accessCount < 5) {
          recommendations.push({
            path: file.name,
            currentTier: 'STANDARD',
            recommendedTier: 'GLACIER',
            savings: this.calculateSavings('STANDARD', 'GLACIER', file.metadata?.size || 0),
            reason: `File is ${ageDays} days old with only ${accessCount} accesses`,
          });
        } else if (ageDays > 30 && accessCount < 20) {
          recommendations.push({
            path: file.name,
            currentTier: 'STANDARD',
            recommendedTier: 'INFREQUENT_ACCESS',
            savings: this.calculateSavings(
              'STANDARD',
              'INFREQUENT_ACCESS',
              file.metadata?.size || 0
            ),
            reason: `Moderate age (${ageDays} days) with low access (${accessCount} times)`,
          });
        }
      }
    } catch (error) {
      console.error('Error generating tier recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Execute lifecycle transitions for files meeting criteria
   */
  async executeLifecycleTransitions(bucket: string): Promise<{
    transitioned: number;
    deleted: number;
    errors: string[];
  }> {
    const result = {
      transitioned: 0,
      deleted: 0,
      errors: [] as string[],
    };

    try {
      const rules = await this.getLifecycleRules(bucket);

      for (const rule of rules) {
        if (!rule.enabled) continue;

        // Get files matching rule filter
        const files = await this.getFilesMatchingFilter(bucket, rule.filter);

        for (const file of files) {
          try {
            // Check expiration
            if (rule.expiration) {
              const shouldDelete = await this.shouldExpireFile(file, rule.expiration);

              if (shouldDelete) {
                await this.deleteFile(bucket, file.name);
                result.deleted++;
                continue;
              }
            }

            // Check transitions
            if (rule.transitions) {
              const transition = await this.getApplicableTransition(file, rule.transitions);

              if (transition) {
                await this.transitionFile(bucket, file.name, transition.storageClass);
                result.transitioned++;
              }
            }
          } catch (error) {
            result.errors.push(
              `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      }
    } catch (error) {
      result.errors.push(
        `Lifecycle execution error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return result;
  }

  // ===========================
  // Private Helper Methods
  // ===========================

  private async getFileAccessCount(bucket: string, path: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('storage_access_log')
        .select('*', { count: 'exact', head: true })
        .eq('bucket', bucket)
        .eq('path', path)
        .gte('accessed_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  private calculateSavings(
    fromTier: string,
    toTier: string,
    sizeBytes: number
  ): number {
    const tiers: Record<string, number> = {
      STANDARD: 0.023,
      INFREQUENT_ACCESS: 0.0125,
      GLACIER: 0.004,
      DEEP_ARCHIVE: 0.00099,
    };

    const sizeGB = sizeBytes / (1024 * 1024 * 1024);
    const fromCost = (tiers[fromTier] || 0) * sizeGB;
    const toCost = (tiers[toTier] || 0) * sizeGB;

    return Math.max(0, fromCost - toCost);
  }

  private async getFilesMatchingFilter(
    bucket: string,
    filter?: { prefix?: string; tags?: Record<string, string> }
  ): Promise<any[]> {
    try {
      const { data: files, error } = await this.supabase.storage.from(bucket).list();

      if (error || !files) return [];

      if (!filter) return files;

      return files.filter((file) => {
        if (filter.prefix && !file.name.startsWith(filter.prefix)) {
          return false;
        }
        // Add tag filtering if needed
        return true;
      });
    } catch (error) {
      console.error('Error getting files:', error);
      return [];
    }
  }

  private async shouldExpireFile(
    file: any,
    expiration: LifecycleExpiration
  ): Promise<boolean> {
    if (!expiration.days) return false;

    const created = new Date(file.created_at);
    const ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

    return ageDays >= expiration.days;
  }

  private async getApplicableTransition(
    file: any,
    transitions: LifecycleTransition[]
  ): Promise<LifecycleTransition | null> {
    const created = new Date(file.created_at);
    const ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

    // Find the most appropriate transition
    const applicable = transitions.filter((t) => ageDays >= t.days).sort((a, b) => b.days - a.days);

    return applicable[0] || null;
  }

  private async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    // Log deletion
    await this.logLifecycleAction(bucket, path, 'DELETE', 'Lifecycle expiration');
  }

  private async transitionFile(
    bucket: string,
    path: string,
    storageClass: string
  ): Promise<void> {
    // Store transition metadata
    await this.supabase.from('storage_metadata').upsert({
      bucket,
      path,
      storage_class: storageClass,
      transitioned_at: new Date().toISOString(),
    });

    // Log transition
    await this.logLifecycleAction(
      bucket,
      path,
      'TRANSITION',
      `Transitioned to ${storageClass}`
    );
  }

  private async logLifecycleAction(
    bucket: string,
    path: string,
    action: string,
    details: string
  ): Promise<void> {
    try {
      await this.supabase.from('storage_lifecycle_log').insert({
        bucket,
        path,
        action,
        details,
        executed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log lifecycle action:', error);
    }
  }
}

// ===========================
// Storage Tier Definitions
// ===========================

export const STORAGE_TIERS: StorageTier[] = [
  {
    name: 'STANDARD',
    description: 'Frequently accessed data',
    costPerGB: 0.023,
    retrievalCost: 0,
    minimumStorageDays: 0,
  },
  {
    name: 'INFREQUENT_ACCESS',
    description: 'Data accessed less than once a month',
    costPerGB: 0.0125,
    retrievalCost: 0.01,
    minimumStorageDays: 30,
  },
  {
    name: 'GLACIER',
    description: 'Long-term archival, retrieval in minutes to hours',
    costPerGB: 0.004,
    retrievalCost: 0.03,
    minimumStorageDays: 90,
  },
  {
    name: 'DEEP_ARCHIVE',
    description: 'Lowest cost archival, retrieval in 12-48 hours',
    costPerGB: 0.00099,
    retrievalCost: 0.05,
    minimumStorageDays: 180,
  },
];

// ===========================
// Lifecycle Management SQL
// ===========================

export const LIFECYCLE_MANAGEMENT_SQL = `
-- Storage lifecycle policies table
CREATE TABLE IF NOT EXISTS storage_lifecycle_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bucket, rule_id)
);

-- Storage metadata for tracking transitions
CREATE TABLE IF NOT EXISTS storage_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  storage_class TEXT NOT NULL DEFAULT 'STANDARD',
  transitioned_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bucket, path)
);

-- Lifecycle action log
CREATE TABLE IF NOT EXISTS storage_lifecycle_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage access tracking
CREATE TABLE IF NOT EXISTS storage_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  access_type TEXT
);

-- Bucket configuration
CREATE TABLE IF NOT EXISTS bucket_configs (
  bucket TEXT PRIMARY KEY,
  versioning_enabled BOOLEAN DEFAULT false,
  lifecycle_enabled BOOLEAN DEFAULT true,
  encryption_enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lifecycle_policies_bucket ON storage_lifecycle_policies(bucket);
CREATE INDEX IF NOT EXISTS idx_storage_metadata_bucket_path ON storage_metadata(bucket, path);
CREATE INDEX IF NOT EXISTS idx_lifecycle_log_bucket ON storage_lifecycle_log(bucket);
CREATE INDEX IF NOT EXISTS idx_lifecycle_log_executed_at ON storage_lifecycle_log(executed_at);
CREATE INDEX IF NOT EXISTS idx_access_log_bucket_path ON storage_access_log(bucket, path);
CREATE INDEX IF NOT EXISTS idx_access_log_accessed_at ON storage_access_log(accessed_at);

-- Function to track file access
CREATE OR REPLACE FUNCTION storage.track_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage_access_log (bucket, path, user_id, access_type)
  VALUES (NEW.bucket_id, NEW.name, auth.uid(), 'READ');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE storage_lifecycle_policies IS 'Lifecycle policies for storage buckets';
COMMENT ON TABLE storage_metadata IS 'Metadata and storage tier information for files';
COMMENT ON TABLE storage_lifecycle_log IS 'Audit log for lifecycle actions';
COMMENT ON TABLE storage_access_log IS 'Tracks file access for lifecycle decisions';
`;
