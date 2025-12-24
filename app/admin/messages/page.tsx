import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MessagesContent from './MessagesContent';

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch contact requests with tour and destination names
  const { data: messages } = await supabase
    .from('contact_requests')
    .select(`
      *,
      air_tours:tour_id (
        name_es,
        name_en,
        slug
      ),
      destinations:destination_id (
        name_es,
        name_en,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  return <MessagesContent user={user} messages={messages || []} />;
}
