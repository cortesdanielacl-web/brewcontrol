import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = join(__dirname, '../../public/logo fondo claro corto.png');
const output = join(__dirname, '../public/branding/logo-corto-claro.png');

const BACKGROUND = { r: 255, g: 255, b: 255 };
const HARD_CUTOFF = 42;
const SOFT_CUTOFF = 78;

const colorDistance = (r, g, b) =>
  Math.sqrt(
    (r - BACKGROUND.r) ** 2 +
      (g - BACKGROUND.g) ** 2 +
      (b - BACKGROUND.b) ** 2,
  );

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const pixels = Buffer.from(data);

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const distance = colorDistance(r, g, b);

    if (distance <= HARD_CUTOFF) {
      pixels[i + 3] = 0;
      continue;
    }

    if (distance <= SOFT_CUTOFF) {
      const fade = (distance - HARD_CUTOFF) / (SOFT_CUTOFF - HARD_CUTOFF);
      pixels[i + 3] = Math.round(255 * fade);
    }
  }
}

const refined = await sharp(pixels, { raw: { width, height, channels } })
  .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
  .trim({ threshold: 8 })
  .toBuffer();

writeFileSync(output, refined);

const meta = await sharp(output).metadata();
console.log(`Refined logo saved to ${output}`);
console.log(`Output size: ${meta.width}x${meta.height}`);
