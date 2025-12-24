import { createClient } from '@/lib/supabase/server';
import LegalPageContent from '@/components/legal/LegalPageContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('legal_pages')
    .select('title_es, title_en')
    .eq('slug', 'terms')
    .single();

  const title = locale === 'es'
    ? page?.title_es || 'Términos y Condiciones'
    : page?.title_en || 'Terms and Conditions';

  const fullTitle = `${title} | Jetset Transfers`;
  const description = locale === 'es'
    ? 'Términos y condiciones de uso de los servicios de traslados privados de Jetset Transfers en Cancún y Riviera Maya.'
    : 'Terms and conditions of use for Jetset Transfers private transportation services in Cancún and Riviera Maya.';

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `https://www.jetsetcancun.com/${locale}/terms`,
      siteName: 'Jetset Transfers',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.jetsetcancun.com/${locale}/terms`,
      languages: {
        'es': 'https://www.jetsetcancun.com/es/terms',
        'en': 'https://www.jetsetcancun.com/en/terms',
        'x-default': 'https://www.jetsetcancun.com/en/terms',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', 'terms')
    .single();

  return (
    <LegalPageContent
      locale={locale}
      page={page}
      fallbackTitle={{ es: 'Términos y Condiciones', en: 'Terms and Conditions' }}
    />
  );
}
