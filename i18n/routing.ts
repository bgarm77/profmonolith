import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hy', 'ru', 'en'],
  defaultLocale: 'hy',
  // префикс локали всегда в URL: /hy, /ru, /en
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
