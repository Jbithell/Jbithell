import { defineMiddleware } from "astro:middleware";
import { securityHeaders } from "./lib/headers";

// Lets agents discover the machine-readable versions of the site without parsing HTML
const discoveryLinks = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
].join(", ");

export const onRequest = defineMiddleware(async (context, next) =>
  withHeaders(await next(), context.url.pathname),
);

// The private CV can be opened with a share link's key in the URL
const isPrivate = (pathname: string) => pathname.replace(/\/$/, "") === "/cv/private";

function withHeaders(response: Response, pathname: string) {
  // Redirect responses can be immutable
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  if (isPrivate(pathname)) {
    headers.set("Cache-Control", "private, no-store");
    headers.set("X-Robots-Tag", "noindex, nofollow");
    // Keeps the key out of the Referer header when following a link off the page
    headers.set("Referrer-Policy", "no-referrer");
  }
  if (!pathname.startsWith("/_emdash/")) {
    const existing = headers.get("Link");
    headers.set("Link", existing ? `${existing}, ${discoveryLinks}` : discoveryLinks);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
