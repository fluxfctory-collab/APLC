/**
 * Static SEO/markup audit of the built site (dist/).
 * Checks every page for: one <h1>, <title> and description length, canonical,
 * valid JSON-LD, no leaked [[CONFIRM]] markers or HTML comments, heading order,
 * images with alt and dimensions. Usage: node scripts/qa/seo-check.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'admin' && f !== '_astro') walk(p); }
    else if (f.endsWith('.html')) pages.push(p);
  }
})(DIST);

let problems = 0;
const warn = (_page, msg) => { problems++; console.log(`  ✗ ${msg}`); };
for (const file of pages.sort()) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(DIST, file).replace(/index\.html$/, '');
  console.log(rel);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = /<meta name="robots" content="noindex/.test(html);
  console.log(`  title (${title.length}): ${title}`);
  console.log(`  description (${desc.length})${noindex ? ' · noindex' : ''}`);
  if (h1s !== 1) warn(rel, `${h1s} <h1> elements`);
  if (!canonical) warn(rel, 'no canonical');
  if (title.length < 20) warn(rel, `title length ${title.length}`);
  if (title.length > 65) console.log(`  · note: title is ${title.length} characters (Google may truncate)`);
  if (!noindex && (desc.length < 70 || desc.length > 165)) warn(rel, `description length ${desc.length}`);
  if (/<!--/.test(html)) warn(rel, 'HTML comment present in output');
  const head = html.slice(0, html.indexOf('</head>'));
  if (/\[\[CONFIRM/.test(head)) warn(rel, 'review marker leaked into <head>');
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      if (JSON.stringify(data).includes('[[CONFIRM')) warn(rel, 'review marker in JSON-LD');
      const types = (data['@graph'] ?? [data]).map((n) => n['@type']).join(', ');
      console.log(`  JSON-LD: ${types}`);
    } catch (e) { warn(rel, 'invalid JSON-LD: ' + e.message); }
  }
  // heading order: no jumps of more than one level
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { warn(rel, `heading jump h${levels[i - 1]} → h${levels[i]}`); break; }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt(="|[\s>/])/.test(img)) warn(rel, 'img without alt: ' + img.slice(0, 80)); // bare `alt` = decorative
    if (!/\bwidth="\d+"/.test(img) || !/\bheight="\d+"/.test(img)) warn(rel, 'img without width/height: ' + img.slice(0, 80));
  }
}
console.log(`\n${pages.length} pages, ${problems} problem(s)`);
process.exitCode = problems ? 1 : 0;
