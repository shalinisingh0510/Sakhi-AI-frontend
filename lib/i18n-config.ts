export const locales = ['en', 'hi', 'bn', 'mr', 'ta', 'te', 'kn', 'gu', 'pa', 'or'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
