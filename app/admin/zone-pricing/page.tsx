import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ZonePricingContent from './ZonePricingContent';

export const metadata: Metadata = {
  title: 'Precios por Zona | Admin - Jetset Transfers',
  description: 'Gestión de precios entre zonas para transfers',
};

export default async function ZonePricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <ZonePricingContent user={user} />;
}
