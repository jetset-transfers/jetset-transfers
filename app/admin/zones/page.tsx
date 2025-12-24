import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ZonesContent from './ZonesContent';

export default async function ZonesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch zones
  const { data: zones } = await supabase
    .from('zones')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <ZonesContent
      user={user}
      zones={zones || []}
    />
  );
}
