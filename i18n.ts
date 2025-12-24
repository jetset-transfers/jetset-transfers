import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['es', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the new API
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = 'es'; // Default fallback
  }

  // Load all translation files
  const commonMessages = (await import(`./locales/${locale}/common.json`)).default;
  const homeMessages = (await import(`./locales/${locale}/home.json`)).default;

  return {
    locale,
    messages: {
      ...commonMessages,
      ...homeMessages
    }
  };
});
