# jbithell.com

An [Astro](https://astro.build) site with the [EmDash](https://emdashcms.com) CMS, deployed to Cloudflare Workers with D1 (content) and R2 (media). The UI is built with [Mantine](https://mantine.dev), rendered to static HTML, so public pages ship no React JavaScript.

The public pages are prerendered from the production database by [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) and served as static assets, so visits never run the Worker. The Worker only runs the EmDash admin and its API, redirects and the 404 page. That keeps the site within Workers Free, which allows 10 ms of CPU time per request: rendering a page takes around 70 ms.

## Editing content

Sign in at [jbithell.com/\_emdash/admin](https://jbithell.com/_emdash/admin) with your passkey.

- **Events** is the Event Portfolio. Each event has a date (with a precision of day, month or year, so "March 2015" stays "March 2015"), an optional end date, venue, client, director, writer, featured image with credit, and a rich text description. Assign **Disciplines** (Sound, Lighting…) and **Roles** (Sound Designer…) from the sidebar of the editor; both get their own filtered portfolio pages.
- Saving keeps a draft; **Publish** makes it live. Publishing, unpublishing or deleting an entry rebuilds the site, which takes a minute or two (see [src/plugins/rebuild.ts](src/plugins/rebuild.ts)). Draft previews show the published page, as the public pages are static.
- **Settings** holds the site title, tagline and social profiles (GitHub, LinkedIn, and Facebook for the Messenger link). Changing them, or renaming a discipline or role, doesn't rebuild the site: use **Rebuild site** on the dashboard afterwards.
- Changing an event's slug automatically adds a redirect from the old URL. Other redirects can be managed under **Redirects**, which also logs 404s.

## URLs

| Page | URL |
| --- | --- |
| Home | `/` |
| Event Portfolio | `/portfolio` (was `/events`) |
| Event | `/portfolio/{slug}`, e.g. `/portfolio/guys-and-dolls-2015` (was `/events/march-2015-guys--dolls`) |
| Event as Markdown | `/portfolio/{slug}.md` |
| Filtered Event Portfolio | `/portfolio/discipline/{slug}`, `/portfolio/role/{slug}` |
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

- `npm run build` prerenders the site from the local database. Photos are linked from the local media library at full size, as only Workers Builds can download them from the public bucket to resize them.
- `npm run preview` builds the site and serves it at http://localhost:8787 as it's served in production, for checking performance with Lighthouse.
- `npm run typecheck` generates the Worker types and checks the TypeScript and Astro files.
- Passkeys only work on the production domain, so sign in locally with the dev bypass above, or put `EMDASH_SITE_URL=http://localhost:4321` in a `.dev.vars` file before running setup.
- `npm run images` regenerates the site's own images (profile photo, background, icons) from `./images`. Portfolio photos live in EmDash's media library instead.
- `emdash-env.d.ts` is regenerated from the content model whenever the dev server starts.

## Deploying

Workers Builds builds and deploys every push to `main`, and every publish in EmDash. To set it up, in the Cloudflare dashboard under **Workers & Pages > jbithellcom > Settings**:

1. Under **Builds**, connect this repository with the build command `npm run build` and the deploy command `npx wrangler deploy`.
2. Under **Builds > Variables and secrets**, add a `CLOUDFLARE_API_TOKEN` secret, so the build can read the production D1 database (`remote` in `wrangler.jsonc`). Create the token under **My Profile > API Tokens** from the **Edit Cloudflare Workers** template, adding **D1: Edit**. If the token or its permissions are wrong, the build fails rather than deploying an empty site.
3. Under **Builds > Deploy Hooks**, create a hook for `main`, then save its URL as a Worker secret, so publishing rebuilds the site:

   ```bash
   npx wrangler secret put DEPLOY_HOOK_URL
   ```

4. Under **R2 > jbithellcom-media > Settings**, add the custom domain `media.jbithell.com`. Workers Builds downloads photos from there to resize them, and the site links to the resized copies. If you use another domain, change `MEDIA_URL` in `astro.config.mjs`.
5. Under the jbithell.com zone's **Rules > Redirect Rules**, redirect www to the apex domain: create a rule from the **Redirect from WWW to root** template. Prerendered pages are served before the Worker runs, so `src/outer-middleware.ts` only redirects the rest.

`npm run deploy` builds and deploys from your machine instead, but from the local database, so don't use it for production.

The first deploy creates the `jbithellcom` D1 database and `jbithellcom-media` R2 bucket. The build needs content to prerender, so on a new environment deploy once with `npm run deploy`, then open https://jbithell.com/_emdash/admin to run the setup wizard **on the production domain** (passkeys are tied to the domain they're created on):

1. Leave **Include sample content** ticked. This imports all 97 portfolio events from [seed/seed.json](seed/seed.json), downloading their photos from this repository's history into R2. It runs in batches, so let the wizard finish.
2. Enter your email and register a passkey.

Notes:

- The Worker serves jbithell.com and www.jbithell.com as custom domains (`routes` in `wrangler.jsonc`), and www redirects to jbithell.com (the Redirect Rule above and `src/outer-middleware.ts`). The production `workers.dev` address is turned off. Preview URLs stay on for each version and branch, and use the production D1 database and R2 bucket, so publishing in a preview's admin changes the live site. `EMDASH_SITE_URL` pins sign-in to https://jbithell.com, so set up and edit content there.
- The Worker runs next to the D1 primary (`placement` in `wrangler.jsonc`), set to London (`aws:eu-west-2`) for a database in Western Europe. Check the database's location under **Storage & databases > D1** in the dashboard and change the region if it's elsewhere. Don't enable D1 read replicas alongside this.
- Pages the Worker renders, such as the 404 page and the admin, can exceed Workers Free's [10 ms CPU limit](https://developers.cloudflare.com/workers/platform/limits/#cpu-time) and fail with "Worker exceeded CPU time limit". Add any new public page as a prerendered page (`export const prerender = true`).
- `EMDASH_ENCRYPTION_KEY` only protects plugin secrets. Before adding a plugin that stores secrets, set it with `npx emdash secrets generate` and `npx wrangler secret put EMDASH_ENCRYPTION_KEY`, and keep a copy.
- Headers for the prerendered pages, such as the security headers, are set in `public/_headers`, as `src/middleware.ts` only runs for pages the Worker renders.
- Photos are resized with sharp while building (`imageService: "compile"` in `astro.config.mjs`). The Cloudflare Images binding only resizes images in the admin.

## Seed

[seed/seed.json](seed/seed.json) defines the content model (the `events` collection and the `discipline` and `role` taxonomies) and the initial content. EmDash only applies it to an empty database, so after the site is set up, change the model in the admin under **Content Types**, then export it with `npx emdash export-seed` so a fresh environment matches. See [Evolving a deployed site](https://docs.emdashcms.com/deployment/schema-evolution/).
