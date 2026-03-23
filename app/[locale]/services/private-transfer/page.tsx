import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  WifiIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Traslado Privado Aeropuerto Cancun | Transporte Exclusivo | Jetset Transfers',
    en: 'Private Transfer Cancun Airport | Exclusive Transportation | Jetset Transfers',
  };

  const descriptions = {
    es: 'Servicio de traslado privado desde el Aeropuerto de Cancun a tu hotel. Vehiculo exclusivo para tu grupo, sin paradas. Monitoreo de vuelo, agua incluida, conductores bilingues. Desde $55 USD.',
    en: 'Private transfer service from Cancun Airport to your hotel. Exclusive vehicle for your group, no stops. Flight monitoring, water included, bilingual drivers. From $55 USD.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'traslado privado cancun, transporte privado aeropuerto cancun, taxi privado cancun aeropuerto, shuttle privado riviera maya, transfer privado cancun hotel'
      : 'private transfer cancun, private transportation cancun airport, private taxi cancun airport, private shuttle riviera maya, private transfer cancun hotel',
    openGraph: {
      title, description,
      url: `${SITE_URL}/${locale}/services/private-transfer`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/services/private-transfer`,
      languages: {
        'es': `${SITE_URL}/es/services/private-transfer`,
        'en': `${SITE_URL}/en/services/private-transfer`,
        'x-default': `${SITE_URL}/en/services/private-transfer`,
      },
    },
  };
}

const content = {
  es: {
    title: 'Traslado Privado desde el Aeropuerto de Cancun',
    subtitle: 'Transporte exclusivo para tu grupo. Sin paradas, sin compartir, sin esperas.',
    description: 'Nuestro servicio de traslado privado te ofrece un vehiculo exclusivo desde el Aeropuerto Internacional de Cancun directamente a tu hotel o destino en la Riviera Maya. Es la opcion ideal para familias, parejas y grupos que valoran la comodidad, privacidad y un servicio personalizado.',
    features: [
      { icon: UserGroupIcon, title: 'Vehiculo Exclusivo', desc: 'El vehiculo es solo para tu grupo. Sin compartir con desconocidos ni hacer paradas en otros hoteles.' },
      { icon: ClockIcon, title: 'Monitoreo de Vuelo', desc: 'Rastreamos tu vuelo en tiempo real. Si se retrasa, ajustamos la recogida sin costo extra.' },
      { icon: ShieldCheckIcon, title: 'Conductor Certificado', desc: 'Conductores bilingues, verificados y con anos de experiencia en la ruta aeropuerto-hotel.' },
      { icon: MapPinIcon, title: 'Puerta a Puerta', desc: 'Te recogemos en el aeropuerto y te llevamos directamente a la puerta de tu hotel.' },
      { icon: WifiIcon, title: 'Comodidades Incluidas', desc: 'Agua embotellada, aire acondicionado, amplio espacio para equipaje y Wi-Fi en vehiculos seleccionados.' },
      { icon: CheckCircleIcon, title: 'Precio Fijo', desc: 'Sin sorpresas. El precio que ves es lo que pagas. Sin cargos ocultos ni tarifas adicionales.' },
    ],
    howItWorks: [
      { step: '1', title: 'Reserva en linea', desc: 'Selecciona tu destino, fecha y vehiculo. Recibe confirmacion inmediata.' },
      { step: '2', title: 'Llegada al aeropuerto', desc: 'Tu conductor te espera con un letrero personalizado afuera de la terminal.' },
      { step: '3', title: 'Viaje directo', desc: 'Relajate mientras te llevamos directamente a tu hotel sin paradas intermedias.' },
    ],
    faqs: [
      { question: 'Cuantas personas caben en un traslado privado?', answer: 'Depende del vehiculo: SUV hasta 5 pasajeros, Van hasta 10 pasajeros, Sprinter hasta 14 pasajeros. Todos con espacio amplio para equipaje.' },
      { question: 'Puedo hacer paradas durante el traslado?', answer: 'El traslado privado es directo del aeropuerto a tu hotel. Sin embargo, podemos acomodar una parada corta (como una tienda de conveniencia) sin costo adicional si lo solicitas.' },
      { question: 'Que pasa si mi vuelo se retrasa?', answer: 'Monitoreamos tu vuelo en tiempo real. Si se retrasa, ajustamos la hora de recogida automaticamente sin ningun cargo extra.' },
    ],
    cta: 'Reservar Traslado Privado',
    compareTitle: 'Compara Nuestros Servicios',
    startingFrom: 'Desde $55 USD',
  },
  en: {
    title: 'Private Transfer from Cancun Airport',
    subtitle: 'Exclusive transportation for your group. No stops, no sharing, no waiting.',
    description: 'Our private transfer service offers you an exclusive vehicle from Cancun International Airport directly to your hotel or destination in the Riviera Maya. It\'s the ideal option for families, couples, and groups who value comfort, privacy, and personalized service.',
    features: [
      { icon: UserGroupIcon, title: 'Exclusive Vehicle', desc: 'The vehicle is only for your group. No sharing with strangers or stops at other hotels.' },
      { icon: ClockIcon, title: 'Flight Monitoring', desc: 'We track your flight in real-time. If delayed, we adjust pickup at no extra cost.' },
      { icon: ShieldCheckIcon, title: 'Certified Driver', desc: 'Bilingual, verified drivers with years of experience on the airport-hotel route.' },
      { icon: MapPinIcon, title: 'Door to Door', desc: 'We pick you up at the airport and take you directly to your hotel door.' },
      { icon: WifiIcon, title: 'Amenities Included', desc: 'Bottled water, air conditioning, ample luggage space, and Wi-Fi in select vehicles.' },
      { icon: CheckCircleIcon, title: 'Fixed Price', desc: 'No surprises. The price you see is what you pay. No hidden charges or additional fees.' },
    ],
    howItWorks: [
      { step: '1', title: 'Book Online', desc: 'Select your destination, date, and vehicle. Receive instant confirmation.' },
      { step: '2', title: 'Airport Arrival', desc: 'Your driver waits with a personalized sign outside the terminal.' },
      { step: '3', title: 'Direct Ride', desc: 'Relax while we take you directly to your hotel with no intermediate stops.' },
    ],
    faqs: [
      { question: 'How many people fit in a private transfer?', answer: 'It depends on the vehicle: SUV up to 5 passengers, Van up to 10 passengers, Sprinter up to 14 passengers. All with ample luggage space.' },
      { question: 'Can I make stops during the transfer?', answer: 'The private transfer is direct from airport to hotel. However, we can accommodate a short stop (like a convenience store) at no additional cost upon request.' },
      { question: 'What happens if my flight is delayed?', answer: 'We monitor your flight in real-time. If delayed, we automatically adjust the pickup time at no extra charge.' },
    ],
    cta: 'Book Private Transfer',
    compareTitle: 'Compare Our Services',
    startingFrom: 'From $55 USD',
  },
};

export default async function PrivateTransferPage({ params }: ServicePageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content.es;

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Servicios' : 'Services', url: `/${locale}/services/private-transfer` },
        { name: locale === 'es' ? 'Traslado Privado' : 'Private Transfer', url: `/${locale}/services/private-transfer` },
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
              <Link href={`/${locale}/services/shared-transfer`} className="px-5 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-600 hover:border-brand-500 transition-colors font-medium text-sm">
                {locale === 'es' ? 'Traslado Compartido' : 'Shared Transfer'}
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
