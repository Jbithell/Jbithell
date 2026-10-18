import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { eventPath } from "../lib/events";
import { getEvents } from "../lib/portfolio";

export const prerender = true;

/** Replaces EmDash's server-rendered sitemap for the events collection */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const events = await getEvents();
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${events
  .map(
    (event) =>
      `  <url>\n    <loc>${siteUrl}${eventPath(event)}</loc>\n    <lastmod>${new Date(event.data.updatedAt).toISOString()}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
