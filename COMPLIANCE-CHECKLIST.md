# Compliance Checklist — Louisiana Attorney Advertising

**For Ms. Harris's review.** Louisiana's Rules of Professional Conduct, **Rules 7.1–7.10**, govern lawyer advertising and solicitation, including websites. We built the site with conservative defaults, listed below. **Ms. Harris is the authority on compliance.** This checklist records what the site currently does so she can verify each point against the current rules and any guidance from the Louisiana State Bar Association (LSBA). We have deliberately avoided citing specific subsections, because the rules are periodically amended. Please check each item against the current text.

Tick each box once satisfied. Wording changes can be made in the editor (`/admin`) or requested from the developer.

---

## 1. Identification on every page

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | Firm name, attorney's name and office location visible on **every page** | The footer of every page shows "Helen Popich Harris, APLC", "Helen Popich Harris, Attorney at Law", and the full Lafayette address and phone. |
| ☐ | Name of the lawyer **responsible for the content** | The footer of every page reads: "Helen Popich Harris is responsible for the content of this website. Principal office: Lafayette, Louisiana." (The same statement appears on `/disclaimer/`.) |
| ☐ | Firm name and domain name are not misleading | Firm name "Helen Popich Harris, APLC"; domain `harrisaplc.com` [[CONFIRM]] |

## 2. Certification and specialization language

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | Certification stated **accurately**, naming the certifying body | Always "Board Certified Family Law Specialist, Louisiana Board of Legal Specialization" (the client's exact wording). The disclaimer page adds: "Helen Popich Harris is certified as a Family Law Specialist by the Louisiana Board of Legal Specialization." |
| ☐ | "Specialist" and similar terms are used **only** in connection with the LBLS certification | "Specialist" appears only in the certification statement and on the seal lettering ("Board Certified Family Law Specialist"). "Expert" never describes Ms. Harris; it appears once, for "expert analysis" of income (Child Support FAQ). "Specializing" is not used. |
| ☐ | Descriptions of what certification requires are accurate | The About page and the Home "Distinction" pillar say board certification "requires examination, peer review, and substantial experience in family law," and the About page adds "continuing education focused on family law." Please verify. |
| ☐ | Description of AAML Fellowship is accurate | "Fellowship … is by selection; the Academy's Fellows are attorneys whose practices are concentrated in matrimonial and family law." Please verify. |
| ☐ | AAML Certified Arbitrator: show or not | Currently shown, flagged for decision (TODO A9). |

## 3. Awards, ratings and recognition

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | Each recognition shows the **issuing organization** and **year(s)** | "Selected to Louisiana Super Lawyers® for 2022, 2025 and 2026"; "AV Preeminent® Peer Review Rating from Martindale-Hubbell"; "Acadiana Profiles Top Lawyers 2025 — Family Law". These are the client's exact wording. |
| ☐ | **No implied comparisons** beyond the literal award names | Nothing on the site describes Ms. Harris or the firm as "best," "top," "#1," "leading," "premier," or similar. "Top Lawyers" appears only as the publication's award title. "Best" appears only in ordinary usage ("best interest of the children," "most matters are best resolved through careful negotiation"). |
| ☐ | The **2026** Super Lawyers selection is verifiable | The public profile may still show only 2022 and 2025 (TODO A10). |
| ☐ | A **methodology / no-guarantee** statement for ratings, if required or desired | `/disclaimer/` → "Certification and recognition" says the recognitions are conferred under each organization's own methodology, do not imply that any lawyer is better than another, and do not guarantee results. |
| ☐ | **Badge licence terms**: official badges only, with any required notice wording | No third-party badge or logo has been recreated. Badge slots show a typographic card until official badges are supplied. Add any notice the licence requires (e.g. Martindale-Hubbell's certification-mark statement) to `/disclaimer/` (flagged there). |
| ☐ | AAML logo use is permitted | The official AAML logo (supplied by the client) is shown, linked to her AAML profile. Confirm Fellows may use it on firm websites. |

## 4. Results, testimonials, endorsements, guarantees

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | **No past results** or case outcomes | None on the site |
| ☐ | **No testimonials, reviews or endorsements** | None on the site. Add any only after confirming compliance. |
| ☐ | **No guarantees** or predictions of outcome | None. The disclaimer states: "Nothing on this website is a promise or guarantee of any outcome." |
| ☐ | **No dramatizations** or simulated scenes | None |
| ☐ | Statements about the practice are **factual and verifiable** | Please review these characterizations: "keeps her practice deliberately small"; "Clients are not passed to a team of associates"; "every case receives her personal attention from beginning to end"; "works closely with CPAs, forensic accountants, and valuation professionals"; "prepares each matter with the care it would need if it must be tried." |

## 5. Photographs and likeness

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | Images of Ms. Harris are **actual, current, approved likenesses** | Three supplied photos are used: IMG_5564, IMG_5569 and IMG_5563 (black and white). **Please confirm in writing that these are authentic photographs of you.** Some show traits often seen in AI-generated or heavily retouched images (for example, illegible book spines). Louisiana's rules address portrayals that are not authentic, so any AI generation or alteration should be reviewed before launch. |
| ☐ | The file named "**Grok Image …**" (AI-generated, by its name) is **not used** | Not used |
| ☐ | Other imagery is not misleading | A darkened photograph of the **Vermilion Parish Courthouse** with live oaks appears on the Contact page, captioned "Serving clients throughout Acadiana." Confirm the right to use it and that it implies no affiliation (TODO B9). No gavels, scales, or other stock legal imagery are used. |

## 6. Disclaimers and the contact form

| ✓ | Item | What the site does now |
|---|---|---|
| ☐ | **General information, not legal advice** | Footer (every page), Contact page, `/disclaimer/` |
| ☐ | Contacting the firm **does not create an attorney–client relationship** | Footer, Contact page, form consent statement, `/disclaimer/` |
| ☐ | **Don't send confidential information** through the form | Footer, form help text, form consent statement, `/disclaimer/`. The message field says: "Please don't include confidential details; we'll discuss specifics privately." |
| ☐ | Consent required before submitting | A required checkbox acknowledges the disclaimer, with a link to it. |
| ☐ | Conflict check | An optional "Spouse or opposing party's name" field, with an explanation of why it is asked |
| ☐ | Contested custody matters clearly excluded | Home, Practice Areas (custody note), Child Support page, and the form's matter-type help text |
| ☐ | **Jurisdiction**: licensed in Louisiana | `/disclaimer/` → "Licensure and responsibility" |
| ☐ | Privacy policy accurate | `/privacy/`: no analytics or advertising cookies; the map loads only on request; Netlify processes the form. Update it if analytics are added. |

## 7. Filing, review and record-keeping

| ✓ | Item | Notes |
|---|---|---|
| ☐ | **Does the website need to be filed with, or reviewed by, the LSBA's lawyer-advertising programme?** | Louisiana's rules include filing and review procedures for advertisements, with certain exemptions. **Please confirm whether this website (or any part of it) must be filed, and whether a filing fee applies.** The LSBA's ethics and advertising staff can advise. |
| ☐ | Record retention of advertisements | If a copy of the website must be retained, the site's Git history and Netlify's deploy history keep a dated copy of every published version. Confirm that this is sufficient or export copies as required. |
| ☐ | Re-review after edits | Substantive changes made through the editor (new claims, credentials, images) should get the same review before publishing. Drafts give a private preview link for that purpose (`EDITING-GUIDE.md` §3). |

## 8. Accuracy of legal content

| ✓ | Item | Notes |
|---|---|---|
| ☐ | Every legal statement on the six practice-area pages approved | The text is general and conservative: no statute citations, and no specific day counts for living separate and apart. Each page has an *Attorney has reviewed this content* box in the editor. Tick it once approved. |
| ☐ | Matrimonial agreements | Omitted until confirmed (TODO A13). Optional wording is in `COPY-OPTIONS.md` §5. |

---

*This checklist describes how the website was built. It is not legal advice and is not a determination that the site complies with the Rules of Professional Conduct. Ms. Harris should verify each item against the current rules.*
