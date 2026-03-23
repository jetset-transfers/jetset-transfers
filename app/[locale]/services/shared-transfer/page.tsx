import { Metadata } from 'next';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

interface ServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Traslado Compartido Aeropuerto Cancun | Shuttle Economico | Jetset Transfers',
    en: 'Shared Transfer Cancun Airport | Affordable Shuttle | Jetset Transfers',
  };

  const descriptions = {
    es: 'Servicio de traslado compartido desde el Aeropuerto de Cancun a tu hotel. Opcion economica y comoda, comparte el viaje con otros viajeros. Aire acondicionado, agua incluida, conductores bilingues. Desde $25 USD.',
    en: 'Shared transfer service from Cancun Airport to your hotel. Affordable and comfortable option, share the ride with other travelers. Air conditioning, water included, bilingual drivers. From $25 USD.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'shuttle compartido cancun, traslado compartido aeropuerto cancun, transporte economico cancun, shuttle economico riviera maya, traslado compartido cancun hotel, colectivo aeropuerto cancun'
      : 'shared shuttle cancun, shared transfer cancun airport, affordable transportation cancun, affordable shuttle riviera maya, shared transfer cancun hotel, shuttle cancun airport',
    openGraph: {
      title, description,
      url: `${SITE_URL}/${locale}/services/shared-transfer`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/services/shared-transfer`,
      languages: {
        'es': `${SITE_URL}/es/services/shared-transfer`,
        'en': `${SITE_URL}/en/services/shared-transfer`,
        'x-default': `${SITE_URL}/en/services/shared-transfer`,
      },
    },
  };
}

const content = {
  es: {
    title: 'Traslado Compartido desde el Aeropuerto de Cancun',
    subtitle: 'La opcion mas economica para llegar a tu hotel. Comodo, seguro y accesible.',
    description: 'Nuestro servicio de traslado compartido es la forma mas accesible de llegar del Aeropuerto Internacional de Cancun a tu hotel en la Riviera Maya. Compartes el vehiculo con otros viajeros que se dirigen a la misma zona, lo que permite ofrecer tarifas mas bajas sin sacrificar la comodidad. Ideal para viajeros individuales, parejas o quienes buscan ahorrar en transporte.',
    features: [
      { icon: CurrencyDollarIcon, title: 'Precio Economico', desc: 'La opcion mas accesible para tu traslado. Comparte el costo del viaje con otros pasajeros y ahorra significativamente.' },
      { icon: UserGroupIcon, title: 'Vehiculos Comodos', desc: 'Vans y Sprinters amplias con aire acondicionado, espacio para equipaje y asientos confortables para todos.' },
      { icon: MapPinIcon, title: 'Multiples Destinos', desc: 'Cubrimos las principales zonas hoteleras: Cancun, Playa del Carmen, Tulum, Puerto Morelos y mas.' },
      { icon: SunIcon, title: 'Aire Acondicionado', desc: 'Todos nuestros vehiculos cuentan con aire acondicionado para que viajes fresco y comodo durante todo el trayecto.' },
      { icon: CheckCircleIcon, title: 'Agua Incluida', desc: 'Agua embotellada de cortesia para refrescarte despues de tu vuelo. Tu comodidad es nuestra prioridad.' },
      { icon: ClockIcon, title: 'Conductores Bilingues', desc: 'Nuestros conductores hablan espanol e ingles, facilitando la comunicacion y brindando una experiencia profesional.' },
    ],
    howItWorks: [
      { step: '1', title: 'Reserva en linea', desc: 'Selecciona tu destino y fecha. Recibe confirmacion inmediata con los detalles de tu traslado.' },
      { step: '2', title: 'Punto de encuentro', desc: 'Al llegar al aeropuerto, dirigete al punto de encuentro indicado. Nuestro staff te guiara al vehiculo.' },
      { step: '3', title: 'Viaje compartido', desc: 'Viaja comodamente junto a otros pasajeros hacia tu zona hotelera con paradas breves en ruta.' },
    ],
    faqs: [
      { question: 'Cuantas personas viajan en un traslado compartido?', answer: 'El traslado compartido se realiza en vans o Sprinters con capacidad de 10 a 14 pasajeros. Siempre garantizamos asientos comodos y espacio para tu equipaje.' },
      { question: 'Cuanto tiempo de espera hay en el aeropuerto?', answer: 'La espera maxima es de aproximadamente 30 minutos despues de que todos los pasajeros del grupo se reunan. Coordinamos las salidas para minimizar el tiempo de espera.' },
      { question: 'El traslado compartido hace paradas en el camino?', answer: 'Si, el vehiculo hace paradas en los hoteles de los demas pasajeros que van en la misma ruta. Generalmente son entre 2 y 4 paradas dependiendo del destino.' },
      { question: 'Es seguro el traslado compartido?', answer: 'Absolutamente. Utilizamos los mismos vehiculos y conductores certificados que en nuestros traslados privados. Todos los pasajeros son turistas verificados con reservacion.' },
      { question: 'Puedo llevar equipaje grande?', answer: 'Si, cada pasajero puede llevar una maleta grande y una pieza de equipaje de mano. Si llevas equipaje extra, te recomendamos contactarnos con anticipacion.' },
    ],
    cta: 'Reservar Traslado Compartido',
    compareTitle: 'Compara Nuestros Servicios',
    startingFrom: 'Desde $25 USD',
  },
  en: {
    title: 'Shared Transfer from Cancun Airport',
    subtitle: 'The most affordable way to reach your hotel. Comfortable, safe, and budget-friendly.',
    description: 'Our shared transfer service is the most affordable way to get from Cancun International Airport to your hotel in the Riviera Maya. You share the vehicle with other travelers heading to the same area, which allows us to offer lower rates without sacrificing comfort. Ideal for solo travelers, couples, or anyone looking to save on transportation.',
    features: [
      { icon: CurrencyDollarIcon, title: 'Affordable Pricing', desc: 'The most budget-friendly option for your transfer. Share the ride cost with other passengers and save significantly.' },
      { icon: UserGroupIcon, title: 'Comfortable Vehicles', desc: 'Spacious Vans and Sprinters with air conditioning, luggage space, and comfortable seating for everyone.' },
      { icon: MapPinIcon, title: 'Multiple Destinations', desc: 'We cover all major hotel zones: Cancun, Playa del Carmen, Tulum, Puerto Morelos, and more.' },
      { icon: SunIcon, title: 'Air Conditioning', desc: 'All our vehicles feature air conditioning so you travel cool and comfortable throughout the entire trip.' },
      { icon: CheckCircleIcon, title: 'Water Included', desc: 'Complimentary bottled water to refresh you after your flight. Your comfort is our priority.' },
      { icon: ClockIcon, title: 'Bilingual Drivers', desc: 'Our drivers speak both Spanish and English, ensuring smooth communication and a professional experience.' },
    ],
    howItWorks: [
      { step: '1', title: 'Book Online', desc: 'Select your destination and date. Receive instant confirmation with your transfer details.' },
      { step: '2', title: 'Meeting Point', desc: 'Upon arrival at the airport, head to the designated meeting point. Our staff will guide you to the vehicle.' },
      { step: '3', title: 'Shared Ride', desc: 'Travel comfortably alongside other passengers to your hotel zone with brief stops along the route.' },
    ],
    faqs: [
      { question: 'How many people travel in a shared transfer?', answer: 'Shared transfers are operated in vans or Sprinters with capacity for 10 to 14 passengers. We always guarantee comfortable seats and space for your luggage.' },
      { question: 'How long is the wait at the airport?', answer: 'The maximum wait is approximately 30 minutes after all group passengers have gathered. We coordinate departures to minimize waiting time.' },
      { question: 'Does the shared transfer make stops along the way?', answer: 'Yes, the vehicle makes stops at other passengers\' hotels along the same route. There are typically 2 to 4 stops depending on the destination.' },
      { question: 'Is the shared transfer safe?', answer: 'Absolutely. We use the same vehicles and certified drivers as our private transfers. All passengers are verified tourists with reservations.' },
      { question: 'Can I bring large luggage?', answer: 'Yes, each passenger can bring one large suitcase and one carry-on piece. If you have extra luggage, we recommend contacting us in advance.' },
    ],
    cta: 'Book Shared Transfer',
    compareTitle: 'Compare Our Services',
    startingFrom: 'From $25 USD',
  },
};

export default async function SharedTransferPage({ params }: ServicePageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content.es;

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Servicios' : 'Services', url: `/${locale}/services/shared-transfer` },
        { name: locale === 'es' ? 'Traslado Compartido' : 'Shared Transfer', url: `/${locale}/services/shared-transfer` },
      ]} />
      <FAQSchema faqs={t.faqs} />

      <main className="min-h-screen pt-28 md:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
              {t.startingFrom}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-6">{t.subtitle}</p>
            <Link
              href={`/${locale}/transfer-booking`}
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium text-lg"
            >
              {t.cta}
            </Link>
          </div>

          {/* Description */}
          <section className="mb-16">
            <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto text-center">{t.description}</p>
          </section>

          {/* Features */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.map((feature, index) => (
                <div key={index} className="card p-6">
                  <feature.icon className="w-8 h-8 text-brand-500 mb-3" />
                  <h2 className="font-semibold text-lg mb-2">{feature.title}</h2>
                  <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it Works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              {locale === 'es' ? 'Como Funciona' : 'How It Works'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              {locale === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {t.faqs.map((faq, index) => (
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

          {/* Compare Services */}
          <section className="text-center card p-8 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-brand-200 dark:border-brand-800">
            <h2 className="text-xl font-bold mb-4">{t.compareTitle}</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/${locale}/services/private-transfer`} className="px-5 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-600 hover:border-brand-500 transition-colors font-medium text-sm">
                {locale === 'es' ? 'Traslado Privado' : 'Private Transfer'}
              </Link>
              <Link href={`/${locale}/services/vip-transfer`} className="px-5 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-600 hover:border-brand-500 transition-colors font-medium text-sm">
                {locale === 'es' ? 'Traslado VIP' : 'VIP Transfer'}
              </Link>
              <Link href={`/${locale}/pricing`} className="px-5 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-600 hover:border-brand-500 transition-colors font-medium text-sm">
                {locale === 'es' ? 'Ver Precios' : 'View Prices'}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
