# Helen Popich Harris, APLC — website

The website for Helen Popich Harris, APLC, a boutique family law practice in Lafayette, Louisiana. It is built with [Astro](https://astro.build) as a static site with almost no client-side JavaScript. The client edits it through a Git-based editor (Decap CMS) at `/admin`, and it is hosted on Netlify.

| Document | For |
|---|---|
| [`EDITING-GUIDE.md`](EDITING-GUIDE.md) | The client: how to log in, edit text, replace a photo, publish |
| [`HANDOFF.md`](HANDOFF.md) | Hosting, domain, SSL, form notifications, Search Console, admin access, costs |
| [`TODO-CLIENT.md`](TODO-CLIENT.md) | Everything still to confirm or supply before launch |
| [`COPY-FOR-APPROVAL.md`](COPY-FOR-APPROVAL.md) | Every word on the site, page by page (generated) |
| [`COPY-OPTIONS.md`](COPY-OPTIONS.md) | Alternative headlines, taglines and optional passages |
| [`COMPLIANCE-CHECKLIST.md`](COMPLIANCE-CHECKLIST.md) | Louisiana attorney-advertising items for Ms. Harris to verify |
| [`QA-REPORT.md`](QA-REPORT.md) | Lighthouse, accessibility, link and form test results |

---

## Quick start

Requirements: **Node.js 22.12 or newer** and npm.

```bash
npm install
npm run dev          # http://localhost:4321 (review markers visible)
npm run build        # production build into dist/
npm run preview      # serve the build locally
```

Production builds follow the CMS **Review mode** switch. To force review markers off for a one-off build, use `npm run build:prod` (sets `REVIEW_MODE=false`).

### Editing content locally (developers)

```bash
npm run cms          # starts decap-server (local Git backend) on :8081
npm run dev          # then open http://localhost:4321/admin/
```

`local_backend: true` in `public/admin/config.yml` lets the editor write straight to your working copy, with no login.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `preview` | Astro development server, build, preview |
| `npm run check` | Type-check `.astro` and `.ts` files (`astro check`) |
| `npm run copy` | Regenerate `COPY-FOR-APPROVAL.md` and `docs/confirm-markers.md` from content |
| `npm run qa` | Static SEO/markup audit and internal link check on `dist/` |
| `npm run assets` | Re-process the client's original photos and the AAML logo (`brief-assets/` → `src/assets/uploads/`) |
| `npm run seal` | Regenerate the seal and monogram SVGs (`src/assets/brand/`, `public/brand/`) |
| `npm run og` | Regenerate favicons and the 1200×630 share image (`public/`) |

Further QA tools live in `scripts/qa/`: `axe.mjs` (accessibility), `interaction.mjs` (keyboard, menu and form behaviour), `lighthouse.sh` + `lh-summary.mjs`, `screenshots.mjs`. Usage notes are at the top of each file and in `QA-REPORT.md`.

---

## How it is put together

```
brief-assets/             Client's original files (untouched)
public/
  admin/                  CMS: index.html + config.yml
  brand/                  Seal SVGs (colour, brass, ink) + scan reference
  fonts/                  Self-hosted WOFF2 (Cormorant Garamond, Source Sans 3)
  og/                     Social share image
src/
  assets/brand/           Seal/monogram SVG sources (inlined where needed)
  assets/uploads/         ALL editable photos and logos (CMS media folder)
  components/             Header, Footer, CredentialsBand, Badge, Photo, …
  components/home/        Home page sections
  content/                ALL editable text (Markdown/JSON), one folder per collection
  content.config.ts       Content schema; mirrors public/admin/config.yml
  layouts/                Base (head/SEO/header/footer) and Legal
  lib/                    Content helpers, image resolution, JSON-LD, review markers
  middleware.ts           Applies review markers and strips HTML comments
  pages/                  Routes (/, /about/, /practice-areas/[slug]/, …)
  styles/                 tokens.css (design tokens + fonts), base.css, components.css
scripts/                  Asset pipeline, copy export, QA tooling
```

### Design system
"Quiet authority": ivory paper, ink and brass, Cormorant Garamond with Source Sans 3. Every colour pairing meets WCAG AA (ratios are noted in `src/styles/tokens.css`). The living reference is at **`/styleguide/`** (noindex, excluded from the sitemap).

### Content and the CMS
- Every editable string and image is in `src/content/` and validated by `src/content.config.ts`. The CMS (`public/admin/config.yml`) maps 1:1 to that schema, so **change both together**.
- Image fields hold paths like `/src/assets/uploads/photo.jpg`. `src/lib/images.ts` resolves them by file name, and `<Photo>` generates AVIF/WebP/JPEG at 480–2000 px (never upscaled) with explicit dimensions. A missing image fails the build loudly rather than publishing a broken page, and the previous deploy stays live.
- Text supports `*italics*` in headings, and `{phone}` in a few button labels.

### Review markers
Write `[[CONFIRM]]` or `[[CONFIRM: note]]` anywhere in content to flag an unverified fact. `src/middleware.ts` renders these markers as small visible flags when **review mode** is on (the CMS switch under Site settings, or `REVIEW_MODE=true`). When review mode is off, the markers are removed. Markers are always removed from `<head>`, attributes and JSON-LD. Structured data leaves out anything still flagged. `docs/confirm-markers.md` lists the markers that remain.

### SEO
Per-page titles and descriptions come from the CMS. JSON-LD (`src/lib/schema.ts`) covers LegalService, Person, WebSite, ProfilePage, ContactPage, FAQPage, Service and BreadcrumbList. The site also has a sitemap (`@astrojs/sitemap`), a generated `robots.txt`, canonical URLs, Open Graph/Twitter cards, a favicon set and a web manifest. Set the canonical domain with `SITE_URL` (see `netlify.toml`).

### Performance notes
- CSS is fully inlined. The only JavaScript is a few small inline scripts (header state, menu, reveal-on-scroll, form validation, map facade), about 3 KB in total.
- Only the display serif is preloaded, plus its italic on pages whose `<h1>` uses italics. Metric-matched fallback faces keep layout shift at about zero.
- Below-the-fold sections use `content-visibility: auto`. The hero image is the only eager, high-priority image.
- The Contact-page map loads only on request (no third-party requests or cookies by default).

### Forms
The inquiry form uses **Netlify Forms** (`data-netlify`, honeypot field `company`, redirect to `/thank-you/`). It works without JavaScript; with JavaScript it adds accessible inline validation. Do not rename the form (`inquiry`) or its fields without updating the Netlify notification setup. See `HANDOFF.md`.

### Regenerating brand assets
`scripts/build-seal.mjs` redraws the seal from geometry measured off the scanned business card, and outlines all lettering with opentype.js. `scripts/build-og.mjs` renders the share image in headless Chromium using the site's fonts (it needs `playwright-core` and a Chromium build; set `PLAYWRIGHT_BROWSERS_PATH` if Chromium isn't found).
