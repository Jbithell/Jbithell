import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import legacyEventSlugs from "./src/legacy-event-slugs.json" with { type: "json" };

// Public routes are cached at the edge and purged by EmDash when content is published.
// The "all" tag isn't a collection name, so it's only purged manually
const cached = (...tags) => ({ maxAge: 86_400, swr: 604_800, tags: [...tags, "all"] });

export default defineConfig({
  site: "https://jbithell.com",
  output: "server",
  adapter: cloudflare(),
  cache: {
    provider: cacheCloudflare(),
  },
  routeRules: {
    "/": cached("events"),
    "/contact": cached(),
    "/portfolio": cached("events"),
    "/portfolio/[slug]": cached("events"),
    "/portfolio/[slug].md": cached("events"),
    "/portfolio/discipline/[slug]": cached("events"),
    "/portfolio/role/[slug]": cached("events"),
    "/rss.xml": cached("events"),
    "/sitemap.xml": cached("events"),
    "/sitemap-site.xml": cached("events"),
    "/llms.txt": cached("events"),
    "/llms-full.txt": cached("events"),
  },
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
    // Lets Astro's image service (the Cloudflare Images binding) resize media from EmDash's library.
    // EmDash only adds this itself when siteUrl is set, which would also pin passkeys to that domain
    remotePatterns: [
      { protocol: "https", hostname: "jbithell.com", pathname: "/_emdash/api/media/file/**" },
      // `npm run preview` serves the production build locally
      ...(process.env.LOCAL_PREVIEW
        ? [{ protocol: "http", hostname: "localhost", pathname: "/_emdash/api/media/file/**" }]
        : []),
    ],
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto", coalesce: true }),
      storage: r2({ binding: "MEDIA" }),
      // Keeps public HTML identical for every visitor, so it can be served from the edge cache
      toolbar: "client",
    }),
  ],
  devToolbar: { enabled: false },
});
