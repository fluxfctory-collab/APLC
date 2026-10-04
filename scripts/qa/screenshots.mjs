/**
 * Full-page screenshots of built pages at the brief's test widths.
 * Usage: node scripts/qa/screenshots.mjs [baseUrl] [outDir] [paths…] [--widths=390,1440]
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const pos = args.filter((a) => !a.startsWith('--'));
const base = pos[0] ?? 'http://localhost:4321';
const outDir = pos[1] ?? 'qa/screenshots';
const paths = pos.slice(2).length ? pos.slice(2) : ['/'];
const widths = (flags.widths ?? '360,390,768,1024,1280,1440,1920').split(',').map(Number);
const full = flags.full !== 'false';

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 768 ? 844 : w < 1280 ? 1024 : 900 },
    deviceScaleFactor: flags.dpr ? Number(flags.dpr) : 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      // Trigger lazy images + reveal, then return to top.
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
      await document.fonts.ready;
    });
    await page.waitForTimeout(300);
    const name = `${(p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home')}-${w}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: full });
    console.log('✓', name);
  }
  await ctx.close();
}
await browser.close();
