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
            booking_status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
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
            // Send confirmation emails (async, don't wait)
            sendConfirmationEmails(booking).catch(console.error);
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
            booking_status: 'cancelled',
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

  try {
    // Send notification using existing API
    await fetch(`${baseUrl}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking_confirmation',
        booking: {
          confirmation_code: booking.confirmation_code,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          customer_phone: booking.customer_phone,
          destination: booking.pickup_location,
          vehicle_name: booking.vehicle_name,
          travel_date: booking.travel_date,
          travel_time: booking.travel_time,
          return_date: booking.return_date,
          return_time: booking.return_time,
          num_passengers: booking.num_passengers,
          flight_number: booking.flight_number,
          price_usd: booking.price_usd,
          service_type: booking.service_type,
          special_requests: booking.customer_notes,
          locale: booking.locale,
        },
      }),
    });
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
  }
}
