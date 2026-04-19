import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../public/og-image.svg');
const OUT = resolve(__dirname, '../public/og-image.png');

const svg = await readFile(SRC);
await sharp(svg, { density: 300 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ quality: 92 })
  .toFile(OUT);

console.log(`[og-image] wrote 1200×630 PNG → ${OUT}`);
