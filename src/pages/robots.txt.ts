import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

export const prerender = true;

/** Replaces EmDash's server-rendered robots.txt */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  return new Response(
    `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /_emdash/

Sitemap: ${siteUrl}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
