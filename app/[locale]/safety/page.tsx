import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { site } from '@/lib/site';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import safetyPhoto from '@/public/photos/safety/01_gyurjyan_security_03.webp';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'safety' });
  const url = `${site.url}/${locale}/safety`;

  return {
    title: `${t('title')} — ${site.name}`,
    alternates: {
      canonical: url,
      languages: {
        hy: `${site.url}/hy/safety`,
        ru: `${site.url}/ru/safety`,
        en: `${site.url}/en/safety`,
        'x-default': `${site.url}/hy/safety`,
      },
    },
  };
}

export default async function SafetyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'safety' });

  return (
    <>
      <Header />
      <main>
        <section className="section safety-page">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{t('eyebrow')}</p>
              <h1 className="h-section">{t('title')}</h1>
            </div>

            <div className="safety-grid">
              <div className="safety-media">
                <Image
                  src={safetyPhoto}
                  alt={t('imageAlt')}
                  placeholder="blur"
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="safety-media__img"
                  priority
                />
              </div>

              <div className="safety-text">
                <article className="safety-block">
                  <h2 className="safety-block__title">{t('block1Title')}</h2>
                  <p className="safety-block__sub">{t('block1Sub')}</p>
                  <p className="safety-block__p">{t('block1Text1')}</p>
                  <p className="safety-block__p">{t('block1Text2')}</p>
                </article>

                <article className="safety-block">
                  <h2 className="safety-block__title">{t('block2Title')}</h2>
                  <p className="safety-block__sub">{t('block2Sub')}</p>
                  <p className="safety-block__p">{t('block2Text')}</p>
                </article>
              </div>
            </div>

            <div className="safety-stats">
              <div className="safety-stat">
                <div className="safety-stat__num">{t('statAccidentsValue')}</div>
                <div className="safety-stat__lab">{t('statAccidents')}</div>
              </div>
              <div className="safety-stat">
                <div className="safety-stat__num">{t('statYearsValue')}</div>
                <div className="safety-stat__lab">{t('statYears')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
