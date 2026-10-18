import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { eventPath, eventSummary } from "../lib/events";
import { markdownResponse } from "../lib/markdown";
import { getEvents } from "../lib/portfolio";
import { EMAIL, socialLinks } from "../lib/site";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const name = settings.title || "James Bithell";
  const links = socialLinks(settings.social);
  const events = await getEvents();
  return markdownResponse(`# ${name}

> Personal website of ${name}, based in London, United Kingdom, with contact details, CV and an Event Portfolio of ${events.length} live events worked on since 2014.

Every event page is also available as Markdown by adding \`.md\` to its URL. [llms-full.txt](${siteUrl}/llms-full.txt) has every event in one file.

- Email: ${EMAIL}
- [Contact](${siteUrl}/contact): Contact details
- [CV](${links.linkedin}): CV on LinkedIn
- [Development portfolio](${links.github}): Software projects on GitHub
- [Sitemap](${siteUrl}/sitemap.xml)

## Event Portfolio

[Event Portfolio](${siteUrl}/portfolio), most recent first:

${events.map((event) => `- [${event.data.title}](${siteUrl}${eventPath(event)}.md): ${eventSummary(event.data)}`).join("\n")}
`);
};
