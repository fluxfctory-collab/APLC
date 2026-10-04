# Editing Your Website — A Guide for Ms. Harris and Office Staff

You can change any wording or photograph on the site yourself, without touching code. Changes are made in a private editor at **harrisaplc.com/admin**. *(The final address depends on the confirmed domain.)*

Nothing you do in the editor can break the design. Every change is saved with its own history, so any earlier version can be brought back.

---

## 1. Logging in

1. Go to **harrisaplc.com/admin**.
2. Click **Login with GitHub**.
3. Sign in with the GitHub account set up for you (see `HANDOFF.md`, "Admin access"). The first time, GitHub asks you to authorize the editor; click **Authorize**.

You will see four sections on the left:

| Section | What's in it |
|---|---|
| **Site settings** | Phone, fax, email, address, office hours, profile links, the footer disclaimer, and the **Review mode** switch. A change here updates every page. |
| **Pages** | The wording and photos for Home, About, Practice Areas (overview), Contact, Privacy, Disclaimer, and the thank-you and page-not-found pages. |
| **Practice areas** | One entry per area of practice (Divorce, Spousal Support, …). Each appears on the Home page, the Practice Areas page, and its own page. |
| **Credentials & recognition** | Your certifications and awards. They appear in the dark band on the Home page, on the About page, and in the footer. |

---

## 2. Changing wording

1. Choose a section, then the page or entry.
2. Click into a field and type. Fields are grouped and labelled in the same order as they appear on the page, for example "Hero (top of page)" and then "01 · Approach".
3. Click **Save** at the top.

**A few conventions:**
- **Italics in a heading:** wrap the words in asterisks. `Counsel for the divorce where *more is at stake.*` shows "more is at stake." in italics.
- **Phone number in a button:** type `{phone}`. It is replaced with the number from Site settings, so you only ever update the number in one place.
- **Longer text fields** (such as the biography) have a small toolbar for bold, italics, links, headings and bulleted lists.
- **"Search engine listing"** (collapsed at the top of each page) controls how the page appears in Google. Keep titles to about 60 characters and descriptions to about 150.

---

## 3. Reviewing and publishing

Your changes are not public until you **Publish**. The editor uses three steps:

1. **Save.** Your change becomes a **Draft**. Nothing on the live site changes.
2. Set the status to **In review** or **Ready**. After a minute or two a **View preview** link appears at the top of the editor. It opens a private preview of the whole site with your change in place.
3. Click **Publish → Publish now**. The live site updates within about **two minutes**.

You can see every draft at once under **Workflow** at the top of the editor.

> Each *Publish* uses a small amount of the hosting plan's monthly allowance; previews are free. It is best to collect several edits and publish them together rather than publishing each small change separately. See `HANDOFF.md` → Costs.

---

## 4. Replacing a photograph

1. Open the page that holds the photo, for example **Pages → About Helen → Hero → Portrait — About page**.
2. Click **Choose different image**, then **Upload** and select the new file from your computer.
3. Select the uploaded image and click **Choose selected**.
4. Fill in **Description for screen readers**. This is one plain sentence describing the photo, for example "Helen Popich Harris seated at her desk." It is read aloud to visitors who are blind, and search engines read it too.
5. **Save**, preview, then **Publish**.

**Photo tips**
- Use **JPEG** photos, ideally **at least 1,600 pixels wide**. Portraits look best in upright (portrait) orientation. The website creates smaller, faster versions automatically.
- Only use photographs the firm owns or is licensed to use.
- **Use only real, current photographs of yourself.** Louisiana's advertising rules address images that aren't authentic (see `COMPLIANCE-CHECKLIST.md`).
- Please don't delete a photo from the **Media** library while a page still uses it. If you do, the site will refuse to publish, and the current version simply stays live, until the page is pointed at another photo.

---

## 5. Credentials and official badges

Under **Credentials & recognition**, each entry has:
- **Display title** and **Issuing organization.** These are the two lines shown in the dark band on the Home page.
- **Full statement (exact wording).** This is the wording used on the About page and in the footer. Use the organization's exact approved wording.
- **Official badge or logo image**, or **Official badge embed code.** Use these for the *official* badges from Super Lawyers, Martindale-Hubbell, Acadiana Profiles and others. Each organization provides its badge through its own portal, usually as a snippet of code: paste that snippet into **embed code** exactly as provided. Never use a recreated or approximated logo.
- **Show on the website** and **Show in the Home page band.** Untick these to hide an item without deleting it.
- **Order.** This sets the order in which items appear.

---

## 6. The pink "◆" review flags (before launch)

While the site is being reviewed, some text carries a small pink flag such as **◆ hours come from a directory listing — please verify**. In the editor these appear as `[[CONFIRM: …]]`.

- When an item is confirmed or corrected, **delete the `[[CONFIRM: …]]` text** from that field and save.
- A full list of the remaining flags is in `docs/confirm-markers.md`, and the decisions behind them are in `TODO-CLIENT.md`.
- **Before launch**, open **Site settings** and turn **Review mode** off. That removes any remaining flags from the public site automatically, but please resolve them first. While Review mode is on, a small "Review draft" notice also appears in the corner of every page, with a button that hides the flags so you can see the page as visitors will.

---

## 7. Adding a practice area

1. Go to **Practice areas → New Practice area**.
2. Fill in the title, a short menu title, the **Order** (for example 7), a one-line summary, the main text (about 150–250 words), and optionally a few "Common questions."
3. Save, preview, then publish. The new area appears on the Home page list, on the Practice Areas page, in the footer, and on its own page at `/practice-areas/<title>/`.

Please tick **"Attorney has reviewed this content"** only once the legal statements are approved.

---

## 8. Inquiries from the contact form

Each submission is emailed to the address configured in the hosting account, initially the address in `HANDOFF.md`. Every submission is also kept in the Netlify dashboard under **Forms → inquiry**. Spam is filtered automatically.

Please don't rename or remove the form fields in the editor. Only their wording (labels and help text) is editable there, which keeps delivery working.

---

## 9. If something isn't right

- **A change isn't showing.** Check that it was **Published**, not just saved. Then wait two to three minutes and refresh the page (on a Mac press ⌘+Shift+R; on Windows press Ctrl+F5).
- **Undoing a change.** Re-edit and publish, or ask your web developer to restore an earlier version. Every published change is kept in the site's history.
- **Can't log in.** Make sure you are signed in to the right GitHub account, then ask your web developer to check that your account still has access.
