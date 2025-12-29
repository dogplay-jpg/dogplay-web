export const locales = ['en', 'hi'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

export const localePrefixes: Record<Locale, string> = {
  en: '',
  hi: '/hi',
};
