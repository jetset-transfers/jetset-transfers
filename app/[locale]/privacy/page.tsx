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
    .eq('slug', 'privacy')
    .single();

  const title = locale === 'es'
    ? page?.title_es || 'Aviso de Privacidad'
    : page?.title_en || 'Privacy Policy';

  const fullTitle = `${title} | Jetset Transfers`;
  const description = locale === 'es'
    ? 'Política de privacidad y protección de datos personales de Jetset Transfers. Conoce cómo protegemos tu información.'
    : 'Privacy policy and personal data protection of Jetset Transfers. Learn how we protect your information.';

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `https://www.jetsetcancun.com/${locale}/privacy`,
      siteName: 'Jetset Transfers',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.jetsetcancun.com/${locale}/privacy`,
      languages: {
        'es': 'https://www.jetsetcancun.com/es/privacy',
        'en': 'https://www.jetsetcancun.com/en/privacy',
        'x-default': 'https://www.jetsetcancun.com/en/privacy',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('legal_pages')
    .select('*')
    .eq('slug', 'privacy')
    .single();

  return (
    <LegalPageContent
      locale={locale}
      page={page}
      fallbackTitle={{ es: 'Aviso de Privacidad', en: 'Privacy Policy' }}
    />
  );
}
