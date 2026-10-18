import type { AstroGlobal } from "astro";
import {
  getEmDashCollection,
  getEmDashReferences,
  type ContentEntry,
  type PortableTextBlock,
} from "emdash";
import type { CvShareLink, Education, Experience, Project } from "../../emdash-env";
import type { CvItemData } from "../components/CvItem";
import { cmsImage } from "./images";
import { projectPath } from "./projects";

type AstroLike = Pick<AstroGlobal, "url" | "locals" | "cache">;

/** Who the CV is rendered for: everyone at /cv, or a signed-in editor or share link at /cv/private */
export type CvAudience = "public" | "private";

export type CvShareLinkEntry = ContentEntry<CvShareLink>;

/** A CV entry with its rich text, which is rendered by Astro rather than the React card */
export interface CvItem {
  card: CvItemData;
  description?: PortableTextBlock[];
  privateDetails?: PortableTextBlock[];
}

const TIME_ZONE = "Europe/London";
const LOCALE = "en-GB";
const KEY_PATTERN = /^[A-Za-z0-9_-]{24,128}$/;

const hasText = (blocks?: PortableTextBlock[]) => (blocks?.length ?? 0) > 0;

const formatDate = (iso: string, precision: "month" | "year") =>
  new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    year: "numeric",
    ...(precision === "month" ? { month: "long" } : {}),
  }).format(new Date(iso));

/** e.g. "March 2019 – Present", "2015 – 2018" or "2021" */
export function formatCvDates(entry: {
  start_date: string;
  end_date?: string;
  date_precision?: "month" | "year";
}) {
  const precision = entry.date_precision ?? "month";
  const start = formatDate(entry.start_date, precision);
  const end = entry.end_date ? formatDate(entry.end_date, precision) : "Present";
  return start === end ? start : `${start} – ${end}`;
}

/** How a share link is presented in the editor's list on /cv/private */
export const shareLinkUrl = (origin: string, key: string) =>
  `${origin}/cv/private?key=${encodeURIComponent(key)}`;

export const isExpired = (link: CvShareLink, now = new Date()) =>
  Boolean(link.expires && new Date(link.expires) <= now);

/** A random key for a new share link, offered to the editor on /cv/private */
export function generateShareKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Whether this request may see the private CV: any signed-in EmDash user, or a visitor with the
 * key of a published, unexpired share link
 */
export async function getCvAccess(
  astro: AstroLike,
): Promise<{ kind: "editor" } | { kind: "link"; link: CvShareLinkEntry } | null> {
  if (astro.locals.user) return { kind: "editor" };
  const key = astro.url.searchParams.get("key");
  if (!key || !KEY_PATTERN.test(key)) return null;
  const { entries, error } = await getEmDashCollection("cv_share_links", {
    where: { key },
    limit: 1,
  });
  if (error) throw error;
  const link = entries[0] as CvShareLinkEntry | undefined;
  if (!link || link.data.key !== key || isExpired(link.data)) return null;
  return { kind: "link", link };
}

export async function getShareLinks() {
  const { entries, error } = await getEmDashCollection("cv_share_links", {
    orderBy: { created_at: "desc" },
  });
  if (error) throw error;
  return entries as CvShareLinkEntry[];
}

const LOGO = { widths: [56, 112], sizes: "56px" };

/**
 * The CV's experience, volunteering and education, newest first. The public audience only gets
 * entries marked public, and only it sets cache hints, so the private CV is never cached
 */
export async function getCv(astro: AstroLike, audience: CvAudience) {
  const where = audience === "public" ? { where: { visibility: "public" } } : {};
  const [experience, education] = await Promise.all([
    getEmDashCollection("experience", { orderBy: { start_date: "desc" }, ...where }),
    getEmDashCollection("education", { orderBy: { start_date: "desc" }, ...where }),
  ]);
  if (experience.error) throw experience.error;
  if (education.error) throw education.error;
  const cache = (hint?: { tags?: string[]; lastModified?: Date }) => {
    if (audience === "public" && hint && astro.cache?.enabled) astro.cache.set(hint);
  };
  cache(experience.cacheHint);
  cache(education.cacheHint);

  const showPrivate = audience === "private";
  const roles = await Promise.all(
    (experience.entries as ContentEntry<Experience>[]).map(async ({ data }) => {
      const projects = await getEmDashReferences<Project>("experience", data.id, "projects");
      if (projects.error) throw projects.error;
      cache(projects.cacheHint);
      const item: CvItem = {
        card: {
          id: data.id,
          title: data.title,
          organisation: data.organisation,
          organisationUrl: data.organisation_url,
          logo: await cmsImage(astro, data.logo, LOGO),
          meta: [data.employment_type, data.location].filter((m): m is string => Boolean(m)),
          dates: formatCvDates(data),
          private: showPrivate && data.visibility === "private",
          projects: projects.entries.map((project) => ({
            title: project.data.title,
            href: projectPath(project),
          })),
          kind: data.section === "volunteering" ? "volunteering" : "work",
          hasDescription: hasText(data.description),
          hasPrivateDetails: showPrivate && hasText(data.private_details),
        },
        description: data.description,
        privateDetails: showPrivate ? data.private_details : undefined,
      };
      return { section: data.section, item };
    }),
  );

  const qualifications = await Promise.all(
    (education.entries as ContentEntry<Education>[]).map(async ({ data }) => {
      const showGrades = showPrivate || Boolean(data.public_grades);
      const item: CvItem = {
        card: {
          id: data.id,
          title: [data.qualification, data.field_of_study].filter(Boolean).join(", ") ||
            data.institution,
          organisation: data.institution,
          organisationUrl: data.institution_url,
          logo: await cmsImage(astro, data.logo, LOGO),
          meta: data.location ? [data.location] : [],
          dates: formatCvDates(data),
          private: showPrivate && data.visibility === "private",
          results: (data.results ?? []).map((result) => ({
            subject: result.subject,
            grade: showGrades ? (result.grade ?? undefined) : undefined,
          })),
          projects: [],
          kind: "education",
          hasDescription: hasText(data.description),
          hasPrivateDetails: showPrivate && hasText(data.private_details),
        },
        description: data.description,
        privateDetails: showPrivate ? data.private_details : undefined,
      };
      return item;
    }),
  );

  return {
    work: roles.filter((role) => role.section !== "volunteering").map((role) => role.item),
    volunteering: roles.filter((role) => role.section === "volunteering").map((role) => role.item),
    education: qualifications,
  };
}

/** One line per CV entry, for meta descriptions and llms.txt */
export const cvItemSummary = ({ card }: CvItem) =>
  `${card.title}, ${card.organisation} (${card.dates})`;
