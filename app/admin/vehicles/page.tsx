import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import VehiclesContent from './VehiclesContent';

export default async function VehiclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch vehicles
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <VehiclesContent
      user={user}
      vehicles={vehicles || []}
    />
  );
}
