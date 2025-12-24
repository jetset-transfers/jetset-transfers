import { SupabaseClient } from '@supabase/supabase-js';

interface TableStats {
  table_name: string;
  size_bytes: number;
}

interface DatabaseStats {
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  limitMB: number;
  limitGB: number;
  usagePercentage: number;
  tables: {
    name: string;
    sizeBytes: number;
    sizeMB: number;
  }[];
}

interface RPCDatabaseStats {
  total_size_bytes: number;
  tables: TableStats[] | null;
}

// Supabase Free tier database limit: 500MB
const DATABASE_LIMIT_MB = 500;
const DATABASE_LIMIT_BYTES = DATABASE_LIMIT_MB * 1024 * 1024;

export async function getDatabaseStats(supabase: SupabaseClient): Promise<DatabaseStats> {
  try {
    // Try to use the RPC function
    const { data, error } = await supabase.rpc('get_database_stats');

    if (!error && data) {
      const rpcData = data as RPCDatabaseStats;
      const totalSizeBytes = rpcData.total_size_bytes || 0;
      const totalSizeMB = totalSizeBytes / (1024 * 1024);
      const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024);
      const usagePercentage = (totalSizeBytes / DATABASE_LIMIT_BYTES) * 100;

      const tables = (rpcData.tables || []).map((t) => ({
        name: t.table_name.replace('public.', ''),
        sizeBytes: t.size_bytes,
        sizeMB: Math.round((t.size_bytes / (1024 * 1024)) * 100) / 100,
      }));

      return {
        totalSizeBytes,
        totalSizeMB: Math.round(totalSizeMB * 100) / 100,
        totalSizeGB: Math.round(totalSizeGB * 1000) / 1000,
        limitMB: DATABASE_LIMIT_MB,
        limitGB: DATABASE_LIMIT_MB / 1024,
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        tables,
      };
    }

    // If RPC function is not available, return empty stats
    console.log('Database stats RPC function not available');
    return getEmptyDatabaseStats();
  } catch (error) {
    console.error('Error getting database stats:', error);
    return getEmptyDatabaseStats();
  }
}

function getEmptyDatabaseStats(): DatabaseStats {
  return {
    totalSizeBytes: 0,
    totalSizeMB: 0,
    totalSizeGB: 0,
    limitMB: DATABASE_LIMIT_MB,
    limitGB: DATABASE_LIMIT_MB / 1024,
    usagePercentage: 0,
    tables: [],
  };
}
