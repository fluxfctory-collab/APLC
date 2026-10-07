# Skills plan: UI polish pass

**Status: awaiting your approval. No site code has been changed.**

This plan applies the three installed plugins (inventory in `SKILLS-INVENTORY.md`) to the existing Astro site for Helen Popich Harris, APLC. The brand direction is fixed: quiet authority, with ivory, ink and brass, sparing oxblood, and Cormorant Garamond with Source Sans 3. Skill output is treated as input to that direction, never as a replacement for it.

Four decisions are yours to make before Phase 4. They are listed in §5. Each has a recommended default.

---

## 0. Acceptance gate (what "done" means)

Each gate below is checked by a real tool. Results go in `qa/after/` and `POLISH-REPORT.md`.

| Gate | Threshold | Checked with |
|---|---|---|
| Lighthouse, mobile and desktop, every page | ≥ 95 in all four categories | `scripts/qa/lighthouse.sh` + `lh-summary.mjs` |
| LCP (mobile) | < 2.0 s (baseline 1.20–1.88 s) | Lighthouse |
| CLS | < 0.05 (baseline 0.000–0.003) | Lighthouse + a scroll-through layout-shift trace |
| Accessibility | WCAG 2.2 AA, 0 axe violations at 390 and 1440, plus the open mobile menu | `scripts/qa/axe.mjs` |
| Keyboard / behaviour | Existing 22 checks pass, plus new checks for motion, focus clearance and GSAP scoping | `scripts/qa/interaction.mjs` (extended) |
| Reduced motion | No movement at all; final states shown immediately | Interaction suite with `reducedMotion: 'reduce'` |
| JS disabled | Every page fully readable; form submits by plain POST | Interaction suite with `javaScriptEnabled: false` |
| Copy unchanged | `npm run copy` regenerates `COPY-FOR-APPROVAL.md` with **zero diff** | `git diff --exit-code COPY-FOR-APPROVAL.md` |
| `[[CONFIRM]]` markers intact | `docs/confirm-markers.md` regenerates with zero diff | Same |
| CMS intact | `src/content.config.ts` and `public/admin/config.yml` unchanged (or additive only, with your approval) | `git diff` |
| Links | 0 broken internal references | `scripts/qa/links.mjs` |
| Types | `astro check`: 0 errors | `npm run check` |

---

## 1. Chosen skills and where each is used

| Skill (exact name) | Used for | Pages / components |
|---|---|---|
| **`ui-ux-pro-max:ui-ux-pro-max`** | Design review input. Ran `--design-system` for this brand plus targeted `--domain ux`, `typography`, `color`, `style`, `gsap` and `--stack astro` searches. Its `references/quick-reference.md` §1–§7 is the audit checklist (a11y, interaction, performance, layout, type/colour, motion, forms). | All pages. Specifically the type scale, heading balance, `focus-not-obscured` (mobile bar), form error handling, the motion rules (1–2 animated elements per view, interruptible, no layout shift) |
| **`ui-ux-pro-max:design-system`** | `scripts/validate-tokens.cjs` audit (found 52 hard-coded rem values and 4 hex colours in the CSS; the components also hold 63 distinct one-off `clamp()` expressions). `references/states-and-variants.md` for one state matrix (default / hover / active / focus-visible / disabled / error). | `src/styles/tokens.css`, `components.css`, buttons, links, fields, cards, every component's spacing |
| `ui-ux-pro-max:brand` (checklists only) | `consistency-checklist.md` and `logo-usage-rules.md`: clear space, minimum size and plate background for the AAML logo. Its sync scripts are **not** run. | `CredentialsBand`, `Badge`, About credentials grid, footer badges |
| **`gsap-skills:gsap-core`** | `gsap.from/to/set`, transform aliases + `autoAlpha` (no layout properties), `gsap.matchMedia()` for `prefers-reduced-motion`, `defaults({ ease: 'power2.out' })` | New `src/scripts/motion.ts` |
| **`gsap-skills:gsap-timeline`** | Short timelines with labels/position parameters: section marker sequence, credentials band sequence, pillar rules | Home (markers 01–03, credentials band, pillars, practice index, quote, CTA frame), About (markers, speaking list, credentials grid), Practice Areas overview (area numerals) |
| **`gsap-skills:gsap-performance`** | Transform/opacity only, no blanket `will-change`, `clearProps` after tweens, one context per section, nothing animating off-screen | Same |
| `gsap-skills:gsap-frameworks` (principles) | Scope selectors with `gsap.context(fn, sectionEl)`. Create after DOM ready. `revert()` if the page is ever restored from the back/forward cache | `motion.ts` |
| **`agent-skills:frontend-ui-engineering`** | Quality floor: one spacing scale, semantic tokens only, no "AI aesthetic" (no gradients, heavy shadows, rounded-everything, stock card grids), keyboard/focus rules, final UI review | Every component touched |
| **`agent-skills:performance-optimization`** (+ `performance-checklist.md`) | Baseline → change → re-measure. Keep or revert each performance-relevant change, with a ledger in `POLISH-REPORT.md`. Decides how GSAP loads. | `Base.astro`, `motion.ts`, fonts, images |
| **`agent-skills:incremental-implementation`** + **`git-workflow-and-versioning`** | One verified slice per commit in your order: global header/footer → Home → About → Practice Areas → Contact → 404/thank-you | All |
| **`agent-skills:code-review-and-quality`** (`/review`) | Five-axis self-review of each slice's diff before it is committed | All |
| **`agent-skills:source-driven-development`** | Check GSAP 3.15, Astro 7 script bundling and the CSS features used (`text-wrap`, `hanging-punctuation`, `::details-content`, `interpolate-size`, `scroll-padding`) against official docs / MDN, with links in the report | `motion.ts`, CSS |
| `agent-skills:test-driven-development` (adapted) | For each new behaviour, add the Playwright check first and see it fail. Examples: "focused field is not covered by the mobile bar", "no GSAP request on /contact/", "reduced motion: no transforms applied" | `scripts/qa/interaction.mjs` |
| `agent-skills:browser-testing-with-devtools` (workflow, no MCP) | Before/after screenshots, console must be clean, a11y tree checks, using the repo's Playwright + Chromium | Phase 3 / 5 |
| **`agent-skills:shipping-and-launch`** + `web-performance-auditor` rubric (`/webperf`, Deep mode on real Lighthouse JSON) | Phase 5 pre-ship checklist (performance, a11y, code quality) and the performance scorecard, with every value sourced from Lighthouse | `POLISH-REPORT.md` |
| `agent-skills:security-and-hardening` (dependency section only) | `npm audit` and licence check for the single new dependency, `gsap@3.15.0` (GSAP Standard no-charge licence, commercial use allowed) | `package.json` |

---

## 2. Skills deliberately not used

| Skill | Why not |
|---|---|
| `ui-ux-pro-max:design` | Generates logos, identity mockups and icons with Gemini/MuAPI. It would redraw or invent brand marks, which is prohibited, and it needs third-party API keys. |
| `ui-ux-pro-max:ui-styling` | shadcn/ui + Tailwind (React). Wrong stack. Adding either would add runtime and a second styling system. |
| `ui-ux-pro-max:slides` | Pitch decks; not relevant. |
| `ui-ux-pro-max:banner-design` | Only its safe-zone/contrast rule is used, as a checklist for the share image. Its art-direction menu (gradient, glassmorphism, neon, 3D) is off-brand. |
| `ui-ux-pro-max:brand` sync scripts | They would create `docs/brand-guidelines.md` + `assets/design-tokens.*`, a second source of truth next to `tokens.css`. |
| `gsap-skills:gsap-scrolltrigger` (as shipped code) | +18 KB gzip for "play once when it enters the viewport", which the site's existing 0.6 KB `IntersectionObserver` already does. Pin, scrub and parallax are excluded by the brief. |
| `gsap-skills:gsap-plugins` | SplitText fragments headings for screen readers and conflicts with `text-wrap: balance` (the skill notes this itself). ScrollSmoother is scroll-jacking. DrawSVG/MorphSVG aren't needed: the hairlines are 1px boxes animated with `scaleX`. |
| `gsap-skills:gsap-react` | No React. |
| `gsap-skills:gsap-utils` | Only `toArray` would be used, so there's nothing to learn from it beyond core. |
| `agent-skills:spec-driven-development`, `planning-and-task-breakdown`, `/build`, `/plan`, `/spec` | This document is the approved spec and plan. `/build auto` also requires a `SPEC.md` and a unit-test runner, neither of which exists. |
| `agent-skills:interview-me`, `idea-refine` | The direction is fixed and fully specified. |
| `agent-skills:constraint-driven-development` / `/constraints` | Your thresholds are already explicit (§0). I can add a `CONSTRAINTS.md` + `check:*` scripts if you want them enforced on future work. Not done by default. |
| `agent-skills:doubt-driven-development`, `/ship` fan-out, `code-reviewer` / `security-auditor` / `test-engineer` agents | Each spawns subagents (and offers external-model review). I'll apply their checklists inline. Say the word if you want the parallel `/ship` review at the end. |
| `agent-skills:api-and-interface-design`, `ci-cd-and-automation`, `deprecation-and-migration`, `observability-and-instrumentation`, `context-engineering`, `documentation-and-adrs`, `debugging-and-error-recovery` | No APIs, CI, migrations, runtime services or ADR convention here. Debugging is used only if something breaks. |

---

## 3. Conflicts between skill advice and the brand / performance constraints

| # | Skill says | Conflict | Resolution |
|---|---|---|---|
| C1 | `ui-ux-pro-max --design-system` for "law firm family law luxury boutique": palette **navy `#1E3A8A` + gold `#B45309` on cool grey `#F8FAFC`**, typography **EB Garamond / Lato** | Replaces ivory/ink/brass and the established type pairing | **Rejected.** The brand palette already passes AA everywhere (15.1:1 ink on ivory, 5.1:1 brass-text, 9.0:1 oxblood). Changing fonts would discard the metric-matched fallbacks that keep CLS ≈ 0. Kept from that output: its "Accessible & Ethical" checks (visible focus, skip link, 44px targets, reduced motion) and its anti-pattern "hidden credentials", which supports making the credentials band the trust anchor. |
| C2 | Same output, pattern "Trust & Authority + **Conversion**": security badges, case studies, transparent pricing, **logo carousel**, "Contact Sales / Get Quote" CTA | Startup/SaaS conversion pattern. Case results and testimonials raise Louisiana attorney-advertising issues (see `COMPLIANCE-CHECKLIST.md`). Carousels add motion. | **Rejected.** No new sections, badges, stats counters or carousels. The CTAs keep their approved wording. |
| C3 | `--domain style` top match: **Minimalism & Swiss**: sans-serif, black/white, radius 0, no shadows | Sans-serif monochrome isn't this brand | **Partially accepted.** Grid discipline, no shadows and the 2px radius stay. The serif and the ivory palette stay too. |
| C4 | `--domain typography`: Playfair/Inter, Cormorant/Montserrat, Cinzel/Josefin | All would change the approved pairing | **Rejected.** The pairing is already in the "luxury editorial" family the database recommends. |
| C5 | `quick-reference §7 spring-physics`: "prefer spring/physics curves" | Overshoot reads playful | **Rejected.** `power2.out` for most motion, `expo.out` for hairline draws, no overshoot, durations 0.4–0.9 s per your brief. |
| C6 | `--domain gsap` preset "Scroll Reveal / Subtle": ScrollTrigger with `toggleActions: 'play none none reverse'` | Reversing on scroll-up is fidgety, and ScrollTrigger costs +18 KB | **Rejected** reverse and ScrollTrigger. Play once, triggered by the existing `IntersectionObserver`. Kept from the same preset: small offsets (8–16px) and its rule "never hide content without a no-JS fallback". |
| C7 | `gsap-core`: "prefer GSAP over CSS" for animation | GSAP core costs **28.3 KB gzip / 25.7 KB brotli** (measured on `gsap@3.15.0`). Today's pages ship ≤ 2.8 KB of JS, and the original brief set a 30 KB ceiling. | **Scoped.** Core only, no plugins. Loaded **only** on Home, About and the Practice Areas overview, via dynamic `import()` after the `load` event during idle time, so it never competes with the LCP image (mobile LCP has only ~0.1 s of headroom: 1.88 s against < 2.0 s). Contact, the six practice-area detail pages, legal, 404 and thank-you load **no** GSAP. See decision **D1**. |
| C8 | Your brief: "refined hero entrance" via GSAP | GSAP arrives after `load` (≈2 s on simulated slow 4G). Anything it reveals in the hero would appear late or flash. | Hero **headline, subhead, CTAs and portrait are never hidden or animated** (the portrait is the LCP element). The entrance is limited to decorative brass details: eyebrow rule, passe-partout frame offset, caption hairline. I recommend running these as **CSS keyframes at first paint** (0 KB, can't arrive late), with GSAP owning the scroll choreography below the fold. See decision **D2**. |
| C9 | `gsap-performance`: add `will-change: transform` to animated elements | Permanent compositor layers cost memory on phones | Not set in CSS. GSAP applies it only for the duration of a tween and `clearProps` removes it afterwards. |
| C10 | `ui-ux-pro-max --stack astro`: "use framework components for interactivity; don't put `<script>` in .astro"; "use `<ClientRouter />` view transitions" | A React/Svelte island or a client router adds runtime JS for no gain on a brochure site | **Rejected.** Plain Astro `<script>` modules (already the pattern here). No client router. |
| C11 | `design-system`: three-layer tokens, HSL colours, Tailwind integration | A wholesale token rewrite would be churn and risk CMS-irrelevant regressions | **Partially accepted.** Add only what removes hard-coded values: a fluid rhythm scale (`--flow-*`), motion tokens (`--dur-*`, `--ease-*`), and component state tokens (`--btn-*-hover`). Existing token names stay. |
| C12 | `frontend-ui-engineering`: skeletons, loading/empty states, test at 320px | Mostly N/A for static content | Test widths are yours (390/768/1280/1440) plus 360 and 1024 spot checks. The form's submitting state already exists. |
| C13 | `performance-optimization` budget "Lighthouse ≥ 90" | Lower than yours | Yours (≥ 95) wins. |
| C14 | `brand` skill: run `sync-brand-to-tokens.cjs` | Would generate competing token files | Not run (see §2). |
| C15 | "Small-caps eyebrows" (your brief) | **The self-hosted font subsets contain no small-cap glyphs** (`smcp`/`c2sc` were stripped; checked with fontTools). `font-variant-caps` would make the browser fake them by shrinking capitals, which gives thin, uneven strokes. | Either re-subset Source Sans 3 from its upstream OFL release with `smcp, c2sc` kept (est. +5–10 KB on the body font, which isn't on the LCP path and has a metric-matched fallback), or keep tracked capitals with refined tracking. See decision **D3**. |

---

## 4. Prioritized UI improvements (before → after)

**P0** = trust anchor, accessibility and brand-integrity issues. **P1** = hierarchy and layout. **P2** = motion. **P3** = micro-details. The commit slice each item lands in is in brackets. The order of work follows your page sequence; priority decides what is cut if anything has to give.

### P0: trust, accessibility, brand integrity

1. **Credentials band: the trust anchor** *[Home]*
   - **Before:** The AAML logo plate floats in the band's header row, far right, detached from the "Fellow" credential it certifies. In the 3×2 grid, row two starts flush with no top rule. Where issuer lines wrap (narrower desktops), titles in the same row sit on different baselines. Credentials that have a profile link get no hover affordance in the band.
   - **After:** Each official plate sits inside the cell of the credential it belongs to, normalized to one optical height with brass-ruled clear space (brand skill: logo clear space, approved light background; never recoloured or redrawn). Issuer lines reserve two lines (`min-block-size: 2lh`), so every title in a row shares a baseline. Column hairlines run full height. A single brass top rule spans the grid and draws in once (P2). Linked credentials get a quiet brass underline + arrow on hover/focus, with "(opens in a new tab)" kept for screen readers. All content comes from the existing CMS fields; no new logos.

2. **Mobile Call/Inquire bar hides keyboard focus** *[global]*
   - **Before:** A fixed 60px bar with no `scroll-padding-bottom`, so a link or field focused near the bottom of the viewport can sit fully underneath it (WCAG 2.2 SC 2.4.11 *Focus Not Obscured*, AA; ui-ux-pro-max `focus-not-obscured`). On Contact the bar also covers fields while the phone keyboard is open.
   - **After:** `scroll-padding-bottom: calc(var(--bar-h) + safe-area + 1rem)` below 48em. The bar slides away (transform only) while a form field has focus and returns on blur. Refined detail: 1px brass divider between halves, optically centred icons, `:active` press state. A new interaction check proves a focused element is never covered.

3. **Header: no glass blur, no layout shift** *[global]*
   - **Before:** On scroll the header turns translucent with `backdrop-filter: blur(12px)` (the glassmorphism look you ruled out; ui-ux-pro-max `blur-purpose` also says blur is for dismissible overlays, not decoration). It condenses by **animating `height` from 96px to 68px on a sticky, in-flow element**, which shifts the whole page up 28px mid-scroll. I'll confirm the shift in the baseline trace.
   - **After:** Solid ivory with a brass-tinted hairline. The box keeps a constant height. Condensing is done with `transform` on the inner row (wordmark scales slightly, tagline fades), so nothing below moves. Zero layout shift.

4. **One alignment edge across pages** *[global]*
   - **Before:** Header, Home hero, bands and footer use the wide container (content edge 48px at 1440). Inner page headers and body sections use the standard container (edge 112px at 1440). On About, Practice Areas and Contact the wordmark and the page title don't line up, a 64px step on screens wider than ~1310px.
   - **After:** One outer content edge for every page. Inner pages keep the 68ch reading measure inside an editorial 12-column grid. Verified with a column overlay at 1280/1440.

5. **Hard-coded values → tokens** *[global]*
   - **Before:** 52 hard-coded rem values, 4 hex colours (e.g. button hover `#2c3039`, review-marker tints) and 63 distinct one-off `clamp()` spacings.
   - **After:** A six-step fluid rhythm scale (`--flow-2xs … --flow-xl`) plus the existing `--section` tokens. Every new or touched component references tokens only. `validate-tokens.cjs` is re-run and the count is reported before/after.

### P1: hierarchy, typography, layout

6. **Type scale and headings** *[global]*
   - **Before:** One tracking value (`-0.005em`) for every heading size; display `-0.015em`; leading 1.04 clips italic descenders in two-line `<em>` headlines. Body copy has no orphan control.
   - **After:** Optical tracking per step: display −0.02em, title −0.012em, heading 0, small text +0.01em. Leading per step: display 1.02–1.06 with room for italic descenders, title 1.1, heading 1.25. `text-wrap: balance` on headings (kept) and `text-wrap: pretty` on body paragraphs. Measure fixed at 65–70ch for prose. Lining figures stay for headings; tabular figures for phone numbers.

7. **Eyebrows and labels** *[global]*
   - **Before:** 12px uppercase via `text-transform`, tracked 0.18em, in Source Sans.
   - **After (D3 = re-subset):** true small caps (`font-variant-caps: all-small-caps`) at a size that matches cap height, with tracking tuned to 0.08–0.1em.
   - **After (D3 = keep):** tracking reduced to 0.14em at 12px, with an explicit size/tracking pair per use. Copy is identical either way (the CSS changes, not the words).

8. **Pull quotes with hanging punctuation** *[Home quote, About statement, prose blockquotes]*
   - **Before:** Quote text is centred and set without hanging punctuation. A quotation mark typed by the client in the CMS would indent the first line visibly.
   - **After:** `hanging-punctuation: first allow-end last` (Safari), plus a build-time cross-browser fallback: when CMS text begins with an opening quote, it is wrapped in a `.hang` span with a negative indent equal to the glyph's advance. Measure capped at about 28–32 words per line for the display quote.

9. **Home hero hierarchy** *[Home]*
   - **Before:** The copy column is vertically centred against the portrait, so at 1440 the credential line (y≈767) and the portrait caption (y≈759) almost line up but don't. The credential line competes with the CTAs in weight.
   - **After:** The columns share a bottom line: credential line and portrait caption sit on one baseline, with a brass hairline under both. Spacing between eyebrow → headline → subhead → CTAs follows the new rhythm scale. The credential line moves down one step in visual weight. Mobile (390×844): the portrait crop shortens (aspect 5:4.6 → about 5:4) with the focal point on the face, so the full headline and the first line of the subhead sit above the Call/Inquire bar.

10. **Inner page headers (About / Practice Areas / Contact / detail pages)** *[each page]*
    - **Before:** A single left column with the right half empty at desktop widths. On Contact the header fills the first viewport at 1440, and the details and form start at ~890px.
    - **After:** An asymmetric editorial header: eyebrow + title on columns 1–7, intro on columns 8–12, bottom-aligned to the title's last baseline, with the breadcrumbs on the shared top line. On Contact the header is shorter, so the address/phone list and the top of the form show in the first viewport at 1280/1440. Layout only; same words.

11. **Buttons, links, focus — one state system** *[global]*
    - **Before:** Hover states use hard-coded colours. The ghost button floods solid ink on hover, which is heavy for a secondary action. The arrow nudges 3px. There is no `:active` state. Focus ring offsets vary (3px, 1px, 4px).
    - **After:** A state matrix from `design-system/states-and-variants.md`, built from tokens. Primary: ink → ink-raised on hover, 1px press on `:active`. Ghost: transparent → brass border + ivory-paper fill (no ink flood). Text links: brass underline thickens 1→2px, oxblood hover kept as the sparing accent. Focus is always a 2px ink ring (brass on dark) at a 3px offset, including rows and plates. Reduced motion keeps colour changes only.

12. **Form fields** *[Contact]*
    - **Before:** White fields with a 1px `#8c8476` border (3.6:1, compliant). Label, help and error spacing is ad hoc. The error state is an oxblood border plus inset bar.
    - **After:** Fields sit on `--paper` and keep the 3:1 border. Label → field → help → error follow the rhythm scale. On focus a 2px ink outline appears and the border shifts to ink. The error state keeps text + icon + border (never colour alone). Validation behaviour, field names (`inquiry`, honeypot `company`) and Netlify attributes are untouched.

13. **Photography** *[global; asset pipeline]*
    - **Before:** The house grade (`scripts/process-assets.mjs`) is already applied, but the colour portrait still carries saturated red and blue book spines and a red vase that pull the eye from the face. `object-position` is tuned for only one breakpoint per image.
    - **After (D4):** Re-run the existing pipeline with the colour portraits' saturation stepped down (0.8 → about 0.68) and no other effects, keeping the same filenames so the CMS references don't change. Focal points are set per breakpoint (mobile face crop, desktop torso). The passe-partout offset becomes one token. The black-and-white portraits keep their warm-toned mono grade.

14. **Practice Areas overview navigation** *[Practice Areas]*
    - **Before:** The sticky "On this page" index gives no sign of where you are in a ~10,000px page.
    - **After:** The current section gets a brass tick and `aria-current="true"`, driven by `IntersectionObserver` (≈0.4 KB). Without JS it is a plain anchor list.

15. **FAQ disclosures** *[Practice Areas + detail pages]*
    - **Before:** `<details>` opens instantly with a plus/minus icon.
    - **After:** A smooth height transition via `::details-content` + `interpolate-size` where supported (CSS only, progressive; instant elsewhere and under reduced motion). The icon rotates. Hover tint stays oxblood. Still native `<details>`, so keyboard and screen-reader behaviour is unchanged.

16. **Mobile menu overlay** *[global]*
    - **Before:** A full-screen ivory `<dialog>` that fades down in 240ms. Its top bar uses the full header height, so it doesn't match a condensed header when opened after scrolling (the close button jumps).
    - **After:** The top bar matches the header state exactly (no jump). Links fade up with a 40ms stagger in CSS (no GSAP dependency, since the menu exists on every page). Hairlines and the current page are marked by an italic serif + brass numeral. Focus trap, Esc and focus return are unchanged.

### P2: motion (GSAP, restrained)

Rules for every animation: 0.4–0.9 s; `power2.out`, or `expo.out` for line draws; transform/opacity only; play once, never on scroll-up; at most two animated elements per view; nothing above the fold hidden before first paint; `gsap.matchMedia('(prefers-reduced-motion: reduce)')` shows final states with no tweening; no-JS shows everything.

17. **Signature section reveal: numbered markers** *[Home, About]*
    - **Before:** A generic 14px fade-up on almost every block, including body paragraphs and list items.
    - **After:** One choreographed sequence per section, triggered once by the existing observer. The italic numeral fades up 8px (0.5 s). The brass rule draws from 0 → full width (`scaleX`, origin left, 0.7 s, `expo.out`, starting 0.1 s later). The label fades in. The heading fades up 12px at +0.2 s. **Body prose is no longer animated**, so text you are reading is never moving.

18. **Hairlines drawing in** *[Home: credentials band top rule, pillar rules, practice index rows; About: speaking list, credentials grid]*
    - **Before:** Static rules. The practice index rule draws only on hover.
    - **After:** Rules draw left → right on first entry with a 60–80ms stagger per row (`scaleX`). Hover behaviour is kept.

19. **Hero entrance** *[Home; D2]*
    - **Before:** No entrance.
    - **After:** The eyebrow rule draws in, the brass passe-partout slides from 0 to its offset, and the caption hairline draws. 0.6–0.9 s total, decorative elements only. The headline and portrait are visible and still at first paint. Run as CSS at first paint (recommended) or as a GSAP timeline.

20. **Large practice-area numerals** *[Practice Areas overview]*
    - **Before:** Static brass 01–06.
    - **After:** Each numeral fades up 10px as its section enters, and the title follows 0.12 s later.

21. **Quote and closing CTA** *[Home, About]*
    - **Before:** A fade on the whole quote figure.
    - **After:** The opening mark fades in, then the quote fades up as one block (no per-line splitting), then the attribution rule draws. The CTA band's inset brass frame draws its top edge once.

**How GSAP loads (C7).** `motion.ts` is imported dynamically from a small inline loader on the three pages above, after `load` + `requestIdleCallback`. It owns only elements marked `data-motion`. The existing `IntersectionObserver` stays as both the trigger and the CSS fallback, so if GSAP is slow or blocked, content still reveals. A new interaction check asserts there are no GSAP requests on Contact, the detail pages or the utility pages.

### P3: micro-details

22. **Favicon** *[global]*
    - **Before:** A brass monogram on an ink tile with 10px rounded corners (an app-icon look).
    - **After:** Square-cornered tile, monogram optically enlarged for 16/32px legibility, and an ICO/PNG set regenerated from the same SVG. This is the firm's own monogram from `scripts/build-seal.mjs`, not a third-party mark.

23. **Share (OG) image** *[global]*
    - **Before:** Good structure, but the photo half carries the saturated bookshelf. The left text block isn't vertically centred to the frame.
    - **After:** Regenerated with the D4 grade, the text block optically centred, and safe-zone checks (`banner-design` rule: critical content in the central 70–80% for crops in iMessage, WhatsApp and LinkedIn).

24. **Contact print stylesheet** *[Contact]*
    - **Before:** Print hides only the header and mobile bar. The form, map button, oak band and dark footer all print.
    - **After:** Prints ink on white in a single column: firm name, address, telephone, fax, email, hours and the Maps URL written out. The form, map button, oak band and nav are hidden. No page break inside the details list. The footer is reduced to the disclaimer + responsible-attorney lines (Louisiana advertising defaults).

25. **404 / thank-you** *[utility]*
    - **Before:** A centred seal, display title and a row of text links.
    - **After:** Same structure on the rhythm scale, balanced headings, and the telephone line set as a proper focal point. **No GSAP**; a static page.

26. **Footer** *[global]*
    - **Before:** Dense four-column ink footer. The seal doesn't align with the first text baseline of the columns. Headings are tracked caps.
    - **After:** Columns share a top baseline, the legal text measure is capped at 70ch, headings use the same small-caps/label treatment as item 7, and link hover states come from item 11.

---

## 5. Decisions for you (defaults I'd use)

| # | Decision | Options | My recommendation |
|---|---|---|---|
| **D1** | JavaScript budget for GSAP | (a) GSAP core (~26 KB brotli) on Home, About and Practice Areas overview only, deferred until after load; (b) no GSAP: the same choreography in CSS (0 KB) | **(a)**, as you asked, scoped and deferred. Lighthouse ≥ 95 is still achievable because GSAP loads off the critical path. If the after-measurements show any metric regressing beyond noise, I revert that page to CSS and log it in the report. |
| **D2** | Hero entrance engine | (a) CSS keyframes at first paint; (b) GSAP timeline after load | **(a).** It can't arrive late or flash, costs 0 KB, and uses the same eases and durations as the GSAP vocabulary. |
| **D3** | Small-caps eyebrows | (a) Re-subset Source Sans 3 from the upstream OFL release keeping `smcp`/`c2sc` (+5–10 KB, off the LCP path); (b) keep tracked capitals, refined | **(a)** if you want the true small caps your brief describes. (b) is the zero-risk fallback. |
| **D4** | Photo regrade | (a) Re-run the asset pipeline with a slightly less saturated grade on the colour portraits (same filenames); (b) leave photos as they are | **(a).** It changes image pixels only. CMS fields and paths are untouched. |

Contact layout (item 10) and the Practice Areas section indicator (item 14) are layout/UX changes with no copy or CMS impact, so I've treated them as within scope. Tell me if you'd rather I leave either alone.

---

## 6. After approval: execution order

1. **Phase 3 baseline.** Run `npm ci`, then `REVIEW_MODE=false npm run build`. Capture Lighthouse (mobile + desktop) for all 15 built pages, axe at 390/1440, and screenshots of every page at 390, 768, 1280 and 1440 (viewport + full-page) into `qa/baseline/`. A scroll-through layout-shift trace confirms item 3. The screenshot script is adjusted to scroll the page first: today's full-page captures show blank areas because `content-visibility: auto` skips rendering off-screen sections. This is a capture artefact, not a user-facing bug.
2. **Phase 4 commits**, each built, checked (`astro check`, axe, interaction suite, copy diff) and self-reviewed before committing:
   1. Tokens + global header, mobile bar, menu, footer, buttons/links/focus (items 2–7, 11, 16, 26)
   2. Home (1, 8, 9, 13, 17–19, 21, 22–23)
   3. About (8, 10, 17, 18, 21)
   4. Practice Areas overview + detail pages (10, 14, 15, 20)
   5. Contact (10, 12, 24)
   6. 404 / thank-you (25)
   - Suggested wording changes, if any come up, go to `COPY-SUGGESTIONS.md` and never into content files.
3. **Phase 5.** Re-run everything into `qa/after/`, plus the form (POST intercepted), keyboard, reduced-motion and JS-disabled checks. Fix any regression. Then write `POLISH-REPORT.md`: changes and the skill behind each, before/after scores, side-by-side screenshots, the performance keep/revert ledger, and open issues.
