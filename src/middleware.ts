/**
 * Post-processes every rendered HTML page (at build time for this static site):
 *  - removes HTML comments, so internal notes such as <!-- ATTORNEY REVIEW -->
 *    in Markdown content never reach the published source;
 *  - applies review markers (see src/lib/confirm.ts).
 */
import { defineMiddleware } from 'astro:middleware';
import { processMarkers } from './lib/confirm';
import { getReviewMode } from './lib/site';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('text/html')) return response;
  const html = (await response.text()).replace(/<!--(?!\[)[\s\S]*?-->/g, '');
  const review = await getReviewMode();
  return new Response(processMarkers(html, review), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
