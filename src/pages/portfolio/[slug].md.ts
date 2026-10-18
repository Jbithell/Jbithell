import type { APIRoute } from "astro";
import { decodeSlug, getEmDashEntry } from "emdash";
import type { EventEntry } from "../../lib/events";
import { eventMarkdown, markdownResponse } from "../../lib/markdown";

/** Markdown version of an event page */
export const GET: APIRoute = async (context) => {
  const slug = decodeSlug(context.params.slug);
  const { entry, cacheHint } = slug ? await getEmDashEntry("events", slug) : { entry: null };
  if (!entry) return new Response("Not found", { status: 404 });
  if (context.cache?.enabled && cacheHint) context.cache.set(cacheHint);
  const path = `/portfolio/${entry.id}`;
  const response = markdownResponse(
    eventMarkdown((entry as EventEntry).data, context.url.origin + path),
  );
  response.headers.set("Link", `<${path}>; rel="canonical"`);
  return response;
};
