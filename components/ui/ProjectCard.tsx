'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'photoswipe/style.css';
import { useTranslations, useLocale } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { PinIcon, ArrowRightIcon, ExpandIcon } from '@/components/icons';
import type { ProjectWithPhotos } from '@/lib/projects';

const localeMap: Record<string, string> = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };

type Props = {
  project: ProjectWithPhotos;
  index: number;
};

/**
 * Карточка проекта с кликабельной обложкой и PhotoSwipe-лайтбоксом.
 * Фото можно открыть как кликом по самому изображению (с ховер-подсказкой),
 * так и кнопкой «Смотреть фото» — обе используют один лайтбокс.
 */
export function ProjectCard({ project, index }: Props) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const nf = new Intl.NumberFormat(localeMap[locale] ?? 'ru-RU');

  const galleryId = `gal-${project.slug}`;
  const lightboxRef = useRef<{ loadAndOpen: (i: number) => void; destroy: () => void } | null>(
    null,
  );

  const { photos } = project;
  const hasPhotos = photos.length > 0;

  useEffect(() => {
    if (!hasPhotos) return;
    let active = true;

    (async () => {
      const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox');
      if (!active) return;
      const lb = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a.pcard__pswp',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 0.94,
      });
      lb.init();
      lightboxRef.current = lb as unknown as typeof lightboxRef.current;
    })();

    return () => {
      active = false;
      lightboxRef.current?.destroy();
      lightboxRef.current = null;
    };
  }, [galleryId, hasPhotos]);

  const name = t(`items.${project.slug}.name`);
  const address = t(`items.${project.slug}.address`);
  const meta = t.raw(`items.${project.slug}.meta`) as string[];
  const num = String(index + 1).padStart(2, '0');
  const cover = photos[0];
  const viewLabel = t('viewPhotos');

  return (
    <Reveal
      as="article"
      className={project.feature ? 'pcard pcard--feature' : 'pcard'}
      delay={0.06 * (index % 3)}
    >
      <div className="pcard__media" id={galleryId}>
        <span className="pcard__index">PROJECT {num}</span>
        <span className={project.status === 'done' ? 'tag tag--done' : 'tag tag--wip'}>
          {project.status === 'done' ? t('statusDone') : t('statusWip')}
        </span>

        {cover ? (
          <>
            {/* Кликабельная обложка — открывает лайтбокс на первом фото */}
            <a
              href={cover.src}
              className="pcard__cover pcard__pswp"
              data-pswp-width={cover.width}
              data-pswp-height={cover.height}
              data-cropped="true"
              aria-label={`${viewLabel}: ${name}`}
            >
              <Image
                src={cover.src}
                alt={name}
                fill
                sizes={project.feature ? '100vw' : '(max-width: 720px) 100vw, 50vw'}
                style={{ objectFit: 'cover' }}
              />
              <span className="pcard__zoom">
                <span className="pcard__zoom-ic">
                  <ExpandIcon />
                </span>
                <span className="pcard__zoom-tx">{viewLabel}</span>
              </span>
            </a>

            {/* Остальные фото — скрытые якоря для PhotoSwipe (слайды галереи) */}
            {photos.slice(1).map((p, i) => (
              <a
                key={p.src}
                href={p.src}
                className="pcard__pswp pcard__pswp--hidden"
                data-pswp-width={p.width}
                data-pswp-height={p.height}
                data-cropped="true"
                aria-hidden
                tabIndex={-1}
              >
                <span className="sr-only">{`${name} — ${i + 2}`}</span>
              </a>
            ))}
          </>
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
            {project.areaPrefix ?? ''}
            {nf.format(project.area)}
            <small>{t('unit')}</small>
          </div>
          {hasPhotos && (
            <button
              type="button"
              className="viewbtn"
              onClick={() => lightboxRef.current?.loadAndOpen(0)}
            >
              {viewLabel}
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
