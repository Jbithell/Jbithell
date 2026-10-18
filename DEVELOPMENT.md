# jbithell.com

An [Astro](https://astro.build) site with the [EmDash](https://emdashcms.com) CMS, deployed to Cloudflare Workers with D1 (content) and R2 (media). The UI is built with [Mantine](https://mantine.dev), rendered to static HTML on the server, so public pages ship no React JavaScript.

## Editing content

Sign in at [jbithell.com/\_emdash/admin](https://jbithell.com/_emdash/admin) with your passkey.

- **Events** is the live events portfolio. Each event has a date (with a precision of day, month or year, so "March 2015" stays "March 2015"), an optional end date, venue, client, director, writer, featured image with credit, and a rich text description. Assign **Disciplines** (Sound, Lighting…) and **Roles** (Sound Designer…) from the sidebar of the editor; both get their own filtered portfolio pages.
- Saving keeps a draft; **Publish** makes it live. Published changes appear within seconds, because EmDash purges the edge cache.
- **Settings** holds the site title, tagline and social profiles (GitHub, LinkedIn, and Facebook for the Messenger link).
- Changing an event's slug automatically adds a redirect from the old URL. Other redirects can be managed under **Redirects**, which also logs 404s.

## URLs

| Page | URL |
| --- | --- |
| Home | `/` |
| Portfolio | `/portfolio` (was `/events`) |
| Event | `/portfolio/{slug}`, e.g. `/portfolio/guys-and-dolls-2015` (was `/events/march-2015-guys--dolls`) |
| Event as Markdown | `/portfolio/{slug}.md` |
| Filtered portfolio | `/portfolio/discipline/{slug}`, `/portfolio/role/{slug}` |
| Contact | `/contact` |
| Feeds and indexes | `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` |

The old `/events` URLs permanently redirect to the new ones. The mapping is in [src/legacy-event-slugs.json](src/legacy-event-slugs.json) and is applied in [astro.config.mjs](astro.config.mjs), which the Cloudflare adapter turns into `_redirects` rules served before the Worker runs.

## Development

Requires Node.js 22.16 or later.

```bash
npm install
npm run dev
```

The site runs at http://localhost:4321 with a local D1 database and R2 bucket in `.wrangler/state`. On a fresh database, open http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin to load the seed (including every event and its photo) and sign in as a development admin without a passkey.

- `npm run preview` builds the production Worker and serves it at http://localhost:8787, for checking performance with Lighthouse.
- `npm run typecheck` generates the Worker types and checks the TypeScript and Astro files.
- Passkeys only work on the production domain, so sign in locally with the dev bypass above, or put `EMDASH_SITE_URL=http://localhost:4321` in a `.dev.vars` file before running setup.
- `npm run images` regenerates the site's own images (profile photo, background, icons) from `./images`. Portfolio photos live in EmDash's media library instead.
- `emdash-env.d.ts` is regenerated from the content model whenever the dev server starts.

## Deploying

```bash
npm run deploy
```

The first deploy creates the `jbithellcom` D1 database and `jbithellcom-media` R2 bucket. Then open https://jbithell.com/_emdash/admin to run the setup wizard **on the production domain** (passkeys are tied to the domain they're created on):

1. Leave **Include sample content** ticked. This imports all 97 portfolio events from [seed/seed.json](seed/seed.json), downloading their photos from this repository's history into R2. It runs in batches, so let the wizard finish.
2. Enter your email and register a passkey.

Notes:

- `EMDASH_SITE_URL` in `wrangler.jsonc` pins sign-in to https://jbithell.com. Cloudflare's Git integration deploys a preview of every branch to a public `workers.dev` URL **using the production D1 database and R2 bucket**, and this stops anyone claiming the admin account through one. To give previews their own data instead, add a [`previews` block](https://docs.emdashcms.com/deployment/cloudflare/#worker-previews) with separate resources, or turn off non-production branch builds in the dashboard.

- EmDash's Worker is about 5 MB gzipped, so it needs the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/limits/#worker-size) (Workers Free allows 3 MB).
- `EMDASH_ENCRYPTION_KEY` only protects plugin secrets. Before adding a plugin that stores secrets, set it with `npx emdash secrets generate` and `npx wrangler secret put EMDASH_ENCRYPTION_KEY`, and keep a copy.
- Public pages are cached at the edge by the Workers Cache (`routeRules` in `astro.config.mjs`) and purged by EmDash on publish. Add a rule for any new public route.
- CMS images are resized by the Cloudflare Images binding (free for up to 5,000 unique transformations a month). The `image.remotePatterns` entry for `jbithell.com` in `astro.config.mjs` must match the production domain, or images are served at full size.

## Seed

[seed/seed.json](seed/seed.json) defines the content model (the `events` collection and the `discipline` and `role` taxonomies) and the initial content. EmDash only applies it to an empty database, so after the site is set up, change the model in the admin under **Content Types**, then export it with `npx emdash export-seed` so a fresh environment matches. See [Evolving a deployed site](https://docs.emdashcms.com/deployment/schema-evolution/).
