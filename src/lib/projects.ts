import type { AstroGlobal } from "astro";
import { getEmDashCollection, type ContentEntry } from "emdash";
import type { Project } from "../../emdash-env";
import type { ProjectCardData } from "../components/ProjectCard";
import { cmsImage } from "./images";

type AstroLike = Pick<AstroGlobal, "url" | "locals">;

export type ProjectEntry = ContentEntry<Project>;

// Matches the grid in ProjectGrid: 1 column, 2 from the xs breakpoint and 3 from md, in a 1140px container
const CARD_SIZES = "(min-width: 75em) 360px, (min-width: 62em) 30vw, (min-width: 36em) 46vw, 92vw";
const CARD_WIDTHS = [320, 480, 640, 960];

/** All published projects, in the order set by their sort field */
export async function getProjects() {
  const { entries, error } = await getEmDashCollection("projects", {
    orderBy: { sort: "asc", title: "asc" },
  });
  if (error) throw error;
  return entries as ProjectEntry[];
}

export const projectPath = (entry: { id: string }) => `/projects/${entry.id}`;

export const projectYear = (project: Pick<Project, "started">) =>
  project.started
    ? new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric" }).format(
        new Date(project.started),
      )
    : undefined;

/** Language and archived status, for cards and the project page */
export function projectBadges(project: Project) {
  return [project.language, project.archived ? "Archived" : undefined].filter(
    (badge): badge is string => Boolean(badge),
  );
}

/** One-line summary, used for meta descriptions, feeds and llms.txt */
export function projectSummary(project: Project) {
  const year = projectYear(project);
  return [
    project.title,
    year && ` (${year})`,
    project.summary && `: ${project.summary}`,
    project.language && ` Written in ${project.language}.`,
  ]
    .filter(Boolean)
    .join("");
}

export function toProjectCards(
  astro: AstroLike,
  entries: ProjectEntry[],
): Promise<ProjectCardData[]> {
  return Promise.all(
    entries.map(async (entry) => ({
      href: projectPath(entry),
      title: entry.data.title,
      summary: entry.data.summary,
      year: projectYear(entry.data),
      badges: projectBadges(entry.data),
      image: await cmsImage(astro, entry.data.featured_image, {
        widths: CARD_WIDTHS,
        sizes: CARD_SIZES,
      }),
    })),
  );
}
