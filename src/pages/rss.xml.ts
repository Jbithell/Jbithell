import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";
import { eventPath, eventSummary } from "../lib/events";
import { getEvents } from "../lib/portfolio";

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const siteUrl = (settings.url || context.url.origin).replace(/\/$/, "");
  const title = `${settings.title || "James Bithell"}: event portfolio`;
  const events = (await getEvents(context)).slice(0, 50);
  const items = events
    .map((event) => {
      const url = siteUrl + eventPath(event);
      return `    <item>
      <title>${escapeXml(event.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(event.data.date).toUTCString()}</pubDate>
      <description>${escapeXml(eventSummary(event.data))}</description>
    </item>`;
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}/portfolio</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Theatre productions, concerts and live events worked on since 2014</description>
    <language>en-gb</language>
    <sy:updatePeriod>weekly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
${items}
  </channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
