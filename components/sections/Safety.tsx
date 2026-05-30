import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/Reveal';
import { NetIcon, EdgeIcon } from '@/components/icons';
import { SafetyGallery } from '@/components/ui/SafetyGallery';
import { getProjectPhotosWithDims } from '@/lib/projects';

export async function Safety() {
  const t = await getTranslations('safety');
  const tp = await getTranslations('projects');
  // Обложкой блока всегда стоит это фото; остальные доступны в лайтбоксе.
  const COVER = '01_gyurjyan_security_03.webp';
  const all = await getProjectPhotosWithDims('safety');
  const photos = [...all].sort((a, b) => {
    if (a.src.endsWith(COVER)) return -1;
    if (b.src.endsWith(COVER)) return 1;
    return 0;
  });

  return (
    <section className="section dark-block safety">
      <div className="dark-block__pattern" />
      <div className="container">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark">{t('eyebrow')}</p>
          <h2 className="h-section safety__title">{t('title')}</h2>
        </Reveal>

        <div className="safety-grid">
          <SafetyGallery photos={photos} alt={t('imageAlt')} viewLabel={tp('viewPhotos')} />

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
