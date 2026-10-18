import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { eventPath, eventSummary } from "../lib/events";
import { markdownResponse } from "../lib/markdown";
import { cvItemSummary, getCv } from "../lib/cv";
import { getEvents } from "../lib/portfolio";
import { getProjects, projectPath, projectSummary } from "../lib/projects";
import { EMAIL, socialLinks } from "../lib/site";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const name = settings.title || "James Bithell";
  const links = socialLinks(settings.social);
  const [events, projects, cv] = await Promise.all([
    getEvents(),
    getProjects(),
    getCv(context, "public"),
  ]);
  const cvLines = [
    ...cv.work.map((item) => `- ${cvItemSummary(item)}`),
    ...cv.education.map((item) => `- Education: ${cvItemSummary(item)}`),
    ...cv.volunteering.map((item) => `- Volunteering: ${cvItemSummary(item)}`),
  ];
  return markdownResponse(`# ${name}

> Personal website of ${name}, based in London, United Kingdom, with contact details, CV, a Projects Portfolio of software and hardware projects and an Event Portfolio of ${events.length} live events worked on since 2014.

Every event page is also available as Markdown by adding \`.md\` to its URL. [llms-full.txt](${siteUrl}/llms-full.txt) has every event in one file.

- Email: ${EMAIL}
- [Contact](${siteUrl}/contact): Contact details
- [CV](${siteUrl}/cv): Experience, education and volunteering
- [LinkedIn](${links.linkedin})
- [GitHub](${links.github})
- [Sitemap](${siteUrl}/sitemap.xml)
${cvLines.length ? `\n## CV\n\n${cvLines.join("\n")}\n` : ""}
## Projects Portfolio

[Projects Portfolio](${siteUrl}/projects):

${projects.map((project) => `- [${project.data.title}](${siteUrl}${projectPath(project)}): ${projectSummary(project.data)}`).join("\n")}

## Event Portfolio

[Event Portfolio](${siteUrl}/portfolio), most recent first:

${events.map((event) => `- [${event.data.title}](${siteUrl}${eventPath(event)}.md): ${eventSummary(event.data)}`).join("\n")}
`);
};
