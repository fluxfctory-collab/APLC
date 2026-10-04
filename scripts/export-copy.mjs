/**
 * export-copy.mjs
 * ---------------------------------------------------------------------------
 * Builds COPY-FOR-APPROVAL.md from the live content files, so the document the
 * client reviews is always word-for-word what the site shows. Also writes
 * docs/confirm-markers.md: every [[CONFIRM]] marker still in the content.
 *
 * Run after content changes:  npm run copy
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const C = (p) => path.join(ROOT, 'src/content', p);

function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return { data: YAML.parse(m[1]), body: m[2].replace(/<!--[\s\S]*?-->\n*/g, '').trim() };
}
const settings = JSON.parse(fs.readFileSync(C('settings/site.json'), 'utf8'));
const home = readMd(C('home/home.md')).data;
const about = readMd(C('about/about.md'));
const contact = readMd(C('contact/contact.md')).data;
const overview = readMd(C('practice-overview/index.md')).data;
const practice = fs.readdirSync(C('practice')).map((f) => ({ id: f.replace('.md', ''), ...readMd(C(`practice/${f}`)) })).sort((a, b) => a.data.order - b.data.order);
const creds = fs.readdirSync(C('credentials')).map((f) => readMd(C(`credentials/${f}`)).data).sort((a, b) => a.order - b.order);
const legal = ['privacy', 'disclaimer'].map((id) => ({ id, ...readMd(C(`legal/${id}.md`)) }));
const utility = ['thank-you', 'not-found'].map((id) => ({ id, ...readMd(C(`utility/${id}.md`)) }));

const fill = (s) => s.replaceAll('{phone}', settings.phone_display);
const q = (s) => `> ${fill(s).split('\n').join('\n> ')}`;
const seo = (s) => `*Search listing* — **Title:** ${s.title}  \n**Description:** ${s.description}`;
const out = [];
const h = (level, text) => out.push(`${'#'.repeat(level)} ${text}\n`);
const p = (text) => out.push(`${text}\n`);

p(`# Copy for Approval — Helen Popich Harris, APLC`);
p(`All website wording in one place, generated directly from the site's content files (${new Date().toISOString().slice(0, 10)}).`);
p(`**How to review:** mark changes directly on this document (or in the editor at /admin). Items marked **[[CONFIRM: …]]** need a decision or a fact checked. Legal statements on the Practice Areas pages are general information and need attorney review before launch. *Italics* in headings are shown with asterisks.`);
p(`---`);

h(2, 'Site-wide (header, footer, contact details)');
p(`- **Firm:** ${settings.firm_name}\n- **Attorney:** ${settings.attorney_name}, ${settings.attorney_title}\n- **Header tagline:** ${settings.header_tagline}\n- **Address:** ${settings.address.street}, ${settings.address.suite}, ${settings.address.city}, ${settings.address.state} ${settings.address.zip}\n- **Telephone:** ${settings.phone_display} · **Fax:** ${settings.fax_display} · **Email:** ${settings.email}\n- **Hours:** ${settings.hours.map((x) => `${x.label}, ${x.time}`).join('; ')} ${settings.hours_note}\n- **Areas served:** ${settings.area_served.join(', ')}`);
p(`**Footer disclaimer:**\n\n${q(settings.footer_disclaimer)}\n\n**Responsible attorney statement:**\n\n${q(settings.responsible_attorney)}`);

h(2, 'Credentials & recognition (Home band, About page, footer)');
p(creds.map((c) => `${c.order}. ${c.statement}${c.visible ? '' : ' *(hidden)*'}`).join('\n'));

h(2, 'Home');
p(seo(home.seo));
h(3, 'Hero');
p(`- **Small heading:** ${home.hero.eyebrow}\n- **Headline:** ${home.hero.headline}\n- **Introduction:** ${home.hero.subhead}\n- **Buttons:** “${home.hero.primary_cta}” · “${fill(home.hero.secondary_cta)}”\n- **Credentials line:** ${home.hero.credential_line}\n- **Photo description (alt text):** ${home.hero.image.alt}`);
h(3, `01 · ${home.intro.label}`);
p(`**${home.intro.heading}**\n\n${fill(home.intro.body)}\n\n*Signature:* ${home.intro.signature}`);
h(3, `02 · ${home.practice_preview.label}`);
p(`**${home.practice_preview.heading}**\n\n${home.practice_preview.intro}\n\n${practice.map((a, i) => `${String(i + 1).padStart(2, '0')}. **${a.data.title}** — ${a.data.summary}`).join('\n')}\n\n*${home.practice_preview.custody_note}*`);
h(3, `03 · ${home.pillars.label}`);
p(`**${home.pillars.heading}**\n\n${home.pillars.items.map((x) => `- **${x.title}.** ${x.body}`).join('\n')}`);
h(3, 'Philosophy quote');
p(`${q(home.quote.text)}\n\n— ${home.quote.attribution}`);
h(3, 'Closing call to action');
p(`**${home.closing_cta.heading}** ${home.closing_cta.body} *Button:* “${home.closing_cta.button_label}”`);

h(2, 'About Helen');
p(seo(about.data.seo));
p(`- **Name:** ${about.data.hero.name}\n- **Title line:** ${about.data.hero.title_line}\n- **Positioning statement:** ${about.data.hero.statement}`);
h(3, `Biography`);
p(about.body);
h(3, 'At a glance');
p(about.data.facts.map((g) => `**${g.heading}**\n${g.items.map((i) => `- ${i}`).join('\n')}`).join('\n\n'));
h(3, about.data.speaking.heading);
p(`${about.data.speaking.intro}\n\n${about.data.speaking.items.map((i) => `- ${i.topic}${i.venue ? ` — *${i.venue}*` : ''}`).join('\n')}`);
h(3, 'Closing call to action');
p(`**${about.data.cta.heading}** ${about.data.cta.body} *Button:* “${about.data.cta.button_label}”`);

h(2, 'Practice Areas (overview page)');
p(seo(overview.seo));
p(`**${overview.heading}**\n\n${overview.intro}`);
h(3, overview.custody.heading);
p(overview.custody.body);
p(`**Closing:** ${overview.cta.heading} ${overview.cta.body}`);

for (const [i, a] of practice.entries()) {
  h(2, `Practice area ${String(i + 1).padStart(2, '0')} — ${a.data.title}  ⚖️ attorney review`);
  p(`${seo(a.data.seo)}  \n**Attorney reviewed:** ${a.data.attorney_reviewed ? 'yes' : '**not yet**'}`);
  p(`*Summary:* ${a.data.summary}`);
  p(a.body);
  if (a.data.focus?.length) p(`**What Ms. Harris reviews** (list on the area's own page)\n${a.data.focus.map((f) => `- ${f}`).join('\n')}`);
  if (a.data.faqs?.length) p(`**Common questions**\n\n${a.data.faqs.map((f) => `**Q. ${f.question}**  \n${f.answer}`).join('\n\n')}`);
}

h(2, 'Contact');
p(seo(contact.seo));
p(`**${contact.heading}**\n\n${contact.intro}\n\n- **Visiting note:** ${contact.parking_note}\n- **Portrait caption:** ${contact.portrait.caption}\n- **Photo band caption:** ${contact.band.caption}`);
h(3, 'Inquiry form');
p(`**${contact.form.heading}** — ${contact.form.intro}\n\n- Fields: Full name*, Phone*, Email*, Preferred contact method (Phone / Email), Matter type, Spouse or opposing party's name, Brief message, Consent*\n- **Matter types:** ${contact.form.matter_types.join(', ')}\n- **Matter type help:** ${contact.form.matter_help}\n- **Other party help:** ${contact.form.other_party_help}\n- **Message help:** ${contact.form.message_help}\n- **Consent statement:** ${contact.form.consent_label}\n- **Button:** ${contact.form.submit_label}`);

for (const l of legal) {
  h(2, `${l.data.title} (draft — attorney review)`);
  p(`*Last updated:* ${l.data.updated}`);
  p(l.body.replace(/^## /gm, '### '));
}
for (const u of utility) {
  h(2, u.id === 'thank-you' ? 'Thank-you page (after the form)' : 'Page not found (404)');
  p(`**${u.data.heading}**\n\n${u.body}`);
}

fs.writeFileSync(path.join(ROOT, 'COPY-FOR-APPROVAL.md'), out.join('\n'));
console.log('✓ COPY-FOR-APPROVAL.md');

/* ---- Every [[CONFIRM]] marker still in content ------------------------- */
const markers = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else
      fs.readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
        for (const m of line.matchAll(/\[\[CONFIRM(?::\s*([^\]]*?))?\s*\]\]/g)) {
          markers.push(`| \`${path.relative(ROOT, full)}:${i + 1}\` | ${(m[1] || '(confirm)').replace(/\|/g, '\\|')} |`);
        }
      });
  }
})(path.join(ROOT, 'src/content'));
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'docs/confirm-markers.md'),
  `# Review markers still in the content (${markers.length})\n\nGenerated by \`npm run copy\`. Each row is a [[CONFIRM]] flag visible on the review site.\n\n| Where | Note |\n|---|---|\n${markers.join('\n')}\n`,
);
console.log(`✓ docs/confirm-markers.md (${markers.length} markers)`);
