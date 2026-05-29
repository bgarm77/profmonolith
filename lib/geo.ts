import type { Locale } from '@/i18n/routing';

/**
 * Дефолтный язык по стране (Vercel Edge geolocation).
 * AM → армянский; страны СНГ/постсоветские → русский; остальное → английский.
 */
export function getDefaultLocale(country?: string | null): Locale {
  if (!country) return 'hy';
  if (country === 'AM') return 'hy';
  if (['RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'MD', 'UA', 'GE'].includes(country)) return 'ru';
  return 'en';
}
