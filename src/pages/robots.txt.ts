/**
 * robots.txt — generated so the sitemap URL always matches the configured
 * domain (SITE_URL). noindex pages (thank-you, styleguide, 404) are left
 * crawlable on purpose: crawlers must be able to read their noindex tag.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin/', '', `Sitemap: ${new URL('sitemap-index.xml', site).href}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
