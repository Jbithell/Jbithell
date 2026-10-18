import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { getProjects, projectPath } from "../lib/projects";

export const prerender = true;

/** Replaces EmDash's server-rendered sitemap for the projects collection */
export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const projects = await getProjects();
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${projects
  .map(
    (project) =>
      `  <url>\n    <loc>${siteUrl}${projectPath(project)}</loc>\n    <lastmod>${new Date(project.data.updatedAt).toISOString()}</lastmod>\n  </url>`,
  )
  .join("\n")}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
