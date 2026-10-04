/**
 * build-seal.mjs
 * ---------------------------------------------------------------------------
 * Redraws Ms. Harris's seal (from her letterhead and business card) as clean,
 * resolution-independent SVG. All lettering is converted to outlined paths so
 * the files render identically everywhere (no font dependency).
 *
 * Outputs (src/assets/brand/ for inline use, public/brand/ for download/press):
 *   seal-color.svg   Full-colour seal — burgundy + gold, faithful to print
 *   seal-brass.svg   Single-colour line seal in brass (for dark backgrounds)
 *   seal-ink.svg     Single-colour line seal in ink (for light backgrounds)
 *   monogram.svg     The column "H" monogram alone (favicon, watermark)
 *
 * Run: npm run seal
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_SRC = path.join(ROOT, 'src/assets/brand');
const OUT_PUBLIC = path.join(ROOT, 'public/brand');
fs.mkdirSync(OUT_SRC, { recursive: true });
fs.mkdirSync(OUT_PUBLIC, { recursive: true });

const fontBuf = fs.readFileSync(
  path.join(ROOT, 'node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff'),
);
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

const COLORS = {
  burgundy: '#952935', // print burgundy (scan reads lighter; deepened slightly)
  gold: '#E2B46C',
  brass: '#A8875A',
  ink: '#1B1E24',
};

const f = (n) => Number(n.toFixed(2));

/* ---------------------------------------------------------------------------
 * Monogram: an "H" whose crossbar is the shoulder of a lowercase "h",
 * set as a column between an entablature (two bars) and a base.
 * Drawn on a 121 x 126 grid measured from the business-card scan.
 * ------------------------------------------------------------------------ */
function stemPath(a, b, sa, sb, top, bottom, st = 3.4, bh = 5) {
  // A vertical stem (a..b) with bracketed serifs (sa..sb) top and bottom.
  const kb = b + (sb - b) * 0.3;
  const ka = a - (a - sa) * 0.3;
  return [
    `M${sa},${top}H${sb}V${top + st}`,
    `C${kb},${top + st} ${b},${top + st + bh * 0.35} ${b},${top + st + bh}`,
    `V${bottom - st - bh}`,
    `C${b},${bottom - st - bh * 0.35} ${kb},${bottom - st} ${sb},${bottom - st}`,
    `V${bottom}H${sa}V${bottom - st}`,
    `C${ka},${bottom - st} ${a},${bottom - st - bh * 0.35} ${a},${bottom - st - bh}`,
    `V${top + st + bh}`,
    `C${a},${top + st + bh * 0.35} ${ka},${top + st} ${sa},${top + st}Z`,
  ].join('');
}

function monogramPaths() {
  const top = 21;
  const bottom = 113;
  const left = stemPath(23.5, 38, 10, 51.5, top, bottom, 3.8, 6);
  const right = stemPath(81.5, 96, 68.5, 109.5, top, bottom, 3.8, 6);
  // Shoulder of the "h": thin where it leaves the left stem, swelling as it
  // turns down into the right stem (where it merges with the stem).
  const arch = [
    'M38,59',
    'C43,50.5 51.5,45 62,45',
    'C74,45 82.5,51.5 86,61',
    'V78H83',
    'C80.5,64.5 73,56 63,56',
    'C53.5,56 45,61 38,67.5Z',
  ].join('');
  const bars = [
    'M0,0H121V5.6H0Z', // entablature, upper
    'M9,9.2H112V14.2H9Z', // entablature, lower
    'M9,119.6H112V124.8H9Z', // base
  ].join('');
  return { d: `${bars}${left}${right}${arch}`, w: 121, h: 125 };
}

/* ---------------------------------------------------------------------------
 * Text on an arc → outlined path data
 * ------------------------------------------------------------------------ */
function glyphRun(text, size, tracking) {
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  const run = [];
  let total = 0;
  glyphs.forEach((g, i) => {
    let adv = g.advanceWidth * scale;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale;
    const isLast = i === glyphs.length - 1;
    run.push({ g, adv, offset: total });
    total += adv + (isLast ? 0 : tracking);
  });
  return { run, total, scale };
}

function transformPath(cmds, fn) {
  let d = '';
  for (const c of cmds) {
    if (c.type === 'M' || c.type === 'L') {
      const [x, y] = fn(c.x, c.y);
      d += `${c.type}${f(x)},${f(y)}`;
    } else if (c.type === 'Q') {
      const [x1, y1] = fn(c.x1, c.y1);
      const [x, y] = fn(c.x, c.y);
      d += `Q${f(x1)},${f(y1)} ${f(x)},${f(y)}`;
    } else if (c.type === 'C') {
      const [x1, y1] = fn(c.x1, c.y1);
      const [x2, y2] = fn(c.x2, c.y2);
      const [x, y] = fn(c.x, c.y);
      d += `C${f(x1)},${f(y1)} ${f(x2)},${f(y2)} ${f(x)},${f(y)}`;
    } else if (c.type === 'Z') d += 'Z';
  }
  return d;
}

/**
 * @param position 'top'  → reads clockwise across the top, baseline on radius r
 *                 'bottom' → reads left→right across the bottom, glyph tops toward centre
 */
function arcText(text, { cx, cy, r, size, tracking, position }) {
  const { run, total } = glyphRun(text, size, tracking);
  const span = total / r; // radians
  let d = '';
  for (const { g, adv, offset } of run) {
    const mid = offset + adv / 2;
    let theta; // angle measured clockwise from 12 o'clock
    if (position === 'top') theta = -span / 2 + mid / r;
    else theta = Math.PI + span / 2 - mid / r;
    const rot = position === 'top' ? theta : theta - Math.PI;
    const px = cx + r * Math.sin(theta);
    const py = cy - r * Math.cos(theta);
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const gp = g.getPath(-adv / 2, 0, size);
    d += transformPath(gp.commands, (x, y) => [px + x * cos - y * sin, py + x * sin + y * cos]);
  }
  return { d, span };
}

function dotsRing({ cx, cy, r, count, dot }) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = cx + r * Math.sin(t);
    const y = cy - r * Math.cos(t);
    d += `M${f(x - dot)},${f(y)}a${dot},${dot} 0 1,0 ${f(dot * 2)},0a${dot},${dot} 0 1,0 ${f(-dot * 2)},0Z`;
  }
  return d;
}

function circlePath(cx, cy, r) {
  return `M${f(cx - r)},${cy}a${r},${r} 0 1,0 ${f(r * 2)},0a${r},${r} 0 1,0 ${f(-r * 2)},0Z`;
}

/* ---------------------------------------------------------------------------
 * Seal geometry (viewBox 0 0 400 400)
 * ------------------------------------------------------------------------ */
const C = 200;
const R_OUTER = 199; // outer burgundy rim
const R_BAND_OUT = 190; // gold band (carries the lettering)
const R_BAND_IN = 147;
const BAND_MID = (R_BAND_OUT + R_BAND_IN) / 2;
const SIZE = 28.5; // cap size of the ring lettering
const CAP = (font.tables.os2.sCapHeight / font.unitsPerEm) * SIZE;

const topText = arcText('HELEN POPICH HARRIS', {
  cx: C, cy: C, r: BAND_MID - CAP / 2, size: SIZE, tracking: 4.2, position: 'top',
});
const bottomText = arcText('BOARD CERTIFIED FAMILY LAW SPECIALIST', {
  cx: C, cy: C, r: BAND_MID + CAP / 2, size: SIZE * 0.93, tracking: 0.6, position: 'bottom',
});

// Separator dots, centred in the gaps between the two lines of lettering.
const topEnd = topText.span / 2; // radians either side of 12 o'clock
const bottomStart = Math.PI - bottomText.span / 2;
const sepAngle = (topEnd + bottomStart) / 2;
const sepDots = [sepAngle, -sepAngle]
  .map((a) => circlePath(f(C + BAND_MID * Math.sin(a)), f(C - BAND_MID * Math.cos(a)), 3.4))
  .join('');

const innerDots = dotsRing({ cx: C, cy: C, r: 136, count: 96, dot: 1.7 });

const mono = monogramPaths();
const MONO_W = 152;
const monoScale = MONO_W / mono.w;
const monoX = C - MONO_W / 2;
const monoY = C - (mono.h * monoScale) / 2;
const monoTransform = `translate(${f(monoX)} ${f(monoY)}) scale(${f(monoScale)})`;

console.log('top span', (topText.span*180/Math.PI).toFixed(1), 'bottom span', (bottomText.span*180/Math.PI).toFixed(1), 'sep at', (sepAngle*180/Math.PI).toFixed(1));
const lettering = `${topText.d}${bottomText.d}${sepDots}`;

const header = (title, desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-labelledby="t d">` +
  `<title id="t">${title}</title><desc id="d">${desc}</desc>`;
const DESC = 'Circular seal with a column-style H monogram, lettered Helen Popich Harris, Board Certified Family Law Specialist.';

// Full colour — faithful to the printed seal.
const sealColor =
  header('Helen Popich Harris seal', DESC) +
  `<path fill="${COLORS.burgundy}" d="${circlePath(C, C, R_OUTER)}"/>` +
  `<path fill="${COLORS.gold}" d="${circlePath(C, C, R_BAND_OUT)}"/>` +
  `<path fill="${COLORS.burgundy}" d="${circlePath(C, C, R_BAND_IN)}"/>` +
  `<path fill="${COLORS.burgundy}" d="${lettering}"/>` +
  `<path fill="${COLORS.gold}" d="${innerDots}"/>` +
  `<path fill="${COLORS.gold}" transform="${monoTransform}" d="${mono.d}"/>` +
  `</svg>`;

// Single-colour line version (uses currentColor-friendly single fill).
const sealMono = (color, title) =>
  header(title, DESC) +
  `<g fill="${color}">` +
  `<path fill-rule="evenodd" d="${circlePath(C, C, R_OUTER)}${circlePath(C, C, R_OUTER - 1.6)}"/>` +
  `<path fill-rule="evenodd" d="${circlePath(C, C, R_BAND_OUT)}${circlePath(C, C, R_BAND_OUT - 0.9)}"/>` +
  `<path fill-rule="evenodd" d="${circlePath(C, C, R_BAND_IN + 0.9)}${circlePath(C, C, R_BAND_IN)}"/>` +
  `<path d="${lettering}"/>` +
  `<path d="${innerDots}"/>` +
  `<path transform="${monoTransform}" d="${mono.d}"/>` +
  `</g></svg>`;

const monogramSvg = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mono.w} ${mono.h}" role="img" aria-label="H monogram">` +
  `<path fill="${color}" d="${mono.d}"/></svg>`;

const files = {
  'seal-color.svg': sealColor,
  'seal-brass.svg': sealMono(COLORS.brass, 'Helen Popich Harris seal'),
  'seal-ink.svg': sealMono(COLORS.ink, 'Helen Popich Harris seal'),
  'seal-current.svg': sealMono('currentColor', 'Helen Popich Harris seal'),
  'monogram.svg': monogramSvg(COLORS.ink),
  'monogram-current.svg': monogramSvg('currentColor'),
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT_SRC, name), svg);
  if (!name.includes('current')) fs.writeFileSync(path.join(OUT_PUBLIC, name), svg);
  console.log(`✓ ${name} (${(svg.length / 1024).toFixed(1)} KB)`);
}
