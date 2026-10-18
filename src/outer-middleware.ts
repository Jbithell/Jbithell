import { defineMiddleware } from "astro:middleware";
import { securityHeaders } from "./lib/headers";

// The site's own domain, from `site` in astro.config.mjs
const site = new URL(import.meta.env.SITE);

/**
 * Runs before EmDash (see `middleware.outer` in astro.config.mjs), so www requests are redirected,
 * admin pages included, without starting EmDash or querying the database. Prerendered pages are
 * served without running the Worker, so a Redirect Rule redirects those (see DEVELOPMENT.md)
 */
export const onRequest = defineMiddleware((context, next) => {
  if (context.url.host !== `www.${site.host}`) return next();
  return new Response(null, {
    status: 301,
    headers: {
      ...securityHeaders,
      Location: new URL(context.url.pathname + context.url.search, site).href,
    },
  });
});
