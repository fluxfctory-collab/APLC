/** Summarise Lighthouse JSON reports: scores, LCP, CLS, TBT, JS bytes, failing audits. */
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2] ?? 'qa/lighthouse';
const rows = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!r.categories) { console.log(f, 'ERROR', r.runtimeError?.message); continue; }
  const s = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
  const a = r.audits;
  const jsBytes = (a['resource-summary']?.details?.items ?? []).find((i) => i.resourceType === 'script')?.transferSize ?? 0;
  const total = (a['resource-summary']?.details?.items ?? []).find((i) => i.resourceType === 'total')?.transferSize ?? 0;
  rows.push({
    page: f.replace('.json', ''),
    perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'),
    LCP: a['largest-contentful-paint']?.displayValue, CLS: a['cumulative-layout-shift']?.displayValue,
    TBT: a['total-blocking-time']?.displayValue, JS: `${(jsBytes / 1024).toFixed(1)} KB`, total: `${(total / 1024).toFixed(0)} KB`,
  });
  const failing = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && ['binary', 'numeric', 'metricSavings'].includes(x.scoreDisplayMode) && !x.id.startsWith('metrics'));
  if (failing.length) console.log(f, 'below 0.9:', failing.map((x) => `${x.id}(${x.score})`).join(', '));
}
console.table(rows);
