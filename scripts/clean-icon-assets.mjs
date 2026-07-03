import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandingDir = join(__dirname, '../public/branding');

const minColorDistance = (r, g, b, backgrounds) =>
  Math.min(
    ...backgrounds.map(({ r: br, g: bg, b: bb }) =>
      Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2),
    ),
  );

const isLightFringe = (r, g, b, a) =>
  a > 0 && a < 255 && r >= 185 && g >= 185 && b >= 185;

const isDarkBackground = (r, g, b) => r <= 24 && g <= 42 && b <= 68;

const floodFillEdgeBackground = (pixels, width, height, channels, matchesBackground) => {
  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x += 1) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y += 1) {
    queue.push([0, y], [width - 1, y]);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const index = y * width + x;
    if (visited[index]) continue;
    visited[index] = 1;

    const i = index * channels;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a === 0 || !matchesBackground(r, g, b, a)) continue;

    pixels[i + 3] = 0;

    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }
};

const removeNearWhiteBackground = (pixels, width, height, channels, hardCutoff, softCutoff) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const distance = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);

      if (distance <= hardCutoff) {
        pixels[i + 3] = 0;
        continue;
      }

      if (distance <= softCutoff) {
        const fade = (distance - hardCutoff) / (softCutoff - hardCutoff);
        pixels[i + 3] = Math.round(pixels[i + 3] * fade);
      }
    }
  }
};

const removeColorDistanceBackground = (
  pixels,
  width,
  height,
  channels,
  backgrounds,
  hardCutoff,
  softCutoff,
) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const distance = minColorDistance(pixels[i], pixels[i + 1], pixels[i + 2], backgrounds);

      if (distance <= hardCutoff) {
        pixels[i + 3] = 0;
        continue;
      }

      if (distance <= softCutoff) {
        const fade = (distance - hardCutoff) / (softCutoff - hardCutoff);
        pixels[i + 3] = Math.round(pixels[i + 3] * fade);
      }
    }
  }
};

const removeLightFringe = (pixels, width, height, channels) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      if (isLightFringe(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3])) {
        pixels[i + 3] = 0;
      }
    }
  }
};

const removeOpaqueLightHalo = (pixels, width, height, channels) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      if (pixels[i + 3] !== 255) continue;

      const minChannel = Math.min(r, g, b);
      const saturation = Math.max(r, g, b) - minChannel;
      const isCoolHalo = minChannel >= 120 && saturation <= 45;
      const isWarmHalo = r > 220 && g > 195 && b > 145 && b > r * 0.55;

      if (isCoolHalo || isWarmHalo) {
        pixels[i + 3] = 0;
      }
    }
  }
};

const removeEdgeLightFringe = (pixels, width, height, channels, margin = 48) => {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const edgeDistance = Math.min(x, y, width - 1 - x, height - 1 - y);
      if (edgeDistance > margin) continue;

      const i = (y * width + x) * channels;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a === 0) continue;
      if (a < 255 && r >= 170 && g >= 170 && b >= 170) {
        pixels[i + 3] = 0;
      }
    }
  }
};

const saveCleanIcon = async (pixels, width, height, channels, output) => {
  const trimmed = await sharp(pixels, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .trim({ threshold: 1 })
    .toBuffer();

  writeFileSync(output, trimmed);

  const meta = await sharp(output).metadata();
  console.log(`Saved ${output} (${meta.width}x${meta.height})`);
};

const cleanLightIcon = async (source, output) => {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  removeNearWhiteBackground(pixels, width, height, channels, 36, 64);
  floodFillEdgeBackground(pixels, width, height, channels, (r, g, b, a) =>
    a > 0 && isDarkBackground(r, g, b),
  );
  removeLightFringe(pixels, width, height, channels);
  removeOpaqueLightHalo(pixels, width, height, channels);

  await saveCleanIcon(pixels, width, height, channels, output);
};

const cleanDarkIcon = async (source, output) => {
  const darkBackgrounds = [
    { r: 0, g: 15, b: 35 },
    { r: 13, g: 27, b: 42 },
    { r: 15, g: 28, b: 44 },
    { r: 3, g: 29, b: 52 },
    { r: 0, g: 14, b: 35 },
    { r: 0, g: 13, b: 30 },
  ];

  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  removeColorDistanceBackground(pixels, width, height, channels, darkBackgrounds, 24, 52);
  removeEdgeLightFringe(pixels, width, height, channels, 52);
  removeLightFringe(pixels, width, height, channels);

  await saveCleanIcon(pixels, width, height, channels, output);
};

await cleanLightIcon(
  join(brandingDir, 'icono-claro.png'),
  join(brandingDir, 'icono-claro-transparent.png'),
);

await cleanDarkIcon(
  join(brandingDir, 'icono-dark.png'),
  join(brandingDir, 'icono-dark-transparent.png'),
);
