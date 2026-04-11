import { Metadata } from 'next';
import Link from 'next/link';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface CancelPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CancelPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'es'
      ? 'Pago Cancelado | Jetset Transfers'
      : 'Payment Cancelled | Jetset Transfers',
    robots: { index: false, follow: true },
  };
}

const translations = {
  es: {
    title: 'Pago Cancelado',
    subtitle: 'Tu pago no se completó',
    description: 'No te preocupes, no se realizó ningún cargo a tu tarjeta. Puedes intentar nuevamente cuando estés listo.',
    tryAgain: 'Intentar de nuevo',
    backToHome: 'Volver al inicio',
    needHelp: '¿Necesitas ayuda?',
    contactUs: 'Contáctanos si tienes alguna pregunta',
  },
  en: {
    title: 'Payment Cancelled',
    subtitle: 'Your payment was not completed',
    description: "Don't worry, no charges were made to your card. You can try again when you're ready.",
    tryAgain: 'Try again',
    backToHome: 'Back to home',
    needHelp: 'Need help?',
    contactUs: 'Contact us if you have any questions',
  },
};

export default async function CancelPage({ params }: CancelPageProps) {
  const { locale } = await params;
  const t = translations[locale as keyof typeof translations] || translations.es;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
          <XCircleIcon className="w-12 h-12 text-orange-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {t.subtitle}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          {t.description}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t.tryAgain}
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-navy-800 hover:bg-gray-300 dark:hover:bg-navy-700 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            {t.backToHome}
          </Link>
        </div>

        {/* Help section */}
        <div className="pt-6 border-t border-gray-200 dark:border-navy-700">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            {t.needHelp}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="text-brand-500 hover:text-brand-600 font-medium"
          >
            {t.contactUs}
          </Link>
        </div>
      </div>
    </div>
  );
}
