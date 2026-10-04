// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Canonical origin. [[CONFIRM]] domain — override with SITE_URL in Netlify. */
const SITE = process.env.SITE_URL || 'https://harrisaplc.com';

/** Pages kept out of the sitemap (also noindexed in their <head>). */
const EXCLUDE = ['/styleguide/', '/thank-you/', '/404/'];

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Inline all CSS: one fewer render-blocking request on every page (LCP).
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDE.some((path) => new URL(page).pathname === path),
    }),
  ],
  image: {
    // Upload masters are capped at their native width; never upscale.
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});
