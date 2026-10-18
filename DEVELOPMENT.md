# jbithell.com

An [Astro](https://astro.build) site with the [EmDash](https://emdashcms.com) CMS, deployed to Cloudflare Workers with D1 (content) and R2 (media). The UI is built with [Mantine](https://mantine.dev), rendered to static HTML on the server, so public pages ship no React JavaScript.

## Editing content

Sign in at [jbithell.com/\_emdash/admin](https://jbithell.com/_emdash/admin) with your passkey.

- **Events** is the Event Portfolio. Each event has a date (with a precision of day, month or year, so "March 2015" stays "March 2015"), an optional end date, venue, client, director, writer, featured image with credit, and a rich text description. Assign **Disciplines** (Sound, Lighting…) and **Roles** (Sound Designer…) from the sidebar of the editor; both get their own filtered portfolio pages.
- **Projects** is the Projects Portfolio. Each project has a summary, rich text description, featured image, repository and website links, language, start date and an archived flag. Projects are listed by **Sort order**, lowest first (ties go alphabetically).
- **Experience** (jobs and volunteering, chosen with **Section**) and **Education** make up the CV. Each entry's **Visibility** decides where it appears: **Public** entries are on `/cv` and the private CV, **Private** entries only on the private CV. **Private details** are only ever shown on the private CV, as are education grades unless **Show grades publicly** is ticked. Experience can link **Related projects** from the Projects Portfolio. Unpublished entries appear nowhere.
- **CV Share Links** open the private CV at `/cv/private` for anyone without an EmDash account. Signed in, `/cv/private` lists every link with its URL, and offers a random key to paste into a new link's **Key** field. A link stops working when it expires, or when you unpublish or delete it.
- Saving keeps a draft; **Publish** makes it live. Published changes appear within seconds, because EmDash purges the edge cache.
- **Settings** holds the site title, tagline and social profiles (GitHub, LinkedIn, and Facebook for the Messenger link).
- Changing an event's slug automatically adds a redirect from the old URL. Other redirects can be managed under **Redirects**, which also logs 404s.

## URLs

| Page | URL |
| --- | --- |
| Home | `/` |
| Event Portfolio | `/portfolio` (was `/events`) |
| Event | `/portfolio/{slug}`, e.g. `/portfolio/guys-and-dolls-2015` (was `/events/march-2015-guys--dolls`) |
| Event as Markdown | `/portfolio/{slug}.md` |
| Filtered Event Portfolio | `/portfolio/discipline/{slug}`, `/portfolio/role/{slug}` |
| Projects Portfolio | `/projects` |
| Project | `/projects/{slug}` |
| CV | `/cv` (public entries only) |
| Private CV | `/cv/private`: for any signed-in EmDash user, or `/cv/private?key={key}` with a share link. Never cached or indexed, and has a print stylesheet for saving as PDF |
| Contact | `/contact` |
| Feeds and indexes | `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` |

The old `/events` URLs permanently redirect to the new ones. The mapping is in [src/legacy-event-slugs.json](src/legacy-event-slugs.json) and is applied in [astro.config.mjs](astro.config.mjs), which the Cloudflare adapter turns into `_redirects` rules served before the Worker runs.

## Development

Requires Node.js 22.16 or later.

```bash
npm install
npm run dev
```

The site runs at http://localhost:4321 with a local D1 database and R2 bucket in `.wrangler/state`. On a fresh database, open http://localhost:4321/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin to apply the seed's content model and sign in as a development admin without a passkey.

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

1. Enter your email and register a passkey. [seed/seed.json](seed/seed.json) only holds the content model, so the site starts empty.
2. To restore content, import a backup made with `npx emdash site export` using `npx emdash site import`.

Notes:

- The Worker serves jbithell.com and www.jbithell.com as custom domains (`routes` in `wrangler.jsonc`), and www redirects to jbithell.com (`src/outer-middleware.ts`). The production `workers.dev` address is turned off. Preview URLs stay on for each version and branch, and use the production D1 database and R2 bucket, so publishing in a preview's admin changes the live site. `EMDASH_SITE_URL` pins sign-in to https://jbithell.com, so set up and edit content there.
- The Worker runs next to the D1 primary (`placement` in `wrangler.jsonc`), set to London (`aws:eu-west-2`) for a database in Western Europe. Check the database's location under **Storage & databases > D1** in the dashboard and change the region if it's elsewhere. Don't enable D1 read replicas alongside this.

- The site needs the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/limits/#cpu-time). Workers Free allows 10 ms of CPU time per request, but rendering a page takes around 70 ms (and several hundred ms on a new isolate), so pages that miss the edge cache, usually the home page, fail with "Worker exceeded CPU time limit". Workers Paid allows 30 seconds.
- `EMDASH_ENCRYPTION_KEY` only protects plugin secrets. Before adding a plugin that stores secrets, set it with `npx emdash secrets generate` and `npx wrangler secret put EMDASH_ENCRYPTION_KEY`, and keep a copy.
- Public pages are cached at the edge by the Workers Cache (`routeRules` in `astro.config.mjs`), so most visits never run the Worker or query D1, and EmDash purges them on publish. Add a rule for any new public route. EmDash's optional KV object cache isn't enabled: cache misses that refill the edge cache bypass it by design, so it would mainly speed up signed-in editing.
- CMS images are resized by the Cloudflare Images binding (free for up to 5,000 unique transformations a month). The `image.remotePatterns` entry for `jbithell.com` in `astro.config.mjs` must match the production domain, or images are served at full size.

## Seed

[seed/seed.json](seed/seed.json) defines the content model (the `events` collection and the `discipline` and `role` taxonomies), without any content. EmDash only applies it to an empty database, so after the site is set up, change the model in the admin under **Content Types**, then export it with `npx emdash export-seed` so a fresh environment matches. See [Evolving a deployed site](https://docs.emdashcms.com/deployment/schema-evolution/).

When the seed gains a collection, field or relation that the deployed site doesn't have yet, add it with [apply-schema.ts](apply-schema.ts) rather than by hand. It only adds what's missing, never changes or deletes anything, and running it again does nothing. Create an API token with the **admin** scope under **Settings > API Tokens**, then run:

```bash
EMDASH_TOKEN=ec_pat_... npm run schema -- --dry-run
EMDASH_TOKEN=ec_pat_... npm run schema
```

Delete the token afterwards. Pass `--url` to target another site, such as `--url http://localhost:4321`.
