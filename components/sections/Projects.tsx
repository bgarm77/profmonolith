import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectGallery } from '@/components/ui/ProjectGallery';
import { PinIcon } from '@/components/icons';
import { getProjectsWithPhotos, type ProjectWithPhotos } from '@/lib/projects';

const localeMap: Record<string, string> = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };

export async function Projects() {
  const t = await getTranslations('projects');
  const locale = await getLocale();
  const nf = new Intl.NumberFormat(localeMap[locale] ?? 'ru-RU');
  const items = await getProjectsWithPhotos();

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="h-section">
            {t('headingLine1')}
            <br />
            {t('headingLine2')}
          </h2>
        </Reveal>

        <div className="projects__grid">
          {items.map((p, i) => {
            const name = t(`items.${p.slug}.name`);
            const address = t(`items.${p.slug}.address`);
            const meta = t.raw(`items.${p.slug}.meta`) as string[];
            const cover = p.photos[0];
            const num = String(i + 1).padStart(2, '0');

            return (
              <Reveal
                key={p.slug}
                as="article"
                className={p.feature ? 'pcard pcard--feature' : 'pcard'}
                delay={0.06 * (i % 3)}
              >
                <div className="pcard__media">
                  <span className="pcard__index">PROJECT {num}</span>
                  <span className={p.status === 'done' ? 'tag tag--done' : 'tag tag--wip'}>
                    {p.status === 'done' ? t('statusDone') : t('statusWip')}
                  </span>
                  {cover ? (
                    <Image
                      src={cover.src}
                      alt={name}
                      fill
                      sizes={p.feature ? '100vw' : '(max-width: 720px) 100vw, 50vw'}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="pcard__ph">[ {name} ]</div>
                  )}
                </div>
                <div className="pcard__body">
                  <h3 className="pcard__name">{name}</h3>
                  <div className="pcard__addr">
                    <PinIcon />
                    {address}
                  </div>
                  <div className="pcard__meta">
                    {meta.map((m) => (
                      <span className="chip" key={m}>
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="pcard__foot">
                    <div className="pcard__big">
                      {p.areaPrefix ?? ''}
                      {nf.format(p.area)}
                      <small>{t('unit')}</small>
                    </div>
                    <ProjectGallery
                      galleryId={`gal-${p.slug}`}
                      photos={p.photos}
                      label={t('viewPhotos')}
                      projectName={name}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export type { ProjectWithPhotos };
