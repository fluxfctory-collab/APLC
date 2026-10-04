/**
 * process-assets.mjs
 * ---------------------------------------------------------------------------
 * One-time (repeatable) processing of the client's original files in
 * ./brief-assets into web-ready masters in ./src/assets/uploads.
 *
 *  • Crops each photograph for its intended use (and removes the rounded
 *    screenshot corners on IMG_5569).
 *  • Applies one consistent, subtle warm grade so every image reads as a set:
 *    slightly desaturated, warm midtones, gently lifted blacks.
 *  • Extracts the AAML logo from its PDF at native resolution and converts
 *    the white background to true transparency (colour-to-alpha).
 *  • Saves a masked reference crop of the scanned seal (for comparison with
 *    the redrawn SVG — not used on the site).
 *
 * Astro then generates AVIF / WebP / JPEG at responsive widths from these
 * masters at build time, so the masters are saved as high-quality JPEG/PNG.
 *
 * Run: npm run assets   (requires poppler-utils `pdfimages` for the AAML logo)
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'brief-assets');
const OUT = path.join(ROOT, 'src/assets/uploads');
const BRAND = path.join(ROOT, 'public/brand');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(BRAND, { recursive: true });

/** The house grade — keep identical across photographs. */
function warmGrade(img, { saturation = 0.8 } = {}) {
  return img
    .modulate({ saturation })
    .recomb([
      [1.035, 0.025, 0.0],
      [0.01, 1.0, 0.0],
      [0.0, 0.03, 0.915],
    ])
    .linear(0.95, 7); // lift blacks / soften highlights a touch (matte)
}

/** Monochrome version of the grade: warm-toned black & white. */
function warmMono(img) {
  return img.grayscale().linear(0.95, 7).tint({ r: 118, g: 104, b: 88 });
}

const jobs = [
  {
    // Standing, arms crossed — Home hero. Crop inside the rounded corners to 4:5.
    in: 'IMG_5569.jpeg',
    out: 'portrait-standing.jpg',
    extract: { left: 67, top: 80, width: 760, height: 950 },
    grade: (i) => warmGrade(i),
  },
  {
    // Headshot — About hero / Contact. Trim to 4:5 from the top.
    in: 'IMG_5564.jpeg',
    out: 'portrait-headshot.jpg',
    extract: { left: 0, top: 0, width: 1290, height: 1603 },
    grade: (i) => warmGrade(i),
  },
  {
    // Black & white at desk — Home "approach" section / About.
    in: 'IMG_5563.jpeg',
    out: 'portrait-desk.jpg',
    extract: { left: 0, top: 0, width: 1290, height: 1611 },
    grade: (i) => warmMono(i),
  },
  {
    // Live oaks and columns — atmospheric band. Cropped above the sign and road.
    // NOTE: the sign reads "Vermilion Parish Courthouse" (Abbeville) — see TODO-CLIENT.md.
    in: 'IMG_5560.jpeg',
    out: 'acadiana-oaks.jpg',
    extract: { left: 0, top: 0, width: 1110, height: 470 },
    grade: (i) => warmGrade(i, { saturation: 0.55 }),
  },
];

for (const job of jobs) {
  const img = sharp(path.join(SRC, job.in)).rotate().extract(job.extract);
  await job.grade(img).jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(path.join(OUT, job.out));
  const meta = await sharp(path.join(OUT, job.out)).metadata();
  console.log(`✓ ${job.out}  ${meta.width}×${meta.height}`);
}

/* ---------------------------------------------------------------------------
 * AAML logo — extract embedded raster, colour-to-alpha against white, trim.
 * The PDF contains only a 400×400 JPEG; request a vector original (TODO).
 * ------------------------------------------------------------------------ */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aaml-'));
execFileSync('pdfimages', ['-j', path.join(SRC, 'AAML Logo.pdf'), path.join(tmp, 'aaml')]);
const aamlJpg = fs.readdirSync(tmp).find((f) => f.endsWith('.jpg'));
const { data, info } = await sharp(path.join(tmp, aamlJpg)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  // GIMP-style colour-to-alpha against pure white
  let a = Math.max(255 - r, 255 - g, 255 - b) / 255;
  if (a < 0.06) a = 0; // drop JPEG noise in the white field
  const un = (c) => (a === 0 ? 0 : Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a))));
  rgba[j] = un(r);
  rgba[j + 1] = un(g);
  rgba[j + 2] = un(b);
  rgba[j + 3] = Math.round(a * 255);
}
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, 'aaml-logo.png'));
const aamlMeta = await sharp(path.join(OUT, 'aaml-logo.png')).metadata();
console.log(`✓ aaml-logo.png  ${aamlMeta.width}×${aamlMeta.height} (native resolution — request vector)`);
fs.rmSync(tmp, { recursive: true, force: true });

/* ---------------------------------------------------------------------------
 * Reference: scanned seal from the letterhead, masked to a circle.
 * ------------------------------------------------------------------------ */
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'lh-'));
execFileSync('pdfimages', ['-j', path.join(SRC, 'Letterhead.pdf'), path.join(tmp2, 'lh')]);
const lhJpg = fs.readdirSync(tmp2).find((f) => f.endsWith('.jpg'));
// Seal sits top-right on the 1699×2186 scan; centre and radius measured by eye.
const cx = 1440, cy = 234, r = 177;
const size = r * 2;
const circle = Buffer.from(
  `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`,
);
await sharp(path.join(tmp2, lhJpg))
  .extract({ left: cx - r, top: cy - r, width: size, height: size })
  .resize(size * 2, size * 2, { kernel: 'lanczos3' })
  .composite([{ input: await sharp(circle).resize(size * 2, size * 2).png().toBuffer(), blend: 'dest-in' }])
  .png()
  .toFile(path.join(BRAND, 'seal-scan-reference.png'));
console.log('✓ public/brand/seal-scan-reference.png (scan reference only)');
fs.rmSync(tmp2, { recursive: true, force: true });
