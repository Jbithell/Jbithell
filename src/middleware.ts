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

function withHeaders(response: Response, pathname: string) {
  // Redirect responses can be immutable
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
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
