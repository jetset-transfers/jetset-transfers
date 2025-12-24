import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardContent from './DashboardContent';
import { getStorageStats } from '@/lib/supabase/storage-stats';
import { getDatabaseStats } from '@/lib/supabase/database-stats';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Get real stats from database
  const [
    { count: imagesCount },
    { count: destinationsCount },
    { count: zonesCount },
    { count: messagesCount },
    { count: pendingMessagesCount },
    storageStats,
    databaseStats,
  ] = await Promise.all([
    supabase.from('site_images').select('*', { count: 'exact', head: true }),
    supabase.from('destinations').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('zones').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    getStorageStats(supabase),
    getDatabaseStats(supabase),
  ]);

  const stats = {
    images: imagesCount || 0,
    destinations: destinationsCount || 0,
    tours: zonesCount || 0,
    messages: messagesCount || 0,
    pendingMessages: pendingMessagesCount || 0,
    storage: storageStats,
    database: databaseStats,
  };

  return <DashboardContent user={user} stats={stats} />;
}
