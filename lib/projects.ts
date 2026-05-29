import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export type ProjectStatus = 'wip' | 'done';

export type Project = {
  slug: string;
  /** число для CountUp (площадь монолита, м²) */
  area: number;
  /** префикс к площади, напр. "~" для firdus */
  areaPrefix?: string;
  status: ProjectStatus;
  /** ожидаемое число фото (для подписи; реальные берутся с диска) */
  photoCount: number;
  /** флагман — карточка во всю ширину */
  feature?: boolean;
};

/** Порядок и метаданные 5 ЖК (локализуемый текст — в messages.projects.items.<slug>). */
export const projects: Project[] = [
  { slug: 'gyurjyan', area: 196679, status: 'wip', photoCount: 6, feature: true },
  { slug: 'ani', area: 50000, status: 'done', photoCount: 5 },
  { slug: 'leningradyan', area: 45000, status: 'wip', photoCount: 5 },
  { slug: 'firdus', area: 17000, areaPrefix: '~', status: 'wip', photoCount: 4 },
  { slug: 'rubinyants', area: 45000, status: 'wip', photoCount: 5 },
];

const PHOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

/**
 * Серверный хелпер: возвращает список путей к фото проекта из public/photos/<slug>,
 * отсортированный по имени. Пусто — если фото ещё не добавлены.
 * Так пользователю достаточно положить файлы — код подхватит их без правок.
 */
export function getProjectPhotos(slug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'photos', slug);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => PHOTO_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/photos/${slug}/${f}`);
  } catch {
    return [];
  }
}

export type Photo = { src: string; width: number; height: number };
export type ProjectWithPhotos = Project & { photos: Photo[] };

/** Фото с размерами (нужны PhotoSwipe). Размеры читаются с диска на сервере. */
export async function getProjectPhotosWithDims(slug: string): Promise<Photo[]> {
  const files = getProjectPhotos(slug);
  const out: Photo[] = [];
  for (const src of files) {
    const abs = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    try {
      const { width, height } = await sharp(abs).metadata();
      out.push({ src, width: width ?? 1600, height: height ?? 1000 });
    } catch {
      out.push({ src, width: 1600, height: 1000 });
    }
  }
  return out;
}

export async function getProjectsWithPhotos(): Promise<ProjectWithPhotos[]> {
  return Promise.all(
    projects.map(async (p) => ({ ...p, photos: await getProjectPhotosWithDims(p.slug) })),
  );
}
