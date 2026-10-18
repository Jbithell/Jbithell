/**
 * Adds the collections, fields and relations in seed/seed.json that a deployed site doesn't have yet.
 * EmDash only applies the seed to an empty database, so new content types need this (or the admin).
 * It never changes or deletes anything that exists.
 *
 *   EMDASH_TOKEN=ec_pat_... node apply-schema.ts [--url https://jbithell.com] [--dry-run]
 *
 * Create the token in the admin under Settings > API Tokens with the admin scope (relations need it),
 * and delete it afterwards.
 */
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";

interface SeedField {
  slug: string;
  type: string;
  [key: string]: unknown;
}
interface SeedCollection {
  slug: string;
  titleField?: string;
  dateField?: string;
  fields: SeedField[];
  [key: string]: unknown;
}
interface Seed {
  collections: SeedCollection[];
  relations?: { slug: string; [key: string]: unknown }[];
}

const { values } = parseArgs({
  options: {
    url: { type: "string", default: "https://jbithell.com" },
    "dry-run": { type: "boolean", default: false },
  },
});
const token = process.env.EMDASH_TOKEN;
if (!token) {
  console.error("Set EMDASH_TOKEN to an API token with the admin scope");
  process.exit(1);
}
const dryRun = values["dry-run"];
const api = new URL("/_emdash/api/", values.url);

async function request(method: string, path: string, body?: unknown) {
  const response = await fetch(new URL(path, api), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await response.json().catch(() => ({}))) as { data?: any; error?: any };
  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(json.error ?? json)}`);
  }
  return json.data;
}

async function change(description: string, method: string, path: string, body: unknown) {
  console.log(`${dryRun ? "Would add" : "Adding"} ${description}`);
  if (!dryRun) await request(method, path, body);
}

const seed = JSON.parse(await readFile(new URL("seed/seed.json", import.meta.url), "utf8")) as Seed;

const existingCollections = new Map<string, Set<string>>();
for (const { slug } of (await request("GET", "schema/collections")).items) {
  const collection = await request("GET", `schema/collections/${slug}?includeFields=true`);
  existingCollections.set(
    slug,
    new Set((collection.item.fields ?? []).map((field: { slug: string }) => field.slug)),
  );
}
const existingRelations = new Set<string>(
  (await request("GET", "relations")).relations.map((relation: { slug: string }) => relation.slug),
);

// Collections first, then the relations between them, then fields (reference fields bind to relations)
for (const { fields, titleField, dateField, ...collection } of seed.collections) {
  if (existingCollections.has(collection.slug)) continue;
  await change(`collection ${collection.slug}`, "POST", "schema/collections", collection);
  existingCollections.set(collection.slug, new Set());
}

for (const relation of seed.relations ?? []) {
  if (existingRelations.has(relation.slug)) continue;
  await change(`relation ${relation.slug}`, "POST", "relations", relation);
}

for (const { slug, fields, titleField, dateField } of seed.collections) {
  const existing = existingCollections.get(slug)!;
  const added = fields.filter((field) => !existing.has(field.slug));
  for (const field of added) {
    await change(`field ${slug}.${field.slug}`, "POST", `schema/collections/${slug}/fields`, {
      validation: null,
      ...field,
    });
  }
  // Only set for collections created above, so changes made in the admin are kept
  if (existing.size === 0 && (titleField || dateField)) {
    await change(`title and date fields for ${slug}`, "PUT", `schema/collections/${slug}`, {
      titleField,
      dateField,
    });
  }
}

console.log(dryRun ? "Dry run complete" : "Schema is up to date");
