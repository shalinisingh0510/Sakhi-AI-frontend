import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'hi', 'bn', 'mr', 'ta', 'te', 'kn', 'gu', 'pa', 'or'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  // Try to get locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Use cookie value if valid, otherwise fallback to default
 const locale: Locale = locales.includes(localeCookie as Locale)
  ? (localeCookie as Locale)
  : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
