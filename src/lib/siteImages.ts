import backgroundImages from "../images/backgrounds.json";
import siteImages from "../images/site.json";
import type { ResponsiveImage } from "./images";

/**
 * The site's own images, pre-optimised from ./images by `npm run images` (see optimiseImages.ts)
 */
type ImageManifest = Record<
  string,
  { width: number; height: number; variants: { src: string; width: number }[]; og?: string }
>;

const manifest: ImageManifest = { ...backgroundImages, ...siteImages };

export function siteImage(
  name: string,
  sizes: string,
  alt = "",
): ResponsiveImage & { og?: string } {
  const image = manifest[name];
  if (!image)
    throw new Error(`Image ${name} not found - add it to ./images and run npm run images`);
  return {
    src: image.variants[image.variants.length - 1].src,
    srcSet: image.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    sizes,
    width: image.width,
    height: image.height,
    alt,
    og: image.og,
  };
}
