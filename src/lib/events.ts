import type { ContentEntry } from "emdash";
import type { Event } from "../../emdash-env";

export type EventEntry = ContentEntry<Event>;

const TIME_ZONE = "Europe/London";
const LOCALE = "en-GB";

const parts = (iso: string) => {
  const formatted = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(iso));
  const get = (type: string) => formatted.find((p) => p.type === type)!.value;
  return { day: get("day"), month: get("month"), year: get("year") };
};

/** e.g. "2014", "March 2015", "1 September 2014", "13–15 February 2020" or "31 May – 2 June 2019" */
export function formatEventDate(event: Pick<Event, "date" | "date_precision" | "end_date">) {
  const start = parts(event.date);
  if (event.date_precision === "year") return start.year;
  if (event.date_precision === "month") return `${start.month} ${start.year}`;
  if (!event.end_date) return `${start.day} ${start.month} ${start.year}`;
  const end = parts(event.end_date);
  if (start.year !== end.year)
    return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`;
  if (start.month !== end.month)
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
  if (start.day !== end.day) return `${start.day}–${end.day} ${end.month} ${end.year}`;
  return `${start.day} ${start.month} ${start.year}`;
}

/** Machine-readable date for <time datetime> and structured data, at the precision we know it */
export function isoEventDate(iso: string, precision: Event["date_precision"] = "day") {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date(iso));
  if (precision === "year") return date.slice(0, 4);
  if (precision === "month") return date.slice(0, 7);
  return date;
}

export const eventYear = (event: Pick<Event, "date">) => parts(event.date).year;

export const eventRoles = (event: Event) => event.terms?.role ?? [];
export const eventDisciplines = (event: Event) => event.terms?.discipline ?? [];

export const eventPath = (entry: EventEntry) => `/portfolio/${entry.id}`;

/** One-line summary, used for meta descriptions, feeds and llms.txt */
export function eventSummary(event: Event) {
  const roles = eventRoles(event)
    .map((role) => role.label)
    .join(", ");
  return [
    `${event.title} (${formatEventDate(event)})`,
    roles && `: ${roles}`,
    event.venue && ` at ${event.venue}`,
    event.client && ` for ${event.client}`,
  ]
    .filter(Boolean)
    .join("");
}

/** Group events (already sorted newest first) by year */
export function groupByYear<T extends { year: string }>(events: T[]) {
  const groups: { year: string; events: T[] }[] = [];
  for (const event of events) {
    const last = groups[groups.length - 1];
    if (last?.year === event.year) last.events.push(event);
    else groups.push({ year: event.year, events: [event] });
  }
  return groups;
}
