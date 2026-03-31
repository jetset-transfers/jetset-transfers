import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BookingsContent from './BookingsContent';

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch bookings with destination info if available
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations:destination_id (
        name_es,
        name_en,
        slug
      )
    `)
    .order('created_at', { ascending: false });

  return <BookingsContent user={user} bookings={bookings || []} />;
}
