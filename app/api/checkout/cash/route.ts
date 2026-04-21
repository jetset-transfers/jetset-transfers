import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CashCheckoutRequestBody {
  // Trip details
  destinationId: string;
  destinationName: string;
  serviceType: 'private' | 'roundtrip' | 'oneway';
  travelDate: string;
  travelTime?: string;
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
    const body: CashCheckoutRequestBody = await request.json();

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

    // Create booking with cash payment status
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
        payment_status: 'cash_pending', // Special status for cash payments
        payment_method: 'cash',
        status: 'confirmed', // Confirmed but payment pending
        special_requests: body.specialRequests || null,
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

    // Send confirmation emails
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      await fetch(`${baseUrl}/api/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_confirmation',
          paymentMethod: 'cash', // Indicate cash payment
          booking: {
            booking_number: booking.booking_number,
            customer_name: booking.customer_name,
            customer_email: booking.customer_email,
            customer_phone: booking.customer_phone,
            destination: booking.pickup_location,
            vehicle_name: booking.vehicle_name,
            travel_date: booking.pickup_date,
            travel_time: booking.pickup_time && !booking.pickup_time.startsWith('00:00') ? booking.pickup_time : null,
            return_date: booking.return_date,
            return_time: booking.return_time,
            num_passengers: booking.num_passengers,
            flight_number: booking.pickup_flight_number,
            price_usd: booking.price_usd,
            service_type: booking.service_type,
            special_requests: body.specialRequests || null,
          },
        }),
      });
    } catch (emailError) {
      // Log but don't fail the booking
      console.error('Error sending confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.booking_number,
    });
  } catch (error) {
    console.error('Cash checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
