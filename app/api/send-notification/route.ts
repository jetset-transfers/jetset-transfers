import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only when needed (at runtime, not build time)
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface QuoteRequestData {
  // Contact info
  name: string;
  email: string;
  phone: string;
  message?: string;

  // Service type
  service_type: 'transfer' | 'roundtrip' | 'private' | 'general';

  // Transfer specific
  destination?: string;
  destination_other?: string;
  pickup_location?: string;
  pickup_location_other?: string;
  travel_date?: string;
  departure_time?: string;
  return_date?: string;
  return_time?: string;
  vehicle_selected?: string;
  flight_number?: string;

  // Number of passengers
  number_of_passengers?: number;

  // Pre-selected info
  preSelectedPrice?: string;
}

interface BookingConfirmationData {
  type: 'booking_confirmation';
  booking: {
    booking_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    destination: string;
    vehicle_name: string;
    travel_date: string;
    travel_time: string;
    return_date?: string;
    return_time?: string;
    num_passengers: number;
    flight_number?: string;
    price_usd: number;
    service_type: string;
    special_requests?: string;
    // Full addresses for zone transfers
    origin_address?: string;
    destination_address?: string;
  };
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'No especificada';
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const weekdays = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];

  const date = new Date(year, month - 1, day, 12, 0, 0);
  const weekday = weekdays[date.getDay()];
  const monthName = months[month - 1];

  return `${weekday}, ${day} de ${monthName} de ${year}`;
}

function formatSlug(slug: string): string {
  return slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatDateEN(dateString?: string): string {
  if (!dateString) return 'Not specified';
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const date = new Date(year, month - 1, day, 12, 0, 0);
  const weekday = weekdays[date.getDay()];
  const monthName = months[month - 1];

  return `${weekday}, ${monthName} ${day}, ${year}`;
}

function generateBookingConfirmationHTML(data: BookingConfirmationData['booking']): string {
  const serviceTypeLabel = data.service_type === 'roundtrip' ? 'Round Trip Transfer' : 'Private Transfer';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - Jetset Transfers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #102a43; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                🎉 Booking Confirmed!
              </h1>
              <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 14px;">
                Your payment has been processed successfully
              </p>
            </td>
          </tr>

          <!-- Confirmation Code -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Confirmation Code</p>
              <p style="margin: 0; color: #e63946; font-size: 32px; font-weight: 700; letter-spacing: 2px;">${data.booking_number}</p>
            </td>
          </tr>

          <!-- Greeting Section -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hello <strong>${data.customer_name}</strong>,
              </p>
              <p style="margin: 0 0 15px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                Thank you for booking with Jetset Transfers! Your <strong>${serviceTypeLabel}</strong> has been confirmed.
                Please save your confirmation code for reference.
              </p>
              <div style="background-color: #dcfce7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500;">
                  ✅ Your driver will contact you via WhatsApp the day before your trip to confirm pickup details.
                </p>
              </div>
            </td>
          </tr>

          <!-- Trip Details Section -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                🚐 Trip Details
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Service:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${serviceTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Destination:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.destination}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDateEN(data.travel_date)}</td>
                </tr>
                ${data.travel_time ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.travel_time}</td>
                </tr>
                ` : ''}
                ${data.flight_number ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Flight:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">✈️ ${data.flight_number}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vehicle:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.vehicle_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Passengers:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.num_passengers}</td>
                </tr>
                ${data.return_date ? `
                <tr>
                  <td colspan="2" style="padding: 15px 0 8px 0; color: #102a43; font-size: 14px; font-weight: 600;">Return Trip</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Return Date:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDateEN(data.return_date)}</td>
                </tr>
                ${data.return_time ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Return Time:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.return_time}</td>
                </tr>
                ` : ''}
                ` : ''}
                ${data.special_requests && !data.special_requests.includes('Transfer Details:') && !data.special_requests.includes('ORIGEN:') ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Special Requests:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.special_requests}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Total Paid -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="color: #1e293b; font-size: 16px; font-weight: 600;">Total Paid</td>
                        <td style="color: #e63946; font-size: 24px; font-weight: 700; text-align: right;">$${data.price_usd.toFixed(2)} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                📞 Need Help?
              </h2>
              <p style="margin: 0 0 15px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                If you need to modify your booking or have any questions, contact us:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="https://wa.me/529982000945" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      💬 WhatsApp: +52 998 200 0945
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Thank you for choosing Jetset Transfers!
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Safe and punctual private transportation from Cancun Airport
              </p>
              <p style="margin: 15px 0 0 0; color: #cbd5e1; font-size: 11px;">
                <a href="https://jetsetcancun.com" style="color: #e63946; text-decoration: none;">jetsetcancun.com</a>
                <br>
                © ${new Date().getFullYear()} Jetset Transfers. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateBookingNotificationHTML(data: BookingConfirmationData['booking']): string {
  const serviceTypeLabel = data.service_type === 'roundtrip' ? 'Viaje Redondo' : 'Traslado Privado';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Reserva Pagada - Jetset Transfers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #166534; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                💰 Nueva Reserva PAGADA
              </h1>
              <p style="margin: 10px 0 0 0; color: #bbf7d0; font-size: 14px;">
                ${serviceTypeLabel} - $${data.price_usd.toFixed(2)} USD
              </p>
            </td>
          </tr>

          <!-- Confirmation Code -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Código de Confirmación</p>
              <p style="margin: 0; color: #166534; font-size: 28px; font-weight: 700; letter-spacing: 2px;">${data.booking_number}</p>
            </td>
          </tr>

          <!-- Client Info -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #166534; padding-bottom: 8px;">
                👤 Información del Cliente
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Nombre:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.customer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="mailto:${data.customer_email}" style="color: #e63946; text-decoration: none;">${data.customer_email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="tel:${data.customer_phone}" style="color: #e63946; text-decoration: none;">${data.customer_phone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip Details -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #166534; padding-bottom: 8px;">
                🚐 Detalles del Traslado
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Servicio:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${serviceTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Ruta:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.destination}</td>
                </tr>
                ${data.origin_address ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">📍 Origen:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.origin_address)}" style="color: #e63946; text-decoration: none;" target="_blank">
                      ${data.origin_address} 🗺️
                    </a>
                  </td>
                </tr>
                ` : ''}
                ${data.destination_address ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">📍 Destino:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 13px;">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.destination_address)}" style="color: #e63946; text-decoration: none;" target="_blank">
                      ${data.destination_address} 🗺️
                    </a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.travel_date)}</td>
                </tr>
                ${data.travel_time ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Hora:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.travel_time}</td>
                </tr>
                ` : ''}
                ${data.flight_number ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vuelo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">✈️ ${data.flight_number}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vehículo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.vehicle_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pasajeros:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.num_passengers}</td>
                </tr>
                ${data.return_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha regreso:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.return_date)}${data.return_time ? ` a las ${data.return_time}` : ''}</td>
                </tr>
                ` : ''}
                ${data.special_requests && !data.special_requests.includes('Transfer Details:') && !data.special_requests.includes('ORIGEN:') ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Notas:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.special_requests}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #dcfce7; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="color: #166534; font-size: 18px; font-weight: 600;">💵 Total Pagado</td>
                        <td style="color: #166534; font-size: 28px; font-weight: 700; text-align: right;">$${data.price_usd.toFixed(2)} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${data.customer_phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                      💬 Contactar por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Reserva generada desde <a href="https://jetsetcancun.com" style="color: #e63946; text-decoration: none;">jetsetcancun.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateCustomerConfirmationHTML(data: QuoteRequestData): string {
  const serviceTypeLabel = data.service_type === 'roundtrip' ? 'Viaje Redondo' : 'Traslado Privado';

  const pickupLocation = data.pickup_location === 'other'
    ? data.pickup_location_other
    : data.pickup_location;

  const destination = data.destination === 'other'
    ? data.destination_other
    : data.destination ? formatSlug(data.destination) : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Solicitud - Jetset Transfers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #102a43; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                ¡Gracias por tu solicitud!
              </h1>
              <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 14px;">
                Hemos recibido tu cotización
              </p>
            </td>
          </tr>

          <!-- Greeting Section -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hola <strong>${data.name}</strong>,
              </p>
              <p style="margin: 0 0 15px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                Hemos recibido tu solicitud de cotización para un <strong>${serviceTypeLabel}</strong>.
                Nuestro equipo revisará los detalles y se pondrá en contacto contigo a la brevedad para
                confirmar disponibilidad y precio final.
              </p>
              <div style="background-color: #dbeafe; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 500;">
                  ⏰ Tiempo de respuesta: Generalmente respondemos en menos de 2 horas durante horario laboral.
                </p>
              </div>
            </td>
          </tr>

          <!-- Trip Summary Section -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                📋 Resumen de tu solicitud
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Servicio:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${serviceTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Origen:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${pickupLocation || 'Aeropuerto de Cancún'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Destino:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${destination || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pasajeros:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.number_of_passengers || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.travel_date)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Hora:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.departure_time || 'No especificada'}</td>
                </tr>
                ${data.flight_number ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vuelo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">✈️ ${data.flight_number}</td>
                </tr>
                ` : ''}
                ${data.return_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Regreso:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.return_date)}${data.return_time ? ` a las ${data.return_time}` : ''}</td>
                </tr>
                ` : ''}
                ${data.vehicle_selected ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vehículo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.vehicle_selected}</td>
                </tr>
                ` : ''}
                ${data.preSelectedPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Precio estimado:</td>
                  <td style="padding: 8px 0; color: #e63946; font-size: 14px; font-weight: 600;">Desde $${data.preSelectedPrice} USD</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Contact Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                📞 ¿Tienes alguna pregunta?
              </h2>
              <p style="margin: 0 0 15px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                Si necesitas modificar tu solicitud o tienes alguna duda, no dudes en contactarnos:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="https://wa.me/529981234567" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
                      💬 WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                ¡Gracias por elegir Jetset Transfers!
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Transporte privado seguro y puntual desde el Aeropuerto de Cancún
              </p>
              <p style="margin: 15px 0 0 0; color: #cbd5e1; font-size: 11px;">
                <a href="https://jetsetcancun.com" style="color: #e63946; text-decoration: none;">jetsetcancun.com</a>
                <br>
                © ${new Date().getFullYear()} Jetset Transfers. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateEmailHTML(data: QuoteRequestData): string {
  // All transfer services are private (transfer, roundtrip, private)
  const isTransfer = data.service_type === 'transfer' || data.service_type === 'roundtrip' || data.service_type === 'private';
  const serviceTypeLabel = data.service_type === 'roundtrip' ? 'Viaje Redondo (Privado)' : 'Traslado Privado';

  const pickupLocation = data.pickup_location === 'other'
    ? data.pickup_location_other
    : data.pickup_location;

  const destination = data.destination === 'other'
    ? data.destination_other
    : data.destination ? formatSlug(data.destination) : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Cotización - Jetset Transfers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #102a43; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Nueva Solicitud de Cotización
              </h1>
              <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 14px;">
                ${serviceTypeLabel}
              </p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding: 20px 40px 0 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-align: center;">
                    ${data.service_type === 'roundtrip' ? '🔄 VIAJE REDONDO' : '🚐 TRASLADO PRIVADO'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Info Section -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                👤 Información del Cliente
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Nombre:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="mailto:${data.email}" style="color: #e63946; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="tel:${data.phone}" style="color: #e63946; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip Details Section -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                🚐 Detalles del Traslado
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Origen:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${pickupLocation || 'Aeropuerto de Cancún'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Destino:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${destination || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pasajeros:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.number_of_passengers || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.travel_date)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Hora:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.departure_time || 'No especificada'}</td>
                </tr>
                ${data.flight_number ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Número de vuelo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">✈️ ${data.flight_number}</td>
                </tr>
                ` : ''}
                ${data.return_date ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha de regreso:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formatDate(data.return_date)}</td>
                </tr>
                ${data.return_time ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Hora de regreso:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${data.return_time}</td>
                </tr>
                ` : ''}
                ` : ''}
                ${data.vehicle_selected ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Vehículo:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.vehicle_selected}</td>
                </tr>
                ` : ''}
                ${data.preSelectedPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Precio cotizado:</td>
                  <td style="padding: 8px 0; color: #e63946; font-size: 14px; font-weight: 600;">Desde $${data.preSelectedPrice} USD</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Message Section (if exists) -->
          ${data.message ? `
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #102a43; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e63946; padding-bottom: 8px;">
                💬 Mensaje del Cliente
              </h2>
              <div style="background-color: #f8fafc; border-left: 4px solid #e63946; padding: 15px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">${data.message}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re: Cotización Jetset Transfers - ${destination}" style="display: inline-block; background-color: #e63946; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Responder al Cliente
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 13px;">
                      💬 Contactar por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Este correo fue generado automáticamente desde el formulario de contacto de
                <a href="https://jetsetcancun.com" style="color: #e63946; text-decoration: none;">jetsetcancun.com</a>
              </p>
              <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 11px;">
                © ${new Date().getFullYear()} Jetset Transfers. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resend = getResendClient();

    // Handle booking confirmation emails
    if (body.type === 'booking_confirmation') {
      const data = body as BookingConfirmationData;
      const booking = data.booking;

      // Send confirmation email to customer
      const customerSubject = `Booking Confirmed: ${booking.booking_number} - Jetset Transfers`;

      const { error: customerError } = await resend.emails.send({
        from: 'Jetset Transfers <notificaciones@notify.jetsetcancun.com>',
        to: [booking.customer_email],
        subject: customerSubject,
        html: generateBookingConfirmationHTML(booking),
      });

      if (customerError) {
        console.error('Customer booking confirmation email error:', customerError);
      }

      // Send notification to admin
      const adminSubject = `💰 Nueva Reserva PAGADA: ${booking.booking_number} - ${booking.destination} - $${booking.price_usd} USD`;

      const { data: emailData, error: adminError } = await resend.emails.send({
        from: 'Jetset Transfers <notificaciones@notify.jetsetcancun.com>',
        to: ['transportesjetset@gmail.com'],
        subject: adminSubject,
        html: generateBookingNotificationHTML(booking),
        replyTo: booking.customer_email,
      });

      if (adminError) {
        console.error('Admin booking notification email error:', adminError);
        return NextResponse.json(
          { error: 'Error al enviar notificación' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, id: emailData?.id });
    }

    // Handle quote request emails (existing functionality)
    const data: QuoteRequestData = body;

    const destination = data.destination === 'other' ? data.destination_other : data.destination;

    const subject = `Nueva Cotización: Traslado a ${destination ? formatSlug(destination) : 'destino personalizado'} - ${data.name}`;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Jetset Transfers <notificaciones@notify.jetsetcancun.com>',
      to: ['transportesjetset@gmail.com'],
      subject: subject,
      html: generateEmailHTML(data),
      replyTo: data.email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Error al enviar notificación' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    const customerSubject = `Confirmación: Hemos recibido tu solicitud - Jetset Transfers`;

    const { error: customerError } = await resend.emails.send({
      from: 'Jetset Transfers <notificaciones@notify.jetsetcancun.com>',
      to: [data.email],
      subject: customerSubject,
      html: generateCustomerConfirmationHTML(data),
    });

    if (customerError) {
      // Log error but don't fail the request - internal notification was already sent
      console.error('Customer confirmation email error:', customerError);
    }

    return NextResponse.json({ success: true, id: emailData?.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
