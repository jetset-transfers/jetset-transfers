import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Disable body parsing, we need raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        // Update booking status
        const { error } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            payment_reference: session.payment_intent as string,
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        if (error) {
          console.error('Error updating booking:', error);
        } else {
          console.log(`Booking ${bookingId} confirmed`);

          // Get booking details for email
          const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

          if (booking) {
            // Send confirmation emails - MUST await in serverless environment
            // Otherwise the function may terminate before emails are sent
            try {
              await sendConfirmationEmails(booking);
              console.log('Confirmation emails sent successfully');
            } catch (emailError) {
              console.error('Failed to send confirmation emails:', emailError);
              // Don't fail the webhook - booking is already confirmed
            }
          }
        }
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        // Mark booking as expired/cancelled
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Helper function to send confirmation emails
async function sendConfirmationEmails(booking: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Extract addresses from special_requests if present
  let originAddress = '';
  let destinationAddress = '';
  let cleanSpecialRequests = booking.special_requests || '';

  if (cleanSpecialRequests.includes('---')) {
    const parts = cleanSpecialRequests.split('---');
    cleanSpecialRequests = parts[0].trim(); // User notes only

    const addressPart = parts[1] || '';
    const originMatch = addressPart.match(/ORIGEN:\s*(.+?)(?=\nDESTINO:|$)/s);
    const destMatch = addressPart.match(/DESTINO:\s*(.+?)$/s);

    if (originMatch) originAddress = originMatch[1].trim();
    if (destMatch) destinationAddress = destMatch[1].trim();
  }

  try {
    console.log('Sending confirmation emails for booking:', booking.booking_number);
    console.log('Base URL:', baseUrl);
    console.log('Origin address extracted:', originAddress);
    console.log('Destination address extracted:', destinationAddress);

    // Send notification using existing API
    const response = await fetch(`${baseUrl}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking_confirmation',
        booking: {
          booking_number: booking.booking_number,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          customer_phone: booking.customer_phone,
          destination: booking.pickup_location,
          vehicle_name: booking.vehicle_name,
          travel_date: booking.pickup_date,
          // Don't show time if it's the default "00:00" value
          travel_time: booking.pickup_time && !booking.pickup_time.startsWith('00:00') ? booking.pickup_time : null,
          return_date: booking.return_date,
          return_time: booking.return_time,
          num_passengers: booking.num_passengers,
          flight_number: booking.pickup_flight_number,
          price_usd: booking.price_usd,
          service_type: booking.service_type,
          special_requests: cleanSpecialRequests || null,
          // Full addresses for admin email
          origin_address: originAddress || null,
          destination_address: destinationAddress || null,
        },
      }),
    });

    const responseData = await response.json();
    console.log('Send notification response:', response.status, responseData);

    if (!response.ok) {
      console.error('Failed to send confirmation emails:', responseData);
    }
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
  }
}
