import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ContactInfoContent from './ContactInfoContent';

export default async function AdminContactPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/admin/login');
  }

  // Fetch contact info
  const { data: contactInfo } = await supabase
    .from('contact_info')
    .select('*')
    .single();

  return <ContactInfoContent user={user} contactInfo={contactInfo} />;
}
