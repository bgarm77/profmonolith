// Конвертирует все .png в public/photos/<slug>/ в .webp (png остаётся на диске).
// Запуск: node scripts/png-to-webp.mjs
import sharp from 'sharp';
import { readdirSync, existsSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const photosDir = join(root, 'public', 'photos');

let converted = 0;
let skipped = 0;

const slugs = readdirSync(photosDir).filter((d) =>
  statSync(join(photosDir, d)).isDirectory(),
);

for (const slug of slugs) {
  const dir = join(photosDir, slug);
  const pngs = readdirSync(dir).filter((f) => extname(f).toLowerCase() === '.png');
  for (const png of pngs) {
    const base = png.slice(0, -extname(png).length);
    const webpPath = join(dir, `${base}.webp`);
    if (existsSync(webpPath)) {
      skipped++;
      continue;
    }
    await sharp(join(dir, png)).webp({ quality: 82 }).toFile(webpPath);
    converted++;
  }
  console.log(`${slug}: +${pngs.length} обработано`);
}

console.log(`\nГотово: сконвертировано ${converted}, пропущено (webp уже есть) ${skipped}.`);
