// Генерация фавиконов и apple-touch-icon из белого логотипа на навы-фоне.
// Запуск: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NAVY = { r: 0x20, g: 0x42, b: 0x66, alpha: 1 };
const SRC = join(root, 'public/logos/logo-white.png');

async function makeIcon(size, padRatio, out) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const logo = await sharp(SRC)
    .resize({ width: inner, fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: NAVY },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
  console.log('wrote', out);
}

await makeIcon(256, 0.18, join(root, 'app/icon.png'));
await makeIcon(180, 0.16, join(root, 'app/apple-icon.png'));
await makeIcon(180, 0.16, join(root, 'public/apple-touch-icon.png'));
await makeIcon(32, 0.12, join(root, 'public/favicon.png'));
console.log('done');
