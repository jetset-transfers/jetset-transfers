import { Metadata } from 'next';
import { BreadcrumbSchema, OrganizationSchema } from '@/components/seo/SchemaMarkup';
import { SITE_URL, getContactInfo } from '@/lib/seo';
import { getYearsOfExperience, getYearsOfExperienceFormatted, FOUNDING_YEAR } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  TruckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Sobre Nosotros | Jetset Transfers - Transporte Privado en Cancun',
    en: 'About Us | Jetset Transfers - Private Transportation in Cancun',
  };

  const descriptions = {
    es: `Conoce a Jetset Transfers, empresa de transporte privado en Cancun con ${getYearsOfExperienceFormatted()} anos de experiencia. Traslados seguros y puntuales desde el Aeropuerto de Cancun a la Riviera Maya.`,
    en: `Meet Jetset Transfers, a private transportation company in Cancun with ${getYearsOfExperienceFormatted()} years of experience. Safe and punctual transfers from Cancun Airport to the Riviera Maya.`,
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'sobre jetset transfers, empresa transporte cancun, quienes somos jetset, transporte privado cancun empresa'
      : 'about jetset transfers, cancun transportation company, who we are jetset, private transport cancun company',
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/about`,
      siteName: 'Jetset Transfers',
      images: [{ url: `${SITE_URL}/images/og/og-image.jpg`, width: 1200, height: 630 }],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        'es': `${SITE_URL}/es/about`,
        'en': `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/en/about`,
      },
    },
  };
}

const content = {
  es: {
    title: 'Sobre Jetset Transfers',
    subtitle: 'Tu socio de confianza para traslados en Cancun y la Riviera Maya',
    story: {
      title: 'Nuestra Historia',
      p1: `Fundada en ${FOUNDING_YEAR} en Cancun, Quintana Roo, Jetset Transfers nacio con una mision clara: transformar la experiencia de transporte terrestre para viajeros que visitan la Riviera Maya.`,
      p2: 'Observamos que muchos turistas enfrentaban incertidumbre y preocupacion al llegar al Aeropuerto de Cancun, sin saber si su transporte seria seguro, puntual o comodo. Decidimos cambiar eso.',
      p3: `Hoy, con mas de ${getYearsOfExperienceFormatted()} anos de experiencia y miles de traslados realizados, somos una de las empresas de transporte privado mas confiables de la region, con una calificacion de 4.9 estrellas en TripAdvisor.`,
    },
    mission: {
      title: 'Nuestra Mision',
      text: 'Proporcionar transporte terrestre seguro, privado y puntual que haga que cada viajero se sienta bienvenido desde el momento en que aterriza en Cancun.',
    },
    vision: {
      title: 'Nuestra Vision',
      text: 'Ser la empresa de traslados mas reconocida y confiable de la Peninsula de Yucatan, conocida por la excelencia en servicio y la satisfaccion total de nuestros clientes.',
    },
    values: [
      { icon: ShieldCheckIcon, title: 'Seguridad', desc: 'Conductores certificados, vehiculos asegurados y mantenimiento constante. Tu seguridad es nuestra prioridad numero uno.' },
      { icon: ClockIcon, title: 'Puntualidad', desc: 'Monitoreamos vuelos en tiempo real y siempre estamos listos para recibirte. Sin importar la hora, estamos ahi.' },
      { icon: UserGroupIcon, title: 'Servicio Personalizado', desc: 'Cada viajero es unico. Adaptamos nuestro servicio a tus necesidades especificas, desde asientos para ninos hasta solicitudes especiales.' },
      { icon: StarIcon, title: 'Excelencia', desc: 'No nos conformamos con lo bueno, buscamos lo excepcional. Por eso mantenemos una calificacion de 4.9 estrellas.' },
      { icon: TruckIcon, title: 'Flota Moderna', desc: 'Vehiculos nuevos y bien mantenidos con aire acondicionado, espacio amplio para equipaje y comodidades de primera.' },
      { icon: GlobeAltIcon, title: 'Bilingue', desc: 'Todos nuestros conductores hablan espanol e ingles, asegurando comunicacion clara con viajeros internacionales.' },
    ],
    stats: [
      { value: `${getYearsOfExperience()}+`, label: 'Anos de experiencia' },
      { value: '4.9', label: 'Estrellas en TripAdvisor' },
      { value: '24/7', label: 'Disponibilidad' },
      { value: '150+', label: 'Resenas positivas' },
    ],
    cta: {
      title: 'Listo para tu proximo viaje?',
      text: 'Reserva tu traslado y descubre por que miles de viajeros confian en nosotros.',
      primary: 'Reservar Traslado',
      secondary: 'Contactanos',
    },
  },
  en: {
    title: 'About Jetset Transfers',
    subtitle: 'Your trusted partner for transfers in Cancun and the Riviera Maya',
    story: {
      title: 'Our Story',
      p1: `Founded in ${FOUNDING_YEAR} in Cancun, Quintana Roo, Jetset Transfers was born with a clear mission: to transform the ground transportation experience for travelers visiting the Riviera Maya.`,
      p2: 'We noticed that many tourists faced uncertainty and concern when arriving at Cancun Airport, not knowing if their transportation would be safe, punctual, or comfortable. We decided to change that.',
      p3: `Today, with over ${getYearsOfExperienceFormatted()} years of experience and thousands of completed transfers, we are one of the most trusted private transportation companies in the region, with a 4.9-star rating on TripAdvisor.`,
    },
    mission: {
      title: 'Our Mission',
      text: 'To provide safe, private, and punctual ground transportation that makes every traveler feel welcome from the moment they land in Cancun.',
    },
    vision: {
      title: 'Our Vision',
      text: 'To be the most recognized and trusted transfer company in the Yucatan Peninsula, known for service excellence and total customer satisfaction.',
    },
    values: [
      { icon: ShieldCheckIcon, title: 'Safety', desc: 'Certified drivers, insured vehicles, and constant maintenance. Your safety is our number one priority.' },
      { icon: ClockIcon, title: 'Punctuality', desc: 'We monitor flights in real-time and are always ready to welcome you. No matter the time, we are there.' },
      { icon: UserGroupIcon, title: 'Personalized Service', desc: 'Every traveler is unique. We adapt our service to your specific needs, from child seats to special requests.' },
      { icon: StarIcon, title: 'Excellence', desc: 'We don\'t settle for good, we strive for exceptional. That\'s why we maintain a 4.9-star rating.' },
      { icon: TruckIcon, title: 'Modern Fleet', desc: 'New and well-maintained vehicles with air conditioning, ample luggage space, and first-class amenities.' },
      { icon: GlobeAltIcon, title: 'Bilingual', desc: 'All our drivers speak Spanish and English, ensuring clear communication with international travelers.' },
    ],
    stats: [
      { value: `${getYearsOfExperience()}+`, label: 'Years of experience' },
      { value: '4.9', label: 'Stars on TripAdvisor' },
      { value: '24/7', label: 'Availability' },
      { value: '150+', label: 'Positive reviews' },
    ],
    cta: {
      title: 'Ready for your next trip?',
      text: 'Book your transfer and discover why thousands of travelers trust us.',
      primary: 'Book Transfer',
      secondary: 'Contact Us',
    },
  },
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content.es;
  const supabase = await createClient();
  const contactInfo = await getContactInfo(supabase);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
        { name: locale === 'es' ? 'Sobre Nosotros' : 'About Us', url: `/${locale}/about` },
      ]} />
      <OrganizationSchema locale={locale} contactInfo={contactInfo} />

      <main className="min-h-screen pt-28 md:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          {/* Story Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{t.story.title}</h2>
            <div className="space-y-4 text-muted leading-relaxed text-lg">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              <p>{t.story.p3}</p>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {t.stats.map((stat, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16 grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-3 text-brand-600 dark:text-brand-400">{t.mission.title}</h2>
              <p className="text-muted leading-relaxed">{t.mission.text}</p>
            </div>
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-3 text-brand-600 dark:text-brand-400">{t.vision.title}</h2>
              <p className="text-muted leading-relaxed">{t.vision.text}</p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {locale === 'es' ? 'Nuestros Valores' : 'Our Values'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.values.map((value, index) => (
                <div key={index} className="card p-6">
                  <value.icon className="w-8 h-8 text-brand-500 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center card p-10 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-brand-200 dark:border-brand-800">
            <h2 className="text-2xl font-bold mb-3">{t.cta.title}</h2>
            <p className="text-muted mb-6 max-w-lg mx-auto">{t.cta.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/transfer-booking`}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
              >
                {t.cta.primary}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-900 dark:text-white rounded-lg transition-colors font-medium border border-gray-200 dark:border-navy-600"
              >
                {t.cta.secondary}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
