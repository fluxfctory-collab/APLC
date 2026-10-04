/**
 * Content collections — every word and photo the client can edit lives here.
 * The /admin CMS (public/admin/config.yml) writes to exactly these files, so
 * keep field names in sync when changing either side.
 *
 * Images are stored as plain paths (e.g. "/src/assets/uploads/portrait.jpg")
 * and resolved to optimised assets by src/lib/images.ts. This keeps the CMS
 * media library simple while Astro still generates AVIF/WebP/JPEG sizes.
 *
 * Text may contain review markers like [[CONFIRM: note]]. They are rendered
 * as visible flags in review mode and removed in production (see middleware).
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const cta = z.object({
  heading: z.string(),
  body: z.string().optional().default(''),
  button_label: z.string(),
});

const image = z.object({
  src: z.string(),
  alt: z.string(),
});

/* ---- Site settings ------------------------------------------------------ */
const settings = defineCollection({
  loader: glob({ pattern: 'site.json', base: './src/content/settings' }),
  schema: z.object({
    review_mode: z.boolean().default(true),
    firm_name: z.string(),
    attorney_name: z.string(),
    attorney_title: z.string(),
    header_tagline: z.string(),
    phone_display: z.string(),
    phone_link: z.string(),
    fax_display: z.string(),
    email: z.string(),
    address: z.object({
      street: z.string(),
      suite: z.string().optional().default(''),
      city: z.string(),
      state: z.string(),
      state_abbr: z.string(),
      zip: z.string(),
    }),
    maps_url: z.string(),
    map_embed_url: z.string(),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    hours: z.array(
      z.object({
        label: z.string(),
        time: z.string(),
        days: z.array(z.string()),
        opens: z.string(),
        closes: z.string(),
      }),
    ),
    hours_note: z.string().optional().default(''),
    area_served: z.array(z.string()),
    profiles: z.array(
      z.object({
        label: z.string(),
        url: z.string().optional().default(''),
      }),
    ),
    footer_disclaimer: z.string(),
    responsible_attorney: z.string(),
    default_share_image: z.string(),
  }),
});

/* ---- Home ----------------------------------------------------------------- */
const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/home' }),
  schema: z.object({
    seo,
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subhead: z.string(),
      primary_cta: z.string(),
      secondary_cta: z.string(),
      credential_line: z.string(),
      image,
    }),
    credentials_band: z.object({ label: z.string() }),
    intro: z.object({
      label: z.string(),
      heading: z.string(),
      body: z.string(),
      signature: z.string(),
      image,
    }),
    practice_preview: z.object({
      label: z.string(),
      heading: z.string(),
      intro: z.string(),
      custody_note: z.string(),
      link_label: z.string(),
    }),
    pillars: z.object({
      label: z.string(),
      heading: z.string(),
      items: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    quote: z.object({
      text: z.string(),
      attribution: z.string(),
    }),
    closing_cta: cta,
  }),
});

/* ---- About ------------------------------------------------------------- */
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/about' }),
  schema: z.object({
    seo,
    hero: z.object({
      eyebrow: z.string(),
      name: z.string(),
      title_line: z.string(),
      statement: z.string(),
      image,
    }),
    bio_heading: z.string(),
    facts: z.array(
      z.object({
        heading: z.string(),
        items: z.array(z.string()),
      }),
    ),
    speaking: z.object({
      heading: z.string(),
      intro: z.string(),
      items: z.array(z.object({ topic: z.string(), venue: z.string().optional().default('') })),
    }),
    credentials: z.object({
      heading: z.string(),
      intro: z.string(),
    }),
    secondary_image: image.optional(),
    cta,
  }),
});

/* ---- Contact ------------------------------------------------------------- */
const contact = defineCollection({
  loader: glob({ pattern: 'contact.md', base: './src/content/contact' }),
  schema: z.object({
    seo,
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    details_heading: z.string(),
    parking_note: z.string().optional().default(''),
    portrait: image.extend({ caption: z.string() }),
    form: z.object({
      heading: z.string(),
      intro: z.string(),
      matter_types: z.array(z.string()),
      matter_help: z.string(),
      other_party_help: z.string(),
      message_help: z.string(),
      consent_label: z.string(),
      submit_label: z.string(),
    }),
    band: z.object({
      show: z.boolean().default(true),
      image,
      caption: z.string(),
    }),
  }),
});

/* ---- Practice areas: overview page + one entry per area ------------------ */
const practiceOverview = defineCollection({
  loader: glob({ pattern: 'index.md', base: './src/content/practice-overview' }),
  schema: z.object({
    seo,
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    custody: z.object({ heading: z.string(), body: z.string() }),
    cta,
  }),
});

const practice = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/practice' }),
  schema: z.object({
    title: z.string(),
    short_title: z.string(),
    order: z.number(),
    summary: z.string(),
    seo,
    focus: z.array(z.string()).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    attorney_reviewed: z.boolean().default(false),
  }),
});

/* ---- Credentials (repeatable) ---------------------------------------------- */
const credentials = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/credentials' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    statement: z.string(),
    years: z.string().optional().default(''),
    link: z.string().optional().default(''),
    badge_image: z.string().optional().default(''),
    badge_alt: z.string().optional().default(''),
    badge_embed: z.string().optional().default(''),
    order: z.number(),
    visible: z.boolean().default(true),
    show_in_band: z.boolean().default(true),
  }),
});

/* ---- Legal + utility pages --------------------------------------------------- */
const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    seo,
    updated: z.string(),
  }),
});

const utility = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/utility' }),
  schema: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    seo,
  }),
});

export const collections = {
  settings,
  home,
  about,
  contact,
  practiceOverview,
  practice,
  credentials,
  legal,
  utility,
};
