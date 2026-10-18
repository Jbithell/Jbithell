import type { AstroGlobal } from "astro";
import { getEmDashCollection, getTaxonomyTerms } from "emdash";
import type { EventCardData } from "../components/EventCard";
import type { FilterLink } from "../components/FilterNav";
import {
  eventPath,
  eventRoles,
  eventYear,
  formatEventDate,
  isoEventDate,
  type EventEntry,
} from "./events";
import { cmsImage } from "./images";

type AstroLike = Pick<AstroGlobal, "url" | "locals">;

// Matches the grid in EventGrid: 1 column, 2 from the xs breakpoint and 3 from md, in a 1140px container
const CARD_SIZES = "(min-width: 75em) 360px, (min-width: 62em) 30vw, (min-width: 36em) 46vw, 92vw";
const CARD_WIDTHS = [320, 480, 640, 960];

export type Taxonomy = "discipline" | "role";

/** All published events, newest first, optionally filtered by a taxonomy term */
export async function getEvents(filter?: { taxonomy: Taxonomy; term: string }) {
  const { entries, error } = await getEmDashCollection("events", {
    orderBy: { date: "desc" },
    ...(filter ? { where: { [filter.taxonomy]: filter.term } } : {}),
  });
  if (error) throw error;
  return entries as EventEntry[];
}

export const getTerms = (taxonomy: Taxonomy) =>
  getTaxonomyTerms(taxonomy, { includeCounts: true });

export function toEventCards(astro: AstroLike, entries: EventEntry[]): Promise<EventCardData[]> {
  return Promise.all(
    entries.map(async (entry) => ({
      href: eventPath(entry),
      title: entry.data.title,
      dateLabel: formatEventDate(entry.data),
      dateTime: isoEventDate(entry.data.date, entry.data.date_precision),
      year: eventYear(entry.data),
      roles: eventRoles(entry.data).map((role) => role.label),
      venue: entry.data.venue,
      image: await cmsImage(astro, entry.data.featured_image, {
        widths: CARD_WIDTHS,
        sizes: CARD_SIZES,
      }),
    })),
  );
}

/** Links to filter the portfolio by discipline, busiest first */
export async function disciplineLinks(current?: string): Promise<FilterLink[]> {
  const terms = await getTerms("discipline");
  return [
    { href: "/portfolio", label: "All", current: !current },
    ...terms
      .filter((term) => (term.count ?? 0) > 0)
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || a.label.localeCompare(b.label))
      .map((term) => ({
        href: `/portfolio/discipline/${term.slug}`,
        label: term.label,
        count: term.count,
        current: term.slug === current,
      })),
  ];
}
