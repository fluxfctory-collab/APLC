# QA Report

**Build tested:** production build (`REVIEW_MODE=false`) of commit series `Phase 1` → `Phase 8`, October 4, 2026.
**Environment:** served locally with gzip compression (`serve`, trailing-slash URLs as on Netlify). Tools: headless **Chromium 141.0.7390.37** via Playwright 1.56, **Lighthouse 13.5.0**, **axe-core 4.13.0**, Astro 7.3.5.

## Summary

| Area | Target (brief) | Result |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 95 | **100** on all pages tested |
| Lighthouse Accessibility / Best Practices / SEO (mobile + desktop) | ≥ 95 | **100 / 100 / 100** on all pages tested |
| Largest Contentful Paint (mobile) | < 2.0 s | **1.20–1.88 s** |
| Cumulative Layout Shift | < 0.05 | **0.000–0.003** |
| Total JavaScript | < 30 KB | **≤ 2.8 KB per page** (small inline scripts only; no framework; 0 external JS files) |
| Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA rules) | WCAG 2.2 AA | **0 violations**: 15 pages × 2 widths, plus the open mobile menu |
| Keyboard / behaviour checks | — | **22 / 22 passed** |
| Internal links | all valid | **0 broken** (715 references, 15 pages) |
| External links | all valid | 3 links. They could not be requested from the build sandbox, but each was corroborated by search results (see below). **Re-check after deploy.** |
| Form | tested + documented | Client-side validation and the submission payload were verified. **The live Netlify end-to-end test is pending deployment** (steps below). |
| Type check (`astro check`) | — | 0 errors, 0 warnings, 0 hints |
| SEO audit (`scripts/qa/seo-check.mjs`) | — | 0 problems: one `<h1>` per page, canonicals, valid JSON-LD, no leaked review markers, all images with alt text and dimensions |

---

## 1. Lighthouse (mobile and desktop)

Mobile uses Lighthouse's default simulated mid-range phone on a slow 4G connection; desktop uses the desktop preset. Raw output is in `qa/lighthouse-summary.txt`.

| Page | Perf | A11y | Best Pr. | SEO | FCP | LCP | CLS | TBT | Weight |
|---|---|---|---|---|---|---|---|---|---|
| Home — mobile | 100 | 100 | 100 | 100 | 0.91 s | **1.88 s** | 0.000 | 0 ms | 173 KB |
| Home — desktop | 100 | 100 | 100 | 100 | 0.25 s | 0.41 s | 0.003 | 0 ms | 159 KB |
| About — mobile | 100 | 100 | 100 | 100 | 1.20 s | **1.65 s** | 0.000 | 0 ms | 127 KB |
| About — desktop | 100 | 100 | 100 | 100 | 0.33 s | 0.37 s | 0.001 | 0 ms | 111 KB |
| Practice Areas — mobile | 100 | 100 | 100 | 100 | 0.90 s | **1.35 s** | 0.000 | 0 ms | 95 KB |
| Practice Areas — desktop | 100 | 100 | 100 | 100 | 0.24 s | 0.36 s | 0.001 | 0 ms | 95 KB |
| Spousal Support — mobile | 100 | 100 | 100 | 100 | 1.05 s | **1.20 s** | 0.000 | 0 ms | 90 KB |
| Spousal Support — desktop | 100 | 100 | 100 | 100 | 0.28 s | 0.32 s | 0.001 | 0 ms | 90 KB |
| Contact — mobile | 100 | 100 | 100 | 100 | 0.90 s | **1.43 s** | 0.002 | 0 ms | 102 KB |
| Contact — desktop | 100 | 100 | 100 | 100 | 0.24 s | 0.36 s | 0.001 | 0 ms | 102 KB |

**Informational insights not addressed locally:**
- *Cache lifetimes:* the local test server sends no cache headers. In production, `netlify.toml` sets one-year immutable caching for `/_astro/*` (fingerprinted) and `/fonts/*`.
- *Network dependency tree:* the font requests follow the HTML document. This is expected and is not on the LCP path, since the LCP element is the portrait image.

**Performance changes made during QA:**
1. The 70 KB seal SVG was inlined on every page (twice on Home). It is now a cached `<img>`, and its path precision was reduced. Home HTML went from 222 KB to 78 KB uncompressed.
2. CLS (0.047 on Practice Areas) came from the italic display face swapping in. The italic is now preloaded only on pages whose `<h1>` uses italics, which brought CLS to 0.
3. LCP: the hero image now decodes asynchronously with a lighter AVIF encode. Below-the-fold sections use `content-visibility: auto`. The body font is no longer preloaded (CSS is inline, so it is discovered at once). The rarely used 600-weight serif was retired, leaving one fewer font per page. The About portrait now leads on phones, as on Home. Home mobile LCP went from 2.30 s to 1.88 s.

## 2. Accessibility

**Automated:** `scripts/qa/axe.mjs` runs axe-core with the `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` rules on every page at 390 px and 1440 px, and on the open mobile menu. **0 violations.** An early run flagged colour contrast on two elements; these were false positives from text caught mid-way through its reveal fade-in. The script now waits for transitions to finish.

**Colour contrast (design tokens):** body text ink on ivory is 15.1:1. Secondary text (slate) is 7.3:1. Small brass text uses a darker brass-text tone at 5.1:1. Brass on the dark sections is 5.0:1, and muted text on dark is 6.8:1. Form-control borders are 3.6:1 (non-text contrast ≥ 3:1). The oxblood link-hover colour is 9.0:1. The full table is in `src/styles/tokens.css` and on `/styleguide/`.

**Behaviour (`scripts/qa/interaction.mjs`, 22/22 passed):**
- The first Tab focuses "Skip to main content," which moves focus to `<main>`. Keyboard order reaches the hero calls to action.
- A visible focus ring of at least 2 px is shown (ink on light backgrounds, brass on dark).
- The mobile menu is a native modal `<dialog>`. It opens from the keyboard and focus moves inside it. Tab is contained in the dialog. The current page is marked with `aria-current`. Esc closes it and returns focus to the toggle, and `aria-expanded` stays in sync.
- The mobile Call/Inquire bar is visible, with tap-to-call `tel:+13372916092`. Tap targets are at least 44 px.
- Form controls use 17 px text, which prevents iOS zoom.
- The FAQ `<details>` disclosures operate from the keyboard.
- With `prefers-reduced-motion: reduce`, all content is visible immediately and there is no movement.
- With JavaScript disabled, all content stays visible and the form still submits (plain POST).

**Structure:** landmarks (header, nav, main, footer), one `<h1>` per page, no skipped heading levels, labelled form fields, and alt text on every image. Decorative images and SVGs are hidden from assistive technology.

## 3. Links

`scripts/qa/links.mjs` checks every `href`, `src` and `srcset` value in `dist/`, plus every in-page `#anchor`: **715 internal references, 0 broken.**

| External link | Result from build environment | Corroboration |
|---|---|---|
| `https://www.aaml.org/lawyer/helen-harris/` (AAML profile) | Blocked by the sandbox egress proxy (no network path) | The search index returns Ms. Harris's AAML profile (as `aaml.org/?p=3994`), with her address, 1991 Loyola J.D. and bar admission. |
| Super Lawyers profile (`profiles.superlawyers.com/…/helen-popich-harris/d2dcb886-…html`) | Blocked by the sandbox egress proxy | URL taken verbatim from the brief. Not independently confirmed. |
| Google Maps search link | Blocked by the sandbox egress proxy | Standard Maps URL format (`/maps/search/?api=1&query=…`) |

**Action after deploy:** run `node scripts/qa/links.mjs dist --external` from an unrestricted network, and click each profile link once by hand. Martindale-Hubbell and Acadiana Profiles links are intentionally left blank until supplied (TODO B2, B3).

## 4. Contact form

**Verified in this environment** (Chromium, with the POST intercepted):
- The built HTML carries everything Netlify Forms needs: `name="inquiry"`, `data-netlify="true"`, `netlify-honeypot="company"`, a hidden `form-name=inquiry` field, `method="POST"`, and `action="/thank-you/"`.
- An empty submit shows 4 inline errors (name, phone, email, consent). Focus moves to the first invalid field, which gets `aria-invalid="true"` and an `aria-describedby` link to its error text. No request is sent.
- An invalid email is rejected. A phone number needs at least 10 digits.
- A valid submit POSTs every field (`form-name, company (empty honeypot), name, phone, email, contact_method, matter_type, other_party, message, consent`) and lands on `/thank-you/`.

**Pending, as it requires the live Netlify deployment.** Run this test and record the result here:

| Step | Expected | Result |
|---|---|---|
| Submit "TEST — please ignore" on the live `/contact/` | Redirects to `/thank-you/` | ☐ |
| Netlify → Forms → `inquiry` | Submission listed with all fields | ☐ |
| Notification inbox | Email received (check junk) | ☐ |
| Delete the test submission | — | ☐ |

Date / tester: ____________________

## 5. Browser and device matrix

| Browser / device | How tested | Result |
|---|---|---|
| Chromium 141 (Chrome/Edge engine), desktop | Lighthouse, axe, interaction suite, screenshots | ✓ |
| Chromium, phone emulation (390×844, touch, mobile UA) | Interaction suite (menu, call bar, form), axe, screenshots | ✓ |
| Viewport widths **360, 390, 768, 1024, 1280, 1440, 1920** | Screenshots of Home, About, Practice Areas, Spousal Support and Contact (`qa/screenshots/*.jpg`, above the fold; full-page versions at 390 and 1440) | ✓, after two fixes (below) |
| Safari (macOS and iOS), Firefox, Samsung Internet, real Android/iPhone hardware | **Not available in this environment** | **To do before launch:** a 10-minute manual pass on an iPhone (Safari) and one Android phone: menu, call bar, form, the hero crop, and the fonts. |

**Layout issues found and fixed through the width matrix:**
1. **1024 px:** the hero portrait is sized from viewport height, and it overflowed its column on tall viewports, covering the headline. It is now capped at the column width.
2. **768 px:** the long header tagline ran under the "Schedule a Consultation" button. The tagline now shows only where there is room.

## 6. Content and SEO checks

- Titles, descriptions, canonicals and Open Graph/Twitter tags are on every page. Title lengths are 37–66 characters, except the Home title, which uses the brief's 92-character example; a shorter option is in `COPY-OPTIONS.md` §6.
- JSON-LD parses on every page. Items still flagged `[[CONFIRM]]` are left out of structured data: opening hours, the AAML Certified Arbitrator credential, and the Martindale/Acadiana profile links.
- The sitemap (`/sitemap-index.xml`) lists 12 indexable URLs and excludes `/styleguide/`, `/thank-you/` and `/404/`, which are also `noindex`. `robots.txt` disallows `/admin/` only.
- Review markers: the production build contains **0** marker flags, and no HTML comments reach the output.
- The CMS (`/admin`) was loaded in Chromium against `decap-server` (local Git backend). The configuration validated, all collections listed, and entries opened with their saved content.

## 7. Re-running QA

```bash
REVIEW_MODE=false npm run build
npx serve dist -l 4400                      # any static server with gzip + trailing slashes
npm run check
node scripts/qa/seo-check.mjs
node scripts/qa/links.mjs dist --external
AXE_PATH=node_modules/axe-core/axe.min.js node scripts/qa/axe.mjs http://localhost:4400   # npm i -D axe-core
node scripts/qa/interaction.mjs http://localhost:4400
scripts/qa/lighthouse.sh http://localhost:4400 qa/lighthouse && node scripts/qa/lh-summary.mjs qa/lighthouse
node scripts/qa/screenshots.mjs http://localhost:4400 qa/screenshots / /about/ /practice-areas/ /contact/
```
