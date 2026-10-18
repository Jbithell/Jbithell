import { defineMiddleware } from "astro:middleware";

// Static assets get the same headers from public/_headers. Keep the two in sync
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  // 'self' rather than 'none' so the EmDash admin can preview pages in a frame
  "Content-Security-Policy":
    "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
  "X-Frame-Options": "SAMEORIGIN",
  "Strict-Transport-Security": "max-age=31536000",
  "Cross-Origin-Opener-Policy": "same-origin",
};

// Lets agents discover the machine-readable versions of the site without parsing HTML
const discoveryLinks = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</rss.xml>; rel="alternate"; type="application/rss+xml"',
].join(", ");

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  // Redirect responses can be immutable
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  if (!context.url.pathname.startsWith("/_emdash/")) {
    const existing = headers.get("Link");
    headers.set("Link", existing ? `${existing}, ${discoveryLinks}` : discoveryLinks);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
