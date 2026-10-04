/**
 * build-og.mjs
 * ---------------------------------------------------------------------------
 * Generates the favicon set and the default social-sharing image from the
 * brand assets, so they always match the site.
 *
 *   public/favicon.svg, favicon.ico, apple-touch-icon.png,
 *   public/icon-192.png, icon-512.png, icon-maskable-512.png
 *   public/og/og-default.jpg  (1200×630: wordmark + portrait)
 *
 * The share image is rendered by headless Chromium (playwright-core) using the
 * site's own fonts. Run: npm run og
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUB = path.join(ROOT, 'public');
const INK = '#1B1E24';
const BRASS = '#A8875A';
const IVORY = '#F7F3EC';

const monogram = fs.readFileSync(path.join(ROOT, 'src/assets/brand/monogram.svg'), 'utf8');
const monoPath = monogram.match(/ d="([^"]+)"/)[1];

/* ---- Favicons --------------------------------------------------------- */
// Monogram drawn on a 121×125 grid; centre it in a square tile.
const tile = (size, pad, radius) => {
  const inner = size - pad * 2;
  const s = inner / 125;
  const tx = (size - 121 * s) / 2;
  const ty = (size - 125 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/><path fill="${BRASS}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})" d="${monoPath}"/></svg>`;
};

fs.writeFileSync(path.join(PUB, 'favicon.svg'), tile(64, 11, 10));
const png = (svg, size, out) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(path.join(PUB, out));
await png(tile(180, 32, 0), 180, 'apple-touch-icon.png');
await png(tile(192, 34, 0), 192, 'icon-192.png');
await png(tile(512, 90, 0), 512, 'icon-512.png');
await png(tile(512, 150, 0), 512, 'icon-maskable-512.png');
await png(tile(64, 9, 8), 32, 'favicon-32.png');
await png(tile(64, 9, 8), 16, 'favicon-16.png');
execFileSync('convert', [path.join(PUB, 'favicon-16.png'), path.join(PUB, 'favicon-32.png'), path.join(PUB, 'favicon.ico')]);
fs.rmSync(path.join(PUB, 'favicon-16.png'));
fs.rmSync(path.join(PUB, 'favicon-32.png'));
console.log('✓ favicons');

/* ---- Open Graph image (1200×630) -------------------------------------- */
// Rendered by headless Chromium with the site's own web fonts, so lettering
// is shaped and kerned exactly as on the website.
const fileUrl = (p) => 'file://' + path.join(ROOT, p);
const sealSvg = fs.readFileSync(path.join(ROOT, 'src/assets/brand/seal-brass.svg'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'OG Serif'; font-weight: 500; src: url('${fileUrl('public/fonts/cormorant-garamond-latin-500-normal.woff2')}'); }
  @font-face { font-family: 'OG Serif'; font-style: italic; font-weight: 500; src: url('${fileUrl('public/fonts/cormorant-garamond-latin-500-italic.woff2')}'); }
  @font-face { font-family: 'OG Sans'; font-weight: 200 900; src: url('${fileUrl('public/fonts/source-sans-3-latin-wght-normal.woff2')}'); }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; display: flex; background: ${INK}; overflow: hidden; }
  .panel { position: relative; width: 700px; padding: 72px 80px; color: ${IVORY}; display: flex; flex-direction: column; }
  .panel::after { content: ''; position: absolute; inset: 28px; border: 1px solid rgb(168 135 90 / 0.45); }
  .seal { flex: none; width: 104px; height: 104px; margin-bottom: 34px; }
  .seal svg { width: 100%; height: 100%; }
  .eyebrow { font: 600 17px/1 'OG Sans'; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRASS}; }
  h1 { font: 500 70px/1 'OG Serif'; margin-top: 26px; letter-spacing: -0.01em; }
  .title { font: italic 500 38px/1.1 'OG Serif'; color: #d9d2c5; margin-top: 14px; }
  .rule { flex: none; width: 56px; height: 1px; background: ${BRASS}; margin: 30px 0 24px; }
  .creds { font: 600 16px/1.9 'OG Sans'; letter-spacing: 0.15em; text-transform: uppercase; }
  .photo { flex: 1; border-left: 1px solid ${BRASS}; background: url('${fileUrl('src/assets/uploads/portrait-standing.jpg')}') center top / cover; }
</style></head><body>
  <div class="panel">
    <div class="seal">${sealSvg}</div>
    <p class="eyebrow">Lafayette, Louisiana · Family Law</p>
    <h1>Helen Popich Harris</h1>
    <p class="title">Attorney at Law</p>
    <div class="rule"></div>
    <p class="creds">Board Certified Family Law Specialist<br>Fellow, American Academy of Matrimonial Lawyers</p>
  </div>
  <div class="photo"></div>
</body></html>`;

const { chromium } = await import('playwright-core');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const tmpHtml = path.join(ROOT, 'node_modules/.og-render.html');
fs.writeFileSync(tmpHtml, html);
await page.goto('file://' + tmpHtml);
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.join(PUB, 'og'), { recursive: true });
const shot = await page.screenshot({ type: 'png' });
await browser.close();
fs.rmSync(tmpHtml);
await sharp(shot).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(PUB, 'og/og-default.jpg'));
console.log('✓ og/og-default.jpg');
