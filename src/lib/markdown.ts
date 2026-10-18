import { extractPlainText } from "emdash";
import type { Event } from "../../emdash-env";
import { eventDisciplines, eventRoles, formatEventDate } from "./events";

export const markdownResponse = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });

const escape = (s: string) => s.replace(/([\\`*_[\]])/g, "\\$1");

/** A Markdown version of an event page, for agents and llms-full.txt */
export function eventMarkdown(event: Event, url: string, headingLevel = 1) {
  const h = "#".repeat(headingLevel);
  const facts: [string, string | undefined][] = [
    ["Date", formatEventDate(event)],
    [
      "Roles",
      eventRoles(event)
        .map((t) => t.label)
        .join(", "),
    ],
    [
      "Disciplines",
      eventDisciplines(event)
        .map((t) => t.label)
        .join(", "),
    ],
    ["Venue", event.venue],
    ["Client", event.client],
    ["Directed by", event.director],
    ["Written by", event.author],
    [
      "Performances attended",
      event.performances_attended ? String(event.performances_attended) : undefined,
    ],
    ["Professional production", event.professional ? "Yes" : undefined],
  ];
  const description = event.description?.length ? extractPlainText(event.description) : "";
  return [
    `${h} ${escape(event.title)}`,
    "",
    `URL: ${url}`,
    "",
    ...facts.filter(([, value]) => value).map(([label, value]) => `- ${label}: ${escape(value!)}`),
    ...(description ? ["", description] : []),
    "",
  ].join("\n");
}
