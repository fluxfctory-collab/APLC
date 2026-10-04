/**
 * Small text helpers for CMS strings (build time only — nothing ships to the browser).
 */
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/** Block Markdown (paragraphs, lists) → HTML. */
export const md = (s = ''): string => marked.parse(s, { async: false }) as string;

/** Inline Markdown (*italic*, **bold**, links) → HTML without a wrapping <p>. */
export const inline = (s = ''): string => marked.parseInline(s, { async: false }) as string;

/** Plain text: strips inline Markdown emphasis markers. */
export const plain = (s = ''): string => s.replace(/\*\*?|__?/g, '').trim();

/** Replace {phone}, {fax}, {email} tokens with values from site settings. */
export function fill(s: string, settings: { phone_display: string; fax_display: string; email: string }): string {
  return s
    .replaceAll('{phone}', settings.phone_display)
    .replaceAll('{fax}', settings.fax_display)
    .replaceAll('{email}', settings.email);
}

/** Two-digit section numerals: 1 → "01". */
export const pad = (n: number): string => String(n).padStart(2, '0');

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
export const roman = (n: number): string => ROMAN[n - 1] ?? String(n);

/** Escape text for safe use with set:html. */
export const esc = (s = ''): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Typeset ® / ™ as small superscripts (Cormorant draws them full-size). Escapes the rest. */
export const reg = (s = ''): string => esc(s).replace(/([®™])/g, '<sup class="reg">$1</sup>');
