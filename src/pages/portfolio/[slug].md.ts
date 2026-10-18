import type { APIRoute, GetStaticPaths } from "astro";
import { eventPath, type EventEntry } from "../../lib/events";
import { eventMarkdown, markdownResponse } from "../../lib/markdown";
import { getEvents } from "../../lib/portfolio";

export const prerender = true;

export const getStaticPaths = (async () =>
  (await getEvents()).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

/** Markdown version of an event page. Its canonical Link header is set in public/_headers */
export const GET: APIRoute<{ entry: EventEntry }> = ({ props, url }) =>
  markdownResponse(eventMarkdown(props.entry.data, url.origin + eventPath(props.entry)));
