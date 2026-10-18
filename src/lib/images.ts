import type { AstroGlobal } from "astro";
import { getImage } from "astro:assets";
import type { Event } from "../../emdash-env";

export type MediaValue = NonNullable<Event["featured_image"]>;

/** Plain image attributes, so CMS images can be rendered by React (Mantine) components */
export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
  style?: { backgroundColor?: string; objectPosition?: string };
}

/**
 * Resolve an EmDash image field into a responsive src/srcset, using Astro's image service
 * (the Cloudflare Images binding in production). Mirrors EmDash's own <EmDashImage> component.
 */
export async function cmsImage(
  astro: Pick<AstroGlobal, "url" | "locals">,
  image: MediaValue | null | undefined,
  { widths, sizes }: { widths: number[]; sizes: string },
): Promise<ResponsiveImage | null> {
  if (!image) return null;
  const storageKey = image.meta?.storageKey;
  let src =
    image.src ||
    (typeof storageKey === "string"
      ? astro.locals.emdash?.getPublicMediaUrl?.(storageKey)
      : undefined) ||
    `/_emdash/api/media/file/${image.id}`;
  const result: ResponsiveImage = {
    src,
    alt: image.alt ?? "",
    width: image.width,
    height: image.height,
    style: {
      // Low-quality placeholder while the image loads, and the focal point set in the media library
      backgroundColor: image.dominantColor,
      objectPosition:
        typeof image.focalX === "number" && typeof image.focalY === "number"
          ? `${image.focalX * 100}% ${image.focalY * 100}%`
          : undefined,
    },
  };
  if (!image.width || !image.height) return result;

  // Astro only optimises absolute URLs on an authorised host (see image.remotePatterns)
  if (src.startsWith("/") && !src.startsWith("//")) src = new URL(src, astro.url.origin).href;
  const maxWidth = image.width;
  const candidates = [...new Set(widths.map((w) => Math.min(w, maxWidth)))];
  try {
    const optimised = await getImage({
      src,
      width: image.width,
      height: image.height,
      widths: candidates,
      sizes,
      format: "webp",
    });
    // The image service passes un-authorised URLs through unchanged
    if (optimised.src !== src) {
      result.src = optimised.src;
      result.srcSet = optimised.srcSet.attribute;
      result.sizes = sizes;
    }
  } catch (error) {
    console.warn("Failed to optimise image", error);
  }
  return result;
}

/** A 1200px JPEG for Open Graph previews, as not every social platform supports WebP */
export async function cmsOgImage(
  astro: Pick<AstroGlobal, "url" | "locals">,
  image: MediaValue | null | undefined,
): Promise<string | undefined> {
  if (!image?.width || !image.height) return undefined;
  const storageKey = image.meta?.storageKey;
  const path =
    image.src ||
    (typeof storageKey === "string"
      ? astro.locals.emdash?.getPublicMediaUrl?.(storageKey)
      : undefined);
  if (!path) return undefined;
  const src = new URL(path, astro.url.origin).href;
  const width = Math.min(1200, image.width);
  try {
    const result = await getImage({
      src,
      width,
      height: Math.round((image.height * width) / image.width),
      format: "jpg",
      quality: 80,
    });
    return new URL(result.src, astro.url.origin).href;
  } catch {
    return src;
  }
}
