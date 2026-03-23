import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import {
  CheckCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Precios de Traslados Aeropuerto Cancun | Tarifas 2025 | Jetset Transfers',
    en: 'Cancun Airport Transfer Prices | 2025 Rates | Jetset Transfers',
  };

  const descriptions = {
    es: 'Consulta los precios de traslados desde el Aeropuerto de Cancun a Zona Hotelera, Playa del Carmen, Tulum y mas. Tarifas transparentes por vehiculo y destino. Sin cargos ocultos.',
    en: 'Check transfer prices from Cancun Airport to Hotel Zone, Playa del Carmen, Tulum and more. Transparent rates by vehicle and destination. No hidden charges.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'precios traslados cancun, cuanto cuesta transfer cancun, tarifas transporte aeropuerto cancun, precio taxi cancun hotel, costo traslado playa del carmen'
      : 'cancun transfer prices, how much cancun airport transfer, cancun transportation rates, cancun taxi price hotel, playa del carmen transfer cost',
    openGraph: {
      title, description,
      url: `${SITE_URL}/${locale}/pricing`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/pricing`,
      languages: {
        'es': `${SITE_URL}/es/pricing`,
        'en': `${SITE_URL}/en/pricing`,
        'x-default': `${SITE_URL}/en/pricing`,
      },
    },
  };
}

const pricingFaqs = {
  es: [
    { question: 'El precio incluye peajes?', answer: 'Si, todos los precios mostrados incluyen peajes de autopista, gasolina y seguro. No hay cargos adicionales.' },
    { question: 'Puedo pagar en pesos mexicanos?', answer: 'Si, aceptamos pagos en USD y MXN. Los precios en pesos se calculan al tipo de cambio del dia.' },
    { question: 'Hay descuento por viaje redondo?', answer: 'Si, al reservar viaje redondo (ida y vuelta) se aplica un descuento automatico sobre el precio total.' },
    { question: 'Los ninos pagan?', answer: 'No, los ninos no pagan cargo adicional. El precio es por vehiculo, no por pasajero. Asientos para ninos disponibles sin costo extra.' },
  ],
  en: [
    { question: 'Does the price include tolls?', answer: 'Yes, all prices shown include highway tolls, gas, and insurance. There are no additional charges.' },
    { question: 'Can I pay in Mexican pesos?', answer: 'Yes, we accept payments in USD and MXN. Peso prices are calculated at the current exchange rate.' },
    { question: 'Is there a round-trip discount?', answer: 'Yes, when booking a round trip (both ways) an automatic discount is applied to the total price.' },
    { question: 'Do children pay?', answer: 'No, children do not pay additional charges. The price is per vehicle, not per passenger. Child seats available at no extra cost.' },
  ],
};

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
  notes_es?: string;
  notes_en?: string;
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch destinations with pricing
  const { data: destinations } = await supabase
    .from('destinations')
    .select('slug, name_es, name_en, travel_time, transfer_time, distance_km, vehicle_pricing, zone')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const faqs = pricingFaqs[locale as keyof typeof pricingFaqs] || pricingFaqs.es;

  // Get unique vehicle names from all destinations
  const allVehicleNames = new Set<string>();
  (destinations || []).forEach((dest) => {
    const pricing = dest.vehicle_pricing as VehiclePricing[] | null;
    (pricing || []).forEach((vp) => allVehicleNames.add(vp.vehicle_name));
  });
  const vehicleColumns = Array.from(allVehicleNames);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Precios' : 'Pricing', url: `/${locale}/pricing` },
      ]} />
      <FAQSchema faqs={faqs} />

      <main className="min-h-screen pt-28 md:pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === 'es'
                ? 'Precios de Traslados desde el Aeropuerto de Cancun'
                : 'Transfer Prices from Cancun Airport'}
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Tarifas transparentes por destino y tipo de vehiculo. Precio por vehiculo, no por persona. Sin cargos ocultos.'
                : 'Transparent rates by destination and vehicle type. Price per vehicle, not per person. No hidden charges.'}
            </p>
          </div>

          {/* Included Services Banner */}
          <div className="card p-4 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              {(locale === 'es'
                ? ['Monitoreo de vuelo', 'Agua embotellada', 'A/C', 'Asistencia con equipaje', 'Sin cargos ocultos', 'Asientos para ninos gratis']
                : ['Flight monitoring', 'Bottled water', 'A/C', 'Luggage assistance', 'No hidden fees', 'Free child seats']
              ).map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                  <CheckCircleIcon className="w-4 h-4" /> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Table */}
          {destinations && destinations.length > 0 ? (
            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-navy-700">
                    <th className="text-left p-4 font-semibold">
                      {locale === 'es' ? 'Destino' : 'Destination'}
                    </th>
                    <th className="text-center p-4 font-semibold text-sm text-muted">
                      {locale === 'es' ? 'Tiempo' : 'Time'}
                    </th>
                    {vehicleColumns.map((vehicle) => (
                      <th key={vehicle} className="text-center p-4 font-semibold">
                        <div className="flex items-center justify-center gap-1.5">
                          <TruckIcon className="w-4 h-4 text-brand-500" />
                          {vehicle}
                        </div>
                      </th>
                    ))}
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => {
                    const name = locale === 'es' ? dest.name_es : dest.name_en;
                    const pricing = dest.vehicle_pricing as VehiclePricing[] | null;
                    const pricingMap: Record<string, number> = {};
                    (pricing || []).forEach((vp) => {
                      pricingMap[vp.vehicle_name] = vp.price_usd;
                    });

                    return (
                      <tr key={dest.slug} className="border-b border-gray-100 dark:border-navy-800 hover:bg-gray-50 dark:hover:bg-navy-900/50 transition-colors">
                        <td className="p-4">
                          <Link
                            href={`/${locale}/destinations/${dest.slug}`}
                            className="font-medium hover:text-brand-600 transition-colors"
                          >
                            {name}
                          </Link>
                          {dest.zone && (
                            <span className="block text-xs text-muted">{dest.zone}</span>
                          )}
                        </td>
                        <td className="text-center p-4 text-sm text-muted">
                          {dest.transfer_time || dest.travel_time || '-'}
                        </td>
                        {vehicleColumns.map((vehicle) => (
                          <td key={vehicle} className="text-center p-4">
                            {pricingMap[vehicle] ? (
                              <span className="font-semibold text-brand-600 dark:text-brand-400">
                                ${pricingMap[vehicle]}
                              </span>
                            ) : (
                              <span className="text-gray-300 dark:text-navy-700">-</span>
                            )}
                          </td>
                        ))}
                        <td className="p-4 text-right">
                          <Link
                            href={`/${locale}/destinations/${dest.slug}`}
                            className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                          >
                            {locale === 'es' ? 'Reservar' : 'Book'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted">
              {locale === 'es' ? 'Cargando precios...' : 'Loading prices...'}
            </div>
          )}

          {/* Price Note */}
          <div className="card p-6 mb-12 text-center">
            <p className="text-sm text-muted">
              {locale === 'es'
                ? 'Precios en USD por vehiculo (no por persona). Incluye todos los impuestos, peajes y seguros. Los precios pueden variar segun temporada. Descuento disponible para viaje redondo.'
                : 'Prices in USD per vehicle (not per person). Includes all taxes, tolls, and insurance. Prices may vary by season. Discount available for round trips.'}
            </p>
          </div>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              {locale === 'es' ? 'Preguntas sobre Precios' : 'Pricing Questions'}
            </h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <details key={index} className="group card overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                    <h3 className="text-base font-medium pr-4">{faq.question}</h3>
                  </summary>
                  <div className="px-5 pb-5 text-muted leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center card p-8 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-brand-200 dark:border-brand-800">
            <h2 className="text-2xl font-bold mb-3">
              {locale === 'es' ? 'Listo para reservar?' : 'Ready to book?'}
            </h2>
            <p className="text-muted mb-6">
              {locale === 'es'
                ? 'Reserva tu traslado ahora y asegura el mejor precio.'
                : 'Book your transfer now and secure the best price.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/transfer-booking`}
                className="inline-flex items-center justify-center px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
              >
                {locale === 'es' ? 'Reservar Traslado' : 'Book Transfer'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-900 dark:text-white rounded-lg transition-colors font-medium border border-gray-200 dark:border-navy-600"
              >
                {locale === 'es' ? 'Cotizacion Personalizada' : 'Custom Quote'}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
