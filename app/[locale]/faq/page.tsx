import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

const faqs = {
  es: [
    {
      category: 'Reservaciones',
      items: [
        {
          question: 'Como puedo reservar un traslado desde el Aeropuerto de Cancun?',
          answer: 'Puedes reservar directamente en nuestro sitio web seleccionando tu destino, fecha de viaje y tipo de vehiculo. Tambien puedes contactarnos por WhatsApp para asistencia personalizada. El proceso es rapido y recibes confirmacion inmediata por correo electronico.',
        },
        {
          question: 'Con cuanta anticipacion debo reservar mi traslado?',
          answer: 'Recomendamos reservar al menos 24 horas antes de tu llegada para garantizar disponibilidad. Sin embargo, aceptamos reservas de ultimo momento sujetas a disponibilidad. Durante temporada alta (diciembre-abril), te sugerimos reservar con mayor anticipacion.',
        },
        {
          question: 'Puedo cancelar o modificar mi reserva?',
          answer: 'Si, puedes cancelar o modificar tu reserva sin costo hasta 24 horas antes de tu traslado. Para cambios de ultimo momento, contactanos por WhatsApp y haremos lo posible por acomodar tu solicitud.',
        },
        {
          question: 'Que metodos de pago aceptan?',
          answer: 'Aceptamos tarjetas de credito y debito (Visa, Mastercard, American Express) a traves de nuestra plataforma segura de pago. Tambien puedes pagar en efectivo (USD o MXN) directamente al conductor.',
        },
      ],
    },
    {
      category: 'Servicio de Traslado',
      items: [
        {
          question: 'Cual es la diferencia entre traslado privado y compartido?',
          answer: 'En un traslado privado, el vehiculo es exclusivamente para tu grupo sin paradas adicionales, ofreciendo una experiencia directa y personalizada. El traslado compartido es mas economico, ya que compartes el vehiculo con otros viajeros que van a destinos cercanos al tuyo.',
        },
        {
          question: 'Que incluye el servicio de traslado privado?',
          answer: 'Nuestro servicio incluye: recogida en el aeropuerto con letrero personalizado, monitoreo de vuelo en tiempo real, agua embotellada, aire acondicionado, asistencia con equipaje, asientos para ninos (si se solicitan), y Wi-Fi en vehiculos seleccionados.',
        },
        {
          question: 'Monitorean mi vuelo en caso de retraso?',
          answer: 'Si, monitoreamos todos los vuelos en tiempo real. Si tu vuelo se retrasa, ajustamos automaticamente la hora de recogida sin costo adicional. Tu conductor estara esperandote cuando aterrices.',
        },
        {
          question: 'Ofrecen servicio las 24 horas?',
          answer: 'Si, operamos las 24 horas del dia, los 7 dias de la semana, los 365 dias del ano. No importa a que hora llegue tu vuelo, tendremos un conductor esperandote.',
        },
        {
          question: 'Pueden proporcionar asientos para ninos?',
          answer: 'Si, ofrecemos asientos de seguridad para ninos sin costo adicional. Solo necesitas solicitarlo al momento de tu reserva indicando la edad del nino para proporcionarte el asiento adecuado.',
        },
      ],
    },
    {
      category: 'Destinos y Rutas',
      items: [
        {
          question: 'A que destinos ofrecen traslados desde el Aeropuerto de Cancun?',
          answer: 'Ofrecemos traslados a toda la Riviera Maya y Peninsula de Yucatan, incluyendo: Zona Hotelera de Cancun, Puerto Morelos, Playa del Carmen, Puerto Aventuras, Akumal, Tulum, Costa Mujeres, Holbox, Merida, Valladolid, Chichen Itza y mas.',
        },
        {
          question: 'Cuanto tiempo toma el traslado del aeropuerto a la Zona Hotelera de Cancun?',
          answer: 'El traslado a la Zona Hotelera de Cancun toma aproximadamente 20-30 minutos dependiendo de las condiciones del trafico y la ubicacion exacta de tu hotel.',
        },
        {
          question: 'Cuanto toma llegar a Playa del Carmen desde el aeropuerto?',
          answer: 'El traslado del Aeropuerto de Cancun a Playa del Carmen toma aproximadamente 50-60 minutos por la autopista. El tiempo puede variar segun el trafico.',
        },
        {
          question: 'Cuanto tiempo toma llegar a Tulum desde el aeropuerto?',
          answer: 'El traslado del Aeropuerto de Cancun a Tulum toma aproximadamente 1 hora y 45 minutos a 2 horas dependiendo de las condiciones del trafico.',
        },
      ],
    },
    {
      category: 'Vehiculos y Seguridad',
      items: [
        {
          question: 'Que tipos de vehiculos tienen disponibles?',
          answer: 'Contamos con una flota moderna que incluye SUVs (hasta 5 pasajeros), Vans (hasta 10 pasajeros) y Sprinters (hasta 14 pasajeros). Todos nuestros vehiculos cuentan con aire acondicionado, asientos comodos y amplio espacio para equipaje.',
        },
        {
          question: 'Los conductores hablan ingles?',
          answer: 'Si, todos nuestros conductores son bilingues (espanol e ingles) y estan capacitados profesionalmente. Pueden comunicarse con turistas internacionales sin problema.',
        },
        {
          question: 'Es seguro usar su servicio de traslado?',
          answer: 'Absolutamente. Todos nuestros conductores estan certificados y verificados. Nuestros vehiculos reciben mantenimiento regular y cuentan con seguro completo. Ademas, puedes rastrear tu traslado y contamos con calificacion de 4.9 estrellas en TripAdvisor.',
        },
      ],
    },
    {
      category: 'Precios',
      items: [
        {
          question: 'Cual es el precio del traslado del aeropuerto a mi hotel?',
          answer: 'Los precios varian segun el destino y tipo de vehiculo. Los traslados a la Zona Hotelera de Cancun empiezan desde $55 USD. Visita nuestra pagina de destinos para ver precios especificos a tu hotel o zona.',
        },
        {
          question: 'Hay cargos ocultos o propinas obligatorias?',
          answer: 'No, el precio que ves en nuestra pagina es el precio final. No hay cargos ocultos, tarifas de peaje adicionales ni propinas obligatorias. Las propinas son opcionales y a discrecion del cliente.',
        },
        {
          question: 'Ofrecen descuento en viaje redondo?',
          answer: 'Si, ofrecemos un descuento especial cuando reservas tu traslado de ida y vuelta. El descuento se aplica automaticamente al seleccionar la opcion de viaje redondo en nuestra plataforma de reservas.',
        },
      ],
    },
  ],
  en: [
    {
      category: 'Reservations',
      items: [
        {
          question: 'How can I book a transfer from Cancun Airport?',
          answer: 'You can book directly on our website by selecting your destination, travel date, and vehicle type. You can also contact us via WhatsApp for personalized assistance. The process is quick and you receive instant confirmation via email.',
        },
        {
          question: 'How far in advance should I book my transfer?',
          answer: 'We recommend booking at least 24 hours before your arrival to guarantee availability. However, we accept last-minute bookings subject to availability. During peak season (December-April), we suggest booking further in advance.',
        },
        {
          question: 'Can I cancel or modify my reservation?',
          answer: 'Yes, you can cancel or modify your reservation at no cost up to 24 hours before your transfer. For last-minute changes, contact us via WhatsApp and we will do our best to accommodate your request.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit and debit cards (Visa, Mastercard, American Express) through our secure payment platform. You can also pay in cash (USD or MXN) directly to the driver.',
        },
      ],
    },
    {
      category: 'Transfer Service',
      items: [
        {
          question: 'What is the difference between private and shared transfer?',
          answer: 'In a private transfer, the vehicle is exclusively for your group with no additional stops, offering a direct and personalized experience. The shared transfer is more affordable, as you share the vehicle with other travelers heading to destinations near yours.',
        },
        {
          question: 'What is included in the private transfer service?',
          answer: 'Our service includes: airport pickup with personalized sign, real-time flight monitoring, bottled water, air conditioning, luggage assistance, child seats (upon request), and Wi-Fi in select vehicles.',
        },
        {
          question: 'Do you monitor my flight in case of delays?',
          answer: 'Yes, we monitor all flights in real-time. If your flight is delayed, we automatically adjust the pickup time at no additional cost. Your driver will be waiting for you when you land.',
        },
        {
          question: 'Do you offer 24-hour service?',
          answer: 'Yes, we operate 24 hours a day, 7 days a week, 365 days a year. No matter what time your flight arrives, we will have a driver waiting for you.',
        },
        {
          question: 'Can you provide child car seats?',
          answer: 'Yes, we offer child safety seats at no additional cost. Just request them when making your reservation, indicating the child\'s age so we can provide the appropriate seat.',
        },
      ],
    },
    {
      category: 'Destinations & Routes',
      items: [
        {
          question: 'What destinations do you offer transfers to from Cancun Airport?',
          answer: 'We offer transfers throughout the Riviera Maya and Yucatan Peninsula, including: Cancun Hotel Zone, Puerto Morelos, Playa del Carmen, Puerto Aventuras, Akumal, Tulum, Costa Mujeres, Holbox, Merida, Valladolid, Chichen Itza, and more.',
        },
        {
          question: 'How long does the transfer from the airport to Cancun Hotel Zone take?',
          answer: 'The transfer to Cancun Hotel Zone takes approximately 20-30 minutes depending on traffic conditions and the exact location of your hotel.',
        },
        {
          question: 'How long does it take to get to Playa del Carmen from the airport?',
          answer: 'The transfer from Cancun Airport to Playa del Carmen takes approximately 50-60 minutes via the highway. Travel time may vary depending on traffic.',
        },
        {
          question: 'How long does it take to get to Tulum from the airport?',
          answer: 'The transfer from Cancun Airport to Tulum takes approximately 1 hour and 45 minutes to 2 hours depending on traffic conditions.',
        },
      ],
    },
    {
      category: 'Vehicles & Safety',
      items: [
        {
          question: 'What types of vehicles do you have available?',
          answer: 'We have a modern fleet that includes SUVs (up to 5 passengers), Vans (up to 10 passengers), and Sprinters (up to 14 passengers). All our vehicles feature air conditioning, comfortable seating, and ample luggage space.',
        },
        {
          question: 'Do your drivers speak English?',
          answer: 'Yes, all our drivers are bilingual (Spanish and English) and professionally trained. They can communicate with international tourists without any problem.',
        },
        {
          question: 'Is it safe to use your transfer service?',
          answer: 'Absolutely. All our drivers are certified and verified. Our vehicles receive regular maintenance and are fully insured. Additionally, you can track your transfer and we have a 4.9-star rating on TripAdvisor.',
        },
      ],
    },
    {
      category: 'Pricing',
      items: [
        {
          question: 'What is the price of the transfer from the airport to my hotel?',
          answer: 'Prices vary depending on the destination and vehicle type. Transfers to the Cancun Hotel Zone start from $55 USD. Visit our destinations page to see specific prices for your hotel or zone.',
        },
        {
          question: 'Are there hidden charges or mandatory tips?',
          answer: 'No, the price you see on our website is the final price. There are no hidden charges, additional toll fees, or mandatory tips. Tips are optional and at the customer\'s discretion.',
        },
        {
          question: 'Do you offer round-trip discounts?',
          answer: 'Yes, we offer a special discount when you book your round-trip transfer. The discount is automatically applied when you select the round-trip option on our booking platform.',
        },
      ],
    },
  ],
};

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Preguntas Frecuentes | Traslados Aeropuerto Cancun | Jetset Transfers',
    en: 'FAQ | Cancun Airport Transfers | Jetset Transfers',
  };

  const descriptions = {
    es: 'Resuelve todas tus dudas sobre traslados desde el Aeropuerto de Cancun. Precios, destinos, vehiculos, seguridad, metodos de pago y mas. Preguntas frecuentes Jetset Transfers.',
    en: 'Get answers to all your questions about transfers from Cancun Airport. Prices, destinations, vehicles, safety, payment methods and more. Jetset Transfers FAQ.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'preguntas frecuentes traslados cancun, faq transporte aeropuerto cancun, dudas transfer cancun, informacion traslados riviera maya'
      : 'cancun transfer faq, cancun airport transportation questions, transfer information riviera maya, cancun shuttle questions',
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/faq`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages: {
        'es': `${SITE_URL}/es/faq`,
        'en': `${SITE_URL}/en/faq`,
        'x-default': `${SITE_URL}/en/faq`,
      },
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const localeFaqs = faqs[locale as keyof typeof faqs] || faqs.es;

  // Flatten all FAQs for schema
  const allFaqs = localeFaqs.flatMap((cat) =>
    cat.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    }))
  );

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Preguntas Frecuentes' : 'FAQ', url: `/${locale}/faq` },
      ]} />
      <FAQSchema faqs={allFaqs} />

      <main className="min-h-screen pt-28 md:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Encuentra respuestas a las preguntas mas comunes sobre nuestro servicio de traslados desde el Aeropuerto de Cancun.'
                : 'Find answers to the most common questions about our transfer service from Cancun Airport.'}
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-10">
            {localeFaqs.map((category, catIndex) => (
              <section key={catIndex}>
                <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <details
                      key={itemIndex}
                      className="group card overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                        <h3 className="text-base font-medium pr-4">{item.question}</h3>
                        <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-5 text-muted leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center card p-8 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-brand-200 dark:border-brand-800">
            <h2 className="text-2xl font-bold mb-3">
              {locale === 'es' ? 'Aun tienes dudas?' : 'Still have questions?'}
            </h2>
            <p className="text-muted mb-6">
              {locale === 'es'
                ? 'Nuestro equipo esta disponible 24/7 para ayudarte con cualquier pregunta.'
                : 'Our team is available 24/7 to help you with any questions.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
              >
                {locale === 'es' ? 'Contactanos' : 'Contact Us'}
              </Link>
              <Link
                href={`/${locale}/transfer-booking`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-900 dark:text-white rounded-lg transition-colors font-medium border border-gray-200 dark:border-navy-600"
              >
                {locale === 'es' ? 'Reservar Traslado' : 'Book Transfer'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
