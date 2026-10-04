# To Confirm or Supply — Before Launch

Everything the site still needs from Ms. Harris or the office. Nothing here was guessed on the site: each item is either left as a placeholder or shown with a pink **◆ review flag** on the review site. The flags are listed by location in [`docs/confirm-markers.md`](docs/confirm-markers.md), which is regenerated with `npm run copy`.

**How to resolve an item:** reply with the answer, or edit it directly in the editor (see `EDITING-GUIDE.md` §6) and delete the `[[CONFIRM: …]]` text.

---

## A. Facts to confirm

| # | Item | Currently shown | Where |
|---|---|---|---|
| A1 | **Domain** | `harrisaplc.com` | `netlify.toml` (`SITE_URL`), `public/admin/config.yml` |
| A2 | **Inbox for web inquiries** | `Helen@harrisaplc.com` | Site settings → Email; Netlify form notification |
| A3 | **Office hours** (from a directory listing; unverified). Is the office open Fridays? | Mon–Thu, 9:00 a.m.–4:00 p.m., with a flag | Site settings → Office hours. *Hours are left out of Google's structured data until the flag is cleared.* |
| A4 | **Map coordinates** for search engines | 30.2228, −92.0211 (approximate) | Site settings → Map coordinates |
| A5 | **Areas served**: other parishes? | Lafayette, Lafayette Parish, Acadiana | Site settings → Areas served; About biography |
| A6 | **Visitor parking / building access** note | Placeholder | Contact → Parking / visiting note |
| A7 | **B.S.B.A., University of Southwestern Louisiana, 1986** (from a third-party directory) | Shown, flagged | About → At a glance; biography |
| A8 | **Professional memberships and service**, taken from her public AAML profile via a search index (the page itself couldn't be opened from the build environment): Lafayette Bar Association Paula K. Woodruff Family Law Section, President 2015 and Secretary/Treasurer 2014; LSBA Family Law Section; ABA Family Law Section; LBLS Family Law Advisory Commission (specialization grader, secretary) | Shown, flagged | About → At a glance |
| A9 | **AAML Certified Arbitrator**: listed on her AAML profile and AAML's arbitrator list. Does she want it shown? | Shown, flagged | Credentials #6; About |
| A10 | **Super Lawyers 2026**: the public profile may still list only 2022 and 2025. The site shows 2022, 2025 and 2026 as stated. Please confirm the 2026 selection. | "Selected to Louisiana Super Lawyers® for 2022, 2025 and 2026" | Credentials #3 |
| A11 | **Speaking & Teaching**: exact titles, sponsors and years | Topics only, flagged | About → Speaking & Teaching |
| A12 | **Retirement scope**: does she handle government (e.g. state systems, federal) and **military** retirement division? | Mentioned generally, flagged | Retirement Division & QDROs |
| A13 | **Matrimonial agreements** (pre- and post-nuptial): does she handle them? | **Omitted** | If yes, ready-made wording is in `COPY-OPTIONS.md` §5 |
| A14 | **Custody note** wording, and whether she offers referrals | Draft, flagged | Practice Areas → custody note; Home; Contact form help |
| A15 | **Philosophy quote** on the Home page: her own words, or approval of the draft | Draft, flagged | Home → Philosophy quote (alternatives in `COPY-OPTIONS.md` §3) |
| A16 | **Response time** after an inquiry, if she wants to state one | Not stated, flagged | Thank-you page |
| A17 | **Local roots** she'd like mentioned in the biography | Generic, flagged | About biography |
| A18 | **Disclaimer and privacy policy** final wording (attorney review) | Drafts, flagged | Footer, Contact, `/disclaimer/`, `/privacy/` |
| A19 | **Practice-area legal statements** reviewed and approved | Drafts | Each practice area → tick "Attorney has reviewed this content" |
| A20 | **All page copy** approved | Draft | `COPY-FOR-APPROVAL.md` |
| A21 | **Final GitHub repository** for the editor | `fluxfctory-collab/APLC` | `public/admin/config.yml` → `backend.repo` |
| A22 | **Is there an existing website** at the domain whose pages need redirects? | — | `HANDOFF.md` §2 |
| A23 | **Analytics**: none installed (privacy-friendly default). Add any? | None | Privacy policy would need updating |

## B. Assets and links to supply

| # | Item | Status / how to get it |
|---|---|---|
| B1 | **Super Lawyers official badge** | Download the embed code from her Super Lawyers badge portal (tied to her profile) and paste it into Credentials → Super Lawyers → *Official badge embed code*. Until then a typographic card is shown. |
| B2 | **Martindale-Hubbell AV Preeminent® official badge** and **profile URL** | Get the badge from Martindale-Hubbell's badge/licensing programme. Searches surfaced an **Avvo** profile (`avvo.com/attorneys/70501-la-helen-harris-4339248.html`; Avvo and Martindale are affiliated) but no Martindale URL. Please supply it. |
| B3 | **Acadiana Profiles Top Lawyers 2025** official seal/badge and **listing URL** | From Acadiana Profiles (the publisher usually provides honouree logos and terms). Not located online. |
| B4 | **AAML logo, vector version** | The supplied PDF contains only a 387×156 px image. It is used now, but a vector or high-resolution logo from AAML's Fellow resources would be sharper. |
| B5 | **Louisiana Board of Legal Specialization** | Shown as a text credential only (no logo used, as instructed). Nothing needed unless LBLS provides an approved specialist mark. |
| B6 | **Original, full-resolution file of IMG_5569** (standing portrait) | The supplied file is a phone screenshot (894×1030, with rounded corners, now cropped). The original camera file would look sharper in the Home hero. |
| B7 | **Photo authenticity confirmation** | Please confirm in writing that the photographs of Ms. Harris are actual, current, approved likenesses. Some show traits common to AI-generated or heavily retouched images (e.g. illegible book spines). See `COMPLIANCE-CHECKLIST.md` §5. |
| B8 | **"Grok Image 2026-09-30…png"** (AI-generated, by its file name) | **Not used.** It will stay unused unless she confirms in writing that she wants it, and confirms its compliance. |
| B9 | **IMG_5560 (columned building with live oaks)** | The sign in the photo reads **"Vermilion Parish Courthouse"** (Abbeville). It is used, darkened, as a band on the Contact page with the caption "Serving clients throughout Acadiana." Please confirm: (a) the firm has the right to use the photo; (b) a Vermilion Parish image is appropriate for a Lafayette office. Otherwise switch the band off (Contact → Photo band → *Show this band*) or supply a replacement. |
| B10 | **IMG_5561 (Supreme Court of Louisiana sign)** | **Not used**: low quality, with a phone overlay, and it borders on generic legal imagery. |
| B11 | *Optional:* a photograph of the office entrance at 321 West Main Street | Useful for the Contact page and Google Business Profile. |

## C. Decisions

| # | Decision | Default on the site |
|---|---|---|
| C1 | Home headline | Option 1, "Counsel for the divorce where *more is at stake.*" (others in `COPY-OPTIONS.md`) |
| C2 | Approve the **redrawn seal** (vector, from the printed seal) | Used in the footer (brass), the watermark and the favicon (monogram only) |
| C3 | Home page title for Google | The brief's full title (92 characters; Google may shorten it). A shorter option is in `COPY-OPTIONS.md` §6. |
| C4 | Hosting plan | Netlify Free, or Personal at $9/mo for headroom (`HANDOFF.md` §7) |
| C5 | Turn **Review mode** off at launch | Currently **on** |
