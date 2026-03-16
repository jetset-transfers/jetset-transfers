import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

interface TransferCheckoutRequestBody {
  // Origin
  originName: string;
  originAddress: string;
  originLat: number;
  originLng: number;
  originZoneId?: string;

  // Destination
  destName: string;
  destAddress: string;
  destLat: number;
  destLng: number;
  destZoneId?: string;

  // Trip details
  date?: string;
  time?: string;
  passengers: number;
  serviceType?: 'private' | 'roundtrip' | 'oneway';

  // Vehicle
  vehicleName: string;
  priceUsd: number;
  pricingId?: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber?: string;
  specialRequests?: string;

  // Locale
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TransferCheckoutRequestBody = await request.json();

    // Validate required fields
    if (
      !body.originName ||
      !body.destName ||
      !body.vehicleName ||
      !body.priceUsd ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Create a pending booking in the database using existing columns
    // Store full addresses in special_requests in a clean format (not JSON)
    const addressInfo = `\n\n---\nORIGEN: ${body.originAddress}\nDESTINO: ${body.destAddress}`;
    const specialRequestsData = body.specialRequests
      ? `${body.specialRequests}${addressInfo}`
      : addressInfo.trim();

    // Determine service type for database
    const serviceType = body.serviceType === 'roundtrip' ? 'roundtrip' : 'transfer';

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        service_type: serviceType,
        destination_id: null, // Not a predefined destination
        // Store route as "Origin → Destination"
        pickup_location: `${body.originName} → ${body.destName}`,
        pickup_date: body.date || new Date().toISOString().split('T')[0],
        pickup_time: body.time || '00:00',
        num_passengers: body.passengers,
        pickup_flight_number: body.flightNumber || null,
        vehicle_name: body.vehicleName,
        price_usd: body.priceUsd,
        total_usd: body.priceUsd,
        payment_status: 'pending',
        status: 'pending',
        special_requests: specialRequestsData,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking', details: bookingError.message },
        { status: 500 }
      );
    }

    // Get base URL for success/cancel redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Build product description based on service type
    const isRoundTrip = body.serviceType === 'roundtrip';
    const serviceLabel = isRoundTrip
      ? (body.locale === 'es' ? 'Viaje Redondo' : 'Round Trip')
      : (body.locale === 'es' ? 'Transfer Privado' : 'Private Transfer');

    const description =
      body.locale === 'es'
        ? `${serviceLabel}: ${body.originName} → ${body.destName} - ${body.vehicleName}`
        : `${serviceLabel}: ${body.originName} → ${body.destName} - ${body.vehicleName}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceLabel,
              description: description,
              images: ['https://www.jetsettransfers.com/images/og/og-image.jpg'],
            },
            unit_amount: Math.round(body.priceUsd * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/${body.locale}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${baseUrl}/${body.locale}/booking/cancel?booking_id=${booking.id}`,
      customer_email: body.customerEmail,
      metadata: {
        booking_id: booking.id,
        booking_number: booking.booking_number,
        booking_type: 'zone_transfer',
        origin_name: body.originName,
        dest_name: body.destName,
        travel_date: body.date || '',
        travel_time: body.time || '',
        vehicle_name: body.vehicleName,
        num_passengers: String(body.passengers),
        locale: body.locale,
      },
      locale: body.locale === 'es' ? 'es' : 'en',
    });

    // Update booking with Stripe session ID
    await supabase
      .from('bookings')
      .update({
        payment_reference: session.id,
        payment_method: 'stripe',
      })
      .eq('id', booking.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Transfer checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
