import eventPortfolio from "../../eventPortfolio.json";
import { SITE_URL } from "../seo";
import type { EventPortfolioObject } from "../types.d";

export const sitemapPaths = () => [
  "/",
  "/contact",
  "/events",
  ...(eventPortfolio as EventPortfolioObject[]).map(
    (event) => `/events/${event.slug}`
  ),
];

export async function loader() {
  const urls = sitemapPaths()
    .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
