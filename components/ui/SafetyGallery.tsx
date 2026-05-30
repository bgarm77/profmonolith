'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'photoswipe/style.css';
import { ExpandIcon } from '@/components/icons';
import type { Photo } from '@/lib/projects';

type Props = {
  photos: Photo[];
  alt: string;
  viewLabel: string;
};

/**
 * Галерея блока «Безопасность»: кликабельная обложка + PhotoSwipe-лайтбокс,
 * в котором можно листать все фото. Логика повторяет карточки проектов.
 */
export function SafetyGallery({ photos, alt, viewLabel }: Props) {
  const galleryId = 'safety-gallery';
  const lightboxRef = useRef<{ destroy: () => void } | null>(null);
  const hasPhotos = photos.length > 0;

  useEffect(() => {
    if (!hasPhotos) return;
    let active = true;

    (async () => {
      const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox');
      if (!active) return;
      const lb = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a.safety-pswp',
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
  }, [hasPhotos]);

  if (!hasPhotos) return <div className="safety-media" />;

  const cover = photos[0];

  return (
    <div className="safety-media" id={galleryId}>
      {/* Кликабельная обложка — открывает лайтбокс на первом фото */}
      <a
        href={cover.src}
        className="pcard__cover safety-pswp"
        data-pswp-width={cover.width}
        data-pswp-height={cover.height}
        data-cropped="true"
        aria-label={viewLabel}
      >
        <Image
          src={cover.src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
        {photos.length > 1 && (
          <span className="safety-media__count">
            <ExpandIcon />
            {photos.length}
          </span>
        )}
        <span className="pcard__zoom">
          <span className="pcard__zoom-ic">
            <ExpandIcon />
          </span>
          <span className="pcard__zoom-tx">{viewLabel}</span>
        </span>
      </a>

      {/* Остальные фото — скрытые якоря-слайды PhotoSwipe */}
      {photos.slice(1).map((p, i) => (
        <a
          key={p.src}
          href={p.src}
          className="safety-pswp pcard__pswp--hidden"
          data-pswp-width={p.width}
          data-pswp-height={p.height}
          data-cropped="true"
          aria-hidden
          tabIndex={-1}
        >
          <span className="sr-only">{`${alt} — ${i + 2}`}</span>
        </a>
      ))}
    </div>
  );
}
