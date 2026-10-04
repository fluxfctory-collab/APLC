/**
 * Content accessors shared by pages and components.
 */
import { getCollection, getEntry } from 'astro:content';
import { isReviewMode } from './confirm';

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.json');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getReviewMode(): Promise<boolean> {
  return isReviewMode((await getSettings()).review_mode);
}

export async function getCredentials() {
  const all = await getCollection('credentials', ({ data }) => data.visible);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPracticeAreas() {
  const all = await getCollection('practice');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function addressLines(s: Settings): string[] {
  const a = s.address;
  return [[a.street, a.suite].filter(Boolean).join(', '), `${a.city}, ${a.state} ${a.zip}`];
}

export const telHref = (s: Settings): string => `tel:${s.phone_link}`;

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/practice-areas/', label: 'Practice Areas' },
  { href: '/contact/', label: 'Contact' },
] as const;
