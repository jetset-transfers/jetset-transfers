import { Metadata } from 'next';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import {
  StarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface ServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Traslado VIP Aeropuerto Cancun | Transporte de Lujo | Jetset Transfers',
    en: 'VIP Transfer Cancun Airport | Luxury Transportation | Jetset Transfers',
  };

  const descriptions = {
    es: 'Servicio de traslado VIP desde el Aeropuerto de Cancun. Vehiculos premium, amenidades de lujo, servicio ejecutivo y atencion personalizada. La mejor experiencia de transporte. Desde $100 USD.',
    en: 'VIP transfer service from Cancun Airport. Premium vehicles, luxury amenities, executive service and personalized attention. The best transportation experience. From $100 USD.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'vip transfer cancun, transporte de lujo cancun, traslado vip aeropuerto cancun, transporte premium cancun, servicio ejecutivo cancun, luxury transfer cancun'
      : 'vip transfer cancun, luxury transfer cancun, premium transport cancun, vip transportation cancun airport, executive transfer riviera maya, luxury shuttle cancun',
    openGraph: {
      title, description,
      url: `${SITE_URL}/${locale}/services/vip-transfer`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/services/vip-transfer`,
      languages: {
        'es': `${SITE_URL}/es/services/vip-transfer`,
        'en': `${SITE_URL}/en/services/vip-transfer`,
        'x-default': `${SITE_URL}/en/services/vip-transfer`,
      },
    },
  };
}

const content = {
  es: {
    title: 'Traslado VIP desde el Aeropuerto de Cancun',
    subtitle: 'La experiencia premium que mereces. Vehiculos de lujo, amenidades exclusivas y servicio de primer nivel.',
    description: 'Nuestro servicio de traslado VIP esta disenado para viajeros que buscan lo mejor de lo mejor. Disfruta de vehiculos premium, bebidas de cortesia, servicio de meet & greet exclusivo y atencion personalizada desde el momento en que aterrizas. Ideal para ocasiones especiales, viajes de negocios o para quienes simplemente quieren una experiencia superior.',
    features: [
      { icon: StarIcon, title: 'Vehiculos Premium', desc: 'Vehiculos de lujo con interiores de piel, amplio espacio y la mas alta calidad. SUVs premium y Suburbans de ultima generacion.' },
      { icon: SparklesIcon, title: 'Amenidades de Lujo', desc: 'Bebidas frias, agua premium, toallas refrescantes y cargadores para tus dispositivos. Todo pensado para tu comodidad.' },
      { icon: ShieldCheckIcon, title: 'Servicio Ejecutivo', desc: 'Conductores profesionales con vestimenta ejecutiva, trato impecable y anos de experiencia en servicio de alta gama.' },
      { icon: UserGroupIcon, title: 'Meet & Greet Premium', desc: 'Recepcion personalizada dentro de la terminal del aeropuerto con letrero con tu nombre y asistencia con el equipaje.' },
      { icon: ClockIcon, title: 'Servicio Prioritario', desc: 'Atencion prioritaria, sin esperas. Tu vehiculo esta listo al momento de tu llegada con ajuste automatico por retrasos de vuelo.' },
      { icon: CheckCircleIcon, title: 'Solicitudes Especiales', desc: 'Decoracion para ocasiones especiales, sillas para bebes, champana o cualquier detalle adicional que necesites.' },
    ],
    howItWorks: [
      { step: '1', title: 'Reserva tu experiencia VIP', desc: 'Selecciona tu destino, fecha y anade cualquier solicitud especial. Confirmacion inmediata.' },
      { step: '2', title: 'Recepcion en la terminal', desc: 'Tu chofer te recibe dentro de la terminal con un letrero personalizado y te asiste con el equipaje.' },
      { step: '3', title: 'Viaje de lujo', desc: 'Disfruta de un traslado directo en un vehiculo premium con todas las amenidades incluidas.' },
    ],
    faqs: [
      { question: 'Que hace diferente al traslado VIP del privado?', answer: 'El traslado VIP incluye vehiculos de gama superior (SUVs premium, Suburbans), recepcion dentro de la terminal del aeropuerto, bebidas de cortesia, toallas refrescantes y un conductor con vestimenta ejecutiva. Es la experiencia mas exclusiva que ofrecemos.' },
      { question: 'Que amenidades estan incluidas en el servicio VIP?', answer: 'El servicio VIP incluye bebidas frias (agua, refrescos), toallas refrescantes, cargadores USB, Wi-Fi, meet & greet dentro de la terminal y asistencia completa con el equipaje. Para solicitudes adicionales como champana o decoracion especial, contactanos al reservar.' },
      { question: 'Puedo solicitar detalles especiales para una ocasion?', answer: 'Si. Ofrecemos personalizacion completa para lunas de miel, cumpleanos, aniversarios o viajes corporativos. Podemos incluir champana, arreglos florales, carteles personalizados y mas. Solo indicalo al momento de tu reserva.' },
      { question: 'Que vehiculos se utilizan para el servicio VIP?', answer: 'Utilizamos vehiculos premium como SUVs de lujo (Suburban, Escalade) y Vans ejecutivas con interiores de piel, amplio espacio y la mejor tecnologia de confort. Todos nuestros vehiculos VIP estan impecablemente mantenidos.' },
    ],
    cta: 'Reservar Traslado VIP',
    compareTitle: 'Compara Nuestros Servicios',
    startingFrom: 'Desde $100 USD',
  },
  en: {
    title: 'VIP Transfer from Cancun Airport',
    subtitle: 'The premium experience you deserve. Luxury vehicles, exclusive amenities, and top-tier service.',
    description: 'Our VIP transfer service is designed for travelers who seek the best of the best. Enjoy premium vehicles, complimentary drinks, exclusive meet & greet service, and personalized attention from the moment you land. Ideal for special occasions, business travel, or for those who simply want a superior experience.',
    features: [
      { icon: StarIcon, title: 'Premium Vehicles', desc: 'Luxury vehicles with leather interiors, ample space, and the highest quality. Premium SUVs and latest-generation Suburbans.' },
      { icon: SparklesIcon, title: 'Luxury Amenities', desc: 'Cold beverages, premium water, refreshing towels, and chargers for your devices. Everything designed for your comfort.' },
      { icon: ShieldCheckIcon, title: 'Executive Service', desc: 'Professional drivers in executive attire, impeccable treatment, and years of experience in high-end service.' },
      { icon: UserGroupIcon, title: 'Premium Meet & Greet', desc: 'Personalized reception inside the airport terminal with a name sign and full luggage assistance.' },
      { icon: ClockIcon, title: 'Priority Service', desc: 'Priority attention, no waiting. Your vehicle is ready upon arrival with automatic adjustment for flight delays.' },
      { icon: CheckCircleIcon, title: 'Special Requests', desc: 'Decoration for special occasions, baby seats, champagne, or any additional detail you may need.' },
    ],
    howItWorks: [
      { step: '1', title: 'Book Your VIP Experience', desc: 'Select your destination, date, and add any special requests. Instant confirmation.' },
      { step: '2', title: 'Terminal Reception', desc: 'Your chauffeur meets you inside the terminal with a personalized sign and assists with your luggage.' },
      { step: '3', title: 'Luxury Ride', desc: 'Enjoy a direct transfer in a premium vehicle with all amenities included.' },
    ],
    faqs: [
      { question: 'What makes the VIP transfer different from a private transfer?', answer: 'The VIP transfer includes higher-end vehicles (premium SUVs, Suburbans), reception inside the airport terminal, complimentary beverages, refreshing towels, and a driver in executive attire. It is the most exclusive experience we offer.' },
      { question: 'What amenities are included in the VIP service?', answer: 'The VIP service includes cold beverages (water, soft drinks), refreshing towels, USB chargers, Wi-Fi, meet & greet inside the terminal, and full luggage assistance. For additional requests like champagne or special decoration, contact us when booking.' },
      { question: 'Can I request special details for an occasion?', answer: 'Yes. We offer full customization for honeymoons, birthdays, anniversaries, or corporate travel. We can include champagne, floral arrangements, personalized signs, and more. Just let us know when booking.' },
      { question: 'What vehicles are used for VIP service?', answer: 'We use premium vehicles such as luxury SUVs (Suburban, Escalade) and executive Vans with leather interiors, ample space, and the best comfort technology. All our VIP vehicles are impeccably maintained.' },
    ],
    cta: 'Book VIP Transfer',
    compareTitle: 'Compare Our Services',
    startingFrom: 'From $100 USD',
  },
};

export default async function VipTransferPage({ params }: ServicePageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content.es;

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Servicios' : 'Services', url: `/${locale}/services/vip-transfer` },
        { name: locale === 'es' ? 'Traslado VIP' : 'VIP Transfer', url: `/${locale}/services/vip-transfer` },
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
              <Link href={`/${locale}/services/shared-transfer`} className="px-5 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-600 hover:border-brand-500 transition-colors font-medium text-sm">
                {locale === 'es' ? 'Traslado Compartido' : 'Shared Transfer'}
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
