import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { NetIcon, EdgeIcon } from '@/components/icons';
import safetyPhoto from '@/public/photos/safety/01_gyurjyan_security_03.webp';

export function Safety() {
  const t = useTranslations('safety');

  return (
    <section className="section dark-block safety">
      <div className="dark-block__pattern" />
      <div className="container">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark">{t('eyebrow')}</p>
          <h2 className="h-section safety__title">{t('title')}</h2>
        </Reveal>

        <div className="safety-grid">
          <Reveal className="safety-media">
            <Image
              src={safetyPhoto}
              alt={t('imageAlt')}
              placeholder="blur"
              sizes="(max-width: 900px) 100vw, 50vw"
              className="safety-media__img"
            />
          </Reveal>

          <Reveal className="safety-text" delay={0.08}>
            <article className="safety-block">
              <h3 className="safety-block__title">
                <span className="qic">
                  <NetIcon />
                </span>
                {t('block1Title')}
              </h3>
              <p className="safety-block__sub">{t('block1Sub')}</p>
              <p className="safety-block__p">{t('block1Text1')}</p>
              <p className="safety-block__p">{t('block1Text2')}</p>
            </article>

            <article className="safety-block">
              <h3 className="safety-block__title">
                <span className="qic">
                  <EdgeIcon />
                </span>
                {t('block2Title')}
              </h3>
              <p className="safety-block__sub">{t('block2Sub')}</p>
              <p className="safety-block__p">{t('block2Text')}</p>
            </article>

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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
