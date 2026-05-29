import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing, type Locale } from './i18n/routing';
import { getDefaultLocale } from './lib/geo';

const intlMiddleware = createMiddleware(routing);

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  // Путь уже содержит локаль (/hy, /ru, /en) — отдаём next-intl как есть.
  if (hasLocalePrefix(pathname)) {
    return intlMiddleware(request);
  }

  // Корень или путь без локали: cookie перекрывает гео, иначе — гео по стране.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale: Locale =
    cookieLocale && routing.locales.includes(cookieLocale as Locale)
      ? (cookieLocale as Locale)
      : getDefaultLocale(
          // Vercel Edge geolocation header (req.geo удалён в Next 15)
          request.headers.get('x-vercel-ip-country'),
        );

  const url = nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Пропускаем api, статику next, файлы с расширением
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
