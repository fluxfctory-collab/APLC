# Handoff — Hosting, Domain, Forms, Search and Admin Access

This document covers launching the site and handing it over to Helen Popich Harris, APLC. Steps are written for whoever performs the launch (developer or office manager). Items marked **[[CONFIRM]]** are also listed in `TODO-CLIENT.md`.

**What was chosen and why**

| Need | Choice | Why |
|---|---|---|
| Site generator | Astro (static) | Fast, secure (nothing to hack on a server), near-zero JavaScript |
| Hosting | **Netlify** | Free/low tier; global CDN; automatic HTTPS; built-in **Netlify Forms**; built-in GitHub sign-in for the editor; free deploy previews for drafts |
| Editor | **Decap CMS** at `/admin` | Free and open source. Edits are saved to the site's Git repository with full history. No database or subscription. |
| Form handling | Netlify Forms | No extra service; spam filtering; email notifications; submissions kept in the dashboard |

---

## 1. Accounts the firm should own

The firm should own every account. The developer is added as a collaborator and can be removed later.

1. **GitHub:** a free account for the firm, for example `harrisaplc`. Move the repository there (GitHub → repository Settings → *Transfer ownership*), or create it there and push this code.
2. **Netlify:** a free account signed up with the firm's email, with the repository connected (below).
3. **Domain registrar:** keep the existing registrar for **harrisaplc.com** [[CONFIRM domain and registrar login]].

---

## 2. Deploy on Netlify

1. Netlify → **Add new project → Import an existing project → GitHub** → select the repository.
2. The build settings are read from `netlify.toml`: build command `npm run build`, publish directory `dist`, Node 22. Click **Deploy**.
3. **Environment variables** (Project configuration → Environment variables):
   - `SITE_URL`: the final canonical address, e.g. `https://harrisaplc.com` (already set in `netlify.toml`; change it there or here if the domain differs). This drives canonical URLs, the sitemap, `robots.txt` and structured data.
   - `REVIEW_MODE`: leave unset. The **Review mode** switch in the editor controls the review flags. Set it to `false` only to force the flags off.
4. **Forms:** Project configuration → **Forms** → *Enable form detection* (new projects may need this switched on), then **redeploy**. The form named **`inquiry`** will appear.

### Domain and HTTPS
1. Domain management → **Add a domain** → `harrisaplc.com`. Netlify suggests adding `www` too. Choose which one is primary; the other redirects to it automatically. Update `SITE_URL` to match.
2. DNS: choose **one** of these:
   - **Keep DNS at the current registrar (safest if email runs on this domain).** Add the records Netlify shows. Typically that is an `A` record for the apex pointing to Netlify's load balancer and a `CNAME` for `www` pointing to `<project>.netlify.app`. Use the exact values shown in the Netlify dashboard.
   - **Move DNS to Netlify.** Before switching nameservers, **copy every existing record**, especially **MX, SPF, DKIM and DMARC for email**. If you don't, the firm's email will stop working.
3. HTTPS: Netlify issues a free Let's Encrypt certificate once DNS resolves, usually within an hour. Then turn on **Force HTTPS**.
4. **Existing website?** If harrisaplc.com currently hosts another site, list its main URLs so 301 redirects can be added to `netlify.toml`. This preserves search rankings and bookmarks. [[CONFIRM]]

---

## 3. Contact-form notifications and test

1. Netlify → Project configuration → **Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**.
   - **Email to notify:** the office inbox for web inquiries [[CONFIRM: Helen@harrisaplc.com or another address]]
   - **Form:** `inquiry`
2. Ask the office to add Netlify's sending address (shown in the notification settings) to safe senders, so inquiries don't go to junk.
3. **Test, once deployed** (recorded in `QA-REPORT.md` → Form test):
   1. Open `/contact/` on the live site and submit a test inquiry with the name "TEST — please ignore."
   2. Confirm the browser lands on `/thank-you/`.
   3. Confirm the email arrives and that the submission appears under **Forms → inquiry** with every field.
   4. Delete the test submission in the dashboard.
4. Spam: the form has a hidden honeypot field (`company`), and Netlify filters spam automatically. Flagged items appear under *Spam submissions*. No CAPTCHA is used, to keep the form easy to use. If spam ever gets through, Netlify can add reCAPTCHA without code changes to the form's behaviour.

---

## 4. Editor (`/admin`) sign-in and access

The editor signs in with GitHub through Netlify's built-in OAuth service.

1. **GitHub OAuth app** (in the firm's GitHub account: Settings → Developer settings → **OAuth Apps → New OAuth App**):
   - Application name: `Harris APLC website editor`
   - Homepage URL: `https://harrisaplc.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Copy the **Client ID** and generate a **Client secret**.
2. Netlify → Project configuration → **Access & security → OAuth → Install provider → GitHub**, then paste the ID and secret.
3. In `public/admin/config.yml`, set `backend.repo` to the final `owner/repository` (currently `fluxfctory-collab/APLC` [[CONFIRM]]) and `site_url`/`display_url` to the final domain. Commit.
4. **Give a person editor access:** add their GitHub account to the repository with **Write** access (repository Settings → Collaborators). To **remove** access, remove them as a collaborator.
5. **Hand-over:** once the repository and Netlify project are under the firm's accounts, the developer's access can be reduced or removed. This takes nothing more than collaborator settings.

**Drafts and previews.** The editor uses Decap's *editorial workflow*. Each draft is a branch with a free Netlify Deploy Preview, and **Publish** merges it to the live site. Make sure **Deploy Previews** are enabled (Project configuration → Build & deploy → Branches and deploy contexts; this is the default).

---

## 5. Search engines and local listings

1. **Google Search Console:** add a **Domain** property for `harrisaplc.com` (verified with a DNS TXT record), then submit the sitemap: `https://harrisaplc.com/sitemap-index.xml`.
2. **Bing Webmaster Tools:** sign in and choose *Import from Google Search Console*.
3. **Google Business Profile:** claim or verify the listing. Make the name, address and phone match the website exactly:
   - Name: **Helen Popich Harris, APLC**
   - Address: **321 West Main Street, Suite 2-D, Lafayette, LA 70501**
   - Phone: **(337) 291-6092** · Website: the final domain
   - Suggested categories: *Family law attorney* (primary) and *Divorce lawyer*. Hours must match the website once confirmed.
4. Point the AAML, Super Lawyers, Martindale-Hubbell and Avvo profiles to the new website address.
5. After launch, use Search Console's *URL Inspection* on the home page and request indexing.

---

## 6. Launch checklist

- [ ] Every item in `TODO-CLIENT.md` resolved, and `docs/confirm-markers.md` empty or accepted (run `npm run copy`)
- [ ] Ms. Harris has approved `COPY-FOR-APPROVAL.md` and completed `COMPLIANCE-CHECKLIST.md`
- [ ] Practice-area pages ticked **Attorney has reviewed this content** in the editor
- [ ] **Review mode turned OFF** (editor → Site settings)
- [ ] `SITE_URL`, `backend.repo`, `site_url` and the domain all final
- [ ] Official badges added (Super Lawyers, Martindale-Hubbell, Acadiana Profiles) if licensed
- [ ] Form notification set and live test passed (§3)
- [ ] HTTPS forced; `www` and apex redirect to the primary domain
- [ ] Search Console + Bing set up; sitemap submitted
- [ ] Spot-check on a phone: tap-to-call, the Inquire bar, the menu

---

## 7. Ongoing costs (estimate, October 2026)

| Item | Cost | Notes |
|---|---|---|
| Domain renewal (.com) | about **$10–25 / year** | Depends on the registrar |
| Netlify hosting | **$0** (Free plan) or **$9 / month** (Personal) | See below |
| Editor (Decap CMS) | **$0** | Open source |
| GitHub | **$0** | Free account; private repositories included |
| SSL certificate | **$0** | Automatic through Netlify |
| Form submissions | **$0** | Netlify no longer charges credits for form submissions (April 2026 change) |
| Official badges | varies | Some badge programmes are included with a listing; others charge licensing fees. [[CONFIRM with each organization]] |

**About Netlify's plans.** Netlify's current plans run on monthly *credits*. The **Free** plan includes **300 credits a month** and is a **hard cap**: if credits run out, the site pauses until the next month. Each **production deploy (Publish) costs 15 credits**. Deploy previews are free. Bandwidth and requests use a few more credits.

For this site, which is light (100–200 KB per page) and edited occasionally, a typical month of a few thousand page views and up to about 10 publishes should stay well under 300 credits. Two recommendations:
- If the office prefers no risk of a pause, choose **Personal ($9/month, 1,000 credits)**.
- Batch edits and publish them together (see `EDITING-GUIDE.md`).

*Figures are from Netlify's published pricing at the time of writing. Check netlify.com/pricing before choosing a plan.*

**No mandatory subscriptions.** Everything above is optional or free, apart from the domain.

**Alternative host.** The site is plain static files, so it can move to Cloudflare Pages or any static host. The two Netlify-specific pieces are the form handler (replace it with a service such as Formspree) and the editor's sign-in (replace it with a small OAuth proxy). Neither is needed on Netlify.

---

## 8. Maintenance

- **Dependencies:** about twice a year, a developer should run `npm outdated`, update, build, and repeat the QA in `QA-REPORT.md`.
- **Content:** the firm edits content through `/admin`. Developers can also edit `src/content/` directly.
- **Backups:** the Git repository is the backup. Every change is versioned and restorable, and Netlify keeps every past deploy, which can be restored with one click under *Deploys*.
