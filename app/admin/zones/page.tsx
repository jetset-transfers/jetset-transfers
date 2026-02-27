import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ZonesContent from './ZonesContent';

export const metadata: Metadata = {
  title: 'Zonas de Transfer | Admin - Jetset Transfers',
  description: 'Gestión de zonas geográficas para transfers',
};

export default async function ZonesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <ZonesContent user={user} />;
}
