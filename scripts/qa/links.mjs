/**
 * Link check: every internal href/src in dist/ must resolve to a built file;
 * every in-page #anchor must exist; external URLs are listed and requested.
 * Usage: node scripts/qa/links.mjs [dist] [--external]
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist';
const external = process.argv.includes('--external');
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'admin') walk(p); } else if (f.endsWith('.html')) pages.push(p);
  }
})(DIST);

const resolve = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  const candidates = [clean, path.join(clean, 'index.html'), clean.replace(/\/$/, '') + '.html'];
  return candidates.some((c) => fs.existsSync(path.join(DIST, c)) && fs.statSync(path.join(DIST, c)).isFile());
};

const ext = new Map();
let broken = 0;
let checked = 0;
const idsByPage = new Map(pages.map((p) => [p, new Set([...fs.readFileSync(p, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(DIST, file).replace(/index\.html$/, '');
  for (const [, attr, url] of html.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
    for (let u of attr === 'srcset' ? url.split(',').map((s) => s.trim().split(' ')[0]) : [url]) {
      if (/^(mailto:|tel:|data:)/.test(u)) continue;
      if (/^https?:\/\//.test(u)) { u = u.replace(/&amp;/g, '&'); if (!u.includes('harrisaplc.com')) ext.set(u, (ext.get(u) ?? new Set()).add(rel)); continue; }
      checked++;
      if (u.startsWith('#')) {
        if (u.length > 1 && !idsByPage.get(file).has(u.slice(1))) { broken++; console.log(`✗ ${rel}: missing anchor ${u}`); }
        continue;
      }
      const abs = u.startsWith('/') ? u : path.posix.join(rel, u);
      if (!resolve(abs)) { broken++; console.log(`✗ ${rel}: ${u}`); continue; }
      const hash = u.split('#')[1];
      if (hash) {
        const target = pages.find((p) => '/' + path.relative(DIST, p).replace(/index\.html$/, '') === abs.split('#')[0]);
        if (target && !idsByPage.get(target).has(hash)) { broken++; console.log(`✗ ${rel}: missing anchor ${u}`); }
      }
    }
  }
}
console.log(`Internal: ${checked} references across ${pages.length} pages, ${broken} broken`);

console.log(`\nExternal links (${ext.size}):`);
for (const [u, from] of ext) {
  let status = 'not requested';
  if (external) {
    try {
      const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (link check)' } });
      status = String(r.status);
    } catch (e) { status = 'ERROR ' + (e.cause?.code ?? e.message); }
  }
  console.log(`  [${status}] ${u}  (on ${from.size} page${from.size > 1 ? 's' : ''})`);
}
process.exitCode = broken ? 1 : 0;
