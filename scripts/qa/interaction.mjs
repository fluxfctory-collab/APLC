/**
 * Behavioural checks in Chromium: skip link, keyboard menu, form validation and
 * submission payload (Netlify fields), map facade, FAQ disclosure, reduced motion.
 * Usage: node scripts/qa/interaction.mjs [baseUrl]
 */
import { chromium } from 'playwright-core';

const base = process.argv[2] ?? 'http://localhost:4400';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();

/* ---- Skip link + keyboard order (desktop) ---------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('First Tab focuses the skip link', first === 'Skip to main content', first);
  await page.keyboard.press('Enter');
  const focused = await page.evaluate(() => document.activeElement?.id);
  check('Skip link moves focus to <main>', focused === 'main', focused);
  const tabs = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    tabs.push(await page.evaluate(() => (document.activeElement?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)));
  }
  check('Keyboard reaches hero calls to action after skip', tabs.some((t) => /Schedule a consultation/i.test(t)), tabs.join(' → '));
  // The ring may be drawn on the element or on its row (practice index uses li:has(a:focus-visible)).
  const ring = await page.evaluate(() => {
    let el = document.activeElement;
    for (let i = 0; i < 3 && el; i++, el = el.parentElement) {
      const s = getComputedStyle(el);
      if (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2) return `${el.tagName.toLowerCase()} ${s.outlineWidth} ${s.outlineStyle}`;
    }
    return 'none';
  });
  check('Focused element shows a visible focus ring (≥2px)', ring !== 'none', ring);
  await page.close();
}

/* ---- Mobile menu (dialog) --------------------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(base + '/about/', { waitUntil: 'networkidle' });
  const btn = page.locator('[data-menu-open]');
  await btn.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const open = await page.evaluate(() => document.querySelector('[data-menu]').open);
  const expanded = await btn.getAttribute('aria-expanded');
  check('Menu opens from the keyboard', open && expanded === 'true', `open=${open} aria-expanded=${expanded}`);
  const inDialog = await page.evaluate(() => !!document.activeElement?.closest('dialog'));
  check('Focus moves into the menu', inDialog);
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const stillIn = await page.evaluate(() => !!document.activeElement?.closest('dialog') || document.activeElement === document.body);
  check('Focus stays within the open menu (modal)', stillIn);
  const current = await page.locator('dialog a[aria-current="page"]').textContent();
  check('Current page marked in menu', /About/.test(current ?? ''), current?.trim());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => !document.querySelector('[data-menu]').open);
  const back = await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-open'));
  check('Escape closes menu and returns focus to the toggle', closed && back);
  const bar = await page.locator('.mobile-bar').isVisible();
  const callHref = await page.locator('.mobile-bar__call').getAttribute('href');
  check('Mobile Call/Inquire bar visible with tap-to-call link', bar && callHref === 'tel:+13372916092', callHref);
  const tapTargets = await page.$$eval('.mobile-bar a, .menu-toggle, .btn', (els) =>
    els.filter((e) => e.offsetParent).map((e) => Math.round(e.getBoundingClientRect().height)),
  );
  check('Tap targets ≥ 44px (bar, menu toggle, buttons)', tapTargets.every((h) => h >= 44), tapTargets.join(','));
  await page.close();
}

/* ---- Contact form ------------------------------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(base + '/contact/', { waitUntil: 'networkidle' });
  const attrs = await page.evaluate(() => {
    const f = document.querySelector('form[name="inquiry"]');
    return {
      netlify: f?.hasAttribute('data-netlify'),
      honeypot: f?.getAttribute('netlify-honeypot'),
      action: f?.getAttribute('action'),
      method: f?.getAttribute('method'),
      formName: f?.querySelector('input[name="form-name"]')?.value,
      hpField: !!f?.querySelector('input[name="company"]'),
      fontSizes: [...f.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea')].map((e) => parseFloat(getComputedStyle(e).fontSize)),
    };
  });
  check('Form carries Netlify attributes, honeypot and form-name', attrs.netlify && attrs.honeypot === 'company' && attrs.formName === 'inquiry' && attrs.hpField && attrs.action === '/thank-you/' && attrs.method === 'POST', JSON.stringify({ ...attrs, fontSizes: undefined }));
  check('Form controls use ≥16px text (no iOS zoom)', attrs.fontSizes.every((s) => s >= 16), attrs.fontSizes.join(','));

  // Empty submit → inline errors, focus on first invalid field
  const posted = [];
  await page.route('**/thank-you/', async (route) => {
    if (route.request().method() === 'POST') {
      posted.push(route.request().postData());
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>ok</p>' });
    } else await route.continue();
  });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(200);
  const errs = await page.$$eval('.field.has-error .field__error', (els) => els.map((e) => e.textContent.trim()));
  const focusId = await page.evaluate(() => document.activeElement?.id);
  const invalid = await page.getAttribute('#f-name', 'aria-invalid');
  const describedBy = await page.getAttribute('#f-name', 'aria-describedby');
  check('Empty submit shows 4 inline errors (name, phone, email, consent)', errs.length === 4, errs.join(' | '));
  check('Focus moves to first invalid field with aria-invalid + error description', focusId === 'f-name' && invalid === 'true' && /f-name-error/.test(describedBy ?? ''), `${focusId}, ${invalid}, ${describedBy}`);
  check('No POST sent while invalid', posted.length === 0);

  // Correct the fields → errors clear as you type
  await page.fill('#f-name', 'Test Inquiry (QA)');
  await page.fill('#f-phone', '337-555-0100');
  await page.fill('#f-email', 'not-an-email');
  await page.click('button[type="submit"]');
  const emailErr = await page.evaluate(() => document.querySelector('#f-email').closest('.field').classList.contains('has-error'));
  check('Invalid email is rejected', emailErr);
  await page.fill('#f-email', 'qa@example.com');
  await page.check('input[name="contact_method"][value="Email"]');
  await page.selectOption('#f-matter', 'Spousal Support');
  await page.fill('#f-other', 'Jane Doe');
  await page.fill('#f-message', 'QA test submission — please ignore.');
  await page.check('#f-consent');
  await Promise.all([page.waitForURL('**/thank-you/'), page.click('button[type="submit"]')]);
  const body = new URLSearchParams(posted[0] ?? '');
  const fields = Object.fromEntries(body.entries());
  check('Valid submit POSTs to /thank-you/ with all fields', fields['form-name'] === 'inquiry' && fields.name && fields.phone && fields.email === 'qa@example.com' && fields.contact_method === 'Email' && fields.matter_type === 'Spousal Support' && fields.other_party === 'Jane Doe' && fields.consent === 'Acknowledged' && fields.company === '', Object.keys(fields).join(', '));
  await page.close();
}

/* ---- Map facade, FAQ, reduced motion ----------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + '/contact/', { waitUntil: 'networkidle' });
  const before = await page.locator('.map iframe').count();
  await page.route(/google\.com/, (r) => r.fulfill({ status: 200, body: 'map' }));
  await page.click('[data-map-load]');
  const after = await page.locator('.map iframe').count();
  const title = await page.locator('.map iframe').getAttribute('title');
  check('Map loads only on request (no Google request before click)', before === 0 && after === 1 && !!title, title);

  await page.goto(base + '/practice-areas/', { waitUntil: 'networkidle' });
  const det = page.locator('#spousal-support details').first();
  await det.locator('summary').focus();
  await page.keyboard.press('Enter');
  check('FAQ disclosure opens from the keyboard', await det.evaluate((d) => d.open));
  await page.close();

  const rm = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await rm.goto(base + '/', { waitUntil: 'networkidle' });
  const op = await rm.evaluate(() => [...document.querySelectorAll('[data-reveal]')].map((e) => getComputedStyle(e).opacity));
  check('Reduced motion: all reveal elements fully visible without scrolling', op.every((o) => o === '1'), `${op.length} elements`);
  await rm.close();

  const nojs = await browser.newPage({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  await nojs.goto(base + '/', { waitUntil: 'networkidle' });
  const hidden = await nojs.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length).catch(() => -1);
  check('Without JavaScript all content remains visible', hidden === 0, `hidden=${hidden}`);
  await nojs.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;
