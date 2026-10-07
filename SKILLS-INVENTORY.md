# Skills inventory

Inventory of the three skill plugins installed for the UI polish pass on the Helen Popich Harris, APLC site. Every `SKILL.md` listed here was read in full. The scripts and data files those skills reference were also read, or run where running them was the only way to see what they produce.

## Installation (Phase 0)

The plugins were installed from the shell with the CLI equivalents of the slash commands. Every command succeeded.

```
claude plugin marketplace add addyosmani/agent-skills        → marketplace "addy-agent-skills"
claude plugin install agent-skills@addy-agent-skills
claude plugin marketplace add greensock/gsap-skills          → marketplace "gsap-skills"
claude plugin install gsap-skills@gsap-skills
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill → marketplace "ui-ux-pro-max-skill"
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

| Plugin | Version | Status (`claude plugin list`) | Scope | Source commit |
|---|---|---|---|---|
| `agent-skills@addy-agent-skills` | 0.6.12 | ✔ enabled | user | `1401c8b` |
| `gsap-skills@gsap-skills` | 1.0.0 | ✔ enabled | user | `aed9cfd` |
| `ui-ux-pro-max@ui-ux-pro-max-skill` | 2.13.0 | ✔ enabled | user | `477bcb2` |

**About `/reload-plugins`:** this is an interactive slash command, and I can't type it from inside the session. That isn't a blocker. The plugins are installed and enabled, and they load automatically in any new session. In this session I read each skill's files directly from the plugin cache (`~/.claude/plugins/cache/…`) and ran its scripts by path. If you want the skills to appear in this session's skill list, type `/reload-plugins` once.

**Note:** the original brief, `CLAUDE_CODE_PROMPT_Helen_Popich_Harris.md`, is not in the repository or anywhere on this machine. The constraints below come from your message and from the brief's requirements as recorded in `README.md`, `QA-REPORT.md` and `src/styles/tokens.css`.

Relevance key: **Yes** means it will drive work on this pass. **Maybe** means it is useful in part, or only under a condition I state. **No** means it doesn't fit this project, with the reason given.

---

## 1. `agent-skills` (Addy Osmani): engineering lifecycle

### Skills (25)

| Plugin | Skill | What it does | Inputs it needs | Relevant? | Reason |
|---|---|---|---|---|---|
| agent-skills | `frontend-ui-engineering` | Production UI rules: avoid the "AI aesthetic" (gradients, rounded-everything, stock card grids, heavy shadows), use one spacing scale and semantic tokens, follow WCAG keyboard/ARIA/focus rules, test responsively, and pass a final UI review | Existing design system, components, breakpoints | **Yes** | Sets the quality floor for every component change: one spacing scale, semantic tokens, no AI-template look |
| agent-skills | `performance-optimization` (+ `references/optimization-patterns.md`, `references/performance-checklist.md`) | Measure → identify → fix → verify → guard. CWV targets, image/font/JS checklists, keep-or-revert rule, attempt ledger | Lighthouse/RUM numbers, budgets | **Yes** | Adding GSAP is the main performance risk. This skill decides how GSAP loads and when a change gets reverted |
| agent-skills | `browser-testing-with-devtools` | Runtime verification via the Chrome DevTools MCP: screenshots, console, network, a11y tree, perf traces, with untrusted-content rules | The `chrome-devtools` MCP server (**not configured here**) | **Maybe** | I'll follow its workflow (before/after screenshots, clean console, a11y tree) with the repo's Playwright + Chromium QA scripts instead of the MCP |
| agent-skills | `code-review-and-quality` | Five-axis review (correctness, readability, architecture, security, performance) with severity labels and change sizing | A diff | **Yes** | Each phase's diff gets reviewed before it is committed |
| agent-skills | `incremental-implementation` | Thin, verified slices: implement → test → verify → commit. Scope discipline | Approved plan | **Yes** | Matches your required order (header/footer → Home → … → utility pages) with one commit per slice |
| agent-skills | `git-workflow-and-versioning` | Atomic commits, descriptive messages, no mixed concerns | Git repo | **Yes** | One logical change per commit, so any slice can be reverted cleanly |
| agent-skills | `source-driven-development` | Check framework-specific code against official docs and cite the source | Exact versions from `package.json` | **Yes** | GSAP 3.15 `matchMedia`/`context`, Astro 7 script bundling and CSS features (`text-wrap`, `hanging-punctuation`, `::details-content`) get checked against official docs / MDN rather than written from memory |
| agent-skills | `test-driven-development` | Red-green-refactor and the Prove-It pattern for bugs | A test runner | **Maybe** | The repo has no unit-test runner, but it has Playwright QA scripts. I'll apply the pattern there: write the check first for each new behaviour (reduced motion, focus clearance above the mobile bar, no GSAP on Contact), see it fail, then implement |
| agent-skills | `shipping-and-launch` (+ `references/definition-of-done.md`) | Pre-launch checklist (code quality, security, performance, a11y, infra, docs), rollout and rollback | Production-bound change | **Yes** | Its performance, accessibility and code-quality sections are the Phase 5 gate. The feature-flag and canary sections don't apply to a static brochure site |
| agent-skills | `code-simplification` | Reduce complexity without changing behaviour (Chesterton's fence, one change at a time) | Working code + tests | **Maybe** | A final pass over new motion and CSS code if it grows heavier than needed |
| agent-skills | `constraint-driven-development` (+ `references/floor-guard.md`) | Writes a `CONSTRAINTS.md` quality bar with tool-backed thresholds and guards it against being quietly lowered | User interview (≤4 questions), tools (Lighthouse, axe, size-limit) | **Maybe** | Your message already sets the bar (Lighthouse ≥95, LCP <2.0 s, CLS <0.05, WCAG 2.2 AA). I'll treat it as the acceptance gate in `SKILLS-PLAN.md`. A `CONSTRAINTS.md` plus scripts would only be added if you want them enforced in future work |
| agent-skills | `doubt-driven-development` | Adversarial fresh-context review of non-trivial decisions. Requires spawning a reviewer subagent and offering a cross-model check | Subagent / external CLI | **Maybe** | Useful for the one risky decision (GSAP vs LCP), but it spawns agents. Only with your go-ahead |
| agent-skills | `security-and-hardening` (+ `references/hardening-patterns.md`) | OWASP, input validation, headers, dependency and supply-chain review, privacy | Code handling untrusted input | **Maybe** | The form logic doesn't change. Only the dependency section applies: audit the one new package (`gsap`) and its licence |
| agent-skills | `using-agent-skills` | Meta-skill: routing table to the other skills, plus core behaviours (surface assumptions, scope discipline, verify) | — | **Maybe** | Its operating rules (surface assumptions, push back, scope discipline) are followed implicitly. Nothing to invoke |
| agent-skills | `planning-and-task-breakdown` | Writes `tasks/plan.md` + `tasks/todo.md` with acceptance criteria and checkpoints | A spec | **No** | `SKILLS-PLAN.md` is the plan you asked for. A second plan file would duplicate it |
| agent-skills | `spec-driven-development` | Writes `SPEC.md` (objective, commands, structure, style, tests, boundaries) before coding | Vague requirements | **No** | Requirements are already precise (your brief plus the original build) |
| agent-skills | `interview-me` | One-question-at-a-time intent extraction | Under-specified ask | **No** | The ask is fully specified |
| agent-skills | `idea-refine` (+ `frameworks.md`, `refinement-criteria.md`, `examples.md`, `scripts/idea-refine.sh`) | Divergent/convergent ideation into a one-pager in `docs/ideas/` | A raw idea | **No** | This is refinement of an approved direction, not ideation |
| agent-skills | `context-engineering` | Rules files, context packing, context budget | Agent session | **No** | Process advice for agents. Nothing to change on the site |
| agent-skills | `debugging-and-error-recovery` | Reproduce → localize → reduce → fix → guard | A failure | **No** (on demand) | Only if a regression appears |
| agent-skills | `documentation-and-adrs` | ADRs, README, inline "why" comments | Architectural decision | **No** | The GSAP loading decision goes in `SKILLS-PLAN.md` and `POLISH-REPORT.md`. No ADR folder exists to follow |
| agent-skills | `api-and-interface-design` | REST/GraphQL/type contracts, idempotency | APIs | **No** | No API surface |
| agent-skills | `ci-cd-and-automation` | GitHub Actions quality gates, previews, rollback | CI config | **No** | Out of scope. Netlify builds the site and no CI was requested |
| agent-skills | `deprecation-and-migration` | Sunsetting systems, expand/contract schema changes | Legacy systems | **No** | Nothing is being retired |
| agent-skills | `observability-and-instrumentation` | Structured logs, RED metrics, tracing, alerts | Running services | **No** | Static site with no runtime services |

### Slash commands (9) and agents (4)

| Plugin | Command / agent | What it does | Inputs it needs | Relevant? | Reason |
|---|---|---|---|---|---|
| agent-skills | `/webperf` → agent `web-performance-auditor` | Performance audit. "Deep mode" parses Lighthouse JSON; it never invents metrics | Lighthouse JSON (Phase 3/5 will produce it) | **Yes** | Its scorecard rubric goes into the Phase 5 report, applied by me to the real Lighthouse JSON |
| agent-skills | `/review` → skill `code-review-and-quality` | Five-axis review of staged/recent changes | Diff | **Yes** | Same as the skill above |
| agent-skills | agent `code-reviewer` | Staff-engineer review persona | Diff | **Maybe** | Its rubric is applied inline. Run as a subagent only if you ask |
| agent-skills | `/ship` | Fans out `code-reviewer`, `security-auditor`, `test-engineer` subagents in parallel, then gives a GO/NO-GO with rollback plan | Production-bound change | **Maybe** | I'll use the checklist inline at the end. The three-subagent fan-out only runs if you want it |
| agent-skills | `/test` | TDD / Prove-It workflow | Test runner | **Maybe** | Adapted to the Playwright QA scripts (see TDD above) |
| agent-skills | `/code-simplify` | Runs `code-simplification` | Changed code | **Maybe** | Optional final pass |
| agent-skills | `/constraints` | Runs `constraint-driven-development` | User interview | **Maybe** | See above |
| agent-skills | `/build` | Incremental build. `auto` mode requires `SPEC.md` and a test-first loop per task | `SPEC.md`, `tasks/plan.md` | **No** | Its preconditions (SPEC.md, unit tests) don't exist. The approved `SKILLS-PLAN.md` drives the build instead |
| agent-skills | `/plan`, `/spec` | Run the planning/spec skills | — | **No** | See the planning/spec rows |
| agent-skills | agent `security-auditor` | OWASP / STRIDE review persona | Diff | **No** | No security-relevant code changes |
| agent-skills | agent `test-engineer` | Test-strategy persona | Code | **No** | No unit-test suite to extend |

The plugin also ships `hooks/*.sh` (session-start, SDD cache, simplify-ignore), but `plugin.json` doesn't register them, so they are inactive. The `evals/` folder is for the plugin's own testing.

---

## 2. `gsap-skills` (GreenSock, official)

There are 8 skills (`skills/llms.txt` is the index) and no commands or agents. I also read the vanilla, React, Vue and Nuxt examples. For sizing I measured the current package (`gsap@3.15.0`): **core 28.3 KB gzip / 25.7 KB brotli; ScrollTrigger +18.0 KB gzip.** Licence: GSAP's "Standard no-charge license", free for commercial use, all plugins included.

| Plugin | Skill | What it does | Inputs it needs | Relevant? | Reason |
|---|---|---|---|---|---|
| gsap-skills | `gsap-core` | `to/from/fromTo/set`, eases, stagger, transform aliases, `autoAlpha`, `clearProps`, `defaults()`, and **`gsap.matchMedia()` for `prefers-reduced-motion`** | DOM targets, `gsap` package | **Yes** | The base of every tween. `matchMedia` is the reduced-motion mechanism. `autoAlpha` + transforms keep layout shift at zero |
| gsap-skills | `gsap-timeline` | Timelines, position parameter, labels, defaults, nesting | Multi-step sequences | **Yes** | Hero entrance and the signature section reveal (numeral → rule draws → label → heading) are short timelines with shared `defaults: { ease: 'power2.out' }` |
| gsap-skills | `gsap-performance` | Animate transform/opacity only, use `will-change` sparingly, batch reads/writes, clean up | Animations | **Yes** | Directly enforces the zero-CLS, no-jank requirement |
| gsap-skills | `gsap-frameworks` | Lifecycle for Vue/Svelte/Nuxt: create after mount, scope selectors with `gsap.context(fn, root)`, `revert()` on unmount | A component framework | **Maybe** | Astro isn't covered, but the scoping rule (`gsap.context` per section) applies to our plain `<script>` modules |
| gsap-skills | `gsap-utils` | `toArray`, `selector`, `clamp`, `mapRange`, `snap`, `wrap`, `distribute`… | Values/collections | **Maybe** | Only `toArray`/`selector` for scoped targeting. The maths helpers aren't needed for restrained motion |
| gsap-skills | `gsap-scrolltrigger` | Scroll-linked tweens, pin, scrub, `batch()`, refresh/cleanup | `ScrollTrigger` plugin (+18 KB gz) | **Maybe** (read, not shipped) | Pin/scrub/parallax are excluded by the brief. A simple "play once on entry" doesn't justify 18 KB when the site already has an `IntersectionObserver` |
| gsap-skills | `gsap-plugins` | Registration and usage of SplitText, DrawSVG, MorphSVG, Flip, Draggable, ScrollSmoother, CustomEase, etc. | Plugin files | **No** | Each candidate conflicts with the brief: SplitText fragments headings for screen readers and fights `text-wrap: balance` (the skill says so itself); ScrollSmoother is scroll-jacking; DrawSVG isn't needed because the hairlines are 1px boxes animated with `scaleX` |
| gsap-skills | `gsap-react` | `useGSAP`, `contextSafe`, SSR safety | React | **No** | No React |

---

## 3. `ui-ux-pro-max` (nextlevelbuilder): design intelligence

There are 7 skills under `.claude/skills/` and no commands or agents. The core skill is a local BM25 search over CSV data. By the plugin's own count that is 79 searchable styles (50 active), 192 palettes, 74 font pairings, 119 UX rules, 17 GSAP presets and 22 stacks, including **Astro 7.1.6** (the site runs Astro 7.3.5). Its scripts make no network calls. I ran it for this brand; results are summarized in `SKILLS-PLAN.md` §3.

| Plugin | Skill | What it does | Inputs it needs | Relevant? | Reason |
|---|---|---|---|---|---|
| ui-ux-pro-max | `ui-ux-pro-max` (+ `scripts/search.py`, `design_system.py`, `core.py`; `data/*.csv`; `references/quick-reference.md`, `pro-rules.md`) | `--design-system` generator (pattern, style, palette, type, effects, anti-patterns), domain search (`ux`, `typography`, `color`, `style`, `gsap`, `landing`…), stack search (`--stack astro`), and a 10-category audit checklist (a11y → charts) | Product type + keywords; detected stack (Astro); Python 3 | **Yes** | The design review input: typography, colour/contrast, spacing, component and UX audits, plus Astro and GSAP-preset lookups. Its output is checked against the brand; it does not replace it |
| ui-ux-pro-max | `design-system` (+ `references/token-architecture.md`, `states-and-variants.md`, `component-specs.md`; `scripts/validate-tokens.cjs`, `generate-tokens.cjs`) | Three-layer tokens (primitive → semantic → component), state specs, a validator that finds hard-coded values. Also slide generation | Token file, `src/` | **Yes** (audit parts only) | `validate-tokens.cjs` found **52 hard-coded rem values and 4 hex colours** in the CSS, and the components use **63 distinct one-off `clamp()` expressions**. The states reference shapes the button/field/link state matrix. Its slide system and Tailwind/HSL conventions are not used |
| ui-ux-pro-max | `brand` (+ `references/consistency-checklist.md`, `logo-usage-rules.md`, `typography-specifications.md`…; `scripts/*.cjs`) | Brand voice, visual identity, logo clear-space/minimum size, consistency checklists. Scripts sync a `docs/brand-guidelines.md` into `assets/design-tokens.*` | Brand guideline doc | **Maybe** | Its consistency and logo-usage checklists (clear space, minimum size, approved backgrounds) apply to the AAML plate and credentials band. **Its sync scripts will not be run**: they would create a second token source next to `tokens.css` |
| ui-ux-pro-max | `banner-design` (+ `references/banner-sizes-and-styles.md`) | Social/ad/hero banner art direction and export at platform sizes | Brief, brand assets | **Maybe** | Only its safe-zone and contrast rules, as a checklist for the 1200×630 share image. Its style menu (gradient, glassmorphism, neon, 3D) is off-brand |
| ui-ux-pro-max | `design` (+ `scripts/logo`, `cip`, `icon` generators; many references) | AI generation of logos, corporate-identity mockups, icons, slides and social images (Gemini / Atlas / MuAPI) | API keys (`GEMINI_API_KEY` etc.) | **No** | It would generate or redraw brand marks and imagery. That is prohibited here, and it needs third-party API keys |
| ui-ux-pro-max | `ui-styling` (+ shadcn/Tailwind references, `canvas-fonts/`, Python generators) | shadcn/ui + Tailwind component styling, canvas "poster" design | React + Tailwind | **No** | Wrong stack: the site is hand-written CSS with no React or Tailwind |
| ui-ux-pro-max | `slides` | HTML pitch decks with Chart.js | Deck brief | **No** | Not a deck |
