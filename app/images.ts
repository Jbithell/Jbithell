import backgroundImages from "./images/backgrounds.json";
import siteImages from "./images/site.json";

/**
 * Optimised images are generated from ./images by `npm run images` (see optimiseImages.ts)
 */
export interface OptimisedImage {
  src: string; // Largest variant
  srcSet: string;
  width: number;
  height: number;
  og?: string; // JPEG for Open Graph previews
}

export type ImageManifest = Record<
  string,
  {
    width: number;
    height: number;
    variants: { src: string; width: number }[];
    og?: string;
  }
>;

export function getImageFromManifest(
  manifest: ImageManifest,
  name: string
): OptimisedImage {
  const image = manifest[name];
  if (!image)
    throw new Error(
      `Image ${name} not found - add it to ./images and run npm run images`
    );
  return {
    src: image.variants[image.variants.length - 1].src,
    srcSet: image.variants
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(", "),
    width: image.width,
    height: image.height,
    og: image.og,
  };
}

// Portfolio images are in portfolioImages.server.ts, so they aren't bundled into every page
export const getImage = (name: string) =>
  getImageFromManifest({ ...backgroundImages, ...siteImages }, name);
