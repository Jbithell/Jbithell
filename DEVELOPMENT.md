<!--alex disable hook hooks-->

# jbithell.com

An [Astro](https://astro.build) site with the [EmDash](https://emdashcms.com) CMS, deployed to Cloudflare Workers with D1 (content) and R2 (media). The UI is built with [Mantine](https://mantine.dev), rendered to static HTML, so public pages ship no React JavaScript.

The public pages are prerendered from the production database by [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) and served as static assets, so visits never run the Worker. The Worker only runs the EmDash admin and its API, the private CV, redirects and the 404 page. That keeps the site within Workers Free, which allows 10 ms of CPU time per request: rendering a page takes around 70 ms.

## Editing content

Sign in at [jbithell.com/\_emdash/admin](https://jbithell.com/_emdash/admin) with your passkey.

- **Events** is the Event Portfolio. Each event has a date (with a precision of day, month or year, so "March 2015" stays "March 2015"), an optional end date, venue, client, director, writer, featured image with credit, and a rich text description. Assign **Disciplines** (Sound, Lighting…) and **Roles** (Sound Designer…) from the sidebar of the editor; both get their own filtered portfolio pages.
- **Projects** is the Projects Portfolio. Each project has a summary, rich text description, featured image, repository and website links, language, start date and an archived flag. Projects are listed by **Sort order**, lowest first (ties go alphabetically).
- **Experience** (jobs and volunteering, chosen with **Section**) and **Education** make up the CV. Each entry's **Visibility** decides where it appears: **Public** entries are on `/cv` and the private CV, **Private** entries only on the private CV. **Private details** are only ever shown on the private CV, as are education grades unless **Show grades publicly** is ticked. Experience can link **Related projects** from the Projects Portfolio. Unpublished entries appear nowhere.
- **CV Share Links** open the private CV at `/cv/private` for anyone without an EmDash account. Signed in, `/cv/private` lists every link with its URL, and offers a random key to paste into a new link's **Key** field. A link stops working when it expires, or when you unpublish or delete it.
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

- `npm run build` prerenders the site from the local database, so load the seed with the dev bypass above first. Photos are linked from the local media library at full size, as only Workers Builds can download them from the public bucket to resize them.
- `npm run preview` builds the site and serves it at http://localhost:8787 as it's served in production, for checking performance with Lighthouse.
- `npm run typecheck` generates the Worker types and checks the TypeScript and Astro files.
- Passkeys only work on the production domain, so sign in locally with the dev bypass above, or put `EMDASH_SITE_URL=http://localhost:4321` in a `.dev.vars` file before running setup.
- `npm run images` regenerates the site's own images (profile photo, background, icons) from `./images`. Portfolio photos live in EmDash's media library instead.
- `emdash-env.d.ts` is regenerated from the content model whenever the dev server starts.

## Deploying

Workers Builds builds and deploys every push to `main`, and every publish in EmDash. To set it up, in the Cloudflare dashboard under **Workers & Pages > jbithellcom > Settings**:

1. Under **Builds**, connect this repository with the build command `npm run build` and the deploy command `npx wrangler deploy`.
2. Under **Builds > Variables and secrets**, add a `CLOUDFLARE_API_TOKEN` secret, so the build can read the production D1 database (`remote` in `wrangler.jsonc`). Create a custom token under **My Profile > API Tokens** for this account only, with permission to edit Workers and read D1 (wrangler connects by uploading a temporary preview Worker with the database bound). The account and database IDs are in `wrangler.jsonc`, so it needs nothing else. If the token or its permissions are wrong, the build fails rather than deploying an empty site.
3. Under **Builds > Deploy Hooks**, create a hook for `main`, then save its URL as a Worker secret, so publishing rebuilds the site:

   ```bash
   npx wrangler secret put DEPLOY_HOOK_URL
   ```

4. Under **R2 > jbithellcom-media > Settings**, add the custom domain `media.jbithell.com`. Workers Builds downloads photos from there to resize them, and the site links to the resized copies. If you use another domain, change `MEDIA_URL` in `astro.config.mjs`.
5. Under the jbithell.com zone's **Rules > Redirect Rules**, redirect www to the apex domain: create a rule from the **Redirect from WWW to root** template. Prerendered pages are served before the Worker runs, so `src/outer-middleware.ts` only redirects the rest.

`npm run deploy` builds and deploys from your machine instead, but from the local database, so don't use it for production.

The first deploy creates the `jbithellcom` D1 database and `jbithellcom-media` R2 bucket. The build needs content to prerender, so on a new environment deploy once with `npm run deploy`, then open https://jbithell.com/_emdash/admin to run the setup wizard **on the production domain** (passkeys are tied to the domain they're created on):

1. Enter your email and register a passkey. [seed/seed.json](seed/seed.json) only holds the content model, so the site starts empty.
2. To restore content, import a backup made with `npx emdash site export` using `npx emdash site import`.

Notes:

- The Worker serves jbithell.com and www.jbithell.com as custom domains (`routes` in `wrangler.jsonc`), and www redirects to jbithell.com (the Redirect Rule above and `src/outer-middleware.ts`). The production `workers.dev` address is turned off. Preview URLs stay on for each version and branch, and use the production D1 database and R2 bucket, so publishing in a preview's admin changes the live site. `EMDASH_SITE_URL` pins sign-in to https://jbithell.com, so set up and edit content there.
- The Worker runs next to the D1 primary (`placement` in `wrangler.jsonc`), set to London (`aws:eu-west-2`) for a database in Western Europe. Check the database's location under **Storage & databases > D1** in the dashboard and change the region if it's elsewhere. Don't enable D1 read replicas alongside this.
- Pages the Worker renders, such as the 404 page and the admin, can exceed Workers Free's [10 ms CPU limit](https://developers.cloudflare.com/workers/platform/limits/#cpu-time) and fail with "Worker exceeded CPU time limit". Add any new public page as a prerendered page (`export const prerender = true`).
- `EMDASH_ENCRYPTION_KEY` only protects plugin secrets. Before adding a plugin that stores secrets, set it with `npx emdash secrets generate` and `npx wrangler secret put EMDASH_ENCRYPTION_KEY`, and keep a copy.
- Headers for the prerendered pages, such as the security headers, are set in `public/_headers`, as `src/middleware.ts` only runs for pages the Worker renders.
- Photos are resized with sharp while building (`imageService: "compile"` in `astro.config.mjs`). The Cloudflare Images binding only resizes images in the admin.

## Seed

[seed/seed.json](seed/seed.json) defines the content model (the `events` collection and the `discipline` and `role` taxonomies), without any content. EmDash only applies it to an empty database, so after the site is set up, change the model in the admin under **Content Types**, then export it with `npx emdash export-seed` so a fresh environment matches. See [Evolving a deployed site](https://docs.emdashcms.com/deployment/schema-evolution/).

When the seed gains a collection, field or relation that the deployed site doesn't have yet, add it with [apply-schema.ts](apply-schema.ts) rather than by hand. It only adds what's missing, never changes or deletes anything, and running it again does nothing. Create an API token with the **admin** scope under **Settings > API Tokens**, then run:

```bash
EMDASH_TOKEN=ec_pat_... npm run schema -- --dry-run
EMDASH_TOKEN=ec_pat_... npm run schema
```

Delete the token afterwards. Pass `--url` to target another site, such as `--url http://localhost:4321`.
