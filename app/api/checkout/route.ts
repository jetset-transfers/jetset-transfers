import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

interface CheckoutRequestBody {
  // Trip details
  destinationId: string;
  destinationName: string;
  serviceType: 'private' | 'roundtrip' | 'oneway';
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  returnTime?: string;

  // Vehicle
  vehicleName: string;
  priceUsd: number;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber?: string;
  numPassengers: number;
  specialRequests?: string;

  // Locale
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    // Validate required fields
    if (
      !body.destinationId ||
      !body.vehicleName ||
      !body.priceUsd ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.travelDate
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Create a pending booking in the database
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        service_type: body.serviceType,
        destination_id: body.destinationId,
        pickup_location: body.destinationName,
        pickup_date: body.travelDate,
        pickup_time: body.travelTime || '12:00',
        return_date: body.returnDate || null,
        return_time: body.returnTime || null,
        num_passengers: body.numPassengers,
        pickup_flight_number: body.flightNumber || null,
        vehicle_name: body.vehicleName,
        price_usd: body.priceUsd,
        total_usd: body.priceUsd,
        payment_status: 'pending',
        status: 'pending',
        special_requests: body.specialRequests || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Get base URL for success/cancel redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Build product description
    const description =
      body.locale === 'es'
        ? `Transfer ${body.serviceType === 'roundtrip' ? 'Ida y Vuelta' : 'Privado'} - ${body.destinationName} - ${body.vehicleName}`
        : `${body.serviceType === 'roundtrip' ? 'Round Trip' : 'Private'} Transfer - ${body.destinationName} - ${body.vehicleName}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name:
                body.locale === 'es'
                  ? `Transfer a ${body.destinationName}`
                  : `Transfer to ${body.destinationName}`,
              description: description,
              images: ['https://www.jetsetcancun.com/images/og/og-image.jpg'],
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
        destination_name: body.destinationName,
        travel_date: body.travelDate,
        travel_time: body.travelTime || '',
        vehicle_name: body.vehicleName,
        num_passengers: String(body.numPassengers),
        locale: body.locale,
      },
      locale: body.locale === 'es' ? 'es' : 'en',
    });

    // Update booking with Stripe session ID (using payment_reference column)
    await supabase
      .from('bookings')
      .update({
        payment_reference: session.id,
        payment_method: 'stripe'
      })
      .eq('id', booking.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
