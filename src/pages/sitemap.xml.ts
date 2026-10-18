import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { getEvents } from "../lib/portfolio";
import { getProjects } from "../lib/projects";

export const prerender = true;

/**
 * Replaces EmDash's sitemap index, which only lists collection entries, to add the site's other pages
 */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const [events, projects] = await Promise.all([getEvents(), getProjects()]);
  const lastmod = [...events, ...projects]
    .map((entry) => new Date(entry.data.updatedAt).getTime())
    .reduce((a, b) => Math.max(a, b), 0);
  const sitemaps = [
    `${siteUrl}/sitemap-site.xml`,
    `${siteUrl}/sitemap-events.xml`,
    `${siteUrl}/sitemap-projects.xml`,
  ];
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
