import { getRequestConfig } from 'next-intl/server';
import { locales, Locale, defaultLocale } from './lib/i18n-config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: Locale = locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
