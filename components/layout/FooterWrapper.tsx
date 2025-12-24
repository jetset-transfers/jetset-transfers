import { createClient } from '@/lib/supabase/server';
import Footer from './Footer';

export default async function FooterWrapper() {
  const supabase = await createClient();

  // Fetch contact info from database
  const { data: contactInfo } = await supabase
    .from('contact_info')
    .select('*')
    .single();

  return <Footer contactInfo={contactInfo} />;
}
