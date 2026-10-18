import { fileURLToPath } from "node:url";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import legacyEventSlugs from "./src/legacy-event-slugs.json" with { type: "json" };

// The R2 bucket's public custom domain. Media is served from here rather than through the Worker
const MEDIA_URL = "https://media.jbithell.com";

export default defineConfig({
  site: "https://jbithell.com",
  // Public pages are prerendered (`export const prerender = true`) from the production database by
  // Workers Builds, and served as static assets without running the Worker. Only the EmDash admin,
  // its API and unknown URLs (for redirects and the 404 page) are rendered by the Worker
  output: "server",
  adapter: cloudflare({
    // Resize images with sharp while building, rather than through the Worker on each request
    imageService: "compile",
    // Read the production D1 database (see `remote` in wrangler.jsonc) only in Workers Builds, so
    // local builds and `npm run dev` use the local database
    remoteBindings: !!process.env.WORKERS_CI,
  }),
  // /portfolio/x.html rather than /portfolio/x/index.html, so pages are served without a trailing slash
  build: { format: "file" },
  // URLs from the previous version of the site
  redirects: {
    "/events": "/portfolio",
    ...Object.fromEntries(
      Object.entries(legacyEventSlugs).map(([oldSlug, newSlug]) => [
        `/events/${oldSlug}`,
        `/portfolio/${newSlug}`,
      ]),
    ),
  },
  image: {
    responsiveStyles: true,
    // Lets the build download and resize media from EmDash's library
    remotePatterns: [{ protocol: "https", hostname: new URL(MEDIA_URL).hostname }],
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto", coalesce: true }),
      // Locally, media is served by the Worker from the local bucket instead, without being resized
      storage: r2({ binding: "MEDIA", publicUrl: process.env.WORKERS_CI ? MEDIA_URL : undefined }),
      // Keeps public HTML identical for every visitor, so it can be prerendered
      toolbar: "client",
      plugins: [
        {
          id: "rebuild",
          version: "1.0.0",
          entrypoint: fileURLToPath(new URL("./src/plugins/rebuild.ts", import.meta.url)),
          adminWidgets: [{ id: "rebuild", title: "Website", size: "third" }],
        },
      ],
      // Redirects www.jbithell.com to jbithell.com before EmDash runs
      middleware: { outer: "./src/outer-middleware.ts" },
    }),
  ],
  devToolbar: { enabled: false },
});
