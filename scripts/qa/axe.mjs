/**
 * axe-core accessibility scan (WCAG 2.0/2.1/2.2 A + AA rules) of every page,
 * at phone and desktop widths, including the open mobile menu.
 * Usage: AXE_PATH=path/to/axe.min.js node scripts/qa/axe.mjs [baseUrl]
 */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:4400';
const axeSource = fs.readFileSync(process.env.AXE_PATH ?? 'node_modules/axe-core/axe.min.js', 'utf8');
const pages = ['/', '/about/', '/practice-areas/', '/practice-areas/divorce/', '/practice-areas/community-property-partitions/',
  '/practice-areas/high-value-marital-estates/', '/practice-areas/spousal-support/', '/practice-areas/retirement-division-qdros/',
  '/practice-areas/child-support/', '/contact/', '/privacy/', '/disclaimer/', '/thank-you/', '/404.html', '/styleguide/'];
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const browser = await chromium.launch();
let total = 0;
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
    await page.waitForTimeout(450); // let reveal transitions finish (opacity affects contrast)
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate((t) => window.axe.run(document, { runOnly: { type: 'tag', values: t } }), tags);
    total += res.violations.length;
    const v = res.violations.map((x) => `${x.id} (${x.impact}) ×${x.nodes.length}: ${x.nodes[0].target.join(' ')}`);
    console.log(`${width}px ${p.padEnd(48)} ${res.violations.length ? '✗ ' + v.join(' | ') : '✓ 0 violations'} · ${res.passes.length} passes`);
  }
  if (width === 390) {
    // Mobile menu open
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.click('[data-menu-open]');
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate((t) => window.axe.run(document, { runOnly: { type: 'tag', values: t } }), tags);
    total += res.violations.length;
    console.log(`390px / (menu open)${' '.repeat(30)} ${res.violations.length ? '✗ ' + res.violations.map((x) => x.id).join(', ') : '✓ 0 violations'}`);
  }
  await page.close();
}
await browser.close();
console.log(`\nTotal violations: ${total}`);
process.exitCode = total ? 1 : 0;
