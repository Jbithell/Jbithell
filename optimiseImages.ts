/**
 * Generates web-optimised images from the originals in ./images
 *
 * Run with `npm run images` whenever an image in ./images is added or changed, and commit the output.
 *
 * These are the site's own images. Portfolio photos are uploaded to EmDash's media library instead.
 *
 * - Every photo is resized to a set of widths and re-encoded as WebP, with a content hash in the filename so it can be cached forever
 * - The profile photo also gets a 1200px JPEG for Open Graph previews (not every social platform supports WebP)
 * - The icon SVG is copied to /icon.svg and rendered to the PNG icons used by iOS and the web app manifest
 * - src/images/<folder>.json records the dimensions and variants of every image, for use in srcset.
 *   There's one file per folder (images in the root go in site.json) so pages only bundle the images they use
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = path.join(import.meta.dirname, "images");
const PUBLIC_DIR = path.join(import.meta.dirname, "public");
const OUTPUT_DIR = path.join(PUBLIC_DIR, "images");
const MANIFEST_DIR = path.join(import.meta.dirname, "src", "images");

const WEBP_QUALITY = 75;
const OG_WIDTH = 1200;
const OG_QUALITY = 80;
// Widths to generate for each folder. Images are never upscaled.
const WIDTHS: Record<string, number[]> = {
  backgrounds: [768, 1280, 1920, 2560],
  ".": [140, 280, 420], // Profile photo, displayed at 140px
};
const OG_FOLDERS = ["."];

export interface ImageVariant {
  src: string;
  width: number;
}
export interface ImageManifestEntry {
  width: number;
  height: number;
  variants: ImageVariant[];
  og?: string;
}

const hashed = (relativeName: string, buffer: Buffer, ext: string) => {
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
  return `${relativeName}.${hash}.${ext}`;
};

const writeOutput = (relativePath: string, buffer: Buffer) => {
  const outputPath = path.join(OUTPUT_DIR, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  return "/images/" + relativePath.split(path.sep).join("/");
};

const optimiseImage = async (
  relativePath: string
): Promise<ImageManifestEntry> => {
  const folder = path.dirname(relativePath);
  const baseName = relativePath.replace(/\.[^.]+$/, "");
  // .rotate() applies the EXIF orientation before the metadata is stripped
  const source = sharp(path.join(SOURCE_DIR, relativePath)).rotate();
  const { info } = await source
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const targetWidths = WIDTHS[folder] ?? WIDTHS.backgrounds;
  const widths = targetWidths.filter((width) => width < info.width);
  // Smaller than the largest target width, so use the original width instead
  if (widths.length < targetWidths.length) widths.push(info.width);

  const variants: ImageVariant[] = [];
  for (const width of widths) {
    const buffer = await source
      .clone()
      .resize({ width })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    variants.push({
      src: writeOutput(hashed(`${baseName}-${width}`, buffer, "webp"), buffer),
      width,
    });
  }
  const largest = variants[variants.length - 1];

  let og: string | undefined;
  if (OG_FOLDERS.includes(folder)) {
    const buffer = await source
      .clone()
      .resize({ width: Math.min(OG_WIDTH, info.width) })
      .jpeg({ quality: OG_QUALITY, mozjpeg: true })
      .toBuffer();
    og = writeOutput(hashed(baseName, buffer, "jpg"), buffer);
  }

  return {
    width: largest.width,
    height: Math.round((info.height * largest.width) / info.width),
    variants,
    og,
  };
};

const generateIcons = async () => {
  const svg = fs.readFileSync(path.join(SOURCE_DIR, "icon.svg"));
  fs.writeFileSync(path.join(PUBLIC_DIR, "icon.svg"), svg);
  const iconName = (size: number, padding: number) =>
    size === 180
      ? ["apple-touch-icon.png"]
      : [`icon-${size}${padding > size * 0.15 ? "-maskable" : ""}.png`];
  const icon = (size: number, padding: number) =>
    sharp(svg)
      .resize(size - padding * 2, size - padding * 2)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: "#ffffff",
      })
      .flatten({ background: "#ffffff" })
      .png()
      .toFile(path.join(PUBLIC_DIR, ...iconName(size, padding)));
  await Promise.all([
    icon(180, 20), // apple-touch-icon
    icon(192, 16),
    icon(512, 40),
    icon(512, 110), // Maskable icons need the logo inside the central 80% safe zone
  ]);
};

const main = async () => {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  const sources = fs
    .readdirSync(SOURCE_DIR, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort();
  const manifests: Record<string, Record<string, ImageManifestEntry>> = {};
  for (const source of sources) {
    console.log(`Optimising ${source}`);
    const parts = source.split(path.sep);
    const manifestName = parts.length > 1 ? parts[0] : "site";
    manifests[manifestName] ??= {};
    manifests[manifestName][parts.join("/")] = await optimiseImage(source);
  }
  fs.rmSync(MANIFEST_DIR, { recursive: true, force: true });
  fs.mkdirSync(MANIFEST_DIR);
  for (const [name, manifest] of Object.entries(manifests)) {
    fs.writeFileSync(
      path.join(MANIFEST_DIR, `${name}.json`),
      JSON.stringify(manifest, null, 2) + "\n"
    );
  }
  await generateIcons();
  console.log(`Optimised ${sources.length} images`);
};

await main();
