'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import 'photoswipe/style.css';
import { ExpandIcon } from '@/components/icons';

export type LicenseCard = {
  code: string;
  title: string;
  src: string;
  width: number;
  height: number;
};

type Props = {
  items: LicenseCard[];
  viewLabel: string;
};

/**
 * Раздел «Лицензии и сертификаты»: карточки-превью документов с PhotoSwipe-
 * лайтбоксом (клик открывает скан в полном размере). Повторяет логику
 * SafetyGallery.
 */
export function LicenseGallery({ items, viewLabel }: Props) {
  const galleryId = 'license-gallery';
  const lightboxRef = useRef<{ destroy: () => void } | null>(null);
  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) return;
    let active = true;

    (async () => {
      const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox');
      if (!active) return;
      const lb = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a.lic-pswp',
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
  }, [hasItems]);

  if (!hasItems) return null;

  return (
    <div className="lic-grid" id={galleryId}>
      {items.map((item) => (
        <a
          key={item.code}
          href={item.src}
          className="lic-card lic-pswp"
          data-pswp-width={item.width}
          data-pswp-height={item.height}
          aria-label={`${item.title} — ${viewLabel}`}
        >
          <span className="lic-card__media">
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              style={{ objectFit: 'cover' }}
            />
            <span className="lic-card__zoom">
              <ExpandIcon />
              {viewLabel}
            </span>
          </span>
          <span className="lic-card__meta">
            <span className="lic-card__code">{item.code}</span>
            <span className="lic-card__title">{item.title}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
