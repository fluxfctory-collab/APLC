/**
 * Resolve CMS image paths to Astro image assets.
 *
 * The CMS stores image fields as paths such as "/src/assets/uploads/photo.jpg".
 * Every upload lives in src/assets/uploads, so we resolve by file name. That
 * lets Astro optimise each image (AVIF/WebP/JPEG at responsive widths) no
 * matter how the path was written.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const byName = new Map(
  Object.entries(files).map(([file, mod]) => [file.split('/').pop()!.toLowerCase(), mod.default]),
);

export function resolveImage(path: string | undefined | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const name = decodeURIComponent(path.split('?')[0].split('/').pop() ?? '').toLowerCase();
  return byName.get(name);
}

/** Like resolveImage, but fails the build with a clear message (keeps the live site intact). */
export function requireImage(path: string, where: string): ImageMetadata {
  const img = resolveImage(path);
  if (!img) {
    throw new Error(
      `Image "${path}" (${where}) was not found in src/assets/uploads. ` +
        `Re-upload it in the CMS media library or correct the field.`,
    );
  }
  return img;
}
