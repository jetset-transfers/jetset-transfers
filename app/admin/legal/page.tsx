import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LegalContent from './LegalContent';

export default async function LegalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch legal pages
  const { data: legalPages } = await supabase
    .from('legal_pages')
    .select('*')
    .order('slug', { ascending: true });

  return (
    <LegalContent
      user={user}
      legalPages={legalPages || []}
    />
  );
}
