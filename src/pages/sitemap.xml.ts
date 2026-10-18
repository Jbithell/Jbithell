import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { getEvents } from "../lib/portfolio";

/**
 * Replaces EmDash's sitemap index, which only lists collection entries, to add the site's other pages.
 * EmDash still serves /sitemap-events.xml (one file holds up to 2,000 events)
 */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const events = await getEvents(context);
  const lastmod = events
    .map((event) => new Date(event.data.updatedAt).getTime())
    .reduce((a, b) => Math.max(a, b), 0);
  const sitemaps = [`${siteUrl}/sitemap-site.xml`, `${siteUrl}/sitemap-events.xml`];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) =>
      `  <sitemap>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}\n  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
