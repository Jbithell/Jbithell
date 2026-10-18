import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { eventPath } from "../lib/events";
import { eventMarkdown, markdownResponse } from "../lib/markdown";
import { getEvents } from "../lib/portfolio";
import { EMAIL } from "../lib/site";

export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const name = settings.title || "James Bithell";
  const events = await getEvents(context);
  return markdownResponse(
    [
      `# ${name}: Event Portfolio`,
      "",
      `> Every live event ${name} (${settings.tagline || "London, United Kingdom"}) has worked on since 2014, most recent first. Contact: ${EMAIL}`,
      "",
      ...events.map((event) => eventMarkdown(event.data, siteUrl + eventPath(event), 2)),
    ].join("\n"),
  );
};
