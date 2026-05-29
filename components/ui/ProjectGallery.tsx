'use client';

import { useEffect, useRef } from 'react';
import 'photoswipe/style.css';
import { ArrowRightIcon } from '@/components/icons';
import type { Photo } from '@/lib/projects';

type Props = {
  galleryId: string;
  photos: Photo[];
  label: string;
  projectName: string;
};

/**
 * Кнопка «Смотреть фото» + PhotoSwipe-лайтбокс.
 * Если фото нет — кнопка не рендерится (карточка показывает плейсхолдер-медиа).
 */
export function ProjectGallery({ galleryId, photos, label, projectName }: Props) {
  const lightboxRef = useRef<{ loadAndOpen: (i: number) => void; destroy: () => void } | null>(null);

  useEffect(() => {
    if (photos.length === 0) return;
    let active = true;

    (async () => {
      const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox');
      if (!active) return;
      const lb = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a',
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
  }, [galleryId, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Скрытые ссылки-якоря галереи для PhotoSwipe */}
      <div id={galleryId} style={{ display: 'none' }} aria-hidden>
        {photos.map((p, i) => (
          <a
            key={p.src}
            href={p.src}
            data-pswp-width={p.width}
            data-pswp-height={p.height}
            data-cropped="true"
          >
            <span>{`${projectName} — ${i + 1}`}</span>
          </a>
        ))}
      </div>
      <button
        type="button"
        className="viewbtn"
        onClick={() => lightboxRef.current?.loadAndOpen(0)}
      >
        {label}
        <ArrowRightIcon />
      </button>
    </>
  );
}
