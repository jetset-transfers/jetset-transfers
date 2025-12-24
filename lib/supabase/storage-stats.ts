import { SupabaseClient } from '@supabase/supabase-js';

interface StorageStats {
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  fileCount: number;
  limitGB: number;
  usagePercentage: number;
  buckets: BucketStats[];
}

interface BucketStats {
  name: string;
  sizeBytes: number;
  sizeMB: number;
  fileCount: number;
}

interface RPCStorageStats {
  total_size_bytes: number;
  file_count: number;
  buckets: {
    name: string;
    size_bytes: number;
    file_count: number;
  }[] | null;
}

// Supabase Free tier limit: 1GB
const STORAGE_LIMIT_GB = 1;
const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

export async function getStorageStats(supabase: SupabaseClient): Promise<StorageStats> {
  try {
    // Try to use the RPC function first (most accurate)
    const { data, error } = await supabase.rpc('get_storage_stats');

    if (!error && data) {
      const rpcData = data as RPCStorageStats;
      const totalSizeBytes = rpcData.total_size_bytes || 0;
      const totalSizeMB = totalSizeBytes / (1024 * 1024);
      const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024);
      const usagePercentage = (totalSizeBytes / STORAGE_LIMIT_BYTES) * 100;

      const buckets: BucketStats[] = (rpcData.buckets || []).map((b) => ({
        name: b.name,
        sizeBytes: b.size_bytes,
        sizeMB: Math.round((b.size_bytes / (1024 * 1024)) * 100) / 100,
        fileCount: b.file_count,
      }));

      return {
        totalSizeBytes,
        totalSizeMB: Math.round(totalSizeMB * 100) / 100,
        totalSizeGB: Math.round(totalSizeGB * 1000) / 1000,
        fileCount: rpcData.file_count || 0,
        limitGB: STORAGE_LIMIT_GB,
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        buckets,
      };
    }

    // Fallback to counting files (without accurate sizes)
    console.log('RPC function not available, using fallback method');
    return await getStorageStatsFallback(supabase);
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return await getStorageStatsFallback(supabase);
  }
}

// Fallback method that counts files but may not have accurate sizes
async function getStorageStatsFallback(supabase: SupabaseClient): Promise<StorageStats> {
  const bucketStats: BucketStats[] = [];
  let totalSizeBytes = 0;
  let totalFileCount = 0;

  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return getEmptyStats();
    }

    // Get stats for each bucket
    for (const bucket of buckets || []) {
      const files = await listAllFiles(supabase, bucket.name, '');
      let bucketSize = 0;

      for (const file of files) {
        // Try to get size from metadata
        if (file.metadata && typeof file.metadata === 'object') {
          const meta = file.metadata as Record<string, unknown>;
          if (typeof meta.size === 'number') {
            bucketSize += meta.size;
          }
        }
      }

      bucketStats.push({
        name: bucket.name,
        sizeBytes: bucketSize,
        sizeMB: Math.round((bucketSize / (1024 * 1024)) * 100) / 100,
        fileCount: files.length,
      });

      totalSizeBytes += bucketSize;
      totalFileCount += files.length;
    }

    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024);
    const usagePercentage = (totalSizeBytes / STORAGE_LIMIT_BYTES) * 100;

    return {
      totalSizeBytes,
      totalSizeMB: Math.round(totalSizeMB * 100) / 100,
      totalSizeGB: Math.round(totalSizeGB * 1000) / 1000,
      fileCount: totalFileCount,
      limitGB: STORAGE_LIMIT_GB,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      buckets: bucketStats,
    };
  } catch (error) {
    console.error('Error in fallback storage stats:', error);
    return getEmptyStats();
  }
}

interface StorageFile {
  id: string;
  name: string;
  metadata?: Record<string, unknown> | null;
}

async function listAllFiles(
  supabase: SupabaseClient,
  bucketName: string,
  path: string
): Promise<StorageFile[]> {
  const allFiles: StorageFile[] = [];

  try {
    const { data: items, error } = await supabase.storage
      .from(bucketName)
      .list(path, {
        limit: 1000,
        offset: 0,
      });

    if (error) {
      console.error(`Error listing files in ${bucketName}/${path}:`, error);
      return allFiles;
    }

    for (const item of items || []) {
      const fullPath = path ? `${path}/${item.name}` : item.name;

      if (item.id) {
        allFiles.push({
          id: item.id,
          name: fullPath,
          metadata: item.metadata as Record<string, unknown> | null,
        });
      } else {
        const nestedFiles = await listAllFiles(supabase, bucketName, fullPath);
        allFiles.push(...nestedFiles);
      }
    }
  } catch (error) {
    console.error(`Error in listAllFiles for ${bucketName}/${path}:`, error);
  }

  return allFiles;
}

function getEmptyStats(): StorageStats {
  return {
    totalSizeBytes: 0,
    totalSizeMB: 0,
    totalSizeGB: 0,
    fileCount: 0,
    limitGB: STORAGE_LIMIT_GB,
    usagePercentage: 0,
    buckets: [],
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
