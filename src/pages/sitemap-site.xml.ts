import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { getTerms } from "../lib/portfolio";

export const prerender = true;

/** Pages that aren't EmDash entries: the home page, portfolio listings, CV and contact page */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const [disciplines, roles] = await Promise.all([
    getTerms("discipline"),
    getTerms("role"),
  ]);
  const paths = [
    "/",
    "/portfolio",
    "/projects",
    "/cv",
    "/contact",
    ...disciplines.filter((t) => t.count).map((t) => `/portfolio/discipline/${t.slug}`),
    ...roles.filter((t) => t.count).map((t) => `/portfolio/role/${t.slug}`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n")}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
