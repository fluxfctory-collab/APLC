/**
 * Review markers
 * ---------------------------------------------------------------------------
 * Any CMS text may contain  [[CONFIRM]]  or  [[CONFIRM: a short note]]  to flag
 * an unverified fact. In review mode these become small visible flags so the
 * client can see, in context, what still needs confirming. In production
 * (review mode off) they are removed entirely.
 *
 * Markers are always removed — never rendered as HTML — inside <head>,
 * <script>/<style>/<title>, and attribute values (alt text, meta tags,
 * JSON-LD), where markup would be invalid.
 */
const MARKER = /\s*\[\[CONFIRM(?::\s*([^\]]*?))?\s*\]\]/g;

export const hasMarkers = (s: string): boolean => s.includes('[[CONFIRM');

export const stripMarkers = (s: string): string => s.replace(MARKER, '');

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function processMarkers(html: string, review: boolean): string {
  if (!hasMarkers(html)) return html;
  let out = html.replace(/<head[\s\S]*?<\/head>/i, (m) => stripMarkers(m));
  out = out.replace(/<(script|style|title|textarea|option)\b[\s\S]*?<\/\1>/gi, (m) => stripMarkers(m));
  out = out.replace(/=("[^"]*"|'[^']*')/g, (m) => (hasMarkers(m) ? stripMarkers(m) : m));
  return out.replace(MARKER, (_m, note?: string) =>
    review
      ? ` <span class="confirm"><span class="sr-only">Review note: </span>${escapeHtml(note?.trim() || 'to confirm')}</span>`
      : '',
  );
}

/** Review mode: REVIEW_MODE env var wins (for QA/production builds), else the CMS setting. */
export function isReviewMode(settingValue: boolean): boolean {
  const env = process.env.REVIEW_MODE;
  if (env === 'true') return true;
  if (env === 'false') return false;
  return settingValue;
}
