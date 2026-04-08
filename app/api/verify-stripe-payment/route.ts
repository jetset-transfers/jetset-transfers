import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the booking to find the payment reference
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, booking_number, payment_reference, payment_status, status, price_usd, total_usd')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // If already paid, just return current status
    if (booking.payment_status === 'paid') {
      return NextResponse.json({
        verified: true,
        already_paid: true,
        payment_status: 'paid',
        message: 'El pago ya estaba registrado como pagado',
      });
    }

    // Try to find the Stripe session by payment_reference or by searching
    let session = null;
    let paymentIntent = null;

    // If we have a payment_reference, try to retrieve it
    if (booking.payment_reference) {
      const ref = booking.payment_reference;

      try {
        // Could be a checkout session ID (cs_...)
        if (ref.startsWith('cs_')) {
          session = await stripe.checkout.sessions.retrieve(ref);
        }
        // Could be a payment intent ID (pi_...)
        else if (ref.startsWith('pi_')) {
          paymentIntent = await stripe.paymentIntents.retrieve(ref);
        }
      } catch {
        // Reference might be invalid, try searching
      }
    }

    // If no session found via reference, search Stripe by booking metadata
    if (!session && !paymentIntent) {
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
      });

      // Find session matching this booking
      session = sessions.data.find(
        (s) => s.metadata?.booking_id === bookingId || s.metadata?.booking_number === booking.booking_number
      ) || null;
    }

    // Determine payment status from Stripe
    let stripePaid = false;
    let stripeStatus = 'unknown';
    let stripePaymentIntent = '';

    if (session) {
      stripeStatus = session.payment_status || 'unknown';
      stripePaid = session.payment_status === 'paid';
      stripePaymentIntent = (session.payment_intent as string) || '';
    } else if (paymentIntent) {
      stripeStatus = paymentIntent.status;
      stripePaid = paymentIntent.status === 'succeeded';
      stripePaymentIntent = paymentIntent.id;
    }

    // If Stripe says it's paid, update the booking
    if (stripePaid) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_reference: stripePaymentIntent || booking.payment_reference,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (updateError) {
        return NextResponse.json({
          verified: true,
          stripe_status: stripeStatus,
          updated: false,
          error: 'Stripe confirma pago pero no se pudo actualizar la base de datos',
        });
      }

      return NextResponse.json({
        verified: true,
        stripe_status: stripeStatus,
        updated: true,
        payment_status: 'paid',
        message: 'Pago verificado en Stripe y reserva actualizada a pagado/confirmado',
      });
    }

    // Not paid in Stripe
    return NextResponse.json({
      verified: true,
      stripe_status: stripeStatus,
      updated: false,
      payment_status: booking.payment_status,
      message: `Stripe reporta estado: ${stripeStatus}. No se encontró pago completado.`,
    });
  } catch (error) {
    console.error('Error verifying Stripe payment:', error);
    return NextResponse.json(
      { error: 'Error al verificar pago en Stripe' },
      { status: 500 }
    );
  }
}
