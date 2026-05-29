import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'PROFMONOLITH';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Берём описание напрямую из messages (без next-intl-хуков — это route, не компонент страницы)
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default as {
    meta: { description: string };
  };
  const description = messages.meta.description;

  const logo = await readFile(join(process.cwd(), 'public/logos/logo-white.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: 'linear-gradient(135deg, #0d1822 0%, #204266 100%)',
          color: '#fff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="PROFMONOLITH" width={640} style={{ marginBottom: 48 }} />
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            lineHeight: 1.25,
            maxWidth: 980,
            color: '#dfe6ec',
            display: 'flex',
          }}
        >
          {description}
        </div>
      </div>
    ),
    size,
  );
}
